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

## Estratégia de branches

- **`main`** — branch de produção. Reflete sempre o que está publicado e em
  uso real pelas voluntárias. **Nunca** recebe commit ou push direto, e
  **nunca** recebe merge de uma branch de Parte diretamente.
- **`dev`** — branch de integração. Toda branch de Parte nasce dela, e toda
  PR de Parte fecha nela (`--base dev`), não na `main`.
- **`dev` → `main`** — feito manualmente por marco (ex: ao final de uma Fase
  inteira, ou quando um conjunto de Partes juntas forma algo que já vale a
  pena publicar). Essa PR de `dev` para `main` é aprovada por decisão
  humana explícita, nunca automaticamente pelo agente.

## Branches (nome)

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
2. Criar a branch a partir de `dev` (nunca a partir de `main`), no formato correto
3. Implementar **só** o que está na issue
4. Rodar `npm run build` e conferir a checklist de Definição de Pronto
5. **Parar e mostrar um resumo do que foi feito, pedindo permissão explícita
   antes de commitar ou dar push.** Isso vale mesmo que os passos anteriores
   já tenham sido "aprovados" no início da tarefa — commit e push exigem uma
   confirmação própria, separada.
6. Só depois da confirmação: commitar seguindo Conventional Commits e dar push
7. Abrir PR com `--base dev`, referenciando a issue, preenchendo o template
8. Parar e aguardar revisão humana — não fazer merge sozinho, nem de
   `feat/*` para `dev`, nem de `dev` para `main`
