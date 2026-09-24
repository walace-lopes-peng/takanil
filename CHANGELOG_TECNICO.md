# 🛠️ Changelog Técnico & Histórico de Builds — Hub Takanil

Documento interno de rastreabilidade de engenharia de software. Enquanto o `RELEASE_NOTES.md` comunica valor para o usuário final (voluntárias da ONG), este arquivo registra os detalhes técnicos de cada versão, build e patch: causas raízes de bugs, decisões de código, arquivos modificados, PRs/Commits associados e testes validados.

---

## 📌 Guia de Estrutura para Novas Entradas

Toda nova entrega de versão ou build de patch deve registrar:
- **Versão:** Número SemVer (`MAJOR.MINOR.PATCH`).
- **Data & Tipo:** Feature (Minor), Bugfix/Patch (Patch), Hotfix, Refatoração, etc.
- **PR & Commit:** Links e identificadores do Git/GitHub.
- **Arquivos Modificados:** Lista dos módulos tocados.
- **Causa Raiz & Contexto:** O que causou o problema ou motivou a alteração.
- **Solução Técnica Implementada:** Como a alteração foi desenhada no código.
- **Validação & Testes:** Comandos e verificações manuais executadas.

---

## [0.12.1] — 24/09/2026 (Hotfix: RLS piloto.animais + Porta Dev Fixada)

- **Tipo:** Patch / Hotfix de Infraestrutura
- **Branch:** `hotfix/rls-piloto-animais` | **PR:** *(a ser aberto)* | **Issue Fechada:** *(N/A — hotfix direto)*
- **Arquivos Modificados / Criados:**
  - `supabase/schema_piloto.sql` (adição de 6 colunas ausentes em `piloto.animais` e reescrita das políticas RLS)
  - `supabase/migracao_hotfix_rls_piloto.sql` (script SQL de migração/hotfix para rodar no Dashboard do Supabase)
  - `astro.config.mjs` (fixação da porta do servidor de desenvolvimento para `4325`)
  - `package.json` (script `dev` com `--port 4325`; bump de versão para `0.12.1`)
  - `src/components/FormularioAnimal.astro` (correção de typo "Animaequipel" na mensagem de sucesso)
  - `src/data/novidades.ts` (nova constante `VERSAO_NOVIDADES` com versão MAJOR.MINOR — desacopla patches do controle de re-exibição do modal)
  - `src/components/ModalNovidades.astro` (localStorage usa `VERSAO_NOVIDADES` em vez de `VERSAO_ATUAL` — patches não reabrem o modal para usuárias)

- **Causa Raiz & Contexto:**
  - **RLS:** O schema `piloto` divergiu do schema `public` ao longo do desenvolvimento. As 6 colunas (`castrado`, `vacinado`, `sexo`, `quantidade`, `situacao_urgencia`, `temperamento`) foram adicionadas ao `public` mas **nunca propagadas para `piloto`**. Além disso, a política RLS `"Permitir inserção de animais"` permitia apenas `status_moderacao = 'pendente'`, bloqueando o painel autenticado que persiste registros com status `'aprovado'`.
  - **Porta:** O projeto `barber-in` rodando em paralelo ocupava a porta padrão 3000/4321, impedindo rodar dois projetos simultaneamente.
  - **Schema Drift:** Ausência de um fluxo obrigatório de migrations versionadas (`supabase migration new`) fez com que alterações manuais em `public` nunca fossem automaticamente replicadas em `piloto`.

- **Solução Técnica Implementada:**
  1. **RLS — DROP + CREATE das políticas:** Removidas políticas antigas restritivas e criadas duas novas: `"Insercao publica (apenas pendente)"` para `anon` (visitantes) e `"Insercao autenticada"` para `authenticated` (admins), que aceita todos os status válidos. Políticas de `UPDATE` e `DELETE` também foram criadas para `authenticated`.
  2. **Colunas ausentes:** Adicionados os `ALTER TABLE piloto.animais ADD COLUMN IF NOT EXISTS …` para os 6 campos faltantes, com os mesmos tipos e defaults do `public`.
  3. **Script de migração:** `supabase/migracao_hotfix_rls_piloto.sql` consolida todos os passos DDL + RLS para execução manual via Dashboard → SQL Editor. Inclui `NOTIFY pgrst, 'reload schema'` para forçar o PostgREST a recarregar o schema cache imediatamente.
  4. **Porta:** Adicionado `server: { port: 4325, host: true }` em `astro.config.mjs` e `--port 4325` no script `dev` do `package.json`.

