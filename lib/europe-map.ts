import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldRaw from "world-atlas/countries-10m.json";

import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";

const VIEW_W = 980;
const VIEW_H = 680;

const REGION_ISO = new Set([
  "040", // Austria
  "056", // Belgium
  "250", // France
  "276", // Germany
  "380", // Italy
  "438", // Liechtenstein
  "442", // Luxembourg
  "492", // Monaco
  "528", // Netherlands
  "756", // Switzerland
]);

type CountryProps = { name: string };

const world = worldRaw as unknown as Topology<{ countries: GeometryCollection<CountryProps> }>;
const allCountries = feature(world, world.objects.countries) as FeatureCollection<Geometry, CountryProps>;
const regionFeatures = allCountries.features.filter((f) => REGION_ISO.has(String(f.id).padStart(3, "0")));
const regionFC: FeatureCollection<Geometry, CountryProps> = {
  type: "FeatureCollection",
  features: regionFeatures,
};

const projection = geoMercator().fitExtent(
  [
    [28, 24],
    [VIEW_W - 28, VIEW_H - 24],
  ],
  regionFC,
);

const pathGen = geoPath(projection);

export type CountryPath = {
  id: string;
  name: string;
  d: string;
  isLU: boolean;
};

export type MapPointKey =
  | "luxembourg"
  | "metz"
  | "nancy"
  | "strasbourg"
  | "baden"
  | "blackforest"
  | "freiburg"
  | "basel"
  | "geneva"
  | "lyon"
  | "nice"
  | "monaco"
  | "brussels"
  | "liege"
  | "trier"
  | "koblenz";

type PointRaw = { name: string; short?: string; lon: number; lat: number; event?: boolean };

const POINTS_RAW: Record<MapPointKey, PointRaw> = {
  luxembourg: { name: "Luxembourg", short: "LU", lon: 6.13, lat: 49.61, event: true },
  metz: { name: "Metz", lon: 6.18, lat: 49.12 },
  nancy: { name: "Nancy", lon: 6.18, lat: 48.69 },
  strasbourg: { name: "Strasbourg", short: "Strasbourg", lon: 7.75, lat: 48.58 },
  baden: { name: "Baden-Baden", short: "Baden", lon: 8.24, lat: 48.76 },
  blackforest: { name: "Forêt-Noire", short: "Black Forest", lon: 8.2, lat: 48.25, event: true },
  freiburg: { name: "Freiburg", lon: 7.85, lat: 47.99 },
  basel: { name: "Basel", lon: 7.59, lat: 47.56 },
  geneva: { name: "Geneve", lon: 6.14, lat: 46.2 },
  lyon: { name: "Lyon", lon: 4.84, lat: 45.76 },
  nice: { name: "Nice", lon: 7.26, lat: 43.71 },
  monaco: { name: "Monaco", short: "Monaco", lon: 7.42, lat: 43.74, event: true },
  brussels: { name: "Bruxelles", short: "BRU", lon: 4.35, lat: 50.85 },
  liege: { name: "Liege", lon: 5.57, lat: 50.63 },
  trier: { name: "Trier", lon: 6.64, lat: 49.75 },
  koblenz: { name: "Koblenz", lon: 7.59, lat: 50.36 },
};

export type City = {
  key: MapPointKey;
  name: string;
  short: string;
  x: number;
  y: number;
  event: boolean;
};

export type EventSpec = {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: string;
  href: string;
  d: string;
  waypoints: [number, number][];
  focus: { x: number; y: number; scale: number };
  target: MapPointKey;
};

export type RoadLine = {
  id: string;
  d: string;
  kind: "primary" | "secondary";
};

function project([lon, lat]: [number, number]): [number, number] {
  const p = projection([lon, lat]);
  return p ? [p[0], p[1]] : [0, 0];
}

function curveBetween(a: [number, number], b: [number, number], curvature = 0.13): string {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const ox = -dy * curvature;
  const oy = dx * curvature;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${(mx + ox).toFixed(2)} ${(my + oy).toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function chainPath(points: [number, number][], curvature = 0.13): string {
  if (points.length < 2) return "";
  let d = "";
  for (let i = 0; i < points.length - 1; i += 1) {
    const seg = curveBetween(points[i], points[i + 1], curvature);
    d += i === 0 ? seg : seg.replace(/^M[^Q]+Q/, " Q");
  }
  return d;
}

function focusFromPoints(points: [number, number][]) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(maxX - minX, 42);
  const height = Math.max(maxY - minY, 42);
  const scale = Math.min(3.7, Math.max(1.86, 660 / Math.max(width, height)));

  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    scale,
  };
}

