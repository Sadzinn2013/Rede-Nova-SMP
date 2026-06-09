import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, User, Mail, Lock, Sword } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    minecraft_nick: "",
    password: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "register") {
        // Check if username already exists
        const existing = await base44.entities.ServerUser.filter({ username: form.username });
        if (existing.length > 0) {
          setError("Este nome de usuário já está em uso.");
          setLoading(false);
          return;
        }
        const existingEmail = await base44.entities.ServerUser.filter({ email: form.email });
        if (existingEmail.length > 0) {
          setError("Este email já está cadastrado.");
          setLoading(false);
          return;
        }
        await base44.entities.ServerUser.create({
          username: form.username,
          email: form.email,
          minecraft_nick: form.minecraft_nick,
          password_hash: btoa(form.password),
          rank: "Jogador",
          registered_at: new Date().toISOString(),
        });
        setSuccess("Conta criada com sucesso! Bem-vindo à Rede Nova.");
        setTimeout(() => {
          onSuccess({ username: form.username, rank: "Jogador", minecraft_nick: form.minecraft_nick });
        }, 1500);
      } else {
        const users = await base44.entities.ServerUser.filter({ username: form.username });
        if (users.length === 0) {
          setError("Usuário não encontrado.");
          setLoading(false);
          return;
        }
        const user = users[0];
        if (user.password_hash !== btoa(form.password)) {
          setError("Senha incorreta.");
          setLoading(false);
          return;
        }
        setSuccess(`Bem-vindo de volta, ${user.username}!`);
        setTimeout(() => {
          onSuccess(user);
        }, 1000);
      }
    } catch (err) {
      setError("Algo deu errado. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-obsidian/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md bg-[#111111] border border-white/10 z-10"
        >
          {/* Gold top bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1">
                  {mode === "login" ? "Acessar Conta" : "Criar Conta"}
                </p>
                <h2 className="font-heading font-bold text-alabaster text-2xl tracking-[0.05em] uppercase">
                  {mode === "login" ? "ENTRAR" : "REGISTRAR"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-stone hover:text-alabaster transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border border-white/10 mb-8">
              {["login", "register"].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2.5 text-xs font-heading tracking-[0.15em] uppercase transition-all duration-300 ${
                    mode === m
                      ? "bg-gold text-obsidian font-bold"
                      : "text-stone hover:text-alabaster"
                  }`}
                >
                  {m === "login" ? "ENTRAR" : "REGISTRAR"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                <input
                  type="text"
                  placeholder="Nome de usuário"
                  value={form.username}
                  onChange={set("username")}
                  required
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 outline-none pl-9 pr-4 py-3 text-sm text-alabaster placeholder-stone/50 font-mono transition-colors"
                />
              </div>

              {/* Register-only fields */}
              {mode === "register" && (
                <>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={set("email")}
                      required
                      className="w-full bg-white/5 border border-white/10 focus:border-gold/50 outline-none pl-9 pr-4 py-3 text-sm text-alabaster placeholder-stone/50 font-mono transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Sword size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                    <input
                      type="text"
                      placeholder="Nick no Minecraft"
                      value={form.minecraft_nick}
                      onChange={set("minecraft_nick")}
                      required
                      className="w-full bg-white/5 border border-white/10 focus:border-gold/50 outline-none pl-9 pr-4 py-3 text-sm text-alabaster placeholder-stone/50 font-mono transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Password */}
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Senha"
                  value={form.password}
                  onChange={set("password")}
                  required
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 outline-none pl-9 pr-10 py-3 text-sm text-alabaster placeholder-stone/50 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-alabaster transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Error/Success */}
              {error && (
                <p className="text-red-400 text-xs font-mono tracking-wide">{error}</p>
              )}
              {success && (
                <p className="text-emerald-400 text-xs font-mono tracking-wide">{success}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-obsidian font-heading font-bold text-xs tracking-[0.2em] uppercase py-4 hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "AGUARDE..." : mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
              </button>
            </form>

            {/* Divider */}
            <p className="mt-6 text-center text-stone/40 text-[10px] tracking-widest">
              {mode === "login"
                ? "Não tem conta? "
                : "Já tem conta? "}
              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="text-gold/70 hover:text-gold transition-colors"
              >
                {mode === "login" ? "Registre-se" : "Entre aqui"}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}