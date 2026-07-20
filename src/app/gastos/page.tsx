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
  semanal: <Clock size={12} />,
  mensal: <Calendar size={12} />,
  anual: <Calendar size={12} />,
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
    <div className="max-w-[1280px] mx-auto w-full px-3 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <Receipt size={18} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight">Gastos</h1>
            <p className="text-[var(--text-tertiary)] text-[10px] sm:text-[12px]">Gerencie seus gastos</p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn-primary self-start sm:self-auto flex items-center gap-2 text-[11px] sm:text-[13px] px-3 py-2 sm:px-4 sm:py-2.5">
          <Plus size={14} /> Novo Gasto
        </button>
      </div>

      <div className="grid grid-cols-3" style={{ gap: "8px" }}>
        <div className="card text-center" style={{ padding: "12px" }}>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Total</p>
          <p className="text-[13px] sm:text-[16px] font-bold text-[var(--danger)] mt-0.5">{formatCurrency(totalFiltrado)}</p>
        </div>
        <div className="card text-center" style={{ padding: "12px", border: "1.5px solid var(--success)" }}>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Pago</p>
          <p className="text-[13px] sm:text-[16px] font-bold text-green-500 mt-0.5">{formatCurrency(totalPago)}</p>
        </div>
        <div className="card text-center" style={{ padding: "12px", border: "1.5px solid var(--danger)" }}>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Nao Pago</p>
          <p className="text-[13px] sm:text-[16px] font-bold text-[var(--danger)] mt-0.5">{formatCurrency(totalNaoPago)}</p>
        </div>
      </div>

      <div className="card" style={{ padding: "12px" }}>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "todos", label: "Todos" },
            { key: "semanal", label: "Semanal" },
            { key: "mensal", label: "Mensal" },
            { key: "anual", label: "Anual" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all ${
                filtro === f.key
                  ? "text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
              }`}
              style={
                filtro === f.key
                  ? { background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))", boxShadow: "0 2px 8px rgba(79,110,247,0.3)" }
                  : {}
              }
            >
              {f.label}
            </button>
          ))}
          <span className="w-px h-5 bg-[var(--border-subtle)] self-center mx-0.5" />
          {[
            { key: "todos", label: "Todos" },
            { key: "pago", label: "Pago", icon: <CheckCircle2 size={11} /> },
            { key: "nao-pago", label: "Nao Pago", icon: <XCircle size={11} /> },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltroPago(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all flex items-center gap-1 ${
                filtroPago === f.key
                  ? "text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
              }`}
              style={
                filtroPago === f.key
                  ? {
                      background: f.key === "pago" ? "linear-gradient(135deg, #10b981, #059669)" : f.key === "nao-pago" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                      boxShadow: f.key === "pago" ? "0 2px 8px rgba(16,185,129,0.3)" : f.key === "nao-pago" ? "0 2px 8px rgba(239,68,68,0.3)" : "0 2px 8px rgba(79,110,247,0.3)",
                    }
                  : {}
              }
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {gastosFiltrados.length === 0 ? (
        <div className="card flex flex-col items-center justify-center" style={{ padding: "40px 16px" }}>
          <Receipt size={24} className="text-[var(--text-tertiary)] opacity-30 mb-2" />
          <p className="text-[var(--text-primary)] font-bold text-[13px]">Nenhum gasto encontrado</p>
          <p className="text-[11px] text-[var(--text-tertiary)]">Adicione um novo gasto para comecar</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {gastosFiltrados.map((gasto) => {
            const cat = getCategoria(gasto.categoria_id);
            const pago = gasto.pago ?? false;
            return (
              <div
                key={gasto.id}
                className="card"
                style={{
                  padding: "12px",
                  opacity: pago ? 0.6 : 1,
                  borderColor: pago ? "var(--success)" : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => togglePago(gasto.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold shrink-0 ${
                          pago ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-[var(--danger)]"
                        }`}
                      >
                        {pago ? <CircleCheck size={11} /> : <XCircle size={11} />}
                        {pago ? "Pago" : "Nao Pago"}
                      </button>
                      <span
                        className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${periodicidadeColors[gasto.periodicidade]}18`,
                          color: periodicidadeColors[gasto.periodicidade],
                        }}
                      >
                        {periodicidadeIcons[gasto.periodicidade]}
                        {periodicidadeLabels[gasto.periodicidade]}
                      </span>
                    </div>
                    <p className="font-bold text-[13px] text-[var(--text-primary)] mt-1.5 truncate">{gasto.descricao}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {cat && (
                        <span className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.cor }} />
                          {cat.icone} {cat.nome}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                        <Calendar size={10} /> {formatDate(gasto.data)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <p className="text-[14px] font-bold text-[var(--danger)]">{formatCurrency(gasto.valor)}</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(gasto)}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-inset)] text-[var(--text-tertiary)] hover:text-[var(--accent)]"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(gasto.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-tertiary)] hover:text-[var(--danger)]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="card flex items-center justify-between" style={{ padding: "12px", border: "2px solid var(--border-subtle)" }}>
            <span className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-wider">Total</span>
            <span className="text-[14px] font-bold text-[var(--danger)]">{formatCurrency(totalFiltrado)}</span>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Gasto" : "Novo Gasto"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Descricao</label>
            <input type="text" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: Aluguel..." className="input text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Valor (R$)</label>
            <input type="number" step="0.01" min="0" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="0,00" className="input text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Data</label>
            <input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} className="input text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Categoria</label>
            <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} className="input text-[13px]">
              <option value="">Selecione</option>
              {gastoCategorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icone} {cat.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Periodicidade</label>
            <div className="flex gap-1.5">
              {(["semanal", "mensal", "anual"] as const).map((p) => (
                <button key={p} type="button" onClick={() => setForm({ ...form, periodicidade: p })}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-all border flex items-center justify-center gap-1 ${
                    form.periodicidade === p ? "text-white border-transparent" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)]"
                  }`}
                  style={form.periodicidade === p ? { backgroundColor: periodicidadeColors[p] } : {}}
                >
                  {periodicidadeIcons[p]} {periodicidadeLabels[p]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Status</label>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => setForm({ ...form, pago: false })}
                className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-all border flex items-center justify-center gap-1 ${
                  !form.pago ? "bg-red-500/15 text-[var(--danger)] border-[var(--danger)]" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)]"
                }`}>
                <XCircle size={14} /> Nao Pago
              </button>
              <button type="button" onClick={() => setForm({ ...form, pago: true })}
                className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-all border flex items-center justify-center gap-1 ${
                  form.pago ? "bg-green-500/15 text-green-500 border-green-500" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)]"
                }`}>
                <CheckCircle2 size={14} /> Pago
              </button>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium border border-[var(--border-color)] text-[var(--text-secondary)]">Cancelar</button>
            <button onClick={handleSubmit} className="btn-primary flex-1 py-2.5 text-[12px] flex items-center justify-center gap-1.5">
              {editingId ? <><Pencil size={14} /> Salvar</> : <><Plus size={14} /> Adicionar</>}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Confirmar Exclusao">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", textAlign: "center" }}>
          <AlertTriangle size={24} className="text-[var(--danger)]" />
          <p className="text-[13px] text-[var(--text-primary)] font-semibold">Excluir este gasto?</p>
          <p className="text-[11px] text-[var(--text-tertiary)]">Acao irreversivel.</p>
          <div className="flex gap-2 w-full">
            <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium border border-[var(--border-color)] text-[var(--text-secondary)]">Cancelar</button>
            <button onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white flex items-center justify-center gap-1.5"
              style={{ background: "linear-gradient(135deg, var(--danger), #dc2626)" }}>
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
