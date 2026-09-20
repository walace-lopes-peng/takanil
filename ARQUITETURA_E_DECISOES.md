# Arquitetura e Decisões (Hub Takanil)

Este arquivo serve como um registro contínuo e vivo (ADR - Architecture Decision Record) das decisões arquiteturais tomadas durante o desenvolvimento do projeto **Hub Takanil**.

O projeto tem um papel duplo: é um sistema real e funcional para a ONG e também uma ferramenta de **aprendizado em Ciência da Computação**. Portanto, as decisões aqui documentadas seguem o **Modo Mentor Técnico**, explicando o _porquê_ profundo de cada escolha.

---

## Estrutura do Documento

Cada nova decisão arquitetural ou técnica importante deve ser adicionada abaixo, seguindo a estrutura:

1. **Contexto:** Qual o problema a ser resolvido?
2. **Decisão:** O que foi escolhido e implementado?
3. **Por quê? (Justificativa Didática):** A lógica por trás da decisão. Como o mercado aplica isso? Quais eram as alternativas?
4. **Pré-requisitos de Estudo:** O que um desenvolvedor precisa entender para dominar essa solução?

---

## Registro de Decisões

### 1. A Stack Principal (Astro + Tailwind + Supabase)
* **Data:** Setembro de 2026
* **Contexto:** Necessidade de construir um PWA leve e rápido para as voluntárias usarem via celular, sem complicações operacionais.
* **Decisão:** Foi definido o uso de **Astro** para o frontend e roteamento, **Tailwind CSS** para estilização utilitária e **Supabase** como BaaS (Backend as a Service - PostgreSQL + Storage). O estado da aplicação deve ser gerenciado de forma local e simples, sem Redux ou Zustand.
* **Por quê? (Justificativa Didática):**
  * *Astro:* Traz a arquitetura de "Ilhas" (Islands Architecture), enviando HTML estático ou renderizado no servidor por padrão e hidratando componentes com JavaScript apenas quando necessário. Para o mercado, dominar Astro é entender profundamente sobre **Performance Web** e o custo do JavaScript.
  * *Tailwind CSS:* Facilita a manutenção através de Utility-First CSS, um padrão adotado globalmente que evita o acúmulo de estilos não utilizados e a "herança maldita" de CSS tradicional.
  * *Supabase:* Permite escalar sem a complexidade de manter uma infraestrutura própria de banco de dados e APIs. Substitui ORMs complexos e integrações manuais de Auth/Storage, um padrão excelente de "Serverless" muito procurado na indústria.
* **Pré-requisitos de Estudo:**
  1. HTML Semântico e CSS Moderno (Flexbox, Grid)
  2. JavaScript Básico (Manipulação de DOM, Fetch API)
  3. Conceitos de SSR (Server-Side Rendering) vs SSG (Static Site Generation) vs SPA (Single Page Application)
  4. Bancos de Dados Relacionais e SQL (PostgreSQL)

### 2. Resolução de Conflitos Estritos no NPM (ERESOLVE) em CI/CD
* **Data:** Setembro de 2026
* **Contexto:** Os builds automáticos (no GitHub Actions e no Vercel) começaram a falhar abruptamente com o erro `npm error ERESOLVE could not resolve` (relacionado ao `@astrojs/tailwind` não reconhecer a versão mais recente do `astro` como válida na sua lista de `peerDependencies`). No entanto, o código rodava perfeitamente na máquina local.
* **Decisão:** Foi criado um arquivo `.npmrc` na raiz do projeto contendo a flag `legacy-peer-deps=true`.
* **Por quê? (Justificativa Didática):** 
  * A partir da versão 7, o gerenciador de pacotes NPM mudou seu comportamento padrão: ele passou a ser extremamente rigoroso, bloqueando a instalação e quebrando o build caso os pacotes não declarem suporte explícito às exatas versões que você está usando (o chamado *strict peer dependency resolution*). 
  * Na vida real (e no mercado), muitas bibliotecas demoram semanas ou meses para atualizar suas tags de `peerDependencies` após o lançamento de uma nova versão de um framework (como o Astro). O desenvolvedor sabe que a biblioteca funciona com a versão nova, mas o NPM no servidor de CI/CD bloqueia a instalação "por segurança".
  * **A Solução Elegante:** Em vez de usar comandos manuais como `npm install --legacy-peer-deps` (o que forçaria todo novo desenvolvedor a lembrar do comando) ou mexer nas configurações do Github Actions/Vercel, usamos o `.npmrc`. Ele é o arquivo de configuração universal do Node.js. Colocar a regra lá garante que qualquer serviço de nuvem ou dev que clone o projeto rodará as coisas da exata mesma forma, com as dependências sendo instaladas de forma tolerante (comportamento do NPM v6), ignorando o falso-positivo de conflito.
