import packageJson from '../../package.json';

export interface ItemNovidade {
  icone: string;
  titulo: string;
  descricao: string;
}

export const VERSAO_ATUAL = packageJson.version;

// Chave usada pelo localStorage para controlar se o modal já foi visto.
// Usa apenas MAJOR.MINOR — patches (ex: 0.12.1) não reexibem o modal.
// Só atualize este valor quando houver novidades reais para as voluntárias.
export const VERSAO_NOVIDADES = packageJson.version.split('.').slice(0, 2).join('.');

export const NOVIDADES_VERSAO: ItemNovidade[] = [
  // --- Novas Funcionalidades ---
  {
    icone: '🤝',
    titulo: '1. [Gestão] Controle de Associados & Padrinhos',
    descricao: 'Cadastre apoiadores com valor, dia de vencimento, WhatsApp e Instagram. Acompanhe visualmente quem está em dia, a vencer ou com mensalidade pendente.'
  },
  {
    icone: '💬',
    titulo: '2. [Gestão] Lembretes Humanizados com Chave PIX e WhatsApp',
    descricao: 'Envie mensagens carinhosas de lembrete ou agradecimento revisadas antes do disparo, com a chave PIX oficial da ONG e abertura direta no WhatsApp ou cópia para o Instagram.'
  },
  {
    icone: '💵',
    titulo: '3. [Gestão] Baixa Rápida com Integração no Caixa',
    descricao: 'Ao confirmar o recebimento da mensalidade, o apoiador fica [Em dia] e uma entrada é gerada automaticamente no Caixa de Finanças sem retrabalho.'
  },
  // --- Melhorias & Refinamentos ---
  {
    icone: '📊',
    titulo: '4. [Gestão] Sub-abas Integradas de Caixa e Associados',
    descricao: 'Navegação ágil e confortável na aba Gestão, alternando entre as despesas/entradas do Caixa e o painel de mensalistas com 1 toque.'
  },
];

