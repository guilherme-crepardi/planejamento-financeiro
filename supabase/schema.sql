-- =====================================================
-- PLANEJAMENTO FINANCEIRO - Schema do Supabase
-- =====================================================
-- Execute este SQL no editor do Supabase (SQL Editor)
-- para criar as tabelas necessárias.

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('gasto', 'renda')),
  icone TEXT DEFAULT '💰',
  cor TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de gastos
CREATE TABLE IF NOT EXISTS gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Políticas permissivas (para uso sem autenticação por enquanto)
-- IMPORTANTE: Para produção, implemente autenticação e ajuste estas políticas
CREATE POLICY "Allow all operations on categorias" ON categorias FOR ALL USING (true);
CREATE POLICY "Allow all operations on gastos" ON gastos FOR ALL USING (true);
CREATE POLICY "Allow all operations on renda" ON renda FOR ALL USING (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_gastos_data ON gastos(data);
CREATE INDEX IF NOT EXISTS idx_renda_data ON renda(data);
CREATE INDEX IF NOT EXISTS idx_renda_tipo ON renda(tipo);