* **Pré-requisitos de Estudo:**
  1. O ecossistema Node.js (O que é NPM? O que é o `package.json` vs `package-lock.json`?)
  2. Tipos de Dependências (O que é uma `dependency` vs `devDependency` vs `peerDependency`?)
  3. Continuous Integration e Cloud Deployments (Por que o ambiente local costuma ser diferente do ambiente de produção?)

### 3. Segregação de Ambientes Dev e Piloto via Schemas PostgreSQL (Schema-based Multi-tenancy)
* **Data:** Setembro de 2026
* **Contexto:** A ONG Takanil opera no plano gratuito (free-tier) do Supabase, que permite apenas 2 projetos ativos. Criar múltiplos projetos dedicados para cada ambiente (Local, Dev, Staging, Piloto, Produção) esgotaria a cota gratuita ou geraria custos desnecessários. Ao mesmo tempo, utilizar um único banco com a mesma tabela para testes locais e atendimentos reais causaria contaminação de dados (ex: voluntárias visualizando animais falsos de teste, como "Rex Teste 123", ou gráficos financeiros corrompidos por lançamentos fictícios).
* **Decisão:** Adotar a arquitetura de **Isolamento por Schema no PostgreSQL**:
  * O schema `public` é reservado para **desenvolvimento local, testes automatizados e deploy previews de PRs**.
  * O schema `piloto` é reservado para os **dados reais da ONG em produção**.
  * O client do Supabase (`src/lib/supabaseClient.ts`) foi configurado para ler dinamicamente a variável `PUBLIC_SUPABASE_SCHEMA` (com fallback seguro para `'public'` caso a variável não exista).
  * No provedor de hospedagem de produção (Vercel), a variável de ambiente é configurada como `PUBLIC_SUPABASE_SCHEMA=piloto`.
