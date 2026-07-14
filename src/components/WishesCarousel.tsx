"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, PenTool } from "lucide-react";
import { submitGuestWish } from "@/app/actions";

export default function WishesCarousel({ initialWishes }: { initialWishes?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localWishes, setLocalWishes] = useState<any[]>(initialWishes || []);

  const wishes = localWishes.length > 0 ? localWishes : [{ name: "Admin", message: "No wishes yet! Be the first.", emoji: "📝" }];

  useEffect(() => {
    if (showForm) return; // Pause auto slide when form is open
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, showForm, wishes.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % wishes.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + wishes.length) % wishes.length);
  };

  const handleWishSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await submitGuestWish(formData);
    
    if (res.success) {
      setLocalWishes([{ 
        name: formData.get("name"), 
        message: formData.get("message"), 
        emoji: formData.get("emoji") || "🎉" 
      }, ...localWishes]);
      setShowForm(false);
    } else {
      alert("Note: Running without Supabase backend. Mocking submission locally.");
      setLocalWishes([{ 
        name: formData.get("name"), 
        message: formData.get("message"), 
        emoji: formData.get("emoji") || "🎉" 
      }, ...localWishes]);
      setShowForm(false);
    }
    setIsSubmitting(false);
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0, scale: 0.8 }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0, scale: 0.8 }),
  };

  return (
    <section className="py-24 px-4 overflow-hidden relative">
      <h2 className="text-3xl md:text-5xl font-outfit text-white mb-16 text-center text-glow">
        Wishes From Loved Ones
      </h2>

      <div className="relative max-w-2xl mx-auto h-64 flex items-center justify-center">
        <button onClick={handlePrev} className="absolute left-0 md:-left-16 z-20 p-2 text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur transition-colors">
          <ChevronLeft size={32} />
        </button>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute w-full px-12 md:px-0"
          >
            <div className="glass-dark p-8 md:p-12 rounded-3xl text-center shadow-[0_10px_30px_rgba(255,113,154,0.1)] border-t border-pink-500/20">
              <div className="text-4xl mb-4">{wishes[currentIndex].emoji}</div>
              <p className="text-xl md:text-2xl font-inter text-gray-200 mb-6 italic">
                "{wishes[currentIndex].message}"
              </p>
              <h4 className="text-lg font-outfit text-pink-400 font-semibold tracking-wide">
                — {wishes[currentIndex].name}
              </h4>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={handleNext} className="absolute right-0 md:-right-16 z-20 p-2 text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur transition-colors">
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="flex justify-center mt-12">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-pink-500/20 text-pink-300 px-6 py-2 rounded-full border border-pink-500/30 hover:bg-pink-500/40 transition">
          <PenTool size={18} /> Leave a Wish
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass p-8 rounded-2xl w-full max-w-md relative">
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
              <h3 className="text-2xl text-white font-outfit mb-6">Leave a Wish</h3>
              <form onSubmit={handleWishSubmit} className="flex flex-col gap-4">
                <input name="name" required placeholder="Your Name" className="bg-white/10 border border-white/20 rounded p-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500" />
                <textarea name="message" required placeholder="Your Message" rows={4} className="bg-white/10 border border-white/20 rounded p-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500" />
                <input name="emoji" placeholder="Emoji (Optional e.g. 💖)" className="bg-white/10 border border-white/20 rounded p-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500" />
                <button type="submit" disabled={isSubmitting} className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 py-3 rounded font-semibold text-white disabled:opacity-50">
                  {isSubmitting ? "Sending..." : "Send Wish"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
