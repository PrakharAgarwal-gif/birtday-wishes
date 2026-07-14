"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { useConfig } from "@/app/ConfigContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MusicPlayer() {
  const config = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Attempt auto-play when component mounts (many browsers block this until interaction, but we can try)
  useEffect(() => {
    const tryPlay = () => {
      setIsPlaying(true);
      document.removeEventListener("click", tryPlay);
    };
    document.addEventListener("click", tryPlay);
    return () => document.removeEventListener("click", tryPlay);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50">
      <audio ref={audioRef} src={config.media.music} loop />

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg overflow-hidden"
            >
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-pink-300 transition">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-pink-300 transition">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowControls(!showControls)}
          className={`p-3 rounded-full shadow-lg backdrop-blur-md border border-white/20 transition-colors ${
            isPlaying ? "bg-pink-500 text-white" : "bg-white/10 text-gray-300"
          }`}
        >
          <Music size={24} className={isPlaying ? "animate-pulse" : ""} />
        </motion.button>
      </div>
    </div>
  );
}
