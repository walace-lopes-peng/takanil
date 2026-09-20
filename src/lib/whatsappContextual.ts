export interface AnimalWhatsAppInfo {
  nome?: string | null;
  especie?: string | null;
  fase_vida?: string | null;
  localizacao?: string | null;
  situacao_urgencia?: string | null;
  status?: string | null;
}

/**
 * Gera a mensagem humanizada e contextualizada para envio via WhatsApp
 * dependendo do estado clínico/urgência do animal.
 */
export function obterMensagemWhatsAppContextual(animal: AnimalWhatsAppInfo): string {
  const nome = (animal.nome && animal.nome.trim() !== '') ? animal.nome.trim() : 'este animal';
  const especie = animal.especie || 'Animal';
  const fase = animal.fase_vida ? `, ${animal.fase_vida}` : '';
  const localizacao = animal.localizacao ? ` em ${animal.localizacao}` : '';

  if (animal.situacao_urgencia === 'Machucado/Risco') {
    return `Olá, equipe Takanil! 🚨 Vi no Hub Takanil que o(a) ${nome} (${especie}) está precisando de cuidados médicos e gostaria de ajudar com doação ou tratamento!`;
  }

  if (animal.situacao_urgencia === 'Desaparecido' || (animal.localizacao && animal.localizacao.includes('Desaparecido'))) {
    return `Olá, equipe Takanil! 🔍 Vi a publicação do(a) ${nome} (${especie}) que está desaparecido(a)${localizacao} no Hub Takanil e tenho informações!`;
  }

  if (animal.situacao_urgencia === 'Achado na Rua') {
    return `Olá, equipe Takanil! 🧭 Vi a publicação do(a) ${nome} (${especie}) resgatado(a) na rua${localizacao} no Hub Takanil e gostaria de ajudar / encontrar os tutores!`;
  }

  return `Olá, equipe Takanil! 💚 Vi o(a) ${nome} (${especie}${fase}) no Hub Takanil e gostaria de informações sobre como adotá-lo(a)!`;
}

/**
 * Retorna o rótulo curto e ícone mais adequado para o botão de WhatsApp.
 */
export function obterLabelWhatsAppContextual(animal: AnimalWhatsAppInfo): { texto: string; icone: string } {
  if (animal.situacao_urgencia === 'Machucado/Risco') {
    return { texto: 'Ajudar Tratamento', icone: '🩺' };
  }
  if (animal.situacao_urgencia === 'Desaparecido' || (animal.localizacao && animal.localizacao.includes('Desaparecido'))) {
    return { texto: 'Tenho Informações', icone: '🔍' };
  }
  if (animal.situacao_urgencia === 'Achado na Rua') {
    return { texto: 'Informações', icone: '🧭' };
  }
  return { texto: 'Quero Adotar', icone: '💬' };
}

/**
 * Gera o link direto wa.me com a mensagem codificada em URL.
 */
export function obterLinkWhatsAppContextual(animal: AnimalWhatsAppInfo, telefone: string = '5535999814421'): string {
  const mensagem = obterMensagemWhatsAppContextual(animal);
  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}
