"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { DollarSign, Sun, Moon, Loader2 } from "lucide-react";

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = isLogin ? await signIn(email, password) : await signUp(email, password, name);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <button onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 p-3 rounded-2xl border transition-all hover:scale-105"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-lg)", color: "var(--text-secondary)" }}>
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }}>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-32 -left-20 w-96 h-96 rounded-full opacity-20" style={{ background: "white", filter: "blur(100px)" }} />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15" style={{ background: "white", filter: "blur(80px)" }} />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center mx-auto mb-8"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <DollarSign size={36} color="white" strokeWidth={2} />
          </div>
          <h1 className="text-[44px] font-extrabold text-white mb-4 leading-[1.1] tracking-tight">
            Controle Financeiro
          </h1>
          <p className="text-white/65 text-[18px] leading-relaxed font-medium">
            Gerencie seus gastos, renda e metas de forma simples e inteligente
          </p>
          <div className="flex gap-3 mt-12 justify-center">
            {[
              { t: "Categorias", d: "Personalizaveis" },
              { t: "Graficos", d: "Em tempo real" },
              { t: "Multi-user", d: "Compartilhado" },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl px-6 py-4"
                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <p className="text-white/45 text-[11px] font-bold uppercase tracking-[0.12em]">{item.t}</p>
                <p className="text-white font-bold text-[15px] mt-1">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-14">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-3.5 mb-12">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))", boxShadow: "0 4px 14px rgba(79, 110, 247, 0.35)" }}>
              <DollarSign size={22} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-xl text-[var(--text-primary)]">FinanceApp</span>
          </div>

          <h2 className="text-[32px] font-extrabold text-[var(--text-primary)] mb-1 tracking-tight leading-tight">
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </h2>
          <p className="text-[var(--text-tertiary)] mb-8 text-[15px] font-medium">
            {isLogin ? "Entre para acessar seu painel" : "Cadastre-se para comecar"}
          </p>

          {error && (
            <div className="px-5 py-3.5 rounded-2xl mb-6 text-sm font-semibold animate-scale-in"
              style={{ background: "var(--danger-light)", border: "1px solid var(--danger-medium)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="text-[13px] font-bold text-[var(--text-secondary)] mb-2 block">Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required className="input" />
              </div>
            )}
            <div>
              <label className="text-[13px] font-bold text-[var(--text-secondary)] mb-2 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="input" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-[var(--text-secondary)] mb-2 block">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 caracteres" required minLength={6} className="input" />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-4 text-[15px] mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Carregando...
                </div>
              ) : isLogin ? "Entrar" : "Criar Conta"}
            </button>
          </form>

          <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="mt-8 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors text-sm font-semibold text-center w-full">
            {isLogin ? "Nao tem conta? Cadastre-se" : "Ja tem conta? Faca login"}
          </button>
        </div>
      </div>
    </div>
  );
}
