"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";
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
  ChevronLeft,
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
  const { collapsed, toggle } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className={`flex items-center gap-3.5 mb-8 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))", boxShadow: "0 4px 14px rgba(79, 110, 247, 0.35)" }}>
          <DollarSign size={22} color="white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-[16px] font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">FinanceApp</h1>
            <p className="text-[11px] text-[var(--text-tertiary)] font-medium">Controle Financeiro</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-tertiary)] px-4 mb-3">Menu</p>
      )}

      <nav className={`flex flex-col gap-1 flex-1 ${collapsed ? "items-center" : ""}`}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? link.label : undefined}
              className={`relative flex items-center gap-3 rounded-2xl transition-all duration-200 group ${
                collapsed ? "justify-center w-11 h-11" : "px-4 py-3"
              } ${
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
              {!collapsed && (
                <span className="text-[13px] font-semibold">{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`mt-auto flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}>
        <button
          onClick={toggleTheme}
          title={collapsed ? (theme === "dark" ? "Modo Claro" : "Modo Escuro") : undefined}
          className={`flex items-center gap-3 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:bg-[var(--bg-inset)] ${collapsed ? "justify-center w-11 h-11" : "px-4 py-3"}`}
        >
          {theme === "dark" ? <Sun size={21} strokeWidth={1.8} className="text-[var(--text-tertiary)]" /> : <Moon size={21} strokeWidth={1.8} className="text-[var(--text-tertiary)]" />}
          {!collapsed && <span className="text-[13px] font-semibold">{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>}
        </button>

        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] ${collapsed ? "justify-center w-11 h-11 p-0" : ""}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }}>
            <User size={16} color="white" strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[var(--text-primary)] truncate">{user?.name || user?.email}</p>
              <p className="text-[10px] text-[var(--text-tertiary)] truncate">{user?.email}</p>
            </div>
          )}
        </div>

        <button
          onClick={signOut}
          title={collapsed ? "Sair" : undefined}
          className={`flex items-center gap-3 rounded-2xl text-[var(--danger)] hover:bg-[var(--danger-light)] transition-all ${collapsed ? "justify-center w-11 h-11" : "px-4 py-3"}`}
        >
          <LogOut size={21} strokeWidth={1.8} />
          {!collapsed && <span className="text-[13px] font-semibold">Sair da conta</span>}
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

      {/* Mobile sidebar (fixed overlay) */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-4 flex flex-col z-[65] transition-transform duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden w-[264px] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ boxShadow: "8px 0 32px rgba(0,0,0,0.12)" }}
      >
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--bg-inset)] text-[var(--text-tertiary)]">
          <X size={20} />
        </button>
        {navContent}
      </aside>

      {/* Desktop sidebar (in document flow, NOT fixed) */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-4 transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          collapsed ? "w-[76px]" : "w-[264px]"
        }`}
        style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.04)" }}
      >
        <button
          onClick={toggle}
          className="absolute -right-3 top-9 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "var(--bg-surface)", border: "2px solid var(--border-default)", boxShadow: "var(--shadow-md)", color: "var(--text-tertiary)" }}
        >
          <ChevronLeft size={14} strokeWidth={2.5} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
        {navContent}
      </aside>
    </>
  );
}
