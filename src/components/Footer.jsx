import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

const scroll = (href) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative bg-[#080808] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="https://media.base44.com/images/public/6a050568876b935d32dff419/eb920826c_server-icon.png"
                alt="Rede Nova"
                className="w-8 h-8 object-contain"
              />
              <span className="font-heading font-black text-base tracking-[0.2em] uppercase text-alabaster">
                REDE NOVA
              </span>
            </div>
            <p className="text-stone text-xs leading-relaxed max-w-xs">
              {t("footer_brand_desc")}
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-stone/50 uppercase mb-4">{t("footer_nav")}</p>
            <div className="space-y-2">
              {[
                { label: "Início", href: "#hero" },
                { label: "Regras", href: "#rules" },
                { label: "Loja", href: "#store" },
                { label: "Staff", href: "#staff" },
              ].map((link) => (
                <button
                  key={link.href}
                  onClick={() => scroll(link.href)}
                  className="block text-stone text-xs hover:text-alabaster transition-colors tracking-wide"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Server IP */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-stone/50 uppercase mb-4">{t("footer_ip")}</p>
            <div className="border border-white/8 bg-white/[0.02] px-4 py-3 mb-3">
              <p className="font-mono text-alabaster font-bold tracking-wide text-sm">
                jogar.redenova.online
              </p>
              <p className="text-stone/40 text-[9px] font-mono tracking-widest mt-1">{t("footer_java")}</p>
              <p className="font-mono text-alabaster/70 font-bold tracking-wide text-xs mt-2">
                mobile.redenova.online <span className="text-gold/60">:38461</span>
              </p>
              <p className="text-stone/40 text-[9px] font-mono tracking-widest mt-0.5">{t("footer_bedrock")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400/70 text-[10px] font-mono tracking-widest">{t("footer_online")}</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone/30 text-[10px] font-mono tracking-widest">
            © 2026 REDE NOVA — {t("footer_rights")}
          </p>
          <p className="text-stone/20 text-[10px] font-mono tracking-widest">
            {t("footer_not_affiliated")}
          </p>
          <p className="text-stone/20 text-[10px] font-mono tracking-widest">
            {t("footer_credit")}
          </p>
        </div>
      </div>
    </footer>
  );
}