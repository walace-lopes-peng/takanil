export interface AnimalWhatsAppInfo {
  nome?: string | null;
  especie?: string | null;
  sexo?: string | null;
  fase_vida?: string | null;
  localizacao?: string | null;
  situacao_urgencia?: string | null;
  status?: string | null;
  imagem_url?: string | null;
  instagram_url?: string | null;
}

/**
 * Retorna uma forma natural e carinhosa de se referir ao animal,
 * mesmo quando ele não possui nome cadastrado.
 */
function formatarReferenciaAnimal(animal: AnimalWhatsAppInfo): string {
  const nomeTrim = animal.nome?.trim();
  const nomesInvalidos = ['desconhecido', 'sem nome', 'animal', 'não identificado', 'nao identificado'];
  const temNome = nomeTrim && !nomesInvalidos.includes(nomeTrim.toLowerCase());
  
  const especie = animal.especie?.toLowerCase() || '';
  const sexo = animal.sexo?.toLowerCase() || '';
  let termoBase = 'esse animalzinho';

  if (especie.includes('cão') || especie.includes('cao') || especie.includes('cachorr')) {
    termoBase = (sexo === 'fêmea' || sexo === 'femea') ? 'essa cadelinha' : 'esse cachorrinho';
  } else if (especie.includes('gato') || especie.includes('felin')) {
    termoBase = (sexo === 'fêmea' || sexo === 'femea') ? 'essa gatinha' : 'esse gatinho';
  }

  if (temNome) {
    const artigo = (sexo === 'fêmea' || sexo === 'femea') ? 'a' : 'o';
    return `${artigo} *${nomeTrim}*`;
  }

  // Opção 1: Natural e carinhosa (quando o nome for Desconhecido ou ausente)
  let fase = animal.fase_vida?.trim().toLowerCase();
  if (sexo === 'fêmea' || sexo === 'femea') {
    if (fase === 'adulto') fase = 'adulta';
    if (fase === 'idoso') fase = 'idosa';
  }

  let termoCompleto = fase ? `${termoBase} ${fase}` : termoBase;

  if (animal.localizacao && animal.localizacao.trim() !== '') {
    const loc = animal.localizacao.trim();
    if (loc.toLowerCase() === 'na rua') {
      const resgatado = (sexo === 'fêmea' || sexo === 'femea') ? 'resgatada na rua' : 'resgatado na rua';
      return `${termoCompleto} ${resgatado}`;
    }
    if (loc.toLowerCase().startsWith('abrigo')) {
      return `${termoCompleto} (no ${loc})`;
    }
    return `${termoCompleto} (em ${loc})`;
  }

  return termoCompleto;
}

/**
 * Gera mensagem humanizada, sem emojis (para não bugar no WhatsApp Web/app)
 * e com o link do Instagram se cadastrado.
 */
export function obterMensagemWhatsAppContextual(animal: AnimalWhatsAppInfo): string {
  const ref = formatarReferenciaAnimal(animal);
  let textoBase = '';

  if (animal.situacao_urgencia === 'Machucado/Risco') {
    textoBase = `Olá, Takanil! Vi no app que ${ref} precisa de cuidados médicos e gostaria de ajudar com o tratamento.`;
  } else if (animal.situacao_urgencia === 'Desaparecido' || (animal.localizacao && animal.localizacao.includes('Desaparecido'))) {
    textoBase = `Olá, Takanil! Vi o aviso no app sobre ${ref} que está desaparecido(a) e tenho informações.`;
  } else if (animal.situacao_urgencia === 'Achado na Rua') {
    textoBase = `Olá, Takanil! Vi a publicação no app sobre ${ref} resgatado(a) e gostaria de ajudar.`;
  } else {
    textoBase = `Olá, Takanil! Vi ${ref} no app e gostaria de saber sobre a adoção.`;
  }

  const linhas: string[] = [textoBase];

  if (animal.instagram_url && animal.instagram_url.trim() !== '') {
    linhas.push(`Post no Instagram: ${animal.instagram_url.trim()}`);
  }

  return linhas.join('\n\n');
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
export function obterLinkWhatsAppContextual(animal: AnimalWhatsAppInfo, telefone: string = '5535998687395'): string {
  const mensagem = obterMensagemWhatsAppContextual(animal);
  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}
