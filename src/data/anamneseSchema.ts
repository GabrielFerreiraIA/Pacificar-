/**
 * Anamnese Ayurvédica PACIFICAR — transcrição fiel do questionário clínico
 * de 10 páginas de Ana Carla Nesi (CRP 17/2833).
 *
 * Estrutura orientada a dados: um único renderizador desenha o formulário
 * inteiro, o que mantém a experiência consistente e o conteúdo editável
 * sem tocar em componentes.
 */

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'time'
  | 'number'
  | 'radio'
  | 'multi'
  | 'bristol';

export interface Question {
  id: string;
  label: string;
  /** Texto de apoio persistente, exibido sob o rótulo. */
  hint?: string;
  type: QuestionType;
  options?: string[];
  /** Legenda didática sob cada opção — usada nos cards de escolha. */
  optionHints?: Record<string, string>;
  placeholder?: string;
  required?: boolean;
  /** Mostra a pergunta somente quando outra resposta casa com o valor. */
  showIf?: { id: string; equals: string | string[] };
  /** Atributos de teclado/autofill móvel. */
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  autoComplete?: string;
}

export interface AnamneseSection {
  id: string;
  title: string;
  /** Uma frase que explica por que o bloco existe — reduz a fricção clínica. */
  purpose: string;
  icon: string;
  optional?: boolean;
  /** O bloco inteiro só aparece quando a condição é satisfeita. */
  showIf?: { id: string; equals: string | string[] };
  questions: Question[];
}