- **Validação & Testes:**
  - `npm run build` executado sem erros após as mudanças.
  - Script SQL revisado manualmente linha a linha para confirmar idempotência (uso de `IF NOT EXISTS` e `DROP POLICY IF EXISTS`).
  - ⚠️ **Pendente:** Aplicação do script no Dashboard do Supabase (ambiente `piloto`) e validação manual do fluxo de cadastro de animal como usuária autenticada.

- **Prevenção de Reincidência:**
  - Ver seção **"Governança de Schema — Regras de Ouro"** no `ARQUITETURA_E_DECISOES.md` (adicionada neste patch).
  - Resumo: toda DDL em `public` deve ser imediatamente acompanhada de DDL idêntica em `piloto` via script de migration versionado.

---

## [0.12.0] — 22/09/2026 (Ficha Detalhada, Status com Desfazer & WhatsApp Contextual)

- **Tipo:** Minor Release (Novas Funcionalidades e Melhorias de Experiência)
- **PR:** #132 (mergeado via squash) | **Issue Fechada:** #116
- **Arquivos Modificados / Criados:**
  - `src/components/ModalFichaAnimal.astro` (novo componente de ficha modal completa)
  - `src/lib/whatsappContextual.ts` e `src/lib/whatsappContextual.test.ts` (geração de mensagens contextuais, suporte a ninhadas e Web Share API)
  - `src/components/Toast.astro` (suporte a botões de ação injetáveis com callbacks)
  - `src/pages/index.astro` (menu de status rápido com botão "Desfazer", catálogo integrado mantendo adotados visíveis, badges compactas em linha única, botão `Ficha →` em texto limpo e botão WhatsApp integrado)
  - `src/data/novidades.ts` e `RELEASE_NOTES.md` (atualização das notas centradas no usuário)
  - `package.json` (sincronização de versão para `0.12.0`)
- **Principais Decisões Técnicas:**
  1. **Ficha Detalhada Modular:** Criado o componente `ModalFichaAnimal.astro` separado do `index.astro`, permitindo que o visitante veja todos os dados clínicos (castração, vacinas tomadas), histórico do pet e acione contato direto com a ONG no WhatsApp sem poluir os cards da vitrine.
  2. **Menu Rápido com Ação de Desfazer (Optimistic Undo):** Em vez de exibir popups de confirmação (`window.confirm`) a cada alteração de status de um animal (adotado, urgência, óbito), o status é alterado imediatamente e uma notificação de Toast fica disponível por 5 segundos com botão `[Desfazer]`, restaurando o estado anterior em caso de toque acidental no celular.
  3. **Catálogo Integrado de Adotados:** Animais adotados continuam visíveis na tela inicial identificados com o badge verde `[✅ Adotado]`, eliminando a percepção de que o animal "desapareceu do banco de dados", mantendo o filtro de coração para isolar os Finais Felizes.
  4. **WhatsApp Contextual para Ninhadas e Urgências:** Funções puras em `whatsappContextual.ts` com concordância gramatical dinâmica para filhotes individuais vs. ninhadas coletivas e mensagens adaptadas para resgates urgentes.
  5. **Refinamento de Usabilidade Mobile e Cards:**
     - Toque na foto do pet agora abre diretamente a Ficha Detalhada (a ampliação em tela cheia permanece na lupa `[ 🔍 ]`).
     - Badges de urgência (`🔍 Desaparecido`, `🏠 Voltou p/ Tutor`) formatadas com `whitespace-nowrap inline-flex` para evitar quebras desengonçadas em 2 colunas no celular.
     - Botão do rodapé simplificado como link de texto verde limpo `Ficha →`, sem container pesado.
     - Botão do WhatsApp destacado em container verde esmeralda compacto (`34px × 34px`) com espaçamento perfeitamente simétrico de 12px (`p-3`) nas bordas inferior e laterais do card.
- **Validação & Testes:**
  - 11 testes unitários em `whatsappContextual.test.ts`.
  - 11 testes unitários em `geradorLegenda.test.ts`.
  - 6 testes unitários em `filtrosData.test.ts`.
  - `npm run build`: 0 erros, 0 avisos, 7 páginas estáticas geradas com sucesso.
