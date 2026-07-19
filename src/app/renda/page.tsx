"use client"

import { useState } from "react"
import { useFinance } from "@/lib/finance-context"
import { Modal } from "@/components/Modal"
import {
  Plus,
  Pencil,
  Trash2,
  Banknote,
  DollarSign,
  AlertTriangle,
  X,
  Loader2,
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
      return <Briefcase size={14} />
    case "salario2":
      return <Wallet size={14} />
    case "extra":
      return <TrendingUp size={14} />
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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14 lg:space-y-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
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

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-10 lg:gap-12 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <div className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Briefcase size={16} className="text-[var(--text-muted)] sm:w-5 sm:h-5" />
            <p className="text-[11px] sm:text-sm text-[var(--text-muted)] font-medium">Salario 1</p>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[var(--success)]">
            {formatCurrency(salario1Total)}
          </p>
        </div>
        <div className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wallet size={16} className="text-[var(--text-muted)] sm:w-5 sm:h-5" />
            <p className="text-[11px] sm:text-sm text-[var(--text-muted)] font-medium">Salario 2</p>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[var(--success)]">
            {formatCurrency(salario2Total)}
          </p>
        </div>
        <div className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp size={16} className="text-[var(--text-muted)] sm:w-5 sm:h-5" />
            <p className="text-[11px] sm:text-sm text-[var(--text-muted)] font-medium">Extras</p>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[var(--success)]">
            {formatCurrency(extrasTotal)}
          </p>
        </div>
        <div className="card px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 text-center" style={{ border: "2px solid var(--success)" }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <PiggyBank size={16} className="text-[var(--success)] sm:w-5 sm:h-5" />
            <p className="text-[11px] sm:text-sm text-[var(--text-muted)] font-medium">Total Geral</p>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[var(--success)]">
            {formatCurrency(totalGeral)}
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 flex flex-col items-center justify-center text-center animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <DollarSign size={24} className="text-[var(--text-muted)] mb-3 sm:mb-4 opacity-50 sm:w-7 sm:h-7" />
          <p className="text-[var(--text-muted)] text-base sm:text-lg mb-1">
            Nenhuma renda registrada
          </p>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm">
            Adicione sua primeira fonte de renda
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-3 sm:py-4 text-[var(--text-muted)]">
                    Tipo
                  </th>
                  <th className="text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-3 sm:py-4 text-[var(--text-muted)]">
                    Descricao
                  </th>
                  <th className="text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-3 sm:py-4 text-[var(--text-muted)]">
                    Valor
                  </th>
                  <th className="text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-3 sm:py-4 text-[var(--text-muted)]">
                    Data
                  </th>
                  <th className="text-right text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-3 sm:py-4 text-[var(--text-muted)]">
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
                      style={{ borderBottom: "1px solid var(--border-subtle)", animationDelay: `${240 + index * 40}ms` }}
                    >
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <span
                          className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
                          style={{ backgroundColor: cor.bg, color: cor.color }}
                        >
                          {tipoIcon(item.tipo)}
                          {tipoLabel(item.tipo)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6 text-[var(--text-primary)] text-xs sm:text-sm font-semibold">
                        {item.descricao}
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6 text-[var(--success)] font-bold text-sm sm:text-base">
                        {formatCurrency(item.valor)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6 text-[var(--text-secondary)] text-xs sm:text-sm">
                        {formatDate(item.data)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <button
                            onClick={() => openEdit(item.id)}
                            className="p-2 sm:p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            title="Editar"
                          >
                            <Pencil size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-2 sm:p-2.5 rounded-xl hover:bg-[var(--danger-light)] transition-colors text-[var(--text-muted)] hover:text-[var(--danger)]"
                            title="Excluir"
                          >
                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
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
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["salario1", "salario2", "extra"] as RendaTipo[]).map(
                (tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setForm({ ...form, tipo })}
                    className={`flex flex-col items-center justify-center gap-2 px-3 py-4 sm:px-4 sm:py-5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all border ${
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
            <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-2">
              Descricao
            </label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) =>
                setForm({ ...form, descricao: e.target.value })
              }
              placeholder="Ex: Salario empresa X"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              value={form.valor || ""}
              onChange={(e) =>
                setForm({ ...form, valor: parseFloat(e.target.value) || 0 })
              }
              placeholder="0,00"
              min={0}
              step={0.01}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-2">
              Data
            </label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="input w-full"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2 text-xs sm:text-sm"
            >
              {editingId ? (
                <>
                  <Pencil size={14} className="sm:w-4 sm:h-4" />
                  Salvar
                </>
              ) : (
                <>
                  <Plus size={14} className="sm:w-4 sm:h-4" />
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
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-[var(--danger)] mt-0.5 shrink-0 sm:w-5 sm:h-5" />
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Tem certeza que deseja excluir esta renda? Esta acao nao pode ser
              desfeita.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
              Cancelar
            </button>
            <button
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="bg-[var(--danger)] hover:opacity-90 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4" />
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
