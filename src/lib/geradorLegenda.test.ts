import { describe, it, expect } from 'vitest';
import { obterConcordancia, gerarLegendaAnimal } from './geradorLegenda';

describe('geradorLegenda - Concordância Gramatical', () => {
  it('deve concordar corretamente para Fêmea Cão', () => {
    const c = obterConcordancia('Fêmea', 'Cão');
    expect(c.substantivo).toBe('cadelinha');
    expect(c.pronomeReto).toBe('Ela');
    expect(c.lindo).toBe('linda');
    expect(c.castrado).toBe('castrada');
  });

  it('deve concordar corretamente para Fêmea Gato', () => {
    const c = obterConcordancia('Fêmea', 'Gato');
    expect(c.substantivo).toBe('gatinha');
    expect(c.pronomeReto).toBe('Ela');
    expect(c.lindo).toBe('linda');
  });

  it('deve concordar corretamente para Macho Cão', () => {
    const c = obterConcordancia('Macho', 'Cão');
    expect(c.substantivo).toBe('cãozinho');
    expect(c.pronomeReto).toBe('Ele');
    expect(c.castrado).toBe('castrado');
  });

  it('deve concordar corretamente para Ninhada / Misto', () => {
    const c = obterConcordancia('Misto (Ninhada)', 'Cão');
    expect(c.pronomeReto).toBe('Eles');
    expect(c.lindo).toBe('lindos');
  });
});

describe('geradorLegenda - Geração de Textos', () => {
  it('deve gerar texto para animal desaparecido com nome e bairro', () => {
    const legenda = gerarLegendaAnimal({
      nome: 'Margarete',
      especie: 'Cão',
      sexo: 'Fêmea',
      situacao: 'Desaparecido',
      bairro: 'Vila Carneiro'
    });

    expect(legenda).toContain('MARGARETE ESTÁ DESAPARECIDA');
    expect(legenda).toContain('Vila Carneiro');
    expect(legenda).toContain('Ela é muito amada');
  });

  it('deve gerar texto para animal achado na rua', () => {
    const legenda = gerarLegendaAnimal({
      especie: 'Gato',
      sexo: 'Macho',
      situacao: 'Achado na Rua',
      bairro: 'Tronqueiras'
    });

    expect(legenda).toContain('ANIMAL ENCONTRADO NA RUA');
    expect(legenda).toContain('Tronqueiras');
    expect(legenda).toContain('gatinho lindo');
  });

  it('deve sortear os 5 modelos sem quebrar', () => {
    for (let i = 0; i < 5; i++) {
      const legenda = gerarLegendaAnimal({
        nome: 'Rex',
        especie: 'Cão',
        sexo: 'Macho',
        porte: 'Pequeno',
        castrado: 'Sim'
      }, i);
      expect(legenda.length).toBeGreaterThan(30);
    }
  });
});
