"use client"

import { useFinance } from "@/lib/finance-context"
import { useTheme } from "@/lib/theme-context"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  ListOrdered,
  Calculator,
  Wallet,
  FileBarChart,
} from "lucide-react"
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart as RechartsLine,
  Line,
} from "recharts"

const tooltipStyle = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "14px",
  color: "var(--text-primary)",
  boxShadow: "var(--shadow-xl)",
  padding: "10px 14px",
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] gap-4 p-4 sm:p-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          <Activity size={24} className="sm:w-7 sm:h-7" style={{ color: "var(--text-secondary)" }} />
        </div>
        <h1
          className="text-[22px] sm:text-[26px] font-bold tracking-tight text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Nenhum dado encontrado
        </h1>
        <p
          className="text-center max-w-md text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Adicione suas receitas e despesas para visualizar o resumo financeiro completo.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 lg:space-y-16">
      <h1
        className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        Resumo Financeiro
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
        <div
          className="card border-2 px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up"
          style={{ borderColor: "var(--success)", animationDelay: "50ms" }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-green-500/10">
              <TrendingUp size={16} className="text-green-500 sm:w-[18px] sm:h-[18px]" />
            </div>
            <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-bold text-[var(--text-primary)] tracking-tight uppercase">
              Renda Total
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold mt-2 text-green-500">
            {currency(totalR)}
          </p>
        </div>
        <div
          className="card border-2 px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up"
          style={{ borderColor: "var(--danger)", animationDelay: "100ms" }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-red-500/10">
              <TrendingDown size={16} className="text-red-500 sm:w-[18px] sm:h-[18px]" />
            </div>
            <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-bold text-[var(--text-primary)] tracking-tight uppercase">
              Gastos Totais
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold mt-2 text-red-500">
            {currency(totalG)}
          </p>
        </div>
        <div
          className="card border-2 px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up sm:col-span-2 lg:col-span-1"
          style={{
            borderColor: saldoFinal >= 0 ? "var(--success)" : "var(--danger)",
            animationDelay: "150ms",
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center"
              style={{ background: saldoFinal >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}
            >
              <Wallet
                size={16}
                className="sm:w-[18px] sm:h-[18px]"
                style={{ color: saldoFinal >= 0 ? "var(--success)" : "var(--danger)" }}
              />
            </div>
            <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-bold text-[var(--text-primary)] tracking-tight uppercase">
              Saldo Final
            </p>
          </div>
          <p
            className="text-2xl sm:text-3xl font-bold mt-2"
            style={{ color: saldoFinal >= 0 ? "var(--success)" : "var(--danger)" }}
          >
            {currency(saldoFinal)}
          </p>
        </div>
      </div>

      {/* Comparativo Renda vs Gastos */}
      <section
        className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-blue-500/10">
            <PieChart size={16} className="text-blue-500 sm:w-[18px] sm:h-[18px]" />
          </div>
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
            Comparativo Renda vs Gastos
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <RechartsPie>
            <Pie
              data={comparativoData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine
            >
              <Cell fill="#10b981" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip formatter={(v: number) => currency(v)} contentStyle={tooltipStyle} />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      </section>

      {/* Gastos por Categoria */}
      <section
        className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up"
        style={{ animationDelay: "250ms" }}
      >
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-violet-500/10">
            <BarChart3 size={16} className="text-violet-500 sm:w-[18px] sm:h-[18px]" />
          </div>
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
            Gastos por Categoria
          </h2>
        </div>
        {categoriaData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <PieChart size={24} className="sm:w-7 sm:h-7" style={{ color: "var(--text-secondary)" }} />
            </div>
            <p className="text-center text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
              Nenhum gasto registrado.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <RechartsPie>
              <Pie
                data={categoriaData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={75}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine
              >
                {categoriaData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => currency(v)} contentStyle={tooltipStyle} />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Gastos por Periodicidade */}
        <section
          className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-amber-500/10">
              <BarChart3 size={16} className="text-amber-500 sm:w-[18px] sm:h-[18px]" />
            </div>
            <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
              Gastos por Periodicidade
            </h2>
          </div>
          {periodicidadeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                <FileBarChart size={24} className="sm:w-7 sm:h-7" style={{ color: "var(--text-secondary)" }} />
              </div>
              <p className="text-center text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                Sem dados de periodicidade.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={periodicidadeData}>
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
                <YAxis tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
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
          className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up"
          style={{ animationDelay: "350ms" }}
        >
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-cyan-500/10">
              <Calculator size={16} className="text-cyan-500 sm:w-[18px] sm:h-[18px]" />
            </div>
            <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
              Resumo Mensal Estimado
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                Renda Mensal (media)
              </span>
              <span className="font-bold text-sm sm:text-base text-green-500">
                {currency(monthlyRenda)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                Gastos Mensais (media)
              </span>
              <span className="font-bold text-sm sm:text-base text-red-500">
                {currency(monthlyGastos)}
              </span>
            </div>
            <div className="h-px w-full" style={{ background: "var(--border-subtle)" }} />
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                Saldo Mensal (estimado)
              </span>
              <span
                className="font-bold text-sm sm:text-base"
                style={{ color: monthlySaldo >= 0 ? "var(--success)" : "var(--danger)" }}
              >
                {currency(monthlySaldo)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Evolucao Mensal */}
      <section
        className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-indigo-500/10">
            <LineChart size={16} className="text-indigo-500 sm:w-[18px] sm:h-[18px]" />
          </div>
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
            Evolucao Mensal
          </h2>
        </div>
        {evolucaoData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <LineChart size={24} className="sm:w-7 sm:h-7" style={{ color: "var(--text-secondary)" }} />
            </div>
            <p className="text-center text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
              Adicione dados de renda e gastos para ver a evolucao.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <RechartsLine data={evolucaoData}>
              <XAxis dataKey="mes" tick={{ fill: textColor, fontSize: 11 }} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => currency(v)} contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="renda" stroke="#10b981" strokeWidth={2} dot={false} name="Renda" />
              <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} dot={false} name="Gastos" />
              <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Saldo" />
            </RechartsLine>
          </ResponsiveContainer>
        )}
      </section>

      {/* Detalhamento por Categoria */}
      <section
        className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 animate-fade-in-up"
        style={{ animationDelay: "450ms" }}
      >
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-pink-500/10">
            <ListOrdered size={16} className="text-pink-500 sm:w-[18px] sm:h-[18px]" />
          </div>
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
            Detalhamento por Categoria
          </h2>
        </div>
        {porCategoria.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <ListOrdered size={24} className="sm:w-7 sm:h-7" style={{ color: "var(--text-secondary)" }} />
            </div>
            <p className="text-center text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
              Nenhum gasto por categoria para exibir.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {porCategoria.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span
                      className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                      style={{ background: cat.cor }}
                    />
                    {cat.nome}
                  </span>
                  <span className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                    {currency(cat.valor)}
                  </span>
                </div>
                <div
                  className="h-1.5 sm:h-2 rounded-full overflow-hidden"
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
