import { buildParasiteCycles, dataSaoPaulo } from '../lib/lunar';
import { UserProfile, AnamneseData, LabExamFile, DailyCheckin, Prescription, ParasiteCycle } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_pacificar_01',
  full_name: 'Camila Albuquerque Silva',
  email: 'camila.albuquerque@email.com',
  role: 'patient',
  weight: 64,
  height: 165,
  age: 36,
  phone: '(84) 99812-4433',
  journey_start_date: '2026-08-27',
  current_day: 6,
  avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  created_at: '2026-08-27T08:00:00Z'
};

export const DEFAULT_ADMIN_PROFILE: UserProfile = {
  id: 'usr_admin_ana_nesi',
  full_name: 'Dra. Ana Carla Nesi',
  email: 'anacarla.nesi@pacificar.med.br',
  role: 'admin',
  weight: 60,
  journey_start_date: '2026-08-01',
  current_day: 21,
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  created_at: '2026-08-01T08:00:00Z'
};

export const DEFAULT_ANAMNESE: AnamneseData = {
  id: 'ana_usr_01',
  user_id: 'usr_pacificar_01',
  main_complaints: [
    'Estufamento e inchaço abdominal severo após almoçar',
    'Cansaço matinal crônico e sensação de corpo pesado',
    'Fissura incontrolável por doces e pães ao final da tarde',
    'Enxaquecas frequentes nos finais de semana'
  ],
  main_complaints_text: 'Sinto que meu corpo está inflamado há pelo menos 2 anos. Minha digestão é muito lenta e fico com a barriga dura como se estivesse grávida de 5 meses.',
  symptom_duration: 'Mais de 2 anos',
  symptom_nature: 'flutuantes',
  factors_worsen: ['Estresse no trabalho', 'Consumo de trigo/pizza', 'Noites mal dormidas', 'Café em excesso'],
  frequent_conditions: ['gases', 'azia', 'enxaqueca', 'fadiga', 'rinite'],
  morning_energy: 'lento',
  evacuation_daily: false,
  evacuation_frequency: 1,
  bristol_baseline: 2, // Constipação com fezes duras nodosa
  digestive_power: 'irregular', // Vishama Agni (Vata)
  diet_type: 'Consumo frequente de pães, queijos, café expresso e doces refinados.',
  water_daily_liters: 1.2,
  climate_discomfort: 'frio',
  skin_tendency: 'seca',
  emotional_state: ['ansiedade', 'mente_acelerada', 'sobrecarga'],
  sleep_quality: 'acorda_madrugada',
  menstruation_data: {
    regular: true,
    cramps: true,
    pms_symptoms: ['inchaço nas mamas', 'irritabilidade', 'fissura de chocolate'],
    menopause: false
  },
  target_goals: [
    'Regular meu intestino para evacuar todos os dias sem esforço',
    'Eliminar o inchaço e a barriga dura',
    'Ter energia e disposição ao acordar sem precisar de 4 xícaras de café',
    'Aprender a cozinhar comida de verdade ayurvédica'
  ],
  completed: true,
  updated_at: '2026-08-27T10:30:00Z'
};

export const DEFAULT_LAB_EXAMS: LabExamFile[] = [
  {
    id: 'exam_01',
    user_id: 'usr_pacificar_01',
    file_name: 'Painel_Vitaminas_Ferritina_Camila.pdf',
    file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    exam_date: '2026-08-20',
    category: 'Vitaminas & Minerais',
    tags: ['Vitamina D3 (28 ng/mL - Baixa)', 'Ferritina (22 ng/mL - Baixa)', 'Vitamina B12 (310 pg/mL)', 'Zinco Sérico (68 mcg/dL)'],
    therapist_reviewed: true,
    therapist_notes: 'Ferritina e Vitamina D subótimas explicando a fadiga crônica. Vamos repor após o 21º dia com o desparasitamento concluído.',
    created_at: '2026-08-27T11:00:00Z'
  },
  {
    id: 'exam_02',
    user_id: 'usr_pacificar_01',
    file_name: 'Hemograma_PCR_Lipidograma.pdf',
    file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    exam_date: '2026-08-20',
    category: 'Sangue Geral',
    tags: ['PCR Ultrassensível (3.8 mg/L - Inflamação Subclínica)', 'Glicemia de Jejum (96 mg/dL)', 'Triglicerídeos (142 mg/dL)'],
    therapist_reviewed: true,
    therapist_notes: 'PCR elevada indicando inflamação endotelial e intestinal. Resposta esperada excelente ao protocolo Pacificar.',
    created_at: '2026-08-27T11:05:00Z'
  }
];

