import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Categoria {
  id: string;
  nome: string;
  tipo: "gasto" | "renda";
  icone: string;
  cor: string;
  created_at: string;
}

export interface Gasto {
  id: string;
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
  tipo: "salario1" | "salario2" | "extra";
  descricao: string;
  valor: number;
  data: string;
  created_at: string;
}
