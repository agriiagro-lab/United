import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Plus, 
  Check, 
  X, 
  Search, 
  ArrowLeft, 
  Send,
  Sparkles,
  User,
  ExternalLink,
  ChevronRight,
  Tv,
  Trash2,
  FolderPlus,
  Compass,
  Volume2,
  VolumeX,
  Inbox as InboxIcon,
  HelpCircle,
  Clock,
  ThumbsUp,
  Sliders,
  AlertOctagon,
  Eye,
  Camera,
  Bookmark,
  Play
} from "lucide-react";
import { User as UserType } from "../types";
import VideoModal from "./VideoModal";
import { parseVideoUrl } from "../utils/videoHelper";

interface CommentItem {
  av: string;
  u: string;
  t: string;
  time: string;
  likes: number;
}

interface VideoItem {
  id: number;
  type: 'yt' | 'native' | 'fb';
  ytId?: string;
  nativeUrl?: string;
  fbUrl?: string;
  creator: string;
  cname: string;
  av: string;
  verified: boolean;
  bio: string;
  desc: string;
  tags: string[];
  likes: number;
  likesFmt: string;
  comments: number;
  commentsFmt: string;
  shares: string;
  music: string;
  bg: string;
  emoji: string;
  badge: { ico: string; lbl: string; cl: string } | null;
  tag: { lbl: string; cl: string; bg: string };
  stats: { abos: string; vidéos: string; likes: string };
  thumbs: string[];
  comments_data: CommentItem[];
  stepsNum?: number;
  durationMin?: number;
  levelStr?: string;
}

interface AgriVideosPanelProps {
  user: UserType | null;
  isUserJbz: boolean;
  hasCv?: boolean;
  onBack: () => void;
  onRegisterCv?: (newCv: any) => void;
}

function fmtNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export default function AgriVideosPanel({ user, isUserJbz, hasCv = false, onBack, onRegisterCv }: AgriVideosPanelProps) {
  // Static agricultural videos inspired by Benin's territories
  const [videosList, setVideosList] = useState<VideoItem[]>([
    {
      id: 0,
      type: "native",
      nativeUrl: "https://assets.mixkit.co/videos/preview/mixkit-watering-plants-in-a-greenhouse-with-hose-42043-large.mp4",
      creator: "@agribot_officiel",
      cname: "AgriBot Officiel",
      av: "🌱",
      verified: true,
      bio: "La plateforme agricole #1 au Bénin 🌱 Conseils AgriBot • Prix marchés • Réseau fermiers",
      desc: "Biogaz et valorisation efficace des dechets agricoles a la ferme ⛽",
      tags: ["#biogaz", "#innovation", "#bénin", "#conseil"],
      likes: 24800,
      likesFmt: "24.8K",
      comments: 1240,
      commentsFmt: "1.2K",
      shares: "4.5K",
      music: "Son original — AgriBot",
      bg: "linear-gradient(160deg,#020a04,#063316,#0f5a28,#1a8c3e)",
      emoji: "⛽",
      badge: { ico: "🌿", lbl: "AGRIBOT SHORTS", cl: "#10B981" },
      tag: { lbl: "⛽ Biogaz", cl: "#10B981", bg: "rgba(16,185,129,.15)" },
      stats: { abos: "245K", vidéos: "128", likes: "1.8M" },
      thumbs: ["🌱", "🌿", "🌾", "🌻", "🏡", "🚜"],
      stepsNum: 3,
      durationMin: 4,
      levelStr: "Débutant",
      comments_data: [
        { av: "👨🏿", u: "@kokou_ferme", t: "Merci AgriBot pour ces directives précises ! J'ai déjà lancé la fermentation.", time: "1h", likes: 124 },
        { av: "👩🏾", u: "@aminatou_k", t: "Est-ce qu'on peut utiliser les bouses de vaches locales de Kandi ?", time: "2h", likes: 47 },
        { av: "🧑🏿‍💻", u: "@yemi_soglo", t: "Très instructif ! La valorisation énergétique est le futur du Bénin.", time: "4h", likes: 89 }
      ]
    },
    {
      id: 1,
      type: "native",
      nativeUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-organic-soil-with-a-growing-small-plant-48895-large.mp4",
      creator: "@agribot_officiel",
      cname: "AgriBot Officiel",
      av: "🌱",
      verified: true,
      bio: "La plateforme agricole #1 au Bénin 🌱 Conseils AgriBot • Prix marchés • Réseau fermiers",
      desc: "L'agriculture béninoise : une veritable mine d'or verte pour notre jeunesse 🪙",
      tags: ["#mine_dor", "#bénin", "#richesse", "#entreprendre"],
      likes: 18200,
      likesFmt: "18.2K",
      comments: 942,
      commentsFmt: "942",
      shares: "2.1K",
      music: "Son d'avenir — Rythme Cotonou",
      bg: "linear-gradient(160deg,#0f0600,#3d1e00,#6e3c00,#a05800)",
      emoji: "🪙",
      badge: { ico: "🌿", lbl: "AGRIBOT SHORTS", cl: "#10B981" },
      tag: { lbl: "🌾 Mine d'Or", cl: "#10B981", bg: "rgba(16,185,129,.15)" },
      stats: { abos: "245K", vidéos: "128", likes: "1.8M" },
      thumbs: ["🌽", "🌾", "🚜", "🌱", "👨🏿‍🌾", "🏡"],
      stepsNum: 5,
      durationMin: 6,
      levelStr: "Débutant",
      comments_data: [
        { av: "👩🏾", u: "@aminatou_k", t: "Tout à fait vrai ! La terre béninoise ne trahit jamais.", time: "30min", likes: 56 },
        { av: "👨🏾‍🦳", u: "@mathieu_k", t: "Les opportunités au pays sont immenses si on s'y met sérieusement !", time: "1h", likes: 31 }
      ]
    },
    {
      id: 2,
      type: "native",
      nativeUrl: "https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-carrying-a-box-full-of-fresh-vegetables-48902-large.mp4",
      creator: "@agribot_officiel",
      cname: "AgriBot Officiel",
      av: "🌱",
      verified: true,
      bio: "La plateforme agricole #1 au Bénin 🌱 Conseils AgriBot • Prix marchés • Réseau fermiers",
      desc: "Culture du piment de table fait a la maison et au jardin urbanise 🌶️",
      tags: ["#piment", "#potager", "#maison", "#bénin"],
      likes: 15600,
      likesFmt: "15.6K",
      comments: 891,
      commentsFmt: "891",
      shares: "2.8K",
      music: "Rythme Vert — Agri Beats",
      bg: "linear-gradient(160deg,#100505,#3a0f0f,#6a1a1a,#9a2a2a)",
      emoji: "🌶️",
      badge: { ico: "🌿", lbl: "AGRIBOT SHORTS", cl: "#10B981" },
      tag: { lbl: "🌶️ Piment", cl: "#10B981", bg: "rgba(16,185,129,.15)" },
      stats: { abos: "245K", vidéos: "128", likes: "1.8M" },
      thumbs: ["🐓", "🥚", "🏡", "🌾", "🐔", "👩🏾‍🌾"],
      stepsNum: 4,
      durationMin: 3,
      levelStr: "Débutant",
      comments_data: [
        { av: "👨🏿", u: "@kokou_ferme", t: "Super méthode de semis, j'ai commencé dans des bacs de récupération.", time: "10min", likes: 12 },
        { av: "👨🏾‍🌾", u: "@modeste_h", t: "Quel arrosage quotidien est conseillé ?", time: "1h", likes: 44 }
      ]
    },
    {
      id: 3,
      type: "native",
      nativeUrl: "https://assets.mixkit.co/videos/preview/mixkit-farmer-checking-plants-42045-large.mp4",
      creator: "@kpovi_ferme",
      cname: "Kpovi Fermes Ouidah",
      av: "👨🏿‍🌾",
      verified: false,
      bio: "Producteur passionné à Ouidah • Partages d'expériences réelles et maraîchage bio 🍅",
      desc: "Notre récolte de tomates fraîches bio du matin à Ouidah ! Venez visiter notre ferme coopérative ! 🍅🇧🇯",
      tags: ["#tomate", "#ouidah", "#bénin", "#récolte", "#marché"],
      likes: 3420,
      likesFmt: "3.4K",
      comments: 85,
      commentsFmt: "85",
      shares: "120",
      music: "Rythme traditionnel Ouidah",
      bg: "linear-gradient(160deg,#0a1b02,#1a3b09,#2e5c14,#447e22)",
      emoji: "🍅",
      badge: null,
      tag: { lbl: "🍅 Tomates Bio", cl: "#F87171", bg: "rgba(248,113,113,.15)" },
      stats: { abos: "12K", vidéos: "24", likes: "45K" },
      thumbs: ["🍅", "🌿", "🌱", "🏡"],
      stepsNum: 2,
      durationMin: 3,
      levelStr: "Pratique",
      comments_data: [
        { av: "👩🏾", u: "@aminatou_k", t: "Magnifique récolte ! Quel est le prix du panier en ce moment ?", time: "2h", likes: 14 },
        { av: "👨🏾‍🦳", u: "@mathieu_k", t: "Inspirant pour tous les jeunes béninois !", time: "5h", likes: 9 }
      ]
    },
    {
      id: 4,
      type: "native",
      nativeUrl: "https://assets.mixkit.co/videos/preview/mixkit-greenhouse-plants-in-pots-42042-large.mp4",
      creator: "@chabi_bio",
      cname: "Chabi Maraîchage Nord",
      av: "👨🏾‍🌾",
      verified: false,
      bio: "Pionnier des solutions bio naturelles contre les ravageurs de l'Atacora 🌿",
      desc: "Astuce bio : comment éliminer naturellement les pucerons de vos gombos avec de l'huile de neem aqueuse ! 🌿🐜",
      tags: ["#neem", "#gombo", "#atacora", "#bio", "#astuce"],
      likes: 1250,
      likesFmt: "1.2K",
      comments: 43,
      commentsFmt: "43",
      shares: "80",
      music: "Son de la Kora — Nord Bénin",
      bg: "linear-gradient(160deg,#0a0b20,#161e40,#27366b,#3a5299)",
      emoji: "🌿",
      badge: null,
      tag: { lbl: "🌿 Astuce Gombo", cl: "#34D399", bg: "rgba(52,211,153,.15)" },
      stats: { abos: "5K", vidéos: "12", likes: "14K" },
      thumbs: ["🌿", "🐜", "🚿"],
      stepsNum: 4,
      durationMin: 5,
      levelStr: "Technique",
      comments_data: [
        { av: "👨🏿", u: "@kokou_ferme", t: "Efficace ! J'ai déjà testé sur mes piments à Dangbo et ça marche super bien.", time: "1j", likes: 18 }
      ]
    }
  ]);

  // Video State
  const [isMutedGlobal, setIsMutedGlobal] = useState<boolean>(true);
  const [currentVid, setCurrentVid] = useState<number>(0);
  const [selectedVideoForModal, setSelectedVideoForModal] = useState<VideoItem | null>(null);
  const [likedVids, setLikedVids] = useState<Set<number>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"agribot" | "reel" | "saved">("agribot");
  const [savedVids, setSavedVids] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem("agribot_saved_videos");
      return stored ? new Set(JSON.parse(stored)) : new Set([]);
    } catch {
      return new Set([]);
    }
  });
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [showHeartBurst, setShowHeartBurst] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });

  // Creation State Inputs
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");

  // Drawers
  const [showComments, setShowComments] = useState<boolean>(false);
  const [currentCommentVid, setCurrentCommentVid] = useState<number>(0);
  const [commentInput, setCommentInput] = useState<string>("");
  const [showShare, setShowShare] = useState<boolean>(false);
  const [showLpMenu, setShowLpMenu] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  // Custom Registration Form State
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
  const [regLastName, setRegLastName] = useState<string>("");
  const [regFirstName, setRegFirstName] = useState<string>("");
  const [regContact, setRegContact] = useState<string>("");
  const [regSkills, setRegSkills] = useState<string>("");
  const [regSpecialty, setRegSpecialty] = useState<string>("Maraîchage Biologique");
  const [regType, setRegType] = useState<"technician" | "intern">("technician");
  const [regEducation, setRegEducation] = useState<string>("Songhaï Pratique");

  // Custom Video Publish Input
  const [newVideoTitle, setNewVideoTitle] = useState<string>("");
  const [newVideoTags, setNewVideoTags] = useState<string>("#ma_culture #bénin");
  const [newVideoSourceIdx, setNewVideoSourceIdx] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<string>("Irrigation & arrosage de serre");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedVideoName, setUploadedVideoName] = useState<string>("");
  const [pastedVideoUrl, setPastedVideoUrl] = useState<string>("");
  const [collapsedDescs, setCollapsedDescs] = useState<Record<number, boolean>>(() => {
    return { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true };
  });

  // Video elements references to control playback on switch
  const videoRefs = useRef<Record<string | number, HTMLVideoElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Reorder list and load custom videos
  useEffect(() => {
    // 1. Load any custom videos published by the user from localStorage first
    try {
      const stored = localStorage.getItem("agri_custom_published_videos");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVideosList(prev => {
            const existingIds = new Set(prev.map(v => v.id));
            const newCustom = parsed.filter((v: any) => !existingIds.has(v.id));
            return [...newCustom, ...prev];
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Parse shared video query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const videoSharedId = urlParams.get("videoShared");
    if (videoSharedId) {
      const vidId = parseInt(videoSharedId, 10);
      
      setTimeout(() => {
        setVideosList(prev => {
          let indexInState = prev.findIndex(v => v.id === vidId);
          let updated = [...prev];
          
          // Reconstruct shared custom video on-the-fly if not found in database or local storage
          if (indexInState === -1) {
            const sharedUrl = urlParams.get("vUrl");
            const sharedDesc = urlParams.get("vDesc");
            const sharedCreator = urlParams.get("vCreator") || "Producteur Béninois";
            const sharedTheme = urlParams.get("vTheme") || "Maraîchage";
            
            if (sharedUrl) {
              const reconstructed: VideoItem = {
                id: vidId,
                type: "native",
                nativeUrl: sharedUrl,
                creator: "@" + sharedCreator.toLowerCase().replace(/\s+/g, ""),
                cname: sharedCreator,
                av: "👨🏿‍🌾",
                verified: false,
                bio: "Agro-entrepreneur motivé du Bénin 🇧🇯",
                desc: sharedDesc || "Vidéo partagée",
                tags: ["#agriculture", "#bénin", "#partagé"],
                likes: 12,
                likesFmt: "12",
                comments: 0,
                commentsFmt: "0",
                shares: "1",
                music: "Son original — " + sharedCreator,
                bg: "linear-gradient(160deg,#0a1b02,#132f05,#23490c,#3c6a18)",
                emoji: "🌱",
                badge: null,
                tag: { lbl: sharedTheme, cl: "#34D399", bg: "rgba(52,211,153,.15)" },
                stats: { abos: "15", vidéos: "1", likes: "12" },
                thumbs: ["👨🏿‍🌾"],
                stepsNum: 2,
                durationMin: 3,
                levelStr: "Pratique",
                comments_data: []
              };
              updated = [reconstructed, ...updated];
              indexInState = 0;
            }
          }
          
          if (indexInState !== -1) {
            const [selectedItem] = updated.splice(indexInState, 1);
            updated.unshift(selectedItem);
            
            if (selectedItem.creator === "@agribot_officiel" || selectedItem.verified) {
              setActiveTab("agribot");
            } else {
              setActiveTab("reel");
            }
          }
          return updated;
        });
        setCurrentVid(0);
      }, 150);
    }
  }, []);

  // Resolve all short video URLs dynamically upon load so that the native iframes can play them directly
  useEffect(() => {
    let active = true;
    const resolveShortLinks = async () => {
      const promises = videosList.map(async (v) => {
        if (v.nativeUrl && (v.nativeUrl.includes("vm.tiktok.com") || v.nativeUrl.includes("fb.watch") || v.nativeUrl.includes("youtu.be/"))) {
          try {
            const res = await fetch(`/api/resolve-video-link?url=${encodeURIComponent(v.nativeUrl)}`);
            const data = await res.json();
            if (data.success && data.resolvedUrl && data.resolvedUrl !== v.nativeUrl) {
              return { id: v.id, resolvedUrl: data.resolvedUrl };
            }
          } catch (e) {
            console.error("Error background resolving link for video " + v.id, e);
          }
        }
        return null;
      });

      const results = await Promise.all(promises);
      const updates = results.filter(Boolean) as { id: number | string; resolvedUrl: string }[];
      
      if (updates.length > 0 && active) {
        setVideosList(prev => prev.map(vid => {
          const up = updates.find(u => u.id === vid.id);
          if (up) {
            return {
              ...vid,
              nativeUrl: up.resolvedUrl
            };
          }
          return vid;
        }));
      }
    };

    resolveShortLinks();
    return () => {
      active = false;
    };
  }, []);

  // Filtered list computed based on active tab
  const filteredVideos = useMemo(() => {
    return videosList.filter(video => {
      if (activeTab === "agribot") {
        return video.creator === "@agribot_officiel" || video.verified;
      } else if (activeTab === "reel") {
        return video.creator !== "@agribot_officiel" && !video.verified;
      } else if (activeTab === "saved") {
        return savedVids.has(video.id);
      }
      return true;
    });
  }, [videosList, activeTab, savedVids]);

  // Reset active video index and details when switching tabs
  useEffect(() => {
    setCurrentVid(0);
    setIsPaused(false);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Track viewed video IDs in current session to increment views once per session
  const [sessionViewed, setSessionViewed] = useState<Set<number>>(new Set());

  useEffect(() => {
    const activeVideo = filteredVideos[currentVid];
    if (activeVideo && !sessionViewed.has(activeVideo.id)) {
      setSessionViewed(prev => {
        const next = new Set(prev);
        next.add(activeVideo.id);
        return next;
      });
      setVideosList(prev => prev.map(v => {
        if (v.id === activeVideo.id) {
          const newLikes = v.likes + 1;
          return {
            ...v,
            likes: newLikes,
            likesFmt: fmtNum(newLikes)
          };
        }
        return v;
      }));
    }
  }, [currentVid, filteredVideos, sessionViewed]);

  // Handle cross-tab stories clicks to initiate subtabs and publication modals
  useEffect(() => {
    const initialSubtab = localStorage.getItem("agribot_shorts_initial_subtab");
    if (initialSubtab === "reel" || initialSubtab === "saved" || initialSubtab === "agribot") {
      setActiveTab(initialSubtab as any);
      localStorage.removeItem("agribot_shorts_initial_subtab");
    }

    const triggerCreate = localStorage.getItem("agribot_shorts_trigger_create");
    if (triggerCreate === "true") {
      setShowCreate(true);
      localStorage.removeItem("agribot_shorts_trigger_create");
    }
  }, []);

  // Autoplay current centered video and pause others
  useEffect(() => {
    filteredVideos.forEach((v, index) => {
      const vEl = videoRefs.current[v.id];
      if (vEl) {
        if (index === currentVid && !isPaused && v.type === 'native' && !showComments && !showShare && showProfile === null) {
          vEl.playbackRate = playbackSpeed;
          vEl.play().catch(() => {});
        } else {
          vEl.pause();
        }
      }
    });
  }, [currentVid, isPaused, playbackSpeed, filteredVideos, showComments, showShare, showProfile, isMutedGlobal]);

  // Handle snap scrolling detection
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    if (clientHeight === 0) return;
    const approximateIndex = Math.round(scrollTop / clientHeight);
    
    if (approximateIndex >= 0 && approximateIndex < filteredVideos.length && approximateIndex !== currentVid) {
      setCurrentVid(approximateIndex);
      setIsPaused(false);
    }
  };

  // Interactions
  const toggleLike = (id: number) => {
    const updated = new Set(likedVids);
    let isNowLiked = false;
    if (updated.has(id)) {
      updated.delete(id);
      triggerToast("🤍 J'aime retiré");
    } else {
      updated.add(id);
      triggerToast("❤️ Vidéo ajoutée à vos J'aime !");
      isNowLiked = true;
    }
    setLikedVids(updated);

    // Update state to increment/decrement likes dynamically
    setVideosList(prev => prev.map(v => {
      if (v.id === id) {
        const delta = isNowLiked ? 1 : -1;
        const newLikes = Math.max(0, v.likes + delta);
        return {
          ...v,
          likes: newLikes,
          likesFmt: fmtNum(newLikes)
        };
      }
      return v;
    }));
  };

  const handleDoubleTap = (video: VideoItem, e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      // Find coordinates of double click inside the absolute element
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setShowHeartBurst({ x, y, show: true });
      setTimeout(() => {
        setShowHeartBurst(prev => ({ ...prev, show: false }));
      }, 700);

      const updated = new Set(likedVids);
      if (!updated.has(video.id)) {
        updated.add(video.id);
        setLikedVids(updated);

        // Update likes in state
        setVideosList(prev => prev.map(v => {
          if (v.id === video.id) {
            const newLikes = v.likes + 1;
            return {
              ...v,
              likes: newLikes,
              likesFmt: fmtNum(newLikes)
            };
          }
          return v;
        }));
      }
    } else {
      // Single tap - play/pause toggle
      setIsPaused(!isPaused);
    }
    setLastTap(now);
  };

  const toggleFollow = (id: number) => {
    const updated = new Set(followedUsers);
    if (updated.has(id)) {
      updated.delete(id);
      triggerToast("Abonnement annulé");
    } else {
      updated.add(id);
      triggerToast("🌱 Abonnement agro confirmé !");
    }
    setFollowedUsers(updated);
  };

  const postCommentText = () => {
    if (!commentInput.trim()) return;
    const targetVid = filteredVideos[currentCommentVid];
    if (!targetVid) return;

    const newComment: CommentItem = {
      av: "👨🏾",
      u: user?.firstName ? `@${user.firstName.toLowerCase()}` : "@fermier_benin",
      t: commentInput.trim(),
      time: "maintenant",
      likes: 0
    };

    setVideosList(prev => prev.map(v => {
      if (v.id === targetVid.id) {
        return {
          ...v,
          comments: v.comments + 1,
          commentsFmt: String(v.comments + 1),
          comments_data: [newComment, ...v.comments_data]
        };
      }
      return v;
    }));

    setCommentInput("");
    triggerToast("💬 Commentaire publié !");
  };

  const toggleSaveVideo = (id: number) => {
    setSavedVids(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
        triggerToast("🗑️ Vidéo retirée de vos sauvegardes !");
      } else {
        copy.add(id);
        triggerToast("💾 Vidéo ajoutée à vos sauvegardes !");
      }
      try {
        localStorage.setItem("agribot_saved_videos", JSON.stringify(Array.from(copy)));
      } catch (err) {
        console.error(err);
      }
      return copy;
    });
  };

  const toggleDescCollapse = (id: number) => {
    setCollapsedDescs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const shareViaPlatform = (p: string) => {
    setShowShare(false);
    const msgs: Record<string, string> = {
      WhatsApp: "📤 Lien envoyé via WhatsApp !",
      Facebook: "📘 Partagé sur Facebook !",
      Lien: "🔗 Lien vidéo copié dans le presse-papier !",
      Télécharger: "⬇️ Vidéo enregistrée dans votre galerie !",
      Duet: "🎭 Mode Duet ouvert !",
      Stitch: "✂️ Mode Stitch ouvert !",
      SMS: "📱 SMS envoyé !",
      Signaler: "🚩 Report envoyé aux administrateurs."
    };
    triggerToast(msgs[p] || "Action effectuée");
  };

  const handleLongPressMenuOption = (act: string) => {
    setShowLpMenu(false);
    if (act === "save") triggerToast("💾 Vidéo enregistrée !");
    if (act === "notinterested") triggerToast("👍 Compris, moins de recommandations similaires.");
    if (act === "report") triggerToast("🚩 Contenu signalé. Merci !");
  };

  const profileVideo = showProfile !== null ? videosList.find(v => v.id === showProfile) : null;

  return (
    <div className="fixed inset-0 w-full h-screen bg-black flex flex-col text-white font-sans overflow-hidden antialiased z-[9999] select-none">
      
      {/* Dynamic Keyframe Animations Specific to the Custom TikTok-Style Experience */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes discRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes popupHeart {
          0% { opacity: 0; transform: scale(0.3) rotate(-15deg); }
          40% { opacity: 1; transform: scale(1.3) rotate(15deg); }
          70% { opacity: 1; transform: scale(1.0) rotate(-10deg); }
          100% { opacity: 0; transform: scale(0.7) translateY(-40px); }
        }
        @keyframes textScroll {
          0% { transform: translateX(10%); }
          50% { transform: translateX(-60%); }
          100% { transform: translateX(10%); }
        }
        .animate-disc-spin {
          animation: discRotate 4s linear infinite;
        }
        .animate-popup-heart {
          animation: popupHeart 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-marquee-text {
          animation: textScroll 10s linear infinite;
        }
        .vfeed-container {
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          scrollbar-width: none;
          height: 100vh;
          min-height: 100vh;
          width: 100%;
          position: relative;
        }
        .vfeed-container::-webkit-scrollbar {
          display: none;
        }
        .vfeed-item {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          height: 100vh;
          min-height: 100vh;
          width: 100%;
          position: relative;
          flex-shrink: 0;
        }
      `}} />

      {/* ══ TOP BAR NAVIGATION ACTIONS (TRANSPARENT TIKTOK-STYLE) ══ */}
      <div className="absolute top-4 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        {/* 1. Left Close/Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center justify-center p-2 rounded-full text-zinc-100 bg-black/45 backdrop-blur-md border border-white/15 h-9 w-9 hover:bg-black/70 transition active:scale-95 cursor-pointer shadow-lg shrink-0"
          title="Retour à l'accueil"
        >
          <ArrowLeft className="h-4 w-4 text-[#10B981]" />
        </button>

        {/* 2. Centered Interactive Tabs (AGRIBOT / RÉEL / POUR TOI) */}
        <div className="flex-1 flex items-center justify-center gap-1.5 min-[360px]:gap-2.5 sm:gap-4 text-[8.5px] min-[320px]:text-[9.5px] min-[360px]:text-[10.5px] sm:text-xs font-black tracking-wider uppercase select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] overflow-x-auto scrollbar-none py-1 mx-1.5">
          <button 
            onClick={() => {
              setActiveTab("agribot");
              triggerToast("⚡ Flux AgriBot Shorts Officiels");
            }}
            className={`transition relative py-1 px-1 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "agribot" ? "text-white scale-102 font-extrabold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>AGRIBOT SHORTS</span>
            {activeTab === "agribot" && (
              <span className="absolute bottom-0 left-1 right-1 h-0.75 bg-[#10B981] rounded-full" />
            )}
          </button>

          <span className="text-zinc-700 font-light font-mono select-none shrink-0">|</span>

          <button 
            onClick={() => {
              setActiveTab("reel");
              triggerToast("🌟 RÉELS de la Communauté Béninoise");
            }}
            className={`transition relative py-1 px-1 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "reel" ? "text-white scale-102 font-extrabold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>RÉEL</span>
            {activeTab === "reel" && (
              <span className="absolute bottom-0 left-1 right-1 h-0.75 bg-[#10B981] rounded-full" />
            )}
          </button>

          <span className="text-zinc-700 font-light font-mono select-none shrink-0">|</span>

          <button 
            onClick={() => {
              setActiveTab("saved");
              triggerToast("⭐ Vos vidéos sauvegardées (Pour Toi)");
            }}
            className={`transition relative py-1 px-1 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "saved" ? "text-white scale-102 font-extrabold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>POUR TOI</span>
            {activeTab === "saved" && (
              <span className="absolute bottom-[1px] left-1 right-1 h-0.75 bg-[#10B981] rounded-full" />
            )}
          </button>
        </div>

        {/* 3. Publier button at top right */}
        <button 
          onClick={() => {
            setShowCreate(true);
          }}
          className="flex items-center justify-center p-2 rounded-full text-[#10B981] bg-black/45 backdrop-blur-md border border-white/15 h-9 w-9 hover:bg-black/70 hover:scale-105 transition active:scale-95 cursor-pointer shadow-lg shrink-0"
          title="Publier mon propre Réel"
        >
          <Camera className="h-4.5 w-4.5 animate-pulse" />
        </button>
      </div>

        {/* ══ VIDEO VERTICAL FEED ══ */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="vfeed-container w-full h-full bg-black text-white relative"
        >
          {filteredVideos.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-950 space-y-4">
              <span className="text-5xl">🌾</span>
              <p className="text-sm font-semibold text-zinc-300 leading-relaxed max-w-[280px]">
                {activeTab === "saved" 
                  ? "Aucune vidéo sauvegardée pour le moment. Cliquez sur 'Sauvegarder' en bas d'un court ou d'un RÉEL pour le retrouver ici !" 
                  : "Aucun contenu publié dans cette catégorie pour le moment."}
              </p>
              {activeTab === "saved" ? (
                <button
                  onClick={() => setActiveTab("agribot")}
                  className="px-4 py-2 bg-[#10B981] hover:bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Découvrir les shorts
                </button>
              ) : activeTab === "reel" ? (
                <button
                  onClick={() => setShowCreate(true)}
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition cursor-pointer shadow-lg active:scale-95"
                >
                  ➕ PUBLIER MON PREMIER RÉEL
                </button>
              ) : null}
            </div>
          ) : (
            filteredVideos.map((video, index) => {
              const isLiked = likedVids.has(video.id);
              const isFollowed = followedUsers.has(video.id);
              const isDescCollapsed = collapsedDescs[video.id] !== false;

              return (
                <div 
                  key={video.id} 
                  className="vfeed-item w-full h-screen min-h-screen shrink-0 flex flex-col justify-end text-white relative pb-14"
                >
                {/* 1. Backdrop Video Loop / YouTube Placeholder */}
                <div 
                  onClick={(e) => handleDoubleTap(video, e)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setShowLpMenu(true);
                  }}
                  className="absolute inset-0 z-0 bg-neutral-950 cursor-pointer overflow-hidden select-none"
                >
                  {/* WATERMARK AGRIBOT TRANSPARENT */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none overflow-hidden">
                    <span className="text-white/12 text-6xl min-[360px]:text-7xl md:text-8xl font-black tracking-[0.25em] -rotate-[30deg] uppercase select-none opacity-15">
                      AGRIBOT
                    </span>
                  </div>
                  {video.nativeUrl ? (() => {
                    const srcInfo = parseVideoUrl(video.nativeUrl);
                    if (srcInfo.isEmbed) {
                      return (
                        <iframe
                          src={srcInfo.url}
                          className="w-full h-full object-cover border-0 z-0"
                          allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
                          allowFullScreen
                          title={video.desc}
                        />
                      );
                    } else {
                      return (
                        <video
                          ref={el => { videoRefs.current[video.id] = el; }}
                          src={srcInfo.url}
                          loop
                          playsInline
                          muted={isMutedGlobal}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Safe fallback in case of invalid URL or offline/expired blob
                            e.currentTarget.src = "https://assets.mixkit.co/videos/preview/mixkit-watering-plants-in-a-greenhouse-with-hose-42043-large.mp4";
                          }}
                        />
                      );
                    }
                  })() : (
                    <div 
                      className="w-full h-full flex flex-col items-center justify-center gap-4 relative"
                      style={{ background: video.bg }}
                    >
                      {/* Deep backdrop subtle crop image */}
                      <div className="absolute inset-x-0 bottom-1/4 flex justify-center text-[100px] opacity-10 font-mono select-none pointer-events-none">
                        {video.emoji}
                      </div>

                      <div className="bg-black/55 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center max-w-[260px] mx-auto space-y-3 shadow-2xl z-10">
                        <div className="h-10 w-10 mx-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-lg">
                          🌿
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black uppercase text-white/90 tracking-wider">
                            Fiche Tutoriel Vidéo
                          </h4>
                          <p className="text-[10px] text-zinc-400 leading-normal">
                            Démonstration d'itinéraires culturaux et directives techniques de AgriBot Bénin.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVideoForModal(video);
                          }}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg text-[10.5px] font-bold text-slate-950 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Lire la vidéo</span>
                          <Play className="h-3 w-3 fill-slate-950" />
                        </button>
                      </div>
                    </div>
                  )}



                  {/* Gradient overlays to guarantee white text contrast */}
                  <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                  
                  {/* Subtle Grain over visuals */}
                  <div className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '150px' }} />
                </div>

                {/* 2. Top-left Metadata Badge (Category Indicator) */}
                <div className="absolute top-28 left-4 z-10 flex flex-wrap gap-1.5 items-center select-none">
                  <div className="rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest font-mono shadow-xs" style={{ backgroundColor: video.tag.bg, color: video.tag.cl }}>
                    {video.tag.lbl}
                  </div>
                </div>

                {/* 3. Right Floating Interaction Deck (TikTok Modern Glass Card Grid) */}
                <div className="absolute right-3.5 bottom-28 z-30 flex flex-col items-center gap-3.5 select-none">
                  
                  {/* Card 1: Creator Avatar ("Dame") */}
                  <div 
                    onClick={() => setShowProfile(video.id)}
                    className="w-[56px] h-[64px] bg-neutral-900/80 backdrop-blur-md border border-white/15 rounded-xl flex flex-col items-center justify-center p-1.5 shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-lg relative font-sans overflow-hidden">
                      {video.creator === "@agribot_officiel" ? (
                        <img 
                          src="/logo_agribot.png" 
                          alt="AgriBot" 
                          className="w-full h-full object-contain p-0.5" 
                          referrerPolicy="no-referrer" 
                        />
                      ) : (
                        video.av
                      )}
                      {/* Overlap follow badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextFollowed = new Set(followedUsers);
                          if (nextFollowed.has(video.id)) {
                            nextFollowed.delete(video.id);
                            triggerToast(`Abonnement retiré pour ${video.creator}`);
                          } else {
                            nextFollowed.add(video.id);
                            triggerToast(`Abonné à ${video.creator} 🎉`);
                          }
                          setFollowedUsers(nextFollowed);
                        }}
                        className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-black border border-neutral-950 ${
                          isFollowed ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-white"
                        }`}
                      >
                        {isFollowed ? "✓" : "+"}
                      </button>
                    </div>
                    <span className="text-[8px] font-bold text-zinc-300 font-mono tracking-tighter mt-1 uppercase truncate max-w-full">
                      Profil
                    </span>
                  </div>

                  {/* Card 2: Views ("Vu") */}
                  <div 
                    onClick={() => triggerToast(`👁️ Cette vidéo innovante enregistre un cumul de ${fmtNum(video.likes)} vues !`)}
                    className="w-[56px] h-[64px] bg-neutral-900/80 backdrop-blur-md border border-white/15 rounded-xl flex flex-col items-center justify-center p-1.5 shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <Eye className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.55)] scale-105" />
                    <span className="text-[8px] font-black text-zinc-300 font-mono tracking-tighter mt-1 uppercase">
                      {video.likesFmt} VU
                    </span>
                  </div>

                  {/* Card 3: Comments ("Mé co") */}
                  <div 
                    onClick={() => {
                      setCurrentCommentVid(index);
                      setShowComments(true);
                    }}
                    className="w-[56px] h-[64px] bg-neutral-900/80 backdrop-blur-md border border-white/15 rounded-xl flex flex-col items-center justify-center p-1.5 shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <MessageCircle className="h-5 w-5 text-zinc-100" />
                    <span className="text-[8px] font-black text-zinc-300 font-mono tracking-tighter mt-1 uppercase">
                      {video.commentsFmt}
                    </span>
                  </div>

                  {/* Card 4: Bookmark / Save ("Disco") */}
                  <div 
                    onClick={() => {
                      toggleSaveVideo(video.id);
                    }}
                    className="w-[56px] h-[64px] bg-neutral-900/80 backdrop-blur-md border border-white/15 rounded-xl flex flex-col items-center justify-center p-1.5 shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <Bookmark className={`h-4.5 w-4.5 transition duration-200 ${savedVids.has(video.id) ? "text-amber-400 fill-amber-400" : "text-zinc-100"}`} />
                    <span className="text-[8px] font-black text-zinc-300 font-mono tracking-tighter mt-1 uppercase">
                      Disco
                    </span>
                  </div>

                  {/* Card 5: Sound (Mute/Unmute) */}
                  <div 
                    onClick={() => {
                      setIsMutedGlobal(!isMutedGlobal);
                      triggerToast(isMutedGlobal ? "🔊 Son Activé" : "🔇 Son Désactivé");
                    }}
                    className="w-[56px] h-[64px] bg-neutral-900/80 backdrop-blur-md border border-white/15 rounded-xl flex flex-col items-center justify-center p-1.5 shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
                    title={isMutedGlobal ? "Activer le son" : "Désactiver le son"}
                  >
                    {isMutedGlobal ? (
                      <VolumeX className="h-5 w-5 text-rose-400 drop-shadow-[0_0_8px_rgba(244,67,54,0.4)]" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                    )}
                    <span className="text-[8px] font-black text-zinc-300 font-mono tracking-tighter mt-1 uppercase">
                      {isMutedGlobal ? "MUET" : "SON"}
                    </span>
                  </div>
                </div>

                {/* 4. Bottom Information Panel (Collapsible Description, Tags) */}
                <div className="absolute left-3 right-17 bottom-19.5 z-20 flex flex-col gap-2 select-none text-left bg-black/75 backdrop-blur-md border border-[#10B981]/20 rounded-2xl p-3 shadow-2xl">
                  {/* High-contrast index row */}
                  <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-1.5 mb-0.5">
                    <span className="text-[9.5px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/25 uppercase tracking-wide">
                      🎬 Vidéo {index + 1} sur {filteredVideos.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <strong 
                      onClick={() => setShowProfile(video.id)}
                      className="font-black text-[13px] cursor-pointer hover:underline text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] tracking-wide"
                    >
                      {video.creator}
                    </strong>
                    {video.verified && (
                      <span className="text-slate-950 bg-[#10B981] border border-emerald-400/30 rounded-md px-1.5 py-0.25 text-[8px] font-mono uppercase font-black tracking-wider animate-pulse">
                        OFFICIEL
                      </span>
                    )}
                  </div>

                  {/* Rich formatted caption descriptions */}
                  <div className="text-[11px] text-zinc-100 leading-relaxed font-sans drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    <p className={isDescCollapsed ? "line-clamp-2" : "line-clamp-none font-medium text-white"}>
                      {video.desc}
                    </p>
                    
                    {/* Collapsed triggers with 'Voir plus' / 'moins' */}
                    {video.desc.length > 30 && (
                      <button 
                        onClick={() => toggleDescCollapse(video.id)}
                        className="text-[10px] text-[#10B981] hover:text-emerald-400 mt-0.5 underline font-black cursor-pointer inline-block"
                      >
                        {isDescCollapsed ? "Voir plus" : "moins"}
                      </button>
                    )}

                    {/* Tags inline */}
                    <div className="flex flex-wrap gap-1 mt-1 text-[9.5px] font-extrabold text-[#10B981] whitespace-nowrap">
                      {video.tags.join(" ")}
                    </div>
                  </div>
                </div>

                {/* 5. Fixed Horizontal Sticky Acquisition CTA Bar underneath video card */}
                <div className="absolute bottom-[2px] left-0 right-0 px-3.5 z-35 pointer-events-auto select-none">
                  <div className="bg-zinc-950/95 backdrop-blur-sm border border-[#10B981]/20 rounded-xl p-2 flex items-center justify-between gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                    <span className="text-[8px] font-extrabold uppercase tracking-widest font-mono text-zinc-300 truncate">
                      💡 innovation &amp; ressources
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      {!user ? (
                        /* S'enregistrer s'affiche uniquement pour ceux qui n'ont pas encore de compte/profil. À côté de s'enregistrer, on met PARTAGER (Share) */
                        <div className="flex items-center gap-1.5 font-sans">
                          <button 
                            onClick={() => {
                              setShowRegisterForm(true);
                              triggerToast("🌱 Formulaire de création de compte ouvert !");
                            }} 
                            className="px-3.5 py-1.5 bg-[#10B981] active:scale-95 text-slate-950 text-[8.5px] font-black uppercase tracking-widest rounded-lg transition hover:bg-emerald-400 cursor-pointer"
                          >
                            S'enregistrer
                          </button>
                          
                          <button 
                            onClick={() => {
                              const isBlob = video.nativeUrl && video.nativeUrl.startsWith("blob:");
                              const baseShare = window.location.origin + "?tab=videos&videoShared=" + video.id;
                              const shareUrl = isBlob 
                                ? baseShare 
                                : `${baseShare}&vUrl=${encodeURIComponent(video.nativeUrl || "")}&vDesc=${encodeURIComponent(video.desc || "")}&vCreator=${encodeURIComponent(video.cname || "")}&vTheme=${encodeURIComponent(video.tag?.lbl || "")}`;
                              
                              if (isBlob) {
                                triggerToast("⚠️ Note: Fichier de votre appareil. Pour que d'autres le voient partout, mettez un lien en ligne !");
                              }

                              if (navigator.share) {
                                navigator.share({
                                  title: video.creator,
                                  text: video.desc,
                                  url: shareUrl
                                }).catch(() => {});
                              } else {
                                navigator.clipboard.writeText(shareUrl);
                                triggerToast("🔗 Lien de partage copié !");
                              }
                            }} 
                            className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-[8.5px] font-black uppercase tracking-wider rounded-lg transition active:scale-95 cursor-pointer hover:bg-zinc-800"
                          >
                            Partager 🔗
                          </button>
                        </div>
                      ) : (
                        /* Ceux qui ont un compte connecté affichent PARTAGER et SIGNALÉ */
                        <div className="flex items-center gap-1.5 font-sans">
                          <button 
                            onClick={() => {
                              const isBlob = video.nativeUrl && video.nativeUrl.startsWith("blob:");
                              const baseShare = window.location.origin + "?tab=videos&videoShared=" + video.id;
                              const shareUrl = isBlob 
                                ? baseShare 
                                : `${baseShare}&vUrl=${encodeURIComponent(video.nativeUrl || "")}&vDesc=${encodeURIComponent(video.desc || "")}&vCreator=${encodeURIComponent(video.cname || "")}&vTheme=${encodeURIComponent(video.tag?.lbl || "")}`;
                              
                              if (isBlob) {
                                triggerToast("⚠️ Note: Fichier de votre appareil. Pour que d'autres le voient partout, mettez un lien en ligne !");
                              }

                              if (navigator.share) {
                                navigator.share({
                                  title: video.creator,
                                  text: video.desc,
                                  url: shareUrl
                                }).catch(() => {});
                              } else {
                                navigator.clipboard.writeText(shareUrl);
                                triggerToast("🔗 Lien de partage copié !");
                              }
                            }} 
                            className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-[7.5px] font-black uppercase tracking-wider rounded-lg transition active:scale-95 cursor-pointer"
                          >
                            Partager 🔗
                          </button>
                          <button 
                            onClick={() => {
                              triggerToast("🚩 Contenu signalé. Merci !");
                            }} 
                            className="px-2.5 py-1 bg-rose-950/40 border border-rose-900/40 text-rose-300 hover:bg-rose-900 hover:text-white active:scale-95 text-[7.5px] font-extrabold uppercase tracking-wider rounded-lg transition cursor-pointer"
                          >
                            Signalé
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Double Tap central heart visualization overlay */}
                {showHeartBurst.show && currentVid === index && (
                  <div 
                    className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: showHeartBurst.x, top: showHeartBurst.y }}
                  >
                    <div className="animate-popup-heart text-red-500 drop-shadow-[0_4px_24px_rgba(239,68,68,0.7)] text-[80px]">
                      ❤️
                    </div>
                  </div>
                )}

                {/* Pause/Play giant overlay central indicator */}
                {isPaused && currentVid === index && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none bg-black/15">
                    <div className="bg-black/60 border border-white/10 rounded-full h-16 w-16 flex items-center justify-center text-zinc-200 shadow-2xl animate-spin-once">
                      ⏸️
                    </div>
                  </div>
                )}
              </div>
            );
          })
          )}
        </div>

        {/* ══ TOAST FLOATING BANNER ALERT ══ */}
        {toastMessage && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500/95 text-slate-950 font-black text-[11px] tracking-wide font-mono px-5 py-2.5 rounded-full z-50 shadow-2xl backdrop-blur-xs select-none uppercase border border-emerald-300 pointer-events-none transition-all scale-102">
            🌱 {toastMessage}
          </div>
        )}

        {/* ══ SLIDE-UP COMMENTS DRAWER ══ */}
        <div 
          className={`absolute inset-0 bg-black/60 z-50 transition-opacity duration-300 select-none ${
            showComments ? "opacity-100 pointer-events-all" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowComments(false)}
        >
          <div 
            className={`absolute bottom-0 left-0 right-0 h-[65%] bg-neutral-900 rounded-t-3xl border-t border-zinc-800 flex flex-col transition-transform duration-300 ${
              showComments ? "translate-y-0" : "translate-y-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Draw Handle */}
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto my-3" />
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 pb-2 border-b border-zinc-800">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
                Commentaires ({videosList[currentCommentVid]?.comments_data.length || 0})
              </span>
              <button 
                onClick={() => setShowComments(false)}
                className="w-7 h-7 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {videosList[currentCommentVid]?.comments_data.map((comm, idx) => (
                <div key={idx} className="flex gap-3 text-xs border-b border-zinc-800/40 pb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/30 text-base flex items-center justify-center font-bold select-none text-zinc-100 shrink-0">
                    {comm.av}
                  </div>
                  <div className="flex-1 space-y-0.5 text-left">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-emerald-400 font-extrabold tracking-wide font-mono text-[10.5px]">
                        {comm.u}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-medium">
                        {comm.time}
                      </span>
                    </div>
                    <p className="text-zinc-200 leading-relaxed font-sans font-medium text-[11px]">
                      {comm.t}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[9px] text-zinc-500 font-bold">
                      <button className="hover:text-red-400 flex items-center gap-0.5">
                        <span>❤️</span>
                        <span>{comm.likes}</span>
                      </button>
                      <button className="hover:text-zinc-400 uppercase">Répondre</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Input */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 flex items-center gap-2 pb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-500/30 text-sm flex items-center justify-center shrink-0 shadow-md">
                👨🏾
              </div>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") postCommentText();
                }}
                placeholder="Ajouter un commentaire constructif..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60 font-sans"
              />
              <button 
                onClick={postCommentText}
                className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 active:scale-90 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ══ SLIDE-UP SHARE DRAWER ══ */}
        <div 
          className={`absolute inset-0 bg-black/60 z-50 transition-opacity duration-300 select-none ${
            showShare ? "opacity-100 pointer-events-all" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowShare(false)}
        >
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl border-t border-zinc-800 p-4 transition-transform duration-300 ${
              showShare ? "translate-y-0" : "translate-y-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Draw Handle */}
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
                Partager cette innovation agricole
              </span>
              <button onClick={() => setShowShare(false)} className="text-xs text-zinc-500 hover:text-white cursor-pointer px-1">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-x-2 gap-y-4 text-center pb-6">
              {[
                { name: "WhatsApp", ico: "💬", cl: "bg-emerald-500/10 border-emerald-500/20" },
                { name: "Facebook", ico: "📘", cl: "bg-blue-600/10 border-blue-600/20" },
                { name: "Lien", ico: "🔗", cl: "bg-neutral-800 border-neutral-700" },
                { name: "Télécharger", ico: "⬇️", cl: "bg-emerald-500/10 border-emerald-500/20" },
                { name: "Duet", ico: "🎭", cl: "bg-neutral-800" },
                { name: "Stitch", ico: "✂️", cl: "bg-neutral-800" },
                { name: "SMS", ico: "📱", cl: "bg-neutral-800" },
                { name: "Signaler", ico: "🚩", cl: "bg-rose-500/10 border-rose-500/20 text-rose-500" }
              ].map((plat) => (
                <button
                  key={plat.name}
                  onClick={() => shareViaPlatform(plat.name)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition"
                >
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-lg shadow-sm ${plat.cl}`}>
                    {plat.ico}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-extrabold tracking-wide uppercase font-mono">
                    {plat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ LONG PRESS OPTION MENU ══ */}
        <div 
          className={`absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-200 select-none ${
            showLpMenu ? "opacity-100 pointer-events-all" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowLpMenu(false)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-[280px] overflow-hidden shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-800 text-center bg-zinc-950">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 font-mono block">Configuration d'Ingénierie</span>
              <span className="text-[8.5px] text-zinc-500 font-semibold uppercase font-mono block mt-0.5">Options professionnelles de lecture</span>
            </div>

            <div className="flex flex-col text-xs text-left">
              <button 
                onClick={() => handleLongPressMenuOption("save")}
                className="px-5 py-3.5 border-b border-zinc-800/50 hover:bg-zinc-800 flex items-center gap-3 text-zinc-200 cursor-pointer"
              >
                <span className="text-base select-none">💾</span>
                <span className="font-semibold">Enregistrer cette vidéo</span>
              </button>

              {/* Advanced Speed configuration option inside menu */}
              <div className="px-5 py-3.5 border-b border-zinc-800/50 flex flex-col gap-2 bg-zinc-900/40">
                <div className="flex items-center gap-3 text-zinc-200">
                  <span className="text-base">⚡</span>
                  <span className="font-semibold">Vitesse de lecture</span>
                </div>
                <div className="flex items-center gap-1 bg-black p-0.5 rounded-xl border border-zinc-800 shadow-inner mt-1">
                  {[0.5, 1, 1.5, 2].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => {
                        setPlaybackSpeed(sp);
                        triggerToast(`Vitesse : ${sp}x`);
                        setShowLpMenu(false);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-[9.5px] font-black uppercase transition cursor-pointer font-mono ${
                        playbackSpeed === sp 
                          ? "bg-emerald-600 text-slate-950 font-black shadow-xs" 
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleLongPressMenuOption("notinterested")}
                className="px-5 py-3.5 border-b border-zinc-800/50 hover:bg-zinc-800 flex items-center gap-3 text-zinc-200 cursor-pointer"
              >
                <span className="text-base select-none">🙈</span>
                <div className="text-left leading-normal">
                  <span className="font-semibold block">Pas intéressé</span>
                  <span className="text-[9px] text-zinc-500 font-medium font-mono leading-tight block">Moins de propositions de ce type</span>
                </div>
              </button>

              <button 
                onClick={() => handleLongPressMenuOption("report")}
                className="px-5 py-3.5 border-b border-zinc-800/50 hover:bg-zinc-850 flex items-center gap-3 text-red-400 cursor-pointer"
              >
                <span className="text-base select-none">🚩</span>
                <span className="font-semibold">Signaler la vidéo</span>
              </button>

              <button 
                onClick={() => setShowLpMenu(false)}
                className="px-5 py-3.5 hover:bg-zinc-800 text-center font-bold text-zinc-400 uppercase tracking-wider text-[10px] cursor-pointer bg-zinc-950"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>

        {/* ══ FULL SLIDE-IN PROFILE PAGE ══ */}
        <div 
          className={`absolute inset-0 bg-zinc-950 z-50 transition-transform duration-300 select-none flex flex-col overflow-hidden ${
            showProfile !== null ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {profileVideo && (
            <>
              {/* Profile Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 pt-10">
                <button 
                  onClick={() => setShowProfile(null)}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white cursor-pointer active:scale-90"
                >
                  <ArrowLeft className="h-4 w-4 text-emerald-400" />
                </button>
                <div className="flex-1 text-left">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-100 block">
                    {profileVideo.creator}
                  </span>
                  <span className="text-[8.5px] text-zinc-500 font-bold uppercase font-mono tracking-widest block">
                    Producteur Certifié Béninois
                  </span>
                </div>
                <span className="text-zinc-500">⋮</span>
              </div>

              {/* Profile Content Scrollable */}
              <div className="flex-1 overflow-y-auto pb-8 text-left">
                {/* Hero section */}
                <div className="p-5 text-center border-b border-zinc-900 bg-linear-to-b from-neutral-900/10 to-transparent space-y-3.5">
                  <div className="w-20 h-20 mx-auto rounded-full border-3 border-emerald-500 bg-linear-to-tr from-emerald-950 to-emerald-700 flex items-center justify-center text-4xl shadow-xl select-none">
                    {profileVideo.av}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">
                      {profileVideo.cname}
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-semibold font-mono block">
                      {profileVideo.creator} {profileVideo.verified && "✅"}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-zinc-300 max-w-[280px] mx-auto leading-relaxed">
                    {profileVideo.bio}
                  </p>

                  {/* Profile stats breakdown info */}
                  <div className="flex justify-center gap-6 py-2">
                    <div className="text-center">
                      <strong className="text-sm font-extrabold uppercase font-mono text-zinc-100 block">
                        {profileVideo.stats.abos}
                      </strong>
                      <span className="text-[9.5px] text-zinc-500 font-extrabold uppercase font-mono tracking-wide">Abonnés</span>
                    </div>
                    <div className="text-center border-x border-zinc-800/40 px-6">
                      <strong className="text-sm font-extrabold uppercase font-mono text-zinc-100 block">
                        {profileVideo.stats.vidéos}
                      </strong>
                      <span className="text-[9.5px] text-zinc-500 font-extrabold uppercase font-mono tracking-wide">Vidéos</span>
                    </div>
                    <div className="text-center">
                      <strong className="text-sm font-extrabold uppercase font-mono text-zinc-100 block">
                        {profileVideo.stats.likes}
                      </strong>
                      <span className="text-[9.5px] text-zinc-500 font-extrabold uppercase font-mono tracking-wide">J'aime</span>
                    </div>
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="flex justify-center gap-2 pt-2 select-none">
                    <button
                      onClick={() => toggleFollow(profileVideo.id)}
                      className={`px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                        followedUsers.has(profileVideo.id) 
                          ? "bg-zinc-800 text-emerald-400 border border-zinc-700 font-semibold" 
                          : "bg-emerald-600 text-slate-950 font-black hover:bg-emerald-500 shadow-md"
                      }`}
                    >
                      {followedUsers.has(profileVideo.id) ? "Abonné ✓" : "S'abonner"}
                    </button>
                    <button 
                      onClick={() => triggerToast(`Boîte de dialogue privée avec ${profileVideo.creator}`)}
                      className="px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 font-extrabold text-[11px] uppercase tracking-wider text-zinc-200 transition cursor-pointer"
                    >
                      Message
                    </button>
                  </div>
                </div>

                {/* Feed Tabs inside profile view */}
                <div className="flex border-b border-zinc-900 bg-zinc-950">
                  <button className="flex-1 py-3 text-center text-[11px] font-black uppercase text-emerald-400 border-b-2 border-emerald-500 tracking-wider">
                    🎬 Vidéos
                  </button>
                  <button onClick={() => triggerToast("Contenu favoris indisponible")} className="flex-1 py-3 text-center text-[11px] font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-wider">
                    ❤️ Favoris
                  </button>
                  <button onClick={() => triggerToast("Playlists indisponible")} className="flex-1 py-3 text-center text-[11px] font-black uppercase text-zinc-500 hover:text-zinc-300 tracking-wider">
                    📋 Playlist
                  </button>
                </div>

                {/* Elegant Video Thumbnails grid */}
                <div className="grid grid-cols-3 gap-[1.5px] p-[1.5px] bg-neutral-950">
                  {profileVideo.thumbs.map((thumb, tIdx) => {
                    const viewCounts = ["2.3K", "8.1K", "1.2K", "4.5K", "892", "15.6K"];
                    return (
                      <div 
                        key={tIdx}
                        onClick={() => {
                          triggerToast("Aperçu de la vidéo de la galerie...");
                        }}
                        className="aspect-[3/4] bg-[#1a1a1a] relative flex items-center justify-center border border-zinc-800/10 group cursor-pointer overflow-hidden"
                      >
                        <span className="text-3xl select-none transition group-hover:scale-115">
                          {thumb}
                        </span>
                        
                        {tIdx === 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-red-650 border border-red-500 text-white font-black text-[7px] px-1 py-0.25 rounded-sm uppercase tracking-wider shadow">
                            📌 Pin
                          </span>
                        )}

                        <div className="absolute bottom-1.5 left-1.5 text-[9px] font-black text-emerald-300 font-mono bg-black/45 backdrop-blur-md px-1.5 py-0.5 rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.6)] border border-white/10 select-none">
                          ▶ {viewCounts[tIdx % viewCounts.length]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>��
        {/* ══ CREATE & UPLOAD MODAL FORM ══ */}
        <div 
          className={`absolute inset-0 bg-black/95 backdrop-blur-lg z-50 flex flex-col items-center justify-start overflow-y-auto p-6 transition-transform duration-300 select-none ${
            showCreate ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="w-full flex justify-end mt-4">
            <button 
              onClick={() => setShowCreate(false)}
              className="w-9 h-9 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center text-sm cursor-pointer shadow-lg active:scale-95 hover:bg-zinc-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-center max-w-[280px] mx-auto mb-5">
            <span className="mx-auto h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl select-none">
              🎥
            </span>
            <h3 className="text-sm font-black uppercase text-white tracking-widest font-mono">
              Publier mon Réel
            </h3>
            <p className="text-[11px] text-zinc-400 leading-normal font-sans">
              Partagez instantanément votre propre vidéo agricole avec la communauté d'agriculteurs du Bénin !
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!newVideoTitle.trim()) {
                triggerToast("⚠️ Veuillez entrer un titre descriptif.");
                return;
              }
              
              const defaultVideoLoops: Record<string, string> = {
                irrigation: "https://assets.mixkit.co/videos/preview/mixkit-watering-plants-in-a-greenhouse-with-hose-42043-large.mp4",
                sol: "https://assets.mixkit.co/videos/preview/mixkit-man-hands-holding-and-showing-soil-41738-large.mp4",
                marichage: "https://assets.mixkit.co/videos/preview/mixkit-farmer-checking-plants-42045-large.mp4",
                semis: "https://assets.mixkit.co/videos/preview/mixkit-watering-plants-in-a-greenhouse-with-hose-42043-large.mp4",
                ananas: "https://assets.mixkit.co/videos/preview/mixkit-organic-farming-lettuce-growing-41712-large.mp4",
                traitement: "https://assets.mixkit.co/videos/preview/mixkit-greenhouse-plants-in-pots-42042-large.mp4",
                arboriculture: "https://assets.mixkit.co/videos/preview/mixkit-farmer-checking-plants-42045-large.mp4",
                compost: "https://assets.mixkit.co/videos/preview/mixkit-organic-farming-lettuce-growing-41712-large.mp4",
                elevage: "https://assets.mixkit.co/videos/preview/mixkit-man-hands-holding-and-showing-soil-41738-large.mp4",
                pisciculture: "https://assets.mixkit.co/videos/preview/mixkit-watering-plants-in-a-greenhouse-with-hose-42043-large.mp4",
                mecanisation: "https://assets.mixkit.co/videos/preview/mixkit-farmer-checking-plants-42045-large.mp4",
                agroforesterie: "https://assets.mixkit.co/videos/preview/mixkit-greenhouse-plants-in-pots-42042-large.mp4",
                conservation: "https://assets.mixkit.co/videos/preview/mixkit-organic-farming-lettuce-growing-41712-large.mp4",
                apiculture: "https://assets.mixkit.co/videos/preview/mixkit-man-hands-holding-and-showing-soil-41738-large.mp4"
              };

              // Determine the video source we are going to use
              // Accept pasted online link first, then uploaded local file, then falling back to a theme loop
              const activeThemeKey = String(selectedTheme || "").trim().toLowerCase().includes("sol") ? "sol" :
                                     String(selectedTheme || "").trim().toLowerCase().includes("maraich") || String(selectedTheme || "").trim().toLowerCase().includes("maraîch") ? "marichage" :
                                     String(selectedTheme || "").trim().toLowerCase().includes("ananas") ? "ananas" :
                                     String(selectedTheme || "").trim().toLowerCase().includes("semis") ? "semis" :
                                     String(selectedTheme || "").trim().toLowerCase().includes("traitement") ? "traitement" : "irrigation";

              const selectedSource = pastedVideoUrl.trim() || uploadedVideoUrl || defaultVideoLoops[activeThemeKey] || defaultVideoLoops.irrigation;
              const authorHandle = "@" + (user?.username || "fermier_benin").toLowerCase();
              const authorName = (user?.firstName || "Fermier") + " " + (user?.lastName || "Producteur");
              
              const newId = videosList.length + Math.floor(Math.random() * 10000) + 1000;
              const formattedTags = newVideoTags.split(" ").filter(t => t.trim().startsWith("#"));
              if (formattedTags.length === 0) formattedTags.push("#benin", "#agriculture");
              
              const newVidItem: VideoItem = {
                id: newId,
                type: "native",
                nativeUrl: selectedSource,
                creator: authorHandle,
                cname: authorName,
                av: "👨🏿‍🌾",
                verified: false,
                bio: "Agro-businessman motivé du Benin 🇧🇯",
                desc: newVideoTitle,
                tags: formattedTags,
                likes: 1,
                likesFmt: "1",
                comments: 0,
                commentsFmt: "0",
                shares: "0",
                music: "Son original — " + authorName,
                bg: "linear-gradient(160deg,#0a1b02,#132f05,#23490c,#3c6a18)",
                emoji: "🌱",
                badge: null,
                tag: { lbl: selectedTheme || "Réel", cl: "#34D399", bg: "rgba(52,211,153,.15)" },
                stats: { abos: "10", vidéos: "1", likes: "1" },
                thumbs: ["👨🏿‍🌾", "🌾"],
                stepsNum: 2,
                durationMin: 3,
                levelStr: "Pratique",
                comments_data: []
              };

              // Prepend to active list and save custom item in browser localStorage
              setVideosList(prev => [newVidItem, ...prev]);
              
              try {
                const storedCustom = localStorage.getItem("agri_custom_published_videos");
                let customList = [];
                if (storedCustom) {
                  customList = JSON.parse(storedCustom);
                }
                customList.unshift(newVidItem);
                localStorage.setItem("agri_custom_published_videos", JSON.stringify(customList));
              } catch(e) {
                console.error(e);
              }

              setShowCreate(false);
              setNewVideoTitle("");
              setNewVideoTags("#ma_culture #bénin");
              setUploadedVideoUrl(null);
              setUploadedVideoName("");
              setPastedVideoUrl(""); // Just reset pasted URL value
              setActiveTab("reel");
              triggerToast("🎉 Votre vidéo Réel a été publiée avec succès !");
            }}
            className="w-full max-w-[320px] flex flex-col gap-3.5 text-left font-sans text-white bg-zinc-900/60 p-4 rounded-3xl border border-white/5 shadow-2xl"
          >
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                Titre descriptif du Réel
              </label>
              <input 
                type="text" 
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="Ex: Récolte de courges à Dangbo..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10B981] text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                Thématique Média Réel
              </label>
              <input 
                type="text"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                placeholder="Ex: Irrigation & arrosage de serre, culture d'ananas de table..."
                className="w-full bg-zinc-950 border border-[#27ae60]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10B981] text-zinc-100 placeholder-zinc-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] font-mono">
                  Lien direct de la vidéo (En ligne) 🌐
                </label>
                <span className="text-[8px] bg-emerald-950 text-emerald-400 font-mono font-bold px-1 rounded">Recommandé</span>
              </div>
              <input 
                type="url" 
                value={pastedVideoUrl}
                onChange={(e) => {
                  setPastedVideoUrl(e.target.value);
                  if (e.target.value) {
                    // clear file if pasting URL
                    setUploadedVideoUrl(null);
                    setUploadedVideoName("");
                  }
                }}
                placeholder="Coller un lien (ex: https://site.com/video.mp4...)"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10B981] text-zinc-200 placeholder-zinc-600 font-sans"
              />
              <p className="text-[8.5px] text-zinc-500 font-sans mt-0.5 leading-tight">
                Idéal pour partager vos vidéos en ligne de façon permanente avec tout le monde !
              </p>
            </div>

            <div className="flex items-center gap-2 my-1">
              <hr className="flex-1 border-zinc-800" />
              <span className="text-[8px] text-zinc-600 font-mono font-bold uppercase tracking-widest">OU</span>
              <hr className="flex-1 border-zinc-800" />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                Pièce Jointe (Fichier local de votre appareil) 📁
              </label>
              <div className="relative group border border-dashed border-white/10 hover:border-[#10B981]/50 rounded-xl p-3 bg-zinc-950 flex flex-col items-center justify-center transition text-center cursor-pointer">
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setUploadedVideoUrl(url);
                      setUploadedVideoName(file.name);
                      setPastedVideoUrl(""); // clear pasted text link if choosing file
                      triggerToast("✅ Vidéo '" + file.name + "' attachée avec succès !");
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <span className="text-lg">📁</span>
                <span className="text-[10px] font-bold text-zinc-350 mt-1 uppercase tracking-wider">
                  Choisir un fichier vidéo
                </span>
                <span className="text-[8.5px] text-zinc-550 font-mono mt-0.5">
                  Format MP4, MOV ou WebM
                </span>
                
                {uploadedVideoName && (
                  <div className="mt-2 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/25 max-w-full truncate">
                    Attached : {uploadedVideoName}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                Mots-Clés (tags avec #)
              </label>
              <input 
                type="text" 
                value={newVideoTags}
                onChange={(e) => setNewVideoTags(e.target.value)}
                placeholder="Ex: #recolte #maraicher #benin"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10B981] text-zinc-300 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#10B981] hover:bg-emerald-500 active:scale-98 text-slate-950 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition cursor-pointer mt-2 shadow-lg shadow-emerald-500/10"
            >
              🚀 PUBLIER INSTANTANÉMENT
            </button>
          </form>

          <p className="text-[9px] text-zinc-600 font-medium font-mono text-center max-w-[200px] leading-relaxed mt-6 uppercase tracking-widest">
            Soutenu par AgriBot & la Communauté Béninoise
          </p>
        </div>


        {/* ══ S'ENREGISTRER / CREATION DE COMPTE MODAL (SLIDE-UP OVERLAY FOR REGISTERING PRODUCERS) ══ */}
        <div 
          className={`absolute inset-0 bg-black/95 backdrop-blur-lg z-50 flex flex-col items-center justify-start overflow-y-auto p-6 transition-transform duration-300 select-none ${
            showRegisterForm ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="w-full flex justify-end mt-4">
            <button 
              onClick={() => setShowRegisterForm(false)}
              className="w-9 h-9 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center text-sm cursor-pointer shadow-lg active:scale-95 hover:bg-zinc-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-center max-w-[300px] mx-auto mb-5">
            <span className="mx-auto h-12 w-12 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded-2xl flex items-center justify-center text-2xl select-none">
              🌱
            </span>
            <h3 className="text-sm font-black uppercase text-white tracking-widest font-mono">
              Créer mon Compte Producteur
            </h3>
            <p className="text-[11px] text-zinc-400 leading-normal font-sans">
              Complétez vos coordonnées pour valider votre éligibilité sur la plateforme et débloquer les droits d'agro-entrepreneur !
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!regLastName.trim() || !regFirstName.trim() || !regContact.trim() || !regSkills.trim()) {
                triggerToast("⚠️ Veuillez remplir tous les champs obligatoires.");
                return;
              }
              
              const newCvObject = {
                id: "cv_" + Math.random().toString(36).substr(2, 9),
                userId: user?.id || "guest",
                firstName: regFirstName,
                lastName: regLastName,
                type: regType,
                education: regEducation,
                specialty: regSpecialty,
                skills: regSkills,
                contact: regContact,
                createdAt: new Date().toISOString()
              };

              if (onRegisterCv) {
                onRegisterCv(newCvObject);
              }
              
              setShowRegisterForm(false);
              triggerToast("🎉 Félicitations ! Votre compte producteur a été enregistré avec tous les droits éligibles.");
            }}
            className="w-full max-w-[320px] flex flex-col gap-3 text-left font-sans text-white bg-zinc-900/60 p-4 rounded-3xl border border-white/5 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                  Prénom(s) *
                </label>
                <input 
                  type="text" 
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  placeholder="Ex: Jean"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#10B981] text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                  Nom de Famille *
                </label>
                <input 
                  type="text" 
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  placeholder="Ex: Zounmatoun"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#10B981] text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                Téléphone WhatsApp *
              </label>
              <input 
                type="text" 
                value={regContact}
                onChange={(e) => setRegContact(e.target.value)}
                placeholder="Ex: +229 97 12 34 56"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#10B981] text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                  Type de profil
                </label>
                <select 
                  value={regType}
                  onChange={(e) => setRegType(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-[#10B981] text-zinc-100"
                >
                  <option value="technician">Chef Maraîcher</option>
                  <option value="intern">Stagiaire Étudiant</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                  Niveau d'Étude
                </label>
                <input 
                  type="text" 
                  value={regEducation}
                  onChange={(e) => setRegEducation(e.target.value)}
                  placeholder="Ex: CAP Agricole"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                Spécialité Maraîchage
              </label>
              <input 
                type="text" 
                value={regSpecialty}
                onChange={(e) => setRegSpecialty(e.target.value)}
                placeholder="Ex: Piment maraîcher, Tomate bio..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#10B981] text-zinc-200"
              />
            </div>

            <div>
              <label className="block text-[9px] font-extrabold uppercase tracking-widest text-[#10B981] mb-1 font-mono">
                Compétences Clés *
              </label>
              <textarea 
                rows={2}
                value={regSkills}
                onChange={(e) => setRegSkills(e.target.value)}
                placeholder="Ex: Arrosage goutte-à-goutte, compost, semis..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#10B981] text-zinc-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#10B981] hover:bg-emerald-500 active:scale-98 text-slate-950 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition cursor-pointer mt-1 shadow-lg shadow-emerald-500/10"
            >
              ✅ CRÉER MON COMPTE ELIGIBLE
            </button>
          </form>

          <p className="text-[9px] text-zinc-650 font-medium font-mono text-center max-w-[200px] leading-relaxed mt-4 uppercase tracking-widest">
            Validation Sécurisée AgriBot Bénin
          </p>
        </div>


        {/* ══ INTEGRATED IN-APP VIDEO MEDIA PLAYER MODAL ══ */}
        {selectedVideoForModal && (
          <VideoModal
            video={selectedVideoForModal}
            isOpen={selectedVideoForModal !== null}
            onClose={() => setSelectedVideoForModal(null)}
            onTriggerToast={(msg) => triggerToast(msg)}
          />
        )}

    </div>
  );
}
