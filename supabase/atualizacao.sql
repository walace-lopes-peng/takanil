-- Comandos para corrigir o erro de RLS no Storage e atualizar a tabela animais

-- 1. Liberar o Upload Público no Bucket 'animais' (corrige o erro de "new row violates row-level security policy")
INSERT INTO storage.buckets (id, name, public) VALUES ('animais', 'animais', true) ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Permitir leitura pública no bucket animais" ON storage.objects
FOR SELECT USING (bucket_id = 'animais');

CREATE POLICY "Permitir upload público no bucket animais" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'animais');

-- 2. Adicionar o novo campo de "Localização/Situação" na tabela animais já existente
ALTER TABLE public.animais 
ADD COLUMN localizacao TEXT NOT NULL DEFAULT 'Abrigo Takanil' 
CHECK (localizacao IN ('Abrigo Takanil', 'Lar Temporário / Terceiros', 'Desaparecido / Rua'));

-- 3. Atualizar a restrição de "status" (remover o desaparecido, deixando apenas Disponível e Adotado)
ALTER TABLE public.animais DROP CONSTRAINT animais_status_check;
ALTER TABLE public.animais ADD CONSTRAINT animais_status_check CHECK (status IN ('Disponível', 'Adotado'));
