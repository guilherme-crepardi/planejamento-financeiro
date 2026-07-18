"use client";

import { useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { Modal } from "@/components/Modal";

export default function GastosPage() {
  const { gastos, categorias, addGasto, updateGasto, deleteGasto } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [categoriaId, setCategoriaId] = useState("");
  const [periodicidade, setPeriodicidade] = useState<"semanal" | "mensal" | "anual">("mensal");
  const [filtroPeriodo, setFiltroPeriodo] = useState<"todos" | "semanal" | "mensal" | "anual">("todos");

  const categoriasGasto = categorias.filter((c) => c.tipo === "gasto");
  const gastosFiltrados = gastos.filter(
    (g) => filtroPeriodo === "todos" || g.periodicidade === filtroPeriodo
  );

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const abrirNovo = () => {
    setEditando(null);
    setDescricao("");
    setValor("");
    setData(new Date().toISOString().split("T")[0]);
    setCategoriaId(categoriasGasto[0]?.id || "");
    setPeriodicidade("mensal");
    setModalOpen(true);
  };

  const abrirEditar = (id: string) => {
    const g = gastos.find((x) => x.id === id);
    if (!g) return;
    setEditando(id);
    setDescricao(g.descricao);
    setValor(String(g.valor));
    setData(g.data);
    setCategoriaId(g.categoria_id);
    setPeriodicidade(g.periodicidade);
    setModalOpen(true);
  };

  const salvar = () => {
    if (!descricao.trim() || !valor || !categoriaId) return;
    const dados = {
      descricao,
      valor: parseFloat(valor),
      data,
      categoria_id: categoriaId,
      periodicidade,
    };
    if (editando) {
      updateGasto(editando, dados);
    } else {
      addGasto(dados);
    }
    setModalOpen(false);
  };

  const remover = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este gasto?")) {
      deleteGasto(id);
    }
  };

  const totalExibido = gastosFiltrados.reduce((acc, g) => acc + g.valor, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gastos</h1>
          <p className="text-[var(--muted)] mt-1">
            Total filtrado:{" "}
            <span className="text-[var(--danger)] font-bold">
              {formatar(totalExibido)}
            </span>
          </p>
        </div>
        <button
          onClick={abrirNovo}
          className="bg-[var(--danger)] hover:bg-[var(--danger-hover)] text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          + Novo Gasto
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["todos", "semanal", "mensal", "anual"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltroPeriodo(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroPeriodo === f
                ? "bg-[var(--danger)] text-white"
                : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-white"
            }`}
          >
            {f === "todos"
              ? "Todos"
              : f === "semanal"
              ? "Semanal"
              : f === "mensal"
              ? "Mensal"
              : "Anual"}
          </button>
        ))}
      </div>

      {gastosFiltrados.length > 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-4 px-6 text-[var(--muted)]">Descrição</th>
                <th className="text-left py-4 px-6 text-[var(--muted)]">Categoria</th>
                <th className="text-left py-4 px-6 text-[var(--muted)]">Periodicidade</th>
                <th className="text-left py-4 px-6 text-[var(--muted)]">Data</th>
                <th className="text-right py-4 px-6 text-[var(--muted)]">Valor</th>
                <th className="text-right py-4 px-6 text-[var(--muted)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {gastosFiltrados
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map((g) => {
                  const cat = categorias.find((c) => c.id === g.categoria_id);
                  return (
                    <tr
                      key={g.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">{g.descricao}</td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: cat?.cor }}
                          />
                          {cat?.nome || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-medium capitalize"
                          style={{
                            backgroundColor:
                              g.periodicidade === "semanal"
                                ? "#3b82f620"
                                : g.periodicidade === "mensal"
                                ? "#8b5cf620"
                                : "#f59e0b20",
                            color:
                              g.periodicidade === "semanal"
                                ? "#3b82f6"
                                : g.periodicidade === "mensal"
                                ? "#8b5cf6"
                                : "#f59e0b",
                          }}
                        >
                          {g.periodicidade}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--muted)]">
                        {new Date(g.data + "T00:00:00").toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4 px-6 text-right text-[var(--danger)] font-bold">
                        {formatar(g.valor)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => abrirEditar(g.id)}
                          className="p-2 rounded-lg hover:bg-[var(--background)] text-[var(--muted)] hover:text-white mr-1"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => remover(g.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--muted)] hover:text-[var(--danger)]"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-16 text-center">
          <p className="text-4xl mb-4">💸</p>
          <p className="text-[var(--muted)]">Nenhum gasto registrado</p>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? "Editar Gasto" : "Novo Gasto"}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Supermercado, Conta de luz..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--muted)] mb-1 block">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--muted)] mb-1 block">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Categoria</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="">Selecione...</option>
              {categoriasGasto.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icone} {c.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Periodicidade</label>
            <div className="flex gap-2">
              {(["semanal", "mensal", "anual"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodicidade(p)}
                  className={`flex-1 py-3 rounded-xl font-medium capitalize transition-colors ${
                    periodicidade === p
                      ? "bg-[var(--danger)] text-white"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={salvar}
            disabled={!descricao.trim() || !valor || !categoriaId}
            className="w-full bg-[var(--danger)] hover:bg-[var(--danger-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold mt-2 transition-colors"
          >
            {editando ? "Salvar Alterações" : "Adicionar Gasto"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
