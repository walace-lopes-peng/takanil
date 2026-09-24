# Arquitetura e DecisÃµes (Hub Takanil)

Este arquivo serve como um registro contÃ­nuo e vivo (ADR - Architecture Decision Record) das decisÃµes arquiteturais tomadas durante o desenvolvimento do projeto **Hub Takanil**.

O projeto tem um papel duplo: Ã© um sistema real e funcional para a ONG e tambÃ©m uma ferramenta de **aprendizado em CiÃªncia da ComputaÃ§Ã£o**. Portanto, as decisÃµes aqui documentadas seguem o **Modo Mentor TÃ©cnico**, explicando o _porquÃª_ profundo de cada escolha.

---

## Estrutura do Documento

Cada nova decisÃ£o arquitetural ou tÃ©cnica importante deve ser adicionada abaixo, seguindo a estrutura:

1. **Contexto:** Qual o problema a ser resolvido?
2. **DecisÃ£o:** O que foi escolhido e implementado?
3. **Por quÃª? (Justificativa DidÃ¡tica):** A lÃ³gica por trÃ¡s da decisÃ£o. Como o mercado aplica isso? Quais eram as alternativas?
4. **PrÃ©-requisitos de Estudo:** O que um desenvolvedor precisa entender para dominar essa soluÃ§Ã£o?

---

## Registro de DecisÃµes

### 1. A Stack Principal (Astro + Tailwind + Supabase)
* **Data:** Setembro de 2026
* **Contexto:** Necessidade de construir um PWA leve e rÃ¡pido para as voluntÃ¡rias usarem via celular, sem complicaÃ§Ãµes operacionais.
* **DecisÃ£o:** Foi definido o uso de **Astro** para o frontend e roteamento, **Tailwind CSS** para estilizaÃ§Ã£o utilitÃ¡ria e **Supabase** como BaaS (Backend as a Service - PostgreSQL + Storage). O estado da aplicaÃ§Ã£o deve ser gerenciado de forma local e simples, sem Redux ou Zustand.
* **Por quÃª? (Justificativa DidÃ¡tica):**
  * *Astro:* Traz a arquitetura de "Ilhas" (Islands Architecture), enviando HTML estÃ¡tico ou renderizado no servidor por padrÃ£o e hidratando componentes com JavaScript apenas quando necessÃ¡rio. Para o mercado, dominar Astro Ã© entender profundamente sobre **Performance Web** e o custo do JavaScript.
  * *Tailwind CSS:* Facilita a manutenÃ§Ã£o atravÃ©s de Utility-First CSS, um padrÃ£o adotado globalmente que evita o acÃºmulo de estilos nÃ£o utilizados e a "heranÃ§a maldita" de CSS tradicional.
  * *Supabase:* Permite escalar sem a complexidade de manter uma infraestrutura prÃ³pria de banco de dados e APIs. Substitui ORMs complexos e integraÃ§Ãµes manuais de Auth/Storage, um padrÃ£o excelente de "Serverless" muito procurado na indÃºstria.
* **PrÃ©-requisitos de Estudo:**
  1. HTML SemÃ¢ntico e CSS Moderno (Flexbox, Grid)
  2. JavaScript BÃ¡sico (ManipulaÃ§Ã£o de DOM, Fetch API)
  3. Conceitos de SSR (Server-Side Rendering) vs SSG (Static Site Generation) vs SPA (Single Page Application)
  4. Bancos de Dados Relacionais e SQL (PostgreSQL)