export const ANAMNESE_SECTIONS: AnamneseSection[] = [
  /* ── 1 ─────────────────────────────────────────────────────── */
  {
    id: 'identificacao',
    title: 'Você',
    purpose: 'Para que a Ana te chame pelo nome e entenda seu contexto de vida.',
    icon: 'user',
    questions: [
      {
        id: 'nome',
        label: 'Nome completo',
        type: 'text',
        required: true,
        placeholder: 'Como você se chama',
        autoComplete: 'name'
      },
      {
        id: 'nascimento',
        label: 'Data de nascimento',
        type: 'date',
        required: true,
        autoComplete: 'bday'
      },
      {
        id: 'genero',
        label: 'Sexo biológico',
        hint: 'Define quais blocos clínicos fazem sentido para você — o de ciclo menstrual, por exemplo.',
        type: 'radio',
        required: true,
        options: ['Feminino', 'Masculino']
      },
      { id: 'ocupacao', label: 'Ocupação', type: 'text', placeholder: 'O que você faz' },
      {
        id: 'situacao_civil',
        label: 'Situação civil',
        type: 'radio',
        options: ['Solteiro(a)', 'Casado(a)', 'União estável', 'Divorciado(a)', 'Viúvo(a)']
      },
      {
        id: 'cidade_atual',
        label: 'Cidade em que vive atualmente',
        type: 'text',
        autoComplete: 'address-level2'
      },
      { id: 'natural_de', label: 'Natural de', type: 'text', placeholder: 'Cidade onde nasceu' }
    ]
  },

  /* ── 2 ─────────────────────────────────────────────────────── */
  {
    id: 'queixas',
    title: 'Suas queixas',
    purpose: 'O ponto de partida do tratamento: o que mais te incomoda hoje.',
    icon: 'alert',
    questions: [
      {
        id: 'queixas_principais',
        label: 'Principais queixas',
        hint: 'Escreva com suas palavras, sem pressa. Não existe resposta errada.',
        type: 'textarea',
        required: true,
        placeholder: 'Ex.: intestino preso, cansaço ao acordar, enxaqueca...'
      },
      {
        id: 'tempo_sintomas',
        label: 'Há quanto tempo vem tendo esses sintomas?',
        type: 'text',
        placeholder: 'Ex.: cerca de 2 anos'
      },
      {
        id: 'evolucao_sintomas',
        label: 'Eles são:',
        type: 'radio',
        options: [
          'Estáveis',
          'Flutuantes',
          'Estão gradualmente melhorando',
          'Gradualmente piorando',
          'Rapidamente melhorando',
          'Rapidamente piorando'
        ]
      },
      {
        id: 'fatores_agravantes',
        label: 'Quais fatores agravam esses problemas?',
        type: 'textarea',
        placeholder: 'Ex.: estresse no trabalho, noites mal dormidas, certos alimentos...'
      },
      {
        id: 'sofre_frequentemente',
        label: 'Você sofre frequentemente de:',
        hint: 'Marque quantas opções fizerem sentido.',
        type: 'multi',
        options: [
          'Gripe',
          'Tosse',
          'Hiperacidez',
          'Dores de cabeça frequentes',
          'Problemas respiratórios',
          'Questões ginecológicas',
          'Refluxo sem azia',
          'Nenhuma das anteriores'
        ]
      },
      {
        id: 'desde_quando_intensidade',
        label: 'Desde quando e em que intensidade?',
        hint: 'Responda apenas se marcou algum item acima.',
        type: 'textarea'
      }
    ]
  },

  /* ── 3 ─────────────────────────────────────────────────────── */
  {
    id: 'energia',
    title: 'Energia ao acordar',
    purpose: 'A manhã revela a qualidade da digestão e do sono da noite anterior.',
    icon: 'sunrise',
    questions: [
      {
        id: 'disposicao_manha',
        label: 'Você se sente disposto(a) quando se levanta pela manhã?',
        type: 'radio',
        options: ['Sim, acordo bem', 'Mais ou menos', 'Não, acordo pesado(a)']
      },
      {
        id: 'mal_estar_manha',
        label: 'Se não, sente peso, mal-estar ou dores no corpo? Descreva.',
        type: 'textarea',
        showIf: { id: 'disposicao_manha', equals: ['Mais ou menos', 'Não, acordo pesado(a)'] }
      },
      {
        id: 'tempo_mal_estar',
        label: 'Há quanto tempo você se sente assim?',
        type: 'text',
        showIf: { id: 'disposicao_manha', equals: ['Mais ou menos', 'Não, acordo pesado(a)'] }
      }
    ]
  },

  /* ── 4 ─────────────────────────────────────────────────────── */
  {
    id: 'digestao',
    title: 'Digestão e eliminações',
    purpose:
      'No Ayurveda, as fezes são o exame clínico mais honesto do seu Agni (fogo digestivo).',
    icon: 'flame',
    questions: [
      {
        id: 'evacuacao_diaria',
        label: 'Você tem evacuações intestinais diariamente?',
        type: 'radio',
        required: true,
        options: ['Sim', 'Não']
      },
      {
        id: 'evacuacao_frequencia',
        label: 'Quantas vezes por dia?',
        type: 'number',
        inputMode: 'numeric',
        placeholder: 'Ex.: 1',
        showIf: { id: 'evacuacao_diaria', equals: 'Sim' }
      },
      {
        id: 'consistencia_fezes',
        label: 'As fezes são usualmente:',
        type: 'radio',
        options: ['Macias', 'Médias', 'Duras']
      },
      {
        id: 'bristol_base',
        label: 'Na Escala de Bristol, qual é mais frequente?',
        hint: 'Toque no tipo que mais se parece com o seu padrão habitual.',
        type: 'bristol',
        required: true
      },
      {
        id: 'dor_evacuacao',
        label: 'Algum problema (dor, ardor, etc.) no momento da evacuação?',
        type: 'textarea'
      },
      {
        id: 'desconforto_urinar',
        label: 'Você tem algum desconforto para urinar?',
        type: 'textarea'
      }
    ]
  },

  /* ── 5 ─────────────────────────────────────────────────────── */
  {
    id: 'historico',
    title: 'Histórico de saúde',
    purpose: 'O que já aconteceu no seu corpo orienta o que é seguro propor agora.',
    icon: 'history',
    questions: [
      {
        id: 'historico_familiar',
        label: 'Alguma história familiar de problemas de saúde semelhantes aos seus?',
        type: 'textarea'
      },
      {
        id: 'doencas_cirurgias',
        label: 'Liste as doenças principais e cirurgias prévias que você já sofreu.',
        type: 'textarea'
      },
      {
        id: 'medicamentos',
        label: 'Liste os medicamentos que você está tomando.',
        hint: 'Inclua dose e horário sempre que souber. Isso evita interações.',
        type: 'textarea'
      },
      {
        id: 'usa_suplementos',
        label: 'Você toma algum suplemento atualmente?',
        type: 'radio',
        options: ['Sim', 'Não']
      },
      {
        id: 'suplementos',
        label: 'Quais suplementos e em que dose?',
        hint: 'Ex.: creatina, whey protein, vitamina D3, vitamina B12, ômega 3, magnésio...',
        type: 'textarea',
        showIf: { id: 'usa_suplementos', equals: 'Sim' }
      }
    ]
  },

  /* ── 6 ─────────────────────────────────────────────────────── */
  {
    id: 'alimentacao',
    title: 'Alimentação',
    purpose: 'A base do Pacificar é comida de verdade — começamos de onde você está.',
    icon: 'utensils',
    questions: [
      {
        id: 'tipo_dieta',
        label: 'Sua dieta é:',
        type: 'radio',
        options: [
          'Estritamente vegetariana',
          'Lacto-vegetariana',
          'Ovo-lacto-vegetariana',
          'Não vegetariana'
        ],
        optionHints: {
          'Estritamente vegetariana': 'Nenhum alimento de origem animal.',
          'Lacto-vegetariana': 'Vegetais mais laticínios e queijos.',
          'Ovo-lacto-vegetariana': 'Vegetais, ovos e laticínios.',
          'Não vegetariana': 'Inclui carnes, aves e peixes.'
        }
      },
      {
        id: 'refeicao_principal',
        label: 'Qual é sua principal refeição (a de maior volume)?',
        type: 'radio',
        options: ['Café da manhã', 'Almoço', 'Jantar']
      },
      {
        id: 'fome_intensa',
        label: 'Você tem fome intensa na hora das refeições?',
        type: 'radio',
        options: ['Sim', 'Às vezes', 'Não']
      },
      {
        id: 'horario_mais_fome',
        label: 'Qual o horário em que sente mais fome?',
        type: 'time'
      },
      {
        id: 'digestao_qualidade',
        label: 'Sua digestão é:',
        type: 'radio',
        required: true,
        options: ['Boa', 'Razoável', 'Fraca']
      },
      {
        id: 'refeicoes_tipicas',
        label: 'Descreva suas refeições típicas diárias.',
        hint: 'Um dia comum: o que come no café, almoço, lanche e jantar.',
        type: 'textarea'
      },
      {
        id: 'sabor_preferido',
        label: 'Qual sabor você mais gosta?',
        hint: 'Os seis sabores (rasas) do Ayurveda indicam desequilíbrios dos doshas.',
        type: 'multi',
        options: ['Doce', 'Salgado', 'Ácido', 'Picante', 'Amargo', 'Adstringente']
      },
      {
        id: 'alimentos_agradam',
        label: 'Quais alimentos mais agradam seu paladar?',
        type: 'textarea'
      },
      {
        id: 'come_frequentemente',
        label: 'Você come frequentemente:',
        type: 'multi',
        options: [
          'Doces',
          'Sobremesas',
          'Frituras',
          'Chocolates',
          'Fast food',
          'Iogurte',
          'Sorvetes',
          'Milk shakes'
        ]
      },
      {
        id: 'alimentos_desconforto',
        label: 'Existe algum alimento que cria desconforto quando você ingere?',
        type: 'textarea'
      }
    ]
  },

  /* ── 7 ─────────────────────────────────────────────────────── */
  {
    id: 'corpo_rotina',
    title: 'Corpo e rotina',
    purpose: 'Clima, pele, movimento e hábitos desenham sua constituição (prakriti).',
    icon: 'activity',
    questions: [
      {
        id: 'clima_desconfortavel',
        label: 'Qual tipo de clima você se sente mais desconfortável?',
        type: 'multi',
        options: ['Frio', 'Quente', 'Seco', 'Chuvoso']
      },
      {
        id: 'tendencia_pele',
        label: 'Sua pele tem tendência predominante:',
        type: 'radio',
        options: ['Seca', 'Oleosa', 'Média', 'Mista (certas áreas oleosas e outras secas)']
      },
      {
        id: 'exercicio_intensidade',
        label: 'Pratica exercício físico?',
        type: 'radio',
        options: ['Suave', 'Moderado', 'Vigoroso', 'Não pratico']
      },
      {
        id: 'exercicio_frequencia',
        label: 'Com que frequência?',
        type: 'radio',
        options: ['Regularmente', 'Ocasionalmente', 'Nunca'],
        showIf: { id: 'exercicio_intensidade', equals: ['Suave', 'Moderado', 'Vigoroso'] }
      },
      {
        id: 'exercicio_tipo',
        label: 'Que tipo de exercício?',
        type: 'multi',
        options: [
          'Aeróbico',
          'Musculação',
          'Esportes',
          'Natação',
          'Yoga',
          'Tai chi',
          'Pilates',
          'Dança',
          'Outros'
        ],
        showIf: { id: 'exercicio_intensidade', equals: ['Suave', 'Moderado', 'Vigoroso'] }
      },
      {
        id: 'tendencia_peso',
        label: 'Tem tendência para:',
        type: 'radio',
        options: [
          'Engordar',
          'Emagrecer',
          'Manter-se com o mesmo peso',
          'Engorda e emagrece com a mesma facilidade'
        ]
      },
      { id: 'fuma', label: 'Você fuma?', type: 'radio', options: ['Sim', 'Não', 'Já fumei'] },
      {
        id: 'cigarros_dia',
        label: 'Quantos cigarros por dia?',
        type: 'text',
        showIf: { id: 'fuma', equals: 'Sim' }
      },
      {
        id: 'ex_fumante',
        label: 'Quantos cigarros fumava e há quanto tempo não fuma?',
        type: 'text',
        showIf: { id: 'fuma', equals: 'Já fumei' }
      },
      {
        id: 'bebida_alcoolica',
        label: 'Bebida alcoólica?',
        type: 'radio',
        options: ['Sim', 'Não']
      },
      {
        id: 'bebida_tipo',
        label: 'Que tipo e quanto?',
        type: 'text',
        showIf: { id: 'bebida_alcoolica', equals: 'Sim' }
      },
      { id: 'outros_habitos', label: 'Outros hábitos:', type: 'textarea' }
    ]
  },

  /* ── 8 ─────────────────────────────────────────────────────── */
  {
    id: 'mente',
    title: 'Mente e emoções',
    purpose: 'Aqui entra a psicóloga clínica. O que a mente não digere, o corpo carrega.',
    icon: 'heart',
    questions: [
      {
        id: 'percepcao_emocoes',
        label: 'Como você percebe suas emoções? Como lida com elas?',
        type: 'textarea'
      },
      {
        id: 'emocoes_nao_digeridas',
        label: 'Há emoções ou situações que você não conseguiu digerir ainda?',
        type: 'textarea'
      },
      {
        id: 'trauma',
        label: 'Já passou por algum trauma ou situação de muita dificuldade?',
        hint: 'Conte apenas o que se sentir à vontade para compartilhar. Este espaço é seguro e confidencial.',
        type: 'textarea'
      },
      {
        id: 'estado_mental',
        label: 'Como costuma ser seu estado mental?',
        type: 'multi',
        options: ['Bom', 'Ansioso', 'Irritado', 'Deprimido', 'Outros']
      },
      { id: 'estado_mental_descricao', label: 'Descreva.', type: 'textarea' },
      { id: 'estado_atual', label: 'E como está atualmente?', type: 'textarea' },
      {
        id: 'cuidado_medico',
        label: 'Está sob algum cuidado médico?',
        type: 'radio',
        options: ['Sim', 'Não']
      },
      {
        id: 'tipo_tratamento',
        label: 'Qual tipo de tratamento?',
        type: 'textarea',
        showIf: { id: 'cuidado_medico', equals: 'Sim' }
      },
      {
        id: 'efeitos_colaterais',
        label: 'Tem tido algum efeito colateral com os tratamentos recebidos?',
        type: 'radio',
        options: ['Sim', 'Não'],
        showIf: { id: 'cuidado_medico', equals: 'Sim' }
      },
      {
        id: 'efeitos_colaterais_desc',
        label: 'Descreva os efeitos colaterais.',
        type: 'textarea',
        showIf: { id: 'efeitos_colaterais', equals: 'Sim' }
      }
    ]
  },

  /* ── 9 ─────────────────────────────────────────────────────── */
  {
    id: 'sono',
    title: 'Sono e transpiração',
    purpose: 'O sono repara os tecidos; o suor conta como o corpo elimina toxinas.',
    icon: 'moon',
    questions: [
      {
        id: 'qualidade_sono',
        label: 'Como é seu sono?',
        type: 'radio',
        required: true,
        options: ['Profundo', 'Interrompido']
      },
      {
        id: 'hora_dormir',
        label: 'A que horas normalmente você dorme?',
        type: 'time'
      },
      {
        id: 'dorme_dia',
        label: 'Você dorme durante o dia?',
        type: 'radio',
        options: ['Sim, todos os dias', 'Às vezes', 'Não']
      },
      {
        id: 'medos',
        label: 'Você tem tido algum tipo de medo sem razão aparente?',
        type: 'textarea'
      },
      {
        id: 'transpiracao',
        label: 'Como é sua transpiração?',
        type: 'multi',
        options: [
          'Abundante',
          'Escassa',
          'Normal',
          'Frequentemente com odor forte',
          'Com odor adocicado',
          'Inodora'
        ]
      }
    ]
  },

  /* ── 10 ────────────────────────────────────────────────────── */
  {
    id: 'ciclo',
    title: 'Ciclo menstrual',
    purpose: 'O ciclo é um sinal vital. Pule este bloco se não se aplica a você.',
    icon: 'flower',
    optional: true,
    showIf: { id: 'genero', equals: 'Feminino' },
    questions: [
      {
        id: 'menstruacao',
        label: 'Sua menstruação é:',
        type: 'radio',
        options: ['Regular', 'Irregular', 'Muito frequente', 'Pouco frequente', 'Ausente']
      },
      {
        id: 'dias_menstruacao',
        label: 'Quantos dias dura sua menstruação?',
        type: 'number',
        inputMode: 'numeric',
        placeholder: 'Ex.: 5'
      },
      {
        id: 'fluxo_menstrual',
        label: 'Seu fluxo menstrual é:',
        type: 'radio',
        options: ['Forte e intenso', 'Pequeno', 'Normal']
      },
      {
        id: 'corrimentos',
        label: 'Você tem algum tipo de corrimento fora do período menstrual?',
        type: 'textarea'
      },
      {
        id: 'contraceptivo',
        label: 'Usa algum remédio ou método contraceptivo? Qual?',
        type: 'text'
      },
      {
        id: 'sintomas_menstruais',
        label: 'Sintomas associados à menstruação:',
        type: 'multi',
        options: [
          'Nenhum',
          'Dor',
          'Depressão',
          'Acne',
          'Tensão',
          'Retenção de líquidos',
          'Dores de cabeça',
          'Sono',
          'Insônia',
          'Diarreia',
          'Prisão de ventre'
        ]
      }
    ]
  },

  /* ── 11 ────────────────────────────────────────────────────── */
  {
    id: 'intencao',
    title: 'Sua intenção',
    purpose: 'A última pergunta é a mais importante: onde você quer chegar.',
    icon: 'sparkles',
    questions: [
      {
        id: 'caracteristicas_fisicas',
        label: 'Descreva detalhadamente suas características físicas.',
        hint: 'Cabelos, pele, olhos, rosto, língua, unhas, estrutura física, altura e peso.',
        type: 'textarea'
      },
      {
        id: 'objetivo_pacificar',
        label: 'O que você gostaria que o Pacificar melhorasse em você?',
        type: 'textarea',
        required: true,
        placeholder: 'Escreva como se estivesse contando para a Ana...'
      }
    ]
  }
];

