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
