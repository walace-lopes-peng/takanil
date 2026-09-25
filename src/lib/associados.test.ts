import { describe, it, expect } from 'vitest';
import {
  limparTelefone,
  formatarTelefone,
  validarTelefone,
  formatarInstagram,
  calcularStatusAssociado,
  gerarMensagemAssociado,
  gerarLinkWhatsApp,
  CHAVE_PIX_OFICIAL,
} from './associados';

describe('associados - utilitários de telefone e instagram', () => {
  it('limpa caracteres não numéricos do telefone', () => {
    expect(limparTelefone('(35) 99812-3456')).toBe('35998123456');
    expect(limparTelefone('35 99812-3456')).toBe('35998123456');
    expect(limparTelefone(null)).toBe('');
  });

  it('formata telefones com 11 e 10 dígitos', () => {
    expect(formatarTelefone('35998123456')).toBe('(35) 99812-3456');
    expect(formatarTelefone('3533631234')).toBe('(35) 3363-1234');
    expect(formatarTelefone('5535998123456')).toBe('(35) 99812-3456');
  });

  it('valida telefones corretamente', () => {
    expect(validarTelefone('35998123456')).toBe(true);
    expect(validarTelefone('3533631234')).toBe(true);
    expect(validarTelefone('12345')).toBe(false);
    expect(validarTelefone(null)).toBe(true); // Opcional
  });

  it('formata o handle do instagram adicionando @ se ausente e tratando URLs', () => {
    expect(formatarInstagram('mariasilva')).toBe('@mariasilva');
    expect(formatarInstagram('@mariasilva')).toBe('@mariasilva');
    expect(formatarInstagram('   @@mariasilva  ')).toBe('@mariasilva');
    expect(formatarInstagram('https://www.instagram.com/mariasilva/')).toBe('@mariasilva');
    expect(formatarInstagram('https://instagram.com/mariasilva?igshid=123')).toBe('@mariasilva');
    expect(formatarInstagram('https://m.instagram.com/mariasilva/')).toBe('@mariasilva');
    expect(formatarInstagram('instagram.com/mariasilva')).toBe('@mariasilva');
    expect(formatarInstagram('https://www.instagram.com/_u/mariasilva?igsh=abc')).toBe('@mariasilva');
    expect(formatarInstagram('Perfil no Insta: https://instagram.com/mariasilva')).toBe('@mariasilva');
    expect(formatarInstagram('')).toBe('');
    expect(formatarInstagram(null)).toBe('');
  });
});

describe('associados - cálculo de status de pagamento', () => {
  it('retorna "em_dia" se pagamento foi feito no mesmo mês corrente', () => {
    const dataRef = new Date(2026, 8, 25); // 25/09/2026
    const associado = {
      dia_vencimento: 10,
      ultimo_pagamento: '2026-09-10',
      ativo: true,
    };
    const info = calcularStatusAssociado(associado, dataRef);
    expect(info.status).toBe('em_dia');
    expect(info.rotulo).toBe('Em dia');
  });

  it('retorna "vence_hoje" se hoje é o dia de vencimento e não pagou este mês', () => {
    const dataRef = new Date(2026, 8, 10); // 10/09/2026
    const associado = {
      dia_vencimento: 10,
      ultimo_pagamento: '2026-08-10',
      ativo: true,
    };
    const info = calcularStatusAssociado(associado, dataRef);
    expect(info.status).toBe('vence_hoje');
    expect(info.rotulo).toBe('Vence hoje!');
  });

  it('retorna "a_vencer" se o vencimento está próximo no mês', () => {
    const dataRef = new Date(2026, 8, 25); // 25/09/2026
    const associado = {
      dia_vencimento: 28,
      ultimo_pagamento: '2026-08-28',
      ativo: true,
    };
    const info = calcularStatusAssociado(associado, dataRef);
    expect(info.status).toBe('a_vencer');
    expect(info.rotulo).toContain('Vence em 3 dias');
  });

  it('retorna "atrasado" se já passou do dia do vencimento no mês corrente', () => {
    const dataRef = new Date(2026, 8, 25); // 25/09/2026
    const associado = {
      dia_vencimento: 10,
      ultimo_pagamento: '2026-08-10',
      ativo: true,
    };
    const info = calcularStatusAssociado(associado, dataRef);
    expect(info.status).toBe('atrasado');
    expect(info.rotulo).toContain('Venceu dia 10');
  });

  it('retorna "atrasado" e rótulo Inativo se ativo for false', () => {
    const dataRef = new Date(2026, 8, 25);
    const associado = {
      dia_vencimento: 10,
      ultimo_pagamento: '2026-09-10',
      ativo: false,
    };
    const info = calcularStatusAssociado(associado, dataRef);
    expect(info.rotulo).toBe('Inativo');
  });
});

describe('associados - geração de mensagens e links', () => {
  const associado = {
    nome: 'Maria Silva',
    valor_mensalidade: 50,
    dia_vencimento: 10,
  };

  it('gera mensagem com primeiro nome, valor e chave PIX', () => {
    const msg = gerarMensagemAssociado(associado, 'lembrete');
    expect(msg).toContain('Oi, Maria!');
    expect(msg).toContain('R$ 50,00');
    expect(msg).toContain('dia 10');
    expect(msg).toContain(CHAVE_PIX_OFICIAL);
  });

  it('gera mensagem de atraso empática e respeitosa', () => {
    const msg = gerarMensagemAssociado(associado, 'atraso');
    expect(msg).toContain('Oi, Maria!');
    expect(msg).toContain('ainda não foi confirmada neste mês');
    expect(msg).toContain(CHAVE_PIX_OFICIAL);
  });

  it('gera mensagem de agradecimento', () => {
    const msg = gerarMensagemAssociado(associado, 'agradecimento');
    expect(msg).toContain('agradecer a sua contribuição');
    expect(msg).toContain('R$ 50,00');
  });

  it('gera link correto para o WhatsApp', () => {
    const link = gerarLinkWhatsApp('35998123456', 'Oi Maria');
    expect(link).toContain('https://wa.me/5535998123456?text=Oi%20Maria');
  });
});
