# 📜 Notas de Lançamento (Release Notes) — Hub Takanil

Histórico de melhorias, novidades e correções entregues em cada versão do Hub Takanil.

---

## 🚀 Versão 0.12.0 — Ficha Detalhada, Gestão Ágil de Status & WhatsApp Contextual (22/09/2026)

### ✨ Novas Funcionalidades

- **📋 Ficha Detalhada do Pet com Toque no Card:** Ao tocar em qualquer animal na vitrine, abre uma ficha completa com foto em destaque, história, características físicas e cuidados clínicos (castração e vacinas aplicadas).
- **✨ `[Gestão]` Menu Rápido de Status com Botão "Desfazer":** Os botões antigos dos cards foram substituídos por um menu discreto `[ ⋮ ]`. Ao mudar o status do animal (Adotado, Voltou pro Tutor, Urgência Médica, etc.), uma notificação surge na tela com o botão **"Desfazer"** por 5 segundos para reverter qualquer toque acidental imediatamente sem confirmações burocráticas.
- **💬 Contato Contextual no WhatsApp com a ONG:** Dentro da ficha do pet, um botão inteligente monta automaticamente a mensagem personalizada para o WhatsApp oficial da Takanil (ex: *"Quero Adotar o Thor!"*, *"Quero Ajudar no Tratamento!"* ou *"Tenho Notícias!"* para animais desaparecidos), com suporte especial para ninhadas e múltiplos filhotes.
- **✂️ Ferramenta de Enquadramento Vertical de Fotos:** Novo recurso com corte e zoom na proporção vertical padronizada (500x680) para garantir que as fotos dos animais fiquem sempre bem centralizadas e sem distorções nos cards.

### ⚡ Melhorias e Refinamentos

- **🐾 Catálogo Integrado com Visualização de Pets Adotados:** Todos os animais aprovados agora permanecem visíveis na tela inicial, incluindo os pets adotados identificados com o badge verde `[✅ Adotado]`. Assim, voluntárias e visitantes conseguem consultar a situação atual do pet com facilidade, sem achar que o animal sumiu do app. O botão de coração no topo continua disponível como filtro exclusivo para comemorar os Finais Felizes.
- **↗️ Compartilhamento Ágil e Link Direto:** Botão rápido `[ ↗ ]` no canto da foto que aciona o compartilhamento nativo do celular (Web Share API) ou copia o link direto, gerando uma mensagem amigável com link que destaca o animal na vitrine instantaneamente.
- **💉 Registro Detalhado de Vacinas Aplicadas:** Seleção das vacinas específicas já tomadas pelo animal (V8/V10, Antirrábica, etc.), facilitando o acompanhamento clínico veterinário.

---

## 🚀 Versão 0.11.0 — Formulário Inteligente & Legendas da Rita (19/09/2026)

### ✨ Novidades da Versão

- **📝 Gerador Inteligente de Legendas:** Criação automática de textos humanizados e persuasivos para postagens no Instagram e WhatsApp, ajustando artigos e termos de acordo com a espécie e o sexo do animal. Inclui o botão `[ 🎲 Sortear Outro Texto ]` para alternar entre 5 modelos de divulgação com 1 toque.
- **⚡ Cadastro Rápido com Sanfona de Detalhes:** O formulário principal foi reorganizado para permitir o cadastro essencial em menos de 15 segundos. Informações complementares (porte, raça, idade aproximada, temperamento e cuidados clínicos) agora ficam em uma sanfona expansível.
- **🎯 Seleção de Situação em 1 Toque:** Substituição do campo antigo por botões visuais em grade para selecionar rapidamente entre _Para Adoção_, _Sumiu (Desaparecido)_, _Machucado_ e _Achado na Rua_.
- **📍 Campo de Bairro para Resgates:** Aparece de forma dinâmica e automática sempre que a situação do animal for marcada como _Sumiu_ ou _Achado na Rua_, ajudando no mapeamento e reencontro dos tutores.
- **🐾 Suporte a Ninhadas e Múltiplos Animais:** Adicionada a opção "Mais de um animal?" que abre o campo numérico de quantidade somente quando necessário.

---

## 📦 Versões Anteriores

### 🚀 Versão 0.10.1 — Bugs, Acessibilidade & Integração Social (14/09/2026)

- **📱 Alternador de Visualização (Grade vs Lista):** Botões no topo para alternar entre 2 colunas com fotos grandes e lista compacta detalhada.
- **🔍 Busca Rápida por Nome:** Barra de pesquisa em tempo real com botão de limpeza instantânea `[ ✕ ]`.
- **🏷️ Filtros Expandidos:** Modal acessível para filtrar animais por sexo e cuidados (castrados e vacinados).
- **🔎 Zoom de Fotos em Tela Cheia:** Toque em qualquer foto de card para abrir o visualizador em alta definição com fechamento por clique fora ou tecla `ESC`.
- **📸 Integração Instagram & Botão Flutuante (FAB):** Botão para colar o link da postagem no cadastro e botão flutuante oficial da ONG (`@takanilp4`).
- **🗑️ `[Gestão]` Lixeira de Rejeitados com Limpeza de Fotos:** Painel de aprovações com opção de restaurar ou excluir definitivamente registros rejeitados, apagando as fotos físicas no servidor.
- **✨ Central de Novidades da Versão:** Janela ilustrada de boas-vindas na primeira visita e link permanente de acesso no rodapé da página inicial.
- **🐛 Correções:** Correção no filtro de Finais Felizes e ajuste para evitar efeito de hover preso no celular.

---

### 🚀 Versão 0.9.2 — Fundação de Finanças & Gestão de Animais (01/09/2026)

- Lançamento do módulo de controle financeiro com entradas, saídas, resumo de saldo e filtros por data.
- Cadastro inicial de animais com compressão automática de fotos no celular.
- Painel de moderação para triagem de sugestões enviadas por voluntárias.
