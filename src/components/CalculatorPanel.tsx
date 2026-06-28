import React, { useState, useEffect } from "react";
import { 
  ZONES_AGRECOLOGIQUES_BENIN, 
  ALL_BENIN_DEPARTMENTS, 
  getZoneByDepartment, 
  SpeculationCulture, 
  SpeculationElevage, 
  SpeculationTransformation 
} from "../data/agroData";
import { 
  Calculator, 
  Sparkles, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  Calendar, 
  ArrowRight, 
  Download, 
  Sprout, 
  Trash2, 
  TrendingUp 
} from "lucide-react";

// Gérer le catalogue national étendu pour désenclaver les choix
const ALL_BENIN_CULTURES: SpeculationCulture[] = [];
const seenCultureNames = new Set<string>();

ZONES_AGRECOLOGIQUES_BENIN.forEach(zone => {
  zone.cultures.forEach(c => {
    if (!seenCultureNames.has(c.nom)) {
      seenCultureNames.add(c.nom);
      ALL_BENIN_CULTURES.push(c);
    }
  });
});

// Assurer les cultures phares nationales recommandées au Bénin
const SPECIAL_CULTURES: SpeculationCulture[] = [
  {
    nom: "Coton Conventionnel H7 (Or Blanc - Filière Phare nationale)",
    cycle: "120 jours",
    rendementMoyen: 2.8,
    prixKgMoy: 310,
    periodeSemis: "Mai-Juin",
    itineraire: [
      "Préparation du lit de semences profond",
      "Éclaircissage à deux plants par poquet",
      "Traitement phytosanitaire ciblé selon directives du MAEP"
    ],
    maladies: [
      { nom: "Chenille de la capsule", remede: "Pulvérisation d'extraits aqueux d'huile ou feuilles de neem" }
    ],
    semencesCost: 8000,
    engraisCost: 24000,
    mainOeuvreCost: 15000
  },
  {
    nom: "Anacarde / Cajou Amélioré (Noix - Filière Phare nationale)",
    cycle: "3 ans d'entrée en production",
    rendementMoyen: 1.2,
    prixKgMoy: 450,
    periodeSemis: "Juillet (repiquage des plants greffés)",
    itineraire: [
      "Piquetage à intervalle de 8m x 8m ou 10m x 10m",
      "Trouaison profonde enrichie en compost de ferme",
      "Élagage de formation annuel rigoureux"
    ],
    maladies: [
      { nom: "Anthracnose foliaire de l'anacardier", remede: "Traitement préventif à base de décoction alcaline de cendres" }
    ],
    semencesCost: 15000,
    engraisCost: 11050,
    mainOeuvreCost: 16000
  },
  {
    nom: "Soja Graine Jaune d'Exportation (Filière Phare GDIZ)",
    cycle: "90 jours",
    rendementMoyen: 1.8,
    prixKgMoy: 350,
    periodeSemis: "Juillet",
    itineraire: [
      "Inoculation des semences avec le rhizobium",
      "Semis serré en lignes continues",
      "Récolte précoce dès le brunissement complet des gousses basses"
    ],
    maladies: [
      { nom: "Mosaïque bactérienne du soja", remede: "Utilisation de semences certifiées par l'INRAB" }
    ],
    semencesCost: 7000,
    engraisCost: 6000,
    mainOeuvreCost: 12000
  },
  {
    nom: "Ananas Pain de Sucre d'Allada (Filière Phare d'Exportation)",
    cycle: "14 mois",
    rendementMoyen: 5.5,
    prixKgMoy: 150,
    periodeSemis: "Toute l'année (si système d'irrigation)",
    itineraire: [
      "Désinfection soignée des rejets au savon noir avant plantation",
      "Plantation à haute densité sur billons surélevés",
      "Criblage régulier et maintien de l'ombrage protecteur"
    ],
    maladies: [
      { nom: "Pourriture du coeur de l'apex", remede: "Utiliser un drainage parfait et pulvériser du savon noir dilué" }
    ],
    semencesCost: 25000,
    engraisCost: 35000,
    mainOeuvreCost: 18050
  },
  {
    nom: "Maïs Blanc Vivrier d'Élite AD3 (Grande Céréale Nationale)",
    cycle: "95 jours",
    rendementMoyen: 3.5,
    prixKgMoy: 290,
    periodeSemis: "Mars-Avril / Septembre-Octobre",
    itineraire: [
      "Labour mécanique suivi d'un billonnage bien aligné",
      "Application de l'engrais de fond NPK (15-15-15) au semis",
      "Sarclage précoce et buttage obligatoire au 30ème jour"
    ],
    maladies: [
      { nom: "Sclérosporiose / Mildiou du maïs", remede: "Semer des semences résistantes certifiées par l'INRAB" }
    ],
    semencesCost: 5500,
    engraisCost: 18000,
    mainOeuvreCost: 11000
  },
  {
    nom: "Riz irrigué de la Haute Vallée de l'Ouémé (Riz de Souveraineté)",
    cycle: "125 jours",
    rendementMoyen: 5.2,
    prixKgMoy: 410,
    periodeSemis: "Mai-Juin / Décembre (Contre-saison)",
    itineraire: [
      "Nivellement parfait des casiers rizicoles d'irrigation",
      "Repiquage en ligne de jeunes plants sains de 20 jours",
      "Maintien drastique de la lame d'eau et fertilisation azotée fractionnée"
    ],
    maladies: [
      { nom: "Pyriculariose foliaire", remede: "Éviter les excès d'azote et vaporiser du fongicide d'indigo bio" }
    ],
    semencesCost: 12000,
    engraisCost: 28000,
    mainOeuvreCost: 19000
  },
  {
    nom: "Manioc de Haute Qualité Allada (Agro-Transformation Gari & Amidon)",
    cycle: "10 mois",
    rendementMoyen: 4.8,
    prixKgMoy: 180,
    periodeSemis: "Mars à Mai",
    itineraire: [
      "Sélection stricte des boutures de 25-30 cm",
      "Plantation en biais de 45° sur de grands billons fertiles",
      "Deux sarclages précoces jusqu'à la fermeture de la canopée"
    ],
    maladies: [
      { nom: "Mosaïque africaine du manioc", remede: "Utilisation obligatoire de boutures saines certifiées INRAB" }
    ],
    semencesCost: 9000,
    engraisCost: 12000,
    mainOeuvreCost: 14000
  },
  {
    nom: "Igname Laboko de Savalou (Filière Tubercule Noble)",
    cycle: "8 mois",
    rendementMoyen: 3.2,
    prixKgMoy: 500,
    periodeSemis: "Novembre à Janvier",
    itineraire: [
      "Confection de buttes volumineuses enrichies en paille et litière",
      "Paillage immédiat du dôme de la butte pour garder l'humidité",
      "Tuteurage solide à l'apparition des premières lianes vertes"
    ],
    maladies: [
      { nom: "Pourriture sèche des tubercules", remede: "Poudrage généreux à la cendre de bois tamisée lors du semis" }
    ],
    semencesCost: 28000,
    engraisCost: 8000,
    mainOeuvreCost: 15000
  },
  {
    nom: "Tomate Maraîchère de Grand-Popo (Or Maraîcher Saisons Chaudes)",
    cycle: "80 jours",
    rendementMoyen: 4.2,
    prixKgMoy: 450,
    periodeSemis: "Toute l'année sous serre ou paillis",
    itineraire: [
      "Pépinière soignée sous ombrière biologique",
      "Repiquage des plants vigoureux espacés de 50 cm",
      "Tuteurage et taille des gourmands pour canaliser l'énergie"
    ],
    maladies: [
      { nom: "Flétrissement bactérien (Ralstonia)", remede: "Respecter la rotation des cultures (pas de Solanacées deux fois de suite)" }
    ],
    semencesCost: 11000,
    engraisCost: 21000,
    mainOeuvreCost: 16000
  },
  {
    nom: "Piment Rouge Habanero Adjarra (Culture Forte Périurbaine)",
    cycle: "90 jours",
    rendementMoyen: 2.9,
    prixKgMoy: 600,
    periodeSemis: "Avril-Mai / Septembre",
    itineraire: [
      "Préparation de planches maraîchères très bien drainées",
      "Incorporation riche en fumier de bovin mûr (15 tonnes/ha)",
      "Arrosage régulier goutte-à-goutte matinal"
    ],
    maladies: [
      { nom: "Flétrissement fusarien", remede: "Garantir un drainage parfait pour empêcher l'asphyxie et la moisissure" }
    ],
    semencesCost: 8500,
    engraisCost: 15000,
    mainOeuvreCost: 12500
  },
  {
    nom: "Oignon Jaune de Galmi de Kandi (Filière Oignon Nord Bénin)",
    cycle: "120 jours",
    rendementMoyen: 3.9,
    prixKgMoy: 520,
    periodeSemis: "Octobre à Décembre",
    itineraire: [
      "Production rigoureuse de plants en pépinière aérée",
      "Repiquage sur de grandes planches plates sans stagnation",
      "Irrigation programmée et arrêt complet 15 jours avant récolte"
    ],
    maladies: [
      { nom: "Fusariose / Rot du bulbe", remede: "Séchage parfait au champ tête en bas après arrachage" }
    ],
    semencesCost: 14000,
    engraisCost: 16500,
    mainOeuvreCost: 11000
  },
  {
    nom: "Carotte Orange de Grand-Popo (Maraîchage des Sables)",
    cycle: "90 jours",
    rendementMoyen: 3.6,
    prixKgMoy: 480,
    periodeSemis: "Novembre à Février",
    itineraire: [
      "Préparation d'un sable limoneux fin dénué de cailloux",
      "Semis fin en lignes distantes de 20 cm",
      "Éclaircissage rigoureux pour laisser 5 cm entre chaque carotte"
    ],
    maladies: [
      { nom: "Nématodes de racines", remede: "Planter des œillets d'Inde (Tagetes) en alternance ou en inter-culture" }
    ],
    semencesCost: 9500,
    engraisCost: 14000,
    mainOeuvreCost: 12000
  },
  {
    nom: "Laitue horticole d'élite de Cotonou (Filière Horticole Fraîche)",
    cycle: "45 jours",
    rendementMoyen: 2.5,
    prixKgMoy: 400,
    periodeSemis: "Toute l'année",
    itineraire: [
      "Confection de billons plats sur litière végétale de compost",
      "Repiquage précoce sous voile ou ombrière de protection",
      "Arrosage fin biquotidien et binage de surface hebdomadaire"
    ],
    maladies: [
      { nom: "Pourriture du collet", remede: "Pulvériser une infusion de feuilles de mélisse et de neem bio" }
    ],
    semencesCost: 6500,
    engraisCost: 10000,
    mainOeuvreCost: 9000
  },
  {
    nom: "Bananier Plantain Kétou (Filière Fruitière de Rente)",
    cycle: "11 mois",
    rendementMoyen: 5.8,
    prixKgMoy: 350,
    periodeSemis: "Au démarrage de la grande saison pluvieuse",
    itineraire: [
      "Trouaison géante de 60x60x60 cm enrichie de compost organique",
      "Habillage du rejet baïonnette avant repiquage",
      "Garantie d'une litière permanente de paillage des troncs"
    ],
    maladies: [
      { nom: "Charançon du bananier", remede: "Trempage préventif du bulbe dans de l'eau tiède argileuse au neem" }
    ],
    semencesCost: 18000,
    engraisCost: 19000,
    mainOeuvreCost: 13500
  },
  {
    nom: "Gombo Vert Maraîcher Lokossa (Filière Légumière)",
    cycle: "70 jours",
    rendementMoyen: 2.8,
    prixKgMoy: 420,
    periodeSemis: "Avril à Juillet",
    itineraire: [
      "Trempage des petites graines 24h avant le semis direct",
      "Semis en poquets distants de 60 cm sur sol chaud",
      "Récolte régulière tous les deux jours dès l'apparition des fruits tendres"
    ],
    maladies: [
      { nom: "Oïdium des feuilles", remede: "Traiter à l'aide d'un mélange dilué de bicarbonate de soude" }
    ],
    semencesCost: 5000,
    engraisCost: 11000,
    mainOeuvreCost: 9500
  },
  {
    nom: "Arachide Dorée de Parakou (Filière Oléagineuse)",
    cycle: "95 jours",
    rendementMoyen: 2.2,
    prixKgMoy: 550,
    periodeSemis: "Mai à Juillet",
    itineraire: [
      "Labour superficiel meuble pour faciliter le gonflement",
      "Semis manuel à plat à 5 cm de profondeur",
      "Buttage léger à la floraison pour accompagner la pénétration des piquets"
    ],
    maladies: [
      { nom: "Rostre foliaire / Mosaïque", remede: "Pratiquer un encadrement des cultures et éliminer les plants malades" }
    ],
    semencesCost: 7500,
    engraisCost: 8500,
    mainOeuvreCost: 10500
  },
  {
    nom: "Palmier à huile Sélection Premium IRAD (Or Rouge Territorial)",
    cycle: "3 ans d'entrée en production",
    rendementMoyen: 6.5,
    prixKgMoy: 120,
    periodeSemis: "Mai (repiquage précoce)",
    itineraire: [
      "Sélection stricte des plants de palmeraies améliorés de l'INRAB",
      "Trouaison soignée avec engrais potassique de fond de cuve",
      "Gestion optimale du couvert végétal intercalaire de soja ou arachide"
    ],
    maladies: [
      { nom: "Fusariose vasculaire", remede: "Utiliser des cultivars résistants clonaux produits de l'INRAB" }
    ],
    semencesCost: 22000,
    engraisCost: 24000,
    mainOeuvreCost: 17000
  }
];

