-- ==============================================================================
-- Schema Piloto (Produção) — Hub Takanil (Supabase / PostgreSQL)
-- ==============================================================================
-- Este script cria o schema 'piloto' no PostgreSQL para isolar os dados reais da
-- ONG dos dados de desenvolvimento/testes locais mantidos no schema 'public'.
-- ==============================================================================

-- 1. Criação do Schema
CREATE SCHEMA IF NOT EXISTS piloto;

-- 2. Concessão de Privilégios para as Roles do Supabase
GRANT USAGE ON SCHEMA piloto TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA piloto TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA piloto TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA piloto TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA piloto GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA piloto GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA piloto GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 3. Tabela: perfis
CREATE TABLE IF NOT EXISTS piloto.perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    papel TEXT NOT NULL CHECK (papel IN ('dev', 'adm', 'voluntaria')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em perfis
ALTER TABLE piloto.perfis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura do próprio perfil" ON piloto.perfis;
CREATE POLICY "Permitir leitura do próprio perfil" ON piloto.perfis
    FOR SELECT USING (auth.uid() = id);

-- 4. Tabela: animais
CREATE TABLE IF NOT EXISTS piloto.animais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    especie TEXT NOT NULL CHECK (especie IN ('Cão', 'Gato')),
    fase_vida TEXT NOT NULL CHECK (fase_vida IN ('Filhote', 'Adulto', 'Idoso')),
    peso NUMERIC NOT NULL CHECK (peso > 0),
    imagem_url TEXT,
    localizacao TEXT NOT NULL DEFAULT 'Abrigo Takanil' CHECK (localizacao IN ('Abrigo Takanil', 'Na rua', 'Lar Temporário', 'Casa de terceiros', 'Desaparecido', 'Lar Temporário / Terceiros', 'Desaparecido / Rua')),
    status TEXT NOT NULL DEFAULT 'Disponível' CHECK (status IN ('Disponível', 'Adotado')),
    criado_por UUID REFERENCES piloto.perfis(id),
    status_moderacao TEXT NOT NULL DEFAULT 'pendente' CHECK (status_moderacao IN ('pendente', 'aprovado', 'rejeitado')),
    situacao_urgencia TEXT DEFAULT 'Nenhuma',
    quantidade INTEGER DEFAULT 1,
    castrado TEXT DEFAULT 'Não sei',
    vacinado TEXT DEFAULT 'Não sei',
    temperamento TEXT DEFAULT 'Não informado',
    sexo TEXT DEFAULT 'Não sei',
    instagram_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em animais
ALTER TABLE piloto.animais ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de animais aprovados" ON piloto.animais;
CREATE POLICY "Leitura pública de animais aprovados" ON piloto.animais
    FOR SELECT USING (status_moderacao = 'aprovado');

DROP POLICY IF EXISTS "Leitura autenticada total" ON piloto.animais;
CREATE POLICY "Leitura autenticada total" ON piloto.animais
    FOR SELECT USING (auth.role() = 'authenticated');

-- Inserção pública (anônima): somente como pendente
DROP POLICY IF EXISTS "Permitir inserção de animais" ON piloto.animais;
DROP POLICY IF EXISTS "Insercao publica (apenas pendente)" ON piloto.animais;
CREATE POLICY "Insercao publica (apenas pendente)" ON piloto.animais
    FOR INSERT 
    TO anon
    WITH CHECK (status_moderacao = 'pendente');

-- Inserção autenticada: administradoras/devs podem salvar direto como aprovado
DROP POLICY IF EXISTS "Insercao autenticada" ON piloto.animais;
CREATE POLICY "Insercao autenticada" ON piloto.animais
    FOR INSERT
    TO authenticated
    WITH CHECK (status_moderacao IN ('pendente', 'aprovado', 'rejeitado'));

DROP POLICY IF EXISTS "Permitir atualização de animais" ON piloto.animais;
CREATE POLICY "Permitir atualização de animais" ON piloto.animais
    FOR UPDATE 
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir exclusão de animais" ON piloto.animais;
CREATE POLICY "Permitir exclusão de animais" ON piloto.animais
    FOR DELETE 
    TO authenticated
    USING (auth.role() = 'authenticated');

-- 5. Tabela: financas
CREATE TABLE IF NOT EXISTS piloto.financas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL CHECK (tipo IN ('Entrada', 'Saída')),
    valor NUMERIC NOT NULL CHECK (valor > 0),
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em financas
ALTER TABLE piloto.financas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura pública de finanças" ON piloto.financas;
CREATE POLICY "Permitir leitura pública de finanças" ON piloto.financas
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção de finanças" ON piloto.financas;
CREATE POLICY "Permitir inserção de finanças" ON piloto.financas
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de finanças" ON piloto.financas;
CREATE POLICY "Permitir atualização de finanças" ON piloto.financas
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir exclusão de finanças" ON piloto.financas;
CREATE POLICY "Permitir exclusão de finanças" ON piloto.financas
    FOR DELETE USING (true);

-- 6. Tabela: associados (Controle de Mensalistas e Apoiadores)
CREATE TABLE IF NOT EXISTS piloto.associados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    valor_mensalidade NUMERIC(10, 2) NOT NULL CHECK (valor_mensalidade > 0),
    dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    whatsapp TEXT,
    instagram TEXT,
    ultimo_pagamento DATE,
    ativo BOOLEAN NOT NULL DEFAULT true,
    observacoes TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE piloto.associados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total associados autenticados" ON piloto.associados;
CREATE POLICY "Acesso total associados autenticados" ON piloto.associados
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

