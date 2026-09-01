import { describe, it, expect } from 'vitest';
import { obterIntervaloPorAtalho } from './filtrosData';

describe('filtrosData - obterIntervaloPorAtalho', () => {
  // Data de referência: Quarta-feira, 15 de Outubro de 2025
  const dataReferencia = new Date(2025, 9, 15); // Mês 9 = Outubro

  it('deve calcular corretamente o atalho "hoje"', () => {
    const intervalo = obterIntervaloPorAtalho('hoje', dataReferencia);
    expect(intervalo).toEqual({
      inicio: '2025-10-15',
      fim: '2025-10-15',
    });
  });

  it('deve calcular corretamente "esta_semana" (segunda-feira até hoje)', () => {
    // 15/10/2025 (Quarta) -> Segunda-feira foi dia 13/10/2025
    const intervalo = obterIntervaloPorAtalho('esta_semana', dataReferencia);
    expect(intervalo).toEqual({
      inicio: '2025-10-13',
      fim: '2025-10-15',
    });
  });

  it('deve calcular corretamente "semana_passada" (segunda a domingo da semana anterior)', () => {
    // Semana anterior a 13/10: de 06/10/2025 a 12/10/2025
    const intervalo = obterIntervaloPorAtalho('semana_passada', dataReferencia);
    expect(intervalo).toEqual({
      inicio: '2025-10-06',
      fim: '2025-10-12',
    });
  });

  it('deve calcular corretamente "este_mes" (dia 1 do mês até hoje)', () => {
    const intervalo = obterIntervaloPorAtalho('este_mes', dataReferencia);
    expect(intervalo).toEqual({
      inicio: '2025-10-01',
      fim: '2025-10-15',
    });
  });

  it('deve calcular corretamente "mes_passado" (dia 1 ao último dia do mês anterior)', () => {
    // Mês anterior a Outubro: Setembro (30 dias) -> 01/09/2025 a 30/09/2025
    const intervalo = obterIntervaloPorAtalho('mes_passado', dataReferencia);
    expect(intervalo).toEqual({
      inicio: '2025-09-01',
      fim: '2025-09-30',
    });
  });
});
