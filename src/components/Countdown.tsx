"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/app/ConfigContext";

interface CountdownProps {
  daysLeft: number;
}

export default function Countdown({ daysLeft }: CountdownProps) {
  const config = useConfig();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0f0c29] text-white overflow-hidden relative">
      {/* Background Particles Placeholder */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center flex flex-col items-center glass p-12 rounded-3xl"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <h2 className="text-2xl md:text-3xl text-gray-300 font-inter mb-4 uppercase tracking-[0.2em]">
            Almost Time for
          </h2>
          <h1 className="text-5xl md:text-7xl font-outfit font-bold text-glow-primary mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
            {config.recipient.name}'s Birthday
          </h1>
        </motion.div>

        <div className="flex items-center gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-6xl md:text-8xl font-bold font-inter text-white text-glow shadow-sm">
              {daysLeft}
            </span>
            <span className="text-xl text-gray-400 mt-2 uppercase tracking-widest">
              Days Left
            </span>
          </div>
        </div>

        <p className="mt-8 text-gray-400 max-w-md text-center italic">
          "The best is yet to come. Hang tight!"
        </p>
      </motion.div>
    </div>
  );
}
