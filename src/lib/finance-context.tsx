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
import { supabase } from "./supabase";
import { useAuth } from "./auth-context";

interface FinanceData {
  categorias: Categoria[];
  gastos: Gasto[];
  renda: Renda[];
}

interface FinanceContextType extends FinanceData {
  loading: boolean;
  addCategoria: (c: Omit<Categoria, "id" | "created_at" | "user_id">) => void;
  updateCategoria: (id: string, c: Partial<Categoria>) => void;
  deleteCategoria: (id: string) => void;
  addGasto: (g: Omit<Gasto, "id" | "created_at" | "categoria" | "user_id">) => void;
  updateGasto: (id: string, g: Partial<Gasto>) => void;
  deleteGasto: (id: string) => void;
  addRenda: (r: Omit<Renda, "id" | "created_at" | "user_id">) => void;
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

const DEFAULT_CATEGORIAS: Omit<Categoria, "id" | "created_at" | "user_id">[] = [
  { nome: "Cartao de Credito", tipo: "gasto", icone: "credit_card", cor: "#ef4444" },
  { nome: "Agua", tipo: "gasto", icone: "water_drop", cor: "#3b82f6" },
  { nome: "Gas", tipo: "gasto", icone: "local_fire_department", cor: "#f59e0b" },
  { nome: "Energia", tipo: "gasto", icone: "bolt", cor: "#eab308" },
  { nome: "Financiamentos", tipo: "gasto", icone: "account_balance", cor: "#8b5cf6" },
  { nome: "Carro", tipo: "gasto", icone: "directions_car", cor: "#14b8a6" },
  { nome: "Apartamento", tipo: "gasto", icone: "home", cor: "#f97316" },
  { nome: "Salario 1", tipo: "renda", icone: "payments", cor: "#22c55e" },
  { nome: "Salario 2", tipo: "renda", icone: "savings", cor: "#16a34a" },
  { nome: "Trabalho Extra", tipo: "renda", icone: "trending_up", cor: "#06b6d4" },
];

function getDefaultData(): FinanceData {
  return {
    categorias: DEFAULT_CATEGORIAS.map((c) => ({
      ...c,
      id: uuid(),
      user_id: "",
      created_at: new Date().toISOString(),
    })),
    gastos: [],
    renda: [],
  };
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return !!url && url !== "sua_url_aqui" && url !== "https://placeholder.supabase.co";
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<FinanceData>(getDefaultData);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase or localStorage
  useEffect(() => {
    if (!user) {
      setData(getDefaultData());
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      loadFromSupabase(user.id);
    } else {
      loadFromLocalStorage(user.id);
    }
  }, [user]);

  async function loadFromSupabase(userId: string) {
    setLoading(true);
    try {
      const [catRes, gastosRes, rendaRes] = await Promise.all([
        supabase.from("categorias").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
        supabase.from("gastos").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
        supabase.from("renda").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      ]);

      const cats = catRes.data || [];
      const rawGastos = (gastosRes.data || []) as Partial<Gasto>[];
      const gastos: Gasto[] = rawGastos.map((g) => ({
        id: g.id || "",
        user_id: g.user_id || "",
        categoria_id: g.categoria_id || "",
        descricao: g.descricao || "",
        valor: g.valor || 0,
        data: g.data || "",
        periodicidade: g.periodicidade || "mensal",
        pago: (g as Record<string, unknown>).pago === true,
        created_at: g.created_at || "",
      }));
      const renda = rendaRes.data || [];

      if (cats.length === 0) {
        const defaultCats = DEFAULT_CATEGORIAS.map((c) => ({
          ...c,
          user_id: userId,
        }));
        const { data: inserted } = await supabase.from("categorias").insert(defaultCats).select();
        setData({ categorias: inserted || [], gastos, renda });
      } else {
        setData({ categorias: cats, gastos, renda });
      }
    } catch {
      setData(getDefaultData());
    }
    setLoading(false);
  }

  function loadFromLocalStorage(userId: string) {
    const saved = localStorage.getItem(`pf_data_${userId}`);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData(getDefaultData());
    }
    setLoading(false);
  }

  // Save to localStorage when Supabase is not configured
  useEffect(() => {
    if (!user || loading) return;
    if (!isSupabaseConfigured()) {
      localStorage.setItem(`pf_data_${user.id}`, JSON.stringify(data));
    }
  }, [data, user, loading]);

