export type UserRole = 'patient' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  weight: number;
  height?: number;
  age?: number;
  phone?: string;
  journey_start_date: string; // YYYY-MM-DD
  current_day: number; // 1-21
  avatar_url?: string;
  created_at: string;
}

export interface AnamneseData {
  id: string;
  user_id: string;
  main_complaints: string[];
  main_complaints_text: string;
  symptom_duration: string;
  symptom_nature: 'estaveis' | 'flutuantes' | 'piorando' | 'em_crises';
  factors_worsen: string[];
  frequent_conditions: string[]; // ['enxaqueca', 'gases', 'azia', 'refluxo', 'insonia', 'fadiga', 'rinite', 'dores_articulares']
  morning_energy: 'vitalizado' | 'cansado' | 'lento' | 'exausto';
  evacuation_daily: boolean;
  evacuation_frequency: number; // 1, 2, 3...
  bristol_baseline: number; // 1 to 7
  digestive_power: 'forte' | 'regular' | 'lenta' | 'irregular' | 'hiperativa'; // Agni
  diet_type: string;
  water_daily_liters: number;
  climate_discomfort: 'frio' | 'calor' | 'umidade' | 'vento' | 'nenhum';
  skin_tendency: 'seca' | 'oleosa' | 'mista' | 'sensivel_inflamada';
  emotional_state: string[]; // ['ansiedade', 'irritabilidade', 'desanimo', 'mente_acelerada', 'sobrecarga']
  sleep_quality: 'profundo_reparador' | 'leve_agitado' | 'dificuldade_pegar' | 'acorda_madrugada';
  menstruation_data?: {
    regular: boolean;
    cramps: boolean;
    pms_symptoms: string[];
    menopause: boolean;
  };
  target_goals: string[];
  completed: boolean;
  updated_at: string;
}

export interface LabExamFile {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  exam_date: string;
  category: string; // 'Sangue Geral', 'Vitaminas & Minerais', 'Hormônios', 'Microbiota'
  tags: string[];
  therapist_reviewed: boolean;
  therapist_notes?: string;
  created_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  day_number: number; // 1-21
  energy_rating: number; // 1 to 5
  sleep_quality: number; // 1 to 5
  bloating_level: 1 | 2 | 3 | 4; // 1=Nenhum, 2=Leve, 3=Moderado, 4=Intenso
  sweet_craving: 1 | 2 | 3; // 1=Zero, 2=Leve, 3=Incontrolável
  bristol_type: number; // 1 to 7
  diet_compliance: 'total' | 'partial' | 'none';
  water_intake: string;
  self_care_done: boolean;
  tongue_scraping_done: boolean;
  warm_water_done: boolean;
  zeolite_taken: boolean;
  journal_notes: string;
  created_at: string;
}

export interface Prescription {
  id: string;
  user_id: string;
  dosha_predominant: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridosha';
  massala_recommended: 'Massala Vata' | 'Massala Pitta' | 'Massala Kapha' | 'Massala Digestiva Universal';
  aromatherapy_oils: string[];
  carrier_oil: string;
  supplements_recommended: {
    name: string;
    dosage: string;
    timing: string;
    reason: string;
  }[];
  therapeutic_teas: string[];
  therapist_notes: string;
  created_at: string;
  updated_at: string;
}

export interface ParasiteCycle {
  id: string;
  user_id: string;
  cycle_number: number; // 1 to 5
  moon_name: string;
  moon_date: string; // YYYY-MM-DD
  day1_completed: boolean;
  day2_completed: boolean;
  day3_completed: boolean;
  charcoal_taken: boolean;
  h2o2_taken: boolean;
  completed: boolean;
}

export interface JourneyDayContent {
  day_number: number;
  week_number: 1 | 2 | 3;
  theme: string;
  title: string;
  subtitle: string;
  audio_title: string;
  audio_duration: string;
  audio_summary: string;
  audio_transcript: string;
  audio_url?: string;
  daily_focus: string;
  ayurvedic_quote: string;
  meals: {
    breakfast: { title: string; desc: string; tip?: string };
    lunch: { title: string; desc: string; tip?: string };
    dinner: { title: string; desc: string; tip?: string };
    tea_or_snack?: { title: string; desc: string };
  };
  self_care_practice: {
    title: string;
    description: string;
    benefits: string;
    duration: string;
  };
  checklist: string[];
}
