"use client";

import { useFinance } from "@/lib/finance-context";
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

  const barData = [
    { name: "Semanal", valor: porPeriodicidade.semanal, fill: "#3b82f6" },
    { name: "Mensal", valor: porPeriodicidade.mensal, fill: "#8b5cf6" },
    { name: "Anual", valor: porPeriodicidade.anual / 12, fill: "#f59e0b" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <p className="text-[var(--muted)] text-sm mb-1">Renda Total</p>
          <p className="text-2xl font-bold text-[var(--success)]">
            {formatar(rendaTotal)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-2">
            {renda.length} registro(s)
          </p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <p className="text-[var(--muted)] text-sm mb-1">Gastos Totais</p>
          <p className="text-2xl font-bold text-[var(--danger)]">
            {formatar(total)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-2">
            {gastos.length} registro(s)
          </p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <p className="text-[var(--muted)] text-sm mb-1">Saldo</p>
          <p
            className={`text-2xl font-bold ${
              saldoTotal >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {formatar(saldoTotal)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-2">
            {saldoTotal >= 0 ? "No lucro" : "No vermelho"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Gastos por Categoria</h2>
          {porCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={porCategoria}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
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
                    background: "#1a1a1a",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[var(--muted)] text-center py-12">
              Nenhum gasto registrado
            </p>
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Gastos por Periodicidade</h2>
          {gastos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip
                  formatter={(v: number) => formatar(v)}
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[var(--muted)] text-center py-12">
              Nenhum gasto registrado
            </p>
          )}
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Últimos Registros</h2>
        {gastos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-[var(--muted)]">
                    Descrição
                  </th>
                  <th className="text-left py-3 px-4 text-[var(--muted)]">
                    Categoria
                  </th>
                  <th className="text-left py-3 px-4 text-[var(--muted)]">
                    Periodicidade
                  </th>
                  <th className="text-right py-3 px-4 text-[var(--muted)]">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {gastos
                  .slice(-10)
                  .reverse()
                  .map((g) => {
                    const cat = categorias.find(
                      (c) => c.id === g.categoria_id
                    );
                    return (
                      <tr
                        key={g.id}
                        className="border-b border-[var(--border)] hover:bg-[var(--card-hover)]"
                      >
                        <td className="py-3 px-4">{g.descricao}</td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-block w-2 h-2 rounded-full mr-2"
                            style={{ background: cat?.cor }}
                          />
                          {cat?.nome || "—"}
                        </td>
                        <td className="py-3 px-4 capitalize">
                          {g.periodicidade}
                        </td>
                        <td className="py-3 px-4 text-right text-[var(--danger)]">
                          {formatar(g.valor)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[var(--muted)] text-center py-8">
            Nenhum registro ainda
          </p>
        )}
      </div>
    </div>
  );
}