/** Escala de Bristol — descrição clínica e leitura ayurvédica de cada tipo. */
export const BRISTOL_SCALE = [
  {
    type: 1,
    name: 'Caroços duros separados',
    detail: 'Como nozes, difíceis de expelir',
    reading: 'Vata elevado · trânsito muito lento e ressecamento',
    tone: 'clay' as const
  },
  {
    type: 2,
    name: 'Alongada e grumosa',
    detail: 'Formato de salsicha, superfície irregular',
    reading: 'Constipação · acúmulo de ama (toxinas)',
    tone: 'clay' as const
  },
  {
    type: 3,
    name: 'Salsicha com rachaduras',
    detail: 'Formada, com fissuras na superfície',
    reading: 'Quase ideal · digestão levemente seca',
    tone: 'ochre' as const
  },
  {
    type: 4,
    name: 'Lisa e macia',
    detail: 'Como uma salsicha ou serpente, suave',
    reading: 'Agni em equilíbrio perfeito — o alvo do Pacificar',
    tone: 'leaf' as const
  },
  {
    type: 5,
    name: 'Pedaços macios',
    detail: 'Bordas bem definidas, fáceis de expelir',
    reading: 'Fibra insuficiente · digestão acelerando',
    tone: 'ochre' as const
  },
  {
    type: 6,
    name: 'Pedaços fofos e irregulares',
    detail: 'Consistência pastosa, bordas esfarrapadas',
    reading: 'Pitta elevado · inflamação intestinal',
    tone: 'clay' as const
  },
  {
    type: 7,
    name: 'Totalmente líquida',
    detail: 'Aquosa, sem pedaços sólidos',
    reading: 'Agni desregulado · urgência e perda de nutrientes',
    tone: 'clay' as const
  }
];
