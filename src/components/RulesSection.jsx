import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const rules = [
  {
    num: "01",
    icon: "📌",
    title: "Comportamento & Convivência",
    desc: "Respeite todos os jogadores e a staff. Proibido xingamentos, racismo, homofobia, assédio ou discriminação. Sem spam, flood ou divulgação sem autorização. Siga as orientações da staff — desobedecer resulta em punições.",
  },
  {
    num: "02",
    icon: "🛡️",
    title: "Hacks, Cheats & Exploits",
    desc: "Proibido: hacks, x-ray, macros, autoclick, mod menus ou qualquer vantagem injusta. Proibido uso de bugs para duplicar itens, voar ou bugar blocos. Mods permitidos apenas se estéticos (minimaps, shaders, OptiFine). Infratores podem receber ban permanente.",
  },
  {
    num: "03",
    icon: "🔨",
    title: "Unban — Limite de Compras",
    desc: "O unban pode ser comprado no máximo 2 vezes por conta. Após a segunda compra, não haverá mais possibilidade de desbanimento, independente do motivo. Pense antes de infringir as regras.",
  },
  {
    num: "04",
    icon: "🏡",
    title: "Terrenos & Construções",
    desc: "Evite construções que causem lag, como farms exageradas ou redstone infinita. Farms automáticas são permitidas desde que não prejudiquem o servidor.",
  },
  {
    num: "05",
    icon: "🌐",
    title: "Mundo & Exploração",
    desc: "Voce pode fazer oue bem entender no mundo, destruir, explodir, tacar fogo e etc",
  },
  {
    num: "06",
    icon: "💰",
    title: "Economia & Comércio",
    desc: "Não gere inflação com bugs ou métodos ilegais. O comércio entre jogadores é livre!",
  },
  {
    num: "07",
    icon: "⚖️",
    title: "Penalidades",
    desc: "A staff tem liberdade para agir conforme a gravidade da infração. Punições podem ser: mute, kick, ban temporário ou ban permanente. As regras podem ser atualizadas sem aviso prévio.",
  },
];

export default function RulesSection({ rulesImage }) {
  const [active, setActive] = useState(null);
  const { t } = useLanguage();

  return (
    <section id="rules" className="relative py-24 md:py-32 bg-[#0a0a0a]">
      {/* Top line */}
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
              <Shield size={14} className="text-gold" />
              <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-mono">{t("rules_codex")}</span>
            </div>
            <h2 className="font-heading font-black uppercase text-alabaster text-3xl md:text-5xl lg:text-6xl tracking-tight leading-none">
              {t("rules_title")}
              <br />
              <span style={{ WebkitTextStroke: "1px rgba(197,160,89,0.4)", color: "transparent" }}>
                {t("rules_title2")}
              </span>
            </h2>
          </div>
          <p className="text-stone text-sm max-w-xs leading-relaxed">
            {t("rules_warning")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left sticky image */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-24">
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img
                  src={rulesImage}
                  alt="Regras"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/30" />
                <div className="absolute inset-x-0 bottom-0 p-6 border-t border-white/5">
                  <p className="font-mono text-[10px] text-gold/70 tracking-[0.3em] leading-relaxed whitespace-pre-line">
                    {t("rules_violations")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rules list */}
          <div className="lg:col-span-3">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.num}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onMouseEnter={() => setActive(rule.num)}
                onMouseLeave={() => setActive(null)}
                className={`group border-b border-white/5 py-6 cursor-default transition-all duration-400 ${
                  active && active !== rule.num ? "opacity-25" : "opacity-100"
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <span className="font-mono text-[11px] text-stone/40 group-hover:text-gold/60 transition-colors">
                      {rule.num}
                    </span>
                    <span className="text-lg leading-none">{rule.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold uppercase tracking-[0.08em] text-alabaster text-sm md:text-base mb-2 group-hover:text-gold transition-colors duration-400">
                      {rule.title}
                    </h3>
                    <p className="text-stone text-sm leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}