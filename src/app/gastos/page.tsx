"use client";

import { useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { Modal } from "@/components/Modal";
import {
  Plus,
  Pencil,
  Trash2,
  Receipt,
  AlertTriangle,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  FileText,
  Filter,
} from "lucide-react";

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

const periodicidadeIcons: Record<string, React.ReactNode> = {
  semanal: <Clock size={14} className="sm:w-4 sm:h-4" />,
  mensal: <Calendar size={14} className="sm:w-4 sm:h-4" />,
  anual: <Calendar size={14} className="sm:w-4 sm:h-4" />,
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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Receipt size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight">
              Gastos
            </h1>
            <p className="text-[var(--text-tertiary)] text-xs sm:text-sm font-medium">
              Gerencie seus gastos e despesas
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary self-start sm:self-auto flex items-center gap-2 text-xs sm:text-sm px-4 py-2.5 rounded-xl font-semibold"
        >
          <Plus size={16} />
          Novo Gasto
        </button>
      </div>

      <div
        className="card animate-fade-in-up"
        style={{ padding: "25px", animationDelay: "60ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Total Filtrado
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--danger)] mt-1">
              {formatCurrency(totalFiltrado)}
            </p>
          </div>
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(239, 68, 68, 0.1)" }}
          >
            <DollarSign size={24} className="text-[var(--danger)] sm:w-7 sm:h-7" />
          </div>
        </div>
      </div>

      <div
        className="card animate-fade-in-up"
        style={{ padding: "25px", animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <Filter size={14} className="text-[var(--text-tertiary)]" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Filtrar por periodicidade
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "todos", label: "Todos" },
            { key: "semanal", label: "Semanal" },
            { key: "mensal", label: "Mensal" },
            { key: "anual", label: "Anual" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
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
              {f.key !== "todos" && periodicidadeIcons[f.key]}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {gastosFiltrados.length === 0 ? (
        <div
          className="card flex flex-col items-center justify-center animate-fade-in-up"
          style={{ padding: "60px 25px", animationDelay: "140ms" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--bg-inset)" }}
          >
            <Receipt size={28} className="text-[var(--text-tertiary)] opacity-40" />
          </div>
          <p className="text-[var(--text-primary)] font-bold text-sm sm:text-base">Nenhum gasto encontrado</p>
          <p className="text-xs sm:text-sm text-[var(--text-tertiary)] mt-1.5">Adicione um novo gasto para comecar</p>
        </div>
      ) : (
        <div
          className="card overflow-hidden animate-fade-in-up"
          style={{ padding: "25px", animationDelay: "140ms" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px]">
              <thead>
                <tr>
                  {[
                    { label: "Data", align: "text-left" },
                    { label: "Descricao", align: "text-left" },
                    { label: "Categoria", align: "text-left" },
                    { label: "Periodicidade", align: "text-left" },
                    { label: "Valor", align: "text-right" },
                    { label: "Acoes", align: "text-right" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={`${h.align} px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]`}
                      style={{ borderBottom: "2px solid var(--border-subtle)" }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gastosFiltrados.map((gasto, index) => {
                  const cat = getCategoria(gasto.categoria_id);
                  return (
                    <tr
                      key={gasto.id}
                      className="table-row"
                      style={{ animationDelay: `${160 + index * 40}ms` }}
                    >
                      <td className="px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 lg:py-5 text-xs sm:text-sm text-[var(--text-secondary)] whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <Calendar size={13} className="text-[var(--text-tertiary)]" />
                          {formatDate(gasto.data)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 lg:py-5 text-xs sm:text-sm text-[var(--text-primary)] font-semibold">
                        <span className="flex items-center gap-2">
                          <FileText size={13} className="text-[var(--text-tertiary)]" />
                          {gasto.descricao}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 lg:py-5 text-xs sm:text-sm text-[var(--text-secondary)] whitespace-nowrap">
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
                      <td className="px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 lg:py-5 whitespace-nowrap">
                        <span
                          className="badge inline-flex items-center gap-1.5 text-[10px] sm:text-xs px-3 py-1.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: `${periodicidadeColors[gasto.periodicidade] || "#666"}18`,
                            color: periodicidadeColors[gasto.periodicidade] || "#666",
                          }}
                        >
                          {periodicidadeIcons[gasto.periodicidade]}
                          {periodicidadeLabels[gasto.periodicidade]}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 lg:py-5 text-xs sm:text-sm text-[var(--danger)] font-bold text-right whitespace-nowrap">
                        {formatCurrency(gasto.valor)}
                      </td>
                      <td className="px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 lg:py-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(gasto)}
                            className="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-inset)]"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(gasto.id)}
                            className="text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-inset)]"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid var(--border-subtle)" }}>
                  <td colSpan={4} className="px-4 sm:px-5 lg:px-6 py-4 text-xs sm:text-sm font-bold text-[var(--text-primary)] text-right uppercase tracking-[0.12em]">
                    Total
                  </td>
                  <td className="px-4 sm:px-5 lg:px-6 py-4 text-xs sm:text-sm font-bold text-[var(--danger)] text-right">
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
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2.5">
              Descricao
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2.5">
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2.5">
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2.5">
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2.5">
              Periodicidade
            </label>
            <div className="flex gap-2.5">
              {(["semanal", "mensal", "anual"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, periodicidade: p })}
                  className={`flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2 ${
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
                  {periodicidadeIcons[p]}
                  {periodicidadeLabels[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="btn-primary flex-1 px-4 py-2.5 sm:px-5"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex-1 px-4 py-2.5 sm:px-5 flex items-center justify-center gap-2"
            >
              {editingId ? (
                <>
                  <Pencil size={16} />
                  Salvar
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Adicionar
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirmar Exclusao"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", alignItems: "center", textAlign: "center" }}>
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(239, 68, 68, 0.1)" }}
          >
            <AlertTriangle size={24} className="text-[var(--danger)]" />
          </div>
          <div>
            <p className="text-sm sm:text-base text-[var(--text-primary)] font-semibold">
              Tem certeza que deseja excluir este gasto?
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-tertiary)] mt-1.5">
              Esta acao nao pode ser desfeita.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="btn-primary flex-1 px-4 py-2.5 sm:px-5"
            >
              Cancelar
            </button>
            <button
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="flex-1 px-4 py-2.5 sm:px-5 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, var(--danger), #dc2626)",
                boxShadow: "0 2px 12px rgba(239, 68, 68, 0.3)",
              }}
            >
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
