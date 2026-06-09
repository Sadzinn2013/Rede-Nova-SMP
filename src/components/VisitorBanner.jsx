import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

export default function VisitorBanner() {
  const [visits, setVisits] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const incrementAndFetch = async () => {
      try {
        const visited = localStorage.getItem("rn_visited");
        const records = await base44.entities.SiteVisit.list();

        if (records.length === 0) {
          // Cria o registro inicial
          const created = await base44.entities.SiteVisit.create({ count: 1 });
          setVisits(1);
          if (!visited) localStorage.setItem("rn_visited", "1");
        } else {
          const record = records[0];
          if (!visited) {
            // Nova visita única
            const newCount = (record.count || 0) + 1;
            await base44.entities.SiteVisit.update(record.id, { count: newCount });
            localStorage.setItem("rn_visited", "1");
            setVisits(newCount);
          } else {
            setVisits(record.count || 0);
          }
        }
      } catch {
        setVisits(null);
      }
    };
    incrementAndFetch();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#0d0d0d] border-y border-white/5 py-4"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Visitas */}
        <div className="flex items-center gap-3">
          <Users size={13} className="text-stone/50" />
          <span className="text-[10px] font-mono tracking-[0.3em] text-stone/40 uppercase">
            {t("banner_visits")}
          </span>
          <span className="text-[11px] font-mono font-bold text-alabaster/70">
            {visits !== null ? visits.toLocaleString("pt-BR") : "—"}
          </span>
        </div>

        {/* Cupom */}
        <div className="flex items-center gap-3">
          <Tag size={13} className="text-gold" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-stone/50 uppercase">
            {t("banner_coupon_label")}
          </span>
          <span className="font-mono font-bold text-gold text-xs tracking-[0.15em] border border-gold/30 bg-gold/5 px-3 py-1">
            REDE-NOVA
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            25% OFF
          </span>
        </div>
      </div>
    </motion.div>
  );
}