### 2. ResoluÃ§Ã£o de Conflitos Estritos no NPM (ERESOLVE) em CI/CD
* **Data:** Setembro de 2026
* **Contexto:** Os builds automÃ¡ticos (no GitHub Actions e no Vercel) comeÃ§aram a falhar abruptamente com o erro `npm error ERESOLVE could not resolve` (relacionado ao `@astrojs/tailwind` nÃ£o reconhecer a versÃ£o mais recente do `astro` como vÃ¡lida na sua lista de `peerDependencies`). No entanto, o cÃ³digo rodava perfeitamente na mÃ¡quina local.
* **DecisÃ£o:** Foi criado um arquivo `.npmrc` na raiz do projeto contendo a flag `legacy-peer-deps=true`.
* **Por quÃª? (Justificativa DidÃ¡tica):** 
  * A partir da versÃ£o 7, o gerenciador de pacotes NPM mudou seu comportamento padrÃ£o: ele passou a ser extremamente rigoroso, bloqueando a instalaÃ§Ã£o e quebrando o build caso os pacotes nÃ£o declarem suporte explÃ­cito Ã s exatas versÃµes que vocÃª estÃ¡ usando (o chamado *strict peer dependency resolution*). 
  * Na vida real (e no mercado), muitas bibliotecas demoram semanas ou meses para atualizar suas tags de `peerDependencies` apÃ³s o lanÃ§amento de uma nova versÃ£o de um framework (como o Astro). O desenvolvedor sabe que a biblioteca funciona com a versÃ£o nova, mas o NPM no servidor de CI/CD bloqueia a instalaÃ§Ã£o "por seguranÃ§a".
  * **A SoluÃ§Ã£o Elegante:** Em vez de usar comandos manuais como `npm install --legacy-peer-deps` (o que forÃ§aria todo novo desenvolvedor a lembrar do comando) ou mexer nas configuraÃ§Ãµes do Github Actions/Vercel, usamos o `.npmrc`. Ele Ã© o arquivo de configuraÃ§Ã£o universal do Node.js. Colocar a regra lÃ¡ garante que qualquer serviÃ§o de nuvem ou dev que clone o projeto rodarÃ¡ as coisas da exata mesma forma, com as dependÃªncias sendo instaladas de forma tolerante (comportamento do NPM v6), ignorando o falso-positivo de conflito.
* **PrÃ©-requisitos de Estudo:**
  1. O ecossistema Node.js (O que Ã© NPM? O que Ã© o `package.json` vs `package-lock.json`?)
  2. Tipos de DependÃªncias (O que Ã© uma `dependency` vs `devDependency` vs `peerDependency`?)
  3. Continuous Integration e Cloud Deployments (Por que o ambiente local costuma ser diferente do ambiente de produÃ§Ã£o?)

### 3. SegregaÃ§Ã£o de Ambientes Dev e Piloto via Schemas PostgreSQL (Schema-based Multi-tenancy)
* **Data:** Setembro de 2026
* **Contexto:** A ONG Takanil opera no plano gratuito (free-tier) do Supabase, que permite apenas 2 projetos ativos. Criar mÃºltiplos projetos dedicados para cada ambiente (Local, Dev, Staging, Piloto, ProduÃ§Ã£o) esgotaria a cota gratuita ou geraria custos desnecessÃ¡rios. Ao mesmo tempo, utilizar um Ãºnico banco com a mesma tabela para testes locais e atendimentos reais causaria contaminaÃ§Ã£o de dados (ex: voluntÃ¡rias visualizando animais falsos de teste, como "Rex Teste 123", ou grÃ¡ficos financeiros corrompidos por lanÃ§amentos fictÃ­cios).
* **DecisÃ£o:** Adotar a arquitetura de **Isolamento por Schema no PostgreSQL**:
  * O schema `public` Ã© reservado para **desenvolvimento local, testes automatizados e deploy previews de PRs**.
  * O schema `piloto` Ã© reservado para os **dados reais da ONG em produÃ§Ã£o**.
  * O client do Supabase (`src/lib/supabaseClient.ts`) foi configurado para ler dinamicamente a variÃ¡vel `PUBLIC_SUPABASE_SCHEMA` (com fallback seguro para `'public'` caso a variÃ¡vel nÃ£o exista).
  * No provedor de hospedagem de produÃ§Ã£o (Vercel), a variÃ¡vel de ambiente Ã© configurada como `PUBLIC_SUPABASE_SCHEMA=piloto`.
