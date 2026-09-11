O formulário público de "Sugerir Animal" atualmente herda a lógica do formulário interno de administradores. Precisamos simplificá-lo e aplicar **Progressive Disclosure** para deixá-lo mais rápido e à prova de falhas.

### Melhorias Necessárias

1. **Localização Pública e Bairro:**
   - Remover "Abrigo Takanil" para usuários públicos (evita que voluntários sem permissão cadastrem direto no abrigo).
   - Adicionar campo opcional "Bairro" logo abaixo da localização (fundamental para o mapeamento e resgate de animais de rua, já que na base legada esse controle de localização geográfica é muito valioso).

2. **Campo de Situação (Antiga "Situação de Urgência"):**
   - Renomear label para "Situação".
   - Atualizar opções (em Grid 2x2 para economizar espaço):
     - `[🏠 Adoção]`
     - `[🔍 Sumiu]`
     - `[🚨 Machucado]`
     - `[🧭 Achado na Rua]` (para animais que parecem perdidos).

3. **Quantidade (Mais de um animal):**
   - Ocultar o input de número.
   - Colocar apenas um checkbox amigável ou toggle switch: `[ ] Mais de um animal?`. Se clicado, exibe o input numérico.

4. **Progressive Disclosure (Detalhes Opcionais):**
   - Ocultar "Temperamento", "Vacinado", "Castrado" e "Peso" dentro de um Accordion/Dropdown chamado `+ Adicionar mais detalhes (Opcional) 🔽`.

### Mockup Proposto

```text
┌─────────────────────────────────────────┐
│ [Câmera]                                │
│                                         │
│ Nome (Opcional): [___________________]  │
│                                         │
│ Espécie: [🐶 Cão] [🐱 Gato] [🐶🐱 Ambos]│
│                                         │
│ [ ] Mais de um animal? (abre qtd)       │
│                                         │
│ Fase: [Filhote] [Adulto] [Idoso]        │
│ Sexo: [Macho] [Fêmea] [Não sei]         │
│                                         │
│ Onde o animal está? (Sem 'Abrigo')      │
│ [ Na rua (sem abrigo)          ▼ ]      │
│                                         │
│ Bairro (Opcional):                      │
│ [ Ex: Centro                   ]        │
│                                         │
│ Situação:                               │
│ [🏠 Adoção]    [🔍 Sumiu]               │
│ [🚨 Machucado] [🧭 Achado na rua]       │
│                                         │
│ ─────────────────────────────────────── │
│ 🔽 Adicionar mais detalhes (Opcional)   │
│ ─────────────────────────────────────── │
│                                         │
│ [       Enviar Sugestão       ]         │
└─────────────────────────────────────────┘
```
