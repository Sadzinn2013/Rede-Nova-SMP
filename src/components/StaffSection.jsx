import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Crown, Shield, Star, HelpCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ROLE_CONFIG = {
  "Dono": {
    icon: Crown,
    color: "text-gold",
    bg: "bg-gold/10",
    border: "border-gold/30",
    badge: "bg-gold text-obsidian",
    order: 0,
  },
  "Co-Dono": {
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
    badge: "bg-amber-400 text-obsidian",
    order: 1,
  },
  "Administrador": {
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/25",
    badge: "bg-red-500/20 text-red-400 border border-red-400/30",
    order: 2,
  },
  "Moderador": {
    icon: Star,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/25",
    badge: "bg-blue-500/20 text-blue-400 border border-blue-400/30",
    order: 3,
  },
  "Helper": {
    icon: HelpCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30",
    order: 4,
  },
};

const ROLE_ORDER = ["Dono", "Co-Dono", "Administrador", "Moderador", "Helper"];

function StaffCard({ member, index }) {
  const config = ROLE_CONFIG[member.role] || ROLE_CONFIG["Helper"];
  const Icon = config.icon;
  const avatarUrl = `https://mc-heads.net/avatar/${encodeURIComponent(member.minecraft_nick)}/64`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={`group relative flex flex-col items-center text-center p-6 border transition-all duration-400 hover:-translate-y-1 ${config.border} ${config.bg} bg-opacity-50`}
      style={{ background: "rgba(10,10,10,0.6)" }}
    >
      {/* Avatar */}
      <div className={`relative mb-4 w-16 h-16 border-2 ${config.border} overflow-hidden`}>
        <img
          src={avatarUrl}
          alt={member.minecraft_nick}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.minecraft_nick)}&background=1a1a1a&color=888&size=64&bold=true`;
          }}
        />
        {/* Online dot */}
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0a] transition-colors ${
            member.online ? "bg-emerald-500 animate-pulse" : "bg-stone/40"
          }`}
          title={member.online ? "Online" : "Offline"}
        />
      </div>

      {/* Role badge */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1 mb-3 text-[9px] font-heading font-bold tracking-[0.2em] uppercase ${config.badge}`}>
        <Icon size={9} />
        {member.role}
      </div>

      {/* Nick */}
      <h3 className={`font-mono font-bold text-sm tracking-wide mb-2 ${config.color}`}>
        {member.minecraft_nick}
      </h3>

      {/* Description */}
      {member.description && (
        <p className="text-stone/60 text-[11px] leading-relaxed">{member.description}</p>
      )}

      {/* Status + Discord */}
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <span className={`flex items-center gap-1.5 text-[9px] font-mono tracking-widest ${member.online ? "text-emerald-400" : "text-stone/40"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${member.online ? "bg-emerald-500" : "bg-stone/30"}`} />
          {member.online ? "ONLINE" : "OFFLINE"}
        </span>
        {member.discord && (
          <p className="text-stone/40 text-[10px] font-mono">{member.discord}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function StaffSection() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Staff.filter({ active: true })
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          const ro = ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role);
          if (ro !== 0) return ro;
          return (a.order ?? 99) - (b.order ?? 99);
        });
        setStaff(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  // Group by role
  const grouped = ROLE_ORDER.reduce((acc, role) => {
    const members = staff.filter((m) => m.role === role);
    if (members.length > 0) acc[role] = members;
    return acc;
  }, {});

  return (
    <section id="staff" className="relative py-24 md:py-32 bg-[#0a0a0a]">
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
              <Users size={14} className="text-gold" />
              <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-mono">A Equipe</span>
            </div>
            <h2 className="font-heading font-black uppercase text-alabaster text-3xl md:text-5xl lg:text-6xl tracking-tight leading-none">
              NOSSA
              <br />
              <span style={{ WebkitTextStroke: "1px rgba(197,160,89,0.4)", color: "transparent" }}>
                STAFF
              </span>
            </h2>
          </div>
          <p className="text-stone text-sm max-w-xs leading-relaxed">
            Nossa equipe está sempre pronta para ajudar. Respeite todos os membros da staff.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-gold animate-spin" />
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone/40 text-sm font-mono tracking-widest">NENHUM MEMBRO CADASTRADO</p>
            <p className="text-stone/25 text-xs mt-2">Adicione membros no painel admin</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([role, members]) => {
              const config = ROLE_CONFIG[role];
              const Icon = config.icon;
              return (
                <div key={role}>
                  {/* Role label */}
                  <div className="flex items-center gap-3 mb-6">
                    <Icon size={13} className={config.color} />
                    <span className={`text-[10px] font-mono tracking-[0.3em] uppercase ${config.color}`}>
                      {role}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-stone/30 text-[10px] font-mono">{members.length}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {members.map((member, i) => (
                      <StaffCard key={member.id} member={member} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}