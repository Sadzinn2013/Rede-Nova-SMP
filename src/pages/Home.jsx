import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import RulesSection from "../components/RulesSection";
import StoreSection from "../components/StoreSection";
import DiscordWidget from "../components/DiscordWidget";
import VotesSection from "../components/VotesSection";
import GoalsSection from "../components/GoalsSection";
import FormsSection from "../components/FormsSection";
import Footer from "../components/Footer";
import VisitorBanner from "../components/VisitorBanner";

const HERO_IMAGE = "https://media.base44.com/images/public/6a050568876b935d32dff419/aeccb1ede_Gemini_Generated_Image_uwfvgsuwfvgsuwfv1.png";
const RULES_IMAGE = "https://media.base44.com/images/public/6a050568876b935d32dff419/77c6b7636_Gemini_Generated_Image_qfoe6hqfoe6hqfoe1.png";
const STORE_IMAGES = [
  "https://media.base44.com/images/public/6a050568876b935d32dff419/950098305_ChatGPTImage2dejunde202622_26_39.png",
  "https://media.base44.com/images/public/6a050568876b935d32dff419/02d94ad29_ChatGPTImage2dejunde202622_24_53.png",
  "https://media.base44.com/images/public/6a050568876b935d32dff419/2fd7645df_ChatGPTImage2dejunde202622_24_25.png",
  "https://media.base44.com/images/public/6a050568876b935d32dff419/23e5b6c71_Gemini_Generated_Image_uwldc4uwldc4uwld1.png",
];

export default function Home() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("rn_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("rn_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("rn_user");
  };

  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <HeroSection heroImage={HERO_IMAGE} user={user} />
      <VisitorBanner />
      <RulesSection rulesImage={RULES_IMAGE} />
      <StoreSection storeImages={STORE_IMAGES} user={user} />
      <GoalsSection />
      <FormsSection />
      <VotesSection />
      <section id="discord" className="py-16 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <DiscordWidget />
        </div>
      </section>
      <Footer />
    </div>
  );
}