"use client";

import { useFinance } from "@/lib/finance-context";
import { useTheme } from "@/lib/theme-context";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { theme } = useTheme();
  const {
    gastos,
    renda,
    categorias,
    totalGastos,
    totalRenda,
    saldo,
    gastosPorCategoria,
    gastosPorPeriodicidade,
  } = useFinance();

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const porCategoria = gastosPorCategoria();
  const porPeriodicidade = gastosPorPeriodicidade();
  const total = totalGastos();
  const rendaTotal = totalRenda();
  const saldoTotal = saldo();
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  const barData = [
    { name: "Semanal", valor: porPeriodicidade.semanal, fill: "#6366f1" },
    { name: "Mensal", valor: porPeriodicidade.mensal, fill: "#8b5cf6" },
    { name: "Anual", valor: porPeriodicidade.anual / 12, fill: "#f59e0b" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Visao geral das suas financas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 md:p-6 hover:border-[var(--accent)] transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[var(--success-light)] rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-xs text-[var(--success)] bg-[var(--success-light)] px-2 py-1 rounded-full font-medium">
              +{renda.length}
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-sm mb-1">Renda Total</p>
          <p className="text-xl md:text-2xl font-bold text-[var(--success)]">
            {formatar(rendaTotal)}
          </p>
        </div>

        <div className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 md:p-6 hover:border-[var(--danger)] transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[var(--danger-light)] rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <span className="text-xs text-[var(--danger)] bg-[var(--danger-light)] px-2 py-1 rounded-full font-medium">
              -{gastos.length}
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-sm mb-1">Gastos Totais</p>
          <p className="text-xl md:text-2xl font-bold text-[var(--danger)]">
            {formatar(total)}
          </p>
        </div>

        <div className={`group bg-[var(--bg-secondary)] border rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-1 ${
          saldoTotal >= 0
            ? "border-[var(--success)]/30 hover:border-[var(--success)]"
            : "border-[var(--danger)]/30 hover:border-[var(--danger)]"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              saldoTotal >= 0 ? "bg-[var(--success-light)]" : "bg-[var(--danger-light)]"
            }`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={saldoTotal >= 0 ? "var(--success)" : "var(--danger)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          </div>
          <p className="text-[var(--text-muted)] text-sm mb-1">Saldo</p>
          <p className={`text-xl md:text-2xl font-bold ${
            saldoTotal >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
          }`}>
            {formatar(saldoTotal)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {saldoTotal >= 0 ? "No lucro" : "No vermelho"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-[var(--text-primary)] mb-4">
            Gastos por Categoria
          </h2>
          {porCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={porCategoria}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="valor"
                  nameKey="nome"
                  label={({ nome, percent }) =>
                    `${nome} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {porCategoria.map((entry, i) => (
                    <Cell key={i} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => formatar(v)}
                  contentStyle={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-30">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              <p className="text-sm">Nenhum gasto registrado</p>
            </div>
          )}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-[var(--text-primary)] mb-4">
            Gastos por Periodicidade
          </h2>
          {gastos.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke={textColor} fontSize={12} />
                <YAxis stroke={textColor} fontSize={12} />
                <Tooltip
                  formatter={(v: number) => formatar(v)}
                  contentStyle={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                  }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]} barSize={40}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-30">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <p className="text-sm">Nenhum gasto registrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 md:p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-base md:text-lg font-bold text-[var(--text-primary)] mb-4">
          Ultimos Registros
        </h2>
        {gastos.length > 0 ? (
          <div className="overflow-x-auto -mx-5 md:mx-0">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left py-3 px-5 md:px-6 text-[var(--text-muted)] font-medium">Descricao</th>
                  <th className="text-left py-3 px-5 md:px-6 text-[var(--text-muted)] font-medium">Categoria</th>
                  <th className="text-left py-3 px-5 md:px-6 text-[var(--text-muted)] font-medium">Periodicidade</th>
                  <th className="text-right py-3 px-5 md:px-6 text-[var(--text-muted)] font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {gastos
                  .slice(-10)
                  .reverse()
                  .map((g) => {
                    const cat = categorias.find((c) => c.id === g.categoria_id);
                    return (
                      <tr
                        key={g.id}
                        className="border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <td className="py-3.5 px-5 md:px-6 font-medium text-[var(--text-primary)]">{g.descricao}</td>
                        <td className="py-3.5 px-5 md:px-6">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ background: cat?.cor }}
                            />
                            <span className="text-[var(--text-secondary)]">{cat?.nome || "—"}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-5 md:px-6">
                          <span
                            className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
                            style={{
                              backgroundColor: g.periodicidade === "semanal" ? "#6366f120" : g.periodicidade === "mensal" ? "#8b5cf620" : "#f59e0b20",
                              color: g.periodicidade === "semanal" ? "#6366f1" : g.periodicidade === "mensal" ? "#8b5cf6" : "#f59e0b",
                            }}
                          >
                            {g.periodicidade}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 md:px-6 text-right text-[var(--danger)] font-bold">
                          {formatar(g.valor)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-30">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-sm">Nenhum registro ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
