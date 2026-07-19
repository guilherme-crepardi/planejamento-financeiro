"use client"

import { useFinance } from "@/lib/finance-context"
import { useTheme } from "@/lib/theme-context"
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
  LineChart,
  Line,
} from "recharts"

const tooltipStyle = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-md)",
  color: "var(--text-primary)",
  boxShadow: "var(--shadow-lg)",
}

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default function ResumoPage() {
  const { gastos, renda, totalGastos, totalRenda, saldo, gastosPorCategoria, gastosPorPeriodicidade } = useFinance()
  const { theme } = useTheme()

  const textColor = theme === "dark" ? "#94a3b8" : "#64748b"

  const totalR = totalRenda()
  const totalG = totalGastos()
  const saldoFinal = saldo()
  const porCategoria = gastosPorCategoria()
  const porPeriodicidade = gastosPorPeriodicidade()

  const comparativoData = [
    { name: "Renda", value: totalR },
    { name: "Gastos", value: totalG },
  ]

  const categoriaData = porCategoria.map((c) => ({
    name: c.nome,
    value: c.valor,
    color: c.cor,
  }))

  const periodicidadeData = [
    { name: "Semanal", value: porPeriodicidade.semanal, fill: "#4f6ef7" },
    { name: "Mensal", value: porPeriodicidade.mensal, fill: "#7c5cfc" },
    { name: "Anual", value: porPeriodicidade.anual / 12, fill: "#f59e0b" },
  ]

  const monthMap = new Map<string, { renda: number; gastos: number }>()
  renda.forEach((r) => {
    const key = new Date(r.data).toLocaleDateString("pt-BR", { year: "2-digit", month: "short" })
    const cur = monthMap.get(key) || { renda: 0, gastos: 0 }
    cur.renda += r.valor
    monthMap.set(key, cur)
  })
  gastos.forEach((g) => {
    const key = new Date(g.data).toLocaleDateString("pt-BR", { year: "2-digit", month: "short" })
    const cur = monthMap.get(key) || { renda: 0, gastos: 0 }
    cur.gastos += g.valor
    monthMap.set(key, cur)
  })

  const evolucaoData = Array.from(monthMap.entries())
    .map(([mes, v]) => ({ mes, renda: v.renda, gastos: v.gastos, saldo: v.renda - v.gastos }))
    .sort((a, b) => {
      const parseMonth = (m: string) => {
        const parts = m.split("/")
        const monthNames: Record<string, number> = {
          jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
          jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
        }
        const month = parts[0]?.toLowerCase().replace(".", "")
        return (parseInt(parts[1]) || 0) * 12 + (monthNames[month] ?? 0)
      }
      return parseMonth(a.mes) - parseMonth(b.mes)
    })

  const maxCategoria = Math.max(...porCategoria.map((c) => c.valor), 1)

  const monthlyRenda = totalR / Math.max(monthMap.size, 1)
  const monthlyGastos = totalG / Math.max(monthMap.size, 1)
  const monthlySaldo = monthlyRenda - monthlyGastos

  if (gastos.length === 0 && renda.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <div className="text-6xl opacity-30">📊</div>
        <h1
          className="text-[26px] font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Nenhum dado encontrado
        </h1>
        <p
          className="text-center max-w-md"
          style={{ color: "var(--text-secondary)" }}
        >
          Adicione suas receitas e despesas para visualizar o resumo financeiro
          completo.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <h1
        className="text-[26px] font-bold text-[var(--text-primary)] tracking-tight animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        Resumo Financeiro
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="card border-2 p-5 animate-fade-in-up"
          style={{ borderColor: "var(--success)", animationDelay: "50ms" }}
        >
          <p className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight uppercase">
            Renda Total
          </p>
          <p className="text-3xl font-bold mt-2 text-green-500">
            {currency(totalR)}
          </p>
        </div>
        <div
          className="card border-2 p-5 animate-fade-in-up"
          style={{ borderColor: "var(--danger)", animationDelay: "100ms" }}
        >
          <p className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight uppercase">
            Gastos Totais
          </p>
          <p className="text-3xl font-bold mt-2 text-red-500">
            {currency(totalG)}
          </p>
        </div>
        <div
          className="card border-2 p-5 animate-fade-in-up"
          style={{
            borderColor: saldoFinal >= 0 ? "var(--success)" : "var(--danger)",
            animationDelay: "150ms",
          }}
        >
          <p className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight uppercase">
            Saldo Final
          </p>
          <p
            className="text-3xl font-bold mt-2"
            style={{ color: saldoFinal >= 0 ? "var(--success)" : "var(--danger)" }}
          >
            {currency(saldoFinal)}
          </p>
        </div>
      </div>

      {/* Comparativo Renda vs Gastos */}
      <section
        className="card p-6 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-6">
          Comparativo Renda vs Gastos
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={comparativoData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine
            >
              <Cell fill="#10b981" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip formatter={(v: number) => currency(v)} contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Gastos por Categoria */}
      <section
        className="card p-6 animate-fade-in-up"
        style={{ animationDelay: "250ms" }}
      >
        <h2 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-6">
          Gastos por Categoria
        </h2>
        {categoriaData.length === 0 ? (
          <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
            Nenhum gasto registrado.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriaData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine
              >
                {categoriaData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => currency(v)} contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gastos por Periodicidade */}
        <section
          className="card p-6 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-6">
            Gastos por Periodicidade
          </h2>
          {periodicidadeData.length === 0 ? (
            <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
              Sem dados de periodicidade.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={periodicidadeData}>
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis tick={{ fill: textColor, fontSize: 12 }} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => currency(v)} contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {periodicidadeData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* Resumo Mensal Estimado */}
        <section
          className="card p-6 animate-fade-in-up"
          style={{ animationDelay: "350ms" }}
        >
          <h2 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-6">
            Resumo Mensal Estimado
          </h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                Renda Mensal (média)
              </span>
              <span className="font-bold text-green-500">
                {currency(monthlyRenda)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                Gastos Mensais (média)
              </span>
              <span className="font-bold text-red-500">
                {currency(monthlyGastos)}
              </span>
            </div>
            <div className="h-px w-full" style={{ background: "var(--border-subtle)" }} />
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                Saldo Mensal (estimado)
              </span>
              <span
                className="font-bold"
                style={{ color: monthlySaldo >= 0 ? "var(--success)" : "var(--danger)" }}
              >
                {currency(monthlySaldo)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Evolução Mensal */}
      <section
        className="card p-6 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <h2 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-6">
          Evolução Mensal
        </h2>
        {evolucaoData.length === 0 ? (
          <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
            Adicione dados de renda e gastos para ver a evolução.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={evolucaoData}>
              <XAxis dataKey="mes" tick={{ fill: textColor, fontSize: 12 }} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => currency(v)} contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="renda" stroke="#10b981" strokeWidth={2} dot={false} name="Renda" />
              <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} dot={false} name="Gastos" />
              <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Saldo" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Detalhamento por Categoria */}
      <section
        className="card p-6 animate-fade-in-up"
        style={{ animationDelay: "450ms" }}
      >
        <h2 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-6">
          Detalhamento por Categoria
        </h2>
        {porCategoria.length === 0 ? (
          <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
            Nenhum gasto por categoria para exibir.
          </p>
        ) : (
          <div className="space-y-4">
            {porCategoria.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ background: cat.cor }}
                    />
                    {cat.nome}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {currency(cat.valor)}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--border-subtle)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(cat.valor / maxCategoria) * 100}%`,
                      background: cat.cor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
