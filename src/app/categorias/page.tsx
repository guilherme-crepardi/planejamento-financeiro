"use client";

import { useState, useMemo } from "react";
import { useFinance } from "@/lib/finance-context";
import { Modal } from "@/components/Modal";

const ICON_KEYS = [
  "credit_card",
  "water_drop",
  "local_fire_department",
  "bolt",
  "account_balance",
  "directions_car",
  "home",
  "shopping_cart",
  "phone_iphone",
  "sports_esports",
  "flight",
  "restaurant",
  "fitness_center",
  "school",
  "trending_up",
  "medication",
  "pets",
  "card_giftcard",
  "payments",
  "savings",
] as const;

const ICON_EMOJI: Record<string, string> = {
  credit_card: "💳",
  water_drop: "💧",
  local_fire_department: "🔥",
  bolt: "⚡",
  account_balance: "🏦",
  directions_car: "🚗",
  home: "🏠",
  shopping_cart: "🛒",
  phone_iphone: "📱",
  sports_esports: "🎮",
  flight: "✈️",
  restaurant: "🍕",
  fitness_center: "💪",
  school: "📚",
  trending_up: "📈",
  medication: "💊",
  pets: "🐾",
  card_giftcard: "🎁",
  payments: "💵",
  savings: "💰",
};

const COLOR_OPTIONS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
];

type Filter = "todos" | "gasto" | "renda";

export default function CategoriasPage() {
  const { categorias, addCategoria, updateCategoria, deleteCategoria } =
    useFinance();

  const [filtro, setFiltro] = useState<Filter>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"gasto" | "renda">("gasto");
  const [icone, setIcone] = useState<string>("credit_card");
  const [cor, setCor] = useState<string>("#3b82f6");

  const categoriasFiltradas = useMemo(() => {
    if (filtro === "todos") return categorias;
    return categorias.filter((c) => c.tipo === filtro);
  }, [categorias, filtro]);

  function abrirModalAdicionar() {
    setEditandoId(null);
    setNome("");
    setTipo("gasto");
    setIcone("credit_card");
    setCor("#3b82f6");
    setModalAberto(true);
  }

  function abrirModalEditar(id: string) {
    const cat = categorias.find((c) => c.id === id);
    if (!cat) return;
    setEditandoId(id);
    setNome(cat.nome);
    setTipo(cat.tipo);
    setIcone(cat.icone);
    setCor(cat.cor);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
  }

  function salvar() {
    if (!nome.trim()) return;

    if (editandoId) {
      updateCategoria(editandoId, { nome: nome.trim(), tipo, icone, cor });
    } else {
      addCategoria({ nome: nome.trim(), tipo, icone, cor });
    }
    fecharModal();
  }

  function confirmarExcluir(id: string) {
    deleteCategoria(id);
  }

  return (
    <div className="animate-fade-in min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Categorias
          </h1>
          <button onClick={abrirModalAdicionar} className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg text-sm">
            + Nova Categoria
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {(
            [
              { key: "todos", label: "Todos" },
              { key: "gasto", label: "Gastos" },
              { key: "renda", label: "Renda" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={
                filtro === f.key
                  ? "bg-[var(--accent)] text-white shadow-md px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  : "bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-4 py-2 rounded-xl text-sm font-medium transition-all"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriasFiltradas.map((cat) => (
            <div
              key={cat.id}
              className="animate-fade-in rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: cat.cor + "22" }}
              >
                {ICON_EMOJI[cat.icone] || "📌"}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cat.nome}
                </p>
                <span
                  className="text-xs font-medium"
                  style={{
                    color:
                      cat.tipo === "renda"
                        ? "var(--success)"
                        : "var(--danger)",
                  }}
                >
                  {cat.tipo === "renda" ? "Renda" : "Gasto"}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => abrirModalEditar(cat.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: "var(--text-muted)" }}
                  title="Editar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
                <button
                  onClick={() => confirmarExcluir(cat.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--danger-light)]"
                  style={{ color: "var(--danger)" }}
                  title="Excluir"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {categoriasFiltradas.length === 0 && (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p style={{ color: "var(--text-muted)" }} className="text-lg">
              Nenhuma categoria encontrada.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar Categoria" : "Nova Categoria"}
      >
        <div className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Alimentação"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Tipo
            </label>
            <div className="flex gap-2">
              {(["gasto", "renda"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={
                    tipo === t
                      ? "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-[var(--accent)] text-white shadow-md"
                      : "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }
                >
                  {t === "gasto" ? "Gasto" : "Renda"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Ícone
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
              {ICON_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setIcone(key)}
                  className={
                    icone === key
                      ? "w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all ring-2 ring-[var(--accent)] shadow-md"
                      : "w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110"
                  }
                  style={{
                    backgroundColor:
                      icone === key
                        ? "var(--accent)" + "22"
                        : "var(--bg-primary)",
                    border: `1px solid ${
                      icone === key ? "var(--accent)" : "var(--border-color)"
                    }`,
                  }}
                  title={key}
                >
                  {ICON_EMOJI[key]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Cor
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCor(c)}
                  className={
                    cor === c
                      ? "w-8 h-8 rounded-full transition-all ring-2 ring-offset-2 ring-[var(--accent)] shadow-md"
                      : "w-8 h-8 rounded-full transition-all hover:scale-110"
                  }
                  style={{
                    backgroundColor: c,
                  }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={fecharModal}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={!nome.trim()}
              className="flex-1 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editandoId ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
