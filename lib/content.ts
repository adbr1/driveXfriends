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
      src: "https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/474096160_122203595660225283_6315509102196467594_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=2a1932&_nc_ohc=qCRsjC-0WGwQ7kNvwElStUb&_nc_oc=AdpgjMtKO_6fF_yyU-hQC3OXlh3jgyatOFHVG6wkVjBiglbb7aOe0o7C-vlG7wUNLcnX9N8iwLJU8AoUPkPfl4wU&_nc_zt=23&_nc_ht=scontent-cdg4-2.xx&_nc_gid=YrT6OmJbSAWoFRMtzC62Fw&_nc_ss=7b2a8&oh=00_Af7TiDEx_UfLSfW-YSKyQkoxcxPpm4sJlELPTlyCYbpHIg&oe=6A052CB8",
      alt: "Placeholder photo de voiture sportive sur route",
    },
  },
  {
    id: "rencontres",
    label: "Rencontres",
    title: "Soirées exclusives",
    body: "Des événements pensés pour créer des souvenirs, pas seulement des rassemblements.",
    image: {
      src: "https://media.fastdl.app/get?__sig=wR_i4RNhZFYJtO5ht8QOyw&__expires=1778352467&uri=https%3A%2F%2Fscontent-iad3-1.cdninstagram.com%2Fv%2Ft51.82787-15%2F656011797_18084457208608540_7450567893770109909_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh2.08_tt6%26_nc_ht%3Dscontent-iad3-1.cdninstagram.com%26_nc_cat%3D104%26_nc_oc%3DQ6cZ2gHbold-djuLJwifkkUH3CgpIRDY5cXDrwvbPqD7f1KPVTMOy78Az6fzZOot9psF1v5-K9xsANPCFtI0ZVK2z2sn%26_nc_ohc%3Dtzqt9IE5s4sQ7kNvwEjTUJk%26_nc_gid%3D6SCKZHX9pZO14MZ9wWPqaA%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Af4brUUXi01Rb6v2WgrgEAny5qleGRr_ACaOkTXb3xPw8Q%26oe%3D6A053534%26_nc_sid%3Dd885a2&filename=656011797_18084457208608540_7450567893770109909_n.jpg",
      alt: "Placeholder photo d'evenement automobile",
    },
  },
  {
    id: "cars-coffee",
    label: "Cars & Coffee",
    title: "Café, métal, lumière",
    body: "Des moments décontractés où les voitures deviennent le centre naturel de la conversation.",
    image: {
      src: "https://media.fastdl.app/get?__sig=Pov0luHet9niqpi6W0YFQw&__expires=1778352671&uri=https%3A%2F%2Fscontent-iad6-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F482122298_17922259017046260_3166623225659097926_n.jpg%3Fstp%3Ddst-jpg_e35_s1080x1080_sh2.08_tt6%26_nc_ht%3Dscontent-iad6-1.cdninstagram.com%26_nc_cat%3D100%26_nc_oc%3DQ6cZ2gFS8dn-5tc0XX9cgsOglwXDKvReCdaSlD-rYFOhiFkazTNpTGc4PinI8hc9mPX6tIz9AntsN4K3G2lzdOz9nujN%26_nc_ohc%3DVDpLbiuyGCoQ7kNvwGSbRYw%26_nc_gid%3DL68dC62jKIghtxIeXGzU6g%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Af4pErCkD4hy8-oi_N1jES3pb6uO75ColDCbfbDnL3E8WA%26oe%3D6A055380%26_nc_sid%3Dd885a2&filename=482122298_17922259017046260_3166623225659097926_n.jpg",
      alt: "Placeholder photo cars and coffee",
    },
  },
  {
    id: "communaute",
    label: "Communauté",
    title: "Classiques & supercars",
    body: "Drive x Friends célèbre la diversité des voitures et des conducteurs, sans hiérarchie.",
    image: {
      src: "https://media.fastdl.app/get?__sig=ALw1lKt04PCfYBK_zpeJOQ&__expires=1778352790&uri=https%3A%2F%2Fscontent-iev1-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F485624725_17924807538046260_8494172253953010195_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh2.08_tt6%26_nc_ht%3Dscontent-iev1-1.cdninstagram.com%26_nc_cat%3D100%26_nc_oc%3DQ6cZ2gH8cM7X5tmi0BJGD8smRoOVbSXMVYngqrrGnSe7QhfnNvrklCKfe6K2hkMUPPqe_tY%26_nc_ohc%3DdfHYmaNQUoUQ7kNvwF7a0ac%26_nc_gid%3DtdyB52jYBAhuGGst42BXBg%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Af5icFAHrySvZX9P09YQCwM90q2mSERFEB9J7kYOCcxGUA%26oe%3D6A056700%26_nc_sid%3Dd885a2&filename=485624725_17924807538046260_8494172253953010195_n.jpg",
      alt: "Placeholder photo communaute automobile",
    },
  },
] as const;

