export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  trialStartDate: string; // ISO String
  subscriptionEnd?: string; // ISO String
  isPremium: boolean;
  isBlocked?: boolean;
  warningsCount?: number;
  blockReason?: string;
  passwordHash?: string;
  avatarUrl?: string;
  phone?: string;
  whatsapp?: string;
  specialty?: string;
  location?: string;
  invisibleUntil?: string; // ISO string indicating shadow ban expiry
  commissionBlocked?: boolean; // Blocked for not paying commissions
  marketplaceBlocked?: boolean; // Blocked from posting future marketplace items
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isReplied?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  readBy: string[]; // User IDs who read this message
  replyToId?: string; // Tagged message ID
  replyToContent?: string;
  replyToSenderName?: string;
  isPrivate?: boolean;
  recipientId?: string;
  recipientName?: string;
  photoAttachment?: string;
}

export interface Product {
  id: string;
  userId?: string; // Owner identity
  sellerName: string;
  sellerPhone: string;
  sellerWhatsApp?: string;
  title: string;
  price: number;
  location: string;
  description: string;
  type: string; // e.g. "Légumes", "Céréales", "Élevage", "Engrais"
  photoUrl?: string;
  createdAt: string;
  isClosed?: boolean;
  commissionReminded?: boolean;
  isBlockedByCoordinator?: boolean;
  sellerBlocked?: boolean;
  sellerInvisible?: boolean;
  sellerCommissionBlocked?: boolean;
}

export interface CVProfile {
  id: string;
  userId?: string; // Owner identity
  firstName: string;
  lastName: string;
  type: 'technician' | 'intern'; // Animalier/technicien vs étudiant stagiaire
  education: string;
  specialty: string;
  skills: string;
  contact: string;
  locationDesired?: string; // stage option
  university?: string; // stage option
  createdAt: string;
  isBlockedByCoordinator?: boolean;
  isClosed?: boolean;
  phoneWhatsApp?: string;
  phoneDirect?: string;
  photoUrl?: string;
  
  // V2 fields
  communeDispo?: string;
  typeContrat?: 'stage' | 'emploi' | 'saisonnier' | 'CDD' | 'CDI';
  salaireSouhaite?: number;
  dispoImmediate?: boolean;
  cvPdfUrl?: string;
  photoProUrl?: string;
  statut?: 'valide' | 'en_attente' | 'refuse' | 'mis_en_avant' | 'archive';
  vues?: number;
  clicsWhatsApp?: number;
  boostExpireAt?: string;
}

export interface ProjectProposal {
  id: string;
  userId?: string; // Owner identity
  firstName: string;
  lastName: string;
  phone: string;
  title: string;
  summary: string;
  documentName?: string;
  createdAt: string;
  phoneWhatsApp?: string;
  phoneDirect?: string;
  
  // V2 fields
  superficie?: number; // ha
  commune?: string;
  montantRecherche?: number; // FCFA
  apportPerso?: number; // %
  dureeProjet?: number; // mois
  typeCultureElevage?: string;
  ficheRentabiliteUrl?: string;
  photosUrls?: string[];
  statut?: 'en_attente' | 'valide' | 'refuse' | 'mis_en_avant';
  vues?: number;
  clicsWhatsApp?: number;
  boostExpireAt?: string;
}

export interface AppelCandidature {
  id: string;
  userId: string;
  userName: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  contact: string;
  typeContrat?: 'stage' | 'emploi' | 'saisonnier' | 'CDD' | 'CDI';
  createdAt: string;
  phoneWhatsApp?: string;
  phoneDirect?: string;
  photoUrl?: string;
  
  // V2 fields
  salairePropose?: number;
  logementNourri?: boolean;
  dateDebut?: string;
  dateLimite?: string;
  cahierChargesUrl?: string;
  statut?: 'en_attente' | 'valide' | 'refuse' | 'mis_en_avant';
  vues?: number;
  clicsWhatsApp?: number;
  boostExpireAt?: string;
}

export interface WeatherInfo {
  commune: string;
  temp: number;
  condition: string;
  humidity: string;
  wind: string;
  recommendations: string[];
  lastUpdated?: string;
}

export interface MarketPrice {
  id: string;
  commune: string;
  productName: string;
  pricePerKgOrUnit: string;
  trend: 'up' | 'down' | 'stable';
  updatedAt: string;
}

export interface SolidarityDemand {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  typeRemuneration: 'gratuit' | 'payant';
  montant: number; // 0 if free, or amount in FCFA
  superficie: string; // ex: "10 hectares"
  lieu: string; // Ex: Koudougou, Adjohoun
  dateDebut: string;
  dateFin: string;
  conditions: string; // Ex: Logement/repas fourni
  contactType: 'chat' | 'direct' | 'whatsapp';
  contactValue: string; // Tel/WhatsApp number or user ID
  statut: 'ouverte' | 'en_cours' | 'terminee';
  createdAt: string;
  phoneWhatsApp?: string;
  phoneDirect?: string;
}

export interface SolidarityCandidature {
  id: string;
  demandeId: string;
  userId: string;
  userName: string;
  message: string;
  statut: 'envoye' | 'vu' | 'accepte' | 'refuse';
  createdAt: string;
}

export interface CultureSheet {
  id: string;
  name: string;
  category: 'culture' | 'elevage';
  cycle: string;
  diseases: { name: string; treatment: string }[];
  technicalTips: string[];
}
