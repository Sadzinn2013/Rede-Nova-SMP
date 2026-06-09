import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Check, Info } from "lucide-react";

const RANKS = [
  { id: 1, name: "PRO", color: "emerald", key: "pro_role_id" },
  { id: 2, name: "ELITE", color: "gold", key: "elite_role_id" },
  { id: 3, name: "MVP", color: "purple", key: "mvp_role_id" },
];

const colorText = {
  emerald: "text-emerald-400",
  gold: "text-gold",
  purple: "text-purple-400",
};

const colorBorder = {
  emerald: "border-emerald-500/30",
  gold: "border-gold/30",
  purple: "border-purple-500/30",
};

const colorBg = {
  emerald: "bg-emerald-500/10",
  gold: "bg-gold/10",
  purple: "bg-purple-500/10",
};

export default function VipRoleConfig() {
  const [roles, setRoles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rn_discord_roles") || "{}");
    } catch {
      return {};
    }
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("rn_discord_roles", JSON.stringify(roles));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section id="vip-config" className="relative py-24 md:py-32 bg-[#080808]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <Settings size={14} className="text-gold" />
            <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-mono">Administração</span>
          </div>
          <h2 className="font-heading font-black uppercase text-alabaster text-3xl md:text-4xl tracking-tight leading-none mb-3">
            IDs DOS CARGOS
            <br />
            <span style={{ WebkitTextStroke: "1px rgba(197,160,89,0.4)", color: "transparent" }}>
              DO DISCORD
            </span>
          </h2>
          <p className="text-stone text-sm leading-relaxed max-w-md">
            Configure os IDs dos cargos do Discord para cada rank VIP. Isso permite atribuir o cargo automaticamente após a compra.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-white/5 bg-white/[0.02] p-4 mb-8 flex items-start gap-3"
        >
          <Info size={14} className="text-gold/60 mt-0.5 flex-shrink-0" />
          <p className="text-stone/60 text-xs leading-relaxed font-mono">
            Para obter o ID de um cargo no Discord: Configurações do Servidor → Cargos → clique com botão direito no cargo → Copiar ID. (Ative o Modo Desenvolvedor em Configurações → Avançado)
          </p>
        </motion.div>

        <div className="space-y-4 mb-8">
          {RANKS.map((rank, i) => (
            <motion.div
              key={rank.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`border ${colorBorder[rank.color]} bg-white/[0.015] p-5`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-2 py-0.5 ${colorBg[rank.color]} border ${colorBorder[rank.color]}`}>
                  <span className={`text-[9px] font-mono tracking-[0.3em] font-bold ${colorText[rank.color]}`}>
                    {rank.name}
                  </span>
                </div>
              </div>
              <label className="text-[10px] font-mono tracking-[0.25em] text-stone/50 uppercase block mb-2">
                ID do Cargo no Discord
              </label>
              <input
                type="text"
                value={roles[rank.key] || ""}
                onChange={(e) => setRoles({ ...roles, [rank.key]: e.target.value })}
                placeholder="Ex: 1234567890123456789"
                className="w-full bg-white/[0.03] border border-white/8 px-4 py-2.5 text-alabaster text-sm font-mono placeholder-stone/25 focus:outline-none focus:border-gold/30 transition-colors"
              />
            </motion.div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3.5 font-heading font-bold text-xs tracking-[0.2em] uppercase transition-colors ${
            saved
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
              : "bg-gold text-obsidian hover:bg-gold/90"
          }`}
        >
          {saved ? <><Check size={14} /> SALVO!</> : <><Save size={14} /> SALVAR IDs</>}
        </button>
      </div>
    </section>
  );
}