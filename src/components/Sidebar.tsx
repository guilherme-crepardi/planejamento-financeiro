"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/categorias", label: "Categorias", icon: "🏷️" },
  { href: "/gastos", label: "Gastos", icon: "💸" },
  { href: "/renda", label: "Renda", icon: "💰" },
  { href: "/resumo", label: "Resumo", icon: "📋" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-[var(--border)] bg-[var(--card)] p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8 text-[var(--primary)]">
        💼 Planejamento
        <br />
        Financeiro
      </h1>
      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === link.href
                ? "bg-[var(--primary)] text-white"
                : "hover:bg-[var(--card-hover)] text-[var(--muted)] hover:text-white"
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="text-xs text-[var(--muted)] mt-auto pt-4 border-t border-[var(--border)]">
        v1.0 — Controle Financeiro
      </div>
    </aside>
  );
}
