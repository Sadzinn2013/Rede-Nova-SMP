import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Zap, Server, Sword } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
const GOALS = [
  {
    id: 1,
    label: "Melhora para a Máquina Dedicada",
    description: "Compra de peças para melhorar a máquina, e ficar menos lagado e conseguir entrar mais pessoas.",
    target: 200,
    icon: Server,
    color: "emerald",
    reward: "Sorteio de 3 VIPs Orion — entre no Discord!",
  },
  {
    id: 2,
    label: "Anti-Cheat Premium",
    description: "Licença do melhor anti-cheat do mercado para proteger a experiência",
    target: 350,
    icon: Sword,
    color: "blue",
    reward: "Proteção máxima contra hacks",
  },
  {
    id: 3,
    label: "Novo Mundo de Eventos",
    description: "Mundo exclusivo para eventos semanais, arenas e torneios",
    target: 500,
    icon: Zap,
    color: "gold",
    reward: "Eventos toda semana",
  },
];

const colorMap = {
  emerald: {
    bar: "bg-emerald-500",
    glow: "shadow-emerald-500/30",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
  },
  blue: {
    bar: "bg-blue-500",
    glow: "shadow-blue-500/30",
    text: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
  },
  gold: {
    bar: "bg-gold",
    glow: "shadow-gold/30",
    text: "text-gold",
    border: "border-gold/20",
    bg: "bg-gold/10",
  },
};

function GoalCard({ goal, index, currentAmount }) {
  const pct = Math.min(Math.round((currentAmount / goal.target) * 100), 100);
  const c = colorMap[goal.color];
  const Icon = goal.icon;
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-6 border ${c.border} bg-[#0d0d0d]`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 flex items-center justify-center ${c.bg} border ${c.border}`}>
          <Icon size={15} className={c.text} />
        </div>
        <span className={`text-[10px] font-mono tracking-[0.25em] ${c.text} border ${c.border} ${c.bg} px-2 py-1`}>
          {pct}%
        </span>
      </div>

      {/* Info */}
      <h3 className="font-heading font-bold text-sm text-alabaster tracking-wide mb-1">{goal.label}</h3>
      <p className="text-stone/60 text-[11px] leading-relaxed mb-4">{goal.description}</p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 w-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
            className={`h-full ${c.bar} shadow-lg ${c.glow}`}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] font-mono text-stone/40">R$ {currentAmount}</span>
          <span className={`text-[10px] font-mono ${c.text}`}>R$ {goal.target}</span>
        </div>
      </div>

      {/* Reward */}
      <div className={`flex items-center gap-2 pt-3 border-t ${c.border}`}>
        <span className="text-[9px] font-mono tracking-[0.2em] text-stone/30 uppercase">{t("goals_reward")}</span>
        <span className={`text-[9px] font-mono ${c.text}`}>{goal.reward}</span>
      </div>
    </motion.div>
  );
}

export default function GoalsSection() {
  const [currentAmount, setCurrentAmount] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    base44.entities.Purchase.filter({ confirmed: true }).then((purchases) => {
      const total = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
      setCurrentAmount(Math.round(total * 100) / 100);
    }).catch(() => {});
  }, []);

  const CURRENT_AMOUNT = currentAmount;
  const nextGoal = GOALS.find((g) => CURRENT_AMOUNT < g.target) || GOALS[GOALS.length - 1];
  const nextPct = Math.min(Math.round((CURRENT_AMOUNT / nextGoal.target) * 100), 100);
  const remaining = Math.max(nextGoal.target - CURRENT_AMOUNT, 0);

  return (
    <section id="metas" className="relative py-24 md:py-32 bg-obsidian">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Target size={14} className="text-gold" />
              <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-mono">{t("goals_progress")}</span>
            </div>
            <h2 className="font-heading font-black uppercase text-alabaster text-3xl md:text-5xl lg:text-6xl tracking-tight leading-none">
              {t("goals_title")}
              <br />
              <span style={{ WebkitTextStroke: "1px rgba(197,160,89,0.4)", color: "transparent" }}>
                {t("goals_title2")}
              </span>
            </h2>
          </div>
          <p className="text-stone text-sm max-w-xs leading-relaxed">
            {t("goals_subtitle")}
          </p>
        </motion.div>

        {/* Next goal highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 p-6 border border-gold/25 bg-gold/5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-gold/60 uppercase mb-1">{t("goals_next_goal")}</p>
              <p className="font-heading font-bold text-alabaster">{nextGoal.label}</p>
            </div>
            <div className="text-right">
              <span className="text-gold font-mono font-bold text-2xl">R$ {CURRENT_AMOUNT}</span>
              <span className="text-stone/40 font-mono text-sm"> / R$ {nextGoal.target}</span>
              <p className="text-stone/40 text-[10px] font-mono mt-0.5">{t("goals_missing")} {remaining}</p>
            </div>
          </div>
          <div className="h-2 w-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${nextPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gold shadow-lg shadow-gold/30 relative"
            >
              <div className="absolute right-0 top-0 h-full w-3 bg-white/30 blur-sm" />
            </motion.div>
          </div>
          <p className="mt-2 text-[10px] font-mono text-gold/50 tracking-widest text-right">{nextPct}{t("goals_completed_pct")}</p>
        </motion.div>

        {/* All goals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {GOALS.map((goal, i) => (
            <GoalCard key={goal.id} goal={goal} index={i} currentAmount={CURRENT_AMOUNT} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 text-center text-stone/25 text-[10px] font-mono tracking-[0.25em] uppercase"
        >
          {t("goals_footer")}
        </motion.p>
      </div>
    </section>
  );
}