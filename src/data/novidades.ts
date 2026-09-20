export interface ItemNovidade {
  icone: string;
  titulo: string;
  descricao: string;
}

export const VERSAO_ATUAL = '0.11.0';

export const NOVIDADES_VERSAO: ItemNovidade[] = [
  {
    icone: '📝',
    titulo: '1. Gerador Inteligente de Legendas',
    descricao: 'O formulário agora cria automaticamente legendas prontas e persuasivas para divulgar o animal no Instagram e WhatsApp, com botão para sortear novos textos.'
  },
  {
    icone: '⚡',
    titulo: '2. Cadastro Rápido e Descomplicado',
    descricao: 'Campos secundários agora ficam organizados em uma sanfona recolhida, permitindo sugerir ou cadastrar um animal em menos de 15 segundos.'
  },
  {
    icone: '📍',
    titulo: '3. Identificação de Bairro para Resgates',
    descricao: 'Ao indicar que um animal sumiu ou foi encontrado na rua, você pode informar o bairro para agilizar o reencontro com a família.'
  },
  {
    icone: '🎯',
    titulo: '4. Nova Escolha de Situação em 1 Toque',
    descricao: 'Botões grandes e diretos para indicar se o animal é para Adoção, Desaparecido, Machucado ou Achado na Rua.'
  },
  {
    icone: '🐾',
    titulo: '5. Suporte para Ninhadas e Grupos',
    descricao: 'Opção simplificada para registrar mais de um animal ou ninhadas sem poluir o formulário.'
  },
  {
    icone: '🛡️',
    titulo: '6. [Gestão] Base de Dados Oficial e Segura',
    descricao: 'Seus cadastros reais agora ficam 100% protegidos e isolados de qualquer teste de desenvolvimento.'
  }
];
