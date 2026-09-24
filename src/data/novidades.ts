import packageJson from '../../package.json';

export interface ItemNovidade {
  icone: string;
  titulo: string;
  descricao: string;
}

export const VERSAO_ATUAL = packageJson.version;

// Chave usada pelo localStorage para controlar se o modal já foi visto.
// Usa apenas MAJOR.MINOR — patches (ex: 0.12.1) não reexibem o modal.
// Só atualize este valor quando houver novidades reais para as voluntárias.
export const VERSAO_NOVIDADES = packageJson.version.split('.').slice(0, 2).join('.');

export const NOVIDADES_VERSAO: ItemNovidade[] = [
  // --- Novas Funcionalidades ---
  {
    icone: '📋',
    titulo: '1. Ficha Detalhada do Pet com Toque no Card',
    descricao: 'Toque em qualquer card da vitrine para abrir a ficha completa do animal, com foto em alta definição, características, histórico e cuidados clínicos.'
  },
  {
    icone: '✨',
    titulo: '2. [Gestão] Menu Rápido de Status com Botão "Desfazer"',
    descricao: 'Altere o status do animal direto pelo menu discreto dos cards. Uma notificação com o botão "Desfazer" fica ativa por 5 segundos para reverter toques acidentais.'
  },
  {
    icone: '💬',
    titulo: '3. Conversa Contextual no WhatsApp',
    descricao: 'Botão na ficha que abre o WhatsApp oficial da ONG com mensagem pronta para adoção (com o nome do animal), ajuda em tratamentos ou notícias de desaparecidos.'
  },
  {
    icone: '✂️',
    titulo: '4. Enquadramento Vertical de Fotos Padronizado',
    descricao: 'Nova ferramenta de recorte que garante que as fotos dos animais fiquem perfeitamente centralizadas e nítidas nos cards da vitrine.'
  },
  // --- Melhorias & Refinamentos ---
  {
    icone: '🐾',
    titulo: '5. Catálogo Integrado com Pets Adotados',
    descricao: 'Animais que já ganharam um lar agora continuam visíveis na tela com o badge verde [✅ Adotado], além do filtro de coração para comemorar os Finais Felizes.'
  },
  {
    icone: '💉',
    titulo: '6. Registro Detalhado de Vacinas Aplicadas',
    descricao: 'Acompanhe exatamente quais vacinas cada cão ou gato já tomou (V8/V10, Antirrábica, Giárdia, etc.), facilitando o controle veterinário.'
  },
];
