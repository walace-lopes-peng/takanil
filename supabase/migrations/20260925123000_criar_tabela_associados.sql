-- ==============================================================================
-- MIGRATION: Criação da Tabela de Associados (Hub Takanil)
-- Data: 2026-09-25
-- Paridade Obrigatória: Executada tanto para 'public' (dev) quanto 'piloto' (prod)
-- ==============================================================================

-- 1. Criação no schema 'public'
CREATE TABLE IF NOT EXISTS public.associados (
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

ALTER TABLE public.associados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total associados autenticados" ON public.associados;
CREATE POLICY "Acesso total associados autenticados" ON public.associados
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Criação no schema 'piloto' (Produção)
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

-- 3. Forçar recarga imediata do schema cache do PostgREST
NOTIFY pgrst, 'reload schema';
