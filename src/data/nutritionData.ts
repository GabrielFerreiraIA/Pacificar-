export interface MassalaItem {
  name: string;
  targetDosha: string;
  description: string;
  ingredients: string[];
  instructions: string;
  color: string;
}

export interface RecipeDBItem {
  id: string;
  title: string;
  category: string;
  prepTime: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  ayurvedicBenefits: string;
  tags: string[];
}

export const NUTRITION_GUIDELINES = {
  restricted: [
    {
      category: 'Zero Glúten',
      icon: '🌾',
      examples: 'Trigo, centeio, cevada, malte, pães tradicionais, massas, biscoitos, bolos.',
      reason: 'A gliadina abre as junções intestinais (zonulina), causando hiperpermeabilidade (Leaky Gut) e neuroinflamação.'
    },
    {
      category: 'Zero Leite & Derivados',
      icon: '🥛',
      examples: 'Leite de vaca, queijos, iogurtes, manteiga comum, requeijão, whey protein.',
      reason: 'A caseína A1 e a lactose geram muco inflamatório (Ama), sobrecarga linfática e disbiose.'
    },
    {
      category: 'Zero Açúcar Refinado',
      icon: '🍬',
      examples: 'Açúcar branco, mascavo, demerara, doces, refrigerantes, sucos de caixinha, xaropes.',
      reason: 'Alimenta fungos (Candida) e parasitas intestinais, rouba magnésio e causa picos de insulina.'
    },
    {
      category: 'Zero Álcool',
      icon: '🍷',
      examples: 'Cervejas, vinhos, destilados, drinks, coquetéis.',
      reason: 'Bloqueia a desintoxicação e autofagia hepática noturna, fragmenta o sono profundo e inflama a mucosa gástrica.'
    }
  ],
  allowed: [
    {
      category: 'Raízes & Tubérculos (Base de Energia)',
      icon: '🍠',
      examples: 'Macaxeira (mandioca/aipim), batata-doce, inhame, cará, batata-baroa (mandioquinha).',
      tip: 'Cozinhe bem e sirva sempre morna com manteiga ghee e ervas digestivas.'
    },
    {
      category: 'Gorduras Terapêuticas & Óleos Nobres',
      icon: '🧈',
      examples: 'Manteiga Ghee (manteiga clarificada pura), azeite de oliva extravirgem, óleo de coco, leite de coco caseiro.',
      tip: 'O Ghee conduz os fitoquímicos aos tecidos profundos e nutre o cérebro sem inflamar.'
    },
    {
      category: 'Proteínas Nobres & Leguminosas Tratadas',
      icon: '🍳',
      examples: 'Ovos caipiras, peixes frescos, frango orgânico/caipira, feijão fradinho/verde (demolhado 12h), lentilhas rosas, grão-de-bico.',
      tip: 'Sempre cozinhe leguminosas com louro, cominho e gengibre para eliminar antinutrientes.'
    },
    {
      category: 'Ervas Frescas & Especiarias Digestivas',
      icon: '🌿',
      examples: 'Cúrcuma pura, gengibre, cominho, sementes de coentro, erva-doce (funcho), canela do Ceilão, cardamomo, alecrim, hortelã.',
      tip: 'Acendem o Agni (fogo digestivo), drenam toxinas (Ama) e alcalinizam o trato digestivo.'
    }
  ]
};

