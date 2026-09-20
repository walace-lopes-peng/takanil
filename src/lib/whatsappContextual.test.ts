import { describe, it, expect } from 'vitest';
import { 
  obterMensagemWhatsAppContextual, 
  obterLabelWhatsAppContextual, 
  obterLinkWhatsAppContextual 
} from './whatsappContextual';

describe('whatsappContextual', () => {
  it('deve gerar mensagem e rótulo corretos para Adoção (Normal)', () => {
    const animal = {
      nome: 'Rex',
      especie: 'Cão',
      fase_vida: 'Adulto',
      situacao_urgencia: 'Nenhuma',
    };

    const msg = obterMensagemWhatsAppContextual(animal);
    const label = obterLabelWhatsAppContextual(animal);
    const link = obterLinkWhatsAppContextual(animal);

    expect(msg).toContain('Rex (Cão, Adulto)');
    expect(msg).toContain('gostaria de informações sobre como adotá-lo(a)');
    expect(label.texto).toBe('Quero Adotar');
    expect(link).toContain('https://wa.me/5535998687395?text=');
  });

  it('deve gerar mensagem e rótulo corretos para Urgência Médica', () => {
    const animal = {
      nome: 'Mel',
      especie: 'Gato',
      situacao_urgencia: 'Machucado/Risco',
    };

    const msg = obterMensagemWhatsAppContextual(animal);
    const label = obterLabelWhatsAppContextual(animal);

    expect(msg).toContain('Mel (Gato) está precisando de cuidados médicos');
    expect(msg).toContain('ajudar com doação ou tratamento');
    expect(label.texto).toBe('Ajudar Tratamento');
  });

  it('deve gerar mensagem e rótulo corretos para Desaparecido', () => {
    const animal = {
      nome: 'Bob',
      especie: 'Cão',
      localizacao: 'Centro',
      situacao_urgencia: 'Desaparecido',
    };

    const msg = obterMensagemWhatsAppContextual(animal);
    const label = obterLabelWhatsAppContextual(animal);

    expect(msg).toContain('Bob (Cão) que está desaparecido(a) em Centro');
    expect(label.texto).toBe('Tenho Informações');
  });

  it('deve gerar mensagem e rótulo corretos para Achado na Rua', () => {
    const animal = {
      nome: 'Caramelo',
      especie: 'Cão',
      localizacao: 'Vila Carneiro',
      situacao_urgencia: 'Achado na Rua',
    };

    const msg = obterMensagemWhatsAppContextual(animal);
    const label = obterLabelWhatsAppContextual(animal);

    expect(msg).toContain('Caramelo (Cão) resgatado(a) na rua em Vila Carneiro');
    expect(label.texto).toBe('Informações');
  });
});
