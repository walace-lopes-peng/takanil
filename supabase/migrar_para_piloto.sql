-- ==============================================================================
-- Script de Migração de Dados: public -> piloto — Hub Takanil
-- ==============================================================================
-- Este script copia registros existentes do schema 'public' para o schema 'piloto'.
-- É uma operação idempotente (ON CONFLICT DO NOTHING), evitando duplicações.
-- ==============================================================================

-- 1. Migrar Perfis
INSERT INTO piloto.perfis (id, papel, created_at)
SELECT id, papel, created_at
FROM public.perfis
ON CONFLICT (id) DO UPDATE 
SET papel = EXCLUDED.papel;

-- 2. Migrar Animais
INSERT INTO piloto.animais (
    id, nome, especie, fase_vida, peso, imagem_url,
    localizacao, status, criado_por, status_moderacao,
    instagram_url, created_at
)
SELECT 
    id, nome, especie, fase_vida, peso, imagem_url,
    localizacao, status, criado_por, status_moderacao,
    instagram_url, created_at
FROM public.animais
ON CONFLICT (id) DO NOTHING;

-- 3. Migrar Finanças
INSERT INTO piloto.financas (
    id, tipo, valor, descricao, categoria, data, created_at
)
SELECT 
    id, tipo, valor, descricao, categoria, data, created_at
FROM public.financas
ON CONFLICT (id) DO NOTHING;
