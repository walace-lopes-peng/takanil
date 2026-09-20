export interface ItemNovidade {
  icone: string;
  titulo: string;
  descricao: string;
}

export const VERSAO_ATUAL = '0.11.0';

export const NOVIDADES_VERSAO: ItemNovidade[] = [
  {
    icone: '📝',
    titulo: '1. Gerador de Legendas para Divulgação',
    descricao: 'Cria legendas automáticas para redes sociais conforme você preenche o cadastro, com botão para sortear novos textos.'
  },
  {
    icone: '⚡',
    titulo: '2. Formulário Rápido com Sanfona',
    descricao: 'Campos principais visíveis de imediato e detalhes adicionais organizados dentro de uma sanfona expansível.'
  },
  {
    icone: '📍',
    titulo: '3. Campo de Bairro para Desaparecidos e Resgates',
    descricao: 'Aparece automaticamente ao selecionar as opções Sumiu ou Achado na Rua.'
  },
  {
    icone: '🎯',
    titulo: '4. Seleção de Situação em Grade',
    descricao: 'Botões diretos para Adoção, Sumiu, Machucado e Achado na Rua.'
  },
  {
    icone: '🐾',
    titulo: '5. Suporte para Ninhadas e Grupos',
    descricao: 'Opção para cadastrar múltiplos animais de uma vez.'
  },
  {
    icone: '🛡️',
    titulo: '6. [Gestão] Base de Dados Oficial',
    descricao: 'Isolamento total dos cadastros reais da ONG contra testes de desenvolvimento.'
  }
];