export const MASSALAS_DATA: MassalaItem[] = [
  {
    name: 'Massala Vata (Acalmar, Aquecer & Eliminar Gases)',
    targetDosha: 'Para Dosha Vata (Ar & Éter)',
    description: 'Indicada para quem sofre com digestão irregular, cólicas, barriga estufada de ar, constipação ressecada e ansiedade.',
    ingredients: [
      '2 colheres de sopa de sementes de cominho',
      '2 colheres de sopa de sementes de erva-doce',
      '1 colher de sopa de gengibre em pó',
      '1 colher de sopa de cúrcuma pura',
      '1 colher de café de canela em pó',
      '1/2 colher de café de noz-moscada ralada'
    ],
    instructions: 'Toste levemente as sementes em fogo baixo por 1 minuto até aromatizar. Triture no pilão ou moedor e misture os pós. Refogue 1/2 colher de chá no Ghee ao preparar raízes, legumes ou sopas.',
    color: '#BA7A3C'
  },
  {
    name: 'Massala Pitta (Refrescar, Harmonizar & Desinflamar)',
    targetDosha: 'Para Dosha Pitta (Fogo & Água)',
    description: 'Indicada para quem tem tendência a queimação gástrica, azia, refluxo, fezes soltas ou irritabilidade.',
    ingredients: [
      '3 colheres de sopa de sementes de coentro',
      '2 colheres de sopa de sementes de erva-doce',
      '1 colher de sopa de cúrcuma pura',
      '1 colher de chá de cardamomo moído',
      '1 colher de chá de hortelã seca',
      '1/2 colher de chá de cominho'
    ],
    instructions: 'Moa finamente as sementes de coentro, erva-doce e cardamomo. Misture a cúrcuma e hortelã. Não superaqueça. Excelente no preparo de peixes, abóbora e feijões leves.',
    color: '#3C8E5E'
  },
  {
    name: 'Massala Kapha (Ativar, Desinchar & Acelerar Agni)',
    targetDosha: 'Para Dosha Kapha (Terra & Água)',
    description: 'Indicada para quem acorda com lentidão, retenção de líquidos, muco respiratório e digestão muito pesada.',
    ingredients: [
      '2 colheres de sopa de gengibre em pó',
      '2 colheres de sopa de sementes de mostarda',
      '1 colher de sopa de pimenta-do-reino moída',
      '1 colher de sopa de cúrcuma pura',
      '1 colher de sopa de cominho',
      '1 colher de chá de cravo moído'
    ],
    instructions: 'Toste as sementes de mostarda até estalarem. Moa e misture com o gengibre e a cúrcuma. Refogue com azeite em legumes verdes, lentilhas ou caldos noturnos.',
    color: '#B04C2E'
  },
  {
    name: 'Massala Universal Pacificar (Tridosha)',
    targetDosha: 'Equilibrada para Todos os Doshas',
    description: 'Fórmula coringa criada pela Dra. Ana Carla Nesi para desinflamar e acender a digestão com segurança no dia a dia.',
    ingredients: [
      '2 colheres de sopa de cominho em pó',
      '2 colheres de sopa de coentro em pó',
      '2 colheres de sopa de cúrcuma pura',
      '1 colher de sopa de gengibre em pó',
      '1 colher de chá de canela em pó',
      '1 colher de chá de erva-doce em pó'
    ],
    instructions: 'Misture todos os ingredientes em um pote de vidro hermético. Use 1 colher de chá no preparo do almoço e do jantar.',
    color: '#C88D48'
  }
];

