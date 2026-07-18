"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { v4 as uuid } from "uuid";
import type { Categoria, Gasto, Renda } from "./supabase";

interface FinanceData {
  categorias: Categoria[];
  gastos: Gasto[];
  renda: Renda[];
}

interface FinanceContextType extends FinanceData {
  addCategoria: (c: Omit<Categoria, "id" | "created_at">) => void;
  updateCategoria: (id: string, c: Partial<Categoria>) => void;
  deleteCategoria: (id: string) => void;
  addGasto: (g: Omit<Gasto, "id" | "created_at" | "categoria">) => void;
  updateGasto: (id: string, g: Partial<Gasto>) => void;
  deleteGasto: (id: string) => void;
  addRenda: (r: Omit<Renda, "id" | "created_at">) => void;
  updateRenda: (id: string, r: Partial<Renda>) => void;
  deleteRenda: (id: string) => void;
  totalGastos: () => number;
  totalRenda: () => number;
  saldo: () => number;
  gastosPorCategoria: () => { nome: string; valor: number; cor: string }[];
  gastosPorPeriodicidade: () => {
    semanal: number;
    mensal: number;
    anual: number;
  };
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const DEFAULT_CATEGORIAS: Categoria[] = [
  {
    id: uuid(),
    nome: "Cartão de Crédito",
    tipo: "gasto",
    icone: "💳",
    cor: "#ef4444",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Água",
    tipo: "gasto",
    icone: "💧",
    cor: "#3b82f6",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Gás",
    tipo: "gasto",
    icone: "🔥",
    cor: "#f59e0b",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Energia",
    tipo: "gasto",
    icone: "⚡",
    cor: "#eab308",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Financiamentos",
    tipo: "gasto",
    icone: "🏦",
    cor: "#8b5cf6",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Carro",
    tipo: "gasto",
    icone: "🚗",
    cor: "#14b8a6",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Apartamento",
    tipo: "gasto",
    icone: "🏠",
    cor: "#f97316",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Salário 1",
    tipo: "renda",
    icone: "💵",
    cor: "#22c55e",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Salário 2",
    tipo: "renda",
    icone: "💵",
    cor: "#16a34a",
    created_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    nome: "Trabalho Extra",
    tipo: "renda",
    icone: "🎯",
    cor: "#06b6d4",
    created_at: new Date().toISOString(),
  },
];

const STORAGE_KEY = "planejamento_financeiro";

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinanceData>(() => {
    if (typeof window === "undefined") {
      return { categorias: DEFAULT_CATEGORIAS, gastos: [], renda: [] };
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return { categorias: DEFAULT_CATEGORIAS, gastos: [], renda: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addCategoria = useCallback(
    (c: Omit<Categoria, "id" | "created_at">) => {
      const nova: Categoria = {
        ...c,
        id: uuid(),
        created_at: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, categorias: [...prev.categorias, nova] }));
    },
    []
  );

  const updateCategoria = useCallback(
    (id: string, c: Partial<Categoria>) => {
      setData((prev) => ({
        ...prev,
        categorias: prev.categorias.map((cat) =>
          cat.id === id ? { ...cat, ...c } : cat
        ),
      }));
    },
    []
  );

  const deleteCategoria = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      categorias: prev.categorias.filter((cat) => cat.id !== id),
      gastos: prev.gastos.filter((g) => g.categoria_id !== id),
    }));
  }, []);

  const addGasto = useCallback(
    (g: Omit<Gasto, "id" | "created_at" | "categoria">) => {
      const novo: Gasto = {
        ...g,
        id: uuid(),
        created_at: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, gastos: [...prev.gastos, novo] }));
    },
    []
  );

  const updateGasto = useCallback((id: string, g: Partial<Gasto>) => {
    setData((prev) => ({
      ...prev,
      gastos: prev.gastos.map((gasto) =>
        gasto.id === id ? { ...gasto, ...g } : gasto
      ),
    }));
  }, []);

  const deleteGasto = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      gastos: prev.gastos.filter((g) => g.id !== id),
    }));
  }, []);

  const addRenda = useCallback(
    (r: Omit<Renda, "id" | "created_at">) => {
      const nova: Renda = {
        ...r,
        id: uuid(),
        created_at: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, renda: [...prev.renda, nova] }));
    },
    []
  );

  const updateRenda = useCallback((id: string, r: Partial<Renda>) => {
    setData((prev) => ({
      ...prev,
      renda: prev.renda.map((rend) =>
        rend.id === id ? { ...rend, ...r } : rend
      ),
    }));
  }, []);

  const deleteRenda = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      renda: prev.renda.filter((r) => r.id !== id),
    }));
  }, []);

  const totalGastos = useCallback(() => {
    return data.gastos.reduce((acc, g) => {
      if (g.periodicidade === "mensal") return acc + g.valor;
      if (g.periodicidade === "semanal") return acc + g.valor * 4;
      if (g.periodicidade === "anual") return acc + g.valor / 12;
      return acc;
    }, 0);
  }, [data.gastos]);

  const totalRenda = useCallback(() => {
    return data.renda.reduce((acc, r) => acc + r.valor, 0);
  }, [data.renda]);

  const saldo = useCallback(() => {
    return totalRenda() - totalGastos();
  }, [totalRenda, totalGastos]);

  const gastosPorCategoria = useCallback(() => {
    const map = new Map<string, number>();
    data.gastos.forEach((g) => {
      const cat = data.categorias.find((c) => c.id === g.categoria_id);
      if (!cat) return;
      const valor =
        g.periodicidade === "mensal"
          ? g.valor
          : g.periodicidade === "semanal"
          ? g.valor * 4
          : g.valor / 12;
      map.set(cat.nome, (map.get(cat.nome) || 0) + valor);
    });
    return Array.from(map.entries())
      .map(([nome, valor]) => {
        const cat = data.categorias.find((c) => c.nome === nome);
        return { nome, valor, cor: cat?.cor || "#737373" };
      })
      .sort((a, b) => b.valor - a.valor);
  }, [data.gastos, data.categorias]);

  const gastosPorPeriodicidade = useCallback(() => {
    let semanal = 0;
    let mensal = 0;
    let anual = 0;
    data.gastos.forEach((g) => {
      if (g.periodicidade === "semanal") semanal += g.valor;
      else if (g.periodicidade === "mensal") mensal += g.valor;
      else anual += g.valor;
    });
    return { semanal, mensal, anual };
  }, [data.gastos]);

  return (
    <FinanceContext.Provider
      value={{
        ...data,
        addCategoria,
        updateCategoria,
        deleteCategoria,
        addGasto,
        updateGasto,
        deleteGasto,
        addRenda,
        updateRenda,
        deleteRenda,
        totalGastos,
        totalRenda,
        saldo,
        gastosPorCategoria,
        gastosPorPeriodicidade,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
