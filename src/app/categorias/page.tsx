"use client";

import { useState, useMemo } from "react";
import { useFinance } from "@/lib/finance-context";
import { Modal } from "@/components/Modal";
import { Plus, Pencil, Trash2, Tag, Search, Filter, X } from "lucide-react";

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
  credit_card: "\u{1F4B3}",
  water_drop: "\u{1F4A7}",
  local_fire_department: "\u{1F525}",
  bolt: "\u26A1",
  account_balance: "\u{1F3E6}",
  directions_car: "\u{1F697}",
  home: "\u{1F3E0}",
  shopping_cart: "\u{1F6D2}",
  phone_iphone: "\u{1F4F1}",
  sports_esports: "\u{1F3AE}",
  flight: "\u2708\uFE0F",
  restaurant: "\u{1F355}",
  fitness_center: "\u{1F4AA}",
  school: "\u{1F4DA}",
  trending_up: "\u{1F4C8}",
  medication: "\u{1F48A}",
  pets: "\u{1F43E}",
  card_giftcard: "\u{1F381}",
  payments: "\u{1F4B5}",
  savings: "\u{1F4B0}",
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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Categorias
          </h1>
          <p className="text-[var(--text-tertiary)] text-xs sm:text-sm mt-0.5">
            Organize seus gastos e rendas por categoria
          </p>
        </div>
        <button onClick={abrirModalAdicionar} className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5">
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Nova Categoria
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
                ? "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-white"
                : "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categoriasFiltradas.map((cat, i) => (
            <div
              key={cat.id}
              className="card group relative flex items-center gap-4 sm:gap-5 lg:gap-6 transition-all duration-300 hover:scale-[1.02]"
              style={{ padding: "20px", animationDelay: `${i * 40}ms` }}
            >
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-[26px] lg:text-[28px] shrink-0"
                style={{ backgroundColor: cat.cor + "20" }}
              >
                {ICON_EMOJI[cat.icone] || "\u{1F4CC}"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-[var(--text-primary)] text-sm sm:text-base">
                  {cat.nome}
                </p>
                <span
                  className="badge text-[10px] sm:text-xs"
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
                  className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-[var(--bg-inset)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  title="Editar"
                >
                  <Pencil size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  onClick={() => confirmarExcluir(cat.id)}
                  className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-red-500/10 text-[var(--text-tertiary)] hover:text-[#ef4444]"
                  title="Excluir"
                >
                  <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: "20px" }}>
          <div
            className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mb-3 mx-auto"
            style={{ background: "var(--bg-inset)" }}
          >
            <Tag size={24} className="text-[var(--text-tertiary)] sm:w-7 sm:h-7" />
          </div>
          <p className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-1">
            Nenhuma categoria encontrada
          </p>
          <p className="text-xs sm:text-sm text-[var(--text-tertiary)]">
            Crie sua primeira categoria para comecar a organizar
          </p>
        </div>
      )}

      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar Categoria" : "Nova Categoria"}
      >
        <div className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-[13px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
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
            <label className="block text-[13px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Tipo
            </label>
            <div className="flex gap-2">
              {(["gasto", "renda"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={
                    tipo === t
                      ? "flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-white"
                      : "flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
            <label className="block text-[13px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Icone
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {ICON_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setIcone(key)}
                  className={
                    icone === key
                      ? "w-full aspect-square rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all ring-2 ring-[var(--accent)] shadow-md"
                      : "w-full aspect-square rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all hover:scale-110 bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
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
            <label className="block text-[13px] sm:text-[15px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Cor
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCor(c)}
                  className={
                    cor === c
                      ? "w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all ring-2 ring-offset-2 ring-[var(--accent)] shadow-md"
                      : "w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all hover:scale-110"
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
              className="flex-1 px-3 py-2.5 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={!nome.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              {editandoId ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
