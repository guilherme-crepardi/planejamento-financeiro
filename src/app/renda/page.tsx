"use client";

import { useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { Modal } from "@/components/Modal";

export default function RendaPage() {
  const { renda, addRenda, updateRenda, deleteRenda } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [tipo, setTipo] = useState<"salario1" | "salario2" | "extra">("salario1");

  const formatar = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const salario1Total = renda
    .filter((r) => r.tipo === "salario1")
    .reduce((acc, r) => acc + r.valor, 0);
  const salario2Total = renda
    .filter((r) => r.tipo === "salario2")
    .reduce((acc, r) => acc + r.valor, 0);
  const extraTotal = renda
    .filter((r) => r.tipo === "extra")
    .reduce((acc, r) => acc + r.valor, 0);
  const totalGeral = salario1Total + salario2Total + extraTotal;

  const abrirNovo = () => {
    setEditando(null);
    setDescricao("");
    setValor("");
    setData(new Date().toISOString().split("T")[0]);
    setTipo("salario1");
    setModalOpen(true);
  };

  const abrirEditar = (id: string) => {
    const r = renda.find((x) => x.id === id);
    if (!r) return;
    setEditando(id);
    setDescricao(r.descricao);
    setValor(String(r.valor));
    setData(r.data);
    setTipo(r.tipo);
    setModalOpen(true);
  };

  const salvar = () => {
    if (!descricao.trim() || !valor) return;
    const dados = {
      descricao,
      valor: parseFloat(valor),
      data,
      tipo,
    };
    if (editando) {
      updateRenda(editando, dados);
    } else {
      addRenda(dados);
    }
    setModalOpen(false);
  };

  const remover = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este registro de renda?")) {
      deleteRenda(id);
    }
  };

  const tipoLabel = (t: string) => {
    if (t === "salario1") return "Salário 1";
    if (t === "salario2") return "Salário 2";
    return "Trabalho Extra";
  };

  const tipoCor = (t: string) => {
    if (t === "salario1") return { bg: "#22c55e20", color: "#22c55e" };
    if (t === "salario2") return { bg: "#16a34a20", color: "#16a34a" };
    return { bg: "#06b6d420", color: "#06b6d4" };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Renda</h1>
        <button
          onClick={abrirNovo}
          className="bg-[var(--success)] hover:bg-[var(--success-hover)] text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          + Nova Renda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <p className="text-[var(--muted)] text-sm">Salário 1</p>
          <p className="text-xl font-bold text-[var(--success)]">
            {formatar(salario1Total)}
          </p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <p className="text-[var(--muted)] text-sm">Salário 2</p>
          <p className="text-xl font-bold text-[var(--success)]">
            {formatar(salario2Total)}
          </p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <p className="text-[var(--muted)] text-sm">Extras</p>
          <p className="text-xl font-bold text-[var(--success)]">
            {formatar(extraTotal)}
          </p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--success)] rounded-2xl p-5">
          <p className="text-[var(--muted)] text-sm">Total</p>
          <p className="text-xl font-bold text-[var(--success)]">
            {formatar(totalGeral)}
          </p>
        </div>
      </div>

      {renda.length > 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-4 px-6 text-[var(--muted)]">Descrição</th>
                <th className="text-left py-4 px-6 text-[var(--muted)]">Tipo</th>
                <th className="text-left py-4 px-6 text-[var(--muted)]">Data</th>
                <th className="text-right py-4 px-6 text-[var(--muted)]">Valor</th>
                <th className="text-right py-4 px-6 text-[var(--muted)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {renda
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map((r) => {
                  const tc = tipoCor(r.tipo);
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">{r.descricao}</td>
                      <td className="py-4 px-6">
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: tc.bg, color: tc.color }}
                        >
                          {tipoLabel(r.tipo)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--muted)]">
                        {new Date(r.data + "T00:00:00").toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4 px-6 text-right text-[var(--success)] font-bold">
                        {formatar(r.valor)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => abrirEditar(r.id)}
                          className="p-2 rounded-lg hover:bg-[var(--background)] text-[var(--muted)] hover:text-white mr-1"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => remover(r.id)}
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
          <p className="text-4xl mb-4">💰</p>
          <p className="text-[var(--muted)]">Nenhum registro de renda</p>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? "Editar Renda" : "Nova Renda"}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Tipo</label>
            <div className="flex gap-2">
              {(["salario1", "salario2", "extra"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors text-sm ${
                    tipo === t
                      ? "bg-[var(--success)] text-white"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {tipoLabel(t)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Salário empresa X"
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
          <button
            onClick={salvar}
            disabled={!descricao.trim() || !valor}
            className="w-full bg-[var(--success)] hover:bg-[var(--success-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold mt-2 transition-colors"
          >
            {editando ? "Salvar Alterações" : "Adicionar Renda"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
