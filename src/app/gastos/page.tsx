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
  Clock,
  FileText,
  Filter,
  CheckCircle2,
  XCircle,
  CircleCheck,
} from "lucide-react";

type GastoFormData = {
  descricao: string;
  valor: string;
  data: string;
  categoria_id: string;
  periodicidade: "semanal" | "mensal" | "anual";
  pago: boolean;
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
  semanal: <Clock size={14} />,
  mensal: <Calendar size={14} />,
  anual: <Calendar size={14} />,
};

export default function GastosPage() {
  const { gastos, categorias, addGasto, updateGasto, deleteGasto } = useFinance();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>("todos");
  const [filtroPago, setFiltroPago] = useState<string>("todos");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState<GastoFormData>({
    descricao: "",
    valor: "",
    data: new Date().toISOString().split("T")[0],
    categoria_id: "",
    periodicidade: "mensal",
    pago: false,
  });

  const gastoCategorias = categorias.filter((c) => c.tipo === "gasto");

  const gastosFiltrados = gastos
    .filter((g) => filtro === "todos" || g.periodicidade === filtro)
    .filter((g) => filtroPago === "todos" || (filtroPago === "pago" ? g.pago : !g.pago))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const totalFiltrado = gastosFiltrados.reduce((acc, g) => acc + g.valor, 0);
  const totalPago = gastosFiltrados.filter((g) => g.pago).reduce((acc, g) => acc + g.valor, 0);
  const totalNaoPago = gastosFiltrados.filter((g) => !g.pago).reduce((acc, g) => acc + g.valor, 0);

  const getCategoria = (id: string) => categorias.find((c) => c.id === id);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      descricao: "",
      valor: "",
      data: new Date().toISOString().split("T")[0],
      categoria_id: gastoCategorias[0]?.id || "",
      periodicidade: "mensal",
      pago: false,
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
      pago: gasto.pago,
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
      pago: form.pago,
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

  const togglePago = (id: string) => {
    const gasto = gastos.find((g) => g.id === id);
    if (gasto) {
      updateGasto(id, { pago: !gasto.pago });
    }
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Receipt size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-[22px] sm:text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight">
              Gastos
            </h1>
            <p className="text-[var(--text-tertiary)] text-[11px] sm:text-sm font-medium">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "12px" }}>
        <div className="card animate-fade-in-up" style={{ padding: "16px", animationDelay: "40ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                Total Filtrado
              </p>
              <p className="text-lg sm:text-xl font-bold text-[var(--danger)] mt-1">
                {formatCurrency(totalFiltrado)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10">
              <DollarSign size={18} className="text-[var(--danger)]" />
            </div>
          </div>
        </div>
        <div className="card animate-fade-in-up" style={{ padding: "16px", border: "1.5px solid var(--success)", animationDelay: "80ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                Pago
              </p>
              <p className="text-lg sm:text-xl font-bold text-green-500 mt-1">
                {formatCurrency(totalPago)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/10">
              <CheckCircle2 size={18} className="text-green-500" />
            </div>
          </div>
        </div>
        <div className="card animate-fade-in-up" style={{ padding: "16px", border: "1.5px solid var(--danger)", animationDelay: "120ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                Nao Pago
              </p>
              <p className="text-lg sm:text-xl font-bold text-[var(--danger)] mt-1">
                {formatCurrency(totalNaoPago)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10">
              <XCircle size={18} className="text-[var(--danger)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter by periodicidade */}
      <div className="card animate-fade-in-up" style={{ padding: "16px", animationDelay: "100ms" }}>
        <div className="flex items-center gap-2.5 mb-3">
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
              className={`px-4 py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
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
        <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)] self-center mr-1">
            Status:
          </span>
          {[
            { key: "todos", label: "Todos" },
            { key: "pago", label: "Pago" },
            { key: "nao-pago", label: "Nao Pago" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltroPago(f.key)}
              className={`px-4 py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                filtroPago === f.key
                  ? "text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]"
              }`}
              style={
                filtroPago === f.key
                  ? {
                      background: f.key === "pago"
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : f.key === "nao-pago"
                        ? "linear-gradient(135deg, #ef4444, #dc2626)"
                        : "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                      boxShadow: f.key === "pago"
                        ? "0 2px 12px rgba(16, 185, 129, 0.35)"
                        : f.key === "nao-pago"
                        ? "0 2px 12px rgba(239, 68, 68, 0.35)"
                        : "0 2px 12px rgba(79, 110, 247, 0.35)",
                    }
                  : {}
              }
            >
              {f.key === "pago" && <CheckCircle2 size={14} />}
              {f.key === "nao-pago" && <XCircle size={14} />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
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
          style={{ padding: "16px", animationDelay: "140ms" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr>
                  {[
                    { label: "Status", align: "text-center" },
                    { label: "Data", align: "text-left" },
                    { label: "Descricao", align: "text-left" },
                    { label: "Categoria", align: "text-left" },
                    { label: "Periodicidade", align: "text-left" },
                    { label: "Valor", align: "text-right" },
                    { label: "Acoes", align: "text-right" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={`${h.align} px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]`}
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
                  const pago = gasto.pago ?? false;
                  return (
                    <tr
                      key={gasto.id}
                      className="table-row"
                      style={{
                        animationDelay: `${160 + index * 40}ms`,
                        opacity: pago ? 0.65 : 1,
                      }}
                    >
                      <td className="px-3 sm:px-4 py-3 sm:py-3.5 text-center">
                        <button
                          onClick={() => togglePago(gasto.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-200 ${
                            pago
                              ? "bg-green-500/15 text-green-500 hover:bg-green-500/25"
                              : "bg-red-500/15 text-[var(--danger)] hover:bg-red-500/25"
                          }`}
                          title={pago ? "Marcar como nao pago" : "Marcar como pago"}
                        >
                          {pago ? (
                            <CircleCheck size={14} className="text-green-500" />
                          ) : (
                            <XCircle size={14} className="text-[var(--danger)]" />
                          )}
                          <span className="hidden sm:inline">{pago ? "Pago" : "Nao Pago"}</span>
                        </button>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-3.5 text-[11px] sm:text-sm text-[var(--text-secondary)] whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[var(--text-tertiary)]" />
                          {formatDate(gasto.data)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-3.5 text-[11px] sm:text-sm text-[var(--text-primary)] font-semibold">
                        <span className="flex items-center gap-1.5">
                          <FileText size={12} className="text-[var(--text-tertiary)]" />
                          {gasto.descricao}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-3.5 text-[11px] sm:text-sm text-[var(--text-secondary)] whitespace-nowrap">
                        {cat && (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cat.cor }}
                            />
                            {cat.icone} {cat.nome}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap">
                        <span
                          className="badge inline-flex items-center gap-1 text-[9px] sm:text-[10px] px-2 py-1 rounded-full font-semibold"
                          style={{
                            backgroundColor: `${periodicidadeColors[gasto.periodicidade] || "#666"}18`,
                            color: periodicidadeColors[gasto.periodicidade] || "#666",
                          }}
                        >
                          {periodicidadeIcons[gasto.periodicidade]}
                          {periodicidadeLabels[gasto.periodicidade]}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-3.5 text-[11px] sm:text-sm text-[var(--danger)] font-bold text-right whitespace-nowrap">
                        {formatCurrency(gasto.valor)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(gasto)}
                            className="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-inset)]"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(gasto.id)}
                            className="text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-inset)]"
                            title="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid var(--border-subtle)" }}>
                  <td colSpan={5} className="px-3 sm:px-4 py-3 text-[11px] sm:text-sm font-bold text-[var(--text-primary)] text-right uppercase tracking-[0.12em]">
                    Total
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-[11px] sm:text-sm font-bold text-[var(--danger)] text-right">
                    {formatCurrency(totalFiltrado)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar Gasto" : "Novo Gasto"}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label className="block text-[13px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
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
            <label className="block text-[13px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
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
            <label className="block text-[13px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
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
            <label className="block text-[13px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
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
            <label className="block text-[13px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Periodicidade
            </label>
            <div className="flex gap-2">
              {(["semanal", "mensal", "anual"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, periodicidade: p })}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2 ${
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

          <div>
            <label className="block text-[13px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Status de Pagamento
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, pago: false })}
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2 ${
                  !form.pago
                    ? "bg-red-500/15 text-[var(--danger)] border-[var(--danger)]"
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                <XCircle size={16} />
                Nao Pago
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, pago: true })}
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2 ${
                  form.pago
                    ? "bg-green-500/15 text-green-500 border-green-500"
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                <CheckCircle2 size={16} />
                Pago
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setModalOpen(false)}
              className="btn-primary flex-1 px-4 py-2.5"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex-1 px-4 py-2.5 flex items-center justify-center gap-2"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirmar Exclusao"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center" }}>
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
              className="btn-primary flex-1 px-4 py-2.5"
            >
              Cancelar
            </button>
            <button
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
