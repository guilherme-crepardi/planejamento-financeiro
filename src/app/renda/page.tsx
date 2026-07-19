"use client"

import { useState } from "react"
import { useFinance } from "@/lib/finance-context"
import { Modal } from "@/components/Modal"

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
    <div className="max-w-[1200px] mx-auto space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-[26px] font-bold text-[var(--text-primary)] tracking-tight">
            Renda
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Gerencie suas fontes de renda
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary self-start sm:self-auto">
          + Adicionar Renda
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <div className="card p-5">
          <p className="text-xs text-[var(--text-muted)] mb-1">Salario 1</p>
          <p className="text-lg md:text-xl font-bold text-[var(--success)]">
            {formatCurrency(salario1Total)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-[var(--text-muted)] mb-1">Salario 2</p>
          <p className="text-lg md:text-xl font-bold text-[var(--success)]">
            {formatCurrency(salario2Total)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-[var(--text-muted)] mb-1">Extras</p>
          <p className="text-lg md:text-xl font-bold text-[var(--success)]">
            {formatCurrency(extrasTotal)}
          </p>
        </div>
        <div className="card p-5 border-[var(--success)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Total Geral</p>
          <p className="text-lg md:text-xl font-bold text-[var(--success)]">
            {formatCurrency(totalGeral)}
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <svg
            className="w-16 h-16 text-[var(--text-muted)] mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[var(--text-muted)] text-lg mb-1">
            Nenhuma renda registrada
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            Adicione sua primeira fonte de renda
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                    Tipo
                  </th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                    Descricao
                  </th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                    Valor
                  </th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                    Data
                  </th>
                  <th className="text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
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
                      style={{ animationDelay: `${240 + index * 40}ms` }}
                    >
                      <td className="px-5 py-4">
                        <span
                          className="inline-block text-xs font-medium px-3 py-1 rounded-full"
                          style={{ backgroundColor: cor.bg, color: cor.color }}
                        >
                          {tipoLabel(item.tipo)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[var(--text-primary)] text-sm font-medium">
                        {item.descricao}
                      </td>
                      <td className="px-5 py-4 text-[var(--success)] font-semibold text-sm">
                        {formatCurrency(item.valor)}
                      </td>
                      <td className="px-5 py-4 text-[var(--text-secondary)] text-sm">
                        {formatDate(item.data)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(item.id)}
                            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            title="Editar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-2 rounded-lg hover:bg-[var(--danger-light)] transition-colors text-[var(--text-muted)] hover:text-[var(--danger)]"
                            title="Excluir"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["salario1", "salario2", "extra"] as RendaTipo[]).map(
                (tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setForm({ ...form, tipo })}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      form.tipo === tipo
                        ? "border-[var(--success)] text-[var(--success)] bg-[var(--success)] bg-opacity-10"
                        : "border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    {tipoLabel(tipo)}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
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
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
            >
              {editingId ? "Salvar" : "Adicionar"}
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
          <p className="text-[var(--text-secondary)]">
            Tem certeza que deseja excluir esta renda? Esta acao nao pode ser
            desfeita.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="bg-[var(--danger)] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium transition-all text-sm"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
