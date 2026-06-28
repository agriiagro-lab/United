export interface SpeculationCulture {
  nom: string;
  cycle: string;
  rendementMoyen: number; // in kg per m²
  prixKgMoy: number; // in F CFA
  periodeSemis: string;
  itineraire: string[];
  maladies: Array<{ nom: string; remede: string }>;
  semencesCost: number; // in F CFA per 500 m²
  engraisCost: number; // in F CFA per 500 m²
  mainOeuvreCost: number; // in F CFA per 500 m²
}

export interface SpeculationElevage {
  nom: string;
  cycle: string;
  tailleOptionelle: number; // default stock
  prixAchatUnitaire: number; // F CFA
  mortaliteType: number; // %
  poidsVenteMoyen: number; // kg per subject
  prixVenteUnitaire: number; // F CFA
  alimentSoinCost: number; // F CFA for typical stock
  mainOeuvreCost: number; // F CFA
  conseilsSante: string[];
}

export interface SpeculationTransformation {
  nom: string;
  matierePremiere: string;
  rendementPercent: number; // product dry yield %
  prixMatiereBruteKg: number; // F CFA per kg
  perteEpluchage: number; // %
  pertePressage: number; // %
  perteCuisson: number; // %
  prixVenteKg: number; // F CFA
  packagingCost: number; // F CFA per 1ton
  machineryCost: number; // F CFA per 1ton
  laborCost: number; // F CFA
  usage: "alimentaire" | "cosmétique";
}

export interface AgroEcologicalZone {
  zone_id: string;
  nom: string;
  departements: string[];
  climat: string;
  sols: string;
  pluviometrie: string;
  cultures: SpeculationCulture[];
  elevages: SpeculationElevage[];
  transformations: SpeculationTransformation[];
}