const EVENT_DEFS: {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: string;
  href: string;
  target: MapPointKey;
  points: MapPointKey[];
  curvature?: number;
}[] = [
  {
    id: "cote-azur-monaco",
    name: "Cote d'Azur Drive",
    date: "9-10 mai 2026",
    location: "Monaco / Côte d'Azur",
    distance: "930 km depuis LU",
    href: "https://forms.gle/W4Yh5tvd1iZKUo4x8",
    target: "monaco",
    points: ["luxembourg", "nancy", "lyon", "nice", "monaco"],
    curvature: 0.08,
  },
  {
    id: "black-forest-drive",
    name: "Black Forest Drive",
    date: "23-24 mai 2026",
    location: "Forêt-Noire / Allemagne",
    distance: "300 km depuis LU",
    href: "https://forms.gle/SSAU4aQJzhcZiQs16",
    target: "blackforest",
    points: ["luxembourg", "strasbourg", "baden", "blackforest", "freiburg"],
    curvature: 0.12,
  },
  {
    id: "golf-drive-luxembourg",
    name: "Golf Drive Luxembourg",
    date: "28 juin 2026",
    location: "Luxembourg",
    distance: "local",
    href: "https://forms.gle/opzjiLybZ7DbP4Fs9",
    target: "luxembourg",
    points: ["luxembourg", "trier", "luxembourg"],
    curvature: 0.22,
  },
  {
    id: "letz-meet-2026",
    name: "LET'Z MEET",
    date: "2026 - date a confirmer",
    location: "Luxembourg",
    distance: "local",
    href: "https://forms.gle/M6waMjjMgu8jT7Df9",
    target: "luxembourg",
    points: ["luxembourg", "metz", "luxembourg"],
    curvature: -0.18,
  },
];

const ROAD_DEFS: { id: string; kind: RoadLine["kind"]; points: MapPointKey[] }[] = [
  { id: "a3-a31", kind: "primary", points: ["luxembourg", "metz", "nancy", "lyon", "nice", "monaco"] },
  { id: "a4-a35", kind: "primary", points: ["luxembourg", "metz", "strasbourg", "baden", "blackforest", "freiburg", "basel"] },
  { id: "belgium-link", kind: "secondary", points: ["luxembourg", "liege", "brussels"] },
  { id: "moselle-rhine", kind: "secondary", points: ["luxembourg", "trier", "koblenz"] },
  { id: "alpine-link", kind: "secondary", points: ["basel", "geneva", "lyon"] },
];

export type EuropeMapData = {
  viewBox: { w: number; h: number };
  countries: CountryPath[];
  cities: City[];
  events: EventSpec[];
  roads: RoadLine[];
  origin: City;
};

export function getEuropeMapData(): EuropeMapData {
  const countries: CountryPath[] = regionFeatures.map((f) => ({
    id: String(f.id),
    name: f.properties.name,
    d: pathGen(f) || "",
    isLU: f.properties.name === "Luxembourg",
  }));

  const cities: City[] = (Object.keys(POINTS_RAW) as MapPointKey[]).map((key) => {
    const raw = POINTS_RAW[key];
    const [x, y] = project([raw.lon, raw.lat]);
    return { key, name: raw.name, short: raw.short ?? raw.name, x, y, event: Boolean(raw.event) };
  });

  const events: EventSpec[] = EVENT_DEFS.map((event) => {
    const pts = event.points.map((key) => project([POINTS_RAW[key].lon, POINTS_RAW[key].lat]));
    return {
      id: event.id,
      name: event.name,
      date: event.date,
      location: event.location,
      distance: event.distance,
      href: event.href,
      target: event.target,
      waypoints: pts,
      d: chainPath(pts, event.curvature ?? 0.12),
      focus: focusFromPoints(pts),
    };
  });

  const roads: RoadLine[] = ROAD_DEFS.map((road) => ({
    id: road.id,
    kind: road.kind,
    d: chainPath(
      road.points.map((key) => project([POINTS_RAW[key].lon, POINTS_RAW[key].lat])),
      road.kind === "primary" ? 0.03 : 0.08,
    ),
  }));

  const origin = cities.find((c) => c.key === "luxembourg")!;

  return {
    viewBox: { w: VIEW_W, h: VIEW_H },
    countries,
    cities,
    events,
    roads,
    origin,
  };
}