* **Por quê? (Justificativa Didática e Visão de Mercado):**
  * *Arquitetura Multi-Tenancy no PostgreSQL:* No mundo corporativo e em plataformas SaaS (ex: Salesforce, Shopify, Slack), existem três modelos clássicos de segregação de dados:
    1. **Database-per-tenant (Banco por cliente/ambiente):** Isolamento total, mas alto custo de infraestrutura e sobrecarga de conexões/memória.
    2. **Row-level isolation (Coluna `tenant_id` ou `ambiente` com RLS):** Custo mínimo, mas risco constante de vazamento acidental de dados por falha em cláusula `WHERE` ou bug de política.
    3. **Schema-per-tenant / Schema-per-environment (Schema dedicado no mesmo banco):** O *sweet spot* da engenharia de dados. Os schemas funcionam como "pastas lógicas" ou namespaces totalmente isolados dentro da mesma instância do PostgreSQL. As tabelas têm o mesmo nome (`perfis`, `animais`, `financas`), mas residem em namespaces distintos (`public.animais` vs `piloto.animais`), compartilhando o mesmo pool de conexões e cache do banco com custo de infraestrutura zero.
  * *Como o PostgREST / Supabase lida com Schemas:* O Supabase utiliza o PostgREST por baixo dos panos. Quando informamos `db: { schema: 'piloto' }` no SDK, o client passa automaticamente o cabeçalho HTTP `Accept-Profile: piloto` (para consultas) e `Content-Profile: piloto` (para mutations). O PostgREST altera o `search_path` do PostgreSQL naquela transação de forma transparente, garantindo que queries nunca toquem o schema errado.
  * *Prevenção de Schema Drift e Automação de Migrações (Supabase CLI & CI/CD):*
    * **O Risco de "Espelhar na Mão":** Criar ou alterar tabelas manualmente em `public` e esquecer de reproduzir em `piloto` gera o temido *Schema Drift* (quando dois ambientes que deveriam ser idênticos divergem silenciosamente, quebrando deploys em produção).
    * **Supabase DB Diff:** Para auditar diferenças de DDL entre schemas sem intervenção manual, utiliza-se a ferramenta de diff declarativo do Supabase CLI:
      ```bash
      # Gera o SQL com as diferenças exatas entre o schema local/public e o piloto
      supabase db diff --schema public,piloto
      ```
    * **Estratégia de CI/CD (GitHub Actions):** Em pipelines automatizados de banco de dados (Database Reliability Engineering - DBRE), as migrações são versionadas em arquivos `.sql` sequenciais (ex: `supabase/migrations/YYYYMMDDHHMMSS_nome_da_migracao.sql`). Em vez de rodar SQL no painel web, a Action executa o runner aplicando a migração tanto no schema `public` quanto no schema `piloto`, garantindo paridade contínua e eliminando o erro humano:
      ```yaml
      # Exemplo conceitual de pipeline de migração espelhada
      - name: Aplicar migrações nos Schemas
        run: |
          supabase db push --schema public
          supabase db push --schema piloto
      ```
* **Pré-requisitos de Estudo:**
  1. Conceito de Schemas e `search_path` no PostgreSQL (`CREATE SCHEMA`, `SET search_path TO ...`)
  2. Multi-tenancy Patterns (Database-per-tenant vs Schema-per-tenant vs Shared-database)
  3. PostgREST Architecture & Header Profiles (`Accept-Profile`, `Content-Profile`)
  4. Database Reliability Engineering (DBRE): Schema Drift, Migrações Declarativas vs Imperativas e Supabase CLI (`supabase db diff`, `supabase db push`)

### 4. Automação de Migrações com Supabase CLI (Fim das Tabelas Criadas "na Unha")
* **Data:** Setembro de 2026
* **Contexto:** Em projetos iniciantes ou protótipos, é comum desenvolvedores criarem tabelas e colunas diretamente no painel web (Dashboard) do banco de dados. No entanto, à medida que o sistema cresce e adota ambientes segregados (`public` e `piloto`), essa abordagem "na unha" torna-se perigosa: esquecem-se comandos, não há histórico rastreável no Git, testes locais divergem de produção (Schema Drift) e recriar o ambiente do zero vira um pesadelo manual.
* **Decisão:** Adotar o fluxo oficial de **Database Migrations automatizadas e versionadas via Supabase CLI**. Nenhuma tabela, coluna, view, trigger ou política de segurança (RLS) deve ser alterada manualmente na Dashboard sem que exista um arquivo `.sql` correspondente versionado em `supabase/migrations/`.
* **Por quê? (Justificativa Didática e Prática de Mercado):**
  * *O que é uma Migration (Migração de Banco de Dados)?*
    Uma migration é como um "commit do Git", mas para a estrutura (DDL) do seu banco de dados. Cada migration é um arquivo `.sql` imutável com timestamp (ex: `20260919213000_criar_tabela_vacinas.sql`). Quando o time roda o comando de migração, o sistema lê a tabela de controle de histórico do banco e aplica apenas as alterações que ainda não foram executadas, na ordem cronológica exata.
  * *Fluxo de Trabalho Recomendado com Supabase CLI:*
    1. **Criar uma nova migração vazia:**
       ```bash
       npx supabase migration new adicionar_campo_vacinas
       ```
       *Isso gera um arquivo `supabase/migrations/<timestamp>_adicionar_campo_vacinas.sql` onde você escreve o DDL (`ALTER TABLE ...`, `CREATE TABLE ...`).*
    2. **Gerar migração automaticamente por comparação (Diff Declarativo):**
       Se você fez alterações em um banco local de testes (via Studio local) e quer que o CLI gere o script SQL exato para você sem digitar SQL na mão:
       ```bash
       npx supabase db diff -f adicionar_campo_vacinas
       ```
    3. **Aplicar as migrações localmente / resetar ambiente limpo:**
       ```bash
       npx supabase db reset
       ```
       *O comando reseta o banco local, roda todas as migrations da pasta `supabase/migrations/` em ordem e reexecuta o `supabase/seed.sql` com dados fictícios de teste.*
    4. **Sincronizar com o banco remoto (Dev e Produção):**
       ```bash
       # Aplica as migrations pendentes no banco remoto vinculado
       npx supabase db push
       ```
    5. **Auditar e garantir paridade entre schemas (`public` e `piloto`):**
       ```bash
       # Compara se os schemas public e piloto têm exatamente a mesma estrutura DDL
       npx supabase db diff --schema public,piloto
       ```
  * *Analogia do Mundo Real:* Fazer alterações no banco pelo painel web é como editar código diretamente no servidor de produção por FTP sem salvar no Git: funciona na hora, mas na primeira pane ninguém sabe o que foi mudado. As migrations garantem que qualquer pessoa da equipe consiga subir uma cópia idêntica do banco em segundos rodando um único comando.
