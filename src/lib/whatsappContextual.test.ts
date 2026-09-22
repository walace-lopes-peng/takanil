import { describe, it, expect } from 'vitest';
import { 
  obterMensagemWhatsAppContextual, 
  obterLabelWhatsAppContextual, 
  obterLinkWhatsAppContextual,
  gerarMensagemCompartilhamentoPublico,
  compartilharWhatsAppComFoto
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

  it('deve fazer fallback para window.open quando navigator.share não estiver disponível', async () => {
    let urlAberta = '';
    (globalThis as any).window = {
      open: (url: string) => {
        urlAberta = url;
      }
    };

    await compartilharWhatsAppComFoto({
      nome: 'Rex',
      especie: 'Cão',
      situacao_urgencia: 'Nenhuma',
    });

    expect(urlAberta).toContain('https://wa.me/5535998687395?text=');
    expect(urlAberta).toContain(encodeURIComponent('Olá, Takanil! Vi o *Rex* no app e gostaria de saber sobre a adoção.'));
  });

  it('deve gerar mensagem contextual e humanizada para compartilhamento público com link do app', () => {
    const animal = {
      id: 'abc-123',
      nome: 'Pipoca',
      especie: 'Cão',
      sexo: 'Macho',
      situacao_urgencia: 'Machucado/Risco',
    };
    const msg = gerarMensagemCompartilhamentoPublico(animal, 'https://hub-takanil.vercel.app/?animal=abc-123');

    expect(msg).toContain('🚨 AJUDA URGENTE: o *Pipoca* precisa de cuidados veterinários na ONG Takanil!');
    expect(msg).toContain('👉 Veja a foto e detalhes no app:\nhttps://hub-takanil.vercel.app/?animal=abc-123');
  });

  it('deve gerar mensagem pública de animal encontrado na rua no plural para ninhada', () => {
    const ninhada = {
      id: 'gatinhos-456',
      especie: 'Gato',
      sexo: 'Misto (Ninhada)',
      situacao_urgencia: 'Achado na Rua',
      localizacao: 'Na rua',
    };
    const msg = gerarMensagemCompartilhamentoPublico(ninhada, 'https://hub-takanil.vercel.app/?animal=gatinhos-456');

    expect(msg).toContain('🧭 ANIMAIS ENCONTRADOS NA RUA: esses gatinhos resgatados na rua foram resgatados e procuram uma família ou seus tutores! 🐾❤️');
    expect(msg).toContain('https://hub-takanil.vercel.app/?animal=gatinhos-456');
  });

  it('não deve colocar nomes em ninhadas, usando termos como gatinhos ou cãezinhos', () => {
    const ninhadaComNome = {
      nome: 'Ninhada da Praça',
      especie: 'Gato',
      sexo: 'Misto (Ninhada)',
      situacao_urgencia: 'Nenhuma',
    };
    const msgGato = obterMensagemWhatsAppContextual(ninhadaComNome);
    expect(msgGato).toContain('Olá, Takanil! Vi esses gatinhos no app e gostaria de saber sobre a adoção.');
    expect(msgGato).not.toContain('Ninhada da Praça');

    const ninhadaCao = {
      nome: 'Filhotes do Posto',
      especie: 'Cão',
      sexo: 'Misto (Ninhada)',
      situacao_urgencia: 'Machucado/Risco',
    };
    const msgCao = gerarMensagemCompartilhamentoPublico(ninhadaCao);
    expect(msgCao).toContain('🚨 AJUDA URGENTE: esses cãezinhos precisam de cuidados veterinários na ONG Takanil!');
    expect(msgCao).not.toContain('Filhotes do Posto');
  });

  it('deve incluir link do app na mensagem direta da Takanil quando fornecido', () => {
    const animal = {
      nome: 'Rex',
      especie: 'Cão',
      sexo: 'Macho',
      situacao_urgencia: 'Nenhuma',
    };
    const msg = obterMensagemWhatsAppContextual(animal, 'https://hub-takanil.vercel.app/?animal=123');
    expect(msg).toContain('Ver no app: https://hub-takanil.vercel.app/?animal=123');
  });
});

