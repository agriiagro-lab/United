import { CultureSheet, MarketPrice } from "./types";

export interface NewsChannel {
  name: string;
  url: string;
  category: string;
  description: string;
}

export const AGRICHANNELS: NewsChannel[] = [
  // I. Actualité, Information et Recherche
  { name: "AGRATIME", url: "https://agratime.com", category: "Actualité Globale", description: "Actualité agricole globale africaine" },
  { name: "Le Rural", url: "https://lerural.bj", category: "Presse Spécialisée Bénin", description: "Presse agricole béninoise spécialisée d'investigation" },
  { name: "MAEP Bénin", url: "https://agriculture.gouv.bj", category: "Institutionnel", description: "Portail officiel du Ministère de l'Agriculture du Bénin" },
  { name: "INRAB", url: "https://inrab.bj", category: "Recherche Agronomique", description: "Institut National des Recherches Agricoles du Bénin" },
  { name: "Bulletin de la Recherche BRAB", url: "https://brab.bj", category: "Recherche Agronomique", description: "Publications scientifiques et techniques agricoles" },
  { name: "CommodAfrica", url: "https://commodafrica.com", category: "Économie", description: "Informations sur les matières premières agricoles" },
  { name: "Agence Ecofin (Agriculture)", url: "https://www.agenceecofin.com/agriculture", category: "Flux Économique", description: "Actualités économiques du secteur agricole africain" },
  { name: "FUPRO Bénin", url: "https://fuprobenin.org", category: "Fédération Producteurs", description: "Fédération des Unions de Producteurs du Bénin" },
  
  // II. Plateformes Numériques
  { name: "Acteur Agricole", url: "https://acteur-agricole.bj", category: "Prix du Marché", description: "Suivi des prix et des opportunités au Bénin" },
  { name: "AgriStars Bénin", url: "https://agri-stars.github.io/agristarsbenin/", category: "Annuaire", description: "Vitrine des agro-entrepreneurs innovants du Bénin" },
  { name: "Access Agriculture", url: "https://www.accessagriculture.org/fr", category: "Vidéos de Formation", description: "Formations paysannes de qualité en langues locales" },
  
  // III. Partenaires Financiers
  { name: "FNDA Bénin", url: "https://fnda.agriculture.gouv.bj", category: "Fonds National", description: "Fonds National de Développement Agricole du Bénin" },
  { name: "AgriFinance", url: "https://www.agrifinance.bj", category: "Microfinance", description: "Financement sur mesure pour agro-entrepreneurs" },
  { name: "PACOFIDE", url: "https://pacofide.agriculture.gouv.bj", category: "Projet d'Appui Public", description: "Projet d'appui au secteur privé agricole (Banque Mondiale)" },
  { name: "BOAD", url: "https://www.boad.org", category: "Banque Régionale", description: "Banque Ouest Africaine de Développement" },
  { name: "FIDA / IFAD", url: "https://www.ifad.org/fr/", category: "Fonds International", description: "Fonds international de développement agricole" },
  { name: "BAD (Banque Africaine)", url: "https://afdb.org/fr/topics/agriculture", category: "Banque de Développement", description: "Développement agricole durable en Afrique" },
  
  // IV. Subventions
  { name: "Tony Elumelu Foundation", url: "https://www.tonyelumelufoundation.org", category: "Accélérateur", description: "Subventions d'amorçage pour jeunes agripreneurs d'Afrique" },
  { name: "AECF (Africa Enterprise)", url: "https://www.aecfafrica.org", category: "Fonds de Défi", description: "Fonds de résilience pour le secteur privé agricole" }
];

