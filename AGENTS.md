# AGENTS.md — Hub Takanil

## Contexto do projeto
PWA para a ONG Takanil (proteção animal, Passa Quatro/MG) cadastrar animais e
controlar finanças. Usuárias finais são voluntárias sem experiência técnica.
Prioridade absoluta: **simplicidade e telas com poucos toques**, não recursos.

## Stack (fixa — não trocar nem sugerir alternativa sem perguntar)
- Astro (não usar React/Vue/Svelte para novos componentes)
- Tailwind CSS (não escrever CSS solto nem CSS-in-JS)
- Supabase (Postgres + Storage) — não trocar por Firebase, não adicionar ORM
- Sem framework de state management (Redux, Zustand, etc). Estado fica local.

## Comandos
- Instalar: `npm install`
- Rodar local: `npm run dev`
- Build: `npm run build`
- Antes de finalizar qualquer tarefa: rodar `npm run build` e confirmar que
  não quebra. Não existe suíte de testes automatizados ainda — não crie uma
  sem pedido explícito.

## Estrutura — o que pode e o que não pode mexer
- `src/pages/` — pode criar/editar páginas livremente, seguindo o plano de fases
- `src/lib/` — pode editar, mas funções aqui são compartilhadas: não duplique lógica de outra página, reutilize
- `src/layouts/Layout.astro` — só editar se a tarefa pedir mudança de layout global
- `supabase/schema.sql` — **nunca alterar uma tabela existente sem eu pedir explicitamente**. Se a tarefa precisa de um campo novo, pare e pergunte antes de rodar qualquer SQL.
- `.env` / chaves — nunca commitar. Sempre usar `.env.example` como referência, nunca colocar chave real em código.
- `public/manifest.json` — só editar se a tarefa for sobre ícone/PWA

## Escopo — trabalhe uma "Parte" por vez
O projeto está dividido em Fases e Partes (ver `PLANO-hub-takanil.md`). Cada
tarefa deve implementar **uma Parte só**. Não adiante funcionalidade de uma
fase futura só porque "já que estou aqui". Se perceber que a tarefa exige
tocar em algo fora do escopo da Parte pedida, pare e explique antes de agir.

## Convenções de código
- Nomes de variável, função e comentário em português (o time é BR e o
  domínio é em português: `animal`, `gasto`, `racao`, não `pet`, `expense`)
- Formulários: sempre usar botões grandes (mínimo `py-3`), nunca `<select>`
  dropdown para escolhas com poucas opções — usar toggle de botões (ver
  `animais/novo.astro` como referência de padrão)
- Nenhuma dependência nova sem justificar no commit por quê ela é necessária
  e por que não dá pra fazer com o que já está instalado
- Erros de usuário (formulário inválido, falha de rede) sempre viram uma
  mensagem em português simples na tela — nunca só um `console.error` silencioso

## Antes de considerar uma tarefa pronta
- [ ] `npm run build` roda sem erro
- [ ] Testado manualmente em viewport mobile (375px)
- [ ] Nenhuma chave/segredo foi commitada
- [ ] Mudança está limitada à Parte pedida, nada a mais
- [ ] Mensagens de erro para o usuário estão em português e são compreensíveis

## Commits
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`
- Um commit por Parte concluída, não um commit gigante no final
- Mensagem descreve o quê e, se não for óbvio, por quê

## Quando tiver dúvida
Pare e pergunte em vez de assumir. Especialmente para: mudança de schema,
nova dependência, mudança de fluxo de UX já definido, ou qualquer decisão que
afete como as voluntárias vão usar o app no dia a dia.
