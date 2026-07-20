"use client"

import { useState } from "react"
import { useFinance } from "@/lib/finance-context"
import { Modal } from "@/components/Modal"
import {
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  AlertTriangle,
  X,
  TrendingUp,
  PiggyBank,
  Briefcase,
  Wallet,
  Calendar,
} from "lucide-react"

type RendaTipo = "salario1" | "salario2" | "extra"

interface RendaForm {
  tipo: RendaTipo
  descricao: string
  valor: number
  data: string
}

const tipoLabel = (tipo: RendaTipo) => {
  const map: Record<RendaTipo, string> = {
    salario1: "Salario 1",
    salario2: "Salario 2",
    extra: "Trabalho Extra",
  }
  return map[tipo]
}

const tipoCor = (tipo: RendaTipo) => {
  const map: Record<RendaTipo, { bg: string; color: string }> = {
    salario1: { bg: "var(--success-light)", color: "var(--success)" },
    salario2: { bg: "var(--success-medium)", color: "var(--success)" },
    extra: { bg: "var(--accent-primary-light)", color: "var(--accent-primary)" },
  }
  return map[tipo]
}

const tipoIcon = (tipo: RendaTipo) => {
  switch (tipo) {
    case "salario1": return <Briefcase size={14} />
    case "salario2": return <Wallet size={14} />
    case "extra": return <TrendingUp size={14} />
  }
}

const formatCurrency = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const formatDate = (data: string) =>
  new Date(data + "T00:00:00").toLocaleDateString("pt-BR")

export default function RendaPage() {
  const { renda, addRenda, updateRenda, deleteRenda } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<RendaForm>({
    tipo: "salario1",
    descricao: "",
    valor: 0,
    data: new Date().toISOString().split("T")[0],
  })
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const sorted = [...renda].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  )

  const salario1Total = renda.filter((r) => r.tipo === "salario1").reduce((s, r) => s + r.valor, 0)
  const salario2Total = renda.filter((r) => r.tipo === "salario2").reduce((s, r) => s + r.valor, 0)
  const extrasTotal = renda.filter((r) => r.tipo === "extra").reduce((s, r) => s + r.valor, 0)
  const totalGeral = salario1Total + salario2Total + extrasTotal

  const openAdd = () => {
    setEditingId(null)
    setForm({ tipo: "salario1", descricao: "", valor: 0, data: new Date().toISOString().split("T")[0] })
    setModalOpen(true)
  }

  const openEdit = (id: string) => {
    const item = renda.find((r) => r.id === id)
    if (!item) return
    setEditingId(id)
    setForm({ tipo: item.tipo, descricao: item.descricao, valor: item.valor, data: item.data })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.descricao.trim()) return
    if (editingId) {
      updateRenda(editingId, { tipo: form.tipo, descricao: form.descricao.trim(), valor: form.valor, data: form.data })
    } else {
      addRenda({ tipo: form.tipo, descricao: form.descricao.trim(), valor: form.valor, data: form.data })
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteRenda(id)
    setConfirmDeleteId(null)
  }

  return (
    <div className="max-w-[1280px] mx-auto w-full px-3 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight">Renda</h1>
          <p className="text-[var(--text-tertiary)] text-[10px] sm:text-[12px]">Gerencie suas fontes de renda</p>
        </div>
        <button onClick={openAdd} className="btn-primary self-start sm:self-auto flex items-center gap-2 text-[11px] sm:text-[13px] px-3 py-2 sm:px-4 sm:py-2.5">
          <Plus size={14} /> Adicionar
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "8px" }}>
        <div className="card text-center" style={{ padding: "12px" }}>
          <Briefcase size={14} className="text-[var(--text-tertiary)] mx-auto mb-1" />
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Salario 1</p>
          <p className="text-[13px] sm:text-[16px] font-bold text-[var(--success)] mt-0.5">{formatCurrency(salario1Total)}</p>
        </div>
        <div className="card text-center" style={{ padding: "12px" }}>
          <Wallet size={14} className="text-[var(--text-tertiary)] mx-auto mb-1" />
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Salario 2</p>
          <p className="text-[13px] sm:text-[16px] font-bold text-[var(--success)] mt-0.5">{formatCurrency(salario2Total)}</p>
        </div>
        <div className="card text-center" style={{ padding: "12px" }}>
          <TrendingUp size={14} className="text-[var(--text-tertiary)] mx-auto mb-1" />
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Extras</p>
          <p className="text-[13px] sm:text-[16px] font-bold text-[var(--success)] mt-0.5">{formatCurrency(extrasTotal)}</p>
        </div>
        <div className="card text-center" style={{ padding: "12px", border: "2px solid var(--success)" }}>
          <PiggyBank size={14} className="text-[var(--success)] mx-auto mb-1" />
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Total</p>
          <p className="text-[13px] sm:text-[16px] font-bold text-[var(--success)] mt-0.5">{formatCurrency(totalGeral)}</p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card flex flex-col items-center justify-center text-center" style={{ padding: "32px 16px" }}>
          <DollarSign size={24} className="text-[var(--text-tertiary)] mb-2 opacity-30" />
          <p className="text-[var(--text-primary)] font-bold text-[13px]">Nenhuma renda registrada</p>
          <p className="text-[11px] text-[var(--text-tertiary)]">Adicione sua primeira fonte de renda</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {sorted.map((item) => {
            const cor = tipoCor(item.tipo)
            return (
              <div key={item.id} className="card" style={{ padding: "12px" }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full shrink-0"
                      style={{ backgroundColor: cor.bg, color: cor.color }}
                    >
                      {tipoIcon(item.tipo)} {tipoLabel(item.tipo)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-[13px] text-[var(--text-primary)] truncate">{item.descricao}</p>
                      <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                        <Calendar size={10} /> {formatDate(item.data)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="text-[14px] font-bold text-[var(--success)]">{formatCurrency(item.valor)}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(item.id)} className="p-1.5 rounded-lg hover:bg-[var(--bg-inset)] text-[var(--text-tertiary)] hover:text-[var(--accent)]">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setConfirmDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-tertiary)] hover:text-[var(--danger)]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Renda" : "Adicionar Renda"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Tipo</label>
            <div className="grid grid-cols-3" style={{ gap: "8px" }}>
              {(["salario1", "salario2", "extra"] as RendaTipo[]).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setForm({ ...form, tipo })}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-[11px] font-semibold transition-all border ${
                    form.tipo === tipo
                      ? "border-[var(--success)] text-[var(--success)] bg-[var(--success-light)]"
                      : "border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  {tipoIcon(tipo)} {tipoLabel(tipo)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Descricao</label>
            <input type="text" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: Salario empresa X" className="input text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Valor (R$)</label>
            <input type="number" value={form.valor || ""} onChange={(e) => setForm({ ...form, valor: parseFloat(e.target.value) || 0 })} placeholder="0,00" min={0} step={0.01} className="input text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[var(--text-primary)] mb-1.5">Data</label>
            <input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} className="input text-[13px]" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium border border-[var(--border-color)] text-[var(--text-secondary)]">Cancelar</button>
            <button onClick={handleSave} className="btn-primary flex-1 py-2.5 text-[12px] flex items-center justify-center gap-1.5">
              {editingId ? <><Pencil size={14} /> Salvar</> : <><Plus size={14} /> Adicionar</>}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Confirmar Exclusao">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", textAlign: "center" }}>
          <AlertTriangle size={24} className="text-[var(--danger)]" />
          <p className="text-[13px] text-[var(--text-primary)] font-semibold">Excluir esta renda?</p>
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
  )
}
