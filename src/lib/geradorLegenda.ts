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
  vacinas?: string[];
  temperamento?: string;
}

export interface ConcordanciaGramatical {
  isPlural: boolean;
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
  verboSer: string;         // 'é' | 'são'
  verboSerCapitalizado: string; // 'É' | 'São'
  verboEstar: string;       // 'está' | 'estão'
  verboEstava: string;      // 'estava' | 'estavam'
  verboFoi: string;         // 'foi' | 'foram'
  verboFui: string;         // 'Fui' | 'Fomos'
  verboPassou: string;      // 'passou' | 'passaram'
  verboMerece: string;      // 'merece' | 'merecem'
  verboPrecisa: string;     // 'precisa' | 'precisam'
  verboAndou: string;       // 'andou' | 'andaram'
  verboTem: string;         // 'tem' | 'têm'
  verboQuer: string;        // 'só quero' | 'só queremos'
  tituloAnimal: string;     // 'ANIMAL' | 'ANIMAIS'
  anjinho: string;          // 'Esse anjinho' | 'Essa anjinha' | 'Esses anjinhos'
  termoAcolhimento: string; // 'precisa muito de acolhimento' | 'precisam muito de acolhimento'
  termoCompanheiro: string; // 'o melhor companheiro da sua vida' | 'os melhores companheiros da sua vida'
  termoMeTira: string;      // 'Me tira das ruas?' | 'Nos tira das ruas?'
  termoQueroLar: string;    // 'Eu quero um lar e alguém para amar! ✨' | 'Nós queremos um lar e alguém para amar! ✨'
  termoEnchelo: string;     // 'enchê-lo' | 'enchê-la' | 'enchê-los'
  termoPraEle: string;      // 'pra ele' | 'pra ela' | 'pra eles'
  termoSerFeliz: string;    // 'ser feliz' | 'ser felizes'
}

