import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Ticket, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

const DISCORD_LINK = "https://discord.com/invite/ZyvGtZ5B?utm_source=Discord%20Widget&utm_medium=Connect";

export default function CheckoutModal({ item, onClose, userNick = "", appliedCoupon = null }) {
  const [step, setStep] = useState("form"); // form | pix
  const [nick, setNick] = useState(userNick);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null); // { qr_code, qr_code_base64, mp_payment_id }
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const basePrice = parseFloat(item.price.replace("R$ ", "").replace(",", "."));
  const discountedPrice = appliedCoupon
    ? appliedCoupon.discount_type === "percent"
      ? Math.max(0, basePrice - (basePrice * appliedCoupon.discount_value / 100))
      : Math.max(0, basePrice - appliedCoupon.discount_value)
    : basePrice;
  const displayPrice = `R$ ${discountedPrice.toFixed(2).replace(".", ",")}`;
  const isFree = discountedPrice === 0;

  const isTicket = item.ticket;
  const isRank = item.type === "rank";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = async () => {
    if (!nick.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("mpCreatePix", {
        nick: nick.trim(),
        item_name: item.name,
        amount: discountedPrice,
        coupon_code: appliedCoupon?.code || "",
      });
      setPixData({
        qr_code: res.data.qr_code,
        qr_code_base64: res.data.qr_code_base64,
        mp_payment_id: res.data.mp_payment_id,
      });
      setStep("pix");
    } catch (err) {
      setError(err?.response?.data?.error || "Erro ao gerar PIX. Tente novamente.");
    }
    setLoading(false);
  };

  // Unban — ticket no Discord
  if (isTicket) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-white/10 w-full max-w-md shadow-2xl"
          >
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div>
                <p className="text-[10px] font-mono tracking-[0.3em] text-stone/50 uppercase">{t("checkout_label")}</p>
                <p className="text-alabaster font-heading font-bold text-sm mt-0.5">{item.name}</p>
              </div>
              <button onClick={onClose} className="text-stone hover:text-alabaster transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="border border-blue-500/20 bg-blue-500/5 p-4 space-y-2">
                <p className="text-blue-400 text-[10px] tracking-widest font-mono uppercase">{t("checkout_unban_value")}</p>
                <p className="text-alabaster font-mono font-bold text-xl">{item.price}</p>
                <p className="text-stone/60 text-xs">Pagamento único — processado pela staff</p>
              </div>
              <p className="text-stone text-sm leading-relaxed">
                {t("checkout_unban_desc")}
              </p>
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#5865F2] text-white font-heading font-bold text-xs tracking-[0.15em] uppercase py-3.5 hover:bg-[#4752c4] transition-colors"
              >
                <Ticket size={14} />
                {t("checkout_unban_btn")}
              </a>
              <p className="text-stone/40 text-[10px] text-center font-mono">{t("checkout_unban_time")}</p>
              <button onClick={onClose} className="w-full border border-white/10 text-stone text-xs font-heading tracking-widest py-2.5 hover:text-alabaster transition-colors">
                {t("checkout_close")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111] border border-white/10 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-stone/50 uppercase">
                {step === "form" ? t("checkout_label") : t("checkout_pix_label")}
              </p>
              <p className="text-alabaster font-heading font-bold text-sm mt-0.5">{item.name}</p>
            </div>
            <button onClick={onClose} className="text-stone hover:text-alabaster transition-colors"><X size={18} /></button>
          </div>

          <div className="p-6">
            {step === "form" ? (
              <div className="space-y-5">
                {/* Price */}
                <div className="flex items-baseline justify-between border border-white/8 bg-white/[0.02] px-4 py-3">
                  <span className="text-stone text-xs font-mono">{item.name}</span>
                  <div className="text-right">
                    {appliedCoupon && (
                      <span className="text-stone/40 font-mono text-xs line-through mr-2">{item.price}</span>
                    )}
                    <span className="text-gold font-mono font-bold">{displayPrice}<span className="text-stone/50 text-[10px]">{item.period}</span></span>
                  </div>
                </div>
                {appliedCoupon && (
                  <div className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                    ✓ Cupom <span className="font-bold">{appliedCoupon.code}</span> aplicado
                  </div>
                )}

                {/* Nick */}
                <div>
                  <label className="text-[10px] font-mono tracking-[0.25em] text-stone/60 uppercase block mb-2">{t("checkout_nick_label")}</label>
                  <input
                    type="text"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                    placeholder="SeuNick123"
                    className="w-full bg-white/[0.04] border border-white/10 px-4 py-2.5 text-alabaster text-sm font-mono placeholder-stone/30 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {/* Rank preference (apenas para ranks) */}
                {isRank && (
                  <div className="border border-gold/15 bg-gold/5 p-4">
                    <p className="text-gold text-[10px] tracking-[0.25em] font-mono uppercase mb-1">{t("checkout_rank_chosen")}</p>
                    <p className="text-alabaster font-heading font-bold">{item.name} — {item.price}{item.period}</p>
                    <p className="text-stone/50 text-xs mt-1">{t("checkout_rank_note")}</p>
                  </div>
                )}

                {error && (
                  <p className="text-red-400 text-xs font-mono border border-red-400/20 bg-red-400/5 px-3 py-2">{error}</p>
                )}

                <button
                  onClick={handleContinue}
                  disabled={!nick.trim() || loading}
                  className="w-full bg-gold text-obsidian font-heading font-bold text-xs tracking-[0.2em] uppercase py-3.5 hover:bg-gold/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin" /> {t("checkout_generating")}</>
                  ) : isFree ? t("checkout_free") : t("checkout_pay")}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-stone text-sm">{t("checkout_scan")}</p>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-3 border border-white/10 bg-white/[0.03] p-4">
                  {pixData?.qr_code_base64 ? (
                    <img
                      src={`data:image/png;base64,${pixData.qr_code_base64}`}
                      alt="QR Code PIX"
                      className="w-44 h-44 bg-white p-1"
                    />
                  ) : (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=${encodeURIComponent(pixData?.qr_code || "")}&bgcolor=ffffff&color=000000`}
                      alt="QR Code PIX"
                      className="w-44 h-44"
                    />
                  )}
                  <p className="text-stone/50 text-[9px] font-mono tracking-widest">{t("checkout_scan_label")}</p>
                </div>

                {/* PIX Copia e Cola */}
                {pixData?.qr_code && (
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.2em] text-stone/50 uppercase mb-1.5">{t("checkout_copia_label")}</p>
                    <div className="border border-white/10 bg-white/[0.03] p-3 flex items-center justify-between gap-3">
                      <span className="font-mono text-alabaster text-xs truncate">{pixData.qr_code.slice(0, 40)}...</span>
                      <button onClick={() => handleCopy(pixData.qr_code)} className="text-gold hover:text-gold/70 transition-colors flex-shrink-0 flex items-center gap-1">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span className="text-[9px] font-mono">{copied ? t("checkout_copied") : t("checkout_copy")}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Valor */}
                <div className="border border-gold/20 bg-gold/5 p-3">
                  <p className="text-gold text-[10px] tracking-widest font-mono uppercase mb-1">{t("checkout_value_label")}</p>
                  <p className="text-alabaster font-mono font-bold text-lg">{displayPrice}{item.period}</p>
                  <p className="text-stone/50 text-xs mt-1">Nick: <span className="text-gold">{nick}</span> · Item: <span className="text-gold">{item.name}</span></p>
                  {pixData?.mp_payment_id && (
                    <p className="text-stone/30 text-[9px] font-mono mt-1">ID: {pixData.mp_payment_id}</p>
                  )}
                </div>

                {/* Instrução automática */}
                <div className="border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-emerald-400 text-[10px] font-mono tracking-widest uppercase mb-1">{t("checkout_auto_title")}</p>
                  <p className="text-stone/70 text-xs leading-relaxed">
                    {t("checkout_auto_desc")}
                  </p>
                </div>

                <a
                  href={DISCORD_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#5865F2] text-white font-heading font-bold text-xs tracking-[0.15em] uppercase py-3 hover:bg-[#4752c4] transition-colors"
                >
                  {t("checkout_support")}
                </a>

                <button
                  onClick={() => setStep("form")}
                  className="w-full border border-white/10 text-stone text-xs font-heading tracking-widest py-2.5 hover:text-alabaster transition-colors"
                >
                  {t("checkout_back")}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}