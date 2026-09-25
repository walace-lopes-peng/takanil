/**
 * Módulo de Gestão de Associados (Mensalistas e Padrinhos) - Hub Takanil
 * Contém tipos, regras de negócio para cálculo de vencimento/status,
 * formatação de telefones, geração de mensagens de lembrete e agradecimento.
 */

export interface Associado {
  id: string;
  nome: string;
  valor_mensalidade: number;
  dia_vencimento: number;
  whatsapp?: string | null;
  instagram?: string | null;
  ultimo_pagamento?: string | null; // Formato 'YYYY-MM-DD'
  ativo: boolean;
  observacoes?: string | null;
  criado_em?: string;
  atualizado_em?: string;
}

export type StatusPagamento = 'em_dia' | 'vence_hoje' | 'a_vencer' | 'atrasado';

export interface InfoStatusAssociado {
  status: StatusPagamento;
  rotulo: string;
  diasDiferenca: number;
  mesReferencia: string;
  classeBadge: string;
  tipoMensagemSugerida: 'lembrete' | 'hoje' | 'atraso' | 'agradecimento';
}

export const CHAVE_PIX_OFICIAL = '35998687395';

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

/**
 * Limpa qualquer caractere não numérico de um telefone.
 */
export function limparTelefone(telefone?: string | null): string {
  if (!telefone) return '';
  return telefone.replace(/\D/g, '');
}

/**
 * Formata telefone para exibição: (35) 99812-3456 ou (35) 3363-1234
 */
