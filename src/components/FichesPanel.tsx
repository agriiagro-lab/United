import React, { useState, useEffect } from "react";
import { 
  ZONES_AGRECOLOGIQUES_BENIN, 
  ALL_BENIN_DEPARTMENTS, 
  getZoneByDepartment, 
  SpeculationCulture, 
  SpeculationElevage, 
  SpeculationTransformation 
} from "../data/agroData";

const getIconForSpeculation = (nom: string) => {
  const n = nom.toLowerCase();
  if (n.includes("maïs") || n.includes("corn")) return "🌽";
  if (n.includes("manioc") || n.includes("cassava")) return "🍠";
  if (n.includes("riz") || n.includes("rice")) return "🌾";
  if (n.includes("ananas") || n.includes("pineapple")) return "🍍";
  if (n.includes("maraîchage") || n.includes("tomate") || n.includes("légume") || n.includes("carotte") || n.includes("laitue")) return "🍅";
  if (n.includes("oignon") || n.includes("onion")) return "🧅";
  if (n.includes("mil") || n.includes("sorgho") || n.includes("grain")) return "🌾";
  if (n.includes("coton") || n.includes("cotton")) return "☁️";
  if (n.includes("anacarde") || n.includes("noix")) return "🌰";
  if (n.includes("igname") || n.includes("yam")) return "🥔";
  if (n.includes("agrumes") || n.includes("mangue") || n.includes("citron")) return "🍋";
  if (n.includes("cocotier") || n.includes("coco")) return "🥥";
  
  // Animal / Elevage
  if (n.includes("bovin") || n.includes("boeuf") || n.includes("vache")) return "🐂";
  if (n.includes("ovin") || n.includes("mouton") || n.includes("chèvre") || n.includes("caprin")) return "🐑";
  if (n.includes("poulet") || n.includes("poule") || n.includes("volaille") || n.includes("goliath")) return "🐓";
  if (n.includes("canard")) return "🦆";
  if (n.includes("apiculture") || n.includes("miel") || n.includes("abeille")) return "🐝";
  if (n.includes("escargot")) return "🐌";
  if (n.includes("pisciculture") || n.includes("tilapia") || n.includes("poisson")) return "🐟";
  if (n.includes("porc") || n.includes("cochon")) return "🐖";

  // Transformation / Cosmetic
  if (n.includes("savon")) return "🧼";
  if (n.includes("huile")) return "🧴";
  if (n.includes("jus")) return "🍹";
  if (n.includes("gari") || n.includes("farine")) return "🥣";
  if (n.includes("concentré")) return "🥫";
  if (n.includes("fumage") || n.includes("fumé")) return "💨";
  
  return "🌱";
};

const OFFICIAL_FILIERES_PHARES: Record<string, { vegetal: string[]; animal: string[]; transf: string[] }> = {
  "Alibori": {
    vegetal: ["Coton", "Maïs", "Riz irrigué", "Sorgho", "Mil"],
    animal: ["Bovin (Viande & Lait)", "Petits ruminants (Ovin/Caprin)", "Volaille locale"],
    transf: ["Lait d'Alibori (Fromage Wagashi)", "Kilichi (Viande séchée)", "Égrenage de Coton"]
  },
  "Atacora": {
    vegetal: ["Anacarde (Noix de Cajou)", "Coton", "Maïs", "Riz", "Igname locale"],
    animal: ["Apiculture (Miel)", "Bovin d'embouche", "Porc local"],
    transf: ["Foutou & Cossettes d'Igname", "Miel filtré de l'Atacora", "Amande de Cajou"]
  },
  "Atlantique": {
    vegetal: ["Ananas (Pain de Sucre, Cayenne)", "Maraîchage intensif", "Palmier à huile", "Manioc de barre"],
    animal: ["Poulet de chair (Goliath)", "Pisciculture (Tilapia/Clarias)"],
    transf: ["Jus d'Ananas pur", "Huile de Coco bio", "Gari croustillant d'Allada"]
  },
  "Borgou": {
    vegetal: ["Coton", "Maïs", "Soja grain", "Arachide", "Sorgho", "Igname"],
    animal: ["Bovin d'embouche", "Volaille Goliath", "Petits ruminants"],
    transf: ["Trituration de Soja (Huile)", "Fromage de Wagashi artisanal", "Huile de Coton"]
  },
  "Collines": {
    vegetal: ["Anacarde (Cajou)", "Soja jaune", "Igname (Laboko)", "Coton", "Manioc", "Maïs de transition"],
    animal: ["Ovin Djallonké", "Pisciculture (Tilapia)"],
    transf: ["Fromage de Soja (Tofu)", "Beurre & Cosmétique de Karité", "Gari fin"]
  },
  "Couffo": {
    vegetal: ["Manioc", "Maïs Couffo", "Palmier à huile", "Soja", "Voandzou", "Piment rouge"],
    animal: ["Volaille Goliath", "Petits ruminants"],
    transf: ["Gari fin de Couffo", "Tapioca blanc d'Aplahoué", "Savon de Neem"]
  },
  "Donga": {
    vegetal: ["Coton", "Igname (Boni)", "Maïs Donga", "Anacarde (Cajou)", "Soja", "Gombo"],
    animal: ["Bovin de garde", "Petits ruminants"],
    transf: ["Gari fin de Djougou", "Baume au Karité pur", "Tapioca de Djougou"]
  },
  "Littoral": {
    vegetal: ["Maraîchage urbain (Laitue, Carotte)", "Cultures horticoles"],
    animal: ["Pêche artisanale maritime", "Pisciculture périurbaine"],
    transf: ["Poisson fumé de Cotonou", "Savon Aloe Vera & Maraîcher"]
  },
  "Mono": {
    vegetal: ["Riz irrigué", "Maraîchage (Grande Tomate, Carotte)", "Palmier à huile", "Gombo"],
    animal: ["Pisciculture Clarias/Tilapia", "Crevettes de lagune"],
    transf: ["Sodabi traditionnel (Vin de palme)", "Huile de Laurier citronnelle", "Riz étuvé"]
  },
  "Ouémé": {
    vegetal: ["Maraîchage (Piment, Tomate Adjarra, Morelle)", "Palmier à huile", "Riz de la Vallée", "Maïs de transition"],
    animal: ["Canard d'Adjarra", "Pisciculture intensive (Clarias/Tilapia)"],
    transf: ["Riz étuvé de Sèmè", "Huile de Palme rouge vierge", "Crème de beauté Maraîchère"]
  },
  "Plateau": {
    vegetal: ["Ananas Pain de Sucre", "Palmier à huile", "Maïs", "Manioc", "Banane Plantain", "Tomate Sakété"],
    animal: ["Poules pondeuses", "Volaille Goliath"],
    transf: ["Jus d'Ananas pur filtré", "Huile de Palme rouge", "Gommage d'Ananas"]
  },
  "Zou": {
    vegetal: ["Manioc Doux d'Abomey", "Maïs Blanc", "Soja Graine", "Riz de Bas-fond", "Piment Habanero"],
    animal: ["Porc Large White d'Abomey", "Escargot Achatina (Héliciculture)"],
    transf: ["Gari Jaune à l'huile de palme", "Eau de Neem pur", "Concentré de Tomate"]
  }
};

export interface FiliereDetail {
  id: string;
  nom: string;
  emoji: string;
  titre: string;
  role: string;
  rendementRef: string;
  cycle: string;
  meilleursSols: string;
  fertilisation: string;
  conseilPro: string;
  exportTrend: string;
}