export function obterConcordancia(sexo?: string, especie?: string): ConcordanciaGramatical {
  const isGato = especie === 'Gato';
  const isMisto = sexo === 'Misto (Ninhada)' || especie === 'Ambos/Múltiplos';
  const isFemea = sexo === 'Fêmea';

  if (isMisto) {
    return {
      isPlural: true,
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
      verboSer: 'são',
      verboSerCapitalizado: 'São',
      verboEstar: 'estão',
      verboEstava: 'estavam',
      verboFoi: 'foram',
      verboFui: 'Fomos',
      verboPassou: 'passaram',
      verboMerece: 'merecem',
      verboPrecisa: 'precisam',
      verboAndou: 'andaram',
      verboTem: 'têm',
      verboQuer: 'só queremos',
      tituloAnimal: 'ANIMAIS',
      anjinho: 'Esses anjinhos',
      termoAcolhimento: 'precisam muito de acolhimento',
      termoCompanheiro: 'os melhores companheiros da sua vida',
      termoMeTira: 'Nos tira das ruas?',
      termoQueroLar: 'Nós queremos um lar e alguém para amar! ✨',
      termoEnchelo: 'enchê-los',
      termoPraEle: 'pra eles',
      termoSerFeliz: 'ser felizes',
    };
  }

  if (isFemea) {
    return {
      isPlural: false,
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
      verboSer: 'é',
      verboSerCapitalizado: 'É',
      verboEstar: 'está',
      verboEstava: 'estava',
      verboFoi: 'foi',
      verboFui: 'Fui',
      verboPassou: 'passou',
      verboMerece: 'merece',
      verboPrecisa: 'precisa',
      verboAndou: 'andou',
      verboTem: 'tem',
      verboQuer: 'só quero',
      tituloAnimal: 'ANIMAL',
      anjinho: 'Essa anjinha',
      termoAcolhimento: 'precisa muito de acolhimento',
      termoCompanheiro: 'a melhor companheira da sua vida',
      termoMeTira: 'Me tira das ruas?',
      termoQueroLar: 'Eu quero um lar e alguém para amar! ✨',
      termoEnchelo: 'enchê-la',
      termoPraEle: 'pra ela',
      termoSerFeliz: 'ser feliz',
    };
  }

  // Padrão Macho ou Não sei (masculino genérico em PT-BR)
  return {
    isPlural: false,
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
    verboSer: 'é',
    verboSerCapitalizado: 'É',
    verboEstar: 'está',
    verboEstava: 'estava',
    verboFoi: 'foi',
    verboFui: 'Fui',
    verboPassou: 'passou',
    verboMerece: 'merece',
    verboPrecisa: 'precisa',
    verboAndou: 'andou',
    verboTem: 'tem',
    verboQuer: 'só quero',
    tituloAnimal: 'ANIMAL',
    anjinho: 'Esse anjinho',
    termoAcolhimento: 'precisa muito de acolhimento',
    termoCompanheiro: 'o melhor companheiro da sua vida',
    termoMeTira: 'Me tira das ruas?',
    termoQueroLar: 'Eu quero um lar e alguém para amar! ✨',
    termoEnchelo: 'enchê-lo',
    termoPraEle: 'pra ele',
    termoSerFeliz: 'ser feliz',
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
  let fraseTemperamento = '';
  if (temperamento) {
    if (g.isPlural) {
      if (temperamento === 'mansinho') fraseTemperamento = 'muito mansinhos';
      else if (temperamento === 'dócil' || temperamento === 'docil') fraseTemperamento = 'muito dóceis';
      else if (temperamento === 'brincalhão' || temperamento === 'brincalhao') fraseTemperamento = 'muito brincalhões';
      else if (temperamento === 'calmo') fraseTemperamento = 'muito calmos';
      else if (temperamento === 'bravo') fraseTemperamento = 'bravinhos';
      else if (temperamento === 'assustado') fraseTemperamento = 'assustadinhos';
      else fraseTemperamento = `muito ${temperamento}`;
    } else {
      fraseTemperamento = `muito ${temperamento}`;
    }
  } else {
    fraseTemperamento = g.mansinho;
  }

  const fraseCastrado = dados.castrado === 'Sim' 
    ? `já ${g.verboEstar} ${g.castrado}` 
    : (dados.castrado === 'Não' ? `ainda não ${g.verboSer} ${g.castrado}` : '');
  
  let fraseVacinado = '';
  if (dados.vacinas && dados.vacinas.length > 0) {
    fraseVacinado = g.isPlural ? `vacinados com ${dados.vacinas.join(' e ')}` : `vacinado(a) com ${dados.vacinas.join(' e ')}`;
  } else if (dados.vacinado === 'Sim') {
    fraseVacinado = g.isPlural ? 'já vacinados' : 'já vacinado(a)';
  }

  // Modelo específico se a situação for DESAPARECIDO
  if (dados.situacao === 'Desaparecido' || dados.situacao === 'Sumiu') {
    return [
      `🚨 PROCURA-SE: ${nomeOuRef.toUpperCase()} ${g.verboEstar.toUpperCase()} ${g.desaparecido.toUpperCase()}!`,
      '',
      `${temNome ? `${dados.nome!.trim()} ${g.verboSer} ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}` : `${g.pronomeDemonstrativo} ${g.substantivo} ${g.lindo}`} e ${g.verboEstar} ${g.desaparecido}${fraseBairro ? ` ${fraseBairro}` : ''}. ${g.pronomeReto} ${g.verboSer} muito ${g.amado} e a família está desesperada por notícias.`,
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
      `🧭 ${g.tituloAnimal} ${g.encontrado.toUpperCase()} NA RUA!`,
      '',
      `${g.pronomeDemonstrativo} ${g.substantivo} ${g.lindo} ${g.verboFoi} ${g.encontrado} ${fraseBairroResgate}.`,
      `${g.pronomeReto} ${g.verboSer} ${fraseTemperamento}${frasePorte ? `, de ${frasePorte}` : ''}.`,
      '',
      `Buscamos o tutor original ou um lar temporário/definitivo com urgência!`,
      `Por favor, compartilhem para encontrarmos a família ou um lar amoroso! 🐾❤️`
    ].filter(line => line !== null).join('\n');
  }

  // Pool de 5 Modelos Gerais da Rita (Adoção / Resgate / Apelo)
  const modelos = [
    // Modelo 0: Apelo Emocional Direto ("Me tira das ruas?")
    () => {
      const caracteristicas = [frasePorte, fraseTemperamento, fraseCastrado, fraseVacinado].filter(Boolean).join(', ');
      return [
        `"${g.termoMeTira} ${g.verboFui} ${g.resgatado} e ${g.verboQuer} uma chance de ${g.termoSerFeliz}..." 🐾`,
        '',
        `${nomeOuRef} ${g.verboSer} ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}${bairro ? ` que ${g.verboEstava} ${fraseBairro}` : ''}.`,
        caracteristicas ? `🐾 ${g.pronomeReto} ${g.verboSer} ${caracteristicas}.` : '',
        '',
        `Um cantinho seguro e com carinho já muda tudo ${g.termoPraEle}! Você pode ser a virada nessa história?`,
        `Mesmo que não possa adotar, um compartilhamento seu pode chegar em quem pode! 🏠❤️`
      ].filter(l => l !== '').join('\n');
    },

    // Modelo 1: Pós-Clínica / Castração ("Não merece voltar pras ruas")
    () => {
      return [
        `${g.anjinho} de quatro patas passou por cuidados, ${g.verboFoi} ${g.castrado} e não ${g.verboMerece} voltar para as ruas! 🐾`,
        '',
        `${nomeOuRef} ${g.verboSer} ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}${bairro ? ` ${g.resgatado} ${fraseBairroResgate}` : ''}. ${g.pronomeReto} ${g.verboSer} ${fraseTemperamento}${frasePorte ? ` e de ${frasePorte}` : ''}.`,
        '',
        `Pedimos que ajudem compartilhando a foto na busca de um lar responsável e cheio de amor. Podemos transformar essa vida juntos!`,
        `Ajude compartilhando essa publicação! ✨🐶🐱`
      ].filter(l => l !== '').join('\n');
    },

    // Modelo 2: Bairro / Comunidade ("Aparecendo lá no bairro...")
    () => {
      return [
        `${g.pronomeDemonstrativo} ${g.substantivo} ${g.lindo} ${g.verboPrecisa} urgente de um lar! 🐾`,
        '',
        `${g.pronomeReto} ${g.verboAndou} aparecendo ${fraseBairro ? fraseBairro : 'na região'} precisando de amor e proteção. ${g.verboSerCapitalizado} ${fraseTemperamento}${frasePorte ? `, ${frasePorte}` : ''}${fraseCastrado ? ` e ${fraseCastrado}` : ''}.`,
        '',
        `Quem tiver espaço no coração e quiser dar uma vida digna a ${g.isPlural ? 'esses bichinhos' : 'esse bichinho'}, entre em contato!`,
        `Nos ajude compartilhando para que essa mensagem chegue à pessoa certa! 💖`
      ].filter(l => l !== '').join('\n');
    },

    // Modelo 3: Urgência / Machucado ou Risco
    () => {
      return [
        `🚨 URGÊNCIA: Um lar temporário ou definitivo com amor!`,
        '',
        `${nomeOuRef} ${g.verboFoi} ${g.resgatado}${bairro ? ` ${fraseBairroResgate}` : ''} e ${g.termoAcolhimento}.`,
        `${g.verboSerCapitalizado} ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}, ${fraseTemperamento}${frasePorte ? ` e ${frasePorte}` : ''}.`,
        '',
        `Com amor e cuidado, ${g.pronomeReto.toLowerCase()} ${g.verboTem} tudo para se tornar ${g.termoCompanheiro}!`,
        `Compartilhe para salvarmos mais essa vida! 🐾❤️`
      ].filter(l => l !== '').join('\n');
    },

    // Modelo 4: Apelo Doce ("Eu quero um lar e alguém para amar")
    () => {
      return [
        `"${g.termoQueroLar}"`,
        '',
        `Conheça ${nomeOuRef}! ${g.pronomeReto} ${g.verboSer} ${g.artigoIndefinido} ${g.substantivo} ${g.lindo}, super ${fraseTemperamento}${frasePorte ? ` e ${frasePorte}` : ''}.`,
        fraseCastrado ? `🐾 ${g.pronomeReto} ${fraseCastrado}.` : '',
        '',
        `Você pode ser a família que vai ${g.termoEnchelo} de carinho?`,
        `Adote ou compartilhe com seus amigos! 🏡🐾❤️`
      ].filter(l => l !== '').join('\n');
    }
  ];

  const modeloIdx = ((indiceModelo % modelos.length) + modelos.length) % modelos.length;
  return modelos[modeloIdx]();
}
