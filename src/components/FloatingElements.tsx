"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const elements = ["✨", "💖", "🎈", "🌟", "🎉"];

export default function FloatingElements() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; type: string }[]>([]);

  useEffect(() => {
    // Generate random particles
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      delay: Math.random() * 5,
      type: elements[Math.floor(Math.random() * elements.length)],
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "110vh", opacity: 0, x: `${p.x}vw` }}
          animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute text-2xl md:text-3xl opacity-30"
        >
          {p.type}
        </motion.div>
      ))}
    </div>
  );
}
