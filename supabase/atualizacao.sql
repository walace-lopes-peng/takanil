-- ==============================================================================
-- SCRIPT DE CORREÇÃO DEFINITIVO DE PERMISSÕES DO STORAGE NO SUPABASE
-- ==============================================================================

-- 1. Garante que o bucket 'animais' existe e está público
INSERT INTO storage.buckets (id, name, public) 
VALUES ('animais', 'animais', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Limpa qualquer política antiga com conflito
DROP POLICY IF EXISTS "Permitir leitura pública no bucket animais" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload público no bucket animais" ON storage.objects;
DROP POLICY IF EXISTS "Give anon full access to bucket animais" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow all for bucket animais" ON storage.objects;

-- 3. Cria uma política permissiva total para o bucket 'animais'
-- Permite leitura, upload e remoção tanto para anon quanto autenticados
CREATE POLICY "Allow all for bucket animais" 
ON storage.objects
FOR ALL 
TO public
USING (bucket_id = 'animais') 
WITH CHECK (bucket_id = 'animais');
