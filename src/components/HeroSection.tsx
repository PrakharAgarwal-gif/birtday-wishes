"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useConfig } from "@/app/ConfigContext";

export default function HeroSection() {
  const config = useConfig();
  const [candlesBlown, setCandlesBlown] = useState(false);

  const handleCakeClick = () => {
    if (!candlesBlown) {
      setCandlesBlown(true);
      
      // Firework effect
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <h2 className="text-3xl md:text-5xl font-inter text-gray-200 mb-4 tracking-wide">
          Happy Birthday,
        </h2>
        <h1 className="text-6xl md:text-9xl font-outfit font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-glow mb-8 drop-shadow-2xl">
          {config.recipient.name}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
          Today is your special day! {config.messages.personalMessage}
        </p>
      </motion.div>

      {/* Interactive CSS Cake */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="mt-32 relative cursor-pointer group z-10"
        onClick={handleCakeClick}
      >
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-4">
          {/* Candles */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative w-4 h-16 bg-gradient-to-b from-white to-pink-200 rounded-sm shadow-inner">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-gray-800"></div>
              {/* Flame */}
              {!candlesBlown && (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 0.9, 1],
                    rotate: [0, -5, 5, 0],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full blur-[1px] origin-bottom shadow-[0_0_20px_rgba(255,165,0,0.8)]"
                  style={{ borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%" }}
                />
              )}
              {/* Smoke (after blown out) */}
              {candlesBlown && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.5, 0], y: -50, scale: 1.5, x: (i - 1) * 20 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full blur-md"
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Cake Tiers */}
        <div className="relative">
          {/* Top Tier */}
          <div className="w-48 h-20 bg-pink-400 rounded-t-xl mx-auto shadow-inner relative border-b-4 border-pink-500">
             {/* Frosting drips */}
             <div className="absolute -bottom-4 left-4 w-6 h-8 bg-pink-200 rounded-b-full"></div>
             <div className="absolute -bottom-6 left-16 w-8 h-12 bg-pink-200 rounded-b-full"></div>
             <div className="absolute -bottom-3 left-32 w-5 h-6 bg-pink-200 rounded-b-full"></div>
          </div>
          {/* Middle Tier */}
          <div className="w-64 h-24 bg-[#ff9ec4] mx-auto shadow-inner border-b-4 border-pink-500 rounded-t-lg relative">
             <div className="absolute top-1/2 left-0 w-full h-4 bg-pink-300"></div> {/* stripe */}
          </div>
          {/* Bottom Tier */}
          <div className="w-80 h-32 bg-[#ffb6d3] rounded-b-xl shadow-2xl relative overflow-hidden">
             <div className="absolute bottom-4 left-0 w-full flex justify-around">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="w-6 h-6 bg-pink-300 rounded-full shadow-inner"></div>
               ))}
             </div>
          </div>
          {/* Plate */}
          <div className="w-96 h-8 bg-gray-200 rounded-[50%] mx-auto -mt-4 shadow-xl border-b-4 border-gray-400"></div>
        </div>

        {!candlesBlown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-white/70 tracking-widest uppercase text-sm font-light flex flex-col items-center gap-2"
          >
            <span>Make a wish and click the cake</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              👇
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