export const BENIN_DEPARTMENTS_COMMUNES: { [key: string]: string[] } = {
  "Alibori": ["Banikoara", "Gogounou", "Kandi", "Karimama", "Malanville", "Segbana"],
  "Atacora": ["Boukoumbé", "Cobly", "Kérou", "Kouandé", "Natitingou", "Ouingui", "Pehunco", "Tanguiéta", "Toucountouna"],
  "Atlantique": ["Abomey-Calavi", "Allada", "Kpomassè", "Ouidah", "Sô-Ava", "Toffo", "Tori-Bossito", "Zé"],
  "Borgou": ["Bembéréké", "Kalalé", "N'Dali", "Nikki", "Parakou", "Pèrèrè", "Sinendé", "Tchaourou"],
  "Collines": ["Bantè", "Dassa-Zoumè", "Glazoué", "Ouèssè", "Savalou", "Savè"],
  "Couffo": ["Aplahoué", "Djakotomey", "Dogbo", "Klouékanmè", "Lalo", "Toviklin"],
  "Donga": ["Bassila", "Copargo", "Djougou", "Ouaké"],
  "Littoral": ["Cotonou"],
  "Mono": ["Athiémé", "Bopa", "Comè", "Grand-Popo", "Houéyogbé", "Lokossa"],
  "Ouémé": ["Adjarra", "Adjohoun", "Aguégués", "Akpro-Missérété", "Avrankou", "Bonou", "Dangbo", "Porto-Novo", "Sèmè-Kpodji"],
  "Plateau": ["Adja-Ouèrè", "Ifangni", "Kétou", "Pobè", "Sakété"],
  "Zou": ["Abomey", "Agbangnizoun", "Bohicon", "Covè", "Djidja", "Ouinhi", "Za-Kpota", "Zagnanado", "Zogbodomey"]
};

export const BENIN_COMMUNES_WEATHER_PRESETS: { [key: string]: { temp: number, condition: string, recommendations: string[] } } = {
  "Adjohoun": {
    temp: 33,
    condition: "Partiellement nuageux",
    recommendations: ["Bonne humidité dans la vallée de l'Ouémé. Prévoyez un paillage pour retenir l'humidité.", "Surveillez les signes de flétrissement bactérien de la tomate."]
  },
  "Dangbo": {
    temp: 32,
    condition: "Averse passagère",
    recommendations: ["Sols limoneux bien arrosés. Parfait pour repiquer les piments.", "Évitez d'appliquer des engrais juste avant le rinçage des pluies."]
  },
  "Cotonou": {
    temp: 31,
    condition: "Pluie modérée",
    recommendations: ["Drainage important requis pour les cultures maraîchères urbaines.", "Protégez les jeunes plants des vents côtiers."]
  },
  "Porto-Novo": {
    temp: 32,
    condition: "Ensoleillé",
    recommendations: ["Excellent ensoleillement pour le séchage du maïs.", "Arrosage matinal recommandé."]
  },
  "Parakou": {
    temp: 36,
    condition: "Chaleur intense",
    recommendations: ["Risque de stress hydrique élevé. Irriguez impérativement en soirée.", "Ombragez les élevages de volailles contre les coups de chaleur."]
  },
  "Bohicon": {
    temp: 34,
    condition: "Nuageux",
    recommendations: ["Conditions idéales pour entretenir le compost biologique.", "Préparation des sols pour les légumineuses."]
  },
  "Natitingou": {
    temp: 35,
    condition: "Sec & Venteux",
    recommendations: ["Irrigation préventive recommandée pour les cultures de sésame et de sorgho.", "Protégez les étables du vent de l'harmattan."]
  },
  "Ouidah": {
    temp: 31,
    condition: "Humide",
    recommendations: ["Traitement antifongique préventif recommandé sur le palmier à huile.", "Récolte du manioc opportun."]
  }
};

export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  { id: "p_m1", commune: "Adjohoun", productName: "Sac de Gari de Manioc (50kg)", pricePerKgOrUnit: "18 000 F", trend: "up", updatedAt: "Aujourd'hui" },
  { id: "p_m2", commune: "Dangbo", productName: "Panier de Tomates Rondes (25kg)", pricePerKgOrUnit: "8 500 F", trend: "down", updatedAt: "Aujourd'hui" },
  { id: "p_m3", commune: "Parakou", productName: "Sac de Maïs Blanc (100kg)", pricePerKgOrUnit: "21 000 F", trend: "stable", updatedAt: "Hier" },
  { id: "p_m4", commune: "Bohicon", productName: "Régime de Banane Planteur (Unité)", pricePerKgOrUnit: "1 800 F", trend: "up", updatedAt: "Aujourd'hui" },
  { id: "p_m5", commune: "Porto-Novo", productName: "Poulet Bicyclette Fermier (Unité)", pricePerKgOrUnit: "3 500 F", trend: "stable", updatedAt: "Hier" },
  { id: "p_m6", commune: "Natitingou", productName: "Sac d'Ignames de Savalou (100kg)", pricePerKgOrUnit: "32 000 F", trend: "up", updatedAt: "Aujourd'hui" },
  { id: "p_m7", commune: "Cotonou", productName: "Casier d'Œufs Frais (30 pièces)", pricePerKgOrUnit: "2 300 F", trend: "down", updatedAt: "Aujourd'hui" }
];

