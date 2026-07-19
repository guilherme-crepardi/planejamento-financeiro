"use client";

import { useFinance } from "@/lib/finance-context";
import { useTheme } from "@/lib/theme-context";
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

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-[26px] font-bold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-[var(--text-tertiary)] text-sm mt-0.5">Visao geral das suas financas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        {[
          {
            label: "Renda Total", value: fmt(rendaTotal), color: "var(--success)",
            bgColor: "var(--success-light)", icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            ), count: `${renda.length} registros`
          },
          {
            label: "Gastos Totais", value: fmt(total), color: "var(--danger)",
            bgColor: "var(--danger-light)", icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
              </svg>
            ), count: `${gastos.length} registros`
          },
          {
            label: "Saldo", value: fmt(saldoTotal), color: saldoTotal >= 0 ? "var(--success)" : "var(--danger)",
            bgColor: saldoTotal >= 0 ? "var(--success-light)" : "var(--danger-light)", icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={saldoTotal >= 0 ? "var(--success)" : "var(--danger)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            ), count: saldoTotal >= 0 ? "No lucro" : "No vermelho"
          },
        ].map((card) => (
          <div key={card.label} className="card p-5 group hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center" style={{ background: card.bgColor }}>
                {card.icon}
              </div>
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)]">{card.count}</span>
            </div>
            <p className="text-[13px] font-medium text-[var(--text-tertiary)] mb-0.5">{card.label}</p>
            <p className="text-[22px] font-bold tracking-tight" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="card p-5">
          <h2 className="text-[15px] font-bold text-[var(--text-primary)] mb-4 tracking-tight">Gastos por Categoria</h2>
          {porCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={porCategoria} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="valor" nameKey="nome"
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}>
                  {porCategoria.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)}
                  contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", boxShadow: "var(--shadow-lg)" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-tertiary)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--bg-inset)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <p className="text-sm font-medium">Nenhum gasto registrado</p>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-[15px] font-bold text-[var(--text-primary)] mb-4 tracking-tight">Gastos por Periodicidade</h2>
          {gastos.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => fmt(v)}
                  contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", boxShadow: "var(--shadow-lg)" }} />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]} barSize={40}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-tertiary)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--bg-inset)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <p className="text-sm font-medium">Nenhum gasto registrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="card p-5 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        <h2 className="text-[15px] font-bold text-[var(--text-primary)] mb-4 tracking-tight">Ultimos Registros</h2>
        {gastos.length > 0 ? (
          <div className="overflow-x-auto -mx-5 md:mx-0">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <th className="text-left py-3 px-5 md:px-6 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Descricao</th>
                  <th className="text-left py-3 px-5 md:px-6 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Categoria</th>
                  <th className="text-left py-3 px-5 md:px-6 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Periodo</th>
                  <th className="text-right py-3 px-5 md:px-6 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Valor</th>
                </tr>
              </thead>
              <tbody>
                {gastos.slice(-10).reverse().map((g) => {
                  const cat = categorias.find((c) => c.id === g.categoria_id);
                  return (
                    <tr key={g.id} className="table-row" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td className="py-3.5 px-5 md:px-6 font-semibold text-[var(--text-primary)]">{g.descricao}</td>
                      <td className="py-3.5 px-5 md:px-6">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat?.cor }} />
                          <span className="text-[var(--text-secondary)]">{cat?.nome || "—"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-5 md:px-6">
                        <span className="badge" style={{
                          background: g.periodicidade === "semanal" ? "var(--accent-primary-light)" : g.periodicidade === "mensal" ? "rgba(124,92,252,0.1)" : "var(--warning-light)",
                          color: g.periodicidade === "semanal" ? "var(--accent-primary)" : g.periodicidade === "mensal" ? "#7c5cfc" : "var(--warning)",
                        }}>
                          {g.periodicidade}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 md:px-6 text-right font-bold" style={{ color: "var(--danger)" }}>{fmt(g.valor)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-tertiary)]">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--bg-inset)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-sm font-medium">Nenhum registro ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
