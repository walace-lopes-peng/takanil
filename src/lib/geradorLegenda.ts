export interface DadosAnimalLegenda {
  nome?: string;
  especie?: string;
  fase_vida?: string;
  sexo?: string;
  porte?: string;
  bairro?: string;
  situacao?: string;
  castrado?: string;
  vacinado?: string;
  temperamento?: string;
}

export interface ConcordanciaGramatical {
  artigoIndefinido: string; // 'um' | 'uma' | 'uns'
  artigoDefinido: string;   // 'o' | 'a' | 'os'
  pronomeReto: string;      // 'Ele' | 'Ela' | 'Eles'
  pronomeDemonstrativo: string; // 'Esse' | 'Essa' | 'Esses'
  substantivo: string;      // 'cãozinho' | 'cadelinha' | 'gatinho' | 'gatinha' | 'filhotinhos'
  substantivoFormal: string;// 'cão' | 'cadela' | 'gato' | 'gata' | 'animais'
  lindo: string;            // 'lindo' | 'linda' | 'lindos'
  mansinho: string;         // 'mansinho' | 'mansinha' | 'mansinhos'
  castrado: string;         // 'castrado' | 'castrada' | 'castrados'
  resgatado: string;        // 'resgatado' | 'resgatada' | 'resgatados'
  desaparecido: string;     // 'desaparecido' | 'desaparecida' | 'desaparecidos'
  adotado: string;          // 'adotado' | 'adotada' | 'adotados'
  amado: string;            // 'amado' | 'amada' | 'amados'
  encontrado: string;       // 'encontrado' | 'encontrada' | 'encontrados'
}

export function obterConcordancia(sexo?: string, especie?: string): ConcordanciaGramatical {
  const isGato = especie === 'Gato';
  const isMisto = sexo === 'Misto (Ninhada)' || especie === 'Ambos/Múltiplos';
  const isFemea = sexo === 'Fêmea';

  if (isMisto) {
    return {
      artigoIndefinido: 'uns',
      artigoDefinido: 'os',
      pronomeReto: 'Eles',
      pronomeDemonstrativo: 'Esses',
      substantivo: isGato ? 'gatinhos' : 'filhotinhos',
      substantivoFormal: isGato ? 'gatos' : 'filhotes',
      lindo: 'lindos',
      mansinho: 'mansinhos',
      castrado: 'castrados',
      resgatado: 'resgatados',
      desaparecido: 'desaparecidos',
      adotado: 'adotados',
      amado: 'amados',
      encontrado: 'encontrados',
    };
  }

  if (isFemea) {
    return {
      artigoIndefinido: 'uma',
      artigoDefinido: 'a',
      pronomeReto: 'Ela',
      pronomeDemonstrativo: 'Essa',
      substantivo: isGato ? 'gatinha' : 'cadelinha',
      substantivoFormal: isGato ? 'gata' : 'cadela',
      lindo: 'linda',
      mansinho: 'mansinha',
      castrado: 'castrada',
      resgatado: 'resgatada',
      desaparecido: 'desaparecida',
      adotado: 'adotada',
      amado: 'amada',
      encontrado: 'encontrada',
    };
  }

  // Padrão Macho ou Não sei (masculino genérico em PT-BR)
  return {
    artigoIndefinido: 'um',
    artigoDefinido: 'o',
    pronomeReto: 'Ele',
    pronomeDemonstrativo: 'Esse',
    substantivo: isGato ? 'gatinho' : 'cãozinho',
    substantivoFormal: isGato ? 'gato' : 'cão',
    lindo: 'lindo',
    mansinho: 'mansinho',
    castrado: 'castrado',
    resgatado: 'resgatado',
    desaparecido: 'desaparecido',
    adotado: 'adotado',
    amado: 'amado',
    encontrado: 'encontrado',
  };
}

/**
 * Gera uma legenda persuasiva e humanizada com base nos dados do animal e no modelo escolhido.
 * @param dados Dados do animal no formulário
 * @param indiceModelo Índice de 0 a 4 (ou sorteia se omitido)
 */