* **Por quÃª? (Justificativa DidÃ¡tica e VisÃ£o de Mercado):**
  * *Arquitetura Multi-Tenancy no PostgreSQL:* No mundo corporativo e em plataformas SaaS (ex: Salesforce, Shopify, Slack), existem trÃªs modelos clÃ¡ssicos de segregaÃ§Ã£o de dados:
    1. **Database-per-tenant (Banco por cliente/ambiente):** Isolamento total, mas alto custo de infraestrutura e sobrecarga de conexÃµes/memÃ³ria.
    2. **Row-level isolation (Coluna `tenant_id` ou `ambiente` com RLS):** Custo mÃ­nimo, mas risco constante de vazamento acidental de dados por falha em clÃ¡usula `WHERE` ou bug de polÃ­tica.
    3. **Schema-per-tenant / Schema-per-environment (Schema dedicado no mesmo banco):** O *sweet spot* da engenharia de dados. Os schemas funcionam como "pastas lÃ³gicas" ou namespaces totalmente isolados dentro da mesma instÃ¢ncia do PostgreSQL. As tabelas tÃªm o mesmo nome (`perfis`, `animais`, `financas`), mas residem em namespaces distintos (`public.animais` vs `piloto.animais`), compartilhando o mesmo pool de conexÃµes e cache do banco com custo de infraestrutura zero.
  * *Como o PostgREST / Supabase lida com Schemas:* O Supabase utiliza o PostgREST por baixo dos panos. Quando informamos `db: { schema: 'piloto' }` no SDK, o client passa automaticamente o cabeÃ§alho HTTP `Accept-Profile: piloto` (para consultas) e `Content-Profile: piloto` (para mutations). O PostgREST altera o `search_path` do PostgreSQL naquela transaÃ§Ã£o de forma transparente, garantindo que queries nunca toquem o schema errado.
  * *PrevenÃ§Ã£o de Schema Drift e AutomaÃ§Ã£o de MigraÃ§Ãµes (Supabase CLI & CI/CD):*
    * **O Risco de "Espelhar na MÃ£o":** Criar ou alterar tabelas manualmente em `public` e esquecer de reproduzir em `piloto` gera o temido *Schema Drift* (quando dois ambientes que deveriam ser idÃªnticos divergem silenciosamente, quebrando deploys em produÃ§Ã£o).
    * **Supabase DB Diff:** Para auditar diferenÃ§as de DDL entre schemas sem intervenÃ§Ã£o manual, utiliza-se a ferramenta de diff declarativo do Supabase CLI:
      ```bash
      # Gera o SQL com as diferenÃ§as exatas entre o schema local/public e o piloto
      supabase db diff --schema public,piloto
      ```
    * **EstratÃ©gia de CI/CD (GitHub Actions):** Em pipelines automatizados de banco de dados (Database Reliability Engineering - DBRE), as migraÃ§Ãµes sÃ£o versionadas em arquivos `.sql` sequenciais (ex: `supabase/migrations/YYYYMMDDHHMMSS_nome_da_migracao.sql`). Em vez de rodar SQL no painel web, a Action executa o runner aplicando a migraÃ§Ã£o tanto no schema `public` quanto no schema `piloto`, garantindo paridade contÃ­nua e eliminando o erro humano:
      ```yaml
      # Exemplo conceitual de pipeline de migraÃ§Ã£o espelhada
      - name: Aplicar migraÃ§Ãµes nos Schemas
        run: |
          supabase db push --schema public
          supabase db push --schema piloto
      ```
