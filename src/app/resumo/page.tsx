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
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-color)",
  borderRadius: "12px",
  color: "var(--text-primary)",
}

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
    { name: "Semanal", value: porPeriodicidade.semanal, fill: "#6366f1" },
    { name: "Mensal", value: porPeriodicidade.mensal, fill: "#8b5cf6" },
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
          className="text-2xl font-bold"
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <h1
        className="text-3xl font-bold animate-fade-in"
        style={{ color: "var(--text-primary)", animationDelay: "0ms" }}
      >
        Resumo Financeiro
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="bg-[var(--bg-secondary)] border-2 border-green-500/60 rounded-2xl p-6 animate-fade-in"
          style={{ animationDelay: "50ms" }}
        >
          <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
            Renda Total
          </p>
          <p className="text-3xl font-bold mt-2 text-green-500">
            {totalR.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
        <div
          className="bg-[var(--bg-secondary)] border-2 border-red-500/60 rounded-2xl p-6 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
            Gastos Totais
          </p>
          <p className="text-3xl font-bold mt-2 text-red-500">
            {totalG.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
        <div
          className="bg-[var(--bg-secondary)] border-2 rounded-2xl p-6 animate-fade-in"
          style={{
            animationDelay: "150ms",
            borderColor: saldoFinal >= 0 ? "#22c55e" : "#ef4444",
          }}
        >
          <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
            Saldo Final
          </p>
          <p
            className="text-3xl font-bold mt-2"
            style={{ color: saldoFinal >= 0 ? "#22c55e" : "#ef4444" }}
          >
            {saldoFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </div>

      {/* Comparativo Renda vs Gastos */}
      <section
        className="bg-[var(--bg-secondary)] border rounded-2xl p-6 animate-fade-in"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
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
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip formatter={(v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Gastos por Categoria */}
      <section
        className="bg-[var(--bg-secondary)] border rounded-2xl p-6 animate-fade-in"
        style={{ animationDelay: "250ms" }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
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
              <Tooltip formatter={(v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gastos por Periodicidade */}
        <section
          className="bg-[var(--bg-secondary)] border rounded-2xl p-6 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
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
                <Tooltip formatter={(v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} contentStyle={tooltipStyle} />
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
          className="bg-[var(--bg-secondary)] border rounded-2xl p-6 animate-fade-in"
          style={{ animationDelay: "350ms" }}
        >
          <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
            Resumo Mensal Estimado
          </h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                Renda Mensal (média)
              </span>
              <span className="font-bold text-green-500">
                {monthlyRenda.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                Gastos Mensais (média)
              </span>
              <span className="font-bold text-red-500">
                {monthlyGastos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div
              className="h-px w-full"
              style={{ background: "var(--border-color)" }}
            />
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                Saldo Mensal (estimado)
              </span>
              <span
                className="font-bold"
                style={{ color: monthlySaldo >= 0 ? "#22c55e" : "#ef4444" }}
              >
                {monthlySaldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Evolução Mensal */}
      <section
        className="bg-[var(--bg-secondary)] border rounded-2xl p-6 animate-fade-in"
        style={{ animationDelay: "400ms" }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
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
              <Tooltip formatter={(v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="renda" stroke="#22c55e" strokeWidth={2} dot={false} name="Renda" />
              <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} dot={false} name="Gastos" />
              <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Saldo" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Detalhamento por Categoria */}
      <section
        className="bg-[var(--bg-secondary)] border rounded-2xl p-6 animate-fade-in"
        style={{ animationDelay: "450ms" }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
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
                    {cat.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--border-color)" }}
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
