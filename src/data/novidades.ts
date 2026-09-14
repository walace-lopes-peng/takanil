export interface ItemNovidade {
  icone: string;
  titulo: string;
  descricao: string;
}

export const VERSAO_ATUAL = '0.10.1';

export const NOVIDADES_VERSAO: ItemNovidade[] = [
  {
    icone: '📱',
    titulo: '1. Visualização em Grade ou Lista',
    descricao: 'Escolha como ver os animais tocando em [ ▦ ] ou [ ☰ ] no topo para alternar entre 2 fotos lado a lado ou lista compacta.'
  },
  {
    icone: '🔍',
    titulo: '2. Busca Rápida por Nome',
    descricao: 'Digite o nome do animal na nova barra de pesquisa para localizá-lo instantaneamente.'
  },
  {
    icone: '🏷️',
    titulo: '3. Filtros por Sexo e Cuidados',
    descricao: 'Abra o botão "Filtrar" para encontrar apenas Machos, Fêmeas, Castrados ou Vacinados.'
  },
  {
    icone: '🔎',
    titulo: '4. Zoom de Foto em Tela Cheia',
    descricao: 'Toque em qualquer foto de animal para ampliá-la em alta definição.'
  },
  {
    icone: '📸',
    titulo: '5. Instagram Oficial & Posts',
    descricao: 'Acesse o Instagram da ONG pelo novo botão flutuante e veja os posts dos animais direto nos cards.'
  }
];