* **PrÃ©-requisitos de Estudo:**
  1. Conceito de Schemas e `search_path` no PostgreSQL (`CREATE SCHEMA`, `SET search_path TO ...`)
  2. Multi-tenancy Patterns (Database-per-tenant vs Schema-per-tenant vs Shared-database)
  3. PostgREST Architecture & Header Profiles (`Accept-Profile`, `Content-Profile`)
  4. Database Reliability Engineering (DBRE): Schema Drift, MigraÃ§Ãµes Declarativas vs Imperativas e Supabase CLI (`supabase db diff`, `supabase db push`)

### 4. AutomaÃ§Ã£o de MigraÃ§Ãµes com Supabase CLI (Fim das Tabelas Criadas "na Unha")
* **Data:** Setembro de 2026
* **Contexto:** Em projetos iniciantes ou protÃ³tipos, Ã© comum desenvolvedores criarem tabelas e colunas diretamente no painel web (Dashboard) do banco de dados. No entanto, Ã  medida que o sistema cresce e adota ambientes segregados (`public` e `piloto`), essa abordagem "na unha" torna-se perigosa: esquecem-se comandos, nÃ£o hÃ¡ histÃ³rico rastreÃ¡vel no Git, testes locais divergem de produÃ§Ã£o (Schema Drift) e recriar o ambiente do zero vira um pesadelo manual.
* **DecisÃ£o:** Adotar o fluxo oficial de **Database Migrations automatizadas e versionadas via Supabase CLI**. Nenhuma tabela, coluna, view, trigger ou polÃ­tica de seguranÃ§a (RLS) deve ser alterada manualmente na Dashboard sem que exista um arquivo `.sql` correspondente versionado em `supabase/migrations/`.
* **Por quÃª? (Justificativa DidÃ¡tica e PrÃ¡tica de Mercado):**
  * *O que Ã© uma Migration (MigraÃ§Ã£o de Banco de Dados)?*
    Uma migration Ã© como um "commit do Git", mas para a estrutura (DDL) do seu banco de dados. Cada migration Ã© um arquivo `.sql` imutÃ¡vel com timestamp (ex: `20260919213000_criar_tabela_vacinas.sql`). Quando o time roda o comando de migraÃ§Ã£o, o sistema lÃª a tabela de controle de histÃ³rico do banco e aplica apenas as alteraÃ§Ãµes que ainda nÃ£o foram executadas, na ordem cronolÃ³gica exata.
  * *Fluxo de Trabalho Recomendado com Supabase CLI:*
    1. **Criar uma nova migraÃ§Ã£o vazia:**
       ```bash
       npx supabase migration new adicionar_campo_vacinas
       ```
       *Isso gera um arquivo `supabase/migrations/<timestamp>_adicionar_campo_vacinas.sql` onde vocÃª escreve o DDL (`ALTER TABLE ...`, `CREATE TABLE ...`).*
    2. **Gerar migraÃ§Ã£o automaticamente por comparaÃ§Ã£o (Diff Declarativo):**
       Se vocÃª fez alteraÃ§Ãµes em um banco local de testes (via Studio local) e quer que o CLI gere o script SQL exato para vocÃª sem digitar SQL na mÃ£o:
       ```bash
       npx supabase db diff -f adicionar_campo_vacinas
       ```
    3. **Aplicar as migraÃ§Ãµes localmente / resetar ambiente limpo:**
       ```bash
       npx supabase db reset
       ```
       *O comando reseta o banco local, roda todas as migrations da pasta `supabase/migrations/` em ordem e reexecuta o `supabase/seed.sql` com dados fictÃ­cios de teste.*
    4. **Sincronizar com o banco remoto (Dev e ProduÃ§Ã£o):**
       ```bash
       # Aplica as migrations pendentes no banco remoto vinculado
       npx supabase db push
       ```
    5. **Auditar e garantir paridade entre schemas (`public` e `piloto`):**
       ```bash
       # Compara se os schemas public e piloto tÃªm exatamente a mesma estrutura DDL
       npx supabase db diff --schema public,piloto
       ```
  * *Analogia do Mundo Real:* Fazer alteraÃ§Ãµes no banco pelo painel web Ã© como editar cÃ³digo diretamente no servidor de produÃ§Ã£o por FTP sem salvar no Git: funciona na hora, mas na primeira pane ninguÃ©m sabe o que foi mudado. As migrations garantem que qualquer pessoa da equipe consiga subir uma cÃ³pia idÃªntica do banco em segundos rodando um Ãºnico comando.
