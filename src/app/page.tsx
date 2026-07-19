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
    <div className="max-w-[1280px] mx-auto px-2 md:px-0 space-y-14">
      <div className="animate-fade-in-up">
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-[var(--text-tertiary)] text-[15px] mt-1 font-medium">Visao geral das suas financas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        {summaryCards.map((card) => (
          <div key={card.label} className="card p-8 group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: card.bg }}>
                <card.Icon size={22} strokeWidth={2} style={{ color: card.color }} />
              </div>
              <span className="text-[12px] font-bold text-[var(--text-tertiary)]">{card.count}</span>
            </div>
            <p className="text-[14px] font-medium text-[var(--text-tertiary)] mb-1">{card.label}</p>
            <p className="text-[26px] font-extrabold tracking-tight" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-primary-light)" }}>
              <PieIcon size={18} strokeWidth={2} style={{ color: "var(--accent-primary)" }} />
            </div>
            <h2 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">Gastos por Categoria</h2>
          </div>
          {porCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={porCategoria} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="valor" nameKey="nome"
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}>
                  {porCategoria.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)}
                  contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "14px", color: "var(--text-primary)", boxShadow: "var(--shadow-xl)", padding: "10px 14px" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-tertiary)]">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--bg-inset)" }}>
                <PieIcon size={28} strokeWidth={1.5} className="opacity-30" />
              </div>
              <p className="text-sm font-semibold">Nenhum gasto registrado</p>
            </div>
          )}
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,92,252,0.1)" }}>
              <BarChart3 size={18} strokeWidth={2} style={{ color: "#7c5cfc" }} />
            </div>
            <h2 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">Gastos por Periodicidade</h2>
          </div>
          {gastos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke={textColor} fontSize={13} tickLine={false} axisLine={false} fontWeight={600} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => fmt(v)}
                  contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "14px", color: "var(--text-primary)", boxShadow: "var(--shadow-xl)", padding: "10px 14px" }} />
                <Bar dataKey="valor" radius={[10, 10, 0, 0]} barSize={48}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-tertiary)]">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--bg-inset)" }}>
                <BarChart3 size={28} strokeWidth={1.5} className="opacity-30" />
              </div>
              <p className="text-sm font-semibold">Nenhum gasto registrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="card p-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--warning-light)" }}>
            <FileText size={18} strokeWidth={2} style={{ color: "var(--warning)" }} />
          </div>
          <h2 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">Ultimos Registros</h2>
        </div>
        {gastos.length > 0 ? (
          <div className="overflow-x-auto -mx-6 md:mx-0">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["Descricao", "Categoria", "Periodo", "Valor"].map((h) => (
                    <th key={h} className={`py-5 px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)] ${h === "Valor" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gastos.slice(-10).reverse().map((g) => {
                  const cat = categorias.find((c) => c.id === g.categoria_id);
                  return (
                    <tr key={g.id} className="table-row" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td className="py-5 px-6 font-bold text-[var(--text-primary)]">{g.descricao}</td>
                      <td className="py-5 px-6">
                        <span className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat?.cor }} />
                          <span className="text-[var(--text-secondary)] font-medium">{cat?.nome || "—"}</span>
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="badge" style={{
                          background: g.periodicidade === "semanal" ? "var(--accent-primary-light)" : g.periodicidade === "mensal" ? "rgba(124,92,252,0.1)" : "var(--warning-light)",
                          color: g.periodicidade === "semanal" ? "var(--accent-primary)" : g.periodicidade === "mensal" ? "#7c5cfc" : "var(--warning)",
                        }}>
                          {g.periodicidade}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right font-extrabold text-[15px]" style={{ color: "var(--danger)" }}>{fmt(g.valor)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--text-tertiary)]">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--bg-inset)" }}>
              <FileText size={28} strokeWidth={1.5} className="opacity-30" />
            </div>
            <p className="text-sm font-semibold">Nenhum registro ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