export const ZONES_AGRECOLOGIQUES_BENIN: AgroEcologicalZone[] = [
  {
    zone_id: "ZA7",
    nom: "Extrême Nord + Zone cotonnière Nord (Alibori)",
    departements: ["Alibori"],
    climat: "Soudano-Sahélien, climat sec avec Harmattan féroce",
    sols: "Sols sableux légers de plaine de l'Alibori, limoneux érodés",
    pluviometrie: "700 - 900 mm/an",
    cultures: [
      {
        nom: "Mil Résistant de Kandi",
        cycle: "90 jours",
        rendementMoyen: 1.5,
        prixKgMoy: 280,
        periodeSemis: "Juin",
        itineraire: [
          "Labour léger superficiel du sol sablonneux",
          "Semis direct en poquets distants de 45 cm",
          "Sarclage précoce pré-tallage face aux adventices"
        ],
        maladies: [
          { nom: "Mildiou racinaire du mil", remede: "Traitement de semenceaux à la décoction d'ail et cendre de karité sauvage" }
        ],
        semencesCost: 4000,
        engraisCost: 6000,
        mainOeuvreCost: 9500
      },
      {
        nom: "Sorgho Rouge local",
        cycle: "110 jours",
        rendementMoyen: 1.9,
        prixKgMoy: 310,
        periodeSemis: "Juin-Juillet",
        itineraire: [
          "Trace de micro-cuvettes de rétention d'eau",
          "Fumage organique à la fiente de volaille de brousse",
          "Buttage à 40 jours pour stimuler l'ancrage"
        ],
        maladies: [
          { nom: "Charbon du grain", remede: "Tremper les futurs semis dans du macérat d'arbre de neem" }
        ],
        semencesCost: 4500,
        engraisCost: 8000,
        mainOeuvreCost: 11000
      },
      {
        nom: "Maïs Blanc Vivrier du Nord",
        cycle: "95 jours",
        rendementMoyen: 2.2,
        prixKgMoy: 290,
        periodeSemis: "Mai-Juin",
        itineraire: [
          "Ameublissement du sol au premier passage des pluies",
          "Apport ciblé de l'urée au 20ème jour"
        ],
        maladies: [
          { nom: "Sclérotiniose", remede: "Arrachage immédiat du plant malade et drainage" }
        ],
        semencesCost: 6000,
        engraisCost: 14000,
        mainOeuvreCost: 13000
      },
      {
        nom: "Riz Décortiqué Sèmè",
        cycle: "120 jours",
        rendementMoyen: 3.8,
        prixKgMoy: 390,
        periodeSemis: "Mai",
        itineraire: [
          "Maintien de la nappe superficielle",
          "Désherbage rigoureux toutes les 3 semaines"
        ],
        maladies: [
          { nom: "Pyriculariose foliaire", remede: "Pulvérisation préventive de macérat d'eucalyptus" }
        ],
        semencesCost: 11000,
        engraisCost: 26000,
        mainOeuvreCost: 18000
      },
      {
        nom: "Oignon Jaune de Galmi",
        cycle: "120 jours",
        rendementMoyen: 3.5,
        prixKgMoy: 550,
        periodeSemis: "Octobre à Décembre (Pépinière)",
        itineraire: [
          "Pépinière sous ombrage biologique",
          "Repiquage des bulbes vigoureux sur planches sablo-limoneuses",
          "Irrigation régulière par mottes"
        ],
        maladies: [
          { nom: "Mildious de l'oignon", remede: "Pulvériser une solution diluée de bicarbonate ou de cendre fine" }
        ],
        semencesCost: 12000,
        engraisCost: 19000,
        mainOeuvreCost: 15000
      },
      {
        nom: "Niébé Kandi",
        cycle: "75 jours",
        rendementMoyen: 1.3,
        prixKgMoy: 450,
        periodeSemis: "Juillet",
        itineraire: [
          "Semis sur lignes de billons",
          "Buretage de protection des gousses à la cendre"
        ],
        maladies: [
          { nom: "Bruche du niébé", remede: "Poudrage au piment fort séché dans les stocks hermétiques" }
        ],
        semencesCost: 5000,
        engraisCost: 4000,
        mainOeuvreCost: 8000
      },
      {
        nom: "Arachide du Nord",
        cycle: "95 jours",
        rendementMoyen: 2.1,
        prixKgMoy: 600,
        periodeSemis: "Mai",
        itineraire: [
          "Sols légers pour faciliter la pénétration des piquets",
          "Labour superficiel"
        ],
        maladies: [
          { nom: "Cercosporiose (taches jaunes)", remede: "Brûler les fanes de récoltes précédentes" }
        ],
        semencesCost: 8000,
        engraisCost: 7500,
        mainOeuvreCost: 12000
      },
      {
        nom: "Sésame Blanc de Banikoara",
        cycle: "110 jours",
        rendementMoyen: 0.9,
        prixKgMoy: 950,
        periodeSemis: "Juillet-Août",
        itineraire: [
          "Labour très aéré et semis peu profond (1cm)",
          "Éclaircissage méticuleux à 2 semaines"
        ],
        maladies: [
          { nom: "Tétranyques rouges", remede: "Pulvérisation d'eau savonneuse mélangée à de l'extrait de menthe sauvage" }
        ],
        semencesCost: 3500,
        engraisCost: 5000,
        mainOeuvreCost: 11000
      },
      {
        nom: "Pastèque Juteuse Alibori",
        cycle: "85 jours",
        rendementMoyen: 4.8,
        prixKgMoy: 180,
        periodeSemis: "Janvier (contresaison) ou Juillet",
        itineraire: [
          "Cuvettes espacées de 1.5m",
          "Apport de fientes et paillage du collet"
        ],
        maladies: [
          { nom: "Fusariose de la pastèque", remede: "Rotation culturale longue intercalée de mil rustique" }
        ],
        semencesCost: 9000,
        engraisCost: 14000,
        mainOeuvreCost: 13000
      },
      {
        nom: "Coton Blanc de Banikoara",
        cycle: "150 jours",
        rendementMoyen: 1.8,
        prixKgMoy: 310,
        periodeSemis: "Juin",
        itineraire: [
          "Labour profond motorisé ou attelé",
          "Regroupement des poquets et démariage précoce",
          "Fertilisation NPK certifiée par grappe"
        ],
        maladies: [
          { nom: "Chenille légionnaire du coton", remede: "Pulvérisation d'extraits d'ail dilués et purin de neem sauvage" }
        ],
        semencesCost: 8000,
        engraisCost: 35000,
        mainOeuvreCost: 22000
      }
    ],
    elevages: [
      {
        nom: "Bovin transhumant Goudali",
        cycle: "365 jours",
        tailleOptionelle: 30,
        prixAchatUnitaire: 140000,
        mortaliteType: 3,
        poidsVenteMoyen: 220,
        prixVenteUnitaire: 340000,
        alimentSoinCost: 550000,
        mainOeuvreCost: 180000,
        conseilsSante: [
          "Déparasitage récurrent et vaccination contre la péripneumonie bovine",
          "Alimentation d'appoint en tourteaux de coton et blocs de léchage saline"
        ]
      },
      {
        nom: "Ovin Djallonké de brousse",
        cycle: "180 jours",
        tailleOptionelle: 60,
        prixAchatUnitaire: 18000,
        mortaliteType: 5,
        poidsVenteMoyen: 25,
        prixVenteUnitaire: 55000,
        alimentSoinCost: 180000,
        mainOeuvreCost: 75000,
        conseilsSante: [
          "Surveillance de la piétine en période de pluies et poudrage à la chaux",
          "Alimentation riche en fanes d'arachides et résidus de mil"
        ]
      },
      {
        nom: "Caprin du Sahel de l'Alibori",
        cycle: "180 jours",
        tailleOptionelle: 50,
        prixAchatUnitaire: 12000,
        mortaliteType: 4,
        poidsVenteMoyen: 18,
        prixVenteUnitaire: 30000,
        alimentSoinCost: 110000,
        mainOeuvreCost: 60000,
        conseilsSante: [
          "Distribution de blocs salins minéraux",
          "Administration bimensuelle d'extraits amers de goyavier"
        ]
      },
      {
        nom: "Apiculture Sauvage des Savanes",
        cycle: "180 jours",
        tailleOptionelle: 20,
        prixAchatUnitaire: 5000,
        mortaliteType: 2,
        poidsVenteMoyen: 15,
        prixVenteUnitaire: 3000,
        alimentSoinCost: 15000,
        mainOeuvreCost: 30000,
        conseilsSante: [
          "Suspension des ruches à l'aide de fils graissés de pétrole lourd pour stopper les fourmis",
          "Élagage de protection périphérique contre les feux de brousse"
        ]
      }
    ],
    transformations: [
      {
        nom: "Décorticage de Riz local",
        matierePremiere: "Riz Paddy brut",
        rendementPercent: 68,
        prixMatiereBruteKg: 210,
        perteEpluchage: 28,
        pertePressage: 0,
        perteCuisson: 4,
        prixVenteKg: 490,
        packagingCost: 25000,
        machineryCost: 20000,
        laborCost: 30000,
        usage: "alimentaire"
      },
      {
        nom: "Wagashi traditionnel de Kandi",
        matierePremiere: "Lait frais de vache Goudali",
        rendementPercent: 18,
        prixMatiereBruteKg: 400,
        perteEpluchage: 0,
        pertePressage: 32,
        perteCuisson: 50,
        prixVenteKg: 2400,
        packagingCost: 15000,
        machineryCost: 12000,
        laborCost: 35000,
        usage: "alimentaire"
      },
      {
        nom: "Sélection et Séchage d'Oignons",
        matierePremiere: "Oignons frais bruts",
        rendementPercent: 12,
        prixMatiereBruteKg: 350,
        perteEpluchage: 18,
        pertePressage: 0,
        perteCuisson: 70,
        prixVenteKg: 2600,
        packagingCost: 15000,
        machineryCost: 10000,
        laborCost: 18000,
        usage: "alimentaire"
      },
      {
        nom: "Beurre de Karité brut purifié",
        matierePremiere: "Amandes de Karité sèches",
        rendementPercent: 40,
        prixMatiereBruteKg: 280,
        perteEpluchage: 12,
        pertePressage: 23,
        perteCuisson: 25,
        prixVenteKg: 1500,
        packagingCost: 18000,
        machineryCost: 15000,
        laborCost: 40000,
        usage: "cosmétique"
      },
      {
        nom: "Savon Noir artisanal au Karité",
        matierePremiere: "Résidus de Karité hydrolysés",
        rendementPercent: 82,
        prixMatiereBruteKg: 350,
        perteEpluchage: 0,
        pertePressage: 5,
        perteCuisson: 13,
        prixVenteKg: 1200,
        packagingCost: 25000,
        machineryCost: 10000,
        laborCost: 30000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA8",
    nom: "Zone cotonnière Nord + Ouest-Atacora (Atacora)",
    departements: ["Atacora"],
    climat: "Soudano-guinéen frais de montagne rocheuse",
    sols: "Argilo-sableux gravillonnaires de montagne de l'Atacora",
    pluviometrie: "950 - 1100 mm/an",
    cultures: [
      {
        nom: "Sorgho d'Atacora sauvage",
        cycle: "105 jours",
        rendementMoyen: 1.7,
        prixKgMoy: 300,
        periodeSemis: "Juin",
        itineraire: [
          "Trace de micro-digues sur les contreforts inclinés",
          "Semis croisé en poquets légers de paille"
        ],
        maladies: [
          { nom: "Charbon du grain du sorgho", remede: "Selection des semences bio sans humidité" }
        ],
        semencesCost: 5000,
        engraisCost: 9000,
        mainOeuvreCost: 12000
      },
      {
        nom: "Fonio Indigène de l'Atacora",
        cycle: "90 jours",
        rendementMoyen: 1.6,
        prixKgMoy: 720,
        periodeSemis: "Mai-Juin",
        itineraire: [
          "Ameublissement superficiel de la couche pierreuse",
          "Semis à la volée très dense",
          "Récolte soignée à la faucille manuelle"
        ],
        maladies: [
          { nom: "Rouille jaune", remede: "Bonne exposition au soleil et élimination des foyers humides" }
        ],
        semencesCost: 6500,
        engraisCost: 5000,
        mainOeuvreCost: 14000
      },
      {
        nom: "Anacarde Élite (Cajou)",
        cycle: "365 jours",
        rendementMoyen: 1.2,
        prixKgMoy: 450,
        periodeSemis: "Juin-Juillet (Plantation)",
        itineraire: [
          "Creusement de fosses de 40x40x40cm enrichies de compost",
          "Paillage permanent au pied face aux vents chauds",
          "Taille d'entretien des bourgeons du bas"
        ],
        maladies: [
          { nom: "Anthracnose de l'anacardier", remede: "Pulvérisation d'extraits d'écorces herbeuses mélangés au savon" }
        ],
        semencesCost: 12000,
        engraisCost: 11000,
        mainOeuvreCost: 17500
      },
      {
        nom: "Niébé des Collines",
        cycle: "75 jours",
        rendementMoyen: 1.4,
        prixKgMoy: 480,
        periodeSemis: "Juillet",
        itineraire: [
          "Buttage bas et semis unitaire",
          "Récolte dès le jaunissement total des gousses"
        ],
        maladies: [
          { nom: "Bruche de stockage", remede: "Utiliser de la poudre d'argile dans les jarres de conservation" }
        ],
        semencesCost: 5500,
        engraisCost: 6000,
        mainOeuvreCost: 9000
      },
      {
        nom: "Patate Douce d'Atacora",
        cycle: "120 jours",
        rendementMoyen: 2.8,
        prixKgMoy: 220,
        periodeSemis: "Mars-Avril",
        itineraire: [
          "Tranchées de buttes ameublies",
          "Apport de cendre de bois tamisée"
        ],
        maladies: [
          { nom: "Pourriture noire des tubercules", remede: "Rotation culturale stricte et séchage" }
        ],
        semencesCost: 7000,
        engraisCost: 8500,
        mainOeuvreCost: 11000
      },
      {
        nom: "Voandzou d'Atacora (Pois Bambara)",
        cycle: "110 jours",
        rendementMoyen: 1.3,
        prixKgMoy: 620,
        periodeSemis: "Juin",
        itineraire: [
          "Semis direct sur billons horizontaux",
          "Buttage léger lors du début de la floraison"
        ],
        maladies: [
          { nom: "Pourriture de collet", remede: "Drainage parfait des eaux stagnantes et poudrage à la cendre" }
        ],
        semencesCost: 6000,
        engraisCost: 4500,
        mainOeuvreCost: 9500
      }
    ],
    elevages: [
      {
        nom: "Apiculture Élite de l'Atacora",
        cycle: "365 jours",
        tailleOptionelle: 30,
        prixAchatUnitaire: 6500,
        mortaliteType: 2,
        poidsVenteMoyen: 18,
        prixVenteUnitaire: 3000,
        alimentSoinCost: 20000,
        mainOeuvreCost: 55000,
        conseilsSante: [
          "Éviter les feux de brousse à moins de 500m des ruchers montagneux",
          "Remplir les supports de ruche avec du goudron protecteur"
        ]
      },
      {
        nom: "Porcelet de chair Atacora",
        cycle: "210 jours",
        tailleOptionelle: 15,
        prixAchatUnitaire: 12000,
        mortaliteType: 6,
        poidsVenteMoyen: 85,
        prixVenteUnitaire: 90000,
        alimentSoinCost: 380000,
        mainOeuvreCost: 90000,
        conseilsSante: [
          "Vermifugation au moyen de plantes locales amères séchées",
          "Nettoyage des étables au savon de neem hebdomadaire"
        ]
      }
    ],
    transformations: [
      {
        nom: "Foutou et Cossettes d'Igname",
        matierePremiere: "Igname fraîche rustique",
        rendementPercent: 26,
        prixMatiereBruteKg: 180,
        perteEpluchage: 18,
        pertePressage: 0,
        perteCuisson: 56,
        prixVenteKg: 1000,
        packagingCost: 15000,
        machineryCost: 18000,
        laborCost: 26000,
        usage: "alimentaire"
      },
      {
        nom: "Noix de Cajou décortiquées bio",
        matierePremiere: "Brutes d'anacarde",
        rendementPercent: 23,
        prixMatiereBruteKg: 420,
        perteEpluchage: 45,
        pertePressage: 5,
        perteCuisson: 27,
        prixVenteKg: 4500,
        packagingCost: 45000,
        machineryCost: 35000,
        laborCost: 55000,
        usage: "alimentaire"
      },
      {
        nom: "Vin de sorgho (Tchoukoutou)",
        matierePremiere: "Grains de sorgho rouge",
        rendementPercent: 75,
        prixMatiereBruteKg: 280,
        perteEpluchage: 0,
        pertePressage: 10,
        perteCuisson: 15,
        prixVenteKg: 650,
        packagingCost: 12000,
        machineryCost: 8000,
        laborCost: 18000,
        usage: "alimentaire"
      },
      {
        nom: "Miel d'Atacora filtré",
        matierePremiere: "Haches de rayons de ruche",
        rendementPercent: 88,
        prixMatiereBruteKg: 1400,
        perteEpluchage: 2,
        pertePressage: 10,
        perteCuisson: 0,
        prixVenteKg: 3500,
        packagingCost: 25000,
        machineryCost: 12000,
        laborCost: 20000,
        usage: "alimentaire"
      },
      {
        nom: "Huile de Cajou noble",
        matierePremiere: "Amandes de cajou brisées",
        rendementPercent: 18,
        prixMatiereBruteKg: 850,
        perteEpluchage: 2,
        pertePressage: 72,
        perteCuisson: 8,
        prixVenteKg: 5000,
        packagingCost: 35000,
        machineryCost: 25000,
        laborCost: 45000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA6",
    nom: "Zone cotonnière Nord + Sud-Borgou + Centre-Bénin (Borgou)",
    departements: ["Borgou"],
    climat: "Soudanien tropical, dry et chaud en saison sèche",
    sols: "Ferrugineux profonds légers, argilo-sableux fertiles",
    pluviometrie: "850 - 1100 mm/an",
    cultures: [
      {
        nom: "Sorgho Rouge de Parakou",
        cycle: "110 jours",
        rendementMoyen: 2.1,
        prixKgMoy: 310,
        periodeSemis: "Juin à Juillet",
        itineraire: [
          "Labour des argiles après la première grande tornade",
          "Semis à 3 graines par poquet"
        ],
        maladies: [
          { nom: "Sorgho Puceron", remede: "Extrait fermenté de savon au neem aqueux" }
        ],
        semencesCost: 5500,
        engraisCost: 11000,
        mainOeuvreCost: 14500
      },
      {
        nom: "Maïs Blanc de Parakou",
        cycle: "100 jours",
        rendementMoyen: 2.6,
        prixKgMoy: 290,
        periodeSemis: "Mai-Juin",
        itineraire: [
          "NPK enfoui au 15ème jour",
          "Buttage lors du croisement des cannes"
        ],
        maladies: [
          { nom: "Sclerotium capsici", remede: "Application préventive de chaux sur le sol avant labour" }
        ],
        semencesCost: 6500,
        engraisCost: 15000,
        mainOeuvreCost: 12000
      },
      {
        nom: "Coton Borgou",
        cycle: "150 jours",
        rendementMoyen: 1.9,
        prixKgMoy: 310,
        periodeSemis: "Juin",
        itineraire: [
          "Pratique culturale intégrée",
          "Traitement insecticide programmé bio"
        ],
        maladies: [
          { nom: "Chenilles de capsule", remede: "Traitement biologique à l'huile de neem et piment dilué" }
        ],
        semencesCost: 8000,
        engraisCost: 32000,
        mainOeuvreCost: 24000
      },
      {
        nom: "Soja Graine Grain d'Or",
        cycle: "110 jours",
        rendementMoyen: 2.2,
        prixKgMoy: 390,
        periodeSemis: "Juin-Juillet",
        itineraire: [
          "Inoculant pour maximiser les nodosités fixatrices",
          "Premier désherbage mécanique à 15 jours"
        ],
        maladies: [
          { nom: "Mosaïque jaune", remede: "Arracher les sujets touchés dès l'apparition des marbrures" }
        ],
        semencesCost: 7500,
        engraisCost: 9500,
        mainOeuvreCost: 11000
      },
      {
        nom: "Arachide de Parakou",
        cycle: "95 jours",
        rendementMoyen: 2.2,
        prixKgMoy: 620,
        periodeSemis: "Mai",
        itineraire: [
          "Labour du sol meuble profond",
          "Biner fréquemment pré-fleur d'or"
        ],
        maladies: [
          { nom: "Rot racinaire", remede: "Éviter les sols à stagnation d'argile compacte" }
        ],
        semencesCost: 8500,
        engraisCost: 8000,
        mainOeuvreCost: 13000
      }
    ],
    elevages: [
      {
        nom: "Bovin d'embouche Borgou",
        cycle: "180 jours",
        tailleOptionelle: 20,
        prixAchatUnitaire: 100000,
        mortaliteType: 3,
        poidsVenteMoyen: 185,
        prixVenteUnitaire: 250000,
        alimentSoinCost: 380000,
        mainOeuvreCost: 130000,
        conseilsSante: [
          "Traitements antiparasitaires externes contre les tiques",
          "Alimenter au foin de Brachiaria séché"
        ]
      },
      {
        nom: "Volaille Goliath Parakou",
        cycle: "45 jours",
        tailleOptionelle: 500,
        prixAchatUnitaire: 650,
        mortaliteType: 7,
        poidsVenteMoyen: 2.2,
        prixVenteUnitaire: 3800,
        alimentSoinCost: 480000,
        mainOeuvreCost: 55000,
        conseilsSante: [
          "Prophylaxie au jus d'ail fermenté dans l'eau d'abreuvement",
          "Litière toujours sèche de copeaux de bois"
        ]
      }
    ],
    transformations: [
      {
        nom: "Trituration de Soja (Huile)",
        matierePremiere: "Grains de soja",
        rendementPercent: 18,
        prixMatiereBruteKg: 350,
        perteEpluchage: 2,
        pertePressage: 78,
        perteCuisson: 2,
        prixVenteKg: 1200,
        packagingCost: 40000,
        machineryCost: 30000,
        laborCost: 45000,
        usage: "alimentaire"
      },
      {
        nom: "Fromage de Wagashi artisanal",
        matierePremiere: "Lait frais de vache Peulh",
        rendementPercent: 16,
        prixMatiereBruteKg: 420,
        perteEpluchage: 0,
        pertePressage: 34,
        perteCuisson: 50,
        prixVenteKg: 2200,
        packagingCost: 15000,
        machineryCost: 10000,
        laborCost: 25000,
        usage: "alimentaire"
      },
      {
        nom: "Bière de mil locale (Tchouk)",
        matierePremiere: "Grain de mil indigène",
        rendementPercent: 70,
        prixMatiereBruteKg: 280,
        perteEpluchage: 0,
        pertePressage: 15,
        perteCuisson: 15,
        prixVenteKg: 600,
        packagingCost: 12000,
        machineryCost: 9000,
        laborCost: 16050,
        usage: "alimentaire"
      },
      {
        nom: "Huile de Coton raffinée",
        matierePremiere: "Graines de coton",
        rendementPercent: 15,
        prixMatiereBruteKg: 180,
        perteEpluchage: 0,
        pertePressage: 82,
        perteCuisson: 3,
        prixVenteKg: 1100,
        packagingCost: 30000,
        machineryCost: 25000,
        laborCost: 40000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA5",
    nom: "Ouest-Atacora + Sud-Borgou (Donga)",
    departements: ["Donga"],
    climat: "Soudano-guinéen de transition pluvieux",
    sols: "Sols gravillonnaires profonds, sablo-argileux",
    pluviometrie: "1000 - 1150 mm/an",
    cultures: [
      {
        nom: "Igname de Djougou (Boni)",
        cycle: "210 jours",
        rendementMoyen: 3.4,
        prixKgMoy: 350,
        periodeSemis: "Janvier (Buttage)",
        itineraire: [
          "Buttes de 40cm paillées de résidus forestiers",
          "Installation précoce des tuteurs de mil"
        ],
        maladies: [
          { nom: "Flétrissement fongique de la liane", remede: "Poudrage à la cendre du pied blessé avant montage" }
        ],
        semencesCost: 14000,
        engraisCost: 16000,
        mainOeuvreCost: 22005
      },
      {
        nom: "Soja standard de Djougou",
        cycle: "100 jours",
        rendementMoyen: 2.1,
        prixKgMoy: 370,
        periodeSemis: "Juin",
        itineraire: [
          "Ameublissement du sol lors du premier sarclage"
        ],
        maladies: [
          { nom: "Mosaique de feuille soja", remede: "Retrait sélectif des premiers plants déformés" }
        ],
        semencesCost: 7500,
        engraisCost: 10000,
        mainOeuvreCost: 12050
      },
      {
        nom: "Gombo local de Djougou",
        cycle: "70 jours",
        rendementMoyen: 2.5,
        prixKgMoy: 420,
        periodeSemis: "Mars ou Juillet",
        itineraire: [
          "Tremper les grains 12h",
          "Pincements à 35 jours pour ramification"
        ],
        maladies: [
          { nom: "Oïdium (poussière blanche)", remede: "Saupoudrer de la cendre de paille tôt le matin" }
        ],
        semencesCost: 4500,
        engraisCost: 11000,
        mainOeuvreCost: 10000
      }
    ],
    elevages: [
      {
        nom: "Bovin de garde de Djougou",
        cycle: "360 jours",
        tailleOptionelle: 12,
        prixAchatUnitaire: 115000,
        mortaliteType: 3,
        poidsVenteMoyen: 195,
        prixVenteUnitaire: 295000,
        alimentSoinCost: 460000,
        mainOeuvreCost: 175000,
        conseilsSante: [
          "Vaccination obligatoire contre le charbon symptomatique",
          "Vermifugation bimensuelle à la décoction amère de neem"
        ]
      }
    ],
    transformations: [
      {
        nom: "Gari fin de Djougou",
        matierePremiere: "Manioc brut",
        rendementPercent: 23,
        prixMatiereBruteKg: 110,
        perteEpluchage: 13,
        pertePressage: 16,
        perteCuisson: 8,
        prixVenteKg: 460,
        packagingCost: 28000,
        machineryCost: 18000,
        laborCost: 33000,
        usage: "alimentaire"
      },
      {
        nom: "Tapioca croquant",
        matierePremiere: "Manioc doux",
        rendementPercent: 12,
        prixMatiereBruteKg: 110,
        perteEpluchage: 15,
        pertePressage: 50,
        perteCuisson: 13,
        prixVenteKg: 850,
        packagingCost: 35000,
        machineryCost: 18000,
        laborCost: 30000,
        usage: "alimentaire"
      },
      {
        nom: "Baume au Karité pur de Djougou",
        matierePremiere: "Noix de Karité sauvages",
        rendementPercent: 42,
        prixMatiereBruteKg: 480,
        perteEpluchage: 15,
        pertePressage: 35,
        perteCuisson: 8,
        prixVenteKg: 2800,
        packagingCost: 35000,
        machineryCost: 15000,
        laborCost: 45000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA4b",
    nom: "Zone cotonnière Centre-Bénin (Collines)",
    departements: ["Collines"],
    climat: "Tropical de transition, deux saisons de pluies contrastées",
    sols: "Ferrugineux tropicaux lessivés profonds riches en terreau",
    pluviometrie: "950 - 1150 mm/an",
    cultures: [
      {
        nom: "Maïs Douceur des Collines",
        cycle: "95 jours",
        rendementMoyen: 2.4,
        prixKgMoy: 290,
        periodeSemis: "Avril et Septembre",
        itineraire: [
          "Semis après un labour soigné croisé",
          "Sarclage rigoureux à 20 et 45 jours"
        ],
        maladies: [
          { nom: "Rouille du maïs", remede: "Vaporiser des extraits d'eucalyptus" }
        ],
        semencesCost: 6000,
        engraisCost: 13000,
        mainOeuvreCost: 12000
      },
      {
        nom: "Igname de Savalou (Laboko)",
        cycle: "240 jours",
        rendementMoyen: 3.6,
        prixKgMoy: 375,
        periodeSemis: "Janvier",
        itineraire: [
          "Billons surélevés de 55cm au terreau forestier",
          "Tuteurages d'au moins 2.5m de haut"
        ],
        maladies: [
          { nom: "Pourriture blanche des racines", remede: "Poudrer à la cendre de paille avant empotage" }
        ],
        semencesCost: 15000,
        engraisCost: 17500,
        mainOeuvreCost: 24000
      },
      {
        nom: "Carotte Orange de Dassa",
        cycle: "90 jours",
        rendementMoyen: 2.8,
        prixKgMoy: 580,
        periodeSemis: "Juillet à Septembre",
        itineraire: [
          "Planches sableuses enrichies en compost tamisé",
          "Éclaircissage soigné au 15ème jour"
        ],
        maladies: [
          { nom: "Nématodes de la carotte", remede: "Culture intercalée d'œillets d'Inde (Tagetes)" }
        ],
        semencesCost: 7000,
        engraisCost: 13000,
        mainOeuvreCost: 12000
      }
    ],
    elevages: [
      {
        nom: "Ovin Djallonké de Dassa",
        cycle: "210 jours",
        tailleOptionelle: 35,
        prixAchatUnitaire: 21000,
        mortaliteType: 4,
        poidsVenteMoyen: 27,
        prixVenteUnitaire: 58000,
        alimentSoinCost: 130000,
        mainOeuvreCost: 50000,
        conseilsSante: [
          "Traitement du piétin à la cendre active",
          "Cures régulières de jus d'Ail dans les abreuvoirs"
        ]
      },
      {
        nom: "Pisciculture Tilapia Dassa",
        cycle: "180 jours",
        tailleOptionelle: 800,
        prixAchatUnitaire: 120,
        mortaliteType: 10,
        poidsVenteMoyen: 0.5,
        prixVenteUnitaire: 1900,
        alimentSoinCost: 310000,
        mainOeuvreCost: 70000,
        conseilsSante: [
          "Contrôle de l'ammoniac par aérations",
          "Utilisation d'extraits de papaye sauvage contre les mycoses"
        ]
      }
    ],
    transformations: [
      {
        nom: "Fromage de Soja (Tofu)",
        matierePremiere: "Grains de soja jaune",
        rendementPercent: 42,
        prixMatiereBruteKg: 380,
        perteEpluchage: 5,
        pertePressage: 38,
        perteCuisson: 15,
        prixVenteKg: 950,
        packagingCost: 20000,
        machineryCost: 12000,
        laborCost: 28000,
        usage: "alimentaire"
      },
      {
        nom: "Lait corporel enrichi au Karité",
        matierePremiere: "Beurre de karité filtré",
        rendementPercent: 82,
        prixMatiereBruteKg: 1100,
        perteEpluchage: 0,
        pertePressage: 5,
        perteCuisson: 13,
        prixVenteKg: 3500,
        packagingCost: 45000,
        machineryCost: 20000,
        laborCost: 45000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA4",
    nom: "Zone de transition Centre + Dépression (Zou)",
    departements: ["Zou"],
    climat: "Sub-équatorial de transition, deux saisons sèches modérées",
    sols: "Terre de barre et sols de bas-fonds limono-sableux",
    pluviometrie: "1000 - 1200 mm/an",
    cultures: [
      {
        nom: "Riz de Bas-fond Bohicon",
        cycle: "120 jours",
        rendementMoyen: 3.4,
        prixKgMoy: 370,
        periodeSemis: "Mai-Juin",
        itineraire: [
          "Bas-fonds aménagés en casiers",
          "Repiquage manuel de tiges saines"
        ],
        maladies: [
          { nom: "Flétrissement de feuille", remede: "Pulvériser une macération de cendre de bois" }
        ],
        semencesCost: 9500,
        engraisCost: 20000,
        mainOeuvreCost: 18000
      },
      {
        nom: "Piment Habanero d'Abomey",
        cycle: "125 jours",
        rendementMoyen: 2.1,
        prixKgMoy: 780,
        periodeSemis: "Juillet",
        itineraire: [
          "Planches surélevées amendées de fientes",
          "Tuteurage obligatoire dès 1.2m"
        ],
        maladies: [
          { nom: "Mosaïque foliaire", remede: "Vaporiser de l'extrait aqueux de savon de neem bio" }
        ],
        semencesCost: 9000,
        engraisCost: 15000,
        mainOeuvreCost: 14000
      },
      {
        nom: "Manioc Doux d'Abomey",
        cycle: "11 mois",
        rendementMoyen: 4.1,
        prixKgMoy: 140,
        periodeSemis: "Avril-Mai",
        itineraire: [
          "Mottes épaisses distantes d'un mètre",
          "Lutte contre les herbes à 30 jours"
        ],
        maladies: [
          { nom: "Cochenilles farineuses", remede: "Traiter au savon noir de palme dilué à 5%" }
        ],
        semencesCost: 8000,
        engraisCost: 11000,
        mainOeuvreCost: 14000
      }
    ],
    elevages: [
      {
        nom: "Escargot Achatina (Héliciculture)",
        cycle: "180 jours",
        tailleOptionelle: 2000,
        prixAchatUnitaire: 50,
        mortaliteType: 5,
        poidsVenteMoyen: 0.12,
        prixVenteUnitaire: 400,
        alimentSoinCost: 60000,
        mainOeuvreCost: 45000,
        conseilsSante: [
          "Maintien strict de l'irrigabilité et ombrage de bananiers",
          "Saupoudrer du calcaire fin pour le renfort de coquille"
        ]
      },
      {
        nom: "Porc Large White d'Abomey",
        cycle: "210 days",
        tailleOptionelle: 20,
        prixAchatUnitaire: 14000,
        mortaliteType: 5,
        poidsVenteMoyen: 90,
        prixVenteUnitaire: 95000,
        alimentSoinCost: 420000,
        mainOeuvreCost: 85000,
        conseilsSante: [
          "Système de litière fermentaire pour filtrer l'ammoniac",
          "Déparasitage à l'aide de graines de courge séchées"
        ]
      }
    ],
    transformations: [
      {
        nom: "Gari Jaune à l'huile de palme",
        matierePremiere: "Manioc doux frais",
        rendementPercent: 24,
        prixMatiereBruteKg: 110,
        perteEpluchage: 14,
        pertePressage: 12,
        perteCuisson: 8,
        prixVenteKg: 490,
        packagingCost: 28000,
        machineryCost: 15000,
        laborCost: 35000,
        usage: "alimentaire"
      },
      {
        nom: "Tomate double concentré",
        matierePremiere: "Tomates fraîches locales",
        rendementPercent: 15,
        prixMatiereBruteKg: 180,
        perteEpluchage: 5,
        pertePressage: 40,
        perteCuisson: 40,
        prixVenteKg: 1450,
        packagingCost: 35000,
        machineryCost: 25000,
        laborCost: 40000,
        usage: "alimentaire"
      },
      {
        nom: "Huile de Neem pure",
        matierePremiere: "Graines de Neem sèches",
        rendementPercent: 20,
        prixMatiereBruteKg: 500,
        perteEpluchage: 5,
        pertePressage: 72,
        perteCuisson: 3,
        prixVenteKg: 3200,
        packagingCost: 45000,
        machineryCost: 30000,
        laborCost: 50000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA2",
    nom: "Terres de barre fertiles (Plateau)",
    departements: ["Plateau"],
    climat: "Sub-équatorial, deux saisons de pluie intenses",
    sols: "Ferrallitiques rouges briques profonds et fertiles",
    pluviometrie: "1100 - 1300 mm/an",
    cultures: [
      {
        nom: "Ananas Pain de Sucre Kétou",
        cycle: "450 jours",
        rendementMoyen: 4.8,
        prixKgMoy: 200,
        periodeSemis: "Avril",
        itineraire: [
          "Préparation de rejets vigoureux sikhs",
          "Paillage épais de graminées sauvages",
          "Désherbage méticuleux à 3 reprises"
        ],
        maladies: [
          { nom: "Flétrissement racinaire d'ananas", remede: "Application locale de compost de neem et cendre tamisée" }
        ],
        semencesCost: 12500,
        engraisCost: 22000,
        mainOeuvreCost: 18500
      },
      {
        nom: "Bananier Plantain Kétou",
        cycle: "360 jours",
        rendementMoyen: 3.8,
        prixKgMoy: 350,
        periodeSemis: "Avril-Mai (Cercle)",
        itineraire: [
          "Trous de plantation larges amendés",
          "Arrosage copieux pré-levée"
        ],
        maladies: [
          { nom: "Cercosporiose noire bananier", remede: "Coupe et brûlage des premières feuilles fanées au sol" }
        ],
        semencesCost: 15000,
        engraisCost: 16000,
        mainOeuvreCost: 14000
      },
      {
        nom: "Tomate de contre-saison Sakété",
        cycle: "95 jours",
        rendementMoyen: 3.6,
        prixKgMoy: 520,
        periodeSemis: "Novembre-Décembre",
        itineraire: [
          "Aménagement de rigoles d'évacuation d'eau",
          "Paillage et arrosage du matin"
        ],
        maladies: [
          { nom: "Anthracnose foliaire", remede: "Poudrage régulier avec de la cendre de bois desséchée" }
        ],
        semencesCost: 9000,
        engraisCost: 21000,
        mainOeuvreCost: 14000
      }
    ],
    elevages: [
      {
        nom: "Poules pondeuses rousses",
        cycle: "540 jours",
        tailleOptionelle: 500,
        prixAchatUnitaire: 900,
        mortaliteType: 5,
        poidsVenteMoyen: 1.8,
        prixVenteUnitaire: 3600,
        alimentSoinCost: 750000,
        mainOeuvreCost: 120000,
        conseilsSante: [
          "Prévenir le coryza par ajout d'extraits d'Aloe Vera tièdes",
          "Nettoyage quotidien du pondoir"
        ]
      }
    ],
    transformations: [
      {
        nom: "Jus d'Ananas pur filtré",
        matierePremiere: "Ananas Pain de Sucre Kétou bruts",
        rendementPercent: 62,
        prixMatiereBruteKg: 155,
        perteEpluchage: 23,
        pertePressage: 12,
        perteCuisson: 3,
        prixVenteKg: 750,
        packagingCost: 45000,
        machineryCost: 20000,
        laborCost: 35000,
        usage: "alimentaire"
      },
      {
        nom: "Huile de Palme rouge vierge",
        matierePremiere: "Fruits de Palmier à huile",
        rendementPercent: 19,
        prixMatiereBruteKg: 120,
        perteEpluchage: 18,
        pertePressage: 15,
        perteCuisson: 48,
        prixVenteKg: 1100,
        packagingCost: 30000,
        machineryCost: 25000,
        laborCost: 40000,
        usage: "alimentaire"
      },
      {
        nom: "Gommage cosmétique d'Ananas",
        matierePremiere: "Fibres et pulpes d'ananas recyclées",
        rendementPercent: 40,
        prixMatiereBruteKg: 100,
        perteEpluchage: 10,
        pertePressage: 45,
        perteCuisson: 5,
        prixVenteKg: 2000,
        packagingCost: 40000,
        machineryCost: 15000,
        laborCost: 30000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA2b",
    nom: "Terres de barre + Dépression + Pêcheries (Ouémé)",
    departements: ["Ouémé"],
    climat: "Sub-équatorial côtier doux et humide, deux saisons de pluies",
    sols: "Terre argilo-limoneuse fertile de vallée du fleuve Ouémé",
    pluviometrie: "1100 - 1300 mm/an",
    cultures: [
      {
        nom: "Maraîchage intensif Tomate Adjarra",
        cycle: "90 jours",
        rendementMoyen: 3.8,
        prixKgMoy: 480,
        periodeSemis: "Septembre à Décembre",
        itineraire: [
          "Lit de compostage de fientes avicoles",
          "Traitement antifongique du sol"
        ],
        maladies: [
          { nom: "Oïdium maraîcher", remede: "Vaporisation de soufre biologique liquide" }
        ],
        semencesCost: 8500,
        engraisCost: 23000,
        mainOeuvreCost: 15000
      },
      {
        nom: "Oignon Blanc d'Adjarra",
        cycle: "115 jours",
        rendementMoyen: 3.1,
        prixKgMoy: 590,
        periodeSemis: "Juillet-Août",
        itineraire: [
          "Semis soigné et repiquage espacé",
          "Buttage délicat des oignons"
        ],
        maladies: [
          { nom: "Excès d'humidité bulbe", remede: "Drainage surélevé obligatoire" }
        ],
        semencesCost: 11000,
        engraisCost: 18000,
        mainOeuvreCost: 13000
      },
      {
        nom: "Riz irrigué de la Vallée",
        cycle: "120 jours",
        rendementMoyen: 4.4,
        prixKgMoy: 375,
        periodeSemis: "Mai",
        itineraire: [
          "Repiquage croisé de 22cm",
          "Régulation continue de l'eau"
        ],
        maladies: [
          { nom: "Carence en zinc", remede: "Apport de compost enrichi d'argile active" }
        ],
        semencesCost: 13000,
        engraisCost: 28000,
        mainOeuvreCost: 20000
      }
    ],
    elevages: [
      {
        nom: "Canard Goliath d'Adjarra",
        cycle: "90 jours",
        tailleOptionelle: 300,
        prixAchatUnitaire: 800,
        mortaliteType: 6,
        poidsVenteMoyen: 2.8,
        prixVenteUnitaire: 4500,
        alimentSoinCost: 350000,
        mainOeuvreCost: 60000,
        conseilsSante: [
          "Accès à un bassin nettoyé tous les 10 jours",
          "Vermifugation de base au jus d'Ail"
        ]
      },
      {
        nom: "Pisciculture intensive Clarias",
        cycle: "150 jours",
        tailleOptionelle: 1000,
        prixAchatUnitaire: 120,
        mortaliteType: 8,
        poidsVenteMoyen: 0.9,
        prixVenteUnitaire: 2200,
        alimentSoinCost: 450000,
        mainOeuvreCost: 75000,
        conseilsSante: [
          "Changements d'eau programmés tous les 5 jours",
          "Bains rapides d'eau salée pré-repiquage"
        ]
      }
    ],
    transformations: [
      {
        nom: "Riz étuvé de Sèmè",
        matierePremiere: "Riz paddy propre",
        rendementPercent: 68,
        prixMatiereBruteKg: 240,
        perteEpluchage: 12,
        pertePressage: 0,
        perteCuisson: 20,
        prixVenteKg: 490,
        packagingCost: 25000,
        machineryCost: 15500,
        laborCost: 30000,
        usage: "alimentaire"
      },
      {
        nom: "Crème de beauté Orange & Coco",
        matierePremiere: "Extrait agrumes bio",
        rendementPercent: 80,
        prixMatiereBruteKg: 650,
        perteEpluchage: 15,
        pertePressage: 2,
        perteCuisson: 3,
        prixVenteKg: 3200,
        packagingCost: 45000,
        machineryCost: 18000,
        laborCost: 40000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA1",
    nom: "Dépression + Pêcheries (Atlantique)",
    departements: ["Atlantique"],
    climat: "Sub-équatorial, double saison humide et tempéré",
    sols: "Terre de barre et sols sablo-argileux fertiles d'Allada",
    pluviometrie: "1100 - 1350 mm/an",
    cultures: [
      {
        nom: "Ananas Pain de Sucre Allada",
        cycle: "420 jours",
        rendementMoyen: 5.2,
        prixKgMoy: 180,
        periodeSemis: "Mars-Avril",
        itineraire: [
          "Parcelles aérées, buttes bilingues de rejet",
          "Désherbage rigoureux"
        ],
        maladies: [
          { nom: "Flétrissement fongique cochenilles", remede: "Savon noir et jus de neem dilué à pulvériser" }
        ],
        semencesCost: 11000,
        engraisCost: 20000,
        mainOeuvreCost: 16000
      },
      {
        nom: "Maraîchage Concombre d'Allada",
        cycle: "60 jours",
        rendementMoyen: 3.2,
        prixKgMoy: 450,
        periodeSemis: "Juillet",
        itineraire: [
          "Treillis de bois de 1.2m",
          "Apport de fientes et arrosage constant"
        ],
        maladies: [
          { nom: "Mildiou de concombre", remede: "Bicarbonate et lait dilué à 10%" }
        ],
        semencesCost: 6500,
        engraisCost: 12000,
        mainOeuvreCost: 11000
      },
      {
        nom: "Maraîchage Laitue d'Allada",
        cycle: "45 jours",
        rendementMoyen: 2.3,
        prixKgMoy: 600,
        periodeSemis: "Juillet-Août",
        itineraire: [
          "Planches à l'abri du vent, arrosage fin"
        ],
        maladies: [
          { nom: "Rot bactérien des feuilles", remede: "Éliminer l'excès d'arrosage de fin de soirée" }
        ],
        semencesCost: 5000,
        engraisCost: 8000,
        mainOeuvreCost: 9000
      }
    ],
    elevages: [
      {
        nom: "Poulet Goliath d'Allada",
        cycle: "45 jours",
        tailleOptionelle: 600,
        prixAchatUnitaire: 650,
        mortaliteType: 6,
        poidsVenteMoyen: 2.1,
        prixVenteUnitaire: 3800,
        alimentSoinCost: 520000,
        mainOeuvreCost: 60000,
        conseilsSante: [
          "Litière sèche en copeaux fins dépoussiérés",
          "Prophylaxie au jus d'Aloe Vera"
        ]
      }
    ],
    transformations: [
      {
        nom: "Gari Croustillant fin Allada",
        matierePremiere: "Manioc doux brut",
        rendementPercent: 22,
        prixMatiereBruteKg: 100,
        perteEpluchage: 12,
        pertePressage: 15,
        perteCuisson: 8,
        prixVenteKg: 480,
        packagingCost: 30000,
        machineryCost: 20000,
        laborCost: 35000,
        usage: "alimentaire"
      },
      {
        nom: "Huile de Coco extra-vierge bio",
        matierePremiere: "Noix de Coco fraîches",
        rendementPercent: 15,
        prixMatiereBruteKg: 300,
        perteEpluchage: 45,
        pertePressage: 30,
        perteCuisson: 10,
        prixVenteKg: 3500,
        packagingCost: 55000,
        machineryCost: 20000,
        laborCost: 40000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA3",
    nom: "Terres de barre + Pêcheries (Mono)",
    departements: ["Mono"],
    climat: "Sub-équatorial, l'influence côtière domine",
    sols: "Alluvionnaires côtiers légers de Lokossa/Grand-Popo",
    pluviometrie: "950 - 1150 mm/an",
    cultures: [
      {
        nom: "Carotte de Grand-Popo",
        cycle: "90 jours",
        rendementMoyen: 3.5,
        prixKgMoy: 590,
        periodeSemis: "Juillet à Octobre",
        itineraire: [
          "Planches de sable tamisé riches au terreau de lagune",
          "Éclaircissage soigné au 15ème jour"
        ],
        maladies: [
          { nom: "Nématodes de racine", remede: "Tontes fraîches d'œillets d'Inde enfouies pré-semis" }
        ],
        semencesCost: 7000,
        engraisCost: 15000,
        mainOeuvreCost: 13000
      },
      {
        nom: "Gombo local Lokossa",
        cycle: "70 jours",
        rendementMoyen: 2.6,
        prixKgMoy: 410,
        periodeSemis: "Mars ou Août",
        itineraire: [
          "Fumage organique de bas de planche",
          "Puits de semis distancés de 40cm"
        ],
        maladies: [
          { nom: "Oïdium (poussière tavelée)", remede: "Pulvérisation de lactosérum dilué à 10%" }
        ],
        semencesCost: 5000,
        engraisCost: 12000,
        mainOeuvreCost: 10000
      },
      {
        nom: "Bananier de Grand-Popo",
        cycle: "365 jours",
        rendementMoyen: 4.0,
        prixKgMoy: 320,
        periodeSemis: "Avril-Mai",
        itineraire: [
          "Buttes espacées",
          "Irrigation le soir en cas de sécheresse"
        ],
        maladies: [
          { nom: "Mosaïque bananier", remede: "Planter uniquement des souches saines sélectionnées" }
        ],
        semencesCost: 12000,
        engraisCost: 14000,
        mainOeuvreCost: 15000
      }
    ],
    elevages: [
      {
        nom: "Pisciculture Tilapia Grand-Popo",
        cycle: "180 jours",
        tailleOptionelle: 1000,
        prixAchatUnitaire: 110,
        mortaliteType: 11,
        poidsVenteMoyen: 0.45,
        prixVenteUnitaire: 1800,
        alimentSoinCost: 330000,
        mainOeuvreCost: 65000,
        conseilsSante: [
          "Installer des plantes flottantes d'alimentation",
          "Bains rapides d'eau salée préventifs"
        ]
      }
    ],
    transformations: [
      {
        nom: "Vin de Palme pur (Sodabi)",
        matierePremiere: "Sève de palmier fermentée",
        rendementPercent: 80,
        prixMatiereBruteKg: 200,
        perteEpluchage: 0,
        pertePressage: 5,
        perteCuisson: 15,
        prixVenteKg: 900,
        packagingCost: 20000,
        machineryCost: 15000,
        laborCost: 25000,
        usage: "alimentaire"
      },
      {
        nom: "Huile de Laurier citronnelle",
        matierePremiere: "Feuilles fraîches de citronnelle",
        rendementPercent: 1.2,
        prixMatiereBruteKg: 600,
        perteEpluchage: 5,
        pertePressage: 92,
        perteCuisson: 1,
        prixVenteKg: 35000,
        packagingCost: 45000,
        machineryCost: 30000,
        laborCost: 50000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA3b",
    nom: "Terres de barre + Dépression (Couffo)",
    departements: ["Couffo"],
    climat: "Sub-équatorial, deux saisons de pluie contrastées",
    sols: "Terre argilo-sableuse à terre de barre, riche en potasse",
    pluviometrie: "1000 - 1180 mm/an",
    cultures: [
      {
        nom: "Manioc doux d'Aplahoué",
        cycle: "10 mois",
        rendementMoyen: 4.3,
        prixKgMoy: 150,
        periodeSemis: "Mars, Septembre",
        itineraire: [
          "Couchage horizontal des boutures",
          "Sarclage précoce pré-tallage rapide"
        ],
        maladies: [
          { nom: "Mosaïque de bouture", remede: "Boutures certifiées saines INRAB" }
        ],
        semencesCost: 8000,
        engraisCost: 11000,
        mainOeuvreCost: 13000
      },
      {
        nom: "Voandzou d'Aplahoué",
        cycle: "110 jours",
        rendementMoyen: 1.4,
        prixKgMoy: 600,
        periodeSemis: "Juillet",
        itineraire: [
          "Planches à grain libre, buttage à fleur"
        ],
        maladies: [
          { nom: "Fusariose de collet", remede: "Éviter la stagnation prolongée de l'eau" }
        ],
        semencesCost: 6500,
        engraisCost: 5000,
        mainOeuvreCost: 10000
      },
      {
        nom: "Piment Habanero d'Aplahoué",
        cycle: "120 jours",
        rendementMoyen: 2.3,
        prixKgMoy: 820,
        periodeSemis: "Juillet-Août",
        itineraire: [
          "Planches fraîches paillées"
        ],
        maladies: [
          { nom: "Anthracnose du fruit", remede: "Poudrer à la cendre de bois tamisée sèche" }
        ],
        semencesCost: 9500,
        engraisCost: 16000,
        mainOeuvreCost: 13000
      }
    ],
    elevages: [
      {
        nom: "Volaille Goliath Couffo",
        cycle: "45 jours",
        tailleOptionelle: 400,
        prixAchatUnitaire: 650,
        mortaliteType: 7,
        poidsVenteMoyen: 2.2,
        prixVenteUnitaire: 3800,
        alimentSoinCost: 320000,
        mainOeuvreCost: 45000,
        conseilsSante: [
          "Utilisation de décoction d'écorces de manguier",
          "Litière sèche et aérée"
        ]
      }
    ],
    transformations: [
      {
        nom: "Gari fin de Couffo",
        matierePremiere: "Manioc meuble d'Aplahoué",
        rendementPercent: 23,
        prixMatiereBruteKg: 100,
        perteEpluchage: 13,
        pertePressage: 15,
        perteCuisson: 8,
        prixVenteKg: 470,
        packagingCost: 29000,
        machineryCost: 16000,
        laborCost: 32000,
        usage: "alimentaire"
      },
      {
        nom: "Tapioca blanc d'Aplahoué",
        matierePremiere: "Manioc brut meuble",
        rendementPercent: 12,
        prixMatiereBruteKg: 100,
        perteEpluchage: 14,
        pertePressage: 48,
        perteCuisson: 14,
        prixVenteKg: 800,
        packagingCost: 32000,
        machineryCost: 18000,
        laborCost: 28000,
        usage: "alimentaire"
      },
      {
        nom: "Savon Noir de Neem de Couffo",
        matierePremiere: "Huiles de graines de Neem",
        rendementPercent: 86,
        prixMatiereBruteKg: 600,
        perteEpluchage: 0,
        pertePressage: 4,
        perteCuisson: 10,
        prixVenteKg: 1600,
        packagingCost: 30000,
        machineryCost: 15000,
        laborCost: 35000,
        usage: "cosmétique"
      }
    ]
  },
  {
    zone_id: "ZA1b",
    nom: "Pêcheries urbaines (Littoral)",
    departements: ["Littoral"],
    climat: "Sub-équatorial côtier maritime humide",
    sols: "Sols sableux fins du cordon littoral",
    pluviometrie: "1000 - 1250 mm/an",
    cultures: [
      {
        nom: "Maraîchage urbain Laitue Cotonou",
        cycle: "45 jours",
        rendementMoyen: 2.5,
        prixKgMoy: 680,
        periodeSemis: "Septembre-Octobre",
        itineraire: [
          "Planches amendées de fumier carbonisé très riche en azote",
          "Arrosage biquotidien sur le sable poreux"
        ],
        maladies: [
          { nom: "Rot des collets", remede: "Éliminer l'herbe sauvage et aérer l'arrosage" }
        ],
        semencesCost: 6000,
        engraisCost: 10000,
        mainOeuvreCost: 9500
      },
      {
        nom: "Maraîchage urbain Carotte Cotonou",
        cycle: "90 jours",
        rendementMoyen: 2.8,
        prixKgMoy: 650,
        periodeSemis: "Octobre",
        itineraire: [
          "Planches à sable fin meuble",
          "Fines rigoles d'ombrage"
        ],
        maladies: [
          { nom: "Ver gris de racine", remede: "Poudrage régulier d'argile fine et cendre" }
        ],
        semencesCost: 7500,
        engraisCost: 14000,
        mainOeuvreCost: 11000
      },
      {
        nom: "Maraîchage Tomate de Cotonou",
        cycle: "90 jours",
        rendementMoyen: 3.2,
        prixKgMoy: 500,
        periodeSemis: "Septembre à Décembre",
        itineraire: [
          "Pépinière soignée à l'abri du vent marin",
          "Buttage élevé"
        ],
        maladies: [
          { nom: "Flétrissement bactérien Ralstonia", remede: "Cendre de bois tamisée humidifiée à la levée" }
        ],
        semencesCost: 8000,
        engraisCost: 20000,
        mainOeuvreCost: 13000
      }
    ],
    elevages: [
      {
        nom: "Volaille intensive Goliath Cotonou",
        cycle: "45 jours",
        tailleOptionelle: 600,
        prixAchatUnitaire: 700,
        mortaliteType: 6,
        poidsVenteMoyen: 2.1,
        prixVenteUnitaire: 3850,
        alimentSoinCost: 550000,
        mainOeuvreCost: 70000,
        conseilsSante: [
          "Système de vaccination et nettoyage hebdomadaire",
          "Ajout de cendre et d'Ail frais de table"
        ]
      }
    ],
    transformations: [
      {
        nom: "Poisson fumé de Cotonou",
        matierePremiere: "Poisson frais de pêche",
        rendementPercent: 35,
        prixMatiereBruteKg: 1100,
        perteEpluchage: 5,
        pertePressage: 5,
        perteCuisson: 55,
        prixVenteKg: 3800,
        packagingCost: 40000,
        machineryCost: 20000,
        laborCost: 55000,
        usage: "alimentaire"
      },
      {
        nom: "Savon noble Aloe Vera & Maraîcher",
        matierePremiere: "Huile de Coco raffinée, gel d'aloe",
        rendementPercent: 82,
        prixMatiereBruteKg: 850,
        perteEpluchage: 12,
        pertePressage: 3,
        perteCuisson: 3,
        prixVenteKg: 2800,
        packagingCost: 45000,
        machineryCost: 15000,
        laborCost: 40000,
        usage: "cosmétique"
      }
    ]
  }
];

export const ALL_BENIN_DEPARTMENTS = [
  "Alibori",
  "Atacora",
  "Atlantique",
  "Borgou",
  "Collines",
  "Couffo",
  "Donga",
  "Littoral",
  "Mono",
  "Ouémé",
  "Plateau",
  "Zou"
];

// Helper to look up zone from department
export function getZoneByDepartment(dept: string): AgroEcologicalZone {
  const found = ZONES_AGRECOLOGIQUES_BENIN.find(z => z.departements.includes(dept));
  return found || ZONES_AGRECOLOGIQUES_BENIN.find(z => z.zone_id === "ZA2") || ZONES_AGRECOLOGIQUES_BENIN[0];
}
