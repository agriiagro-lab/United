import React, { useState } from "react";
import { CVProfile, ProjectProposal, AppelCandidature, User } from "../types";
import { Briefcase, Send, UserCheck, PhoneCall, PlusCircle, Award, CheckCircle, Trash2, Edit3, HelpCircle, GraduationCap, MessageCircle, Share2, Check, Copy } from "lucide-react";

interface DirectoryPanelProps {
  user: User;
  initialCvs: CVProfile[];
  initialProjects: ProjectProposal[];
  appelsCandidatures: AppelCandidature[];
  onAddCv: (newCv: Omit<CVProfile, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateCv?: (id: string, updatedCv: Partial<CVProfile>) => Promise<void>;
  onDeleteCv: (id: string) => Promise<void>;
  onAddProject: (newProj: Omit<ProjectProposal, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateProject?: (id: string, updatedProj: Partial<ProjectProposal>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onAddAppel: (newAppel: Omit<AppelCandidature, 'id' | 'createdAt' | 'userName' | 'userId'>) => Promise<void>;
  onUpdateAppel?: (id: string, updatedAppel: Partial<AppelCandidature>) => Promise<void>;
  onDeleteAppel: (id: string) => Promise<void>;
  onContactSellerPrivate?: (sellerName: string, sellerPhone: string, titleOfProduct: string) => void;
  onAdminInitiatePrivateChat?: (userId: string, userName: string, phone: string, initialMessage: string) => void;
  autoOpenAddForm?: boolean;
  onFormOpened?: () => void;
  selectedCvId?: string | null;
  onClearSelection?: () => void;
}

export default function DirectoryPanel({
  user,
  initialCvs,
  initialProjects,
  appelsCandidatures,
  onAddCv,
  onUpdateCv,
  onDeleteCv,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddAppel,
  onUpdateAppel,
  onDeleteAppel,
  onContactSellerPrivate,
  onAdminInitiatePrivateChat,
  autoOpenAddForm,
  onFormOpened,
  selectedCvId,
  onClearSelection
}: DirectoryPanelProps) {
  const [activeTab, setActiveTab] = useState<'recruits' | 'appels' | 'funding'>('recruits');
  const [showAddCv, setShowAddCv] = useState(false);
  const [searchText, setSearchText] = useState("");

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
      setActiveTab('recruits');
      setShowAddCv(true);
      if (onFormOpened) {
        onFormOpened();
      }
    }
  }, [autoOpenAddForm]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddAppel, setShowAddAppel] = useState(false);

  // Sharing states
  const [sharingText, setSharingText] = useState("");
  const [sharingTitle, setSharingTitle] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // CV form states
  const [cvType, setCvType] = useState<'technician' | 'intern'>('technician');
  const [cvFirstName, setCvFirstName] = useState("");
  const [cvLastName, setCvLastName] = useState("");
  const [cvEducation, setCvEducation] = useState("");
  const [cvSpecialty, setCvSpecialty] = useState("");
  const [cvSkills, setCvSkills] = useState("");
  const [cvContact, setCvContact] = useState("");
  const [cvPhoneWhatsApp, setCvPhoneWhatsApp] = useState("");
  const [cvPhoneDirect, setCvPhoneDirect] = useState("");
  const [cvUniversity, setCvUniversity] = useState("");
  const [cvLocationDesired, setCvLocationDesired] = useState("");
  const [cvPhotoUrl, setCvPhotoUrl] = useState("");

  // Project form states
  const [projFirstName, setProjFirstName] = useState("");
  const [projLastName, setProjLastName] = useState("");
  const [projPhone, setProjPhone] = useState("");
  const [projPhoneWhatsApp, setProjPhoneWhatsApp] = useState("");
  const [projPhoneDirect, setProjPhoneDirect] = useState("");
  const [projTitle, setProjTitle] = useState("");
  const [projSummary, setProjSummary] = useState("");

  // Appel form states
  const [appelTitle, setAppelTitle] = useState("");
  const [appelOrg, setAppelOrg] = useState("");
  const [appelLoc, setAppelLoc] = useState("");
  const [appelDesc, setAppelDesc] = useState("");
  const [appelContact, setAppelContact] = useState("");
  const [appelPhoneWhatsApp, setAppelPhoneWhatsApp] = useState("");
  const [appelPhoneDirect, setAppelPhoneDirect] = useState("");
  const [appelType, setAppelType] = useState<'stage' | 'emploi' | 'saisonnier'>('emploi');
  const [appelPhotoUrl, setAppelPhotoUrl] = useState("");

  // New V2 CV Form states
  const [cvCommuneDispo, setCvCommuneDispo] = useState("");
  const [cvTypeContrat, setCvTypeContrat] = useState<"stage" | "saison" | "cdd" | "cdi">("stage");
  const [cvSalaireSouhaite, setCvSalaireSouhaite] = useState("");
  const [cvDispoImmediate, setCvDispoImmediate] = useState(true);
  const [cvPdfUrl, setCvPdfUrl] = useState("");

  // New V2 Project Form states
  const [projSuperficie, setProjSuperficie] = useState("");
  const [projCommune, setProjCommune] = useState("");
  const [projMontantRecherche, setProjMontantRecherche] = useState("");
  const [projApportPerso, setProjApportPerso] = useState("");
  const [projDureeProjet, setProjDureeProjet] = useState("");
  const [projTypeCultureElevage, setProjTypeCultureElevage] = useState("");
  const [projFicheRentabiliteUrl, setProjFicheRentabiliteUrl] = useState("");
  const [projPhotoUrl, setProjPhotoUrl] = useState("");

  // New V2 Appel Form states
  const [appelSalairePropose, setAppelSalairePropose] = useState("");
  const [appelLogementNourri, setAppelLogementNourri] = useState(false);
  const [appelDateDebut, setAppelDateDebut] = useState("");
  const [appelDateLimite, setAppelDateLimite] = useState("");
  const [appelCahierChargesUrl, setAppelCahierChargesUrl] = useState("");

  // Filter states
  const [filterCvCommune, setFilterCvCommune] = useState("");
  const [filterCvTypeContrat, setFilterCvTypeContrat] = useState("");
  const [filterCvType, setFilterCvType] = useState("");
  const [filterProjCommune, setFilterProjCommune] = useState("");
  const [filterProjType, setFilterProjType] = useState("");
  const [filterAppelCommune, setFilterAppelCommune] = useState("");
  const [filterAppelTypeContrat, setFilterAppelTypeContrat] = useState("");

  // Modal Detail & Boost Simulator states
  const [selectedDetailItem, setSelectedDetailItem] = useState<{ type: 'cv' | 'project' | 'appel', item: any } | null>(null);
  const [boostingItem, setBoostingItem] = useState<{ type: 'cv' | 'project' | 'appel', id: string, title: string } | null>(null);
  const [momoPhone, setMomoPhone] = useState("");
  const [momoOperator, setMomoOperator] = useState<"MTN" | "MOOV">("MTN");
  const [boostSimulating, setBoostSimulating] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState(false);

  // Inline editing states
  const [editingCvId, setEditingCvId] = useState<string | null>(null);
  const [editCvEducation, setEditCvEducation] = useState("");
  const [editCvSpecialty, setEditCvSpecialty] = useState("");
  const [editCvSkills, setEditCvSkills] = useState("");
  const [editCvContact, setEditCvContact] = useState("");

  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [editProjTitle, setEditProjTitle] = useState("");
  const [editProjSummary, setEditProjSummary] = useState("");
  const [editProjPhone, setEditProjPhone] = useState("");

  const [editingAppelId, setEditingAppelId] = useState<string | null>(null);
  const [editAppelTitle, setEditAppelTitle] = useState("");
  const [editAppelOrg, setEditAppelOrg] = useState("");
  const [editAppelLoc, setEditAppelLoc] = useState("");
  const [editAppelDesc, setEditAppelDesc] = useState("");
  const [editAppelContact, setEditAppelContact] = useState("");

