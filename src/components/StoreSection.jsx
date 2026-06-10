import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Tag, CheckCircle, XCircle, FlaskConical } from "lucide-react";
import StoreCard from "./StoreCard";
import CheckoutModal from "./CheckoutModal";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

const STAFF_ROLES = ["Dono", "Co-Dono", "Administrador", "Moderador", "Helper"];

export default function StoreSection({ storeImages, user }) {
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const { t } = useLanguage();

  const isStaff = user && STAFF_ROLES.includes(user.role);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setAppliedCoupon(null);
    try {
      let coupon;
      if (couponCode.trim().toUpperCase() === "REDE-NOVA") {
        coupon = {
          code: "REDE-NOVA",
          discount_type: "percent",
          discount_value: 25,
          active: true,
          uses_left: -1
        };
      } else {
        const results = await base44.entities.Coupon.filter({ code: couponCode.trim().toUpperCase(), active: true });
        coupon = results[0];
      }

      if (!coupon) {
        setCouponError(t("store_coupon_invalid"));
      } else if (coupon.uses_left === 0) {
        setCouponError(t("store_coupon_no_uses"));
      } else {
        setAppliedCoupon(coupon);
      }
    } catch {
      setCouponError(t("store_coupon_error"));
    }
    setCouponLoading(false);
  };

  const handleTestPurchase = async () => {
    if (!user) return;
    setTestLoading(true);
    setTestSuccess(false);
    try {
      await base44.entities.Purchase.create({
        nick: user.minecraft_nick || user.username || "Staff",
        item_name: "TESTE STAFF",
        amount: 0,
        confirmed: true,
      });
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 4000);
    } catch {}
    setTestLoading(false);
  };

  const storeItems = [
    {
      id: 1,
      name: "PRO",
      type: "rank",
      description: t("rank_pro_desc"),
      price: "R$ 13,90",
      period: "/mês",
      image: storeImages[0],
      features: [
        "Tag [PRO] · Prioridade de login",
        "/craft · /hat · /back",
        "3 homes",
        "+5% /sell · +5% Coins/mine",
        "+5% Coins/hora online",
        "Kit PRO (72h)",
      ],
      popular: false,
      color: "emerald",
      discordRoleId: "",
    },
    {
      id: 2,
      name: "ELITE",
      type: "rank",
      description: t("rank_elite_desc"),
      price: "R$ 27,90",
      period: "/mês",
      image: storeImages[1],
      features: [
        "Tudo do PRO incluído",
        "Tag [ELITE] · Battle Pass +10% XP",
        "/enderchest · /trash",
        "5 homes",
        "+10% /sell · +10% Coins/mine",
        "Cooldown RTP 25% menor",
        "Kit ELITE (1 semana)",
      ],
      popular: false,
      color: "gold",
      discordRoleId: "",
    },
    {
      id: 3,
      name: "MVP",
      type: "rank",
      description: t("rank_mvp_desc"),
      price: "R$ 49,90",
      period: "/mês",
      image: storeImages[2],
      features: [
        "Tudo do ELITE incluído",
        "Tag [MVP] · Battle Pass +20% XP",
        "/anvil · 8 homes",
        "30 min de fly a cada 24h",
        "+15% /sell · +15% Coins/mine",
        "Cooldown RTP 50% menor",
        "Kit MVP (2 semanas)",
      ],
      popular: true,
      color: "purple",
      discordRoleId: "",
    },
    {
      id: 4,
      name: "UNBAN",
      type: "item",
      description: t("rank_unban_desc"),
      price: "R$ 50,00",
      period: "",
      image: storeImages[3],
      features: ["Compra única", "Processado por ticket", "Análise pela staff", "Resposta em até 24h"],
      popular: false,
      color: "blue",
      ticket: true,
    },
  ];

  return (
    <section id="store" className="relative py-24 md:py-32 bg-obsidian">
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
              <ShoppingBag size={14} className="text-gold" />
              <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-mono">{t("store_label")}</span>
            </div>
            <h2 className="font-heading font-black uppercase text-alabaster text-3xl md:text-5xl lg:text-6xl tracking-tight leading-none">
              {t("store_title")}
              <br />
              <span style={{ WebkitTextStroke: "1px rgba(197,160,89,0.4)", color: "transparent" }}>
                {t("store_title2")}
              </span>
            </h2>
          </div>
          <p className="text-stone text-sm max-w-xs leading-relaxed">
            {t("store_subtitle")}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {storeItems.map((item, index) => (
            <StoreCard key={item.id} item={item} index={index} onBuy={() => setCheckoutItem(item)} />
          ))}
        </div>

        {/* Cupom */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 max-w-md mx-auto"
        >
          <p className="text-[10px] font-mono tracking-[0.3em] text-stone/50 uppercase mb-2 flex items-center gap-2">
            <Tag size={10} className="text-gold" /> {t("store_coupon_label")}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); setAppliedCoupon(null); }}
              placeholder={t("store_coupon_placeholder")}
              className="flex-1 bg-white/[0.04] border border-white/10 px-4 py-2.5 text-alabaster text-sm font-mono placeholder-stone/30 focus:outline-none focus:border-gold/40 transition-colors uppercase"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              className="bg-gold text-obsidian font-heading font-bold text-xs tracking-widest px-5 py-2.5 hover:bg-gold/90 transition-colors disabled:opacity-30"
            >
              {couponLoading ? t("store_coupon_applying") : t("store_coupon_apply")}
            </button>
          </div>
          {appliedCoupon && (
            <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs font-mono">
              <CheckCircle size={12} />
              {t("store_coupon_applied")} {appliedCoupon.discount_type === "percent"
                ? `${appliedCoupon.discount_value}% ${t("store_coupon_percent")}`
                : `R$ ${appliedCoupon.discount_value} ${t("store_coupon_fixed")}`}
            </div>
          )}
          {couponError && (
            <div className="mt-2 flex items-center gap-2 text-red-400 text-xs font-mono">
              <XCircle size={12} /> {couponError}
            </div>
          )}
        </motion.div>

        {/* Botão de teste — só staff */}
        {isStaff && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={handleTestPurchase}
              disabled={testLoading}
              className="flex items-center gap-2 border border-dashed border-gold/30 bg-gold/5 text-gold text-xs font-mono tracking-widest px-6 py-2.5 hover:bg-gold/10 transition-colors disabled:opacity-40"
            >
              <FlaskConical size={13} />
              {testLoading ? t("store_testing") : testSuccess ? t("store_tested") : t("store_test")}
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-6"
        >
          <div className="h-px flex-1 bg-white/5" />
          <p className="text-stone/40 text-[10px] tracking-[0.25em] uppercase font-mono whitespace-nowrap">
            {t("store_delivery")}
          </p>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>
      </div>

      {checkoutItem && (
        <CheckoutModal item={checkoutItem} userNick={user?.minecraft_nick || ""} appliedCoupon={appliedCoupon} onClose={() => setCheckoutItem(null)} />
      )}
    </section>
  );
}