export const RECIPES_DATABASE: RecipeDBItem[] = [
  {
    id: 'kitchari',
    title: 'Kitchari Tridosha de Lentilha Rosa & Arroz Basmati com Ghee',
    category: 'lunch',
    prepTime: '25 min',
    description: 'O prato terapêutico clássico da medicina ayurvédica. Altamente digestivo, reconstrói a mucosa intestinal e equilibra os 3 doshas.',
    ingredients: [
      '1/2 xícara de lentilha rosa ou mung dal (demolhada por 2h)',
      '1/2 xícara de arroz basmati ou agulhinha lavado',
      '1 colher de sopa de Manteiga Ghee',
      '1 colher de chá de Massala Universal Pacificar',
      '1 pedaço de gengibre ralado (1 colher de chá)',
      '1 colher de chá de cúrcuma pura',
      '3 xícaras de água fervente',
      'Sal marinho e coentro fresco a gosto'
    ],
    instructions: [
      'Em uma panela, aqueça o Ghee em fogo brando e adicione a Massala, o gengibre e a cúrcuma até soltarem aroma (cerca de 30 segundos).',
      'Adicione a lentilha escorrida e o arroz, mexendo bem para envolver os grãos no Ghee temperado.',
      'Despeje a água fervente e o sal marinho. Abaixe o fogo, tampe e deixe cozinhar por 15 a 20 minutos até ficar cremoso.',
      'Finalize com bastante coentro fresco picado e um fio de azeite extravirgem.'
    ],
    ayurvedicBenefits: 'Nutre profundamente todos os tecidos (Dhatus) sem exigir esforço do Agni (fogo digestivo).',
    tags: ['Sem Glúten', 'Sem Lactose', 'Kitchari', 'Detox']
  },
  {
    id: 'macaxeira_ghee',
    title: 'Macaxeira Dourada no Ghee com Ovos Mexidos com Cúrcuma',
    category: 'breakfast',
    prepTime: '20 min',
    description: 'Café da manhã nutritivo, rico em amido resistente e colina, perfeito para manter a saciedade e clareza mental.',
    ingredients: [
      '150g de macaxeira (aipim) cozida em toletes',
      '1 colher de chá de Manteiga Ghee',
      '2 ovos caipiras frescos',
      '1 pitada de cúrcuma + cominho',
      'Sal marinho e cheiro-verde a gosto'
    ],
    instructions: [
      'Cozinhe a macaxeira em água com sal até ficar bem macia.',
      'Em uma frigideira, doure os toletes no Ghee por 3 minutos de cada lado.',
      'Bata os ovos levemente com a cúrcuma e prepare ovos mexidos cremosos em fogo brando.',
      'Sirva com folhas de coentro ou cebolinha fresca.'
    ],
    ayurvedicBenefits: 'Aterra o Dosha Vata, estabiliza a glicemia matinal e fornece energia de queima lenta.',
    tags: ['Café da Manhã', 'Sem Glúten', 'Energia', 'Raiz']
  },
  {
    id: 'cuscuz_nordestino',
    title: 'Cuscuz Nordestino Puro com Sementes Tostadas e Ovos Poché',
    category: 'breakfast',
    prepTime: '15 min',
    description: 'Clássico regional limpo, leve e sem glúten. Aquece o corpo e traz saciedade reconfortante.',
    ingredients: [
      '1 xícara de flocos de milho não-transgênico',
      '1/2 xícara de água morna com 1 pitada de sal',
      '1 colher de sopa de sementes de girassol ou abóbora',
      '2 ovos caipiras',
      '1 colher de café de Ghee'
    ],
    instructions: [
      'Hidrate o floco de milho com água morna por 10 minutos.',
      'Cozinhe na cuscuzeira no vapor por 8 minutos.',
      'Faça ovos poché com gema mole em água quente.',
      'Monte o cuscuz fumegante com o Ghee e as sementes tostadas por cima.'
    ],
    ayurvedicBenefits: 'Conforto digestivo, zero caseína e rica fonte de minerais e zinco nas sementes.',
    tags: ['Café da Manhã', 'Sem Glúten', 'Nordeste']
  },
  {
    id: 'sopa_abobora_gengibre',
    title: 'Creme Aveludado de Abóbora Cabotiá com Gengibre e Alecrim',
    category: 'dinner',
    prepTime: '25 min',
    description: 'Jantar noturno restaurador. Facilita o esvaziamento gástrico antes de dormir e induz sono profundo.',
    ingredients: [
      '300g de abóbora cabotiá picada com casca bem lavada',
      '1 pedaço de 3cm de gengibre fresco fatiado',
      '1 ramo de alecrim fresco',
      '1 colher de café de noz-moscada ralada',
      '1 colher de sopa de azeite extravirgem',
      'Sal marinho a gosto'
    ],
    instructions: [
      'Cozinhe a abóbora com o gengibre e o alecrim em água até amolecer.',
      'Retire o ramo de alecrim e bata a abóbora com a água do cozimento no liquidificador até virar creme.',
      'Volte à panela, tempere com o sal e a noz-moscada.',
      'Sirva bem quente com azeite extravirgem.'
    ],
    ayurvedicBenefits: 'A noz-moscada atua como indutor natural do sono profundo relaxando o sistema nervoso.',
    tags: ['Jantar', 'Sono Profundo', 'Sem Glúten']
  },
  {
    id: 'cha_ccf',
    title: 'Chá Tridosha CCF (Cominho, Coentro e Funcho)',
    category: 'tea',
    prepTime: '8 min',
    description: 'A infusão digestiva mais consagrada do Ayurveda. Desincha, estimula os rins e dissipa gases.',
    ingredients: [
      '1/2 colher de chá de sementes inteiras de cominho',
      '1/2 colher de chá de sementes inteiras de coentro',
      '1/2 colher de chá de sementes inteiras de erva-doce (funcho)',
      '500ml de água pura'
    ],
    instructions: [
      'Ferva a água e adicione as sementes inteiras.',
      'Tampe e mantenha em fogo baixíssimo por 5 minutos.',
      'Desligue, aguarde 3 minutos, coe e tome morno ao longo do dia.'
    ],
    ayurvedicBenefits: 'Purifica o trato urinário, acende o fogo digestivo e auxilia na evacuação regular.',
    tags: ['Chá', 'Digestivo', 'Desinchaço']
  },
  {
    id: 'golden_milk',
    title: 'Golden Milk Noturno (Leite Dourado de Coco com Cúrcuma e Canela)',
    category: 'tea',
    prepTime: '6 min',
    description: 'Bebida milenar ayurvédica para alívio de dores articulares, desinflamação celular e indução do sono.',
    ingredients: [
      '200ml de leite de coco caseiro ou leite de amêndoas',
      '1 colher de café de cúrcuma pura em pó',
      '1/2 colher de café de canela em pó',
      '1 pitada de pimenta-do-reino (para potencializar a curcumina em 2000%)',
      '1/2 colher de café de óleo de coco ou Ghee'
    ],
    instructions: [
      'Aqueça o leite vegetal com a cúrcuma, a canela e a pimenta em fogo baixo sem ferver.',
      'Adicione o óleo de coco ou Ghee e misture bem com um mini batedor.',
      'Beba quente 45 minutos antes de deitar.'
    ],
    ayurvedicBenefits: 'Potente ação anti-inflamatória sistêmica que repara tecidos durante o sono profundo.',
    tags: ['Noturno', 'Anti-inflamatório', 'Sem Lactose']
  }
];