  const handleOpenDetail = async (type: 'cv' | 'project' | 'appel', item: any) => {
    setSelectedDetailItem({ type, item });
    try {
      await fetch("/api/increment-vue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id: item.id })
      });
      item.vues = (item.vues || 0) + 1;
    } catch (e) { console.error(e); }
  };

  const handleWhatsAppContact = async (type: 'cv' | 'project' | 'appel', item: any, contact: string, text: string) => {
    try {
      await fetch("/api/increment-clic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id: item.id })
      });
      item.clicsWhatsApp = (item.clicsWhatsApp || 0) + 1;
    } catch (e) { console.error(e); }
    handleWhatsAppRedirect(contact, text);
  };

  const handleOpenBoost = (type: 'cv' | 'project' | 'appel', id: string, title: string) => {
    setBoostingItem({ type, id, title });
    setMomoPhone("");
    setBoostSuccess(false);
    setBoostSimulating(false);
  };

  const handleProcessBoost = async () => {
    if (!momoPhone || momoPhone.length < 8) {
      alert("Veuillez saisir un numéro de téléphone valide de 8 chiffres minimum.");
      return;
    }
    setBoostSimulating(true);
    setTimeout(async () => {
      try {
        const res = await fetch("/api/boost-publication", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: boostingItem?.type, id: boostingItem?.id, days: 7 })
        });
        if (res.ok) {
          setBoostSuccess(true);
          setBoostSimulating(false);
          setTimeout(() => {
            setBoostingItem(null);
          }, 1800);
        } else {
          alert("Erreur de traitement du boost.");
          setBoostSimulating(false);
        }
      } catch (e) {
        console.error(e);
        alert("Erreur réseau");
        setBoostSimulating(false);
      }
    }, 2500);
  };

  const handleDialCode = (phone: string) => {
    let finalPhone = phone.trim();
    if (!finalPhone.startsWith("+") && !finalPhone.startsWith("00")) {
      finalPhone = "+229" + finalPhone.replace(/\s+/g, "");
    }
    window.location.href = `tel:${finalPhone}`;
  };

  const handleWhatsAppRedirect = (phone: string, textMessage: string) => {
    const waNum = phone.trim().replace(/\s+/g, "").replace("+", "");
    const cleanNum = waNum.startsWith("00") ? waNum.substring(2) : waNum;
    const cleanNum2 = cleanNum.startsWith("229") ? cleanNum : "229" + cleanNum;
    const message = encodeURIComponent(textMessage);
    window.open(`https://wa.me/${cleanNum2}?text=${message}`, "_blank");
  };

  const triggerSharing = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: window.location.origin
        });
        return;
      } catch (err) {
        console.log("Web Share fallback:", err);
      }
    }
    setSharingTitle(title);
    setSharingText(text);
    setShowShareModal(true);
    setCopiedLink(false);
  };

  const submitCv = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddCv({
      userId: user.id,
      firstName: cvFirstName,
      lastName: cvLastName,
      type: cvType,
      education: cvEducation,
      specialty: cvSpecialty,
      skills: cvSkills,
      contact: cvPhoneWhatsApp || cvPhoneDirect || cvContact || "En ligne",
      phoneWhatsApp: cvPhoneWhatsApp,
      phoneDirect: cvPhoneDirect,
      university: cvType === 'intern' ? cvUniversity : undefined,
      locationDesired: cvType === 'intern' ? cvLocationDesired : undefined,
      photoUrl: cvPhotoUrl || undefined,
      // V2 Fields
      communeDispo: cvCommuneDispo || undefined,
      typeContrat: cvTypeContrat,
      salaireSouhaite: cvType === 'intern' ? (cvSalaireSouhaite || "Non spécifié") : (cvSalaireSouhaite || "À négocier"),
      dispoImmediate: cvDispoImmediate,
      cvPdfUrl: cvPdfUrl || undefined,
      photoProUrl: cvPhotoUrl || undefined,
      vues: 0,
      clicsWhatsApp: 0,
      statut: "en_attente"
    });
    // Reset
    setCvFirstName("");
    setCvLastName("");
    setCvEducation("");
    setCvSpecialty("");
    setCvSkills("");
    setCvContact("");
    setCvPhoneWhatsApp("");
    setCvPhoneDirect("");
    setCvUniversity("");
    setCvLocationDesired("");
    setCvPhotoUrl("");
    setCvCommuneDispo("");
    setCvTypeContrat("stage");
    setCvSalaireSouhaite("");
    setCvDispoImmediate(true);
    setCvPdfUrl("");
    setShowAddCv(false);
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddProject({
      userId: user.id,
      firstName: projFirstName,
      lastName: projLastName,
      phone: projPhoneWhatsApp || projPhoneDirect || projPhone || "En ligne",
      phoneWhatsApp: projPhoneWhatsApp,
      phoneDirect: projPhoneDirect,
      title: projTitle,
      summary: projSummary,
      documentName: "Projet_Agri_Rentable.pdf",
      // V2 Fields
      superficie: projSuperficie || undefined,
      commune: projCommune || undefined,
      montantRecherche: projMontantRecherche || undefined,
      apportPerso: projApportPerso || undefined,
      dureeProjet: projDureeProjet || undefined,
      typeCultureElevage: projTypeCultureElevage || undefined,
      ficheRentabiliteUrl: projFicheRentabiliteUrl || undefined,
      photosUrls: projPhotoUrl ? [projPhotoUrl] : [],
      vues: 0,
      clicsWhatsApp: 0,
      statut: "en_attente"
    });
    setProjFirstName("");
    setProjLastName("");
    setProjPhone("");
    setProjPhoneWhatsApp("");
    setProjPhoneDirect("");
    setProjTitle("");
    setProjSummary("");
    setProjSuperficie("");
    setProjCommune("");
    setProjMontantRecherche("");
    setProjApportPerso("");
    setProjDureeProjet("");
    setProjTypeCultureElevage("");
    setProjFicheRentabiliteUrl("");
    setProjPhotoUrl("");
    setShowAddProject(false);
  };

  const submitAppel = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddAppel({
      title: appelTitle,
      organization: appelOrg,
      location: appelLoc,
      description: appelDesc,
      contact: appelPhoneWhatsApp || appelPhoneDirect || appelContact || "En ligne",
      phoneWhatsApp: appelPhoneWhatsApp,
      phoneDirect: appelPhoneDirect,
      typeContrat: appelType,
      photoUrl: appelPhotoUrl || undefined,
      // V2 Fields
      salairePropose: appelSalairePropose || undefined,
      logementNourri: appelLogementNourri,
      dateDebut: appelDateDebut || undefined,
      dateLimite: appelDateLimite || undefined,
      cahierChargesUrl: appelCahierChargesUrl || undefined,
      vues: 0,
      clicsWhatsApp: 0,
      statut: "en_attente"
    });
    setAppelTitle("");
    setAppelOrg("");
    setAppelLoc("");
    setAppelDesc("");
    setAppelContact("");
    setAppelPhoneWhatsApp("");
    setAppelPhoneDirect("");
    setAppelType("emploi");
    setAppelPhotoUrl("");
    setAppelSalairePropose("");
    setAppelLogementNourri(false);
    setAppelDateDebut("");
    setAppelDateLimite("");
    setAppelCahierChargesUrl("");
    setShowAddAppel(false);
  };

  const startEditCv = (cv: CVProfile) => {
    setEditingCvId(cv.id);
    setEditCvEducation(cv.education);
    setEditCvSpecialty(cv.specialty);
    setEditCvSkills(cv.skills);
    setEditCvContact(cv.contact);
  };

  const saveEditCv = async (id: string) => {
    if (onUpdateCv) {
      await onUpdateCv(id, {
        education: editCvEducation,
        specialty: editCvSpecialty,
        skills: editCvSkills,
        contact: editCvContact
      });
    }
    setEditingCvId(null);
  };

  const startEditProj = (p: ProjectProposal) => {
    setEditingProjId(p.id);
    setEditProjTitle(p.title);
    setEditProjSummary(p.summary);
    setEditProjPhone(p.phone);
  };

  const saveEditProj = async (id: string) => {
    if (onUpdateProject) {
      await onUpdateProject(id, {
        title: editProjTitle,
        summary: editProjSummary,
        phone: editProjPhone
      });
    }
    setEditingProjId(null);
  };

  const startEditAppel = (app: AppelCandidature) => {
    setEditingAppelId(app.id);
    setEditAppelTitle(app.title);
    setEditAppelOrg(app.organization);
    setEditAppelLoc(app.location);
    setEditAppelDesc(app.description);
    setEditAppelContact(app.contact);
  };

  const saveEditAppel = async (id: string) => {
    if (onUpdateAppel) {
      await onUpdateAppel(id, {
        title: editAppelTitle,
        organization: editAppelOrg,
        location: editAppelLoc,
        description: editAppelDesc,
        contact: editAppelContact
      });
    }
    setEditingAppelId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Barre de Recherche Commune de Tête - instant filtering */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 w-full">
        <div className="relative flex-1 w-full flex items-center">
          <input
            type="text"
            placeholder={
              activeTab === 'recruits'
                ? "🔎 Rechercher un technicien ou un stagiaire par nom, spécialité, école ou compétences (ex: Songhaï, herbage, compost, aviculture)..."
                : activeTab === 'appels'
                ? "🔎 Rechercher un appel ou offre d'emploi par fonction, entreprise ou lieu (ex: Dangbo, Cotonou, technicien)..."
                : "🔎 Rechercher un projet d'innovation maraîchère, un besoin d'appui ou un promoteur..."
            }
            className="w-full pl-4 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-sans text-slate-800"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-3 text-[9px] uppercase font-black text-red-600 hover:text-red-700 transition cursor-pointer"
              title="Effacer la recherche"
            >
              Effacer ❌
            </button>
          )}
        </div>
      </div>

      {/* Selector switches - THREE TAB SYSTEM */}
      <div className="flex flex-col sm:flex-row bg-white p-2.5 rounded-2xl border border-slate-250 shadow-xs gap-2">
        <button
          onClick={() => setActiveTab('recruits')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 uppercase tracking-wide ${
            activeTab === 'recruits' ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Profils CV Stagiaires & Techniciens</span>
        </button>
        <button
          onClick={() => setActiveTab('appels')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 uppercase tracking-wide ${
            activeTab === 'appels' ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Appels à Candidatures & Offres</span>
        </button>
        <button
          onClick={() => setActiveTab('funding')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 uppercase tracking-wide ${
            activeTab === 'funding' ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Espace Projets & Financement</span>
        </button>
      </div>

      {/* TABS 1: CV PORTFOLIO DIRECTORY */}
      {activeTab === 'recruits' && (
        <div className="space-y-5 animate-fade-in">

          {/* DESCRIPTION CONTAINER FOR CV RECRUITEMENT as requested */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-indigo-50 to-orange-50 border border-indigo-200/60 rounded-2xl shadow-3xs gap-3 text-left">
            <div>
              <h3 className="text-sm font-black text-indigo-950 font-display uppercase tracking-wider">👷 Espace Demandeurs d'Emploi &amp; Stagiaires</h3>
              <p className="text-[11px] text-zinc-600 font-semibold">
                Vous êtes un jeune diplômé en fin de formation agricole ou un étudiant à la recherche d’un stage pratique ? Mettez gratuitement en valeur votre savoir-faire pour vous faire recruter par des fermes maraîchères de référence ou les agences de promotion au Bénin.
              </p>
            </div>
            <button
              onClick={() => setShowAddCv(!showAddCv)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-[10.5px] uppercase tracking-wider transition shrink-0 cursor-pointer text-center"
            >
              🏢 Déposer ma Candidature / CV
            </button>
          </div>

          {showAddCv && (
            <form onSubmit={submitCv} className="p-5 bg-white rounded-2xl border-2 border-indigo-300 shadow-md space-y-4 max-w-xl mx-auto transform animate-scale-in text-left">
              <h4 className="text-xs font-black text-slate-950 uppercase border-b pb-1 font-display tracking-widest text-indigo-700">Votre fiche de candidature / CV</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Votre Prénom</label>
                  <input type="text" required placeholder="Ex: Jean-Baptiste" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={cvFirstName} onChange={(e) => setCvFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Votre Nom</label>
                  <input type="text" required placeholder="Ex: ZOUNMATOUN" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={cvLastName} onChange={(e) => setCvLastName(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Quel type de publication recherchez-vous ?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCvType('intern')}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                      cvType === 'intern'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🚀 Recherche de Stage (Apprenti/Stagiaire)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCvType('technician')}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                      cvType === 'technician'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    👔 Recherche d'Emploi (Forte Spécialité)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Diplôme / Titre Obtenu ou En cours</label>
                  <input type="text" required placeholder="Ex: Diplôme d'État Songhaï ou Licence Agronomie" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={cvEducation} onChange={(e) => setCvEducation(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Spécialité Principale</label>
                  <input type="text" required placeholder="Ex: Maraîchage biologique, Élevage avicole" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={cvSpecialty} onChange={(e) => setCvSpecialty(e.target.value)} />
                </div>
              </div>

              {/* V2 Fields section */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📍 Commune de disponibilité</label>
                  <input type="text" placeholder="Ex: Dangbo, Allada, Porto-Novo" className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-1 focus:ring-indigo-500 text-slate-850" value={cvCommuneDispo} onChange={(e) => setCvCommuneDispo(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">🤝 Type de contrat recherché</label>
                  <select className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-800" value={cvTypeContrat} onChange={(e) => setCvTypeContrat(e.target.value as any)}>
                    <option value="stage">Stage pratique</option>
                    <option value="saison">Saisonnier / Mission courte</option>
                    <option value="cdd">CDD</option>
                    <option value="cdi">CDI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">💰 Rémunération souhaitée (FCFA/mois)</label>
                  <input type="text" placeholder="Ex: 50 000 ou À négocier" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850 font-mono" value={cvSalaireSouhaite} onChange={(e) => setCvSalaireSouhaite(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">⚡ Disponible immédiatement ?</label>
                  <div className="flex gap-3 mt-1">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input type="radio" checked={cvDispoImmediate === true} onChange={() => setCvDispoImmediate(true)} />
                      <span>Oui</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input type="radio" checked={cvDispoImmediate === false} onChange={() => setCvDispoImmediate(false)} />
                      <span>Non (Spécifier date)</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📄 Lien vers votre CV PDF complet (Optionnel)</label>
                  <input type="text" placeholder="Ex: https://drive.google.com/your-cv.pdf" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850 font-mono" value={cvPdfUrl} onChange={(e) => setCvPdfUrl(e.target.value)} />
                </div>
              </div>

              {cvType === 'intern' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Université / École d'origine</label>
                    <input type="text" placeholder="Ex: UNA Ketou, UAC, Centre Songhaï" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={cvUniversity || ""} onChange={(e) => setCvUniversity(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Zone / Commune d'installation souhaitée</label>
                    <input type="text" placeholder="Ex: Dangbo, Savalou, Parakou" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={cvLocationDesired || ""} onChange={(e) => setCvLocationDesired(e.target.value)} />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Numéro de téléphone de contact (WhatsApp / Direct - 8 chiffres)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" required placeholder="WhatsApp: 97000000" className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white text-slate-800" value={cvPhoneWhatsApp} onChange={(e) => setCvPhoneWhatsApp(e.target.value)} />
                  <input type="text" required placeholder="Direct tel: 61000000" className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white text-slate-800" value={cvPhoneDirect} onChange={(e) => setCvPhoneDirect(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📷 Photo de profil ou Justificatif de compétence (Optionnel)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <label className="block text-[9px] uppercase text-slate-500 mb-1 font-bold">Importer un fichier image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("⚠️ IMAGE TROP LOURDE : Veuillez choisir une image de moins de 2 Mo.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                              setCvPhotoUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                    <p className="text-[9px] text-slate-400 mt-1">Glissez-déposez ou sélectionnez un fichier JPEG, PNG (Max 2 Mo)</p>
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div>
                      <label className="block text-[9px] uppercase text-slate-500 mb-1 font-bold font-sans">Ou coller l'URL d'une Image</label>
                      <input
                        type="text"
                        placeholder="https://ex.com/photo.jpg"
                        className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white text-slate-800 font-mono"
                        value={cvPhotoUrl}
                        onChange={(e) => setCvPhotoUrl(e.target.value)}
                      />
                    </div>
                    {cvPhotoUrl && (
                      <div className="flex items-center gap-2 mt-1 bg-indigo-50/60 p-1.5 rounded-lg border border-indigo-100">
                        <img src={cvPhotoUrl} alt="Aperçu" className="w-8 h-8 rounded-md object-cover border border-white shrink-0" referrerPolicy="no-referrer" />
                        <span className="text-[9px] text-indigo-700 font-bold truncate">Image sélectionnée !</span>
                        <button type="button" onClick={() => setCvPhotoUrl("")} className="ml-auto text-[9px] text-red-600 font-bold hover:underline">Effacer</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Savoir-faire, Expérience &amp; Compétences (Description libre)</label>
                <textarea rows={3} required placeholder="Détaillez vos compétences : fertilisation organique, gestion de pépinières de tomates, compostage, élevage bio..." className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={cvSkills} onChange={(e) => setCvSkills(e.target.value)} />
              </div>

              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddCv(false)} className="px-3.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg font-bold">Annuler</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider">Mettre mon CV en ligne</button>
              </div>
            </form>
          )}

          {selectedCvId && initialCvs.some(cv => cv.id === selectedCvId) && (
            <div className="p-4 mb-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">👷</span>
                <div>
                  <p className="text-xs font-black text-indigo-900 uppercase">Profil Sélectionné</p>
                  <p className="text-[11px] text-indigo-700 font-medium font-sans">Vous visualisez le CV ou profil sélectionné directement depuis votre page d'accueil.</p>
                </div>
              </div>
              {onClearSelection && (
                <button 
                  type="button"
                  onClick={onClearSelection}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition shadow-xs"
                >
                  Afficher tous les profils 🌐
                </button>
              )}
            </div>
          )}

          {/* Advanced V2 Filters Panel */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-3xs flex flex-wrap gap-3 items-center text-left">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <span className="text-sm">🎯</span> Filtrer par :
            </span>
            <div className="flex flex-1 flex-wrap gap-2.5">
              <input
                type="text"
                placeholder="📍 Commune (ex: Allada)"
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-auto"
                value={filterCvCommune}
                onChange={(e) => setFilterCvCommune(e.target.value)}
              />
              <select
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                value={filterCvTypeContrat}
                onChange={(e) => setFilterCvTypeContrat(e.target.value)}
              >
                <option value="">Tous les contrats</option>
                <option value="stage">Stage pratique</option>
                <option value="saison">Saisonnier</option>
                <option value="cdd">CDD</option>
                <option value="cdi">CDI</option>
              </select>
              <select
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                value={filterCvType}
                onChange={(e) => setFilterCvType(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                <option value="technician">Techniciens</option>
                <option value="intern">Stagiaires</option>
              </select>
              {(filterCvCommune || filterCvTypeContrat || filterCvType) && (
                <button
                  onClick={() => {
                    setFilterCvCommune("");
                    setFilterCvTypeContrat("");
                    setFilterCvType("");
                  }}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Réinitialiser ✕
                </button>
              )}
            </div>
          </div>

          {/* Profiles lists consistent layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialCvs
              .filter((cv) => {
                if (selectedCvId && cv.id !== selectedCvId) {
                  return false;
                }
                if (searchText.trim()) {
                  const query = searchText.toLowerCase();
                  const termMatch = `${cv.firstName} ${cv.lastName} ${cv.specialty} ${cv.skills} ${cv.education}`.toLowerCase().includes(query);
                  if (!termMatch) return false;
                }
                // V2 Filters
                if (filterCvCommune.trim()) {
                  const cvCommune = (cv.communeDispo || cv.locationDesired || "").toLowerCase();
                  if (!cvCommune.includes(filterCvCommune.toLowerCase())) return false;
                }
                if (filterCvTypeContrat && cv.typeContrat !== filterCvTypeContrat) {
                  return false;
                }
                if (filterCvType && cv.type !== filterCvType) {
                  return false;
                }
                return true;
              })
              .sort((a, b) => {
                const aBoost = a.boostExpireAt && new Date(a.boostExpireAt) > new Date() ? 1 : 0;
                const bBoost = b.boostExpireAt && new Date(b.boostExpireAt) > new Date() ? 1 : 0;
                if (bBoost !== aBoost) return bBoost - aBoost;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((cv) => {
              const belongsToUser = user && (cv.userId === user.id || isUserAdmin);
              const isEditing = editingCvId === cv.id;

              return (
                <div key={cv.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between gap-3 relative group hover:shadow-md transition">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className={`text-[9px] uppercase font-black font-mono tracking-widest px-2.5 py-1 rounded-md border ${
                          cv.type === 'technician' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-orange-50 text-orange-800 border-orange-200'
                        }`}>
                          {cv.type === 'technician' ? '👷 Technicien' : '🎓 Stagiaire'}
                        </span>
                        {cv.boostExpireAt && new Date(cv.boostExpireAt) > new Date() && (
                          <span className="text-[9px] uppercase font-black bg-amber-500 text-white px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs animate-pulse">
                            🔥 BOOSTÉ
                          </span>
                        )}
                        {belongsToUser && (
                          <span className={`text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            cv.statut === 'valide' ? 'bg-green-100 text-green-800' : cv.statut === 'refuse' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-850'
                          }`}>
                            {cv.statut === 'valide' ? 'En ligne' : cv.statut === 'refuse' ? 'Refusé' : 'En attente'}
                          </span>
                        )}
                      </div>
                      
                      {belongsToUser && !isEditing && (
                        <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => startEditCv(cv)}
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                            title="Modifier"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCv(cv.id)}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Diplôme</label>
                          <input type="text" className="w-full p-2 border rounded-lg text-xs" value={editCvEducation} onChange={(e) => setEditCvEducation(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Spécialité</label>
                          <input type="text" className="w-full p-2 border rounded-lg text-xs" value={editCvSpecialty} onChange={(e) => setEditCvSpecialty(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Contact Téléphone</label>
                          <input type="text" className="w-full p-2 border rounded-lg text-xs font-mono font-bold" value={editCvContact} onChange={(e) => setEditCvContact(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Savoir-faire</label>
                          <textarea rows={2} className="w-full p-2 border rounded-lg text-xs" value={editCvSkills} onChange={(e) => setEditCvSkills(e.target.value)} />
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button onClick={() => setEditingCvId(null)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">Annuler</button>
                          <button onClick={() => saveEditCv(cv.id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Enregistrer</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-4 items-start text-left">
                          {cv.photoUrl ? (
                            <img 
                              src={cv.photoUrl} 
                              alt={`${cv.firstName} ${cv.lastName}`} 
                              className="w-14 h-14 object-cover rounded-xl border-2 border-indigo-100 shadow-3xs shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-indigo-100 flex items-center justify-center text-xl shrink-0 font-display font-black text-indigo-500">
                              {cv.firstName?.[0] || ""}{cv.lastName?.[0] || "👷"}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-slate-900 font-display text-sm truncate uppercase tracking-tight">{cv.firstName} {cv.lastName}</h4>
                            <p className="text-[10.5px] text-indigo-800 font-bold">{cv.education}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 border rounded-xl text-xs space-y-1 text-slate-600">
                          <p><strong className="text-slate-800 uppercase font-mono text-[9px]">Spécialité :</strong> {cv.specialty}</p>
                          <p className="line-clamp-3"><strong className="text-slate-800 uppercase font-mono text-[9px]">Savoir-faire :</strong> {cv.skills}</p>
                          {cv.university && (
                            <p className="border-t pt-1.5 mt-1 text-[10.5px] text-indigo-750 font-semibold">
                              🏫 {cv.university} • Souhaite s'installer à : {cv.locationDesired}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="border-t border-slate-100 pt-3 space-y-2.5 mt-1">
                      <div className="flex justify-between items-center text-[9.5px] text-slate-500 font-mono font-bold bg-slate-50 p-1.5 rounded-lg border border-slate-200/50">
                        <span>Publié le {new Date(cv.createdAt).toLocaleDateString()}</span>
                        <span className="text-indigo-700 flex items-center gap-1">
                          <span>👁️ {cv.vues || 0}</span>
                          <span>•</span>
                          <span>💬 {cv.clicsWhatsApp || 0}</span>
                        </span>
                      </div>

                      {/* Consulter la fiche complète & Booster action panel */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenDetail('cv', cv)}
                          className="py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 border border-indigo-200 cursor-pointer"
                        >
                          <span>🔎 Consulter Fiche</span>
                        </button>
                        {belongsToUser && (
                          <button
                            onClick={() => handleOpenBoost('cv', cv.id, `${cv.firstName} ${cv.lastName}`)}
                            className="py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer animate-pulse"
                          >
                            <span>🔥 Booster 7j</span>
                          </button>
                        )}
                      </div>
                      
                      {/* Admin inline actions details */}
                      {isUserAdmin ? (
                        <div className="space-y-1.5 p-2 bg-slate-900 text-white rounded-xl border border-slate-800 text-left">
                          <p className="text-[9px] uppercase font-black text-emerald-400 font-mono tracking-wider mb-1 text-center">🛡️ Commandes de Recrutement d'Administration</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleDialCode(cv.contact)}
                              className="py-1.5 px-2 bg-slate-850 hover:bg-slate-805 rounded text-[10px] text-white font-extrabold flex items-center justify-center gap-1 cursor-pointer border border-slate-705"
                              title="Numéro privé de l'adhérent"
                            >
                              📞 Numéro Privé
                            </button>
                            <button
                              onClick={() => {
                                const desc = `Bonjour, en tant qu'administrateur, je souhaite vous guider sur votre fiche de CV.`;
                                handleWhatsAppRedirect(cv.contact, desc);
                              }}
                              className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 rounded text-[10px] text-white font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                              title="Engager discussion sur WhatsApp"
                            >
                              💬 WhatsApp
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 mt-1">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/admin/publications/cvs/${cv.id}/boucler`, { method: "POST" });
                                  if (res.ok) {
                                    alert("✓ CV clôturé/bouclé (Embauche finalisée) avec succès.");
                                    window.location.reload();
                                  }
                                } catch (err) {
                                  alert("Erreur");
                                }
                              }}
                              className="py-1.5 px-1 bg-amber-600 hover:bg-amber-500 rounded text-[10px] text-slate-950 font-black cursor-pointer text-center"
                              title="Valider l'embauche et boucler le CV"
                            >
                              🤝 Bouclé
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/admin/publications/cvs/${cv.id}/relancer`, { method: "POST" });
                                  if (res.ok) {
                                    alert("🔔 Message de relance de commission enregistré de manière sécurisée.");
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                                if (onAdminInitiatePrivateChat) {
                                  const msg = `Bonjour @${cv.firstName} ${cv.lastName}, ici l'administrateur de la plateforme d'Agroécologie Bénin AgriBot. Je me permets de vous contacter sous forme de rappel amical concernant la commission liée au référencement ou placement de votre CV de ${cv.type === "technician" ? "Technicien" : "Stagiaire"} maraîcher bio. Merci de faire le point avec nous via ce tchat pour l'encaissement. Cordialement !`;
                                  onAdminInitiatePrivateChat(cv.userId || "", `${cv.firstName} ${cv.lastName}`, cv.contact, msg);
                                }
                              }}
                              className="py-1.5 px-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[10px] text-white font-bold cursor-pointer text-center"
                              title="Relancer pour paiement de commission"
                            >
                              🔔 Relancer
                            </button>
                          </div>

                          <div className="flex flex-col gap-1 mt-1">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/admin/publications/cvs/${cv.id}/reception-commande`, { method: "POST" });
                                  if (res.ok) {
                                    alert("📦 Notification de validation enregistrée.");
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                                if (onAdminInitiatePrivateChat) {
                                  const msg = `Bonjour @${cv.firstName} ${cv.lastName}, ici l'administrateur de la plateforme d'Agroécologie Bénin. Nous avons le plaisir de vous informer qu'un recruteur agricole s'est montré vivement intéressé par votre profil "${cv.specialty}" ! Veuillez nous répondre sur ce tchat pour coordonner la mise en relation et l'entretien. Merci !`;
                                  onAdminInitiatePrivateChat(cv.userId || "", `${cv.firstName} ${cv.lastName}`, cv.contact, msg);
                                }
                              }}
                              className="py-1.5 bg-sky-600 hover:bg-sky-500 rounded text-[10px] text-white font-bold cursor-pointer text-center"
                              title="Envoyer notification Réception de commande / recrutement validé"
                            >
                              📦 Réception de commande
                            </button>

                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => {
                                  const shareText = `💼 PROFIL CV DISPONIBLE SUR AGRIBOT MINE D'OR 💼\n\n👤 Nom complet : ${cv.firstName} ${cv.lastName}\n🌿 Spécialité : ${cv.specialty}\n🛠️ Compétences : ${cv.skills}\n📞 Contact : ${cv.contact}\n\nRetrouvez ce profil sur AgriBot Mine d'Or !`;
                                  triggerSharing(`AgriBot - CV de ${cv.firstName}`, shareText);
                                }}
                                className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-white font-bold cursor-pointer text-center"
                              >
                                🔗 Partager
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/admin/publications/cvs/${cv.id}/toggle-visibility`, { method: "POST" });
                                    if (res.ok) {
                                      alert("✓ Visibilité suspendue / rétablie.");
                                      window.location.reload();
                                    }
                                  } catch (err) {
                                    alert("Erreur");
                                  }
                                }}
                                className={`py-1.5 rounded text-[10px] font-bold cursor-pointer text-center ${
                                  cv.isBlockedByCoordinator ? "bg-green-650 text-white" : "bg-red-800 text-white"
                                }`}
                                title="Masquer/Afficher le CV du profil public"
                              >
                                {cv.isBlockedByCoordinator ? "👁️ Réactiver" : "🚫 Masquer"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : belongsToUser ? (
                        <>
                          <p className="text-[10px] text-zinc-500 font-bold bg-slate-50 border p-1 rounded-md text-center">
                            ✨ C'est votre propre fiche de CV
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <button
                              onClick={() => {
                                const desc = `Bonjour, je vous contacte à propos de votre profil CV de ${cv.type === "technician" ? "Technicien" : "Stagiaire"} spécialisé en "${cv.specialty}" publié sur AgriBot Mine d'Or du Bénin. Est-il toujours d'actualité ?`;
                                handleWhatsAppRedirect(cv.contact, desc);
                              }}
                              className="py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <MessageCircle className="h-3.5 w-3.5 bg-emerald-500 text-white rounded-full p-0.5 shrink-0" />
                              <span>WhatsApp</span>
                            </button>
                            
                            <button
                              onClick={() => handleDialCode(cv.contact)}
                              className="py-1.5 bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <PhoneCall className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span>Téléphone</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        /* Chez les autres (Other users): Only show Intéressé (redirecting to the coordinator) and Partager */
                        <div className="space-y-1.5">
                          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/55 flex items-center gap-1.5">
                            <span className="text-xs shrink-0">🔒</span>
                            <span className="text-[9px] text-amber-900 leading-tight font-semibold">
                              Candidat protégé pour sécuriser de façon fiable le recrutement et les commissions.
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 pt-1">
                            <button
                              onClick={() => {
                                if (onContactSellerPrivate) {
                                  onContactSellerPrivate(
                                    "Jean-Baptiste ZOUNMATOUN (Administrateur)",
                                    "01614432",
                                    `Recrutement de ${cv.firstName} ${cv.lastName} (${cv.specialty})`
                                  );
                                }
                              }}
                              className="col-span-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl text-[10.5px] font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer uppercase shadow-3xs active:scale-95 animate-pulse"
                              title="Signaler votre intérêt à l'Administrateur principal"
                            >
                              🤝 Intéressé
                            </button>
                            
                            <button
                              onClick={() => {
                                const shareText = `💼 PROFIL CV DISPONIBLE SUR AGRIBOT MINE D'OR 💼\n\n👤 Nom complet : ${cv.firstName} ${cv.lastName}\n🎓 Qualification : ${cv.type === 'technician' ? 'Technicien Spécialisé' : 'Recherche de Stage'}\n🌿 Spécialité : ${cv.specialty}\n🛠️ Compétences : ${cv.skills}\n📞 Contact : Administrateur Agribot\n\nRetrouvez ce profil et bénéficiez de conseils d'experts sur AgriBot Mine d'Or - la mine d'or du maraîcher !`;
                                triggerSharing(`AgriBot - CV de ${cv.firstName}`, shareText);
                              }}
                              className="py-1.5 bg-white hover:bg-slate-200 text-slate-705 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer border shadow-3xs active:scale-95"
                              title="Partager cette candidature"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
            </div>
          );
        })}
          </div>
        </div>
      )}

      {/* TABS 2: APPELS A CANDIDATURES & OFFRES */}
      {activeTab === 'appels' && (
        <div className="space-y-5 animate-fade-in">

          {/* DESCRIPTION CONTAINER FOR APPELS OR OPPORTUNITIES as requested */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl shadow-3xs gap-3 text-left">
            <div>
              <h3 className="text-sm font-black text-emerald-950 font-display uppercase tracking-wider">📢 Appels à Candidatures &amp; Offres d'Opportunités</h3>
              <p className="text-[11px] text-zinc-650 font-semibold">
                Publiez vos offres d'emplois saisonniers, CDD/CDI, de stages ou vos appels à candidatures d'intégration de projets agricoles coopératifs pour mobiliser des profils formés de confiance.
              </p>
            </div>
            <button
              onClick={() => setShowAddAppel(!showAddAppel)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-[10.5px] uppercase tracking-wider transition shrink-0 cursor-pointer text-center"
            >
              📢 Publier un Appel ou une Offre
            </button>
          </div>

          {showAddAppel && (
            <form onSubmit={submitAppel} className="p-5 bg-white rounded-2xl border-2 border-emerald-300 shadow-md space-y-4 max-w-xl mx-auto transform animate-scale-in text-left">
              <h4 className="text-xs font-black text-slate-950 uppercase border-b pb-1 font-display tracking-widest text-emerald-700">Publiez une opportunité, appel ou offre</h4>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Titre de l'Appel ou du Poste</label>
                <input type="text" required placeholder="Ex: Recherche de 2 stagiaires maraîchers ou Appel à Projet Agro-Élevage" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={appelTitle} onChange={(e) => setAppelTitle(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Ferme / Organisation Émettrice</label>
                  <input type="text" required placeholder="Ex: Ferme Agroécologique de Dangbo" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={appelOrg} onChange={(e) => setAppelOrg(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Commune / Lieu du poste</label>
                  <input type="text" required placeholder="Ex: Dangbo, Atacora, Ouidah" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={appelLoc} onChange={(e) => setAppelLoc(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Catégorie d'offre</label>
                  <select 
                    value={appelType} 
                    onChange={e => setAppelType(e.target.value as "stage" | "emploi" | "saisonnier")}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-850"
                  >
                    <option value="stage">🎓 Stage d'apprentissage pratique</option>
                    <option value="emploi">👔 Emploi Durable / CDD / CDI</option>
                    <option value="saisonnier">🚜 Mission saisonnière / Consultant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Contact pour postuler (Téléphone)</label>
                  <input type="text" required placeholder="Ex: 91000000" className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white text-slate-800 font-bold" value={appelContact} onChange={(e) => setAppelContact(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">WhatsApp de contact (8 chiffres)</label>
                  <input type="text" placeholder="Ex: 97000000" className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white text-slate-850 text-slate-800" value={appelPhoneWhatsApp} onChange={(e) => setAppelPhoneWhatsApp(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Ligne Directe de contact (8 chiffres)</label>
                  <input type="text" placeholder="Ex: 61000000" className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white text-slate-850 text-slate-800" value={appelPhoneDirect} onChange={(e) => setAppelPhoneDirect(e.target.value)} />
                </div>
              </div>

              {/* V2 Fields section */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/30 rounded-xl border border-emerald-100">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">💰 Rémunération Proposée (FCFA/mois)</label>
                  <input type="text" placeholder="Ex: 60 000 ou Selon profil" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850 font-mono" value={appelSalairePropose} onChange={(e) => setAppelSalairePropose(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">🏠 Logé &amp; Nourri ?</label>
                  <div className="flex gap-3 mt-2.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={appelLogementNourri} onChange={(e) => setAppelLogementNourri(e.target.checked)} className="rounded text-emerald-600" />
                      <span>Logement &amp; repas inclus 🌾</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📅 Date de début prévue</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-805" value={appelDateDebut} onChange={(e) => setAppelDateDebut(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">⌛ Date limite de candidature</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-805" value={appelDateLimite} onChange={(e) => setAppelDateLimite(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📄 Lien Cahier des charges / Termes de référence (Optionnel)</label>
                  <input type="text" placeholder="Ex: https://drive.google.com/terms-of-ref.pdf" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850 font-mono" value={appelCahierChargesUrl} onChange={(e) => setAppelCahierChargesUrl(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📷 Logo de la ferme ou Photo de l'offre (Optionnel)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <label className="block text-[9px] uppercase text-slate-500 mb-1 font-bold">Importer un logo ou une image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("⚠️ IMAGE TROP LOURDE : Veuillez choisir une image de moins de 2 Mo.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                              setAppelPhotoUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <p className="text-[9px] text-slate-400 mt-1">Glissez-déposez ou sélectionnez un fichier JPEG, PNG (Max 2 Mo)</p>
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div>
                      <label className="block text-[9px] uppercase text-slate-500 mb-1 font-bold font-sans">Ou coller l'URL d'une Image</label>
                      <input
                        type="text"
                        placeholder="https://ex.com/logo.jpg"
                        className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white text-slate-800 font-mono"
                        value={appelPhotoUrl}
                        onChange={(e) => setAppelPhotoUrl(e.target.value)}
                      />
                    </div>
                    {appelPhotoUrl && (
                      <div className="flex items-center gap-2 mt-1 bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100">
                        <img src={appelPhotoUrl} alt="Aperçu" className="w-8 h-8 rounded-md object-cover border border-white shrink-0" referrerPolicy="no-referrer" />
                        <span className="text-[9px] text-emerald-700 font-bold truncate">Image sélectionnée !</span>
                        <button type="button" onClick={() => setAppelPhotoUrl("")} className="ml-auto text-[9px] text-red-600 font-bold hover:underline">Effacer</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Description détaillée des tâches &amp; profil recherché</label>
                <textarea rows={4} required placeholder="Détaillez : objectifs de production, logement fourni ou non, rémunération symbolique d'aide ou salaire, compétences requises..." className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={appelDesc} onChange={(e) => setAppelDesc(e.target.value)} />
              </div>

              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddAppel(false)} className="px-3.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg font-bold">Annuler</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider">Mettre l'appel en ligne</button>
              </div>
            </form>
          )}

          {/* Advanced V2 Filters Panel for Appels */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-3xs flex flex-wrap gap-3 items-center text-left">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <span className="text-sm">🎯</span> Filtrer par :
            </span>
            <div className="flex flex-1 flex-wrap gap-2.5">
              <input
                type="text"
                placeholder="📍 Commune (ex: Dangbo)"
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
                value={filterAppelCommune}
                onChange={(e) => setFilterAppelCommune(e.target.value)}
              />
              <select
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                value={filterAppelTypeContrat}
                onChange={(e) => setFilterAppelTypeContrat(e.target.value)}
              >
                <option value="">Tous les types d'offres</option>
                <option value="stage">🎓 Stage d'apprentissage</option>
                <option value="emploi">👔 Emploi Durable CDD/CDI</option>
                <option value="saisonnier">🚜 Mission saisonnière</option>
              </select>
              {(filterAppelCommune || filterAppelTypeContrat) && (
                <button
                  onClick={() => {
                    setFilterAppelCommune("");
                    setFilterAppelTypeContrat("");
                  }}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Réinitialiser ✕
                </button>
              )}
            </div>
          </div>

          {/* Appels lists - formatted exactly as Marketplace cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(() => {
              const filteredAppels = appelsCandidatures
                .filter((app) => {
                  if (searchText.trim()) {
                    const query = searchText.toLowerCase();
                    const termMatch = `${app.title} ${app.organization} ${app.location} ${app.description}`.toLowerCase().includes(query);
                    if (!termMatch) return false;
                  }
                  // V2 Filters
                  if (filterAppelCommune.trim() && !app.location.toLowerCase().includes(filterAppelCommune.toLowerCase())) {
                    return false;
                  }
                  if (filterAppelTypeContrat && app.typeContrat !== filterAppelTypeContrat) {
                    return false;
                  }
                  return true;
                })
                .sort((a, b) => {
                  const aBoost = a.boostExpireAt && new Date(a.boostExpireAt) > new Date() ? 1 : 0;
                  const bBoost = b.boostExpireAt && new Date(b.boostExpireAt) > new Date() ? 1 : 0;
                  if (bBoost !== aBoost) return bBoost - aBoost;
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });

              if (filteredAppels.length === 0) {
                return (
                  <div className="col-span-full bg-white rounded-2xl border p-8 text-center text-slate-400 space-y-1">
                    <p className="font-bold text-slate-700">Aucun appel à candidature ne correspond à votre recherche.</p>
                    <p className="text-xs">Modifiez vos filtres ou vos mots-clefs pour trouver des offres de stage ou d'emploi.</p>
                  </div>
                );
              }

              return filteredAppels.map((app) => {
                const belongsToUser = user && (app.userId === user.id || isUserAdmin);
                const isEditing = editingAppelId === app.id;

                return (
                  <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between gap-4 relative group">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="px-2.5 py-1 text-[9px] uppercase font-mono font-black tracking-widest rounded bg-emerald-50 text-emerald-800 border border-emerald-250 leading-none">
                            💼 {app.typeContrat === "stage" ? "Stage Agricole" : app.typeContrat === "saisonnier" ? "Mission Saisonnière" : "Offre d'Emploi CDD/CDI"}
                          </span>
                          {app.boostExpireAt && new Date(app.boostExpireAt) > new Date() && (
                            <span className="text-[9px] uppercase font-black bg-amber-500 text-white px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs animate-pulse">
                              🔥 BOOSTÉ
                            </span>
                          )}
                          {belongsToUser && (
                            <span className={`text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              app.statut === 'valide' ? 'bg-green-100 text-green-800' : app.statut === 'refuse' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-850'
                            }`}>
                              {app.statut === 'valide' ? 'En ligne' : app.statut === 'refuse' ? 'Refusé' : 'En attente'}
                            </span>
                          )}
                        </div>

                        {belongsToUser && !isEditing && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditAppel(app)}
                              className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                              title="Modifier"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteAppel(app.id)}
                              className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3 pt-1">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500">Titre Poste</label>
                            <input type="text" className="w-full p-2 border rounded-lg text-xs" value={editAppelTitle} onChange={(e) => setEditAppelTitle(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500">Ferme</label>
                            <input type="text" className="w-full p-2 border rounded-lg text-xs" value={editAppelOrg} onChange={(e) => setEditAppelOrg(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500">Lieu</label>
                            <input type="text" className="w-full p-2 border rounded-lg text-xs" value={editAppelLoc} onChange={(e) => setEditAppelLoc(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500">Contact d'appel</label>
                            <input type="text" className="w-full p-2 border rounded-lg text-xs font-mono font-bold" value={editAppelContact} onChange={(e) => setEditAppelContact(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
                            <textarea rows={3} className="w-full p-2 border rounded-lg text-xs" value={editAppelDesc} onChange={(e) => setEditAppelDesc(e.target.value)} />
                          </div>
                          <div className="flex gap-2 justify-end pt-1">
                            <button onClick={() => setEditingAppelId(null)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">Annuler</button>
                            <button onClick={() => saveEditAppel(app.id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Enregistrer</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-4 items-start text-left">
                            {app.photoUrl ? (
                              <img 
                                src={app.photoUrl} 
                                alt={app.organization} 
                                className="w-14 h-14 object-cover rounded-xl border-2 border-emerald-100 shadow-3xs shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-slate-100 border border-emerald-100 flex items-center justify-center text-xl shrink-0 font-display font-black text-emerald-600">
                                📢
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-slate-900 font-display text-sm leading-snug uppercase tracking-tight">{app.title}</h4>
                              <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wide mt-0.5">🏢 {app.organization}</p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pb-1 text-left">{app.description}</p>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 font-medium text-left">
                            <span>📍 Lieu de travail : <strong>{app.location}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="border-t border-slate-100 pt-3 space-y-2.5 mt-1">
                        <div className="flex justify-between items-center text-[9.5px] text-slate-500 font-mono font-bold bg-slate-50 p-1.5 rounded-lg border border-slate-200/50">
                          <span>Publié par @{app.userName || "Admin"}</span>
                          <span className="text-emerald-700 flex items-center gap-1 font-mono">
                            <span>👁️ {app.vues || 0}</span>
                            <span>•</span>
                            <span>💬 {app.clicsWhatsApp || 0}</span>
                          </span>
                        </div>
                        
                        {/* Consulter la fiche complète & Booster action panel */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleOpenDetail('appel', app)}
                            className="py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 border border-emerald-200 cursor-pointer"
                          >
                            <span>🔎 Consulter Fiche</span>
                          </button>
                          {belongsToUser && (
                            <button
                              onClick={() => handleOpenBoost('appel', app.id, app.title)}
                              className="py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer animate-pulse"
                            >
                              <span>🔥 Booster 7j</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              const desc = `Bonjour, je postule à votre offre d'opportunité : "${app.title}" (${app.organization}) publiée sur AgriBot Mine d'Or du Bénin. Est-elle toujours disponible ?`;
                              handleWhatsAppContact('appel', app, app.contact, desc);
                            }}
                            className="py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-750 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-emerald-500/10"
                            title="Postuler via WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5 bg-emerald-500 text-white rounded-full p-0.5 shrink-0" />
                            <span>WhatsApp</span>
                          </button>
                          
                          <button
                            onClick={() => handleDialCode(app.contact)}
                            className="py-1.5 bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            title="Téléphoner au recruteur"
                          >
                            <PhoneCall className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>Téléphone</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => {
                              if (onContactSellerPrivate) {
                                onContactSellerPrivate(
                                  app.userName || "Directeur Recrutement",
                                  app.contact,
                                  `Réf: ${app.title}`
                                );
                              }
                            }}
                            className="col-span-3 py-1.5 bg-gradient-to-r from-emerald-650 to-teal-700 text-white rounded-xl text-[11px] font-bold hover:from-emerald-700 hover:to-teal-800 transition flex items-center justify-center gap-1 cursor-pointer"
                            title="Contacter l'annonceur en messagerie interne"
                          >
                            💬 Inbox AgriBot
                          </button>
                          
                          <button
                            onClick={() => {
                              const shareText = `📢 OPPORTUNITÉ DE RECRUTEMENT SUR AGRIBOT MINE D'OR 📢\n\n📌 Poste : ${app.title}\n🏢 Employeur : ${app.organization}\n📍 Lieu de travail : ${app.location}\n📝 Description : ${app.description}\n📞 Contact : ${app.contact}\n\nRetrouvez cette offre et candidatez directement sur l'application AgriBot Mine d'Or !`;
                              triggerSharing(`AgriBot - Recrutement ${app.title}`, shareText);
                            }}
                            className="py-1.5 bg-white text-slate-705 hover:bg-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer border"
                            title="Partager cette offre"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            })()}
          </div>
        </div>
      )}

      {/* TABS 3: PROJETS & FINANCEMENT SPACES */}
      {activeTab === 'funding' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white rounded-2xl border border-slate-200/60 shadow-xs gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-wider">💡 Espace Projets &amp; Financements</h3>
              <p className="text-[11px] text-slate-500">Valorisez vos plans de culture, fiches de rentabilité d'agro-transformation ou de cheptels auprès des investisseurs.</p>
            </div>
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition shrink-0 cursor-pointer"
            >
              Exposer mon projet
            </button>
          </div>

          {showAddProject && (
            <form onSubmit={submitProject} className="p-5 bg-white rounded-2xl border-2 border-emerald-250 shadow-md space-y-4 max-w-xl mx-auto transform animate-scale-in">
              <h4 className="text-xs font-black text-slate-950 uppercase border-b pb-1 font-display tracking-widest text-emerald-700">Présentez votre projet agricole innovant</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Prénom de l'agro-promoteur</label>
                  <input type="text" required placeholder="Ex: Baudouin" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white" value={projFirstName} onChange={(e) => setProjFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Nom</label>
                  <input type="text" required placeholder="Ex: Dossou" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white" value={projLastName} onChange={(e) => setProjLastName(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Numéro de téléphone direct / WhatsApp</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" required placeholder="WhatsApp: 97000000" className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white text-slate-800" value={projPhoneWhatsApp} onChange={(e) => setProjPhoneWhatsApp(e.target.value)} />
                    <input type="text" required placeholder="Direct: 61000000" className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-slate-50 focus:bg-white text-slate-800" value={projPhoneDirect} onChange={(e) => setProjPhoneDirect(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Titre de l'innovation / Spéculation</label>
                  <input type="text" required placeholder="Ex: Unité moderne de séchage de manioc" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800" value={projTitle} onChange={(e) => setProjTitle(e.target.value)} />
                </div>
              </div>

              {/* V2 fields for Projects */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/20 rounded-xl border border-emerald-100">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📍 Commune du projet</label>
                  <input type="text" placeholder="Ex: Allada, Dangbo, Djidja" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850" value={projCommune} onChange={(e) => setProjCommune(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">🚜 Spéculation / Type de culture/élevage</label>
                  <input type="text" placeholder="Ex: Tomate hors-sol, Banane plantain, Poulets Goliath" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850" value={projTypeCultureElevage} onChange={(e) => setProjTypeCultureElevage(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📐 Superficie exploitable / de culture</label>
                  <input type="text" placeholder="Ex: 2 Hectares ou 500 m²" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850" value={projSuperficie} onChange={(e) => setProjSuperficie(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">⏱️ Durée estimée du projet</label>
                  <input type="text" placeholder="Ex: 5 ans, 12 mois" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850" value={projDureeProjet} onChange={(e) => setProjDureeProjet(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">💰 Montant Recherché (FCFA)</label>
                  <input type="text" placeholder="Ex: 3 500 000 FCFA" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850 font-mono font-bold text-emerald-700" value={projMontantRecherche} onChange={(e) => setProjMontantRecherche(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">💵 Apport Personnel (Optionnel)</label>
                  <input type="text" placeholder="Ex: 1 200 000 FCFA" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850 font-mono" value={projApportPerso} onChange={(e) => setProjApportPerso(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📈 Lien vers la Fiche de rentabilité PDF ou business plan</label>
                  <input type="text" placeholder="Ex: https://drive.google.com/your-business-plan.pdf" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850 font-mono" value={projFicheRentabiliteUrl} onChange={(e) => setProjFicheRentabiliteUrl(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">📷 Lien photo / Image du site ou de l'exploitation (Optionnel)</label>
                  <input type="text" placeholder="Ex: https://ex.com/site-photo.jpg" className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-850 font-mono" value={projPhotoUrl} onChange={(e) => setProjPhotoUrl(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Description des besoins de financement & rentabilité</label>
                <textarea rows={4} required placeholder="Présentez brièvement votre innovation maraîchère, les infrastructures déjà établies, les produits transformés et le capital sollicité." className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:bg-white" value={projSummary} onChange={(e) => setProjSummary(e.target.value)} />
              </div>

              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddProject(false)} className="px-3.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg font-bold">Annuler</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider">Mettre en ligne</button>
              </div>
            </form>
          )}

          {/* Advanced V2 Filters Panel for Projects */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-3xs flex flex-wrap gap-3 items-center text-left">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <span className="text-sm">🎯</span> Filtrer par :
            </span>
            <div className="flex flex-1 flex-wrap gap-2.5">
              <input
                type="text"
                placeholder="📍 Commune (ex: Allada)"
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
                value={filterProjCommune}
                onChange={(e) => setFilterProjCommune(e.target.value)}
              />
              <input
                type="text"
                placeholder="🚜 Spéculation (ex: Tomate)"
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
                value={filterProjType}
                onChange={(e) => setFilterProjType(e.target.value)}
              />
              {(filterProjCommune || filterProjType) && (
                <button
                  onClick={() => {
                    setFilterProjCommune("");
                    setFilterProjType("");
                  }}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Réinitialiser ✕
                </button>
              )}
            </div>
          </div>

          {/* Project listings in cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(() => {
              const filteredProjects = initialProjects
                .filter((p) => {
                  if (searchText.trim()) {
                    const query = searchText.toLowerCase();
                    const termMatch = `${p.title} ${p.summary} ${p.firstName} ${p.lastName}`.toLowerCase().includes(query);
                    if (!termMatch) return false;
                  }
                  // V2 Filters
                  if (filterProjCommune.trim() && !(p.commune || "").toLowerCase().includes(filterProjCommune.toLowerCase())) {
                    return false;
                  }
                  if (filterProjType.trim() && !(p.typeCultureElevage || "").toLowerCase().includes(filterProjType.toLowerCase())) {
                    return false;
                  }
                  return true;
                })
                .sort((a, b) => {
                  const aBoost = a.boostExpireAt && new Date(a.boostExpireAt) > new Date() ? 1 : 0;
                  const bBoost = b.boostExpireAt && new Date(b.boostExpireAt) > new Date() ? 1 : 0;
                  if (bBoost !== aBoost) return bBoost - aBoost;
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });

              if (filteredProjects.length === 0) {
                return (
                  <div className="col-span-full bg-white rounded-2xl border p-8 text-center text-slate-400 space-y-1">
                    <p className="font-bold text-slate-700">Aucun projet ne correspond à votre recherche.</p>
                    <p className="text-xs">Modifiez vos filtres ou vos mots-clefs pour filtrer les innovations et fiches de financement.</p>
                  </div>
                );
              }

              return filteredProjects.map((p) => {
              const belongsToUser = user && (p.userId === user.id || isUserAdmin);
              const isEditing = editingProjId === p.id;

              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition flex flex-col justify-between gap-3 relative group">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="text-[9px] uppercase font-black tracking-widest font-mono bg-amber-50 text-amber-800 border-amber-200 border px-2.5 py-1 rounded">
                          💡 Projet de Financement
                        </span>
                        {p.boostExpireAt && new Date(p.boostExpireAt) > new Date() && (
                          <span className="text-[9px] uppercase font-black bg-amber-500 text-white px-2 py-0.5 rounded flex items-center gap-0.5 shadow-2xs animate-pulse">
                            🔥 BOOSTÉ
                          </span>
                        )}
                        {belongsToUser && (
                          <span className={`text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            p.statut === 'valide' ? 'bg-green-100 text-green-800' : p.statut === 'refuse' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-850'
                          }`}>
                            {p.statut === 'valide' ? 'En ligne' : p.statut === 'refuse' ? 'Refusé' : 'En attente'}
                          </span>
                        )}
                      </div>

                      {belongsToUser && !isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditProj(p)}
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                            title="Modifier"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(p.id)}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Titre Projet</label>
                          <input type="text" className="w-full p-2 border rounded-lg text-xs" value={editProjTitle} onChange={(e) => setEditProjTitle(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Contact d'appel</label>
                          <input type="text" className="w-full p-2 border rounded-lg text-xs font-mono font-bold" value={editProjPhone} onChange={(e) => setEditProjPhone(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Synthèse du projet</label>
                          <textarea rows={3} className="w-full p-2 border rounded-lg text-xs" value={editProjSummary} onChange={(e) => setEditProjSummary(e.target.value)} />
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button onClick={() => setEditingProjId(null)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">Annuler</button>
                          <button onClick={() => saveEditProj(p.id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Enregistrer</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-bold text-slate-900 font-display text-sm leading-snug">{p.title}</h4>
                          <span className="text-[10.5px] text-slate-500 font-bold">Agro-promoteur : {p.firstName} {p.lastName}</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-4">
                          {p.summary}
                        </p>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="border-t border-slate-100 pt-3 space-y-2.5 mt-1">
                      <div className="flex justify-between items-center text-[9.5px] text-slate-500 font-mono font-bold bg-slate-50 p-1.5 rounded-lg border border-slate-200/50">
                        <span>Publié le {new Date(p.createdAt).toLocaleDateString()}</span>
                        <span className="text-emerald-700 flex items-center gap-1 font-mono">
                          <span>👁️ {p.vues || 0}</span>
                          <span>•</span>
                          <span>💬 {p.clicsWhatsApp || 0}</span>
                        </span>
                      </div>

                      {/* Consulter la fiche complète & Booster action panel */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenDetail('project', p)}
                          className="py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 border border-emerald-200 cursor-pointer"
                        >
                          <span>🔎 Consulter Fiche</span>
                        </button>
                        {belongsToUser && (
                          <button
                            onClick={() => handleOpenBoost('project', p.id, p.title)}
                            className="py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer animate-pulse"
                          >
                            <span>🔥 Booster 7j</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            const desc = `Bonjour, je suis très intéressé par votre projet de financement : "${p.title}" publié sur AgriBot Mine d'Or du Bénin. Pouvons-nous en discuter ?`;
                            handleWhatsAppContact('project', p, p.phoneWhatsApp || p.phone, desc);
                          }}
                          className="py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-750 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-emerald-500/10"
                          title="Contacter le porteur via WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5 bg-emerald-500 text-white rounded-full p-0.5 shrink-0" />
                          <span>WhatsApp</span>
                        </button>
                        
                        <button
                          onClick={() => handleDialCode(p.phoneDirect || p.phone)}
                          className="py-1.5 bg-slate-50 hover:bg-slate-900 text-slate-800 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Téléphoner au promoteur"
                        >
                          <PhoneCall className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Téléphone</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
            })()}
          </div>
        </div>
      )}

      {/* V2 SELECTED DETAIL MODAL */}
      {selectedDetailItem && (() => {
        const { type, item } = selectedDetailItem;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 transform scale-100 transition relative animate-scale-in my-8">
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-5 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-black">
                    {type === 'cv' ? '👨‍🌾' : type === 'project' ? '💡' : '📢'}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 font-mono">
                      {type === 'cv' ? 'Fiche Candidat' : type === 'project' ? 'Fiche Projet & Financement' : 'Fiche Opportunité'}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 font-display leading-tight uppercase mt-0.5">
                      {type === 'cv' ? `${item.firstName} ${item.lastName}` : item.title}
                    </h3>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* CV Specific Detail rendering */}
                {type === 'cv' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Spécialité</span>
                        <strong className="text-slate-800 text-[11px]">{item.specialty || 'Généraliste'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Niveau d'études</span>
                        <strong className="text-slate-800 text-[11px]">{item.education || 'Non renseigné'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">📍 Commune de dispo</span>
                        <strong className="text-slate-800 text-[11px]">{item.communeDispo || 'Tout le Bénin 🇧🇯'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">💼 Type de Contrat</span>
                        <strong className="text-slate-800 text-[11px] uppercase">
                          {item.typeContrat === "stage" ? "🎓 Stage" : item.typeContrat === "saison" ? "🚜 Saison" : item.typeContrat === "cdd" ? "👔 CDD" : "👔 CDI"}
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">💰 Rémunération souhaitée</span>
                        <strong className="text-emerald-700 font-mono text-[11px]">{item.salaireSouhaite ? `${item.salaireSouhaite} FCFA` : 'À débattre'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">⏱️ Disponibilité</span>
                        <strong className={item.dispoImmediate ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                          {item.dispoImmediate ? "✅ Immédiate" : "⏳ Sous préavis"}
                        </strong>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                      <span className="block text-[9px] uppercase font-bold text-slate-500">Compétences &amp; Expériences</span>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">{item.skills}</p>
                    </div>

                    {item.cvPdfUrl && (
                      <a
                        href={item.cvPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-emerald-200"
                      >
                        📄 Consulter le CV complet (PDF / Google Drive)
                      </a>
                    )}
                  </div>
                )}

                {/* Project Specific Detail rendering */}
                {type === 'project' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">Agro-promoteur</span>
                        <strong className="text-slate-800 text-[11px]">{item.firstName} {item.lastName}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">📍 Commune d'exploitation</span>
                        <strong className="text-slate-800 text-[11px]">{item.commune || 'Bénin 🇧🇯'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">🚜 Spéculation / Secteur</span>
                        <strong className="text-slate-800 text-[11px]">{item.typeCultureElevage || 'Agro-pastoral'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">📐 Superficie</span>
                        <strong className="text-slate-800 text-[11px]">{item.superficie || 'Non spécifiée'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">💰 Financement Sollicité</span>
                        <strong className="text-emerald-700 font-mono text-[11.5px]">{item.montantRecherche || 'À négocier'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">💵 Apport Promoteur</span>
                        <strong className="text-slate-600 font-mono text-[11px]">{item.apportPerso || '0 FCFA'}</strong>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                      <span className="block text-[9px] uppercase font-bold text-slate-500">Synthèse du projet innovant &amp; Rentabilité</span>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">{item.summary}</p>
                    </div>

                    {item.photoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200">
                        <img src={item.photoUrl} alt="Projet" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    {item.ficheRentabiliteUrl && (
                      <a
                        href={item.ficheRentabiliteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-emerald-200"
                      >
                        📊 Télécharger la Fiche de Rentabilité / Business Plan
                      </a>
                    )}
                  </div>
                )}

                {/* Appel Specific Detail rendering */}
                {type === 'appel' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">🏢 Structure / Ferme</span>
                        <strong className="text-slate-800 text-[11px]">{item.organization}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">📍 Lieu du poste</span>
                        <strong className="text-slate-800 text-[11px]">{item.location}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">💰 Rémunération Offerte</span>
                        <strong className="text-emerald-700 font-mono text-[11px]">{item.salairePropose || 'Selon profil / Stage'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">🏠 Conditions de logement</span>
                        <strong className="text-slate-800 text-[11px]">
                          {item.logementNourri ? '🏠 Logé & Nourri inclus 🎉' : '❌ Non nourri, non logé'}
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">📅 Date de début</span>
                        <strong className="text-slate-800 text-[11px]">{item.dateDebut ? new Date(item.dateDebut).toLocaleDateString('fr-FR') : 'Immédiate'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">⏳ Limite de candidature</span>
                        <strong className="text-red-700 font-bold text-[11px]">{item.dateLimite ? new Date(item.dateLimite).toLocaleDateString('fr-FR') : 'Jusqu\'à satisfaction'}</strong>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                      <span className="block text-[9px] uppercase font-bold text-slate-500">Missions &amp; Profil recherché</span>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">{item.description}</p>
                    </div>

                    {item.photoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200">
                        <img src={item.photoUrl} alt="Logo" className="w-full h-36 object-contain bg-slate-50" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    {item.cahierChargesUrl && (
                      <a
                        href={item.cahierChargesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-emerald-200"
                      >
                        📄 Consulter les Termes de Référence / TDR
                      </a>
                    )}
                  </div>
                )}

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      const text = `Bonjour, je vous contacte au sujet de votre annonce "${type === 'cv' ? item.firstName + ' ' + item.lastName : item.title}" sur AgriBot Mine d'Or Bénin. Est-elle disponible ?`;
                      handleWhatsAppContact(type, item, type === 'cv' ? item.contact : (item.phoneWhatsApp || item.contact || item.phone), text);
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>💬 Joindre via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleDialCode(type === 'cv' ? item.contact : (item.phoneDirect || item.contact || item.phone))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>📞 Appeler</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* V2 MOBILE MONEY BOOSTING MODAL SIMULATOR */}
      {boostingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-amber-200 relative animate-scale-in text-left">
            <button
              onClick={() => {
                if (!boostSimulating) {
                  setBoostingItem(null);
                  setBoostSuccess(false);
                }
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto animate-bounce">
                🔥
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">Booster de visibilité 7 jours</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Propulsez votre annonce en tête de liste et captez 5 fois plus de contacts.</p>
              </div>

              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-xs space-y-1 text-left">
                <span className="block text-[8.5px] text-amber-800 uppercase font-bold tracking-widest font-mono">Service ciblé :</span>
                <p className="font-extrabold text-slate-850 truncate">{boostingItem.title}</p>
                <div className="flex justify-between items-center pt-2 font-mono text-[11px] font-bold border-t border-amber-200/50">
                  <span>Tarif unique :</span>
                  <span className="text-amber-700">500 FCFA / 7j</span>
                </div>
              </div>

              {!boostSuccess ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProcessBoost();
                  }}
                  className="space-y-4 text-left"
                >
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase font-bold text-slate-600">Choisissez votre opérateur Mobile Money</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMomoOperator("MTN")}
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          momoOperator === "MTN" ? "bg-amber-400 border-amber-500 text-slate-950" : "bg-slate-50 border-slate-200 text-slate-650"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        <span>MTN MoMo 🟡</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMomoOperator("MOOV")}
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          momoOperator === "MOOV" ? "bg-blue-600 border-blue-700 text-white" : "bg-slate-50 border-slate-200 text-slate-650"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                        <span>Moov Money 🔵</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold text-slate-600">Numéro de téléphone payeur (Bénin)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 97000000"
                      className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold text-slate-800 text-center tracking-widest bg-slate-50 focus:bg-white focus:outline-none"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      disabled={boostSimulating}
                    />
                  </div>

                  {boostSimulating ? (
                    <div className="space-y-2 py-2">
                      <div className="flex justify-between items-center text-[10px] text-amber-800 font-bold font-mono">
                        <span className="animate-pulse">Envoi de la requête USSD...</span>
                        <span>Saisie du code PIN sur votre mobile</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full animate-[loading_3s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:shadow-md transition cursor-pointer text-center flex items-center justify-center"
                    >
                      🚀 Lancer le paiement (500 FCFA)
                    </button>
                  )}
                </form>
              ) : (
                <div className="space-y-4 py-3 animate-fade-in text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl mx-auto">
                    🎉
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-green-700">Paiement Reçu avec Succès !</h4>
                    <p className="text-[10px] text-slate-600 mt-1">Votre annonce a été boostée avec succès pendant 7 jours et s'affiche désormais en tête de liste.</p>
                  </div>
                  <button
                    onClick={() => {
                      setBoostingItem(null);
                      setBoostSuccess(false);
                    }}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                  >
                    Fermer et voir mon annonce
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
