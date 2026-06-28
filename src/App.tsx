import React, { useState, useEffect, useMemo } from "react";
import { User, ChatMessage, Product, CVProfile, ProjectProposal, WeatherInfo, SolidarityDemand, SolidarityCandidature, AppelCandidature } from "./types";
import { 
  AGRICHANNELS, 
  BENIN_COMMUNES_WEATHER_PRESETS, 
  INITIAL_MARKET_PRICES,
  BENIN_DEPARTMENTS_COMMUNES,
  getCommuneWeather
} from "./data";
import AuthModal from "./components/AuthModal";
import AgriBotPanel from "./components/AgriBotPanel";
import AgriChatPanel from "./components/AgriChatPanel";
import CalculatorPanel from "./components/CalculatorPanel";
import FichesPanel from "./components/FichesPanel";
import { ZONES_AGRECOLOGIQUES_BENIN, SpeculationCulture } from "./data/agroData";
import DirectoryPanel from "./components/DirectoryPanel";
import MarketPanel from "./components/MarketPanel";
import SolidarityPanel from "./components/SolidarityPanel";
import FloatingWeatherBubble from "./components/FloatingWeatherBubble";
import AgriVideosPanel from "./components/AgriVideosPanel";
import { AdminMemberControl } from "./components/AdminMemberControl";

// Lucide Icons imports
import { 
  Leaf, 
  CloudSun, 
  MessageSquare, 
  BookOpen, 
  Calculator, 
  ShoppingBag, 
  Users, 
  Crown, 
  Sparkles, 
  Tv, 
  TrendingUp, 
  Phone, 
  Mail, 
  Info, 
  Bell, 
  Clock, 
  LogOut, 
  HelpCircle, 
  CheckCheck, 
  Unlock, 
  DollarSign,
  MapPin,
  ChevronRight,
  ChevronDown,
  Home,
  X,
  ArrowLeft,
  HeartHandshake,
  Shield,
  RefreshCw,
  Plus,
  PlusCircle,
  Music,
  Layout,
  Camera,
  Heart,
  FileText,
  Pencil,
  Flame,
  Eye,
  Menu,
  Sun,
  CloudRain,
  Lightbulb,
  UserCircle,
  Image as ImageIcon
} from "lucide-react";

// ================= THEMATIC COMMUNITY FEED ILLUSTRATIONS HELPER FUNCTIONS =================
function getFeedItemImage(item: any): string {
  if (item.image && typeof item.image === "string" && item.image.startsWith("http")) {
    return item.image;
  }
  
  const desc = (item.description || "").toLowerCase();
  if (desc.includes("tomate") || desc.includes("tomato") || desc.includes("maraîch")) {
    return "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=150";
  }
  if (desc.includes("piment") || desc.includes("pepper")) {
    return "https://images.unsplash.com/photo-1588252306573-6ac7a6858509?auto=format&fit=crop&q=80&w=150";
  }
  if (desc.includes("oignon") || desc.includes("onion")) {
    return "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=150";
  }
  if (desc.includes("maïs") || desc.includes("corn") || desc.includes("céréale")) {
    return "https://images.unsplash.com/photo-1551754626-7df704a57da4?auto=format&fit=crop&q=80&w=150";
  }
  if (desc.includes("riz") || desc.includes("rice")) {
    return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150";
  }
  if (item.type === "marketplace" || item.tab === "market" || item.type === "product") {
    return "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=150";
  }
  if (item.type === "recruitment_cv" || item.tab === "directory") {
    return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"; 
  }
  if (item.type === "recruitment_job") {
    return "https://images.unsplash.com/photo-1523301343968-6a6ebfc740ee?auto=format&fit=crop&q=80&w=150";
  }
  if (item.type === "solidarity" || item.tab === "solidarite") {
    return "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=150";
  }
  if (item.type === "ground_prices" || item.badge === "PRIX DU MARCHÉ") {
    return "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=150";
  }
  if (item.type === "maep_news") {
    return "https://images.unsplash.com/photo-1423450822405-fc5f617ae324?auto=format&fit=crop&q=80&w=150";
  }
  return "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&q=80&w=150";
}

function getFeedItemAvatar(item: any): string {
  if (item.avatarUrl && typeof item.avatarUrl === "string" && item.avatarUrl.startsWith("http")) {
    return item.avatarUrl;
  }
  if (item.avatar && typeof item.avatar === "string" && item.avatar.startsWith("http")) {
    return item.avatar;
  }
  const str = item.creator || item.subtitle || item.description || "Benin";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const portraits = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", 
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", 
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100", 
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100", 
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100", 
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
  ];
  return portraits[Math.abs(hash) % portraits.length];
}

interface MarketBourseProduct {
  emoji: string;
  name: string;
  price: number;
  unit: string;
  status: string;
  badgeClass: string;
}

