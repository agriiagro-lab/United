import React, { useState } from "react";
import { SolidarityDemand, SolidarityCandidature, User } from "../types";
import { Handshake, MapPin, Calendar, DollarSign, Phone, Send, Heart, Eye, CheckCircle, XCircle, Check, Copy, Share2, Search } from "lucide-react";

interface SolidarityPanelProps {
  user: User;
  demands: SolidarityDemand[];
  candidatures: SolidarityCandidature[];
  onCreateDemand: (data: Omit<SolidarityDemand, "id" | "userId" | "userName" | "statut" | "createdAt">) => void;
  onApplyDemand: (demandeId: string, message: string) => void;
  onCloseDemand: (demandId: string) => void;
  onContactViaChat: (userName: string, contactValue: string, title: string) => void;
  onDeleteDemand?: (id: string) => void;
  onUpdateDemand?: (id: string, fields: Partial<SolidarityDemand>) => void;
  autoOpenAddForm?: boolean;
  onFormOpened?: () => void;
  selectedSolidarityId?: string | null;
  onClearSelection?: () => void;
}

export default function SolidarityPanel({
  user,
  demands,
  candidatures,
  onCreateDemand,
  onApplyDemand,
  onCloseDemand,
  onContactViaChat,
  onDeleteDemand,
  onUpdateDemand,
  autoOpenAddForm,
  onFormOpened,
  selectedSolidarityId,
  onClearSelection
}: SolidarityPanelProps) {
  const [filterType, setFilterType] = useState<"toutes" | "gratuit" | "payant">("toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  React.useEffect(() => {
    if (autoOpenAddForm) {
      setShowAddModal(true);
      if (onFormOpened) {
        onFormOpened();
      }
    }
  }, [autoOpenAddForm]);
  const [applyingDemandId, setApplyingDemandId] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState("");

  // Editing states
  const [editingDemandId, setEditingDemandId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLieu, setEditLieu] = useState("");
  const [editSuperficie, setEditSuperficie] = useState("");
  const [editConditions, setEditConditions] = useState("");
  const [editTypeRemuneration, setEditTypeRemuneration] = useState<"gratuit" | "payant">("gratuit");
  const [editMontant, setEditMontant] = useState(0);

  // Sharing states
  const [sharingDemand, setSharingDemand] = useState<SolidarityDemand | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareClick = (demand: SolidarityDemand) => {
    setSharingDemand(demand);
    setCopiedLink(false);
  };

  const handleCopyShareLink = (demand: SolidarityDemand) => {
    const shareText = `🤝 DEMANDE D'ENTRAIDE SOLIDAIRE (AGRIBOT BÉNIN) 🤝\n\n📌 Besoin : ${demand.title}\n👤 Par : @${demand.userName}\n📍 Commune : ${demand.lieu}\n🗓️ Durée : Du ${demand.dateDebut} au ${demand.dateFin}\n💰 Type : ${demand.typeRemuneration === "payant" ? `${demand.montant.toLocaleString()} FCFA` : "Entraide Bénévole"}\n⚠️ Conditions : ${demand.conditions || "Non spécifiées"}\n📞 Contact : ${demand.contactValue}\n\nRejoignez AgriBot Mine d'Or, la plateforme souveraine du monde rural béninois : http://localhost:3000/`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [typeRemuneration, setTypeRemuneration] = useState<"gratuit" | "payant">("gratuit");
  const [montant, setMontant] = useState(0);
  const [superficie, setSuperficie] = useState("");
  const [lieu, setLieu] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [conditions, setConditions] = useState("");
  const [contactType, setContactType] = useState<"chat" | "direct" | "whatsapp">("whatsapp");
  const [contactValue, setContactValue] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [phoneDirect, setPhoneDirect] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateDemand({
      title,
      description,
      typeRemuneration,
      montant: typeRemuneration === "payant" ? montant : 0,
      superficie,
      lieu,
      dateDebut,
      dateFin,
      conditions,
      contactType,
      contactValue: phoneWhatsApp || phoneDirect || contactValue || "En ligne",
      phoneWhatsApp,
      phoneDirect,
    });
    // Reset form
    setTitle("");
    setDescription("");
    setTypeRemuneration("gratuit");
    setMontant(0);
    setSuperficie("");
    setLieu("");
    setDateDebut("");
    setDateFin("");
    setConditions("");
    setContactType("whatsapp");
    setContactValue("");
    setPhoneWhatsApp("");
    setPhoneDirect("");
    setShowAddModal(false);
  };

  const handleApplySubmit = (e: React.FormEvent, demandId: string) => {
    e.preventDefault();
    if (!applyMessage.trim()) return;
    onApplyDemand(demandId, applyMessage);
    setApplyMessage("");
    setApplyingDemandId(null);
  };

  const getFilteredDemands = () => {
    let list = demands;
    if (selectedSolidarityId) {
      list = demands.filter((d) => d.id === selectedSolidarityId);
    } else if (filterType !== "toutes") {
      list = demands.filter((d) => d.typeRemuneration === filterType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => {
        return (
          d.title?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.lieu?.toLowerCase().includes(q) ||
          d.userName?.toLowerCase().includes(q)
        );
      });
    }
    return list;
  };

  const filteredDemands = getFilteredDemands();

  return (
    <div className="space-y-6">
      {/* Barre de Recherche Rapide */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-3xs flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-rose-600 animate-pulse" />
          <input
            type="text"
            placeholder="🔎 Recherche rapide dans l'entraide (ex: labour, tracteur, récolte, Savalou...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-rose-600/20 rounded-xl text-xs font-bold text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50 focus:bg-white"
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

      {/* ESPACE ENTRAIDE ET SOLIDARITÉ DESCRIPTION & PUBLICATION ACTION CARD */}
      <div className="p-5 bg-gradient-to-br from-[#0c1a11] to-[#040806] border border-[#27ae60]/20 rounded-2xl shadow-sm text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-[#2ece76] text-sm font-black uppercase tracking-wider flex items-center gap-1.5 font-display">
              🤝 Espace Entraide &amp; Solidarité Maraîchère
            </h2>
            <p className="text-zinc-300 text-xs leading-relaxed max-w-2xl font-semibold">
              Cet espace communautaire béninois favorise la coopération et l'aide mutuelle entre maraîchers et éleveurs. Publiez vos besoins de chantier collectif d'entraide agricole (récolte, labour, BRF), offres de service gracieux ou sollicitez un coup de main bénévole de vos voisins agriculteurs pour surmonter ensemble vos défis maraîchers.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold uppercase rounded-xl text-[10.5px] transition cursor-pointer tracking-wider active:scale-95 shadow-lg shadow-rose-600/10 shrink-0 self-stretch sm:self-auto text-center flex items-center justify-center gap-1.5"
          >
            <span>🤝 Publier une entraide</span>
          </button>
        </div>
      </div>

      {selectedSolidarityId && demands.some(d => d.id === selectedSolidarityId) && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🤝</span>
            <div>
              <p className="text-xs font-black text-rose-900 uppercase">Demande de Solidarité Sélectionnée</p>
              <p className="text-[11px] text-rose-700 font-medium font-sans">Vous visualisez l'annonce d'entraide sélectionnée directement depuis votre page d'accueil.</p>
            </div>
          </div>
          {onClearSelection && (
            <button 
              type="button"
              onClick={onClearSelection}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition shadow-xs"
            >
              Afficher toutes les demandes 🌐
            </button>
          )}
        </div>
      )}

      {/* Control Actions / Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
        <div className="flex gap-2">
          {(["toutes", "gratuit", "payant"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                filterType === t
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t === "toutes" ? "🔍 Tout" : t === "gratuit" ? "🤝 Entraide Gratuite" : "💰 Services Payants"}
            </button>
          ))}
        </div>
      </div>

      {/* Solidarity Listing grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDemands.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-2">
            <Heart className="h-10 w-10 text-rose-400 mx-auto animate-pulse" />
            <p className="text-sm font-bold text-slate-700">Aucune demande d'aide active à l'horizon.</p>
            <p className="text-xs text-slate-400">Pourquoi ne pas en publier une pour lancer l'élan de solidarité ?</p>
          </div>
        ) : (
          filteredDemands.map((demand) => {
            const isUserAdmin = user && (user.id === "usr_admin_jbz" || user.username.toLowerCase() === "jbz001" || user.email === "jbzounmatoun@gmail.com");
            const isOwner = demand.userId === user.id || isUserAdmin;
            const demandCandidatures = candidatures.filter((c) => c.demandeId === demand.id);

            if (editingDemandId === demand.id) {
              return (
                <div key={demand.id} className="bg-amber-50/50 rounded-2xl border border-amber-300 p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">✏️ Modifier la demande</span>
                    <button onClick={() => setEditingDemandId(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700">Annuler</button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Titre de l'entraide</label>
                      <input 
                        type="text" 
                        value={editTitle} 
                        onChange={e => setEditTitle(e.target.value)} 
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Description du besoin</label>
                      <textarea 
                        rows={3} 
                        value={editDescription} 
                        onChange={e => setEditDescription(e.target.value)} 
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Commune / Lieu</label>
                        <input 
                          type="text" 
                          value={editLieu} 
                          onChange={e => setEditLieu(e.target.value)} 
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Superficie</label>
                        <input 
                          type="text" 
                          value={editSuperficie} 
                          onChange={e => setEditSuperficie(e.target.value)} 
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Rémunération ou Bénévolat</label>
                      <select 
                        value={editTypeRemuneration} 
                        onChange={e => setEditTypeRemuneration(e.target.value as "gratuit" | "payant")} 
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-[11px]"
                      >
                        <option value="gratuit">🤝 Entraide Bénévole (Gratuit)</option>
                        <option value="payant">💰 Prestation Rémunérée (Budget)</option>
                      </select>
                    </div>

                    {editTypeRemuneration === "payant" && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Montant proposé (FCFA)</label>
                        <input 
                          type="number" 
                          value={editMontant} 
                          onChange={e => setEditMontant(Number(e.target.value))} 
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs" 
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Logistique / Conditions</label>
                      <input 
                        type="text" 
                        value={editConditions} 
                        onChange={e => setEditConditions(e.target.value)} 
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs" 
                      />
                    </div>
                    
                    <button
                      onClick={async () => {
                        if (onUpdateDemand) {
                          await onUpdateDemand(demand.id, {
                            title: editTitle,
                            description: editDescription,
                            lieu: editLieu,
                            superficie: editSuperficie,
                            conditions: editConditions,
                            typeRemuneration: editTypeRemuneration,
                            montant: editTypeRemuneration === "payant" ? editMontant : 0
                          });
                        }
                        setEditingDemandId(null);
                      }}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs tracking-wider transition uppercase"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={demand.id}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                {/* Header card info */}
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase font-mono font-black tracking-widest rounded leading-none ${
                        demand.typeRemuneration === "payant"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-rose-100 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {demand.typeRemuneration === "payant" ? "💰 Prestation rémunérée" : "🤝 Entraide Bénévole"}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded leading-none ${
                        demand.statut === "terminee"
                          ? "bg-slate-100 text-slate-500"
                          : "bg-emerald-100 text-emerald-800 animate-pulse"
                      }`}
                    >
                      {demand.statut === "terminee" ? "🔴 Clôturée" : "🟢 Active"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{demand.title}</h3>
                    <p className="text-[10px] text-rose-600 font-bold uppercase mt-1">Publié par @{demand.userName}</p>
                    <p className="text-xs text-slate-600 mt-2 whitespace-pre-line leading-relaxed">{demand.description}</p>
                  </div>

                  {/* Criteria Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="truncate">{demand.lieu}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="truncate">Du {demand.dateDebut} au {demand.dateFin}</span>
                    </div>
                    {demand.superficie && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-rose-600 font-bold">📏</span>
                        <span className="truncate">{demand.superficie}</span>
                      </div>
                    )}
                    {demand.typeRemuneration === "payant" && (
                      <div className="flex items-center gap-1.5 font-bold text-amber-700">
                        <DollarSign className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>{demand.montant.toLocaleString()} FCFA</span>
                      </div>
                    )}
                  </div>

                  {demand.conditions && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10.5px] text-slate-500">
                      <span className="font-bold text-rose-700 block mb-0.5">⚠️ Logistique &amp; Conditions :</span>
                      {demand.conditions}
                    </div>
                  )}
                </div>

                {/* Footer buttons / applications */}
                <div className="bg-slate-50 px-5 py-4 border-t border-slate-100 space-y-4">
                  {/* Candidates count banner */}
                  {demandCandidatures.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        📈 Réponses reçues : ({demandCandidatures.length})
                      </p>
                      <div className="space-y-1 max-h-[120px] overflow-y-auto">
                        {demandCandidatures.map((cand) => (
                          <div key={cand.id} className="bg-white p-2 rounded-lg border border-slate-200/60 text-xs">
                            <div className="flex justify-between font-bold text-rose-700 mb-0.5">
                              <span>@{cand.userName}</span>
                              <span className="text-[9px] text-slate-400">{new Date(cand.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-snug">{cand.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    {demand.statut === "ouverte" ? (
                      isOwner ? (
                        <div className="flex flex-col gap-2 w-full">
                          <button
                            onClick={() => onCloseDemand(demand.id)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition uppercase tracking-wider text-center cursor-pointer"
                          >
                            Clôturer l'offre d'aide (Prendre fin)
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingDemandId(demand.id);
                                setEditTitle(demand.title);
                                setEditDescription(demand.description);
                                setEditLieu(demand.lieu);
                                setEditSuperficie(demand.superficie || "");
                                setEditConditions(demand.conditions || "");
                                setEditTypeRemuneration(demand.typeRemuneration);
                                setEditMontant(demand.montant || 0);
                              }}
                              className="flex-1 py-1 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] transition uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              ✏️ Modifier
                            </button>
                            {onDeleteDemand && (
                              <button
                                onClick={() => {
                                  if (confirm("Voulez-vous vraiment supprimer cette demande d'entraide définitivement ?")) {
                                    onDeleteDemand(demand.id);
                                  }
                                }}
                                className="flex-1 py-1 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] transition uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                🗑️ Supprimer
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Apply directly */}
                          {applyingDemandId === demand.id ? (
                            <form onSubmit={(e) => handleApplySubmit(e, demand.id)} className="w-full space-y-2">
                              <textarea
                                required
                                rows={2}
                                placeholder="Proposez gentiment vos bras, donnez vos disponibilités et précisez les conditions..."
                                className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs focus:ring-rose-500 focus:border-rose-500"
                                value={applyMessage}
                                onChange={(e) => setApplyMessage(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1"
                                >
                                  <Send className="h-3 w-3" />
                                  <span>Envoyer la proposition</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setApplyingDemandId(null)}
                                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold uppercase transition"
                                >
                                  Annuler
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button
                              onClick={() => setApplyingDemandId(demand.id)}
                              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 uppercase tracking-wide cursor-pointer flex-1"
                            >
                              <Handshake className="h-4 w-4 text-rose-100" />
                              <span>Soutenir ce producteur</span>
                            </button>
                          )}

                          {/* Contact block - Show WhatsApp, Phone, Chat, and Share simultaneously for everyone as requested */}
                          <div className="w-full space-y-2 pt-2 border-t border-slate-100">
                            <div className="grid grid-cols-3 gap-2">
                              {/* WhatsApp */}
                              <a
                                href={`https://wa.me/${(demand.phoneWhatsApp || demand.contactValue || "").replace(/[\s+-]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-[10px] font-black transition flex flex-col items-center justify-center gap-1 border border-emerald-100"
                                title="Discuter directement sur WhatsApp"
                              >
                                <span className="text-xs">🟢</span>
                                <span>WhatsApp</span>
                              </a>

                              {/* GSM direct call */}
                              <a
                                href={`tel:${demand.phoneDirect || demand.contactValue || ""}`}
                                className="py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-[10px] font-black transition flex flex-col items-center justify-center gap-1 border border-blue-100 animate-pulse"
                                title="Appeler directement par appel cellulaire"
                              >
                                <span className="text-xs">📞</span>
                                <span>Téléphone</span>
                              </a>

                              {/* AgriChat internal inbox */}
                              <button
                                onClick={() => onContactViaChat(demand.userName, demand.phoneDirect || demand.contactValue, demand.title)}
                                className="py-2 bg-indigo-50 hover:bg-indigo-650 text-indigo-700 hover:text-white rounded-xl text-[10px] font-black transition flex flex-col items-center justify-center gap-1 border border-indigo-100 cursor-pointer"
                                title="Contacter par messagerie interne AgriChat"
                              >
                                <span className="text-xs">💬</span>
                                <span>AgriChat</span>
                              </button>
                            </div>

                            {/* Share block */}
                            <button
                              onClick={() => handleShareClick(demand)}
                              className="w-full py-2 bg-slate-50 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-xs"
                              title="Partager à d'autres réseaux ou applications"
                            >
                              <Share2 className="h-3.5 w-3.5 text-rose-500" />
                              <span>Partager l'Annonce d'Entraide</span>
                            </button>
                          </div>
                        </>
                      )
                    ) : (
                      <div className="w-full text-center py-1.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-mono uppercase tracking-widest font-extrabold flex justify-center items-center gap-1">
                        <span>❌ TÂCHE ENTRAIDE TERMINÉE</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-50 overflow-hidden transform animate-zoom-in my-8 max-h-[90vh] flex flex-col justify-between">
            {/* Header */}
            <div className="bg-rose-650 px-6 py-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5" />
                <h3 className="text-lg font-bold font-display">Nouvelle Demande d'Entraide</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white hover:text-rose-200 transition text-sm p-1"
              >
                ➔ Fermer
              </button>
            </div>

            {/* Scrollable container for Form content */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Titre de la tâche</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sarclage de 3 hectares à Kétou"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Description détaillée (Que faire ?)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Expliquez en détail l'aide dont vous avez besoin, les tacles prioritaires, la difficulté, etc."
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Type d'engagement</label>
                  <select
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                    value={typeRemuneration}
                    onChange={(e) => setTypeRemuneration(e.target.value as any)}
                  >
                    <option value="gratuit">🤝 Entraide Bénévole</option>
                    <option value="payant">💰 Prestation Payante</option>
                  </select>
                </div>

                {typeRemuneration === "payant" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Budget / Indemnité (FCFA)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      placeholder="Indemnité totale en FCFA"
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                      value={montant}
                      onChange={(e) => setMontant(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Superficie / Volume</label>
                  <input
                    type="text"
                    placeholder="Ex: 2 hectares / 5 paniers"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                    value={superficie}
                    onChange={(e) => setSuperficie(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Lieu exact (Commune)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Adjohoun, Dangbo"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                    value={lieu}
                    onChange={(e) => setLieu(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Date Début prévue</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Date Échéance / Fin</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Logistique / Prise en charge</label>
                <input
                  type="text"
                  placeholder="Ex: Déjeuner chaud offert le midi, logement disponible dans la case"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">💬 Numéro WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: +22961443262"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500 font-mono"
                    value={phoneWhatsApp}
                    onChange={(e) => setPhoneWhatsApp(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">📞 Numéro Direct (Appels) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: +22901614432"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-rose-500 font-mono"
                    value={phoneDirect}
                    onChange={(e) => setPhoneDirect(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition uppercase tracking-wider block shrink-0 cursor-pointer text-center"
              >
                Créer &amp; Partager la Demande d'Entraide
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SOLIDARITY SHARING MODAL DESIGN with local details */}
      {sharingDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-scale-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Share2 className="h-5 w-5 text-rose-600 animate-pulse" />
                  <span>Partager la Demande d'Entraide</span>
                </h3>
                <p className="text-[11px] text-slate-500">Sélectionnez le réseau social pour diffuser l'appel à la communauté :</p>
              </div>
              <button
                onClick={() => setSharingDemand(null)}
                className="text-slate-400 hover:text-rose-650 font-bold text-xs"
              >
                ✕ Fermer
              </button>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl">
              <p className="text-[11.5px] font-black text-rose-950 block tracking-tight">📌 {sharingDemand.title}</p>
              <p className="text-[10px] text-zinc-600 mt-1 font-mono">Lieu: {sharingDemand.lieu} · Rémunération: {sharingDemand.typeRemuneration === "payant" ? `${sharingDemand.montant.toLocaleString()} FCFA` : "Entraide"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* WhatsApp Share Button */}
              <button
                onClick={() => {
                  const shareText = `🤝 DEMANDE D'ENTRAIDE SOLIDAIRE (AGRIBOT BÉNIN) 🤝\n\n📌 Besoin : ${sharingDemand.title}\n📍 Commune : ${sharingDemand.lieu}\n🗓️ Durée : Du ${sharingDemand.dateDebut} au ${sharingDemand.dateFin}\n💰 Type : ${sharingDemand.typeRemuneration === "payant" ? `${sharingDemand.montant.toLocaleString()} FCFA` : "Entraide Bénévole"}\n⚠️ Conditions : ${sharingDemand.conditions || "Non spécifiées"}\n\nRejoignez AgriBot Mine d'Or, la plateforme souveraine du monde rural béninois : ${window.location.origin}`;
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
                  const shareText = `🤝 DEMANDE D'ENTRAIDE SOLIDAIRE (AGRIBOT BÉNIN) 🤝\n\n📌 Besoin : ${sharingDemand.title}\n📍 Commune : ${sharingDemand.lieu}\n🗓️ Durée : Du ${sharingDemand.dateDebut} au ${sharingDemand.dateFin}\n💰 Type : ${sharingDemand.typeRemuneration === "payant" ? `${sharingDemand.montant.toLocaleString()} FCFA` : "Entraide Bénévole"}\n⚠️ Conditions : ${sharingDemand.conditions || "Non spécifiées"}\n\nRejoignez AgriBot : ${window.location.origin}`;
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
                  const shareText = `🤝 DEMANDE D'ENTRAIDE SOLIDAIRE : ${sharingDemand.title} à ${sharingDemand.lieu}`;
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
                  const shareText = `🤝 Besoin d'entraide agricole au Bénin: ${sharingDemand.title} (${sharingDemand.lieu}) via @AgriBotBénin ${window.location.origin}`;
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
                const shareText = `🤝 DEMANDE D'ENTRAIDE SOLIDAIRE (AGRIBOT BÉNIN) 🤝\n\n📌 Besoin : ${sharingDemand.title}\n📍 Commune : ${sharingDemand.lieu}\n🗓️ Durée : Du ${sharingDemand.dateDebut} au ${sharingDemand.dateFin}\n💰 Type : ${sharingDemand.typeRemuneration === "payant" ? `${sharingDemand.montant.toLocaleString()} FCFA` : "Entraide Bénévole"}\n⚠️ Conditions : ${sharingDemand.conditions || "Non spécifiées"}\n\nRejoignez AgriBot Mine d'Or, la plateforme souveraine du monde rural béninois : ${window.location.origin}`;
                if (navigator.share) {
                  navigator.share({
                    title: "Solidarité AgriBot Bénin",
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
              <Share2 className="h-4 w-4 text-rose-600" />
              <span>{copiedLink ? "✓ Copié dans le presse-papier !" : "📲 Autres applications ou Copier le texte"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
