-- =====================================================
-- PLANEJAMENTO FINANCEIRO - Schema do Supabase
-- =====================================================
-- Execute este SQL no editor do Supabase (SQL Editor)
-- para criar as tabelas necessárias.

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('gasto', 'renda')),
  icone TEXT DEFAULT 'category',
  cor TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de gastos
CREATE TABLE IF NOT EXISTS gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor NUMERIC(10, 2) NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  periodicidade TEXT NOT NULL CHECK (periodicidade IN ('semanal', 'mensal', 'anual')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de renda
CREATE TABLE IF NOT EXISTS renda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('salario1', 'salario2', 'extra')),
  descricao TEXT NOT NULL,
  valor NUMERIC(10, 2) NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE renda ENABLE ROW LEVEL SECURITY;

-- Políticas per-user: cada usuário só vê/edita seus próprios dados
CREATE POLICY "select_own_categorias" ON categorias FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_categorias" ON categorias FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_categorias" ON categorias FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_categorias" ON categorias FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "select_own_gastos" ON gastos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_gastos" ON gastos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_gastos" ON gastos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_gastos" ON gastos FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "select_own_renda" ON renda FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_renda" ON renda FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_renda" ON renda FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_renda" ON renda FOR DELETE USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_categorias_user ON categorias(user_id);
CREATE INDEX IF NOT EXISTS idx_gastos_user ON gastos(user_id);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_gastos_data ON gastos(data);
CREATE INDEX IF NOT EXISTS idx_renda_user ON renda(user_id);
CREATE INDEX IF NOT EXISTS idx_renda_data ON renda(data);
CREATE INDEX IF NOT EXISTS idx_renda_tipo ON renda(tipo);