export const gallery = [
  { id: "g1", label: "Luxembourg Drive", ratio: "4 / 5", aspect: 4 / 5, image: { src: "https://scontent-cdg4-1.xx.fbcdn.net/v/t39.30808-6/469480128_122196088970225283_1094117681563865205_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=zY1GeXKy6IIQ7kNvwGTYPTr&_nc_oc=AdqQYbIyJEklish12xKPOSLsgjqSQ96yM7H2toFvDJhI0t-a0DYwIxerAB3mHURj0tRv-6AO2KbRZpuHG_j91o-x&_nc_zt=23&_nc_ht=scontent-cdg4-1.xx&_nc_gid=kHMn6rFzRV19gD0o3DblFA&_nc_ss=7b2a8&oh=00_Af70T35GEGmmbuj0UPzQzKJGTprfGvv83FpuPnwx6yAYlg&oe=6A052E92", alt: "Placeholder photo Luxembourg Drive" } },
  { id: "g2", label: "Cars & Coffee", ratio: "16 / 9", aspect: 16 / 9, image: { src: "https://scontent-cdg6-1.xx.fbcdn.net/v/t39.30808-6/469448198_122196089630225283_462359857716411899_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=7b2446&_nc_ohc=DKzrmPu6RcQQ7kNvwG6soE2&_nc_oc=AdqmcO_BdSVNVX191Nx_Nus2Tt-MvLSRgERdiTB72eemXjmClqmICe5Vb-0HfIASLNpbqyYtpC2PoFowPeS8oUWr&_nc_zt=23&_nc_ht=scontent-cdg6-1.xx&_nc_gid=7ohbMJjPt6ikKmhuqoo_HQ&_nc_ss=7b2a8&oh=00_Af7DKXK1q10DHI6ab7iBPYzDKKpjGcU3fQ1Ol3RyXxvcgA&oe=6A053911", alt: "Placeholder photo Cars and Coffee" } },
  { id: "g3", label: "Castle Roads", ratio: "1 / 1", aspect: 1, image: { src: "https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/469484833_122196089552225283_2291692790923699595_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=CRxEr45LoM8Q7kNvwEZBcgh&_nc_oc=Ado3bvp45rwiRlLOAmx7DZxcjnts5iklS9FRD3IkA2jqe-qM_erLfsnLz4y5Zy4OksB5r1VwPMN4o56nKr8yDSh2&_nc_zt=23&_nc_ht=scontent-cdg4-2.xx&_nc_gid=6Q2cGlHN4XUPjMhiHcSWMw&_nc_ss=7b2a8&oh=00_Af6KaDun6NTsFDvu9107joDRDh1XK_ix9Xc-XwRH_6fI3w&oe=6A053926", alt: "Placeholder photo Castle Roads" } },
  { id: "g4", label: "Members Night", ratio: "3 / 4", aspect: 3 / 4, image: { src: "https://media.fastdl.app/get?__sig=cbFkaOH_W3N5Gx2WUxbUBg&__expires=1778352187&uri=https%3A%2F%2Finstagram.feze8-1.fna.fbcdn.net%2Fv%2Ft51.82787-15%2F518618529_18165404986360161_110185283561452725_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh2.08_tt6%26_nc_ht%3Dinstagram.feze8-1.fna.fbcdn.net%26_nc_cat%3D109%26_nc_oc%3DQ6cZ2gHhuTYaoDC35grR_yCbuw8scgia2E3OXtP4ys6uLmIetFTg0isKq283SglD7MIHTBo3xFN773VwvVBWVs2G1For%26_nc_ohc%3Ds1q-AEkF6vkQ7kNvwEjv61k%26_nc_gid%3DCyL0fQ9og9cumH2YVPNkBg%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Af7C4C7URZDbwCTly6KCDm-OGBLF3LN7hqXjGVYBV8eptw%26oe%3D6A05525D%26_nc_sid%3Dd885a2&filename=518618529_18165404986360161_110185283561452725_n.jpg", alt: "Placeholder photo Members Night" } },
  { id: "g5", label: "Moselle Line", ratio: "16 / 9", aspect: 16 / 9, image: { src: "https://media.fastdl.app/get?__sig=mSUawCNaczKb4pqakWqaZg&__expires=1778352187&uri=https%3A%2F%2Finstagram.feze8-1.fna.fbcdn.net%2Fv%2Ft51.82787-15%2F519415796_18165405028360161_7264637378528046715_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh2.08_tt6%26_nc_ht%3Dinstagram.feze8-1.fna.fbcdn.net%26_nc_cat%3D109%26_nc_oc%3DQ6cZ2gHhuTYaoDC35grR_yCbuw8scgia2E3OXtP4ys6uLmIetFTg0isKq283SglD7MIHTBo3xFN773VwvVBWVs2G1For%26_nc_ohc%3DxxQR-SrAqj8Q7kNvwEL-jyL%26_nc_gid%3DCyL0fQ9og9cumH2YVPNkBg%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Af4sIAVwlkZJ6EOzZnLxKCm-WAdXpz_Xba9NocSWxBDSAA%26oe%3D6A0541D9%26_nc_sid%3Dd885a2&filename=519415796_18165405028360161_7264637378528046715_n.jpg", alt: "Placeholder photo Moselle Line" } },
  { id: "g6", label: "Private Run", ratio: "4 / 5", aspect: 4 / 5, image: { src: "https://media.fastdl.app/get?__sig=UT05RVNtjw2GPKSXLv1dAA&__expires=1778352274&uri=https%3A%2F%2Fscontent-iad3-2.cdninstagram.com%2Fv%2Ft51.82787-15%2F601408727_18330870508211087_1107690952883917120_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh2.08_tt6%26_nc_ht%3Dscontent-iad3-2.cdninstagram.com%26_nc_cat%3D111%26_nc_oc%3DQ6cZ2gEFER__K0lr35gv43i6y6DIHlVg3SKYhXWrTVAglfNU7MsUkv9g9QLALWpvOLCZ7bOC6_qxsvAQ8WohA0ywynmS%26_nc_ohc%3DC6tZAJxdk5IQ7kNvwHp4E5P%26_nc_gid%3DgfEmlKbX7_kg-hLqJX2lBQ%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Af6ED2v3Yud-3nLEtNdR87fW8Os2_tH1O1Qhnldd2TsvWA%26oe%3D6A054CC6%26_nc_sid%3Dd885a2&filename=601408727_18330870508211087_1107690952883917120_n.jpg", alt: "Placeholder photo Private Run" } },
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