* **PrÃ©-requisitos de Estudo:**
  1. DDL (Data Definition Language) vs DML (Data Manipulation Language) em SQL
  2. Versionamento de Esquemas e Estado de Banco de Dados (Evolutionary Database Design)
  3. Supabase CLI e Docker (ExecuÃ§Ã£o de contÃªineres locais do Postgres)

### 5. SeparaÃ§Ã£o de ComunicaÃ§Ã£o: Release Notes do UsuÃ¡rio vs DocumentaÃ§Ã£o de Engenharia
* **Data:** Setembro de 2026
* **Contexto:** Ao lanÃ§ar versÃµes, desenvolvedores tendem a escrever notas de lanÃ§amento com jargÃµes de engenharia (ex: "Configurado schema multi-tenant piloto no Supabase", "Implementado CI/CD no GitHub Actions", "Ajustada migration SQL de RLS"). Para as voluntÃ¡rias da ONG, essas informaÃ§Ãµes geram confusÃ£o, poluiÃ§Ã£o visual e nÃ£o comunicam o valor real do sistema.
* **DecisÃ£o:** Separar estritamente os canais de documentaÃ§Ã£o:
  * **PÃºblico Externo (VoluntÃ¡rias da ONG):** `RELEASE_NOTES.md` e o modal de novidades (`src/data/novidades.ts`) recebem exclusivamente mensagens em portuguÃªs direto e claro sobre funcionalidades, melhorias prÃ¡ticas e correÃ§Ãµes de bugs percebidas no uso do aplicativo. Ã‰ proibido citar termos tÃ©cnicos como schemas, public/piloto, migrations, APIs, CI/CD ou pacotes.
  * **PÃºblico Interno (Desenvolvedores e Engenharia):** MudanÃ§as de infraestrutura, decisÃµes de arquitetura, configuraÃ§Ãµes de build e scripts de banco de dados sÃ£o documentados exclusivamente neste arquivo (`ARQUITETURA_E_DECISOES.md`), nas issues de gestÃ£o/tarefas tÃ©cnicas e nas mensagens dos commits.
* **Por quÃª? (Justificativa DidÃ¡tica e VisÃ£o de Mercado):**
  * *ComunicaÃ§Ã£o Orientada ao UsuÃ¡rio (Product-Led Communication):* Grandes produtos de tecnologia (Apple, Nubank, Notion) mantÃªm dois registros distintos: os *Customer-facing Release Notes* (focados no benefÃ­cio ao usuÃ¡rio e usabilidade) e os *Internal Engineering Changelogs* (focados em observabilidade, dependÃªncias e dÃ©bitos tÃ©cnicos). Misturar ambos desgasta a confianÃ§a do usuÃ¡rio nÃ£o-tÃ©cnico e oculta as reais novidades do produto.
* **PrÃ©-requisitos de Estudo:**
  1. UX Writing e RedaÃ§Ã£o Centrada no UsuÃ¡rio
  2. GestÃ£o de Produto (Product Management) e Changelog Standards (Keep a Changelog)

