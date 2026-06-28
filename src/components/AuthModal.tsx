import React, { useState, useEffect } from "react";
import { User } from "../types";
import { Lock, Mail, UserCheck, UserPlus, KeyRound, AlertTriangle } from "lucide-react";

interface AuthModalProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showRecover, setShowRecover] = useState<boolean>(false);
  const [recoverInput, setRecoverInput] = useState("");
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTime, setLockoutTime] = useState<number>(0); // in seconds
  const [sharedVideo, setSharedVideo] = useState<any>(null);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);

  const [registerStep, setRegisterStep] = useState<number>(1);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [demoOtpNotification, setDemoOtpNotification] = useState<string | null>(null);

  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("resetToken");
    if (token) {
      setResetToken(token);
      setShowResetForm(true);
      setShowRecover(false);
      setIsLogin(false);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoSharedId = urlParams.get("videoShared");
    if (videoSharedId) {
      setVideoLoading(true);
      // Directly propose to sign up/register
      setIsLogin(false);
      fetch(`/api/videos/${videoSharedId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.video) {
            setSharedVideo(data.video);
          }
        })
        .catch((err) => console.warn(err))
        .finally(() => setVideoLoading(false));
    }
  }, []);

  useEffect(() => {
    if (sharedVideo) {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [sharedVideo]);

  useEffect(() => {
    // Check if locked
    const lockedUntil = localStorage.getItem("auth_locked_until");
    if (lockedUntil) {
      const remaining = Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 1000);
      if (remaining > 0) {
        setLockoutTime(remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("auth_locked_until");
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const getLocalUsers = (): any[] => {
    try {
      const u = localStorage.getItem("agribot_users_list");
      return u ? JSON.parse(u) : [];
    } catch {
      return [];
    }
  };

  const saveLocalUser = (usr: any) => {
    try {
      const list = getLocalUsers();
      const exists = list.some((u: any) => u.id === usr.id || u.username.toLowerCase() === usr.username.toLowerCase());
      if (!exists) {
        list.push(usr);
        localStorage.setItem("agribot_users_list", JSON.stringify(list));
      } else {
        // Update user (e.g. premium status changes)
        const updatedList = list.map((u: any) => {
          if (u.id === usr.id || u.username.toLowerCase() === usr.username.toLowerCase()) {
            return { ...u, ...usr };
          }
          return u;
        });
        localStorage.setItem("agribot_users_list", JSON.stringify(updatedList));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setDemoOtpNotification(null);
    setOtpLoading(true);

    if (!email || !email.includes("@")) {
      setError("Veuillez saisir une adresse e-mail valide.");
      setOtpLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi du code.");
        return;
      }

      setSuccessMsg("Code OTP envoyé ! Veuillez insérer ci-dessous le code de validation reçu.");
      if (data.demoOtp) {
        setDemoOtpNotification(`[Bac de sable] Code OTP envoyé par message : ${data.demoOtp}`);
      }
      setRegisterStep(2);
    } catch (err) {
      setError("Erreur réseau pour l'envoi OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setOtpLoading(true);

    if (!otpCode || otpCode.trim().length !== 6) {
      setError("Veuillez saisir le code OTP à 6 chiffres.");
      setOtpLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Code OTP erroné ou expiré.");
        return;
      }

      setSuccessMsg("E-mail vérifié avec succès ! Veuillez composer vos accès.");
      setDemoOtpNotification(null);
      setRegisterStep(3);
    } catch (err) {
      setError("Erreur de connexion lors de la validation.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword.length !== 5 || !/^[a-zA-Z0-9]+$/.test(newPassword)) {
      setError("Le code doit faire exactement 5 caractères alphanumériques.");
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Lien de secours invalide ou consommé.");
        return;
      }

      setSuccessMsg("✨ Mot de passe configuré avec succès ! Connectez-vous dès à présent !");
      setShowResetForm(false);
      setIsLogin(true);
      window.history.replaceState({}, document.title, "/");
    } catch (err) {
      setError("Erreur réseau lors de la mise à jour.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuggestions([]);

    if (!email || !firstName || !lastName || !username || !password) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    if (password.length !== 5 || !/^[a-zA-Z0-9]+$/.test(password)) {
      setError("Le mot de passe doit faire exactement 5 caractères alphanumériques (lettres et chiffres uniquement).");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setError(data.error);
          setSuggestions(data.suggestions || []);
        } else {
          setError(data.error || "Erreur lors de l'enregistrement.");
        }
        return;
      }

      saveLocalUser(data.user);
      localStorage.setItem("agribot_active_user", JSON.stringify(data.user));
      setSuccessMsg(`Votre compte agro-entrepreneur @${data.user.username} a été créé avec succès !`);
      setTimeout(() => {
        onAuthSuccess(data.user);
      }, 1500);
    } catch (err) {
      setError("Erreur d'inscription en ligne.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lockoutTime > 0) {
      setError(`Veuillez patienter ${Math.ceil(lockoutTime)} secondes avant de réessayer.`);
      return;
    }

    if (!username || !password) {
      setError("Identifiant et mot de passe requis.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        
        if (nextFailed >= 5 || res.status === 429) {
          const timeout = 60;
          const unlockTime = new Date(Date.now() + timeout * 1000);
          localStorage.setItem("auth_locked_until", unlockTime.toISOString());
          setLockoutTime(timeout);
          setError("🔑 Protection anti-force brute activée : Connexions bloquées pour 60 secondes.");
        } else {
          setError(data.error || "Vos identifiants de connexion sont incorrects.");
        }
        return;
      }

      saveLocalUser(data.user);
      localStorage.setItem("agribot_active_user", JSON.stringify(data.user));
      setSuccessMsg("✨ Connexion réussie ! Chargement de la ferme...");
      setTimeout(() => {
        onAuthSuccess(data.user);
      }, 1000);
    } catch (err) {
      setError("Erreur de liaison réseau.");
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanInput = recoverInput.trim();
    if (!cleanInput || !cleanInput.includes("@")) {
      setError("Veuillez saisir votre adresse e-mail de récupération.");
      return;
    }

    try {
      const res = await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de la récupération.");
        return;
      }

      setSuccessMsg(data.message);
      if (data.demoResetToken) {
        setDemoOtpNotification(`[Bac de sable] Lien de secours généré : /?resetToken=${data.demoResetToken}`);
      }
    } catch (err) {
      setError("Erreur réseau lors de la récupération.");
    }
  };

  const backgroundDoodles = React.useMemo(() => {
    // Generate a clean grid of doodles with random rotations and scales for WhatsApp doodle aesthetic
    const doodles = [];
    const seedEmojis = [
      // paysages, campagne
      "🌄", "🏞️", "🌅", "🏡", "🌳", "🌾", "🌻", "🌿", "🛖",
      // animaux, volailles, mammifères
      "🐄", "🐐", "🐑", "🐎", "🐓", "🐤", "🦆", "🐖", "🐝",
      // légumes feuilles/fruits/racines
      "🥬", "🍅", "🥕", "🧅", "🥔", "🍍", "🌽", "🥑",
      // irrigation
      "💧", "⛲", "🌧️",
      // équipements agricoles
      "🚜", "⚙️", "🔧", "🪓",
      // argent, mines d'or
      "💵", "🪙", "💰", "⛏️", "💎"
    ];
    for (let i = 0; i < 90; i++) {
      const emoji = seedEmojis[i % seedEmojis.length];
      const rotation = (i * 17) % 360;
      const scale = 0.82 + (i % 4) * 0.12;
      doodles.push({ emoji, rotation, scale, id: i });
    }
    return doodles;
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07140b] p-3 overflow-y-auto">
      {/* WhatsApp-Style Engraved Agricultural Caricatures Pattern with Floating Animation */}
      <div className="absolute inset-0 grid grid-cols-5 sm:grid-cols-10 gap-x-6 gap-y-12 p-6 pointer-events-none opacity-[0.06] select-none overflow-hidden">
        {backgroundDoodles.map((d) => (
          <div 
            key={d.id} 
            className="flex items-center justify-center text-3xl sm:text-4xl filter grayscale contrast-200"
            style={{ 
              animation: `floatAndGlow ${6 + (d.id % 5) * 3}s ease-in-out infinite alternate`,
              animationDelay: `${(d.id % 7) * 0.4}s`
            }}
          >
            <div style={{ transform: `rotate(${d.rotation}deg) scale(${d.scale})` }}>
              {d.emoji}
            </div>
          </div>
        ))}
      </div>

      <div className={`w-full ${sharedVideo ? "max-w-4xl" : "max-w-sm"} bg-white rounded-3xl shadow-2xl border border-emerald-950/20 overflow-hidden transform animate-fade-in flex flex-col md:flex-row relative z-10 mr-0.5 ml-0.5`}>
        
        {/* Left Column: Shared Video Player for Guest Acquisition */}
        {sharedVideo && (
          <div className="w-full md:w-1/2 bg-[#0a110b] text-zinc-300 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-emerald-950 text-left">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎬</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#2ecc71] font-mono">Vidéo d'Agro-vulgarisation</span>
              </div>
              <h2 className="text-base font-black text-white leading-snug mb-1">
                {sharedVideo.titre}
              </h2>
              <p className="text-[11px] text-zinc-400 mb-3.5 leading-tight">
                Présentée par <strong className="text-amber-400 font-bold">{sharedVideo.auteur}</strong> dans la rubrique <span className="bg-emerald-950 border border-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold">{sharedVideo.categorie}</span>
              </p>

              {/* Sandboxed TikTok video frame */}
              <div className="w-full flex items-center justify-center bg-black/45 rounded-2xl p-2 border border-emerald-950/60 min-h-[300px] overflow-hidden leading-none">
                <div className="w-full flex justify-center" dangerouslySetInnerHTML={{ __html: sharedVideo.embed_html }} />
              </div>
            </div>

            {/* Premium CTA propose directly to sign up */}
            <div className="mt-4 pt-4 border-t border-emerald-900/30">
              <div className="bg-[#101e13] border border-[#27ae60]/30 rounded-2xl p-4 text-left">
                <p className="text-xs text-white font-extrabold leading-normal">
                  🌾 Envie de voir d'autres vidéos techniques ?
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                  Inscrivez-vous directement sur la plateforme pour interroger l'assistant AgriBot IA, consulter les fiches techniques du Bénin, et sauvegarder vos tutoriels favoris !
                </p>
                <div className="flex items-center gap-2 mt-3 text-emerald-400 text-[10px] font-bold uppercase font-mono tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>S'inscrire sur la plateforme</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column containing original forms */}
        <div className={`w-full ${sharedVideo ? "md:w-1/2" : ""}`}>
          
          {/* Banner with True Logo */}
          <div className="bg-gradient-to-b from-[#091b10] to-[#0c2415] border-b border-[#27ae60]/15 px-5 py-6 text-white text-center flex flex-col items-center relative overflow-hidden">
            
            {/* Logo positionné au bon milieu avec halo de mouvement de chargement (loading rotation) */}
            <div className="relative mb-3 flex items-center justify-center">
              {/* Outer Circular Loading Orbit */}
              <div className="absolute w-[68px] h-[68px] rounded-full border-2 border-emerald-500/25 border-t-[#27ae60] border-l-[#27ae60] animate-spin" style={{ animationDuration: '3s' }}></div>
              {/* Inner Logo container, perfect aspect-ratio to prevent "very stretched / très tiré" visual */}
              <div className="w-14 h-14 rounded-full bg-[#072513] border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-lg overflow-hidden relative z-10 animate-pulse">
                <img 
                  src="/logo_agribot.png" 
                  alt="Logo AgriBot" 
                  className="w-10 h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h2 className="text-base font-black font-display tracking-tight text-white uppercase">Portail AgriBot Mine d'Or</h2>
            <p className="text-[#1eec6d] font-bold font-mono text-[9px] mt-0.5 uppercase tracking-widest">
              Réseau d'Agro-vulgarisation de la plateforme
            </p>

            {/* Caricature drôle et chaleureuse du portail */}
            <div className="mt-4 w-full max-w-[260px] rounded-xl overflow-hidden border border-emerald-500/25 shadow-md bg-emerald-950/40 p-1 animate-scale-in">
              <img 
                src="/src/assets/images/portal_caricature_1781622722962.jpg" 
                alt="Caricature AgriBot" 
                className="w-full h-auto object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
              <p className="text-[8.5px] italic text-emerald-300/90 mt-1 font-sans">
                🤖 AgriBot au service des producteurs béninois !
              </p>
            </div>
          </div>

        {/* Dynamic Alerts */}
        <div className="p-4 space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs flex gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                {suggestions.length > 0 && (
                  <div className="mt-2 text-red-900">
                    <p className="font-medium underline">Suggestions d'identifiants disponibles :</p>
                    <ul className="list-disc pl-4 mt-1 space-y-1 font-mono">
                      {suggestions.map((s) => (
                        <li key={s} className="cursor-pointer font-bold hover:underline" onClick={() => setUsername(s)}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-xs font-medium">
              {successMsg}
            </div>
          )}

          {demoOtpNotification && (
            <div className="p-3 bg-sky-50 border-l-4 border-sky-500 rounded text-sky-800 text-xs font-mono font-bold">
              {demoOtpNotification}
            </div>
          )}

          {showResetForm ? (
            /* PASSWORD RESET FORM */
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-0.5 text-emerald-700">Configurer Nouveau Mot de Passe</h3>
              <div className="p-3 bg-slate-50 border rounded-lg text-[10.5px] text-slate-600 mb-2 font-mono">
                Saisissez votre nouveau mot de passe à 5 caractères pour enregistrer vos accès sécurisés.
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5 font-display text-emerald-700">Nouveau mot de passe (5 car.)</label>
                <div className="relative">
                  <KeyRound className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    maxLength={5}
                    placeholder="Ex: 5a7b8"
                    className="w-full pl-8 pr-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-mono"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Sauvegarder le mot de passe
              </button>

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => { setShowResetForm(false); setIsLogin(true); setError(null); }}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Annuler et retourner à la connexion
                </button>
              </div>
            </form>
          ) : showRecover ? (
            /* RECOVER ACCÈS FORM */
            <form onSubmit={handleRecover} className="space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-0.5 text-emerald-700">Récupérer mes accès</h3>
              <p className="text-[10.5px] text-slate-500 leading-normal font-mono">
                Saisissez votre adresse e-mail liée. Un lien de réinitialisation unique de 15 minutes sera envoyé.
              </p>
              
              <div>
                <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1">Votre Adresse E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: yao@gmail.com"
                  className="w-full px-3 py-1.5 border rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                  value={recoverInput}
                  onChange={(e) => setRecoverInput(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Retrouver mes identifiants
              </button>

              <div className="text-center mt-2.5">
                <button
                  type="button"
                  onClick={() => { setShowRecover(false); setError(null); setDemoOtpNotification(null); }}
                  className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          ) : isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5 font-display">Votre Identifiant</label>
                <div className="relative">
                  <UserCheck className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    disabled={lockoutTime > 0}
                    placeholder="Saisissez votre identifiant"
                    className="w-full pl-8 pr-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5 font-display">Mot de passe secret</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    disabled={lockoutTime > 0}
                    placeholder="Saisissez votre Code"
                    className="w-full pl-8 pr-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={lockoutTime > 0}
                className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {lockoutTime > 0 ? `Verrouillé (${Math.ceil(lockoutTime)}s)` : "Entrer dans l'application"}
              </button>

              <div className="flex flex-col gap-2 mt-3 pt-2.5 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => { setShowRecover(true); setError(null); }}
                  className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-[10.5px] uppercase tracking-wide transition shadow-xs cursor-pointer"
                >
                  🔑 IDENTIFIANT OU MOT DE PASSE OUBLIÉ ?
                </button>
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setRegisterStep(1); setError(null); }}
                    className="text-xs font-black text-emerald-700 hover:underline cursor-pointer"
                  >
                    S'inscrire (Essai gratuit de 14 jours)
                  </button>
                </div>
              </div>
            </form>
          ) : registerStep === 1 ? (
            /* STEP 1: INPUT EMAIL */
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-lg text-[11px] text-emerald-800 leading-relaxed border border-emerald-100">
                🚀 <strong>Étape 1 sur 3</strong> : Saisissez votre adresse e-mail. Un code unique de sécurité vous sera immédiatement adressé pour sécuriser votre accès.
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Adresse E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Ex: yao@gmail.com"
                    className="w-full pl-8 pr-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {otpLoading ? "Envoi du code OTP..." : "Recevoir mon code OTP"}
              </button>

              <div className="text-center pt-1.5 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(null); }}
                  className="text-[11px] font-bold text-slate-600 hover:text-emerald-600 hover:underline"
                >
                  Déjà membre ? Se connecter ici
                </button>
              </div>
            </form>
          ) : registerStep === 2 ? (
            /* STEP 2: CHECK OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-lg text-[11px] text-emerald-800 leading-relaxed border border-emerald-100">
                🔑 <strong>Étape 2 sur 3</strong> : Veuillez saisir le code OTP à 6 chiffres envoyé à l'adresse <strong>{email}</strong>.
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Code de validation OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Saisissez les 6 chiffres"
                    className="w-full pl-8 pr-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-mono text-center tracking-[0.25em]"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50 font-mono"
              >
                {otpLoading ? "Vérification..." : "Vérifier le code OTP"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setRegisterStep(1); setError(null); setDemoOtpNotification(null); }}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Modifier e-mail de validation
                </button>
              </div>
            </form>
          ) : (
            /* STEP 3: SUBMIT ACCOUNT PROFILE WITH OPT LOCKED */
            <form onSubmit={handleRegister} className="space-y-2.5">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-[11px] text-emerald-800 leading-relaxed border border-emerald-100">
                🎉 <strong>Étape 3 sur 3</strong> : E-mail <strong>{email}</strong> validé ! Remplissez les champs de profil ci-dessous.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Prénom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Yao"
                    className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Nom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gandonou"
                    className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5 text-emerald-700">Identifiant de Connexion</label>
                <div className="relative">
                  <UserPlus className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: yao_ferme"
                    className="w-full pl-8 pr-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5 text-emerald-700">Mot de passe d'accès (5 car.)</label>
                <div className="relative">
                  <KeyRound className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="Ex: 5a7b8"
                    className="w-full pl-8 pr-2.5 py-1.5 border rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 font-mono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
              >
                Créer mon compte & Lancer l'App
              </button>

              <p className="text-[9px] text-gray-500 text-center uppercase font-mono mt-1">
                🔐 Accès sécurisés et hachés cryptographiquement.
              </p>
            </form>
          )}

        </div>
        </div>
      </div>

      {/* portal visual text footer */}
      <div className="mt-5 text-center z-10 relative pointer-events-none select-none max-w-[90%] transform transition hover:scale-105 duration-300">
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#2ecc71] font-mono bg-[#0c2415]/90 px-4 py-2 rounded-2xl border border-[#27ae60]/30 shadow-2xl leading-snug animate-pulse">
          ✨ Portail AGRIBOT MINE D’OR - Plateforme agroécologie du Bénin ✨
        </p>
      </div>

    </div>
  );
}
