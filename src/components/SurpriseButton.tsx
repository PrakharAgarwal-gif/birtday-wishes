"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, X } from "lucide-react";
import { useConfig } from "@/app/ConfigContext";

export default function SurpriseButton() {
  const config = useConfig();
  const [showQuote, setShowQuote] = useState<string | null>(null);

  const triggerSurprise = () => {
    const surprises = ["confetti", "fireworks", "quote"];
    const random = surprises[Math.floor(Math.random() * surprises.length)];

    if (random === "confetti") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (random === "fireworks") {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    } else if (random === "quote") {
      const randomQuote = config.quotes[Math.floor(Math.random() * config.quotes.length)];
      setShowQuote(randomQuote);
      setTimeout(() => setShowQuote(null), 4000);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={triggerSurprise}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white shadow-[0_0_20px_rgba(255,113,154,0.6)] hover:shadow-[0_0_30px_rgba(255,113,154,0.8)] transition-shadow"
      >
        <Sparkles size={24} />
      </motion.button>

      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 max-w-xs glass p-4 rounded-xl shadow-2xl border border-white/20"
          >
            <button 
              onClick={() => setShowQuote(null)}
              className="absolute top-2 right-2 text-white/50 hover:text-white"
            >
              <X size={16} />
            </button>
            <p className="text-white font-inter italic pr-4">"{showQuote}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
