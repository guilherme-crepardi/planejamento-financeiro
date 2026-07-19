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
    case "salario1":
      return <Briefcase size={16} />
    case "salario2":
      return <Wallet size={16} />
    case "extra":
      return <TrendingUp size={16} />
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

  const salario1Total = renda
    .filter((r) => r.tipo === "salario1")
    .reduce((s, r) => s + r.valor, 0)
  const salario2Total = renda
    .filter((r) => r.tipo === "salario2")
    .reduce((s, r) => s + r.valor, 0)
  const extrasTotal = renda
    .filter((r) => r.tipo === "extra")
    .reduce((s, r) => s + r.valor, 0)
  const totalGeral = salario1Total + salario2Total + extrasTotal

  const openAdd = () => {
    setEditingId(null)
    setForm({
      tipo: "salario1",
      descricao: "",
      valor: 0,
      data: new Date().toISOString().split("T")[0],
    })
    setModalOpen(true)
  }

  const openEdit = (id: string) => {
    const item = renda.find((r) => r.id === id)
    if (!item) return
    setEditingId(id)
    setForm({
      tipo: item.tipo,
      descricao: item.descricao,
      valor: item.valor,
      data: item.data,
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.descricao.trim()) return
    if (editingId) {
      updateRenda(editingId, {
        tipo: form.tipo,
        descricao: form.descricao.trim(),
        valor: form.valor,
        data: form.data,
      })
    } else {
      addRenda({
        tipo: form.tipo,
        descricao: form.descricao.trim(),
        valor: form.valor,
        data: form.data,
      })
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteRenda(id)
    setConfirmDeleteId(null)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Renda
          </h1>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-1">
            Gerencie suas fontes de renda
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary self-start sm:self-auto flex items-center gap-2 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5">
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          Adicionar Renda
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 animate-fade-in-up" style={{ gap: "40px", animationDelay: "80ms" }}>
        <div className="card px-5 py-6 sm:px-8 sm:py-9 lg:px-10 lg:py-11 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase size={18} className="text-[var(--text-muted)]" />
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold">Salario 1</p>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--success)]">
            {formatCurrency(salario1Total)}
          </p>
        </div>
        <div className="card px-5 py-6 sm:px-8 sm:py-9 lg:px-10 lg:py-11 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet size={18} className="text-[var(--text-muted)]" />
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold">Salario 2</p>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--success)]">
            {formatCurrency(salario2Total)}
          </p>
        </div>
        <div className="card px-5 py-6 sm:px-8 sm:py-9 lg:px-10 lg:py-11 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[var(--text-muted)]" />
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold">Extras</p>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--success)]">
            {formatCurrency(extrasTotal)}
          </p>
        </div>
        <div className="card px-5 py-6 sm:px-8 sm:py-9 lg:px-10 lg:py-11 text-center" style={{ border: "2px solid var(--success)" }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <PiggyBank size={18} className="text-[var(--success)]" />
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold">Total Geral</p>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--success)]">
            {formatCurrency(totalGeral)}
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
          <DollarSign size={24} className="text-[var(--text-muted)] mb-4 opacity-50" />
          <p className="text-[var(--text-muted)] text-base sm:text-lg mb-1">
            Nenhuma renda registrada
          </p>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm">
            Adicione sua primeira fonte de renda
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto" style={{ padding: "40px" }}>
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider px-5 py-5 text-[var(--text-muted)]">
                    Tipo
                  </th>
                  <th className="text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider px-5 py-5 text-[var(--text-muted)]">
                    Descricao
                  </th>
                  <th className="text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider px-5 py-5 text-[var(--text-muted)]">
                    Valor
                  </th>
                  <th className="text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider px-5 py-5 text-[var(--text-muted)]">
                    Data
                  </th>
                  <th className="text-right text-[10px] sm:text-xs font-bold uppercase tracking-wider px-5 py-5 text-[var(--text-muted)]">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((item, index) => {
                  const cor = tipoCor(item.tipo)
                  return (
                    <tr
                      key={item.id}
                      className="table-row"
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                      <td className="px-5 py-6">
                        <span
                          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: cor.bg, color: cor.color }}
                        >
                          {tipoIcon(item.tipo)}
                          {tipoLabel(item.tipo)}
                        </span>
                      </td>
                      <td className="px-5 py-6 text-[var(--text-primary)] text-sm font-semibold">
                        {item.descricao}
                      </td>
                      <td className="px-5 py-6 text-[var(--success)] font-bold text-base">
                        {formatCurrency(item.valor)}
                      </td>
                      <td className="px-5 py-6 text-[var(--text-secondary)] text-sm">
                        {formatDate(item.data)}
                      </td>
                      <td className="px-5 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(item.id)}
                            className="p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-2.5 rounded-xl hover:bg-[var(--danger-light)] transition-colors text-[var(--text-muted)] hover:text-[var(--danger)]"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Renda" : "Adicionar Renda"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Tipo
            </label>
            <div className="grid grid-cols-3" style={{ gap: "40px" }}>
              {(["salario1", "salario2", "extra"] as RendaTipo[]).map(
                (tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setForm({ ...form, tipo })}
                    className={`flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-xl text-sm font-semibold transition-all border ${
                      form.tipo === tipo
                        ? "border-[var(--success)] text-[var(--success)] bg-[var(--success)] bg-opacity-10"
                        : "border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    {tipoIcon(tipo)}
                    {tipoLabel(tipo)}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Descricao
            </label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Ex: Salario empresa X"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Valor (R$)
            </label>
            <input
              type="number"
              value={form.valor || ""}
              onChange={(e) => setForm({ ...form, valor: parseFloat(e.target.value) || 0 })}
              placeholder="0,00"
              min={0}
              step={0.01}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Data
            </label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="input w-full"
            />
          </div>

          <div className="flex justify-end" style={{ gap: "40px" }}>
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2"
            >
              <X size={14} />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {editingId ? (
                <>
                  <Pencil size={14} />
                  Salvar
                </>
              ) : (
                <>
                  <Plus size={14} />
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
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div className="flex items-start gap-4">
            <AlertTriangle size={20} className="text-[var(--danger)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--text-secondary)]">
              Tem certeza que deseja excluir esta renda? Esta acao nao pode ser desfeita.
            </p>
          </div>
          <div className="flex justify-end" style={{ gap: "40px" }}>
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2"
            >
              <X size={14} />
              Cancelar
            </button>
            <button
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="bg-[var(--danger)] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium transition-all text-sm flex items-center gap-2"
            >
              <Trash2 size={14} />
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
