"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Tag,
  Receipt,
  Banknote,
  BarChart3,
  Sun,
  Moon,
  LogOut,
  X,
  DollarSign,
  User,
  Menu,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categorias", label: "Categorias", icon: Tag },
  { href: "/gastos", label: "Gastos", icon: Receipt },
  { href: "/renda", label: "Renda", icon: Banknote },
  { href: "/resumo", label: "Resumo", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="flex items-center justify-center mb-8">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))", boxShadow: "0 4px 14px rgba(79, 110, 247, 0.35)" }}>
          <DollarSign size={22} color="white" strokeWidth={2.5} />
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1 items-center">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              title={link.label}
              className={`relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              style={isActive ? {
                background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                boxShadow: "0 4px 14px rgba(79, 110, 247, 0.35)",
              } : {}}
            >
              <Icon size={21} strokeWidth={isActive ? 2.2 : 1.8} className={isActive ? "text-white" : "text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)]"} />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 items-center">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          className="flex items-center justify-center w-11 h-11 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:bg-[var(--bg-inset)]"
        >
          {theme === "dark" ? <Sun size={21} strokeWidth={1.8} className="text-[var(--text-tertiary)]" /> : <Moon size={21} strokeWidth={1.8} className="text-[var(--text-tertiary)]" />}
        </button>

        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)]" title={user?.name || user?.email}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }}>
            <User size={16} color="white" strokeWidth={2.2} />
          </div>
        </div>

        <button
          onClick={signOut}
          title="Sair"
          className="flex items-center justify-center w-11 h-11 rounded-2xl text-[var(--danger)] hover:bg-[var(--danger-light)] transition-all"
        >
          <LogOut size={21} strokeWidth={1.8} />
        </button>
      </div>
    </>
  );

  const mobileNavContent = (
    <>
      <div className="flex items-center gap-3.5 mb-8">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))", boxShadow: "0 4px 14px rgba(79, 110, 247, 0.35)" }}>
          <DollarSign size={22} color="white" strokeWidth={2.5} />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-[16px] font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">FinanceApp</h1>
          <p className="text-[11px] text-[var(--text-tertiary)] font-medium">Controle Financeiro</p>
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-tertiary)] px-4 mb-3">Menu</p>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 rounded-2xl transition-all duration-200 group px-4 py-3 ${
                isActive
                  ? "text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              style={isActive ? {
                background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                boxShadow: "0 4px 14px rgba(79, 110, 247, 0.35)",
              } : {}}
            >
              <Icon size={21} strokeWidth={isActive ? 2.2 : 1.8} className={isActive ? "text-white" : "text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)]"} />
              <span className="text-[13px] font-semibold">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:bg-[var(--bg-inset)] px-4 py-3"
        >
          {theme === "dark" ? <Sun size={21} strokeWidth={1.8} className="text-[var(--text-tertiary)]" /> : <Moon size={21} strokeWidth={1.8} className="text-[var(--text-tertiary)]" />}
          <span className="text-[13px] font-semibold">{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
        </button>

        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }}>
            <User size={16} color="white" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-[var(--text-primary)] truncate">{user?.name || user?.email}</p>
            <p className="text-[10px] text-[var(--text-tertiary)] truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-2xl text-[var(--danger)] hover:bg-[var(--danger-light)] transition-all px-4 py-3"
        >
          <LogOut size={21} strokeWidth={1.8} />
          <span className="text-[13px] font-semibold">Sair da conta</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-5 left-5 z-[70] md:hidden p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <Menu size={22} strokeWidth={2} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-4 flex flex-col z-[65] transition-transform duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden w-[264px] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ boxShadow: "8px 0 32px rgba(0,0,0,0.12)" }}
      >
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--bg-inset)] text-[var(--text-tertiary)]">
          <X size={20} />
        </button>
        {mobileNavContent}
      </aside>

      {/* Desktop sidebar - always collapsed, icons only */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-4 w-[76px]"
        style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.04)" }}
      >
        {navContent}
      </aside>
    </>
  );
}