export const DEFAULT_CHECKINS: DailyCheckin[] = [
  {
    id: 'chk_d1',
    user_id: 'usr_pacificar_01',
    day_number: 1,
    energy_rating: 2,
    sleep_quality: 3,
    bloating_level: 4,
    sweet_craving: 3,
    bristol_type: 2,
    diet_compliance: 'total',
    water_intake: '2 Litros',
    self_care_done: true,
    tongue_scraping_done: true,
    warm_water_done: true,
    zeolite_taken: true,
    journal_notes: 'Primeiro dia sem glúten nem açúcar. Senti dor de cabeça leve à tarde, mas a sopa de inhame à noite me confortou.',
    created_at: '2026-08-27T21:15:00Z'
  },
  {
    id: 'chk_d2',
    user_id: 'usr_pacificar_01',
    day_number: 2,
    energy_rating: 3,
    sleep_quality: 3,
    bloating_level: 3,
    sweet_craving: 3,
    bristol_type: 2,
    diet_compliance: 'total',
    water_intake: '2.5 Litros',
    self_care_done: true,
    tongue_scraping_done: true,
    warm_water_done: true,
    zeolite_taken: true,
    journal_notes: 'A água morna pela manhã me deu um alívio enorme. A vontade de comer chocolate após o almoço foi forte, mas fiz o chá de canela.',
    created_at: '2026-08-28T21:00:00Z'
  },
  {
    id: 'chk_d3',
    user_id: 'usr_pacificar_01',
    day_number: 3,
    energy_rating: 3,
    sleep_quality: 4,
    bloating_level: 3,
    sweet_craving: 2,
    bristol_type: 3,
    diet_compliance: 'total',
    water_intake: '2.8 Litros',
    self_care_done: true,
    tongue_scraping_done: true,
    warm_water_done: true,
    zeolite_taken: true,
    journal_notes: 'A massagem nos pés com óleo de gergelim me fez dormir sem acordar de madrugada pela primeira vez no mês!',
    created_at: '2026-08-29T21:30:00Z'
  },
  {
    id: 'chk_d4',
    user_id: 'usr_pacificar_01',
    day_number: 4,
    energy_rating: 4,
    sleep_quality: 4,
    bloating_level: 2,
    sweet_craving: 2,
    bristol_type: 3,
    diet_compliance: 'total',
    water_intake: '3 Litros',
    self_care_done: true,
    tongue_scraping_done: true,
    warm_water_done: true,
    zeolite_taken: true,
    journal_notes: 'Minha barriga desinchou visivelmente! Minhas calças que estavam apertadas fecharam com folga.',
    created_at: '2026-08-30T21:10:00Z'
  },
  {
    id: 'chk_d5',
    user_id: 'usr_pacificar_01',
    day_number: 5,
    energy_rating: 4,
    sleep_quality: 5,
    bloating_level: 2,
    sweet_craving: 1,
    bristol_type: 4, // Bristol Ideal alcançado!
    diet_compliance: 'total',
    water_intake: '3 Litros',
    self_care_done: true,
    tongue_scraping_done: true,
    warm_water_done: true,
    zeolite_taken: true,
    journal_notes: 'Hoje tive fezes tipo 4 pela primeira vez sem fazer força! Me sinto tão mais disposta e com a mente leve.',
    created_at: '2026-08-31T21:40:00Z'
  }
];

