-- 1. Remover a política restritiva anterior (que forçava tudo a ser pendente)
DROP POLICY IF EXISTS "Permitir inserção de animais (sempre pendente)" ON public.animais;

-- 2. Criar política para o público geral (formulário público sem conta)
-- O público SÓ PODE inserir se o status for 'pendente'
CREATE POLICY "Insercao publica (apenas pendente)" ON public.animais
    FOR INSERT 
    TO anon
    WITH CHECK (status_moderacao = 'pendente');

-- 3. Criar política para administradoras logadas
-- Administradoras podem inserir tanto 'aprovado' (direto na vitrine) quanto 'pendente'
CREATE POLICY "Insercao autenticada" ON public.animais
    FOR INSERT
    TO authenticated
    WITH CHECK (status_moderacao IN ('pendente', 'aprovado', 'rejeitado'));
