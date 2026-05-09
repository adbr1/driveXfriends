import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import worldRaw from "world-atlas/countries-110m.json";

import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";

const VIEW_W = 800;
const VIEW_H = 600;

// ISO 3166-1 numeric codes for European territory shown on the map.
// Russia (643) intentionally omitted to keep the projection focused on Western/Central Europe.
const EUROPE_ISO = new Set([
  "008", "020", "040", "056", "070", "100", "112", "191", "196", "203",
  "208", "233", "246", "250", "268", "276", "292", "300", "348", "352",
  "372", "380", "428", "438", "440", "442", "470", "492", "498", "499",
  "528", "578", "616", "620", "642", "688", "703", "705", "724", "752",
  "756", "792", "804", "807", "826",
]);

type CountryProps = { name: string };

const world = worldRaw as unknown as Topology<{ countries: GeometryCollection<CountryProps> }>;
const allCountries = feature(world, world.objects.countries) as FeatureCollection<Geometry, CountryProps>;

const europeFeatures = allCountries.features.filter((f) => EUROPE_ISO.has(String(f.id).padStart(3, "0")));
const europeFC: FeatureCollection<Geometry, CountryProps> = {
  type: "FeatureCollection",
  features: europeFeatures,
};

const projection = geoMercator().fitExtent(
  [
    [12, 12],
    [VIEW_W - 12, VIEW_H - 12],
  ],
  europeFC,
);

const pathGen = geoPath(projection);

export type CountryPath = {
  id: string;
  name: string;
  d: string;
  isLU: boolean;
};

export type CityKey =
  | "luxembourg"
  | "spa"
  | "nurburg"
  | "reims"
  | "trier"
  | "maastricht"
  | "strasbourg"
  | "dijon"
  | "geneva"
  | "como";

type CityRaw = { name: string; short?: string; lon: number; lat: number };

const CITY_RAW: Record<CityKey, CityRaw> = {
  luxembourg: { name: "Luxembourg", short: "LU", lon: 6.13, lat: 49.61 },
  spa:        { name: "Spa-Francorchamps", short: "Spa", lon: 5.97, lat: 50.44 },
  nurburg:    { name: "Nürburgring", short: "Nbg", lon: 6.94, lat: 50.33 },
  reims:      { name: "Reims", short: "Reims", lon: 4.03, lat: 49.26 },
  trier:      { name: "Trier", short: "Trier", lon: 6.64, lat: 49.75 },
  maastricht: { name: "Maastricht", short: "Mst", lon: 5.69, lat: 50.85 },
  strasbourg: { name: "Strasbourg", short: "Stb", lon: 7.74, lat: 48.58 },
  dijon:      { name: "Dijon", short: "Dij", lon: 5.04, lat: 47.32 },
  geneva:     { name: "Genève", short: "Gva", lon: 6.14, lat: 46.20 },
  como:       { name: "Lac de Côme", short: "Como", lon: 9.25, lat: 45.98 },
};

export type City = {
  key: CityKey;
  name: string;
  short: string;
  x: number;
  y: number;
};

function project([lon, lat]: [number, number]): [number, number] {
  const p = projection([lon, lat]);
  return p ? [p[0], p[1]] : [0, 0];
}

function curveBetween(a: [number, number], b: [number, number], curvature = 0.18): string {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Perpendicular offset for a soft arc
  const dx = x2 - x1;
  const dy = y2 - y1;
  const ox = -dy * curvature;
  const oy = dx * curvature;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${(mx + ox).toFixed(2)} ${(my + oy).toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function chainPath(points: [number, number][], curvature = 0.18): string {
  if (points.length < 2) return "";
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const seg = curveBetween(points[i], points[i + 1], curvature);
    d += i === 0 ? seg : seg.replace(/^M[^Q]+Q/, "Q");
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
  const width = Math.max(maxX - minX, 48);
  const height = Math.max(maxY - minY, 48);
  const scale = Math.min(2.75, Math.max(1.35, 420 / Math.max(width, height)));

  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    scale,
  };
}

export type RouteSpec = {
  id: string;
  name: string;
  length: string;
  elev: string;
  d: string;
  start: [number, number];
  end: [number, number];
  focus: { x: number; y: number; scale: number };
};

const ROUTE_DEFS: { id: string; name: string; length: string; elev: string; cities: CityKey[]; curvature?: number }[] = [
  { id: "ardennes",     name: "Ardennes Loop",       length: "172 km", elev: "+1 880 m", cities: ["luxembourg", "spa", "nurburg", "trier", "luxembourg"], curvature: 0.22 },
  { id: "moselle",      name: "Moselle Line",        length: "94 km",  elev: "+620 m",   cities: ["luxembourg", "trier", "maastricht"], curvature: 0.14 },
  { id: "castle",       name: "Castle Roads",        length: "118 km", elev: "+1 240 m", cities: ["luxembourg", "reims"], curvature: 0.18 },
  { id: "alpine",       name: "Alpine Run",          length: "847 km", elev: "+5 200 m", cities: ["luxembourg", "strasbourg", "dijon", "geneva", "como"], curvature: 0.12 },
  { id: "night-coffee", name: "Night Coffee Point",  length: "47 km",  elev: "+180 m",   cities: ["luxembourg"], curvature: 0 },
];

export type EuropeMapData = {
  viewBox: { w: number; h: number };
  countries: CountryPath[];
  cities: City[];
  routes: RouteSpec[];
  origin: City;
};

export function getEuropeMapData(): EuropeMapData {
  const countries: CountryPath[] = europeFeatures.map((f) => ({
    id: String(f.id),
    name: f.properties.name,
    d: pathGen(f) || "",
    isLU: f.properties.name === "Luxembourg",
  }));

  const cities: City[] = (Object.keys(CITY_RAW) as CityKey[]).map((key) => {
    const raw = CITY_RAW[key];
    const [x, y] = project([raw.lon, raw.lat]);
    return { key, name: raw.name, short: raw.short ?? raw.name, x, y };
  });

  const routes: RouteSpec[] = ROUTE_DEFS.filter((r) => r.cities.length >= 2).map((r) => {
    const pts = r.cities.map((k) => project([CITY_RAW[k].lon, CITY_RAW[k].lat]));
    return {
      id: r.id,
      name: r.name,
      length: r.length,
      elev: r.elev,
      d: chainPath(pts, r.curvature ?? 0.16),
      start: pts[0],
      end: pts[pts.length - 1],
      focus: focusFromPoints(pts),
    };
  });

  const origin = cities.find((c) => c.key === "luxembourg")!;

  return {
    viewBox: { w: VIEW_W, h: VIEW_H },
    countries,
    cities,
    routes,
    origin,
  };
}
