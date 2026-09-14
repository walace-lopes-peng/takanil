export interface LancamentoGrafico {
  tipo: 'Entrada' | 'Saída';
  valor: number;
  data: string;
  categoria?: string;
}

export interface Agrupamento {
  rotulo: string;
  entradas: number;
  saidas: number;
  dataRef: Date;
}

export interface PontoSaldo {
  rotulo: string;
  data: string;
  entradas: number;
  saidas: number;
  saldoDia: number;
  saldoAcumulado: number;
}

export interface CategoriaTotal {
  categoria: string;
  nome: string;
  total: number;
  percentual: number;
}

export interface DistribuicaoCategorias {
  totalEntradas: number;
  totalSaidas: number;
  entradas: CategoriaTotal[];
  saidas: CategoriaTotal[];
}

export const MAPA_CATEGORIAS: Record<string, string> = {
  racao: 'Ração',
  veterinario: 'Veterinário',
  medicamento: 'Medicamento',
  castracao: 'Castração',
  doacao: 'Doação',
  bazar: 'Bazar',
  rifa: 'Rifa',
  ajuste: 'Ajuste de Caixa',
  outro: 'Outro'
};

// Retorna a diferença de dias entre duas datas (no formato YYYY-MM-DD)
export function diferencaDias(inicio: string, fim: string): number {
  const d1 = new Date(inicio + 'T00:00:00');
  const d2 = new Date(fim + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Retorna o número da semana no ano para agrupar
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
      chave = l.data;
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      rotulo = `${dia}/${mes}`;
    } else {
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

  return Array.from(grupos.values()).sort((a, b) => a.dataRef.getTime() - b.dataRef.getTime());
}

// ─── 1. Evolução do Saldo (Curva Suave Contínua) ─────────────────────────────

export function calcularEvolucaoSaldo(lancamentos: LancamentoGrafico[], dataInicio: string, dataFim: string): PontoSaldo[] {
  if (!lancamentos.length) return [];

  const grupos = agruparLancamentos(lancamentos, dataInicio, dataFim);
  let acumulado = 0;

  const resultado: PontoSaldo[] = grupos.map((g) => {
    const saldoDia = g.entradas - g.saidas;
    acumulado += saldoDia;
    return {
      rotulo: g.rotulo,
      data: g.dataRef.toISOString().split('T')[0],
      entradas: g.entradas,
      saidas: g.saidas,
      saldoDia,
      saldoAcumulado: acumulado
    };
  });

  if (resultado.length === 1) {
    const unico = resultado[0];
    const dataObjIni = new Date(dataInicio + 'T00:00:00');
    const diaIni = String(dataObjIni.getDate()).padStart(2, '0');
    const mesIni = String(dataObjIni.getMonth() + 1).padStart(2, '0');
    return [
      { rotulo: `${diaIni}/${mesIni}`, data: dataInicio, entradas: 0, saidas: 0, saldoDia: 0, saldoAcumulado: 0 },
      unico
    ];
  }

  return resultado;
}

// Interpolação suave para curva bezier contínua (Catmull-Rom para Bezier)
function gerarCurvaSuave(coords: { x: number; y: number }[]): string {
  if (coords.length < 2) return '';
  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? i : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function gerarSvgCurvaSaldo(pontos: PontoSaldo[]): string {
  if (pontos.length === 0) {
    return `<div class="text-center text-gray-400 text-sm py-6">Sem movimentações para exibir na evolução do período.</div>`;
  }

  const svgWidth = 100;
  const svgHeight = 56;
  const paddingX = 6;
  const paddingYTop = 8;
  const paddingYBottom = 13;

  const availW = svgWidth - paddingX * 2;
  const availH = svgHeight - paddingYTop - paddingYBottom;

  let minVal = Math.min(...pontos.map(p => p.saldoAcumulado), 0);
  let maxVal = Math.max(...pontos.map(p => p.saldoAcumulado), 0);

  if (maxVal === minVal) {
    maxVal += 100;
    minVal -= 100;
  }

  const delta = maxVal - minVal;
  const margem = delta * 0.12;
  const yMin = minVal - margem;
  const yMax = maxVal + margem;
  const rangeY = yMax - yMin || 1;

  const coordenadas = pontos.map((p, i) => {
    const x = paddingX + (i / (pontos.length - 1 || 1)) * availW;
    const y = paddingYTop + (1 - (p.saldoAcumulado - yMin) / rangeY) * availH;
    return { x, y, ponto: p };
  });

  const saldoFinal = pontos[pontos.length - 1].saldoAcumulado;
  const positivo = saldoFinal >= 0;
  const corLinha = positivo ? '#16a34a' : '#dc2626';
  const corGrad = positivo ? '#22c55e' : '#ef4444';

  const yBottom = svgHeight - paddingYBottom;
  const pathLinha = gerarCurvaSuave(coordenadas);
  const pathArea = `${pathLinha} L ${coordenadas[coordenadas.length - 1].x.toFixed(1)} ${yBottom} L ${coordenadas[0].x.toFixed(1)} ${yBottom} Z`;

  // Linha de base R$ 0
  let linhaZero = '';
  if (yMin <= 0 && yMax >= 0) {
    const y0 = paddingYTop + (1 - (0 - yMin) / rangeY) * availH;
    linhaZero = `
      <line x1="${paddingX}" y1="${y0.toFixed(1)}" x2="${(svgWidth - paddingX).toFixed(1)}" y2="${y0.toFixed(1)}" stroke="#cbd5e1" stroke-width="0.6" stroke-dasharray="2,2" />
      <text x="${(svgWidth - paddingX).toFixed(1)}" y="${(y0 - 1.2).toFixed(1)}" text-anchor="end" font-size="3" fill="#94a3b8" font-family="sans-serif">R$ 0</text>
    `;
  }

  // Linha de Chão
  const linhaChao = `<line x1="${paddingX}" y1="${yBottom}" x2="${(svgWidth - paddingX).toFixed(1)}" y2="${yBottom}" stroke="#f1f5f9" stroke-width="0.8" />`;

  // Pontos interativos com Tooltip nativo
  let dots = '';
  coordenadas.forEach((c) => {
    const p = c.ponto;
    const sinal = p.saldoAcumulado >= 0 ? '+' : '-';
    const valorFmt = `R$ ${Math.abs(p.saldoAcumulado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    dots += `
      <g class="cursor-pointer">
        <circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="2" fill="${corLinha}" stroke="#ffffff" stroke-width="0.8" />
        <title>${p.rotulo}: Saldo no período ${sinal}${valorFmt} (Entradas: R$ ${p.entradas.toFixed(2)} | Saídas: R$ ${p.saidas.toFixed(2)})</title>
      </g>
    `;
  });

  // Rótulos do Eixo X (amostragem inteligente para evitar encavalar)
  let rotulosX = '';
  const totalPontos = coordenadas.length;
  const step = totalPontos > 10 ? Math.ceil(totalPontos / 6) : 1;
  coordenadas.forEach((c, i) => {
    if (i === 0 || i === totalPontos - 1 || i % step === 0) {
      rotulosX += `<text x="${c.x.toFixed(1)}" y="${svgHeight - 3}" text-anchor="middle" font-size="3.6" fill="#64748b" font-family="sans-serif">${c.ponto.rotulo}</text>`;
    }
  });

  return `
    <div class="relative w-full">
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="gradSaldo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${corGrad}" stop-opacity="0.22" />
            <stop offset="100%" stop-color="${corGrad}" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${linhaZero}
        ${linhaChao}
        <path d="${pathArea}" fill="url(#gradSaldo)" />
        <path d="${pathLinha}" fill="none" stroke="${corLinha}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        ${dots}
        ${rotulosX}
      </svg>
    </div>
  `;
}

// ─── 2. Distribuição por Categorias (Barras Horizontais Proporcionais) ─────────

export function agruparPorCategorias(lancamentos: LancamentoGrafico[]): DistribuicaoCategorias {
  let totalEntradas = 0;
  let totalSaidas = 0;
  const mapEntradas: Record<string, number> = {};
  const mapSaidas: Record<string, number> = {};

  for (const l of lancamentos) {
    const cat = l.categoria || 'outro';
    if (l.tipo === 'Entrada') {
      totalEntradas += l.valor;
      mapEntradas[cat] = (mapEntradas[cat] || 0) + l.valor;
    } else {
      totalSaidas += l.valor;
      mapSaidas[cat] = (mapSaidas[cat] || 0) + l.valor;
    }
  }

  const entradas: CategoriaTotal[] = Object.entries(mapEntradas).map(([cat, total]) => ({
    categoria: cat,
    nome: MAPA_CATEGORIAS[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1)),
    total,
    percentual: totalEntradas > 0 ? Math.round((total / totalEntradas) * 100) : 0
  })).sort((a, b) => b.total - a.total);

  const saidas: CategoriaTotal[] = Object.entries(mapSaidas).map(([cat, total]) => ({
    categoria: cat,
    nome: MAPA_CATEGORIAS[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1)),
    total,
    percentual: totalSaidas > 0 ? Math.round((total / totalSaidas) * 100) : 0
  })).sort((a, b) => b.total - a.total);

  return {
    totalEntradas,
    totalSaidas,
    entradas,
    saidas
  };
}

export const PALETA_CATEGORIAS: Record<string, { nome: string; cor: string }> = {
  racao: { nome: 'Ração', cor: '#f59e0b' },        // Laranja Âmbar
  veterinario: { nome: 'Veterinário', cor: '#0ea5e9' }, // Azul Celeste
  medicamento: { nome: 'Medicamento', cor: '#a855f7' }, // Roxo Violeta
  castracao: { nome: 'Castração', cor: '#ec4899' },     // Rosa Fúcsia
  doacao: { nome: 'Doação', cor: '#10b981' },           // Verde Esmeralda
  bazar: { nome: 'Bazar', cor: '#f97316' },             // Laranja Coral
  rifa: { nome: 'Rifa', cor: '#6366f1' },               // Índigo Royal
  ajuste: { nome: 'Ajuste de Caixa', cor: '#64748b' },  // Ardósia Neutro
  outro: { nome: 'Outro', cor: '#6b7280' }              // Cinza Neutro
};

export function obterCorCategoria(categoria: string): string {
  return PALETA_CATEGORIAS[categoria]?.cor || '#0d9488';
}

export function gerarHtmlCategorias(dist: DistribuicaoCategorias, formatarMoeda: (v: number) => string): string {
  if (!dist.entradas.length && !dist.saidas.length) {
    return `<div class="text-center text-gray-400 text-sm py-6">Sem lançamentos para exibir neste período.</div>`;
  }

  let html = '<div class="space-y-5 pt-1">';

  // 1. Saídas (Despesas)
  html += `
    <div>
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
          Saídas por Categoria
        </span>
        <span class="text-xs font-bold text-red-600">${formatarMoeda(dist.totalSaidas)}</span>
      </div>
  `;

  if (dist.saidas.length === 0) {
    html += `<p class="text-xs text-gray-400 italic py-1">Nenhuma saída registrada neste período.</p>`;
  } else {
    html += '<div class="space-y-2.5">';
    dist.saidas.forEach(item => {
      const corHex = obterCorCategoria(item.categoria);
      html += `
        <div>
          <div class="flex justify-between items-center text-xs text-gray-700 mb-1">
            <span class="font-medium flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style="background-color: ${corHex};"></span>
              ${item.nome}
            </span>
            <span class="font-semibold text-gray-800">${formatarMoeda(item.total)} <span class="text-gray-400 font-normal text-[11px]">(${item.percentual}%)</span></span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div class="h-2.5 rounded-full transition-all duration-500" style="width: ${Math.max(item.percentual, 3)}%; background-color: ${corHex};"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  html += '</div>';

  // 2. Entradas (Receitas)
  html += `
    <div class="pt-3 border-t border-gray-100">
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
          Entradas por Categoria
        </span>
        <span class="text-xs font-bold text-green-600">${formatarMoeda(dist.totalEntradas)}</span>
      </div>
  `;

  if (dist.entradas.length === 0) {
    html += `<p class="text-xs text-gray-400 italic py-1">Nenhuma entrada registrada neste período.</p>`;
  } else {
    html += '<div class="space-y-2.5">';
    dist.entradas.forEach(item => {
      const corHex = obterCorCategoria(item.categoria);
      html += `
        <div>
          <div class="flex justify-between items-center text-xs text-gray-700 mb-1">
            <span class="font-medium flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style="background-color: ${corHex};"></span>
              ${item.nome}
            </span>
            <span class="font-semibold text-gray-800">${formatarMoeda(item.total)} <span class="text-gray-400 font-normal text-[11px]">(${item.percentual}%)</span></span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div class="h-2.5 rounded-full transition-all duration-500" style="width: ${Math.max(item.percentual, 3)}%; background-color: ${corHex};"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  html += '</div>';

  html += '</div>';
  return html;
}

// Mantido para compatibilidade se necessário
export function gerarSvgGrafico(grupos: Agrupamento[]): string {
  if (grupos.length === 0) {
    return `<div class="text-center text-gray-400 text-sm py-4">Sem dados para exibir no gráfico.</div>`;
  }

  const svgWidth = 100;
  const svgHeight = 60;
  
  let maxValor = 0;
  for (const g of grupos) {
    if (g.entradas > maxValor) maxValor = g.entradas;
    if (g.saidas > maxValor) maxValor = g.saidas;
  }
  
  if (maxValor === 0) maxValor = 1;

  const totalBarras = grupos.length;
  const paddingX = 4;
  const paddingYTop = 5;
  const paddingYBottom = 15;
  
  const widthDisponivel = svgWidth - (paddingX * 2);
  const heightDisponivel = svgHeight - paddingYTop - paddingYBottom;
  
  const espacoPorGrupo = widthDisponivel / totalBarras;
  const barWidth = Math.min(espacoPorGrupo * 0.35, 8); 
  const gap = 1;

  let elements = '';

  grupos.forEach((g, index) => {
    const hEntrada = (g.entradas / maxValor) * heightDisponivel;
    const hSaida = (g.saidas / maxValor) * heightDisponivel;
    
    const centerX = paddingX + (index * espacoPorGrupo) + (espacoPorGrupo / 2);
    
    const xEntrada = centerX - barWidth - (gap / 2);
    const xSaida = centerX + (gap / 2);
    
    const yEntrada = svgHeight - paddingYBottom - hEntrada;
    const ySaida = svgHeight - paddingYBottom - hSaida;

    if (hEntrada > 0) {
      elements += `<rect x="${xEntrada}" y="${yEntrada}" width="${barWidth}" height="${hEntrada}" rx="1" fill="#16a34a" />`;
    }
    if (hSaida > 0) {
      elements += `<rect x="${xSaida}" y="${ySaida}" width="${barWidth}" height="${hSaida}" rx="1" fill="#dc2626" />`;
    }

    if (totalBarras <= 14 || index % 2 === 0) {
      elements += `<text x="${centerX}" y="${svgHeight - 4}" text-anchor="middle" font-size="4.5" fill="#6b7280" font-family="sans-serif">${g.rotulo}</text>`;
    }
  });

  return `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-auto mt-2 overflow-visible">
    ${elements}
  </svg>`;
}
