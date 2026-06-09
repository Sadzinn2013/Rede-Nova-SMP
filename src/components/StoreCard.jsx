import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart, Star } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function StoreCard({ item, index, onBuy }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useLanguage();

  const accentBorder = {
    gold: "border-gold/30",
    emerald: "border-emerald-500/25",
    blue: "border-blue-500/20",
    purple: "border-purple-500/20",
  };

  const accentText = {
    gold: "text-gold",
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
  };

  const accentBg = {
    gold: "bg-gold/10",
    emerald: "bg-emerald-500/10",
    blue: "bg-blue-500/10",
    purple: "bg-purple-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col"
    >
      {item.popular && (
        <div className="absolute -top-3 left-4 z-20 flex items-center gap-1 bg-gold text-obsidian text-[9px] font-heading font-bold tracking-[0.2em] px-3 py-1">
          <Star size={9} fill="currentColor" />
          {t("rank_popular")}
        </div>
      )}

      <div
        className={`flex flex-col h-full border transition-all duration-500 overflow-hidden ${
          hovered
            ? `${accentBorder[item.color]} bg-white/[0.03]`
            : "border-white/5 bg-white/[0.015]"
        }`}
      >
        {/* Image area */}
        <div className="relative overflow-hidden bg-[#080808]" style={{ aspectRatio: "1/1" }}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: "brightness(0.85)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

          {/* Type badge */}
          <div className={`absolute top-3 left-3 ${accentBg[item.color]} border ${accentBorder[item.color]} px-2 py-1`}>
            <span className={`text-[9px] font-mono tracking-widest ${accentText[item.color]}`}>
              {item.type === "rank" ? "RANK" : "ITEM"}
            </span>
          </div>

          {/* Price */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-3 left-3 right-3"
          >
            <div className="bg-obsidian/90 backdrop-blur-sm border border-white/10 px-4 py-2.5 flex items-baseline justify-between">
              <span className={`font-mono text-lg font-bold ${accentText[item.color]}`}>
                {item.price}
              </span>
              {item.period && (
                <span className="text-stone/60 text-[10px]">{item.period}</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-heading font-black uppercase tracking-[0.1em] text-sm transition-colors duration-400 ${hovered ? accentText[item.color] : "text-alabaster"}`}>
              {item.name}
            </h3>
            {!hovered && (
              <span className={`font-mono text-sm font-bold ${accentText[item.color]}`}>
                {item.price}
              </span>
            )}
          </div>
          <p className="text-stone text-xs leading-relaxed mb-4">{item.description}</p>

          <ul className="space-y-1.5 mb-4 flex-1">
            {item.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check size={11} className={accentText[item.color]} />
                <span className="text-stone/70 text-xs">{f}</span>
              </li>
            ))}
          </ul>

          {/* Kit image */}
          {item.kitImage && (
            <div className={`mb-4 border ${accentBorder[item.color]} overflow-hidden`}>
              <p className={`text-[9px] font-mono tracking-[0.25em] uppercase ${accentText[item.color]} px-3 py-1.5 border-b ${accentBorder[item.color]} bg-white/[0.02]`}>
                CONTEÚDO DO KIT
              </p>
              <img
                src={item.kitImage}
                alt={`Kit ${item.name}`}
                className="w-full object-cover"
                style={{ maxHeight: "160px" }}
              />
            </div>
          )}

          <button
            onClick={onBuy}
            className={`w-full ${accentBg[item.color]} border ${accentBorder[item.color]} ${accentText[item.color]} font-heading font-bold text-[11px] tracking-[0.2em] uppercase py-3 hover:opacity-80 transition-opacity flex items-center justify-center gap-2`}
          >
            <ShoppingCart size={13} />
            {item.ticket ? t("rank_ticket") : t("rank_buy")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}