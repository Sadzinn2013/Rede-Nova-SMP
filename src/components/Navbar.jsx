import React, { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";

const getNavLinks = (t) => [
  { label: t("nav_home"), href: "#hero" },
  { label: t("nav_rules"), href: "#rules" },
  { label: t("nav_store"), href: "#store" },
  { label: t("nav_goals"), href: "#metas" },
  { label: t("nav_discord"), href: "#discord" },
  { label: t("nav_vote"), href: "#votar" },
];

export default function Navbar({ user, onLogin, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const rankColors = {
    "LEGEND": "text-gold",
    "VIP": "text-emerald-400",
    "Jogador": "text-stone",
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20 relative">
          {/* Logo */}
          <button
            onClick={() => handleClick("#hero")}
            className="flex items-center gap-2 group"
          >
            <img
              src="https://media.base44.com/images/public/6a050568876b935d32dff419/eb920826c_server-icon.png"
              alt="Rede Nova"
              className="h-9 w-9 object-contain"
            />
            <img
              src="https://media.base44.com/images/public/6a050568876b935d32dff419/db4d0b5ce_imagem_2026-05-15_124712316.png"
              alt="Rede Nova texto"
              className="h-7 object-contain"
            />

          </button>

          {/* Desktop nav — centered */}
          <div className="hidden md:flex items-center gap-6">
            {getNavLinks(t).map((link) => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className="relative text-[11px] font-heading tracking-[0.2em] text-stone hover:text-alabaster transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 border border-white/10 px-4 py-2 hover:border-white/20 transition-colors"
                >
                  <div className="w-5 h-5 bg-gold/20 rounded-sm flex items-center justify-center">
                    <User size={11} className="text-gold" />
                  </div>
                  <span className={`text-xs font-mono font-bold ${rankColors[user.rank] || "text-stone"}`}>
                    {user.username}
                  </span>
                  <span className="text-[9px] text-stone/50 font-heading tracking-widest">
                    [{user.rank}]
                  </span>
                  <ChevronDown size={12} className="text-stone" />
                </button>
                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-[#111] border border-white/10 shadow-xl"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-[10px] text-stone tracking-widest">NICK MINECRAFT</p>
                        <p className="text-xs font-mono text-alabaster mt-0.5">{user.minecraft_nick}</p>
                      </div>
                      <button
                        onClick={() => { onLogout(); setUserDropdown(false); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-xs text-stone hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <LogOut size={12} />
                        <span className="font-heading tracking-widest text-[10px]">{t("nav_logout")}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 text-[11px] font-heading tracking-[0.15em] text-stone hover:text-alabaster transition-colors border border-white/10 px-4 py-2 hover:border-white/20"
                >
                  <LogIn size={13} />
                  {t("nav_login")}
                </button>
                <button
                  onClick={() => { setShowAuth(true); }}
                  className="bg-gold text-obsidian text-[11px] font-heading font-bold tracking-[0.15em] px-5 py-2 hover:bg-gold/90 transition-colors"
                >
                  {t("nav_register")}
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-alabaster"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/5"
            >
              <div className="px-6 py-4 space-y-1">
                {getNavLinks(t).map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleClick(link.href)}
                    className="block w-full text-left py-3 text-xs font-heading tracking-[0.2em] text-stone hover:text-alabaster transition-colors border-b border-white/5"
                  >
                    {link.label}
                  </button>
                ))}
                {user ? (
                  <div className="pt-3">
                    <p className="text-[10px] text-stone tracking-widest mb-1">{t("nav_nick")}</p>
                    <p className={`text-sm font-mono font-bold mb-3 ${rankColors[user.rank]}`}>{user.username}</p>
                    <button
                      onClick={() => { onLogout(); setMenuOpen(false); }}
                      className="w-full border border-red-400/30 text-red-400 text-xs font-heading tracking-widest py-2.5"
                    >
                      {t("nav_logout")}
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 flex gap-3">
                    <button
                      onClick={() => { setShowAuth(true); setMenuOpen(false); }}
                      className="flex-1 border border-white/10 text-stone text-xs font-heading tracking-widest py-2.5"
                    >
                      {t("nav_login")}
                    </button>
                    <button
                      onClick={() => { setShowAuth(true); setMenuOpen(false); }}
                      className="flex-1 bg-gold text-obsidian text-xs font-heading font-bold tracking-widest py-2.5"
                    >
                      {t("nav_register")}
                    </button>
                  </div>
                )}
                <div className="pt-3 border-t border-white/5 flex justify-center">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={(userData) => {
            onLogin(userData);
            setShowAuth(false);
          }}
        />
      )}
    </>
  );
}