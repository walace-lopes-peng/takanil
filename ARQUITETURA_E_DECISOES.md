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