export const LABEL_TRAPS = [
  {
    hiddenName: 'Maltodextrina / Xarope de Milho / Xarope de Glicose',
    category: 'Açúcar Oculto',
    realSource: 'Açúcar de altíssimo índice glicêmico (>110) que dispara a insulina mais rápido que o açúcar puro.',
    foundIn: 'Temperos prontos, pós para bebidas, produtos "fit", suplementos baratos e barras de proteína.',
    cleanAlternative: 'Temperos naturais (alho, cebola, massalas) e doçura natural de canela e raízes.'
  },
  {
    hiddenName: 'Caseinato de Sódio / Soro de Leite / Whey Protein',
    category: 'Derivado Lácteo Oculto',
    realSource: 'Proteína inflamatória do leite concentrada que ativa inflamação crônica e muco digestivo.',
    foundIn: 'Biscoitos "sem lactose", pães artesanais falsos, molhos prontos, empanados e pastas.',
    cleanAlternative: 'Manteiga Ghee pura, leites de sementes e coco frescos.'
  },
  {
    hiddenName: 'Amido Modificado / Proteína Vegetal Hidrolisada de Trigo',
    category: 'Glúten Oculto',
    realSource: 'Derivado de trigo de alta concentração de gliadina para espessar produtos industriais.',
    foundIn: 'Molhos de tomate de pacote, embutidos (peito de peru, presunto), sopas em pó e shoyu comum.',
    cleanAlternative: 'Polvilho doce/azedo, farinha de mandioca pura, biomassa de banana verde.'
  },
  {
    hiddenName: 'Gordura Vegetal Hidrogenada / Gordura Interesterificada',
    category: 'Gordura Inflamatória',
    realSource: 'Óleo quimicamente alterado que enrijece membranas celulares e gera estresse oxidativo.',
    foundIn: 'Margarinas, biscoitos recheados, tortas congeladas, pães de forma industriais.',
    cleanAlternative: 'Azeite de oliva extravirgem, Manteiga Ghee e óleo de coco prensado a frio.'
  }
];
