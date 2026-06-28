import React, { useState, useEffect, useRef } from "react";
import { parseVideoUrl } from "../utils/videoHelper";
import { 
  Play, 
  Pause, 
  Bookmark, 
  UserPlus, 
  X, 
  Volume2, 
  VolumeX, 
  Share2, 
  Heart, 
  MessageCircle, 
  Check, 
  Award, 
  Clock, 
  BookOpen
} from "lucide-react";

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
  // Added metadata fields for the tutorial view
  stepsNum?: number;
  durationMin?: number;
  levelStr?: string;
}

interface VideoModalProps {
  video: VideoItem;
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
}

export default function VideoModal({ video, isOpen, onClose, onTriggerToast }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCreatedAcct, setIsCreatedAcct] = useState<boolean>(false);
  
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setCurrentTime(0);
      if (videoPlayerRef.current) {
        videoPlayerRef.current.currentTime = 0;
        videoPlayerRef.current.play().catch(() => {});
      }
    }
  }, [isOpen, video]);

  if (!isOpen) return null;

  const handlePlayPause = () => {
    if (videoPlayerRef.current) {
      if (isPlaying) {
        videoPlayerRef.current.pause();
      } else {
        videoPlayerRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoPlayerRef.current) {
      setCurrentTime(videoPlayerRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoPlayerRef.current) {
      setDuration(videoPlayerRef.current.duration);
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = newTime;
    }
  };

  const handleSaveFiche = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      onTriggerToast("💾 Fiche de " + video.cname + " sauvegardée avec succès !");
    } else {
      onTriggerToast("🗑️ Fiche retirée de vos sauvegardes.");
    }
  };

  const handleCreateAccount = () => {
    setIsCreatedAcct(true);
    onTriggerToast("🎉 Félicitations ! Votre compte gratuit AgriBot est activé.");
  };

  const formattedTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Default mock fallback loops if local server files are down
  const videoSourceUrl = video.nativeUrl || "https://assets.mixkit.co/videos/preview/mixkit-watering-plants-in-a-greenhouse-with-hose-42043-large.mp4";
  const srcInfo = parseVideoUrl(videoSourceUrl);

  return (
    <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-end text-white select-none">
      
      {/* Absolute top action header */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#10b981]/25 border border-[#10b981]/40 flex items-center justify-center text-emerald-400 font-extrabold text-xs">
            🌿
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">Lecteur Officiel</h4>
            <span className="text-[9px] text-zinc-400 uppercase font-bold font-mono tracking-widest">Conseil National Technologique</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-10 h-10 bg-black/50 hover:bg-black/80 border border-zinc-800/80 text-zinc-300 rounded-full flex items-center justify-center text-xs backdrop-blur-md cursor-pointer transition active:scale-90"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main video area with relative background gradients */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group">
        {srcInfo.isEmbed ? (
          <iframe
            src={srcInfo.url}
            className="w-full h-full object-cover border-0 z-0 pointer-events-auto"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={video.desc}
          />
        ) : (
          <video
            ref={videoPlayerRef}
            src={srcInfo.url}
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-cover pointer-events-auto"
            onClick={handlePlayPause}
          />
        )}

        {/* Video Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/45 pointer-events-none" />

        {/* Big centered play/pause bubble indicator on state change */}
        {!isPlaying && !srcInfo.isEmbed && (
          <button 
            onClick={handlePlayPause}
            className="absolute p-5 rounded-full bg-black/70 border border-white/10 hover:bg-black text-emerald-400 shadow-2xl transition active:scale-90 z-10 cursor-pointer"
          >
            <Play className="h-8 w-8 fill-emerald-400" />
          </button>
        )}

        {/* Interactive Player Controls overlay at bottom of screen image */}
        <div className="absolute bottom-28 left-4 right-4 z-10 space-y-3.5 pointer-events-auto bg-black/25 p-3 rounded-2xl backdrop-blur-xs border border-white/5">
          {/* Custom micro-progress slider */}
          {!srcInfo.isEmbed && (
            <div className="flex items-center gap-3.5">
              <span className="text-[9.5px] font-mono text-zinc-300 font-bold">{formattedTime(currentTime)}</span>
              <input 
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleTimelineChange}
                className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
              />
              <span className="text-[9.5px] font-mono text-zinc-300 font-bold">{formattedTime(duration || 15)}</span>

              {/* Mute and playback controls */}
              <button 
                onClick={handleToggleMute}
                className="text-zinc-200 hover:text-white transition active:scale-90 cursor-pointer"
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
              </button>
            </div>
          )}

          {/* Core Content Presentation Metas */}
          <div className="text-left space-y-1.5">
            <div className="flex items-center gap-1.5 select-none">
              <span className="bg-[#10b981]/25 border border-[#10b981]/40 text-[#10b981] rounded px-1.5 py-0.25 text-[8.5px] font-mono font-black tracking-widest uppercase flex items-center gap-1">
                🌿 AGRIBOT SHORTS
              </span>
              <span className="text-[9.5px] text-zinc-400 font-bold font-mono uppercase tracking-wider">{video.creator}</span>
            </div>

            <h3 className="text-sm font-black tracking-tight text-white leading-snug">
              {video.desc}
            </h3>

            {/* HIGH CONVERSION METRIC METADATA GREEN LABEL */}
            <div className="text-[#10b981] text-[10.5px] font-extrabold tracking-wide flex items-center gap-1.5 font-sans">
              <Award className="h-3.5 w-3.5 shrink-0" />
              <span>
                {video.stepsNum || 3} étapes • {video.durationMin || 4} min • Niveau {video.levelStr || "Débutant"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ STICKY BOT CONVERSION ACQUISITION CTA DECK ══ */}
      <div className="bg-zinc-950 border-t border-zinc-900 px-4 py-4.5 pb-6 space-y-3 z-10 relative">
        <p className="text-[9.5px] text-zinc-400 font-semibold tracking-wide uppercase font-mono text-center">
          ⚡ Enregistrez le Guide Technique pour y avoir accès hors-ligne
        </p>

        <div className="grid grid-cols-2 gap-3 pb-1">
          {/* Action 1: Save Tutorial Card */}
          <button
            onClick={handleSaveFiche}
            className={`py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
              isSaved
                ? "bg-emerald-950 border border-emerald-500 text-emerald-400"
                : "bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-850"
            }`}
          >
            <Bookmark className={`h-4.5 w-4.5 ${isSaved ? "fill-emerald-400 text-emerald-400" : "text-zinc-400"}`} />
            <span>{isSaved ? "Fiche Sauvegardée" : "Sauvegarder la Fiche"}</span>
          </button>

          {/* Action 2: Premium Registration Call */}
          <button
            onClick={handleCreateAccount}
            className={`py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md ${
              isCreatedAcct
                ? "bg-zinc-900 border border-emerald-500/20 text-emerald-400"
                : "bg-emerald-600 hover:bg-emerald-500 text-slate-950"
            }`}
          >
            {isCreatedAcct ? (
              <>
                <Check className="h-4.5 w-4.5" />
                <span>Compte Activé</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4.5 w-4.5" />
                <span>Créer mon Compte Gratuit</span>
              </>
            )}
          </button>
        </div>

        <div className="flex justify-center items-center gap-1.5 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[8px] text-zinc-500 font-extrabold uppercase font-mono tracking-widest text-center">
            Rejoint par +12,400 exploitants béninois d'avenir • Soutenu par ATDA Bénin
          </span>
        </div>
      </div>

    </div>
  );
}