* **Pré-requisitos de Estudo:**
  1. DDL (Data Definition Language) vs DML (Data Manipulation Language) em SQL
  2. Versionamento de Esquemas e Estado de Banco de Dados (Evolutionary Database Design)
  3. Supabase CLI e Docker (Execução de contêineres locais do Postgres)

### 5. Separação de Comunicação: Release Notes do Usuário vs Documentação de Engenharia
* **Data:** Setembro de 2026
* **Contexto:** Ao lançar versões, desenvolvedores tendem a escrever notas de lançamento com jargões de engenharia (ex: "Configurado schema multi-tenant piloto no Supabase", "Implementado CI/CD no GitHub Actions", "Ajustada migration SQL de RLS"). Para as voluntárias da ONG, essas informações geram confusão, poluição visual e não comunicam o valor real do sistema.
* **Decisão:** Separar estritamente os canais de documentação:
  * **Público Externo (Voluntárias da ONG):** `RELEASE_NOTES.md` e o modal de novidades (`src/data/novidades.ts`) recebem exclusivamente mensagens em português direto e claro sobre funcionalidades, melhorias práticas e correções de bugs percebidas no uso do aplicativo. É proibido citar termos técnicos como schemas, public/piloto, migrations, APIs, CI/CD ou pacotes.
  * **Público Interno (Desenvolvedores e Engenharia):** Mudanças de infraestrutura, decisões de arquitetura, configurações de build e scripts de banco de dados são documentados exclusivamente neste arquivo (`ARQUITETURA_E_DECISOES.md`), nas issues de gestão/tarefas técnicas e nas mensagens dos commits.
* **Por quê? (Justificativa Didática e Visão de Mercado):**
  * *Comunicação Orientada ao Usuário (Product-Led Communication):* Grandes produtos de tecnologia (Apple, Nubank, Notion) mantêm dois registros distintos: os *Customer-facing Release Notes* (focados no benefício ao usuário e usabilidade) e os *Internal Engineering Changelogs* (focados em observabilidade, dependências e débitos técnicos). Misturar ambos desgasta a confiança do usuário não-técnico e oculta as reais novidades do produto.
* **Pré-requisitos de Estudo:**
  1. UX Writing e Redação Centrada no Usuário
  2. Gestão de Produto (Product Management) e Changelog Standards (Keep a Changelog)
