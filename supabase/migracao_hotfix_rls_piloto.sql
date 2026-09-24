-- ==============================================================================
-- HOTFIX: Correção de RLS (Row Level Security) em piloto.animais
-- ==============================================================================
-- Problema: A política antiga em piloto.animais só permitia status_moderacao = 'pendente',
-- gerando erro de RLS quando uma usuária logada tenta salvar um animal ('aprovado').
-- ==============================================================================

-- 1. Remover a política restritiva anterior
DROP POLICY IF EXISTS "Permitir inserção de animais" ON piloto.animais;
DROP POLICY IF EXISTS "Insercao publica (apenas pendente)" ON piloto.animais;
DROP POLICY IF EXISTS "Insercao autenticada" ON piloto.animais;

-- 2. Formulário público (anon): visitantes só podem sugerir com status 'pendente'
CREATE POLICY "Insercao publica (apenas pendente)" ON piloto.animais
    FOR INSERT 
    TO anon
    WITH CHECK (status_moderacao = 'pendente');

-- 3. Painel autenticado (authenticated): administradoras podem salvar direto como 'aprovado'
CREATE POLICY "Insercao autenticada" ON piloto.animais
    FOR INSERT
    TO authenticated
    WITH CHECK (status_moderacao IN ('pendente', 'aprovado', 'rejeitado'));

-- 4. Garantir permissões de UPDATE e DELETE para autenticados
DROP POLICY IF EXISTS "Permitir atualização de animais" ON piloto.animais;
CREATE POLICY "Permitir atualização de animais" ON piloto.animais
    FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir exclusão de animais" ON piloto.animais;
CREATE POLICY "Permitir exclusão de animais" ON piloto.animais
    FOR DELETE
    TO authenticated
    USING (true);

-- 5. Força recarga imediata do schema cache do PostgREST
NOTIFY pgrst, 'reload schema';