export const DEFAULT_PRESCRIPTION: Prescription = {
  id: 'presc_01',
  user_id: 'usr_pacificar_01',
  dosha_predominant: 'Vata-Pitta',
  massala_recommended: 'Massala Vata',
  aromatherapy_oils: [
    'Óleo Essencial de Lavanda Francesa (Lavandula angustifolia) - 3 gotas antes de dormir',
    'Óleo Essencial de Laranja Doce (Citrus aurantium dulcis) - Inalação no difusor à tarde',
    'Óleo Essencial de Olíbano (Boswellia carterii) - 1 gota no topo da cabeça/coronário'
  ],
  carrier_oil: 'Óleo de Gergelim Prensado a Frio Morno (para massagem nos pés Padabhyanga)',
  supplements_recommended: [
    {
      name: 'Vitamina D3 + K2 (MK-7)',
      dosage: '5.000 UI + 100 mcg em gotas',
      timing: 'Pela manhã com refeição que contenha gordura boa (após D21)',
      reason: 'Otimização da imunidade, barreira intestinal e modulação de humor.'
    },
    {
      name: 'Bisglicinato de Magnésio',
      dosage: '350 mg',
      timing: 'À noite, 1 hora antes de dormir',
      reason: 'Relaxamento muscular, melhora do sono profundo e peristaltismo do cólon.'
    },
    {
      name: 'Metilcobalamina (Vitamina B12) + Metilfolato',
      dosage: '1.000 mcg + 400 mcg sublingual',
      timing: 'Pela manhã em jejum (após a Zeólita)',
      reason: 'Restauração dos níveis de energia celular e foco cognitivo.'
    },
    {
      name: 'Ashwagandha (Withania somnifera) Extrato Padronizado',
      dosage: '400 mg',
      timing: 'À tarde ou à noite',
      reason: 'Modulador adaptógeno do cortisol e equilibrador de Vata.'
    }
  ],
  therapeutic_teas: [
    'Chá CCF (Cominho + Coentro + Erva-Doce) morno após o almoço',
    'Infusão de Camomila com Anis Estrelado e Canela à noite'
  ],
  therapist_notes: 'Camila apresenta perfil clássico de Vata agravado com Pitta secundário (inflamação e enxaqueca). Excelente resposta inicial com melhora do Bristol de Tipo 2 para Tipo 4 no 5º dia. Manter Zeólita ininterrupta e preparar para a Lua Cheia de Setembro.',
  created_at: '2026-08-28T14:00:00Z',
  updated_at: '2026-08-28T14:00:00Z'
};

/** Ciclos da demo: as 5 próximas luas cheias a partir de hoje, calculadas (T-55). */
export const DEFAULT_PARASITE_CYCLES: ParasiteCycle[] = buildParasiteCycles(
  dataSaoPaulo(new Date()),
  'usr_pacificar_01'
);

export const OTHER_PATIENTS_LIST: UserProfile[] = [
  {
    id: 'usr_pacificar_01',
    full_name: 'Camila Albuquerque Silva',
    email: 'camila.albuquerque@email.com',
    role: 'patient',
    weight: 64,
    age: 36,
    journey_start_date: '2026-08-27',
    current_day: 6,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-08-27T08:00:00Z'
  },
  {
    id: 'usr_pacificar_02',
    full_name: 'Rodrigo Mendonça Prado',
    email: 'rodrigo.mendonca@email.com',
    role: 'patient',
    weight: 88,
    age: 42,
    journey_start_date: '2026-08-18',
    current_day: 15,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-08-18T08:00:00Z'
  },
  {
    id: 'usr_pacificar_03',
    full_name: 'Juliana Vasconcelos Rios',
    email: 'juliana.rios@email.com',
    role: 'patient',
    weight: 58,
    age: 29,
    journey_start_date: '2026-08-12',
    current_day: 21,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-08-12T08:00:00Z'
  },
  {
    id: 'usr_pacificar_04',
    full_name: 'Marcelo Augusto Fernandes',
    email: 'marcelo.augusto@email.com',
    role: 'patient',
    weight: 76,
    age: 49,
    journey_start_date: '2026-08-31',
    current_day: 2,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-08-31T08:00:00Z'
  }
];
