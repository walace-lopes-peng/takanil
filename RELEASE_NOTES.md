# 📜 Notas de Lançamento (Release Notes) — Hub Takanil

Histórico consolidado de novidades, correções e melhorias entregues em cada versão do Hub Takanil.

---

## 🚀 Versão 0.10.1 — Bugs, Acessibilidade & Integração Social (14/09/2026)

### ✨ Novidades
- **📱 Modo de Visualização (Grade vs Lista):** Alternador de exibição no topo permitindo escolher entre 2 colunas com fotos grandes ou lista compacta detalhada.
- **🔍 Busca Rápida por Nome:** Barra de pesquisa em tempo real com botão `[ ✕ ]` de limpeza instantânea.
- **🏷️ Filtros Expandidos por Sexo e Status Clínico:** Modal acessível com opções para *Machos*, *Fêmeas*, *Misto (Ninhada)*, *Apenas Castrados* e *Apenas Vacinados*.
- **🔎 Zoom de Fotos em Tela Cheia:** Toque em qualquer foto para visualização ampliada com suporte a fechar por clique fora ou tecla `ESC`.
- **📸 Integração Instagram & Botão Flutuante (FAB):** 
  - Campo no cadastro com botão inteligente **`[ 📋 Colar Link ]`** que lê da área de transferência com 1 toque.
  - Mini botão de post com logo do Instagram nos cards de animais cadastrados.
  - FAB flutuante oficial da ONG (`@takanilp4`) com efeito suave de expansão no scroll.
- **🗑️ Lixeira de Animais Rejeitados com Limpeza no Storage:** Painel de moderação com opção de restaurar, excluir individualmente ou esvaziar a lixeira com exclusão física de imagens no Supabase Storage.
- **✨ Central de Novidades da Versão:** Modal ilustrado com mini-tutoriais e link de acesso permanente no rodapé.

### 🐛 Correções & Estabilidade
- **Finais Felizes:** Corrigido problema de foco/hover preso no celular e restaurado o filtro de animais adotados.
- **Interatividade no Modal de Filtros:** Handlers resilientes para resposta instantânea a toques em qualquer categoria.
- **Acessibilidade Universal (WCAG):** Áreas de clique confortáveis (44px a 48px), contrastes aprimorados e eliminação de `alert()` nativos em favor de Toasts amigáveis.

---

## 📦 Versões Anteriores

### v0.9.2 — Fundação de Finanças & Gestão de Animais
- Lançamento inicial do controle financeiro (entradas e saídas com filtros por data).
- Cadastro de animais com compressão automática de fotos no navegador.
- Painel de moderação de sugestões públicas e controle de permissões por perfil (`adm`, `voluntaria`, `dev`).
