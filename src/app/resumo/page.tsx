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
  LineChart,
  Line,
} from "recharts";

export default function ResumoPage() {
  const {
    gastos,
    renda,
    totalGastos,
    totalRenda,
    saldo,
    gastosPorCategoria,
    gastosPorPeriodicidade,
  } = useFinance();

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const totalGastosCalc = totalGastos();
  const totalRendaCalc = totalRenda();
  const saldoCalc = saldo();
  const porCategoria = gastosPorCategoria();
  const porPeriodicidade = gastosPorPeriodicidade();

  const resumoGeral = [
    { name: "Renda", valor: totalRendaCalc, fill: "#22c55e" },
    { name: "Gastos", valor: totalGastosCalc, fill: "#ef4444" },
  ];

  const evolucaoMensal = (() => {
    const meses = new Map<string, { gastos: number; renda: number }>();
    gastos.forEach((g) => {
      const mes = g.data.substring(0, 7);
      const atual = meses.get(mes) || { gastos: 0, renda: 0 };
      atual.gastos += g.valor;
      meses.set(mes, atual);
    });
    renda.forEach((r) => {
      const mes = r.data.substring(0, 7);
      const atual = meses.get(mes) || { gastos: 0, renda: 0 };
      atual.renda += r.valor;
      meses.set(mes, atual);
    });
    return Array.from(meses.entries())
      .map(([mes, v]) => ({
        mes,
        Gastos: v.gastos,
        Renda: v.renda,
        Saldo: v.renda - v.gastos,
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  })();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Resumo Geral</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--card)] border border-[var(--success)] rounded-2xl p-6">
          <p className="text-[var(--muted)] text-sm mb-1">💰 Renda Total</p>
          <p className="text-3xl font-bold text-[var(--success)]">
            {formatar(totalRendaCalc)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-2">
            Entradas registradas: {renda.length}
          </p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--danger)] rounded-2xl p-6">
          <p className="text-[var(--muted)] text-sm mb-1">💸 Gastos Totais</p>
          <p className="text-3xl font-bold text-[var(--danger)]">
            {formatar(totalGastosCalc)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-2">
            Saídas registradas: {gastos.length}
          </p>
        </div>
        <div
          className={`bg-[var(--card)] border rounded-2xl p-6 ${
            saldoCalc >= 0 ? "border-[var(--success)]" : "border-[var(--danger)]"
          }`}
        >
          <p className="text-[var(--muted)] text-sm mb-1">📊 Saldo Final</p>
          <p
            className={`text-3xl font-bold ${
              saldoCalc >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {formatar(saldoCalc)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-2">
            {saldoCalc >= 0
              ? "Parabéns! Está no lucro"
              : "Atenção! Gastos maiores que renda"}
          </p>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Comparativo Renda vs Gastos</h2>
        {totalRendaCalc > 0 || totalGastosCalc > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={resumoGeral}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="valor"
              >
                {resumoGeral.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
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
            Adicione renda e gastos para ver o comparativo
          </p>
        )}
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
                  innerRadius={50}
                  outerRadius={90}
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
              Sem dados de gastos
            </p>
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Gastos por Periodicidade</h2>
          {gastos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Semanal", valor: porPeriodicidade.semanal },
                  { name: "Mensal", valor: porPeriodicidade.mensal },
                  { name: "Anual (/12)", valor: porPeriodicidade.anual / 12 },
                ]}
              >
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
                <Bar dataKey="valor" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[var(--muted)] text-center py-12">
              Sem dados de gastos
            </p>
          )}
        </div>
      </div>

      {evolucaoMensal.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Evolução Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoMensal}>
              <XAxis dataKey="mes" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip
                formatter={(v: number) => formatar(v)}
                contentStyle={{
                  background: "#1a1a1a",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Renda"
                stroke="#22c55e"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Gastos"
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Saldo"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Detalhamento por Categoria</h2>
          {porCategoria.length > 0 ? (
            <div className="space-y-3">
              {porCategoria.map((cat) => (
                <div key={cat.nome}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat.nome}</span>
                    <span className="font-bold">{formatar(cat.valor)}</span>
                  </div>
                  <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(cat.valor / porCategoria[0].valor) * 100}%`,
                        backgroundColor: cat.cor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)] text-center py-8">Sem dados</p>
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Resumo Mensal Estimado</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
              <span className="text-[var(--muted)]">Renda Mensal</span>
              <span className="text-[var(--success)] font-bold text-lg">
                {formatar(totalRendaCalc)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
              <span className="text-[var(--muted)]">Gastos Mensais (estimados)</span>
              <span className="text-[var(--danger)] font-bold text-lg">
                {formatar(totalGastosCalc)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-bold">Saldo Mensal</span>
              <span
                className={`font-bold text-2xl ${
                  saldoCalc >= 0
                    ? "text-[var(--success)]"
                    : "text-[var(--danger)]"
                }`}
              >
                {formatar(saldoCalc)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
