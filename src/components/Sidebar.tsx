"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import { Icon } from "./Icon";

const links = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/categorias", label: "Categorias", icon: "category" },
  { href: "/gastos", label: "Gastos", icon: "receipt_long" },
  { href: "/renda", label: "Renda", icon: "payments" },
  { href: "/resumo", label: "Resumo", icon: "chart" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { collapsed, toggle } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className={`flex items-center gap-3 mb-8 ${collapsed ? "justify-center px-0" : "px-1"}`}>
        <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        {!collapsed && (
          <div className="hidden lg:block overflow-hidden">
            <h1 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">FinanceApp</h1>
            <p className="text-[11px] text-[var(--text-tertiary)] font-medium">Controle Financeiro</p>
          </div>
        )}
      </div>

      <div className={`${collapsed ? "px-0" : "px-1"} mb-2`}>
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] px-3 mb-2">Menu</p>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? link.label : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-all duration-200 group ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              style={isActive ? {
                background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                boxShadow: "0 2px 12px rgba(79, 110, 247, 0.35)",
              } : {}}
            >
              <Icon
                name={link.icon}
                size={20}
                className={isActive ? "text-white" : "text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)]"}
              />
              {!collapsed && (
                <span className="text-[13px] font-semibold hidden lg:block">{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <button
          onClick={toggleTheme}
          title={collapsed ? (theme === "dark" ? "Modo Claro" : "Modo Escuro") : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:bg-[var(--bg-inset)] ${collapsed ? "justify-center" : ""}`}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={20} className="text-[var(--text-tertiary)]" />
          {!collapsed && (
            <span className="text-[13px] font-semibold hidden lg:block">
              {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
            </span>
          )}
        </button>

        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-inset)] border border-[var(--border-subtle)] ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }}>
            <Icon name="user" size={15} className="text-white" />
          </div>
          {!collapsed && (
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{user?.name || user?.email}</p>
              <p className="text-[10px] text-[var(--text-tertiary)] truncate">{user?.email}</p>
            </div>
          )}
        </div>

        <button
          onClick={signOut}
          title={collapsed ? "Sair" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[var(--danger)] hover:bg-[var(--danger-light)] transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <Icon name="logout" size={20} />
          {!collapsed && (
            <span className="text-[13px] font-semibold hidden lg:block">Sair</span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] md:hidden p-2.5 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-lg"
      >
        <Icon name="menu" size={20} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-4 flex flex-col z-50 transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] md:translate-x-0 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } ${mobileOpen ? "translate-x-0 w-[260px] shadow-2xl" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-inset)] text-[var(--text-tertiary)]"
        >
          <Icon name="x" size={18} />
        </button>

        <button
          onClick={toggle}
          className="hidden md:flex absolute -right-3 top-8 z-10 w-6 h-6 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {navContent}
      </aside>
    </>
  );
}
