import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || url === "sua_url_aqui") {
    return createClient("https://placeholder.supabase.co", "placeholder");
  }
  _supabase = createClient(url, key);
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export interface Categoria {
  id: string;
  user_id: string;
  nome: string;
  tipo: "gasto" | "renda";
  icone: string;
  cor: string;
  created_at: string;
}

export interface Gasto {
  id: string;
  user_id: string;
  categoria_id: string;
  descricao: string;
  valor: number;
  data: string;
  periodicidade: "semanal" | "mensal" | "anual";
  created_at: string;
  categoria?: Categoria;
}

export interface Renda {
  id: string;
  user_id: string;
  tipo: "salario1" | "salario2" | "extra";
  descricao: string;
  valor: number;
  data: string;
  created_at: string;
}
