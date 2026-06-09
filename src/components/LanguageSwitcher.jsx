import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { languages } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find((l) => l.code === lang);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 border border-white/10 px-3 py-2 hover:border-white/20 transition-colors text-stone hover:text-alabaster active:bg-white/5"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-[10px] font-mono tracking-widest">{current.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute right-0 top-full mt-1 bg-[#111] border border-white/10 shadow-xl min-w-[90px] z-50"
            >
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-[10px] font-mono tracking-widest transition-colors
                    ${lang === l.code ? "text-gold bg-white/5" : "text-stone hover:text-alabaster hover:bg-white/5"}`}
                >
                  <span className="text-sm">{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}