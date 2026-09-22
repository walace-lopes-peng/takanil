import { describe, it, expect } from 'vitest';
import { 
  obterMensagemWhatsAppContextual, 
  obterLabelWhatsAppContextual, 
  obterLinkWhatsAppContextual 
} from './whatsappContextual';

describe('whatsappContextual', () => {
  it('deve gerar mensagem natural com Instagram para animal com nome', () => {
    const animal = {
      nome: 'Rex',
      especie: 'Cão',
      sexo: 'Macho',
      situacao_urgencia: 'Nenhuma',
      instagram_url: 'https://instagram.com/p/rex123',
    };

    const msg = obterMensagemWhatsAppContextual(animal);
    const link = obterLinkWhatsAppContextual(animal);

    expect(msg).toContain('Olá, Takanil! Vi o *Rex* no app e gostaria de saber sobre a adoção.');
    expect(msg).toContain('Post no Instagram: https://instagram.com/p/rex123');
    expect(msg).not.toContain('Foto:');
    // Garantir que não contenha emojis
    expect(msg).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
    expect(link).toContain('https://wa.me/5535998687395?text=');
  });

  it('deve tratar animal sem nome carinhosamente com detalhes quando disponíveis', () => {
    const semNomeGato = {
      especie: 'Gato',
      sexo: 'Macho',
      fase_vida: 'Filhote',
      localizacao: 'Na rua',
      situacao_urgencia: 'Nenhuma',
    };
    const msgGato = obterMensagemWhatsAppContextual(semNomeGato);
    expect(msgGato).toContain('Olá, Takanil! Vi esse gatinho filhote resgatado na rua no app e gostaria de saber sobre a adoção.');

    const desconhecidoCao = {
      nome: 'Desconhecido',
      especie: 'Cão',
      sexo: 'Macho',
      fase_vida: 'Filhote',
      localizacao: 'Abrigo Takanil',
      situacao_urgencia: 'Nenhuma',
    };
    const msgCao = obterMensagemWhatsAppContextual(desconhecidoCao);
    expect(msgCao).toContain('Olá, Takanil! Vi esse cachorrinho filhote (no Abrigo Takanil) no app e gostaria de saber sobre a adoção.');
    expect(msgCao).not.toContain('Desconhecido');

    const semNomeCadela = {
      especie: 'Cão',
      sexo: 'Fêmea',
      situacao_urgencia: 'Nenhuma',
    };
    const msgCadela = obterMensagemWhatsAppContextual(semNomeCadela);
    expect(msgCadela).toContain('Olá, Takanil! Vi essa cadelinha no app e gostaria de saber sobre a adoção.');
  });

  it('deve gerar mensagem clara para Urgência Médica', () => {
    const animal = {
      nome: 'Mel',
      especie: 'Gato',
      sexo: 'Fêmea',
      situacao_urgencia: 'Machucado/Risco',
    };

    const msg = obterMensagemWhatsAppContextual(animal);
    expect(msg).toContain('Olá, Takanil! Vi no app que a *Mel* precisa de cuidados médicos e gostaria de ajudar com o tratamento.');
  });

  it('deve gerar mensagem clara para animal Desaparecido', () => {
    const animal = {
      nome: 'Bob',
      especie: 'Cão',
      sexo: 'Macho',
      situacao_urgencia: 'Desaparecido',
    };

    const msg = obterMensagemWhatsAppContextual(animal);
    expect(msg).toContain('Olá, Takanil! Vi o aviso no app sobre o *Bob* que está desaparecido(a) e tenho informações.');
  });

  it('deve retornar rótulo e ícone contextual adequados', () => {
    const labelUrgente = obterLabelWhatsAppContextual({ situacao_urgencia: 'Machucado/Risco' });
    expect(labelUrgente.texto).toBe('Ajudar Tratamento');
    expect(labelUrgente.icone).toBe('🩺');

    const labelDesaparecido = obterLabelWhatsAppContextual({ situacao_urgencia: 'Desaparecido' });
    expect(labelDesaparecido.texto).toBe('Tenho Informações');
    expect(labelDesaparecido.icone).toBe('🔍');

    const labelPadrao = obterLabelWhatsAppContextual({ situacao_urgencia: 'Nenhuma' });
    expect(labelPadrao.texto).toBe('Quero Adotar');
    expect(labelPadrao.icone).toBe('💬');
  });
});