export const CULTURE_SHEETS: CultureSheet[] = [
  {
    id: "cs1",
    name: "Tomate Maraîchère",
    category: "culture",
    cycle: "90 à 120 jours",
    diseases: [
      { name: "Flétrissement Bactérien", treatment: "Infusion de feuilles de neem broyées à administrer au pied, associée à une rotation stricte avec des graminées." },
      { name: "Mildiou de la Tomate", treatment: "Pulvérisation d'un mélange d'eau savonneuse contenant des extraits d'ail et du bicarbonate de soude agricole." },
      { name: "Nématodes des racines", treatment: "Planter massivement des œillets d'Inde (Tagetes) autour de la parcelle pour repousser naturellement les vers." }
    ],
    technicalTips: [
      "Pailler abondamment pour prévenir l'évaporation.",
      "Tuteurer le plant dès le 20ème jour pour éviter les pourritures sur sol mouillé.",
      "Arrosage goutte-à-goutte ou au goulot sans mouiller le feuillage."
    ]
  },
  {
    id: "cs2",
    name: "Piment Rouge (Piment oiseau)",
    category: "culture",
    cycle: "120 à 150 jours",
    diseases: [
      { name: "Mosaïque du Piment (Virus)", treatment: "Arrachage immédiat des plants atteints; pulvérisation de piment fort dilué et d'huile végétale pour éloigner les pucerons vecteurs." },
      { name: "Anthracnose (Taches noires)", treatment: "Supprimer les fruits atteints. Apporter de la cendre de bois tamisée au sol pour fortifier la plante." }
    ],
    technicalTips: [
      "Le piment adore les sols riches en matières organiques bien décomposées.",
      "Arroser régulièrement sans saturer pour prévenir l'asphyxie racinaire.",
      "Récolter au fur et à mesure pour stimuler la floraison continue."
    ]
  },
  {
    id: "cs3",
    name: "Manioc de Table",
    category: "culture",
    cycle: "8 à 12 mois",
    diseases: [
      { name: "Mosaïque africaine du manioc", treatment: "Sélectionner rigoureusement des boutures saines (variétés améliorées de l'INRAB) et arracher les plants malades dès l'apparition." },
      { name: "Pourriture racinaire", treatment: "Planter sur buttes surélevées pour assurer un drainage optimal." }
    ],
    technicalTips: [
      "Privilégier les boutures d'environ 30 cm dotées de 4 à 6 yeux.",
      "Buttage régulier pour améliorer le développement tubéreux.",
      "Le manioc s'associe idéalement avec le niébé (fixateur d'azote)."
    ]
  },
  {
    id: "cs4",
    name: "Poulets de Chair / Pondues",
    category: "elevage",
    cycle: "45 jours (chair) / 18 mois (pondeuses)",
    diseases: [
      { name: "Maladie de Newcastle", treatment: "Prévention vaccinale obligatoire. Traditionnel: Macération d'écorces ou de feuilles de Moringa dans l'eau de boisson comme immunostimulant naturel fortifiant." },
      { name: "Coccidiose (Diarrhée sanguine)", treatment: "Garder la litière sèche et aérée. Traditionnel: Infusion d'ail écrasé et d'aloe vera sauvage diluée dans l'abreuvoir pendant 3 jours." }
    ],
    technicalTips: [
      "Maintenir une biosécurité absolue à l'entrée du poulailler (pédiluve obligatoire).",
      "Assurer une ventilation constante sans courants d'air froids directs.",
      "Alimentation équilibrée riche en protéines végétales locales (tourteau de palmiste ou soja)."
    ]
  },
  {
    id: "cs5",
    name: "Porcs locaux améliorés",
    category: "elevage",
    cycle: "6 à 8 mois",
    diseases: [
      { name: "Peste Porcine Africaine", treatment: "Pas de remède médical. Confinement absolu, hygiène du bâtiment exemplaire, zéro reste de cuisine non bouilli." },
      { name: "Gales et parasites de peau", treatment: "Friction de l'animal avec une huile de neem biologique mélangée à du soufre naturel de roche." }
    ],
    technicalTips: [
      "Nettoyer les loges quotidiennement pour réduire l'ammoniac nocif.",
      "Distribuer de l'eau propre à volonté (indispensable pour les truies allaitantes).",
      "Éviter la consanguinité en changeant régulièrement de verrat reproducteur."
    ]
  },
  // NORD-BÉNIN
  {
    id: "cs_nord1",
    name: "Sorgho Local (Nord-Bénin)",
    category: "culture",
    cycle: "120 à 150 jours",
    diseases: [
      { name: "Striga (Plante parasite)", treatment: "Pratiquer l'association culturale ou rotation avec le niébé (qui déclenche la germination suicide du Striga) et sarcler avant floraison du parasite." },
      { name: "Charbon du grain (Fongique)", treatment: "Traitement préventif des semences avec des décoctions de feuilles d'eucalyptus ou sélection de semences saines certifiées." }
    ],
    technicalTips: [
      "Idéal pour les zones à faible hygrométrie (Natitingou, Kandi, Parakou).",
      "Semer dès les premières pluies utiles, en poquets distants de 40 cm.",
      "Associer avec des légumineuses pour restaurer l'azote du sol sec."
    ]
  },
  {
    id: "cs_nord2",
    name: "Igname Laboko (Nord-Bénin)",
    category: "culture",
    cycle: "6 à 8 mois",
    diseases: [
      { name: "Anthracnose de l'igname", treatment: "Utiliser des résidus de récolte sains, pratiquer une rotation longue de 3 à 4 ans, pulvériser une solution biologique à base de neem." },
      { name: "Cochenilles des tubercules", treatment: "Enrober les boutures d'ignames dans de la cendre de bois tamisée avant la plantation pour repousser les insectes du sol." }
    ],
    technicalTips: [
      "Exige des sols profonds, meubles et riches. Effectuer un buttage haut (60 à 80 cm) et soigné.",
      "Pailler impérativement la tête des buttes pour la protéger de la forte chaleur du soleil septentrional.",
      "Tuteurer solidement chaque plant pour favoriser l'ensoleillement maximal du feuillage."
    ]
  },
  // CENTRE-BÉNIN
  {
    id: "cs_centre1",
    name: "Arachide de Savalou (Centre-Bénin)",
    category: "culture",
    cycle: "90 à 110 jours",
    diseases: [
      { name: "Rosette de l'arachide (Transmis par pucerons)", treatment: "Semer à forte densité pour limiter la prolifération des pucerons, éliminer immédiatement les premiers plants atteints." },
      { name: "Cercosporiose (Taches foliaires)", treatment: "Pulvériser une infusion de feuilles de goyavier ou de papayer, et éviter la monoculture d'arachide sur la même parcelle." }
    ],
    technicalTips: [
      "Préfère les sols légers sablonneux-argileux faciles à déterrer à la récolte.",
      "Buttage léger au moment de la floraison pour faciliter la pénétration des gynophores dans le sol.",
      "Récolter par temps sec dès le jaunissement et dessèchement partiel des feuilles."
    ]
  },
  {
    id: "cs_centre2",
    name: "Soja Biologique (Centre-Bénin)",
    category: "culture",
    cycle: "100 à 110 jours",
    diseases: [
      { name: "Mosaïque du Soja", treatment: "Utilisation rigoureuse de semences saines, destruction des adventices hôtes de pucerons autours des parcelles." },
      { name: "Flétrissement bactérien", treatment: "Gérer l'excès d'eau stagnante grâce à un bon billonnage, et pratiquer des rotations culturales de 3 ans minimum." }
    ],
    technicalTips: [
      "Inoculer les semences avec du Rhizobium local pour maximiser la fixation d'azote et le rendement.",
      "Excellente culture de rotation améliorant considérablement la fertilité résiduelle pour le maïs suivant.",
      "Récolter dès que les gousses brunissent et font un bruit de grelot quand on les secoue."
    ]
  },
  // SUD-BÉNIN
  {
    id: "cs_sud1",
    name: "Ananas Pain de Sucre (Sud-Bénin - Allada)",
    category: "culture",
    cycle: "14 à 16 mois",
    diseases: [
      { name: "Cochenille farineuse (Vecteur du Wilt)", treatment: "Lutte préventive contre les fourmis transporteuses par saupoudrage de cendre ou décoction forte de savon de Marseille et d'huile." },
      { name: "Symphyles (Vers microscopiques des racines)", treatment: "Pratiquer un labour exposé au soleil pendant la saison sèche pour détruire les larves par insolation thermique." }
    ],
    technicalTips: [
      "Planter des rejets calibrés et triés par catégorie de poids pour garantir une récolte homogène.",
      "Utiliser un paillage plastique biodégradable ou un paillage organique épais pour limiter l'enherbement.",
      "Le Sud-Bénin (Allada, Zè) offre le climat chaud et humide idéal pour maximiser la sucrosité caractéristique."
    ]
  },
  {
    id: "cs_sud2",
    name: "Riz de la Vallée de l'Ouémé (Sud-Bénin)",
    category: "culture",
    cycle: "110 à 135 jours",
    diseases: [
      { name: "Pyriculariose (Champignon destructeur)", treatment: "Éviter les excès de fertilisation azotée, favoriser un semis espacé et utiliser des variétés locales résistantes sélectionnées par l'INRAB." },
      { name: "Panachure jaune du riz (RYMV - Virus)", treatment: "Éliminer les repousses de riz sauvage en bordure de parcelle et arracher immédiatement les plants décolorés ou rabougris." }
    ],
    technicalTips: [
      "Parfaitement adapté aux riches plaines inondables et bas-fonds de Dangbo, Adjohoun, et Bonou.",
      "Maîtriser le calendrier hydrique pour concilier la phase végétative avec le retrait des crues de la vallée.",
      "Repiquer les jeunes plants de pépinière âgés de 15 à 21 jours, à raison de 2 brins par poquet."
    ]
  },
  {
    id: "cs_nord3",
    name: "Sésame Agroécriture (Nord-Bénin)",
    category: "culture",
    cycle: "90 à 110 jours",
    diseases: [
      { name: "Cercosporiose du Sésame", treatment: "Pulvérisation préventive de purin d'absinthe et de neem dilué à 5%, puis élimination des résidus de récoltes." },
      { name: "Chenilles arpenteuses du septentrion", treatment: "Cueillette manuelle matinale et application de purin de piment fort mélangé à du savon noir bio." }
    ],
    technicalTips: [
      "Spéculation agroécologique de choix pour le septentrion résilient (Tanguiéta, Toucountouna, Banikoara).",
      "Semer sur sol bien aminci et drainé, les racines pivotantes redoutant l’engorgement d’eau.",
      "Idéal pour briser le cycle des ravageurs en rotation maraîchère avec le sorgho ou le maïs."
    ]
  },
  {
    id: "cs_centre3",
    name: "Anacarde / Cajou (Centre-Bénin)",
    category: "culture",
    cycle: "3 à 5 ans",
    diseases: [
      { name: "Anthracnose de l'Anacardier", treatment: "Élagage systématique des branches mortes pour aérer le houppier et pulvérisation biologique de décoctions de papayer." },
      { name: "Punaise Helopeltis des collines", treatment: "Introduction de fourmis prédatrices amies (Oecophylla) et aspersions régulières d'extrait d'huile de graines de neem." }
    ],
    technicalTips: [
      "Parfaitement adapté aux collines de Savalou, Dassa, et Bantè pour reboiser de façon rentable.",
      "Planter à grand écartement d'au moins 8m x 8m pour encourager la bonne ramification productive.",
      "Associer avec de l'arachide ou du niébé les premières années afin de couvrir et régénérer l’interligne de l'exploitation."
    ]
  },
  {
    id: "cs_sud3",
    name: "Papaye Solo Agroécologique (Sud-Bénin)",
    category: "culture",
    cycle: "8 à 10 mois",
    diseases: [
      { name: "Virus de la tache annulaire (PRSV)", treatment: "Arrachage immédiat des plants atteints; traitement préventif biologique contre les pucerons vecteurs." },
      { name: "Pourriture du collet par l'humidité", treatment: "Buttage léger pour éloigner l'eau d'arrosage stagnante et badigeonnage du collet à la cendre." }
    ],
    technicalTips: [
      "S’épanouit idéalement dans les zones littorales et humides d'Allada, Ouidah et Sèmè-Podji.",
      "Apporter de généreuses pelletées de compost organique de compostage d'agrumes.",
      "Pailler abondamment pour préserver l’humidité nécessaire au sol sablonneux."
    ]
  }
];

