"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/app/ConfigContext";

export default function MemoryTimeline() {
  const config = useConfig();
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[var(--background)] to-[#1a1235] relative overflow-hidden">
      <h2 className="text-3xl md:text-5xl font-outfit text-white mb-20 text-center text-glow">
        Our Memories
      </h2>

      <div className="max-w-4xl mx-auto relative">
        {/* The central line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-pink-500/30 transform md:-translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(255,113,154,0.5)]"></div>

        {config.timeline.map((memory: any, index: number) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className={`relative flex items-center mb-16 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              } flex-col md:justify-between`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-pink-400 rounded-full border-4 border-black transform -translate-x-[6px] md:-translate-x-1/2 mt-6 md:mt-0 z-10 shadow-[0_0_15px_#ff719a]"></div>

              {/* Content Card */}
              <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 text-left"}`}>
                <div className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm font-semibold mb-3">
                    {memory.year}
                  </span>
                  <h3 className="text-2xl font-outfit font-bold text-white mb-2">
                    {memory.title}
                  </h3>
                  <p className="text-gray-300 font-inter leading-relaxed mb-4">
                    {memory.description}
                  </p>
                  {memory.image && (
                    <div className="overflow-hidden rounded-xl border border-white/10 shadow-lg">
                      <img
                        src={memory.image}
                        alt={memory.title}
                        className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
