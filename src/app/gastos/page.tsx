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
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-in-up">
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ animationDelay: "0ms" }}
      >
        <div>
          <h1 className="text-[26px] font-bold text-[var(--text-primary)] tracking-tight">
            Gastos
          </h1>
          <p className="text-[var(--text-tertiary)] text-sm mt-0.5">
            Gerencie seus gastos e despesas
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="self-start px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, var(--danger), #dc2626)",
            boxShadow: "0 2px 12px rgba(239, 68, 68, 0.3)",
          }}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Gasto
          </span>
        </button>
      </div>

      <div
        className="card p-6 animate-fade-in-up"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Total Filtrado
            </p>
            <p className="text-3xl font-bold text-[var(--danger)] mt-1">
              {formatCurrency(totalFiltrado)}
            </p>
          </div>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(239, 68, 68, 0.1)" }}
          >
            <svg className="w-7 h-7 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap gap-2 animate-fade-in-up"
        style={{ animationDelay: "120ms" }}
      >
        {[
          { key: "todos", label: "Todos" },
          { key: "semanal", label: "Semanal" },
          { key: "mensal", label: "Mensal" },
          { key: "anual", label: "Anual" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filtro === f.key
                ? "text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
            }`}
            style={
              filtro === f.key
                ? {
                    background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                    boxShadow: "0 2px 12px rgba(79, 110, 247, 0.35)",
                  }
                : {}
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {gastosFiltrados.length === 0 ? (
        <div
          className="card flex flex-col items-center justify-center py-20 animate-fade-in-up"
          style={{ animationDelay: "180ms" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: "var(--bg-inset)" }}
          >
            <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-semibold">Nenhum gasto encontrado</p>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Adicione um novo gasto para começar</p>
        </div>
      ) : (
        <div
          className="card overflow-hidden animate-fade-in-up"
          style={{ animationDelay: "180ms" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Data
                  </th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Descrição
                  </th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Categoria
                  </th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Periodicidade
                  </th>
                  <th className="text-right px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Valor
                  </th>
                  <th className="text-right px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {gastosFiltrados.map((gasto, index) => {
                  const cat = getCategoria(gasto.categoria_id);
                  return (
                    <tr
                      key={gasto.id}
                      className="table-row"
                      style={{ animationDelay: `${200 + index * 40}ms` }}
                    >
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
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
                          className="badge"
                          style={{
                            backgroundColor: `${periodicidadeColors[gasto.periodicidade] || "#666"}20`,
                            color: periodicidadeColors[gasto.periodicidade] || "#666",
                          }}
                        >
                          {periodicidadeLabels[gasto.periodicidade]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--danger)] font-semibold text-right whitespace-nowrap">
                        {formatCurrency(gasto.valor)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(gasto)}
                            className="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-inset)]"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(gasto.id)}
                            className="text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-inset)]"
                            title="Excluir"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--border-color)]">
                  <td colSpan={4} className="px-6 py-4 text-sm font-bold text-[var(--text-primary)] text-right uppercase tracking-wider">
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
              className="input"
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
              className="input"
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
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Categoria
            </label>
            <select
              value={form.categoria_id}
              onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
              className="input"
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
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
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
              className="btn-primary flex-1 px-5 py-2.5"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, var(--danger), #dc2626)",
                boxShadow: "0 2px 12px rgba(239, 68, 68, 0.3)",
              }}
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
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(239, 68, 68, 0.1)" }}
          >
            <svg className="w-8 h-8 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-medium">
            Tem certeza que deseja excluir este gasto?
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="btn-primary flex-1 px-5 py-2.5"
            >
              Cancelar
            </button>
            <button
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, var(--danger), #dc2626)",
                boxShadow: "0 2px 12px rgba(239, 68, 68, 0.3)",
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
