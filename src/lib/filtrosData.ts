export type TipoAtalhoData = 'hoje' | 'esta_semana' | 'semana_passada' | 'este_mes' | 'mes_passado' | 'personalizado';

export interface IntervaloData {
  inicio: string; // Formato YYYY-MM-DD
  fim: string;    // Formato YYYY-MM-DD
}

function formatarDataISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function obterIntervaloPorAtalho(atalho: TipoAtalhoData, refData: Date = new Date()): IntervaloData {
  const hoje = new Date(refData.getFullYear(), refData.getMonth(), refData.getDate());
  
  switch (atalho) {
    case 'hoje': {
      const dataStr = formatarDataISO(hoje);
      return { inicio: dataStr, fim: dataStr };
    }

    case 'esta_semana': {
      // Segunda-feira da semana atual até hoje
      // No JS: 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
      const diaSemana = hoje.getDay();
      const diffParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
      
      const segunda = new Date(hoje);
      segunda.setDate(hoje.getDate() + diffParaSegunda);

      return {
        inicio: formatarDataISO(segunda),
        fim: formatarDataISO(hoje),
      };
    }

    case 'semana_passada': {
      // Segunda a domingo da semana anterior
      const diaSemana = hoje.getDay();
      const diffParaSegundaAtual = diaSemana === 0 ? -6 : 1 - diaSemana;
      
      const segundaSemanaPassada = new Date(hoje);
      segundaSemanaPassada.setDate(hoje.getDate() + diffParaSegundaAtual - 7);

      const domingoSemanaPassada = new Date(segundaSemanaPassada);
      domingoSemanaPassada.setDate(segundaSemanaPassada.getDate() + 6);

      return {
        inicio: formatarDataISO(segundaSemanaPassada),
        fim: formatarDataISO(domingoSemanaPassada),
      };
    }

    case 'este_mes': {
      // Dia 1 do mês atual até hoje
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      return {
        inicio: formatarDataISO(primeiroDia),
        fim: formatarDataISO(hoje),
      };
    }

    case 'mes_passado': {
      // Dia 1 ao último dia do mês anterior
      const primeiroDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      const ultimoDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      return {
        inicio: formatarDataISO(primeiroDiaMesPassado),
        fim: formatarDataISO(ultimoDiaMesPassado),
      };
    }

    case 'personalizado':
    default: {
      const dataStr = formatarDataISO(hoje);
      return { inicio: dataStr, fim: dataStr };
    }
  }
}
