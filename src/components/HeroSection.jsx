import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const SERVER_IP = "jogar.redenova.online";

export default function HeroSection({ heroImage, user }) {
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [playerCount, setPlayerCount] = useState(null);
  const containerRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("https://api.mcstatus.io/v2/status/java/widen-promoting.gl.joinmc.link");
        const data = await res.json();
        if (data?.players?.online !== undefined) {
          setPlayerCount(data.players.online);
        }
      } catch {
        setPlayerCount(null);
      }
    };
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (e) => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 1000);
    setTimeout(() => setCopied(false), 2500);
  };

  const scroll = () => {
    document.querySelector("#rules")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Rede Nova"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/20 to-obsidian" />
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.5) 26%, transparent 27%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.5) 26%, transparent 27%)",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      {/* Ripples */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          className="absolute rounded-full bg-gold/15 animate-ripple pointer-events-none"
          style={{ left: rip.x - 50, top: rip.y - 50, width: 100, height: 100 }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl w-full">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gold/40" />
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-mono">
            {t("hero_minecraft")}
          </span>
          <div className="h-px w-12 bg-gold/40" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-heading font-black uppercase text-alabaster leading-none mb-2"
          style={{ fontSize: "clamp(3rem, 12vw, 9rem)", letterSpacing: "-0.02em" }}
        >
          REDE
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-heading font-black uppercase leading-none mb-10"
          style={{
            fontSize: "clamp(3rem, 12vw, 9rem)",
            letterSpacing: "-0.02em",
            WebkitTextStroke: "1px rgba(197,160,89,0.5)",
            color: "transparent",
          }}
        >
          NOVA
        </motion.h1>

        {/* IP Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <button
            onClick={handleCopy}
            className={`group relative flex items-center gap-5 px-8 md:px-12 py-5 transition-all duration-500 ${
              copied
                ? "bg-gold/15 border border-gold/50"
                : "bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] hover:border-gold/25"
            }`}
          >
            <span
              className="font-mono font-bold text-alabaster tracking-wide"
              style={{ fontSize: "clamp(1rem, 3.5vw, 2.2rem)" }}
            >
              {SERVER_IP}
            </span>
            <span className="text-stone/60 group-hover:text-gold transition-colors duration-300">
              {copied ? <Check size={20} className="text-gold" /> : <Copy size={20} />}
            </span>
          </button>
          <p className={`mt-2.5 text-[10px] font-mono tracking-[0.3em] transition-colors duration-300 ${copied ? "text-gold" : "text-stone/40"}`}>
            {copied ? t("hero_copied_full") : t("hero_click_copy")}
          </p>
          <p className="mt-2 text-[10px] font-mono tracking-[0.2em] text-stone/50">
            📱 {t("hero_bedrock_info")}
          </p>
        </motion.div>

        {/* Status pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE
          </span>
          {playerCount !== null && (
            <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5">
              👥 {playerCount} {t("hero_playing")}
            </span>
          )}
          <span className="text-[10px] font-mono tracking-widest bg-white/5 border border-white/10 text-stone px-3 py-1.5">
            JAVA & BEDROCK
          </span>
          <span className="text-[10px] font-mono tracking-widest bg-white/5 border border-white/10 text-stone px-3 py-1.5">
            VERSÃO 1.19 – 1.21.1
          </span>
          {user && (
            <span className="text-[10px] font-mono tracking-widest bg-gold/10 border border-gold/20 text-gold px-3 py-1.5">
              [{user.rank}] {user.username}
            </span>
          )}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => document.querySelector("#store")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gold text-obsidian font-heading font-black text-xs tracking-[0.2em] uppercase px-10 py-4 hover:bg-gold/90 transition-colors w-full sm:w-auto"
          >
            {t("hero_store")}
          </button>
          <button
            onClick={() => document.querySelector("#rules")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-white/15 text-alabaster font-heading text-xs tracking-[0.2em] uppercase px-10 py-4 hover:bg-white/5 transition-colors w-full sm:w-auto"
          >
            {t("hero_rules")}
          </button>
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <motion.button
        onClick={scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone/40 hover:text-gold transition-colors"
      >
        <ChevronDown size={24} className="animate-bounce" />
      </motion.button>
    </section>
  );
}