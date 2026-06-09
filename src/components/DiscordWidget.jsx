import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const DISCORD_SERVER_ID = "1474229956706828390";

export default function DiscordWidget() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden border border-[#5865F2]/30 bg-[#0a0a0a]"
    >
      {/* Top accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#5865F2] to-transparent" />

      <div className="flex flex-col md:flex-row items-stretch">
        {/* Left info */}
        <div className="flex flex-col justify-center p-8 md:p-10 md:w-1/2 border-b md:border-b-0 md:border-r border-white/5">
          <div className="flex items-center gap-3 mb-4">
            {/* Discord SVG icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#5865F2] uppercase">Discord</span>
          </div>
          <h3 className="font-heading font-black text-alabaster text-2xl md:text-3xl uppercase tracking-tight mb-3">
            {t("discord_title")}<br />
            <span style={{ WebkitTextStroke: "1px rgba(88,101,242,0.6)", color: "transparent" }}>
              {t("discord_title2")}
            </span>
          </h3>
          <p className="text-stone text-sm leading-relaxed mb-6">
            {t("discord_desc")}
          </p>
          <a
            href="https://discord.com/invite/ZyvGtZ5B?utm_source=Discord%20Widget&utm_medium=Connect"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-heading font-bold text-xs tracking-[0.2em] uppercase px-6 py-3.5 transition-colors self-start"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            {t("discord_btn")}
          </a>
        </div>

        {/* Right - embed widget */}
        <div className="md:w-1/2 min-h-[300px] flex items-center justify-center p-6 bg-[#1a1a2e]/40">
          <iframe
            src={`https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=dark`}
            width="350"
            height="500"
            allowTransparency="true"
            frameBorder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            title="Discord Widget"
          />
        </div>
      </div>
    </motion.div>
  );
}