export const brand = {
  name: "Drive x Friends",
  display: "Drive × Friends",
  tagline: "Le club automobile de référence au Luxembourg.",
  email: "drivexfriends@gmail.com",
  instagram: "drivexfriends",
  instagramUrl: "https://instagram.com/drivexfriends",
  origin: { lat: "49.6116°N", lon: "6.1319°E", label: "Luxembourg" },
} as const;

export const chapters = [
  { id: "prologue", roman: "I", title: "Prologue", timecode: "00:00:14" },
  { id: "territoire", roman: "II", title: "Territoire", timecode: "00:11:42" },
  { id: "experiences", roman: "III", title: "Expériences", timecode: "00:27:08" },
  { id: "moments", roman: "IV", title: "Moments", timecode: "00:46:21" },
  { id: "invitation", roman: "V", title: "Invitation", timecode: "01:02:55" },
  { id: "contact", roman: "VI", title: "Contact", timecode: "01:10:03" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export const hero = {
  subtitle: "Le club automobile de référence au Luxembourg.",
  shortLine: "Routes d'exception. Voitures d'exception. Rencontres d'exception.",
  ctaPrimary: { label: "Rejoindre le club", href: "#invitation" },
  ctaSecondary: { label: "Découvrir l'expérience", href: "#territoire" },
};

export const manifesto = {
  eyebrow: "Manifeste",
  title: "Plus qu'un club. Un mouvement.",
  body:
    "Drive x Friends rassemble celles et ceux qui voient l'automobile comme une expérience : une route, une lumière, une trajectoire, une rencontre. Au Luxembourg, entre paysages vallonnés, routes sinueuses et lieux d'exception, nous créons des moments conçus pour être vécus, conduits et partagés.",
  highlights: ["route", "passion", "communauté", "exception", "trajectoire", "rencontre"],
};

export const territoire = {
  eyebrow: "Cartographie",
  title: "Le pays comme circuit.",
  body:
    "Chaque sortie est pensée comme un itinéraire : rythme, paysage, pauses, rencontres, lumière. Le trajet compte autant que la destination.",
  routes: [
    { id: "castle", name: "Castle Roads", length: "118 km", elev: "+1 240 m", coord: "49.81°N · 6.09°E" },
    { id: "moselle", name: "Moselle Line", length: "94 km", elev: "+620 m", coord: "49.55°N · 6.36°E" },
    { id: "night-coffee", name: "Night Coffee Point", length: "47 km", elev: "+180 m", coord: "49.61°N · 6.13°E" },
    { id: "ardennes", name: "Ardennes Loop", length: "172 km", elev: "+1 880 m", coord: "49.97°N · 5.94°E" },
    { id: "luxembourg-run", name: "Luxembourg Run", length: "63 km", elev: "+410 m", coord: "49.69°N · 6.21°E" },
  ],
} as const;

export const experiences = [
  {
    id: "balades",
    label: "Balades",
    title: "Tourisme automobile",
    body: "Les routes les plus panoramiques du Luxembourg, conduites au volant de votre voiture de rêve.",
    image: {
      src: "/images/experience-balades.jpg",
      alt: "Placeholder photo de voiture sportive sur route",
    },
  },
  {
    id: "rencontres",
    label: "Rencontres",
    title: "Soirées exclusives",
    body: "Des événements pensés pour créer des souvenirs, pas seulement des rassemblements.",
    image: {
      src: "/images/experience-rencontres.jpg",
      alt: "Placeholder photo d'evenement automobile",
    },
  },
  {
    id: "cars-coffee",
    label: "Cars & Coffee",
    title: "Café, métal, lumière",
    body: "Des moments décontractés où les voitures deviennent le centre naturel de la conversation.",
    image: {
      src: "/images/experience-cars-coffee.jpg",
      alt: "Placeholder photo cars and coffee",
    },
  },
  {
    id: "communaute",
    label: "Communauté",
    title: "Classiques & supercars",
    body: "Drive x Friends célèbre la diversité des voitures et des conducteurs, sans hiérarchie.",
    image: {
      src: "/images/experience-communaute.jpg",
      alt: "Placeholder photo communaute automobile",
    },
  },
] as const;

export const gallery = [
  { id: "g1", label: "Luxembourg Drive", ratio: "4 / 5", aspect: 4 / 5, image: { src: "/images/gallery-luxembourg-drive.jpg", alt: "Placeholder photo Luxembourg Drive" } },
  { id: "g2", label: "Cars & Coffee", ratio: "16 / 9", aspect: 16 / 9, image: { src: "/images/gallery-cars-coffee.jpg", alt: "Placeholder photo Cars and Coffee" } },
  { id: "g3", label: "Castle Roads", ratio: "1 / 1", aspect: 1, image: { src: "/images/gallery-castle-roads.jpg", alt: "Placeholder photo Castle Roads" } },
  { id: "g4", label: "Members Night", ratio: "3 / 4", aspect: 3 / 4, image: { src: "/images/gallery-members-night.jpg", alt: "Placeholder photo Members Night" } },
  { id: "g5", label: "Moselle Line", ratio: "16 / 9", aspect: 16 / 9, image: { src: "/images/gallery-moselle-line.jpg", alt: "Placeholder photo Moselle Line" } },
  { id: "g6", label: "Private Run", ratio: "4 / 5", aspect: 4 / 5, image: { src: "/images/gallery-private-run.jpg", alt: "Placeholder photo Private Run" } },
] as const;

export const invitation = {
  eyebrow: "Adhésion",
  title: "L'invitation est personnelle.",
  body:
    "Rejoindre Drive x Friends, c'est accéder à une communauté de passionnés, des événements exclusifs et des itinéraires pensés pour vivre l'automobile autrement.",
  ctaPrimary: { label: "Demander une adhésion", href: "mailto:drivexfriends@gmail.com?subject=Demande%20d%27adh%C3%A9sion%20Drive%20x%20Friends" },
  ctaSecondary: { label: "Nous contacter", href: "#contact" },
  card: {
    series: "№ DXF · 0001 / LU",
    holder: "MEMBRE FONDATEUR",
    issued: "MMXXVI",
    club: "Luxembourg Automotive Club",
    valid: "VALIDITÉ — PERMANENTE",
  },
};

export const contact = {
  eyebrow: "Contact",
  title: "Écrivez. Suivez. Conduisez.",
  lines: [
    { label: "Instagram", value: `@${brand.instagram}`, href: brand.instagramUrl, external: true },
    { label: "Email", value: brand.email, href: `mailto:${brand.email}`, external: false },
  ],
};

export const coda = {
  line: "À ce soir.",
  timecode: "01:14:32 — FIN DU CHAPITRE",
};

export const footerText = {
  line1: "Drive x Friends — Luxembourg Automotive Club",
  line2: "© 2026 Drive x Friends. Tous droits réservés.",
};
