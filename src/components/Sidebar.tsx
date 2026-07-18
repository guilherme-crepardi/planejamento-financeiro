"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-xl flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-sm font-bold text-[var(--text-primary)] leading-tight">FinanceApp</h1>
          <p className="text-[10px] text-[var(--text-muted)]">Controle Financeiro</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white shadow-lg shadow-[var(--accent)]/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon
                name={link.icon}
                size={20}
                className={isActive ? "text-white" : "text-[var(--text-muted)] group-hover:text-[var(--accent)]"}
              />
              <span className="text-sm font-medium hidden lg:block">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={20} className="text-[var(--text-muted)]" />
          <span className="text-sm font-medium hidden lg:block">
            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          </span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)]">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-lg flex items-center justify-center">
            <Icon name="user" size={16} className="text-white" />
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--text-primary)] truncate">{user?.name || user?.email}</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--danger)] hover:bg-[var(--danger-light)] transition-all"
        >
          <Icon name="logout" size={20} />
          <span className="text-sm font-medium hidden lg:block">Sair</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-lg"
      >
        <Icon name="menu" size={20} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] p-4 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
        >
          <Icon name="x" size={18} />
        </button>
        {navContent}
      </aside>
    </>
  );
}
