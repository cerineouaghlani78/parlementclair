// Fixtures reprises verbatim du prototype design/LexClair.dc.html.
// Aucune donnée n'est chargée depuis un backend à ce stade.

export const STREAM_MS = 550

export const LAWS = {
  aper: {
    id: 'aper',
    title: "LOI n° 2023-175 relative à l'accélération de la production d'énergies renouvelables (APER)",
    short: 'Loi énergies renouvelables (APER)',
    ref: 'n° 2023-175 du 10 mars 2023',
  },
  plf25: {
    id: 'plf25',
    title: 'Loi de finances pour 2025',
    short: 'Loi de finances 2025 — impact PME',
    ref: 'PLF 2025',
  },
  sren: {
    id: 'sren',
    title: "LOI n° 2024-449 visant à sécuriser et réguler l'espace numérique (SREN)",
    short: 'Loi SREN & modération',
    ref: 'n° 2024-449 du 21 mai 2024',
  },
  iv: {
    id: 'iv',
    title: "LOI n° 2023-973 relative à l'industrie verte",
    short: 'Loi industrie verte',
    ref: 'n° 2023-973 du 23 oct. 2023',
  },
  retraites: {
    id: 'retraites',
    title: 'LOI n° 2023-270 de financement rectificative de la sécurité sociale',
    short: 'Réforme des retraites 2023',
    ref: 'n° 2023-270 du 14 avr. 2023',
  },
}

export const MESURES = [
  "Objectif de 40 % d'électricité d'origine renouvelable d'ici 2030.",
  "Définition par les communes de « zones d'accélération » pour l'implantation prioritaire des projets.",
  "Simplification et raccourcissement des procédures d'autorisation environnementale.",
  "Obligation d'ombrières photovoltaïques sur les parkings extérieurs de plus de 1 500 m².",
  'Partage territorial de la valeur : réduction sur les factures des riverains des installations.',
]

export const SECTORS = [
  { label: "Production d'électricité ENR", v: 85 },
  { label: 'Emploi & filière industrielle', v: 62 },
  { label: 'Agrivoltaïsme & foncier agricole', v: 34 },
  { label: 'Collectivités locales', v: 28 },
  { label: 'Finances publiques (soutien)', v: -45 },
  { label: 'Paysages & biodiversité', v: -30 },
  { label: 'Filière nucléaire', v: -12 },
]

export const BUDGET = [
  ['2023', 6.5],
  ['2024', 7.2],
  ['2025', 8.4],
  ['2026', 9.1],
  ['2027', 9.8],
  ['2028', 10.5],
  ['2029', 11.2],
  ['2030', 12.0],
]

export const VOTE = {
  total: 591,
  segments: [
    { label: 'Pour', count: 300, pct: '50,8', color: '#18753c' },
    { label: 'Contre', count: 91, pct: '15,4', color: '#ce0500' },
    { label: 'Abstention', count: 200, pct: '33,8', color: '#929292' },
  ],
}

export const GROUPS = [
  { name: 'Renaissance — Pour', k: 'pour' },
  { name: 'MoDem — Pour', k: 'pour' },
  { name: 'Horizons — Pour', k: 'pour' },
  { name: 'Socialistes — Pour', k: 'pour' },
  { name: 'Écologistes — Pour', k: 'pour' },
  { name: 'Rassemblement National — Contre', k: 'contre' },
  { name: 'La France insoumise — Abstention', k: 'abst' },
  { name: 'Les Républicains — Abstention', k: 'abst' },
]

export const SOURCES = [
  { tag: 'Légifrance', title: 'LOI n° 2023-175' },
  { tag: 'Code énergie', title: 'Art. L. 141-5-3' },
  { tag: 'Assemblée', title: 'Scrutin n° 2823' },
  { tag: 'Sénat', title: 'Rapport n° 82' },
]

export const EXAMPLES = [
  {
    q: "Analyse l'impact de la loi sur les énergies renouvelables (APER)",
    sub: 'Loi n° 2023-175 · énergie, emploi, finances',
    law: 'aper',
  },
  {
    q: 'Quels secteurs profitent le plus de la loi APER ?',
    sub: 'Impact sectoriel · indice comparatif',
    law: 'aper',
  },
  {
    q: 'Détaille le vote et les positions des groupes',
    sub: 'Assemblée nationale · scrutin solennel',
    law: 'aper',
  },
  {
    q: 'Quel est le coût pour les finances publiques ?',
    sub: 'Charges de soutien · projection 2030',
    law: 'aper',
  },
]

export const FOLLOWUPS = [
  "Quel est l'impact sur l'emploi local ?",
  'Compare avec le dispositif allemand (EEG)',
  'Qui sont les principaux opposants et pourquoi ?',
  "Détaille le calendrier d'application",
]

export const MODELS = [
  { name: 'Groq · Llama 3.3', desc: 'Rapide — 70B, réponses en streaming' },
  { name: 'Groq · Mixtral 8x7B', desc: 'Contexte étendu pour longs textes de loi' },
  { name: 'Groq · Llama 3.1 8B', desc: 'Léger — questions factuelles simples' },
]

// Historique groupé, reconstruit à partir de LAWS.
export const HIST_GROUPS = [
  { label: "Aujourd'hui", items: [{ id: 'aper', title: 'Loi énergies renouvelables (APER)' }] },
  {
    label: '7 derniers jours',
    items: [
      { id: 'plf25', title: 'Loi de finances 2025 — impact PME' },
      { id: 'sren', title: 'Loi SREN & modération' },
      { id: 'iv', title: 'Loi industrie verte' },
      { id: 'retraites', title: 'Réforme des retraites 2023' },
    ],
  },
]
