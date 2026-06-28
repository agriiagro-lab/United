import React, { useState, useEffect } from "react";
import { Search, ShieldAlert, Trash2, Lock, Unlock, Clock, Sparkles, Check, EyeOff, Eye } from "lucide-react";

interface AdminMemberControlProps {
  adminUsers: any[];
  setAdminUsers: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser?: any;
}

export function AdminMemberControl({ adminUsers, setAdminUsers, currentUser }: AdminMemberControlProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [invisibleHours, setInvisibleHours] = useState<Record<string, number>>({});

  const [selectedUserForReport, setSelectedUserForReport] = useState<any | null>(null);
  const [userReport, setUserReport] = useState<any | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);

  // Pagination states for administrative member control
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination on typing new searches
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Secrétaire Agribot states
  const [activeTabSec, setActiveTabSec] = useState<"directory" | "marketplace" | "solidarite" | "recrutement" | "secretaire">("directory");
  
  // Platform-wide content states
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allSolidarityDemands, setAllSolidarityDemands] = useState<any[]>([]);
  const [allCvs, setAllCvs] = useState<any[]>([]);
  const [allAppels, setAllAppels] = useState<any[]>([]);
  const [loadingPlatform, setLoadingPlatform] = useState(false);

  const fetchAllPlatformData = async () => {
    setLoadingPlatform(true);
    try {
      const res = await fetch("/api/db-state");
      if (res.ok) {
        const data = await res.json();
        setAllProducts(data.products || []);
        setAllCvs(data.cvs || []);
        setAllAppels(data.appelsCandidatures || []);
      }
    } catch (e) {
      console.error("Error loading db state", e);
    }
    try {
      const res = await fetch("/api/solidarity-demands");
      if (res.ok) {
        const data = await res.json();
        setAllSolidarityDemands(data || []);
      }
    } catch (e) {
      console.error("Error loading solidarity demands", e);
    }
    setLoadingPlatform(false);
  };

  useEffect(() => {
    if (activeTabSec !== "directory" && activeTabSec !== "secretaire") {
      fetchAllPlatformData();
    }
  }, [activeTabSec]);

  const [messagesSecretaire, setMessagesSecretaire] = useState<any[]>([
    {
      id: "welcome",
      sender: "secretaire",
      text: "Bonjour Monsieur l'Administrateur Jean-Baptiste ZOUNMATOUN. Je suis la Secrétaire Agribot Mine d'Or 🤖, votre assistante administrative de contrôle attitrée.\n\nJe suis à vos ordres uniques pour :\n- 👤 **Réguler les membres** : demandez-moi de bloquer ou débloquer un compte (ex: *\"bloque l'utilisateur @jean\"*).\n- ⭐ **Abonnements** : valider les privilèges premium (ex: *\"valide l'abonnement de @expert\"*).\n- 📊 **Statistiques & Analyses** : vous faire un point global ou un résumé des activités d'un membre.\n\nQuelle est votre première instruction administrative, M. l'Administrateur ?",
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputSecretaire, setInputSecretaire] = useState("");
  const [pendingSecretaire, setPendingSecretaire] = useState(false);

  const handleSendSecretaire = async (txt?: string) => {
    const textToSend = txt || inputSecretaire;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };

    setMessagesSecretaire(prev => [...prev, userMsg]);
    if (!txt) setInputSecretaire("");
    setPendingSecretaire(true);

    try {
      const response = await fetch("/api/admin/secretaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, user: currentUser })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessagesSecretaire(prev => [...prev, {
            id: "reply_" + Date.now(),
            sender: "secretaire",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
          }]);
          
          if (textToSend.toLowerCase().includes("bloque") || textToSend.toLowerCase().includes("débloque") || textToSend.toLowerCase().includes("premium") || textToSend.toLowerCase().includes("valide")) {
            fetchUsers();
          }
        } else {
          setMessagesSecretaire(prev => [...prev, {
            id: "reply_" + Date.now(),
            sender: "secretaire",
            text: "⚠️ Une erreur s'est produite lors de l'exécution de la commande administrative.",
            timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
          }]);
        }
      } else {
        setMessagesSecretaire(prev => [...prev, {
          id: "reply_" + Date.now(),
          sender: "secretaire",
          text: "⚠️ Impossible de joindre mon cabinet de secrétariat. Vérifiez la connexion de l'administrateur.",
          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        }]);
      }
    } catch (err) {
      setMessagesSecretaire(prev => [...prev, {
        id: "reply_" + Date.now(),
        sender: "secretaire",
        text: "⚠️ Erreur de réseau administrative.",
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setPendingSecretaire(false);
    }
  };

  const handleOpenUserReport = async (u: any) => {
    setSelectedUserForReport(u);
    setLoadingReport(true);
    setUserReport(null);
    try {
      const res = await fetch(`/api/admin/users/${u.id}/report`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserReport(data.report);
        }
      }
    } catch (err) {
      console.error("Erreur de récupération du rapport", err);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleToggleProductVisibility = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/publications/products/${productId}/toggle-visibility`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Visibilité de l'annonce modifiée avec succès.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur de modification de visibilité.");
    }
  };

  const handleBouclerProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/publications/products/${productId}/boucler`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("L'annonce a été bouclée. Un statut fermé a été enregistré.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur");
    }
  };

  const handleRelancerProductCommission = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/publications/products/${productId}/relancer`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Message de relance de commission envoyé avec succès dans la boîte de discussion privée du membre.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur");
    }
  };

  const handleDeleteProductAdmin = async (productId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer définitivement cette publication de la marketplace ?")) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${productId}?userId=usr_admin_jbz`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "usr_admin_jbz" })
      });
      if (res.ok) {
        alert("Publication supprimée de la marketplace avec succès.");
        if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
      }
    } catch (err) {
      alert("Erreur de suppression.");
    }
  };

  const handleReceptionCommandeProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/publications/products/${productId}/reception-commande`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Notification de réception de commande envoyée avec succès au membre par boîte de discussion privée.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur");
    }
  };

  const handleToggleCvVisibility = async (cvId: string) => {
    try {
      const res = await fetch(`/api/admin/publications/cvs/${cvId}/toggle-visibility`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Visibilité du profil CV modifiée avec succès.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur.");
    }
  };

  const handleBouclerCv = async (cvId: string) => {
    try {
      const res = await fetch(`/api/admin/publications/cvs/${cvId}/boucler`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Profil CV marqué comme bouclé.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur.");
    }
  };

  const handleRelancerCvCommission = async (cvId: string) => {
    try {
      const res = await fetch(`/api/admin/publications/cvs/${cvId}/relancer`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Message de relance commission recrutement envoyé avec succès dans la boîte de discussion privée du membre.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur.");
    }
  };

  const handleReceptionCommandeCv = async (cvId: string) => {
    try {
      const res = await fetch(`/api/admin/publications/cvs/${cvId}/reception-commande`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Notification de confirmation de recrutement envoyée avec succès au membre par boîte de discussion privée.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur.");
    }
  };

  const handleDeleteCvAdmin = async (cvId: string) => {
    if (!confirm("Voulez-vous supprimer définitivement ce profil CV ?")) return;
    try {
      const res = await fetch(`/api/cvs/${cvId}?userId=usr_admin_jbz`, { method: "DELETE" });
      if (res.ok) {
        alert("CV supprimé avec succès.");
        fetchAllPlatformData();
      }
    } catch (e) {
      alert("Erreur de suppression.");
    }
  };

  const handleDeleteAppelAdmin = async (id: string) => {
    if (!confirm("Voulez-vous supprimer définitivement cette offre d'emploi ?")) return;
    try {
      const res = await fetch(`/api/appels-candidatures/${id}?userId=usr_admin_jbz`, { method: "DELETE" });
      if (res.ok) {
        alert("Offre d'emploi supprimée avec succès.");
        fetchAllPlatformData();
      }
    } catch (e) {
      alert("Erreur de suppression.");
    }
  };

  const handleCloseSolidarity = async (id: string) => {
    try {
      const res = await fetch("/api/solidarity-demands/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandId: id })
      });
      if (res.ok) {
        alert("Demande d'entraide clôturée avec succès.");
        fetchAllPlatformData();
      }
    } catch (e) {
      alert("Erreur de clôture.");
    }
  };

  const handleDeleteSolidarity = async (id: string) => {
    if (!confirm("Voulez-vous supprimer définitivement cette demande d'entraide ?")) return;
    try {
      const res = await fetch(`/api/solidarity-demands/${id}?userId=usr_admin_jbz`, { method: "DELETE" });
      if (res.ok) {
        alert("Demande d'entraide supprimée avec succès.");
        fetchAllPlatformData();
      }
    } catch (e) {
      alert("Erreur de suppression.");
    }
  };

  const handleToggleVideoVisibility = async (videoId: string) => {
    try {
      const res = await fetch(`/api/admin/videos/${videoId}/toggle-visibility`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Visibilité de la vidéo modifiée avec succès.");
          if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
        }
      }
    } catch (err) {
      alert("Erreur.");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("⚠️ Confirmer la suppression définitive de cette vidéo ?")) return;
    try {
      const res = await fetch(`/api/admin/videos/${videoId}`, { method: "DELETE" });
      if (res.ok) {
        alert("Vidéo supprimée définitivement.");
        if (selectedUserForReport) handleOpenUserReport(selectedUserForReport);
      }
    } catch (err) {
      alert("Erreur.");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setAdminUsers(data.users);
        } else {
          setErrorStatus("Problème de format de réponse serveur.");
        }
      } else {
        setErrorStatus("Erreur réseau lors de la récupération des membres.");
      }
    } catch (err) {
      setErrorStatus("Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTogglePremium = async (userId: string, currentPremium: boolean, months: number = 12) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/premium`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPremium: !currentPremium, months })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAdminUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
        }
      }
    } catch (err) {
      alert("Erreur de modification premium.");
    }
  };

  const handleToggleBlock = async (userId: string, currentBlocked: boolean) => {
    const url = `/api/admin/users/${userId}/${currentBlocked ? "unblock" : "block"}`;
    const reason = currentBlocked 
      ? "" 
      : prompt("Raison du blocage de ce compte :", "Non-respect de la charte d'éthique de la coopérative.");
    
    if (!currentBlocked && reason === null) return; // Prompt cancelled

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAdminUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
        }
      }
    } catch (err) {
      alert("Erreur de changement d'état de blocage.");
    }
  };

  const handleSetInvisibility = async (userId: string, hours: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/invisible`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAdminUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
          alert(hours > 0 
            ? `Compte rendu invisible avec succès pour une durée de ${hours} heures.`
            : "Invisibilité annulée avec succès. Le compte est de nouveau visible de tous."
          );
        }
      }
    } catch (err) {
      alert("Erreur d'invisibilité.");
    }
  };

  const handleToggleCommissionBlock = async (userId: string, currentBlocked: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/commission-block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionBlocked: !currentBlocked })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAdminUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
        }
      }
    } catch (err) {
      alert("Erreur d'état commission.");
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`⚠️ Êtes-vous ABSOLUMENT certain de vouloir supprimer définitivement le compte de ${username} ? Cette action détruira également ses publications de manière irréversible.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
        alert(`Le compte de ${username} a été radié avec succès de la base de données.`);
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      alert("Erreur de suppression du compte.");
    }
  };

  const filteredMembers = adminUsers.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.username?.toLowerCase().includes(term) ||
      u.firstName?.toLowerCase().includes(term) ||
      u.lastName?.toLowerCase().includes(term) ||
      u.phone?.includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const displayedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search & AI Cabinet Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveTabSec("directory")}
          className={`px-3.5 py-2.5 rounded-xl font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
            activeTabSec === "directory"
              ? "bg-emerald-600 text-white shadow-md border border-emerald-700"
              : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          📋 Annuaire & Membres
        </button>
        
        <button
          onClick={() => setActiveTabSec("marketplace")}
          className={`px-3.5 py-2.5 rounded-xl font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
            activeTabSec === "marketplace"
              ? "bg-emerald-600 text-white shadow-md border border-emerald-700"
              : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          🧺 Marketplace
        </button>

        <button
          onClick={() => setActiveTabSec("solidarite")}
          className={`px-3.5 py-2.5 rounded-xl font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
            activeTabSec === "solidarite"
              ? "bg-emerald-600 text-white shadow-md border border-emerald-700"
              : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          🤝 Solidarité & Entraide
        </button>

        <button
          onClick={() => setActiveTabSec("recrutement")}
          className={`px-3.5 py-2.5 rounded-xl font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
            activeTabSec === "recrutement"
              ? "bg-emerald-600 text-white shadow-md border border-emerald-700"
              : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          👥 Recrutements (CV/Offres)
        </button>

        <button
          onClick={() => setActiveTabSec("secretaire")}
          className={`px-3.5 py-2.5 rounded-xl font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
            activeTabSec === "secretaire"
              ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md border border-emerald-600"
              : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          🤖 Secrétaire d'IA <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        </button>
      </div>

      {activeTabSec === "directory" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-slate-800">
      {/* Search Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, pseudo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-emerald-500 placeholder-slate-400"
          />
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
        >
          🔄 Actualiser la liste
        </button>
      </div>

      {loading && (
        <div className="p-12 text-center text-slate-500 font-mono text-xs animate-pulse">
          Chargement de l'annuaire de contrôle en cours...
        </div>
      )}

      {errorStatus && (
        <div className="p-6 bg-red-50 text-red-800 text-xs font-semibold m-4 rounded-xl border border-red-250">
          ⚠️ {errorStatus}
        </div>
      )}

      {!loading && filteredMembers.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-xs font-mono">
          Aucun membre trouvé correspondant aux critères.
        </div>
      )}

      {!loading && filteredMembers.length > 0 && (
        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase font-mono text-[9.5px] border-b border-slate-200">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Pseudo &amp; Contact</th>
                <th className="p-4">Status Actuels</th>
                <th className="p-4 text-right">Actions de l'Administrateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {displayedMembers.map((member) => {
                const isJbz = member.username?.toLowerCase() === "jbz001" || member.username?.toLowerCase() === "coordonnateur" || member.username?.toLowerCase() === "administrateur" || member.email === "jbzounmatoun@gmail.com";
                const activeInvisible = member.invisibleUntil && (new Date(member.invisibleUntil).getTime() > Date.now());
                const timeRemaining = activeInvisible 
                  ? Math.round((new Date(member.invisibleUntil).getTime() - Date.now()) / 60000) 
                  : 0;

                return (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition duration-150 text-xs">
                    {/* User info */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1 text-[13px]">
                        <span>👤 {member.firstName || "Inconnu"} {member.lastName || ""}</span>
                        {isJbz && (
                          <span className="bg-amber-600 text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded font-mono">Administrateur</span>
                        )}
                      </div>
                      <div className="text-slate-500 text-[10px] mt-0.5 font-mono">{member.email || "Non renseigné"}</div>
                      
                      <button
                        onClick={() => handleOpenUserReport(member)}
                        className="mt-2 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition shadow-xs"
                      >
                        📊 Rapport de gestion complet
                      </button>
                    </td>

                    {/* Contact detail */}
                    <td className="p-4">
                      <div className="font-mono bg-slate-100 px-2 py-0.5 rounded-md inline-block text-[11px] font-black text-slate-700">@{member.username || "sans_pseudo"}</div>
                      <div className="text-emerald-700 font-bold mt-1 font-mono text-[11px]">📞 {member.phone || "Inconnu"}</div>
                    </td>

                    {/* Status badges */}
                    <td className="p-4 space-y-1">
                      <div className="flex flex-wrap gap-1.5">
                        {/* Premium badge */}
                        {member.isPremium ? (
                          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black uppercase rounded-md text-[8.5px] px-2 py-0.5 shadow-3xs flex items-center gap-0.5">
                            ⭐ Premium Illimité
                          </span>
                        ) : (
                          <span className="bg-slate-200 text-slate-600 rounded-md text-[8.5px] px-2 py-0.5 font-bold uppercase font-mono">Essai Libre</span>
                        )}

                        {/* Account active / blocked / invisible indicators */}
                        {member.isBlocked ? (
                          <span className="bg-red-100 text-red-800 border border-red-200 rounded-md text-[8.5px] px-2 py-0.5 font-black uppercase">
                            🔴 Compte Bloqué
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 border border-green-200 rounded-md text-[8.5px] px-2 py-0.5 font-black uppercase">
                            🟢 Normal Actif
                          </span>
                        )}

                        {activeInvisible ? (
                          <span className="bg-yellow-100 text-yellow-800 border border-yellow-250 rounded-md text-[8.5px] px-2 py-0.5 font-black uppercase flex items-center gap-0.5 animate-pulse">
                            👀 Invisible ({timeRemaining} min restantes)
                          </span>
                        ) : null}

                        {member.commissionBlocked ? (
                          <span className="bg-orange-100 text-orange-850 border border-orange-250 rounded-md text-[8.5px] px-2 py-0.5 font-black uppercase">
                            🚫 Commission Impayée
                          </span>
                        ) : null}
                      </div>
                      
                      {member.blockReason && (
                        <div className="text-[9.5px] text-red-700 border-l-2 border-red-400 pl-1.5 italic font-mono mt-1">
                          Raison : {member.blockReason}
                        </div>
                      )}
                    </td>

                    {/* Action toggles */}
                    <td className="p-4 text-right space-y-2">
                      <div className="flex justify-end gap-1.5 flex-wrap">
                        {/* Premium toggle */}
                        <button
                          onClick={() => handleTogglePremium(member.id, !!member.isPremium, 12)}
                          disabled={isJbz}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                            member.isPremium 
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200" 
                              : "bg-amber-500 hover:bg-amber-600 text-white"
                          } cursor-pointer disabled:opacity-40`}
                          title="Accorder version Premium illimitée"
                        >
                          ⭐ {member.isPremium ? "Privilège Premium Off" : "Privilège Premium On"}
                        </button>

                        {/* Block / Unblock toggle */}
                        <button
                          onClick={() => handleToggleBlock(member.id, !!member.isBlocked)}
                          disabled={isJbz}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                            member.isBlocked 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "bg-red-650 hover:bg-red-700 text-white"
                          } cursor-pointer disabled:opacity-40`}
                          title="Bloquer ou débloquer l'accès global au compte du membre"
                        >
                          {member.isBlocked ? <Unlock className="h-3.5 w-3.5 inline inline-middle mr-0.5" /> : <Lock className="h-3.5 w-3.5 inline inline-middle mr-0.5" />}
                          {member.isBlocked ? "Débloquer" : "Bloquer"}
                        </button>

                        {/* Commission Blockage Toggle */}
                        <button
                          onClick={() => handleToggleCommissionBlock(member.id, !!member.commissionBlocked)}
                          disabled={isJbz}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                            member.commissionBlocked 
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                              : "bg-orange-550 hover:bg-orange-600 text-white"
                          } cursor-pointer disabled:opacity-40`}
                          title="Bloquer le compte marketplace du membre en cas de non paiement de la commission"
                        >
                          🚫 {member.commissionBlocked ? "Libérer Commission" : "Bloquer Commission"}
                        </button>

                        {/* Delete completely */}
                        <button
                          onClick={() => handleDeleteUser(member.id, member.username)}
                          disabled={isJbz}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg cursor-pointer transition disabled:opacity-45"
                          title="Supprimer définitivement le compte membre"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Invisibility shadow ban select */}
                      {!isJbz && (
                        <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100">
                          <span className="text-[9px] font-bold text-slate-500 uppercase font-mono">Masquage tempo :</span>
                          <select
                            onChange={(e) => {
                              const hours = Number(e.target.value);
                              handleSetInvisibility(member.id, hours);
                            }}
                            value={activeInvisible ? "custom" : "0"}
                            className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md py-1 px-1.5 text-[10px] focus:outline-emerald-500 font-semibold"
                          >
                            <option value="0">Compte visible (Public)</option>
                            <option value="2">Masquer 2 heures</option>
                            <option value="12">Masquer 12 heures</option>
                            <option value="24">Masquer 24 heures (1 Jour)</option>
                            <option value="168">Masquer 7 Jours (1 Semaine)</option>
                            {activeInvisible && <option value="custom" disabled>⚠️ Invisible en cours</option>}
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modern Administrative Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <span className="text-zinc-500 font-mono text-[11px] font-bold">
            Affichage { (currentPage - 1) * itemsPerPage + 1 } - { Math.min(currentPage * itemsPerPage, filteredMembers.length) } sur { filteredMembers.length } agro-fermiers
          </span>
          <div className="flex gap-2.5 items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                document.getElementById("admin-control-tab-view")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide transition uppercase shrink-0 cursor-pointer ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100"
              }`}
            >
              Précédent
            </button>
            
            <div className="flex gap-1.5 overflow-x-auto max-w-[120px] sm:max-w-none scrollbar-hide">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    document.getElementById("admin-control-tab-view")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center shrink-0 ${
                    currentPage === i + 1
                      ? "bg-emerald-600 text-white shadow-xs border border-emerald-700"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                document.getElementById("admin-control-tab-view")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide transition uppercase shrink-0 cursor-pointer ${
                currentPage === totalPages
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100"
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Scroll to Top helper with unified button */}
      <div className="flex justify-center py-3 bg-slate-50/50 border-t border-slate-100">
        <button
          onClick={() => {
            document.getElementById("admin-control-tab-view")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-[10px] font-black uppercase text-emerald-800 tracking-wider hover:text-emerald-600 cursor-pointer flex items-center gap-1 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-250/40 transition hover:scale-105 active:scale-95 shadow-3xs"
        >
          ⬆️ Retourner en haut du tableau
        </button>
      </div>

      </div>
      )}

      {/* ==================================== MARKETPLACE TAB ==================================== */}
      {activeTabSec === "marketplace" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 text-slate-800 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black font-display text-slate-900">🧺 Supervision de la Marketplace & Intrants ({allProducts.length})</h3>
              <p className="text-xs text-slate-500 mt-1">Supervisez la conformité des publications d'annonces, masquez les contenus abusifs ou relancez les commissions de la coopérative.</p>
            </div>
            <button 
              onClick={fetchAllPlatformData}
              className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs transition cursor-pointer shrink-0"
              disabled={loadingPlatform}
            >
              {loadingPlatform ? "🔄 Chargement..." : "🔄 Actualiser"}
            </button>
          </div>

          {loadingPlatform ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">Chargement de la marketplace...</div>
          ) : allProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs italic">Aucune annonce publiée à ce jour.</div>
          ) : (
            <div className="overflow-x-auto border border-slate-150 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-mono text-[9px] uppercase">
                    <th className="p-3">Annonceur</th>
                    <th className="p-3">Détail Produit</th>
                    <th className="p-3">Type / Prix</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Actions Administrateur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allProducts.map((p) => {
                    const isBlocked = p.isBlockedByCoordinator === true;
                    const statusText = p.isClosed ? "Bouclé ✓" : isBlocked ? "Contenu Masqué" : "Actif";
                    const statusBadgeClass = p.isClosed 
                      ? "bg-slate-105 text-slate-600 border-slate-200" 
                      : isBlocked 
                        ? "bg-rose-50 text-rose-700 border-rose-200" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-200";

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900">{p.userName || p.sellerName || p.authorName || "Anonyme"}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{p.userPhone || p.sellerPhone || "Non renseigné"}</p>
                        </td>
                        <td className="p-3 max-w-[200px]">
                          <p className="font-bold text-slate-800 line-clamp-1">{p.title}</p>
                          <p className="text-[10px] text-zinc-500 italic line-clamp-1">{p.description}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-extrabold text-emerald-750 font-mono">{p.price?.toLocaleString()} F CFA</p>
                          <p className="text-[9.5px] text-slate-400 uppercase font-bold tracking-wider">{p.type === "recherche" ? "🔍 Besoin d'achat" : "🧺 Offre de vente"}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusBadgeClass}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1.5 flex-wrap max-w-sm">
                            <button
                              onClick={async () => {
                                await handleToggleProductVisibility(p.id);
                                fetchAllPlatformData();
                              }}
                              className={`px-2.5 py-1 text-[9.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer border transition ${
                                isBlocked 
                                  ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700" 
                                  : "bg-rose-50 text-rose-700 border-rose-250 hover:bg-rose-100"
                              }`}
                            >
                              {isBlocked ? "👁️ Rétablir" : "🚫 Masquer Visuel"}
                            </button>
                            
                            {!p.isClosed && (
                              <button
                                onClick={async () => {
                                  await handleBouclerProduct(p.id);
                                  fetchAllPlatformData();
                                }}
                                className="px-2.5 py-1 bg-amber-500 text-slate-950 border border-amber-600 hover:bg-amber-600 text-[9.5px] font-bold rounded-lg uppercase tracking-wider cursor-pointer"
                              >
                                ✓ Boucler Vente
                              </button>
                            )}

                            <button
                              onClick={async () => {
                                await handleRelancerProductCommission(p.id);
                                fetchAllPlatformData();
                              }}
                              className="px-2.5 py-1 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 text-[9.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer"
                            >
                              📢 Réclamation (10%)
                            </button>

                            <button
                              onClick={async () => {
                                await handleDeleteProductAdmin(p.id);
                                fetchAllPlatformData();
                              }}
                              className="px-2.5 py-1 bg-red-650 text-white border border-red-700 hover:bg-red-750 text-[9.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================================== SOLIDARITE TAB ==================================== */}
      {activeTabSec === "solidarite" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 text-slate-800 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black font-display text-slate-900">🤝 Espace d'Entraide Communautaire & Solidarité ({allSolidarityDemands.length})</h3>
              <p className="text-xs text-slate-500 mt-1">Gérez les demandes d'entraide, validez le bon déroulement des chantiers ou supprimez les demandes non conformes.</p>
            </div>
            <button 
              onClick={fetchAllPlatformData}
              className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs transition cursor-pointer shrink-0"
              disabled={loadingPlatform}
            >
              {loadingPlatform ? "🔄 Chargement..." : "🔄 Actualiser"}
            </button>
          </div>

          {loadingPlatform ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">Chargement des demandes d'entraide...</div>
          ) : allSolidarityDemands.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs italic">Aucune demande de solidarité en cours.</div>
          ) : (
            <div className="overflow-x-auto border border-slate-150 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-mono text-[9px] uppercase">
                    <th className="p-3">Adhérent</th>
                    <th className="p-3">Détails Projet</th>
                    <th className="p-3">Conditions</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Actions de Modération</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allSolidarityDemands.map((s) => {
                    const statusText = s.statut === "terminee" ? "Terminé ✓" : "En cours d'entraide";
                    const statusBadgeClass = s.statut === "terminee" 
                      ? "bg-slate-100 text-slate-600 border-slate-200" 
                      : "bg-emerald-50 text-emerald-700 border-emerald-200";

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900">{s.userName || "Adhérent Agri"}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{s.contactValue || "Par défaut"}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-black text-slate-800 line-clamp-1">{s.title}</p>
                          <p className="text-[10px] text-zinc-500 line-clamp-2 italic">{s.description}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-extrabold text-slate-700 font-mono mt-0.5">{s.montant ? `${s.montant} F CFA` : "Entraide pure"}</p>
                          <p className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-1 py-0.5 inline-block capitalize mt-1 font-mono">{s.typeRemuneration || "Rémunéré"}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusBadgeClass}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1.5 flex-wrap">
                            {s.statut !== "terminee" && (
                              <button
                                onClick={() => handleCloseSolidarity(s.id)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[9.5px] font-bold rounded-lg uppercase tracking-wider cursor-pointer border border-amber-600"
                              >
                                ✓ Clôturer
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteSolidarity(s.id)}
                              className="px-2.5 py-1 bg-red-650 hover:bg-red-750 text-white text-[9.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer border border-red-700"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================================== RECRUTEMENT TAB ==================================== */}
      {activeTabSec === "recrutement" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-8 text-slate-800 text-left">
          
          {/* Subsection A: CV profiles */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black font-display text-slate-900">👥 Bureau de Placement : Conseillers Agricoles ({allCvs.length})</h3>
                <p className="text-xs text-slate-500 mt-1">Supervisez les fiches professionnelles enregistrées dans la CV-thèque publique.</p>
              </div>
              <button 
                onClick={fetchAllPlatformData}
                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs transition cursor-pointer shrink-0"
                disabled={loadingPlatform}
              >
                🔄 Actualiser
              </button>
            </div>

            {loadingPlatform ? (
              <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">Chargement de la CV-thèque...</div>
            ) : allCvs.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono italic p-4 text-center">Aucun conseiller n'a encore enregistré son CV.</p>
            ) : (
              <div className="overflow-x-auto border border-slate-150 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-mono text-[9px] uppercase">
                      <th className="p-3">Conseiller</th>
                      <th className="p-3">Diplômes & Expérience</th>
                      <th className="p-3">Statut</th>
                      <th className="p-3 text-right">Actions de Placement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allCvs.map((c) => {
                      const isBlocked = c.isBlockedByCoordinator === true;
                      const statusText = c.isClosed ? "Placé / Pourvu" : isBlocked ? "Fiche Masquée" : "Disponible";
                      const statusBadgeClass = c.isClosed 
                        ? "bg-slate-100 text-slate-600 border-slate-200" 
                        : isBlocked 
                          ? "bg-rose-50 text-rose-700 border-rose-200" 
                          : "bg-emerald-50 text-emerald-700 border-emerald-200";

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-3">
                            <p className="font-extrabold text-slate-900">{c.fullName || "Adhérent Expert"}</p>
                            <p className="text-[10px] text-slate-500 font-mono">Dépt: {c.department || "Borgou"}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-800">{c.specialty} ({c.level || "Bac+3"})</p>
                            <p className="text-[10px] text-zinc-500 italic line-clamp-1">Prétentions: {c.pretentionSalary || "À négocier"}</p>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusBadgeClass}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1.5 flex-wrap">
                              <button
                                onClick={async () => {
                                  await handleToggleCvVisibility(c.id);
                                  fetchAllPlatformData();
                                }}
                                className={`px-2 py-1 text-[9.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer border transition ${
                                  isBlocked 
                                    ? "bg-emerald-600 text-white border-emerald-700" 
                                    : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                }`}
                              >
                                {isBlocked ? "👁️ Rétablir" : "🚫 Masquer"}
                              </button>

                              {!c.isClosed && (
                                <button
                                  onClick={async () => {
                                    await handleBouclerCv(c.id);
                                    fetchAllPlatformData();
                                  }}
                                  className="px-2 py-1 bg-amber-500 text-slate-950 font-bold border border-amber-655 hover:bg-amber-600 text-[9.5px] rounded-lg uppercase tracking-wider cursor-pointer"
                                >
                                  ✓ Boucler Placement
                                </button>
                              )}

                              <button
                                onClick={async () => {
                                  await handleRelancerCvCommission(c.id);
                                  fetchAllPlatformData();
                                }}
                                className="px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 text-[9.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer border border-blue-700"
                              >
                                📢 Commission Relance
                              </button>

                              <button
                                onClick={async () => {
                                  await handleDeleteCvAdmin(c.id);
                                  fetchAllPlatformData();
                                }}
                                className="px-2 py-1 bg-red-650 hover:bg-red-750 text-white text-[9.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer border border-red-700"
                              >
                                🗑️ Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Subsection B: Appels de candidature (Job offers) */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <h3 className="text-base font-black font-display text-slate-900">📢 Offres de Recrutement Publiées ({allAppels.length})</h3>
              <p className="text-xs text-slate-500 mt-1">Modérez les annonces et offres d'emploi déposées par les coopératives et exploitants.</p>
            </div>

            {loadingPlatform ? (
              <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">Chargement des offres...</div>
            ) : allAppels.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono italic p-4 text-center">Aucune offre de recrutement publiée à ce jour.</p>
            ) : (
              <div className="overflow-x-auto border border-slate-150 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-mono text-[9px] uppercase">
                      <th className="p-3">Société / Posteur</th>
                      <th className="p-3">Poste Recherché</th>
                      <th className="p-3">Lieu &amp; Contrat</th>
                      <th className="p-3 text-right">Actions Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allAppels.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900">{a.company || "Exploitant Agricole"}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Contact: {a.contact || "Via Plateforme"}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{a.title}</p>
                          <p className="text-[10px] text-zinc-500 italic line-clamp-1">{a.description}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-extrabold text-indigo-750 font-mono">{a.typeContrat || "CDD Maraîcher"}</p>
                          <p className="text-[10px] text-slate-400">Lieu: {a.location || "Non défini"}</p>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={async () => {
                              await handleDeleteAppelAdmin(a.id);
                              fetchAllPlatformData();
                            }}
                            className="px-3 py-1 bg-red-650 hover:bg-red-750 text-white text-[9.5px] font-black rounded-lg uppercase tracking-wider cursor-pointer border border-red-750"
                          >
                            🗑️ Supprimer l'offre
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================== SECRETAIRE TAB ==================================== */}
      {activeTabSec === "secretaire" && (
        <div className="bg-[#0c1410] border-2 border-[#27ae60]/15 text-white rounded-3xl p-6 space-y-6 text-left font-sans shadow-xl">
          {/* Header of Secretary Cabinet */}
          <div className="bg-[#0e2217] p-5 rounded-2xl border border-[#27ae60]/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[#2ecc71] font-extrabold uppercase text-[10px] tracking-wider font-mono bg-[#2ecc71]/10 px-2.5 py-0.5 rounded-full border border-[#2ecc71]/20">DIRECTEUR CONTRÔLE</span>
                <span className="bg-[#2ecc71]/10 text-white text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase border border-[#2ecc71]/20">M. J-B ZOUNMATOUN</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#e8f5ec] mt-1.5 font-display flex items-center gap-1.5">
                <span>Cabinet de Secrétariat et Contrôle d'Élite</span>
              </h3>
              <p className="text-slate-350 text-[11px] mt-1 leading-relaxed">
                Régulez la plateforme en tant que télécommande souveraine. Exécutez n'importe quelle instruction ou modification : votre Secrétaire Administrative d'élite dispose des pleins pouvoirs en lecture/écriture en temps-réel.
              </p>
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-[#0a0f0d] rounded-2xl border border-[#27ae60]/15 p-4 h-[420px] overflow-y-auto flex flex-col gap-3.5 font-sans">
            <div className="flex items-center gap-2 justify-center pb-2 border-b border-[#27ae60]/10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4a7057]">
                Ligne de discussion cryptée et certifiée
              </span>
            </div>

            {messagesSecretaire.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}>
                <div className="flex items-center gap-1.5 px-1 mb-0.5">
                  {msg.sender !== "user" && (
                    <div className="w-4 h-4 rounded bg-[#27ae60] flex items-center justify-center text-[10px] text-white">💼</div>
                  )}
                  <span className="text-[10px] font-extrabold tracking-wider text-[#2ecc71]">
                    {msg.sender === "user" ? "MONSIEUR L'ADMINISTRATEUR" : "SECRÉTAIRE ADMINISTRATIVE"}
                  </span>
                  <span className="text-[9px] text-[#4a7057] font-mono">({msg.timestamp})</span>
                </div>
                <div className={`p-3.5 rounded-2xl text-[11.5px] leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user" 
                    ? "bg-[#27ae60]/20 text-white rounded-tr-none border border-[#27ae60]/30 font-medium" 
                    : "bg-[#0c1410] text-[#e8f5ec] rounded-tl-none border border-[#27ae60]/15"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {pendingSecretaire && (
              <div className="self-start flex flex-col items-start max-w-[85%] animate-pulse">
                <span className="text-[10px] font-bold text-slate-400 mb-0.5">La Secrétaire traite votre ordre souverain...</span>
                <div className="p-3 bg-[#0c1410] border border-[#27ae60]/15 text-slate-350 text-[11.5px] rounded-xl rounded-tl-none">
                  Mise à jour instantanée des bases de données en cours... Veuillez patienter.
                </div>
              </div>
            )}
          </div>

          {/* Text input area */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Saisissez une consigne administrative souveraine... (ex: supprime l'annonce de soja)"
              value={inputSecretaire}
              onChange={(e) => setInputSecretaire(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendSecretaire();
              }}
              disabled={pendingSecretaire}
              className="flex-1 bg-[#070c0a] border border-[#27ae60]/15 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-[#2ecc71] placeholder-slate-500 font-medium font-mono"
            />
            <button 
              onClick={() => handleSendSecretaire()}
              disabled={pendingSecretaire}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-855 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none disabled:opacity-50"
            >
              Exécuter
            </button>
          </div>
        </div>
      )}

      {/* FULL COMPREHENSIVE ADMINISTRATIVE REPORT MODAL OVERLAY */}
      {selectedUserForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-755 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in text-left">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">📊 Fiche d'Auditeur & Contrôle Administratif</h3>
                <p className="text-[11px] text-slate-400 font-medium">Membre : <span className="font-bold text-white font-mono">{selectedUserForReport.firstName} {selectedUserForReport.lastName}</span> (@{selectedUserForReport.username})</p>
              </div>
              <button 
                onClick={() => setSelectedUserForReport(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-900 border border-slate-700 hover:border-red-700 flex items-center justify-center font-bold text-xs select-none transition cursor-pointer text-white"
              >
                ✕
              </button>
            </div>

            {/* Content Core Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs leading-normal">
              
              {loadingReport && (
                <div className="p-16 text-center text-slate-400 font-mono animate-pulse">
                  🔮 Chargement des fiches, statistiques de sessions et rapports complets de l'adhérent...
                </div>
              )}

              {/* Data Loaded */}
              {!loadingReport && userReport && (
                <>
                  {/* Summary Grid section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Column 1: Profile parameters info */}
                    <div className="p-4 rounded-2xl bg-slate-950/85 border border-slate-800 space-y-2.5">
                      <h4 className="text-[10px] uppercase font-black text-emerald-400 font-mono tracking-wider">📋 Paramètres d'Abonnement</h4>
                      <div className="space-y-1.5 text-slate-300">
                        <p>Création : <span className="text-white font-bold font-mono">{new Date(userReport.userCreatedAt).toLocaleDateString("fr-FR")}</span></p>
                        <p>Temps de connexion : <span className="text-amber-400 font-extrabold font-mono">{(userReport.timeSpentMin / 60).toFixed(1)} Heures</span></p>
                        <p>GSM Contact : <span className="text-white font-bold font-mono">{selectedUserForReport.phone}</span></p>
                        <p>Type de Compte : <span className="text-white font-bold font-mono">{selectedUserForReport.isPremium ? "⭐ Premium" : "🍃 Essai Libre"}</span></p>
                        <p>État : <span className={selectedUserForReport.isBlocked ? "text-red-500 font-bold" : "text-green-500 font-bold"}>{selectedUserForReport.isBlocked ? "Compte Bloqué" : "Actif Régulier"}</span></p>
                        <p>Complétion Profil : <span className="px-1.5 py-0.5 rounded-sm bg-indigo-950 text-indigo-300 font-black font-mono">92 %</span></p>
                      </div>
                    </div>

                    {/* Column 2: Message reporting */}
                    <div className="p-4 rounded-2xl bg-slate-950/85 border border-slate-800 space-y-2.5">
                      <h4 className="text-[10px] uppercase font-black text-emerald-400 font-mono tracking-wider">💬 Rapport d'Échange & Tchat</h4>
                      <div className="space-y-1.5 text-slate-300">
                        <p>Requêtes AgriBot IA : <span className="text-emerald-400 font-black font-mono">{userReport.totalAgribotIA} prompts</span></p>
                        <p>Tchats Communaux : <span className="text-sky-400 font-black font-mono">{userReport.totalChatCommunal} messages</span></p>
                        <p className="text-slate-400 font-semibold text-amber-500">Fil de Discussion Privé :</p>
                        <p className="text-[10.5px] italic text-slate-400 border-l-2 border-slate-700 pl-2">
                           Liaison messagerie sécurisée active avec l'administrateur ({userReport.totalChatPrivate} messages échangés).
                        </p>
                      </div>
                    </div>

                    {/* Column 3: Fast controls */}
                    <div className="p-4 rounded-2xl bg-slate-950/85 border border-slate-800 space-y-2.5">
                      <h4 className="text-[10px] uppercase font-black text-emerald-400 font-mono tracking-wider">⚡ Actions de Contrôle Rapides</h4>
                      <div className="flex flex-col gap-2 pt-1">
                        <button
                          onClick={async () => {
                            await handleToggleBlock(selectedUserForReport.id, !!selectedUserForReport.isBlocked);
                            const updatedUser = adminUsers.find(u => u.id === selectedUserForReport.id);
                            if (updatedUser) setSelectedUserForReport(updatedUser);
                          }}
                          className={`w-full py-2 rounded-xl text-[10px] uppercase font-black tracking-wider transition cursor-pointer text-center ${
                            selectedUserForReport.isBlocked ? "bg-green-650 hover:bg-green-700 text-white" : "bg-red-650 hover:bg-red-700 text-white"
                          }`}
                        >
                          {selectedUserForReport.isBlocked ? "🔓 Débloquer l'accès" : "🔒 Suspendre l'utilisateur (Bloquer)"}
                        </button>

                        <button
                          onClick={async () => {
                            const hours = Number(prompt("Saisissez la durée du masquage de l'avatar en heures (0 pour visible) :", "24"));
                            if (isNaN(hours)) return;
                            await handleSetInvisibility(selectedUserForReport.id, hours);
                            const updatedUser = adminUsers.find(u => u.id === selectedUserForReport.id);
                            if (updatedUser) setSelectedUserForReport(updatedUser);
                          }}
                          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-[10px] uppercase font-black tracking-wider transition cursor-pointer text-center border border-slate-700"
                        >
                          👁️ Gérer la visibilité du compte
                        </button>

                        <button
                          onClick={async () => {
                            await handleToggleCommissionBlock(selectedUserForReport.id, !!selectedUserForReport.commissionBlocked);
                            const updatedUser = adminUsers.find(u => u.id === selectedUserForReport.id);
                            if (updatedUser) setSelectedUserForReport(updatedUser);
                          }}
                          className={`w-full py-2 rounded-xl text-[10px] uppercase font-black tracking-wider transition cursor-pointer text-center ${
                            selectedUserForReport.commissionBlocked ? "bg-green-650 hover:bg-green-700 text-white" : "bg-orange-600 hover:bg-orange-700 text-white"
                          }`}
                        >
                          🚫 {selectedUserForReport.commissionBlocked ? "Libérer de l'état commission" : "Déclarer Commission Impayée"}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Marketplace publications section */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">🛍️ Publications Marketplace de l'adhérent ({userReport.products.length})</h4>
                    
                    {userReport.products.length === 0 ? (
                      <p className="text-[11px] text-slate-500 font-mono italic">Aucune publication en vente sur la plateforme.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white">
                        {userReport.products.map((p: any) => (
                          <div key={p.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <span className="font-extrabold text-white text-xs uppercase leading-tight">{p.title}</span>
                                <span className={`text-[8.5px] font-black uppercase font-mono px-1.5 py-0.5 rounded ${
                                  p.isBlockedByCoordinator ? "bg-red-950 text-red-000 border border-red-900" : "bg-emerald-950 text-emerald-400 border border-emerald-950"
                                }`}>
                                  {p.isBlockedByCoordinator ? "Invisible/Bloqué" : p.isClosed ? "Bouclé/Archivé" : "Actif public"}
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-emerald-400 font-bold mt-1">💰 {p.price.toLocaleString()} F CFA • 📍 {p.location}</p>
                              <p className="text-[10.5px] text-slate-400 leading-snug mt-1.5 line-clamp-2">{p.description}</p>
                            </div>
                            
                            {/* Admin actions under publication */}
                            <div className="border-t border-slate-800/80 pt-2.5 flex flex-wrap gap-1.5 justify-end">
                              <button
                                onClick={() => handleRelancerProductCommission(p.id)}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[9.5px] rounded-lg tracking-wide uppercase transition cursor-pointer"
                                title="Envoie un rappel de commission de 10% par chat privé"
                              >
                                🔔 Relancer commission
                              </button>
                              
                              <button
                                onClick={() => handleReceptionCommandeProduct(p.id)}
                                className="px-2 py-1 bg-sky-500 hover:bg-sky-600 text-slate-950 font-black text-[9.5px] rounded-lg tracking-wide uppercase transition cursor-pointer"
                                title="Note de réception de commande client envoyée par chat privé"
                              >
                                📦 Réception commande
                              </button>

                              <button
                                onClick={() => handleBouclerProduct(p.id)}
                                className="px-2 py-1 bg-emerald-605 hover:bg-emerald-700 text-white font-black text-[9.5px] rounded-lg tracking-wide uppercase transition cursor-pointer"
                              >
                                {p.isClosed ? "Fermé Bouclé ✓" : "✓ Boucler"}
                              </button>

                              <button
                                onClick={() => handleToggleProductVisibility(p.id)}
                                className={`px-2 py-1 font-black text-[9.5px] rounded-lg tracking-wide uppercase transition cursor-pointer ${
                                  p.isBlockedByCoordinator ? "bg-green-650 hover:bg-green-700 text-white" : "bg-red-900 hover:bg-red-800 text-white"
                                }`}
                              >
                                {p.isBlockedByCoordinator ? "👁️ Rendre Public" : "🚫 Rendre Invisible"}
                              </button>

                              <button
                                onClick={() => handleDeleteProductAdmin(p.id)}
                                className="px-2 py-1 bg-red-650 hover:bg-red-750 text-white font-black text-[9.5px] rounded-lg tracking-wide uppercase transition flex items-center gap-1 cursor-pointer"
                                title="Supprimer définitivement la publication de la marketplace"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CV & Recrutement section */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">💼 Profils CV & Recrutement Agricole ({userReport.cvs.length})</h4>
                    
                    {userReport.cvs.length === 0 ? (
                      <p className="text-[11px] text-slate-500 font-mono italic">Aucun CV répertorié pour ce membre.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userReport.cvs.map((c: any) => (
                          <div key={c.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <span className="font-extrabold text-white text-xs uppercase leading-tight">{c.firstName} {c.lastName}</span>
                                <span className={`text-[8.5px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                                  c.isBlockedByCoordinator ? "bg-red-950 text-red-000 border border-red-905" : "bg-emerald-950 text-emerald-400 border border-emerald-900"
                                }`}>
                                  {c.isBlockedByCoordinator ? "Bloqué Invisible" : c.isClosed ? "Embauché ✓" : "Contrat Actif"}
                                </span>
                              </div>
                              <p className="text-[10px] text-indigo-400 font-black mt-1 uppercase font-mono">🌟 {c.specialty} • {c.education}</p>
                              <p className="text-[10.5px] text-slate-400 leading-snug mt-1.5 line-clamp-2">Savoir-faire : {c.skills}</p>
                            </div>

                            <div className="border-t border-slate-800 pt-2 flex flex-wrap gap-1.5 justify-end">
                              <button
                                onClick={() => handleRelancerCvCommission(c.id)}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[9.5px] rounded-lg tracking-wide uppercase transition cursor-pointer"
                              >
                                🔔 Relancer commission
                              </button>

                              <button
                                onClick={() => handleReceptionCommandeCv(c.id)}
                                className="px-2 py-1 bg-sky-500 hover:bg-sky-600 text-slate-950 font-black text-[9.5px] rounded-lg tracking-wide uppercase transition cursor-pointer"
                              >
                                📦 Recrutement Ferme
                              </button>

                              <button
                                onClick={() => handleBouclerCv(c.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9.5px] rounded-lg tracking-wide uppercase transition cursor-pointer"
                              >
                                {c.isClosed ? "Bouclé ✓" : "✓ Boucler"}
                              </button>

                              <button
                                onClick={() => handleToggleCvVisibility(c.id)}
                                className={`px-2 py-1 font-black text-[9.5px] rounded-lg tracking-wide uppercase transition cursor-pointer ${
                                  c.isBlockedByCoordinator ? "bg-green-650 hover:bg-green-700 text-white" : "bg-red-900 hover:bg-red-800 text-white"
                                }`}
                              >
                                {c.isBlockedByCoordinator ? "👁️ Rendre Public" : "🚫 Masquer"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Solidarite demands */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">🛡️ Demandes d'Entraide & Solidarité ({userReport.solidarity.length})</h4>
                    
                    {userReport.solidarity.length === 0 ? (
                      <p className="text-[11px] text-slate-500 font-mono italic">Aucune demande en cours.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userReport.solidarity.map((s: any) => (
                          <div key={s.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                            <span className="font-extrabold text-white text-[11px]">{s.title}</span>
                            <div className="text-[10px] text-emerald-500 mt-1 uppercase font-mono">{s.statut} • Superficie : {s.superficie} • Lieu : {s.lieu}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video innovations rapports */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-300">📹 Rapports des Vidéos d'Innovation Maraîchère</h4>
                    
                    {userReport.videos && userReport.videos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userReport.videos.map((vid: any) => (
                          <div key={vid.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3">
                            <div>
                              <p className="font-black text-white text-xs">{vid.titre}</p>
                              <p className="text-[9.5px] text-slate-500 font-mono mt-0.5">Catégorie: {vid.categorie} • Par @{vid.auteur}</p>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleToggleVideoVisibility(vid.id)}
                                className={`px-2 py-1 text-[9.5px] font-black uppercase rounded ${
                                  vid.isHidden ? "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700" : "bg-amber-600 text-white cursor-pointer hover:bg-amber-700"
                                }`}
                              >
                                {vid.isHidden ? "👁️ Rendre Visible" : "🚫 Rendre Invisible"}
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(vid.id)}
                                className="px-2 py-1 bg-red-650 hover:bg-red-750 text-white text-[9.5px] font-black uppercase rounded cursor-pointer"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10.5px] text-slate-500 font-mono italic">Aucune vidéo publiée personnellement par cet adhérent.</p>
                    )}
                  </div>

                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
