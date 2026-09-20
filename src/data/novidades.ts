export interface ItemNovidade {
  icone: string;
  titulo: string;
  descricao: string;
}

export const VERSAO_ATUAL = '0.11.0';

export const NOVIDADES_VERSAO: ItemNovidade[] = [
  {
    icone: '📝',
    titulo: '1. Gerador Automático de Legendas',
    descricao: 'Cria textos prontos e personalizados para redes sociais (Instagram/WhatsApp) conforme você preenche o cadastro, com botão para sortear diferentes modelos de divulgação.'
  },
  {
    icone: '⚡',
    titulo: '2. Cadastro Rápido com Sanfona de Detalhes',
    descricao: 'O formulário inicial agora tem apenas os dados essenciais para preenchimento em segundos. Informações adicionais (porte, raça, idade e cuidados) ficam organizadas em uma sanfona expansível.'
  },
  {
    icone: '🎯',
    titulo: '3. Nova Seleção de Situação do Animal',
    descricao: 'Botões diretos para escolher entre Para Adoção, Sumiu (Desaparecido), Machucado ou Achado na Rua.'
  },
  {
    icone: '📍',
    titulo: '4. Bairro Automático para Resgates',
    descricao: 'Ao marcar que o animal sumiu ou foi encontrado na rua, um campo de bairro surge automaticamente para facilitar a localização pelos tutores e voluntárias.'
  },
  {
    icone: '🐾',
    titulo: '5. Suporte para Ninhadas e Múltiplos Animais',
    descricao: 'Opção dedicada para registrar grupos de filhotes ou múltiplos animais de uma só vez, informando a quantidade exata.'
  },
];
