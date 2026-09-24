/**
 * Módulo "Preparo" — o que ter em casa antes do Dia 01.
 *
 * `buyUrl` fica vazio até Ana Carla enviar os links de sua preferência
 * (Turita no Mercado Livre, raspador na Holistix). Enquanto estiver vazio,
 * a interface mostra a orientação de onde procurar em vez de um botão morto.
 */

export interface PreparoItem {
  id: string;
  title: string;
  essential: boolean;
  icon: string;
  what: string;
  how?: string;
  warning?: string;
  buyLabel?: string;
  buyUrl?: string;
  buyHint?: string;
}

export const PREPARO_ITEMS: PreparoItem[] = [
  {
    id: 'raspador',
    title: 'Raspador de língua de cobre',
    essential: true,
    icon: 'scraper',
    what: 'Durante a noite o corpo empurra toxinas para a superfície da língua — é a saburra que o Ayurveda chama de Ama. Raspar remove essa camada antes que você a engula de volta.',
    how: 'Em jejum, logo ao acordar: raspe a língua de trás para a frente, 5 a 7 vezes, lavando o raspador a cada passada. Só depois beba água e escove os dentes.',
    warning:
      'Nunca use escova de dentes para raspar a língua — ela espalha a saburra em vez de removê-la. Se ainda não tem o raspador, uma colher de sopa grande serve como solução temporária.',
    buyLabel: 'Onde comprar o raspador',
    buyHint: 'Ana recomenda a Holistix. O link entra aqui assim que ela enviar.'
  },
  {
    id: 'zeolita',
    title: 'Zeólita clinoptilolita (Turita)',
    essential: true,
    icon: 'gem',
    what: 'Mineral vulcânico micronizado que age como um ímã dentro do intestino, capturando alumínio, chumbo, mercúrio e cádmio. Não é absorvido pelo sangue: sai 100% nas fezes carregando os metais.',
    how: '1 colher de café (3 a 5 g) em 200 a 300 ml de água morna, pela manhã em jejum. Aguarde 30 a 40 minutos antes do desjejum. Use colher de madeira, cerâmica ou plástico — nunca metal.',
    buyLabel: 'Comprar Zeólita Turita',
    buyHint: 'Marca Turita, disponível no Mercado Livre. Link a confirmar com Ana.'
  },
  {
    id: 'desparasitacao',
    title: 'Kit de desparasitação lunar',
    essential: true,
    icon: 'moon',
    what: 'Três itens que trabalham juntos nos 3 dias de cada lua cheia: ivermectina (dose calculada pelo seu peso), carvão ativado 250 mg e água oxigenada 10 volumes.',
    how: 'A ivermectina vai após o café da manhã nos 3 dias. O carvão ativado, 2 comprimidos à noite, adsorve a amônia liberada pelos parasitas. A água oxigenada, 10 gotas em água, após as três refeições principais.',
    warning:
      'A ivermectina exige receita e acompanhamento. Converse com a Ana antes de iniciar este protocolo.',
    buyHint: 'Farmácia de sua confiança. A dose exata aparece na aba Protocolos.'
  },
  {
    id: 'massalas',
    title: 'Massalas ayurvédicas',
    essential: true,
    icon: 'flame',
    what: 'As três misturas de especiarias que acendem o Agni, o fogo digestivo: Massala Vata, Massala Pitta e Massala Kapha.',
    how: 'Já existem prontas, mas dá para fazer em casa: uma colher de chá de cada especiaria da mistura, guardada em um vidro fechado.',
    buyHint: 'Casas de produtos naturais ou empórios de especiarias. A composição está na aba Nutrição.'
  },
  {
    id: 'gorduras',
    title: 'Manteiga ghee e óleo de coco',
    essential: true,
    icon: 'droplet',
    what: 'As gorduras que substituem a manteiga comum e os óleos refinados durante os 21 dias. O ghee conduz os fitoquímicos aos tecidos profundos sem gerar muco.',
    how: 'Ghee (ou manteiga da terra, de garrafa) para cozinhar. Óleo de coco prensado a frio serve para ingerir e para passar no corpo.',
    buyHint: 'Supermercado ou casa de produtos naturais.'
  },
  {
    id: 'ricino',
    title: 'Óleo de rícino',
    essential: false,
    icon: 'droplet',
    what: 'Usado na automassagem do abdômen, ajuda a mobilizar o intestino preso e a soltar o Ama acumulado.',
    how: 'Massagem circular no sentido horário sobre o abdômen, com o óleo levemente morno, antes de dormir.',
    buyHint: 'Farmácias e casas de produtos naturais.'
  },
  {
    id: 'chas',
    title: 'Chás e ervas digestivas',
    essential: false,
    icon: 'leaf',
    what: 'Camomila, erva-doce, erva-cidreira, capim-limão, espinheira-santa, carqueja, mulungu, além de gengibre, hortelã e manjericão frescos.',
    how: 'A lista completa, com a função de cada erva, está na aba Nutrição.',
    buyHint: 'Prefira a granel, de fonte confiável.'
  }
];
