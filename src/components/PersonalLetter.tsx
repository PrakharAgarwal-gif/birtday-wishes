"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "@/app/ConfigContext";

export default function PersonalLetter() {
  const config = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setIsReading(true), 1500); // Letter sliding out takes some time
    }
  };

  const messageWords = ((config.messages.personalMessage || "") as string).split(/(\s+)/);

  return (
    <section className="py-20 px-4 min-h-screen flex flex-col items-center justify-center relative">
      <h2 className="text-3xl md:text-5xl font-outfit text-white mb-16 text-center text-glow">
        A Special Message For You
      </h2>

      <div className="relative w-full max-w-2xl mx-auto h-[400px] flex items-center justify-center">
        {/* Envelope */}
        <motion.div
          onClick={handleOpen}
          whileHover={!isOpen ? { scale: 1.05, rotate: 2 } : {}}
          className={`relative w-80 sm:w-96 h-60 bg-pink-100 rounded-lg shadow-2xl cursor-pointer ${isOpen ? "pointer-events-none" : ""}`}
        >
          {/* Envelope Flap (Top) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-pink-200 rounded-t-lg z-30 flex items-center justify-center border-b border-pink-300"
          >
            {/* Stamp / Seal */}
            {!isOpen && (
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md absolute bottom-0 translate-y-1/2">
                <span className="text-white text-xl">❤️</span>
              </div>
            )}
          </motion.div>

          {/* Envelope Body */}
          <div className="absolute inset-0 bg-pink-50 rounded-lg z-10 clip-envelope shadow-inner"></div>

          {/* The Letter */}
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={isOpen ? { y: -200, opacity: 1, scale: 1.2 } : {}}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            className="absolute top-4 left-4 right-4 h-[500px] bg-[#fffdf0] z-20 rounded shadow-xl p-6 overflow-y-auto custom-scrollbar"
            style={{
              backgroundImage: "url('https://www.transparenttextures.com/patterns/handmade-paper.png')",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
          >
            <h3 className="font-outfit text-2xl text-pink-600 mb-6 border-b pb-2 border-pink-200">
              Dear {config.recipient.nickname || config.recipient.name},
            </h3>
            
            <div className="font-inter text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">
              {isReading && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                    hidden: {}
                  }}
                >
                  {messageWords.map((word: string, index: number) => (
                    <motion.span
                      key={index}
                      variants={{
                        visible: { opacity: 1 },
                        hidden: { opacity: 0 }
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>

            {isReading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: messageWords.length * 0.05 + 1 }}
                className="mt-8 text-right pb-4"
              >
                <p className="font-outfit text-xl text-pink-600">Your friend,</p>
                <p className="font-inter text-gray-600 text-lg">Prakhar</p>
              </motion.div>
            )}
          </motion.div>

          {/* Envelope Front overlay (to cover the letter when inside) */}
          <div className="absolute inset-0 bg-pink-100 z-40 rounded-b-lg clip-envelope-front shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pointer-events-none"></div>
        </motion.div>
      </div>

      <style jsx>{`
        .clip-envelope {
          clip-path: polygon(0 0, 100% 0, 50% 50%, 0 0);
        }
        .clip-envelope-front {
          clip-path: polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%);
        }
      `}</style>
    </section>
  );
}
