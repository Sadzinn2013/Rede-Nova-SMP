import React from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const VOTE_SITES = [
  {
    name: "Minecraft Server List",
    url: "https://minecraft-server-list.com/server/redenova",
    description: "Vote e ganhe recompensas exclusivas no servidor",
    icon: "🌐",
    color: "border-emerald-500/30 hover:border-emerald-500/60",
    badge: "text-emerald-400",
    bg: "hover:bg-emerald-500/5",
  },
  {
    name: "TopG",
    url: "https://topg.org/minecraft-servers/server-redenova",
    description: "Ajude-nos a crescer votando no TopG",
    icon: "🏆",
    color: "border-gold/30 hover:border-gold/60",
    badge: "text-gold",
    bg: "hover:bg-gold/5",
  },
  {
    name: "BestServers",
    url: "https://bestservers.com/server/redenova",
    description: "Vote diariamente e receba kits especiais",
    icon: "⭐",
    color: "border-blue-400/30 hover:border-blue-400/60",
    badge: "text-blue-400",
    bg: "hover:bg-blue-400/5",
  },
  {
    name: "Minecraft Servers",
    url: "https://minecraftservers.org/server/redenova",
    description: "Suba nosso ranking votando todo dia",
    icon: "🎮",
    color: "border-purple-400/30 hover:border-purple-400/60",
    badge: "text-purple-400",
    bg: "hover:bg-purple-400/5",
  },
];

export default function VotesSection() {
  const { t } = useLanguage();
  return (
    <section id="votar" className="relative py-24 md:py-32 bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <ThumbsUp size={14} className="text-gold" />
              <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-mono">{t("vote_label")}</span>
            </div>
            <h2 className="font-heading font-black uppercase text-alabaster text-3xl md:text-5xl lg:text-6xl tracking-tight leading-none">
              {t("vote_title")}
              <br />
              <span style={{ WebkitTextStroke: "1px rgba(197,160,89,0.4)", color: "transparent" }}>
                {t("vote_title2")}
              </span>
            </h2>
          </div>
          <p className="text-stone text-sm max-w-xs leading-relaxed">
            {t("vote_subtitle")}
          </p>
        </motion.div>

        {/* Reward banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-12 p-5 border border-gold/20 bg-gold/5"
        >
          <span className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase">{t("vote_reward_coins")}</span>
          <span className="text-alabaster/80 text-xs font-mono border border-white/10 px-3 py-1.5 bg-white/[0.03]">
            🪙 100 Coins
          </span>
        </motion.div>

        {/* Vote cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VOTE_SITES.map((site, index) => (
            <motion.a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className={`group relative flex flex-col p-6 border transition-all duration-300 cursor-pointer ${site.color} ${site.bg} bg-[#0d0d0d]`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl leading-none">{site.icon}</span>
                <ExternalLink size={13} className={`${site.badge} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              <h3 className={`font-heading font-bold text-sm tracking-wide mb-2 text-alabaster group-hover:${site.badge} transition-colors`}>
                {site.name}
              </h3>
              <p className="text-stone/60 text-[11px] leading-relaxed mb-5 flex-1">
                {site.description}
              </p>
              <div className={`flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase font-bold ${site.badge}`}>
                <ThumbsUp size={10} />
                {t("vote_btn")}
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-stone/30 text-[10px] tracking-[0.25em] uppercase font-mono">
            {t("vote_reset")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}