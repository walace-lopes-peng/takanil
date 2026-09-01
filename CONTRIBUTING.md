# Como contribuir — Hub Takanil

Este documento define as convenções que humanos e agentes de código devem
seguir neste repositório. Regras de comportamento do agente em si estão em
`AGENTS.md`; aqui estão as convenções de fluxo de trabalho (git, issues, PR).

## Issues

Toda issue nasce de um template (não aceitamos issue em branco — força
manter o padrão):

- **Parte do plano** — para implementar uma Parte do `PLANO-hub-takanil.md`.
  Use esse template pra qualquer tarefa que um agente vá executar.
- **Bug** — algo que já existia parou de funcionar como esperado.
- **Ideia futura** — sugestão que ainda não está em nenhuma Fase do plano.
  Não vira tarefa de agente até ser promovida para uma Parte formal.

## Labels

| Label | Quando usar |
|---|---|
| `parte-do-plano` | issue que implementa uma Parte do plano |
| `bug` | comportamento quebrado |
| `ideia-futura` | sugestão ainda não planejada |
| `docs` | mudança só de documentação |
| `bloqueado` | issue esperando decisão externa (ex: aprovação de schema) |

## Branches

Formato: `tipo/numero-da-issue-descricao-curta`

Exemplos:
- `feat/14-formulario-novo-gasto`
- `fix/22-upload-foto-android`
- `docs/9-atualiza-readme`

Tipo deve bater com o tipo do commit (ver abaixo).

## Commits — Conventional Commits

Formato: `tipo: descrição curta no imperativo`

Tipos usados neste projeto: `feat`, `fix`, `chore`, `docs`, `refactor`.

Exemplos:
```
feat: adiciona formulário de cadastro de animal
fix: corrige cálculo de ração para gatos filhotes
docs: atualiza AGENTS.md com regra de schema
```

Um commit por Parte concluída. Não misturar mudanças de Partes diferentes
no mesmo commit.

## Pull Requests

- Toda PR referencia uma issue (`Closes #N`) — nenhuma PR sem issue associada
- Título da PR segue o mesmo formato do commit (`feat: ...`, `fix: ...`)
- Preencher o checklist do template antes de pedir revisão
- Squash merge — o histórico da branch principal fica um commit por Parte

## Fluxo esperado para o agente de código

1. Ler a issue (template "Parte do plano") e o `AGENTS.md`
2. Criar a branch no formato correto
3. Implementar **só** o que está na issue
4. Rodar `npm run build` e conferir a checklist de Definição de Pronto
5. Commitar seguindo Conventional Commits
6. Abrir PR referenciando a issue, preenchendo o template
7. Parar e aguardar revisão humana — não fazer merge sozinho
