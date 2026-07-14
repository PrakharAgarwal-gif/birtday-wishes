"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LandingScreenProps {
  onOpen: () => void;
}

export default function LandingScreen({ onOpen }: LandingScreenProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Step 0: Dark screen. After 2 seconds, show text (Step 1).
    const timer1 = setTimeout(() => setStep(1), 2000);
    // After 5 seconds, show button (Step 2).
    const timer2 = setTimeout(() => setStep(2), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white selection:bg-pink-500/30 overflow-hidden">
      {/* Background soft glow that appears when button appears */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-black to-black"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          {step >= 1 && (
            <motion.h1
              key="text"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-2xl md:text-4xl font-light tracking-wider text-glow font-outfit"
            >
              Someone has a surprise for you...
            </motion.h1>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 2 && (
            <motion.button
              key="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 113, 154, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 1, duration: 1 }}
              onClick={onOpen}
              className="mt-12 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-white/20 transition-colors"
            >
              Open Your Birthday Surprise
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
