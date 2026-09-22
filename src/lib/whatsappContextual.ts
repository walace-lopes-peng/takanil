export interface AnimalWhatsAppInfo {
  id?: string;
  nome?: string | null;
  especie?: string | null;
  sexo?: string | null;
  fase_vida?: string | null;
  localizacao?: string | null;
  situacao_urgencia?: string | null;
  status?: string | null;
  imagem_url?: string | null;
  instagram_url?: string | null;
  bairro?: string | null;
}

/**
 * Retorna uma forma natural e carinhosa de se referir ao animal,
 * mesmo quando ele não possui nome cadastrado ou é uma ninhada/múltiplos.
 */
export function formatarReferenciaAnimal(animal: AnimalWhatsAppInfo): string {
  const nomeTrim = animal.nome?.trim();
  const nomesInvalidos = ['desconhecido', 'sem nome', 'animal', 'não identificado', 'nao identificado'];
  const temNome = nomeTrim && !nomesInvalidos.includes(nomeTrim.toLowerCase());
  
  const especie = animal.especie?.toLowerCase() || '';
  const sexo = animal.sexo?.toLowerCase() || '';
  const isPlural = (sexo.includes('misto') || sexo.includes('ninhada')) || (especie.includes('múltiplos') || especie.includes('multiplos'));

  if (isPlural) {
    let termoBase = 'esses filhotinhos';
    if (especie.includes('gato') || especie.includes('felin')) {
      termoBase = 'esses gatinhos';
    } else if (especie.includes('cão') || especie.includes('cao') || especie.includes('cachorr')) {
      termoBase = 'esses cãezinhos';
    }
    let fase = animal.fase_vida?.trim().toLowerCase();
    let termoCompleto = (fase === 'filhote' && !termoBase.includes('filhot')) ? `${termoBase} filhotes` : termoBase;

    if (animal.localizacao && animal.localizacao.trim() !== '') {
      const loc = animal.localizacao.trim();
      if (loc.toLowerCase() === 'na rua') {
        return `${termoCompleto} resgatados na rua`;
      }
      if (loc.toLowerCase().startsWith('abrigo')) {
        return `${termoCompleto} (no ${loc})`;
      }
      return `${termoCompleto} (em ${loc})`;
    }
    return termoCompleto;
  }

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
 * OPÇÃO 1 — Gera mensagem humanizada para contato DIRETO com a Takanil (wa.me)
 * sem emojis pesados, com link do post no app e Instagram.
 */
export function obterMensagemWhatsAppContextual(animal: AnimalWhatsAppInfo, linkApp?: string): string {
  const ref = formatarReferenciaAnimal(animal);
  const sexo = animal.sexo?.toLowerCase() || '';
  const especie = animal.especie?.toLowerCase() || '';
  const isPlural = (sexo.includes('misto') || sexo.includes('ninhada')) || (especie.includes('múltiplos') || especie.includes('multiplos'));

  let textoBase = '';

  if (animal.situacao_urgencia === 'Machucado/Risco') {
    textoBase = `Olá, Takanil! Vi no app que ${ref} ${isPlural ? 'precisam' : 'precisa'} de cuidados médicos e gostaria de ajudar com o tratamento.`;
  } else if (animal.situacao_urgencia === 'Desaparecido' || (animal.localizacao && animal.localizacao.includes('Desaparecido'))) {
    textoBase = `Olá, Takanil! Vi o aviso no app sobre ${ref} que ${isPlural ? 'estão desaparecidos' : 'está desaparecido(a)'} e tenho informações.`;
  } else if (animal.situacao_urgencia === 'Achado na Rua') {
    textoBase = `Olá, Takanil! Vi a publicação no app sobre ${ref} ${isPlural ? 'resgatados' : 'resgatado(a)'} e gostaria de ajudar.`;
  } else {
    textoBase = `Olá, Takanil! Vi ${ref} no app e gostaria de saber sobre a adoção.`;
  }

  const linhas: string[] = [textoBase];

  if (linkApp && linkApp.trim() !== '') {
    linhas.push(`Ver no app: ${linkApp.trim()}`);
  }

  if (animal.instagram_url && animal.instagram_url.trim() !== '') {
    linhas.push(`Post no Instagram: ${animal.instagram_url.trim()}`);
  }

  return linhas.join('\n\n');
}

/**
 * OPÇÃO 2 — Gera mensagem humanizada pertinente à situação do animal
 * para compartilhar com amigos, grupos, WhatsApp ou redes sociais.
 */
export function gerarMensagemCompartilhamentoPublico(animal: AnimalWhatsAppInfo, linkApp?: string): string {
  const ref = formatarReferenciaAnimal(animal);
  const sexo = animal.sexo?.toLowerCase() || '';
  const especie = animal.especie?.toLowerCase() || '';
  const isPlural = (sexo.includes('misto') || sexo.includes('ninhada')) || (especie.includes('múltiplos') || especie.includes('multiplos'));

  let textoPrincipal = '';

  if (animal.situacao_urgencia === 'Machucado/Risco') {
    textoPrincipal = `🚨 AJUDA URGENTE: ${ref} ${isPlural ? 'precisam' : 'precisa'} de cuidados veterinários na ONG Takanil! Ajude compartilhando ou apadrinhando o tratamento. 🩺🐾`;
  } else if (animal.situacao_urgencia === 'Desaparecido' || (animal.localizacao && animal.localizacao.includes('Desaparecido'))) {
    textoPrincipal = `🚨 DESAPARECIDO: Nos ajude a encontrar ${ref}! Qualquer pista ou informação ajuda muito a família. 🔍🐾`;
  } else if (animal.situacao_urgencia === 'Achado na Rua') {
    const titulo = isPlural ? 'ANIMAIS ENCONTRADOS' : 'ANIMAL ENCONTRADO';
    textoPrincipal = `🧭 ${titulo} NA RUA: ${ref} ${isPlural ? 'foram resgatados' : 'foi resgatado(a)'} e ${isPlural ? 'procuram' : 'procura'} uma família ou seus tutores! 🐾❤️`;
  } else if (animal.status === 'Adotado') {
    textoPrincipal = `🎉 FINAL FELIZ: ${ref} já tem um lar cheio de amor! Conheça outros animais que ainda esperam por adoção na ONG Takanil. 🏡❤️`;
  } else {
    textoPrincipal = `🏡 ADOTE: Olhem que amor ${ref} para adoção responsável na ONG Takanil! Vamos encontrar um lar com carinho? 🐾✨`;
  }

  const linhas: string[] = [textoPrincipal];

  if (linkApp && linkApp.trim() !== '') {
    linhas.push(`👉 Veja a foto e detalhes no app:\n${linkApp.trim()}`);
  }

  if (animal.instagram_url && animal.instagram_url.trim() !== '') {
    linhas.push(`📸 Post no Instagram:\n${animal.instagram_url.trim()}`);
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
 * Gera o link direto wa.me com a mensagem codificada em URL para a Takanil.
 */
export function obterLinkWhatsAppContextual(animal: AnimalWhatsAppInfo, telefone: string = '5535998687395', linkApp?: string): string {
  const mensagem = obterMensagemWhatsAppContextual(animal, linkApp);
  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Abre diretamente a conversa com a Takanil no WhatsApp.
 */
export function abrirWhatsAppDireto(animal: AnimalWhatsAppInfo, telefone: string = '5535998687395', linkApp?: string): void {
  const link = obterLinkWhatsAppContextual(animal, telefone, linkApp);
  if (typeof window !== 'undefined') {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Compartilha o animal usando Web Share API nativa (apenas texto + link, sem bug de legenda no WhatsApp),
 * com fallback para cópia na área de transferência.
 */
export async function compartilharAnimalPublico(animal: AnimalWhatsAppInfo, linkApp?: string): Promise<'compartilhado' | 'copiado' | 'cancelado' | 'erro'> {
  const mensagem = gerarMensagemCompartilhamentoPublico(animal, linkApp);
  const titulo = `Takanil - ${animal.nome || 'Animal'}`;
  // Tenta compartilhamento nativo do navegador/celular
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: titulo,
        text: mensagem,
      });
      return 'compartilhado';
    } catch (err: any) {
      if (err?.name === 'AbortError') return 'cancelado';
      console.warn('Falha no navigator.share, acionando fallback de clipboard:', err);
    }
  }

  // Fallback: copia para a área de transferência
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(mensagem);
      return 'copiado';
    } catch (clipErr) {
      console.warn('Falha ao copiar para clipboard:', clipErr);
    }
  }

  return 'erro';
}

/**
 * Mantido para retrocompatibilidade
 */
export async function compartilharWhatsAppComFoto(animal: AnimalWhatsAppInfo, telefone: string = '5535998687395'): Promise<void> {
  abrirWhatsAppDireto(animal, telefone);
}