export function gerarLegendaAnimal(dados: DadosAnimalLegenda, indiceModelo: number = 0): string {
  const g = obterConcordancia(dados.sexo, dados.especie);

  const temNome = dados.nome && dados.nome.trim() !== '' && dados.nome.trim().toLowerCase() !== 'desconhecido';
  const nomeOuRef = temNome ? dados.nome!.trim() : `${g.pronomeDemonstrativo} ${g.substantivo}`;
  const bairro = dados.bairro && dados.bairro.trim() !== '' ? dados.bairro.trim() : '';
  const fraseBairro = bairro ? `lá no bairro ${bairro}` : '';
  const fraseBairroResgate = bairro ? `no bairro ${bairro}` : 'nas ruas';
  
  const porte = dados.porte && dados.porte !== 'Não informado' ? dados.porte.toLowerCase() : '';
  const frasePorte = porte ? `porte ${porte}` : '';
  
  const temperamento = dados.temperamento && dados.temperamento !== 'Não informado' ? dados.temperamento.toLowerCase() : '';
  const fraseTemperamento = temperamento ? `muito ${temperamento}` : g.mansinho;

  const fraseCastrado = dados.castrado === 'Sim' ? `já está ${g.castrado}` : (dados.castrado === 'Não' ? `ainda não é ${g.castrado}` : '');

  // Modelo específico se a situação for DESAPARECIDO
  if (dados.situacao === 'Desaparecido' || dados.situacao === 'Sumiu') {
    return [
      `🚨 PROCURA-SE: ${nomeOuRef.toUpperCase()} ESTÁ ${g.desaparecido.toUpperCase()}!`,
      '',
      `${temNome ? `${dados.nome!.trim()} é ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}` : `${g.pronomeDemonstrativo} ${g.substantivo} ${g.lindo}`} e está ${g.desaparecido}${fraseBairro ? ` ${fraseBairro}` : ''}. ${g.pronomeReto} é muito ${g.amado} e a família está desesperada por notícias.`,
      '',
      `🐾 Detalhes: ${[frasePorte, fraseTemperamento].filter(Boolean).join(', ')}.`,
      '',
      `Quem tiver qualquer informação sobre o paradeiro, por favor nos avise imediatamente!`,
      `Mesmo que você não tenha visto, um compartilhamento seu pode ajudar a trazer ${g.artigoDefinido} ${g.substantivo} de volta para casa! ❤️🔍`
    ].filter(line => line !== null).join('\n');
  }

  // Modelo específico se a situação for ACHADO NA RUA
  if (dados.situacao === 'Achado na Rua') {
    return [
      `🧭 ANIMAL ENCONTRADO NA RUA!`,
      '',
      `${g.pronomeDemonstrativo} ${g.substantivo} ${g.lindo} foi ${g.encontrado} ${fraseBairroResgate}.`,
      `${g.pronomeReto} é ${fraseTemperamento}${frasePorte ? `, de ${frasePorte}` : ''}.`,
      '',
      `Buscamos o tutor original ou um lar temporário/definitivo com urgência!`,
      `Por favor, compartilhem para encontrarmos a família ou um lar amoroso! 🐾❤️`
    ].filter(line => line !== null).join('\n');
  }

  // Pool de 5 Modelos Gerais da Rita (Adoção / Resgate / Apelo)
  const modelos = [
    // Modelo 0: Apelo Emocional Direto ("Me tira das ruas?")
    () => {
      const caracteristicas = [frasePorte, fraseTemperamento, fraseCastrado].filter(Boolean).join(', ');
      return [
        `"Me tira das ruas? Fui ${g.resgatado} e só quero uma chance de ser feliz..." 🐾`,
        '',
        `${nomeOuRef} é ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}${bairro ? ` que estava ${fraseBairro}` : ''}.`,
        caracteristicas ? `🐾 ${g.pronomeReto} é ${caracteristicas}.` : '',
        '',
        `Um cantinho seguro e com carinho já muda tudo pra ${g.pronomeReto.toLowerCase()}! Você pode ser a virada nessa história?`,
        `Mesmo que não possa adotar, um compartilhamento seu pode chegar em quem pode! 🏠❤️`
      ].filter(l => l !== '').join('\n');
    },

    // Modelo 1: Pós-Clínica / Castração ("Não merece voltar pras ruas")
    () => {
      return [
        `Esse anjinho de quatro patas passou por cuidados, foi ${g.castrado} e não merece voltar para as ruas! 🐾`,
        '',
        `${nomeOuRef} é ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}${bairro ? ` resgatado(a) ${fraseBairroResgate}` : ''}. ${g.pronomeReto} é ${fraseTemperamento}${frasePorte ? ` e de ${frasePorte}` : ''}.`,
        '',
        `Pedimos que ajudem compartilhando a foto na busca de um lar responsável e cheio de amor. Podemos transformar essa vida juntos!`,
        `Ajude compartilhando essa publicação! ✨🐶🐱`
      ].filter(l => l !== '').join('\n');
    },

    // Modelo 2: Bairro / Comunidade ("Aparecendo lá no bairro...")
    () => {
      return [
        `${g.pronomeDemonstrativo} ${g.substantivo} ${g.lindo} precisa urgente de um lar! 🐾`,
        '',
        `${g.pronomeReto} andou aparecendo ${fraseBairro ? fraseBairro : 'na região'} precisando de amor e proteção. É ${fraseTemperamento}${frasePorte ? `, ${frasePorte}` : ''}${fraseCastrado ? ` e ${fraseCastrado}` : ''}.`,
        '',
        `Quem tiver espaço no coração e quiser dar uma vida digna a esse bichinho, entre em contato!`,
        `Nos ajude compartilhando para que essa mensagem chegue à pessoa certa! 💖`
      ].filter(l => l !== '').join('\n');
    },

    // Modelo 3: Urgência / Machucado ou Risco
    () => {
      return [
        `🚨 URGÊNCIA: Um lar temporário ou definitivo com amor!`,
        '',
        `${nomeOuRef} foi ${g.resgatado}${bairro ? ` ${fraseBairroResgate}` : ''} e precisa muito de acolhimento.`,
        `É ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}, ${fraseTemperamento}${frasePorte ? ` e ${frasePorte}` : ''}.`,
        '',
        `Com amor e cuidado, ${g.pronomeReto.toLowerCase()} tem tudo para se tornar o melhor companheiro da sua vida!`,
        `Compartilhe para salvarmos mais essa vida! 🐾❤️`
      ].filter(l => l !== '').join('\n');
    },

    // Modelo 4: Apelo Doce ("Eu quero um lar e alguém para amar")
    () => {
      return [
        `"Eu quero um lar e alguém para amar! ✨"`,
        '',
        `Conheça ${nomeOuRef}! ${g.pronomeReto} é ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}, super ${fraseTemperamento}${frasePorte ? ` e ${frasePorte}` : ''}.`,
        fraseCastrado ? `🐾 ${g.pronomeReto} ${fraseCastrado}.` : '',
        '',
        `Você pode ser a família que vai enchê-lo(a) de carinho?`,
        `Adote ou compartilhe com seus amigos! 🏡🐾❤️`
      ].filter(l => l !== '').join('\n');
    }
  ];

  const modeloIdx = ((indiceModelo % modelos.length) + modelos.length) % modelos.length;
  return modelos[modeloIdx]();
}
