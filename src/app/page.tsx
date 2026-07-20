"use client";

import { useFinance } from "@/lib/finance-context";
import { useTheme } from "@/lib/theme-context";
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart as PieIcon, FileText } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function Dashboard() {
  const { theme } = useTheme();
  const { gastos, renda, categorias, totalGastos, totalRenda, saldo, gastosPorCategoria, gastosPorPeriodicidade } = useFinance();

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const porCategoria = gastosPorCategoria();
  const porPeriodicidade = gastosPorPeriodicidade();
  const total = totalGastos();
  const rendaTotal = totalRenda();
  const saldoTotal = saldo();
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  const barData = [
    { name: "Semanal", valor: porPeriodicidade.semanal, fill: "#4f6ef7" },
    { name: "Mensal", valor: porPeriodicidade.mensal, fill: "#7c5cfc" },
    { name: "Anual", valor: porPeriodicidade.anual / 12, fill: "#f59e0b" },
  ];

  const summaryCards = [
    { label: "Renda Total", value: fmt(rendaTotal), color: "var(--success)", bg: "var(--success-light)", Icon: TrendingUp, count: `${renda.length} registros` },
    { label: "Gastos Totais", value: fmt(total), color: "var(--danger)", bg: "var(--danger-light)", Icon: TrendingDown, count: `${gastos.length} registros` },
    { label: "Saldo", value: fmt(saldoTotal), color: saldoTotal >= 0 ? "var(--success)" : "var(--danger)", bg: saldoTotal >= 0 ? "var(--success-light)" : "var(--danger-light)", Icon: Activity, count: saldoTotal >= 0 ? "No lucro" : "No vermelho" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto w-full px-3 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="animate-fade-in-up">
        <h1 className="text-[22px] sm:text-[26px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-[var(--text-tertiary)] text-[12px] sm:text-[14px] mt-1 font-medium">Visao geral das suas financas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "50ms", gap: "16px" }}>
        {summaryCards.map((card) => (
          <div key={card.label} className="card group transition-all duration-300 text-center" style={{ padding: "20px" }}>
            <div className="flex items-center justify-center mb-3 sm:mb-4 lg:mb-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center" style={{ background: card.bg }}>
                <card.Icon size={18} strokeWidth={2} style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-[var(--text-tertiary)] mb-2 sm:mb-3 uppercase tracking-wider">{card.count}</p>
            <p className="text-[12px] sm:text-[13px] font-medium text-[var(--text-tertiary)] mb-1">{card.label}</p>
            <p className="text-[18px] sm:text-[22px] lg:text-[28px] font-extrabold tracking-tight" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "100ms", gap: "16px" }}>
        <div className="card animate-fade-in-up" style={{ padding: "20px" }}>
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-primary-light)" }}>
              <PieIcon size={16} strokeWidth={2} style={{ color: "var(--accent-primary)" }} />
            </div>
            <h2 className="text-[13px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">Gastos por Categoria</h2>
          </div>
          {porCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={porCategoria} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="valor" nameKey="nome"
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}>
                  {porCategoria.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)}
                  contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "14px", color: "var(--text-primary)", boxShadow: "var(--shadow-xl)", padding: "10px 14px" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-[var(--text-tertiary)]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--bg-inset)" }}>
                <PieIcon size={20} strokeWidth={1.5} className="opacity-30" />
              </div>
              <p className="text-[13px] font-semibold">Nenhum gasto registrado</p>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,92,252,0.1)" }}>
              <BarChart3 size={16} strokeWidth={2} style={{ color: "#7c5cfc" }} />
            </div>
            <h2 className="text-[13px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">Gastos por Periodicidade</h2>
          </div>
          {gastos.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} fontWeight={600} />
                <YAxis stroke={textColor} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => fmt(v)}
                  contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "14px", color: "var(--text-primary)", boxShadow: "var(--shadow-xl)", padding: "10px 14px" }} />
                <Bar dataKey="valor" radius={[10, 10, 0, 0]} barSize={36}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-[var(--text-tertiary)]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--bg-inset)" }}>
                <BarChart3 size={20} strokeWidth={1.5} className="opacity-30" />
              </div>
              <p className="text-[13px] font-semibold">Nenhum gasto registrado</p>
            </div>
          )}
        </div>
      </div>

        <div className="card animate-fade-in-up" style={{ padding: "16px", animationDelay: "150ms" }}>
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--warning-light)" }}>
              <FileText size={14} strokeWidth={2} style={{ color: "var(--warning)" }} />
            </div>
            <h2 className="text-[12px] sm:text-[14px] font-bold text-[var(--text-primary)] tracking-tight">Ultimos Registros</h2>
          </div>
          {gastos.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {gastos.slice(-10).reverse().map((g) => {
                const cat = categorias.find((c) => c.id === g.categoria_id);
                return (
                  <div key={g.id} className="flex items-center justify-between" style={{ padding: "8px", borderRadius: "10px", background: "var(--bg-inset)" }}>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat?.cor }} />
                      <div className="min-w-0">
                        <p className="font-bold text-[11px] sm:text-[12px] text-[var(--text-primary)] truncate">{g.descricao}</p>
                        <span className="text-[9px] sm:text-[10px] text-[var(--text-tertiary)]">{cat?.nome || "—"}</span>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-[12px] font-extrabold text-[var(--danger)] shrink-0">{fmt(g.valor)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-[var(--text-tertiary)]">
              <FileText size={20} strokeWidth={1.5} className="opacity-30 mb-2" />
              <p className="text-[12px] font-semibold">Nenhum registro ainda</p>
            </div>
          )}
      </div>
    </div>
  );
}
