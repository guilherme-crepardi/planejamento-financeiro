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
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--text-primary)] tracking-tight">
            Categorias
          </h1>
          <p className="text-[var(--text-tertiary)] text-sm mt-0.5">
            Organize seus gastos e rendas por categoria
          </p>
        </div>
        <button onClick={abrirModalAdicionar} className="btn-primary">
          + Nova Categoria
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
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
                ? "px-4 py-2 rounded-xl text-sm font-semibold transition-all text-white"
                : "px-4 py-2 rounded-xl text-sm font-medium transition-all bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }
            style={
              filtro === f.key
                ? {
                    background:
                      "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                    boxShadow: "0 2px 12px rgba(79, 110, 247, 0.35)",
                  }
                : undefined
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {categoriasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriasFiltradas.map((cat, i) => (
            <div
              key={cat.id}
              className="card group relative p-5 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: cat.cor + "20" }}
              >
                {ICON_EMOJI[cat.icone] || "📌"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-[var(--text-primary)]">
                  {cat.nome}
                </p>
                <span
                  className="badge text-xs"
                  style={{
                    backgroundColor:
                      cat.tipo === "renda" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                    color: cat.tipo === "renda" ? "#22c55e" : "#ef4444",
                  }}
                >
                  {cat.tipo === "renda" ? "Renda" : "Gasto"}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => abrirModalEditar(cat.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-inset)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  title="Editar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
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
                  className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-[var(--text-tertiary)] hover:text-[#ef4444]"
                  title="Excluir"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
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
      ) : (
        <div className="card py-16 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3 mx-auto"
            style={{ background: "var(--bg-inset)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--text-tertiary)]"
            >
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
          </div>
          <p className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-1">
            Nenhuma categoria encontrada
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Crie sua primeira categoria para começar a organizar
          </p>
        </div>
      )}

      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar Categoria" : "Nova Categoria"}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Alimentacao"
              className="input"
            />
          </div>

          <div>
            <label className="block text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Tipo
            </label>
            <div className="flex gap-2">
              {(["gasto", "renda"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={
                    tipo === t
                      ? "flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-white"
                      : "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }
                  style={
                    tipo === t
                      ? {
                          background:
                            "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                          boxShadow: "0 2px 12px rgba(79, 110, 247, 0.35)",
                        }
                      : undefined
                  }
                >
                  {t === "gasto" ? "Gasto" : "Renda"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Icone
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setIcone(key)}
                  className={
                    icone === key
                      ? "w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all ring-2 ring-[var(--accent)] shadow-md"
                      : "w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110 bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                  }
                  style={
                    icone === key
                      ? { backgroundColor: "var(--accent)", color: "white" }
                      : undefined
                  }
                  title={key}
                >
                  {ICON_EMOJI[key]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
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
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={fecharModal}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={!nome.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editandoId ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
