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
    <div className="min-h-screen flex bg-[var(--bg-primary)] relative overflow-hidden">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all duration-300 shadow-md"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {theme === "dark" ? (
            <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </>
          ) : (
            <>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </>
          )}
        </svg>
      </button>

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPjwvc3ZnPg==')] opacity-30" />
        <div className="relative z-10 text-center px-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Planejamento Financeiro
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Controle total dos seus gastos, renda e metas financeiras em um so lugar
          </p>
          <div className="flex gap-4 mt-8 justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <p className="text-white/60 text-sm">Categorias</p>
              <p className="text-white font-bold">Personalizaveis</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <p className="text-white/60 text-sm">Graficos</p>
              <p className="text-white font-bold">Tempo Real</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <p className="text-white/60 text-sm">Multi-usuario</p>
              <p className="text-white font-bold">Compartilhado</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)]">FinanceApp</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            {isLogin
              ? "Entre para acessar seu painel financeiro"
              : "Cadastre-se para comecar a controlar suas financas"}
          </p>

          {error && (
            <div className="bg-[var(--danger-light)] border border-[var(--danger)] text-[var(--danger)] px-4 py-3 rounded-xl mb-6 text-sm animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-slide-in">
                <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full px-4 py-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Carregando...
                </div>
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm"
            >
              {isLogin
                ? "Nao tem conta? Cadastre-se"
                : "Ja tem conta? Faca login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
