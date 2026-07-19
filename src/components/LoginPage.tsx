"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

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
    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, name);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 p-3 rounded-[var(--radius-md)] border transition-all"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-md)", color: "var(--text-secondary)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {theme === "dark" ? (
            <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>
          ) : (
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          )}
        </svg>
      </button>

      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20" style={{ background: "white", filter: "blur(80px)" }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-15" style={{ background: "white", filter: "blur(100px)" }} />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-8"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h1 className="text-[40px] font-bold text-white mb-4 leading-tight tracking-tight">
            Controle Financeiro
          </h1>
          <p className="text-white/70 text-[17px] leading-relaxed">
            Gerencie seus gastos, renda e metas de forma simples e inteligente
          </p>
          <div className="flex gap-3 mt-10 justify-center">
            {[{ t: "Categorias", d: "Personalizaveis" }, { t: "Graficos", d: "Em tempo real" }, { t: "Multi-user", d: "Compartilhado" }].map((item) => (
              <div key={item.t} className="rounded-[var(--radius-md)] px-5 py-3" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                <p className="text-white/50 text-[11px] font-medium uppercase tracking-wider">{item.t}</p>
                <p className="text-white font-bold text-sm mt-0.5">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)]">FinanceApp</span>
          </div>

          <h2 className="text-[28px] font-bold text-[var(--text-primary)] mb-1 tracking-tight">
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </h2>
          <p className="text-[var(--text-tertiary)] mb-8 text-[15px]">
            {isLogin ? "Entre para acessar seu painel" : "Cadastre-se para comecar"}
          </p>

          {error && (
            <div className="px-4 py-3 rounded-[var(--radius-md)] mb-6 text-sm font-medium animate-scale-in"
              style={{ background: "var(--danger-light)", border: "1px solid var(--danger-medium)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] mb-1.5 block">Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required className="input" />
              </div>
            )}
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="input" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] mb-1.5 block">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 caracteres" required minLength={6} className="input" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-[15px] mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Carregando...
                </div>
              ) : isLogin ? "Entrar" : "Criar Conta"}
            </button>
          </form>

          <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="mt-6 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors text-sm font-medium text-center w-full">
            {isLogin ? "Nao tem conta? Cadastre-se" : "Ja tem conta? Faca login"}
          </button>
        </div>
      </div>
    </div>
  );
}