export const BENIN_FILIERES_PHARES_CATALOG: FiliereDetail[] = [
  {
    id: "coton",
    nom: "Coton",
    emoji: "☁️",
    titre: "Coton Conventionnel Béninois (L'Or Blanc)",
    role: "Premier pilier macro-économique d'exportation nationale. Génère un flux de revenus de haut niveau pour les communautés rurales béninoises.",
    rendementRef: "2.5 à 3.2 Tonnes par Hectare (Semences certifiées d'INRAB)",
    cycle: "120 jours",
    meilleursSols: "Sols argilo-limoneux de texture stable, profonds avec bonne rétention de l'eau (Alibori, Borgou, Zou, Collines)",
    fertilisation: "Apport systématique de NPKSB (150 kg/ha au démarrage) complété par de l'Urée à 40 jours après semis (AIC / CSPR)",
    conseilPro: "Démarier strictement à 15 jours après levée pour conserver uniquement deux plants sains par poquet. Opérer des lancements de traitements phytosanitaires ciblés toutes les deux semaines.",
    exportTrend: "Filière nationale entièrement organisée avec intrants subventionnés et filage industriel en démarrage à la GDIZ."
  },
  {
    id: "anacarde",
    nom: "Anacarde / Cajou",
    emoji: "🌰",
    titre: "Noix de Cajou de Qualité Supérieure (L'Or Gris)",
    role: "Second produit de rente agricole d'exportation. Excellent levier forestier de réhabilitation des sols du Centre et Nord.",
    rendementRef: "700 à 1 500 kg de noix brutes à l'hectare",
    cycle: "3-4 ans d'entrée en production (plants greffés précoces)",
    meilleursSols: "Sols sablo-argileux profonds, sains et légers non inondables (Atacora, Collines, Donga, Borgou)",
    fertilisation: "Fertilisation organique de fond par compostage de ferme mûr, complétée par de la magnésie.",
    conseilPro: "Opter sans hésiter pour les rejets greffés de l'INRAB. Respecter l'espacement standard de 9m x 9m. Effectuer chaque année un élagage méthodique des branches mortes pour maximiser l'ensoleillement.",
    exportTrend: "Interdiction d'exporter les noix brutes sans transformation locale d'amandes de cajou à Glo-Djigbé."
  },
  {
    id: "ananas",
    nom: "Ananas",
    emoji: "🍍",
    titre: "Ananas Pain de Sucre & Cayenne Lisse (Fleuron d'Allada)",
    role: "Filière horticole nationale à très hauts rendements. Notre Pain de Sucre d'Allada est salué mondialement comme le plus fondant et sucré.",
    rendementRef: "55 à 75 Tonnes par Hectare sous conduite irriguée de précision",
    cycle: "14 - 15 Mois",
    meilleursSols: "Sols ferrallitiques rouges meuble et désagrégés de plateau (Atlantique, Plateau)",
    fertilisation: "Besoins critiques très élevés en Azote (N) et surtout en Potassium (K2O), fractionnés en 3 apports ciblés d'engrais potassiques.",
    conseilPro: "Désinfecter les rejets biologiquement au savon noir d'indigo avant repiquage. Planter densément à plus de 55 000 plants par Hectare sur billons très bien surélevés pour contrer le rabougrissement racinaire.",
    exportTrend: "Traction géante sur le jus d'ananas frais de luxe biologique béninois vers l'Union Européenne."
  },
  {
    id: "soja",
    nom: "Soja jaune",
    emoji: "🌱",
    titre: "Soja Jaune Innovant (L'Or Jaune GDIZ)",
    role: "Filière moderne d'exportation agro-industrielle en croissance fulgurante. Excellent précédent cultural pour amender les sols en azote gratis.",
    rendementRef: "1.8 à 2.8 Tonnes par Hectare",
    cycle: "90 jours",
    meilleursSols: "Sols silico-argileux légers, aérés à pH neutre (Borgou, Collines, Zou, Plateau)",
    fertilisation: "Aucun apport d'azote chimique requis. Effectuer impérativement l'inoculation biologique des semences par inoculum Rhizobium.",
    conseilPro: "Faucher les tiges de soja plutôt que de les arracher au ras de terre. Conserver les racines azotées en terre pour doper gratuitement la moisson de maïs suivante.",
    exportTrend: "Transformation intégrale d'huiles raffinées et de tourteaux fins de nutrition animale à la GDIZ."
  },
  {
    id: "manioc",
    nom: "Manioc",
    emoji: "🍠",
    titre: "Manioc de Haute Qualité ( RB 89555 - Gari d'Elite)",
    role: "Filière pivot de la sécurité alimentaire populaire et d'agro-transformation au Bénin.",
    rendementRef: "20 à 35 Tonnes de tubercules sains par Hectare",
    cycle: "8 - 12 Mois ( RB 89555 pour rendements d'amidons de premier plan )",
    meilleursSols: "Sols sableux ou silico-sablonneux meubles pour le gonflement optimal sans étouffement racinaire (Couffo, Zou, Atlantique)",
    fertilisation: "Sulfate de potasse ou engrais de cendre réguliers sur les billons de repiquage.",
    conseilPro: "Sélectionner des boutures saines de 25 cm de long avec au moins 5 bourgeons bien alignés. Planter avec une inclinaison stricte de 45 degrés.",
    exportTrend: "Usine d'amidons de haut niveau d'exportation et production de Gari Jaune enrichi à Allada."
  },
  {
    id: "maraichage",
    nom: "Maraîchage / Tomate",
    emoji: "🍅",
    titre: "Filière Maraîchère & Tomate Régionale (Or Maraîcher)",
    role: "Source de cashflow immédiat pour les exploitations maraîchères périurbaines.",
    rendementRef: "Tomate : 20 à 35 T/ha | Carotte & Piments : 12 T/ha",
    cycle: "75 - 110 jours",
    meilleursSols: "Terres d'alluvion meuble à bonne litière de fumier, bas-fonds irrigués (Mono, Ouémé, Littoral)",
    fertilisation: "Vaste apport de fumier mûr (20 tonnes/ha) renforcé par du cendre de bois ou engrais potassiques.",
    conseilPro: "Utiliser un paillage végétal de paille de riz pour diviser par trois l'évaporation d'eau sèche. Installer des systèmes d'irrigation goutte-à-goutte fins le matin.",
    exportTrend: "Marchés régionaux ultra-tracteurs : approvisionnement quotidien du Nigeria, Niger et Togo."
  },
  {
    id: "riz",
    nom: "Riz de la Vallée",
    emoji: "🌾",
    titre: "Riz de Bas-Fond Étuvé & Décortiqué (Filière de Souveraineté)",
    role: "Grand cheval de bataille de l'indépendance céréalière lancé par l'INRAB face aux importations.",
    rendementRef: "4 à 6.5 Tonnes par Hectare en riziculture intensive",
    cycle: "115 - 130 jours",
    meilleursSols: "Sols profonds argileux, humides de plaines ou de bas-fonds hydro-aménagés (Ouémé, Mono, Alibori)",
    fertilisation: "Sulfate d'ammoniaque et Urée fractionnés en 3, repiquage en lignes serrées et régulation de nappe.",
    conseilPro: "Tremper les futurs semis dans de l'eau tiède de trempage germinative pendant 24h avant repiquage. Maintenir le seau d'eau au ras pendant le tallage.",
    exportTrend: "Boom commercial du riz blanc de valeur nutritionnelle étuvée haut-de-gamme du Bénin."
  },
  {
    id: "goliath",
    nom: "Poulet Goliath",
    emoji: "🐓",
    titre: "Volaille Goliath Nationale (Poulet Goliath)",
    role: "Race phare béninoise de volailles croisées optimisées, symbole d'autosuffisance en viande locale.",
    rendementRef: "Maturité rapide à 3.5 kg en 4 mois pour les coqs reproducteurs",
    cycle: "Chair : 14 semaines | Ponte régulière : dès la 20ème semaine",
    meilleursSols: "Granges et poulaillers spacieux sur litière de copeaux de bois sèche de 5 cm pour isoler du sol froid (Toutes zones)",
    fertilisation: "Rations riches en farines locales (60% maïs jaune, provendes soja INRAB, herbe fraîche pour vitamines).",
    conseilPro: "Respecter sans faille le calendrier d'immunité nationale (Maladie de Newcastle, Gumboro). Intégrer de l'extrait de menthe à l'eau de boisson.",
    exportTrend: "Taux de croissance exceptionnel recherché par les restaurateurs pour sa chair ferme et savoureuse."
  }
];

