"use client";

import { useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { Modal } from "@/components/Modal";

type GastoFormData = {
  descricao: string;
  valor: string;
  data: string;
  categoria_id: string;
  periodicidade: "semanal" | "mensal" | "anual";
};

const periodicidadeLabels: Record<string, string> = {
  semanal: "Semanal",
  mensal: "Mensal",
  anual: "Anual",
};

const periodicidadeColors: Record<string, string> = {
  semanal: "#6366f1",
  mensal: "#8b5cf6",
  anual: "#f59e0b",
};

export default function GastosPage() {
  const { gastos, categorias, addGasto, updateGasto, deleteGasto } = useFinance();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>("todos");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState<GastoFormData>({
    descricao: "",
    valor: "",
    data: new Date().toISOString().split("T")[0],
    categoria_id: "",
    periodicidade: "mensal",
  });

  const gastoCategorias = categorias.filter((c) => c.tipo === "gasto");

  const gastosFiltrados = gastos
    .filter((g) => filtro === "todos" || g.periodicidade === filtro)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const totalFiltrado = gastosFiltrados.reduce((acc, g) => acc + g.valor, 0);

  const getCategoria = (id: string) => categorias.find((c) => c.id === id);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      descricao: "",
      valor: "",
      data: new Date().toISOString().split("T")[0],
      categoria_id: gastoCategorias[0]?.id || "",
      periodicidade: "mensal",
    });
    setModalOpen(true);
  };

  const openEditModal = (gasto: (typeof gastos)[0]) => {
    setEditingId(gasto.id);
    setForm({
      descricao: gasto.descricao,
      valor: gasto.valor.toString(),
      data: gasto.data,
      categoria_id: gasto.categoria_id,
      periodicidade: gasto.periodicidade,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const valorNum = parseFloat(form.valor);
    if (!form.descricao.trim() || isNaN(valorNum) || valorNum <= 0 || !form.categoria_id) return;

    const payload = {
      descricao: form.descricao.trim(),
      valor: valorNum,
      data: form.data,
      categoria_id: form.categoria_id,
      periodicidade: form.periodicidade,
    };

    if (editingId) {
      updateGasto(editingId, payload);
    } else {
      addGasto(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteGasto(id);
    setConfirmDeleteId(null);
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");

  return (
    <div className="animate-fade-in min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Gastos
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            Gerencie seus gastos e despesas
          </p>
        </div>
        <button onClick={openAddModal} className="bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white px-5 py-2.5 rounded-xl font-medium transition-all text-sm self-start">
          + Novo Gasto
        </button>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-6 border border-[var(--border-color)]">
        <p className="text-sm text-[var(--text-muted)] mb-1">Total filtrado</p>
        <p className="text-3xl font-bold text-[var(--danger)]">
          {formatCurrency(totalFiltrado)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "todos", label: "Todos" },
          { key: "semanal", label: "Semanal" },
          { key: "mensal", label: "Mensal" },
          { key: "anual", label: "Anual" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filtro === f.key
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {gastosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
          <p className="text-lg font-medium">Nenhum gasto encontrado</p>
          <p className="text-sm mt-1">Adicione um novo gasto para começar</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Data
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Descrição
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Categoria
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Periodicidade
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Valor
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {gastosFiltrados.map((gasto) => {
                const cat = getCategoria(gasto.categoria_id);
                return (
                  <tr
                    key={gasto.id}
                    className="border-t border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] whitespace-nowrap">
                      {formatDate(gasto.data)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                      {gasto.descricao}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                      {cat && (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.cor }}
                          />
                          {cat.icone} {cat.nome}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor:
                            periodicidadeColors[gasto.periodicidade] || "#666",
                        }}
                      >
                        {periodicidadeLabels[gasto.periodicidade]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--danger)] font-semibold text-right whitespace-nowrap">
                      {formatCurrency(gasto.valor)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(gasto)}
                          className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors p-1"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(gasto.id)}
                          className="text-[var(--danger)] hover:text-[var(--danger)]/80 transition-colors p-1"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                <td colSpan={4} className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] text-right">
                  Total
                </td>
                <td className="px-6 py-4 text-sm font-bold text-[var(--danger)] text-right">
                  {formatCurrency(totalFiltrado)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar Gasto" : "Novo Gasto"}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Ex: Aluguel, Supermercado..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              placeholder="0,00"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Data
            </label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Categoria
            </label>
            <select
              value={form.categoria_id}
              onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="">Selecione uma categoria</option>
              {gastoCategorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icone} {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Periodicidade
            </label>
            <div className="flex gap-2">
              {(["semanal", "mensal", "anual"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, periodicidade: p })}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    form.periodicidade === p
                      ? "text-white border-transparent"
                      : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                  style={
                    form.periodicidade === p
                      ? { backgroundColor: periodicidadeColors[p] }
                      : {}
                  }
                >
                  {periodicidadeLabels[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-5 py-2.5 rounded-xl font-medium transition-all text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white px-5 py-2.5 rounded-xl font-medium transition-all text-sm"
            >
              {editingId ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--danger-light)] flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)]">
            Tem certeza que deseja excluir este gasto?
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="flex-1 px-5 py-2.5 rounded-xl font-medium transition-all text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)]"
            >
              Cancelar
            </button>
            <button
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="flex-1 bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white px-5 py-2.5 rounded-xl font-medium transition-all text-sm"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