  const addCategoria = useCallback(
    async (c: Omit<Categoria, "id" | "created_at" | "user_id">) => {
      if (!user) return;
      if (isSupabaseConfigured()) {
        const { data: inserted, error } = await supabase
          .from("categorias")
          .insert({ ...c, user_id: user.id })
          .select()
          .single();
        if (!error && inserted) {
          setData((prev) => ({ ...prev, categorias: [...prev.categorias, inserted] }));
        }
      } else {
        const nova: Categoria = {
          ...c,
          id: uuid(),
          user_id: user.id,
          created_at: new Date().toISOString(),
        };
        setData((prev) => ({ ...prev, categorias: [...prev.categorias, nova] }));
      }
    },
    [user]
  );

  const updateCategoria = useCallback(
    async (id: string, c: Partial<Categoria>) => {
      if (isSupabaseConfigured()) {
        await supabase.from("categorias").update(c).eq("id", id);
      }
      setData((prev) => ({
        ...prev,
        categorias: prev.categorias.map((cat) =>
          cat.id === id ? { ...cat, ...c } : cat
        ),
      }));
    },
    []
  );

  const deleteCategoria = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured()) {
        await supabase.from("gastos").delete().eq("categoria_id", id);
        await supabase.from("categorias").delete().eq("id", id);
      }
      setData((prev) => ({
        ...prev,
        categorias: prev.categorias.filter((cat) => cat.id !== id),
        gastos: prev.gastos.filter((g) => g.categoria_id !== id),
      }));
    },
    []
  );

  const addGasto = useCallback(
    async (g: Omit<Gasto, "id" | "created_at" | "categoria" | "user_id">) => {
      if (!user) return;
      if (isSupabaseConfigured()) {
        const { data: inserted, error } = await supabase
          .from("gastos")
          .insert({ ...g, user_id: user.id })
          .select()
          .single();
        if (!error && inserted) {
          setData((prev) => ({ ...prev, gastos: [...prev.gastos, inserted] }));
        }
      } else {
        const novo: Gasto = {
          ...g,
          id: uuid(),
          user_id: user.id,
          created_at: new Date().toISOString(),
        };
        setData((prev) => ({ ...prev, gastos: [...prev.gastos, novo] }));
      }
    },
    [user]
  );

  const updateGasto = useCallback(
    async (id: string, g: Partial<Gasto>) => {
      if (isSupabaseConfigured()) {
        await supabase.from("gastos").update(g).eq("id", id);
      }
      setData((prev) => ({
        ...prev,
        gastos: prev.gastos.map((gasto) =>
          gasto.id === id ? { ...gasto, ...g } : gasto
        ),
      }));
    },
    []
  );

  const deleteGasto = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured()) {
        await supabase.from("gastos").delete().eq("id", id);
      }
      setData((prev) => ({
        ...prev,
        gastos: prev.gastos.filter((g) => g.id !== id),
      }));
    },
    []
  );

  const addRenda = useCallback(
    async (r: Omit<Renda, "id" | "created_at" | "user_id">) => {
      if (!user) return;
      if (isSupabaseConfigured()) {
        const { data: inserted, error } = await supabase
          .from("renda")
          .insert({ ...r, user_id: user.id })
          .select()
          .single();
        if (!error && inserted) {
          setData((prev) => ({ ...prev, renda: [...prev.renda, inserted] }));
        }
      } else {
        const nova: Renda = {
          ...r,
          id: uuid(),
          user_id: user.id,
          created_at: new Date().toISOString(),
        };
        setData((prev) => ({ ...prev, renda: [...prev.renda, nova] }));
      }
    },
    [user]
  );

  const updateRenda = useCallback(
    async (id: string, r: Partial<Renda>) => {
      if (isSupabaseConfigured()) {
        await supabase.from("renda").update(r).eq("id", id);
      }
      setData((prev) => ({
        ...prev,
        renda: prev.renda.map((rend) =>
          rend.id === id ? { ...rend, ...r } : rend
        ),
      }));
    },
    []
  );

  const deleteRenda = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured()) {
        await supabase.from("renda").delete().eq("id", id);
      }
      setData((prev) => ({
        ...prev,
        renda: prev.renda.filter((r) => r.id !== id),
      }));
    },
    []
  );

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
        loading,
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
