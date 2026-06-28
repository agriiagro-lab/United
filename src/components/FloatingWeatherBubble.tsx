import React, { useState, useEffect, useRef } from "react";
import { CloudSun } from "lucide-react";

interface FloatingWeatherProps {
  temp: number;
  condition: string;
  onClick: () => void;
}

export default function FloatingWeatherBubble({ temp, condition, onClick }: FloatingWeatherProps) {
  const [position, setPosition] = useState({ x: window.innerWidth - 82, y: window.innerHeight - 220 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const originalPos = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  // Load position custom constraints and keep in boundary on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 72),
        y: Math.min(prev.y, window.innerHeight - 140),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
    originalPos.current = { ...position };
    moved.current = false;
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;
    
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      moved.current = true;
    }

    const nextX = Math.max(12, Math.min(originalPos.current.x + deltaX, window.innerWidth - 72));
    const nextY = Math.max(12, Math.min(originalPos.current.y + deltaY, window.innerHeight - 140));
    
    setPosition({ x: nextX, y: nextY });
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (!moved.current) {
      onClick();
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, position]);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, position]);

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: "none"
      }}
      onMouseDown={(e) => {
        if (e.button !== 0) return; // Only left click
        handleStart(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      className={`fixed z-[9999] rounded-full flex flex-col items-center justify-center p-0.5 select-none cursor-grab active:cursor-grabbing shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-2 border-emerald-400 bg-gradient-to-br from-yellow-400 via-amber-500 to-emerald-600 transition-transform duration-200 w-16 h-16 group ${
        isDragging ? "scale-110 cursor-grabbing shadow-[0_12px_45px_rgba(0,0,0,0.4)]" : "animate-pulse"
      }`}
      id="floating-weather-head"
      title="Faites glisser n'importe où et tapez pour ouvrir la Météo Bénin"
    >
      {/* Outer Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-ping bg-amber-400/20 opacity-75 pointer-events-none"></span>

      {/* Bubble inner weather image */}
      <div className="bg-slate-950 rounded-full w-full h-full flex flex-col items-center justify-center relative overflow-hidden text-white border border-slate-900">
        <CloudSun className="h-5.5 w-5.5 text-yellow-300 animate-pulse mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-black font-mono leading-none tracking-tight text-white mb-1.5">
          {temp}°C
        </span>
        <span className="absolute bottom-0 text-[6.5px] uppercase font-black text-emerald-300 tracking-widest bg-emerald-950/90 w-full py-0.5 text-center truncate">
          💡 MÉTÉO
        </span>
      </div>
    </div>
  );
}
