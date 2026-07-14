"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "@/app/ConfigContext";
import confetti from "canvas-confetti";
import { Gift } from "lucide-react";

export default function GiftSection() {
  const config = useConfig();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5, x: 0.5 },
        colors: ["#fbbf24", "#f59e0b", "#fff", "#ff719a"],
        shapes: ["star", "circle"]
      });
    }
  };

  return (
    <section className="py-24 px-4 min-h-screen flex flex-col items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-black/50 bg-blend-overlay">
      <h2 className="text-3xl md:text-5xl font-outfit text-white mb-16 text-center text-glow">
        Your Special Gift
      </h2>

      <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="box"
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={handleOpen}
              className="cursor-pointer group relative flex flex-col items-center justify-center w-64 h-64"
            >
              {/* Gift Box animation */}
              <motion.div
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                className="relative w-48 h-48 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden border-2 border-pink-400"
              >
                {/* Ribbon Vertical */}
                <div className="absolute w-12 h-full bg-yellow-400 shadow-[0_0_10px_rgba(0,0,0,0.2)]" />
                {/* Ribbon Horizontal */}
                <div className="absolute h-12 w-full bg-yellow-400 shadow-[0_0_10px_rgba(0,0,0,0.2)]" />
                
                {/* Top Bow */}
                <div className="absolute -top-6 text-yellow-400 drop-shadow-lg">
                  <Gift size={64} strokeWidth={1} fill="currentColor" />
                </div>
              </motion.div>
              
              <p className="mt-8 text-pink-200 font-inter font-medium tracking-widest uppercase animate-pulse">
                Click to Open
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="glass p-10 rounded-3xl text-center shadow-[0_0_50px_rgba(255,113,154,0.3)] border border-pink-500/30 w-full"
            >
              <div className="text-6xl mb-6">🎁</div>
              <h3 className="text-2xl md:text-3xl font-outfit text-white mb-4">
                Surprise!
              </h3>
              <p className="text-xl text-pink-200 font-inter leading-relaxed">
                {config.messages.giftMessage}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-pink-500/50 transition-shadow"
              >
                Claim Now
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