SPECIAL_CULTURES.forEach(c => {
  if (!seenCultureNames.has(c.nom)) {
    seenCultureNames.add(c.nom);
    ALL_BENIN_CULTURES.push(c);
  }
});

const ALL_BENIN_ELEVAGES: SpeculationElevage[] = [];
const seenElevageNames = new Set<string>();
ZONES_AGRECOLOGIQUES_BENIN.forEach(zone => {
  zone.elevages.forEach(e => {
    if (!seenElevageNames.has(e.nom)) {
      seenElevageNames.add(e.nom);
      ALL_BENIN_ELEVAGES.push(e);
    }
  });
});

const ALL_BENIN_TRANSFORMATIONS: SpeculationTransformation[] = [];
const seenTransNames = new Set<string>();
ZONES_AGRECOLOGIQUES_BENIN.forEach(zone => {
  zone.transformations.forEach(t => {
    if (!seenTransNames.has(t.nom)) {
      seenTransNames.add(t.nom);
      ALL_BENIN_TRANSFORMATIONS.push(t);
    }
  });
});

interface CalculatorPanelProps {
  onTriggerAgribotDoc: (prompt: string) => void;
  selectedDepartment?: string;
  setSelectedDepartment?: (dept: string) => void;
  zonesList?: any[];
}

