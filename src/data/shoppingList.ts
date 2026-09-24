/**
 * Lista oficial de compras do PACIFICAR — transcrição do material
 * "Lista de sugestão de ervas para o PACIFICAR" de Ana Carla Nesi.
 * O paciente deve ter estes itens em casa antes do Dia 1.
 */

export interface ShoppingGroup {
  id: string;
  title: string;
  note?: string;
  icon: string;
  items: { name: string; detail?: string }[];
}

export const SHOPPING_GROUPS: ShoppingGroup[] = [
  {
    id: 'chas',
    title: 'Chás e ervas',
    icon: 'leaf',
    note: 'Prefira a granel, de fonte confiável. Gengibre, hortelã e manjericão sempre frescos.',
    items: [
      { name: 'Camomila', detail: 'Calmante, refresca Pitta' },
      { name: 'Erva-doce', detail: 'Digestiva, alivia gases' },
      { name: 'Erva-cidreira', detail: 'Acalma a mente à noite' },
      { name: 'Capim-limão', detail: 'Diurético leve, digestivo' },
      { name: 'Espinheira-santa', detail: 'Protege a mucosa gástrica' },
      { name: 'Folhas de sene', detail: 'Laxante — use só se orientado' },
      { name: 'Carqueja', detail: 'Amarga, drena o fígado' },
      { name: 'Mulungu', detail: 'Relaxante natural' },
      { name: 'Gengibre fresco', detail: 'Acende o Agni' },
      { name: 'Hortelã fresco', detail: 'Refrescante' },
      { name: 'Manjericão fresco', detail: 'Tônico digestivo' }
    ]
  },
  {
    id: 'massalas',
    title: 'Massalas de especiarias',
    icon: 'flame',
    note: 'Já existem prontas, mas você pode fazer em casa: uma colher de chá de cada especiaria misturada em um recipiente.',
    items: [
      {
        name: 'Massala de Vata',
        detail: 'Canela, cardamomo, cominho, cravo e noz-moscada'
      },
      { name: 'Massala de Pitta', detail: 'Coentro, cominho, erva-doce e hortelã' },
      {
        name: 'Massala de Kapha',
        detail: 'Cúrcuma, gengibre em pó, pimenta-do-reino preta, cravo da Índia e mostarda'
      }
    ]
  },
  {
    id: 'especiarias',
    title: 'Especiarias puras',
    icon: 'sparkles',
    items: [
      { name: 'Cardamomo' },
      { name: 'Coentro em semente' },
      { name: 'Cominho', detail: 'Semente e pó' },
      { name: 'Canela', detail: 'Pó e em pau' },
      { name: 'Cravo' },
      { name: 'Gengibre', detail: 'Raiz fresca e em pó' },
      { name: 'Pimenta-do-reino' },
      { name: 'Assa-fétida' },
      { name: 'Cúrcuma em pó pura' }
    ]
  },
  {
    id: 'graos',
    title: 'Sementes e grãos',
    icon: 'wheat',
    items: [{ name: 'Feijão verde' }, { name: 'Lentilha' }]
  },
  {
    id: 'farinhas',
    title: 'Farelos e farinhas',
    icon: 'wheat',
    note: 'Sempre sem glúten — confira o rótulo.',
    items: [
      { name: 'Aveia em flocos finos', detail: 'Sem glúten' },
      { name: 'Aveia em flocos grossos', detail: 'Sem glúten' },
      { name: 'Goma de tapioca' }
    ]
  },
  {
    id: 'oleos',
    title: 'Óleos e manteiga',
    icon: 'droplet',
    items: [
      { name: 'Manteiga ghee', detail: 'Ou manteiga da terra, de garrafa' },
      { name: 'Óleo de coco prensado a frio', detail: 'Para ingerir e para passar no corpo' },
      { name: 'Óleo de rícino', detail: 'Massagem do intestino' }
    ]
  },
  {
    id: 'ferramentas',
    title: 'Ferramentas de autocuidado',
    icon: 'tool',
    items: [
      {
        name: 'Raspador de língua de cobre',
        detail: 'Para raspar a língua e retirar toxinas diariamente, em jejum'
      }
    ]
  }
];
