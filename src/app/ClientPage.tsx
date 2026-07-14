"use client";

import { useState, useEffect } from "react";
import LandingScreen from "@/components/LandingScreen";
import Countdown from "@/components/Countdown";
import HeroSection from "@/components/HeroSection";
import ProfilePhoto from "@/components/ProfilePhoto";
import PersonalLetter from "@/components/PersonalLetter";
import MemoryTimeline from "@/components/MemoryTimeline";
import Gallery from "@/components/Gallery";
import WishesCarousel from "@/components/WishesCarousel";
import GiftSection from "@/components/GiftSection";
import SurpriseButton from "@/components/SurpriseButton";
import FloatingElements from "@/components/FloatingElements";
import MusicPlayer from "@/components/MusicPlayer";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

import { ConfigContext } from "./ConfigContext";

export default function ClientPage({ config, initialWishes }: { config: any, initialWishes: any }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    const bday = new Date(config.recipient.birthdayDate);
    
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(bday.getFullYear(), bday.getMonth(), bday.getDate());

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      setIsBirthday(true);
    } else {
      setIsBirthday(false);
      setDaysLeft(diffDays);
    }
  }, [config]);

  const handleOpenSurprise = () => {
    setIsOpened(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: [config.theme.colors.primary, config.theme.colors.secondary, config.theme.colors.gold]
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isBirthday) {
          setIsBirthday(true);
        } else if (!isOpened) {
          handleOpenSurprise();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBirthday, isOpened, config]);

  return (
    <ConfigContext.Provider value={config}>
      {(!isClient) ? null : (!isBirthday) ? (
        <Countdown daysLeft={daysLeft} />
      ) : (
        <main className="relative min-h-screen bg-[var(--background)] overflow-hidden">
          <AnimatePresence mode="wait">
            {!isOpened ? (
              <motion.div key="landing" exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 1 }}>
                <LandingScreen onOpen={handleOpenSurprise} />
              </motion.div>
            ) : (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="w-full h-full pb-20 relative z-10"
              >
                <MusicPlayer />
                <FloatingElements />
                <HeroSection />
                <ProfilePhoto />
                <PersonalLetter />
                <MemoryTimeline />
                <Gallery />
                <WishesCarousel initialWishes={initialWishes} />
                <GiftSection />
                <SurpriseButton />
                
                <footer className="text-center py-10 text-gray-500 font-inter">
                  <p>{config.messages.footerMessage}</p>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}
    </ConfigContext.Provider>
  );
}
