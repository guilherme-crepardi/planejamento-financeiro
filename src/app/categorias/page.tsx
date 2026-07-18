"use client";

import { useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { Modal } from "@/components/Modal";

const ICONES = ["💳", "💧", "🔥", "⚡", "🏦", "🚗", "🏠", "🛒", "📱", "🎮", "✈️", "🍕", "💪", "📚", "🎯", "💊", "🐾", "🎁", "💵", "💰"];
const CORES = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];

export default function CategoriasPage() {
  const { categorias, addCategoria, updateCategoria, deleteCategoria } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"gasto" | "renda">("gasto");
  const [icone, setIcone] = useState("💳");
  const [cor, setCor] = useState("#ef4444");
  const [filtro, setFiltro] = useState<"todos" | "gasto" | "renda">("todos");

  const categoriasFiltradas = categorias.filter(
    (c) => filtro === "todos" || c.tipo === filtro
  );

  const abrirNovo = () => {
    setEditando(null);
    setNome("");
    setTipo("gasto");
    setIcone("💳");
    setCor("#ef4444");
    setModalOpen(true);
  };

  const abrirEditar = (id: string) => {
    const cat = categorias.find((c) => c.id === id);
    if (!cat) return;
    setEditando(id);
    setNome(cat.nome);
    setTipo(cat.tipo);
    setIcone(cat.icone);
    setCor(cat.cor);
    setModalOpen(true);
  };

  const salvar = () => {
    if (!nome.trim()) return;
    if (editando) {
      updateCategoria(editando, { nome, tipo, icone, cor });
    } else {
      addCategoria({ nome, tipo, icone, cor });
    }
    setModalOpen(false);
  };

  const remover = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteCategoria(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <button
          onClick={abrirNovo}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          + Nova Categoria
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["todos", "gasto", "renda"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === f
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-white"
            }`}
          >
            {f === "todos" ? "Todos" : f === "gasto" ? "Gastos" : "Renda"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriasFiltradas.map((cat) => (
          <div
            key={cat.id}
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--primary)] transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: cor + "20" }}
                >
                  {cat.icone}
                </span>
                <div>
                  <h3 className="font-bold">{cat.nome}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: cat.cor + "20",
                      color: cat.cor,
                    }}
                  >
                    {cat.tipo === "gasto" ? "Gasto" : "Renda"}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => abrirEditar(cat.id)}
                  className="p-2 rounded-lg hover:bg-[var(--card-hover)] text-[var(--muted)] hover:text-white"
                >
                  ✏️
                </button>
                <button
                  onClick={() => remover(cat.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--muted)] hover:text-[var(--danger)]"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categoriasFiltradas.length === 0 && (
        <p className="text-[var(--muted)] text-center py-16">
          Nenhuma categoria encontrada
        </p>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? "Editar Categoria" : "Nova Categoria"}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Cartão Nubank"
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Tipo</label>
            <div className="flex gap-2">
              {(["gasto", "renda"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    tipo === t
                      ? t === "gasto"
                        ? "bg-[var(--danger)] text-white"
                        : "bg-[var(--success)] text-white"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {t === "gasto" ? "💸 Gasto" : "💰 Renda"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Ícone</label>
            <div className="flex flex-wrap gap-2">
              {ICONES.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcone(i)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                    icone === i
                      ? "bg-[var(--primary)] ring-2 ring-[var(--primary)]"
                      : "bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Cor</label>
            <div className="flex flex-wrap gap-2">
              {CORES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    cor === c ? "ring-2 ring-white scale-110" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={salvar}
            disabled={!nome.trim()}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold mt-2 transition-colors"
          >
            {editando ? "Salvar Alterações" : "Criar Categoria"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