export default function CalculatorPanel({ 
  onTriggerAgribotDoc,
  selectedDepartment,
  setSelectedDepartment,
  zonesList
}: CalculatorPanelProps) {
  // If props are passed, use them, otherwise fallback to local state
  const [localDept, setLocalDept] = useState<string>("Plateau");
  const selectedDept = selectedDepartment || localDept;
  const setSelectedDept = setSelectedDepartment || setLocalDept;

  const [calcTab, setCalcTab] = useState<"vegetal" | "animal" | "transformation_alimentaire" | "cosmetiques">("vegetal");

  // Custom user overrides for manual filling as requested
  const [customCommune, setCustomCommune] = useState<string>("Savalou");
  const [customSpeculation, setCustomSpeculation] = useState<string>("");

  // Additional advanced parameters for index calculations
  const [fertilityType, setFertilityType] = useState<"songhai" | "alluvionnaire" | "lateritique" | "NPK">("songhai");
  const [irrigationType, setIrrigationType] = useState<"goutte" | "manuel" | "pluviale">("goutte");

  const currentZone = zonesList 
    ? (zonesList.find(z => z.departements.includes(selectedDept)) || getZoneByDepartment(selectedDept)) 
    : getZoneByDepartment(selectedDept);

  // --- TAB 1: CULTURE INPUTS ---
  const [cultureIndex, setCultureIndex] = useState<number>(0);
  const [surfaceM2, setSurfaceM2] = useState<number>(500);
  const [customYield, setCustomYield] = useState<number>(3.8); // kg/m²
  const [customPrice, setCustomPrice] = useState<number>(550); // F CFA/kg
  const [customSeedCost, setCustomSeedCost] = useState<number>(9000); // 500m² reference
  const [customEngraisCost, setCustomEngraisCost] = useState<number>(22000);
  const [customLaborCost, setCustomLaborCost] = useState<number>(14000);
  const [cropLossRate, setCropLossRate] = useState<number>(5); // % default

  // --- TAB 2: ELEVAGE INPUTS ---
  const [elevageIndex, setElevageIndex] = useState<number>(0);
  const [stockSize, setStockSize] = useState<number>(500); // headcount
  const [animalLossRate, setAnimalLossRate] = useState<number>(8); // %
  const [animalUnitBuyPrice, setAnimalUnitBuyPrice] = useState<number>(650);
  const [animalUnitSellPrice, setAnimalUnitSellPrice] = useState<number>(3800);
  const [animalFeedSoinCost, setAnimalFeedSoinCost] = useState<number>(450000); // standard reference cost
  const [animalLaborCost, setAnimalLaborCost] = useState<number>(50000);
  const [animalWeightSold, setAnimalWeightSold] = useState<number>(2.1); // kg or pieces sold

  // --- TAB 3: TRANSFORMATION INPUTS ---
  const [transformIndex, setTransformIndex] = useState<number>(0);
  const [rawQtyKg, setRawQtyKg] = useState<number>(1000); // 1 Ton raw inputs
  const [rawPrPerKg, setRawPrPerKg] = useState<number>(95);
  const [transYieldPercent, setTransYieldPercent] = useState<number>(22);
  const [transPackCost, setTransPackCost] = useState<number>(30000);
  const [transFuelCost, setTransFuelCost] = useState<number>(20000);
  const [transLaborCost, setTransLaborCost] = useState<number>(35000);
  const [transSellPrKg, setTransSellPrKg] = useState<number>(480);

  // --- RETRIEVE NATIONAL VS. LOCAL LISTS ---
  const [useNationalCatalog, setUseNationalCatalog] = useState<boolean>(true);

  const activeCulturesList = useNationalCatalog ? ALL_BENIN_CULTURES : currentZone.cultures;
  const activeElevagesList = useNationalCatalog ? ALL_BENIN_ELEVAGES : currentZone.elevages;
  const activeTransList = useNationalCatalog ? ALL_BENIN_TRANSFORMATIONS : currentZone.transformations;

  // Synchronise sub-inputs when Department, Tab, Index, or Catalog Source changes
  useEffect(() => {
    if (calcTab === "vegetal") {
      const activeCulture = activeCulturesList[cultureIndex] || activeCulturesList[0];
      if (activeCulture) {
        setCustomYield(activeCulture.rendementMoyen);
        setCustomPrice(activeCulture.prixKgMoy);
        setCustomSeedCost(activeCulture.semencesCost);
        setCustomEngraisCost(activeCulture.engraisCost);
        setCustomLaborCost(activeCulture.mainOeuvreCost);
      }
    } else if (calcTab === "animal") {
      const activeElevage = activeElevagesList[elevageIndex] || activeElevagesList[0];
      if (activeElevage) {
        setStockSize(activeElevage.tailleOptionelle);
        setAnimalLossRate(activeElevage.mortaliteType);
        setAnimalUnitBuyPrice(activeElevage.prixAchatUnitaire);
        setAnimalUnitSellPrice(activeElevage.prixVenteUnitaire);
        setAnimalFeedSoinCost(activeElevage.alimentSoinCost);
        setAnimalLaborCost(activeElevage.mainOeuvreCost);
        setAnimalWeightSold(activeElevage.poidsVenteMoyen);
      }
    } else {
      const activeTrans = activeTransList[transformIndex] || activeTransList[0];
      if (activeTrans) {
        setRawPrPerKg(activeTrans.prixMatiereBruteKg);
        setTransYieldPercent(activeTrans.rendementPercent);
        setTransPackCost(activeTrans.packagingCost);
        setTransFuelCost(activeTrans.machineryCost);
        setTransLaborCost(activeTrans.laborCost);
        setTransSellPrKg(activeTrans.prixVenteKg);
      }
    }
  }, [selectedDept, calcTab, cultureIndex, elevageIndex, transformIndex, useNationalCatalog]);

  // Handle active spec list resets on tab switch, department change, or catalog scope switch
  useEffect(() => {
    setCultureIndex(0);
    setElevageIndex(0);
    setTransformIndex(0);
  }, [calcTab, selectedDept, useNationalCatalog]);

   // Selected speculation labels
   const activeCultureName = customSpeculation.trim() || activeCulturesList[cultureIndex]?.nom || "Culture";
   const activeElevageName = customSpeculation.trim() || activeElevagesList[elevageIndex]?.nom || "Élevage";
   const activeTransName = customSpeculation.trim() || activeTransList[transformIndex]?.nom || "Transformation / Cosmétique";

  // --- CORE SYSTEM EQUATIONS & METRICS (PRORATED TO SCALE) ---
  
  // High fidelity index factors Formulation
  const fertilityYieldMult = 
    fertilityType === "songhai" ? 1.25 :
    fertilityType === "alluvionnaire" ? 1.15 :
    fertilityType === "lateritique" ? 0.70 : 1.0;

  const fertilityFertMult = 
    fertilityType === "songhai" ? 0.80 :
    fertilityType === "alluvionnaire" ? 0.90 :
    fertilityType === "lateritique" ? 1.20 : 1.40;

  const irrigationLossMult = 
    irrigationType === "goutte" ? 0.5 :
    irrigationType === "manuel" ? 1.0 : 1.8;

  // Tab 1: Vegetable calculations
  const theoreticalYieldTotalKg = surfaceM2 * customYield * fertilityYieldMult;
  const effectiveCropLossRate = Math.min(100, Math.max(0, cropLossRate * irrigationLossMult));
  const cropLossKg = (theoreticalYieldTotalKg * effectiveCropLossRate) / 100;
  const cleanYieldTotalKg = Math.max(0, theoreticalYieldTotalKg - cropLossKg);
  const vegetalTotalRevenue = cleanYieldTotalKg * customPrice;
  
  // Prorated costs: active values are formulated for a benchmark of 500m²
  const scaleRatioVeg = surfaceM2 / 500;
  const prSeedCost = Math.round(customSeedCost * scaleRatioVeg);
  const prEngraisCost = Math.round(customEngraisCost * scaleRatioVeg * fertilityFertMult);
  const prLaborCost = Math.round(customLaborCost * scaleRatioVeg);
  const vegetalTotalExpenses = prSeedCost + prEngraisCost + prLaborCost;
  const vegetalNetGain = vegetalTotalRevenue - vegetalTotalExpenses;
  const vegetalMarginPercent = vegetalTotalRevenue > 0 ? Math.round((vegetalNetGain / vegetalTotalRevenue) * 105) : 0; // optimized scaled yield marge
  const finalVegetalMarginPercent = Math.min(99, Math.max(-100, vegetalMarginPercent));
  
  // Break even calculation
  const breakEvenVegKg = customPrice > 0 ? Math.ceil(vegetalTotalExpenses / customPrice) : 0;
  const breakEvenVegM2 = (customPrice * customYield * fertilityYieldMult * (1 - effectiveCropLossRate / 100)) > 0 
    ? Math.ceil(vegetalTotalExpenses / (customPrice * customYield * fertilityYieldMult * (1 - effectiveCropLossRate / 100))) 
    : 0;

  // Tab 2: Animal husbandry calculations
  const activeElevRef = activeElevagesList[elevageIndex] || { tailleOptionelle: 500 };
  const scaleRatioAni = stockSize / activeElevRef.tailleOptionelle;
  const animalBiosecureFeedMult = fertilityType === "songhai" ? 0.80 : (fertilityType === "lateritique" ? 1.20 : 1.0);
  const effectiveLossRateAni = fertilityType === "songhai" ? Math.max(1, animalLossRate - 4) : (fertilityType === "lateritique" ? animalLossRate + 3 : animalLossRate);

  const aniDeadHeadcount = Math.ceil((stockSize * effectiveLossRateAni) / 100);
  const aniSurvivingHeadcount = Math.max(0, stockSize - aniDeadHeadcount);
  const animalTotalRevenue = aniSurvivingHeadcount * animalUnitSellPrice;
  
  const prBuyCost = stockSize * animalUnitBuyPrice;
  const prFeedSoinCost = Math.round(animalFeedSoinCost * scaleRatioAni * animalBiosecureFeedMult);
  const prAniLaborCost = Math.round(animalLaborCost * scaleRatioAni);
  const animalTotalExpenses = prBuyCost + prFeedSoinCost + prAniLaborCost;
  const animalNetGain = animalTotalRevenue - animalTotalExpenses;
  const animalMarginPercent = animalTotalRevenue > 0 ? Math.round((animalNetGain / animalTotalRevenue) * 100) : 0;
  const breakEvenAniUnits = animalUnitSellPrice > 0 ? Math.ceil(animalTotalExpenses / animalUnitSellPrice) : 0;

  // Tab 3: Transformation / Cosmetics calculations
  // Prorated costs: active values formulated for a benchmark of 1000kg (1 Tonne)
  const scaleRatioTrans = rawQtyKg / 1000;
  const rawMaterialCost = rawQtyKg * rawPrPerKg;
  const prPackCost = Math.round(transPackCost * scaleRatioTrans);
  const transFeedMult = fertilityType === "songhai" ? 0.90 : 1.0;
  const prFuelCost = Math.round(transFuelCost * scaleRatioTrans * transFeedMult);
  const prTransLaborCost = Math.round(transLaborCost * scaleRatioTrans);
  
  const transformTotalExpenses = rawMaterialCost + prPackCost + prFuelCost + prTransLaborCost;
  const outFiniQtyKg = rawQtyKg * (transYieldPercent / 100);
  const transformTotalRevenue = outFiniQtyKg * transSellPrKg;
  const transformNetGain = transformTotalRevenue - transformTotalExpenses;
  const transformMarginPercent = transformTotalRevenue > 0 ? Math.round((transformNetGain / transformTotalRevenue) * 100) : 0;
  
  const yieldRatioFinished = transYieldPercent / 100;
  const breakEvenTransRawKg = (transSellPrKg * yieldRatioFinished) > 0 
    ? Math.ceil(transformTotalExpenses / (transSellPrKg * yieldRatioFinished)) 
    : 0;

  // --- SIMULATION OF 12-MONTH PREVISIONNAL CASH FLOWS TIMELINE ---
  const generate12MonthCashflow = () => {
    const months = Array.from({ length: 12 }, (_, i) => `Mois ${i + 1}`);
    const values: Array<{ label: string; outgoing: number; incoming: number; balance: number }> = [];
    
    // Cycle months calculation
    let cycleLengthMonths = 3; // default tomato
    let totalInvest = 100000;
    let revenueFinal = 150000;

    if (calcTab === "vegetal") {
      const activeCulture = activeCulturesList[cultureIndex] || activeCulturesList[0];
      const cycleStr = activeCulture?.cycle || "3 mois";
      const matches = cycleStr.match(/\d+/);
      cycleLengthMonths = matches ? parseInt(matches[0]) : 3;
      // capped bounds
      if (cycleLengthMonths < 1) cycleLengthMonths = 1;
      if (cycleLengthMonths > 12) cycleLengthMonths = 12;

      totalInvest = vegetalTotalExpenses;
      revenueFinal = vegetalTotalRevenue;
    } else if (calcTab === "animal") {
      const activeElv = activeElevagesList[elevageIndex] || activeElevagesList[0];
      const cycleStr = activeElv?.cycle || "45 jours";
      cycleLengthMonths = cycleStr.includes("jour") ? 2 : 7; // poultry 2m, mammals ~7m

      totalInvest = animalTotalExpenses;
      revenueFinal = animalTotalRevenue;
    } else {
      cycleLengthMonths = 1; // transformation is near-instantaneous
      totalInvest = transformTotalExpenses;
      revenueFinal = transformTotalRevenue;
    }

    // Distribute expenses: 70% in Month 1, 30% split across subsequent growth months
    const month1Expenses = Math.round(totalInvest * 0.70);
    const splitExpenses = cycleLengthMonths > 1 ? Math.round((totalInvest * 0.30) / (cycleLengthMonths - 1)) : 0;

    let cumulativeCash = 0;

    for (let m = 1; m <= 12; m++) {
      let outgoing = 0;
      let incoming = 0;

      // In the first band (months 1 to cycleLengthMonths)
      if (m === 1) {
        outgoing += month1Expenses;
      } else if (m < cycleLengthMonths) {
        outgoing += splitExpenses;
      } else if (m === cycleLengthMonths) {
        outgoing += splitExpenses;
        incoming += revenueFinal; // Harvest revenue inflow!
      }

      // If cycle is short, simulate a SECOND band!
      const secondCycleStart = cycleLengthMonths + 1;
      const secondCycleEnd = cycleLengthMonths * 2;
      if (secondCycleEnd <= 12) {
        if (m === secondCycleStart) {
          outgoing += month1Expenses;
        } else if (m > secondCycleStart && m < secondCycleEnd) {
          outgoing += splitExpenses;
        } else if (m === secondCycleEnd) {
          outgoing += splitExpenses;
          incoming += revenueFinal;
        }
      }

      // If third band fits
      const thirdCycleStart = secondCycleEnd + 1;
      const thirdCycleEnd = cycleLengthMonths * 3;
      if (thirdCycleEnd <= 12) {
        if (m === thirdCycleStart) {
          outgoing += month1Expenses;
        } else if (m > thirdCycleStart && m < thirdCycleEnd) {
          outgoing += splitExpenses;
        } else if (m === thirdCycleEnd) {
          outgoing += splitExpenses;
          incoming += revenueFinal;
        }
      }

      cumulativeCash += (incoming - outgoing);
      values.push({
        label: `Mois ${m}`,
        outgoing,
        incoming,
        balance: cumulativeCash
      });
    }

    return values;
  };

  const cashFlowTimeline = generate12MonthCashflow();

  // --- SIMULATION OF 12-MONTH PREVISIONNAL CASH FLOWS TIMELINE ---

  // --- COMPILING GRAPH TO PROMPT REDIRECT ---
  const handleCompileWithAgriBot = () => {
    let formattedPrompt = "";
    if (calcTab === "vegetal") {
      formattedPrompt = `Bonjour Agribot IA 🧠. J'ai utilisé la super calculette agronomique pour mon projet maraîcher :
- Spéculation : ${activeCultureName}
- Département d'exploitation : ${selectedDept} (Zone ${currentZone.zone_id} : ${currentZone.nom})
- Sol d'exploitation : ${currentZone.sols}
- Pluviométrie correspondante : ${currentZone.pluviometrie}
- Surface mise en valeur : ${surfaceM2} m² (avec prévision de ${cropLossRate}% de pertes d'infestation)
- Rendement prévu : ${cleanYieldTotalKg.toFixed(1)} kg final commercialisables
- Prix unitaire fixé de vente au marché local : ${customPrice} F CFA / kg
- Chiffre d'Affaires estimé : ${vegetalTotalRevenue.toLocaleString()} F CFA
- Mes charges au prorata :
  * Semences robustes certifiées : ${prSeedCost.toLocaleString()} F CFA
  * Engrais organiques / Biochar : ${prEngraisCost.toLocaleString()} F CFA
  * Main d'œuvre de sarclage : ${prLaborCost.toLocaleString()} F CFA
- Mes charges cumulées s'élèvent à : ${vegetalTotalExpenses.toLocaleString()} F CFA.
- Bénéfice net attendu : ${vegetalNetGain.toLocaleString()} F CFA (${vegetalMarginPercent}% de rentabilité nette).
- Mon Seuil de Rentabilité s'établit à ${breakEvenVegKg} kg récoltés, soit une surface critique de ${breakEvenVegM2} m².

Veuillez m'établir une étude prospective financière complète de 12 mois sous forme de tableau Markdown ainsi qu'un plan de trésorerie de secours pour atténuer les infestations climatiques.`;
    } else if (calcTab === "animal") {
      formattedPrompt = `Bonjour Agribot IA 🧠. Voici ma comptabilité d'élevage tirée de la super calculette :
- Spéculation : ${activeElevageName} au département de ${selectedDept}
- Zone de Climat : ${currentZone.climat} (Sols : ${currentZone.sols})
- Taille initiale du cheptel : ${stockSize} têtes
- Taux de mortalité estimé de sécurité : ${animalLossRate}%
- Animaux survivants vendus : ${aniSurvivingHeadcount} têtes à un prix unitaire de ${animalUnitSellPrice} F CFA
- Chiffre d'affaires total : ${animalTotalRevenue.toLocaleString()} F CFA
- Mes charges au prorata :
  * Achat de l'élevage originel : ${prBuyCost.toLocaleString()} F CFA
  * Alimentation, compléments Songhaï et soins vétérinaires : ${prFeedSoinCost.toLocaleString()} F CFA
  * Main d'œuvre d'entretien de loges : ${prAniLaborCost.toLocaleString()} F CFA
- Cumul total des dépenses d'élevage : ${animalTotalExpenses.toLocaleString()} F CFA.
- Marge bénéficiaire nette : ${animalNetGain.toLocaleString()} F CFA (degré de profitabilité de ${animalMarginPercent}%).
- Seuil de rentabilité : Je dois pérenniser la survie de ${breakEvenAniUnits} animaux pour couvrir l'intégralité de mes charges.

Faites-moi une analyse critique de rentabilité de cette exploitation de volaille/mammifères et suggérez-moi des techniques d'affouragement ou d'alimentation à base de tourteaux locaux ( palmiste, soja, manioc) pour diviser par deux mes coûts alimentaires.`;
    } else {
      formattedPrompt = `Bonjour Agribot IA 🧠. Voici les comptes de ma ligne d'extraction de cosmétiques/transformation :
- Ligne : ${activeTransName} engagée à ${selectedDept}
- Matière première : ${rawQtyKg} kg de ${activeTransList[transformIndex]?.matierePremiere || "grain"} d'origine acheté à ${rawPrPerKg} F CFA / kg
- Rendement d'extraction sec : ${transYieldPercent}% (soit ${outFiniQtyKg.toFixed(1)} kg de dérivés secs)
- Vente du dérivé fini calculée à : ${transSellPrKg} F CFA / kg
- Recettes générées : ${transformTotalRevenue.toLocaleString()} F CFA
- Frais engagés :
  * Achat de la matière première brute : ${rawMaterialCost.toLocaleString()} F CFA
  * Conditionnement flaconnage / Emballage biodégradable : ${prPackCost.toLocaleString()} F CFA
  * Amortissement, presses hydrauliques et combustible : ${prFuelCost.toLocaleString()} F CFA
  * Ouvriers de pressage / tri décorticage : ${prTransLaborCost.toLocaleString()} F CFA
- Total de mes investissements : ${transformTotalExpenses.toLocaleString()} F CFA.
- Bénéfice sec restant : ${transformNetGain.toLocaleString()} F CFA (${transformMarginPercent}% de profit).
- Seuil d'exploitation critique : minimum ${breakEvenTransRawKg} kg de brut à acquérir.

Veuillez m'imaginer un plan d'affaires pour commercialiser ce dérivé à Cotonou et obtenir des labels qualités biologiques.`;
    }

    onTriggerAgribotDoc(formattedPrompt);
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-500/25">
              <Calculator className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-black font-display uppercase tracking-widest text-emerald-400">
                🧮 Super Calculette d'Exploitation Bénin
              </h2>
              <p className="text-[11px] text-zinc-400 mt-1">
                Calculez instantanément les charges proratisées, marges nettes, seuils de rentabilité et finances 12 mois.
              </p>
            </div>
          </div>

           {/* Department dropdown select */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-2xl w-full sm:w-auto shadow-inner">
            <span className="text-xs text-zinc-300 font-bold font-mono uppercase tracking-wider shrink-0">📍 Territoire :</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-900 border border-emerald-500/40 text-xs font-black text-emerald-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 hover:border-emerald-500 cursor-pointer shadow-3xs outline-none"
            >
              {ALL_BENIN_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900 text-white">{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Area Characteristics auto-fll context badge */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-zinc-300">
          <div>
            <span className="text-[9px] uppercase font-black text-zinc-500 block">Zone d'Impact</span>
            <span className="text-emerald-300 font-extrabold uppercase">{currentZone.zone_id} ({currentZone.nom})</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-black text-zinc-500 block">Nature des Sols</span>
            <span>{currentZone.sols}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-black text-zinc-500 block">Précipitations auto-filled</span>
            <span className="text-teal-300 font-bold">{currentZone.pluviometrie}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-black text-zinc-500 block">Indice de fertilité</span>
            <span className="bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded leading-none text-[9.5px] font-bold">ExcellentSonghaï</span>
          </div>
        </div>
      </div>

      {/* Tabs list selectors */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setCalcTab("vegetal")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            calcTab === "vegetal" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-white/50"
          }`}
        >
          🌾 Maraîchage & Végétal
        </button>
        <button
          onClick={() => setCalcTab("animal")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            calcTab === "animal" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-white/50"
          }`}
        >
          🐓 Production Animale
        </button>
        <button
          onClick={() => setCalcTab("transformation_alimentaire")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            calcTab === "transformation_alimentaire" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-white/50"
          }`}
        >
          🌽 Transformation Alimentaire
        </button>
        <button
          onClick={() => setCalcTab("cosmetiques")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            calcTab === "cosmetiques" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-white/50"
          }`}
        >
          💄 Cosmétiques & Soins
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main calculation Inputs Form element */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-5 space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 bg-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-spin shrink-0" />
              <h3 className="text-xs font-black font-display uppercase tracking-widest text-slate-800">
                Paramètres d'Exploitation Réelle
              </h3>
            </div>
            
            {/* Catalog Switch Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-4xs shrink-0">
              <button
                type="button"
                onClick={() => setUseNationalCatalog(false)}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-extrabold tracking-wider transition cursor-pointer ${
                  !useNationalCatalog ? "bg-white text-slate-800 shadow-3xs border border-slate-200/50" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                📍 Territorial ({selectedDept})
              </button>
              <button
                type="button"
                onClick={() => setUseNationalCatalog(true)}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-extrabold tracking-wider transition cursor-pointer flex items-center gap-1 ${
                  useNationalCatalog ? "bg-emerald-600 text-white shadow-3xs text-white" : "text-slate-500 hover:text-emerald-800"
                }`}
              >
                <span>🌍 Catalogue National</span>
                <span className="bg-white/20 text-white text-[8px] px-1 py-0.25 rounded-md font-mono">Bénin</span>
              </button>
            </div>
          </div>

          {/* Saisie Manuelle Commune & Spéculation (User-Friendly Overrides) */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10.5px] font-black text-slate-700 mb-1 uppercase tracking-wider font-mono">📍 Commune de production (Saisie Manuelle) :</label>
              <input
                type="text"
                placeholder="Ex: Cotonou, Savalou, Djidja, Kandi, Banikoara..."
                className="w-full px-3 py-2 border border-[#10b981]/20 rounded-xl text-xs bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={customCommune}
                onChange={(e) => setCustomCommune(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-black text-slate-700 mb-1 uppercase tracking-wider font-mono">✍️ Nom de votre propre Spéculation :</label>
              <input
                type="text"
                placeholder="Ex: Tomate Cobra, Porcs de race, Beurre de Karité cosmétique..."
                className="w-full px-3 py-2 border border-[#10b981]/20 rounded-xl text-xs bg-white font-mono font-bold text-emerald-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={customSpeculation}
                onChange={(e) => setCustomSpeculation(e.target.value)}
              />
              <span className="text-[9.5px] text-slate-500 italic mt-1 block">Saisissez la spéculation de votre choix pour tous vos calculs de rentabilité.</span>
            </div>
          </div>

          {calcTab === "vegetal" && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Surface exploitée (m²) :</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    value={surfaceM2}
                    onChange={(e) => setSurfaceM2(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Taux de perte estimé (%) :</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                    value={cropLossRate}
                    onChange={(e) => setCropLossRate(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Rendement de référence (kg/m²) :</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                    value={customYield}
                    onChange={(e) => setCustomYield(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Prix moyen local (F CFA/kg) :</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-550 block font-mono">Saisi des coûts de base (pour 500m²)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Semenceales :</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1.5 border rounded-lg text-xs font-mono"
                      value={customSeedCost}
                      onChange={(e) => setCustomSeedCost(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Engrais & Bio :</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1.5 border rounded-lg text-xs font-mono"
                      value={customEngraisCost}
                      onChange={(e) => setCustomEngraisCost(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Main d'œuvre :</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1.5 border rounded-lg text-xs font-mono"
                      value={customLaborCost}
                      onChange={(e) => setCustomLaborCost(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {calcTab === "animal" && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Taille de la bande (Sujets) :</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    value={stockSize}
                    onChange={(e) => setStockSize(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Mortalité estimée (%) :</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                    value={animalLossRate}
                    onChange={(e) => setAnimalLossRate(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Prix d'achat unitaire (F CFA/Sujet) :</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50"
                    value={animalUnitBuyPrice}
                    onChange={(e) => setAnimalUnitBuyPrice(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Prix de vente unitaire (F CFA/Sujet) :</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50"
                    value={animalUnitSellPrice}
                    onChange={(e) => setAnimalUnitSellPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-550 block font-mono">Frais Généraux (pour la bande témoin)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Alimentation Globale & Soins vétérinaires :</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                      value={animalFeedSoinCost}
                      onChange={(e) => setAnimalFeedSoinCost(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Main d'œuvre élevage :</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                      value={animalLaborCost}
                      onChange={(e) => setAnimalLaborCost(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {(calcTab === "transformation_alimentaire" || calcTab === "cosmetiques") && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantité matière première engagée (kg) :</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold bg-slate-50 focus:bg-white"
                    value={rawQtyKg}
                    onChange={(e) => setRawQtyKg(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Taux d'extraction final (%) :</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold bg-slate-50"
                    value={transYieldPercent}
                    onChange={(e) => setTransYieldPercent(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Prix d'achat matière brute (F CFA/kg) :</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50"
                    value={rawPrPerKg}
                    onChange={(e) => setRawPrPerKg(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Prix de vente du produit fini (F CFA/kg) :</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50"
                    value={transSellPrKg}
                    onChange={(e) => setTransSellPrKg(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-550 block font-mono">Frais Généraux d'extraction (pour 1tonne)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Emballages/Flacons :</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono text-slate-700 bg-white"
                      value={transPackCost}
                      onChange={(e) => setTransPackCost(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Combustible/Presse :</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono text-slate-700 bg-white"
                      value={transFuelCost}
                      onChange={(e) => setTransFuelCost(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Main d'œuvre ouvrière :</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono text-slate-700 bg-white"
                      value={transLaborCost}
                      onChange={(e) => setTransLaborCost(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Precautions indicators panel */}
          <div className="bg-yellow-50 border border-yellow-200/70 p-4 rounded-2xl flex gap-3 text-xs text-yellow-800 leading-relaxed font-sans">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <div>
              <strong>Calculs Proratisés de Sécurité (Songhaï Compte) :</strong> Les variables d'intrants et charges sont automatiquement formulées selon le ratio de la surface d'exploitation par rapport à la taille spécifiée standard de la zone {currentZone.zone_id} de {selectedDept}.
            </div>
          </div>
        </div>

        {/* Outflow / Profit forecast Summary Sidebar */}
        <div className="space-y-5">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl border border-slate-800 p-5 shadow-lg space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 font-mono">Bilan Prévisionnel</span>
              <h3 className="text-sm font-black text-white font-display uppercase tracking-tight mt-0.5">Rentabilité Projet</h3>
            </div>

            {/* Calculations outputs displays */}
            {calcTab === "vegetal" && (
              <div className="space-y-3.5 font-mono text-xs">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Chiffre d'Affaires brut :</span>
                  <span className="font-bold">{Math.round(theoreticalYieldTotalKg * customPrice).toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-rose-400">
                  <span>Perte climatique ({cropLossRate}%) :</span>
                  <span>- {Math.round(cropLossKg * customPrice).toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 border-t border-slate-800 pt-2 font-black text-sm">
                  <span>Recettes récolte (Inflow) :</span>
                  <span>{Math.round(vegetalTotalRevenue).toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Cœur Dépenses prorata :</span>
                  <span className="text-rose-300 font-bold">{vegetalTotalExpenses.toLocaleString()} F CFA</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center mt-3">
                  <div>
                    <span className="text-[8.5px] uppercase text-zinc-500 font-bold block font-sans">Profit Net d'une saison</span>
                    <strong className={`text-base font-black ${vegetalNetGain >= 0 ? "text-emerald-400" : "text-rose-500"}`}>{vegetalNetGain.toLocaleString()} F</strong>
                  </div>
                  <div className="bg-emerald-950 font-black text-emerald-450 px-2.5 py-1 rounded-xl text-[10.5px]">
                    {finalVegetalMarginPercent}% marges
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2 text-[10.5px] text-zinc-300 leading-snug">
                  <div className="font-extrabold uppercase text-[9px] tracking-wider text-slate-400 font-sans">Seuil de Rentabilité :</div>
                  <p>⚖️ Rendement critique : <strong>{breakEvenVegKg ? breakEvenVegKg.toLocaleString() : "0"} kg</strong></p>
                  <p>📐 Surface critique : <strong>{breakEvenVegM2 ? breakEvenVegM2.toLocaleString() : "0"} m²</strong></p>
                </div>
              </div>
            )}

            {calcTab === "animal" && (
              <div className="space-y-3.5 font-mono text-xs">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Achat originel cheptel :</span>
                  <span>{prBuyCost.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Alimentation & Soins :</span>
                  <span>{prFeedSoinCost.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Main d'œuvre d'élevage :</span>
                  <span>{prAniLaborCost.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-rose-450">
                  <span>Pertes mortalité ({animalLossRate}%) :</span>
                  <span>{aniDeadHeadcount} sujets</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 border-t border-slate-800 pt-2 font-black text-sm">
                  <span>Revenus d'écoulement :</span>
                  <span>{animalTotalRevenue.toLocaleString()} F</span>
                </div>
                
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center mt-3">
                  <div>
                    <span className="text-[8.5px] uppercase text-zinc-500 font-bold block font-sans">Bénéfice Net prévisionnel</span>
                    <strong className={`text-base font-black ${animalNetGain >= 0 ? "text-emerald-400" : "text-rose-500"}`}>{animalNetGain.toLocaleString()} F</strong>
                  </div>
                  <div className="bg-emerald-950 font-black text-emerald-450 px-2.5 py-1 rounded-xl text-[10.5px]">
                    {animalMarginPercent}% marge
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 text-[10.5px] text-zinc-300 space-y-1">
                  <div className="font-extrabold uppercase text-[9px] tracking-wider text-slate-400 font-sans">Seuil d'Écritures :</div>
                  <p>⚖️ Seuil critique de troupeau : <strong>{breakEvenAniUnits} têtes</strong> d'animaux matures vendus.</p>
                </div>
              </div>
            )}

            {(calcTab === "transformation_alimentaire" || calcTab === "cosmetiques") && (
              <div className="space-y-3.5 font-mono text-xs">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Achat brute matière ({rawQtyKg}kg) :</span>
                  <span>{rawMaterialCost.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Flacons & Emballage :</span>
                  <span>{prPackCost.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Presse & Combustible :</span>
                  <span>{prFuelCost.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 border-b border-slate-850 pb-2">
                  <span>Main d'œuvre ouvrière :</span>
                  <span>{prTransLaborCost.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 pt-1 font-black text-sm">
                  <span>Rendement dérivé :</span>
                  <span>{outFiniQtyKg.toFixed(1)} kg fini</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 font-black">
                  <span>Chiffre d'Affaires attendu :</span>
                  <span>{transformTotalRevenue.toLocaleString()} F</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center mt-3">
                  <div>
                    <span className="text-[8.5px] uppercase text-zinc-500 font-bold block font-sans">Profits Net d'extraction</span>
                    <strong className={`text-base font-black ${transformNetGain >= 0 ? "text-emerald-400" : "text-rose-500"}`}>{transformNetGain.toLocaleString()} F</strong>
                  </div>
                  <div className="bg-emerald-950 font-black text-emerald-450 px-2.5 py-1 rounded-xl text-[10.5px]">
                    {transformMarginPercent}% marge
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 text-[10.5px] text-zinc-300 space-y-1">
                  <div className="font-extrabold uppercase text-[9px] tracking-wider text-slate-400 font-sans">Seuil de Rentabilité :</div>
                  <p>⚖️ Seuil d'achat récolte requis : <strong>{breakEvenTransRawKg ? breakEvenTransRawKg.toLocaleString() : "0"} kg</strong> de matière de base brute.</p>
                </div>
              </div>
            )}
          </div>

          {/* AI compiler forward buttons */}
          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={handleCompileWithAgriBot}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-800 shadow-3xs"
            >
              <span>Vider sur Agribot IA 🧠 pour Business Plan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* simulated 12-MONTH PREVISIONNAL TRESORERIE TIMELINE DISPLAY TABLE AS MANDATED */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 bg-white">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
            <h3 className="text-xs font-black font-display uppercase tracking-widest text-slate-800">
              🗓️ Flux de Trésorerie Prévisionnel (Timeline sur 12 Mois)
            </h3>
          </div>
          <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-550 font-mono">Simulateur AgriBot IA</span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
          Cette timeline simule les entrées (Inflow) et sorties (Outflow) de trésorerie sur une année complète (12 mois). 
          Elle étale l'investissement de départ (70% des charges au Mois 1), puis répartit les dépenses d'entretien régulières de croissance jusqu'à la rentrée brut de récolte ou d'écoulement du cheptel (Mois d'échéance du cycle). Les cycles ultérieurs admissibles sont réinvestis automatiquement.
        </p>

        {/* Scrollable table container */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/50 shadow-3xs">
          <table className="w-full text-left text-xs font-mono border-collapse bg-slate-50/20">
            <thead>
              <tr className="bg-slate-150/40 text-slate-500 uppercase text-[9px] font-sans font-black tracking-wider border-b border-slate-200">
                <th className="p-3">Timeline</th>
                <th className="p-3 text-right">Dépenses (Outflow)</th>
                <th className="p-3 text-right">Recettes (Inflow)</th>
                <th className="p-3 text-right">Solde Net Mensuel</th>
                <th className="p-3 text-right">Trésorerie Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {cashFlowTimeline.map((item, idx) => {
                const isHarvestMonth = item.incoming > 0;
                const profitOrExp = item.incoming - item.outgoing;

                return (
                  <tr 
                    key={idx} 
                    className={`border-b border-slate-150 transition-colors ${
                      isHarvestMonth ? "bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950 font-bold" : "hover:bg-slate-50/50 text-slate-700"
                    }`}
                  >
                    <td className="p-2.5 font-bold font-sans flex items-center gap-1">
                      <span>{item.label}</span>
                      {isHarvestMonth && <span className="bg-emerald-600 text-white text-[8px] px-1.5 py-0.2 rounded font-mono uppercase">Vente</span>}
                    </td>
                    <td className="p-2.5 text-right text-rose-600">{item.outgoing > 0 ? `-${item.outgoing.toLocaleString()} F` : "0 F"}</td>
                    <td className="p-2.5 text-right text-emerald-600">{item.incoming > 0 ? `+${item.incoming.toLocaleString()} F` : "0 F"}</td>
                    <td className={`p-2.5 text-right ${profitOrExp >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                      {profitOrExp > 0 ? `+${profitOrExp.toLocaleString()} F` : (profitOrExp < 0 ? `${profitOrExp.toLocaleString()} F` : "0 F")}
                    </td>
                    <td className={`p-2.5 text-right font-black ${item.balance >= 0 ? "text-emerald-800" : "text-rose-700"}`}>
                      {item.balance.toLocaleString()} F CFA
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