### 6. GovernanÃ§a de SemVer (Novidades vs Patches) e Rastreabilidade de Builds (Changelog de Engenharia)
* **Data:** Setembro de 2026
* **Contexto:** Em projetos Ã¡geis, Ã© tentador anunciar correÃ§Ãµes de bugs (*bugfixes*) ou pequenos ajustes de layout (*patches*) como "Novidades" nas notas de versÃ£o. Para o usuÃ¡rio final, isso causa frustraÃ§Ã£o e desconfianÃ§a (pois o usuÃ¡rio abre o aplicativo esperando uma ferramenta nova e encontra o conserto de algo que nÃ£o deveria ter quebrado). Ao mesmo tempo, quando o time de engenharia nÃ£o documenta detalhadamente as causas raÃ­zes e os arquivos tocados em cada build de patch, perde-se a rastreabilidade histÃ³rica, tornando difÃ­cil identificar a origem de regressÃµes no futuro.
* **DecisÃ£o:**
  1. **A Regra dos TrÃªs Baldes para o UsuÃ¡rio Final (`RELEASE_NOTES.md`):**
     * **âœ¨ Novas Funcionalidades:** Estritamente o que o usuÃ¡rio *nÃ£o conseguia fazer antes* e agora consegue.
     * **âš¡ Melhorias e Refinamentos:** O que o usuÃ¡rio *jÃ¡ conseguia fazer*, mas que ficou mais Ã¡gil, intuitivo ou acessÃ­vel.
     * **ðŸ› CorreÃ§Ãµes & Ajustes:** O que estava quebrado ou inconsistente e foi consertado. Patches de correÃ§Ã£o **nunca** entram como Novidades.
  2. **Rastreabilidade CirÃºrgica Interna (`CHANGELOG_TECNICO.md`):**
     * CriaÃ§Ã£o de um registro tÃ©cnico dedicado na raiz do projeto onde cada build e patch Ã© documentado com: versÃ£o SemVer, tipo de mudanÃ§a, PR/Commit, arquivos modificados, AnÃ¡lise de Causa Raiz (RCA), soluÃ§Ã£o tÃ©cnica implementada e validaÃ§Ã£o de testes executada.
* **Por quÃª? (Justificativa DidÃ¡tica e VisÃ£o de Mercado):**
  * *PadrÃ£o de Engenharia de Classe Mundial:* OrganizaÃ§Ãµes como Stripe, Google e GitHub dividem estritamente a comunicaÃ§Ã£o de produto dos logs de engenharia. O usuÃ¡rio recebe clareza e valor imediato, enquanto a equipe tÃ©cnica tem rastreabilidade completa para auditoria, rollback Ã¡gil e investigaÃ§Ã£o de regressÃµes via `git bisect`.
* **PrÃ©-requisitos de Estudo:**
  1. Versionamento SemÃ¢ntico 2.0.0 (SemVer: `MAJOR.MINOR.PATCH`)
  2. Root Cause Analysis (RCA - AnÃ¡lise de Causa Raiz de Software)
  3. Git Bisect e Rastreabilidade de RegressÃµes em Engenharia de Confiabilidade (SRE/DBRE)


---

## 7. Governança de Schema — Regras de Ouro (Multi-Schema Supabase: public ↔ piloto)

* **Data:** Setembro de 2026
* **Contexto:** O projeto usa dois schemas PostgreSQL no mesmo projeto Supabase: public (desenvolvimento/testes) e piloto (dados reais de produção da ONG). Durante o desenvolvimento da v0.11/v0.12, diversas colunas foram adicionadas à tabela public.animais sem serem propagadas para piloto.animais. Isso causou um bug crítico de produção (RLS violation) na v0.12.0: o app quebrava silenciosamente ao tentar salvar um animal porque as colunas simplesmente não existiam em piloto.

