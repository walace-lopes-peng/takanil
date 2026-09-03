-- ==============================================================================
-- LIBERAR PERMISSÃO DE DELETE NA TABELA 'animais'
-- ==============================================================================

-- Remove políticas antigas de DELETE se houver
DROP POLICY IF EXISTS "Permitir exclusão pública de animais" ON public.animais;
DROP POLICY IF EXISTS "Permitir delete de animais" ON public.animais;

-- Cria política permitindo exclusão de registros na tabela animais
CREATE POLICY "Permitir exclusão de animais" 
ON public.animais
FOR DELETE 
TO public
USING (true);
