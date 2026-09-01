export interface LancamentoGrafico {
  tipo: 'Entrada' | 'Saída';
  valor: number;
  data: string;
}

export interface Agrupamento {
  rotulo: string;
  entradas: number;
  saidas: number;
  dataRef: Date;
}

// Retorna a diferença de dias entre duas datas (no formato YYYY-MM-DD)
export function diferencaDias(inicio: string, fim: string): number {
  const d1 = new Date(inicio + 'T00:00:00');
  const d2 = new Date(fim + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Retorna o número da semana no ano (básico) para agrupar
function getWeekNumber(d: Date): number {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export function agruparLancamentos(lancamentos: LancamentoGrafico[], dataInicio: string, dataFim: string): Agrupamento[] {
  const diff = diferencaDias(dataInicio, dataFim);
  const agruparPorDia = diff <= 31;

  const grupos = new Map<string, Agrupamento>();

  for (const l of lancamentos) {
    const dataObj = new Date(l.data + 'T00:00:00');
    let chave = '';
    let rotulo = '';

    if (agruparPorDia) {
      // Ex: "2023-10-15"
      chave = l.data;
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      rotulo = `${dia}/${mes}`;
    } else {
      // Por Semana
      const ano = dataObj.getFullYear();
      const sem = getWeekNumber(dataObj);
      chave = `${ano}-W${sem}`;
      rotulo = `Sem ${sem}`;
    }

    if (!grupos.has(chave)) {
      grupos.set(chave, {
        rotulo,
        entradas: 0,
        saidas: 0,
        dataRef: dataObj
      });
    }

    const grupo = grupos.get(chave)!;
    if (l.tipo === 'Entrada') {
      grupo.entradas += l.valor;
    } else {
      grupo.saidas += l.valor;
    }
  }

  // Converter para array e ordenar cronologicamente
  const resultado = Array.from(grupos.values()).sort((a, b) => a.dataRef.getTime() - b.dataRef.getTime());
  return resultado;
}

export function gerarSvgGrafico(grupos: Agrupamento[]): string {
  if (grupos.length === 0) {
    return `<div class="text-center text-gray-400 text-sm py-4">Sem dados para exibir no gráfico.</div>`;
  }

  const svgWidth = 100; // viewBox units
  const svgHeight = 60;
  
  let maxValor = 0;
  for (const g of grupos) {
    if (g.entradas > maxValor) maxValor = g.entradas;
    if (g.saidas > maxValor) maxValor = g.saidas;
  }
  
  if (maxValor === 0) maxValor = 1; // evitar divisão por zero

  const totalBarras = grupos.length;
  // Margens
  const paddingX = 4;
  const paddingYTop = 5;
  const paddingYBottom = 15;
  
  const widthDisponivel = svgWidth - (paddingX * 2);
  const heightDisponivel = svgHeight - paddingYTop - paddingYBottom;
  
  const espacoPorGrupo = widthDisponivel / totalBarras;
  // Largura máxima de cada barra para não ficar grossa demais se tiver 1 só dia
  const barWidth = Math.min(espacoPorGrupo * 0.35, 8); 
  const gap = 1; // espaço entre entrada e saída do mesmo grupo

  let elements = '';

  grupos.forEach((g, index) => {
    const hEntrada = (g.entradas / maxValor) * heightDisponivel;
    const hSaida = (g.saidas / maxValor) * heightDisponivel;
    
    const centerX = paddingX + (index * espacoPorGrupo) + (espacoPorGrupo / 2);
    
    const xEntrada = centerX - barWidth - (gap / 2);
    const xSaida = centerX + (gap / 2);
    
    const yEntrada = svgHeight - paddingYBottom - hEntrada;
    const ySaida = svgHeight - paddingYBottom - hSaida;

    // Barra Entrada
    if (hEntrada > 0) {
      elements += `<rect x="${xEntrada}" y="${yEntrada}" width="${barWidth}" height="${hEntrada}" rx="1" fill="#16a34a" />`;
    }
    // Barra Saída
    if (hSaida > 0) {
      elements += `<rect x="${xSaida}" y="${ySaida}" width="${barWidth}" height="${hSaida}" rx="1" fill="#dc2626" />`;
    }

    // Rotulo (apenas mostra rotulos se nao tiver muitos para nao encavalar, ou mostra todos se couber)
    if (totalBarras <= 14 || index % 2 === 0) {
        elements += `<text x="${centerX}" y="${svgHeight - 4}" text-anchor="middle" font-size="4.5" fill="#6b7280" font-family="sans-serif">${g.rotulo}</text>`;
    }
  });

  return `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-auto mt-2 overflow-visible">
    ${elements}
  </svg>`;
}