function getDailyShuffledProducts(): MarketBourseProduct[] {
  const products: MarketBourseProduct[] = [
    { emoji: "🌽", name: "Maïs Blanc", price: 220, unit: "Kg", status: "SÉCURISÉ", badgeClass: "bg-emerald-500/12 text-[#2ecc71] border border-[#2ecc71]/25" },
    { emoji: "🍅", name: "Tomate Locale", price: 310, unit: "Kg", status: "SÉCURISÉ", badgeClass: "bg-emerald-500/12 text-[#2ecc71] border border-[#2ecc71]/25" },
    { emoji: "🌱", name: "Soja Graines", price: 420, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🥣", name: "Gari Fin", price: 360, unit: "Kg", status: "PIVOTANT", badgeClass: "bg-yellow-500/12 text-yellow-400 border border-yellow-500/25" },
    { emoji: "🧅", name: "Oignon Violet", price: 480, unit: "Kg", status: "SURVEILLÉ", badgeClass: "bg-red-500/12 text-red-400 border border-red-500/25" },
    { emoji: "🍠", name: "Igname Pilée", price: 250, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🥜", name: "Arachide Décortiquée", price: 650, unit: "Kg", status: "SURVEILLÉ", badgeClass: "bg-red-500/12 text-red-400 border border-red-500/25" },
    { emoji: "🌾", name: "Riz de la Vallée", price: 450, unit: "Kg", status: "SÉCURISÉ", badgeClass: "bg-emerald-500/12 text-[#2ecc71] border border-[#2ecc71]/25" },
    { emoji: "🍌", name: "Banane Plantain", price: 350, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🥔", name: "Manioc Tubercule", price: 150, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🌶️", name: "Piment Rouge", price: 550, unit: "Kg", status: "SURVEILLÉ", badgeClass: "bg-red-500/12 text-red-400 border border-red-500/25" },
    { emoji: "🍍", name: "Ananas Pain de Sucre", price: 300, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🥥", name: "Noix de Coco", price: 400, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🥚", name: "Œuf Frais", price: 90, unit: "Unité", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🐓", name: "Poulet Bicyclette", price: 3500, unit: "Unité", status: "SURVEILLÉ", badgeClass: "bg-red-500/12 text-red-400 border border-red-500/25" },
    { emoji: "🥩", name: "Viande de Bœuf", price: 2200, unit: "Kg", status: "SURVEILLÉ", badgeClass: "bg-red-500/12 text-red-400 border border-red-500/25" },
    { emoji: "🐟", name: "Poisson Fumé", price: 1800, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🥭", name: "Mangue Kent", price: 250, unit: "Kg", status: "PIVOTANT", badgeClass: "bg-yellow-500/12 text-yellow-400 border border-yellow-500/25" },
    { emoji: "🥬", name: "Amarante", price: 150, unit: "Botte", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🍈", name: "Papaye Solo", price: 200, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🥛", name: "Lait Frais (Peulh)", price: 800, unit: "Litre", status: "SURVEILLÉ", badgeClass: "bg-red-500/12 text-red-400 border border-red-500/25" },
    { emoji: "🍯", name: "Miel Sauvage", price: 3500, unit: "Litre", status: "SÉCURISÉ", badgeClass: "bg-emerald-500/12 text-[#2ecc71] border border-[#2ecc71]/25" },
    { emoji: "🌿", name: "Moringa Séché", price: 1200, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🍃", name: "Piment Vert (Aki)", price: 450, unit: "Kg", status: "STABLE", badgeClass: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { emoji: "🥜", name: "Noix de Cajou", price: 750, unit: "Kg", status: "SÉCURISÉ", badgeClass: "bg-emerald-500/12 text-[#2ecc71] border border-[#2ecc71]/25" }
  ];

  // Seeded random number generator based on the number of days since epoch (changes every 24h)
  const daysSinceEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  let seededVal = daysSinceEpoch || 1;
  const nextRandom = (): number => {
    seededVal = (seededVal * 9301 + 49297) % 233280;
    return seededVal / 233280;
  };

  const result = [...products];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export default function App() {
  // Authentication & session
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("agribot_active_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [marqueeSpeed, setMarqueeSpeed] = useState<number>(32);
  
  const [zonesList, setZonesList] = useState<any[]>(ZONES_AGRECOLOGIQUES_BENIN);

  const loadDynamicAgroData = async () => {
    try {
      const res = await fetch("/api/cultures");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.departements) {
          const updatedZones = ZONES_AGRECOLOGIQUES_BENIN.map(staticZone => {
            const deptNom = staticZone.departements[0];
            const fetchedDept = data.departements.find((d: any) => d.nom.toLowerCase() === deptNom.toLowerCase());
            
            if (fetchedDept) {
              const mappedCultures = fetchedDept.cultures.map((cult: any) => {
                const semHa = cult.couts?.semence_fcfa_ha || 0;
                const engHa = cult.couts?.engrais_fcfa_ha || 0;
                const laborHa = cult.couts?.main_oeuvre_fcfa_ha || 0;
                
                const output: SpeculationCulture = {
                  nom: cult.nom,
                  cycle: `${cult.cycle_jours} jours`,
                  rendementMoyen: cult.rendement_moyen_kg_m2,
                  prixKgMoy: cult.prix_vente_fcfa_kg,
                  periodeSemis: cult.periode_semis,
                  itineraire: cult.itineraire || [],
                  maladies: cult.maladies || [],
                  semencesCost: Math.round(semHa / 20),
                  engraisCost: Math.round(engHa / 20),
                  mainOeuvreCost: Math.round(laborHa / 20)
                };
                return output;
              });

              // Merge static and dynamic cultures to display ALL of them
              const mergedCultures = [...staticZone.cultures];
              mappedCultures.forEach((dynCult: any) => {
                const existingIdx = mergedCultures.findIndex(
                  c => c.nom.toLowerCase().trim() === dynCult.nom.toLowerCase().trim()
                );
                if (existingIdx !== -1) {
                  mergedCultures[existingIdx] = {
                    ...mergedCultures[existingIdx],
                    ...dynCult
                  };
                } else {
                  mergedCultures.push(dynCult);
                }
              });

              // Merge static and dynamic livestock (elevages)
              const mergedElevages = [...staticZone.elevages];
              if (fetchedDept.elevage_dominant && Array.isArray(fetchedDept.elevage_dominant)) {
                fetchedDept.elevage_dominant.forEach((elName: string) => {
                  const existingIdx = mergedElevages.findIndex(
                    e => e.nom.toLowerCase().trim() === elName.toLowerCase().trim()
                  );
                  if (existingIdx === -1) {
                    let cycle = "90 jours";
                    let prixA = 1000;
                    let prixV = 3000;
                    let aliment = 120000;
                    let cap = 100;
                    let weight = 2.0;
                    const cleanNameStr = elName.toLowerCase();
                    if (cleanNameStr.includes("bovin")) {
                      cycle = "365 jours"; prixA = 150000; prixV = 350000; aliment = 850000; cap = 10; weight = 250;
                    } else if (cleanNameStr.includes("ovin") || cleanNameStr.includes("mouton") || cleanNameStr.includes("bélier")) {
                      cycle = "180 jours"; prixA = 25000; prixV = 65000; aliment = 180000; cap = 30; weight = 45;
                    } else if (cleanNameStr.includes("caprin") || cleanNameStr.includes("chèvre") || cleanNameStr.includes("bouc")) {
                      cycle = "180 jours"; prixA = 15000; prixV = 35000; aliment = 120000; cap = 40; weight = 30;
                    } else if (cleanNameStr.includes("porc")) {
                      cycle = "210 jours"; prixA = 12000; prixV = 85000; aliment = 280000; cap = 25; weight = 80;
                    } else if (cleanNameStr.includes("volaille") || cleanNameStr.includes("poulet") || cleanNameStr.includes("canard") || cleanNameStr.includes("poule")) {
                      cycle = "90 jours"; prixA = 800; prixV = 4500; aliment = 250000; cap = 200; weight = 2.5;
                    } else if (cleanNameStr.includes("pisciculture") || cleanNameStr.includes("poisson") || cleanNameStr.includes("clarias") || cleanNameStr.includes("tilapia")) {
                      cycle = "150 jours"; prixA = 100; prixV = 2200; aliment = 400000; cap = 1000; weight = 0.9;
                    } else if (cleanNameStr.includes("apiculture") || cleanNameStr.includes("miel")) {
                      cycle = "120 jours"; prixA = 15000; prixV = 4500; aliment = 50000; cap = 20; weight = 1.0;
                    }
                    mergedElevages.push({
                      nom: elName,
                      cycle,
                      tailleOptionelle: cap,
                      prixAchatUnitaire: prixA,
                      mortaliteType: 7,
                      poidsVenteMoyen: weight,
                      prixVenteUnitaire: prixV,
                      alimentSoinCost: aliment,
                      mainOeuvreCost: 50000,
                      conseilsSante: [
                        "Faire un suivi sanitaire et prophylactique régulier",
                        "Garantir une source propre d'eau de boisson et un abri aéré"
                      ]
                    });
                  }
                });
              }

              // Merge static and dynamic transformations
              const mergedTransformations = [...staticZone.transformations];
              if (fetchedDept.transformation && Array.isArray(fetchedDept.transformation)) {
                fetchedDept.transformation.forEach((transName: string) => {
                  const existingIdx = mergedTransformations.findIndex(
                    t => t.nom.toLowerCase().trim() === transName.toLowerCase().trim()
                  );
                  if (existingIdx === -1) {
                    mergedTransformations.push({
                      nom: transName,
                      matierePremiere: "Matière brute locale",
                      rendementPercent: 70,
                      prixMatiereBruteKg: 300,
                      perteEpluchage: 10,
                      pertePressage: 5,
                      perteCuisson: 15,
                      prixVenteKg: 650,
                      packagingCost: 20000,
                      machineryCost: 15000,
                      laborCost: 30000,
                      usage: "alimentaire"
                    });
                  }
                });
              }

              // Merge static and dynamic cosmetics
              if (fetchedDept.agro_cosmetique && Array.isArray(fetchedDept.agro_cosmetique)) {
                fetchedDept.agro_cosmetique.forEach((cosmName: string) => {
                  const existingIdx = mergedTransformations.findIndex(
                    t => t.nom.toLowerCase().trim() === cosmName.toLowerCase().trim()
                  );
                  if (existingIdx === -1) {
                    mergedTransformations.push({
                      nom: cosmName,
                      matierePremiere: "Ressource naturelle sauvage",
                      rendementPercent: 75,
                      prixMatiereBruteKg: 500,
                      perteEpluchage: 12,
                      pertePressage: 3,
                      perteCuisson: 10,
                      prixVenteKg: 1800,
                      packagingCost: 35000,
                      machineryCost: 12000,
                      laborCost: 35000,
                      usage: "cosmétique"
                    });
                  }
                });
              }
              
              return {
                ...staticZone,
                cultures: mergedCultures,
                elevages: mergedElevages,
                transformations: mergedTransformations
              };
            }
            return staticZone;
          });
          setZonesList(updatedZones);
        }
      }
    } catch (err) {
      console.warn("Notice: Error loading dynamic agricultural dataset in React, using local defaults:", err);
    }
  };

  useEffect(() => {
    loadDynamicAgroData();
  }, []);
  
  // Publications automated funnel redirection states
  const [autoOpenPublish, setAutoOpenPublish] = useState<string | null>(null);

  // Stories Seen State (for seen status border coloring, tracking read vs unread groups)
  const [seenGroupNames, setSeenGroupNames] = useState<string[]>([]);
  // Statuts Agri listing panel (.ssc overlay screen) state
  const [showSscPanel, setShowSscPanel] = useState<boolean>(false);

  // Stories / Statuts state with realistic parameters, categories, stats, and initial reactions
  const [stories, setStories] = useState<{
    id: string;
    name: string;
    avatarUrl: string;
    badge: string;
    image: string;
    text?: string;
    createdAt: number;
    mediaType?: "image" | "video";
    backgroundColor?: string;
    fontFamily?: string;
    isTextStory?: boolean;
    ck?: "culture" | "elevage" | "marche" | "meteo" | "irrigation" | "finance" | "agribot";
    sb?: string;
    stats?: { i: string; v: string; l: string }[];
    rx?: number[];
  }[]>([]);
  const [showStoryDetailId, setShowStoryDetailId] = useState<string | null>(null);
  const [activeStoryGroupKey, setActiveStoryGroupKey] = useState<string | null>(null);
  const [currentStoryItemIndex, setCurrentStoryItemIndex] = useState<number>(0);
  const [storyTimerProgress, setStoryTimerProgress] = useState<number>(0);
  const [showStoryViewersList, setShowStoryViewersList] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [storyMuted, setStoryMuted] = useState<boolean>(true);
  
  // Custom status creation sub-steps as requested by the user
  const [storyCreationStep, setStoryCreationStep] = useState<"choose" | "media" | "text">("choose");
  const [storyBgColor, setStoryBgColor] = useState<string>("#8a2be2");
  const [currentFontIdx, setCurrentFontIdx] = useState<number>(0);
  const fontStyles = ["font-sans", "font-display", "font-mono"];
  
  // Custom status creation modal states satisfying screenshot
  const [newStoryName, setNewStoryName] = useState("");
  const [newStoryText, setNewStoryText] = useState("");
  const [newStoryFormat, setNewStoryFormat] = useState<"texte" | "musique" | "composition" | "camera">("texte");
  const [newStoryMusicTitle, setNewStoryMusicTitle] = useState("Rythme Traditionnel Béninois");
  const [newStoryImage, setNewStoryImage] = useState("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=350");
  const [newStoryFile, setNewStoryFile] = useState<File | null>(null);
  const [newStoryType, setNewStoryType] = useState<"image" | "video">("image");
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const [showMyStatusMenu, setShowMyStatusMenu] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [pwaIntroTab, setPwaIntroTab] = useState<"android" | "ios">("android");
  
  // Real-time reactions metrics tracking state for stories
  const [localReactions, setLocalReactions] = useState<Record<string, number[]>>({});
  
  // Check if active user is Administrateur
  const isUserJbz = user?.username?.toLowerCase() === "jbz001" || user?.username?.toLowerCase() === "coordonnateur" || user?.username?.toLowerCase() === "administrateur" || user?.email === "coordonnateur@agribot-africa.com" || user?.email === "administrateur@agribot-africa.com" || user?.email === "jbzounmatoun@gmail.com";
  const [adminForceTrialMode, setAdminForceTrialMode] = useState<boolean>(false);
  const isPremiumActive = (user?.isPremium || isUserJbz) && !(isUserJbz && adminForceTrialMode);
  
  // App navigation
  const [activeTab, setActiveTab ] = useState<string>("home");
  const [showGoToTop, setShowGoToTop] = useState<boolean>(false);
  const [tabHistory, setTabHistory] = useState<string[]>(["home"]);
  const [selectedMarketProductId, setSelectedMarketProductId] = useState<string | null>(null);
  const [coordinationInterestedUser, setCoordinationInterestedUser] = useState<{ id: string; username: string } | null>(null);
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
  const [selectedSolidarityId, setSelectedSolidarityId] = useState<string | null>(null);

  useEffect(() => {
    setTabHistory(prev => {
      if (prev[prev.length - 1] === activeTab) return prev;
      if (prev.length >= 2 && prev[prev.length - 2] === activeTab) {
        return prev.slice(0, prev.length - 1);
      }
      return [...prev, activeTab];
    });
  }, [activeTab]);

  const handleBack = () => {
    if (showStoryViewersList) {
      setShowStoryViewersList(false);
    } else if (showStoryDetailId) {
      setShowStoryDetailId(null);
    } else if (activeStoryGroupKey) {
      setActiveStoryGroupKey(null);
    } else if (showAddStoryModal) {
      setShowAddStoryModal(false);
    } else if (showSscPanel) {
      setShowSscPanel(false);
    } else if (selectedMarketProductId) {
      setSelectedMarketProductId(null);
    } else if (selectedCvId) {
      setSelectedCvId(null);
    } else if (selectedSolidarityId) {
      setSelectedSolidarityId(null);
    } else if (showAddCvModal) {
      setShowAddCvModal(false);
    } else if (showAddProductModal) {
      setShowAddProductModal(false);
    } else if (showMomoOverlay) {
      setShowMomoOverlay(false);
    } else if (showWeatherModal) {
      setShowWeatherModal(false);
    } else if (showPublishPopup) {
      setShowPublishPopup(false);
    } else if (tabHistory.length > 1) {
      const prevTab = tabHistory[tabHistory.length - 2];
      setActiveTab(prevTab);
    } else {
      setActiveTab("home");
    }
  };

  const handleGoHome = () => {
    setSelectedMarketProductId(null);
    setSelectedCvId(null);
    setSelectedSolidarityId(null);
    setCoordinationInterestedUser(null);
    setShowSscPanel(false);
    setShowStoryDetailId(null);
    setActiveStoryGroupKey(null);
    setShowStoryViewersList(false);
    setShowAddStoryModal(false);
    setShowPublishPopup(false);
    setShowMyStatusMenu(false);
    setShowPwaModal(false);
    setShowPolicyModal(false);
    setShowPlusMenu(false);
    setShowNotificationsDropdown(false);
    setShowMomoOverlay(false);
    setShowWeatherModal(false);
    setShowAddCvModal(false);
    setShowAddProductModal(false);
    setShowInstallInstructions(false);
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [adminUsers, setAdminUsers] = useState<any[]>([]);

   const triggerSessionVocalWelcome = (activeUser: User) => {
    if (!activeUser) return;
    
    // Ensure we trigger once per session
    const hasBeenWelcomed = sessionStorage.getItem("agribot_session_welcomed");
    if (hasBeenWelcomed === "true") return;
    sessionStorage.setItem("agribot_session_welcomed", "true");

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Node 1: A pleasant light chime note (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.4);

      // Node 2: A harmonized follow-up note (E5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (error) {
      console.warn("Welcome chime playback failed", error);
    }
  };

  // User profile forms state (synchronized reactively with actual user profile fields)
  const [profileFirstName, setProfileFirstName] = useState<string>("");
  const [profileLastName, setProfileLastName] = useState<string>("");
  const [profilePhone, setProfilePhone] = useState<string>("");
  const [profileWhatsApp, setProfileWhatsApp] = useState<string>("");
  const [profileSpecialty, setProfileSpecialty] = useState<string>("");
  const [profileLocation, setProfileLocation] = useState<string>("");
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profileEmail, setProfileEmail] = useState<string>("");
  const [profileSuccessFeedback, setProfileSuccessFeedback] = useState<string>("");

  useEffect(() => {
    if (user) {
      setProfileFirstName(user.firstName || "");
      setProfileLastName(user.lastName || "");
      setProfilePhone(user.phone || "");
      setProfileWhatsApp(user.whatsapp || "");
      setProfileSpecialty(user.specialty || "Maraîchage");
      setProfileLocation(user.location || "Dangbo, Ouémé");
      setProfileAvatar(user.avatarUrl || "");
      setProfileEmail(user.email || "");

      triggerSessionVocalWelcome(user);
    }
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("tab") === "videos" || urlParams.get("videoShared")) {
      setActiveTab("videos");
    }
  }, []);

  // Restrict blocked users to home page only and intercept all modal panels/tabs
  useEffect(() => {
    if (user?.isBlocked) {
      if (activeTab !== "home") {
        setActiveTab("home");
        alert("❌ COMPTE BLOQUÉ ! Votre compte membre est actuellement bloqué par l'Administrateur. Vous avez uniquement accès à la page d'accueil de la coopérative.");
      }
      if (showSscPanel) {
        setShowSscPanel(false);
        alert("❌ COMPTE BLOQUÉ ! Accès impossible aux statuts communautaires.");
      }
      if (showPublishPopup) {
        setShowPublishPopup(false);
        alert("❌ COMPTE BLOQUÉ ! Impossible de publier sur la plateforme.");
      }
    }
  }, [activeTab, user?.isBlocked, showSscPanel, showPublishPopup]);

  // Real-time Database state synchronized with backend
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cvProfiles, setCvProfiles] = useState<CVProfile[]>([]);
  const [projectProposals, setProjectProposals] = useState<ProjectProposal[]>([]);
  const [solidarityDemands, setSolidarityDemands] = useState<SolidarityDemand[]>([]);
  const [solidarityCandidatures, setSolidarityCandidatures] = useState<SolidarityCandidature[]>([]);
  const [appelsCandidatures, setAppelsCandidatures] = useState<AppelCandidature[]>([]);
  
  // Custom states
  const [selectedCommune, setSelectedCommune] = useState<string>("Adjohoun");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("Ouémé");
  const [weatherManualSearch, setWeatherManualSearch] = useState<string>("");
  const [souveraineteFeed, setSouveraineteFeed] = useState<any[]>([]);
  const [feedFilter, setFeedFilter] = useState<string>("Tout");
  const [selectedSscCategory, setSelectedSscCategory] = useState<string>("Tout");
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);
  const [showPlusMenu, setShowPlusMenu] = useState<boolean>(false);
  const [homeAgribotInput, setHomeAgribotInput] = useState<string>("");

  // Draggable Messenger floating bubbles coordinate states
  const [weatherBubblePos, setWeatherBubblePos] = useState({ x: 16, y: 420 });
  const [cvBubblePos, setCvBubblePos] = useState({ x: 16, y: 500 });

  // Admin user and support ticket supervision states
  const [adminUserList, setAdminUserList] = useState<User[]>([]);
  const [adminContactMessages, setAdminContactMessages] = useState<any[]>([]);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState<boolean>(false);

  // Global loading states with animated logo
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);

  const performInteractiveAction = async (actionFn: () => Promise<any> | any, minDelayMs = 1000) => {
    setIsGlobalLoading(true);
    const start = Date.now();
    try {
      await actionFn();
    } catch (err) {
      console.warn("Action error:", err);
    } finally {
      const elapsed = Date.now() - start;
      const remaining = minDelayMs - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
      setIsGlobalLoading(false);
    }
  };

  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [groundPrices, setGroundPrices] = useState(INITIAL_MARKET_PRICES);
  
  const [selectedPriceMarket, setSelectedPriceMarket] = useState("Dantokpa");
  const [liveMarketPrices, setLiveMarketPrices] = useState<Record<string, Record<string, { price: number; trend: "up" | "down" | "stable" }>>>({
    Dantokpa: {
      maiz: { price: 210, trend: "up" },
      tomato: { price: 340, trend: "down" },
      soja: { price: 420, trend: "stable" },
      gari: { price: 360, trend: "up" },
      oignon: { price: 480, trend: "up" },
    },
    Malanville: {
      maiz: { price: 180, trend: "stable" },
      tomato: { price: 280, trend: "up" },
      soja: { price: 390, trend: "down" },
      gari: { price: 450, trend: "up" },
      oignon: { price: 320, trend: "down" },
    },
    Bohicon: {
      maiz: { price: 215, trend: "up" },
      tomato: { price: 310, trend: "down" },
      soja: { price: 410, trend: "stable" },
      gari: { price: 330, trend: "stable" },
      oignon: { price: 450, trend: "up" },
    },
    Parakou: {
      maiz: { price: 195, trend: "down" },
      tomato: { price: 330, trend: "up" },
      soja: { price: 400, trend: "up" },
      gari: { price: 410, trend: "down" },
      oignon: { price: 390, trend: "stable" },
    },
    Azovè: {
      maiz: { price: 220, trend: "up" },
      tomato: { price: 300, trend: "stable" },
      soja: { price: 430, trend: "down" },
      gari: { price: 310, trend: "up" },
      oignon: { price: 470, trend: "up" },
    },
    Glazoué: {
      maiz: { price: 200, trend: "stable" },
      tomato: { price: 315, trend: "up" },
      soja: { price: 405, trend: "stable" },
      gari: { price: 340, trend: "down" },
      oignon: { price: 430, trend: "stable" },
    }
  });
  const [lastMAEPUpdate, setLastMAEPUpdate] = useState("Aujourd'hui à 11h30 (Source: Dépêche MAEP/ONASA)");
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);

  const handleRefreshMAEPPrices = () => {
    setIsRefreshingPrices(true);
    setTimeout(() => {
      // Base reference prices to avoid compounding random walks that drift downwards
      const basePrices: Record<string, Record<string, number>> = {
        Dantokpa: { maiz: 210, tomato: 340, soja: 420, gari: 360, oignon: 480 },
        Malanville: { maiz: 180, tomato: 280, soja: 390, gari: 450, oignon: 320 },
        Bohicon: { maiz: 215, tomato: 310, soja: 410, gari: 330, oignon: 450 },
        Parakou: { maiz: 195, tomato: 330, soja: 400, gari: 410, oignon: 390 },
        Azovè: { maiz: 220, tomato: 300, soja: 430, gari: 310, oignon: 470 },
        Glazoué: { maiz: 200, tomato: 315, soja: 405, gari: 340, oignon: 430 }
      };

      setLiveMarketPrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(marketKey => {
          Object.keys(next[marketKey]).forEach(prodKey => {
            const base = basePrices[marketKey]?.[prodKey] || 250;
            // Fluctuate cleanly between -8% and +12% relative to baseline to prevent drifting to zero
            const percentShift = (Math.random() * 20 - 8) / 100; // -8% to +12%
            const newPrice = Math.max(50, Math.round(base * (1 + percentShift)));
            let newTrend: "up" | "down" | "stable" = "stable";
            if (percentShift > 0.03) newTrend = "up";
            else if (percentShift < -0.03) newTrend = "down";
            next[marketKey][prodKey] = { price: newPrice, trend: newTrend };
          });
        });
        return next;
      });
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;
      setLastMAEPUpdate(`Mise à jour à ${timeStr} (Source: Dépêche MAEP/ONASA du Bénin)`);
      setIsRefreshingPrices(false);
    }, 800);
  };
  
  // Ad simulation / Ecobank monetization
  const [viewTimeSeconds, setViewTimeSeconds] = useState<number>(0);
  const [ecobankBalance, setEcobankBalance] = useState<number>(0);

  // Notifications systems
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<string[]>([
    "Bienvenue ! Vos 4 premières semaines d'essai gratuit ont commencé.",
    "La moisson de maïs commence bientôt à Parakou. Consultez les cours !",
    "Nouveau diplômé disponible dans la section Recrutement Stage."
  ]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Chat posting
  const [chatInput, setChatInput] = useState("");
  const [replyMessageId, setReplyMessageId] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editMsgContent, setEditMsgContent] = useState("");

  // Document Technique unlock states
  const [docRecipientEmail, setDocRecipientEmail] = useState("");
  const [downloadedDocCode, setDownloadedDocCode] = useState<string | null>(null);
  const [pdfUnlockPassword, setPdfUnlockPassword] = useState("");
  const [isPdfUnlocked, setIsPdfUnlocked] = useState(false);
  const [docErrorMessage, setDocErrorMessage] = useState<string | null>(null);

  // Subscriptions checkboxes and validations
  const [selectedPlanTerm, setSelectedPlanTerm] = useState<string | null>(null);
  const [acceptedPremiumTerms, setAcceptedPremiumTerms] = useState(false);
  const [premiumFeedbackMsg, setPremiumFeedbackMsg] = useState<string | null>(null);

  // Direct MTN MoMo / Moov billing modal simulation states
  const [momoPhoneNumber, setMomoPhoneNumber] = useState("");
  const [selectedPlanForPrompt, setSelectedPlanForPrompt] = useState<'hebdo' | 'mensuel' | 'trimestriel' | 'annuel' | null>(null);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(1000);
  const [momoOperator, setMomoOperator] = useState<"MTN" | "Moov">("MTN");
  const [isPayingMomo, setIsPayingMomo] = useState(false);
  const [showMomoOverlay, setShowMomoOverlay] = useState(false);
  const [momoSubId, setMomoSubId] = useState<string | null>(null);
  
  // Real-time MoMo/Moov interactive Push overlay simulation states
  const [momoPinEntering, setMomoPinEntering] = useState(false);
  const [momoPinValue, setMomoPinValue] = useState("");
  const [isMomoPinProcessing, setIsMomoPinProcessing] = useState(false);

  // Advanced MTN sub proof, reviews state & agricultural social proof
  const [createdSubscriptionId, setCreatedSubscriptionId] = useState<string | null>(null);
  const [createdSubscriptionPlan, setCreatedSubscriptionPlan] = useState<string | null>(null);
  const [createdSubscriptionUssd, setCreatedSubscriptionUssd] = useState<string | null>(null);
  const [createdSubscriptionAmount, setCreatedSubscriptionAmount] = useState<number | null>(null);
  const [momoTransactionReference, setMomoTransactionReference] = useState("");
  const [momoScreenshotFile, setMomoScreenshotFile] = useState<string | null>(null);
  const [adminSubscriptions, setAdminSubscriptions] = useState<any[]>([]);

  const [allAvis, setAllAvis] = useState<any[]>([]);
  const [activeFarmersCount, setActiveFarmersCount] = useState<number>(242);
  const [averageAvisNote, setAverageAvisNote] = useState<number>(4.9);
  const [totalAvisCount, setTotalAvisCount] = useState<number>(42);
  const [reviewRatingInput, setReviewRatingInput] = useState<number>(5);
  const [reviewCommentInput, setReviewCommentInput] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [unlockedContactsList, setUnlockedContactsList] = useState<string[]>([]);

  // Direct AgriBot injection prompt
  const [agribotInitialPrompt, setAgribotInitialPrompt] = useState<string | undefined>(undefined);

  // Top countdown trials variable
  const [trialTimeRemaining, setTrialTimeRemaining] = useState<number>(35 * 24 * 3600); // 5 weeks free

  // PWA states and event listener
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showWeatherModal, setShowWeatherModal] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Intercept browser and hardware back button actions to close active panel sections or menus rather than reloading/quitting
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (activeStoryGroupKey) {
        setActiveStoryGroupKey(null);
        window.history.pushState(null, "");
      } else if (showAddStoryModal) {
        setShowAddStoryModal(false);
        window.history.pushState(null, "");
      } else if (showSscPanel) {
        setShowSscPanel(false);
        window.history.pushState(null, "");
      } else if (drawerOpen) {
        setDrawerOpen(false);
        window.history.pushState(null, "");
      } else if (selectedMarketProductId) {
        setSelectedMarketProductId(null);
        window.history.pushState(null, "");
      } else if (selectedCvId) {
        setSelectedCvId(null);
        window.history.pushState(null, "");
      } else if (selectedSolidarityId) {
        setSelectedSolidarityId(null);
        window.history.pushState(null, "");
      } else if (activeTab !== "home") {
        setActiveTab("home");
        window.history.pushState(null, "");
      }
    };

    // Push initial dummy state in history so there is always a layer of popstate to prevent immediate app exit
    window.history.pushState(null, "");

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeStoryGroupKey, showAddStoryModal, showSscPanel, drawerOpen, selectedMarketProductId, selectedCvId, selectedSolidarityId, activeTab]);

  // Live aggregated agricultural news feed states
  const [externalNews, setExternalNews] = useState<Array<{ title: string; source: string; link: string; summary: string; date: string }>>([
    {
      title: "INRAB : Homologation de nouvelles semences de maïs hybride résistantes à la sécheresse",
      source: "INRAB Bénin (inrab.org)",
      link: "http://www.inrab.org",
      summary: "L'Institut National des Recherches Agricoles du Bénin (INRAB) annonce la validation académique de trois nouvelles variétés de maïs résilientes au stress hydrique au Bénin.",
      date: "25/05/2026"
    },
    {
      title: "MAEP : Déploiement de subventions de kits de micro-irrigation maraîchère de l'ATDA",
      source: "MAEP Bénin (agriculture.gouv.bj)",
      link: "https://agriculture.gouv.bj",
      summary: "Le Ministère de l'Agriculture lance la distribution d'équipements hydro-agricoles à taux subventionné à hauteur de 40% pour soutenir la transition agroécologique.",
      date: "24/05/2026"
    }
  ]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);

  // Popup overlay modal triggers for dynamic publishing on Home screen
  const [showAddCvModal, setShowAddCvModal] = useState<boolean>(false);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);

  // Dual-angle chat states
  const [chatSubAngle, setChatSubAngle] = useState<"group" | "private">("group");
  const [privateRecipient, setPrivateRecipient] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [chatPhotoFile, setChatPhotoFile] = useState<string | null>(null);

  // Reporting/signaling admin states
  const [reportingMessage, setReportingMessage] = useState<ChatMessage | null>(null);
  const [reportingReason, setReportingReason] = useState("");
  const [reportingFeedback, setReportingFeedback] = useState<string | null>(null);

  // Embedded Form states for dynamic additions
  const [newCvFirstName, setNewCvFirstName] = useState("");
  const [newCvLastName, setNewCvLastName] = useState("");
  const [newCvType, setNewCvType] = useState<"technician" | "intern">("intern");
  const [newCvEducation, setNewCvEducation] = useState("");
  const [newCvSpecialty, setNewCvSpecialty] = useState("");
  const [newCvSkills, setNewCvSkills] = useState("");
  const [newCvContact, setNewCvContact] = useState("");
  const [newCvLocation, setNewCvLocation] = useState("");
  const [newCvUniversity, setNewCvUniversity] = useState("");

  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdLocation, setNewProdLocation] = useState("");
  const [newProdPhone, setNewProdPhone] = useState("");
  const [newProdType, setNewProdType] = useState("Légumes");
  const [newProdDescription, setNewProdDescription] = useState("");

  // Ensure page scrolls to top smoothly anytime the active tab changes (specifically Home/Accueil)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Load custom aggregated agricultural news on mount
  useEffect(() => {
    const fetchNewsFeed = async () => {
      try {
        setNewsLoading(true);
        const res = await fetch("/api/external-news");
        if (res.ok) {
          const data = await res.json();
          if (data && data.news) {
            setExternalNews(data.news);
          }
        }
      } catch (e) {
        console.error("Failed to load external agricultural news feed", e);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNewsFeed();
    const intervalObj = setInterval(fetchNewsFeed, 5 * 60 * 1000);
    return () => clearInterval(intervalObj);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setNotifications(prev => ["Félicitations ! AgriBot est installé et disponible dans votre menu d'applications !", ...prev]);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Custom states for location verification and PWA install guides
  const [gpsAuthorized, setGpsAuthorized] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsError, setGpsError] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState<boolean>(false);

  // Exact geographical coordinates for Benin agricultural hub centers
  const BENIN_COMMUNES_COORDS: { [key: string]: { lat: number; lon: number } } = {
    "Adjohoun": { lat: 6.70, lon: 2.44 },
    "Dangbo": { lat: 6.58, lon: 2.49 },
    "Cotonou": { lat: 6.37, lon: 2.43 },
    "Porto-Novo": { lat: 6.49, lon: 2.63 },
    "Parakou": { lat: 9.33, lon: 2.63 },
    "Bohicon": { lat: 7.18, lon: 2.06 },
    "Natitingou": { lat: 10.30, lon: 1.38 },
    "Ouidah": { lat: 6.36, lon: 2.08 }
  };

  const getClosestCommune = (lat: number, lon: number): string => {
    let closestKey = "Adjohoun";
    let minDistance = Infinity;
    Object.entries(BENIN_COMMUNES_COORDS).forEach(([key, val]) => {
      const d = Math.sqrt(Math.pow(lat - val.lat, 2) + Math.pow(lon - val.lon, 2));
      if (d < minDistance) {
        minDistance = d;
        closestKey = key;
      }
    });
    return closestKey;
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGpsError(true);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });
        setGpsAuthorized(true);
        setGpsError(false);
        setIsLocating(false);
        const closest = getClosestCommune(lat, lon);
        setSelectedCommune(closest);
      },
      () => {
        setGpsError(true);
        setGpsAuthorized(false);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Attempt automatic background geolocation check on startup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCoords({ lat, lon });
          setGpsAuthorized(true);
          setGpsError(false);
          const closest = getClosestCommune(lat, lon);
          setSelectedCommune(closest);
        },
        () => {
          setGpsAuthorized(false);
        }
      );
    }
  }, []);

  const handleInstallPlatform = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallInstructions(true);
    }
  };

  // Bottom contact state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactFeedback, setContactFeedback] = useState<string | null>(null);

  // Load active user on startup from Session cache to persist login
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("agribot_active_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to restore cached user session", e);
    }
  }, []);

  // Bidirectional Database Sync Protocol (survives container reboots and scale downs)
  const syncData = async () => {
    try {
      const getLocalArray = (key: string): any[] => {
        try {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      };

      const localUsers = getLocalArray("agribot_users_list");
      const localMessages = getLocalArray("agribot_local_messages");
      const localProducts = getLocalArray("agribot_local_products");
      const localCvs = getLocalArray("agribot_local_cvs");
      const localProjects = getLocalArray("agribot_local_projects");
      const localDemands = getLocalArray("agribot_local_solidarity_demands");
      const localCandidatures = getLocalArray("agribot_local_solidarity_candidatures");
      const localAppels = getLocalArray("agribot_local_appels_candidatures");

      const res = await fetch("/api/sync-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          users: localUsers,
          messages: localMessages,
          products: localProducts,
          cvs: localCvs,
          projects: localProjects,
          solidarityDemands: localDemands,
          solidarityCandidatures: localCandidatures,
          appelsCandidatures: localAppels
        })
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON response, but received content-type: ${contentType}`);
        }
        
        const data = await res.json();
        if (data && data.success !== false) {
          setChatMessages(data.messages || []);
          setProducts(data.products || []);
          setCvProfiles(data.cvs || []);
          setProjectProposals(data.projects || []);
          setSolidarityDemands(data.solidarityDemands || []);
          setSolidarityCandidatures(data.solidarityCandidatures || []);
          setAppelsCandidatures(data.appelsCandidatures || []);

          // Sync avis stats
          fetch("/api/avis/stats")
            .then(r => r.json())
            .then(resData => {
              if (resData.success) {
                setActiveFarmersCount(resData.activeFarmers);
                setAverageAvisNote(resData.averageNote);
                setTotalAvisCount(resData.avisCount);
                setAllAvis(resData.avis || []);
              }
            })
            .catch(e => console.warn("Note: Error fetching avis stats, using offline values", e));

          // Sync pending subscriptions list
          fetch("/api/sub/list")
            .then(r => r.json())
            .then(resData => {
              if (resData.success) {
                setAdminSubscriptions(resData.subscriptions || []);
              }
            })
            .catch(e => console.warn("Note: Error fetching subscriptions, using offline values", e));

          // Persist hot local backup of server records
          localStorage.setItem("agribot_local_messages", JSON.stringify(data.messages || []));
          localStorage.setItem("agribot_local_products", JSON.stringify(data.products || []));
          localStorage.setItem("agribot_local_cvs", JSON.stringify(data.cvs || []));
          localStorage.setItem("agribot_local_projects", JSON.stringify(data.projects || []));
          localStorage.setItem("agribot_local_solidarity_demands", JSON.stringify(data.solidarityDemands || []));
          localStorage.setItem("agribot_local_solidarity_candidatures", JSON.stringify(data.solidarityCandidatures || []));
          localStorage.setItem("agribot_local_appels_candidatures", JSON.stringify(data.appelsCandidatures || []));
          if (data.users && Array.isArray(data.users)) {
            localStorage.setItem("agribot_users_list", JSON.stringify(data.users));
          }

          // Sync local active user state with the database
          const savedUserRaw = localStorage.getItem("agribot_active_user");
          if (savedUserRaw) {
            const activeUser = JSON.parse(savedUserRaw);
            const freshUser = (data.users || []).find((u: any) => u.id === activeUser.id);
            if (freshUser) {
              if (JSON.stringify(freshUser) !== JSON.stringify(activeUser)) {
                setUser(freshUser);
                localStorage.setItem("agribot_active_user", JSON.stringify(freshUser));
              }
            }
          }
          
          // Calculate unread count
          if (user) {
            const unread = (data.messages || []).filter((m: ChatMessage) => !m.readBy.includes(user.id)).length;
            setUnreadMessagesCount(unread);
          }
        } else {
          throw new Error(data?.error || "Sync returned unsuccessful status");
        }
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err) {
      console.warn("Notice: Bidirectional sync offline, using local cache", err);
      try {
        const msg = localStorage.getItem("agribot_local_messages");
        if (msg) setChatMessages(JSON.parse(msg));
        const prod = localStorage.getItem("agribot_local_products");
        if (prod) setProducts(JSON.parse(prod));
        const cv = localStorage.getItem("agribot_local_cvs");
        if (cv) setCvProfiles(JSON.parse(cv));
        const proj = localStorage.getItem("agribot_local_projects");
        if (proj) setProjectProposals(JSON.parse(proj));
        const sDem = localStorage.getItem("agribot_local_solidarity_demands");
        if (sDem) setSolidarityDemands(JSON.parse(sDem));
        const sCand = localStorage.getItem("agribot_local_solidarity_candidatures");
        if (sCand) setSolidarityCandidatures(JSON.parse(sCand));
        const appCand = localStorage.getItem("agribot_local_appels_candidatures");
        if (appCand) setAppelsCandidatures(JSON.parse(appCand));
      } catch (err2) {
        console.warn("Notice: Local offline cache recovery failed", err2);
      }
    }
  };

  // Sync contents on load and continuously
  useEffect(() => {
    // We can sync database background elements even without fully authenticated session
    syncData();
    const interval = setInterval(syncData, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [user]);

  // Synchronize weather presets dynamically using real-time Open-Meteo API as recommended
  const syncOpenMeteoWeather = async (communeName: string, customCoords?: { lat: number; lon: number }) => {
    let lat = 6.70;
    let lon = 2.44;

    if (customCoords) {
      lat = customCoords.lat;
      lon = customCoords.lon;
    } else if (BENIN_COMMUNES_COORDS[communeName]) {
      lat = BENIN_COMMUNES_COORDS[communeName].lat;
      lon = BENIN_COMMUNES_COORDS[communeName].lon;
    } else {
      // Estimate coordinates
      const charSum = communeName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      lat = 6.3 + (charSum % 5);
      lon = 1.3 + (charSum % 2);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error("API weather fetch failed");
      const data = await res.json();
      const current = data.current;
      
      const tempVal = Math.round(current.temperature_2m);
      const humidityVal = `${Math.round(current.relative_humidity_2m)}%`;
      const windVal = `${Math.round(current.wind_speed_10m)} km/h`;
      const precipitationVal = current.precipitation || 0;
      
      let cond = "Sec & Ensoleillé ☀️";
      const code = current.weather_code;
      if (precipitationVal > 0 || [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        cond = "Pluies Bénéfiques 🌧️";
      } else if ([1, 2].includes(code)) {
        cond = "Partiellement nuageux ⛅";
      } else if (code === 3) {
        cond = "Ciel Couvert ☁️";
      } else if ([45, 48].includes(code)) {
        cond = "Brouillard d'Harmattan 🌫️";
      } else if ([95, 96, 99].includes(code)) {
        cond = "Orages et Pluies ⛈️";
      } else if (tempVal > 32) {
        cond = "Soleil Ardent 🔥";
      }

      const recommendationsList = [];
      if (precipitationVal > 0 || cond.includes("Pluie") || cond.includes("Orages")) {
        recommendationsList.push("🌧️ Une précipitation est active ou imminente ! Évitez d'appliquer des engrais minéraux (Urée/NPK) pour empêcher le lessivage.");
        recommendationsList.push("🌱 Excellente période pour repiquer les jeunes plants maraîchers et collecter l'eau de pluie.");
      } else if (tempVal > 32) {
        recommendationsList.push("🔥 Température élevée détectée. Favorisez un paillage organique pour retenir l'eau du sol maraîcher.");
        recommendationsList.push("💧 Augmentez l'irrigation goutte-à-goutte très tôt le matin ou après 17h.");
      } else {
        recommendationsList.push("✨ Climat modéré idéal pour réaliser le compostage aérobie en tas ou épandre le BRF.");
        recommendationsList.push("🐓 Maintenez une bonne ventilation dans les bâtiments d'élevage.");
      }

      recommendationsList.push(`📍 Analyse agronomique locale validée par les fiches d'itinéraires techniques.`);
      
      setWeather({
        commune: communeName,
        temp: tempVal,
        condition: cond,
        humidity: humidityVal,
        wind: windVal,
        recommendations: recommendationsList,
        lastUpdated: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) + " (Temps Réel Open-Meteo)"
      });
    } catch (error) {
      console.warn("Open-Meteo lookup error, falling back to preset:", error);
      const preset = getCommuneWeather(communeName);
      setWeather({
        commune: communeName,
        temp: preset.temp,
        condition: preset.condition,
        humidity: "78%",
        wind: "11 km/h",
        recommendations: preset.recommendations,
        lastUpdated: "Fallback local (Hors-ligne)"
      });
    }
  };

  useEffect(() => {
    if (gpsAuthorized && coords) {
      syncOpenMeteoWeather(selectedCommune, coords);
    } else {
      syncOpenMeteoWeather(selectedCommune);
    }
  }, [selectedCommune, coords, gpsAuthorized]);

  // Pointer events draggable handler tracking for Messenger bubbles - with boundaries
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const startX = e.clientX - el.getBoundingClientRect().left;
    const startY = e.clientY - el.getBoundingClientRect().top;
    
    el.setAttribute("data-dragging", "true");
    el.setAttribute("data-start-x", String(startX));
    el.setAttribute("data-start-y", String(startY));
    el.setAttribute("data-move-count", "0");
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>, setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>) => {
    const el = e.currentTarget;
    if (el.getAttribute("data-dragging") !== "true") return;
    
    const startX = Number(el.getAttribute("data-start-x") || 0);
    const startY = Number(el.getAttribute("data-start-y") || 0);
    
    // Compute pointer offset
    const newX = e.clientX - startX;
    const newY = e.clientY - startY;

    const moveCount = Number(el.getAttribute("data-move-count") || 0) + 1;
    el.setAttribute("data-move-count", String(moveCount));
    
    setPos({
      x: Math.max(10, Math.min(window.innerWidth - 80, newX)),
      y: Math.max(10, Math.min(window.innerHeight - 80, newY))
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>, onClick: () => void) => {
    const el = e.currentTarget;
    el.releasePointerCapture(e.pointerId);
    el.setAttribute("data-dragging", "false");
    
    // Only fire trigger click if they didn't significantly drag the bubble
    const moveCount = Number(el.getAttribute("data-move-count") || 0);
    if (moveCount < 6) {
      onClick();
    }
  };

  // Compile randomly-shuffled live feed of Soup-Souveraineté Alimentaire du Bénin 
  const generateSouveraineteFeed = () => {
    return [];
  };

  // Sync live feed ONLY once on load or when empty, so it does NOT auto-refresh when background databases sync.
  useEffect(() => {
    if (activeTab === "home" && souveraineteFeed.length === 0) {
      setSouveraineteFeed(generateSouveraineteFeed());
    }
  }, [activeTab]);

  // Loading of administrative portal statistics and registered accounts
  const loadAdminSupervisionData = async () => {
    if (!isUserJbz) return;
    setIsLoadingAdmin(true);
    try {
      const resUsers = await fetch("/api/admin/users");
      if (resUsers.ok) {
        const d = await resUsers.json();
        setAdminUserList(d.users || []);
      }
      const resContacts = await fetch("/api/admin/contacts");
      if (resContacts.ok) {
        const d = await resContacts.json();
        setAdminContactMessages(d.contactMessages || []);
      }
    } catch (e) {
      console.error("Failed loading administrative logs", e);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  // Trigger admin loaders automatically
  useEffect(() => {
    if (activeTab === "supervision") {
      loadAdminSupervisionData();
    }
  }, [activeTab]);

  const handleAdminWarnUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/warn`, { method: "POST" });
      if (res.ok) {
        alert("✓ Avertissement officiel délivré avec succès à l'utilisateur.");
        loadAdminSupervisionData();
      }
    } catch (e) { console.error(e); }
  };

  const handleAdminBlockUser = async (userId: string, username: string) => {
    const reason = prompt(`Saisissez le motif de la suspension temporaire pour @${username} :`, "Non-respect récurrent de la charte de confiance Agribot Mine d'Or.");
    if (reason === null) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        alert(`✓ L'utilisateur @${username} a été temporairement suspendu.`);
        loadAdminSupervisionData();
      }
    } catch (e) { console.error(e); }
  };

  const handleAdminUnblockUser = async (userId: string, username: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/unblock`, { method: "POST" });
      if (res.ok) {
        alert(`✓ Le compte @${username} a été débloqué.`);
        loadAdminSupervisionData();
      }
    } catch (e) { console.error(e); }
  };

  const handleAdminTogglePremium = async (userId: string, isPremium: boolean, months: number = 1) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/premium`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPremium, months })
      });
      if (res.ok) {
        alert(`✓ Statut premium de cet utilisateur mis à jour (${isPremium ? "Activé pour " + months + " mois" : "Désactivé"}).`);
        loadAdminSupervisionData();
      }
    } catch (e) { console.error(e); }
  };

  const handleAdminDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`⚠️ ÊTES-VOUS ABSOLUMENT SÛR de vouloir supprimer définitivement le compte de @${username} de la base Agribot ? Cette action est définitive.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        alert(`✓ Compte de @${username} effacé de l'infrastructure.`);
        loadAdminSupervisionData();
      }
    } catch (e) { console.error(e); }
  };

  const handleAdminMarkReplied = async (conId: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${conId}/replied`, { method: "POST" });
      if (res.ok) {
        loadAdminSupervisionData();
      }
    } catch (e) { console.error(e); }
  };

  // Handle trials countdown
  useEffect(() => {
    // Persist and restore the original trialStartDate in localStorage
    // This absolutely ensures the countdown never resets upon logging out and back in.
    let startMs: number;
    if (user) {
      const userTrialKey = `agribot_trial_start_${user.username.toLowerCase()}`;
      let savedStart = localStorage.getItem(userTrialKey);
      if (savedStart) {
        startMs = parseInt(savedStart, 10);
      } else {
        startMs = new Date(user.trialStartDate).getTime();
        localStorage.setItem(userTrialKey, startMs.toString());
      }
    } else {
      // Not logged in (guest / disconnected), track globally so countdown is always alive
      let globalStart = localStorage.getItem("agribot_global_trial_start");
      if (!globalStart) {
        globalStart = new Date().toISOString();
        localStorage.setItem("agribot_global_trial_start", globalStart);
      }
      startMs = new Date(globalStart).getTime();
    }

    const limit = startMs + (35 * 24 * 3600 * 1000); // 35 days (5 weeks) as requested
    
    // Compute immediately to avoid flicker
    const updateCountdown = () => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.ceil((limit - now) / 1000));
      setTrialTimeRemaining(diffSec);
    };

    updateCountdown();

    // Live countdown update
    const timer = setInterval(() => {
      updateCountdown();

      // Add monetization micro-earnings (.05F per second spent)
      if (user) {
        setViewTimeSeconds(prev => {
          const next = prev + 1;
          setEcobankBalance(Number((next * 0.05).toFixed(2)));
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  const appendLocalItem = (key: string, item: any) => {
    try {
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(item); // insert at start
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem("agribot_active_user", JSON.stringify(authenticatedUser));
    try {
      const raw = localStorage.getItem("agribot_users_list");
      const list = raw ? JSON.parse(raw) : [];
      const exists = list.some((u: any) => u.id === authenticatedUser.id || u.username.toLowerCase() === authenticatedUser.username.toLowerCase());
      if (!exists) {
        list.push(authenticatedUser);
        localStorage.setItem("agribot_users_list", JSON.stringify(list));
      }
    } catch (e) {
      console.error(e);
    }
    syncData();
  };

  const logout = () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      setUser(null);
      localStorage.removeItem("agribot_active_user");
      localStorage.removeItem("auth_locked_until");
    }
  };

  // Add Product method
  const handleAddProduct = async (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    // If not premium, check trial limits of 4 products maximum
    if (!isPremiumActive) {
      const myProductsCount = products.filter(p => p.userId === user?.id).length;
      if (myProductsCount >= 4) {
        alert("🔒 STATUT D'ESSAI LIMITÉ (MAX 4 PRODUITS GÉRÉ) : Pour publier plus de 4 produits maraîchers simultanément sur le marché d'Agribot Mine d'Or Bénin, veuillez débloquer l'Abonnement Premium (MTN MoMo: *880#).");
        return;
      }
    }

    const tempId = "prod_" + Math.random().toString(36).substr(2, 9);
    const fullProd = {
      ...newProd,
      userId: user?.id,
      id: tempId,
      createdAt: new Date().toISOString()
    };
    appendLocalItem("agribot_local_products", fullProd);
    setProducts(prev => [fullProd, ...prev]);

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProd, id: tempId, userId: user?.id })
    }).catch(err => console.error("Server creation failed. Synced from cache instead.", err));

    syncData();
    setNotifications(prev => ["Nouveau produit mis en vente sur le Marché !", ...prev]);
  };

  // Update Product
  const handleUpdateProduct = async (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    try {
      const raw = localStorage.getItem("agribot_local_products");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map((p: any) => p.id === id ? { ...p, ...updatedFields } : p);
        localStorage.setItem("agribot_local_products", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedFields, userId: user?.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      const raw = localStorage.getItem("agribot_local_products");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.filter((p: any) => p.id !== id);
        localStorage.setItem("agribot_local_products", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/products/${id}?userId=${user?.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Add CV
  const handleAddCv = async (newCv: Omit<CVProfile, 'id' | 'createdAt'>) => {
    // If not premium, check trial limits of 1 CV profile maximum
    if (!isPremiumActive) {
      const myCvsCount = cvProfiles.filter(c => c.userId === user?.id).length;
      if (myCvsCount >= 1) {
        alert("🔒 STATUT D'ESSAI LIMITÉ (MAX 1 CV COORDONNÉ) : Pour référencer d'autres profils CVs ou stages maraîchers simultanément sur Agribot Mine d'Or Bénin, veuillez débloquer l'Abonnement Premium (MTN MoMo: *880#).");
        return;
      }
    }

    const tempId = "cv_" + Math.random().toString(36).substr(2, 9);
    const fullCv = {
      ...newCv,
      userId: user?.id,
      id: tempId,
      createdAt: new Date().toISOString()
    };
    appendLocalItem("agribot_local_cvs", fullCv);
    setCvProfiles(prev => [fullCv, ...prev]);

    await fetch("/api/cvs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCv, id: tempId, userId: user?.id })
    }).catch(err => console.error("Server creation failed. Synced from cache instead.", err));

    syncData();
    setNotifications(prev => ["Nouveau CV agro-enregistré disponible !", ...prev]);
  };

  // Update CV
  const handleUpdateCv = async (id: string, updatedFields: Partial<CVProfile>) => {
    setCvProfiles(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    try {
      const raw = localStorage.getItem("agribot_local_cvs");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map((c: any) => c.id === id ? { ...c, ...updatedFields } : c);
        localStorage.setItem("agribot_local_cvs", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/cvs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedFields, userId: user?.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Delete CV
  const handleDeleteCv = async (id: string) => {
    setCvProfiles(prev => prev.filter(c => c.id !== id));
    try {
      const raw = localStorage.getItem("agribot_local_cvs");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.filter((c: any) => c.id !== id);
        localStorage.setItem("agribot_local_cvs", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/cvs/${id}?userId=${user?.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Add Project
  const handleAddProject = async (newProj: Omit<ProjectProposal, 'id' | 'createdAt'>) => {
    const tempId = "proj_" + Math.random().toString(36).substr(2, 9);
    const fullProj = {
      ...newProj,
      userId: user?.id,
      id: tempId,
      createdAt: new Date().toISOString()
    };
    appendLocalItem("agribot_local_projects", fullProj);
    setProjectProposals(prev => [fullProj, ...prev]);

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProj, id: tempId, userId: user?.id })
    }).catch(err => console.error("Server creation failed. Synced from cache instead.", err));

    syncData();
    setNotifications(prev => ["Nouveau projet prêt pour financement soumis !", ...prev]);
  };

  // Update Project
  const handleUpdateProject = async (id: string, updatedFields: Partial<ProjectProposal>) => {
    setProjectProposals(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    try {
      const raw = localStorage.getItem("agribot_local_projects");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map((p: any) => p.id === id ? { ...p, ...updatedFields } : p);
        localStorage.setItem("agribot_local_projects", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedFields, userId: user?.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    setProjectProposals(prev => prev.filter(p => p.id !== id));
    try {
      const raw = localStorage.getItem("agribot_local_projects");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.filter((p: any) => p.id !== id);
        localStorage.setItem("agribot_local_projects", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/projects/${id}?userId=${user?.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Add Appel à candidatures
  const handleAddAppel = async (newAppel: Omit<AppelCandidature, 'id' | 'createdAt' | 'userName' | 'userId'>) => {
    const tempId = "appel_" + Math.random().toString(36).substr(2, 9);
    const fullAppel: AppelCandidature = {
      ...newAppel,
      id: tempId,
      userId: user?.id || "anonymous",
      userName: user ? `@${user.username}` : "Anonyme",
      createdAt: new Date().toISOString()
    };
    setAppelsCandidatures(prev => [fullAppel, ...prev]);
    try {
      const raw = localStorage.getItem("agribot_local_appels_candidatures");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(fullAppel);
      localStorage.setItem("agribot_local_appels_candidatures", JSON.stringify(list));
    } catch (e) { console.error(e); }

    await fetch("/api/appels-candidatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newAppel, id: tempId, userId: user?.id, userName: user ? `@${user.username}` : "Anonyme" })
    }).catch(err => console.error(err));

    syncData();
    setNotifications(prev => ["Nouvel appel à candidatures disponible !", ...prev]);
  };

  // Update Appel à candidatures
  const handleUpdateAppel = async (id: string, updatedFields: Partial<AppelCandidature>) => {
    setAppelsCandidatures(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
    try {
      const raw = localStorage.getItem("agribot_local_appels_candidatures");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map((a: any) => a.id === id ? { ...a, ...updatedFields } : a);
        localStorage.setItem("agribot_local_appels_candidatures", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/appels-candidatures/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedFields, userId: user?.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Delete Appel à candidatures
  const handleDeleteAppel = async (id: string) => {
    setAppelsCandidatures(prev => prev.filter(a => a.id !== id));
    try {
      const raw = localStorage.getItem("agribot_local_appels_candidatures");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.filter((a: any) => a.id !== id);
        localStorage.setItem("agribot_local_appels_candidatures", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/appels-candidatures/${id}?userId=${user?.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Create Solidarity Demand
  const handleCreateSolidarityDemand = async (newDem: Omit<SolidarityDemand, "id" | "userId" | "userName" | "statut" | "createdAt">) => {
    if (!user) return;
    const tempId = "dem_" + Math.random().toString(36).substr(2, 9);
    const isUserZounmatoun = user.username.toLowerCase() === "jbz001" || user.username.toLowerCase() === "coordonnateur" || user.username.toLowerCase() === "administrateur";
    const displayName = isUserZounmatoun ? "Administrateur AgriBot" : `${user.firstName} ${user.lastName}`;
    const fullDem: SolidarityDemand = {
      ...newDem,
      id: tempId,
      userId: user.id,
      userName: displayName,
      statut: "ouverte",
      createdAt: new Date().toISOString()
    };
    appendLocalItem("agribot_local_solidarity_demands", fullDem);
    setSolidarityDemands(prev => [fullDem, ...prev]);

    await fetch("/api/solidarity-demands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newDem,
        id: tempId,
        userId: user.id,
        userName: displayName
      })
    }).catch(err => console.error("Solidarity demand creation failed on server; cached locally", err));

    syncData();
    setNotifications(prev => ["Nouvelle demande d'entraide agricole publiée !", ...prev]);
  };

  // Apply to Solidarity Demand
  const handleApplySolidarityDemand = async (demandeId: string, message: string) => {
    if (!user) return;
    const tempId = "cand_" + Math.random().toString(36).substr(2, 9);
    const isUserZounmatoun = user.username.toLowerCase() === "jbz001" || user.username.toLowerCase() === "coordonnateur" || user.username.toLowerCase() === "administrateur";
    const displayName = isUserZounmatoun ? "Administrateur AgriBot" : `${user.firstName} ${user.lastName}`;
    const fullCand: SolidarityCandidature = {
      id: tempId,
      demandeId,
      userId: user.id,
      userName: displayName,
      message,
      statut: "envoye",
      createdAt: new Date().toISOString()
    };
    appendLocalItem("agribot_local_solidarity_candidatures", fullCand);
    setSolidarityCandidatures(prev => [...prev, fullCand]);

    await fetch("/api/solidarity-candidatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        demandeId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        message
      })
    }).catch(err => console.error("Solidarity candidature creation failed on server; cached locally", err));

    syncData();
  };

  // Close Solidarity Demand
  const handleCloseSolidarityDemand = async (demandId: string) => {
    setSolidarityDemands(prev => prev.map(d => d.id === demandId ? { ...d, statut: "terminee" } : d));
    // update localStorage
    try {
      const raw = localStorage.getItem("agribot_local_solidarity_demands");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map((d: any) => d.id === demandId ? { ...d, statut: "terminee" } : d);
        localStorage.setItem("agribot_local_solidarity_demands", JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }

    await fetch("/api/solidarity-demands/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demandId })
    }).catch(err => console.error("Close demand failed on server; updated locally", err));

    syncData();
  };

  // Contact via AgriChat route support
  const handleContactViaChat = (userName: string, contactValue: string, titleOfProduct: string) => {
    setChatSubAngle("private");
    const targetUserId = "usr_solidarity_" + userName.replace(/\s+/g, "_");
    setPrivateRecipient({ id: targetUserId, name: userName, phone: "" });
    setChatInput(`Bonjour @${userName}, je vous contacte suite à votre demande d'entraide solidaire : "${titleOfProduct}". Comment puis-je vous aider ?`);
    setActiveTab("agrichat");
  };

  // Submit new CV via modal with formatted data
  const handleAddCvModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCv({
      firstName: newCvFirstName,
      lastName: newCvLastName,
      type: newCvType,
      education: newCvEducation,
      specialty: newCvSpecialty,
      skills: newCvSkills,
      contact: newCvContact,
      locationDesired: newCvLocation,
      university: newCvUniversity
    });
    setNewCvFirstName("");
    setNewCvLastName("");
    setNewCvEducation("");
    setNewCvSpecialty("");
    setNewCvSkills("");
    setNewCvContact("");
    setNewCvLocation("");
    setNewCvUniversity("");
    setShowAddCvModal(false);
  };

  // Submit new Product via modal with formatted data
  const handleAddProductModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddProduct({
      title: newProdName,
      price: Number(newProdPrice),
      location: newProdLocation,
      sellerName: user ? `${user.firstName} ${user.lastName}` : "Producteur local",
      sellerPhone: newProdPhone,
      description: newProdDescription,
      type: "Légumes"
    });
    setNewProdName("");
    setNewProdPrice("");
    setNewProdLocation("");
    setNewProdPhone("");
    setNewProdDescription("");
    setShowAddProductModal(false);
  };

  // Post chat message (supports dual-angle channels and attachment uploads)
  const handlePostChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !chatInput.trim()) return;

    const replyTarget = chatMessages.find(m => m.id === replyMessageId);
    const tempId = "msg_" + Math.random().toString(36).substr(2, 9);
    
    const isUserZounmatoun = user.username.toLowerCase() === "jbz001" || user.username.toLowerCase() === "coordonnateur" || user.username.toLowerCase() === "administrateur";
    const displayName = isUserZounmatoun ? "Administrateur AgriBot" : `${user.firstName} ${user.lastName}`;
    
    const newMsg: ChatMessage = {
      id: tempId,
      senderId: user.id,
      senderName: displayName,
      content: chatInput,
      timestamp: new Date().toISOString(),
      readBy: [user.id],
      replyToId: replyMessageId || undefined,
      replyToContent: replyTarget?.content || undefined,
      replyToSenderName: replyTarget?.senderName || undefined,
      isPrivate: chatSubAngle === "private",
      recipientId: chatSubAngle === "private" && privateRecipient ? privateRecipient.id : undefined,
      recipientName: chatSubAngle === "private" && privateRecipient ? privateRecipient.name : undefined,
      photoAttachment: chatPhotoFile || undefined
    };

    appendLocalItem("agribot_local_messages", newMsg);
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");
    setReplyMessageId(null);
    setChatPhotoFile(null); // Reset after attachment is loaded

    await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user.id,
        senderName: displayName,
        content: newMsg.content,
        replyToId: replyMessageId || undefined,
        replyToContent: replyTarget?.content || undefined,
        replyToSenderName: replyTarget?.senderName || undefined,
        isPrivate: newMsg.isPrivate,
        recipientId: newMsg.recipientId,
        recipientName: newMsg.recipientName,
        photoAttachment: newMsg.photoAttachment
      })
    }).catch(err => console.error("Server messaging send failed. Safe in cache.", err));

    syncData();
  };

  // Update chat message
  const handleUpdateChatMessage = async (id: string, newContent: string) => {
    if (!user) return;
    setChatMessages(prev => prev.map(m => m.id === id ? { ...m, content: newContent } : m));
    
    try {
      const raw = localStorage.getItem("agribot_local_messages");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map((m: any) => m.id === id ? { ...m, content: newContent } : m);
        localStorage.setItem("agribot_local_messages", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/chat/message/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent, userId: user.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Delete chat message
  const handleDeleteChatMessage = async (id: string) => {
    if (!user) return;
    setChatMessages(prev => prev.filter(m => m.id !== id));
    
    try {
      const raw = localStorage.getItem("agribot_local_messages");
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.filter((m: any) => m.id !== id);
        localStorage.setItem("agribot_local_messages", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }

    await fetch(`/api/chat/message/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id })
    }).catch(err => console.error(err));

    syncData();
  };

  // Dynamic user reporting submission (sends data directly to Jean Baptiste's admin mail via /api/contact)
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reportingMessage || !reportingReason.trim()) return;

    const reportedUserLabel = reportingMessage.senderName;
    const bodyContent = `🚨 SIGNALEMENT DE COMPORTEMENT AGRI-CHATS 🚨\nSignataire de l'alerte: @${user.username} (${user.firstName} ${user.lastName})\nPersonne à signaler: ${reportedUserLabel} (ID de l'expéditeur: ${reportingMessage.senderId})\n\nMotif du signalement:\n"${reportingReason}"\n\nContenu du message d'origine:\n"${reportingMessage.content}"`;

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Système de Modération AgriChat",
        email: "moderation@agribot-africa.com",
        message: bodyContent
      })
    }).catch(err => console.error("Report transmission failure", err));

    setReportingFeedback(`✓ Le signalement contre ${reportedUserLabel} a bien été transmis à l'Administrateur AgriBot (administrateur@agribot-africa.com). Des sanctions de blocage temporaire seront appliquées sous 24 heures.`);
    setReportingReason("");
    setTimeout(() => {
      setReportingMessage(null);
      setReportingFeedback(null);
    }, 4000);
  };

  // Get active contacts the user has conversed with in private rooms
  const getPrivateContactsList = () => {
    if (!user) return [];
    const contacts: { id: string; name: string }[] = [];
    chatMessages.forEach(m => {
      if (m.isPrivate) {
        if (m.senderId === user.id && m.recipientId) {
          if (!contacts.some(c => c.id === m.recipientId)) {
            contacts.push({ id: m.recipientId, name: m.recipientName || "Vendeur" });
          }
        } else if (m.recipientId === user.id) {
          if (!contacts.some(c => c.id === m.senderId)) {
            contacts.push({ id: m.senderId, name: m.senderName });
          }
        }
      }
    });
    return contacts;
  };

  // Export Guide Text File (Slightly modified to provide high-quality structural layout representation)
  const handleDownloadPlatformGuide = () => {
    const title = "====================================================================================\n" +
                  "                    AGRIGUIDE : LE GUIDE COMPLET DE A A Z                           \n" +
                  "                           L'AGRICULTURE UNE MINE D'OR                              \n" +
                  "====================================================================================\n" +
                  "Auteur Principal : Administrateur AgriBot, Agro socio vulgarisateur\n" +
                  "Formation : Formé au Centre Songhaï\n" +
                  "Source : Toutes les connaissances sur la plateforme sont tirées de mes compétences\n" +
                  `Date de Téléchargement : ${new Date().toLocaleDateString("fr-FR")}\n\n`;
    
    const text = `
------------------------------------------------------------------------------------
1. INTRODUCTION & FONDATION
------------------------------------------------------------------------------------
L'agriculture maraîchère, végétale, et les élevages d'espèces (volaille, bovins)
représentent l'épine dorsale de l'autonomie paysanne. Ce guide conçu sur le terrain
réunit les itinéraires culturaux d'A à Z tirés de mes compétences de vulgarisation agricole.

------------------------------------------------------------------------------------
2. IMPORTANCE & VISION SOUVERAINE
------------------------------------------------------------------------------------
La vision de la direction AgriBot (méthodes du Centre Songhaï)
est de doter chaque paysan et coopérative maraîchère de méthodes biologiques résilientes
sans dépendance à des intrants synthétiques coûteux. 

------------------------------------------------------------------------------------
3. MODE D'EMPLOI DES FONCTIONS DE LA PLATEFORME
------------------------------------------------------------------------------------
- AgriBot AI : Système de diagnostic instantané en continu (Gemini 3.5).
- Fiches de Diagnostics Biologiques : Remèdes détaillés pour maladies, insectes saphir,
  pourriture apicale, gumboro aviaire.
- Super Calculatrice Financière : Modélisation des rendements avec ajustements de surface,
  application de 5% de pertes pour le végétal, mortalité ajustée par espèces de volailles/mammifères,
  et pertes d'agro-transformation par étapes critiques.
- Marché Coopératif du Bénin : Directement connecté aux réseaux WhatsApp préremplis
  et conversation tchats AgriChat Privé.
- Recrutement & Direction stages : Orientation et placement assisté par l'IA AgriBot.

------------------------------------------------------------------------------------
4. APPUI CONSEIL ET DIRECTION DE CHANTIER AGROÉCOLOGIQUE
------------------------------------------------------------------------------------
Pour toute préoccupation, questions de semences paysannes ou encadrement de stagiaires,
contactez directement l'administration de la plateforme :
E-mail : administrateur@agribot-africa.com
Téléphone d'Assistance Directe : +229 61 44 32 62

"Faisons de la terre nourricière africaine notre première mine d'or souveraine !"
====================================================================================
`;
    const blob = new Blob([title + text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "GUIDE_AGRICULTURE_MINE_D_OR_ADMINISTRATEUR.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Marks all chat messages read
  const handleMarkChatRead = async () => {
    if (!user) return;
    await fetch("/api/chat/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id })
    });
    setUnreadMessagesCount(0);
  };

  const handleDirectMomoPayment = async (plan: 'hebdo' | 'mensuel' | 'trimestriel' | 'annuel', amount: number) => {
    if (!user) {
      alert("⚠️ Veuillez d'abord vous connecter pour vous abonner.");
      return;
    }
    setSelectedPlanForPrompt(plan);
    setSelectedPlanAmount(amount);
    setShowMomoOverlay(true);
    setIsPayingMomo(false);
  };

  const executeMomoBillingRequest = async () => {
    if (!momoPhoneNumber || momoPhoneNumber.trim().length !== 8) {
      alert("⚠️ Saisissez un numéro de téléphone Mobile Money valide à 8 chiffres.");
      return;
    }
    setIsPayingMomo(true);
    setPremiumFeedbackMsg("Envoi de la demande de paiement...");
    setMomoPinEntering(false);
    setMomoPinValue("");
    setIsMomoPinProcessing(false);
    
    try {
      const res = await fetch("/api/momo/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          phone: momoPhoneNumber,
          amount: selectedPlanAmount,
          planType: selectedPlanForPrompt
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Une erreur est survenue lors de la facturation.");
        setIsPayingMomo(false);
        return;
      }
      
      setMomoSubId(data.subId);
      setPremiumFeedbackMsg(`📲 Demande de débit reçue ! Veuillez saisir le code PIN MoMo sur l'invite de votre téléphone.`);
      
      // Automatically pop up the mobile push notification simulation in 1.5s
      setTimeout(() => {
        setMomoPinEntering(true);
      }, 1500);
      
    } catch (e) {
      console.error(e);
      setPremiumFeedbackMsg("❌ Problème de connexion serveur.");
      setIsPayingMomo(false);
    }
  };

  const confirmMomoPinAndPay = async () => {
    if (momoPinValue.trim().length !== 4) {
      alert("⚠️ Veuillez saisir votre code PIN secret à 4 chiffres pour confirmer l'autorisation du débit direct.");
      return;
    }
    setIsMomoPinProcessing(true);
    
    // Simulate interactive USSD processing logic
    setTimeout(async () => {
      try {
        await simulateSuccessWebhook();
        setMomoPinEntering(false);
        setMomoPinValue("");
        setIsMomoPinProcessing(false);
      } catch (err) {
        console.error(err);
        setIsMomoPinProcessing(false);
      }
    }, 1800);
  };

  const simulateSuccessWebhook = async () => {
    if (!selectedPlanForPrompt) return;
    try {
      const res = await fetch("/api/momo/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          externalId: user?.id,
          status: "SUCCESS",
          amount: selectedPlanAmount.toString()
        })
      });
      if (res.ok) {
        const updated = { ...user!, isPremium: true, plan: "premium" as const };
        setUser(updated);
        localStorage.setItem("agribot_active_user", JSON.stringify(updated));
        
        setShowMomoOverlay(false);
        alert(`🎉 Félicitations ! Votre paiement par Mobile Money a été validé ! Vous possédez désormais l'accès Premium illimité !`);
        setPremiumFeedbackMsg("✨ Premium Activé !");
        syncData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger subscription buy code via MTN dial codes
  const handlePlanSubAction = async (plan: 'mensuel' | 'trimestriel' | 'annuel', dialCode: string) => {
    if (!user) {
      setPremiumFeedbackMsg("⚠️ Veuillez vous connecter d'abord pour activer l'abonnement.");
      return;
    }
    if (!acceptedPremiumTerms) {
      setPremiumFeedbackMsg("⚠️ Cochez la case 'Valider et certifier le paiement' pour activer le traitement direct de l'abonnement.");
      return;
    }

    setPremiumFeedbackMsg("Lancement de la requête d'abonnement MTN...");

    try {
      const res = await fetch("/api/sub/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan })
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedSubscriptionId(data.subId);
        setCreatedSubscriptionPlan(plan);
        setCreatedSubscriptionUssd(data.ussd);
        setCreatedSubscriptionAmount(plan === 'mensuel' ? 1000 : (plan === 'trimestriel' ? 2500 : 9000));
        setPremiumFeedbackMsg(`📲 Code MTN composé automatiquement : ${data.ussd}. Veuillez maintenant copier/coller la preuve de paiement ou la référence ci-dessous.`);
        
        // Attempt to dial USSD automatically
        window.location.href = `tel:${encodeURIComponent(data.ussd)}`;
        
        // Refresh subscriptions and data
        syncData();
      } else {
        setPremiumFeedbackMsg("❌ Erreur de création d'abonnement.");
      }
    } catch (e) {
      console.error(e);
      setPremiumFeedbackMsg("❌ Connexion au serveur échouée.");
    }
  };

  const handleUploadPreuveAction = async () => {
    if (!createdSubscriptionId) return;
    if (!momoTransactionReference && !momoScreenshotFile) {
      alert("⚠️ Veuillez insérer un code de référence de transaction ou téléverser une capture d'écran.");
      return;
    }

    const proofData = momoTransactionReference || momoScreenshotFile || "";

    try {
      const res = await fetch("/api/sub/upload-preuve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subId: createdSubscriptionId, proof: proofData })
      });
      if (res.ok) {
        setPremiumFeedbackMsg("✨ Preuve envoyée avec succès ! Votre abonnement est en attente de validation par l'administrateur sous 24 heures maximum.");
        alert("✓ Preuve envoyée ! Votre abonnement sera validé sous 24h.");
        setCreatedSubscriptionId(null);
        setMomoTransactionReference("");
        setMomoScreenshotFile(null);
        syncData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleValidateSubAdminAction = async (subId: string) => {
    try {
      const res = await fetch("/api/sub/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subId })
      });
      if (res.ok) {
        alert("✓ L'abonnement a été validé ! L'utilisateur est maintenant membre Premium Pro.");
        syncData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateReviewAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("⚠️ Veuillez vous connecter pour soumettre un avis.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/avis/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          note: reviewRatingInput,
          commentaire: reviewCommentInput
        })
      });
      if (res.ok) {
        setReviewCommentInput("");
        alert("🎉 Merci ! Votre avis d'agriculteur actif a été publié sur Agribot Mine d'Or Bénin.");
        syncData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleUnlockContactAction = async (productId: string) => {
    if (!user) {
      alert("⚠️ Veuillez vous connecter pour débloquer les coordonnées de ce vendeur.");
      return;
    }
    const dialCode = "*880*46*61443262*500#"; // 10% market commission safety MTN USSD fee code
    window.location.href = `tel:${encodeURIComponent(dialCode)}`;

    try {
      const res = await fetch("/api/market/unlock-contact-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId })
      });
      if (res.ok) {
        setUnlockedContactsList(prev => [...prev, productId]);
        alert("🎉 Requête MTN MoMo émise ! Les coordonnées ont été débloquées avec succès.");
        syncData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Document buy MTN Code process
  const handleBuyDocument = async (dialCode: string) => {
    if (!docRecipientEmail) {
      setDocErrorMessage("⚠️ Veuillez spécifier l'adresse e-mail de réception requise avant de passer au paiement.");
      return;
    }

    setDocErrorMessage(null);
    window.location.href = `tel:${encodeURIComponent(dialCode)}`;

    const res = await fetch("/api/document-purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientEmail: docRecipientEmail })
    });

    if (res.ok) {
      const data = await res.json();
      setDownloadedDocCode(data.code);
      setPremiumFeedbackMsg(`Guide technique expédié avec succès à ${docRecipientEmail}. Entrez le code de déverrouillage pour ouvrir la bibliothèque PDF.`);
    }
  };

  // unlock PDF simulation
  const handleUnlockPdfFile = () => {
    if (pdfUnlockPassword === downloadedDocCode) {
      setIsPdfUnlocked(true);
      setDocErrorMessage(null);
    } else {
      setDocErrorMessage("❌ Code de sécurité invalide. Vous devez payer ou ressaisir le bon mot de passe reçu par mail.");
    }
  };

  // Bottom contact submission
  const handleBottomContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      alert("Veuillez remplir tous les champs du formulaire d'assistance.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage })
      });

      if (res.ok) {
        setContactFeedback("✅ Votre message a été transmis directement au Bureau d'Appui de la Plateforme AgriBot. Nous vous recontacterons !");
      } else {
        setContactFeedback("💾 Message sauvegardé localement ! Notre messagerie AgriBot a stocké votre préoccupation et l'équipe administrative de la Plateforme s'en chargera.");
      }
    } catch (err) {
      console.warn("Contact error, falling back dynamically:", err);
      // Fallback message saved locally
      setContactFeedback("✅ Demande enregistrée avec succès ! Votre requête a été transmise à la coordination de la Plateforme.");
    } finally {
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }
  };

  // Redirect crop to AI assistant
  const handleRedirectToAgribot = (prompt: string) => {
    setAgribotInitialPrompt(prompt);
    setActiveTab("agribot");
  };

  // Dedicated product interest flow to route user U directly to the coordinator with the product's index
  const handleInterestedInMarketProduct = async (prod: Product) => {
    if (!user) {
      alert("Veuillez vous connecter pour contacter le coordinateur.");
      return;
    }
    const isUserAdmin = user.id === "usr_admin_jbz" || user.username?.toLowerCase() === "jbz001" || user.username?.toLowerCase() === "coordonnateur";
    if (isUserAdmin) {
      alert("Vous êtes le Coordonnateur. Vous ne pouvez pas faire une demande d'intérêt à vous-même.");
      return;
    }

    const messageText = `Bonjour Coordonnateur, je suis très intéressé par la publication suivante sur la marketplace :
👉 Produit: ${prod.title}
💰 Prix: ${prod.price.toLocaleString()} F CFA
📍 Lieu: ${prod.location}
🧔 Vendeur: ${prod.sellerName}
[ID-PUBLICATION: ${prod.id}]`;

    // Auto-send the message in private chat to the coordinator
    try {
      await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          senderName: `@${user.username || "Adhérent"}${user.firstName ? " (" + user.firstName + ")" : ""}`,
          content: messageText,
          isPrivate: true,
          recipientId: "usr_admin_jbz",
          recipientName: "J-B. Zounmatoun (Coordonnateur)"
        })
      });
    } catch (err) {
      console.error("Auto message send failed", err);
    }

    // Set destination channel to inbox and navigate there
    setChatSubAngle("private");
    setPrivateRecipient({ id: "usr_admin_jbz", name: "J-B. Zounmatoun (Coordonnateur)", phone: "01614432" });
    setChatInput("");
    setActiveTab("agrichat");
  };

  // Direct contact seller inside private chat
  const handleContactSellerPrivate = (sellerName: string, sellerPhone: string, titleOfProduct: string) => {
    setChatSubAngle("private");
    // Direct recipient is Administrateur Jean-Baptiste ZOUNMATOUN
    setPrivateRecipient({ id: "usr_admin_jbz", name: "Jean-Baptiste ZOUNMATOUN (Administrateur)", phone: "01614432" });
    setChatInput(`Bonjour l'Administrateur Jean-Baptiste, je suis très intéressé par l'achat/la vente lié à la publication maraîchère suivante :
👉 "${titleOfProduct}".
Pouvez-vous m'accompagner pour finaliser l'opération en toute confiance ?`);
    setActiveTab("agrichat");
  };

  // Admin initiates tchat session with publisher
  const handleAdminInitiatePrivateChat = (sellerId: string, sellerName: string, sellerPhone: string, message: string) => {
    setChatSubAngle("private");
    setPrivateRecipient({ 
      id: sellerId || "generated_id", 
      name: sellerName || "Membre", 
      phone: sellerPhone || "01614432" 
    });
    setChatInput(message);
    setActiveTab("agrichat");
  };

  // List of application shortcut icons for the Home Grid Launcher (Alert/Bell app and redundant badges removed)
  const launcherApps = [
    { id: "agribot", name: "Agribot IA 🤖", icon: Sparkles, bg: "bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500", badge: "PRO" },
    { id: "fiches", name: "Fiches Techniques", icon: BookOpen, bg: "bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500" },
    { id: "calculator", name: "Super Calculatrice", icon: Calculator, bg: "bg-gradient-to-tr from-teal-600 to-emerald-500" },
    { id: "market", name: "MarketPlace", icon: ShoppingBag, bg: "bg-gradient-to-tr from-orange-600 to-amber-500" },
    { id: "solidarite", name: "Espace Solidarité", icon: HeartHandshake, bg: "bg-gradient-to-tr from-rose-600 to-red-500" },
    { id: "directory", name: "Recrutement & Stages", icon: Users, bg: "bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500" },
    { id: "agrichat", name: "AgriChat Forum", icon: MessageSquare, bg: "bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500" },
    { id: "premium", name: "Abonnement Premium", icon: Crown, bg: "bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-500", badge: "PRO" },
    { id: "contact", name: "Guide & Assistance", icon: Mail, bg: "bg-gradient-to-tr from-indigo-700 to-purple-600" }
  ];

  // Compile live scrolling ticker information elements matching all user requirements
  const getDynamicTickerNews = () => {
    const list: string[] = [
      "🌾 Subventions ATDA : Réduction de 40% sur l'acquisition de micro-irrigation d'agroécologie maraîchère.",
      "📍 Météo Bénin : Démarrage anticipé des précipitations côtières de l'Ouémé; protégez de préférence les semis maraîchers.",
      "🌽 Lancement INRAB : Introduction officielle de maïs hybrides certifiés adaptés au septentrion béninois.",
      "💡 Agrichat Live : Plus de 450 maraîchers bio partagent actuellement leurs expertises de fertilisation saine.",
      "🚨 Souveraineté : Restriction gouvernementale sur la réexportation de céréales locales pour approvisionner le pays.",
      "📈 Marché Malanville : Évolution du piment vert d'origine écologique à 11 500 FCFA (-4% ce matin sur Agri-Plateforme).",
      "🍍 Saveurs du Bénin : Hausse de 15% de la demande d'ananas bio Pain de Sucre d'Allada pour l'Europe et l'Afrique de l'Ouest.",
      "🥑 Éco-Prix Cotonou : Avocats d'agroforesterie sains vendus à Dantokpa au prix moyen stable de 155 FCFA l'unité.",
      "🥕 Éco-Prix Adjohoun : Tomate de plein champ agroécologique cotée à 320 FCFA le kilo (Filière maraîchère saine).",
      "🧅 Éco-Prix Parakou : Sac d'oignons rouges bios maraîchers du Bénin en hausse à 22 500 FCFA (Demande très forte).",
      "🌿 Éco-Prix Ouidah : Régime de bananes plantains bio fertilisées à la biomasse stable à 1 800 FCFA l'unité.",
      "🌽 Éco-Prix Bohicon : Grains de maïs local sain issu d'agroécologie stabilisés à 210 FCFA le bol d'Afrique de l'Ouest.",
      "🥜 Éco-Prix Natitingou : Huile d'arachide pressée de manière écologique cotée à 1 100 FCFA le litre.",
      "🌶️ Éco-Prix Glazoué : Grand panier de piment bio séché en hausse de +5% suite aux exigences de transition maraîchère.",
      "☕ Agroécologie : Succès croissant des intrants organiques compostés de la Donga, du Mono-Couffo et de l'Atlantique.",
      "📍 Plateforme FNDA : Plus de 820 dossiers d'appui financier approuvés pour la campagne 2026.",
      "🌾 Ministère du Numérique Bénin : Numérisation complète des carnets de vaccination pour l'élevage porcin.",
      "🍍 Commission Souveraineté : Promotion de l'enseignement agroécologique de Songhaï pour l'export d'ananas bios.",
      "📢 Plateforme d'Information SIM Bénin : Hausse générale observée de 8% sur les produits de maraîchage maraîchers.",
      "🌱 CARDER Bénin : Lancement de la caravane d'amendement organique et traitement des sols dégradés.",
      "💡 ONASA Bénin : Niveau de stock national de régulation renforcé à Parakou et Cotonou pour faire face aux pics de soudure."
    ];

    // Auto-inject Marketplace listings
    if (products && products.length > 0) {
      products.slice(0, 5).forEach((p) => {
        list.push(`🛍️ MARKETPLACE : @${p.sellerName} propose "${p.title}" à ${p.location} pour ${p.price.toLocaleString()} F CFA.`);
      });
    }

    // Auto-inject Cv Profiles
    if (cvProfiles && cvProfiles.length > 0) {
      cvProfiles.slice(0, 5).forEach((cv) => {
        list.push(`💼 RECRUTEMENT : @${cv.firstName} recherche un stage ou emploi de ${cv.type === "technician" ? "Technicien" : "Stagiaire"} (${cv.specialty}).`);
      });
    }

    // Auto-inject Project Proposals
    if (projectProposals && projectProposals.length > 0) {
      projectProposals.slice(0, 5).forEach((p) => {
        list.push(`💡 DEVIS PROJET : Projet agroécologique "${p.title}" par @${p.firstName} ${p.lastName} est actif.`);
      });
    }

    // Auto-inject Solidarity Demands
    if (solidarityDemands && solidarityDemands.length > 0) {
      solidarityDemands.slice(0, 5).forEach((d) => {
        list.push(`🤝 SOLIDARITÉ : @${d.userName} sollicite de l'assistance pour "${d.title}" à ${d.lieu} (${d.typeRemuneration === "payant" ? "Rémunéré" : "Bénévole"}).`);
      });
    }

    return list;
  };

  const getStoryTimeLeft = (createdAt: number) => {
    const elapsed = Date.now() - createdAt;
    const limit = 24 * 60 * 60 * 1000; // 24 hours limit
    const remaining = limit - elapsed;
    if (remaining <= 0) return "Expiré";
    
    const hours = Math.floor(remaining / (3600 * 1000));
    const minutes = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
    return `Exp: ${hours}h ${minutes}m`;
  };

  interface GroupedStory {
    userId: string;
    name: string;
    avatarUrl: string;
    badge: string;
    items: { 
      id: string; 
      name: string; 
      avatarUrl: string; 
      badge: string; 
      image: string; 
      text?: string; 
      createdAt: number; 
      mediaType?: "image" | "video"; 
      backgroundColor?: string; 
      fontFamily?: string; 
      isTextStory?: boolean;
      ck?: string;
      sb?: string;
      stats?: { i: string; v: string; l: string }[];
      rx?: number[];
    }[];
  }

  const groupedStories = useMemo((): GroupedStory[] => {
    const groups: { [key: string]: GroupedStory } = {};
    
    stories.forEach(story => {
      const nameKey = story.name;
      const isOwner = nameKey.toLowerCase() === "jean baptiste" || nameKey.toLowerCase() === (user?.firstName || "").toLowerCase();
      
      if (!groups[nameKey]) {
        groups[nameKey] = {
          userId: isOwner ? (user?.id || "jbz001") : `user_${nameKey.replace(/\s+/g, '_').toLowerCase()}`,
          name: story.name,
          avatarUrl: story.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2364748b'/><circle cx='12' cy='8.5' r='3.5' fill='%23f1f5f9'/><path d='M6 17c0-2.5 3-4.5 6-4.5s6 2 6 4.5v1.5H6V17z' fill='%23f1f5f9'/></svg>",
          badge: story.badge || "📸",
          items: []
        };
      }
      groups[nameKey].items.push(story);
    });
    
    return Object.values(groups).sort((a, b) => {
      const aIsOwner = a.name.toLowerCase() === "jean baptiste" || a.name.toLowerCase() === (user?.firstName || "").toLowerCase();
      const bIsOwner = b.name.toLowerCase() === "jean baptiste" || b.name.toLowerCase() === (user?.firstName || "").toLowerCase();
      if (aIsOwner) return -1;
      if (bIsOwner) return 1;
      return 0;
    });
  }, [stories, user?.firstName, user?.id]);

  const getGroupedStories = (): GroupedStory[] => {
    return groupedStories;
  };

  useEffect(() => {
    if (!activeStoryGroupKey) {
      setStoryTimerProgress(0);
      return;
    }

    const grouped = getGroupedStories();
    const groupIndex = grouped.findIndex(g => g.name === activeStoryGroupKey);
    if (groupIndex === -1) return;
    const group = grouped[groupIndex];
    const maxSegments = group.items.length;

    const duration = 30000; // Enforce 30 seconds display duration for all formats (photo, video, text) as explicitly requested
    const updateInterval = 100;
    const step = (updateInterval / duration) * 100;

    const timer = setInterval(() => {
      setStoryTimerProgress(prev => {
        if (prev >= 100) {
          if (currentStoryItemIndex < maxSegments - 1) {
            setCurrentStoryItemIndex(curr => curr + 1);
            return 0;
          } else {
            if (groupIndex < grouped.length - 1) {
              setActiveStoryGroupKey(grouped[groupIndex + 1].name);
              setCurrentStoryItemIndex(0);
              return 0;
            } else {
              setActiveStoryGroupKey(null);
              return 0;
            }
          }
        }
        return prev + step;
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [activeStoryGroupKey, currentStoryItemIndex]);

  useEffect(() => {
    setStoryTimerProgress(0);
  }, [activeStoryGroupKey, currentStoryItemIndex]);

  const handleNextStorySegment = () => {
    const grouped = getGroupedStories();
    if (!activeStoryGroupKey) return;
    const groupIndex = grouped.findIndex(g => g.name === activeStoryGroupKey);
    if (groupIndex === -1) return;
    const group = grouped[groupIndex];
    
    if (currentStoryItemIndex < group.items.length - 1) {
      setCurrentStoryItemIndex(prev => prev + 1);
    } else {
      if (groupIndex < grouped.length - 1) {
        setActiveStoryGroupKey(grouped[groupIndex + 1].name);
        setCurrentStoryItemIndex(0);
      } else {
        setActiveStoryGroupKey(null);
      }
    }
  };

  const handlePrevStorySegment = () => {
    const grouped = getGroupedStories();
    if (!activeStoryGroupKey) return;
    const groupIndex = grouped.findIndex(g => g.name === activeStoryGroupKey);
    if (groupIndex === -1) return;
    
    if (currentStoryItemIndex > 0) {
      setCurrentStoryItemIndex(prev => prev - 1);
    } else {
      if (groupIndex > 0) {
        const prevGroup = grouped[groupIndex - 1];
        setActiveStoryGroupKey(prevGroup.name);
        setCurrentStoryItemIndex(prevGroup.items.length - 1);
      } else {
        setCurrentStoryItemIndex(0);
      }
    }
  };

  const handleNextStoryPerson = () => {
    const grouped = getGroupedStories();
    if (!activeStoryGroupKey) return;
    const groupIndex = grouped.findIndex(g => g.name === activeStoryGroupKey);
    if (groupIndex === -1) return;
    
    if (groupIndex < grouped.length - 1) {
      setActiveStoryGroupKey(grouped[groupIndex + 1].name);
      setCurrentStoryItemIndex(0);
    } else {
      setActiveStoryGroupKey(null);
    }
  };

  const handlePrevStoryPerson = () => {
    const grouped = getGroupedStories();
    if (!activeStoryGroupKey) return;
    const groupIndex = grouped.findIndex(g => g.name === activeStoryGroupKey);
    if (groupIndex === -1) return;
    
    if (groupIndex > 0) {
      setActiveStoryGroupKey(grouped[groupIndex - 1].name);
      setCurrentStoryItemIndex(0);
    } else {
      setCurrentStoryItemIndex(0);
    }
  };

  const handleSendStoryReply = (replyText: string) => {
    if (!user || !activeStoryGroupKey || !replyText.trim()) return;
    
    const grouped = getGroupedStories();
    const activeGroup = grouped.find(g => g.name === activeStoryGroupKey);
    if (!activeGroup) return;
    
    const activeSegment = activeGroup.items[currentStoryItemIndex];
    
    const isOwner = activeGroup.name.toLowerCase() === "jean baptiste" || activeGroup.name.toLowerCase() === (user?.firstName || "").toLowerCase();
    if (isOwner) {
      alert("Vous ne pouvez pas vous répondre à vous-même !");
      return;
    }

    const segmentRef = activeSegment.isTextStory ? `"${activeSegment.text}"` : "Statut Photo Maraîchère";
    const fullContent = `[Réponse au Statut : ${segmentRef}] 🌾 : ${replyText}`;
    
    setPrivateRecipient({
      id: activeGroup.userId,
      name: activeGroup.name,
      phone: "+229"
    });
    
    const tempId = "msg_reply_" + Date.now();
    const isUserZounmatoun = user.username.toLowerCase() === "jbz001" || user.username.toLowerCase() === "coordonnateur" || user.username.toLowerCase() === "administrateur";
    const displayName = isUserZounmatoun ? "Administrateur AgriBot" : `${user.firstName} ${user.lastName}`;
    
    const newMsg: ChatMessage = {
      id: tempId,
      senderId: user.id,
      senderName: displayName,
      content: fullContent,
      timestamp: new Date().toISOString(),
      readBy: [user.id],
      isPrivate: true,
      recipientId: activeGroup.userId,
      recipientName: activeGroup.name,
      photoAttachment: activeSegment.isTextStory ? undefined : activeSegment.image
    };

    appendLocalItem("agribot_local_messages", newMsg);
    setChatMessages(prev => [...prev, newMsg]);
    
    setChatSubAngle("private");
    setActiveTab("agrichat");
    setActiveStoryGroupKey(null);
    
    setTimeout(() => {
      const inp = document.getElementById("chat-main-input-field");
      if (inp) inp.focus();
    }, 120);
    
    alert(`Discussion privée lancée avec @${activeGroup.name} !`);
  };

  const handleStoryTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleStoryTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    
    // Swipe down to exit story modal
    if (diffY > 80 && Math.abs(diffX) < 60) {
      setActiveStoryGroupKey(null);
      setTouchStartX(null);
      setTouchStartY(null);
      return;
    }
    
    // Swipe left (next person) / Swipe right (previous person)
    if (diffX < -60 && Math.abs(diffY) < 60) {
      handleNextStoryPerson();
    } else if (diffX > 60 && Math.abs(diffY) < 60) {
      handlePrevStoryPerson();
    }
    
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const tickerNewsList = React.useMemo(() => {
    return getDynamicTickerNews();
  }, [products, cvProfiles, projectProposals, solidarityDemands]);

  const canGoBack = tabHistory.length > 1 || 
    showStoryViewersList || 
    !!showStoryDetailId || 
    !!activeStoryGroupKey || 
    showAddStoryModal || 
    showSscPanel || 
    !!selectedMarketProductId || 
    !!selectedCvId || 
    !!selectedSolidarityId || 
    showAddCvModal || 
    showAddProductModal || 
    showMomoOverlay || 
    showWeatherModal || 
    showPublishPopup;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <AuthModal onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  if (activeTab === "videos") {
    return (
      <AgriVideosPanel 
        user={user} 
        isUserJbz={isUserJbz} 
        hasCv={cvProfiles.some(c => c.userId === user?.id)}
        onBack={handleBack} 
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${(activeTab === "agribot" || activeTab === "agrichat") ? "pb-[84px]" : "pb-12"} select-none transition-colors duration-300 ${(activeTab === "agribot" || activeTab === "agrichat") ? "bg-[#080d0a] text-[#e8f5ec]" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 5-WEEK / PREMIUM TRIAL LIVE DECREASING TICKER BAR AS REQUESTED */}
      <div className="bg-emerald-900 text-emerald-100 text-[10px] px-3 py-0.5 sm:py-1 font-mono flex flex-row justify-between items-center border-b border-emerald-800 shadow-sm shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap truncate">
          <Clock className="h-3 w-3 text-emerald-400 animate-pulse shrink-0" />
          <span className="font-extrabold uppercase tracking-tight text-[9px] truncate">
            {isPremiumActive 
              ? `⭐ PREMIUM ACTIF` 
              : `⏳ ESSAI DE 5 SEMAINES EN DÉMO`
            }
          </span>
          {isUserJbz && (
            <div className="hidden sm:flex items-center bg-emerald-950/90 rounded p-0.5 border border-emerald-700 font-sans gap-0.5 ml-1">
              <button
                onClick={() => setAdminForceTrialMode(false)}
                className={`px-1 rounded text-[8px] font-bold transition cursor-pointer ${!adminForceTrialMode ? 'bg-amber-600 text-white' : 'text-emerald-300'}`}
              >
                🛠️ Admin
              </button>
              <button
                onClick={() => setAdminForceTrialMode(true)}
                className={`px-1 rounded text-[8px] font-bold transition cursor-pointer ${adminForceTrialMode ? 'bg-amber-600 text-white' : 'text-emerald-300'}`}
              >
                👥 Essai
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 bg-emerald-950/80 px-1.5 py-0.2 rounded text-emerald-300 font-bold border border-emerald-800 shrink-0 text-[9px]">
          {isPremiumActive ? (
            <span>Plan Illimité</span>
          ) : (
            <div className="flex items-center gap-0.5">
              <span>⌚</span>
              <span>{Math.floor(trialTimeRemaining / 86400)}j {Math.floor((trialTimeRemaining % 86400) / 3600)}h</span>
            </div>
          )}
        </div>
      </div>

      {/* UNBYPASSABLE PREMIUM PRO BLOCKING LOCK OVERLAY */}
      {user && !isPremiumActive && trialTimeRemaining <= 0 && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border-2 border-amber-500 space-y-6">
            <div className="flex justify-center flex-col items-center">
              <div className="bg-amber-100 p-4 rounded-full text-amber-600 mb-3 animate-pulse">
                <Crown className="h-10 w-10 fill-amber-500 text-amber-600" />
              </div>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-mono tracking-widest font-black uppercase px-2.5 py-1 rounded">
                DÉLAI DE VERSION D'ESSAI EXPIRÉ
              </span>
              <h2 className="text-xl font-black text-slate-950 mt-4 leading-snug">
                La Version Premium s'Impose !
              </h2>
            </div>
            
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Bravo l'agro-fermier ! Vos 5 semaines d'essai gratuites de la plateforme <strong className="text-emerald-700">AgriBot Mine d'Or</strong> sont terminées. 
              Pour continuer à dialoguer avec AgriBot IA en direct, utiliser la super calculatrice de rendement maraîcher avec simulation de mortalité et d'agro-transformation, et publier vos CV ou offres de stages, vous devez souscrire un abonnement Premium Pro.
            </p>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-left space-y-2">
              <p className="text-[11px] font-bold text-amber-950 uppercase tracking-wide">💡 Comment débloquer mon accès sous 1 minute :</p>
              <ol className="list-decimal pl-4 text-[10.5px] text-slate-600 space-y-1">
                <li>Sélectionnez et validez un forfait premium ci-dessous.</li>
                <li>Le système MTN Mobile Money va s'enclencher automatiquement sur votre terminal.</li>
                <li>Dès confirmation du paiement, l'accès total illimité sera débloqué immédiatement !</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => handlePlanSubAction('mensuel', '*880*46*0161443262#')}
                className="py-3 px-2 bg-slate-900 text-white rounded-xl text-[11px] font-bold tracking-tight hover:bg-slate-800 transition cursor-pointer"
              >
                Plan Mensuel<br/>
                <span className="font-mono text-xs font-black text-amber-300">1 000 F CFA</span>
              </button>
              <button 
                onClick={() => handlePlanSubAction('trimestriel', '*880*46*0161443262#')}
                className="py-3 px-2 bg-amber-600 text-white rounded-xl text-[11px] font-bold tracking-tight hover:bg-amber-700 transition cursor-pointer"
              >
                Trimestriel<br/>
                <span className="font-mono text-xs font-black text-white">2 500 F CFA</span>
              </button>
              <button 
                onClick={() => handlePlanSubAction('annuel', '*880*46*0161443262#')}
                className="py-3 px-2 bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 rounded-xl text-[11px] font-bold tracking-tight hover:opacity-90 transition font-black cursor-pointer"
              >
                Plan Annuel Pro<br/>
                <span className="font-mono text-xs font-black text-slate-950">9 000 F CFA</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 border-t text-[10px]">
              <input 
                id="lock_accept_terms"
                type="checkbox" 
                checked={acceptedPremiumTerms}
                onChange={(e) => setAcceptedPremiumTerms(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="lock_accept_terms" className="text-slate-500 font-medium cursor-pointer">Je valide et certifie le paiement par MTN MoMo</label>
            </div>

            {premiumFeedbackMsg && (
              <p className="text-xs font-bold text-center text-emerald-700 animate-pulse">{premiumFeedbackMsg}</p>
            )}

            <button 
              onClick={logout}
              className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-200 transition mt-2 cursor-pointer"
            >
              Me déconnecter ou changer de compte
            </button>
          </div>
        </div>
      )}

      {activeTab === "home" ? (
        // 1. BRAND NEW HIGH-CONTRAST PORTRAIT DARK HOME MODEL DECORATION FOR BÉNIN SOUVERAINETÉ
        <div className="flex-1 flex flex-col bg-[#05070a] text-zinc-100 relative font-sans">
          
          {/* ================= HEADER - STATIC COMPACT MODE ================= */}
          <header className="h-[62px] flex-shrink-0 flex items-center justify-between px-4 border-b border-[#27ae60]/15 bg-[#0c1410] sticky top-0 z-35 font-sans">
            <div className="flex items-center gap-3.5">
              {/* Menu (Burger drawer button trigger) */}
              <button 
                onClick={() => {
                  setDrawerOpen(true);
                }} 
                className="p-1 flex flex-col gap-1.5 focus:outline-none cursor-pointer shrink-0"
                title="Mon espace Agri"
              >
                <span className="w-[22px] h-[2px] bg-white rounded-full block transition-all" />
                <span className="w-[22px] h-[2px] bg-white rounded-full block transition-all" />
                <span className="w-[22px] h-[2px] bg-white rounded-full block transition-all" />
              </button>
              
              <button 
                type="button"
                className="flex items-center gap-2 hover:opacity-90 active:scale-95 transition cursor-pointer text-left focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSscPanel(true);
                }} 
                title="Afficher les Statuts communautaires"
              >
                {/* Circular real logo from Benin Souveraineté */}
                <div className={`w-9 h-9 rounded-full bg-[#072c16] border-2 border-[#1eec6d] p-[1.5px] flex items-center justify-center shrink-0 shadow-lg overflow-hidden animate-float-glow`}>
                  <img 
                    src="/logo_agribot.png" 
                    alt="Logo AgriBot" 
                    className="w-full h-full object-cover rounded-full scale-105" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left leading-none">
                  <h1 className="font-sora font-extrabold text-[17px] text-[#2ece76] tracking-wide flex items-center gap-1 hover:text-white transition">
                    AgriBot Mine d'Or
                  </h1>
                </div>
              </button>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications Alert Bell */}
              <button 
                onClick={() => {
                  setActiveTab("notifications");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative w-9 h-9 flex items-center justify-center hover:bg-white/5 rounded-full cursor-pointer transition shrink-0"
              >
                <Bell className="w-5.5 h-5.5 text-[#d0e8d8] stroke-[2]" />
                <span className="absolute top-1 right-1 bg-[#e74c3c] text-white font-sora font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0c1410] shadow leading-none">
                  2
                </span>
              </button>

              {/* Circular Avatar of the user with bright green border */}
              <div className="flex flex-col items-center select-none shrink-0" id="header-profile-avatar-area">
                <div 
                  onClick={() => {
                    if (user?.isBlocked) {
                      alert("Compte Bloqué");
                      return;
                    }
                    setActiveTab("profile");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#2ecc71] shadow-md cursor-pointer transition active:scale-95 bg-[#0f1d13] flex items-center justify-center shrink-0 relative"
                  title="Photo de Profil (Cliquez pour modifier)"
                >
                  {user?.avatarUrl ? (
                    <img 
                      referrerPolicy="no-referrer"
                      src={user.avatarUrl} 
                      className="w-full h-full object-cover" 
                      alt="Profil" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-850 text-slate-300 relative">
                      {/* Stylized neutral silhouette blending features */}
                      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {/* label indicatif 'profil' */}
                      <div className="absolute inset-x-0 bottom-0 bg-emerald-950/80 py-0.5 text-center leading-none">
                        <span className="text-[6.5px] text-emerald-300 font-black uppercase tracking-tighter">PROFIL</span>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black tracking-widest text-[#2ecc71] uppercase leading-none mt-0.5">profil</span>
              </div>
            </div>
          </header>

          <div 
            id="main-scroll-container"
            onScroll={(e) => {
              const target = e.currentTarget;
              setShowGoToTop(target.scrollTop > 300);
            }}
            className="flex-1 overflow-y-auto pb-20 max-w-7xl mx-auto w-full px-4 pt-4 space-y-4 overflow-x-hidden"
          >

            {/* ================= 1. DYNAMIC GREETING & WEATHER BLOCK ================= */}
            {(() => {
              const getRainProbability = (condition: string | undefined): number => {
                if (!condition) return 15;
                const cond = condition.toLowerCase();
                if (cond.includes("orage") || cond.includes("fort")) return 90;
                if (cond.includes("brume") || cond.includes("brouillard")) return 15;
                if (cond.includes("pluie") || cond.includes("averse")) return 80;
                if (cond.includes("bruine")) return 50;
                if (cond.includes("nuage") || cond.includes("couvert")) return 35;
                if (cond.includes("soleil") || cond.includes("dégagé") || cond.includes("clair") || cond.includes("ardent")) return 5;
                return 15;
              };

              const getDayEmoji = (condition: string): string => {
                const c = condition.toLowerCase();
                if (c.includes("orage")) return "⛈️";
                if (c.includes("pluie") && c.includes("averse")) return "🌦️";
                if (c.includes("pluie")) return "🌧️";
                if (c.includes("nuage")) return "⛅";
                if (c.includes("soleil") || c.includes("dégagé") || c.includes("ardent") || c.includes("clair")) return "☀️";
                return "☀️";
              };

              const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
              const currentDayIndex = new Date().getDay();
              const forecasts = [];
              
              for (let i = 0; i < 4; i++) {
                const nextIndex = (currentDayIndex + i) % 7;
                const label = i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : daysOfWeek[nextIndex];
                
                const baseTemp = weather?.temp || 28;
                let dayTemp = baseTemp;
                let dayCond = "Ensoleillé ☀️";
                let dayRainProb = 10;
                
                if (i === 0) {
                  dayTemp = baseTemp;
                  dayCond = weather?.condition || "Ensoleillé ☀️";
                  dayRainProb = getRainProbability(dayCond);
                } else {
                  const seed = (nextIndex * 7 + i * 3) % 10;
                  if (seed < 2) {
                    dayTemp = baseTemp - 2;
                    dayCond = "Pluie modérée";
                    dayRainProb = 80;
                  } else if (seed < 5) {
                    dayTemp = baseTemp - 1;
                    dayCond = "Nuageux";
                    dayRainProb = 35;
                  } else if (seed < 8) {
                    dayTemp = baseTemp + 1;
                    dayCond = "Soleil Ardent";
                    dayRainProb = 5;
                  } else {
                    dayTemp = baseTemp;
                    dayCond = "Ciel Dégagé";
                    dayRainProb = 10;
                  }
                }
                
                forecasts.push({
                  label,
                  temp: Math.round(dayTemp),
                  condition: dayCond,
                  rainProb: dayRainProb,
                  emoji: getDayEmoji(dayCond)
                });
              }

              const currentGreetingBlock = (() => {
                const hr = new Date().getHours();
                if (hr >= 17) return { text: "Bonsoir", emoji: "🌌" };
                if (hr >= 12) return { text: "Bon après-midi", emoji: "☀️" };
                return { text: "Bonjour", emoji: "🌅" };
              })();

              const currentRainProb = getRainProbability(weather?.condition);

              return (
                <div className="space-y-4">
                  {/* ======= 1. DIRECT GREETING BLOCK ======= */}
                  <div className="flex flex-col py-2 px-1 text-left select-none animate-fade-in" id="stories-bar-section">
                    <h2 className="font-sora font-extrabold text-[22px] sm:text-[24px] text-white flex items-center gap-2 leading-tight">
                      {currentGreetingBlock.text} {user?.firstName || "Jean-Baptiste"} <span className="animate-bounce">{currentGreetingBlock.emoji}</span>
                    </h2>
                    <p className="text-[12px] text-[#2ecc71] font-bold leading-normal mt-1">
                      Que se passe-t-il dans votre ferme aujourd'hui ?
                    </p>
                  </div>



                  {/* ======= 2. AGRIBOT IA QUESTION BOARD (🧠 AgriBot IA d'élite) ======= */}
                  <div className="bg-[#0c1410]/95 border border-emerald-500/25 rounded-2xl p-4.5 space-y-3 text-left shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center animate-pulse">
                        <span className="text-xs">🤖</span>
                      </div>
                      <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider font-mono">
                        AgriBot IA d'élite
                      </span>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (homeAgribotInput.trim()) {
                          performInteractiveAction(async () => {
                            setAgribotInitialPrompt(homeAgribotInput.trim());
                            setActiveTab("agribot");
                            setHomeAgribotInput("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          });
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input 
                        type="text" 
                        value={homeAgribotInput}
                        onChange={(e) => setHomeAgribotInput(e.target.value)}
                        placeholder="Ex: Comment soigner la chenille légionnaire du maïs ?"
                        className="flex-1 bg-[#060a07] border border-emerald-800/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-[#2ecc71] transition"
                      />
                      <button 
                        type="submit"
                        className="bg-[#2ecc71] hover:bg-emerald-500 text-black px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shrink-0"
                      >
                        <span>Demander</span>
                        <span>➔</span>
                      </button>
                    </form>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      Tapez votre question et l'assistant agroécologique AgriBot IA commencera le traitement de précision immédiatement.
                    </p>
                  </div>

                  {/* ======= 3. DANGBO, OUEME LOCATION PILL ======= */}
                  <div className="flex justify-start px-1 select-none">
                    <button 
                      onClick={() => setShowWeatherModal(true)}
                      className="flex items-center gap-2 text-zinc-300 hover:text-white cursor-pointer font-sora font-extrabold text-[12px] bg-[#111a0d] border border-[#27ae60]/12 px-4 py-2 rounded-full transition duration-150 shadow-md"
                      title="Changer la commune de suivi"
                    >
                      <span className="text-sm select-none">📍</span>
                      <span>{selectedCommune}, {selectedDepartment}</span>
                      <span className="text-[#56745e] text-[11px] ml-0.5">▾</span>
                    </button>
                  </div>

                  {/* ======= 4. COMPACT DYNAMIC WEATHER (26°C ...) ======= */}
                  <div className="bg-[#0c1410] border border-[#27ae60]/18 rounded-3xl p-5 space-y-4 text-left shadow-lg">
                    {/* Today Detailed Metric Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl select-none filter drop-shadow-[0_2px_10px_rgba(255,200,0,0.3)] shrink-0 animate-pulse">
                          {forecasts[0].emoji}
                        </span>
                        <div className="leading-tight">
                          <div className="flex items-center gap-2">
                            <span className="text-[28px] font-sora font-black text-white tracking-tight inline-block">
                              {weather?.temp || "28"}°C
                            </span>
                            <button
                              onClick={() => {
                                performInteractiveAction(async () => {
                                  if (gpsAuthorized && coords) {
                                    await syncOpenMeteoWeather(selectedCommune, coords);
                                  } else {
                                    await syncOpenMeteoWeather(selectedCommune);
                                  }
                                });
                              }}
                              className="px-2.5 py-1 text-[9px] bg-[#070d09] hover:bg-[#2ecc71]/15 border border-[#2ecc71]/25 text-[#2ecc71] font-bold rounded-lg cursor-pointer transition active:scale-95 flex items-center gap-1 shrink-0"
                              title="Rafraîchir les données climatiques en direct de l'Agence Météo"
                            >
                              <span className="animate-spin text-[10px]">🔄</span> Actualiser
                            </button>
                          </div>
                          <span className="text-[11.5px] text-[#2ecc71] font-bold uppercase tracking-wider block mt-1">
                            {weather?.condition || "Ensoleillé"} · Aujourd'hui · En direct de Bénin-Météo
                          </span>
                        </div>
                      </div>

                      {/* Today details metrics columns */}
                      <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                        <div className="bg-[#080d09] px-3 py-2 rounded-xl border border-zinc-900/60 leading-none">
                          <span className="text-[8px] font-black tracking-wider uppercase text-zinc-500 block">🌧️ Pluie %</span>
                          <span className="font-mono text-[11.5px] font-bold text-white block mt-1.5">{currentRainProb}%</span>
                        </div>
                        <div className="bg-[#080d09] px-3 py-2 rounded-xl border border-zinc-900/60 leading-none">
                          <span className="text-[8px] font-black tracking-wider uppercase text-[#2ecc71] block">💧 Humide</span>
                          <span className="font-mono text-[11.5px] font-bold text-white block mt-1.5">{weather?.humidity || "78%"}</span>
                        </div>
                        <div className="bg-[#080d09] px-3 py-2 rounded-xl border border-zinc-900/60 leading-none">
                          <span className="text-[8px] font-black tracking-wider uppercase text-zinc-500 block">💨 Vent</span>
                          <span className="font-mono text-[11.5px] font-bold text-white block mt-1.5">{weather?.wind || "12 km/h"}</span>
                        </div>
                      </div>
                    </div>

                    {/* ======= 5. PRÉVISIONS DE LA SEMAINE COHESIVE GRID ======= */}
                    <div className="space-y-2.5 pt-1 border-t border-[#27ae60]/10 mt-2">
                      <h4 className="text-[10.5px] font-black uppercase text-[#56745e] tracking-wider font-mono">
                        PRÉVISIONS DE LA SEMAINE (SITUATION CLIMATIQUE AGRICOLE)
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {forecasts.map((f, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                              idx === 0 
                                ? "bg-[#2ecc71]/15 border-[#2ecc71]/40 shadow-md scale-[1.03] ring-1 ring-[#2ecc71]/30" 
                                : "bg-[#080d09] border-zinc-800/60 hover:border-zinc-700/50"
                            }`}
                          >
                            <span className="text-[11.5px] font-extrabold text-[#95b09d] block truncate max-w-full leading-none mb-1">
                              {f.label}
                            </span>
                            <span className="text-2xl my-2 select-none leading-none filter drop-shadow">
                              {f.emoji}
                            </span>
                            <span className="font-sora font-black text-[13px] sm:text-[14px] text-white block leading-none">
                              {f.temp}°C
                            </span>
                            {/* Rain probability rating */}
                            <span className={`px-1.5 py-[2px] rounded-md text-[8.5px] font-black tracking-tight font-sans mt-2.5 uppercase inline-block leading-none ${
                              f.rainProb > 50 
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/35" 
                                : f.rainProb > 20 
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/35"
                                : "bg-emerald-500/20 text-[#2ecc71] border border-[#2ecc71]/35"
                            }`}>
                              ☔ {f.rainProb}%
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Probabilistic Warning NB */}
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed mt-3 border-t border-[#27ae60]/10 pt-2.5">
                        <span className="text-amber-500 font-black uppercase font-mono tracking-wider">⚠️ NB d'Alerte :</span> Ces prévisions sont fournies à titre indicatif sous forme de statistiques physiques de probabilité. L'atmosphère est imprévisible et n'est pas exhaustive : tout micro-climat local ou phénomène imprévu peut perturber l'ordre établi de la nature.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}



            {/* ======= 7. OUTILS & CONSTRUCTEURS SOUVERAINS BÉNINOIS (TWO ROWS, NO SUBTITLES) ======= */}
            <div className="space-y-3 font-sans" id="quick-actions-two-lines">
              <h4 className="text-[11px] font-black uppercase text-[#2ecc71] tracking-widest text-left pl-1 font-mono">
                OUTILS & CONSTRUCTEURS SOUVERAINS BÉNINOIS
              </h4>
              
              {/* Row 1: Fiche Technique & Super Calculatrice */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* 1. FICHE TECHNIQUE */}
                <div 
                  onClick={() => {
                    setActiveTab("fiches");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-[#0b1410] border border-[#27ae60]/25 rounded-2xl p-4.5 cursor-pointer hover:bg-[#27ae60]/10 transition duration-150 flex items-center gap-3.5 text-left shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                    📋
                  </div>
                  <h5 className="font-sora font-black text-[13.5px] sm:text-[14.5px] text-white">Fiche Technique</h5>
                </div>

                {/* 2. SUPER CALCULATRICE */}
                <div 
                  onClick={() => {
                    setActiveTab("calculator");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-[#0c141d] border border-blue-500/22 rounded-2xl p-4.5 cursor-pointer hover:bg-blue-500/10 transition duration-150 flex items-center gap-3.5 text-left shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/35 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                    🧮
                  </div>
                  <h5 className="font-sora font-black text-[13.5px] sm:text-[14.5px] text-white">Super Calculatrice</h5>
                </div>
              </div>

              {/* Row 2: AgriBot Chat & Publier une annonce (+) */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* 3. AGRIBOT CHAT */}
                <div 
                  onClick={() => {
                    setActiveTab("agrichat");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-[#120e1a] border border-[#9b59b6]/25 rounded-2xl p-4.5 cursor-pointer hover:bg-[#9b59b6]/10 transition duration-150 flex items-center gap-3.5 text-left shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#9b59b6]/15 border border-[#9b59b6]/35 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                    💬
                  </div>
                  <h5 className="font-sora font-black text-[13.5px] sm:text-[14.5px] text-white">AgriBot Chat</h5>
                </div>

                {/* 4. PUBILIER UNE ANNONCE (+) */}
                <div 
                  onClick={() => setShowPublishPopup(true)}
                  className="bg-[#0a180e] border border-emerald-500/35 rounded-2xl p-4.5 cursor-pointer hover:bg-emerald-500/10 transition duration-150 flex items-center gap-3.5 text-left shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/45 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                    ➕
                  </div>
                  <h5 className="font-sora font-black text-[13.5px] sm:text-[14.5px] text-[#2ecc71]">Publier / Ajouter</h5>
                </div>
              </div>

              {/* Row 3: MODIFIED - Promoted high up as Status Stories circle */}

            </div>

            {/* ================= PRIX STANDARD FIXÉ PAR L'ÉTAT BÉNINOIS (BULLETIN DE SOUVERAINTÉ) ================= */}
            <div className="bg-[#0b120d] border-2 border-emerald-500/35 rounded-3xl p-6 shadow-xl relative overflow-hidden" id="official-bulletin-prices">
              {/* Background patriotic glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              {/* Official Seal and Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27ae60]/12 pb-5 mb-5 text-left">
                <div className="flex items-start gap-4">
                  {/* Benin Flag colors mini vertical ribbon */}
                  <div className="w-1.5 h-12 bg-gradient-to-b from-[#2ecc71] via-[#f1c40f] to-[#e74c3c] rounded-full shrink-0" />
                  <div>
                    <span className="text-[9.5px] font-black uppercase text-[#2ecc71] tracking-widest font-mono block">
                      RÉPUBLIQUE DU BÉNIN · MINISTÈRE DE L'AGRICULTURE
                    </span>
                    <h4 className="text-[17px] sm:text-[19px] font-sora font-black text-white tracking-tight mt-0.5 animate-pulse">
                      Bourse Référentielle des Prix Standards Fixes
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-medium leading-none mt-1">
                      Tarification officielle souveraine & variations en cours d'application nationale
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest font-mono text-emerald-400 uppercase">
                      BULLETIN SOUVERAIN ACTIF
                    </span>
                  </div>
                </div>
              </div>

              {/* Majestic Comparison Table Grid */}
              <div className="space-y-4">
                <div className="w-full max-h-[300px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-zinc-900" id="scrollable-daily-prices-list">
                  <table className="w-full text-left border-collapse font-sans table-fixed text-[11px] sm:text-xs">
                    <thead className="sticky top-0 bg-[#0b120d] z-10 shadow-xs">
                      <tr className="border-b border-zinc-800/85 text-[10px] font-black uppercase text-[#56745e] tracking-wider font-mono">
                        <th className="pb-2.5 w-[42%] text-left bg-[#0b120d]">Produit Agricole</th>
                        <th className="pb-2.5 text-center w-[33%] bg-[#0b120d]">Prix Standard État</th>
                        <th className="pb-2.5 text-right w-[25%] bg-[#0b120d]">Statut Légal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-950/40 text-[11.5px] sm:text-[12.5px]">
                      {getDailyShuffledProducts().map((prod, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]/40 transition duration-100">
                          <td className="py-2.5 font-bold text-white flex items-center gap-1.5 truncate">
                            <span className="text-base shrink-0 select-none">{prod.emoji}</span>
                            <span className="truncate">{prod.name}</span>
                          </td>
                          <td className="py-2.5 text-center font-mono font-black text-[#2ecc71] text-[12px] sm:text-[13px] whitespace-nowrap">
                            {prod.price} FCFA <span className="text-[8.5px] text-zinc-500 font-bold">/ {prod.unit}</span>
                          </td>
                          <td className="py-2.5 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase font-mono whitespace-nowrap ${prod.badgeClass}`}>
                              {prod.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Disclaimer of national importance */}
                <div className="bg-[#070d08] border border-[#27ae60]/12 p-3.5 rounded-2xl flex items-start gap-3 mt-2">
                  <span className="text-base mt-0.5 filter drop-shadow select-none">⚖️</span>
                  <p className="text-[10px] text-zinc-400 leading-normal font-sans">
                    <strong>AVERTISSEMENT SOUVERAIN :</strong> Conformément à la réglementation de l'État Béninois en vigueur, ces tarifs indicatifs servent de base réaliste et de régulation nationale pour protéger l'exploitation de nos producteurs. Le classement de la bourse est mélangé de manière aléatoire toutes les 24h pour assurer l'égalité visuelle de publication des produits maraîchers.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= FEED ACTIVITÉ AGRICOLE ================= */}
            <div className="space-y-4" id="community-agri-feed-title">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest pl-1">ACTIVITÉ AGRICOLE</h3>
                  <p className="text-[10px] text-zinc-500">Publications et offres de la communauté nationale d'entraide</p>
                </div>
              </div>

              {/* Feed items list */}
              {souveraineteFeed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-[#0b0e14] border border-zinc-900 rounded-3xl p-6">
                  <div className="text-4xl mb-2">🌾</div>
                  <p className="text-xs text-zinc-500 text-center">Aucune publication pour l’instant</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {souveraineteFeed
                    .filter(item => {
                      if (feedFilter === "Tout") return true;
                      if (feedFilter === "Marché") return item.tab === "market" || item.type === "marketplace" || item.type === "ground_prices";
                      if (feedFilter === "Emploi") return item.tab === "directory" || item.type === "recruitment_cv" || item.type === "recruitment_job";
                      if (feedFilter === "Solidarité") return item.tab === "solidarite" || item.type === "solidarity";
                      if (feedFilter === "Conseils") return item.tab === "agribot" || item.type === "maep_news";
                      return true;
                    })
                    .map(item => {
                      const isTextOnly = item.isTextOnly;
                      const creatorName = item.creator || "Lor Yawo";
                      const actionHighlightText = item.actionHighlight || "a partagé son statut";
                      const elapsedText = item.time || "Il y a 3h";
                      const illustrationsUrl = getFeedItemImage(item);
                      const groupAvatar = getFeedItemAvatar(item);

                      const handleFeedItemClick = () => {
                        if (item.type === "marketplace" || item.tab === "market" || item.type === "product" || item.productId) {
                          setSelectedMarketProductId(item.productId || item.id);
                          setActiveTab("market");
                        } else if (item.type === "recruitment_cv" || item.tab === "directory" || item.cvId) {
                          setSelectedCvId(item.cvId || item.id);
                          setActiveTab("directory");
                        } else if (item.type === "solidarity" || item.tab === "solidarite" || item.solidarityId) {
                          setSelectedSolidarityId(item.solidarityId || item.id);
                          setActiveTab("solidarite");
                        } else {
                          setActiveTab(item.tab);
                        }
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      };

                      if (isTextOnly) {
                        return (
                          <div 
                            key={item.id}
                            onClick={handleFeedItemClick}
                            style={{ backgroundColor: item.backgroundColor || "#5b21b6" }}
                            className="relative text-white rounded-xl p-4 shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] group border border-white/10 overflow-hidden"
                          >
                            <div className="absolute inset-x-0 top-0 bg-white/5 h-1 backdrop-blur-xs"></div>
                            <div className="space-y-3 flex-1 flex flex-col justify-center">
                              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wide text-white/80">
                                <span className="bg-white/20 px-2 py-0.5 rounded">{item.badge}</span>
                                <span>📍 {item.location}</span>
                              </div>
                              <p className="text-sm font-semibold text-white leading-relaxed line-clamp-3 mt-2">
                                "{item.description}"
                              </p>
                            </div>
                            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] text-yellow-300 font-bold font-mono">
                              <span>Par @{creatorName}</span>
                              <span className="bg-amber-950/80 text-amber-300 border border-amber-500/10 px-2 py-0.5 rounded uppercase text-[7.5px] tracking-wider font-mono">
                                AGRIBOT MINE D'OR 🪙
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Check if item has a valid photo
                      const hasPhoto = !!(item.image || item.photoUrl || (item.original && (item.original.image || item.original.imageUrl || item.original.photoUrl)));
                      const photoUrl = item.image || item.photoUrl || (item.original && (item.original.image || item.original.imageUrl || item.original.photoUrl));

                      return (
                        <div 
                          key={item.id}
                          onClick={handleFeedItemClick}
                          className="bg-[#0b0e14] hover:bg-[#10141f] rounded-3xl border border-zinc-900/80 shadow-md hover:border-emerald-500/20 transition-all duration-200 p-5 cursor-pointer flex flex-col gap-4 text-left w-full group overflow-hidden"
                        >
                      {/* Image en haut (si elle existe) */}
                      {hasPhoto && (
                        <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-zinc-850 relative shrink-0 shadow-inner group-hover:scale-[1.002] transition-transform duration-250">
                          <img 
                            referrerPolicy="no-referrer"
                            src={photoUrl} 
                            className="w-full h-full object-cover" 
                            alt={item.title || "Illustration"} 
                          />
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0e14]/60 to-transparent"></div>
                        </div>
                      )}

                      {/* Header row (Avatar, Creator, Badge, Date) */}
                      <div className="flex items-center justify-between gap-3 border-b border-zinc-900/50 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-zinc-800">
                            <img 
                              referrerPolicy="no-referrer"
                              src={groupAvatar} 
                              className="w-full h-full object-cover" 
                              alt="Avatar" 
                            />
                          </div>
                          <div>
                            <div className="text-[12px] text-zinc-300 font-sans flex items-center gap-1.5 flex-wrap">
                              <strong className="text-white font-extrabold">@{creatorName}</strong>{" "}
                              <span className="text-emerald-500 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block">
                                {actionHighlightText}
                              </span>
                            </div>
                            <div className="text-[9.5px] font-mono text-zinc-500 mt-0.5">{elapsedText}</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[8px] bg-zinc-900 text-emerald-400 font-black px-2.5 py-1 rounded-full border border-zinc-800 uppercase tracking-widest font-mono">
                            {item.badge || "INFO"}
                          </span>
                          {item.location && (
                            <span className="text-[9px] text-zinc-500 font-medium">📍 {item.location}</span>
                          )}
                        </div>
                      </div>

                      {/* Content details (Full integrity text, no truncation or line-clamp!) */}
                      <div className="space-y-2">
                        {item.title && item.title !== item.description && (
                          <h4 className="text-[12.5px] font-extrabold text-white tracking-tight leading-snug">
                            {item.title}
                          </h4>
                        )}
                        <p className="text-[11.5px] text-zinc-300 leading-relaxed whitespace-pre-line select-text">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer values (Price / Stats / CTA button) */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 mt-1 border-t border-zinc-950/40">
                        {item.price && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9.5px] text-zinc-500 font-medium uppercase tracking-wider">Tarif / Valeur:</span>
                            <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-500/5 px-2.5 py-0.5 rounded-lg border border-emerald-500/10">
                              {item.price}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider group-hover:text-emerald-300 transition-all font-mono flex items-center gap-1 ml-auto">
                          {item.actionLabel || "En savoir plus ➔"}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Shuffling Refresh button action */}
                <div className="flex justify-center pt-4" id="refresh-feed-button-container">
                  <button
                    onClick={() => {
                      setSouveraineteFeed(generateSouveraineteFeed());
                      const feedHeader = document.getElementById("community-agri-feed-title");
                      if (feedHeader) {
                        feedHeader.scrollIntoView({ behavior: "smooth", block: "start" });
                      } else {
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }
                    }}
                    type="button"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-150 shadow-md flex items-center gap-2 cursor-pointer select-none border border-emerald-500/20"
                  >
                    🔄 Actualiser les publications
                  </button>
                </div>
              </div>
            )}
            </div>

            {/* SÉCTION ADMIN : VALIDATION DES PREUVES D'ABONNEMENT */}
            {isUserJbz && adminSubscriptions.length > 0 && (
              <div className="mt-8 bg-zinc-900 text-white rounded-2xl p-5 border border-yellow-500/20 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👑</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-yellow-500">Validation Administrative (MTN MoMo)</h4>
                      <p className="text-[10px] text-zinc-500">Rapprochez les transactions bancaires avec les téléversements ci-dessous</p>
                    </div>
                  </div>
                  <span className="bg-amber-500 text-zinc-950 font-bold text-[9px] px-2.5 py-0.5 rounded uppercase font-mono">
                    {adminSubscriptions.filter((s:any) => s.statut === "pending").length} En attente
                  </span>
                </div>

                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {adminSubscriptions.map((sub: any, index: number) => (
                    <div key={sub.id || index} className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-yellow-500/15 text-yellow-400 text-[8.5px] px-1.5 py-0.2 rounded font-mono font-bold uppercase">{sub.plan}</span>
                          <strong className="text-white text-xs">{sub.userName}</strong>
                        </div>
                        <p className="text-zinc-400 text-[10.5px]">{sub.userEmail} • <span className="font-mono font-bold text-yellow-500">{sub.montant} FCFA</span></p>
                        {sub.preuve_paiement ? (
                          <div className="mt-1.5 bg-zinc-900 p-2 rounded border border-zinc-800 max-w-sm">
                            <p className="text-[9px] text-yellow-500 uppercase font-bold mb-1">Preuve transmise par le client :</p>
                            {sub.preuve_paiement.startsWith("data:image") ? (
                              <img referrerPolicy="no-referrer" src={sub.preuve_paiement} className="max-h-24 rounded border border-zinc-850" alt="Preuve" />
                            ) : (
                              <span className="text-zinc-300 font-mono italic break-all text-[9.5px] select-all bg-zinc-900/50 p-1.5 rounded block">{sub.preuve_paiement}</span>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] text-rose-500 italic">Aucune preuve téléversée.</p>
                        )}
                      </div>

                      {sub.statut === "pending" ? (
                        <button
                          onClick={() => handleValidateSubAdminAction(sub.id)}
                          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10.5px] uppercase transition cursor-pointer active:scale-95"
                        >
                          ✓ Approuver &amp; Activer
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-black font-mono text-[9px] bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/15">✓ Payé &amp; Premium</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        // 2. MINIMALIST, CLEAN CENTRED SHELL DESIGN FOR SUB-PANELS (WITHOUT CLUTTERED HEADERS)
        <div className={`flex-1 flex flex-col w-full transition-colors duration-300 ${(activeTab === "agribot" || activeTab === "agrichat") ? "bg-[#080d0a] text-[#e8f5ec]" : "bg-slate-50 text-slate-900"}`}>

          {/* DESKTOP INTEGRATED SHELL VIEW */}
          <main className={`${(activeTab === "agribot" || activeTab === "agrichat") ? "max-w-2xl px-0 sm:px-3 mt-0 pt-1 pb-0" : "max-w-4xl px-4 mt-6 pb-24"} mx-auto w-full transition-all duration-300`}>
            
            {/* PRIMARY CONTAINER LAYOUT */}
            <section className={(activeTab === "agribot" || activeTab === "agrichat") ? "w-full" : "space-y-4"}>
              
              {/* ACTIONS NAVIGATION CONTROL BREADCRUMB */}
              {(activeTab === "agribot" || activeTab === "agrichat") ? (
                <div className="hidden sm:flex justify-between items-center gap-4 py-2 px-1 bg-[#111a14]/65 border border-emerald-950/20 px-4 mb-2 mx-2 sm:mx-0 rounded-2xl">
                  <div className="text-[#e8f5ec] font-display font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="text-[#2ecc71]">💬</span>
                    <span>{activeTab === "agribot" ? "AGRIBOT IA 🤖" : "AGRICHAT COMMUNAUTAIRE"}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {user && (
                      <span className="text-[12px] bg-[#1a2d1f]/60 text-[#2ecc71] px-3 py-2 rounded-xl font-black font-mono tracking-wide border border-emerald-500/20 shadow-inner">
                        @{user.username}
                      </span>
                    )}
                    {canGoBack && (
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black uppercase transition cursor-pointer tracking-wider shadow-md border border-emerald-500/10 active:scale-95"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>RETOUR</span>
                      </button>
                    )}
                    <button
                      onClick={handleGoHome}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase transition cursor-pointer tracking-wider shadow-md border border-emerald-500/20 active:scale-95"
                    >
                      <Home className="h-3.5 w-3.5 text-emerald-100" />
                      <span>ACCUEIL</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-xs hidden sm:inline">AMOR Espace /</span>
                    <span className="text-emerald-700 font-bold font-display text-xs">
                      {activeTab === "fiches" && "📖 Diagnostic Fiches Tech"}
                      {activeTab === "calculator" && "🧮 Super Calculatrice"}
                      {activeTab === "market" && "🧺 MarketPlace & Intrants"}
                      {activeTab === "solidarite" && "🤝 Espace Entraide & Solidarité"}
                      {activeTab === "directory" && "👥 Recrutement & Projets"}
                      {activeTab === "premium" && "⭐ Abonnement Premium Pro"}
                      {activeTab === "profile" && "👤 Mon Profil Producteur"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-extrabold font-mono">
                        @{user.username}
                      </span>
                    )}
                    {canGoBack && (
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-[10.5px] font-black uppercase transition cursor-pointer leading-none active:scale-95 border border-slate-300/40"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Retour</span>
                      </button>
                    )}
                    <button
                      onClick={handleGoHome}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10.5px] font-black uppercase transition cursor-pointer leading-none"
                    >
                      <Home className="h-3.5 w-3.5" />
                      <span>Accueil</span>
                    </button>
                  </div>
                </div>
              )}

          {activeTab === "agribot" && (
            <AgriBotPanel initialPrompt={agribotInitialPrompt} onBack={handleBack} />
          )}

          {activeTab === "fiches" && (
            <FichesPanel 
              onRedirectToAgribot={handleRedirectToAgribot} 
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              isUserJbz={isUserJbz}
              zonesList={zonesList}
              onReloadAgroData={loadDynamicAgroData}
            />
          )}

          {activeTab === "calculator" && (
            <CalculatorPanel 
              onTriggerAgribotDoc={handleRedirectToAgribot} 
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              zonesList={zonesList}
            />
          )}

          {activeTab === "market" && (
            <MarketPanel 
              user={user}
              products={products} 
              onAddProduct={handleAddProduct} 
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onContactSellerPrivate={handleContactSellerPrivate}
              onAdminInitiatePrivateChat={handleAdminInitiatePrivateChat}
              autoOpenAddForm={autoOpenPublish === "market"}
              onFormOpened={() => setAutoOpenPublish(null)}
              unlockedContactsList={unlockedContactsList}
              onUnlockContact={handleUnlockContactAction}
              selectedProductId={selectedMarketProductId}
              onClearSelection={() => setSelectedMarketProductId(null)}
              onInterestedInProduct={handleInterestedInMarketProduct}
              coordinationInterestedUser={coordinationInterestedUser}
              onClearCoordinationInterestedUser={() => setCoordinationInterestedUser(null)}
            />
          )}

          {activeTab === "solidarite" && user && (
            <SolidarityPanel 
              user={user}
              demands={solidarityDemands}
              candidatures={solidarityCandidatures}
              onCreateDemand={handleCreateSolidarityDemand}
              onApplyDemand={handleApplySolidarityDemand}
              onCloseDemand={handleCloseSolidarityDemand}
              onContactViaChat={handleContactViaChat}
              autoOpenAddForm={autoOpenPublish === "solidarite"}
              onFormOpened={() => setAutoOpenPublish(null)}
              selectedSolidarityId={selectedSolidarityId}
              onClearSelection={() => setSelectedSolidarityId(null)}
            />
          )}

          {activeTab === "directory" && (
            <DirectoryPanel 
              user={user}
              initialCvs={cvProfiles} 
              initialProjects={projectProposals} 
              appelsCandidatures={appelsCandidatures}
              onAddCv={handleAddCv} 
              onUpdateCv={handleUpdateCv}
              onDeleteCv={handleDeleteCv}
              onAddProject={handleAddProject} 
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onAddAppel={handleAddAppel}
              onUpdateAppel={handleUpdateAppel}
              onDeleteAppel={handleDeleteAppel}
              onContactSellerPrivate={handleContactSellerPrivate}
              onAdminInitiatePrivateChat={handleAdminInitiatePrivateChat}
              autoOpenAddForm={autoOpenPublish === "directory"}
              onFormOpened={() => setAutoOpenPublish(null)}
              selectedCvId={selectedCvId}
              onClearSelection={() => setSelectedCvId(null)}
            />
          )}

          {activeTab === "premium" && (
            <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-800/50 p-2.5 rounded-xl">
                    <Crown className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display uppercase tracking-widest text-white">⭐ Abonnement Premium AgriBot Pro</h3>
                    <p className="text-xs text-amber-100">Débloquez l'accès illimité sans coupures et propulsez vos rendements agricoles</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {isUserJbz && (
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-emerald-400/80 rounded-2xl p-5 space-y-3 shadow-sm text-slate-800">
                    <div className="flex items-center gap-2 border-b border-emerald-200/60 pb-2">
                      <span className="text-xl">🔧</span>
                      <div>
                        <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider">Espace de Test Admin (Administrateur AgriBot)</h4>
                        <p className="text-[10.5px] text-emerald-750">Basculez entre les modes d'essai pour auditer l'expérience utilisateur et les restrictions.</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button 
                        onClick={async () => {
                          const updated = { ...user!, isPremium: false };
                          setUser(updated);
                          localStorage.setItem("agribot_active_user", JSON.stringify(updated));
                          await fetch("/api/validate-subscription", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: user?.id, forcePremium: false })
                          }).catch(e => console.error(e));
                          setPremiumFeedbackMsg("🔄 Mode simulation activé : Essai de la Version Gratuite actif.");
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          !user?.isPremium ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-slate-250 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        ❌ Simuler Essai Version Gratuite
                      </button>

                      <button 
                        onClick={async () => {
                          const updated = { ...user!, isPremium: true };
                          setUser(updated);
                          localStorage.setItem("agribot_active_user", JSON.stringify(updated));
                          await fetch("/api/validate-subscription", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: user?.id, forcePremium: true })
                          }).catch(e => console.error(e));
                          setPremiumFeedbackMsg("✨ Mode simulation activé : Version Premium Active (Pas de blocages d'accès).");
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          user?.isPremium ? "bg-amber-500 text-slate-950 shadow-sm" : "bg-white border border-slate-250 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        ⭐ Simuler Version Premium Active
                      </button>
                    </div>
                  </div>
                )}

                {premiumFeedbackMsg && (
                  <div className="bg-amber-50 text-amber-950 text-xs p-3.5 rounded-xl border border-amber-200 font-mono font-bold animate-pulse">
                    {premiumFeedbackMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Hebdomadaire Plan */}
                  <div className="border border-slate-200 rounded-2xl p-4 space-y-3.5 hover:border-amber-400 transition relative flex flex-col justify-between bg-slate-50/20">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-500">Plan Hebdomadaire</h4>
                      <p className="text-xl font-mono font-bold text-slate-1000 mt-1">300 <span className="text-xs font-sans">F CFA</span></p>
                      <p className="text-[11px] text-slate-400 mt-1">7 jours d'accès complet illimité. Idéal pour tester ponctuellement l'IA.</p>
                    </div>
                    <button
                      onClick={() => handleDirectMomoPayment("hebdo", 300)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10.5px] uppercase tracking-wider transition cursor-pointer"
                    >
                      Abonnement Rapide
                    </button>
                  </div>

                  {/* Monthly plan */}
                  <div className="border border-slate-200 rounded-2xl p-4 space-y-3.5 hover:border-amber-400 transition relative flex flex-col justify-between bg-slate-50/20">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-500">Plan Mensuel</h4>
                      <p className="text-xl font-mono font-bold text-slate-1000 mt-1">1 000 <span className="text-xs font-sans">F CFA</span></p>
                      <p className="text-[11px] text-slate-400 mt-1">30 jours d'accès complet illimité au service d'IA et téléchargement de fiches.</p>
                    </div>
                    <button
                      onClick={() => handleDirectMomoPayment("mensuel", 1000)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10.5px] uppercase tracking-wider transition cursor-pointer"
                    >
                      Sélectionner
                    </button>
                  </div>

                  {/* Quarterly plan */}
                  <div className="border border-amber-300 bg-amber-50/15 rounded-2xl p-4 space-y-3.5 hover:border-amber-400 transition relative flex flex-col justify-between">
                    <span className="absolute -top-2 px-2 py-0.5 bg-amber-600 text-white rounded-full text-[7.5px] uppercase font-black tracking-widest leading-none left-1/2 -translate-x-1/2">
                      LE PLUS POPULAIRE
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-500 mt-1">Plan Trimestriel</h4>
                      <p className="text-xl font-mono font-bold text-slate-1000 mt-1">2 500 <span className="text-xs font-sans">F CFA</span></p>
                      <p className="text-[11px] text-slate-400 mt-1">90 jours d'accès complet. Vous économisez 500 F CFA sur la période totale !</p>
                    </div>
                    <button
                      onClick={() => handleDirectMomoPayment("trimestriel", 2500)}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[10.5px] uppercase tracking-wider transition cursor-pointer"
                    >
                      Abonner maintenant
                    </button>
                  </div>

                  {/* Annual plan */}
                  <div className="border border-slate-200 rounded-2xl p-4 space-y-3.5 hover:border-amber-400 transition relative flex flex-col justify-between bg-slate-50/20">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-500">Plan Annuel</h4>
                      <p className="text-xl font-mono font-bold text-slate-1000 mt-1">7 999 <span className="text-xs font-sans">F CFA</span></p>
                      <p className="text-[11px] text-slate-400 mt-1">365 jours d'accès complet illimité. Le choix souverain et pro pour toute l'année.</p>
                    </div>
                    <button
                      onClick={() => handleDirectMomoPayment("annuel", 7999)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10.5px] uppercase tracking-wider transition cursor-pointer"
                    >
                      Option Souveraine
                    </button>
                  </div>
                </div>

                {/* Direct Mobile Money Billing Overlay Pop-up Modal */}
                {showMomoOverlay && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 overflow-hidden shadow-2xl">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 font-bold flex justify-between items-center">
                        <span className="text-xs uppercase tracking-wider text-slate-950 font-black">Facturation Directe Mobile Money (Bénin)</span>
                        <button 
                          onClick={() => { setShowMomoOverlay(false); }}
                          className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-bold rounded-md"
                        >
                          Fermer
                        </button>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 space-y-1">
                          <p className="text-[11px] text-amber-900">Plan Sélectionné : <strong className="uppercase">{selectedPlanForPrompt}</strong></p>
                          <p className="text-lg font-mono font-black text-amber-950">{selectedPlanAmount} F CFA</p>
                        </div>

                        {!isPayingMomo ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Opérateur Local :</label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setMomoOperator("MTN")}
                                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition border ${momoOperator === "MTN" ? "bg-amber-400 border-amber-500 text-slate-950" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"}`}
                                >
                                  MTN MoMo 🇧🇯
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMomoOperator("Moov")}
                                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition border ${momoOperator === "Moov" ? "bg-blue-600 border-blue-700 text-white" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"}`}
                                >
                                  Moov Money 🇧🇯
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Numéro de téléphone à débiter (8 chiffres) :</label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">+229</span>
                                <input
                                  type="text"
                                  maxLength={8}
                                  placeholder="61443262"
                                  value={momoPhoneNumber}
                                  onChange={(e) => setMomoPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                  className="w-full pl-14 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500 text-center font-mono tracking-wider"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={executeMomoBillingRequest}
                              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition shadow-sm cursor-pointer"
                            >
                              S'abonner & Lancer le Débit Direct
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 py-2">
                            {!momoPinEntering ? (
                              <div className="text-center py-4 space-y-4">
                                <div className="w-12 h-12 rounded-full border-4 border-t-amber-500 border-r-amber-500 border-b-slate-100 border-l-slate-100 animate-spin mx-auto"></div>
                                <div className="space-y-1.5 animate-pulse">
                                  <p className="text-xs font-bold text-slate-800">Demande Push MoMo envoyée à +229 {momoPhoneNumber}</p>
                                  <p className="text-[11px] text-slate-500 leading-normal max-w-sm mx-auto">
                                    Génération sécurisée de l'invite de transaction sur votre appareil mobile. Veuillez patienter...
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-700 space-y-3 shadow-inner transform animate-scale-in text-left">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 font-mono">
                                      📲 {momoOperator} SECURE PUSH AUTHORIZATION
                                    </span>
                                  </div>
                                  <span className="text-[8px] font-mono text-slate-400">Invite USSD Directe</span>
                                </div>
                                
                                {isMomoPinProcessing ? (
                                  <div className="text-center py-6 space-y-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-t-emerald-400 border-r-emerald-400 border-b-slate-800 border-l-slate-800 animate-spin mx-auto"></div>
                                    <p className="text-xs font-bold text-slate-200 font-sans">Traitement de l'autorisation de débit...</p>
                                    <p className="text-[9px] text-slate-500 font-mono">Vérification de la provision auprès de l'opérateur local...</p>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <p className="text-[11px] leading-relaxed text-slate-200 font-sans">
                                      Autoriser le débit direct de <strong className="text-amber-400 font-bold">{selectedPlanAmount} F CFA</strong> pour votre compte Premium <strong className="uppercase text-emerald-400 font-bold">{selectedPlanForPrompt}</strong> sur la Mine d'Or AgriBot Bénin ?
                                    </p>
                                    
                                    <div className="space-y-1">
                                      <label className="block text-[8.5px] uppercase font-black text-slate-400 font-mono tracking-wider">
                                        Saisissez votre code PIN secret à 4 chiffres :
                                      </label>
                                      <input
                                        type="password"
                                        maxLength={4}
                                        placeholder="••••"
                                        value={momoPinValue}
                                        onChange={(e) => setMomoPinValue(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-center text-lg font-bold tracking-widest text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono animate-pulse"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setMomoPinEntering(false);
                                          setMomoPinValue("");
                                          setIsPayingMomo(false);
                                        }}
                                        className="py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer text-center"
                                      >
                                        Annuler
                                      </button>
                                      <button
                                        type="button"
                                        onClick={confirmMomoPinAndPay}
                                        className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer text-center"
                                      >
                                        Valider 🚀
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {isUserJbz && (
                              <div className="pt-3 border-t border-slate-100 space-y-2">
                                <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Pour les testeurs de la sandbox d'AI Studio</p>
                                <button
                                  type="button"
                                  onClick={simulateSuccessWebhook}
                                  className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl uppercase transition shadow-sm cursor-pointer"
                                >
                                  👍 [Simulation Sandbox] Forcer l'activation instantanée sans code PIN
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="premium-terms-check"
                      checked={acceptedPremiumTerms}
                      onChange={(e) => setAcceptedPremiumTerms(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <label htmlFor="premium-terms-check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Je certifie vouloir initier le paiement sécurisé par Mobile Money direct.
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Une fois que vous validez, le paiement sécurisé est transmis à l'opérateur local Béninois choisi pour traitement immédiat.
                  </p>
                </div>

                {/* Submitting MTN payment screenshot / transaction text proof */}
                {createdSubscriptionId && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
                      <span className="text-xl">📲</span>
                      <div>
                        <h4 className="text-xs font-black uppercase text-amber-900">Finaliser mon Paiement MTN MoMo</h4>
                        <p className="text-[10.5px] text-amber-850">L'intention de paiement à été prise en compte. Entrez l'identifiant de la transaction reçu par SMS ou téléversez l'avis d'envoi MTN.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">ID de transaction ou référence d'envoi :</label>
                        <input 
                          type="text"
                          placeholder="Ex: Ref 128945 ou Numéro du compte MoMo emetteur"
                          value={momoTransactionReference}
                          onChange={(e) => setMomoTransactionReference(e.target.value)}
                          className="w-full px-3 py-2 border border-amber-300 bg-white rounded-xl text-xs text-slate-850 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Téléverser Capture d'Écran ou Preuve de paiement :</label>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setMomoScreenshotFile(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-150 cursor-pointer"
                        />
                      </div>

                      {momoScreenshotFile && (
                        <div className="p-2 border border-dashed border-amber-350 rounded-xl bg-white max-w-xs">
                          <p className="text-[8.5px] uppercase font-bold text-slate-400 mb-1">Aperçu de la capture :</p>
                          <img src={momoScreenshotFile} className="max-h-32 rounded-lg" alt="Preuve" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={handleUploadPreuveAction}
                          className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs uppercase transition shadow-md active:scale-95 text-center cursor-pointer"
                        >
                          ✓ Transmettre la Preuve de Mon MoMo
                        </button>
                        <button
                          onClick={() => setCreatedSubscriptionId(null)}
                          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-xl text-xs uppercase transition active:scale-95"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SÉCTION ADMIN : VALIDATION DES PREUVES D'ABONNEMENT */}
                {isUserJbz && adminSubscriptions.length > 0 && (
                  <div className="bg-slate-950 text-white rounded-2xl p-5 border border-yellow-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👑</span>
                        <div>
                          <h4 className="text-xs font-black uppercase text-yellow-400">Valideur Administratif (MTN MoMo de Songhaï)</h4>
                          <p className="text-[10px] text-slate-400">Rapprochez les transactions bancaires avec les téléversements ci-dessous</p>
                        </div>
                      </div>
                      <span className="bg-amber-500 text-slate-950 font-bold text-[9px] px-2.5 py-0.5 rounded uppercase font-mono">
                        {adminSubscriptions.filter((s:any) => s.statut === "pending").length} En attente
                      </span>
                    </div>

                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {adminSubscriptions.map((sub: any, index: number) => (
                        <div key={sub.id || index} className="p-3.5 bg-slate-900 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-yellow-500/15 text-yellow-400 text-[8.5px] px-1.5 py-0.2 rounded font-mono font-bold uppercase">{sub.plan}</span>
                              <strong className="text-white text-xs">{sub.userName}</strong>
                            </div>
                            <p className="text-slate-400 text-[10.5px]">{sub.userEmail} • <span className="font-mono font-bold text-yellow-450">{sub.montant} FCFA</span></p>
                            {sub.preuve_paiement ? (
                              <div className="mt-1.5 bg-slate-950 p-2 rounded border border-white/5 max-w-sm">
                                <p className="text-[9px] text-yellow-500 uppercase font-bold mb-1">Preuve transmise par le client :</p>
                                {sub.preuve_paiement.startsWith("data:image") ? (
                                  <img referrerPolicy="no-referrer" src={sub.preuve_paiement} className="max-h-24 rounded border border-white/10" alt="Preuve" />
                                ) : (
                                  <span className="text-stone-300 font-mono italic break-all text-[9.5px] select-all bg-stone-900/50 p-1.5 rounded block">{sub.preuve_paiement}</span>
                                )}
                              </div>
                            ) : (
                              <p className="text-[10px] text-rose-450 italic">Aucune preuve téléversée.</p>
                            )}
                          </div>

                          {sub.statut === "pending" ? (
                            <button
                              onClick={() => handleValidateSubAdminAction(sub.id)}
                              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10.5px] uppercase transition cursor-pointer active:scale-95"
                            >
                              ✓ Approuver &amp; Activer
                            </button>
                          ) : (
                            <span className="text-emerald-400 font-black font-mono text-[9px] bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/15">✓ Payé &amp; Premium</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "agrichat" && (
            <AgriChatPanel 
              onBack={() => {
                setPrivateRecipient(null);
                setChatInput("");
                handleBack();
              }}
              initialContactId={privateRecipient?.id}
              initialContactName={privateRecipient?.name}
              initialInput={chatInput}
              onNavigateToMarket={(productId, interestedUser) => {
                setActiveTab("market");
                setSelectedMarketProductId(productId);
                if (interestedUser) {
                  setCoordinationInterestedUser(interestedUser);
                }
              }}
            />
          )}

          {activeTab === "videos" && (
            <AgriVideosPanel 
              user={user} 
              isUserJbz={isUserJbz} 
              onBack={() => {
                setDrawerOpen(true);
                handleBack();
              }} 
            />
          )}

          {activeTab === "admin" && isUserJbz && (
            <div className="space-y-6 text-left" id="admin-control-tab-view">
              {/* Header Box */}
              <div className="bg-gradient-to-tr from-slate-900 to-emerald-950 border border-emerald-500/20 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ecc71]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                  <div>
                    <span className="bg-yellow-500/15 text-yellow-500 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border border-yellow-500/20">🛡️ PANNEAU DE CONTRÔLE</span>
                    <h2 className="text-xl sm:text-2xl font-black font-display font-sora text-white mt-1">Supervision des Membres</h2>
                    <p className="text-zinc-300 text-xs mt-0.5">Pilotez le statut premium, débloquez les commissions, ou masquez temporairement un compte.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab("home");
                      setDrawerOpen(true);
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shrink-0"
                  >
                    ← Retour
                  </button>
                </div>
              </div>

              {/* Control Inner Area */}
              <AdminMemberControl adminUsers={adminUsers} setAdminUsers={setAdminUsers} currentUser={user} />
            </div>
          )}

          {activeTab === "profile" && user && (
            <div className="space-y-6 text-left" id="user-profile-tab-view">
              
              {/* Profile Card & Stats Header */}
              <div className="bg-gradient-to-tr from-[#051108]/90 via-[#0a2012]/90 to-[#0f301b]/95 border border-emerald-500/25 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ecc71]/10 rounded-full blur-3xl" />
                
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-full border-4 border-emerald-500/40 overflow-hidden bg-slate-800 shadow-md flex items-center justify-center">
                      {profileAvatar ? (
                        <img src={profileAvatar} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-4xl text-emerald-400 font-bold select-none">
                          {profileFirstName ? profileFirstName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {user.isPremium && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9.5px] px-2.5 py-1 rounded-full font-black uppercase shadow-md border-2 border-[#0c2c16]">
                        ⭐ PRO
                      </span>
                    )}
                  </div>

                  <div className="text-center md:text-left space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <h3 className="font-sora font-extrabold text-[20px] text-white tracking-tight">
                        {profileFirstName || "Producteur"} {profileLastName || "Souverain"}
                      </h3>
                      <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                        @{user.username}
                      </span>
                    </div>

                    <p className="text-xs text-emerald-250 font-semibold">
                      🧑‍🌾 Spécialité : <span className="text-white font-black">{profileSpecialty || "Maraîchage général"}</span> — {profileLocation || "Bénin"}
                    </p>

                    <p className="text-[11px] text-[#81af8f] leading-normal max-w-xl">
                      Bienvenue dans votre centre de souveraineté numérique. Mettez à jour vos coordonnées publiques pour que les acheteurs et collègues de la communauté puissent vous contacter facilement via la messagerie ou par appel direct.
                    </p>
                  </div>
                </div>

                {/* Profile Completion percentage indicator */}
                {(() => {
                  let filledFields = 0;
                  let totalFields = 6; // firstName, lastName, phone, whatsapp, location, avatarUrl
                  if (profileFirstName && profileFirstName.trim()) filledFields++;
                  if (profileLastName && profileLastName.trim()) filledFields++;
                  if (profilePhone && profilePhone.trim()) filledFields++;
                  if (profileWhatsApp && profileWhatsApp.trim()) filledFields++;
                  if (profileLocation && profileLocation.trim()) filledFields++;
                  if (profileAvatar && profileAvatar.trim()) filledFields++;
                  const pct = Math.round((filledFields / totalFields) * 105);
                  const displayPct = pct > 100 ? 100 : pct;

                  return (
                    <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-left" id="profile-pct-completion-box">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#81af8f] font-bold">Complétude du profil de l'exploitant :</span>
                        <span className={`font-mono font-black ${displayPct === 100 ? "text-emerald-400" : "text-amber-400 animate-pulse"}`}>
                          {displayPct}% {displayPct === 100 ? "✓ Complet" : "⚠️ Incomplet"}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${displayPct === 100 ? "from-[#2ecc71] to-[#2ecc71]" : "from-amber-500 to-orange-400"}`} 
                          style={{ width: `${displayPct}%` }} 
                        />
                      </div>
                      {displayPct < 100 ? (
                        <p className="text-[10.5px] text-amber-300 font-semibold leading-relaxed">
                          ⚠️ Veuillez renseigner toutes vos coordonnées (Prénom, Nom, GSM, WhatsApp, Spécialité, et Image de profil) pour être complété à 100% et assurer votre légitimité vis-à-vis des autres producteurs.
                        </p>
                      ) : (
                        <p className="text-[10.5px] text-emerald-400 font-bold flex items-center gap-1">
                          ✓ Félicitations ! Votre profil est complet à 100%. Vos publications et transactions sont prioritaires et vérifiées sur l'ensemble de la plateforme !
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {profileSuccessFeedback && (
                <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 rounded-2xl p-4 text-xs font-bold leading-normal shadow-sm animate-pulse">
                  {profileSuccessFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left side: Avatar Management & Quick Presets */}
                <div className="space-y-6">
                  
                  {/* Photo Profile Selection */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4 shadow-xs">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">🖼️ Image de Profil</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Uploadez votre photo de champ ou sélectionnez l'un de nos avatars recommandés.</p>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      {/* File Uploader */}
                      <label className="block">
                        <span className="block text-[10.5px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Téléverser mon fichier</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 1.8 * 1024 * 1024) {
                                alert("Veuillez sélectionner une image d'une taille inférieure à 1.8 Mo pour préserver le stockage local.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfileAvatar(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                        />
                      </label>

                      {/* Presets Grid */}
                      <div className="space-y-2">
                        <span className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wide">Avatars Communaux Prédéfinis</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { emoji: "🌾", title: "Cultures" },
                            { emoji: "🍅", title: "Maraîcher" },
                            { emoji: "🐓", title: "Aviculteur" },
                            { emoji: "🚜", title: "Innovateur" },
                            { emoji: "🍊", title: "Arboriculture" },
                            { emoji: "🧪", title: "Technicienne" },
                            { emoji: "🌽", title: "Céréalier" },
                            { emoji: "🍀", title: "Bio-engrais" }
                          ].map((item, idx) => {
                            // Dummy SVG / Emoji avatar string representation
                            const presetUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23047857"><circle cx="50" cy="50" r="45" fill="%23e6f4ea"/><text x="50" y="65" font-size="45" text-anchor="middle">${item.emoji}</text></svg>`;
                            return (
                              <button
                                key={idx}
                                type="button"
                                title={item.title}
                                onClick={() => setProfileAvatar(presetUrl)}
                                className={`h-11 rounded-lg border flex items-center justify-center text-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-350 transition ${
                                  profileAvatar === presetUrl ? "border-emerald-650 bg-emerald-50 scale-105" : "border-slate-200"
                                }`}
                              >
                                {item.emoji}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {profileAvatar && (
                        <button
                          type="button"
                          onClick={() => setProfileAvatar("")}
                          className="w-full py-1 text-rose-600 hover:text-rose-700 font-extrabold text-[10.5px] hover:underline transition"
                        >
                          Supprimer l'image actuelle
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Account Type Summary */}
                  <div className="bg-[#0b0f19] border border-slate-800 text-slate-300 rounded-2xl p-5 space-y-3.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">📑 Statut du Compte</h4>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                        <span className="text-zinc-500">Identifiant Unique :</span>
                        <span className="font-mono text-zinc-300 font-bold">{user.id.substring(0, 8)}...</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                        <span className="text-zinc-500">Type de Compte :</span>
                        <span>{user.isPremium ? "⭐ Souverain Premium" : "⏳ Mode Découverte"}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                        <span className="text-zinc-500">Fin d'Abonnement :</span>
                        <span className="font-mono">{user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : "Illimité / Essai"}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right side: Credentials modify form */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Settings Form */}
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const updatedUser = {
                        ...user,
                        firstName: profileFirstName,
                        lastName: profileLastName,
                        phone: profilePhone,
                        whatsapp: profileWhatsApp,
                        specialty: profileSpecialty,
                        location: profileLocation,
                        avatarUrl: profileAvatar,
                      };
                      
                      // Optimistically update client state
                      setUser(updatedUser);
                      localStorage.setItem("agribot_active_user", JSON.stringify(updatedUser));
                      
                      try {
                        const res = await fetch("/api/user/update-profile", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            userId: user.id,
                            firstName: profileFirstName,
                            lastName: profileLastName,
                            phone: profilePhone,
                            whatsapp: profileWhatsApp,
                            specialty: profileSpecialty,
                            location: profileLocation,
                            avatarUrl: profileAvatar,
                          }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.success && data.user) {
                            setUser(data.user);
                            localStorage.setItem("agribot_active_user", JSON.stringify(data.user));
                          }
                        }
                      } catch (apiErr) {
                        console.error("Failed to persist profile details to server", apiErr);
                      }

                      try {
                        const rawUsers = localStorage.getItem("agribot_users_list");
                        const usersList = rawUsers ? JSON.parse(rawUsers) : [];
                        const userIndex = usersList.findIndex((u: any) => u.id === updatedUser.id);
                        if (userIndex !== -1) {
                          usersList[userIndex] = updatedUser;
                        } else {
                          usersList.push(updatedUser);
                        }
                        localStorage.setItem("agribot_users_list", JSON.stringify(usersList));
                      } catch (err) {
                        console.error(err);
                      }
                      syncData();
                      setProfileSuccessFeedback("✅ Félicitations ! Vos informations de producteur souverain ont été mises à jour avec succès et sauvegardées.");
                      setTimeout(() => setProfileSuccessFeedback(""), 5000);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-slate-800"
                  >
                    <div>
                      <h4 className="text-sm font-black uppercase text-emerald-950 tracking-tight">👤 MODIFIER MES INFORMATIONS DE PRODUCTEUR</h4>
                      <p className="text-[11px] text-slate-400">Remplissez attentivement ces champs pour actualiser vos fiches et contacts.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-650 mb-1">Prénom de l'exploitant</label>
                        <input 
                          type="text" 
                          required
                          value={profileFirstName}
                          onChange={(e) => setProfileFirstName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-medium"
                          placeholder="Ex: Jean Baptiste"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-650 mb-1">Nom de famille</label>
                        <input 
                          type="text" 
                          required
                          value={profileLastName}
                          onChange={(e) => setProfileLastName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-medium"
                          placeholder="Ex: HOUESSOU"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-650 mb-1">Coordonnées de Téléphone (GSM)</label>
                        <input 
                          type="tel" 
                          required
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-mono"
                          placeholder="Ex: +229 01 61 44 32"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-650 mb-1">Numéro WhatsApp (MoMo &amp; Commerce)</label>
                        <input 
                          type="text" 
                          value={profileWhatsApp}
                          onChange={(e) => setProfileWhatsApp(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-mono"
                          placeholder="Ex: +229 01 61 44 32"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-650 mb-1">Spécialité Principale de Production</label>
                        <select 
                          value={profileSpecialty}
                          onChange={(e) => setProfileSpecialty(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-medium cursor-pointer"
                        >
                          <option value="Maraîchage Biologique">Maraîchage Biologique</option>
                          <option value="Aviculture & Elevage">Aviculture &amp; Élevage</option>
                          <option value="Cultures Céréalières">Cultures Céréalières</option>
                          <option value="Arboriculture Fruitière">Arboriculture Fruitière</option>
                          <option value="Agro-transformation">Agro-transformation locale</option>
                          <option value="Techniques Agronomiques">Conseil / Agronome Vulgarisateur</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-650 mb-1">Département &amp; Commune d'Exploitation</label>
                        <input 
                          type="text" 
                          required
                          value={profileLocation}
                          onChange={(e) => setProfileLocation(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-medium"
                          placeholder="Ex: Dangbo, Ouémé"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest cursor-pointer transition active:scale-95"
                      >
                        💾 Enregistrer &amp; Mettre à Jour mon Profil
                      </button>
                    </div>
                  </form>

                  {/* PWA INSTALCARD FOR PRODUCTEUR */}
                  <div className="bg-gradient-to-br from-[#0c1c11] to-[#040905] border-2 border-[#2ecc71]/25 rounded-3xl p-5 text-zinc-100 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl shadow-inner animate-bounce shrink-0">
                        📱
                      </div>
                      <div className="text-left">
                        <h4 className="font-sora font-extrabold text-[13.5px] text-[#2ece76] uppercase tracking-tight">INSTALLER L'APPLICATION SUR VOTRE MOBILE</h4>
                        <p className="text-[10.5px] text-zinc-400 font-sans mt-0.5">Accédez à AgriBot Mine d'Or en un instant sans ouvrir votre navigateur !</p>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans text-left">
                      Grâce à notre support PWA complet, l'application s'installe en quelques secondes, consomme moins de batterie et vous permet de consulter l'historique de vos fiches techniques hors-ligne au Bénin.
                    </p>

                    <button
                      onClick={() => setShowPwaModal(true)}
                      className="w-full sm:w-auto px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-[10.5px] uppercase tracking-wider cursor-pointer transition active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <span>📥</span>
                      <span>DÉCOUVRIR COMMENT L'INSTALLER</span>
                    </button>
                  </div>

                  {/* SECURITY DEMARCHES IN DETAILS */}
                  <div className="bg-[#FAF3F0] border-2 border-slate-200/60 rounded-2xl p-6 text-slate-800 space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3">
                      <span className="text-xl">🛡️</span>
                      <div>
                        <h4 className="font-sora font-extrabold text-[14px] text-slate-900 uppercase tracking-tight">DÉMARCHES SOUVERAINES POUR SÉCURISER VOTRE COMPTE</h4>
                        <p className="text-[11px] text-[#5c5450] font-sans">Protégez vos données et votre accès AgriBot Pro contre les usurpations.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      
                      <div className="bg-white/80 p-4 rounded-xl border border-slate-250/50 space-y-1 text-xs">
                        <strong className="text-slate-900 block font-bold text-[12px]">🔐 Étape 1 : Renforcez votre mot de passe avec des repères agronomiques</strong>
                        <p className="text-[11.5px] text-slate-650 leading-relaxed leading-normal">
                          Évitez d'utiliser votre année de naissance ou "12345". Choisissez des noms d'arbres, de cultures ou d'outils combinés à des numéros (ex : <code>AzadirachtaIndica2026!</code> ou <code>PimentSouverain99#</code>). Cela rend les attaques de brute-force impossibles.
                        </p>
                      </div>

                      <div className="bg-white/80 p-4 rounded-xl border border-slate-250/50 space-y-1 text-xs">
                        <strong className="text-slate-900 block font-bold text-[12px]">🚫 Étape 2 : Pas de divulgation de vos clés de transaction Premium</strong>
                        <p className="text-[11px] text-slate-650 leading-relaxed leading-normal">
                          Notre équipe ne vous demandera <strong>JAMAIS</strong> de lui envoyer de mot de passe ou de clé secrète par WhatsApp ou SMS. Les codes USSD du type <code>*880*46*0161443262#</code> de MTN MoMo ne doivent être exécutés que sous votre contrôle direct.
                        </p>
                      </div>

                      <div className="bg-white/80 p-4 rounded-xl border border-slate-250/50 space-y-1 text-xs">
                        <strong className="text-slate-900 block font-bold text-[12px]">📸 Étape 3 : Gardez une copie physique de votre code unique</strong>
                        <p className="text-[11px] text-slate-650 leading-relaxed leading-normal">
                          Notez votre identifiant de compte dans un carnet de ferme physique. Si vous changez de téléphone mobile de manière imprévue, cet identifiant vous servira de clé de restauration immédiate auprès de la <strong>coordination AgriBot</strong>.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6 text-left" id="guide-and-assistance-tab-view">
              
              {/* BRAND NEW RICH GUIDE SECTION AUTHOR ZOUNMATOUN */}
              <div className="bg-[#0c1410] border border-[#27ae60]/20 rounded-3xl p-6 text-zinc-100 shadow-lg space-y-6">
                <div className="flex flex-col gap-1 px-1 border-b border-[#27ae60]/15 pb-4.5 mb-5 text-left">
                  <span className="text-[10px] font-black uppercase text-emerald-400 font-mono tracking-widest leading-none">
                    📘 GUIDE OFFICIEL ET FONCTIONNEMENT DE LA PLATEFORME
                  </span>
                  <h3 className="font-sora font-extrabold text-[18px] text-white uppercase tracking-tight">
                    L'Agriculture, une Mine d'Or Verte du Bénin
                  </h3>
                </div>

                {/* Master citation card */}
                <div className="bg-[#052410]/60 border border-emerald-500/25 rounded-2xl p-5 space-y-3">
                  <p className="font-extrabold text-amber-500 font-sans tracking-tight flex items-center gap-1.5 text-sm">🌾 Message de l'Équipe de Coordination :</p>
                  <p className="text-[12px] italic font-medium leading-relaxed text-[#b1dfc2]">
                    "Cette plateforme a été pensée pour accompagner tous nos vaillants agriculteurs, maraîchers, éleveurs et jeunes diplômés dans leur quête d'indépendance financière et technique. Elle est le prolongement pratique de nos expertises formées au Centre Songhaï."
                  </p>
                  <p className="text-[9.5px] text-[#2ecc71] font-bold uppercase text-right leading-none font-mono">
                    — La Coordination de la Plateforme AgriBot
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Premier paragraphe: Idée générale & Problématique */}
                  <div className="bg-[#060e0a] border border-[#27ae60]/12 p-5 rounded-2xl space-y-4">
                    <h4 className="font-black uppercase tracking-wide text-xs flex items-center gap-1.5 font-display text-emerald-400 font-mono">
                      <span>🌍</span> 1. IDÉE GÉNÉRALE ET ANALYSE DE LA PROBLÉMATIQUE FERMIÈRE
                    </h4>
                    <p className="text-zinc-300 leading-relaxed text-[12px]">
                      De nos jours, les producteurs agricoles, entrepreneurs agricoles, fermiers et techniciens béninois font face à des défis majeurs dans leurs exploitations quotidiennes. Le manque flagrant d'accès aux informations fiables et réelles — qu'il s'agisse des prévisions météorologiques locales, de l'état du marché de production, ou de la variation sauvage des prix sur les marchés de gros de Cotonou, Porto-Novo ou Parakou — plonge continuellement nos acteurs ruraux dans l'obscurité et les contraint à évoluer dans l'informel et l'ombre d'intermédiaires spéculateurs. Sans plateforme pour mettre en ligne, publier et exposer leurs récoltes maraîchères de manière structurée, nos fermiers passent à côté d'une chance unique d'être reconnus et équitablement rémunérés. Parallèlement, nos brillants jeunes diplômés des écoles d'agronomie et les bailleurs de fonds souffrent d'un manque d'interconnexion fluide pour initier des contacts rapides. Les jeunes peinent à obtenir des financements d'exploitation, à trouver des opportunités de stages ou d'emplois durables, tandis que les propriétaires terriens font face à une pénurie récurrente de main-d'œuvre qualifiée. Dès lors, comment briser ce cycle d'isolement informationnel et économique pour propulser l'agro-entreprenariat vers la prospérité et la connectivité moderne ? C'est dans l'optique de résoudre cette problématique centrale que nous annonçons notre plan d'action structuré autour de modules interconnectés : nous étudierons d'une part la mise en relation commerciale directe via le marché et d'autre part le déploiement de systèmes d'aide à la décision agronomique intelligente.
                    </p>
                  </div>

                  {/* Second paragraphe: Explication détaillée des modules */}
                  <div className="bg-[#060e0a] border border-[#27ae60]/12 p-5 rounded-2xl space-y-4">
                    <h4 className="font-black uppercase tracking-wide text-xs flex items-center gap-1.5 font-display text-emerald-400 border-b border-emerald-500/20 pb-2 font-mono">
                      <span>⚙️</span> 2. DÉPLOIEMENT TECHNIQUE ET FONCTIONNEMENT DES MODULES
                    </h4>
                    <p className="text-zinc-300 text-[12px] leading-relaxed">
                      Pour guider efficacement chaque utilisateur, la plateforme déploie des briques technologiques simples et robustes conçues pour chaque besoin de l'exploitation :
                    </p>
                    
                    <div className="space-y-4 pt-2">
                      <div className="flex gap-3 text-[12px] items-start">
                        <div className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded text-xs font-black font-mono shrink-0">01</div>
                        <div>
                          <strong className="text-white text-[12.5px] font-bold block mb-0.5">L'Accueil & Suivi de Souveraineté Météo/Prix</strong>
                          <p className="text-zinc-300 leading-relaxed text-[11.5px]">
                            Centralise l'accès aux bulletins météo géo-localisés réels et maintient un tableau récapitulatif des prix indicatifs des produits maraîchers. Cela élimine d'un coup la manipulation spéculative du marché de l'informel et protège les gains des exploitants.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 text-[12px] items-start">
                        <div className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded text-xs font-black font-mono shrink-0">02</div>
                        <div>
                          <strong className="text-white text-[12.5px] font-bold block mb-0.5">Le Module de Publication (MarketPlace & Intrants)</strong>
                          <p className="text-zinc-300 leading-relaxed text-[11.5px]">
                            Une véritable vitrine agricole en ligne. Les producteurs y publient en quelques clics leurs stocks (tomates, piments, aviculture, récoltes) avec photos réelles, prix fixes et localisation. Les acheteurs grossistes locaux peuvent ainsi entrer directement en contact téléphonique ou WhatsApp avec eux, éliminant tout intermédiaire parasite.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 text-[12px] items-start">
                        <div className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded text-xs font-black font-mono shrink-0">03</div>
                        <div>
                          <strong className="text-white text-[12.5px] font-bold block mb-0.5">Le Forum Communautaire AgriChat (Messages)</strong>
                          <p className="text-zinc-300 leading-relaxed text-[11.5px]">
                            Un salon de discussion général ou privé qui permet d'échanger en temps réel sa veille agronomique (alertes phytosanitaires, offensive de ravageurs, astuces) et d'organiser des achats groupés de sacs d'urée ou d'outillage pour amortir drastiquement les charges d'exploitation.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 text-[12px] items-start">
                        <div className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded text-xs font-black font-mono shrink-0">04</div>
                        <div>
                          <strong className="text-white text-[12.5px] font-bold block mb-0.5">L'Espace Entraide & Solidarité</strong>
                          <p className="text-zinc-300 leading-relaxed text-[11.5px]">
                            Destiné à la mutualisation des ressources lors des pics de récoltes ou de coups durs physiques. Les agriculteurs y publient des demandes d'entraide temporaires ou partagent du matériel agricole en toute solidarité.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 text-[12px] items-start">
                        <div className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded text-xs font-black font-mono shrink-0">05</div>
                        <div>
                          <strong className="text-white text-[12.5px] font-bold block mb-0.5">La CV-Thèque et l'Espace Opportunités de Stages/Emplois</strong>
                          <p className="text-zinc-300 leading-relaxed text-[11.5px]">
                            Une vitrine dédiée aux jeunes diplômés des universités agricoles béninoises. En y déposant leurs CVs, ils se font immédiatement identifier par des promoteurs d'exploitations en quête de techniciens experts ou par des bailleurs de fonds pour des appuis financiers d'amorçage.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 text-[12px] items-start">
                        <div className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded text-xs font-black font-mono shrink-0">06</div>
                        <div>
                          <strong className="text-white text-[12.5px] font-bold block mb-0.5">L'Intelligence Artificielle AgriBot IA & Diagnostic</strong>
                          <p className="text-zinc-300 leading-relaxed text-[11.5px]">
                            Une interface de pointe intégrant l'assistant virtuel AgriBot entraîné aux sols tropicaux, ainsi qu'une base de fiches de diagnostics scientifiques pour résoudre en quelques secondes un flétrissement du piment ou adapter l'alimentation micro-nutritionnelle d'un élevage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Troisième paragraphe: Motivation à venir massivement */}
                  <div className="bg-[#060e0a] border border-[#27ae60]/12 p-5 rounded-2xl space-y-3">
                    <h4 className="font-black uppercase tracking-wide text-xs flex items-center gap-1.5 font-display text-emerald-400 font-mono">
                      <span>🚀</span> 3. ENTRER EN MASSE DANS L'AVENIR DE LA COOPÉRATION AGRICOLE
                    </h4>
                    <p className="text-zinc-300 leading-relaxed text-[12px]">
                      Aujourd'hui, nous lançons un appel vibrant et motivant à tous les producteurs agricoles, techniciens, entrepreneurs ruraux, élèves stagiaires et institutions d'appui : rejoignez massivement AgriBot Mine d'Or ! Notre force réside dans notre nombre et dans la clarté de notre mise en relation directe. Plus nous serons nombreux à publier nos tarifs en direct et à partager nos compétences agronomiques de terrain sur le forum communal, plus nous bousculerons l'informel spéculatif et assurerons la souveraineté alimentaire de notre pays, le Bénin. C'est le moment d'embrasser sereinement cet écosystème collaboratif, car beaucoup d'autres excellentes fonctionnalités de haute volée (suivis cartographiques des fermes, crédits et micro-financements communautaires gérés en temps réel, formations pratiques exclusives issues des enseignements de Songhaï) sont déjà en développement avancé et s'apprêtent à révolutionner votre quotidien agricole !
                    </p>
                  </div>

                </div>
              </div>

              {/* Assistance Desk underneath the guide section - EXACTLY TWO FIELDS FORM DIRECT TO Coordonnateur */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
                <div className="p-6 bg-slate-900 text-white">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white font-display">
                    📬 Écrire à la Coordination (jbzounmatoun@gmail.com)
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Vous souhaitez poser une question, suggérer une amélioration maraîchère ou demander une formation en maraîchage bio ? Remplissez ce formulaire pour envoyer votre message directement à notre équipe de la coordination.</p>
                </div>

                <div className="p-6 space-y-4">
                  {contactFeedback && (
                    <div className="bg-emerald-50 text-emerald-800 text-xs p-3.5 rounded-xl border border-emerald-250 font-semibold">
                      {contactFeedback}
                    </div>
                  )}

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!contactEmail || !contactMessage) {
                        alert("Veuillez remplir votre e-mail et votre message.");
                        return;
                      }
                      // Set a fallback contactName so backend does not complain
                      const defaultName = user ? `${user.firstName} ${user.lastName}` : "Producteur AgriBot";
                      try {
                        await fetch("/api/contact", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name: defaultName, email: contactEmail, message: contactMessage })
                        });
                        setContactFeedback("✅ Votre message a été envoyé avec succès à la coordination via l'adresse jbzounmatoun@gmail.com !");
                      } catch (err) {
                        setContactFeedback("💾 Votre message a été traité et stocké pour être transmis à la coordination (jbzounmatoun@gmail.com).");
                      } finally {
                        setContactEmail("");
                        setContactMessage("");
                      }
                    }} 
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Votre Adresse e-mail de correspondance</label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                        placeholder="Ex: producteur@gmail.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Votre message pour la coordination AgriBot</label>
                      <textarea
                        rows={5}
                        required
                        className="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                        placeholder="Écrivez ici votre préoccupation agronomique, demande de formation ou message..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition uppercase tracking-widest cursor-pointer active:scale-95"
                    >
                      ✉️ Envoyer mon Message en Direct
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-800/50 p-2.5 rounded-xl">
                      <Bell className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-display uppercase tracking-widest text-white">🔔 Alertes &amp; Notifications</h3>
                      <p className="text-xs text-emerald-100">Suivez l'activité du réseau, des opportunités de stage et du marché en direct</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setNotifications([]);
                      setPremiumFeedbackMsg("✨ Toutes les notifications ont été effacées.");
                    }}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                  >
                    Effacer Tout
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {premiumFeedbackMsg && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-3.5 rounded-xl border border-emerald-200 font-medium">
                    {premiumFeedbackMsg}
                  </div>
                )}

                <div className="divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <span className="text-3xl">📭</span>
                      <p className="text-xs text-slate-500 font-bold">Aucune alerte active ou notification pour le moment.</p>
                      <p className="text-[11px] text-slate-400">Toutes les opportunités d'emploi, les récoltes du marché et les nouvelles directes s'afficheront ici.</p>
                    </div>
                  ) : (
                    notifications.map((notif, index) => (
                      <div key={index} className="py-4 flex gap-4 items-start first:pt-0 last:pb-0 hover:bg-slate-50/60 px-2 rounded-xl transition">
                        <div className="bg-emerald-50 text-emerald-700 h-8 w-8 rounded-full flex items-center justify-center text-xs shrink-0 font-mono font-bold shadow-xs">
                          {notifications.length - index}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-slate-800 leading-relaxed font-semibold">{notif}</p>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Alerte AgriBot • En direct</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </section>

      </main>

        </div>
      )}

      {/* 1. CUSTOM PWA INSTALLATION INSTRUCTIONS MODAL */}
      {showInstallInstructions && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 transform scale-100 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900">Installer AgriBot</h3>
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Application Directe &amp; Mobile</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInstallInstructions(false)}
                className="p-1 text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                Installez l'application AgriBot sur votre smartphone ou votre ordinateur pour un accès instantané et une expérience plus rapide hors-ligne.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                <div className="flex gap-2.5 items-start">
                  <span className="p-1 px-2.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900 font-semibold text-[11px]">Sur Android (Google Chrome) :</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">Cliquez sur les 3 points en haut à droite de votre navigateur, puis sélectionnez <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <span className="p-1 px-2.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900 font-semibold text-[11px]">Sur iPhone / iPad (Safari) :</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">Appuyez sur le bouton de <strong>"Partage"</strong> (petite boîte avec une flèche vers le haut), puis faites défiler et touchez <strong>"Sur l'écran d'accueil"</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <span className="p-1 px-2.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900 font-semibold text-[11px]">Sur PC / Mac (Chrome / Edge) :</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">Cliquez sur l'icône d'écran de téléchargement située tout à fait à droite de votre barre d'adresse URL.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInstallInstructions(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              D'accord, j'ai compris !
            </button>
          </div>
        </div>
      )}

      {/* WEATHER MODAL OVERLAY (Détails Complets Météo comme requis) */}
      {showWeatherModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col">
            
            {/* Modal Heading */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 shrink-0 relative">
              <button
                onClick={() => setShowWeatherModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition cursor-pointer flex items-center justify-center"
                title="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 pr-8">
                <div className="bg-emerald-800/50 p-2.5 rounded-2xl">
                  <CloudSun className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-display uppercase tracking-widest text-white">📍 Météo de ma Commune Bénin</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">Détection GPS automatique et conseils maraîchers calibrés pour votre exploitation</p>
                </div>
              </div>
            </div>

            {/* Modal Body Scroll Space */}
            <div className="p-5 overflow-y-auto space-y-5 text-slate-800 font-sans max-h-[80vh] text-xs">
              
              {/* Optional GPS Auto detection banner */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-3 shadow-3xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wide text-slate-700">Détection Géographique</p>
                    <p className="text-[10.5px] text-slate-500">
                      {gpsAuthorized 
                        ? `GPS Connecté (Commune : ${selectedCommune})` 
                        : "Le GPS automatique localise instantanément votre commune."}
                    </p>
                  </div>
                </div>
                {!gpsAuthorized ? (
                  <button
                    onClick={requestGeolocation}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] uppercase font-black tracking-wider transition cursor-pointer shrink-0"
                  >
                    {isLocating ? "Recherche..." : "Activer GPS"}
                  </button>
                ) : (
                  <span className="bg-emerald-100 text-emerald-850 text-[9px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 uppercase">
                    Connecté
                  </span>
                )}
              </div>

              {/* Cascade manual selectors */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="text-xs">🇧🇯</span>
                  <p className="font-extrabold text-[11px] uppercase tracking-wider text-slate-800">
                    Sélectionner par Département et Commune du Bénin
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] uppercase font-black text-slate-400 mb-1 font-mono">Département :</label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => {
                        const nextDept = e.target.value;
                        setSelectedDepartment(nextDept);
                        const list = BENIN_DEPARTMENTS_COMMUNES[nextDept as keyof typeof BENIN_DEPARTMENTS_COMMUNES] || [];
                        if (list.length > 0) {
                          setSelectedCommune(list[0]);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-3xs"
                    >
                      {Object.keys(BENIN_DEPARTMENTS_COMMUNES).map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] uppercase font-black text-slate-400 mb-1 font-mono">Commune :</label>
                    <select
                      value={selectedCommune}
                      onChange={(e) => {
                        setSelectedCommune(e.target.value);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-3xs"
                    >
                      {(BENIN_DEPARTMENTS_COMMUNES[selectedDepartment as keyof typeof BENIN_DEPARTMENTS_COMMUNES] || []).map((commune) => (
                        <option key={commune} value={commune}>{commune}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Weather stats card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/20 to-white border border-emerald-250/55 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xs">
                <div className="flex items-center gap-3 font-sans">
                  <span className="text-4xl animate-pulse">
                    {weather?.condition.includes("🌧️") || weather?.condition.includes("⛈️") ? "🌧️" : "🌤️"}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-emerald-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase font-mono tracking-wider">
                        Bénin Climat Temps Réel
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">COMMUNE DE {selectedCommune}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-1 uppercase tracking-tight font-display">
                      Météo Coopérative
                    </h4>
                    <p className="text-[10.5px] text-emerald-850 leading-tight">
                      Données météo connectées via l'API ouverte Open-Meteo.
                    </p>
                    {weather?.lastUpdated && (
                      <p className="text-[9.5px] text-emerald-800 font-mono font-bold mt-1 inline-flex items-center gap-1 bg-emerald-100/50 px-2 py-0.5 rounded-md">
                        ⏱️ MAJ : {weather.lastUpdated}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-stretch sm:items-end shrink-0 w-full sm:w-auto">
                  <div className="text-center sm:text-right bg-white py-2 px-4 rounded-xl border border-emerald-150/40 shadow-3xs">
                    <div className="text-2xl font-mono font-black text-slate-950">{weather?.temp}°C</div>
                    <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none mt-1">
                      {weather?.condition}
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono font-medium mt-1.5">
                      Humi : {weather?.humidity || "78%"} • Vent : {weather?.wind || "12 km/h"}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (gpsAuthorized && coords) {
                        syncOpenMeteoWeather(selectedCommune, coords);
                      } else {
                        syncOpenMeteoWeather(selectedCommune);
                      }
                    }}
                    className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-800 border border-teal-200 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    🔄 Actualiser Météo
                  </button>
                </div>
              </div>



              {/* Advanced Climatical recommendations detailing */}
              {weather && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-1 flex items-center gap-1">
                    <span>💡</span>
                    <span>Conseils exclusifs {selectedCommune} :</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
                    {weather.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-3.5 bg-emerald-50/10 border border-slate-100 rounded-xl flex gap-2 text-xs text-slate-650 hover:border-emerald-150 transition">
                        <span className="text-emerald-600 text-sm shrink-0">🌿</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t p-4 flex justify-end shrink-0">
              <button
                onClick={() => setShowWeatherModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition cursor-pointer shrink-0"
              >
                Fermer la Météo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== COMMUNITY STORIES MODALS ==================== */}
      {activeStoryGroupKey && (
        <div 
          onTouchStart={handleStoryTouchStart}
          onTouchEnd={handleStoryTouchEnd}
          className="fixed inset-0 z-[100] bg-[#060a07] flex flex-col justify-between select-none overflow-hidden animate-fade-in"
        >
          {(() => {
            const grouped = getGroupedStories();
            const activeGroup = grouped.find(g => g.name === activeStoryGroupKey);
            if (!activeGroup) {
              setActiveStoryGroupKey(null);
              return null;
            }
            
            const activeStory = activeGroup.items[currentStoryItemIndex] || activeGroup.items[0];
            const isOwner = activeGroup.name.toLowerCase() === "jean baptiste" || activeGroup.name.toLowerCase() === (user?.firstName || "").toLowerCase();
            
            // Dynamic theme variables based on category (ck)
            const catColors = {
              culture: { bg: "from-emerald-950 via-green-950/90 to-[#040805]", text: "text-[#2ecc71]", border: "border-[#2ecc71]/40", badgeColor: "bg-[#2ecc71]/15 text-[#2ecc71]", label: "🌱 PRODUCTION AGRICOLE" },
              elevage: { bg: "from-[#2b1704] via-[#1a0f02]/95 to-[#060401]", text: "text-amber-500", border: "border-amber-500/40", badgeColor: "bg-amber-500/15 text-amber-500", label: "🐔 ÉLEVAGE & CHEPTELS" },
              marche: { bg: "from-[#292203] via-[#1c1702]/95 to-[#050401]", text: "text-yellow-400", border: "border-yellow-400/40", badgeColor: "bg-yellow-400/15 text-yellow-400", label: "💰 COURS & MARCHÉ" },
              meteo: { bg: "from-[#241c02] via-[#171201]/95 to-[#040301]", text: "text-orange-400", border: "border-orange-400/40", badgeColor: "bg-orange-400/15 text-orange-400", label: "☀️ METEO ET CLIMAT" },
              irrigation: { bg: "from-blue-950 via-[#071329]/95 to-[#02050b]", text: "text-blue-400", border: "border-blue-400/40", badgeColor: "bg-blue-400/15 text-blue-400", label: "💧 WATERING & IRRIGATION" },
              finance: { bg: "from-red-950 via-violet-950/90 to-[#0e0712]", text: "text-rose-400", border: "border-rose-400/50", badgeColor: "bg-rose-400/15 text-rose-400", label: "🏦 ANALYSE FINANCIÈRE" },
              agribot: { bg: "from-teal-950 via-cyan-950/95 to-[#02090b]", text: "text-teal-400", border: "border-teal-400/50", badgeColor: "bg-teal-400/15 text-teal-400", label: "🧠 AGRIBOT INTELLIGENCE PRO" }
            };

            const activeCat = catColors[(activeStory.ck || "culture") as keyof typeof catColors] || catColors.culture;
            const rxKey = `${activeGroup.name}_${activeStory.id}`;
            const rxCounts = localReactions[rxKey] || activeStory.rx || [12, 4, 8, 2, 6];

            const reactionsList = [
              { label: "Utile", emoji: "🌱" },
              { label: "Important", emoji: "💧" },
              { label: "Excellent", emoji: "☀️" },
              { label: "Urgent", emoji: "🔥" },
              { label: "Partager", emoji: "🤝" }
            ];

            const handleVoteReaction = (idx: number) => {
              setLocalReactions(prev => {
                const next = { ...prev };
                const current = next[rxKey] ? [...next[rxKey]] : [...(activeStory.rx || [12, 4, 8, 2, 6])];
                current[idx] += 1;
                next[rxKey] = current;
                return next;
              });
            };

            const isText = !!activeStory.isTextStory;
            return (
              <div 
                className="relative w-full h-full flex flex-col justify-between max-w-md mx-auto text-white overflow-hidden"
                style={{ 
                  height: "100vh",
                  backgroundColor: isText ? (activeStory.backgroundColor || "#128c7e") : "#000000"
                }}
              >
                {/* 1. TOP PROGRESS BAR SEGMENTS (Instagram-like / WhatsApp) */}
                <div className="absolute top-3 inset-x-3.5 flex gap-1 z-30 pointer-events-none">
                  {activeGroup.items.map((item, idx) => {
                    let progressWidth = "0%";
                    if (idx < currentStoryItemIndex) progressWidth = "100%";
                    else if (idx === currentStoryItemIndex) progressWidth = `${storyTimerProgress}%`;
                    
                    return (
                      <div key={item.id} className="h-1 flex-grow bg-white/35 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                          style={{ width: progressWidth }}
                        ></div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. DYNAMIC FLOATING HEADER WITH OWNER STATS (WhatsApp style) */}
                <div className="absolute top-5.5 inset-x-0 z-30 px-3.5 py-3 flex items-center justify-between bg-gradient-to-b from-black/85 to-transparent">
                  <div className="flex items-center gap-2.5">
                    {/* Retro Arrow Back Button */}
                    <button 
                      onClick={() => {
                        if (!seenGroupNames.includes(activeGroup.name)) {
                          setSeenGroupNames(prev => [...prev, activeGroup.name]);
                        }
                        setActiveStoryGroupKey(null);
                      }}
                      className="p-1 hover:bg-white/10 active:bg-white/20 text-white rounded-full transition cursor-pointer shrink-0 z-40"
                    >
                      <ArrowLeft className="h-4.5 w-4.5 stroke-[2.5]" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/25 flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
                      {activeStory.avatarUrl.length < 5 ? (
                        <span className="text-sm select-none">{activeStory.avatarUrl}</span>
                      ) : (
                        <img src={activeStory.avatarUrl} alt={activeGroup.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="leading-tight text-left">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-white font-bold text-[14px] flex items-center gap-1 drop-shadow-md font-sans">
                          <span>{activeGroup.name}</span>
                        </h4>
                      </div>
                      <p className="text-[10px] text-zinc-305 drop-shadow-xs font-medium mt-0.5">
                        {getStoryTimeLeft(activeStory.createdAt)} (Segment {currentStoryItemIndex + 1}/{activeGroup.items.length})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isUserJbz ? (
                      <button 
                        onClick={() => {
                          if (window.confirm("⚠️ Confirmer la suppression définitive de ce statut par l'Administrateur ?")) {
                            setStories(prev => prev.filter(s => s.id !== activeStory.id));
                            alert("Statut supprimé définitivement par l'Administrateur.");
                            setActiveStoryGroupKey(null);
                          }
                        }}
                        className="text-[8.5px] bg-red-600 hover:bg-red-700 px-2.5 py-1 text-white font-extrabold rounded-lg border border-red-500/20 tracking-wider cursor-pointer select-none uppercase shrink-0"
                      >
                        🗑️ SUPPRIMER
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          const confirmMsg = `Statut de ${activeGroup.name}. Signaler ce contenu ?`;
                          if (window.confirm(confirmMsg)) {
                            alert("Merci ! Signalement transmis.");
                          }
                        }}
                        className="text-[8.5px] bg-black/40 hover:bg-black/60 px-2.5 py-1 text-red-300 font-bold rounded-lg border border-red-500/20 tracking-wider cursor-pointer select-none uppercase shrink-0"
                      >
                        Signaler
                      </button>
                    )}
                    
                    {/* Sound button for video stories */}
                    {(activeStory.mediaType === "video" || activeStory.image.includes("video/") || activeStory.image.includes(".mp4")) && (
                      <button 
                        onClick={() => setStoryMuted(!storyMuted)}
                        className="w-7 h-7 bg-white/15 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition font-bold text-xs cursor-pointer shrink-0"
                        title={storyMuted ? "Activer le son" : "Désactiver le son"}
                      >
                        {storyMuted ? "🔇" : "🔊"}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        if (!seenGroupNames.includes(activeGroup.name)) {
                          setSeenGroupNames(prev => [...prev, activeGroup.name]);
                        }
                        setActiveStoryGroupKey(null);
                      }}
                      className="w-7 h-7 bg-white/15 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition font-bold text-xs cursor-pointer shrink-0"
                      title="Quitter"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* 3. INVISIBLE LEFT/RIGHT TRIGGER COLUMNS FOR SWIPING */}
                <div className="absolute inset-x-0 top-[85px] bottom-[150px] z-20 flex pointer-events-auto">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevStorySegment();
                    }}
                    className="w-[30%] h-full cursor-pointer"
                  />
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextStorySegment();
                    }}
                    className="w-[70%] h-full cursor-pointer"
                  />
                </div>

                {/* 4. MAIN CENTRAL CONTENT */}
                <div className="w-full flex-grow flex flex-col justify-center items-center z-10 relative select-none">
                  {isText ? (
                    /* WhatsApp Text Status: Centered text with big fonts */
                    <div className="px-6 text-center max-w-sm mt-12">
                      <p 
                        className="text-white text-xl sm:text-2xl font-bold tracking-tight leading-relaxed select-text font-display"
                        style={{ fontFamily: activeStory.fontFamily === "font-mono" ? "var(--font-mono)" : activeStory.fontFamily === "font-display" ? "var(--font-display)" : "var(--font-sans)" }}
                      >
                        {activeStory.text}
                      </p>
                    </div>
                  ) : (
                    /* WhatsApp Photo/Video Status: Full height image/video containment on black background with caption placed elegantly overlaying bottom */
                    <div className="w-full h-full flex flex-col justify-center items-center relative bg-black">
                      {/* WATERMARK AGRIBOT TRANSPARENT */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none overflow-hidden">
                        <span className="text-white/12 text-5xl sm:text-6xl md:text-7xl font-black tracking-[0.25em] -rotate-[30deg] uppercase select-none opacity-15">
                          AGRIBOT
                        </span>
                      </div>

                      <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                        {activeStory.mediaType === "video" || activeStory.image.includes("video/") || activeStory.image.includes(".mp4") ? (
                          <video 
                            src={activeStory.image} 
                            className="max-h-[85vh] w-full object-contain"
                            autoPlay
                            playsInline
                            loop
                            muted={storyMuted}
                          />
                        ) : (
                          <img 
                            src={activeStory.image} 
                            alt="Visualisation Statut" 
                            className="max-h-[85vh] w-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      
                      {activeStory.text && (
                        <div className="w-full bg-black/65 backdrop-blur-xs py-4 px-6 text-center absolute bottom-0 z-30 select-text border-t border-white/5">
                          <p className="text-white text-sm sm:text-base font-semibold leading-relaxed drop-shadow-md">
                            {activeStory.text}
                          </p>
                          {activeStory.sb && (
                            <p className="text-zinc-300 font-sans mt-1 text-xs leading-normal font-medium">
                              {activeStory.sb}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 5. BOTTOM REACTIONS SHEET AND RESPOND COMPARTMENT */}
                <div className="relative z-30 pb-6 pt-3 px-4 bg-gradient-to-t from-black/95 via-black/90 to-transparent flex flex-col gap-2.5 pointer-events-auto border-t border-white/5">
                  <div className="flex items-center gap-2 pt-1 animate-fade-in">
                    
                    {/* Ask Agribot Chat CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Pre-seed chatbot prompt based on this story metrics to open direct discussion
                        const specificPrompt = `Bonjour Agribot 🧠 ! J'aimerais en savoir plus concernant le statut de ${activeGroup.name} portant sur "${activeStory.text}" (${activeStory.sb || ''}). Peux-tu m'apporter des conseils ou explications techniques ?`;
                        setAgribotInitialPrompt(specificPrompt);
                        setActiveTab("agribot");
                        
                        // Mark story as read
                        if (!seenGroupNames.includes(activeGroup.name)) {
                          setSeenGroupNames(prev => [...prev, activeGroup.name]);
                        }
                        setActiveStoryGroupKey(null);
                      }}
                      className="h-10 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 shadow-lg shrink-0 cursor-pointer border border-emerald-400/20"
                      title="Demander à l'IA d'analyser"
                    >
                      <span>🧠 ANALYSER</span>
                    </button>

                    <div className="flex-grow bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 px-3.5 shadow-inner flex items-center">
                      <input 
                        type="text" 
                        placeholder={isOwner ? "Votre statut..." : "Répondre..."}
                        disabled={isOwner}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = e.currentTarget.value;
                            if (val.trim()) {
                              handleSendStoryReply(val);
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                        className="bg-transparent text-white text-xs outline-none placeholder-zinc-500 w-full font-bold disabled:opacity-40"
                      />
                    </div>

                    {!isOwner && (
                      <button 
                        onClick={() => {
                          handleSendStoryReply("🤝 Superbe publication !");
                        }}
                        className="h-10 w-10 bg-zinc-900 border border-zinc-805 hover:bg-zinc-800 text-white rounded-xl flex items-center justify-center transition duration-150 shadow-md cursor-pointer shrink-0 text-xs font-bold"
                        title="Réagir avec j'aime"
                      >
                        👍 1
                      </button>
                    )}
                  </div>
                </div>

                {/* 6. SLIDE UP VIEWERS LIST DRAWER FOR OWNERS */}
                {isOwner && showStoryViewersList && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="absolute inset-x-0 bottom-0 bg-slate-950 border-t border-slate-800 rounded-t-3xl p-5 text-white z-40 animate-in slide-in-from-bottom duration-300 shadow-2xl"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 flex-row">
                        <Eye className="h-4 w-4 text-emerald-400" />
                        <h4 className="font-extrabold text-xs tracking-wider uppercase text-emerald-300">Presences du Statut ({stories.length + 3})</h4>
                      </div>
                      <button 
                        onClick={() => setShowStoryViewersList(false)}
                        className="w-6 h-6 bg-slate-800 hover:bg-slate-705 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-3.5 max-h-48 overflow-y-auto">
                      {[
                        { name: "Agbado Marcel", time: "il y a 12 min", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
                        { name: "Chégué Gédéon", time: "il y a 44 min", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
                        { name: "Dr. Bio Sian", time: "il y a 1h", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" },
                        { name: "Maman Coton", time: "il y a 2h", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" },
                        { name: "Administrateur Jean", time: "il y a 4h", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100" }
                      ].map((v, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-slate-850 pb-2">
                          <div className="flex items-center gap-2.5 flex-row">
                            <div className="w-8 h-8 rounded-full bg-slate-850 hover:bg-slate-800 border border-slate-700/60 shadow flex items-center justify-center font-mono text-[9px] font-black text-white shrink-0">
                              {v.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black text-slate-100">{v.name}</p>
                              <p className="text-[10px] text-slate-400">{v.time}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/10 shrink-0">✓ Vu</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {showAddStoryModal && (
        <div className="fixed inset-0 z-[105] bg-black/85 flex items-center justify-center p-4 font-sans backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-950 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-200">
            {/* Header conforming to dark high-tech standard style */}
            <div className="bg-slate-900 border-b border-rose-500/10 p-4 flex justify-between items-center bg-[#0d1410] border-b border-[#2ecc71]/10">
              <div>
                <h3 className="font-extrabold text-xs tracking-wider uppercase text-emerald-400 flex items-center gap-1.5 font-display">
                  <span>
                    {storyCreationStep === "choose" ? "⚡ PUBLIER UN STATUT AGRI" : 
                     storyCreationStep === "text" ? "⚡ COMPOSER UN STATUT TEXTE" : "⚡ COMPOSER UN STATUT PHOTO/VIDÉO"}
                  </span>
                </h3>
                <p className="text-[9px] text-slate-400">Diffusion éphémère de 24 heures maximum (10 max / jour)</p>
              </div>
              <button 
                onClick={() => {
                  setShowAddStoryModal(false);
                  setStoryCreationStep("choose");
                }} 
                className="text-slate-400 hover:text-white cursor-pointer bg-slate-800 hover:bg-slate-755 w-7 h-7 rounded-full flex items-center justify-center transition text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* CHOICE FORMAT STEP */}
            {storyCreationStep === "choose" && (
              <div className="p-5 space-y-4 text-left">
                <p className="text-zinc-350 text-[11.5px] font-semibold leading-relaxed">
                  Choisissez le format de votre statut éphémère pour le diffuser à toute la communauté maraîchère du Bénin :
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setStoryCreationStep("text")}
                    className="p-4 bg-emerald-950/15 hover:bg-emerald-950/30 border border-emerald-500/15 hover:border-emerald-500/40 rounded-2xl flex items-center gap-3.5 text-left transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#2ecc71] flex items-center justify-center group-hover:scale-105 transition shrink-0 font-black text-sm">
                      Aa
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-white tracking-wide">✍️ Statut Texte Unique</h4>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-snug">Composer un message stylisé sur fond coloré (Style WhatsApp).</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setStoryCreationStep("media");
                      setNewStoryImage(""); // Start empty with no weird default image
                      setNewStoryText("");
                    }}
                    className="p-4 bg-emerald-950/15 hover:bg-emerald-950/30 border border-emerald-500/15 hover:border-emerald-500/40 rounded-2xl flex items-center gap-3.5 text-left transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-105 transition shrink-0 text-md">
                      📷
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-white tracking-wide">🖼️ Statut Photo / Vidéo</h4>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-snug">Partager une belle image agricole ou d'élevage accompagnée d'une légende.</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* TEXT-ONLY COMPOSER (WhatsApp style is the only authorized format) */}
            {storyCreationStep === "text" && (
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa] font-mono">Style de police :</span>

                  {/* Font Style cycler Aa */}
                  <button
                    onClick={() => setCurrentFontIdx((idx) => (idx + 1) % fontStyles.length)}
                    className="text-xs font-black bg-slate-850 hover:bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition border border-white/10 opacity-90 hover:opacity-100"
                    title="Changer de police"
                  >
                    Aa
                  </button>
                </div>

                {/* IMAGINATIVE WHATSAPP WALLPAPER COMPOSER */}
                <div 
                  className="w-full h-44 rounded-2xl flex flex-col justify-between p-3 relative shadow-inner border border-white/5 transition-all duration-300"
                  style={{ backgroundColor: storyBgColor }}
                >
                  {/* Top-right font signature indicator */}
                  <span className="absolute top-2 right-3 text-[7.5px] uppercase tracking-widest text-white/50 font-black">
                    {fontStyles[currentFontIdx].replace("font-", "style ")}
                  </span>

                  <div className="flex-1 flex items-center justify-center">
                    <textarea
                      value={newStoryText}
                      onChange={(e) => setNewStoryText(e.target.value)}
                      placeholder="Écrivez un statut..."
                      maxLength={150}
                      className="w-full bg-transparent border-0 resize-none text-center text-white text-[13.5px] md:text-sm font-extrabold focus:outline-hidden focus:ring-0 leading-relaxed placeholder-white/55 placeholder:font-bold break-words"
                      style={{ 
                        fontFamily: fontStyles[currentFontIdx] === "font-mono" ? "var(--font-mono)" : fontStyles[currentFontIdx] === "font-display" ? "var(--font-display)" : "var(--font-sans)",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div className="text-right text-[7.5px] text-white/40 font-bold">
                    {newStoryText.length}/150 car. max
                  </div>
                </div>

                {/* COLOR PALETTE ROW */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Sélectionner une couleur d'arrière-plan  🎨</label>
                  <div className="flex justify-around items-center bg-slate-900/60 p-2 rounded-xl">
                    {[
                      "#22c55e", // Green from Tabaski
                      "#84cc16", // Lime Green
                      "#f59e0b", // Saffron / Gold
                      "#ff6b6b", // Coral
                      "#ec4899", // Pink
                      "#8a2be2", // Purple from Tabaski
                      "#0ea5e9"  // Sky blue
                    ].map((col) => (
                      <button
                        key={col}
                        onClick={() => setStoryBgColor(col)}
                        className={`w-6 h-6 rounded-full border-2 transition transform hover:scale-110 cursor-pointer ${
                          storyBgColor === col ? "border-white ring-1.5 ring-emerald-500 scale-110 shadow-md" : "border-transparent opacity-80"
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit button / Back row */}
                <div className="flex gap-2 pt-1 border-t border-slate-900">
                  <button
                    onClick={() => {
                      setStoryCreationStep("choose");
                      setNewStoryText("");
                    }}
                    className="flex-1 py-2 bg-slate-90 rounded-xl text-xs font-semibold text-zinc-400 cursor-pointer border border-slate-800 transition hover:bg-slate-800"
                  >
                    Retour
                  </button>

                  <button
                    onClick={() => {
                      const currentName = user ? `${user.firstName} ${user.lastName}` : "Cultivateur Béninois";
                      
                      // Daily limit check of 10 statuses maximum per day
                      const todayMs = Date.now() - 24 * 3600 * 1000;
                      const storiesCountToday = stories.filter(s => s.name === currentName && s.createdAt > todayMs).length;
                      if (storiesCountToday >= 10) {
                        alert("⚠️ Limite quotidienne de statut atteinte ! Une personne a le droit de faire au maximum 10 statuts dans une journée.");
                        return;
                      }

                      const textContent = newStoryText.trim();
                      if (!textContent) {
                        alert("Veuillez saisir au moins quelques caractères pour votre statut texte !");
                        return;
                      }

                      const newStory = {
                        id: `sh-${Date.now()}`,
                        name: currentName,
                        avatarUrl: user?.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2364748b'/><circle cx='12' cy='8.5' r='3.5' fill='%23f1f5f9'/><path d='M6 17c0-2.5 3-4.5 6-4.5s6 2 6 4.5v1.5H6V17z' fill='%23f1f5f9'/></svg>",
                        badge: "✍️",
                        image: "",
                        text: textContent,
                        createdAt: Date.now(),
                        isTextStory: true,
                        backgroundColor: storyBgColor,
                        fontFamily: fontStyles[currentFontIdx]
                      };

                      setStories([newStory, ...stories]);

                      // Add text-only story in feed too with visual Agribot mine d'or watermark footer, exactly as requested:
                      const textFeedItem = {
                        id: `t-feed-${Date.now()}`,
                        tab: "home",
                        badge: "STATUT TEXTE",
                        location: "Bénin Live",
                        title: `Statut de ${currentName}`,
                        description: textContent,
                        subtitle: "Agribot mine d'or 🪙✨", // Indice Agribot mine d'or dessous
                        price: "⏱️ expire sous 24h",
                        actionLabel: "Réagir ➔",
                        color: `bg-gradient-to-br from-indigo-500 to-purple-600`,
                        isTextOnly: true,
                        backgroundColor: storyBgColor, // propagate the background color to the feed too for elegance!
                        fontFamily: fontStyles[currentFontIdx]
                      };
                      
                      setSouveraineteFeed([textFeedItem, ...souveraineteFeed]);

                      setShowAddStoryModal(false);
                      setStoryCreationStep("choose");
                      setNewStoryText("");
                      alert("Votre statut texte a été partagé avec succès ! ✍️");
                    }}
                    className="flex-[2] py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-650 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publier le Statut Texte</span>
                  </button>
                </div>
              </div>
            )}

            {/* PHOTO/VIDEO COMPOSER (MEDIA CAPTION SYSTEM) */}
            {storyCreationStep === "media" && (
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded-xl border border-white/5">
                  <span className="text-[9.5px] uppercase font-bold tracking-widest text-[#a1a1aa] font-mono">1. Pièce Jointe Média :</span>
                </div>

                <div className="space-y-1.5 text-left">
                  {/* CUSTOM FILE UPLOAD */}
                  <div className="pt-1.5 space-y-2">
                    <div className="border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-6 text-center bg-[#070e0a] transition relative">
                      <input
                        type="file"
                        id="media-story-input"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewStoryImage(reader.result as string);
                              if (file.type.startsWith("video/")) {
                                setNewStoryType("video");
                              } else {
                                setNewStoryType("image");
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label htmlFor="media-story-input" className="cursor-pointer block space-y-2">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl shadow-inner">
                          📁
                        </div>
                        <div className="text-[11px] font-extrabold text-emerald-200">Cliquez pour joindre une photo ou vidéo</div>
                        <div className="text-[8px] text-[#8c9c90] uppercase tracking-wider">Format image ou mp4 accepté</div>
                      </label>
                    </div>

                    {/* LIVE MEDIA ATTACHMENT PREVIEW */}
                    {newStoryImage && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/10 flex flex-col items-center justify-center gap-1.5 text-center">
                        <span className="text-[8px] font-sans font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                          🟢 Pièce jointe prête ({newStoryType === "video" ? "Vidéo" : "Image"})
                        </span>
                        {newStoryType === "video" || newStoryImage.startsWith("data:video/") ? (
                          <video src={newStoryImage} className="max-h-24 rounded-lg object-contain bg-black" muted controls playsInline />
                        ) : (
                          <img src={newStoryImage} referrerPolicy="no-referrer" className="max-h-24 rounded-lg object-contain" alt="Aperçu" />
                        )}
                        <button 
                          type="button"
                          onClick={() => {
                            setNewStoryImage("");
                            setNewStoryType("image");
                          }}
                          className="px-2 py-0.5 bg-rose-600/20 hover:bg-rose-700/30 text-rose-300 rounded font-bold text-[8.5px] uppercase cursor-pointer transition select-none border border-rose-500/10 mt-1"
                        >
                          Retirer la pièce jointe
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* TEXT CAPTION */}
                <div className="space-y-1 text-left">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Légende du statut (en option) 💬 :</label>
                  <input
                    value={newStoryText}
                    onChange={(e) => setNewStoryText(e.target.value)}
                    placeholder="Écrire un message ou laisser vide si non souhaitée"
                    maxLength={120}
                    className="w-full bg-[#0d1410] border border-emerald-950 focus:border-emerald-500 focus:ring-0 rounded-xl py-2 px-3 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden"
                  />
                </div>

                {/* Actions row: Back and Submit */}
                <div className="flex gap-2 pt-1 border-t border-slate-900">
                  <button
                    onClick={() => {
                      setStoryCreationStep("choose");
                      setNewStoryText("");
                    }}
                    className="flex-1 py-1.5 bg-slate-90 border border-slate-800 hover:bg-slate-800 text-zinc-300 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Retour
                  </button>

                  <button
                    onClick={() => {
                      const currentName = user ? `${user.firstName} ${user.lastName}` : "Cultivateur Béninois";
                      
                      if (!newStoryImage) {
                        alert("⚠️ Veuillez d'abord ajouter une photo ou une vidéo pour ce statut !");
                        return;
                      }

                      // Daily limit check of 10 statuses maximum per day
                      const todayMs = Date.now() - 24 * 3600 * 1000;
                      const storiesCountToday = stories.filter(s => s.name === currentName && s.createdAt > todayMs).length;
                      if (storiesCountToday >= 10) {
                        alert("⚠️ Limite quotidienne de statut atteinte ! Une personne a le droit de faire au maximum 10 statuts dans une journée.");
                        return;
                      }

                      // Work out selected value or fallback to "culture"
                      const catValue = (newStoryFormat === "texte" ? "culture" : newStoryFormat) as any;

                      const newStory = {
                        id: `sh-${Date.now()}`,
                        name: currentName,
                        avatarUrl: user?.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2364748b'/><circle cx='12' cy='8.5' r='3.5' fill='%23f1f5f9'/><path d='M6 17c0-2.5 3-4.5 6-4.5s6 2 6 4.5v1.5H6V17z' fill='%23f1f5f9'/></svg>",
                        badge: newStoryType === "video" ? "📹" : "🖼️",
                        image: newStoryImage,
                        text: newStoryText.trim() || "", // Caption is empty or optional as explicitly requested!
                        createdAt: Date.now(),
                        isTextStory: false,
                        mediaType: newStoryType, // store media type (photo vs video)
                        ck: catValue,
                        stats: [
                          { i: "📍", v: user?.commune || "Ouémé", l: "Lieu" }
                        ],
                        rx: [4, 6, 8]
                      };

                      setStories([newStory, ...stories]);
                      setShowAddStoryModal(false);
                      setStoryCreationStep("choose");
                      setNewStoryText("");
                      alert("Votre statut photo/vidéo a été partagé avec succès ! 🖼️✨");
                    }}
                    className="flex-1 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-650 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer text-center active:scale-95 shadow-lg"
                  >
                    Publier Statut
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==================== CASE BRILLANT PUBLICATIONS POPUP CHOICE ==================== */}
      {showPublishPopup && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 font-sans backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase">Créer une Publication</h3>
                <p className="text-[10px] text-emerald-100 font-medium">Choisissez un espace pour ajouter votre annonce</p>
              </div>
              <button onClick={() => setShowPublishPopup(false)} className="text-emerald-100 hover:text-white cursor-pointer font-bold bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            </div>
            <div className="p-6 space-y-3.5">
              <button
                onClick={() => {
                  setActiveTab("market");
                  setAutoOpenPublish("market");
                  setShowPublishPopup(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full p-4 bg-slate-50 hover:bg-emerald-50/25 border border-slate-100 hover:border-emerald-300 rounded-2xl flex items-center gap-3.5 text-left transition cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition shrink-0">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide">🥗 Boutique / MarketPlace</h4>
                  <p className="text-[10.5px] text-slate-450 mt-0.5 leading-snug">Vendre des intrants, légumes récoltés, outils d'agriculture, terrains agricoles ou animaux.</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("solidarite");
                  setAutoOpenPublish("solidarite");
                  setShowPublishPopup(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full p-4 bg-slate-50 hover:bg-emerald-50/25 border border-slate-100 hover:border-emerald-300 rounded-2xl flex items-center gap-3.5 text-left transition cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition shrink-0">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide">🤝 Espace Solidarité</h4>
                  <p className="text-[10.5px] text-slate-450 mt-0.5 leading-snug">Demander ou proposer de l'entraide coopérative, crédit, transport de bétail ou semences.</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("directory");
                  setAutoOpenPublish("directory");
                  setShowPublishPopup(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full p-4 bg-slate-50 hover:bg-emerald-50/25 border border-slate-100 hover:border-emerald-300 rounded-2xl flex items-center gap-3.5 text-left transition cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide">💼 CV &amp; Recrutement Agricole</h4>
                  <p className="text-[10.5px] text-slate-450 mt-0.5 leading-snug">Déposer un CV d'expert agronome, technicien d'élevage ou proposer une offre de stage agricole.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ACTIONS MENU FOR 'MON STATUT' ==================== */}
      {showMyStatusMenu && (
        <div className="fixed inset-0 z-55 bg-black/80 flex items-center justify-center p-4 font-sans backdrop-blur-xs">
          <div className="w-full max-w-xs bg-[#090f0c] border border-emerald-900/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-1.5 font-display">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ecc71] animate-pulse"></span>
              <span>Mon Statut Agri 🇧🇯</span>
            </h3>
            <p className="text-[11px] text-[#8fa094]">Que souhaitez-vous faire avec votre statut ?</p>
            
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => {
                  const currentName = user ? `${user.firstName} ${user.lastName}` : "Cultivateur Béninois";
                  const ownerGroup = getGroupedStories().find(g => 
                    g.name.toLowerCase() === "jean baptiste" || 
                    g.name.toLowerCase() === (user?.firstName || "").toLowerCase() || 
                    g.name === currentName
                  );
                  if (ownerGroup) {
                    setActiveStoryGroupKey(ownerGroup.name);
                    setCurrentStoryItemIndex(0);
                  }
                  setShowMyStatusMenu(false);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#2ecc71] to-emerald-650 font-black text-[11px] uppercase tracking-wider text-black rounded-2xl cursor-pointer hover:shadow-lg active:scale-95 transition"
              >
                👁️ Voir mes publications ({
                  (() => {
                    const currentName = user ? `${user.firstName} ${user.lastName}` : "Cultivateur Béninois";
                    const ownerGroup = getGroupedStories().find(g => 
                      g.name.toLowerCase() === "jean baptiste" || 
                      g.name.toLowerCase() === (user?.firstName || "").toLowerCase() || 
                      g.name === currentName
                    );
                    return ownerGroup ? ownerGroup.items.length : 0;
                  })()
                })
              </button>

              <button
                onClick={() => {
                  setShowAddStoryModal(true);
                  setShowMyStatusMenu(false);
                }}
                className="w-full py-2.5 bg-zinc-900 border border-emerald-950/60 hover:bg-emerald-950/20 text-white font-black text-[11px] uppercase tracking-wider rounded-2xl cursor-pointer transition active:scale-95"
              >
                ➕ Publier un autre statut
              </button>

              <button
                onClick={() => setShowMyStatusMenu(false)}
                className="w-full py-2 text-zinc-500 font-bold text-xs cursor-pointer hover:text-white transition mt-1"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAGGABLE WEATHER BUBBLE */}
      <FloatingWeatherBubble 
        temp={weather?.temp || 28} 
        condition={weather?.condition || "Soleil Brillant"} 
        onClick={() => setShowWeatherModal(true)} 
      />

      {/* ================= BOTTOM WRAPPER: STYLISH BOTTOM NAVIGATION BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 flex flex-col z-40 shadow-[0_-5px_25px_rgba(0,0,0,0.7)]">

        {/* ================= SOUVERAINETÉ SCROLLING TICKER BAR ================= */}
        <div className="bg-[#091b10] border-t border-[#12301c] h-7 flex items-center overflow-hidden relative select-none">
          <div className="bg-[#124d27] text-[#2ecc71] text-[8px] font-black uppercase tracking-widest px-2.5 h-full flex items-center z-10 shrink-0 border-r border-[#12301c] shadow-[2px_0_5px_rgba(0,0,0,0.5)]">
            🇧🇯 SOUVERAINETÉ
          </div>
          <div className="flex-1 overflow-hidden relative flex items-center">
            <div 
              className="animate-marquee whitespace-nowrap flex gap-8 items-center text-[10px] text-emerald-100 font-semibold font-sans"
              style={{ animationDuration: '240s' }}
            >
              {tickerNewsList.map((news: string, idx: number) => (
                <span key={idx} className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-[#2ecc71] rounded-full shrink-0 animate-pulse"></span>
                  {news}
                </span>
              ))}
              {/* Duplicate once for seamless loop */}
              {tickerNewsList.map((news: string, idx: number) => (
                <span key={`dup-${idx}`} className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-[#2ecc71] rounded-full shrink-0 animate-pulse"></span>
                  {news}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= STYLISH MOBILE-FIRST BOTTOM NAVIGATION BAR ================= */}
        <div className="h-14 bg-[#080d14] flex items-center justify-around px-1 relative border-t border-[#131b27]">
          {/* Tab 1: Home/Accueil */}
          <button 
            onClick={handleGoHome}
            className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all duration-155 relative ${
              activeTab === "home" ? "text-emerald-500 font-extrabold" : "text-zinc-500 font-medium hover:text-zinc-300"
            }`}
            title="Accueil"
          >
            <Home className={`h-5 w-5 ${activeTab === "home" ? "text-emerald-500" : "text-zinc-500"}`} />
            {activeTab === "home" && (
              <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Tab 2: Message */}
          <button 
            onClick={() => {
              if (user?.isBlocked) {
                alert("❌ COMPTE BLOQUÉ ! Votre compte membre est actuellement bloqué par l'Administrateur. Vous avez uniquement accès à la page d'accueil de la coopérative.");
                return;
              }
              setActiveTab("agrichat");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all duration-155 relative ${
              activeTab === "agrichat" ? "text-emerald-500 font-extrabold" : "text-zinc-500 font-medium hover:text-zinc-300"
            }`}
            title="Message"
          >
            <div className="relative">
              <MessageSquare className={`h-5 w-5 ${activeTab === "agrichat" ? "text-emerald-500" : "text-zinc-500"}`} />
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[7px] font-black w-3 h-3 rounded-full flex items-center justify-center border border-[#080d14]">
                2
              </span>
            </div>
            {activeTab === "agrichat" && (
              <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Tab 3: Marketplace (ShoppingBag) */}
          <button 
            onClick={() => {
              if (user?.isBlocked) {
                alert("❌ COMPTE BLOQUÉ ! Votre compte membre est actuellement bloqué par l'Administrateur. Vous avez uniquement accès à la page d'accueil de la coopérative.");
                return;
              }
              setActiveTab("market");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all duration-155 relative ${
              activeTab === "market" ? "text-emerald-500 font-extrabold" : "text-zinc-500 font-medium hover:text-zinc-300"
            }`}
            title="Marketplace"
          >
            <ShoppingBag className={`h-5 w-5 ${activeTab === "market" ? "text-emerald-500" : "text-zinc-500"}`} />
            {activeTab === "market" && (
              <span className="absolute bottom-1 w-1.5 w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Tab 4: Solidarité */}
          <button 
            onClick={() => {
              if (user?.isBlocked) {
                alert("❌ COMPTE BLOQUÉ ! Votre compte membre est actuellement bloqué par l'Administrateur. Vous avez uniquement accès à la page d'accueil de la coopérative.");
                return;
              }
              setActiveTab("solidarite");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all duration-155 relative ${
              activeTab === "solidarite" ? "text-emerald-500 font-extrabold" : "text-zinc-500 font-medium hover:text-zinc-300"
            }`}
            title="Solidarité"
          >
            <HeartHandshake className={`h-5 w-5 ${activeTab === "solidarite" ? "text-emerald-500" : "text-zinc-500"}`} />
            {activeTab === "solidarite" && (
              <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Tab 5: Recrutement & CV */}
          <button 
            onClick={() => {
              if (user?.isBlocked) {
                alert("❌ COMPTE BLOQUÉ ! Votre compte membre est actuellement bloqué par l'Administrateur. Vous avez uniquement accès à la page d'accueil de la coopérative.");
                return;
              }
              setActiveTab("directory");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all duration-155 relative ${
              activeTab === "directory" ? "text-emerald-500 font-extrabold" : "text-zinc-500 font-medium hover:text-zinc-300"
            }`}
            title="CV & Recrutement agricole"
          >
            <Users className={`h-5 w-5 ${activeTab === "directory" ? "text-emerald-500" : "text-zinc-500"}`} />
            {activeTab === "directory" && (
              <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* ══ DRAWER OVERLAY & SIDEPANEL ══ */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => {
              setDrawerOpen(false);
              setActiveTab("home");
            }}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 transition-opacity duration-300"
          />
          {/* Drawer container */}
          <div 
            className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[300px] bg-[#0e1811] z-[100] flex flex-col border-r border-[#27ae60]/30 shadow-[0_0_24px_rgba(0,0,0,0.85)] animate-slide-in-left overflow-hidden font-sans text-left"
            style={{
              boxShadow: "0 0 30px #061a0e",
            }}
          >
            {/* Visual light gradient trace */}
            <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#2ecc71] to-transparent opacity-45 pointer-events-none" />

            {/* Profile context top block */}
            <div className="p-6 pb-4.5 bg-gradient-to-br from-[#061a0e] to-[#0c2412] relative overflow-hidden shrink-0">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#2ecc71]/5 pointer-events-none" />
              <div className="absolute -bottom-8 left-6 w-24 h-24 rounded-full bg-[#2ecc71]/3 pointer-events-none" />
              
              <div className="flex items-center gap-3.5 relative z-10 text-left">
                {/* Custom Avatar container */}
                <div 
                  onClick={() => {
                    setActiveTab("premium");
                    setDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-13.5 h-13.5 rounded-2xl bg-gradient-to-tr from-[#1a6030] to-[#2ecc71] border-2 border-[#2ecc71]/40 flex items-center justify-center font-mono text-2xl font-bold text-white shadow-[0_4px_18px_rgba(46,204,113,0.2)] shrink-0 cursor-pointer overflow-hidden"
                >
                  {user?.avatarUrl ? (
                    <img referrerPolicy="no-referrer" src={user.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-850 text-slate-300 relative">
                      <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="absolute inset-x-0 bottom-0 bg-[#0f1d13]/90 py-0.5 text-center leading-none">
                        <span className="text-[6.5px] text-emerald-300 font-black uppercase tracking-tighter">PROFIL</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="leading-tight text-left">
                  <h4 className="font-sora font-extrabold text-[15px] text-white tracking-wide">
                    {user?.firstName ? `${user.firstName} ${user.lastName ? user.lastName.substring(0, 1) + '.' : ''}` : "Jean-Baptiste Z."}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-semibold mt-0.5 font-mono">
                    @{user?.username || "Jbz001"} · Fermier Bénin
                  </p>
                  <span className="inline-flex items-center gap-1 bg-[#f0b429]/15 border border-[#f0b429]/35 rounded-full px-2.5 py-0.5 mt-1.5 font-sora font-extrabold text-[9px] text-[#f0b429] tracking-wider select-none leading-none">
                    👑 PREMIUM ACTIF
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation options list conforms to design criteria */}
            <nav className="flex-1 overflow-y-auto py-2.5 space-y-0.5 scrollbar-hide text-left">
              <div className="text-[9.5px] font-extrabold text-[#56745e] uppercase tracking-widest px-5 py-3 select-none">
                Mon espace
              </div>

              {/* STATUTS Option */}
              <div 
                onClick={() => {
                  setDrawerOpen(false);
                  setShowSscPanel(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group flex items-center gap-3.5 px-5 py-3 hover:bg-[#2ecc71]/5 active:bg-[#2ecc71]/10 transition relative cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2ecc71] scale-y-0 group-hover:scale-y-100 transition duration-150 rounded-r" />
                <div className="w-10 h-10 rounded-xl bg-[#2ecc71]/10 text-[#2ecc71] flex items-center justify-center text-lg shrink-0 group-hover:scale-108 transition duration-150 shadow-inner">
                  ✨
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sora font-bold text-[13.5px] text-white">Statuts</div>
                  <div className="text-[10.5px] text-[#56745e] font-semibold leading-tight mt-0.5 truncate">Activité de votre réseau agri</div>
                </div>
                <span className="bg-[#2ecc71] text-black font-sora font-extrabold text-[9px] px-2 py-0.5 rounded-full min-w-[18px] text-center select-none shadow-sm leading-none shrink-0 border border-emerald-400">
                  7
                </span>
                <span className="text-[#243428] font-black text-sm pl-1 group-hover:text-[#2ecc71] group-hover:translate-x-1 transition shrink-0 select-none">
                  ›
                </span>
              </div>

              {/* VULGARISATION Option */}
              <div 
                onClick={() => {
                  setDrawerOpen(false);
                  setActiveTab("videos");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group flex items-center gap-3.5 px-5 py-3 hover:bg-[#2ecc71]/5 active:bg-[#2ecc71]/10 transition relative cursor-pointer font-sans"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#f1c40f] scale-y-0 group-hover:scale-y-100 transition duration-150 rounded-r" />
                <div className="w-10 h-10 rounded-xl bg-[#f1c40f]/10 text-[#f1c40f] flex items-center justify-center text-lg shrink-0 group-hover:scale-108 transition duration-150 shadow-inner">
                  🎬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sora font-bold text-[13.5px] text-white">Vidéo Innovation</div>
                  <div className="text-[10.5px] text-[#56745e] font-semibold leading-tight mt-0.5 truncate">Vulgarisation par vidéo</div>
                </div>
                <span className="bg-[#f1c40f]/10 text-[#f1c40f] border border-[#f1c40f]/30 font-sora font-extrabold text-[9px] px-2 py-0.5 rounded-full select-none leading-none shrink-0 font-black">
                  NEW
                </span>
                <span className="text-[#243428] font-black text-sm pl-1 group-hover:text-[#2ecc71] group-hover:translate-x-1 transition shrink-0 select-none">
                  ›
                </span>
              </div>

              {/* ABONNEMENT Option */}
              <div 
                onClick={() => {
                  setDrawerOpen(false);
                  setActiveTab("premium");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group flex items-center gap-3.5 px-5 py-3 hover:bg-[#2ecc71]/5 active:bg-[#2ecc71]/10 transition relative cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2ecc71] scale-y-0 group-hover:scale-y-100 transition duration-150 rounded-r" />
                <div className="w-10 h-10 rounded-xl bg-[#f0b429]/10 text-[#f0b429] flex items-center justify-center text-lg shrink-0 group-hover:scale-108 transition duration-150 shadow-inner">
                  👑
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sora font-bold text-[13.5px] text-white">Abonnement</div>
                  <div className="text-[10.5px] text-[#56745e] font-semibold leading-tight mt-0.5 truncate">Gérer votre plan Premium</div>
                </div>
                <span className="bg-[#f0b429] text-black font-sora font-extrabold text-[9px] px-2.5 py-0.5 rounded-lg select-none shadow-sm leading-none shrink-0 font-black tracking-wider">
                  PRO
                </span>
                <span className="text-[#243428] font-black text-sm pl-1 group-hover:text-[#2ecc71] group-hover:translate-x-1 transition shrink-0 select-none">
                  ›
                </span>
              </div>

              {/* AVIS Option */}
              <div 
                onClick={() => {
                  setDrawerOpen(false);
                  setActiveTab("market");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => {
                    alert("⭐ Consultez et évaluez vos agro-confrères ainsi que les vendeurs sur la MarketPlace !");
                  }, 400);
                }}
                className="group flex items-center gap-3.5 px-5 py-3 hover:bg-[#2ecc71]/5 active:bg-[#2ecc71]/10 transition relative cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2ecc71] scale-y-0 group-hover:scale-y-100 transition duration-150 rounded-r" />
                <div className="w-10 h-10 rounded-xl bg-[#2ecc71]/10 text-yellow-500 flex items-center justify-center text-lg shrink-0 group-hover:scale-108 transition duration-150 shadow-inner">
                  ⭐
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sora font-bold text-[13.5px] text-white">Avis</div>
                  <div className="text-[10.5px] text-[#56745e] font-semibold leading-tight mt-0.5 truncate">Évaluer vendeurs & marchés</div>
                </div>
                <span className="bg-[#e74c3c] text-white font-sora font-extrabold text-[9px] px-2 py-0.5 rounded-full min-w-[18px] text-center select-none shadow-sm leading-none shrink-0">
                  3
                </span>
                <span className="text-[#243428] font-black text-sm pl-1 group-hover:text-[#2ecc71] group-hover:translate-x-1 transition shrink-0 select-none">
                  ›
                </span>
              </div>

              <div className="h-[1px] bg-emerald-800/20 my-2.5 mx-4" />

              <div className="text-[9.5px] font-extrabold text-[#56745e] uppercase tracking-widest px-5 py-2 select-none">
                Support
              </div>

              {/* GUIDE & ASSISTANCE Option */}
              <div 
                onClick={() => {
                  setDrawerOpen(false);
                  setActiveTab("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group flex items-center gap-3.5 px-5 py-3 hover:bg-[#2ecc71]/5 active:bg-[#2ecc71]/10 transition relative cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2ecc71] scale-y-0 group-hover:scale-y-100 transition duration-150 rounded-r" />
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg shrink-0 group-hover:scale-108 transition duration-150 shadow-inner">
                  ❓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sora font-bold text-[13.5px] text-white">Guide & Assistance</div>
                  <div className="text-[10.5px] text-[#56745e] font-semibold leading-tight mt-0.5 truncate">FAQ, tutoriels & assistance support</div>
                </div>
                <span className="text-[#243428] font-black text-sm pl-1 group-hover:text-[#2ecc71] group-hover:translate-x-1 transition shrink-0 select-none">
                  ›
                </span>
              </div>

              {/* INSTALLATION MOBILE Option */}
              <div 
                onClick={() => {
                  setDrawerOpen(false);
                  setShowPwaModal(true);
                }}
                className="group flex items-center gap-3.5 px-5 py-3 hover:bg-[#2ecc71]/5 active:bg-[#2ecc71]/10 transition relative cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2ecc71] scale-y-0 group-hover:scale-y-100 transition duration-150 rounded-r" />
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg shrink-0 group-hover:scale-108 transition duration-150 shadow-inner">
                  📱
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sora font-bold text-[13.5px] text-white">Installer l'App</div>
                  <div className="text-[10.5px] text-emerald-500 font-semibold leading-tight mt-0.5 truncate">Installer sur votre portable</div>
                </div>
                <span className="bg-[#2ecc71]/15 text-[#2ece76] border border-[#2ecc71]/35 font-sora font-extrabold text-[9px] px-2.5 py-0.5 rounded-lg select-none leading-none shrink-0 font-black animate-pulse uppercase tracking-wider">
                  FACILE
                </span>
                <span className="text-[#243428] font-black text-sm pl-1 group-hover:text-[#2ecc71] group-hover:translate-x-1 transition shrink-0 select-none">
                  ›
                </span>
              </div>

              {/* ADMIN SYSTEM CONTROL Option */}
              {isUserJbz && (
                <div 
                  onClick={() => {
                    setDrawerOpen(false);
                    setActiveTab("admin");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group flex items-center gap-3.5 px-5 py-3 hover:bg-yellow-500/5 active:bg-yellow-500/10 transition relative cursor-pointer"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-500 scale-y-0 group-hover:scale-y-100 transition duration-150 rounded-r" />
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-lg shrink-0 group-hover:scale-108 transition duration-150 shadow-inner animate-pulse">
                    🛡️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sora font-bold text-[13.5px] text-yellow-400">Section Contrôle</div>
                    <div className="text-[10.5px] text-yellow-500/70 font-semibold leading-tight mt-0.5 truncate">Gérer les membres &amp; premium</div>
                  </div>
                  <span className="bg-yellow-600 font-bold font-sora text-white text-[9px] px-2 py-0.5 rounded-lg select-none leading-none shrink-0 border border-yellow-400 uppercase tracking-widest animate-pulse">
                    ADMIN
                  </span>
                  <span className="text-[#243428] font-black text-sm pl-1 group-hover:text-yellow-500 group-hover:translate-x-1 transition shrink-0 select-none">
                    ›
                  </span>
                </div>
              )}

              <div className="h-[1px] bg-emerald-800/20 my-2.5 mx-4" />

              {/* DECONNEXION Option (Danger layout) */}
              <div 
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="group flex items-center gap-3.5 px-5 py-3 hover:bg-[#e74c3c]/5 active:bg-[#e74c3c]/10 transition relative cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e74c3c] scale-y-0 group-hover:scale-y-100 transition duration-150 rounded-r" />
                <div className="w-10 h-10 rounded-xl bg-[#e74c3c]/10 text-[#e74c3c] flex items-center justify-center text-lg shrink-0 group-hover:scale-108 transition duration-150 shadow-inner">
                  🚪
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sora font-bold text-[13.5px] text-red-300 group-hover:text-[#e74c3c] transition">Déconnexion</div>
                  <div className="text-[10.5px] text-zinc-500 font-semibold leading-tight mt-0.5 truncate">Quitter votre session</div>
                </div>
                <span className="text-[#e74c3c] font-black text-sm pl-1 group-hover:translate-x-1 transition shrink-0 select-none">
                  ›
                </span>
              </div>

            </nav>

            {/* Bottom footnote */}
            <div className="p-5 border-t border-emerald-800/20 shrink-0 select-none bg-[#090f0b]">
              <div className="flex items-center justify-between text-[11px] text-[#243428] font-semibold">
                <span>AgriBot v2.4 · Portail Bénin</span>
                <span className="text-[#2ecc71] font-bold cursor-pointer hover:underline" onClick={() => { setShowPolicyModal(true); setDrawerOpen(false); }}>
                  Politique & CGU
                </span>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ══ PANEL OVERLAY FOR "STATUTS AGRI" ══ */}
      {showSscPanel && (
        <div className="fixed inset-0 bg-[#060a08] z-[90] flex flex-col font-sans text-left overflow-hidden">
          {/* Header row */}
          <div className="h-[62px] px-4 border-b border-[#27ae60]/15 bg-[#0c1410] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setShowSscPanel(false);
                  setDrawerOpen(true);
                }}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/5 rounded-full text-white cursor-pointer"
                title="Retour"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="font-sora font-extrabold text-[18px] text-white tracking-wide">
                Statuts Agri
              </h1>
            </div>
            <button 
              onClick={() => {
                setShowAddStoryModal(true);
              }}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/5 rounded-full text-white cursor-pointer"
              title="Ajouter un statut"
            >
              <span className="text-xl">📷</span>
            </button>
          </div>

          {/* Stories Horizontal Row with Ring Layout */}
          <div className="p-4 bg-[#080d09] border-b border-[#27ae60]/8 flex gap-4 overflow-x-auto scrollbar-hide shrink-0 select-none">
            {/* Added status button */}
            <div 
              onClick={() => setShowAddStoryModal(true)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer text-center group"
            >
              <div className="w-13 h-13 rounded-full border-2 border-dashed border-[#2ecc71] flex items-center justify-center bg-[#0d140f] text-[#2ecc71] hover:text-white hover:bg-[#2ecc71]/10 transition relative">
                <span className="text-2xl font-black">+</span>
                {/* Visual green overlay dot */}
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#2ecc71] border border-[#060a08] flex items-center justify-center text-[10px] text-black font-extrabold">+</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-bold max-w-[56px] truncate">Mon statut</span>
            </div>

            {/* Loop through actual grouped story items */}
            {getGroupedStories().map(group => {
              const isOwner = group.name.toLowerCase() === "jean baptiste" || group.name.toLowerCase() === (user?.firstName || "").toLowerCase();
              if (isOwner) return null; // already managed by "Mon statut"

              // Customize visual ring color logic
              const isUnseen = !seenGroupNames.includes(group.name);
              const ringStyle = isUnseen 
                ? "bg-gradient-to-tr from-[#2ecc71] via-emerald-400 to-[#0e4b25] p-[2.5px]" 
                : "bg-zinc-805 p-[1.5px] border border-zinc-800";

              return (
                <div 
                  key={group.name} 
                  onClick={() => {
                    setActiveStoryGroupKey(group.name);
                    setCurrentStoryItemIndex(0);
                  }}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div className={`w-13 h-13 rounded-full ${ringStyle} shadow-md relative group-hover:scale-105 transition duration-155`}>
                    <img 
                      referrerPolicy="no-referrer"
                      src={group.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2364748b'/><circle cx='12' cy='8.5' r='3.5' fill='%23f1f5f9'/><path d='M6 17c0-2.5 3-4.5 6-4.5s6 2 6 4.5v1.5H6V17z' fill='%23f1f5f9'/></svg>"} 
                      className="w-full h-full rounded-full object-cover border-2 border-[#060a08]" 
                      alt={group.name} 
                    />
                    
                    {group.items.length > 1 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#060a08] text-[#2ecc71] text-[8px] font-black font-mono w-4 h-4 rounded-full flex items-center justify-center border border-[#27ae60]/30 shadow-sm leading-none">
                        {group.items.length}
                      </span>
                    )}
                  </div>
                  <span className="text-[10.5px] text-zinc-300 font-bold truncate max-w-[56px] text-center group-hover:text-white transition">
                    {group.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Status List Feed scrolls beautifully */}
          <div className="flex-1 overflow-y-auto bg-[#060a08] p-4 space-y-4 scrollbar-hide pb-20">
            {/* Filtered story groups */}
            {(() => {
              const grouped = getGroupedStories();
              
              const filterStoryByCat = (g: any) => {
                if (selectedSscCategory === "Tout") return true;
                const catMap: { [key: string]: string } = {
                  Culture: "culture",
                  Élevage: "elevage",
                  Marché: "marche",
                  Météo: "meteo",
                  Irrigation: "irrigation",
                  Finances: "finance",
                  "AgriBot IA": "agribot"
                };
                const expectedCk = catMap[selectedSscCategory];
                return g.items.some((item: any) => item.ck === expectedCk);
              };

              // Reorder or segment into Recents vs Seen
              const recents = grouped.filter(g => !seenGroupNames.includes(g.name) && filterStoryByCat(g));
              const m_seen = grouped.filter(g => seenGroupNames.includes(g.name) && filterStoryByCat(g));

              return (
                <>
                  {/* RECENTS BLOCK */}
                  {recents.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-[10.5px] font-black uppercase tracking-wider text-[#56745e]">
                        RÉCENTS
                      </div>
                      <div className="space-y-2.5">
                        {recents.map(g => {
                          const lastItem = g.items[g.items.length - 1];
                          const isBot = g.name.toLowerCase().includes("agribot") || g.name.toLowerCase().includes("ia");
                          
                          // Determine dynamic subtitle tags
                          const tags: { [key: string]: { label: string; style: string } } = {
                            culture: { label: "🌱 Culture", style: "bg-[#2ecc71]/12 text-[#2ecc71] border border-[#2ecc71]/25" },
                            elevage: { label: "🐔 Élevage", style: "bg-amber-500/12 text-amber-500 border border-amber-500/25" },
                            marche: { label: "💰 Marché", style: "bg-yellow-400/12 text-yellow-500 border border-yellow-400/25" },
                            meteo: { label: "☀️ Météo", style: "bg-orange-400/12 text-orange-400 border border-orange-400/25" },
                            irrigation: { label: "💧 Irrigation", style: "bg-[#3498db]/12 text-[#3498db] border border-[#3498db]/25" },
                            finance: { label: "🏦 Finances", style: "bg-[#9b59b6]/12 text-[#9b59b6] border border-[#9b59b6]/25" },
                            agribot: { label: "🤖 AgriBot IA", style: "bg-teal-500/12 text-teal-400 border border-teal-500/25" }
                          };
                          const activeTag = tags[lastItem.ck || "culture"] || tags.culture;

                          return (
                            <div 
                              key={g.name}
                              onClick={() => {
                                setActiveStoryGroupKey(g.name);
                                setCurrentStoryItemIndex(0);
                              }}
                              className="bg-[#0e1611]/80 hover:bg-[#132017] border border-[#27ae60]/12 px-4 py-3.5 rounded-2xl flex items-center justify-between gap-3 active:scale-[0.99] transition duration-150 cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#2ecc71] to-emerald-400 shrink-0 relative">
                                  <img 
                                    referrerPolicy="no-referrer"
                                    src={g.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2364748b'/><circle cx='12' cy='8.5' r='3.5' fill='%23f1f5f9'/><path d='M6 17c0-2.5 3-4.5 6-4.5s6 2 6 4.5v1.5H6V17z' fill='%23f1f5f9'/></svg>"} 
                                    className="w-full h-full rounded-full object-cover border border-[#060a08]" 
                                    alt={g.name} 
                                  />
                                </div>
                                <div className="leading-tight min-w-0 text-left">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-sora font-extrabold text-[14px] text-white tracking-wide truncate">
                                      {g.name}
                                    </h4>
                                    <span className={`px-2 py-[1.5px] rounded-lg text-[9px] font-black tracking-wider uppercase inline-block font-sans ${activeTag.style}`}>
                                      {activeTag.label}
                                    </span>
                                  </div>
                                  <p className="text-[11.5px] text-zinc-300 font-semibold leading-normal mt-1.5 truncate pr-1">
                                    {isBot ? "🌿 " : ""}{lastItem.text || lastItem.sb || "Consultation active..."}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5 text-[9.5px] text-[#56745e] font-sans">
                                    <span className="font-bold">il y a 15 min</span>
                                    {lastItem.stats && lastItem.stats[0] && (
                                      <>
                                        <span>•</span>
                                        <span className="font-extrabold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 shrink-0">
                                          {lastItem.stats[0].i} {lastItem.stats[0].v}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0 select-none">
                                {g.items.length > 1 && (
                                  <span className="bg-[#2ecc71]/15 text-[#2ecc71] px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest leading-none border border-[#2ecc71]/25 shrink-0">
                                    {g.items.length} STATUTS
                                  </span>
                                )}
                                <span className="w-2.5 h-2.5 rounded-full bg-[#2ecc71] animate-pulse shrink-0" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* VUS BLOCK */}
                  {m_seen.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-[10.5px] font-black uppercase tracking-wider text-[#56745e]">
                        VUS
                      </div>
                      <div className="space-y-2.5">
                        {m_seen.map(g => {
                          const lastItem = g.items[g.items.length - 1];
                          const tags: { [key: string]: { label: string; style: string } } = {
                            culture: { label: "🌱 Culture", style: "bg-zinc-805/10 text-zinc-400 border border-zinc-805" },
                            elevage: { label: "🐔 Élevage", style: "bg-zinc-805/10 text-zinc-400 border border-zinc-805" },
                            marche: { label: "💰 Marché", style: "bg-zinc-805/10 text-zinc-400 border border-zinc-805" },
                            meteo: { label: "☀️ Météo", style: "bg-zinc-805/10 text-zinc-400 border border-zinc-805" },
                            irrigation: { label: "💧 Irrigation", style: "bg-zinc-805/10 text-zinc-400 border border-zinc-805" },
                            finance: { label: "🏦 Finances", style: "bg-zinc-805/10 text-zinc-400 border border-zinc-805" },
                            agribot: { label: "🤖 AgriBot IA", style: "bg-zinc-805/10 text-zinc-400 border border-zinc-805" }
                          };
                          const activeTag = tags[lastItem.ck || "culture"] || tags.culture;

                          return (
                            <div 
                              key={g.name}
                              onClick={() => {
                                setActiveStoryGroupKey(g.name);
                                setCurrentStoryItemIndex(0);
                              }}
                              className="bg-[#0b100d]/60 hover:bg-[#0f1611] border border-zinc-900 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 active:scale-[0.99] transition duration-150 cursor-pointer text-left opacity-60"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-11 h-11 rounded-full p-[1px] bg-zinc-850 shrink-0 relative">
                                  <img 
                                    referrerPolicy="no-referrer"
                                    src={g.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2364748b'/><circle cx='12' cy='8.5' r='3.5' fill='%23f1f5f9'/><path d='M6 17c0-2.5 3-4.5 6-4.5s6 2 6 4.5v1.5H6V17z' fill='%23f1f5f9'/></svg>"} 
                                    className="w-full h-full rounded-full object-cover border border-[#060a08]" 
                                    alt={g.name} 
                                  />
                                </div>
                                <div className="leading-tight min-w-0 text-left">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-sora font-medium text-[13.5px] text-zinc-400 truncate">
                                      {g.name}
                                    </h4>
                                    <span className={`px-2 py-[1px] rounded-md text-[8px] font-bold tracking-wider uppercase inline-block font-sans ${activeTag.style}`}>
                                      {activeTag.label}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-500 leading-normal mt-1 truncate pr-1">
                                    {lastItem.text || lastItem.sb || "Consulté"}
                                  </p>
                                  <p className="text-[9px] text-zinc-650 font-semibold mt-1 font-sans">
                                    il y a 3h
                                  </p>
                                </div>
                              </div>
                              <span className="text-[9px] text-[#56745e] font-sans font-extrabold select-none">
                                VU
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {recents.length === 0 && m_seen.length === 0 && (
                    <div className="py-20 text-center space-y-3 select-none">
                      <span className="text-4xl filter drop-shadow">🌾</span>
                      <p className="text-[#56745e] text-xs font-semibold">Aucun statut disponible dans cette catégorie</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Quick action bottom back button bar */}
          <div className="p-4 border-t border-[#27ae60]/10 bg-[#0c1410] flex justify-center shrink-0">
            <button
              onClick={() => {
                setShowSscPanel(false);
                setDrawerOpen(true);
              }}
              className="w-full max-w-sm py-3 bg-[#2ecc71] hover:bg-emerald-500 active:scale-95 text-black font-sora font-extrabold uppercase tracking-widest text-[12px] rounded-xl transition cursor-pointer shadow-md select-none"
            >
              Fermer les Statuts
            </button>
          </div>
        </div>
      )}

      {/* ══ POLICY & CGU MODAL DIALOG ══ */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="w-full max-w-2xl bg-[#0a110c] border-2 border-[#27ae60]/30 rounded-3xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.9)] text-zinc-100 flex flex-col font-sans max-h-[90vh] text-left"
            style={{
              boxShadow: "0 0 40px rgba(46,204,113,0.15)"
            }}
          >
            {/* Header */}
            <div className="p-5 border-b border-[#27ae60]/15 bg-[#0e1b12] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🛡️</span>
                <div className="text-left leading-none">
                  <h3 className="font-sora font-extrabold text-[15.5px] text-white uppercase tracking-wider">
                    Politique & CGU
                  </h3>
                  <span className="text-[9.5px] font-bold text-[#2ecc71] mt-0.5 block">Souveraineté des données agricoles · Bénin</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="w-8 h-8 rounded-full bg-[#112417] hover:bg-red-500/10 hover:text-red-400 text-zinc-400 flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Policy Content inside */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[12.5px] text-zinc-300 scrollbar-hide">
              <div className="p-4 bg-[#2ecc71]/5 border border-[#2ecc71]/20 rounded-2xl select-none leading-none flex items-center gap-3">
                <span className="text-3xl">🫱🏾‍🫲🏽</span>
                <div className="leading-tight text-left">
                  <h4 className="font-sora font-extrabold text-[#2ecc71] text-xs">Engagement d’Honneur</h4>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mt-1">Plateforme souveraine au service de l'autonomie et de l'essor durable des fermiers béninois.</p>
                </div>
              </div>

              {/* Policy Sections */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-sora font-bold text-white text-[13px] tracking-wide flex items-center gap-1.5">
                    <span>1.</span> Propriété agronomique & Responsabilités
                  </h4>
                  <p className="leading-relaxed font-normal">
                    L'application <strong>AgriBot</strong> et l'ensemble de ses guides sont dirigés et conseillés par l'Agro-vulgarisateur d'Etat formé du prestigieux <strong>Centre Songhaï</strong> de Porto-Novo. L'intégralité des données d'aide décisionnelle et phytosanitaire est rédigée conformément aux écosystèmes climatiques tropicaux réels du Bénin.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-sora font-bold text-white text-[13px] tracking-wide flex items-center gap-1.5">
                    <span>2.</span> Collecte, Traitement & Confidentialité
                  </h4>
                  <p className="leading-relaxed font-normal">
                    La sauvegarde et la collecte des coordonnées, images de cultures, avis et statistiques de ventes s'effectuent de façon souveraine, dans l'unique objectif de nourrir nos modèles de prévision agricole locaux et d'actualiser la bourse des prix nationaux. <strong>Aucune de vos données privées ne sera vendue à des tiers ou des intermédiaires commerciaux extérieurs.</strong>
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-sora font-bold text-white text-[13px] tracking-wide flex items-center gap-1.5">
                    <span>3.</span> Conditions Générales d’Utilisation (CGU)
                  </h4>
                  <p className="leading-relaxed font-normal text-zinc-350">
                    Les utilisateurs s'engagent à publier des annonces authentiques conformes à la réalité. Les escroqueries, usurpations d'identité professionnelle, ou comportements abusifs entraîneront l'exclusion immédiate de la plateforme. Un système d’avis certifiés régule les interactions sur la MarketPlace.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-sora font-bold text-white text-[13px] tracking-wide flex items-center gap-1.5">
                    <span>4.</span> Support & Ligne Directrice du Souverain
                  </h4>
                  <p className="leading-relaxed font-normal">
                    Si vous rencontrez des dysfonctionnements, souhaitez valider ou mettre à niveau un plan Premium, ou souhaitez déposer une réclamation communautaire, vous pouvez directement écrire à l'administration de la Plateforme par courriel à l'adresse officielle : <a href="mailto:administrateur@agribot-africa.com" className="text-[#2ecc71] hover:underline font-bold font-mono">administrateur@agribot-africa.com</a>.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27ae60]/10 text-center text-xs text-zinc-500 font-medium font-sans">
                © {new Date().getFullYear()} AgriBot Bénin · Tous droits réservés.
              </div>
            </div>

            {/* Bottom Actions button */}
            <div className="p-4 border-t border-[#27ae60]/15 bg-[#0a110c] text-center shrink-0">
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="w-full py-2.5 bg-[#2ecc71] hover:bg-emerald-500 text-black font-sora font-extrabold text-[12px] uppercase tracking-widest rounded-xl transition cursor-pointer select-none"
              >
                J’ai compris & J'accepte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ PWA APP INSTALLATION GUIDE MODAL ══ */}
      {showPwaModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="w-full max-w-md bg-[#0a110d] border-2 border-[#2ecc71]/40 rounded-3xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.95)] text-zinc-100 flex flex-col font-sans max-h-[92vh] text-left"
            style={{
              boxShadow: "0 0 35px rgba(46,204,113,0.18)"
            }}
          >
            {/* Header */}
            <div className="p-5 border-b border-[#2ecc71]/15 bg-[#0e1c12] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div className="text-left leading-none">
                  <h3 className="font-sora font-extrabold text-[15.5px] text-white uppercase tracking-wider">
                    Installer l'Application
                  </h3>
                  <span className="text-[9.5px] font-bold text-emerald-400 mt-0.5 block">Disponible sur Android & iPhone</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPwaModal(false)}
                className="w-8 h-8 rounded-full bg-[#112417] hover:bg-red-500/10 hover:text-red-400 text-zinc-400 flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-zinc-300 scrollbar-hide">
              {/* Brand introduction */}
              <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 font-sans">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 p-[1.5px] flex items-center justify-center shrink-0 border border-emerald-500/30 overflow-hidden">
                  <img src="/logo_agribot.png" alt="Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                </div>
                <div className="leading-tight text-left">
                  <h4 className="font-sora font-bold text-white text-[12.5px]">AgriBot Mine d'Or</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">Installez cette application web progressive (PWA) pour une expérience fluide et instantanée sur votre smartphone d'une valeur inestimable !</p>
                </div>
              </div>

              {/* Native automatic trigger (For supported Chrome Android) */}
              {!!deferredPrompt && (
                <div className="p-3 bg-gradient-to-r from-emerald-900/30 to-emerald-950/40 border border-[#2ecc71]/40 rounded-xl flex items-center justify-between gap-3 text-left">
                  <div className="leading-tight">
                    <p className="font-bold text-emerald-400 font-sans">⚡ Installation instantanée !</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-sans">Votre navigateur supporte l'installation automatique.</p>
                  </div>
                  <button
                    onClick={handleInstallPlatform}
                    className="shrink-0 px-4 py-2 bg-[#2ecc71] hover:bg-emerald-400 text-black font-black uppercase text-[10px] tracking-wider rounded-xl cursor-pointer transition active:scale-95 shadow-lg shadow-emerald-500/10 font-sora font-extrabold"
                  >
                    INSTALLER
                  </button>
                </div>
              )}

              {/* OS Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950/60 rounded-xl border border-zinc-900">
                <button
                  onClick={() => setPwaIntroTab("android")}
                  className={`py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] ${
                    pwaIntroTab === "android" 
                      ? "bg-emerald-600 text-white shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span>🤖</span>
                  <span>SUR ANDROID (Chrome)</span>
                </button>
                <button
                  onClick={() => setPwaIntroTab("ios")}
                  className={`py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] ${
                    pwaIntroTab === "ios" 
                      ? "bg-emerald-600 text-white shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span>🍏</span>
                  <span>SUR IPHONE (Safari)</span>
                </button>
              </div>

              {/* Guides */}
              <div className="space-y-3 bg-[#060e0a] border border-emerald-950/40 rounded-2xl p-4">
                {pwaIntroTab === "android" ? (
                  <div className="space-y-3 text-left font-sans">
                    <p className="font-bold text-emerald-400 uppercase tracking-wide text-[10.5px] border-b border-emerald-900/40 pb-1.5 flex items-center gap-1">
                      <span>🤖</span> Guide d'installation sur Android (Google Chrome / Opera) :
                    </p>
                    
                    <div className="space-y-3.5 mt-2">
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 font-mono text-[10.5px]">1</span>
                        <p className="leading-relaxed mt-0.5">
                          Ouvrez l'application dans votre navigateur mobile <strong>Google Chrome</strong> ou <strong>Opera</strong>.
                        </p>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 font-mono text-[10.5px]">2</span>
                        <p className="leading-relaxed mt-0.5">
                          Appuyez sur le bouton de menu du navigateur situé en haut à droite représenté par les <strong>trois points verticaux (⋮)</strong>.
                        </p>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 font-mono text-[10.5px]">3</span>
                        <p className="leading-relaxed mt-0.5">
                          Faites défiler le menu vers le bas et appuyez sur l'option <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>.
                        </p>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 font-mono text-[10.5px]">4</span>
                        <p className="leading-relaxed mt-0.5">
                          Validez en appuyant sur <strong>"Installer"</strong>. L'icône officielle d'AgriBot Mine d'Or apparaîtra instantanément parmi vos applications sur votre portable !
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-left font-sans">
                    <p className="font-bold text-emerald-400 uppercase tracking-wide text-[10.5px] border-b border-emerald-900/40 pb-1.5 flex items-center gap-1">
                      <span>🍏</span> Guide d'installation sur iPhone (Safari) :
                    </p>
                    
                    <div className="space-y-3.5 mt-2">
                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 font-mono text-[10.5px]">1</span>
                        <p className="leading-relaxed mt-0.5">
                          Lancez l'application dans le navigateur par défaut de votre iPhone : <strong>Safari</strong>.
                        </p>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 font-mono text-[10.5px]">2</span>
                        <p className="leading-relaxed mt-0.5">
                          Appuyez sur le bouton officiel de **Partager** représenté par une flèche sortant d'un carré <span className="bg-emerald-900/40 text-[#2ece76] font-bold px-1.5 py-0.5 rounded text-[10px] inline-flex items-center">📥 Partager</span> situé au milieu en bas de votre écran.
                        </p>
                      </div>

                      <div className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 font-mono text-[10.5px]">3</span>
                        <p className="leading-relaxed mt-0.5">
                          Faites défiler la liste vers le bas et appuyez sur l'option <strong>"Sur l'écran d'accueil" ➕</strong>.
                        </p>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 font-mono text-[10.5px]">4</span>
                        <p className="leading-relaxed mt-0.5">
                          Appuyez ensuite sur <strong>"Ajouter"</strong> en haut à droite. Félicitations, AgriBot Mine d'Or est configuré directement sur l'écran d'accueil de votre iPhone !
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pros banner value */}
              <div className="bg-[#f0b429]/10 border border-[#f0b429]/30 rounded-xl p-3 text-[11px] text-[#f0b429] flex items-center gap-2 font-sans">
                <span>🌟</span>
                <span className="font-semibold text-left">Inutile de passer par Google Play Store ou Apple App Store — C'est gratuit, sans intermédiaire et 10 fois plus rapide !</span>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-[#2ecc71]/15 bg-[#0a110d] text-center shrink-0">
              <button 
                onClick={() => setShowPwaModal(false)}
                className="w-full py-2.5 bg-[#2ecc71] hover:bg-emerald-500 text-black font-sora font-extrabold text-[12px] uppercase tracking-widest rounded-xl transition cursor-pointer select-none shadow-md shadow-emerald-500/10"
              >
                Fermer les Instructions
              </button>
            </div>
          </div>
        </div>
      )}

      {showGoToTop && (
        <button
          onClick={() => {
            const container = document.getElementById("main-scroll-container");
            if (container) {
              container.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="fixed bottom-24 right-5 z-[80] p-3 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 hover:scale-110 active:scale-90 transition-all text-center flex items-center justify-center cursor-pointer border border-emerald-400 animate-bounce"
          title="Retour en haut"
        >
          ⬆️
        </button>
      )}
    </div>
  );
}
