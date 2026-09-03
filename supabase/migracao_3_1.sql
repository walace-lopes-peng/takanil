-- 1. Criar tabela perfis
CREATE TABLE public.perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    papel TEXT NOT NULL CHECK (papel IN ('dev', 'adm', 'voluntaria')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura do próprio perfil" ON public.perfis
    FOR SELECT USING (auth.uid() = id);

-- 2. Adicionar colunas na tabela animais (com default pendente)
ALTER TABLE public.animais 
  ADD COLUMN criado_por UUID REFERENCES public.perfis(id),
  ADD COLUMN status_moderacao TEXT NOT NULL DEFAULT 'pendente' CHECK (status_moderacao IN ('pendente', 'aprovado', 'rejeitado'));

-- 3. Recriar as políticas RLS de animais
DROP POLICY IF EXISTS "Permitir leitura pública de animais" ON public.animais;
DROP POLICY IF EXISTS "Permitir inserção de animais" ON public.animais;

CREATE POLICY "Leitura pública de animais aprovados" ON public.animais
    FOR SELECT USING (status_moderacao = 'aprovado');

CREATE POLICY "Leitura autenticada total" ON public.animais
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção de animais (sempre pendente)" ON public.animais
    FOR INSERT WITH CHECK (status_moderacao = 'pendente');