export const CROP_TEMPLATES_FOR_CALCULATOR = [
  { name: "Tomate Noire de Crimée / Locale (Sud-Bénin)", cycle: "3 mois", yieldKgPerM2: 4.5, estPricePerKg: 350, estCostPerM2: 80 },
  { name: "Piment Habanero / Vert (Sud-Bénin)", cycle: "4 mois", yieldKgPerM2: 1.8, estPricePerKg: 1200, estCostPerM2: 120 },
  { name: "Sorgho Local Grain (Nord-Bénin)", cycle: "4.5 mois", yieldKgPerM2: 1.5, estPricePerKg: 300, estCostPerM2: 50 },
  { name: "Igname Laboko de qualité (Nord-Bénin)", cycle: "7 mois", yieldKgPerM2: 2.5, estPricePerKg: 500, estCostPerM2: 110 },
  { name: "Sésame Agroécologique (Nord-Bénin)", cycle: "3.5 mois", yieldKgPerM2: 1.4, estPricePerKg: 750, estCostPerM2: 40 },
  { name: "Soja Biologique d'export (Centre-Bénin)", cycle: "3.5 mois", yieldKgPerM2: 1.3, estPricePerKg: 380, estCostPerM2: 60 },
  { name: "Arachide de Savalou (Centre-Bénin)", cycle: "3 mois", yieldKgPerM2: 1.6, estPricePerKg: 650, estCostPerM2: 70 },
  { name: "Cajou Agroforestier (Centre-Bénin)", cycle: "12 mois (Fruct.)", yieldKgPerM2: 2.1, estPricePerKg: 950, estCostPerM2: 130 },
  { name: "Ananas Pain de Sucre (Sud-Bénin - Allada)", cycle: "14 mois", yieldKgPerM2: 3.8, estPricePerKg: 350, estCostPerM2: 130 },
  { name: "Riz Blanc de la Vallée d'Ouémé (Sud-Bénin)", cycle: "4 mois", yieldKgPerM2: 4.2, estPricePerKg: 450, estCostPerM2: 100 },
  { name: "Papaye Solo Agroécologique (Sud-Bénin)", cycle: "9 mois", yieldKgPerM2: 5.2, estPricePerKg: 300, estCostPerM2: 75 },
  { name: "Gombo Vert local", cycle: "2.5 mois", yieldKgPerM2: 2.2, estPricePerKg: 400, estCostPerM2: 60 },
  { name: "Amarante / Légume Feuille (Tchayo)", cycle: "1 mois", yieldKgPerM2: 3.0, estPricePerKg: 150, estCostPerM2: 30 },
  { name: "Chou de Cotonou", cycle: "3.5 mois", yieldKgPerM2: 3.5, estPricePerKg: 500, estCostPerM2: 90 },
  { name: "Carotte de maraîchage", cycle: "3 mois", yieldKgPerM2: 2.5, estPricePerKg: 650, estCostPerM2: 110 }
];

export function getCommuneWeather(communeName: string) {
  if (BENIN_COMMUNES_WEATHER_PRESETS[communeName]) {
    return BENIN_COMMUNES_WEATHER_PRESETS[communeName];
  }
  
  const charSum = communeName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const temp = 29 + (charSum % 8); // Always 29 to 36 degrees
  const conditions = ["Ensoleillé", "Partiellement nuageux", "Nuageux", "Averse passagère", "Sec & Ensoleillé", "Climat humide", "Harmattan calme"];
  const cond = conditions[charSum % conditions.length];
  
  const recommendations = [
    `Pour ${communeName} : Les conditions climatiques actuelles sous ciel "${cond}" sont idoines pour effectuer un paillage organique protecteur de vos buttes.`,
    `Conseil d'entretien : Effectuez un binage léger en fin d'après-midi à ${communeName} pour aérer les racines et casser la croûte du sol sablo-argileux.`
  ];
  
  return {
    temp,
    condition: cond,
    recommendations
  };
}

