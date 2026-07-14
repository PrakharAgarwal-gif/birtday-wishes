"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { config } from "@/config";

export default function ProfilePhoto() {
  const photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"; // Placeholder profile

  const handlePhotoClick = () => {
    // Random celebration effect
    const random = Math.floor(Math.random() * 3);
    
    if (random === 0) {
      // Golden hearts/stars
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#fbbf24", "#fcd34d", "#fff"],
        shapes: ["star"],
        gravity: 0.8
      });
    } else if (random === 1) {
      // Flower petals (pink/red circles)
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.3 },
        colors: ["#f472b6", "#fb7185", "#e879f9"],
        shapes: ["circle"],
        gravity: 0.5,
        scalar: 1.2
      });
    } else {
      // Classic fireworks
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
      }, 250);
    }
  };

  return (
    <section className="py-20 flex flex-col items-center justify-center relative z-20">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePhotoClick}
        className="relative cursor-pointer group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
        <img
          src={photoUrl}
          alt={config.recipient.name}
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white/20 shadow-2xl z-10"
        />
        
        <motion.div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-inter whitespace-nowrap border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ y: 10 }}
          whileHover={{ y: 0 }}
        >
          Tap me ✨
        </motion.div>
      </motion.div>
      
      <p className="text-pink-300 mt-12 font-outfit text-xl italic opacity-80">
        You are the most special person today.
      </p>
    </section>
  );
}
