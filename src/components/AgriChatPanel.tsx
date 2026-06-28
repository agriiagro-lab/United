import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, Users, HeartHandshake, ShoppingBag, Eye, Send, 
  Image as ImageIcon, MapPin, Phone, MessageCircle, MoreVertical, 
  Search, Check, CheckCheck, Trash2, ShieldAlert, ArrowLeft, Video 
} from "lucide-react";

interface ForumMsg {
  id: string;
  senderName: string;
  avatar: string;
  role: "SYSTEM" | "FERMIER";
  time: string;
  text: string;
  photo?: string;
  likes: number;
  liked?: boolean;
  replyTo?: {
    name: string;
    text: string;
  };
}

interface PrivateContact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastMessage: string;
  unreadCount: number;
  time: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}

interface PrivateMsg {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  photo?: string;
  read?: boolean;
  replyTo?: {
    name: string;
    text: string;
  };
}

interface AgriChatPanelProps {
  onBack?: () => void;
  initialContactId?: string;
  initialContactName?: string;
  initialInput?: string;
  onNavigateToMarket?: (productId: string, interestedUser?: { id: string; username: string }) => void;
}

export default function AgriChatPanel({ onBack, initialContactId, initialContactName, initialInput, onNavigateToMarket }: AgriChatPanelProps) {
  const [activeTab, setActiveTab] = useState<"forum" | "inbox" | "groups">("inbox");
  
  // Get active user from localStorage to allow real database profile synchronization
  const activeUser = (() => {
    try {
      const raw = localStorage.getItem("agribot_active_user");
      return raw ? JSON.parse(raw) : { id: "usr_visitor", username: "visiteur", firstName: "Agro", lastName: "Visiteur" };
    } catch {
      return { id: "usr_visitor", username: "visiteur", firstName: "Agro", lastName: "Visiteur" };
    }
  })();

  // ==================== EDIT & DELETE & REPLY STATES ====================
  const [editingForumId, setEditingForumId] = useState<string | null>(null);
  const [editingForumText, setEditingForumText] = useState("");
  const [editingPrivateId, setEditingPrivateId] = useState<string | null>(null);
  const [editingPrivateText, setEditingPrivateText] = useState("");

  // ==================== FORUM STATE ====================
  const [forumMessages, setForumMessages] = useState<ForumMsg[]>([]);
  const [forumInput, setForumInput] = useState("");
  const [forumReplyTo, setForumReplyTo] = useState<{ id: string; name: string; text: string } | null>(null);
  const [forumPhoto, setForumPhoto] = useState<string | null>(null);

  // ==================== INBOX STATE ====================
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<PrivateContact | null>(null);
  const [privateInput, setPrivateInput] = useState("");
  const [privateReplyTo, setPrivateReplyTo] = useState<{ name: string; text: string } | null>(null);
  const [privatePhoto, setPrivatePhoto] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Keep track of messages sent in this session that we transition to "read" (blue tick mark simulation)
  const [sessionReadMessageIds, setSessionReadMessageIds] = useState<Set<string>>(new Set());

  // Initialize and select contact if passed in via routing
  useEffect(() => {
    if (initialContactId) {
      setActiveTab("inbox");
      setContacts(prev => {
        const existing = prev.find(c => 
          c.id === initialContactId || 
          (initialContactId === "usr_admin_jbz" && (c.id === "contact-1" || c.username === "jbz001"))
        );
        if (existing) {
          setSelectedContact(existing);
          return prev;
        } else {
          const newContact: PrivateContact = {
            id: initialContactId,
            name: initialContactName || "Administrateur principal",
            avatar: initialContactId === "usr_admin_jbz" ? "👨🏾" : "🌱",
            status: "En ligne",
            lastMessage: "Discussion privée initiée...",
            unreadCount: 0,
            time: "Maintenant"
          };
          setSelectedContact(newContact);
          return [newContact, ...prev];
        }
      });
      if (initialInput) {
        setPrivateInput(initialInput);
      }
    }
  }, [initialContactId, initialContactName, initialInput]);

  // Load real chat contacts from the database
  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.users)) {
          setContacts(prev => {
            const merged = [...prev];
            data.users.forEach((u: any) => {
              // Ensure we do not add ourselves to the chat contacts list
              if (u.id === activeUser.id || (u.username && u.username.toLowerCase() === activeUser.username?.toLowerCase())) {
                return;
              }
              const alreadyExists = merged.some(c => 
                c.id === u.id || 
                (u.email && c.email === u.email) ||
                (u.username && c.username?.toLowerCase() === u.username.toLowerCase())
              );
              if (!alreadyExists) {
                merged.push({
                  id: u.id,
                  name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username || "Adhérent AgriBot",
                  firstName: u.firstName || "",
                  lastName: u.lastName || "",
                  email: u.email || "",
                  username: u.username || "",
                  avatar: u.id === "usr_admin_jbz" ? "👨🏾" : "🌱",
                  status: u.isPremium ? "Membre Premium ⭐" : "Agronome Inscrit",
                  lastMessage: "Cliquez pour démarrer la discussion privée sécurisée...",
                  unreadCount: 0,
                  time: "Inscrit"
                });
              }
            });
            return merged;
          });
        }
      })
      .catch(err => console.warn("Failed to load real users for chat:", err));
  }, []);

  const [contacts, setContacts] = useState<PrivateContact[]>([]);
  const [conversations, setConversations] = useState<Record<string, PrivateMsg[]>>({});

  const forumEndRef = useRef<HTMLDivElement>(null);
  const privateEndRef = useRef<HTMLDivElement>(null);

  // Synchronize and load messages from the database
  const syncAndLoadMessages = () => {
    fetch("/api/db-state")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.messages)) {
          // 1. Map forum messages (isPrivate === false)
          const forumMsgs: ForumMsg[] = data.messages
            .filter((m: any) => !m.isPrivate)
            .map((m: any) => {
              const isSystem = m.senderId === "system";
              return {
                id: m.id,
                senderName: m.senderName,
                avatar: isSystem ? "🤖" : (m.senderId === activeUser.id ? "😊" : "🌱"),
                role: isSystem ? "SYSTEM" : "FERMIER",
                time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "À l'instant",
                text: m.content || "",
                photo: m.photoAttachment || undefined,
                likes: m.likes || 0,
                liked: Array.isArray(m.likedBy) ? m.likedBy.includes(activeUser.id) : false,
                replyTo: m.replyToContent ? { name: m.replyToSenderName || "Fermier", text: m.replyToContent } : undefined
              };
            });
          setForumMessages(forumMsgs);

          // 2. Map private messages (isPrivate === true)
          const privateMsgs = data.messages.filter((m: any) => m.isPrivate);
          const convMap: Record<string, PrivateMsg[]> = {};

          privateMsgs.forEach((m: any) => {
            // Check if this message involves the active user
            if (m.senderId === activeUser.id || m.recipientId === activeUser.id) {
              const contactId = m.senderId === activeUser.id ? m.recipientId : m.senderId;
              if (!contactId) return;

              if (!convMap[contactId]) {
                convMap[contactId] = [];
              }

              convMap[contactId].push({
                id: m.id,
                sender: m.senderId === activeUser.id ? "me" : "them",
                text: m.content || "",
                time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "À l'instant",
                photo: m.photoAttachment || undefined,
                read: (m.readBy && m.readBy.some((uid: string) => uid !== m.senderId)) || sessionReadMessageIds.has(m.id),
                replyTo: m.replyToContent ? { name: m.replyToSenderName || "Fermier", text: m.replyToContent } : undefined
              });
            }
          });

          // Sort each private conversation by ID chronological safely
          Object.keys(convMap).forEach(key => {
            convMap[key].sort((a, b) => a.id.localeCompare(b.id));
          });

          setConversations(convMap);
        }
      })
      .catch(err => console.warn("Error synchronizing chat database:", err));
  };

  // Main lifecycle for polling sync and clean up of local cached messages
  useEffect(() => {
    // Standard clear of localStorage chat caches to satisfy complete cleanup "sans exception"
    localStorage.removeItem("agribot_local_messages");

    syncAndLoadMessages();
    const interval = setInterval(syncAndLoadMessages, 4000); // Polling every 4s for direct live feel
    return () => clearInterval(interval);
  }, [sessionReadMessageIds]);

  // Handlers for deleting and editing messages in real database
  const handleDeletePrivateMsg = (msgId: string) => {
    fetch(`/api/chat/message/${msgId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: activeUser.id })
    })
    .then(() => syncAndLoadMessages())
    .catch(err => console.warn("Error deleting message:", err));
  };

  const handleSaveEditPrivateMsg = (msgId: string, newText: string) => {
    fetch(`/api/chat/message/${msgId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: activeUser.id, content: newText })
    })
    .then(() => syncAndLoadMessages())
    .catch(err => console.warn("Error saving edited message:", err));
  };

  const handleDeleteForumMsg = (msgId: string) => {
    fetch(`/api/chat/message/${msgId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: activeUser.id })
    })
    .then(() => syncAndLoadMessages())
    .catch(err => console.warn("Error deleting forum message:", err));
  };

  const handleSaveEditForumMsg = (msgId: string, newText: string) => {
    fetch(`/api/chat/message/${msgId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: activeUser.id, content: newText })
    })
    .then(() => syncAndLoadMessages())
    .catch(err => console.warn("Error saving edited forum message:", err));
  };

  // Auto scroll to bottoms
  useEffect(() => {
    if (activeTab === "forum") {
      forumEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [forumMessages, activeTab]);

  useEffect(() => {
    if (selectedContact) {
      privateEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedContact, conversations, isTyping]);

  const handleToggleLike = (id: string) => {
    setForumMessages(prev =>
      prev.map(msg => {
        if (msg.id === id) {
          const liked = !msg.liked;
          return {
            ...msg,
            liked,
            likes: msg.likes + (liked ? 1 : -1)
          };
        }
        return msg;
      })
    );
  };

  const handleSendForum = () => {
    if (!forumInput.trim() && !forumPhoto) return;

    const payload = {
      senderId: activeUser.id,
      senderName: `@${activeUser.username || "Adhérent"}${activeUser.firstName ? " (" + activeUser.firstName + ")" : ""}`,
      content: forumInput,
      isPrivate: false,
      replyToContent: forumReplyTo ? forumReplyTo.text : undefined,
      replyToSenderName: forumReplyTo ? forumReplyTo.name : undefined,
      photoAttachment: forumPhoto || undefined
    };

    fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      syncAndLoadMessages();
    })
    .catch(err => console.warn("Error sending forum message:", err));

    setForumInput("");
    setForumReplyTo(null);
    setForumPhoto(null);
  };

  const handleForumPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForumPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenContact = (contact: PrivateContact) => {
    setSelectedContact(contact);
    // Mark as read
    setContacts(prev =>
      prev.map(c => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendPrivate = () => {
    if (!privateInput.trim() && !privatePhoto && !selectedContact) return;

    const contactId = selectedContact!.id;
    const payload = {
      senderId: activeUser.id,
      senderName: `@${activeUser.username || "Adhérent"}${activeUser.firstName ? " (" + activeUser.firstName + ")" : ""}`,
      content: privateInput,
      isPrivate: true,
      recipientId: contactId,
      recipientName: selectedContact!.name,
      replyToContent: privateReplyTo ? privateReplyTo.text : undefined,
      replyToSenderName: privateReplyTo ? privateReplyTo.name : undefined,
      photoAttachment: privatePhoto || undefined
    };

    fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then((data) => {
      syncAndLoadMessages();
      if (data && data.success && data.message) {
        const msgId = data.message.id;
        // If recipient is "En ligne", show double check green, then transition to blue "read" mark after 2.5s!
        if (selectedContact.status?.toLowerCase().includes("ligne") || selectedContact.status?.toLowerCase().includes("premium") || selectedContact.status?.toLowerCase().includes("agronome")) {
          setTimeout(() => {
            setSessionReadMessageIds(prev => {
              const next = new Set(prev);
              next.add(msgId);
              return next;
            });
          }, 2500);
        }
      }
      
      // Simulate live typing indicator response from target recipient contact!
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 3500);
    })
    .catch(err => console.warn("Error sending private message:", err));

    setPrivateInput("");
    setPrivateReplyTo(null);
    setPrivatePhoto(null);
  };

  const handlePrivatePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPrivatePhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const fieldsToSearch = [
      c.name,
      c.firstName,
      c.lastName,
      c.email,
      c.username,
      c.id
    ];
    return fieldsToSearch.some((f) => f && f.toLowerCase().includes(query));
  });

  return (
    <div 
      className="w-full flex flex-col rounded-none sm:rounded-3xl overflow-hidden border-t border-b sm:border border-x-0 sm:border-x font-sans relative h-[calc(100vh-176px)] h-[calc(100dvh-176px)] sm:h-[650px] min-h-[420px]" 
      style={{
        backgroundColor: "#0a0f0d", 
        borderColor: "rgba(39, 174, 96, 0.14)"
      }}
    >
      {/* ── HEADER ── */}
      <header 
        className="flex items-center gap-2.5 p-3 flex-shrink-0 text-left"
        style={{ backgroundColor: "#111a14", borderBottom: "1px solid rgba(39, 174, 96, 0.14)" }}
      >
        {selectedContact ? (
          <button 
            onClick={() => setSelectedContact(null)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition hover:bg-[#1e2d18]"
            style={{ 
              backgroundColor: "#172110", 
              border: "1px solid rgba(39, 174, 96, 0.14)",
              color: "#e8f5ec"
            }}
          >
            <ArrowLeft className="w-4 h-4 text-[#2ece76]" />
          </button>
        ) : (
          onBack && (
            <button 
              onClick={onBack}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition hover:bg-[#1e2d18]"
              style={{ 
                backgroundColor: "#172110", 
                border: "1px solid rgba(39, 174, 96, 0.14)",
                color: "#e8f5ec"
              }}
            >
              <ArrowLeft className="w-4 h-4 text-[#2ece76]" />
            </button>
          )
        )}
        <div 
          className="w-9" 
          style={{
            width: "38px", height: "38px", borderRadius: "13px",
            background: "linear-gradient(135deg, #0a3d20, #1a8c4e)",
            border: "2px solid #27ae60",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "19px", boxShadow: "0 0 12px rgba(46, 204, 113, 0.2)",
            flexShrink: 0
          }}
        >
          {selectedContact ? selectedContact.avatar : "💬"}
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="font-sora font-extrabold text-[14px] xs:text-[15px] truncate" style={{ color: "#e8f5ec" }}>
            {selectedContact ? selectedContact.name : "AgriChat"}
          </div>
          <div className="text-[11px] flex items-center gap-1.5 mt-0.5" style={{ color: "#6b9a78" }}>
            <span 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: "#2ecc71", animation: "pulse 2s ease infinite" }}
            />
            <span className="truncate">
              {selectedContact ? selectedContact.status : "5 agriculteurs actifs"}
            </span>
          </div>
        </div>
      </header>

      {/* ── TABS (Only shown when not inside an active private contact conversation overlay) ── */}
      {!selectedContact && (
        <div className="flex flex-shrink-0" style={{ backgroundColor: "#111a14", borderBottom: "1px solid rgba(39, 174, 96, 0.14)" }}>
          <button 
            onClick={() => setActiveTab("forum")}
            className="flex-1 py-2.5 text-center text-[11.5px] xs:text-[12.5px] font-bold cursor-pointer transition-all duration-150 flex items-center justify-center gap-1.5"
            style={{ 
              color: activeTab === "forum" ? "#2ecc71" : "#6b9a78",
              borderBottom: activeTab === "forum" ? "2px solid #2ecc71" : "2px solid transparent"
            }}
          >
            👥 DISCUSSIONS DE GROUPE (Forum)
          </button>
          <button 
            onClick={() => setActiveTab("inbox")}
            className="flex-1 py-2.5 text-center text-[12.5px] font-bold cursor-pointer transition-all duration-150 flex items-center justify-center gap-1.5"
            style={{ 
              color: activeTab === "inbox" ? "#2ecc71" : "#6b9a78",
              borderBottom: activeTab === "inbox" ? "2px solid #2ecc71" : "2px solid transparent"
            }}
          >
            💌 Inbox Privé
            <span 
              className="rounded-full flex items-center justify-center font-bold text-white text-[9px]"
              style={{
                backgroundColor: "#e74c3c",
                padding: "1px 5px",
                minWidth: "16px",
                textAlign: "center"
              }}
            >
              2
            </span>
          </button>
        </div>
      )}

      {/* ════ PANEL FORUM ════ */}
      {activeTab === "forum" && !selectedContact && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none" id="forum-feed">
            {forumMessages.map((msg, index) => (
              <div 
                key={msg.id} 
                className="p-3 text-left transition hover:bg-emerald-950/5"
                style={{ 
                  backgroundColor: "#172110", 
                  border: "1px solid rgba(39, 174, 96, 0.14)",
                  borderRadius: "4px 16px 16px 16px"
                }}
              >
                {/* Header info */}
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8.5 h-8.5 rounded-xl border flex items-center justify-center text-lg shrink-0"
                    style={{ 
                      width: "34px", height: "34px", 
                      borderColor: "rgba(39, 174, 96, 0.28)", 
                      backgroundColor: "#1e2d18" 
                    }}
                  >
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sora font-bold text-[12.5px]" style={{ color: "#e8f5ec" }}>
                      {msg.senderName.includes("Système") ? (
                        <span style={{ color: "#f0b429" }}>{msg.senderName}</span>
                      ) : (
                        msg.senderName
                      )}
                    </div>
                    <div className="text-[10px]" style={{ color: "#3d6b4a" }}>{msg.time}</div>
                  </div>
                  <span 
                    className="text-[9.5px] font-bold px-1.5 py-0.5 rounded shrink-0"
                    style={{ 
                      backgroundColor: msg.role === "SYSTEM" ? "rgba(240,180,41,0.12)" : "rgba(46,204,113,0.12)",
                      color: msg.role === "SYSTEM" ? "#f0b429" : "#2ecc71"
                    }}
                  >
                    {msg.role}
                  </span>
                </div>

                {/* Reply section if applicable */}
                {msg.replyTo && (
                  <div 
                    className="p-2.5 mb-2.5 rounded-r-lg"
                    style={{ backgroundColor: "#141f16", borderLeft: "3px solid #1a8c4e" }}
                  >
                    <div className="text-[11px] font-bold" style={{ color: "#2ecc71" }}>{msg.replyTo.name} a répondu :</div>
                    <div className="text-[12.5px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: "#6b9a78" }}>{msg.replyTo.text}</div>
                  </div>
                )}

                {/* Main message text */}
                <div className="text-[13.5px] leading-relaxed mb-2.5" style={{ color: "#e8f5ec" }}>
                  {editingForumId === msg.id ? (
                    <div className="flex flex-col gap-1.5 w-full mt-1 bg-[#121c15] p-2.5 rounded border border-emerald-550/20">
                      <textarea
                        value={editingForumText}
                        onChange={(e) => setEditingForumText(e.target.value)}
                        className="bg-[#172110] text-[#e8f5ec] text-xs p-2 rounded border border-emerald-500/30 outline-none resize-none w-full font-sans mb-1"
                        rows={3}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingForumId(null)}
                          className="text-[11px] bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded font-bold cursor-pointer transition hover:bg-zinc-750"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => {
                            handleSaveEditForumMsg(msg.id, editingForumText);
                            setEditingForumId(null);
                          }}
                          className="text-[11px] bg-[#27ae60] text-white px-3 py-1.5 rounded font-bold cursor-pointer transition hover:bg-emerald-500"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Photo attachment representation */}
                {msg.photo && (
                  <div 
                    className="rounded-lg overflow-hidden border flex items-center justify-center mb-2.5"
                    style={{ 
                      height: "180px", 
                      backgroundColor: "#1e2d18", 
                      borderColor: "rgba(39, 174, 96, 0.14)" 
                    }}
                  >
                    {msg.photo.startsWith("data:") ? (
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: msg.photo.replace("data:image/svg+xml;utf8,", "") }} />
                    ) : (
                      <img src={msg.photo} className="w-full h-full object-cover" alt="attachment" referrerPolicy="no-referrer" />
                    )}
                  </div>
                )}

                {/* Actions bottom */}
                <div className="flex items-center gap-2 pt-2 animate-fade-in" style={{ borderTop: "1px solid rgba(39, 174, 96, 0.14)" }}>
                  <button 
                    onClick={() => handleToggleLike(msg.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer py-1 px-2.5 rounded transition hover:bg-[#1e2d18]"
                    style={{ color: msg.liked ? "#2ecc71" : "#6b9a78" }}
                  >
                    👍 <span>{msg.likes}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setForumReplyTo({
                        id: msg.id,
                        name: msg.senderName,
                        text: msg.text
                      });
                    }}
                    className="flex items-center gap-1 text-[12px] font-semibold cursor-pointer py-1 px-2.5 rounded transition hover:bg-[#1e2d18]"
                    style={{ color: "#6b9a78" }}
                  >
                    💬 Répondre
                  </button>

                  {/* Edit and Delete options for our own forum messages */}
                  {(msg.senderName.includes("(Vous)") || msg.senderName === "@Jbz001 (Vous)") && (
                    <div className="flex items-center gap-1.5 ml-1.5 border-l border-emerald-950 pl-2">
                      <button 
                        onClick={() => {
                          setEditingForumId(msg.id);
                          setEditingForumText(msg.text);
                        }}
                        className="text-[11px] font-semibold flex items-center gap-1 py-1 px-2 text-amber-400 hover:bg-[#1e2d18] rounded cursor-pointer transition"
                        title="Modifier mon message"
                      >
                        ✍️ Modifier
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Supprimer ce message de la communauté ?")) {
                            handleDeleteForumMsg(msg.id);
                          }
                        }}
                        className="text-[11px] font-semibold flex items-center gap-1 py-1 px-2 text-rose-400 hover:bg-rose-950/20 rounded cursor-pointer transition"
                        title="Supprimer mon message"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  )}

                  <button 
                    onClick={() => alert("Publication signalée à l'administrateur.")}
                    className="ml-auto flex items-center gap-1 text-[11px] cursor-pointer py-1 px-2.5 rounded transition hover:bg-rose-950/20"
                    style={{ color: "#3d6b4a" }}
                  >
                    ⚑ Signaler
                  </button>
                </div>
              </div>
            ))}
            <div ref={forumEndRef} />
          </div>

          {/* FORUM COMPOSER INPUT */}
          <div 
            className="p-2.5 shrink-0 text-left"
            style={{ backgroundColor: "#111a14", borderTop: "1px solid rgba(39, 174, 96, 0.14)" }}
          >
            {/* Reply Preview */}
            {forumReplyTo && (
              <div 
                className="flex items-center justify-between p-2 mb-2 rounded-r-lg border-l-3" 
                style={{ backgroundColor: "#172110", borderLeftColor: "#2ecc71" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold" style={{ color: "#2ecc71" }}>{forumReplyTo.name}</div>
                  <div className="text-[11.5px] truncate" style={{ color: "#6b9a78" }}>{forumReplyTo.text}</div>
                </div>
                <button className="text-sm px-2 cursor-pointer font-bold" style={{ color: "#3d6b4a" }} onClick={() => setForumReplyTo(null)}>✕</button>
              </div>
            )}

            {/* Photo Preview */}
            {forumPhoto && (
              <div className="relative w-fit mb-2">
                <img src={forumPhoto} className="w-16 h-16 rounded-lg object-cover border" style={{ borderColor: "rgba(39, 174, 96, 0.28)" }} alt="Upload preview" />
                <button className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer" onClick={() => setForumPhoto(null)}>✕</button>
              </div>
            )}

            {/* Main edit row */}
            <div className="flex items-end gap-2">
              <textarea 
                value={forumInput}
                onChange={(e) => setForumInput(e.target.value)}
                placeholder="Écrivez votre message…" 
                rows={1}
                className="flex-1 rounded-xl p-2.5 text-xs xs:text-sm border outline-none resize-none"
                style={{ 
                  backgroundColor: "#172110", 
                  borderColor: "rgba(39, 174, 96, 0.14)",
                  color: "#e8f5ec"
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendForum();
                  }
                }}
              />
              <div className="flex items-center gap-1.5">
                <label className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 cursor-pointer transition hover:bg-[#1e2d18]" style={{ backgroundColor: "#172110", border: "1px solid rgba(39, 174, 96, 0.14)" }}>
                  📷
                  <input type="file" accept="image/*" className="hidden" onChange={handleForumPhotoChange} />
                </label>
                <button 
                  onClick={handleSendForum}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white border-0 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #1a8c4e, #27ae60)", boxShadow: "0 4px 14px rgba(46, 204, 113, 0.3)" }}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ PANEL INBOX LIST ════ */}
      {activeTab === "inbox" && !selectedContact && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-2 bg-[#0a0f0d] shrink-0" style={{ borderBottom: "1px solid rgba(39, 174, 96, 0.14)" }}>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[14px]" style={{ color: "#3d6b4a" }}>🔍</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un contact/maraîcher…" 
                className="w-full rounded-xl py-2 pl-9 pr-4 text-xs font-semibold outline-none border transition"
                style={{ 
                  backgroundColor: "#172110", 
                  borderColor: "rgba(39, 174, 96, 0.14)",
                  color: "#e8f5ec"
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-none">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => handleOpenContact(contact)}
                className="flex items-center gap-3 p-3 cursor-pointer transition text-left duration-150"
                style={{ backgroundColor: "#0a0f0d", borderBottom: "1px solid rgba(39,174,96,0.14)" }}
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 relative"
                  style={{ backgroundColor: "#1e2d18", border: "2px solid rgba(39, 174, 96, 0.14)" }}
                >
                  {contact.avatar}
                  {contact.status.includes("ligne") && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#2ecc71] rounded-full border-2 border-[#0a0f0d]" />
                  )}
                  {contact.unreadCount > 0 && (
                    <div 
                      className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-black text-[9px] font-extrabold flex items-center justify-center border"
                      style={{ backgroundColor: "#2ecc71", borderColor: "#0a0f0d" }}
                    >
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sora font-bold text-[13.5px] truncate flex items-center gap-1.5 flex-wrap" style={{ color: "#e8f5ec" }}>
                    <span>{contact.name}</span>
                    {contact.username && (
                      <span className="text-[9px] bg-[#1e2d18] text-[#2ecc71] px-1.5 py-0.5 rounded-md font-mono font-black border border-[#143d22]">
                        @{contact.username}
                      </span>
                    )}
                  </div>
                  {contact.email && (
                    <div className="text-[9.5px] font-mono text-[#427a51] truncate">
                      {contact.email}
                    </div>
                  )}
                  <div className="text-[11.5px] truncate mt-0.5" style={{ color: "#6b9a78" }}>
                    {contact.lastMessage}
                  </div>
                </div>
                <div className="text-[10.5px] text-right shrink-0" style={{ color: "#3d6b4a" }}>
                  {contact.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ ACTIVE CONVERSATION SCREEN ════ */}
      {selectedContact && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0a0f0d]">
          <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-none" id="convo-msgs">
            {/* Removed Conseil & Echange badge to clear screen clutter per user request */}

            <div className="flex items-center gap-2 text-[10px] justify-center" style={{ color: "#3d6b4a" }}>
              <span>📅 21 Mai 2026</span>
            </div>

            {(conversations[selectedContact.id] || []).map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
              >
                <div 
                  className="p-2.5 max-w-[80%] text-[13.5px] leading-relaxed relative"
                  style={{
                    borderRadius: msg.sender === "me" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                    background: msg.sender === "me" ? "linear-gradient(135deg, #1a5c35, #1e6e3e)" : "#172110",
                    border: msg.sender === "me" ? "1px solid rgba(46, 204, 113, 0.22)" : "1px solid rgba(39, 174, 96, 0.14)",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.3)",
                    color: "#e8f5ec"
                  }}
                >
                  {/* Replied block inside message bubble */}
                  {msg.replyTo && (
                    <div className="p-1.5 mb-2 rounded border-l-3 text-[11px]" style={{ backgroundColor: "rgba(0, 0, 0, 0.25)", borderLeftColor: "#2ecc71" }}>
                      <div className="font-extrabold" style={{ color: "#2ecc71" }}>{msg.replyTo.name}</div>
                      <div style={{ color: "#6b9a78" }}>{msg.replyTo.text}</div>
                    </div>
                  )}

                  {/* Attachment block */}
                  {msg.photo && (
                    <div 
                      className="rounded-lg overflow-hidden border flex items-center justify-center mb-1.5"
                      style={{ 
                        height: "150px", 
                        width: "200px",
                        backgroundColor: "#1e2d18", 
                        borderColor: "rgba(39, 174, 96, 0.14)" 
                      }}
                    >
                      {msg.photo.startsWith("data:") ? (
                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: msg.photo.replace("data:image/svg+xml;utf8,", "") }} />
                      ) : (
                        <img src={msg.photo} className="w-full h-full object-cover" alt="Attachment" referrerPolicy="no-referrer" />
                      )}
                    </div>
                  )}

                  {editingPrivateId === msg.id ? (
                    <div className="flex flex-col gap-1.5 w-full mt-1 min-w-[180px]">
                      <textarea 
                        value={editingPrivateText}
                        onChange={(e) => setEditingPrivateText(e.target.value)}
                        className="bg-[#121c15] text-[#e8f5ec] text-xs p-1.5 rounded border border-emerald-500/30 outline-none resize-none w-full font-sans"
                        rows={2}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => setEditingPrivateId(null)}
                          className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-bold cursor-pointer transition"
                        >
                          Annuler
                        </button>
                        <button 
                          onClick={() => {
                            handleSaveEditPrivateMsg(msg.id, editingPrivateText);
                            setEditingPrivateId(null);
                          }}
                          className="text-[10px] bg-emerald-600 text-white px-2 py-1 rounded font-bold hover:bg-emerald-500 cursor-pointer transition"
                        >
                          Ok
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="whitespace-pre-line">{msg.text}</span>
                      {(() => {
                        const matchPub = msg.text.match(/\[ID-PUBLICATION:\s*([a-zA-Z0-9_\-]+)\]/);
                        if (matchPub) {
                          const prodId = matchPub[1];
                          const isMeJbz = activeUser?.id === "usr_admin_jbz" || activeUser?.username?.toLowerCase() === "jbz001" || activeUser?.username?.toLowerCase() === "coordonnateur";
                          return (
                            <div className="mt-2.5 pt-2 border-t border-emerald-900/30 flex flex-col gap-1.5">
                              <p className="text-[10px] text-zinc-400 font-mono">Index de la Marketplace : #{prodId}</p>
                              <button
                                onClick={() => {
                                  if (onNavigateToMarket) {
                                    onNavigateToMarket(prodId, { id: selectedContact.id, username: selectedContact.username || selectedContact.name });
                                  }
                                }}
                                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl text-[10.5px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition shadow-md w-full"
                              >
                                <ShoppingBag className="h-3.5 w-3.5 text-slate-950" />
                                <span>{isMeJbz ? "👉 Ouvrir & Coordonner la Vente" : "👁️ Revoir l'annonce originale"}</span>
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2.5 px-1 mt-1 text-[10.5px] select-none" style={{ color: "#3d6b4a" }}>
                  <span>{msg.time}</span>
                  {msg.sender === "me" && (
                    <>
                      {msg.read ? (
                        <span style={{ color: "#3498db" }} className="flex items-center" title="Lu (bleu)">
                          <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                        </span>
                      ) : (selectedContact.status?.toLowerCase().includes("ligne") || selectedContact.status?.toLowerCase().includes("premium") || selectedContact.status?.toLowerCase().includes("agronome")) ? (
                        <span style={{ color: "#2ecc71" }} className="flex items-center" title="Reçu (double coche verte)">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      ) : (
                        <span style={{ color: "#2ecc71" }} className="flex items-center" title="Envoyé (simple coche verte)">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Tag/Reply, Edit, Delete Controls */}
                  <div className="flex items-center gap-2 pl-1.5 border-l border-emerald-950">
                    <button
                      onClick={() => {
                        setPrivateReplyTo({
                          name: msg.sender === "me" ? "Vous" : selectedContact.name,
                          text: msg.text
                        });
                      }}
                      className="hover:text-emerald-400 text-[11px] cursor-pointer transition flex items-center gap-0.5"
                      title="Répondre (Taguer ce message)"
                    >
                      ↩️ Répondre
                    </button>

                    {msg.sender === "me" && (
                      <>
                        <button
                          onClick={() => {
                            setEditingPrivateId(msg.id);
                            setEditingPrivateText(msg.text);
                          }}
                          className="hover:text-amber-400 text-[11px] cursor-pointer transition"
                          title="Modifier mon message"
                        >
                          ✍️ Modifier
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Supprimer ce message ?")) {
                              handleDeletePrivateMsg(msg.id);
                            }
                          }}
                          className="hover:text-rose-400 text-[11px] cursor-pointer transition"
                          title="Supprimer mon message"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start">
                <div 
                  className="typing p-2.5 flex items-center gap-1 border shadow-md"
                  style={{
                    borderColor: "rgba(39, 174, 96, 0.14)",
                    backgroundColor: "#172110",
                    borderRadius: "4px 18px 18px 18px"
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-bounce delay-300" />
                </div>
                <span className="text-[9.5px] mt-1 pl-1" style={{ color: "#3d6b4a" }}>En attente de réponse...</span>
              </div>
            )}
            <div ref={privateEndRef} />
          </div>

          {/* PRIVATE COMPOSER BOTTOM INPUT */}
          <div 
            className="p-3 shrink-0 text-left"
            style={{ backgroundColor: "#111a14", borderTop: "1px solid rgba(39, 174, 96, 0.14)" }}
          >
            {/* Private custom quote reply */}
            {privateReplyTo && (
              <div 
                className="flex items-center justify-between p-2 mb-2 rounded-r-lg border-l-3" 
                style={{ backgroundColor: "#172110", borderLeftColor: "#2ecc71" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold" style={{ color: "#2ecc71" }}>{privateReplyTo.name}</div>
                  <div className="text-[11.5px] truncate" style={{ color: "#6b9a78" }}>{privateReplyTo.text}</div>
                </div>
                <button className="text-sm px-2 cursor-pointer font-bold" style={{ color: "#3d6b4a" }} onClick={() => setPrivateReplyTo(null)}>✕</button>
              </div>
            )}

            {privatePhoto && (
              <div className="relative w-fit mb-2">
                <img src={privatePhoto} className="w-16 h-16 rounded-lg object-cover border" style={{ borderColor: "rgba(39, 174, 96, 0.28)" }} alt="Attachment preview" />
                <button className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer" onClick={() => setPrivatePhoto(null)}>✕</button>
              </div>
            )}

            {/* Input fields */}
            <div className="flex items-end gap-2">
              <textarea 
                value={privateInput}
                onChange={(e) => setPrivateInput(e.target.value)}
                placeholder="Écrivez votre message…" 
                rows={1}
                className="flex-1 rounded-xl p-2.5 text-xs xs:text-sm border outline-none resize-none"
                style={{ 
                  backgroundColor: "#172110", 
                  borderColor: "rgba(39, 174, 96, 0.14)",
                  color: "#e8f5ec"
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrivate();
                  }
                }}
              />
              <div className="flex items-center gap-1.5">
                <label className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 cursor-pointer transition hover:bg-[#1e2d18]" style={{ backgroundColor: "#172110", border: "1px solid rgba(39, 174, 96, 0.14)" }}>
                  📷
                  <input type="file" accept="image/*" className="hidden" onChange={handlePrivatePhotoChange} />
                </label>
                <button 
                  onClick={handleSendPrivate}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white border-0 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #1a8c4e, #27ae60)", boxShadow: "0 4px 14px rgba(46, 204, 113, 0.3)" }}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
