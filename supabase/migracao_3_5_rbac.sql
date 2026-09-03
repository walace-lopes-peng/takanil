-- ==============================================================================
-- CONTROLE DE ACESSO BASEADO EM FUNÇÕES (RBAC) - MUDANÇAS DE SEGURANÇA
-- ==============================================================================

-- ==========================
-- TABELA: ANIMAIS
-- ==========================

-- 1. Remover políticas perigosas antigas
DROP POLICY IF EXISTS "Permitir exclusão de animais" ON public.animais;
DROP POLICY IF EXISTS "Permitir exclusão pública de animais" ON public.animais;
DROP POLICY IF EXISTS "Permitir delete de animais" ON public.animais;

-- 2. Restringir DELETE na tabela animais apenas para administradoras/devs
CREATE POLICY "Exclusao apenas para adms" 
ON public.animais
FOR DELETE 
TO authenticated
USING (
    (SELECT papel FROM public.perfis WHERE id = auth.uid()) IN ('adm', 'dev')
);

-- 3. Restringir UPDATE na tabela animais apenas para administradoras/devs
-- Isso impede que uma voluntária edite o status de um animal para aprovado por conta própria
DROP POLICY IF EXISTS "Permitir atualizacao de animais" ON public.animais;

CREATE POLICY "Atualizacao apenas para adms" 
ON public.animais
FOR UPDATE 
TO authenticated
USING (
    (SELECT papel FROM public.perfis WHERE id = auth.uid()) IN ('adm', 'dev')
);

-- ==========================
-- TABELA: FINANCAS
-- ==========================

-- 4. Finanças: Acesso restrito
-- A tabela financas inteira não deve ser lida nem escrita por voluntárias
DROP POLICY IF EXISTS "Leitura de finanças" ON public.financas;
DROP POLICY IF EXISTS "Inserção de finanças" ON public.financas;
DROP POLICY IF EXISTS "Exclusão de finanças" ON public.financas;
DROP POLICY IF EXISTS "Atualização de finanças" ON public.financas;
DROP POLICY IF EXISTS "Permitir leitura de financas" ON public.financas;
DROP POLICY IF EXISTS "Permitir inserção de financas" ON public.financas;

-- Habilitar RLS se não estiver
ALTER TABLE public.financas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total as financas para adms"
ON public.financas
FOR ALL
TO authenticated
USING (
    (SELECT papel FROM public.perfis WHERE id = auth.uid()) IN ('adm', 'dev')
);
