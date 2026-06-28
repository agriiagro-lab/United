import React, { useState } from "react";
import { Product, User } from "../types";
import { ShoppingBag, PlusCircle, Tag, PhoneCall, MessageCircle, Share2, FileText, Check, Copy, Trash2, Edit3, Search } from "lucide-react";

interface MarketPanelProps {
  user: User;
  products: Product[];
  onAddProduct: (prod: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateProduct?: (id: string, updatedFields: Partial<Product>) => Promise<void>;
  onDeleteProduct?: (id: string) => Promise<void>;
  onContactSellerPrivate: (sellerName: string, sellerPhone: string, titleOfProduct: string) => void;
  onAdminInitiatePrivateChat?: (userId: string, userName: string, phone: string, initialMessage: string) => void;
  autoOpenAddForm?: boolean;
  onFormOpened?: () => void;
  unlockedContactsList?: string[];
  onUnlockContact?: (productId: string) => Promise<void>;
  selectedProductId?: string | null;
  onClearSelection?: () => void;
  onInterestedInProduct?: (prod: Product) => void;
  coordinationInterestedUser?: { id: string; username: string } | null;
  onClearCoordinationInterestedUser?: () => void;
}

export const DEPARTEMENTS_BENIN = [
  {
    name: "Alibori",
    communes: ["Kandi", "Banikoara", "Gogounou", "Karimama", "Malanville", "Ségbana"]
  },
  {
    name: "Atacora",
    communes: ["Natitingou", "Boukoumbé", "Cobly", "Kérou", "Kouandé", "Matéri", "Péhunco", "Tanguiéta", "Toucountouna"]
  },
  {
    name: "Atlantique",
    communes: ["Abomey-Calavi", "Allada", "Kpomassè", "Ouidah", "Sô-Ava", "Toffo", "Tori-Bossito", "Zè"]
  },
  {
    name: "Borgou",
    communes: ["Parakou", "Bembéréké", "Kalalé", "N'Dali", "Nikki", "Pèrèrè", "Sinendé", "Tchaourou"]
  },
  {
    name: "Collines",
    communes: ["Dassa-Zoumè", "Bantè", "Glazoué", "Ouèssè", "Savalou", "Savè"]
  },
  {
    name: "Donga",
    communes: ["Djougou", "Bassila", "Copargo", "Ouaké"]
  },
  {
    name: "Kouffo",
    communes: ["Aplahoué", "Djakotomey", "Dogbo", "Klouékanmè", "Lalo", "Toviklin"]
  },
  {
    name: "Littoral",
    communes: ["Cotonou"]
  },
  {
    name: "Mono",
    communes: ["Lokossa", "Athiémé", "Bopa", "Comè", "Grand-Popo", "Houéyogbé"]
  },
  {
    name: "Ouémé",
    communes: ["Porto-Novo", "Adjarra", "Adjohoun", "Aguégués", "Akpro-Missérété", "Avrankou", "Bonou", "Dangbo", "Sèmè-Kpodji"]
  },
  {
    name: "Plateau",
    communes: ["Pobè", "Adja-Ouèrè", "Ifangni", "Kétou", "Sakété"]
  },
  {
    name: "Zou",
    communes: ["Abomey", "Agbangnizoun", "Bohicon", "Covè", "Djidja", "Ouinhi", "Za-Kpota", "Zagnanado", "Zogbodomey"]
  }
];

const PRESET_PHOTOS = [
  { url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400", label: "🍅 Produits maraîchers (Tomate, Piment, Choux)" },
  { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400", label: "🌾 Terrain Agricole / Domaine cultivable" },
  { url: "https://images.unsplash.com/photo-1530906358829-e84b276e1f0e?auto=format&fit=crop&q=80&w=400", label: "🚜 Tracteur & Équipements / Matériel" },
  { url: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400", label: "🐄 Animaux d'Élevage / Bétails & Ruminants" },
  { url: "https://images.unsplash.com/photo-1574325131876-a7999d9d63b5?auto=format&fit=crop&q=80&w=400", label: "🌽 Produits Agricoles de Grande Culture" },
  { url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400", label: "🐓 Volailles & Aviculture" }
];

const getCategoryFallbackImage = (category: string) => {
  if (!category) return "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400";
  const cat = category.toLowerCase();
  if (cat.includes("terrain") || cat.includes("domaine") || cat.includes("champ")) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("matériel") || cat.includes("equipement") || cat.includes("équipement") || cat.includes("machines") || cat.includes("outil")) {
    return "https://images.unsplash.com/photo-1530906358829-e84b276e1f0e?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("animal") || cat.includes("bétail") || cat.includes("elevage") || cat.includes("élevage") || cat.includes("ruminant")) {
    return "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("avi") || cat.includes("volaille") || cat.includes("poulet")) {
    return "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400";
  }
  if (cat.includes("produit") || cat.includes("céréale") || cat.includes("fruit") || cat.includes("grain")) {
    return "https://images.unsplash.com/photo-1574325131876-a7999d9d63b5?auto=format&fit=crop&q=80&w=400";
  }
  return "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400";
};

export default function MarketPanel({
  user,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onContactSellerPrivate,
  onAdminInitiatePrivateChat,
  autoOpenAddForm,
  onFormOpened,
  unlockedContactsList = [],
  onUnlockContact,
  selectedProductId,
  onClearSelection,
  onInterestedInProduct,
  coordinationInterestedUser,
  onClearCoordinationInterestedUser
}: MarketPanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isUserAdmin = !!user && (
    user.id === "usr_admin_jbz" ||
    user.username?.toLowerCase() === "jbz001" ||
    user.username?.toLowerCase() === "coordonnateur" ||
    user.username?.toLowerCase() === "administrateur" ||
    user.username?.toLowerCase() === "jeanbaptiste" ||
    user.email === "jbzounmatoun@gmail.com" ||
    user.email === "coordonnateur@agribot-africa.com" ||
    user.email === "administrateur@agribot-africa.com" ||
    user.email === "jeanbaptiste@coor.bj"
  );

  React.useEffect(() => {
    if (autoOpenAddForm) {
      setShowAdd(true);
      if (onFormOpened) {
        onFormOpened();
      }
    }
  }, [autoOpenAddForm]);

  const [blockedWriters, setBlockedWriters] = useState<Record<string, boolean>>({});

  const handleToggleMarketplaceBlock = async (sellerId: string, sellerName: string) => {
    const isCurrentlyBlocked = !!blockedWriters[sellerId];
    const newStatus = !isCurrentlyBlocked;
    
    if (!confirm(newStatus 
      ? `Voulez-vous vraiment bloquer les PROCHAINES publications sur la marketplace pour @${sellerName} ?`
      : `Voulez-vous débloquer les publications sur la marketplace pour @${sellerName} ?`
    )) {
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/users/${sellerId}/marketplace-block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketplaceBlocked: newStatus })
      });
      if (res.ok) {
        setBlockedWriters(prev => ({ ...prev, [sellerId]: newStatus }));
        alert(newStatus 
          ? `✓ Le producteur @${sellerName} a été bloqué pour ses prochaines publications.`
          : `✓ Le producteur @${sellerName} a été débloqué et peut de nouveau publier.`
        );
      }
    } catch (_) {
      alert("Erreur de modification du statut de blocage.");
    }
  };
  const [sellerName, setSellerName] = useState(user ? `${user.firstName} ${user.lastName}` : "");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerWhatsApp, setSellerWhatsApp] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  
  // Advanced locations of Benin
  const [selectedDept, setSelectedDept] = useState("Ouémé");
  const [selectedCommune, setSelectedCommune] = useState("Dangbo");
  const [villeVillage, setVilleVillage] = useState("");

  const [description, setDescription] = useState("");
  const [type, setType] = useState("Légumes");
  const [photoUrl, setPhotoUrl] = useState(PRESET_PHOTOS[0].url);
  const [customPhotoFile, setCustomPhotoFile] = useState<string | null>(null);

  // Sharing simulator states
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Local storage persisted price alerts setup
  const [activeAlerts, setActiveAlerts] = useState<Record<string, { alertOnDrop: boolean; alertOnRise: boolean; contactChannel: string }>>(() => {
    try {
      const persisted = localStorage.getItem("agribot_price_alerts");
      return persisted ? JSON.parse(persisted) : {};
    } catch (_) {
      return {};
    }
  });

  // Auto-populate logged-in user contacts
  React.useEffect(() => {
    if (user) {
      if (!sellerPhone) setSellerPhone(user.phone || "");
      if (!sellerWhatsApp) setSellerWhatsApp(user.whatsapp || "");
    }
  }, [user]);

  const [alertConfigProduct, setAlertConfigProduct] = useState<Product | null>(null);
  const [alertOnDrop, setAlertOnDrop] = useState<boolean>(true);
  const [alertOnRise, setAlertOnRise] = useState<boolean>(true);
  const [alertContact, setAlertContact] = useState<string>(user?.phone || "");

  const handleSaveAlertConfig = () => {
    if (!alertConfigProduct) return;
    
    // Create custom notification object to trigger on confirm
    const updated = {
      ...activeAlerts,
      [alertConfigProduct.id]: {
        alertOnDrop,
        alertOnRise,
        contactChannel: alertContact || "Notification Directe"
      }
    };
    
    // If both unchecked, remove alert
    if (!alertOnDrop && !alertOnRise) {
      delete updated[alertConfigProduct.id];
    }
    
    setActiveAlerts(updated);
    try {
      localStorage.setItem("agribot_price_alerts", JSON.stringify(updated));
    } catch (_) {}
    
    const targetTitle = alertConfigProduct.title;
    setAlertConfigProduct(null);
    alert(`💡 Alerte de prix enregistrée pour "${targetTitle}" !\nVous recevrez une notification instantanée dès que le prix varie.`);
  };

  // Product editing states
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editProdTitle, setEditProdTitle] = useState("");
  const [editProdPrice, setEditProdPrice] = useState("");
  const [editProdLocation, setEditProdLocation] = useState("");
  const [editProdDescription, setEditProdDescription] = useState("");
  const [editProdPhone, setEditProdPhone] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomPhotoFile(base64String);
        setPhotoUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeptChange = (deptName: string) => {
    setSelectedDept(deptName);
    const dept = DEPARTEMENTS_BENIN.find((d) => d.name === deptName);
    if (dept && dept.communes.length > 0) {
      setSelectedCommune(dept.communes[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !sellerPhone || !title || !price || !selectedCommune) return;

    // Concat location precisely: commune + dept + manual city/village
    const finalLocation = `${selectedCommune} (${selectedDept})${villeVillage.trim() ? ' - ' + villeVillage.trim() : ''}`;

    await onAddProduct({
      userId: user.id,
      sellerName,
      sellerPhone,
      sellerWhatsApp: sellerWhatsApp || sellerPhone,
      title,
      price: Number(price),
      location: finalLocation,
      description,
      type,
      photoUrl: photoUrl
    });

    // Reset fields
    setTitle("");
    setPrice("");
    setDescription("");
    setSellerWhatsApp("");
    setVilleVillage("");
    setCustomPhotoFile(null);
    setShowAdd(false);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProdId(prod.id);
    setEditProdTitle(prod.title);
    setEditProdPrice(String(prod.price));
    setEditProdLocation(prod.location);
    setEditProdDescription(prod.description);
    setEditProdPhone(prod.sellerPhone);
  };

  const saveEditProduct = async (id: string) => {
    if (onUpdateProduct) {
      await onUpdateProduct(id, {
        title: editProdTitle,
        price: Number(editProdPrice),
        location: editProdLocation,
        description: editProdDescription,
        sellerPhone: editProdPhone
      });
    }
    setEditingProdId(null);
  };

  const handleDialCode = (phone: string) => {
    let raw = phone.trim().replace(/\s+/g, "");
    if (!raw.startsWith("+") && !raw.startsWith("00")) {
      raw = "+229" + raw;
    }
    window.location.href = `tel:${raw}`;
  };

  const handleWhatsAppRedirect = (prod: Product) => {
    const waNum = (prod.sellerWhatsApp || prod.sellerPhone).trim().replace(/\s+/g, "").replace("+", "");
    const cleanNum = waNum.startsWith("00") ? waNum.substring(2) : waNum;
    
    const firstParagraph = "Bonjour, je suis très intéressé par votre publication sur Agribot mine d'or du Bénin.";
    const secondParagraph = `Article: ${prod.title} - ${prod.price} F CFA (Commune: ${prod.location}).`;
    const thirdParagraph = "Retrouvez cette publication originale sur Agribot mine d'or, la mine d'or agricole : http://localhost:3000/";
    
    const message = encodeURIComponent(`${firstParagraph}\n\n${secondParagraph}\n\n${thirdParagraph}`);
    window.open(`https://wa.me/${cleanNum}?text=${message}`, "_blank");
  };

  const handleShareClick = async (prod: Product) => {
    const textToShare = `🌾 PARTAGE d'AGRIBOT MINE D'OR 🌾\n\n📌 Produit : ${prod.title}\n💰 Prix de gros : ${prod.price.toLocaleString()} F CFA\n📍 Commune : ${prod.location}\n📞 Contact : ${prod.sellerPhone}\n\nRetrouvez cette publication originale et de nombreux itinéraires agronomiques sur Agribot mine d'or !`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Agribot mine d'or - ${prod.title}`,
          text: textToShare,
          url: window.location.origin
        });
        return;
      } catch (err) {
        console.log("Web Share non supporté:", err);
      }
    }
    setSharingProduct(prod);
    setCopiedLink(false);
  };

  const handleCopyShareLink = (prod: Product) => {
    const textToCopy = `🌾 *OPPORTUNITÉ SUR AGRIBOT MINE D'OR* 🌾\nJe viens de publier/trouver un super produit agricole en vente directe :\n\n📌 *${prod.title}*\n💰 Prix de vente: ${prod.price.toLocaleString()} F CFA\n📍 Commune: ${prod.location}\n📞 Contact direct: ${prod.sellerPhone}\n\nRetrouvez les meilleurs raccordements maraîchers du Bénin sur Agribot mine d'or !`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Barre de Recherche Rapide */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-3xs flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-650" />
          <input
            type="text"
            placeholder="🔎 Recherche rapide d'articles (ex: tomates, soja, beurres, tracteurs, sacs...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#10b981]/20 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-red-650 hover:underline shrink-0 font-bold"
          >
            ❌ Effacer la recherche
          </button>
        )}
      </div>

      {/* SECTION BOUTON PUBLICATION */}
      <div className="flex flex-col gap-3">
        {user?.marketplaceBlocked ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs text-left">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-extrabold uppercase text-amber-900">Accès suspendu de publication</p>
              <p className="text-[11px] text-red-655 leading-relaxed mt-0.5">Le coordonnateur national a suspendu temporairement vos droits de publication sur le marché d'Agribot en raison de commissions non régularisées ou de non-respect de la charte.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-[0.99] duration-150"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{showAdd ? "✕ Fermer le formulaire de publication" : "➕ Publier mon produit / Maraîchage sur le marché"}</span>
            </button>

            {showAdd && (
              <form 
                onSubmit={handleSubmit}
                className="bg-white border-2 border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl animate-scale-in text-left"
              >
                <div className="border-b pb-2 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Créer une nouvelle publication de vente</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Remplissez les informations convenablement de votre campagne maraîchère.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom du vendeur / Producteur */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Votre Nom & Prénoms :</label>
                    <input 
                      type="text" 
                      required
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                      placeholder="Ex: Assani Bio"
                    />
                  </div>

                  {/* Produit Titre */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Désignation / Article en vente :</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2.5 border border-slate-255 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                      placeholder="Ex: Tomates fraîches de Dangbo ou sacs de manioc"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Prix de gros */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Prix de vente total (en F CFA) :</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-mono font-bold text-slate-950 focus:outline-none focus:border-emerald-500 bg-white"
                      placeholder="Ex: 5000"
                    />
                  </div>

                  {/* Numéro de téléphone direct */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Numéro d'appel direct :</label>
                    <input 
                      type="tel" 
                      required
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                      placeholder="Ex: 97000000"
                    />
                  </div>

                  {/* Numéro WhatsApp */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Numéro WhatsApp (ou d'appel) :</label>
                    <input 
                      type="tel" 
                      value={sellerWhatsApp}
                      onChange={(e) => setSellerWhatsApp(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                      placeholder="Ex: 97000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Catégorie */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Catégorie du produit :</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="Légumes">🥗 Légumes</option>
                      <option value="Fruits">🍎 Fruits</option>
                      <option value="Céréales">🌾 Céréales / Grains</option>
                      <option value="Élevage">🐂 Élevage</option>
                      <option value="Aviculture">🐓 Aviculture</option>
                      <option value="Transformation">🥫 Agro-transformation</option>
                      <option value="Matériel">🚜 Équipement / Matériel</option>
                      <option value="Autres">📦 Autres</option>
                    </select>
                  </div>

                  {/* Département de suivi */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Département (Bénin) :</label>
                    <select
                      value={selectedDept}
                      onChange={(e) => handleDeptChange(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      {DEPARTEMENTS_BENIN.map((dept) => (
                        <option key={dept.name} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Commune */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Commune :</label>
                    <select
                      value={selectedCommune}
                      onChange={(e) => setSelectedCommune(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      {(DEPARTEMENTS_BENIN.find((d) => d.name === selectedDept)?.communes || []).map((comm) => (
                        <option key={comm} value={comm}>{comm}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ville, Village */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Arrondissement / Village :</label>
                    <input 
                      type="text" 
                      value={villeVillage}
                      onChange={(e) => setVilleVillage(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                      placeholder="Ex: Hozin, Zounguè..."
                    />
                  </div>
                </div>

                {/* Description de l'article */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Description utile de l'annonce :</label>
                  <textarea 
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 border border-slate-250 rounded-xl text-xs font-semibold text-slate-850 focus:outline-none focus:border-emerald-500 bg-white"
                    placeholder="Détaillez la quantité, l'état, la disponibilité de l'article horticole..."
                  />
                </div>

                {/* Photo de l'annonce */}
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Photo ou Illustration de l'annonce :</label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_PHOTOS.map((ph, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCustomPhotoFile(null);
                          setPhotoUrl(ph.url);
                        }}
                        className={`p-2 border rounded-xl flex flex-col items-center gap-1.5 transition text-left cursor-pointer ${
                          photoUrl === ph.url && !customPhotoFile ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <img src={ph.url} alt={ph.label} className="w-full h-12 object-cover rounded-lg" />
                        <span className="text-[9px] font-black leading-tight text-slate-600 line-clamp-1">{ph.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-3.5 text-center bg-slate-50 hover:bg-slate-100 transition duration-150">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-600">
                      <span className="text-xl">📸</span>
                      <p className="text-[11px] font-bold">Ouvrir l'appareil photo ou sélectionner un fichier image</p>
                      <p className="text-[9px] text-slate-450 leading-none mt-0.5">Prenez en photo votre champ maraîcher en un clic (Optionnel)</p>
                    </div>
                  </div>

                  {photoUrl && (
                    <div className="p-2.5 bg-slate-100 rounded-xl inline-flex items-center gap-3 border border-slate-200">
                      <img src={photoUrl} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-white" alt="Prévisualisation" />
                      <div>
                        <p className="text-[9px] font-bold text-emerald-800 uppercase">Image sélectionnée ✓</p>
                        <p className="text-[10px] text-zinc-500">Sera publié avec l'annonce.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdd(false);
                      setCustomPhotoFile(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition active:scale-95"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer transition active:scale-95 shadow-xs"
                  >
                    Confirmer la publication 🚀
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Règle des 10 % de commission d'AgriBot */}
      <div className="p-4 bg-amber-500/10 border border-amber-400/30 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl text-xs text-slate-800 space-y-3 shadow-sm leading-relaxed">
        <h4 className="font-extrabold uppercase text-amber-900 text-[11px] flex items-center gap-1.5 font-display">
          ⭐ CHARTE DE FONCTIONNEMENT DE LA MARKETPLACE D'AGRIBOT BÉNIN
        </h4>
        <div className="space-y-2 text-[11.5px] text-slate-700">
          <p>
            • <strong className="text-slate-900 font-sans">Pour les Producteurs (Vendeurs) :</strong> Publiez votre produit de campagne agricole avec sa description complète, son prix, ainsi que votre numéro WhatsApp et direct. Vos coordonnées privées et les boutons d'action d'édition/suppression ne sont visibles que par vous et par le Coordonnateur national d'Agribot.
          </p>
          <p>
            • <strong className="text-slate-900 font-sans">Pour les Acheteurs (Utilisateurs U) :</strong> Sur chaque annonce de maraîchage d'un autre membre, vous ne verrez que deux boutons : la touche jaune <strong className="text-amber-800">« 🤝 Intéressé »</strong> et <strong className="text-slate-900 font-sans">« 🔗 Partager »</strong>. Appuyer sur « Intéressé » vous amène instantanément dans la messagerie privée du Coordonnateur avec les indices de l'annonce pour finaliser l'achat.
          </p>
          <p>
            • <strong className="text-slate-900 font-sans">Mise en relation et Commission :</strong> Le Coordonnateur vous met en contact direct grâce à l'appui du bouton <strong className="text-slate-900 font-sans">« Demande reçue »</strong>. Dès que la vente s'effectue, le vendeur est tenu de reverser la commission réglementaire de <strong className="text-amber-950 font-black">10% du prix vendu</strong> à la direction nationale d'AgriBot (MTN MoMo: <strong className="text-slate-950 font-mono font-bold font-sans">01614432</strong>) sous 72h.
          </p>
        </div>
      </div>

      {selectedProductId && products.some(p => p.id === selectedProductId) && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📚</span>
            <div>
              <p className="text-xs font-black text-emerald-900 uppercase">Publication Sélectionnée</p>
              <p className="text-[11px] text-emerald-700 font-medium">Vous visualisez l'annonce sélectionnée directement depuis votre page d'accueil.</p>
            </div>
          </div>
          {onClearSelection && (
            <button 
              type="button"
              onClick={onClearSelection}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition shadow-xs"
            >
              Afficher tout le marché 🌐
            </button>
          )}
        </div>
      )}

      {/* Grid of commercial items - Tighter and smaller cards as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {products
          .filter((p) => {
            if (selectedProductId && p.id !== selectedProductId) {
              return false;
            }
            const belongsToViewer = user && (p.userId === user.id);
            if (p.isBlockedByCoordinator && !belongsToViewer && !isUserAdmin) {
              return false;
            }
            // Hide products if owner is blocked, invisible, or has commission blocked (unless the viewer is the owner or admin)
            if ((p.sellerBlocked || p.sellerInvisible || p.sellerCommissionBlocked) && !belongsToViewer && !isUserAdmin) {
              return false;
            }
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              const titleMatch = p.title?.toLowerCase().includes(q);
              const descMatch = p.description?.toLowerCase().includes(q);
              const nameMatch = p.sellerName?.toLowerCase().includes(q);
              const catMatch = p.type?.toLowerCase().includes(q);
              const locationMatch = p.location?.toLowerCase().includes(q);
              if (!titleMatch && !descMatch && !nameMatch && !catMatch && !locationMatch) {
                return false;
              }
            }
            return !p.isClosed || isUserAdmin;
          })
          .map((prod) => {
            const belongsToUser = user && (prod.userId === user.id || isUserAdmin);
            const isEditing = editingProdId === prod.id;

            const handleIntéresséClick = () => {
              if (isUserAdmin) {
                onContactSellerPrivate(prod.sellerName, prod.sellerPhone, prod.title);
              } else {
                // Route clients directly to administrator role to mediate transaction and 10% commission flow
                onContactSellerPrivate("Administrateur", "01614432", `${prod.title} (Soumis par ${prod.sellerName})`);
              }
            };

            return (
              <div
                key={prod.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md relative group ${
                  prod.isClosed ? "border-amber-400 bg-amber-50/20" : "border-slate-200/60"
                }`}
              >
                {/* Premium Gradient Header with NO image - Sleek, compact and compliant with no-image policy */}
                <div className="h-20 flex items-center justify-center relative bg-gradient-to-tr from-slate-900 via-emerald-950 to-slate-950 overflow-hidden border-b border-white/5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent)]"></div>
                  
                  {/* Category icon indicator */}
                  <div className="flex flex-col items-center">
                    <span className="text-xl filter drop-shadow">
                      {prod.type.includes("Légume") ? "🥗" : 
                       prod.type.includes("Terrain") ? "🏕️" : 
                       prod.type.includes("Matériel") ? "🚜" : 
                       prod.type.includes("Animaux") ? "🐂" : 
                       prod.type.includes("Aviculture") ? "🐓" : 
                       prod.type.includes("Transformation") ? "🥫" : 
                       prod.type.includes("Cosmétique") ? "💄" : "🌾"}
                    </span>
                  </div>
                  
                  {/* Delete/Edit overlays */}
                  {belongsToUser && !isEditing && (
                    <div className="absolute top-2 right-2 flex gap-1.5 z-10 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => startEditProduct(prod)}
                        className="p-1.5 bg-white/95 text-blue-700 hover:bg-white rounded-lg shadow cursor-pointer transition"
                        title="Modifier l'annonce"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {onDeleteProduct && (
                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 bg-white/95 text-red-650 hover:bg-white rounded-lg shadow cursor-pointer transition"
                          title="Supprimer l'annonce"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}

                  <span className="absolute top-1.5 left-1.5 bg-emerald-700 text-white font-mono text-[9.5px] font-black px-2 py-0.5 rounded-lg shadow-md leading-none">
                    {prod.price.toLocaleString()} F CFA
                  </span>
                  
                  {prod.isClosed && (
                    <span className="absolute top-1.5 right-12 bg-amber-600 text-white font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse shadow-md z-10">
                      Archivée
                    </span>
                  )}

                  <span className="absolute bottom-1.5 right-1.5 bg-slate-900/90 text-white text-[8px] font-mono tracking-wider uppercase font-extrabold px-1.5 py-0.5 rounded shadow scale-90">
                    {prod.type}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-1 px-2.5 text-white text-[9px] font-extrabold">
                    📍 {prod.location}
                  </div>
                </div>

                {/* Content body - Tighter margins */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                  
                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Intitulé du produit</label>
                        <input type="text" className="w-full p-2 border rounded-lg text-xs" value={editProdTitle} onChange={(e) => setEditProdTitle(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Prix de vente (FCFA)</label>
                        <input type="number" className="w-full p-2 border rounded-lg text-xs font-mono font-bold" value={editProdPrice} onChange={(e) => setEditProdPrice(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Lieu</label>
                        <input type="text" className="w-full p-2 border rounded-lg text-xs font-bold" value={editProdLocation} onChange={(e) => setEditProdLocation(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Contact d'appel</label>
                        <input type="text" className="w-full p-2 border rounded-lg text-xs font-mono font-bold" value={editProdPhone} onChange={(e) => setEditProdPhone(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
                        <textarea rows={2} className="w-full p-2 border rounded-lg text-xs" value={editProdDescription} onChange={(e) => setEditProdDescription(e.target.value)} />
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button onClick={() => setEditingProdId(null)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">Annuler</button>
                        <button onClick={() => saveEditProduct(prod.id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Enregistrer</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-[12.5px] tracking-tight leading-normal uppercase">{prod.title}</h4>
                      <p className="text-[10.5px] text-slate-500 mt-0.5 leading-normal line-clamp-2" title={prod.description}>
                        {prod.description || "Aucune description complémentaire pour cet article d'Agribot mine d'or."}
                      </p>


                      
                      <div className="mt-1.5 pt-1 border-t border-slate-100 flex justify-between items-center text-[9px] text-zinc-400 font-mono">
                        <span>🧔 {prod.sellerName}</span>
                        <span>{new Date(prod.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                  )}

                  {/* ACTION SENSORS AT THE BOTTOM */}
                  {!isEditing && (
                    <div className="space-y-2 pt-1 border-t">
                      {/* Coordinator / Administrateur custom dashboard panel */}
                      {isUserAdmin ? (
                        <div className="space-y-1.5 p-2 bg-slate-900 text-white rounded-xl border border-slate-800">
                          <p className="text-[9px] uppercase font-black text-emerald-400 font-mono tracking-wider mb-1 text-center">🛡️ Commandes &amp; Contrôles d'Administration</p>
                          
                          {/* Active Buyer Interested in this specific product - Mettre en contact trigger */}
                          {coordinationInterestedUser && (
                            <div className="p-2 bg-yellow-950/50 rounded-lg border border-yellow-500/25 text-[10px] text-yellow-100 flex flex-col gap-1.5 mb-2 shrink-0">
                              <p className="font-extrabold text-amber-400 uppercase text-[8.5px]">🤝 Coordination de Mise en Relation active :</p>
                              <p className="text-[9.5px] text-zinc-350 leading-tight">L'adhérent <strong className="text-white">@{coordinationInterestedUser.username}</strong> s'est déclaré intéressé.</p>
                              <button
                                onClick={() => {
                                  if (onAdminInitiatePrivateChat) {
                                    const contactMsg = `Bonjour @${prod.sellerName}, je vous mets en relation privée avec l'acheteur @${coordinationInterestedUser.username} très intéressé par votre annonce "${prod.title}" (${prod.price.toLocaleString()} F CFA). Finalisez l'opération en toute confiance. À la fin, informez-nous pour boucler l'annonce et régulariser la commission d'Agribot. Merci !`;
                                    onAdminInitiatePrivateChat(prod.userId || "", prod.sellerName, prod.sellerPhone, contactMsg);
                                    if (onClearCoordinationInterestedUser) {
                                      onClearCoordinationInterestedUser();
                                    }
                                  }
                                }}
                                className="py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded text-[9.5px] uppercase transition cursor-pointer"
                              >
                                📦 Demande reçue : Mettre en contact
                              </button>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleDialCode(prod.sellerPhone)}
                              className="py-1.5 px-2 bg-slate-850 hover:bg-slate-800 rounded text-[10px] text-white font-extrabold flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                              title="Numéro de téléphone privé du vendeur"
                            >
                              📞 Numéro Privé
                            </button>
                            <button
                              onClick={() => handleWhatsAppRedirect(prod)}
                              className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 rounded text-[10px] text-white font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                              title="Accéder directement au fil WhatsApp du vendeur"
                            >
                              💬 WhatsApp
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 mt-1">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/admin/publications/products/${prod.id}/boucler`, { method: "POST" });
                                  if (res.ok) {
                                    alert("✓ Annonce clôturée/bouclée avec succès.");
                                    window.location.reload();
                                  }
                                } catch (err) {
                                  alert("Erreur de clôture");
                                }
                              }}
                              className="py-1.5 px-1 bg-amber-600 hover:bg-amber-500 rounded text-[10px] text-slate-950 font-black cursor-pointer text-center"
                              title="Boucler l'annonce de manière définitive"
                            >
                              🤝 Boucler Vente ✓
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/admin/publications/products/${prod.id}/relancer`, { method: "POST" });
                                  if (res.ok) {
                                    alert("🔔 Message de réclamation de commission enregistré et envoyé avec succès.");
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                                if (onAdminInitiatePrivateChat) {
                                  const msg = `Bonjour @${prod.sellerName}, ici l'administrateur de la plateforme d'Agroécologie Bénin AgriBot. Je me permets de vous faire une réclamation concernant le versement de la commission réglementaire de 10% sur la vente liée à la publication maraîchère suivante :\n👉 "${prod.title}" (${prod.price.toLocaleString()} F CFA).\nMerci de régulariser la transaction via MTN MoMo (*880# au 01614432) sous 72h. Merci !`;
                                  onAdminInitiatePrivateChat(prod.userId || "", prod.sellerName, prod.sellerPhone, msg);
                                }
                              }}
                              className="py-1.5 px-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[10px] text-white font-bold cursor-pointer text-center"
                              title="Réclamer le paiement de la commission de 10%"
                            >
                              📢 Réclamation
                            </button>
                          </div>

                          <div className="flex flex-col gap-1 mt-1">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/admin/publications/products/${prod.id}/reception-commande`, { method: "POST" });
                                  if (res.ok) {
                                    alert("📦 Notification de commande reçue enregistrée.");
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                                if (onAdminInitiatePrivateChat) {
                                  const msg = `Bonjour @${prod.sellerName}, ici l'administrateur de la plateforme d'Agroécologie Bénin AgriBot. Nous avons le plaisir d'enregistrer l'intérêt ou la commande d'un client pour la publication suivante de votre boutique maraîchère :\n👉 "${prod.title}" (${prod.price.toLocaleString()} F CFA).\nVeuillez nous répondre directement sur ce fil privé de tchat pour coordonner la mise en relation et finaliser la transaction. Merci !`;
                                  onAdminInitiatePrivateChat(prod.userId || "", prod.sellerName, prod.sellerPhone, msg);
                                }
                              }}
                              className="py-1.5 bg-sky-600 hover:bg-sky-500 rounded text-[10px] text-white font-bold cursor-pointer text-center"
                              title="Envoyer la notification de réception de commande client"
                            >
                              📦 Réception de commande
                            </button>

                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => handleShareClick(prod)}
                                className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-white font-bold cursor-pointer text-center"
                                title="Partager le produit"
                              >
                                🔗 Partager
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/admin/publications/products/${prod.id}/toggle-visibility`, { method: "POST" });
                                    if (res.ok) {
                                      alert("✓ Visibilité suspendue / modifiée.");
                                      window.location.reload();
                                    }
                                  } catch (err) {
                                    alert("Erreur de masquage");
                                  }
                                }}
                                className={`py-1.5 rounded text-[10px] font-bold cursor-pointer text-center ${
                                  prod.isBlockedByCoordinator ? "bg-green-650 text-white" : "bg-red-950 text-white"
                                }`}
                                title="Masquer l'annonce de la vue publique"
                              >
                                {prod.isBlockedByCoordinator ? "👁️ Réactiver" : "🚫 Bloquer Visuel"}
                              </button>
                            </div>

                            {/* Block subsequent user publications */}
                            <button
                              onClick={() => handleToggleMarketplaceBlock(prod.userId || "", prod.sellerName)}
                              className="w-full mt-1 py-1.5 bg-amber-500 text-slate-950 text-[9px] font-black uppercase rounded hover:bg-amber-400 transition"
                              title="Bloquer ou débloquer l'autorisation de publication future pour ce membre"
                            >
                              {blockedWriters[prod.userId || ""] ? "🔓 Autoriser Nouvelles Pubs" : "🔒 Suspendre Nouvelles Pubs"}
                            </button>

                            {/* Admin direct delete from card */}
                            <button
                              onClick={async () => {
                                if (confirm("Voulez-vous vraiment supprimer définitivement cette publication ?")) {
                                  if (onDeleteProduct) {
                                    await onDeleteProduct(prod.id);
                                    alert("Publication supprimée de la Marketplace.");
                                  }
                                }
                              }}
                              className="w-full mt-1 py-1 bg-red-650 hover:bg-red-750 text-white text-[9px] font-black uppercase rounded transition"
                            >
                              🗑️ Supprimer de la Marketplace
                            </button>
                          </div>

                        </div>
                      ) : (user && prod.userId === user.id) ? (
                        <>
                          <p className="text-[10px] text-zinc-550 border rounded-lg p-1.5 text-center font-bold bg-slate-50">
                            ✨ C'est votre publication Maraîchère
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <button
                              onClick={() => handleWhatsAppRedirect(prod)}
                              className="py-1.5 bg-emerald-50 hover:bg-emerald-650 text-emerald-700 hover:text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200"
                            >
                              <MessageCircle className="h-4 w-4 bg-emerald-500 text-white rounded-full p-0.5" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={() => handleDialCode(prod.sellerPhone)}
                              className="py-1.5 bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border"
                            >
                              <PhoneCall className="h-4 w-4 text-emerald-650" />
                              <span className="font-mono">{prod.sellerPhone}</span>
                            </button>
                          </div>
                          
                          {/* Owner direct management controls inside the card */}
                          <div className="grid grid-cols-2 gap-2 mt-1.5">
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-[10.5px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition border border-blue-250 active:scale-95 text-center"
                            >
                              ✏️ Modifier l'annonce
                            </button>
                            <button
                              onClick={() => {
                                if (onDeleteProduct && confirm("Voulez-vous vraiment supprimer définitivement votre publication ?")) {
                                  onDeleteProduct(prod.id);
                                }
                              }}
                              className="py-1.5 px-2 bg-red-50 hover:bg-red-650 text-red-700 hover:text-white rounded-lg text-[10.5px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition border border-red-250 active:scale-95 text-center"
                            >
                              🗑️ Supprimer de l'app
                            </button>
                          </div>
                        </>
                      ) : (
                        /* Chez les autres (Other users): Show ONLY Interested and Share button according to strict sovereign direct channels and contact hiders requirements */
                        <div className="space-y-2">
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={handleIntéresséClick}
                              className="flex-1 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer uppercase shadow-xs active:scale-95"
                              title="Contacter l'administrateur d'AgriBot pour finaliser l'achat"
                            >
                              🤝 Intéressé
                            </button>
                            <button
                              onClick={() => handleShareClick(prod)}
                              className="px-4 py-2.5 bg-slate-100 text-[#091b10] hover:bg-slate-200 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-sm active:scale-95"
                              title="Partager à des prospects"
                            >
                              <Share2 className="h-4 w-4 text-emerald-600" />
                              <span>Partager</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* If the product has its contact blocked by the coordinator, the seller sees this custom unlock option */}
                      {(prod.sellerCommissionBlocked || prod.isBlockedByCoordinator) && belongsToUser && (
                        <div className="p-2.5 bg-red-50 text-red-900 rounded-xl border border-red-200 text-[10px] space-y-2 mt-2">
                          <p className="font-extrabold flex items-center gap-1">
                            <span>⚠️ Visibilité Suspendue (Impayé / Compte Bloqué)</span>
                          </p>
                          <p className="text-[9px] text-red-700 leading-normal">
                             Votre compte ou cette fiche est invisible car vous possédez des commissions en cours. Réglez votre commission ou payez pour débloquer votre compte Marketplace afin de le rendre visible à tous.
                          </p>
                          <button
                            onClick={async () => {
                              try {
                                if (onUpdateProduct) {
                                  await onUpdateProduct(prod.id, { isBlockedByCoordinator: false });
                                }
                                // Trigger user state unblock
                                if (user) {
                                  await fetch(`/api/admin/users/${user.id}/commission-block`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ commissionBlocked: false })
                                  });
                                }
                                alert("Paiement MTN MoMo validé avec succès ! Votre contact est débloqué, votre compte marketplace est réactivé, et votre publication est désormais de nouveau visible de tous.");
                                window.location.reload();
                              } catch (err) {
                                alert("Une erreur est survenue lors du déblocage.");
                              }
                            }}
                            className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-650 hover:from-orange-600 hover:to-red-750 text-white font-extrabold rounded-lg text-center text-[10px] uppercase cursor-pointer"
                          >
                            💸 Débloquer le Contact - 500 F CFA
                          </button>
                        </div>
                      )}

                      {/* Administrative Actions block */}
                      {isUserAdmin && (
                        <div className="mt-2 text-xs border-t border-dashed border-amber-300 pt-2 bg-amber-50/70 p-2 rounded-lg space-y-1.5">
                          <span className="font-extrabold text-amber-900 block uppercase text-[10px]">⚙️ Administration (Jean-Baptiste) :</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={async () => {
                                if (onUpdateProduct) {
                                  await onUpdateProduct(prod.id, { isClosed: !prod.isClosed });
                                  alert(prod.isClosed ? "Annonce ré-ouverte !" : "Annonce BOUCLÉE et archivée avec succès.");
                                }
                              }}
                              className={`flex-1 py-1 px-2 rounded font-black text-[9.5px] uppercase text-white transition ${
                                prod.isClosed ? "bg-emerald-600 hover:bg-emerald-750" : "bg-slate-700 hover:bg-slate-800"
                              }`}
                            >
                              {prod.isClosed ? "📂 Ré-ouvrir" : "📁 Boucler"}
                            </button>
                            <button
                              onClick={async () => {
                                if (onUpdateProduct) {
                                  await onUpdateProduct(prod.id, { isBlockedByCoordinator: !prod.isBlockedByCoordinator });
                                  alert(prod.isBlockedByCoordinator ? "Le contact est maintenant DÉBLOQUÉ et pleinement visible !" : "Le contact du vendeur est maintenant BLOQUÉ (Invisible pour les tiers) !");
                                }
                              }}
                              className={`flex-1 py-1 px-2 rounded font-black text-[9.5px] uppercase text-white transition ${
                                prod.isBlockedByCoordinator ? "bg-red-650 hover:bg-red-750" : "bg-zinc-600 hover:bg-zinc-700"
                              }`}
                            >
                              {prod.isBlockedByCoordinator ? "🔓 Débloquer" : "🔒 Visibilité Bloquer"}
                            </button>
                            <button
                              onClick={async () => {
                                if (onUpdateProduct) {
                                  await onUpdateProduct(prod.id, { commissionReminded: true });
                                  alert(`Relance de 10% commission envoyée avec succès à @${prod.sellerName} (${prod.sellerPhone}) pour l'article "${prod.title}" !`);
                                }
                                if (onAdminInitiatePrivateChat) {
                                  const msg = `Bonjour @${prod.sellerName}, ici l'administrateur de la plateforme d'Agroécologie Bénin AgriBot. Je me permets de vous relancer concernant le versement de la commission réglementaire de 10% sur la vente liée à la publication maraîchère suivante :\n👉 "${prod.title}" (${prod.price.toLocaleString()} F CFA, publié à ${prod.location}).\nMerci de régulariser la transaction via MTN MoMo (*880#) afin de maintenir votre compte au statut actif. Merci beaucoup !`;
                                  onAdminInitiatePrivateChat(prod.userId || "", prod.sellerName, prod.sellerPhone, msg);
                                }
                              }}
                              className={`flex-1 py-1 px-2 rounded font-black text-[9.5px] uppercase transition ${
                                prod.commissionReminded ? "bg-amber-400 text-slate-900" : "bg-yellow-400 hover:bg-yellow-500 text-slate-900"
                              }`}
                            >
                              {prod.commissionReminded ? "Relancé" : "Relancer"}
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>
            );
          })}
      </div>

      {/* SHARING MODAL DESIGN with local details */}
      {sharingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-scale-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Share2 className="h-5 w-5 text-emerald-600 animate-pulse" />
                  <span>Partager l'Annonce Agricole</span>
                </h3>
                <p className="text-[11px] text-slate-500">Sélectionnez le réseau social pour partager cette annonce au Bénin :</p>
              </div>
              <button
                onClick={() => setSharingProduct(null)}
                className="text-slate-400 hover:text-red-600 font-bold text-xs"
              >
                ✕ Fermer
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <p className="text-[11.5px] font-black text-emerald-950 block tracking-tight">🌾  Annonce: {sharingProduct.title}</p>
              <p className="text-[10px] text-zinc-650 mt-1 font-mono">Prix: {sharingProduct.price.toLocaleString()} FCFA · Lieu: {sharingProduct.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* WhatsApp Share Button */}
              <button
                onClick={() => {
                  const shareText = `🌾 ANNONCE MARAÎCHÈRE SUR AGRIBOT MINE D'OR 🌾\n\n📌 Produit : ${sharingProduct.title}\n💰 Prix : ${sharingProduct.price.toLocaleString()} F CFA\n📍 Commune : ${sharingProduct.location}\n\nExposé et diffusé en direct depuis la mine d'or du maraîcher souverain béninois : ${window.location.origin}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
                }}
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-xs"
              >
                <span className="text-base">💬</span>
                <span>WhatsApp</span>
              </button>

              {/* Telegram Share Button */}
              <button
                onClick={() => {
                  const shareText = `🌾 ANNONCE MARAÎCHÈRE SUR AGRIBOT MINE D'OR 🌾\n\n📌 Produit : ${sharingProduct.title}\n💰 Prix : ${sharingProduct.price.toLocaleString()} F CFA\n📍 Commune : ${sharingProduct.location}\n\nRejoignez AgriBot : ${window.location.origin}`;
                  window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(shareText)}`, "_blank");
                }}
                className="py-3 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-xs"
              >
                <span className="text-base">✈️</span>
                <span>Telegram</span>
              </button>

              {/* Facebook Share Button */}
              <button
                onClick={() => {
                  const shareText = `🌾 ANNONCE MARAÎCHÈRE SUR AGRIBOT MINE D'OR : ${sharingProduct.title} à ${sharingProduct.location}`;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`, "_blank");
                }}
                className="py-3 px-3 bg-[#1877f2] hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-xs"
              >
                <span className="text-base">👥</span>
                <span>Facebook</span>
              </button>

              {/* Twitter / X Share Button */}
              <button
                onClick={() => {
                  const shareText = `🌾 Annonce maraîchère: ${sharingProduct.title} (${sharingProduct.location}) via @AgriBotBénin ${window.location.origin}`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
                }}
                className="py-3 px-3 bg-zinc-900 hover:bg-zinc-855 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-xs"
              >
                <span className="text-base">𝕏</span>
                <span>Twitter / X</span>
              </button>
            </div>

            {/* Device Native sharing fallback */}
            <button
              onClick={() => {
                const shareText = `🌾 ANNONCE MARAÎCHÈRE SUR AGRIBOT MINE D'OR 🌾\n\n📌 Produit : ${sharingProduct.title}\n💰 Prix : ${sharingProduct.price.toLocaleString()} F CFA\n📍 Commune : ${sharingProduct.location}\n\nExposé et diffusé en direct depuis la mine d'or du maraîcher souverain béninois : ${window.location.origin}`;
                if (navigator.share) {
                  navigator.share({
                    title: "Partage AgriBot",
                    text: shareText,
                    url: window.location.origin,
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(shareText);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }
              }}
              className="mt-1 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border"
            >
              <Share2 className="h-4 w-4 text-emerald-600" />
              <span>{copiedLink ? "✓ Copié dans le presse-papier !" : "📲 Autres applications ou Copier le texte"}</span>
            </button>
          </div>
        </div>
      )}

      {/* PRICE WATCH ALERT CONFIGURATION MODAL */}
      {alertConfigProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#0c1410] border-2 border-indigo-500/30 text-white rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-150">
            <div className="bg-gradient-to-r from-indigo-905 to-slate-905 p-5 border-b border-indigo-500/20 text-left flex justify-between items-center bg-[#070c09]">
              <div>
                <h3 className="font-extrabold text-[14.5px] uppercase tracking-wide text-indigo-400 flex items-center gap-1.5 font-display">
                  <span>🔔 ALERTE DE PRIX</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">Configurez une alerte pour l'article "{alertConfigProduct.title}"</p>
              </div>
              <button
                onClick={() => setAlertConfigProduct(null)}
                className="text-slate-400 hover:text-white cursor-pointer bg-slate-800 hover:bg-slate-700 w-7 h-7 rounded-full flex items-center justify-center transition text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-left">
              {/* Target options */}
              <div className="space-y-2">
                <label className="block text-[9.5px] font-black uppercase text-[#abafad] tracking-wider">Événements déclencheurs :</label>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-3 bg-[#112015] border border-emerald-950 px-3.5 py-3 rounded-xl hover:bg-[#162a1c] transition duration-150 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertOnDrop}
                      onChange={(e) => setAlertOnDrop(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500 bg-black/40 border-emerald-900 accent-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Le prix descend (baisse de l'article) 📉</span>
                      <span className="text-[9.5px] text-slate-400 mt-0.5 block">Idéal pour acheter le produit au meilleur prix.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 bg-[#112015] border border-emerald-950 px-3.5 py-3 rounded-xl hover:bg-[#162a1c] transition duration-150 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertOnRise}
                      onChange={(e) => setAlertOnRise(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500 bg-black/40 border-emerald-900 accent-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Le prix augmente (hausse de l'article) 📈</span>
                      <span className="text-[9.5px] text-slate-400 mt-0.5 block">Suivez la tendance haussière du marché agricole.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Channel contact */}
              <div className="space-y-1.5">
                <label className="block text-[9.5px] font-black uppercase text-[#abafad] tracking-wider">Canal d'alerte privé :</label>
                <div className="relative">
                  <input
                    type="text"
                    value={alertContact}
                    onChange={(e) => setAlertContact(e.target.value)}
                    placeholder="Numéro de Téléphone / WhatsApp"
                    className="w-full bg-[#070b08] border border-emerald-950 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-white font-mono placeholder:text-zinc-650 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-[9px] text-[#56745e] font-sans font-bold">Bénin Live</span>
                </div>
                <p className="text-[9px] text-zinc-500">AgriBot vous alertera par SMS, WhatsApp et dans le centre de notifications de l'application.</p>
              </div>

              {/* Confirm submit button */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAlertConfigProduct(null)}
                  className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold transition text-zinc-400"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveAlertConfig}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition active:scale-95 text-center"
                >
                  Fidéliser l'alerte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
