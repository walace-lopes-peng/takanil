-- Schema para o Hub Takanil (Supabase / PostgreSQL)

-- Habilitar a extensão UUID (caso ainda não esteja habilitada por padrão)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela: animais
CREATE TABLE public.animais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    especie TEXT NOT NULL CHECK (especie IN ('Cão', 'Gato')),
    fase_vida TEXT NOT NULL CHECK (fase_vida IN ('Filhote', 'Adulto', 'Idoso')),
    peso NUMERIC NOT NULL CHECK (peso > 0),
    imagem_url TEXT,
    localizacao TEXT NOT NULL DEFAULT 'Abrigo Takanil' CHECK (localizacao IN ('Abrigo Takanil', 'Lar Temporário / Terceiros', 'Desaparecido / Rua')),
    status TEXT NOT NULL DEFAULT 'Disponível' CHECK (status IN ('Disponível', 'Adotado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) para a tabela animais
ALTER TABLE public.animais ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para 'animais'
-- (Para esta fase inicial do MVP, permitiremos leitura pública e inserção pública/autenticada)
CREATE POLICY "Permitir leitura pública de animais" ON public.animais
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de animais" ON public.animais
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Permitir atualização de animais" ON public.animais
    FOR UPDATE USING (true);

-- 2. Tabela: financas (Criada vazia para a Fase 2)
CREATE TABLE public.financas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL CHECK (tipo IN ('Entrada', 'Saída')),
    valor NUMERIC NOT NULL CHECK (valor > 0),
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) para a tabela financas
ALTER TABLE public.financas ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para 'financas'
CREATE POLICY "Permitir leitura pública de finanças" ON public.financas
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de finanças" ON public.financas
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Permitir atualização de finanças" ON public.financas
    FOR UPDATE USING (true);

-- Nota: Como ainda não configuramos a Autenticação no painel,
-- estamos permitindo inserções de forma genérica. Na versão final para produção,
-- devemos restringir INSERT/UPDATE apenas para usuários logados (auth.role() = 'authenticated').
