import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, AlertTriangle, Send, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const DISCORD_LINK = "https://discord.gg/J3MMuGj354";

const FORM_TYPES = [
  {
    id: "appeal",
    icon: AlertTriangle,
    label: "Apelar Punição",
    sublabel: "Banimento ou mute",
    color: "gold",
    description: "Acredita que foi punido injustamente? Preencha o formulário abaixo para apelar à decisão da staff.",
    fields: [
      { key: "nick", label: "Seu Nick no Minecraft", placeholder: "SeuNick123", type: "text" },
      { key: "type", label: "Tipo de Punição", placeholder: "Ban / Mute / Kick", type: "text" },
      { key: "staff", label: "Staff que aplicou (se souber)", placeholder: "NickDaStaff", type: "text" },
      { key: "reason", label: "Motivo informado da punição", placeholder: "Ex: Hack, spam...", type: "text" },
      { key: "defense", label: "Sua defesa / explicação", placeholder: "Explique detalhadamente por que acredita que a punição é injusta...", type: "textarea" },
      { key: "proof", label: "Link de provas (opcional)", placeholder: "https://imgur.com/...", type: "text" },
    ],
  },
  {
    id: "general",
    icon: FileText,
    label: "Formulário Geral",
    sublabel: "Sugestões e reclamações",
    color: "blue",
    description: "Tem uma sugestão, reclamação ou qualquer outro assunto para tratar com a staff? Use este formulário.",
    fields: [
      { key: "nick", label: "Seu Nick no Minecraft", placeholder: "SeuNick123", type: "text" },
      { key: "subject", label: "Assunto", placeholder: "Ex: Sugestão, Reclamação, Dúvida...", type: "text" },
      { key: "message", label: "Mensagem", placeholder: "Descreva seu assunto detalhadamente...", type: "textarea" },
      { key: "contact", label: "Discord (para retorno)", placeholder: "seuusuario#0000 ou @seuusuario", type: "text" },
    ],
  },
];

const colorMap = {
  gold: { text: "text-gold", border: "border-gold/30", bg: "bg-gold/10", btn: "bg-gold text-obsidian hover:bg-gold/90" },
  blue: { text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", btn: "bg-blue-500 text-white hover:bg-blue-600" },
};

function FormPanel({ form }) {
  const c = colorMap[form.color];
  const Icon = form.icon;
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build message for Discord
    const lines = form.fields
      .map((f) => `**${f.label}:** ${values[f.key] || "—"}`)
      .join("\n");
    const msg = encodeURIComponent(`📋 **${form.label}**\n\n${lines}`);
    window.open(DISCORD_LINK, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const allFilled = form.fields
    .filter((f) => f.key !== "proof" && f.key !== "contact")
    .every((f) => values[f.key]?.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`border ${c.border} bg-[#0d0d0d] overflow-hidden`}
    >
      {/* Header */}
      <div className={`${c.bg} border-b ${c.border} px-6 py-4 flex items-center gap-3`}>
        <Icon size={15} className={c.text} />
        <div>
          <p className={`font-heading font-black uppercase tracking-[0.1em] text-sm ${c.text}`}>{form.label}</p>
          <p className="text-stone/50 text-[10px] font-mono">{form.sublabel}</p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-stone text-sm leading-relaxed mb-6">{form.description}</p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Check size={20} className="text-emerald-400" />
              </div>
              <p className="text-emerald-400 font-heading font-bold uppercase tracking-widest text-sm">{t("forms_sent")}</p>
              <p className="text-stone text-xs">{t("forms_sent_desc")}</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
              {form.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] font-mono tracking-[0.25em] text-stone/50 uppercase block mb-1.5">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full bg-white/[0.03] border border-white/8 px-4 py-2.5 text-alabaster text-sm font-mono placeholder-stone/25 focus:outline-none focus:border-gold/30 transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] || ""}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-white/[0.03] border border-white/8 px-4 py-2.5 text-alabaster text-sm font-mono placeholder-stone/25 focus:outline-none focus:border-gold/30 transition-colors"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={!allFilled}
                className={`flex items-center gap-2 px-8 py-3.5 font-heading font-bold text-xs tracking-[0.2em] uppercase transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${c.btn}`}
              >
                <Send size={13} />
                {t("forms_send_btn")}
              </button>
              <p className="text-stone/30 text-[10px] font-mono">
                {t("forms_redirect_note")}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FormsSection() {
  const { t } = useLanguage();
  return (
    <section id="formularios" className="relative py-24 md:py-32 bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-3">
            <FileText size={14} className="text-gold" />
            <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-mono">{t("forms_service")}</span>
          </div>
          <h2 className="font-heading font-black uppercase text-alabaster text-3xl md:text-5xl lg:text-6xl tracking-tight leading-none">
            {t("forms_title")}
            <br />
            <span style={{ WebkitTextStroke: "1px rgba(197,160,89,0.4)", color: "transparent" }}>
              {t("forms_title2")}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FORM_TYPES.map((form) => (
            <FormPanel key={form.id} form={form} />
          ))}
        </div>
      </div>
    </section>
  );
}