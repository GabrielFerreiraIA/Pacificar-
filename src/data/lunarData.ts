export interface LunarCycleItem {
  id: string;
  cycle_number: number;
  name: string;
  moon_phase: string;
  dates_range: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  day1_completed: boolean;
  day2_completed: boolean;
  day3_completed: boolean;
  charcoal_taken: boolean;
}

export const ZEOLITE_PROTOCOL_INFO = {
  total_days: 120,
  substance: 'Zeólita Clinoptilolita Micronizada Pura',
  dosage: '1 colher de café dosadora (3g a 5g) em 200ml a 300ml de água morna.',
  timing: 'Pela manhã, estritamente em jejum. Aguardar 30 a 40 minutos para o desjejum.',
  instructions: [
    'Nunca use colher de metal; use sempre colher de madeira, cerâmica ou plástico para preservar a carga iônica.',
    'Beba no mínimo 2,5 litros de água pura ao longo do dia para viabilizar a drenagem renal.',
    'A Zeólita não é absorvida pelo sangue; ela atua como um ímã intestinal que sai 100% nas fezes carregando os metais.'
  ],
  metals_chelated: ['Chumbo (Pb)', 'Mercúrio (Hg)', 'Cádmio (Cd)', 'Alumínio (Al)', 'Agrotóxicos']
};

export const PARASITE_LUNAR_CYCLES_2025_2026: LunarCycleItem[] = [
  {
    id: 'lunar_c1',
    cycle_number: 1,
    name: 'Ciclo 01: Limpeza Inicial & Quebra do Biofilme',
    moon_phase: 'Lua Cheia de Outubro',
    dates_range: '13 a 15 de Outubro de 2025',
    status: 'completed',
    day1_completed: true,
    day2_completed: true,
    day3_completed: true,
    charcoal_taken: true
  },
  {
    id: 'lunar_c2',
    cycle_number: 2,
    name: 'Ciclo 02: Eliminação de Formas Adultas',
    moon_phase: 'Lua Cheia de Novembro',
    dates_range: '11 a 13 de Novembro de 2025',
    status: 'in_progress',
    day1_completed: true,
    day2_completed: false,
    day3_completed: false,
    charcoal_taken: true
  },
  {
    id: 'lunar_c3',
    cycle_number: 3,
    name: 'Ciclo 03: Varredura de Ovos & Cistos Remanescentes',
    moon_phase: 'Lua Cheia de Dezembro',
    dates_range: '14 a 16 de Dezembro de 2025',
    status: 'upcoming',
    day1_completed: false,
    day2_completed: false,
    day3_completed: false,
    charcoal_taken: false
  },
  {
    id: 'lunar_c4',
    cycle_number: 4,
    name: 'Ciclo 04: Purificação Sistêmica & Tecidos Profundos',
    moon_phase: 'Lua Cheia de Janeiro',
    dates_range: '12 a 14 de Janeiro de 2026',
    status: 'upcoming',
    day1_completed: false,
    day2_completed: false,
    day3_completed: false,
    charcoal_taken: false
  },
  {
    id: 'lunar_c5',
    cycle_number: 5,
    name: 'Ciclo 05: Selagem do Terreno Biológico & Consolidação',
    moon_phase: 'Lua Cheia de Fevereiro',
    dates_range: '10 a 12 de Fevereiro de 2026',
    status: 'upcoming',
    day1_completed: false,
    day2_completed: false,
    day3_completed: false,
    charcoal_taken: false
  }
];

export const IVERMECTIN_POSOLOGY_TABLE = [
  {
    weight_range: '40 kg a 60 kg',
    tablets_per_cycle: 2,
    total_mg: '12 mg por dia',
    timing: '2 comprimidos com 1 copo de água após o café da manhã, nos 3 dias'
  },
  {
    weight_range: '60 kg a 80 kg',
    tablets_per_cycle: 3,
    total_mg: '18 mg por dia',
    timing: '3 comprimidos com 1 copo de água após o café da manhã, nos 3 dias'
  },
  {
    weight_range: 'Acima de 80 kg',
    tablets_per_cycle: 4,
    total_mg: '24 mg por dia',
    timing: '4 comprimidos com 1 copo de água após o café da manhã, nos 3 dias'
  }
];

export const ACTIVATED_CHARCOAL_INFO = {
  name: 'Carvão ativado 250 mg',
  dosage: '2 comprimidos de 250 mg',
  timing: 'À noite, antes de dormir, nos 3 dias de uso da ivermectina',
  purpose:
    'Adsorve a amônia e as toxinas liberadas pelos parasitas mortos, evitando dor de cabeça e letargia'
};

export const HYDROGEN_PEROXIDE_INFO = {
  name: 'Água oxigenada 10 volumes',
  dosage: '10 gotas em um pouco de água',
  timing: 'Após as três principais refeições, nos 3 dias',
  purpose: 'Aumenta a oxigenação gástrica e fragiliza parasitas anaeróbicos'
};

/** Regras do protocolo, conforme o material clínico oficial. */
export const PARASITE_PROTOCOL_RULES = [
  'A desparasitação é feita na lua cheia, podendo começar até o terceiro dia de lua cheia.',
  'A ivermectina é tomada por 3 dias seguidos, sempre após o café da manhã.',
  'Depois há uma pausa, e o ciclo se repete na lua cheia do mês seguinte.',
  'São 5 ciclos mensais consecutivos. Depois disso, para-se e refaz-se no ano seguinte.',
  'Carvão ativado e água oxigenada acompanham apenas os 3 dias de cada ciclo.'
];