export const getDynamicFiliereDetail = (nom: string, category: "vegetal" | "animal" | "transf" = "vegetal"): FiliereDetail => {
  const cleanNom = nom.replace(/⚡/g, "").trim();
  const matched = BENIN_FILIERES_PHARES_CATALOG.find(f => 
    cleanNom.toLowerCase().includes(f.nom.toLowerCase()) || 
    f.nom.toLowerCase().includes(cleanNom.toLowerCase())
  );
  if (matched) return matched;

  const emoji = getIconForSpeculation(cleanNom);
  const lowerNom = cleanNom.toLowerCase();

  // 1. Specific definitions for Crops
  if (lowerNom.includes("maïs") || lowerNom.includes("mais")) {
    return {
      id: "mais",
      nom: cleanNom,
      emoji: "🌽",
      titre: `Itinéraire Technique : Culture du Maïs au Bénin`,
      role: "Céréale majeure de souveraineté alimentaire au Bénin. C'est l'un des piliers nutritionnels des ménages béninois.",
      rendementRef: "3.5 à 5.2 Tonnes par Hectare (Variétés précoces INRAB)",
      cycle: "90 à 110 jours (selon variété)",
      meilleursSols: "Sols profonds, meubles sablo-argileux riches en azote et phosphore.",
      fertilisation: "150 kg/ha de NPK (15-15-15) au semis + 100 kg/ha d'urée à 30-40 jours.",
      conseilPro: "Semer à une profondeur de 3-5 cm. Réaliser un traitement régulier contre la chenille légionnaire d'automne.",
      exportTrend: "Forte demande sur le marché sous-régional d'Afrique de l'Ouest (Nigéria, Niger)."
    };
  }
  
  if (lowerNom.includes("riz")) {
    return {
      id: "riz",
      nom: cleanNom,
      emoji: "🌾",
      titre: `Itinéraire Technique : Riz irrigué des Bas-fonds`,
      role: "Culture stratégique d'indépendance céréalière nationale face aux importations de riz blanc.",
      rendementRef: "4.5 à 6.8 Tonnes par Hectare sous irrigation",
      cycle: "115 à 125 jours",
      meilleursSols: "Sols argileux lourds, retenant l'eau superficielle des plaines et bas-fonds.",
      fertilisation: "200 kg/ha NPK au repiquage + 100 kg/ha d'urée à l'initiation paniculaire.",
      conseilPro: "Installer une pépinière de 21 jours. Pratiquer le nivellement parfait de la parcelle pour réguler l'eau.",
      exportTrend: "Filière protégée par des taxes d'importation et portée par les marques de riz local étuvé."
    };
  }

  if (lowerNom.includes("sorgho") || lowerNom.includes("mil")) {
    return {
      id: "sorgho_mil",
      nom: cleanNom,
      emoji: "🌾",
      titre: `Itinéraire Technique : Culture du Sorgho et Mil au Nord-Bénin`,
      role: "Céréales de résilience climatique souveraines pour les zones semi-arides du Septentrion.",
      rendementRef: "1.5 à 2.4 Tonnes par Hectare",
      cycle: "110 à 130 jours",
      meilleursSols: "Sols légers sablo-limoneux résistants à la sécheresse prolongée.",
      fertilisation: "Apport de compost organique soutenu par 100 kg/ha d'engrais NPK azoté.",
      conseilPro: "Semer dès la première pluie utile. Effectuer un démariage rigoureux à 2 plants par poquet à 15 jours.",
      exportTrend: "Alimentation fondamentale du Nord et brassage traditionnel de boissons écologiques (Tchoukoutou)."
    };
  }

  if (lowerNom.includes("igname")) {
    return {
      id: "igname",
      nom: cleanNom,
      emoji: "🥔",
      titre: `Itinéraire Technique : Culture de l'Igname (Laboko / Boni)`,
      role: "Tubercules de rente, socle de l'identité culinaire des Collines et du Septentrion béninois.",
      rendementRef: "12 à 18 Tonnes par Hectare",
      cycle: "180 à 240 jours",
      meilleursSols: "Sols sablo-argileux profonds, meublés sur buttes géantes, riches en potassium.",
      fertilisation: "Fertilisation bio active de fond (débris végétaux compostés mûrs) à mélanger aux buttes.",
      conseilPro: "Planter des tuteurs sains et hauts de 2m pour les lianes. Effectuer un paillage protecteur du chapeau de butte dès plantation.",
      exportTrend: "Consommation interne de prestige (Foutou) et commerce florissant de cossettes d'igname séchées."
    };
  }

  if (lowerNom.includes("palmier")) {
    return {
      id: "palmier",
      nom: cleanNom,
      emoji: "🌴",
      titre: `Itinéraire Technique : Palmier à Huile sélectionné (Tenera)`,
      role: "Ressource oléagineuse majeure du Sud-Bénin pour les usines de raffinage d'huile et savons cosmétiques.",
      rendementRef: "8 à 12 Tonnes de régimes de fruits frais par Hectare par an",
      cycle: "Entrée en récolte à 3 ans, productif sur 25 ans",
      meilleursSols: "Sols ferrallitiques profonds, sous climat chaud à humidité relative élevée.",
      fertilisation: "Fractionnement de chlorure de potassium (KCl) et de phosphate naturel d'importation locale.",
      conseilPro: "Utiliser exclusivement les plants de variété hybride Tenera certifiés par le CRA-PP de Pobè. Élaguer proprement.",
      exportTrend: "Forte demande régionale pour l'huile rouge traditionnelle raffinée et l'huile de palmiste blanc."
    };
  }

  if (lowerNom.includes("karité")) {
    return {
      id: "karite",
      nom: cleanNom,
      emoji: "🌰",
      titre: `Itinéraire Technique : Amandes Sauvages et Beurre de Karité`,
      role: "Arbre d'exportation cosmétique et alimentaire d'importance vitale pour les groupements de femmes du Nord.",
      rendementRef: "15 à 45 kg de noix fraîches par arbre adulte par an",
      cycle: "Cueillette sauvage saisonnière de mai à août",
      meilleursSols: "Parcs forestiers de savanes arbustives protégées.",
      fertilisation: "Aucun engrais chimique. Conservation écologique naturelle de la biodiversité des parcs.",
      conseilPro: "Ramasser uniquement les fruits tombés mûrs à terre. Nettoyer, dépulper et sécher les noix sur bâche sans contact terreux.",
      exportTrend: "Exportation vers les industries cosmétiques internationales de luxe et substituts de beurre de cacao."
    };
  }

  if (lowerNom.includes("miel") || lowerNom.includes("apiculture")) {
    return {
      id: "miel_apiculture",
      nom: cleanNom,
      emoji: "🐝",
      titre: `Itinéraire Technique : Apiculture écologique du Bénin`,
      role: "Activité de diversification agricole à haute valeur ajoutée préservant nos forêts classées.",
      rendementRef: "15 à 25 Litres de miel pur filtré par ruche par an",
      cycle: "Récolte principale entre février et mai",
      meilleursSols: "Zones forestières ou arborées calmes, éloignées des traitements phytosanitaires chimiques.",
      fertilisation: "Pollinisation naturelle de la biodiversité locale.",
      conseilPro: "Utiliser des ruches modernes de type Kényane. Installer des abreuvoirs d'eau à proximité pour stabiliser les essaims sauvages.",
      exportTrend: "Recherche forte de miel sauvage brut bio de l'Atacora sur les marchés urbains et régionaux."
    };
  }

  if (lowerNom.includes("bovin")) {
    return {
      id: "bovin",
      nom: cleanNom,
      emoji: "🐂",
      titre: `Itinéraire Technique : Élevage Bovin (Lait & Viande)`,
      role: "Pilier pastoral national de production protéique animale concentré au Nord du Bénin.",
      rendementRef: "Gain Moyen Quotidien de 350-450g en embouche de pré-commercialisation",
      cycle: "Embouche finale intensive de 90 à 120 jours avant abattage",
      meilleursSols: "Parcs de pâture ventilés disposant de couloirs de contention et d'abreuvoirs de précision.",
      fertilisation: "Foin de qualité, résidus de cultures maïs/riz enrichis à l'urée, blocs nutritionnels de sel.",
      conseilPro: "Vacciner annuellement contre la dermatose nodulaire et la pasteurellose. Distribuer du tourteau de coton mûr.",
      exportTrend: "Vente massive de bétail sur pied vers le Sud-Bénin (Cotonou, Porto-Novo) et le Nigéria."
    };
  }

  if (lowerNom.includes("ovin") || lowerNom.includes("caprin") || lowerNom.includes("mouton") || lowerNom.includes("ruminants")) {
    return {
      id: "ovin_caprin",
      nom: cleanNom,
      emoji: "🐑",
      titre: `Itinéraire Technique : Petits Ruminants (Djallonké / Sahéliens)`,
      role: "Élevage polyvalent d'épargne rurale rapide du Bénin, symbole d'autosuffisance protéique territoriale.",
      rendementRef: "Portée moyenne de 1.5 agneaux par brebis par an",
      cycle: "Élevage de chair mûr à 8-10 mois",
      meilleursSols: "Bergeries drainées, sèches sur litière d'herbe ou caillebotis pour épargner le piétin des pieds.",
      fertilisation: "Alimentation de broussailles complétée par des épluchures lavées de manioc cuit.",
      conseilPro: "Vermifuger rigoureusement tous les 3 mois contre la peste des petits ruminants et la gale cutanée.",
      exportTrend: "Flux de vente gigantesques lors des célébrations traditionnelles et approvisionnement des boucheries urbaines."
    };
  }

  if (lowerNom.includes("pisciculture") || lowerNom.includes("tilapia") || lowerNom.includes("clarias") || lowerNom.includes("poisson")) {
    return {
      id: "pisciculture",
      nom: cleanNom,
      emoji: "🐟",
      titre: `Itinéraire Technique : Pisciculture intensive en hors-sol`,
      role: "Alternative durable à la surpêche lagunaire pour garantir l'autonomie halieutique nationale.",
      rendementRef: "45 à 65 kg de poisson de table par mètre cube d'eau filtrée",
      cycle: "5 à 6 mois (pour atteindre 450-500g)",
      meilleursSols: "Bacs circulaires en bâche PVC ou étangs bien alimentés en eau claire pérenne.",
      fertilisation: "Granulés extrudés flottants (32 à 42% de protéines de soja et farine de poisson).",
      conseilPro: "Contrôler quotidiennement le taux d'oxygène dissous et siphonner les résidus organiques accumulés au fond du bac.",
      exportTrend: "Forte demande sur le marché de consommation locale fraîche ou de fumage traditionnel de poisson."
    };
  }

  if (lowerNom.includes("porc")) {
    return {
      id: "porc",
      nom: cleanNom,
      emoji: "🐖",
      titre: `Itinéraire Technique : Élevage de Porcs locaux améliorés`,
      role: "Filière à haut cycle reproductif générant d'excellents profits financiers pour les éleveurs territoriaux.",
      rendementRef: "Portée de 8 à 12 porcelets par truie par mise bas",
      cycle: "Croissance optimale à 80 kg en 6-7 mois d'engraissement",
      meilleursSols: "Porcheries spacieuses munies de loges d'alimentation en béton brossé, faciles à laver.",
      fertilisation: "Mélange équilibré de son de riz, drèches de bière locale, tourteau de palmiste de qualité.",
      conseilPro: "Maintenir une hygiène rigoureuse pour repousser la peste porcine africaine (aucun traitement curatif connu).",
      exportTrend: "Forte de consommation urbaine de viande porcine de qualité supérieure (Sud et Centre du Bénin)."
    };
  }

  if (lowerNom.includes("lait") || lowerNom.includes("fromage") || lowerNom.includes("wagashi")) {
    return {
      id: "transformation_lait",
      nom: cleanNom,
      emoji: "🥣",
      titre: "Wagashi : Fromage traditionnel peulh du Bénin",
      role: "Héritage artisanal béninois souverain d'agro-transformation laitière de haute valeur nutritionnelle.",
      rendementRef: "1 kg de Wagashi frais pour 5 litres de lait bovin brut",
      cycle: "Transformation immédiate à chaud en moins de 3 heures",
      meilleursSols: "Unités de transformation propres munies de foyers de cuisson économes en bois.",
      fertilisation: "Coagulant végétal précieux extrait des feuilles locales de Calotropis procera (Pommier de Sodome).",
      conseilPro: "Faire bouillir le lait dès récupération pastorale. Conserver le fromage frais au frais dans son petit-lait salé.",
      exportTrend: "Demande phénoménale à Cotonou et exportation d'élite vers les supermarchés de la sous-région."
    };
  }

  if (lowerNom.includes("gari") || lowerNom.includes("tapioca")) {
    return {
      id: "gari_allada",
      nom: cleanNom,
      emoji: "🥣",
      titre: "Gari Croustillant & Tapioca blanc d'Allada",
      role: "Alimentation fondamentale d'autosuffisance nationale et d'exportation vers la sous-région côtière.",
      rendementRef: "220 kg de Gari sec haut-de-gamme par tonne de racines fraîches de manioc",
      cycle: "3 jours de râpage, fermentation lactique pressée et torréfaction fine",
      meilleursSols: "Plates-formes carrelées de traitement sanitaire équipées de râpeuses et presses mécaniques.",
      fertilisation: "Ajout facultatif d'huile de palme brute rouge raffinée pour obtenir le fameux Gari Jaune.",
      conseilPro: "Maîtriser le temps de fermentation (48h) pour obtenir le goût acidulé idéal apprécié du consommateur.",
      exportTrend: "Produit phare exporté par remorques entières vers le Nigéria, le Togo et les diasporas d'Europe."
    };
  }

  if (lowerNom.includes("savon")) {
    return {
      id: "savon_neem",
      nom: cleanNom,
      emoji: "🧼",
      titre: "Savon artisanal bio au Neem et Aloe Vera",
      role: "Transformation hygiénique de l'artisanat cosmétique local luttant contre les affections cutanées.",
      rendementRef: "Production de 150 pains de savon solide de 120g par lot",
      cycle: "Saponification à froid, cure d'au moins 4 semaines",
      meilleursSols: "Chambres de séchage aérées et ombragées préservant les actifs naturels.",
      fertilisation: "Formulation à base d'huile de coco locale purifiée, huile de Palme et extrait frais de neem.",
      conseilPro: "Maintenir une température constante de mélange des huiles à 40°C pour obtenir une trace solide.",
      exportTrend: "Succès retentissant sur les marchés urbains d'Afrique de l'Ouest friands de soins de peau naturels."
    };
  }

  // 2. Fallbacks based on category/name
  if (category === "animal" || lowerNom.match(/(bovin|ovin|caprin|poulet|poule|pintade|lapin|porc|escargot|abeille|poisson|tilapia|clarias|crevette|canard|élevage|cheptel)/)) {
    return {
      id: cleanNom.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      nom: cleanNom,
      emoji,
      titre: `Filière d'Élevage : ${cleanNom} au Bénin`,
      role: "Filière d'élevage stratégique promue pour la sécurité nutritionnelle et l'indépendance en protéines animales.",
      rendementRef: "Performances animales excellentes sous protocole sanitaire conforme",
      cycle: "Cycle de croissance rapide et soins de biosécurité réguliers de rigueur",
      meilleursSols: "Logements d'élevage secs, sains, bien ventilés et désinfectés de manière stricte.",
      fertilisation: "Alimentation à base de sons d'arachides locaux, d'engrais vert et d'eau pure.",
      conseilPro: "Administrer scrupuleusement la prophylaxie vaccinale de saison et nettoyer quotidiennement les abreuvoirs.",
      exportTrend: "Valorisation auprès des marchés agro-alimentaires du Bénin et d'Afrique de l'Ouest."
    };
  }

  if (category === "transf" || lowerNom.match(/(jus|savon|huile|farine|fromage|beurre|miel|gari|tapioca|sodabi|coquette|pur|biogaz|transformation|cosmétique)/)) {
    return {
      id: cleanNom.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      nom: cleanNom,
      emoji,
      titre: `Filière d'Agro-Transformation : ${cleanNom} du Bénin`,
      role: "Valorisation territoriale souveraine pour réduire les pertes de récolte et doubler les bénéfices.",
      rendementRef: "Taux d'extraction mûr et respect strict des protocoles d'hygiène publique",
      cycle: "Transformation méticuleuse post-récolte pour fixer les vitamines naturelles",
      meilleursSols: "Atelier de transformation sous dalle cimentée, hermétique et exempt de poussière extérieure.",
      fertilisation: "Formule d'extraction et séchage thermique préservant l'intégrité biologique de la ressource.",
      conseilPro: "Optimiser le conditionnement et l'étiquetage pour rallonger de 12 mois de conservation.",
      exportTrend: "Forte pénétration dans la grande distribution béninoise et les circuits bio d'Afrique de l'Ouest."
    };
  }

  // default agricultural crop
  return {
    id: cleanNom.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    nom: cleanNom,
    emoji,
    titre: `Itinéraire Technique : Culture de ${cleanNom} au Bénin`,
    role: `Filière végétale d'importance économique majeure contribuant à la souveraineté alimentaire nationale et à la création de richesses territoriales.`,
    rendementRef: `Performance culturale élevée sous conditions d'alimentation en eau suffisantes et respect strict de l'itinéraire technique (INRAB).`,
    cycle: `90 à 135 jours selon les variétés culturales du Bénin`,
    meilleursSols: `Sols riches en matières organiques, bien aérés avec un pH neutre à légèrement acide.`,
    fertilisation: `Apport d'engrais NPK équilibré au semis, renforcé par de l'urée au 30ème jour culturale et un paillage protecteur.`,
    conseilPro: `Semer dès l'établissement de la saison des pluies. Réaliser des sarclages réguliers pour éliminer la concurrence des adventices et aérer le système racinaire.`,
    exportTrend: `Forte opportunité de commercialisation sur le marché national d'approvisionnement et de valorisation industrielle.`
  };
};