export function formatarTelefone(telefone?: string | null): string {
  const limpo = limparTelefone(telefone);
  if (!limpo) return '';

  // Se já vier com código do país (ex: 55359...), remove o 55 inicial se tiver 12 ou 13 dígitos
  let num = limpo;
  if ((num.length === 12 || num.length === 13) && num.startsWith('55')) {
    num = num.slice(2);
  }

  if (num.length === 11) {
    // Celular com 9 dígitos: (XX) 9XXXX-XXXX
    return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
  } else if (num.length === 10) {
    // Fixo ou celular antigo com 8 dígitos: (XX) XXXX-XXXX
    return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`;
  }

  // Fallback caso tamanho fuja do padrão brasileiro
  return telefone || '';
}

/**
 * Valida se um número de telefone é aceitável (com DDD, 10 ou 11 dígitos).
 */
export function validarTelefone(telefone?: string | null): boolean {
  if (!telefone) return true; // campo opcional se houver instagram
  const limpo = limparTelefone(telefone);
  let num = limpo;
  if ((num.length === 12 || num.length === 13) && num.startsWith('55')) {
    num = num.slice(2);
  }
  return num.length === 10 || num.length === 11;
}

/**
 * Sanitiza o handle de Instagram garantindo o '@' na frente,
 * extraindo o usuário mesmo se colarem URL completa (ex: https://instagram.com/usuario).
 */
export function formatarInstagram(instagram?: string | null): string {
  if (!instagram) return '';
  let limpo = instagram.trim();
  // Se for URL completa (ex: https://www.instagram.com/usuario/ ou instagram.com/usuario)
  limpo = limpo.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '');
  // Remove parâmetros de busca, barras finais e arrobas
  limpo = limpo.split('?')[0].split('#')[0].replace(/\/+$/, '').replace(/^@+/, '').trim();
  return limpo ? `@${limpo}` : '';
}


/**
 * Calcula o status de pagamento do associado com base no dia de vencimento,
 * na data do último pagamento e na data de referência (hoje por padrão).
 */
export function calcularStatusAssociado(
  associado: Pick<Associado, 'dia_vencimento' | 'ultimo_pagamento' | 'ativo'>,
  dataAtual: Date = new Date()
): InfoStatusAssociado {
  const anoAtual = dataAtual.getFullYear();
  const mesAtual = dataAtual.getMonth(); // 0-11
  const diaAtual = dataAtual.getDate();
  const mesReferencia = `${NOMES_MESES[mesAtual]} / ${anoAtual}`;

  // Se o associado estiver inativo
  if (associado.ativo === false) {
    return {
      status: 'atrasado',
      rotulo: 'Inativo',
      diasDiferenca: 0,
      mesReferencia,
      classeBadge: 'bg-gray-100 text-gray-700 border-gray-300',
      tipoMensagemSugerida: 'lembrete',
    };
  }

  // Verifica se já pagou no mês/ano atual
  if (associado.ultimo_pagamento) {
    const partes = associado.ultimo_pagamento.split('-');
    if (partes.length >= 2) {
      const anoPago = parseInt(partes[0], 10);
      const mesPago = parseInt(partes[1], 10) - 1; // 0-indexed

      // Se pagou no mesmo mês e ano corrente (ou posterior): está Em dia!
      if (anoPago > anoAtual || (anoPago === anoAtual && mesPago >= mesAtual)) {
        return {
          status: 'em_dia',
          rotulo: 'Em dia',
          diasDiferenca: 0,
          mesReferencia,
          classeBadge: 'bg-emerald-50 text-emerald-700 border-emerald-300',
          tipoMensagemSugerida: 'agradecimento',
        };
      }
    }
  }

  // Se ainda não pagou no mês atual, compara com o dia de vencimento
  const diaVenc = associado.dia_vencimento;

  if (diaAtual === diaVenc) {
    return {
      status: 'vence_hoje',
      rotulo: 'Vence hoje!',
      diasDiferenca: 0,
      mesReferencia,
      classeBadge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold animate-pulse',
      tipoMensagemSugerida: 'hoje',
    };
  }

  if (diaAtual < diaVenc) {
    const diasRestantes = diaVenc - diaAtual;
    if (diasRestantes <= 3) {
      return {
        status: 'a_vencer',
        rotulo: `Vence em ${diasRestantes} dia${diasRestantes > 1 ? 's' : ''}`,
        diasDiferenca: diasRestantes,
        mesReferencia,
        classeBadge: 'bg-blue-50 text-blue-700 border-blue-200',
        tipoMensagemSugerida: 'lembrete',
      };
    }

    return {
      status: 'a_vencer',
      rotulo: `Vence dia ${diaVenc}`,
      diasDiferenca: diasRestantes,
      mesReferencia,
      classeBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      tipoMensagemSugerida: 'lembrete',
    };
  }

  // Se diaAtual > diaVenc: atrasado
  const diasAtraso = diaAtual - diaVenc;
  return {
    status: 'atrasado',
    rotulo: `Venceu dia ${diaVenc} (${diasAtraso}d atrás)`,
    diasDiferenca: diasAtraso,
    mesReferencia,
    classeBadge: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold',
    tipoMensagemSugerida: 'atraso',
  };
}

/**
 * Formata um valor numérico para Moeda Real (BRL).
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0);
}

/**
 * Gera mensagem humanizada para envio ao associado.
 */
export function gerarMensagemAssociado(
  associado: Pick<Associado, 'nome' | 'valor_mensalidade' | 'dia_vencimento'>,
  tipo: 'lembrete' | 'hoje' | 'atraso' | 'agradecimento' = 'lembrete',
  chavePix: string = CHAVE_PIX_OFICIAL
): string {
  const primeiroNome = associado.nome.trim().split(' ')[0] || associado.nome;
  const valorFormatado = formatarMoeda(associado.valor_mensalidade);

  if (tipo === 'agradecimento') {
    return (
      `Oi, ${primeiroNome}! Tudo bem? Passando com muito carinho para agradecer ` +
      `a sua contribuição mensal de ${valorFormatado} para os resgatadinhos da Takanil! 🐾❤️\n\n` +
      `Seu apoio faz toda a diferença para mantermos alimentação, vacinas e cuidados médicos em dia. ` +
      `Muito obrigado por estar conosco nessa missão! 🐶🐱✨`
    );
  }

  if (tipo === 'hoje') {
    return (
      `Oi, ${primeiroNome}! Tudo bem? Esperamos que sim! 🐾\n\n` +
      `Passando rapidinho para lembrar que hoje (dia ${associado.dia_vencimento}) vence ` +
      `a sua contribuição mensal de ${valorFormatado} para a ONG Takanil.\n\n` +
      `Se puder nos enviar o apoio do mês, nossa chave PIX é:\n` +
      `🔑 PIX (WhatsApp): ${chavePix}\n\n` +
      `Os nossos focinhos agradecem imensamente de coração! ❤️🐶🐱`
    );
  }

  if (tipo === 'atraso') {
    return (
      `Oi, ${primeiroNome}! Tudo certinho com você? 🐾\n\n` +
      `Passando com muito carinho para conversar sobre o apoio aos nossos resgatadinhos da Takanil. ` +
      `Notamos que a contribuição de ${valorFormatado} (vencimento dia ${associado.dia_vencimento}) ainda não foi confirmada neste mês.\n\n` +
      `Sabemos que a correria do dia a dia acontece! Se você puder nos ajudar a continuar mantendo ração e remédios, segue a nossa chave:\n` +
      `🔑 PIX (WhatsApp): ${chavePix}\n\n` +
      `Se já tiver feito a transferência, por favor desconsidere ou nos envie o comprovante por aqui. Muito obrigado pelo carinho! ❤️🐾`
    );
  }

  // Tipo 'lembrete' (padrão)
  return (
    `Oi, ${primeiroNome}! Tudo bem? Passando com muito carinho para agradecer ` +
    `seu apoio contínuo aos nossos animais da Takanil. 🐾\n\n` +
    `Sua contribuição mensal de ${valorFormatado} vence no dia ${associado.dia_vencimento}. ` +
    `Caso queira adiantar ou já deixar programado, nossa chave PIX é:\n` +
    `🔑 PIX (WhatsApp): ${chavePix}\n\n` +
    `Muito obrigado por fazer parte dessa missão e salvar vidas com a gente! ❤️🐶🐱`
  );
}

/**
 * Monta o link wa.me direto com o texto codificado.
 */
export function gerarLinkWhatsApp(telefone?: string | null, mensagem?: string): string {
  const limpo = limparTelefone(telefone);
  if (!limpo) return '';

  let numeroCompleto = limpo;
  // Se não começa com 55 e tem 10 ou 11 dígitos, adiciona o DDI Brasil (55)
  if (!numeroCompleto.startsWith('55') && (numeroCompleto.length === 10 || numeroCompleto.length === 11)) {
    numeroCompleto = `55${numeroCompleto}`;
  }

  const encoded = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${numeroCompleto}${encoded}`;
}