* **Decisão — As 5 Regras de Ouro de Governança de Schema:**

  ### Regra 1: Paridade Obrigatória public ↔ piloto
  Toda operação DDL (CREATE, ALTER, DROP) aplicada em public **DEVE** ser imediatamente replicada em piloto. Não existe "vou fazer depois". Se a feature não foi propagada para piloto, ela não está pronta.

  **Checklist mental antes de fechar qualquer PR:**
  `
  [ ] Adicionei/alterei colunas em public.X?
      → Então ALTER TABLE piloto.X ADD COLUMN ... já foi escrito?
  [ ] Alterei políticas RLS em public.X?
      → Então as mesmas políticas foram aplicadas em piloto.X?
  [ ] Rodei supabase/schema.sql para rebuild do public?
      → Então supabase/schema_piloto.sql foi atualizado com as mesmas mudanças?
  `

  ### Regra 2: Migrations são o Único Veículo de DDL
  Toda mudança de schema deve viver em um arquivo de migration versionado em supabase/:
  - Naming: supabase/migration_YYYYMMDD_<descricao_curta>.sql
  - O arquivo deve ser idempotente: use ADD COLUMN IF NOT EXISTS, DROP POLICY IF EXISTS, CREATE TABLE IF NOT EXISTS.
  - **NUNCA** altere schemas diretamente no Dashboard sem também salvar o SQL no repositório.

  ### Regra 3: RLS é Parte do Schema, não um Detalhe
  Políticas de Row Level Security (RLS) têm a mesma importância que as colunas. Ao criar ou alterar uma tabela, as políticas RLS devem ser escritas no mesmo arquivo de migration, logo abaixo do DDL da tabela.

  **Padrão de políticas para tabelas com acesso misto (anon + authenticated):**
  `sql
  -- Anônimos: apenas leitura e sugestões pendentes
  CREATE POLICY "Leitura publica" ON piloto.X FOR SELECT TO anon USING (status_moderacao = 'aprovado');
  CREATE POLICY "Insercao publica (apenas pendente)" ON piloto.X FOR INSERT TO anon WITH CHECK (status_moderacao = 'pendente');

  -- Autenticados: acesso completo (admins da ONG)
  CREATE POLICY "Insercao autenticada" ON piloto.X FOR INSERT TO authenticated WITH CHECK (true);
  CREATE POLICY "Atualizacao autenticada" ON piloto.X FOR UPDATE TO authenticated USING (true);
  CREATE POLICY "Exclusao autenticada" ON piloto.X FOR DELETE TO authenticated USING (true);
  `

  ### Regra 4: Schema Drift Check antes de qualquer Release
  Antes de promover dev → main (PR de release), verificar manualmente se os dois schemas estão em paridade:
  `sql
  -- Rode no SQL Editor do Supabase Dashboard para comparar colunas:
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'animais'
  EXCEPT
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'piloto' AND table_name = 'animais';
  -- Resultado esperado: 0 linhas (schemas idênticos)
  `

  ### Regra 5: Hotfixes de Schema vão para supabase/ ANTES do PR
  Se um bug de produção exigir DDL emergencial, o fluxo é:
  1. Escrever o SQL em supabase/migration_YYYYMMDD_hotfix_<nome>.sql
  2. Aplicar no Dashboard → SQL Editor (ambiente piloto)
  3. Verificar com a query de paridade (Regra 4) que está tudo alinhado
  4. Commitar o arquivo de migration junto com o patch de código
  5. Só então abrir o PR

* **Por quê? (Justificativa Didática e Visão de Mercado):**
  * *Schema Drift* é uma das causas mais comuns de bugs em produção em aplicações multi-ambiente. Empresas como Vercel, Shopify e Stripe treinaram seus times para tratar schema como código (*schema-as-code*): toda mudança de banco vive no repositório, é revisada em PR e tem rollback rastreável.
  * O PostgreSQL tem um modelo de privilégios e RLS extremamente poderoso — e extremamente silencioso quando você erra. Um INSERT bloqueado por RLS não gera exceção visível no app se você não tratá-la, tornando o debug duplamente difícil.

* **Pré-requisitos de Estudo:**
  1. PostgreSQL Row Level Security (RLS) — Documentação oficial
  2. Database Migrations — Conceito de Versionamento de Schema
  3. Idempotência em SQL (IF NOT EXISTS, ON CONFLICT DO NOTHING)
  4. PostgREST Schema Cache — Por que NOTIFY pgrst, 'reload schema' é necessário