import { 
  BookOpen, 
  ShieldCheck, 
  Flame, 
  PlusCircle, 
  ArrowRight, 
  Sprout, 
  HeartPulse, 
  DollarSign, 
  BadgeAlert, 
  Layers,
  Download,
  Edit,
  Save,
  X,
  FileText
} from "lucide-react";

interface FichesPanelProps {
  onRedirectToAgribot: (prompt: string) => void;
  selectedDepartment?: string;
  setSelectedDepartment?: (dept: string) => void;
  isUserJbz?: boolean;
  zonesList?: any[];
  onReloadAgroData?: () => void;
}

export default function FichesPanel({ 
  onRedirectToAgribot,
  selectedDepartment,
  setSelectedDepartment,
  isUserJbz,
  zonesList,
  onReloadAgroData
}: FichesPanelProps) {
  const [localDept, setLocalDept] = useState<string>("Plateau");
  const selectedDept = selectedDepartment || localDept;
  const setSelectedDept = setSelectedDepartment || setLocalDept;

  const [activeSegment, setActiveSegment] = useState<"vegetal" | "animal" | "cosmetic">("vegetal");
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereDetail | null>(null);
  const [customSpecName, setCustomSpecName] = useState("");
  const [customSpecContext, setCustomSpecContext] = useState("");

  const [editingCulture, setEditingCulture] = useState<any | null>(null);
  const [editYield, setEditYield] = useState<string>("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editCycle, setEditCycle] = useState<string>("");
  const [editSemis, setEditSemis] = useState<string>("");
  const [editSeedCost, setEditSeedCost] = useState<string>("");
  const [editEngraisCost, setEditEngraisCost] = useState<string>("");
  const [editLaborCost, setEditLaborCost] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const currentZone = zonesList 
    ? (zonesList.find(z => z.departements.includes(selectedDept)) || getZoneByDepartment(selectedDept)) 
    : getZoneByDepartment(selectedDept);

  const filieres = OFFICIAL_FILIERES_PHARES[selectedDept] || { vegetal: [], animal: [], transf: [] };

  const [selectedCultureName, setSelectedCultureName] = useState<string>("");
  const [selectedElevageName, setSelectedElevageName] = useState<string>("");
  const [selectedTransformationName, setSelectedTransformationName] = useState<string>("");

  useEffect(() => {
    if (currentZone.cultures && currentZone.cultures.length > 0) {
      setSelectedCultureName(currentZone.cultures[0].nom);
    } else {
      setSelectedCultureName("");
    }
    if (currentZone.elevages && currentZone.elevages.length > 0) {
      setSelectedElevageName(currentZone.elevages[0].nom);
    } else {
      setSelectedElevageName("");
    }
    if (currentZone.transformations && currentZone.transformations.length > 0) {
      setSelectedTransformationName(currentZone.transformations[0].nom);
    } else {
      setSelectedTransformationName("");
    }
  }, [selectedDept, zonesList, currentZone]);

  const handleExportDepartmentCSV = () => {
    let csvContent = "\ufeff"; // UTF-8 BOM for French accent characters in Excel
    csvContent += "CONSEIL TECHNIQUE DE CHANTIER - DEPARTEMENT DE : " + selectedDept.toUpperCase() + "\n";
    csvContent += `ZONE AGROECOLOGIQUE : ${currentZone.zone_id} - ${currentZone.nom}\n`;
    csvContent += "SOURCE: MAEP / INSTAD BENIN CAMPAGNE 2025-2026 - AGRIBOT SYSTEME\n\n";
    
    csvContent += "CULTURE,RENDEMENT MOYEN (kg/m²),CYCLE VEGETATIF (jours),PERIODE DE SEMIS,COUT SEMENCES / HA (FCFA),COUT ENGRAIS / HA (FCFA),COUT MAIN D'OEUVRE / HA (FCFA),COUT TOTAL ESTIMATIF / HA (FCFA),PRIX DE VENTE CONSEILLE (FCFA/kg),DIAGNOSTIC PRINCIPAL\n";
    
    currentZone.cultures.forEach((cult: any) => {
      const semHa = (cult.semencesCost || 0) * 20;
      const engHa = (cult.engraisCost || 0) * 20;
      const labHa = (cult.mainOeuvreCost || 0) * 20;
      const totalHa = semHa + engHa + labHa;
      const maladiesNames = (cult.maladies || []).map((m: any) => `${m.nom} (${m.remede})`).join(" | ").replace(/"/g, '""');
      
      csvContent += `"${cult.nom}","${cult.rendementMoyen}","${cult.cycle}","${cult.periodeSemis}","${semHa}","${engHa}","${labHa}","${totalHa}","${cult.prixKgMoy}","${maladiesNames}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Fiches_Agricoles_Territoire_${selectedDept}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenEdit = (cult: any) => {
    setEditingCulture(cult);
    setEditYield(cult.rendementMoyen.toString());
    setEditPrice(cult.prixKgMoy.toString());
    const cycleDays = parseInt(cult.cycle) || 90;
    setEditCycle(cycleDays.toString());
    setEditSemis(cult.periodeSemis);
    setEditSeedCost(((cult.semencesCost || 0) * 20).toString());
    setEditEngraisCost(((cult.engraisCost || 0) * 20).toString());
    setEditLaborCost(((cult.mainOeuvreCost || 0) * 20).toString());
    setSaveSuccess("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCulture) return;
    setIsSaving(true);
    setSaveSuccess("");

    try {
      const payload = {
        departement: selectedDept,
        nom: editingCulture.nom,
        rendement_moyen_kg_m2: parseFloat(editYield) || 0,
        prix_vente_fcfa_kg: parseInt(editPrice) || 0,
        cycle_jours: parseInt(editCycle) || 0,
        periode_semis: editSemis,
        couts: {
          semence_fcfa_ha: parseInt(editSeedCost) || 0,
          engrais_fcfa_ha: parseInt(editEngraisCost) || 0,
          main_oeuvre_fcfa_ha: parseInt(editLaborCost) || 0
        }
      };

      const res = await fetch("/api/admin/cultures/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveSuccess("✨ Barème de production mis à jour sur AgriBot Pro !");
        if (onReloadAgroData) {
          onReloadAgroData();
        }
        setTimeout(() => {
          setEditingCulture(null);
        }, 1500);
      } else {
        const d = await res.json();
        setSaveSuccess(`❌ Erreur: ${d.error || "Mise à jour impossible"}`);
      }
    } catch (err) {
      console.error(err);
      setSaveSuccess("❌ Erreur de réseau");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitCustomSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSpecName.trim()) return;

    const systemPromptMessage = `Je souhaite des conseils phytosanitaires approfondis pour ma spéculation agricole suivante :
- Nom de la spéculation cultivée : ${customSpecName}
- Département d'exploitation au Bénin : ${selectedDept}
- Contexte et symptômes observés : ${customSpecContext}

Générez-moi une fiche technique agricole (INRAB / Songhaï/ MAEP) complète avec le cycle cultural, le budget prévisionnel d'intrants/ha, les maladies locales fréquentes et deux bio-traitements traditionnels efficaces à base de plantes locales (neem, ail, piment sauvage ou papaye sauvage).`;
    
    setCustomSpecName("");
    setCustomSpecContext("");
    onRedirectToAgribot(systemPromptMessage);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Filter Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
              <Sprout className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-black font-display uppercase tracking-wider text-slate-800">
                📚 Itinéraires Techniques & Agroécologie
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Données calibrées par zone agro-écologique (Sources : INRAB / MAEP Bénin)
              </p>
            </div>
          </div>
          
          {/* Department Select Option without Excel exporter */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 px-3.5 py-1.5 rounded-2xl shadow-2xs">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider font-mono">📍 Territoire :</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-white border border-emerald-250 text-xs font-extrabold text-emerald-800 rounded-lg px-2.5 py-1.25 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-400 cursor-pointer shadow-3xs outline-none"
              >
                {ALL_BENIN_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Zone Weather Condition context indicators */}
        <div className="p-4 bg-gradient-to-r from-emerald-50/40 to-teal-50/20 border border-emerald-100 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[9.5px] uppercase font-black text-slate-400 font-mono block">Zone Agro-écologique</span>
            <strong className="text-emerald-900 font-black text-[11px] font-display uppercase">{currentZone.zone_id} : {currentZone.nom}</strong>
          </div>
          <div>
            <span className="text-[9.5px] uppercase font-black text-slate-400 font-mono block">Type de Climat</span>
            <span className="text-slate-700 font-medium font-mono">{currentZone.climat}</span>
          </div>
          <div>
            <span className="text-[9.5px] uppercase font-black text-slate-400 font-mono block">Nature des Sols</span>
            <span className="text-slate-700 font-medium font-mono">{currentZone.sols}</span>
          </div>
          <div>
            <span className="text-[9.5px] uppercase font-black text-slate-400 font-mono block">Pluviométrie Annuelle</span>
            <span className="text-slate-700 font-bold font-mono text-emerald-800">{currentZone.pluviometrie}</span>
          </div>
        </div>

        {/* State Certified "Filières Phares" (Pinnacle/Flagship national Sectors) */}
        <div className="p-4.5 bg-slate-50 border border-slate-200/85 rounded-2xl space-y-3.5">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
            <span className="text-[10px] sm:text-[10.5px] uppercase font-extrabold tracking-wider text-slate-700 font-display">
              🏆 Filières Phares de Production du Territoire (Stratégies Promues par le MAEP & l'ATDA)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 space-y-2 shadow-3xs">
              <span className="text-[9px] uppercase font-black text-rose-500 font-mono block tracking-wider">🌾 Production Végétale Phare</span>
              <div className="flex flex-wrap gap-1">
                {filieres.vegetal.map((v, idx) => {
                  const detail = getDynamicFiliereDetail(v, "vegetal");
                  return (
                    <span 
                      key={idx} 
                      onClick={() => setSelectedFiliere(detail)}
                      className="text-[10px] font-black px-2 py-0.75 rounded-lg border bg-rose-50/50 text-rose-850 border-rose-100 hover:bg-rose-100 hover:border-rose-250 cursor-pointer transition-all"
                      title="Cliquez pour voir l'itinéraire technique détaillé"
                    >
                      {v} ⚡
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 space-y-2 shadow-3xs">
              <span className="text-[9px] uppercase font-black text-sky-500 font-mono block tracking-wider">🐓 Filière Animale Majeure</span>
              <div className="flex flex-wrap gap-1">
                {filieres.animal.map((a, idx) => {
                  const detail = getDynamicFiliereDetail(a, "animal");
                  return (
                    <span 
                      key={idx} 
                      onClick={() => setSelectedFiliere(detail)}
                      className="text-[10px] font-black px-2 py-0.75 rounded-lg border bg-sky-50/50 text-sky-850 border-sky-100 hover:bg-sky-100 hover:border-sky-200 cursor-pointer transition-all"
                      title="Cliquez pour voir l'itinéraire technique détaillé"
                    >
                      {a} ⚡
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 space-y-2 shadow-3xs">
              <span className="text-[9px] uppercase font-black text-amber-600 font-mono block tracking-wider">🥫 Agro-Transformation Promue</span>
              <div className="flex flex-wrap gap-1">
                {filieres.transf.map((t, idx) => {
                  const detail = getDynamicFiliereDetail(t, "transf");
                  return (
                    <span 
                      key={idx} 
                      onClick={() => setSelectedFiliere(detail)}
                      className="text-[10px] font-black px-2 py-0.75 rounded-lg border bg-amber-50/50 text-amber-850 border-amber-100 hover:bg-amber-100 hover:border-amber-200 cursor-pointer transition-all"
                      title="Cliquez pour voir la fiche d'itinéraires détaillés"
                    >
                      {t} ⚡
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu buttons selection */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSegment("vegetal")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeSegment === "vegetal" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-white/50"
          }`}
        >
          🌾 Végétal ({currentZone.cultures.length})
        </button>
        <button
          onClick={() => setActiveSegment("animal")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeSegment === "animal" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-white/50"
          }`}
        >
          🐓 Elevage ({currentZone.elevages.length})
        </button>
        <button
          onClick={() => setActiveSegment("cosmetic")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeSegment === "cosmetic" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-white/50"
          }`}
        >
          💄 Cosmétiques & Transf. ({currentZone.transformations.length})
        </button>
      </div>

      {/* Main Grid display layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Render sheets based on selected tab segment */}
        <div className="md:col-span-2 space-y-5">
          
          {activeSegment === "vegetal" && (
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                💡 Sélectionnez une culture pour voir sa fiche technique ({currentZone.cultures.length} disponibles) :
              </span>
              {currentZone.cultures.length === 0 ? (
                <div className="bg-slate-50 border p-8 rounded-3xl text-center text-slate-400">
                  Aucune fiche disponible pour ce département
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {currentZone.cultures.map((cult: any) => {
                      const isSelected = selectedCultureName === cult.nom;
                      const emoji = getIconForSpeculation(cult.nom);
                      return (
                        <div 
                          key={cult.nom} 
                          className={`rounded-2xl p-3 border transition active:scale-95 cursor-pointer flex items-center gap-3 ${
                            isSelected 
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10 scale-[1.02]" 
                              : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 text-slate-800"
                          }`}
                          onClick={() => setSelectedCultureName(cult.nom)}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-white/20" : "bg-emerald-100/50"
                          }`}>
                            <span className="text-xl">{emoji}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs truncate leading-tight">{cult.nom}</div>
                            <div className={`text-[10px] ${isSelected ? "text-slate-100" : "text-slate-400"} truncate mt-0.5`}>{cult.cycle}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {currentZone.cultures.map((cult: any, i: number) => {
                    if (cult.nom !== selectedCultureName) return null;
                    return (
                      <div key={i} className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-5 space-y-4 transition hover:border-emerald-250 relative group">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="bg-emerald-50 border border-emerald-250/50 text-emerald-850 text-[9px] font-black font-mono px-2 py-0.5 rounded uppercase">
                              Culture - {selectedDept}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <h3 className="text-base font-black text-slate-800">{cult.nom}</h3>
                              {isUserJbz && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(cult)}
                                  title="Ajuster le barème de production"
                                  className="p-1 text-amber-600 hover:text-amber-800 rounded hover:bg-amber-50 transition cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Période propice de semis : <strong className="text-slate-700 font-mono font-bold bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">{cult.periodeSemis}</strong>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-semibold text-slate-400 font-mono">Cycle moyen</div>
                            <div className="text-xs font-black text-teal-800 font-mono">{cult.cycle}</div>
                          </div>
                        </div>

                        {/* Economy forecast snippet inside card */}
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 grid grid-cols-3 gap-2 text-[10.5px] font-mono shadow-3xs">
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase block font-sans">Semences (500m²)</span>
                            <span className="font-bold text-slate-700">{cult.semencesCost ? cult.semencesCost.toLocaleString() : "0"} F CFA</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase block font-sans">Engrais & Soins</span>
                            <span className="font-bold text-slate-700">{cult.engraisCost ? cult.engraisCost.toLocaleString() : "0"} F CFA</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase block font-sans">Rendement estimé</span>
                            <span className="font-bold text-emerald-700">{cult.rendementMoyen} kg/m²</span>
                          </div>
                        </div>

                        {/* HIGH-VALUATION "FILIÈRE PHARE" STRATEGIC INSIGHT FOR BENIN */}
                        {(() => {
                          const isFilierePhareVal = filieres.vegetal.some(v => 
                            v.toLowerCase().includes(cult.nom.toLowerCase()) || 
                            cult.nom.toLowerCase().includes(v.toLowerCase())
                          );
                          return (
                            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                              isFilierePhareVal 
                                ? "bg-amber-500/5 border-amber-500/20 text-slate-805" 
                                : "bg-emerald-500/5 border-emerald-500/10 text-slate-800"
                            }`}>
                              <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                                <span className="font-black font-display uppercase tracking-wider text-[10px] text-slate-700">
                                  {isFilierePhareVal ? "🏆 FILIÈRE PHARE MAEP / ATDA DE HAUTE VALEUR COMPOSITE" : "🌿 DÉVELOPPEMENT DE LA FILIÈRE NATIONALE"}
                                </span>
                              </div>
                              <p className="text-[11px] sm:text-[11.5px] text-slate-600 leading-normal">
                                {isFilierePhareVal 
                                  ? `Le ${cult.nom} est officiellement homologué comme filière phare de promotion agricole dans le département de ${selectedDept}. Cela donne droit aux facilités d'approvisionnement en semences certifiées de premier choix, aux encadrements de proximité de l'ATDA et aux opportunités de vente groupée auprès des unions de producteurs béninois.`
                                  : `La production de ${cult.nom} dans les pôles de ${selectedDept} est activement soutenue dans le cadre de la diversification des cultures de subsistance saine et d'autonomie financière pour la promotion de l'entrepreneuriat des jeunes.`
                                }
                              </p>
                            </div>
                          );
                        })()}

                        {/* Technical Route */}
                        <div className="space-y-1.5">
                          <h4 className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1 font-mono">
                            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>Itinéraire Cultural de Réussite ({currentZone.sols})</span>
                          </h4>
                          <ul className="list-disc pl-5 text-[11.5px] text-slate-600 space-y-1.5">
                            {cult.itineraire.map((step: any, idx: number) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Diseases and Biological Remedies */}
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          <h4 className="text-[10.5px] font-black text-slate-705 uppercase tracking-wider flex items-center gap-1 font-mono">
                            <Flame className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                            <span>Maladies au Bénin & Remèdes Biologiques Protégés</span>
                          </h4>
                          <div className="space-y-2">
                            {cult.maladies.map((mal: any, mIdx: number) => (
                              <div key={mIdx} className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 text-[11px]">
                                <div className="font-black text-rose-900 flex items-center gap-1">
                                  <BadgeAlert className="h-3.5 w-3.5" />
                                  <span>{mal.nom}</span>
                                </div>
                                <p className="text-slate-650 mt-1">
                                  <strong className="text-emerald-950 font-bold">🌿 Bio-traitement :</strong> {mal.remede}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive redirection to prompt */}
                        <button
                          type="button"
                          onClick={() => onRedirectToAgribot(`Veuillez me rédiger un itinéraire technique détaillé pour la culture de ${cult.nom} dans le département de ${selectedDept} (Zone ${currentZone.zone_id}), avec calendrier lunaire, méthodes d'irrigation et gestion biologique des maladies.`)}
                          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 transition rounded-xl text-[10.5px] font-bold text-emerald-800 flex items-center justify-center gap-1 border border-emerald-150 cursor-pointer"
                        >
                          <span>Demander un calendrier lunaire et d'arrosage pour cette culture</span>
                          <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {activeSegment === "animal" && (
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                💡 Sélectionnez un élevage pour voir sa fiche technique ({currentZone.elevages.length} disponibles) :
              </span>
              {currentZone.elevages.length === 0 ? (
                <div className="bg-slate-50 border p-8 rounded-3xl text-center text-slate-400">
                  Aucune fiche disponible pour ce département
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {currentZone.elevages.map((elv: any) => {
                      const isSelected = selectedElevageName === elv.nom;
                      const emoji = getIconForSpeculation(elv.nom);
                      return (
                        <div 
                          key={elv.nom} 
                          className={`rounded-2xl p-3 border transition active:scale-95 cursor-pointer flex items-center gap-3 ${
                            isSelected 
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                              : "bg-white border-slate-200 hover:bg-sky-50 text-slate-800"
                          }`}
                          onClick={() => setSelectedElevageName(elv.nom)}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-white/20" : "bg-sky-100/50"
                          }`}>
                            <span className="text-xl">{emoji}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs truncate leading-tight">{elv.nom}</div>
                            <div className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"} truncate mt-0.5`}>{elv.cycle}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {currentZone.elevages.map((elv: any, i: number) => {
                    if (elv.nom !== selectedElevageName) return null;
                    return (
                      <div key={i} className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-5 space-y-4 transition hover:border-emerald-250">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="bg-sky-50 border border-sky-250/50 text-sky-850 text-[9px] font-black font-mono px-2 py-0.5 rounded uppercase">
                              Élevage - {selectedDept}
                            </span>
                            <h3 className="text-base font-black text-slate-800 mt-1">{elv.nom}</h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Durée d'une bande de production : <strong className="text-slate-700 font-mono font-bold">{elv.cycle}</strong>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-semibold text-slate-400 font-mono">Pertes attendues</div>
                            <div className="text-xs font-black text-red-600 font-mono">~ {elv.mortaliteType}%</div>
                          </div>
                        </div>

                        {/* Economy indices */}
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 grid grid-cols-3 gap-2 text-[10.5px] font-mono shadow-3xs">
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase block font-sans">Achat unitaire</span>
                            <span className="font-bold text-slate-700">{elv.prixAchatUnitaire.toLocaleString()} F</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase block font-sans">Alimentation & Soin</span>
                            <span className="font-bold text-slate-700">{elv.alimentSoinCost.toLocaleString()} F</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase block font-sans">Prix Vente Estimé</span>
                            <span className="font-bold text-emerald-700">{elv.prixVenteUnitaire.toLocaleString()} F</span>
                          </div>
                        </div>

                        {/* ANIMAL FLAGSHIP STRATEGY IN BENIN */}
                        {(() => {
                          const isFilierePhareAnimalVal = filieres.animal.some(a => 
                            a.toLowerCase().includes(elv.nom.toLowerCase()) || 
                            elv.nom.toLowerCase().includes(a.toLowerCase())
                          );
                          return (
                            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                              isFilierePhareAnimalVal 
                                ? "bg-sky-500/5 border-sky-500/20 text-slate-805" 
                                : "bg-sky-500/5 border-sky-500/10 text-slate-800"
                            }`}>
                              <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-sky-500 fill-sky-500/10" />
                                <span className="font-black font-display uppercase tracking-wider text-[10px] text-slate-700">
                                  {isFilierePhareAnimalVal ? "🏆 FILIÈRE ANIMALE MAJEURE (APPUI STRATÉGIQUE MAEP)" : "🐓 PROGRAMME NATIONAL DE SÉCURITÉ PROTÉIQUE"}
                                </span>
                              </div>
                              <p className="text-[11px] sm:text-[11.5px] text-slate-600 leading-normal">
                                {isFilierePhareAnimalVal 
                                  ? `Le segment d'élevage de ${elv.nom} constitue un pôle pivot national au Bénin pour ${selectedDept}. Cela permet de bénéficier des campagnes de vaccination subventionnées de l'État, d'un encadrement sanitaire privilégié et de protocoles éprouvés de réduction drastique de la mortalité.`
                                  : `L'élevage de ${elv.nom} à ${selectedDept} s'associe au développement de l'intégration agriculture-élevage pour valoriser les déchets de récolte bio et accroître durablement vos gains financiers.`
                                }
                              </p>
                            </div>
                          );
                        })()}

                        {/* Health and Prophylaxis recommendations */}
                        <div className="space-y-2 pt-1">
                          <h4 className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1 font-mono">
                            <HeartPulse className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>Prophylaxie Naturelle & Hygiène Songhaï</span>
                          </h4>
                          <ul className="list-disc pl-5 text-[11.5px] text-slate-600 space-y-1.5">
                            {elv.conseilsSante.map((tip: any, idx: number) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRedirectToAgribot(`Proposez-moi un plan de vaccination et d'alimentation complet sur ${elv.cycle} pour un élevage de ${elv.nom} dans le département de ${selectedDept} en intégrant les remèdes traditionnels béninois.`)}
                          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 transition rounded-xl text-[10.5px] font-bold text-emerald-805 flex items-center justify-center gap-1 border border-emerald-150 cursor-pointer"
                        >
                          <span>Consulter le cahier d'alimentation et vaccinal pour cet élevage</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {activeSegment === "cosmetic" && (
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                💡 Sélectionnez une transformation pour voir sa fiche technique ({currentZone.transformations.length} disponibles) :
              </span>
              {currentZone.transformations.length === 0 ? (
                <div className="bg-slate-50 border p-8 rounded-3xl text-center text-slate-400">
                  Aucune fiche disponible pour ce département
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {currentZone.transformations.map((trans: any) => {
                      const isSelected = selectedTransformationName === trans.nom;
                      const emoji = getIconForSpeculation(trans.nom);
                      return (
                        <div 
                          key={trans.nom} 
                          className={`rounded-2xl p-3 border transition active:scale-95 cursor-pointer flex items-center gap-3 ${
                            isSelected 
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                              : "bg-white border-slate-105 hover:bg-purple-50 text-slate-800"
                          }`}
                          onClick={() => setSelectedTransformationName(trans.nom)}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-white/20" : "bg-purple-100/50"
                          }`}>
                            <span className="text-xl">{emoji}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs truncate leading-tight">{trans.nom}</div>
                            <div className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"} truncate mt-0.5`}>{trans.usage}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {currentZone.transformations.map((trans: any, i: number) => {
                    if (trans.nom !== selectedTransformationName) return null;
                    return (
                      <div key={i} className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-5 space-y-4 transition hover:border-emerald-250">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className={`border ${
                              trans.usage === "cosmétique" ? "bg-purple-50 border-purple-200 text-purple-800" : "bg-amber-50 border-amber-200 text-amber-800"
                            } text-[9px] font-black font-mono px-2 py-0.5 rounded uppercase`}>
                              {trans.usage} - {selectedDept}
                            </span>
                            <h3 className="text-base font-black text-slate-800 mt-1">{trans.nom}</h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Matière première brute engagée : <strong className="text-slate-700 font-mono font-bold text-indigo-900">{trans.matierePremiere}</strong>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-semibold text-slate-400 font-mono">Taux Extraction</div>
                            <div className="text-xs font-black text-purple-700 font-mono">{trans.rendementPercent}%</div>
                          </div>
                        </div>

                        {/* Technical Transformation specs metrics */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 grid grid-cols-2 gap-4 text-[11px] font-mono shadow-3xs">
                          <div>
                            <h5 className="text-[9.5px] text-slate-400 font-bold uppercase font-sans mb-1">Pertes Opérationnelles</h5>
                            <ul className="space-y-0.5 text-zinc-650 font-medium font-mono">
                              <li>Épluchage & Triage : {trans.perteEpluchage}%</li>
                              <li>Extraction / Pressage : {trans.pertePressage}%</li>
                              <li>Séchage / Cuisson : {trans.perteCuisson}%</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-[9.5px] text-slate-400 font-bold uppercase font-sans mb-1">Indicateurs Économiques</h5>
                            <ul className="space-y-0.5 text-zinc-650 font-medium font-mono">
                              <li>Prix MP : {trans.prixMatiereBruteKg} F/kg</li>
                              <li>Prix Vente Fini : <strong className="text-emerald-800 font-black">{trans.prixVenteKg} F/kg</strong></li>
                              <li>Main d'œuvre : {trans.laborCost.toLocaleString()} F</li>
                            </ul>
                          </div>
                        </div>

                        {/* TRANSFORMATIONS FLAGSHIP STRATEGY IN BENIN */}
                        {(() => {
                          const isFilierePhareTransfVal = filieres.transf.some(t => 
                            t.toLowerCase().includes(trans.nom.toLowerCase()) || 
                            trans.nom.toLowerCase().includes(t.toLowerCase())
                          );
                          return (
                            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                              isFilierePhareTransfVal 
                                ? "bg-amber-500/5 border-amber-500/20 text-slate-805" 
                                : "bg-teal-500/5 border-teal-500/10 text-slate-800"
                            }`}>
                              <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                                <span className="font-black font-display uppercase tracking-wider text-[10px] text-slate-700">
                                  {isFilierePhareTransfVal ? "🏆 AGRO-TRANSFORMATION PRIORITAIRE MAEP" : "🧴 PROMOTION DE L'AGRO-INDUSTRIE LOCALE"}
                                </span>
                              </div>
                              <p className="text-[11px] sm:text-[11.5px] text-slate-600 leading-normal">
                                {isFilierePhareTransfVal 
                                  ? `Cette activité de ${trans.nom} est répertoriée comme filière prioritaire de valorisation endogène à ${selectedDept}. Cela facilite l'obtention de certifications d'origine béninoise, de subventions de petits équipements d'extraction et un accès privilégié aux comptoirs d'exportation.`
                                  : `La transformation artisanale et semi-industrielle de ${trans.nom} favorise l'indépendance économique des ménages à ${selectedDept} en transformant localement les excédents pour maximiser la valeur ajoutée.`
                                }
                              </p>
                            </div>
                          );
                        })()}

                        {/* Technical description of usage */}
                        <div className="space-y-1 bg-purple-50/20 p-3 rounded-xl border border-purple-100/50">
                          <span className="text-[9.5px] font-black uppercase tracking-wider text-purple-800 block font-mono">Usage & Certification Maraîchère</span>
                          <p className="text-[11.5px] text-slate-600 leading-relaxed">
                            Cette transformation agro-cosmétique valorise les ressources endogènes locales ({trans.matierePremiere}) pour stimuler l'économie circulaire béninoise. Utilise des conditionnements biodégradables recyclables.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRedirectToAgribot(`S'il vous plaît, expliquez-moi étape par étape le procédé d'extraction pour le produit de transformation suivant : ${trans.nom}. Calculez les rendements intermédiaires et le coût d'achat par tonne de matière organique sèche.`)}
                          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 transition rounded-xl text-[10.5px] font-bold text-emerald-800 flex items-center justify-center gap-1 border border-emerald-150 cursor-pointer"
                        >
                          <span>Consulter le guide complet d'extraction et de fabrication</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {activeSegment === "vegetal" && currentZone.cultures.length === 0 && (
            <div className="bg-slate-50 border p-8 rounded-3xl text-center text-slate-400">
              Aucune fiche technique végétale pour cette zone.
            </div>
          )}

        </div>

        {/* Custom additions panel forwarding to AgriBot */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-5 h-fit space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 text-slate-800">
            <PlusCircle className="h-5 w-5 text-emerald-600 shrink-0 animate-pulse" />
            <h3 className="text-xs font-black font-display uppercase tracking-wider">
              Spéculation sur Mesure
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Vous cultivez ou élevez une spéculation non listée (ex: mangue séchée, amarante de saison, paille de riz brut, compost) pour {selectedDept} ? Décrivez vos symptômes ou besoins pour obtenir des conseils INRAB / Songhaï exclusifs.
          </p>

          <form onSubmit={handleSubmitCustomSpec} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Nom de la spéculation :</label>
              <input
                type="text"
                required
                placeholder="Ex: Beurre de Karité de Kandi"
                maxLength={40}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                value={customSpecName}
                onChange={(e) => setCustomSpecName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Contexte & symptômes :</label>
              <textarea
                rows={4}
                required
                placeholder="Ex : Je souhaite connaître les intrants nécessaires, le coût exact d'extraction et comment traiter biologiquement le mildiou."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none transition resize-none"
                value={customSpecContext}
                onChange={(e) => setCustomSpecContext(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Générer Itinéraire de Spéculation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-[10.5px] text-emerald-850 leading-relaxed font-sans">
            📌 <strong>Coopération Technique :</strong> Notre assistant de pointe <strong>Agribot IA 🧠</strong> fusionne instantanément les bases de données de l'INRAB, du MAEP, et les principes du Centre Songhaï Porto-Novo pour vous répondre sans délai.
          </div>
        </div>

      </div>

      {/* Absolute Modal for Admin Crop Scale Configuration */}
      {editingCulture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 max-w-lg w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setEditingCulture(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-100 text-amber-700">
                <Edit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Ajuster le Barème Officiel
                </h3>
                <p className="text-xs text-slate-500">
                  Culture : {editingCulture.nom} ({selectedDept})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Rendement Moyen (kg/m²) :</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-amber-500 focus:outline-none transition font-mono"
                    value={editYield}
                    onChange={(e) => setEditYield(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Prix du Marché (FCFA/kg) :</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-amber-500 focus:outline-none transition font-mono"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Cycle (jours) :</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-amber-500 focus:outline-none transition font-mono"
                    value={editCycle}
                    onChange={(e) => setEditCycle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Semis (période) :</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-amber-500 focus:outline-none transition font-mono"
                    value={editSemis}
                    onChange={(e) => setEditSemis(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Coûts Opérationnels estimatifs par HA :</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Semences (FCFA/ha) :</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:border-amber-500 focus:outline-none font-mono"
                      value={editSeedCost}
                      onChange={(e) => setEditSeedCost(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Engrais (FCFA/ha) :</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:border-amber-500 focus:outline-none font-mono"
                      value={editEngraisCost}
                      onChange={(e) => setEditEngraisCost(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Main d'œuvre :</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:border-amber-500 focus:outline-none font-mono"
                      value={editLaborCost}
                      onChange={(e) => setEditLaborCost(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <div className={`p-3 rounded-xl text-xs font-bold ${saveSuccess.startsWith("❌") ? "bg-red-50 text-red-800 border border-red-100" : "bg-emerald-50 text-emerald-800 border border-emerald-100 animate-bounce"}`}>
                  {saveSuccess}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCulture(null)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Sauvegarde..." : "Enregistrer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY INTERACTIF DÉTAILLÉ DE LA FILIÈRE PHARE CIBLÉE */}
      {selectedFiliere && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in animate-duration-150">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-xl w-full shadow-2xl overflow-hidden self-center animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedFiliere.emoji}</span>
                <div>
                  <h3 className="text-xs sm:text-xs font-black uppercase tracking-wider font-display text-white">
                    {selectedFiliere.titre}
                  </h3>
                  <span className="text-[9px] font-mono tracking-widest text-amber-150 uppercase block font-medium">Directives Nationales d'Innovation MAEP / ATDA</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFiliere(null)}
                className="bg-white/10 hover:bg-white/25 hover:scale-105 p-2 rounded-full transition cursor-pointer text-white"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body content */}
            <div className="p-5.5 space-y-4 max-h-[75vh] overflow-y-auto text-xs leading-relaxed text-slate-705">
              
              <div className="space-y-1 bg-amber-500/5 p-4 rounded-xl border border-amber-500/15">
                <span className="text-[9px] uppercase font-black text-amber-80 * font-mono tracking-wider block">📋 Importance et Rôle au Bénin :</span>
                <p className="text-slate-850 font-medium font-sans leading-relaxed">{selectedFiliere.role}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-zinc-50 border border-slate-200/50 rounded-xl space-y-0.5">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 font-mono tracking-wider block">📈 Rendement Référence :</span>
                  <strong className="text-slate-800 font-extrabold font-display leading-tight">{selectedFiliere.rendementRef}</strong>
                </div>

                <div className="p-3 bg-zinc-50 border border-slate-200/50 rounded-xl space-y-0.5">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 font-mono tracking-wider block">⏱️ Cycle Technique :</span>
                  <strong className="text-slate-800 font-extrabold font-display leading-tight">{selectedFiliere.cycle}</strong>
                </div>

                <div className="p-3 bg-zinc-50 border border-slate-200/50 rounded-xl space-y-0.5 col-span-1 sm:col-span-2">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 font-mono tracking-wider block">🌱 Sols Propices de Culture :</span>
                  <p className="text-slate-700 font-medium font-mono leading-tight">{selectedFiliere.meilleursSols}</p>
                </div>

                <div className="p-3 bg-zinc-50 border border-slate-200/50 rounded-xl space-y-0.5 col-span-1 sm:col-span-2">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 font-mono tracking-wider block">🧪 Fertilisation Idéale :</span>
                  <p className="text-slate-700 font-medium font-mono leading-tight">{selectedFiliere.fertilisation}</p>
                </div>
              </div>

              <div className="space-y-1 p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                <span className="text-[9px] uppercase font-black text-emerald-800 font-mono tracking-wider block">💡 Itinéraire Technique Recommandé :</span>
                <p className="text-slate-75 * font-semibold leading-relaxed">{selectedFiliere.conseilPro}</p>
              </div>

              {selectedFiliere.exportTrend && (
                <div className="space-y-1 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                  <span className="text-[9px] uppercase font-black text-teal-800 font-mono tracking-wider block">💼 Chaîne de Valeur & GDIZ Industrie :</span>
                  <p className="text-teal-900 font-medium leading-relaxed">{selectedFiliere.exportTrend}</p>
                </div>
              )}

              {/* Action Redirection inside modal */}
              <button
                type="button"
                onClick={() => {
                  onRedirectToAgribot(`S'il te plaît, donne-moi toutes les astuces techniques sur la filière ${selectedFiliere.nom} pour obtenir un rendement exceptionnel au Bénin !`);
                  setSelectedFiliere(null);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black uppercase text-[10px] tracking-wider rounded-xl transition hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <span>Fiche d'Écriture : Consulter Agribot pour les intrants</span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
