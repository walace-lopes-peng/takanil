# Plano de Desenvolvimento - Hub Takanil

O projeto está estruturado em Fases, focando sempre em entregas de valor pequenas (Partes) para garantir a adoção suave pelas voluntárias antes de adicionar complexidade desnecessária. O objetivo não é substituir o WhatsApp/Instagram da noite para o dia, mas facilitar o trabalho nelas.

## Fase 1: MVP Administrativo (✅ Concluída)
*   **Parte 1.1 a 1.4:** CRUD Básico de Animais, Upload de Fotos no Supabase Storage.

## Fase 2: Gestão Financeira Simplificada (✅ Concluída)
*   **Parte 2.1 a 2.4:** Cadastro de Despesas, Dashboard de Gráficos e Exportação para Excel.

## Fase 3: Autenticação e Moderação (🔄 Em andamento)
*   ✅ **Parte 3.1 — Schema de Perfis e Moderação:** Regras de RLS para administradoras.
*   ✅ **Parte 3.2 — Login de Administradoras:** Proteção de rotas sensíveis.
*   ✅ **Parte 3.3 — Formulário Público sem Conta:** Rota para a comunidade sugerir/denunciar animais direto para moderação.
*   **Parte 3.4 — Painel de Aprovação para Administradoras:** Interface para aceitar/rejeitar os animais vindos do formulário público.

---

*(O verdadeiro **MVP Público** que fará as voluntárias adotarem a ferramenta no dia a dia. Foco em reduzir atrito no Zap.)*

## Fase 4: Vitrine Pública e Facilitação (Próxima)
*   **Parte 4.1 — Galeria de Adoção Pública:** Filtros simples para o público ver os animais.
*   **Parte 4.2 — Ficha Expressa WhatsApp (Issue #38):** Botão de compartilhamento que gera uma mensagem formatada com o link do app para jogar nos grupos (Gera tráfego pro PWA).
*   **Parte 4.3 — Botão PIX Inteligente:** Botão verde gigante "Copiar Chave PIX" no perfil do animal para reduzir o abandono de doações.
*   **Parte 4.4 — Micro-Tags Visuais (Issue #39):** Selos visuais rápidos (✂️ Castrado, 💉 Vacinado) colados na foto, evitando que elas precisem responder isso o tempo todo.

---

*(Fases Futuras - Adicionar apenas quando o MVP estiver solidificado)*

## Fase 5: Automação e Redes Sociais
*   **Parte 5.1 — Gerador de Posts Instagram (Issue #39):** \`html-to-image\` para criar as artes de "Adoção" prontas para Stories/Feed, matando a necessidade do Canva.
*   **Parte 5.2 — Finais Felizes:** Marcação visual comemorativa quando o animal é adotado, movendo-o para um portfólio de vitórias da ONG.
*   **Parte 5.3 — Sistema de Desaparecidos (Issue #41):** Cores de urgência por dias desaparecidos e botão de *crowdsourcing* "👁️ Eu Vi" para a comunidade ajudar a rastrear.
*   **Parte 5.4 — Canal de Denúncia (Issue #37):** Gerador de WhatsApp estruturado focado para a Secretaria do Meio Ambiente/Polícia.

## Fase 6: Balanço Social e Transparência
*   **Parte 6.1 — Gerador de Balanço Social (Issue #42):** Criação da arte laranja/verde com as estatísticas de gastos para postagem no Instagram.
*   **Parte 6.2 — Dashboard de Impacto (Issue #43):** Aba no site mostrando quantas vidas a ONG já salvou no ano.
