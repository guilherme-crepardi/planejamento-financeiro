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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      <div className="animate-fade-in-up">
        <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-[var(--text-tertiary)] text-[13px] sm:text-[15px] mt-1 font-medium">Visao geral das suas financas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "50ms", gap: "40px" }}>
        {summaryCards.map((card) => (
          <div key={card.label} className="card px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16 group transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center" style={{ background: card.bg }}>
                <card.Icon size={20} strokeWidth={2} style={{ color: card.color }} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <span className="text-[10px] sm:text-[12px] font-bold text-[var(--text-tertiary)]">{card.count}</span>
            </div>
            <p className="text-[13px] sm:text-[15px] font-medium text-[var(--text-tertiary)] mb-1 sm:mb-2">{card.label}</p>
            <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-extrabold tracking-tight" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "100ms", gap: "40px" }}>
        <div className="card px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-primary-light)" }}>
              <PieIcon size={18} strokeWidth={2} style={{ color: "var(--accent-primary)" }} className="sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-[14px] sm:text-[16px] lg:text-[17px] font-bold text-[var(--text-primary)] tracking-tight">Gastos por Categoria</h2>
          </div>
          {porCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={porCategoria} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="valor" nameKey="nome"
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}>
                  {porCategoria.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)}
                  contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "14px", color: "var(--text-primary)", boxShadow: "var(--shadow-xl)", padding: "10px 14px" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-[var(--text-tertiary)]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5" style={{ background: "var(--bg-inset)" }}>
                <PieIcon size={24} strokeWidth={1.5} className="opacity-30" />
              </div>
              <p className="text-sm font-semibold">Nenhum gasto registrado</p>
            </div>
          )}
        </div>

        <div className="card px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,92,252,0.1)" }}>
              <BarChart3 size={18} strokeWidth={2} style={{ color: "#7c5cfc" }} className="sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-[14px] sm:text-[16px] lg:text-[17px] font-bold text-[var(--text-primary)] tracking-tight">Gastos por Periodicidade</h2>
          </div>
          {gastos.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} fontWeight={600} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => fmt(v)}
                  contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "14px", color: "var(--text-primary)", boxShadow: "var(--shadow-xl)", padding: "10px 14px" }} />
                <Bar dataKey="valor" radius={[10, 10, 0, 0]} barSize={40}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-[var(--text-tertiary)]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5" style={{ background: "var(--bg-inset)" }}>
                <BarChart3 size={24} strokeWidth={1.5} className="opacity-30" />
              </div>
              <p className="text-sm font-semibold">Nenhum gasto registrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="card px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
          <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--warning-light)" }}>
            <FileText size={18} strokeWidth={2} style={{ color: "var(--warning)" }} className="sm:w-5 sm:h-5" />
          </div>
          <h2 className="text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-[var(--text-primary)] tracking-tight">Ultimos Registros</h2>
        </div>
        {gastos.length > 0 ? (
          <div className="overflow-x-auto -mx-5 sm:-mx-8 lg:-mx-10">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["Descricao", "Categoria", "Periodo", "Valor"].map((h) => (
                    <th key={h} className={`py-3 px-3 sm:py-4 sm:px-5 lg:py-5 lg:px-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)] ${h === "Valor" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gastos.slice(-10).reverse().map((g) => {
                  const cat = categorias.find((c) => c.id === g.categoria_id);
                  return (
                    <tr key={g.id} className="table-row" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td className="py-4 px-3 sm:py-5 sm:px-5 lg:py-6 lg:px-6 font-bold text-[var(--text-primary)]">{g.descricao}</td>
                      <td className="py-4 px-3 sm:py-5 sm:px-5 lg:py-6 lg:px-6">
                        <span className="flex items-center gap-2 sm:gap-2.5">
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ background: cat?.cor }} />
                          <span className="text-[var(--text-secondary)] font-medium text-xs sm:text-sm">{cat?.nome || "—"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-3 sm:py-5 sm:px-5 lg:py-6 lg:px-6">
                        <span className="badge text-[10px] sm:text-xs" style={{
                          background: g.periodicidade === "semanal" ? "var(--accent-primary-light)" : g.periodicidade === "mensal" ? "rgba(124,92,252,0.1)" : "var(--warning-light)",
                          color: g.periodicidade === "semanal" ? "var(--accent-primary)" : g.periodicidade === "mensal" ? "#7c5cfc" : "var(--warning)",
                        }}>
                          {g.periodicidade}
                        </span>
                      </td>
                      <td className="py-4 px-3 sm:py-5 sm:px-5 lg:py-6 lg:px-6 text-right font-extrabold text-[13px] sm:text-[14px] lg:text-[15px]" style={{ color: "var(--danger)" }}>{fmt(g.valor)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-[var(--text-tertiary)]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5" style={{ background: "var(--bg-inset)" }}>
              <FileText size={24} strokeWidth={1.5} className="opacity-30" />
            </div>
            <p className="text-sm font-semibold">Nenhum registro ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
