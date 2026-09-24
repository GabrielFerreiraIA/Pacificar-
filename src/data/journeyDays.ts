import { JourneyDayContent } from '../types';

export const JOURNEY_DAYS: JourneyDayContent[] = [
  {
    day_number: 1,
    week_number: 1,
    theme: 'Desinflamação & Limpeza do Terreno Biológico',
    title: 'O Primeiro Passo: Acolhendo seu Corpo',
    subtitle: 'Iniciando o reset anti-inflamatório com gentileza e comida de verdade',
    audio_title: 'Boas-vindas ao Dia 01: O Início do seu Renascimento',
    audio_duration: '2 min 10s',
    audio_summary: 'Como seu corpo responde nos primeiros dias e por que a quádrupla restrição não é privação, mas libertação.',
    audio_transcript: 'Olá! Sou Ana Carla Nesi. Seja muito bem-vindo(a) ao seu primeiro dia do Programa PACIFICAR. Hoje, iniciamos juntos um pacto de amor com suas células. Nosso objetivo não é contar calorias, mas alimentar o fogo digestivo — o nosso Agni. Nos primeiros 3 dias, é normal sentir uma leve estranheza pela falta do açúcar e do glúten. Acolha esse processo. Seu fígado e seu intestino estão apenas respirando aliviados. Siga o cardápio, faça sua raspagem lingual e tome sua água morna. Eu estou com você!',
    daily_focus: 'Foco na mastigação lenta e na eliminação total de glúten, leite, açúcar e álcool.',
    ayurvedic_quote: '“Quando a alimentação é pura, a mente se torna clara; quando a mente é clara, a memória celular se regenera.”',
    meals: {
      breakfast: {
        title: 'Macaxeira (Aipim) Cozida com Ghee e Ovos Mexidos com Cúrcuma',
        desc: '150g de macaxeira bem macia com 1 colher de café de manteiga ghee e 2 ovos caipiras preparados com uma pitada de cúrcuma e cominho.',
        tip: 'A macaxeira fornece amido resistente para a microbiota sem inflamar a barreira intestinal.'
      },
      lunch: {
        title: 'Feijão Fradinho / Verde com Purê de Abóbora Cabotiá e Frango Grelhado com Ervas',
        desc: 'Filé de peito de frango temperado com alecrim e limão, purê de abóbora cozida no vapor com noz-moscada e concha de feijão demolhado por 12h.',
        tip: 'Demolhar as leguminosas com gotas de limão elimina fitatos e evita gases.'
      },
      dinner: {
        title: 'Sopa Cremosa de Inhame com Cenoura e Gengibre',
        desc: 'Sopa leve e aveludada batida com inhame, cenoura, folhas de couve finas e gengibre fresco ralado.',
        tip: 'À noite, nosso fogo digestivo diminui. Prefira sempre preparações quentes e líquidas.'
      },
      tea_or_snack: {
        title: 'Chá Digestivo de Erva-Doce, Gengibre e Canela em Pau',
        desc: 'Infusão tomada 45 minutos após o almoço ou antes de dormir para acalmar os gases.'
      }
    },
    self_care_practice: {
      title: 'Raspagem da Língua em Jejum (Jihwa Prakshalana)',
      description: 'Ao acordar, raspe suavemente a língua com o raspador de cobre da base até a ponta (5 a 7 vezes). Enxágue com água morna antes de beber qualquer líquido.',
      benefits: 'Remove toxinas (Ama) expelidas pelo trato digestivo durante o sono e aguça o paladar natural.',
      duration: '1 minuto'
    },
    checklist: [
      'Raspar a língua com raspador de cobre ao acordar',
      'Beber 400ml a 500ml de água morna em jejum',
      'Tomar 1 dose de Zeólita em jejum com água pura',
      '100% Comida de Verdade (Zero Glúten, Leite, Açúcar, Álcool)',
      'Check-in noturno com registro da Escala de Bristol'
    ]
  },
  {
    day_number: 2,
    week_number: 1,
    theme: 'Desinflamação & Limpeza do Terreno Biológico',
    title: 'Hidratação Celular & O Fogo Digestivo',
    subtitle: 'Compreendendo como a água morna e os temperos ativam seu metabolismo',
    audio_title: 'Dia 02: Por que a água morna muda a sua digestão?',
    audio_duration: '1 min 48s',
    audio_summary: 'A diferença entre apagar o fogo com água gelada versus estimular as enzimas com calor e especiarias.',
    audio_transcript: 'Bom dia! Aqui é Ana Carla. No Ayurveda, chamamos a digestão de Agni — nosso fogo sagrado. Imagine que colocar água gelada no almoço é como jogar um balde de água fria em uma fogueira que estava tentando queimar a madeira. Hoje, mantenha sua água em temperatura ambiente ou morna. Use suas especiarias com confiança.',
    daily_focus: 'Evitar qualquer líquido gelado durante e próximo às refeições principais.',
    ayurvedic_quote: '“Sem uma boa digestão, até o melhor alimento se torna veneno; com boa digestão, tudo se transforma em vitalidade.”',
    meals: {
      breakfast: {
        title: 'Cuscuz Nordestino com Ovos Poché e Sementes de Abóbora',
        desc: 'Cuscuz de milho não-transgênico hidratado com água morna e sal marinho, servido com ovos e sementes tostadas com orégano.',
        tip: 'O milho sem glúten traz energia estável sem picos glicêmicos bruscos.'
      },
      lunch: {
        title: 'Carne Moída Refogada com Massala e Batata-Doce Assada com Alecrim',
        desc: 'Patinho moído com alho, cebola, cominho e cúrcuma, acompanhado de rodelas de batata-doce douradas no azeite e salada de rúcula com limão.',
        tip: 'Folhas amargas como a rúcula estimulam a bile e o fígado.'
      },
      dinner: {
        title: 'Caldo de Abobrinha com Alho-Poró e Lascas de Peixe Cozido',
        desc: 'Caldo leve aromatizado com coentro fresco, cúrcuma e azeite extravirgem.',
        tip: 'Peixes de água salgada trazem ômega-3 anti-inflamatório.'
      },
      tea_or_snack: {
        title: 'Chá de Cominho, Coentro e Erva-Doce (CCF)',
        desc: 'A tríade clássica do Ayurveda para equilibrar os três doshas e drenar retenção hídrica.'
      }
    },
    self_care_practice: {
      title: 'Respiração Diafragmática Consciente (3 Minutos)',
      description: 'Antes de almoçar, sente-se ereto(a), feche os olhos e faça 10 respirações profundas expandindo o abdômen ao inspirar.',
      benefits: 'Ativa o sistema nervoso parassimpático, preparando o estômago para secretar ácido clorídrico.',
      duration: '3 minutos'
    },
    checklist: [
      'Raspar a língua em jejum',
      'Tomar água morna + Zeólita matinal',
      'Mastigar cada garfada pelo menos 20 vezes',
      'Zero glúten, laticínios, açúcar e álcool',
      'Check-in noturno do Dia 02'
    ]
  },
  {
    day_number: 3,
    week_number: 1,
    theme: 'Desinflamação & Limpeza do Terreno Biológico',
    title: 'Superando a Fissura por Açúcar',
    subtitle: 'Entendendo a abstinência dopaminérgica e alimentando bactérias benéficas',
    audio_title: 'Dia 03: Vontade incontrolável de doce? O que fazer agora.',
    audio_duration: '2 min 15s',
    audio_summary: 'Técnicas sensoriais com canela e massagem para cessar a ansiedade no terceiro dia.',
    audio_transcript: 'Hoje é o terceiro dia, momento em que a mente pode pedir desesperadamente por um docinho após o almoço. Quero que você saiba: isso não é fraqueza, é apenas a microbiota viciada em glicose protestando. Quando a vontade bater, tome um chá quente de canela ou maçã com cravo, ou coma uma banana cozida com canela. Respire.',
    daily_focus: 'Usar o sabor doce natural de raízes cozidas e canela em vez de adoçantes ou açúcar.',
    ayurvedic_quote: '“O desejo excessivo é apenas a mente buscando paz no lugar errado. Nutra suas raízes.”',
    meals: {
      breakfast: {
        title: 'Banana da Terra Cozida com Canela e Pasta de Gergelim (Tahine)',
        desc: '1 banana da terra cozida no vapor salpicada com canela do Ceilão e 1 colher de tahine puro com 1 ovo mexido à parte.',
        tip: 'O gergelim é riquíssimo em cálcio biodisponível e magnésio.'
      },
      lunch: {
        title: 'Sobrecoxa Assada com Cúrcuma + Quinoa com Legumes + Brócolis no Vapor',
        desc: 'Frango marinado com alho e páprica doce, quinoa cozida com cenoura em cubos e brócolis com azeite.',
        tip: 'Brócolis contém sulforafano, potente ativador da desintoxicação hepática.'
      },
      dinner: {
        title: 'Creme de Mandioquinha (Batata Baroa) com Sementes de Girassol',
        desc: 'Creme aveludado e reconfortante finalizado com sementes de girassol levemente tostadas.',
        tip: 'A mandioquinha acalma o estômago e induz a produção de serotonina.'
      },
      tea_or_snack: {
        title: 'Infusão de Camomila com Cravo e Casca de Maçã',
        desc: 'Aquece o trato digestivo e alivia espasmos intestinais.'
      }
    },
    self_care_practice: {
      title: 'Automassagem nos Pés com Óleo Morno (Padabhyanga)',
      description: 'Antes de deitar, aplique algumas gotas de óleo de gergelim ou coco morno na sola dos pés e massageie com movimentos circulares.',
      benefits: 'Acalma Vata, reduz a ansiedade noturna e induz sono profundo e restaurador.',
      duration: '5 minutos'
    },
    checklist: [
      'Raspar a língua em jejum',
      'Zeólita matinal em 200ml de água',
      'Chá com canela ao sentir vontade de doce',
      'Automassagem nos pés antes de dormir',
      'Check-in noturno do Dia 03'
    ]
  },
  {
    day_number: 4,
    week_number: 1,
    theme: 'Desinflamação & Limpeza do Terreno Biológico',
    title: 'O Intestino como Segundo Cérebro',
    subtitle: 'Observando a Escala de Bristol e o clareamento da mente',
    audio_title: 'Dia 04: O que suas fezes revelam sobre sua saúde hoje?',
    audio_duration: '1 min 55s',
    audio_summary: 'Como correlacionar o formato das fezes com os doshas e desinflamação.',
    audio_transcript: 'Olá! Você já notou como o abdômen começa a desinchar no 4º dia? Hoje vamos prestar atenção especial na Escala de Bristol. Fezes em bolinhas ou ressecadas indicam excesso de Vata e pouca hidratação. Fezes muito soltas indicam calor e inflamação (Pitta). O nosso objetivo é o Tipo 4: lisa, macia, que sai sem esforço. Registre no seu check-in hoje!',
    daily_focus: 'Avaliar a digestão com olhar amoroso e clínico sem julgamentos.',
    ayurvedic_quote: '“Um intestino limpo é o alicerce de uma mente serena e de uma imunidade inabalável.”',
    meals: {
      breakfast: {
        title: 'Batata-Doce Roxa Assada com Ovos Mexidos e Azeite de Ervas',
        desc: 'Batata-doce assada com casca, 2 ovos caipiras e uma pitada de orégano com azeite virgem.',
        tip: 'Antocianinas da batata roxa neutralizam radicais livres no cólon.'
      },
      lunch: {
        title: 'Lentilha Cozida com Massala + Arroz Integral / Vermelho + Salmão ou Tilápia',
        desc: 'Concha de lentilha bem cozida com louro e cominho, arroz e peixe grelhado com raspas de limão siciliano.',
        tip: 'A combinação de grãos e sementes garante aminoácidos completos sem sobrecarga digestiva.'
      },
      dinner: {
        title: 'Omelete de Forno com Espinafre, Tomate e Abobrinha',
        desc: '2 ovos batidos com folhas de espinafre, cubos de abobrinha e tomatinhos com azeite.',
        tip: 'Jantar leve permite que o fígado execute a autofagia noturna.'
      },
      tea_or_snack: {
        title: 'Chá de Hortelã Fresca com Gengibre',
        desc: 'Excelente para aliviar qualquer sensação de peso ou gases residuais.'
      }
    },
    self_care_practice: {
      title: 'Caminhada Leve de 15 Minutos ao Ar Livre',
      description: 'Caminhe em ritmo calmo logo após a digestão da tarde, respirando pelo nariz e observando o céu.',
      benefits: 'Move o peristaltismo intestinal e eleva os níveis naturais de dopamina.',
      duration: '15 minutos'
    },
    checklist: [
      'Raspagem lingual matinal',
      'Zeólita + 500ml de água',
      'Classificar com atenção o Bristol no check-in',
      'Comida limpa e regional',
      'Check-in noturno do Dia 04'
    ]
  },
  {
    day_number: 5,
    week_number: 1,
    theme: 'Desinflamação & Limpeza do Terreno Biológico',
    title: 'O Poder Curativo das Massalas',
    subtitle: 'Transformando sua comida em remédio com misturas de especiarias ancestrais',
    audio_title: 'Dia 05: As especiarias como catalisadores biológicos.',
    audio_duration: '2 min 05s',
    audio_summary: 'Como cominho, cúrcuma, coentro e cardamomo quebram toxinas nas células.',
    audio_transcript: 'Bom dia! Hoje no Dia 5, quero te apresentar as Massalas Ayurvédicas. As especiarias não servem apenas para dar sabor: elas acendem o Agni, alcalinizam os tecidos e neutralizam antinutrientes. Se você tem tendência a gases, cominho e erva-doce são seus melhores amigos. Se tem azia, prefira coentro e cardamomo.',
    daily_focus: 'Adicionar pelo menos uma colher de chá de massala em suas preparações do almoço.',
    ayurvedic_quote: '“Deixe o alimento ser seu remédio e a cozinha ser sua farmácia viva.”',
    meals: {
      breakfast: {
        title: 'Mingau de Aveia sem Glúten com Leite de Coco e Frutas Vermelhas',
        desc: 'Aveia em flocos cozida em água com leite de coco caseiro, canela e mirtilos/morangos frescos.',
        tip: 'Leite vegetal fresco não gera muco nas vias respiratórias.'
      },
      lunch: {
        title: 'Cozido de Grão de Bico com Abóbora, Cenoura e Massala Ayurvédica',
        desc: 'Grão de bico demolhado por 24h, cozido lentamente com cúrcuma, cominho, gengibre e abóbora macia.',
        tip: 'Proteína vegetal de altíssima absorção rica em triptofano.'
      },
      dinner: {
        title: 'Sopa de Ervilha Seca com Couve-Flor e Azeite de Oliva',
        desc: 'Sopa cremosa com ervilhas partidas e buquês de couve-flor, finalizada com azeite e tomilho.',
        tip: 'Refeição nutritiva e de baixíssima densidade calórica.'
      },
      tea_or_snack: {
        title: 'Água Morna Aromatizada com Cardamomo e Gengibre',
        desc: 'Ajuda a drenar líquidos e limpa as vias aéreas.'
      }
    },
    self_care_practice: {
      title: 'Inalação com Óleo Essencial de Hortelã ou Eucalipto',
      description: 'Pingue 1 gota na palma das mãos, friccione suavemente, aproxime do nariz em concha e respire profundamente 5 vezes.',
      benefits: 'Descongestiona os seios da face e traz foco e clareza mental.',
      duration: '2 minutos'
    },
    checklist: [
      'Raspar língua + Água morna + Zeólita',
      'Usar massalas no almoço',
      'Manter 2,5 litros de água ao longo do dia',
      'Sem glúten, sem açúcar, sem leite',
      'Check-in noturno do Dia 05'
    ]
  },
  {
    day_number: 6,
    week_number: 1,
    theme: 'Desinflamação & Limpeza do Terreno Biológico',
    title: 'Higiene do Sono & Melatonina Natural',
    subtitle: 'Desconectando as telas para restaurar o fígado e a imunidade',
    audio_title: 'Dia 06: Sono profundo e a queima de toxinas noturnas.',
    audio_duration: '1 min 50s',
    audio_summary: 'O ciclo circadiano e por que deitar antes das 22h30 acelera a desinflamação.',
    audio_transcript: 'Olá! Estamos quase completando nossa primeira semana. Você sabia que entre 22h e 02h da manhã o fígado executa a maior parte da limpeza do seu sangue? Se estivermos acordados com luz azul nos olhos, esse processo é interrompido. Hoje, tente apagar as luzes brancas às 21h e preparar seu quarto como um santuário de paz.',
    daily_focus: 'Desligar celulares e telas pelo menos 45 minutos antes de dormir.',
    ayurvedic_quote: '“O sono é a nutriz do mundo; quando bem cultivado, cura mais do que mil remédios.”',
    meals: {
      breakfast: {
        title: 'Tapioca Fina com Ovos Mexidos, Gergelim e Folhas de Manjericão',
        desc: '1 tapioca média crocante recheada com ovos caipiras, sementes de gergelim preto e manjericão fresco.',
        tip: 'Tapioca pura é livre de glúten e de fácil assimilação.'
      },
      lunch: {
        title: 'Iscas de Mignon ou Patinho Acebolado com Macaxeira e Vinagrete sem Vinagre (com Limão)',
        desc: 'Carne grelhada com cebola roxa, macaxeira na manteiga ghee e vinagrete fresco com limão e azeite.',
        tip: 'O limão alcaliniza e fornece vitamina C para absorver o ferro da carne.'
      },
      dinner: {
        title: 'Caldo Verde Saudável (Batata-Doce Branca com Couve Manteiga Picadinha)',
        desc: 'Caldo aveludado de batata-doce com fios finos de couve fresca refogada no alho.',
        tip: 'A couve é riquíssima em magnésio e clorofila purificadora.'
      },
      tea_or_snack: {
        title: 'Chá de Mulungu com Passiflora e Melissa',
        desc: 'Poderoso relaxante muscular natural que induz sono profundo fase REM.'
      }
    },
    self_care_practice: {
      title: 'Ritual Noturno Sem Telas & Leitura Acolhedora',
      description: 'Às 21h, coloque luz amarela ou acenda uma vela aromática. Leia 10 páginas de um bom livro ou escute uma música suave.',
      benefits: 'Permite o pico fisiológico da melatonina e reduz o cortisol sanguíneo.',
      duration: '30 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Desconectar telas às 21h',
      'Tomar chá relaxante antes de deitar',
      'Quádrupla restrição mantida 100%',
      'Check-in noturno do Dia 06'
    ]
  },
  {
    day_number: 7,
    week_number: 1,
    theme: 'Desinflamação & Limpeza do Terreno Biológico',
    title: 'Checkpoint Semana 1: Vitória & Primeiras Vitórias',
    subtitle: 'Celebrando 7 dias de renascimento e visualizando seu primeiro relatório',
    audio_title: 'Dia 07: Parabéns pelos seus primeiros 7 dias de Pacificar!',
    audio_duration: '2 min 30s',
    audio_summary: 'Reconhecimento da sua dedicação e análise da melhora do inchaço e disposição.',
    audio_transcript: 'Parabéns de todo o meu coração! Você completou a primeira semana do PACIFICAR. Olhe para trás e sinta o orgulho de ter dito sim para sua saúde por 7 dias inteiros. Seu corpo já desinflamou, suas papilas gustativas estão renascendo e seu intestino está encontrando o ritmo. Hoje, ao fazer seu check-in, o app vai gerar seu Primeiro Relatório Semanal de Correlação. Vamos em frente!',
    daily_focus: 'Revisar a evolução no Relatório da Semana 1 e celebrar a conquista.',
    ayurvedic_quote: '“A constância em pequenos atos gentis gera transformações gigantescas na alma e no corpo.”',
    meals: {
      breakfast: {
        title: 'Crepioca Especial (Ovo + Goma de Tapioca + Orégano) com Abacate e Azeite',
        desc: 'Crepioca dourada na frigideira servida com fatias de abacate temperadas com sal marinho e limão.',
        tip: 'Gorduras boas do abacate prolongam a saciedade por 4 a 5 horas.'
      },
      lunch: {
        title: 'Moqueca Leve de Peixe com Leite de Coco Caseiro, Pimentões e Pirão de Peixe',
        desc: 'Peixe branco cozido com azeite de dendê moderado, coentro, leite de coco e pirão feito com caldo do peixe e farinha de mandioca fina.',
        tip: 'Comida regional deliciosa, 100% livre de leite de vaca e de glúten.'
      },
      dinner: {
        title: 'Sopa de Abóbora com Gengibre e Sementes de Abóbora Crocantes',
        desc: 'Creme quente e aveludado que abraça o estômago no domingo à noite.',
        tip: 'Prepara o corpo para uma nova semana com leveza digestiva.'
      },
      tea_or_snack: {
        title: 'Chá de Alecrim com Limão e Canela',
        desc: 'Estimula a clareza mental e a disposição para a nova fase.'
      }
    },
    self_care_practice: {
      title: 'Escrita Terapêutica & Gratidão Corporal',
      description: 'Escreva em um caderno ou nas notas do check-in 3 mudanças físicas ou emocionais que você já sentiu nesses primeiros 7 dias.',
      benefits: 'Fixa o sentimento de autoeficácia no cérebro e reforça o compromisso para a Semana 2.',
      duration: '5 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Desfrutar do almoço especial de domingo sem inflamar',
      'Abrir o Relatório Semanal no App após o check-in',
      'Celebrar a conclusão da Semana 1',
      'Check-in noturno do Dia 07'
    ]
  },
  {
    day_number: 8,
    week_number: 2,
    theme: 'Agni, Vitalidade & Restauração da Digestão',
    title: 'Semana 2: Despertando a Vitalidade (Ojas)',
    subtitle: 'Aprofundando a reparação da mucosa intestinal e absorção de micronutrientes',
    audio_title: 'Dia 08: O que é Ojas e como cultivar energia radiante?',
    audio_duration: '2 min 00s',
    audio_summary: 'Como o vigor físico e o brilho na pele surgem da digestão refinada de alimentos puros.',
    audio_transcript: 'Bem-vindo(a) à Semana 2! Agora que o excesso de toxinas começou a sair, seu corpo tem energia livre para regenerar tecidos profundos. No Ayurveda, chamamos a essência da vitalidade de Ojas. Ojas é o brilho nos olhos, a imunidade forte e a paz de espírito. Vamos continuar cuidando do nosso solo sagrado.',
    daily_focus: 'Consistência nos horários das refeições para estabilizar o relógio biológico.',
    ayurvedic_quote: '“Quando o corpo está em equilíbrio, a mente encontra repouso natural na própria essência.”',
    meals: {
      breakfast: {
        title: 'Cuscuz Nordestino com Carne de Sol Desfiada e Manteiga Ghee',
        desc: 'Cuscuz fofinho com carne cozida e desfiada artesanalmente com cebola roxa e manteiga clarificada.',
        tip: 'Excelente aporte de ferro e energia sustentada para a manhã de segunda-feira.'
      },
      lunch: {
        title: 'Sobrecoxa Grelhada com Alecrim + Batata Doce Grelhada + Brócolis e Cenoura',
        desc: 'Prato colorido e rico em antioxidantes com azeite de oliva e sal marinho integral.',
        tip: 'Variar as cores dos vegetais garante polifenóis diversos para o microbioma.'
      },
      dinner: {
        title: 'Sopa Reconfortante de Lentilha Vermelha com Alho-Poró',
        desc: 'A lentilha vermelha cozinha em apenas 15 minutos e forma um creme delicioso e de digestão ultrarrápida.',
        tip: 'Menor teor de fibras insolúveis que a lentilha comum, ideal para noites tranquilas.'
      },
      tea_or_snack: {
        title: 'Chá de Gengibre com Casca de Laranja e Cravo',
        desc: 'Aquece a circulação periférica e acelera o metabolismo.'
      }
    },
    self_care_practice: {
      title: 'Banho de Sol Matinal de 10 Minutos',
      description: 'Tome 10 a 15 minutos de sol matinal antes das 10h com braços e pernas expostos, respirando com calma.',
      benefits: 'Sintetiza Vitamina D3 natural e sincroniza o ritmo circadiano central.',
      duration: '10 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      '10 minutos de sol matinal',
      'Manter refeições em horários regulares',
      'Zero inflamatórios',
      'Check-in noturno do Dia 08'
    ]
  },
  {
    day_number: 9,
    week_number: 2,
    theme: 'Agni, Vitalidade & Restauração da Digestão',
    title: 'Equilibrando as Emoções & o Fogo da Raiva (Pitta)',
    subtitle: 'Como a comida inflamatória aumentava sua irritabilidade e como manter a serenidade',
    audio_title: 'Dia 09: A relação direta entre fígado sobrecarregado e estresse.',
    audio_duration: '2 min 10s',
    audio_summary: 'Como o calor excessivo no trato biliar gera impaciência e como esfriar com alimentos corretos.',
    audio_transcript: 'Você já percebeu como está mais calmo(a) e com menos explosões de impaciência? Isso acontece porque o álcool, a cafeína em excesso e a comida industrializada aquecem em excesso o fígado, gerando Pitta alto. Ao limpar o fígado, sua mente ganha um espaço de serenidade antes de reagir ao estresse externo.',
    daily_focus: 'Trocar o café excessivo por chá verde suave ou água aromatizada com hortelã.',
    ayurvedic_quote: '“A mente segue o estado do estômago: purifique o ventre e o coração se acalma.”',
    meals: {
      breakfast: {
        title: 'Ovos Poché sobre Fatias de Inhame Cozido com Orégano e Azeite',
        desc: 'Inhame cozido fatiado na base com 2 ovos com gema mole e azeite extravirgem.',
        tip: 'Inhame é depurativo do sangue e estimula a eliminação de toxinas pela linfa.'
      },
      lunch: {
        title: 'Filé de Tilápia com Crosta de Gergelim + Arroz de Couve-Flor com Amêndoas + Purê de Cenoura',
        desc: 'Peixe dourado com sementes, arroz leve de couve-flor picada no azeite e purê cremoso de cenoura.',
        tip: 'Refeição fresca e leve que não esquenta o estômago.'
      },
      dinner: {
        title: 'Caldo de Abóbora Cabotiá com Leite de Coco e Tiras de Frango Desfiado',
        desc: 'Sopa reconfortante e doce por natureza, perfeita para equilibrar Pitta e Vata.',
        tip: 'O leite de coco resfria a mucosa e acalma azia.'
      },
      tea_or_snack: {
        title: 'Chá Gelado ou Morno de Hibisco com Maçã e Canela',
        desc: 'Antioxidante potente que protege a função renal e hepática.'
      }
    },
    self_care_practice: {
      title: 'Pranayama Nadi Shodhana (Respiração das Narinas Alternadas)',
      description: 'Sente-se confortavelmente. Com o polegar, feche a narina direita e inspire pela esquerda; feche a esquerda e expire pela direita. Inverta. Repita 7 ciclos.',
      benefits: 'Harmoniza os hemisférios cerebrais e reduz a pressão arterial e a ansiedade.',
      duration: '4 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Praticar a respiração das narinas alternadas',
      'Zero refrigerantes ou bebidas alcoólicas',
      'Manter água em temperatura ambiente',
      'Check-in noturno do Dia 09'
    ]
  },
  {
    day_number: 10,
    week_number: 2,
    theme: 'Agni, Vitalidade & Restauração da Digestão',
    title: 'A Importância do Silêncio e da Mastigação',
    subtitle: 'Comendo com presença plena para evitar engolir ar e inflamação emocional',
    audio_title: 'Dia 10: Comer sem telas: o segredo que ninguém te conta.',
    audio_duration: '1 min 45s',
    audio_summary: 'Por que olhar para o celular enquanto mastiga sabota a liberação de sucos gástricos.',
    audio_transcript: 'Olá! No Dia 10, quero te propor um desafio simples, mas revolucionário: faça sua refeição de hoje sem nenhuma tela ligada. Sem TV, sem WhatsApp, sem reels. Olhe para a comida, sinta o aroma das massalas, agradeça mentalmente. A digestão começa nos olhos e no aroma.',
    daily_focus: 'Fazer pelo menos uma refeição principal em silêncio e com atenção total aos sabores.',
    ayurvedic_quote: '“Coma seu alimento com reverência, pois cada partícula se tornará seus pensamentos de amanhã.”',
    meals: {
      breakfast: {
        title: 'Macaxeira Assada em Palitos com Ghee e Ovos com Cúrcuma e Coentro',
        desc: 'Macaxeira pré-cozida e dourada no forno até ficar crocante por fora e macia por dentro.',
        tip: 'Alternativa saudável e deliciosa às batatas fritas industriais.'
      },
      lunch: {
        title: 'Carne de Panela Cozida com Mandioca, Cenoura e Folhas de Louro',
        desc: 'Músculo ou acém cozido lentamente em fogo brando até desfiar, com caldo espesso e nutritivo.',
        tip: 'O cozimento lento extrai colágeno e aminoácidos reparadores da parede intestinal.'
      },
      dinner: {
        title: 'Omelete Recheada com Abobrinha Ralada, Alho e Sementes de Abóbora',
        desc: 'Omelete fofinha dobrada com abobrinha refogada na manteiga ghee.',
        tip: 'Jantar rápido, leve e riquíssimo em proteínas e zinco.'
      },
      tea_or_snack: {
        title: 'Infusão de Erva-Cidreira com Cardamomo',
        desc: 'Relaxa as paredes do cólon e previne cólicas intestinais.'
      }
    },
    self_care_practice: {
      title: 'Comer com Presença Plena (Mindful Eating)',
      description: 'Pouse os talheres na mesa entre cada garfada. Mastigue até que o alimento se torne quase líquido antes de engolir.',
      benefits: 'Reduz a quantidade de ar engolido, eliminando o estufamento pós-prandial.',
      duration: 'Durante o almoço'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Almoçar sem celular ou telas ligadas',
      'Pousar os talheres entre as garfadas',
      'Quádrupla restrição mantida',
      'Check-in noturno do Dia 10'
    ]
  },
  {
    day_number: 11,
    week_number: 2,
    theme: 'Agni, Vitalidade & Restauração da Digestão',
    title: 'Metais Pesados & Ação Contínua da Zeólita',
    subtitle: 'Entendendo a quelação de alumínio, chumbo e agrotóxicos no seu organismo',
    audio_title: 'Dia 11: Por que a Zeólita age como uma esponja magnética celular.',
    audio_duration: '2 min 15s',
    audio_summary: 'Como a estrutura vulcânica da clinoptilolita atrai toxinas com carga positiva sem roubar seus minerais.',
    audio_transcript: 'Você está no 11º dia tomando sua Zeólita diariamente em jejum. Esse mineral vulcânico possui uma estrutura em favo de mel com carga negativa. Ele viaja pelo intestino atraindo chumbo, mercúrio, alumínio e toxinas de pesticidas que nosso corpo acumulou por anos, eliminando tudo com segurança nas fezes. Mantenha os 120 dias firmes!',
    daily_focus: 'Garantir boa ingestão de água para facilitar a excreção dos complexos quelados.',
    ayurvedic_quote: '“A purificação não é um evento isolado, mas a restauração da inteligência inata do corpo.”',
    meals: {
      breakfast: {
        title: 'Banana da Terra Grelhada no Ghee com Canela + Ovos Mexidos com Tomilho',
        desc: 'Banana da terra fatiada e dourada na frigideira com ghee e canela, acompanhada de 2 ovos caipiras.',
        tip: 'Combinação perfeita de carboidrato de baixo índice glicêmico e proteína saciante.'
      },
      lunch: {
        title: 'Feijão Verde Cozido com Legumes + Frango Desfiado com Cúrcuma e Purê de Batata-Doce',
        desc: 'Prato farto, anti-inflamatório e com temperos naturais nordestinos.',
        tip: 'Cúrcuma com pimenta preta aumenta a absorção da curcumina em até 2000%.'
      },
      dinner: {
        title: 'Creme de Chuchu com Gengibre e Frango em Cubinhos',
        desc: 'O chuchu cozido com caldo caseiro e gengibre fica extremamente cremoso sem necessidade de creme de leite.',
        tip: 'Ultra diurético e relaxante para a digestão noturna.'
      },
      tea_or_snack: {
        title: 'Chá de Dente-de-Leão com Cavalinha',
        desc: 'Potente ativador hepático e drenador linfático.'
      }
    },
    self_care_practice: {
      title: 'Drenagem Linfática Seca com Escova ou Toalha (Garshana Suave)',
      description: 'Antes do banho, faça movimentos ascendentes na pele seca das pernas e braços em direção ao coração.',
      benefits: 'Estimula os gânglios linfáticos a eliminarem toxinas mobilizadas pela Zeólita.',
      duration: '3 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Beber 2,5L a 3L de água hoje',
      'Drenagem suave com toalha antes do banho',
      'Alimentação 100% limpa',
      'Check-in noturno do Dia 11'
    ]
  },
  {
    day_number: 12,
    week_number: 2,
    theme: 'Agni, Vitalidade & Restauração da Digestão',
    title: 'Aromaterapia & Óleos Essenciais na Rotina',
    subtitle: 'Usando os aromas da natureza para ancorar a mente e modular o sistema límbico',
    audio_title: 'Dia 12: Como os aromas curativos conversam com suas emoções.',
    audio_duration: '1 min 55s',
    audio_summary: 'Lavanda, Bergamota e Olíbano para equilibrar os doshas e modular a resposta ao estresse.',
    audio_transcript: 'Olá! A aromaterapia clínica é uma das ferramentas mais bonitas que uso no consultório. Quando você inala um óleo essencial de qualidade, as moléculas aromáticas atingem seu sistema límbico em menos de 3 segundos, desarmando o gatilho da ansiedade antes mesmo que a mente racional processe. Use seu blend prescrito hoje.',
    daily_focus: 'Aplicar ou inalar sua sinergia de óleos essenciais nos momentos de transição do dia.',
    ayurvedic_quote: '“O aroma é a ponte sutil entre o mundo visível das plantas e o reino invisível das emoções.”',
    meals: {
      breakfast: {
        title: 'Tapioca com Pasta de Ovos Caipiras e Folhas Verdes',
        desc: 'Tapioca fina recheada com ovos amassados com azeite de oliva, cúrcuma e rúcula.',
        tip: 'A rúcula traz amargor terapêutico para ativar a digestão logo cedo.'
      },
      lunch: {
        title: 'Salmão ou Pescada Grelhada com Molho de Ervas + Batatas Rústicas Assadas com Alecrim',
        desc: 'Peixe suculento com azeite, alho e salsinha, acompanhado de batatas douradas no forno.',
        tip: 'Ácidos graxos essenciais reconstroem a bainha de mielina dos neurônios.'
      },
      dinner: {
        title: 'Sopa Cremosa de Cenoura com Leite de Coco e Raspas de Gengibre',
        desc: 'Cor vibrante e sabor adocicado acolhedor para a noite.',
        tip: 'Betacaroteno repara a mucosa gástrica e melhora a qualidade da visão.'
      },
      tea_or_snack: {
        title: 'Chá de Melissa com Manjericão Santo (Tulsi)',
        desc: 'Adaptógeno ayurvédico que reduz o estresse oxidativo e clareia a mente.'
      }
    },
    self_care_practice: {
      title: 'Inalação Aromática Consciente (3 Minutos)',
      description: 'Pingue 1 gota de óleo de Lavanda ou Laranja Doce em um lenço ou na palma da mão e inale profundamente 7 vezes.',
      benefits: 'Reduz os batimentos cardíacos acelerados e induz paz interior imediata.',
      duration: '3 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Inalação com óleo essencial ao final da tarde',
      'Refeições sem glúten, leite, açúcar e álcool',
      'Check-in noturno do Dia 12'
    ]
  },
  {
    day_number: 13,
    week_number: 2,
    theme: 'Agni, Vitalidade & Restauração da Digestão',
    title: 'A Arte de Dizer Não aos Inflamatórios Sociais',
    subtitle: 'Blindando sua jornada em eventos familiares e jantares de trabalho',
    audio_title: 'Dia 13: O que responder quando te oferecerem comida que te adoece.',
    audio_duration: '2 min 20s',
    audio_summary: 'Como manter seu posicionamento com elegância e sem precisar se justificar excessivamente.',
    audio_transcript: 'Você já deve ter passado por situações onde amigos ou parentes insistem para você comer um bolo ou tomar uma cerveja, dizendo "só hoje não faz mal". Quero que você lembre: você não está de dieta para agradar ninguém; você está em um tratamento clínico de 21 dias para curar suas células. Responda com um sorriso: "Estou me sentindo tão bem com esse protocolo que prefiro continuar." Você tem esse poder.',
    daily_focus: 'Manter a firmeza amorosa em suas escolhas alimentares sem culpa.',
    ayurvedic_quote: '“Quem governa a própria língua e o próprio prato, governa o próprio destino.”',
    meals: {
      breakfast: {
        title: 'Cuscuz Nordestino com Ovos Mexidos e Fatias de Abacate com Sal Marinho',
        desc: 'Energia estável e saciedade duradoura para o sábado.',
        tip: 'Carboidratos complexos + gorduras saudáveis = zero picos de insulina.'
      },
      lunch: {
        title: 'Feijoada Leve Anti-inflamatória (Feijão Preto com Carne Bovina Magra, Louro e Couve)',
        desc: 'Feijão preto demolhado 24h, cozido apenas com carnes limpas (sem embutidos, sem paio), servido com couve refogada no alho e gomos de laranja.',
        tip: 'Versão pura, sem os embutidos inflamatórios cheios de nitritos e glúten.'
      },
      dinner: {
        title: 'Caldo de Inhame com Tomilho e Lascas de Peixe Cozido',
        desc: 'Leve, aveludado e reconfortante para fechar o sábado.',
        tip: 'Facilita uma noite de sono ininterrupta.'
      },
      tea_or_snack: {
        title: 'Chá de Erva-Doce com Canela e Cravo',
        desc: 'Auxilia na digestão do feijão e aquece o ventre.'
      }
    },
    self_care_practice: {
      title: 'Pausa Restauradora de 20 Minutos com Pernas para Cima (Viparita Karani)',
      description: 'Deite-se no chão perto de uma parede e apoie as pernas esticadas verticalmente na parede com os braços abertos.',
      benefits: 'Desincha os tornozelos, drena o sangue venoso e acalma o coração.',
      duration: '15 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Postura de pernas elevadas na parede',
      'Dizer não amoroso a convites inflamatórios',
      '100% Comida de verdade',
      'Check-in noturno do Dia 13'
    ]
  },
  {
    day_number: 14,
    week_number: 2,
    theme: 'Agni, Vitalidade & Restauração da Digestão',
    title: 'Checkpoint Semana 2: Duas Semanas de Vitória!',
    subtitle: 'Completando 14 dias: veja sua digestão e sono se transformarem',
    audio_title: 'Dia 14: Metade do caminho superada: você é outra pessoa!',
    audio_duration: '2 min 25s',
    audio_summary: 'Análise do seu 2º Relatório Semanal e preparação para a reta final.',
    audio_transcript: 'Parabéns pelos 14 dias! Duas semanas inteiras sem glúten, sem leite de vaca, sem açúcar refinado e sem álcool. Olhe seu rosto no espelho: a pele está mais luminosa, o inchaço nos olhos diminuiu, e seu intestino está operando em um novo patamar de harmonia. Hoje o aplicativo libera seu Segundo Relatório Semanal. Celebre cada vitória!',
    daily_focus: 'Visualizar os gráficos comparativos da Semana 1 vs Semana 2 no app.',
    ayurvedic_quote: '“A persistência transforma o esforço em hábito, e o hábito em uma nova natureza de saúde.”',
    meals: {
      breakfast: {
        title: 'Crepioca Recheada com Guacamole Fresco e Ovos Poché',
        desc: 'Goma de tapioca batida com ovo, dourada e servida com abacate amassado, limão e coentro.',
        tip: 'Combinação rica em potássio e antioxidantes celulares.'
      },
      lunch: {
        title: 'Galinha Caipira Cozida com Macaxeira, Quiabo e Coentro Fresco',
        desc: 'Frango caipira cozido lentamente com açafrão da terra, quiabo macio e pedaços de macaxeira.',
        tip: 'O quiabo contém mucilagens que regeneram a mucosa gástrica e intestinal.'
      },
      dinner: {
        title: 'Sopa Cremosa de Abobrinha com Manjericão e Castanhas Picadas',
        desc: 'Creme verde claro aromatizado com folhas frescas de manjericão e castanhas do Brasil.',
        tip: 'Castanha do Brasil fornece todo o selênio diário necessário para a tireoide.'
      },
      tea_or_snack: {
        title: 'Chá de Camomila com Anis Estrelado',
        desc: 'Sabor aromático doce e relaxante para fechar a Semana 2.'
      }
    },
    self_care_practice: {
      title: 'Automassagem Completa nos Pés e Joelhos com Óleo Morno',
      description: 'Dedique 10 minutos para massagear seus pés, tornozelos e panturrilhas com óleo de gergelim aquecido.',
      benefits: 'Alivia tensões acumuladas da semana e ancora o elemento terra no corpo.',
      duration: '10 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Fazer o check-in noturno e abrir o Relatório D14',
      'Verificar a evolução da Escala de Bristol',
      'Celebrar os 14 dias concluídos',
      'Check-in noturno do Dia 14'
    ]
  },
  {
    day_number: 15,
    week_number: 3,
    theme: 'Harmonia Mente-Corpo & Sustentação de Hábitos',
    title: 'Semana 3: A Reta Final & A Conexão Mente-Corpo',
    subtitle: 'Consolidando a autonomia para manter a saúde para sempre',
    audio_title: 'Dia 15: O cérebro desinflamado e a clareza mental.',
    audio_duration: '2 min 05s',
    audio_summary: 'Como a ausência de neuroinflamação dissipa o cansaço mental e melhora o foco.',
    audio_transcript: 'Bem-vindo(a) à nossa última semana! A essa altura, você já percebeu que o famoso "brain fog" — aquela névoa mental e esquecimentos frequentes — começou a desaparecer. Isso acontece porque a barreira hematoencefálica desinflamou junto com o intestino. Nosso objetivo agora é preparar sua sustentação para os próximos meses.',
    daily_focus: 'Observar a facilidade de raciocínio e o aumento natural da sua disposição matinal.',
    ayurvedic_quote: '“Quando o fogo digestivo queima limpo, os pensamentos fluem com nitidez e sabedoria.”',
    meals: {
      breakfast: {
        title: 'Batata-Doce Cozida com Manteiga Ghee e Ovos com Cúrcuma e Orégano',
        desc: 'Café da manhã clássico, nutritivo e que sustenta o Agni ao longo da manhã.',
        tip: 'A combinação de gordura boa e amido resistente estabiliza a energia.'
      },
      lunch: {
        title: 'Iscas de Carne com Pimentões Coloridos, Quinoa Real e Salada de Rúcula',
        desc: 'Tiras de carne refogadas com azeite e ervas, acompanhadas de quinoa soltinha.',
        tip: 'A quinoa é rica em todos os 9 aminoácidos essenciais.'
      },
      dinner: {
        title: 'Caldo de Mandioquinha com Gengibre e Folhas de Espinafre',
        desc: 'Sopa leve e suave que acalma o sistema nervoso parassimpático.',
        tip: 'Espinafre fornece folato biodisponível para a regeneração celular.'
      },
      tea_or_snack: {
        title: 'Chá de Alecrim com Hortelã',
        desc: 'Revigorante natural para o foco e a memória sem a taquicardia do café.'
      }
    },
    self_care_practice: {
      title: 'Prática de Respiração Matinal em 4 Tempos (Pranayama Sama Vritti)',
      description: 'Inspire em 4 segundos, retenha com ar em 4s, expire em 4s, retenha sem ar em 4s. Repita 5 ciclos.',
      benefits: 'Equilibra o sistema nervoso autônomo e traz presença instantânea.',
      duration: '4 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Pranayama de 4 tempos pela manhã',
      'Refeições 100% limpas',
      'Zero açúcar, glúten, leite e álcool',
      'Check-in noturno do Dia 15'
    ]
  },
  {
    day_number: 16,
    week_number: 3,
    theme: 'Harmonia Mente-Corpo & Sustentação de Hábitos',
    title: 'A Desparasitação Lunar: O Momento Certo',
    subtitle: 'Compreendendo por que tratamos parasitas intestinais nos ciclos de Lua Cheia',
    audio_title: 'Dia 16: Por que a Lua Cheia mobiliza os parasitas intestinais?',
    audio_duration: '2 min 15s',
    audio_summary: 'A biologia dos helmintos e a importância de usar Ivermectina + Carvão Ativado nos 5 ciclos lunares.',
    audio_transcript: 'Olá! Hoje quero te explicar sobre nosso protocolo estendido de Desparasitação Lunar. Na Lua Cheia, a atração gravitacional e a produção de serotonina no cólon aumentam, fazendo com que os parasitas migrem do biofilme para o lúmen intestinal. É nesse momento exato que a dose calculada de Ivermectina tem eficácia máxima, e o carvão ativado à noite suga a amônia liberada.',
    daily_focus: 'Consultar sua calculadora de peso e posologia na aba "Protocolos" do app.',
    ayurvedic_quote: '“Viver em harmonia com os ciclos celestes e as estações é a chave da medicina integrativa.”',
    meals: {
      breakfast: {
        title: 'Omelete com Sementes de Abóbora Tostadas e Fatias de Macaxeira',
        desc: 'Ovos caipiras batidos com sementes de abóbora cruas levemente douradas no azeite.',
        tip: 'A semente de abóbora contém cucurbitacina, composto natural antiparasitário ancestral.'
      },
      lunch: {
        title: 'Filé de Peixe Grelhado com Alho Poró + Arroz Integral + Purê de Abóbora',
        desc: 'Peixe branco com sabor suave, alho-poró dourado e purê aveludado.',
        tip: 'Alho e cebola fornecem compostos sulfurados que inibem o crescimento de fungos e vermes.'
      },
      dinner: {
        title: 'Creme de Ervilhas com Hortelã Fresca e Azeite Extravirgem',
        desc: 'Sopa refrescante e leve com alto poder de cicatrização da mucosa.',
        tip: 'A hortelã é carminativa e ajuda a expelir gases indesejados.'
      },
      tea_or_snack: {
        title: 'Chá de Hortelã com Sementes de Erva-Doce e Alho Amassado (Suave)',
        desc: 'Infusão tradicional para reforçar o terreno biológico intestinal.'
      }
    },
    self_care_practice: {
      title: 'Verificação do Calendário Lunar no Pacificar',
      description: 'Abra a aba "Protocolos" e veja a data da próxima Lua Cheia e sua posologia calculada de Ivermectina e Carvão.',
      benefits: 'Garante que você terá os itens comprados antes do ciclo lunar iniciar.',
      duration: '2 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Verificar posologia de desparasitação no app',
      'Incluir sementes de abóbora na alimentação',
      'Zero comida industrializada',
      'Check-in noturno do Dia 16'
    ]
  },
  {
    day_number: 17,
    week_number: 3,
    theme: 'Harmonia Mente-Corpo & Sustentação de Hábitos',
    title: 'A Cura do Intestino Permeável (Leaky Gut)',
    subtitle: 'Como as junções celulares (tight junctions) se fecharam nesses dias',
    audio_title: 'Dia 17: O que mudou na sua barreira imunológica intestinal.',
    audio_duration: '2 min 00s',
    audio_summary: 'Como a ausência de zonulina ativada pelo glúten curou a permeabilidade intestinal.',
    audio_transcript: 'Você sabia que toda vez que alguém come glúten moderno com alto teor de gliadina, a proteína zonulina abre as portas do intestino, deixando toxinas caírem no sangue? Ficando 17 dias sem glúten, sua barreira intestinal finalmente selou as microfissuras. Sua imunidade está mais forte do que nunca.',
    daily_focus: 'Celebrar a sensação de leveza e ausência de distensão abdominal.',
    ayurvedic_quote: '“Quando o templo interior está protegido, nenhuma impureza exterior consegue abalar sua paz.”',
    meals: {
      breakfast: {
        title: 'Cuscuz de Milho com Ovos Mexidos e Gotas de Azeite de Oliva',
        desc: 'Café da manhã clássico e seguro, 100% sem trigo e sem leite.',
        tip: 'Fornece carboidrato limpo de digestão descomplicada.'
      },
      lunch: {
        title: 'Carne Bovina Moída com Cúrcuma e Abobrinha + Mandioquinha Assada com Alecrim',
        desc: 'Prato rico em zinco, ferro e antioxidantes.',
        tip: 'O zinco é o mineral número 1 para a cicatrização das paredes intestinais.'
      },
      dinner: {
        title: 'Sopa de Inhame com Cenoura, Coentro e Lascas de Frango',
        desc: 'Leve, quente e com alta densidade nutricional.',
        tip: 'Inhame fortalece o sistema imunológico e apoia a linfa.'
      },
      tea_or_snack: {
        title: 'Chá de Erva-Cidreira com Gengibre e Canela',
        desc: 'Equilibra os três doshas e aquece o metabolismo noturno.'
      }
    },
    self_care_practice: {
      title: 'Massagem Abdominal no Sentido Horário (Anuloma)',
      description: 'Antes de dormir, deite-se de barriga para cima e massageie suavemente seu abdômen em círculos no sentido horário (do lado direito inferior para cima, cruzando e descendo pelo esquerdo).',
      benefits: 'Acompanha o fluxo anatômico do cólon e facilita a evacuação matinal regular.',
      duration: '5 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Massagem abdominal no sentido horário',
      'Quádrupla restrição rigorosa',
      'Água morna ao longo do dia',
      'Check-in noturno do Dia 17'
    ]
  },
  {
    day_number: 18,
    week_number: 3,
    theme: 'Harmonia Mente-Corpo & Sustentação de Hábitos',
    title: 'A Relação com a Comida de Verdade',
    subtitle: 'Desfazendo a dependência de embalagens, conservantes e ultraprocessados',
    audio_title: 'Dia 18: Como a feira livre substitui a farmácia.',
    audio_duration: '1 min 50s',
    audio_summary: 'A simplicidade de cozinhar raízes, ovos e folhas frescas sem medo de comer comida real.',
    audio_transcript: 'Olá! Estamos no Dia 18. Olhe para a sua geladeira hoje: ela está cheia de comida que veio da terra e de produtores locais, e não de caixas cheias de ingredientes com nomes impronunciáveis. Você aprendeu que alimentar-se bem não é passar fome, é encher o prato com alimentos vivos que suas células reconhecem.',
    daily_focus: 'Sentir gratidão pelos alimentos simples e vivos que nutrem seu corpo.',
    ayurvedic_quote: '“A verdadeira riqueza é uma digestão saudável, sono tranquilo e a mente livre de toxinas.”',
    meals: {
      breakfast: {
        title: 'Tapioca com Ovos Mexidos, Sementes de Chia e Rodelas de Tomate com Orégano',
        desc: 'Tapioca com chia fornece fibras mucilaginosas que lubrificam o trânsito intestinal.',
        tip: 'Chia absorve até 10x seu peso em água, mantendo o cólon hidratado.'
      },
      lunch: {
        title: 'Sobrecoxa Assada com Massala + Purê de Batata-Doce + Feijão Fradinho e Vinagrete de Limão',
        desc: 'Prato completo e acolhedor com temperos digestivos.',
        tip: 'O limão ativa a secreção de pepsina e enzimas no estômago.'
      },
      dinner: {
        title: 'Omelete de Forno com Legumes Variados (Cenoura Ralada, Abobrinha e Tomate)',
        desc: 'Cozimento prático que rende uma refeição fofa e nutritiva.',
        tip: 'Zero farinhas e zero queijos, apenas ovos e vegetais frescos.'
      },
      tea_or_snack: {
        title: 'Chá de Camomila com Casca de Maçã e Canela',
        desc: 'Acalma o estômago e induz sono profundo e sem pesadelos.'
      }
    },
    self_care_practice: {
      title: 'Balanço da Jornada: O que você não quer mais voltar a comer?',
      description: 'Tome 5 minutos para refletir sobre alimentos que antes você comia por hábito e que hoje você percebe que te faziam mal.',
      benefits: 'Fortalece a mentalidade de longo prazo para além do 21º dia.',
      duration: '5 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Refletir sobre os alimentos que você não quer mais no seu corpo',
      'Manter alimentação 100% limpa',
      'Check-in noturno do Dia 18'
    ]
  },
  {
    day_number: 19,
    week_number: 3,
    theme: 'Harmonia Mente-Corpo & Sustentação de Hábitos',
    title: 'A Sustentação dos 120 Dias de Zeólita',
    subtitle: 'Como prosseguir com a quelação matinal mesmo após o encerramento dos 21 dias',
    audio_title: 'Dia 19: Por que a quelação com Zeólita deve durar 120 dias?',
    audio_duration: '2 min 10s',
    audio_summary: 'A meia-vida das hemácias e a liberação gradual de metais pesados dos ossos e gordura.',
    audio_transcript: 'Estamos quase cruzando a linha dos 21 dias! Mas lembre-se: seu contador de Zeólita no aplicativo continua até o Dia 120. Metais pesados como chumbo e alumínio ficam estocados no tecido ósseo e adiposo e levam cerca de 4 meses para serem completamente mobilizados e excretados. Continue tomando sua colherzinha matinal com água todos os dias!',
    daily_focus: 'Integrar a Zeólita como um hábito matinal automático como escovar os dentes.',
    ayurvedic_quote: '“A paciência é a virtude dos sábios; o corpo se renova no tempo sagrado da natureza.”',
    meals: {
      breakfast: {
        title: 'Banana da Terra Cozida com Canela + Ovos Mexidos com Ghee e Cúrcuma',
        desc: 'Café da manhã clássico e cheio de energia para a manhã de sexta-feira.',
        tip: 'Potássio e magnésio para o coração e tônus muscular.'
      },
      lunch: {
        title: 'Peixe Ensopado com Macaxeira, Pimentão, Tomate e Coentro',
        desc: 'Ensopado suculento com raízes que absorvem todo o sabor das ervas.',
        tip: 'Rico em fósforo, iodo e minerais marinhos essenciais.'
      },
      dinner: {
        title: 'Creme de Abóbora com Gengibre e Folhas de Couve',
        desc: 'Sopa leve e aveludada para relaxar no final de semana.',
        tip: 'Alcaliniza o pH corporal antes de dormir.'
      },
      tea_or_snack: {
        title: 'Chá de Passiflora com Melissa e Erva-Doce',
        desc: 'Excelente para desacelerar pensamentos e induzir sono reparador.'
      }
    },
    self_care_practice: {
      title: 'Automassagem nos Pés com Óleo Morno',
      description: 'Massageie a planta dos pés com óleo de gergelim aquecido antes de deitar.',
      benefits: 'Reduz o estresse da semana de trabalho e ancora a energia Vata.',
      duration: '5 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Automassagem relaxante nos pés',
      'Quádrupla restrição mantida',
      'Check-in noturno do Dia 19'
    ]
  },
  {
    day_number: 20,
    week_number: 3,
    theme: 'Harmonia Mente-Corpo & Sustentação de Hábitos',
    title: 'A Véspera da Conquista: Olhando a Linha de Chegada',
    subtitle: 'Preparando a mente para a conclusão dos 21 dias e a manutenção perene',
    audio_title: 'Dia 20: Amanhã você completa os 21 dias de Pacificar!',
    audio_duration: '2 min 20s',
    audio_summary: 'Reflexão sobre a jornada percorrida e a celebração da sua coragem e disciplina.',
    audio_transcript: 'Olá! Você chegou ao 20º dia. Sinta a grandeza dessa conquista. Você resistiu a todos os apelos de alimentos inflamatórios, cuidou da sua digestão, raspou sua língua, registrou seus check-ins e tomou sua zeólita. Amanhã teremos a emissão do seu Relatório Final Consolidado e as orientações da fase de manutenção. Tenha muito orgulho de você!',
    daily_focus: 'Preparar-se para o dia final com alegria e senso de dever cumprido.',
    ayurvedic_quote: '“Quem vence a si mesmo e aos próprios vícios atinge a mais nobre de todas as vitórias.”',
    meals: {
      breakfast: {
        title: 'Cuscuz Nordestino com Ovos Poché e Sementes de Gergelim Tostadas',
        desc: 'Café da manhã acolhedor de sábado.',
        tip: 'O cuscuz é a prova de que comida saudável é deliciosa e acessível.'
      },
      lunch: {
        title: 'Moqueca de Frango Caipira com Leite de Coco, Pimentões, Tomate e Arroz Integral',
        desc: 'Prato aromático e festivo feito com ingredientes 100% limpos e especiarias.',
        tip: 'Mostra como é possível fazer banquetes incríveis sem leite de vaca ou glúten.'
      },
      dinner: {
        title: 'Sopa de Legumes com Inhame, Cenoura e Frango em Cubinhos',
        desc: 'Sopa reconfortante para a última noite da jornada oficial.',
        tip: 'Leveza total para consolidar o resultado no 21º dia.'
      },
      tea_or_snack: {
        title: 'Chá de Maçã com Canela e Cravo',
        desc: 'Aquece e traz uma sensação profunda de acolhimento e paz.'
      }
    },
    self_care_practice: {
      title: 'Banho Terapêutico Morno com Respiração Consciente',
      description: 'Tome um banho morno demorado, visualizando a água lavando qualquer resquício de cansaço ou tensão acumulada.',
      benefits: 'Relaxamento miofascial profundo e purificação dos sentidos.',
      duration: '15 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Desfrutar do banho relaxante de sábado',
      'Alimentação limpa mantida',
      'Check-in noturno do Dia 20'
    ]
  },
  {
    day_number: 21,
    week_number: 3,
    theme: 'Harmonia Mente-Corpo & Sustentação de Hábitos',
    title: 'Dia 21: A Grande Conquista & Seu Novo Estilo de Vida',
    subtitle: 'Celebração dos 21 dias concluídos: seu Relatório Final e o plano de manutenção',
    audio_title: 'Dia 21: Parabéns pela sua transformação! O que vem agora?',
    audio_duration: '3 min 10s',
    audio_summary: 'Mensagem emocionante de Ana Carla Nesi consolidando sua nova relação com a saúde, a comida e seu corpo.',
    audio_transcript: 'Querido(a) paciente, que emoção imensa chegar a este Dia 21! Eu, Ana Carla Nesi, celebro com você essa vitória extraordinária. Você não apenas completou 21 dias de desinflamação: você reprogramou seu paladar, curou seu intestino, desintoxicou seu fígado e provou que é capaz de honrar o templo sagrado que é o seu corpo. O PACIFICAR não termina aqui — ele se torna o seu estilo de vida perene. Continue com sua Zeólita até o Dia 120, execute suas 5 luas de desparasitação e consulte suas prescrições personalizadas aqui no app. Um abraço afetuoso e siga sempre brilhando!',
    daily_focus: 'Abrir seu Relatório Final Consolidado, conferir suas métricas e compartilhar sua vitória.',
    ayurvedic_quote: '“A cura verdadeira não é o fim dos sintomas, mas o despertar da consciência de quem você realmente é.”',
    meals: {
      breakfast: {
        title: 'Banquete do Dia 21: Crepioca com Ovos, Abacate Temperado, Macaxeira Crocante e Chá Especial',
        desc: 'Café da manhã festivo e abundante, 100% livre de qualquer ingrediente inflamatório.',
        tip: 'Comemore sua vitória saboreando cada textura com amor e gratidão.'
      },
      lunch: {
        title: 'Peixe Assado no Forno com Ervas Frescas, Purê de Mandioquinha e Salada Colorida',
        desc: 'Almoço de domingo digno de celebração, leve e restaurador.',
        tip: 'O peixe com mandioquinha sintetiza o melhor da nutrição integrativa limpa.'
      },
      dinner: {
        title: 'Creme Aveludado de Abóbora com Leite de Coco, Gengibre e Sementes de Girassol',
        desc: 'Para fechar os 21 dias com leveza, gratidão e bem-estar digestivo.',
        tip: 'O intestino em equilíbrio garante sono dos anjos.'
      },
      tea_or_snack: {
        title: 'Chá Especial de Celebração: Tulsi, Canela, Gengibre e Cardamomo',
        desc: 'A sinergia ayurvédica de ouro para ancorar a vitalidade e clareza mental.'
      }
    },
    self_care_practice: {
      title: 'Consagração do Hábito & Carta para o Seu Futuro Eu',
      description: 'Escreva nas notas do seu check-in uma mensagem para você mesmo(a) lembrar sempre da disposição e leveza que você conquistou nestes 21 dias.',
      benefits: 'Ancoragem emocional definitiva do hábito na mente subconsciente.',
      duration: '10 minutos'
    },
    checklist: [
      'Raspar língua + Zeólita matinal',
      'Completar o Check-in Noturno do Dia 21',
      'Abrir e baixar o Relatório Final Consolidado (D21)',
      'Celebrar a conquista com confetes no App!',
      'Planejar os próximos passos na aba "Protocolos"'
    ]
  }
];
