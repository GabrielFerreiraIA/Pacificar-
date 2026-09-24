# 01 — EXECUTIVE SUMMARY

O **PACIFICAR PWA** é um micro aplicativo progressivo (PWA mobile-first) projetado para digitalizar, estruturar e escalar a metodologia clínica e ayurvédica de 21 dias criada pela psicóloga clínica e terapeuta ayurvédica **Ana Carla Nesi** (CRP 17/2833).

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                            PACIFICAR PWA                               │
   │           Jornada de 21 Dias de Desinflamação & Saúde Integrativa      │
   ├───────────────────┬──────────────────────────┬─────────────────────────┤
   │    1. PREPARAÇÃO  │       2. JORNADA         │     3. MANUTENÇÃO       │
   │  • Anamnese Ayu   │  • 21 Dias Guiados       │  • Zeólita (120d)       │
   │  • Upload Exames  │  • 4 Restrições Centrais │  • Desparasitação (5L)  │
   │  • Guia de Ervas  │  • Check-in & Bristol    │  • Suplementação        │
   │  • Aromaterapia   │  • Resumos Semanais      │  • Hábitos Perenes      │
   └───────────────────┴──────────────────────────┴─────────────────────────┘
```

### Principais Objetivos do Produto
1. **Eliminar o gargalo operacional da consulta inicial manual**, substituindo o alinhamento expositivo repetitivo por um onboarding digital educativo e estruturado.
2. **Guiar o paciente dia a dia pelos 21 dias de desinflamação** com receitas sugeridas ("comida de verdade"), práticas de autocuidado (raspagem lingual, massagens ayurvédicas), áudios curtos diários de 1 a 3 minutos e regras de eliminação (glúten, lácteos, açúcar refinado e álcool).
3. **Coletar e correlacionar métricas de saúde diárias** através de um check-in de 60 segundos com a Escala de Bristol integrada, gerando relatórios de correlação no 7º, 14º e 21º dias.
4. **Gerenciar protocolos estendidos de manutenção**: Protocolo de Zeólita (120 dias para quelação de metais pesados) e Protocolo de Desparasitação (5 ciclos sincronizados com o calendário lunar/lua cheia).
5. **Painel de Acompanhamento do Terapeuta (Admin)** para revisão ágil de anamneses, exames anexados e prescrição de aromaterapia, massalas personalizadas e suplementação final.

---

# 02 — O QUE ENTENDI DA REUNIÃO

### 2.1 Análise de Fatos, Inferências e Recomendações

* **FATO `[CONFIRMADO NA REUNIÃO]`**: Ana Carla Nesi atende pacientes prescrevendo o programa "PACIFICAR" de 21 dias, focado em comida de verdade, eliminação de inflamatórios e equilíbrio metabólico/emocional via Ayurveda e Psicologia Clínica.
* **FATO `[CONFIRMADO NA REUNIÃO]`**: A jornada atual inicia com uma anamnese longa (10 páginas abordando queixas, digestão, fezes via Bristol, histórico familiar, alimentação, emoções, sono, ginecologia e características físicas).
* **FATO `[CONFIRMADO NA REUNIÃO]`**: A consulta inicial de alinhamento pode ser eliminada/automatizada no app se a metodologia, orientações e listas forem entregues de forma clara e interativa.
* **FATO `[CONFIRMADO NA REUNIÃO]`**: A base alimentar exclui glúten, leite e derivados, açúcar e álcool, priorizando preparações regionais nutritivas (raízes, tubérculos, ovos, leguminosas e carnes).
* **FATO `[CONFIRMADO NA REUNIÃO]`**: Existem protocolos complementares de longo prazo: Zeólita (120 dias contínuos em jejum) e Desparasitação com Ivermectina + Carvão Ativado + Água Oxigenada (3 dias em cada uma das 5 luas cheias consecutivas).
* **INFERÊNCIA**: Pacientes precisam de confirmações diárias e lembretes visuais simples para não se sentirem perdidos quanto ao que comer e quais práticas executar.
* **RECOMENDAÇÃO**: Utilizar uma arquitetura PWA com autenticação por Magic Link (ou e-mail/senha) sem fricção, permitindo instalação nativa na tela inicial (iOS e Android) e suporte offline para consulta a listas e receitas.

### 2.2 Tabela de Ideias Levantadas

| Ideia Levantada | Quem Sugeriu | Problema que Resolve | Valor | Complexidade | Decisão de Escopo |
|---|---|---|---|---|---|
| Anamnese Digital Interativa com Bristol | Ana & Gabriel | Elimina o preenchimento de Word/PDF de 10 páginas e digitação manual | Altíssimo | Média | **CORE (MVP)** |
| Upload de Exames Laboratoriais | Ana | Centraliza laudos de vitaminas/minerais (D3, B12, Ferro, Zinco) | Alto | Baixa | **CORE (MVP)** |
| Eliminação da 1ª Consulta Síncrona | Ana | Desafoga a agenda clínica da terapeuta sem perder entrega de valor | Altíssimo | Baixa | **CORE (MVP)** |
| Check-in Diário de Sintomas & Bristol | Ana (via GPT) | Monitora adesão, energia, humor, sono, evacuação e fissura por doce | Altíssimo | Média | **CORE (MVP)** |
| Áudios Curtos Diários (1–3 min) | Ana (via GPT) | Humaniza a condução e oferece a voz/presença acolhedora da terapeuta | Alto | Baixa | **CORE (MVP)** |
| Desbloqueio Diário de Receitas | Gabriel & Ana | Reduz a ansiedade sobre "o que comer" sem engessar a rotina alimentar | Alto | Baixa | **CORE (MVP)** |
| Relatórios de Correlação (D7, D14, D21) | Ana (via GPT) | Evidencia a melhora sintomática ao paciente e fideliza o tratamento | Altíssimo | Média | **CORE (MVP)** |
| Rastreador Lunar p/ Desparasitação | Ana | Garante que o paciente tome a dose no ciclo correto de 5 luas | Alto | Média | **IMPORTANTE (V1.1 / MVP Simplificado)** |
| Rastreador de Zeólita (120 Dias) | Ana | Assegura continuidade da quelação de metais após o 21º dia | Médio | Baixa | **CORE (MVP)** |
| E-book / Audiobook Expandido de Receitas | Ana | Conteúdo complementar para pacientes que querem aprofundar | Médio | Alta | **FUTURO (V2)** |
| Notificações Push Web PWA | Gabriel | Lembretes diários de água, raspagem da língua e check-in noturno | Alto | Média | **CORE (MVP)** |

---

# 03 — METODOLOGIA DO CLIENTE

A metodologia **PACIFICAR** integra a sabedoria milenar da **Medicina Ayurvédica** com a escuta empática da **Psicologia Clínica Integrativa**.

```
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                         FLUXO DA METODOLOGIA                             │
  └──────────────────────────────────────────────────────────────────────────┘
       │
       ▼
  [ 01. DIAGNÓSTICO INTEGRATIVO ]
       • Anamnese Ayurvédica (Digestão/Agni, Eliminações/Mala, Doshas, Emoções)
       • Leitura funcional de exames sanguíneos (B12, Vit D3, Ferritina, Zinco)
       │
       ▼
  [ 02. PREPARAÇÃO & APORTE DE RECURSOS ]
       • Kit de Especiarias e Massalas (Vata, Pitta, Kapha) e Chás digestivos
       • Prescrição personalizada de Aromaterapia e Óleos carreadores
       • Ferramental de autocuidado (Raspador lingual de cobre, Óleo de rícino)
       │
       ▼
  [ 03. JORNADA DE 21 DIAS — O "RESET" METABÓLICO ]
       • Eliminação Total: Glúten, Leite/Derivados, Açúcar Refinado e Álcool
       • Pilar Central: "Comida de Verdade" rica, regional e anti-inflamatória
       • Semanas 1 a 3: Desinflamação progressiva, aumento de Agni e clareza
       • Check-ins Diários: Registro de 11 biomarcadores perceptivos + Bristol
       │
       ▼
  [ 04. MANUTENÇÃO & PROTOCOLOS PROFUNDOS ]
       • Protocolo de Zeólita: 120 dias de quelação matinal de metais pesados
       • Protocolo de Desparasitação: 5 meses de ciclos lunares na Lua Cheia
       • Suplementação personalizada e plano de sustentação de hábitos
```

### Pilares Fundamentais do Tratamento

1. **Agni & Digestão (Eliminação de Toxinas / Ama)**:
   - A digestão é avaliada clinicamente pelo formato das fezes (Escala de Bristol), odor, gases, refluxo e sensação de peso pós-prandial.
   - O uso de massalas terapêuticas (misturas de cominho, cúrcuma, gengibre, cardamomo, canela, mostarda e assa-fétida) atua como catalisador digestivo natural.
   - A raspagem diária da língua com cobre em jejum remove toxinas noturnas excretadas.

2. **Quádrupla Restrição Terapêutica**:
   - **Glúten**: Proteína pró-inflamatória de difícil quebra que lesa a barreira intestinal (leaky gut) e sobrecarrega o sistema imunológico.
   - **Leite e Derivados**: Promotores de muco, hiper-reatividade e inflamação sistêmica.
   - **Açúcar Refinado**: Disruptor metabólico, indutor de picos insulínicos e compulsão dopaminérgica.
   - **Álcool**: Sobrecarga hepática direta e desregulador do sono reparador e da microbiota.

3. **Nutrição de Raiz ("Comida de Verdade")**:
   - Foco em alimentos não industrializados: raízes (macaxeira, batata-doce, inhame), milho (cuscuz nordestino), ovos caipiras, frutas frescas, sementes, leguminosas demolhadas e proteínas limpas preparadas com especiarias digestivas e manteiga ghee/óleo de coco.

4. **Protocolos Paralelos de Desintoxicação Profunda**:
   - **Zeólita Clinoptilolita Micronizada**: 1 colher/dose em água em jejum durante 120 dias para adsorção e eliminação de alumínio, chumbo e outros metais pesados.
   - **Desparasitação Cíclica Lunar**: 3 dias consecutivos de Ivermectina na Lua Cheia (pico de migração de parasitas intestinais) acompanhados de Carvão Ativado à noite (para adsorver amônia liberada pelos vermes mortos) e 10 gotas de água oxigenada diluída após as refeições. Repetido em 5 ciclos lunares.

---

# 04 — PRODUCT INTELLIGENCE MAP

### Proposta Central
> *Este aplicativo existe para guiar pacientes por uma jornada descomplicada de 21 dias de desinflamação ayurvédica e autocuidado, transformando a relação com a comida e rastreando a evolução do corpo sem a sobrecarga de consultas síncronas desnecessárias.*

### Job To Be Done (JTBD)
> **Quando** eu me sinto inflamado(a), com digestão lenta, cansaço crônico e mente nublada por maus hábitos,  
> **eu quero** um guia diário prático, estruturado e acolhedor com receitas limpas, rituais de autocuidado e rastreamento de sintomas,  
> **para conseguir** restaurar minha vitalidade, desinchar o corpo, limpar meu intestino e reconectar minha mente à saúde natural.

### Transformação Prometida

```
  ESTADO INICIAL (Inflamação & Confusão)
  ├─ Intestino irregular (Bristol Tipo 1, 2 ou 6)
  ├─ Dependência de glúten, café excessivo e açúcar
  ├─ Cansaço matinal crônico e confusão mental (brain fog)
  └─ Insegurança sobre "o que posso comer sem adoecer"
                           │
                           ▼
  EXPERIÊNCIA PROPORCIONADA (Clareza & Acolhimento Diário)
  ├─ Onboarding guiado e anamnese sem burocracia
  ├─ Roteiro dia a dia com áudio de 2 min da terapeuta
  ├─ Receitas descomplicadas com raízes e massalas ayurvédicas
  └─ Check-in diário de 60s com gráficos semanais de vitória
                           │
                           ▼
  ESTADO DESEJADO (Vitalidade & Autonomia)
  ├─ Intestino regulado (Bristol Tipo 4 regular diário)
  ├─ Sono profundo, ausência de enxaquecas e mente nítida
  ├─ Desparasitação e quelação de metais em andamento
  └─ Domínio completo da nutrição anti-inflamatória sustentável
```

### Loop de Valor Central (Daily Engagement Loop)

```
       [TRIGGER (Gatilho)]
       • Notificação matinal (07:30): "Bom dia! Seu dia X do Pacificar começou."
       • Notificação noturna (20:30): "Hora do seu Check-in Noturno & Autocuidado."
               │
               ▼
       [AÇÃO (Micro-compromisso)]
       • Escutar áudio do dia (1 a 2 min) + marcar checklist matinal (Raspador/Água).
       • Noite: Preencher o Check-in de 60 segundos (Escala de Bristol + Sintomas).
               │
               ▼
       [FEEDBACK (Recompensa Imediata)]
       • Mensagem de validação personalizada + indicador visual de streak e vitória.
               │
               ▼
       [PROGRESSO (Sensação de Conquista)]
       • Barra de progresso dos 21 dias preenche; Gráficos semanais correlacionam melhora.
               │
               ▼
       [PRÓXIMA AÇÃO]
       • Liberação do conteúdo/cardápio do dia seguinte ou ativação da Lua Cheia.
```

---

# 05 — PROPOSTA DO MICRO APP

### Classificação do Produto
* **Tipo**: *Guided Protocol Companion & Clinical Tracker PWA* (App Web Progressivo de Acompanhamento Terapêutico e Rastreamento de Hábitos).
* **Foco de Plataforma**: Mobile-First (Otimizado para PWA em smartphones 390x844px), instalável via Safari ("Adicionar à Tela de Início") e Chrome PWA, com painel web responsivo para a Terapeuta.

### Objetivos do Produto
1. **Objetivo Principal**: Garantir que 100% dos pacientes que iniciam o Pacificar completem os 21 dias com adesão superior a 80% às restrições e preenchimento dos check-ins.
2. **Objetivos Secundários**:
   - Reduzir o tempo clínico de admissão de cada paciente de 60 min para 10 min (revisão de dashboard).
   - Proporcionar clareza pedagógica e culinária sobre o que é "Comida de Verdade".
   - Controlar com precisão os protocolos de longo prazo (Zeólita 120d e 5 Luas Cheias).

### North Star Metric
> **Índice de Conclusão de Jornada com Check-in Ativo (ICJCA)**: % de pacientes inscritos que atingem o 21º dia tendo registrado pelo menos 18 check-ins diários.

---

# 06 — FUNCIONALIDADES PRIORIZADAS

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                           MATRIZ DE ESCOPO                              │
  ├───────────────────┬───────────────────────────┬─────────────────────────┤
  │   1. CORE (V1)    │    2. IMPORTANTE (V1.1)   │      3. FUTURO (V2)     │
  │  • Auth / Perfil  │  • Calendário Lunar Auto  │  • Chatbot IA Terapeuta │
  │  • Anamnese Ayu   │  • Push Notifications Web │  • Audiobook Integrado  │
  │  • Upload Exames  │  • Exportação PDF Relatório│ • Comunidade Social    │
  │  • 21 Dias Guia   │  • Alertas de Hidratação  │  • Módulo de Compras 1C │
  │  • Player Áudios  │  • Comparador Foto Pratos │  • Integração Lab APIs  │
  │  • Check-in Diário│  • Guia de Restaurantes   │  • Gamificação Avançada │
  │  • Escala Bristol │                           │                         │
  │  • Resumo Semanal │                           │                         │
  │  • Rastreador Zeó │                           │                         │
  │  • Desparasitação │                           │                         │
  │  • Painel Terapeuta│                          │                         │
  └───────────────────┴───────────────────────────┴─────────────────────────┘
```

---

# 07 — ARQUITETURA DE INFORMAÇÃO

```
PACIFICAR APP (PWA)
├── 0.0 Autenticação & Entrada
│   ├── Login / Criar Conta (Email + Magic Link / Senha)
│   ├── Recuperação de Senha
│   └── Onboarding de Boas-Vindas
│
├── 1.0 Etapa 0: Preparatório & Admissão
│   ├── Anamnese Ayurvédica Dinâmica (10 blocos modulares)
│   ├── Upload de Exames de Sangue (Fotos/PDFs)
│   ├── Guia Oficial de Especiarias, Massalas & Ervas
│   ├── Prescrição Personalizada de Aromaterapia (definida pela terapeuta)
│   └── Vídeo/Áudio "Como Começar o Pacificar"
│
├── 2.0 Jornada dos 21 Dias (Área Principal do Paciente)
│   ├── Visão do Dia Atual (Dia 1 ao 21)
│   │   ├── Áudio Terapêutico do Dia (Player nativo com voz de Ana Carla)
│   │   ├── Intenção & Foco Mental do Dia
│   │   ├── Sugestão de Cardápio Limpo (Café, Almoço, Jantar)
│   │   ├── Prática Ayurvédica de Autocuidado
│   │   ├── Checklist Matinal/Vespertino
│   │   └── Botão Flutuante: "Fazer Check-in do Dia"
│   │
│   ├── Check-in Noturno de Sintomas
│   │   ├── Escala de Sintomas (11 itens: Energia, Sono, Dor, Inchaço, etc.)
│   │   ├── Seletor Visual da Escala de Bristol (Tipos 1 a 7 com ilustrações)
│   │   ├── Registro de Hábitos (Alimentação, Água, Movimento, Autocuidado)
│   │   └── Campo Livre Opcional: "Diário do Dia"
│   │
│   └── Relatórios & Checkpoints Semanais
│       ├── Checkpoint Semana 1 (Dia 7) — Reset & Desinchaço
│       ├── Checkpoint Semana 2 (Dia 14) — Vitalidade & Digestão
│       └── Checkpoint Final (Dia 21) — Transformação Consolidada
│
├── 3.0 Protocolos de Manutenção
│   ├── Protocolo de Zeólita (Contador regressivo de 120 dias em jejum)
│   ├── Protocolo de Desparasitação (Rastreador das 5 Luas Cheias + dosagens por peso)
│   └── Plano de Suplementação Personalizada (prescrito por Ana Carla)
│
├── 4.0 Biblioteca & Recursos
│   ├── Guia "O Que Comer vs O Que Eliminar" (Tabela Prática)
│   ├── Banco de Receitas Rápidas Nordestinas & Ayurvédicas
│   ├── Dicionário de Especiarias & Antídotos
│   └── Guia de Rótulos & Perigos Ocultos
│
└── 5.0 Painel Administrativo do Terapeuta (Web/Desktop)
    ├── Lista de Pacientes Ativos e Status da Jornada
    ├── Visualizador de Anamnese & Laudos de Exames Anexados
    ├── Módulo de Prescrição (Aromaterapia, Chás e Suplementos pós-D21)
    └── Dashboard de Aderência e Alertas de Pacientes em Risco
```

---

# 08 — USER FLOWS

### Fluxo 1: Onboarding, Anamnese e Admissão
```
[CADASTRO/LOGIN] 
  ──► [BOAS-VINDAS: VÍDEO EXPLICATIVO ANA NESI]
  ──► [FORMULÁRIO DE ANAMNESE (Auto-save por etapa)]
  ──► [UPLOAD DE EXAMES DE SANGUE (Opcional se tiver)]
  ──► [REVISÃO DE LISTA DE COMPRAS: ESPECIARIAS & ÓLEOS]
  ──► [LIBERAÇÃO DO START DA JORNADA DE 21 DIAS]
```

### Fluxo 2: Execução do Dia a Dia do Paciente
```
[PUSH MATINAL] 
  ──► [ABRE HOME: DIA X] 
  ──► [OUVE ÁUDIO DO DIA (1-2 min)] 
  ──► [CONSULTA REFEIÇÕES SUGERIDAS & RITUAL DE AUTOCUIDADO] 
  ──► [MARCA ITENS DO CHECKLIST AO LONGO DO DIA] 
  ──► [À NOITE: ABRE CHECK-IN] 
  ──► [PREENCHE SINTOMAS + CLICA NA FOTO DA ESCALA DE BRISTOL] 
  ──► [FEEDBACK DE CONCLUSÃO DO DIA + ATUALIZAÇÃO DA STREAK]
```

### Fluxo 3: Fechamento de Ciclo Semanal (Dias 7, 14 e 21)
```
[CHECK-IN D7/D14/D21 CONCLUÍDO]
  ──► [EXIBE TELA DE PARABÉNS & MILESTONE]
  ──► [COMPARAÇÃO GRÁFICA: ENERGIA X SONO X INCHAÇO X BRISTOL]
  ──► [INSIGHT AUTOMÁTICO DO APP]
  ──► [DESBLOQUEIO DA SEMANA SEGUINTE / LIBERAÇÃO DA MANUTENÇÃO]
```

---

# 09 — INVENTÁRIO DE TELAS

| ID | Tela | Objetivo | Rota | Componentes Chave |
|---|---|---|---|---|
| **SCR-001** | Splash & Auth | Autenticar usuário | `/login` | Input E-mail, Botão Magic Link, Logo, Badge Ayurveda |
| **SCR-002** | Boas-Vindas & Admissão | Apresentar método e iniciar | `/onboarding` | Video Player, Stepper de 3 etapas, CTA Iniciar Anamnese |
| **SCR-003** | Anamnese Ayurvédica | Coletar histórico clínico completo | `/anamnese` | Form multi-etapas, Escala Bristol interativa, Auto-save |
| **SCR-004** | Upload de Exames | Anexar exames de sangue | `/exames-upload` | File Dropzone, visualizador de PDFs/JPGs, lista de pendências |
| **SCR-005** | Home / Dia Atual | Guia diário de execução | `/app/hoje` | Card Dia X/21, Audio Player, Cardápio do Dia, Checklist, CTA Check-in |
| **SCR-006** | Check-in Noturno | Rastrear sintomas e digestão | `/app/checkin/:dia` | Sliders 1-5, Seletor Bristol visual, Toggles hábitos, Diário |
| **SCR-007** | Checkpoint Semanal | Mostrar evolução gráfica | `/app/relatorio/:semana` | Gráfico Radar/Linha, Comparativo Bristol, Card de Insights |
| **SCR-008** | Guia de Alimentação | Consultar o que comer e receitas | `/app/nutricao` | Tabs (Permitidos / Eliminar / Receitas), Busca de Massalas |
| **SCR-009** | Protocolo Zeólita | Controlar 120 dias de quelação | `/app/zeolita` | Contador circular 120d, Instruções de diluição, Toggle diário |
| **SCR-010** | Desparasitação Lunar | Sincronizar dosagens e Luas Cheias | `/app/desparasitacao` | Calendário das 5 Luas, Calculadora por Peso, Guia Carvão/H2O2 |
| **SCR-011** | Painel Terapeuta (Admin)| Visão clínica de pacientes | `/admin/pacientes` | Tabela de pacientes, Filtro por adesão, Drawer com Anamnese |
| **SCR-012** | Prescrição Terapeuta | Prescrever aromaterapia e suplementos | `/admin/prescrever/:userId` | Form de óleos essenciais, massala dosha e suplementos |

---

# 10 — ASCII WIREFRAMES

### SCR-005: Home / Dia Atual (390 x 844 px Viewport)
```
┌──────────────────────────────────────────────────┐
│  PACIFICAR                 🌿 Dia 06 de 21  (🔔) │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ 🎧 ÁUDIO DO DIA • 1 min 45s                │  │
│  │ "Superando a vontade de doces no Dia 6"    │  │
│  │ [ ▶ Reproduzir ]  ════════●───── 01:45    │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ 🎯 FOCO DE HOJE                            │  │
│  │ "Mastigação consciente e chá de cominho"   │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  🥗 SUGESTÕES DE REFEIÇÃO DO DIA                 │
│  ┌────────────────────────────────────────────┐  │
│  │ • Manhã: Macaxeira cozida + Ovos caipiras  │  │
│  │ • Almoço: Feijão verde + Purê de abóbora   │  │
│  │ • Jantar: Sopa cremosa com Massala Kapha   │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ✅ CHECKLIST DE AUTOCUIDADO                     │
│  [X] Raspar a língua em jejum (Cobre)            │
│  [X] 500ml de água morna com gotas de limão      │
│  [ ] Massagem nos pés com óleo morno à noite     │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ 📝 FAZER CHECK-IN NOTURNO (Pendente)       │  │
│  │ [ Registrar Digestão, Sono e Sintomas  ➔ ] │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
├──────────────────────────────────────────────────┤
│   🏠 Hoje   │   🥗 Guia   │  🌕 Protocolos │ 👤 Perfil│
└──────────────────────────────────────────────────┘
```
* **Objetivo**: Fornecer clareza total do que fazer no dia em menos de 10 segundos.
* **Hierarquia Visual**: Player do Áudio > Foco do Dia > Refeições > Checklist > Botão de Check-in.
* **CTA Principal**: Botão flutuante/bloco verde para abrir o Check-in Noturno.

---

### SCR-006: Check-in Noturno & Seletor de Bristol
```
┌──────────────────────────────────────────────────┐
│  ← Voltar             CHECK-IN NOTURNO • DIA 06  │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. Como você avalia sua energia hoje?           │
│  ( ) Muito Baixa  ( ) Baixa  ( ) Boa  (X) Ótima │
│                                                  │
│  2. Nível de Inchaço Abdominal / Gases:          │
│  [ Nenhum ]  [ Leve ]  [ Moderado ]  [ Intenso ] │
│                                                  │
│  3. Desejo por Açúcar / Doces:                   │
│  ● Zero Fissura     ○ Vontade Leve    ○ Incontrolável
│                                                  │
│  4. Como foram suas fezes hoje? (Bristol):       │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │ [Img T1]  │ │ [Img T2]  │ │ [Img T3]  │       │
│  │ Bolinhas  │ │ Grumosa   │ │ Rachada   │       │
│  └───────────┘ └───────────┘ └───────────┘       │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │▓▓ [Img T4]│ │ [Img T5]  │ │ [Img T6/7]│       │
│  │▓ Lisa/Suave│ │ Pedaços   │ │ Líquida   │       │
│  └───────────┘ └───────────┘ └───────────┘       │
│  * Tipo 4 Selecionado: Ideal / Equilíbrio Ayurvédico
│                                                  │
│  5. Adesão à Comida Limpa (Sem glúten/leite/açúcar):│
│  [X] 100% Limpo   [ ] Deslize Leve   [ ] Não segui│
│                                                  │
│  6. Algo importante a registrar hoje? (Opcional):│
│  ┌────────────────────────────────────────────┐  │
│  │ "Senti muita disposição após o almoço..."  │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ [  CONCLUIR CHECK-IN DO DIA 06  ✓  ]       │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```
* **Objetivo**: Registro clínico rápido de biomarcadores em menos de 1 minuto.
* **Hierarquia Visual**: Perguntas diretas com botões seletores tipo *pill* e grid de imagens da Escala de Bristol.
* **CTA Principal**: Botão de confirmação com feedback sonoro suave e confetes sutis.

---

### SCR-010: Protocolo de Desparasitação & Lua Cheia
```
┌──────────────────────────────────────────────────┐
│  ← Voltar              DESPARASITAÇÃO LUNAR 🌕   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ 🌕 PRÓXIMA LUA CHEIA: 18 de Setembro       │  │
│  │ Faltam 12 dias para o Ciclo 02 de 05       │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  💊 SUA POSOLOGIA CALCULADA (Peso: 68 kg)        │
│  ┌────────────────────────────────────────────┐  │
│  │ • Ivermectina: 3 comprimidos pela manhã     │  │
│  │   (Tomar após o café nos 3 dias de Lua)    │  │
│  │                                            │  │
│  │ • Carvão Ativado (250mg): 2 comprimidos    │  │
│  │   (Tomar antes de dormir p/ eliminar amônia)│  │
│  │                                            │  │
│  │ • Água Oxigenada 10v: 10 gotas em água     │  │
│  │   (Após as 3 principais refeições)         │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  📅 PROGRESSO DOS 5 CICLOS LUNARES               │
│  [✓] Ciclo 1 (Agosto) — Concluído                │
│  [ ] Ciclo 2 (Setembro) — Em 12 dias             │
│  [ ] Ciclo 3 (Outubro)                           │
│  [ ] Ciclo 4 (Novembro)                          │
│  [ ] Ciclo 5 (Dezembro)                          │
│                                                  │
│  [ 🔔 Ativar Lembrete 2 dias antes da Lua ]      │
└──────────────────────────────────────────────────┘
```

---

# 11 — BRANDING

### 11.1 Personalidade da Marca
* **Acolhedora & Humanizada**: Tom terapêutico, empático e maternal característico de Ana Carla Nesi.
* **Ancestral & Científica**: Equilíbrio exato entre a medicina milenar ayurvédica e evidências integrativas modernas.
* **Serena & Desinflamatória**: Transmite leveza, clareza e desintoxicação desde o primeiro olhar.

### 11.2 Antiatributos (O que a marca NÃO é)
* **Não é Hospitalar / Fria**: Evita cinzas gélidos e azuis estéreis cirúrgicos.
* **Não é Fitness / Punitiva**: Zero apelo a corpos "sarados", contagem obsessiva de calorias ou terrorismo estético.
* **Não é Esotérica Vazia**: Toda recomendação ancestral possui embasamento fisiológico e digestivo claro.

### 11.3 Paleta de Cores e Tokens

```css
:root {
  /* Primárias / Terra & Natureza */
  --color-primary: #2D5A43;        /* Verde Floresta Ayurvédico Profundo */
  --color-primary-light: #EBF4EE;  /* Fundo sutil de destaque */
  --color-secondary: #C88D48;      /* Ocre Dourado / Cúrcuma / Sol */
  --color-secondary-light: #FBF4EB;/* Fundo sutil dourado */

  /* Neutros Acolhedores */
  --color-bg-app: #F9F7F2;         /* Off-white quente / Pergaminho suave */
  --color-surface: #FFFFFF;        /* Branco puro para cards */
  --color-surface-subtle: #F1EFE9; /* Cinza quente para bordas e divisores */
  
  /* Textos */
  --color-text-primary: #1C2621;   /* Chumbo vegetal quase preto */
  --color-text-secondary: #5A6961; /* Verde oliva acinzentado */
  --color-text-muted: #8E9E96;     /* Para legendas e placeholders */

  /* Semânticas */
  --color-success: #3E8A5E;        /* Verde regeneração */
  --color-warning: #D9822B;        /* Alerta amarelo mostarda */
  --color-error: #BA3C3C;          /* Terracota avermelhado */
}
```

### 11.4 Tipografia (Google Fonts)
* **Display & Títulos**: `Plus Jakarta Sans` ou `Outfit` (Pesos 600 e 700) — Elegância moderna, legível e acolhedora.
* **Texto Corrido & UI**: `Inter` ou `Plus Jakarta Sans` (Pesos 400 e 500) — Máxima leiturabilidade em telas de celulares.

---

# 12 — DESIGN SYSTEM

### Tokens de Espaçamento e Superfície
* **Grid Base**: 4px / 8px / 12px / 16px / 24px / 32px / 48px.
* **Border Radius**:
  * Botões e Inputs: `12px` (Soft rounded).
  * Cards e Modais: `16px` a `20px` (Superfície orgânica).
  * Chips e Badges: `9999px` (Full pill).
* **Sombras**:
  * Card Padrão: `0 2px 8px -2px rgba(45, 90, 67, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)`.
  * Card Destacado / Modal: `0 12px 24px -4px rgba(45, 90, 67, 0.12)`.
* **Biblioteca de Ícones**: `Lucide Icons` (`Sparkles`, `Leaf`, `Moon`, `Sun`, `Activity`, `CheckCircle2`, `Calendar`, `ShieldCheck`).

---

# 13 — EXPERIÊNCIA E MICROCOPY

### Tom de Voz da Terapeuta
* **Acolhedor, Seguro e Prático**: Focado em instruir com carinho sem julgamentos por eventuais deslizes.
* Exemplos de Microcopy:
  * *Botão de Ação*: "Começar meu Dia 06 com Leveza", "Concluir Check-in do Dia".
  * *Mensagem de Deslize*: "Tudo bem! O corpo é sábio. Beba um chá de erva-doce com canela e retome a rota na próxima refeição."
  * *Feedback de Bristol Tipo 4*: "Excelente! Sua digestão (Agni) está trabalhando em harmonia perfeita hoje."
  * *Instrução da Zeólita*: "Seu mineral vulcânico já está pronto para recolher os metais pesados do dia. Tome em jejum com amor ao seu corpo."

---

# 14 — MODELO DE DADOS

```
  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
  │     profiles    │1     1│    anamneses    │1     N│  lab_exam_files │
  │─────────────────│───────│─────────────────│───────│─────────────────│
  │ id (PK/UUID)    │       │ id (PK/UUID)    │       │ id (PK/UUID)    │
  │ email           │       │ user_id (FK)    │       │ user_id (FK)    │
  │ full_name       │       │ answers (JSONB) │       │ file_url        │
  │ role            │       │ bristol_base    │       │ exam_date       │
  │ start_date      │       │ status          │       │ tags (JSONB)    │
  │ is_active       │       └─────────────────┘       └─────────────────┘
  └────────┬────────┘
           │1
           │
           ├──────────────────────────────┬─────────────────────────────┐
           │N                             │N                            │1
           ▼                              ▼                             ▼
  ┌─────────────────┐            ┌─────────────────┐           ┌─────────────────┐
  │  daily_checkins │            │  lunar_cycles   │           │ user_prescripts │
  │─────────────────│            │─────────────────│           │─────────────────│
  │ id (PK/UUID)    │            │ id (PK/UUID)    │           │ id (PK/UUID)    │
  │ user_id (FK)    │            │ user_id (FK)    │           │ user_id (FK)    │
  │ day_number (1-21│            │ cycle_number(1-5│           │ aromatherapy    │
  │ energy_level    │            │ moon_date       │           │ massala_type    │
  │ sleep_quality   │            │ pills_taken     │           │ supplements_json│
  │ bloating_level  │            │ charcoal_taken  │           │ notes           │
  │ sugar_craving   │            │ completed       │           └─────────────────┘
  │ bristol_type    │            └─────────────────┘
  │ diet_compliance │
  │ notes           │
  └─────────────────┘
```

---

# 15 — REGRAS DE NEGÓCIO

* **BR-001 `[CONFIRMADO NA REUNIÃO]` — Desbloqueio Diário Sequencial**: O conteúdo do Dia $X$ (áudio, cardápio e checklist) só fica disponível às 05:00 da manhã do respectivo dia de jornada do paciente.
* **BR-002 `[CONFIRMADO NA REUNIÃO]` — Quádrupla Restrição Absoluta**: As regras de ouro do app destacam sistematicamente: Glúten Zero, Leite/Derivados Zero, Açúcar Refinado Zero e Álcool Zero durante os 21 dias.
* **BR-003 `[CONFIRMADO NA REUNIÃO]` — Dosagem de Ivermectina por Faixa de Peso**:
  * 40 a 60 kg: 2 comprimidos/dia por 3 dias.
  * 60 a 80 kg: 3 comprimidos/dia por 3 dias.
  * Acima de 80 kg: 4 comprimidos/dia por 3 dias.
* **BR-004 `[CONFIRMADO NA REUNIÃO]` — Regra do Carvão Ativado**: Obrigatório tomar 2 comprimidos de 250mg de carvão ativado à noite apenas nos 3 dias do uso da ivermectina para adsorver amônia.
* **BR-005 `[CONFIRMADO NA REUNIÃO]` — Duração do Protocolo de Zeólita**: Deve persistir ininterruptamente por 120 dias, independente do término dos 21 dias da jornada principal.
* **BR-006 `[CONFIRMADO NA REUNIÃO]` — Emissão de Relatórios Semanais de Correlação**: Nos dias 7, 14 e 21, o app sintetiza automaticamente os check-ins e calcula a correlação entre sono, estresse, evacuação e fissura de doces.

---

# 16 — ARQUITETURA TÉCNICA

```
       [ CLIENTE: PWA MOBILE / WEB ]
       • React 18 + TypeScript + Vite + Tailwind CSS
       • Lucide React (Ícones) + Canvas Confetti + Recharts (Gráficos)
       • PWA Plugin (Vite PWA / Service Worker com suporte offline a guias)
                      │
                      ▼
       [ SUPABASE BACKEND AS A SERVICE ]
       • Supabase Auth (Magic Link Passwordless + Email/Password)
       • Supabase PostgreSQL Database (Row Level Security ativado)
       • Supabase Storage (Bucket seguro para upload de Exames e Áudios)
       • Supabase Edge Functions (Cálculo de luas cheias e disparos de alerta)
                      │
                      ▼
       [ HOSPEDAGEM & DEPLOY ]
       • Vercel Edge Network (Deploy contínuo e CDN global de alta performance)
```

---

# 17 — SEGURANÇA E LGPD

1. **Dados Sensíveis de Saúde**: As respostas de anamnese, histórico ginecológico, digestivo e laudos de exames laboratoriais são categorizados como dados sensíveis (Art. 5º, II da LGPD).
2. **Row Level Security (RLS)**: Cada paciente acessa estritamente suas próprias linhas no banco (`auth.uid() = user_id`). Somente o perfil com `role = 'admin'` (Ana Carla Nesi) possui acesso global de leitura e prescrição.
3. **Storage Protegido**: Arquivos de exames médicos são alocados em bucket privado com URLs assinadas expiráveis (TTL de 60 minutos).

---

# 18 — MVP E ROADMAP

### MVP (Versão 1.0)
* Fluxo completo de autenticação e preenchimento de anamnese digital.
* Upload de exames laboratoriais para visualização da terapeuta.
* Guia dos 21 dias com áudios embutidos, cardápios diários e checklist.
* Check-in noturno interativo com a Escala de Bristol visual (Tipos 1 a 7).
* Rastreador dos 120 dias de Zeólita e calculadora de desparasitação.
* Painel administrativo para Ana Carla Nesi visualizar respostas e prescrever óleos/suplementos.

### Versão 1.1 (Melhorias Naturais)
* Sincronização automática com API de fases lunares em tempo real.
* Notificações push nativas na Web e lembretes sonoros.
* Exportação do relatório do paciente em formato PDF diagramado.

### Versão 2.0 (Escala & IA)
* Assistente de IA treinado na base ayurvédica de Ana Carla para tirar dúvidas de cardápio.
* Integração direta com marketplaces para compra com 1 clique de massalas e zeólita Turita.

---

# 19 — RISCOS E MITIGAÇÕES

| Risco | Tipo | Probabilidade | Impacto | Mitigação no Produto |
|---|---|---|---|---|
| Paciente esquecer o check-in noturno | Engajamento | Média | Alto | Check-in ultrarrápido (60s) + Push com gatilho de hábito às 20h30. |
| Insegurança culinária ("não sei o que comer") | UX / Aderência | Alta | Alto | Sugestões com fotos e substitutos simples (raízes locais, ovos, sopas). |
| Erro de posologia na desparasitação | Segurança/Clínico | Baixa | Alto | Calculadora automática que trava a dose exata pelo peso preenchido. |
| Paciente abandonar a Zeólita após os 21 dias | Retenção | Alta | Médio | Contador visual independente (ex: "Dia 22 de 120") com dicas de energia. |

---

# 20 — QUESTÕES EM ABERTO

1. **Repositório de Áudios**: Os 21 áudios diários de 1 a 3 minutos serão gravados previamente em lote por Ana Carla para upload no bucket do Supabase antes do lançamento oficial? `[VALIDAR COM CLIENTE]`
2. **Notificações**: Deseja-se suporte a disparos via WhatsApp (via Evolution API / Z-API) como redundância ao Push do PWA? `[VALIDAR COM CLIENTE]`
3. **Identidade Visual**: Ana Carla possui paleta de cores ou logotipo vetorial além da arte dos PDFs existentes? `[VALIDAR COM CLIENTE]`

---

# 21 — PRODUCT SPEC FINAL

* **Nome do Produto**: PACIFICAR — Saúde Integrativa & Ayurveda
* **Usuários**: Pacientes em desintoxicação (Mobile PWA) e Terapeuta Ana Carla Nesi (Dashboard Web).
* **Stack Principal**: React, Vite, Tailwind CSS, TypeScript, Supabase (Auth/DB/Storage).
* **Duração da Jornada Central**: 21 dias ininterruptos com suporte a protocolos satélites (120 dias de Zeólita e 5 ciclos lunares de Desparasitação).

---

# 22 — MASTER BUILD PROMPT

Abaixo está o prompt mestre autocontido, projetado para ser colado diretamente em ferramentas de vibe coding e geração de código (Claude Code, Cursor, Bolt.new, Lovable, Replit).

***

```markdown
# MASTER BUILD PROMPT — PACIFICAR PWA

Você é um Engenheiro de Software Fullstack Sênior e Especialista em Design Systems e UX Mobile.
Sua missão é construir a aplicação completa do **PACIFICAR PWA**, um micro-app progressivo mobile-first desenvolvido para a terapeuta ayurvédica e psicóloga clínica **Ana Carla Nesi** (CRP 17/2833).

---

## 1. VISÃO GERAL DO PRODUTO & STACK

O PACIFICAR é um PWA para guiar pacientes em uma jornada de 21 dias de desinflamação ayurvédica, desparasitação lunar e quelação de metais com zeólita, além de fornecer um painel clínico para a terapeuta.

### Tech Stack Obrigatória:
- **Frontend**: React 18+ (Vite), TypeScript, Tailwind CSS, Lucide React (ícones), Canvas-Confetti, Recharts.
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth, Supabase Storage).
- **PWA**: `vite-plugin-pwa` configurado com Web App Manifest e Service Worker para cache de áudios e imagens.
- **Formulários & Validação**: `react-hook-form`, `zod`.

---

## 2. BRANDING, DESIGN TOKENS & UI DIRECTION

Aplique consistência estrita através das classes do Tailwind configuradas:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ayur: {
          forest: '#2D5A43',      // Primary
          forestLight: '#EBF4EE',
          gold: '#C88D48',        // Secondary / Cúrcuma
          goldLight: '#FBF4EB',
          bg: '#F9F7F2',          // Fundo suave pergaminho
          card: '#FFFFFF',
          text: '#1C2621',
          muted: '#5A6961',
          border: '#E8E5DD',
          terracota: '#BA3C3C'    // Alertas e restrições
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      borderRadius: {
        'card': '18px',
        'btn': '12px'
      }
    }
  }
}
```

---

## 3. MODELO DE DADOS & SQL SCHEMA (SUPABASE)

Execute o script SQL abaixo no Supabase:

```sql
-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'admin')),
  weight NUMERIC,
  journey_start_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Anamnese Ayurvédica
CREATE TABLE anamneses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  main_complaints TEXT,
  symptom_duration TEXT,
  symptom_nature TEXT, -- 'estaveis', 'flutuantes', 'piorando', etc.
  factors_worsen TEXT,
  frequent_conditions JSONB, -- gripe, hiperacidez, enxaqueca, etc.
  morning_energy TEXT,
  evacuation_daily BOOLEAN,
  evacuation_frequency INT,
  bristol_baseline INT, -- 1 a 7
  digestive_power TEXT, -- 'boa', 'razoavel', 'fraca'
  diet_type TEXT,
  climate_discomfort TEXT,
  skin_tendency TEXT,
  emotional_state TEXT,
  sleep_quality TEXT,
  menstruation_data JSONB,
  target_goals TEXT,
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Exames Laboratoriais (Anexos)
CREATE TABLE lab_exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Check-ins Diários (Jornada 21 Dias)
CREATE TABLE daily_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_number INT NOT NULL CHECK (day_number BETWEEN 1 AND 21),
  energy_rating INT CHECK (energy_rating BETWEEN 1 AND 5),
  sleep_quality INT CHECK (sleep_quality BETWEEN 1 AND 5),
  bloating_level INT CHECK (bloating_level BETWEEN 1 AND 4),
  sweet_craving INT CHECK (sweet_craving BETWEEN 1 AND 3),
  bristol_type INT CHECK (bristol_type BETWEEN 1 AND 7),
  diet_compliance TEXT CHECK (diet_compliance IN ('total', 'partial', 'none')),
  water_intake TEXT,
  self_care_done BOOLEAN DEFAULT false,
  journal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, day_number)
);

-- 5. Prescrições da Terapeuta (Ana Carla)
CREATE TABLE prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  dosha_predominant TEXT,
  massala_recommended TEXT, -- Vata, Pitta, Kapha
  aromatherapy_oils TEXT,
  supplements_recommended TEXT,
  therapist_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Protocolo de Desparasitação Lunar
CREATE TABLE parasite_cycles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_number INT CHECK (cycle_number BETWEEN 1 AND 5),
  moon_date DATE NOT NULL,
  day1_completed BOOLEAN DEFAULT false,
  day2_completed BOOLEAN DEFAULT false,
  day3_completed BOOLEAN DEFAULT false,
  charcoal_taken BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, cycle_number)
);

-- Habilita RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parasite_cycles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS: Pacientes leem/editam seus próprios dados; Admins leem/editam tudo
CREATE POLICY "Users access own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admin access all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users access own anamnese" ON anamneses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin access all anamneses" ON anamneses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users access own checkins" ON daily_checkins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin access all checkins" ON daily_checkins FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users access own exams" ON lab_exams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin access all exams" ON lab_exams FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users access own prescriptions" ON prescriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin manage prescriptions" ON prescriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users access own parasite cycles" ON parasite_cycles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin access all parasite cycles" ON parasite_cycles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

## 4. ESTRUTURA DE ROTAS & TELAS OBRIGATÓRIAS

```
src/
├── components/
│   ├── layout/ (BottomNav, AppHeader, PageContainer)
│   ├── audio/ (AudioPlayerDaily)
│   ├── bristol/ (BristolSelectorGrid - com ilustrações dos Tipos 1 ao 7)
│   ├── cards/ (MealCard, SelfCareCard, DayProgressCard)
│   └── ui/ (Button, Input, Card, Modal, Slider, Toggle, Badge)
├── pages/
│   ├── auth/ (Login, MagicLinkSent)
│   ├── onboarding/ (WelcomeVideo, AnamneseMultiStep, UploadExames)
│   ├── patient/
│   │   ├── HomeDaily (Visão do Dia 1 ao 21, Player de áudio, Cardápio, Checklist)
│   │   ├── CheckinNightly (Formulário dinâmico com Bristol e sliders)
│   │   ├── WeeklyReport (Gráficos Recharts D7, D14 e D21)
│   │   ├── NutritionGuide (Permitidos vs Eliminar, Massalas Vata/Pitta/Kapha, Receitas)
│   │   ├── ZeoliteTracker (Contador regressivo de 120 dias com checklist matinal)
│   │   └── ParasiteTracker (Calendário das 5 Luas Cheias, cálculo de peso e Ivermectina)
│   └── admin/
│       ├── AdminDashboard (Lista de pacientes, status da anamnese, compliance)
│       └── PatientDetailModal (Visualização clínica e formulário de prescrição)
```

---

## 5. REGRAS DE NEGÓCIO & COMPORTAMENTOS

1. **Cálculo da Posologia de Desparasitação**:
   - `peso < 60 kg` ➔ 2 comprimidos de Ivermectina/dia por 3 dias.
   - `peso >= 60 kg E peso <= 80 kg` ➔ 3 comprimidos de Ivermectina/dia por 3 dias.
   - `peso > 80 kg` ➔ 4 comprimidos de Ivermectina/dia por 3 dias.
   - Incluir aviso de destaque: *"Tomar 2 comprimidos de 250mg de Carvão Ativado à noite durante os 3 dias para eliminar a amônia dos parasitas mortos"*.

2. **Seletor da Escala de Bristol no Check-in**:
   - Apresentar cards visuais clicáveis numerados de 1 a 7:
     - Tipo 1: Bolinhas duras separadas (Constipação severa / Vata alto).
     - Tipo 2: Em forma de salsicha, nodosa (Constipação leve).
     - Tipo 3: Salsicha com rachaduras na superfície.
     - Tipo 4: Salsicha ou cobra, lisa e macia (*Ideal Ayurvédico* - Borda Dourada).
     - Tipo 5: Pedaços moles com contornos nítidos.
     - Tipo 6: Pedaços esfarrapados, pastoso (Inflamação / Pitta alto).
     - Tipo 7: Aquoso, sem pedaços sólidos (Diarreia / Desequilíbrio agudo).

3. **Checklist Matinal e Hábitos**:
   - Raspagem da língua com raspador de cobre em jejum.
   - Ingestão de água morna.
   - Massagem com óleo morno nos pés à noite.
   - Protocolo de Zeólita (1 colher de pó diluída em jejum).

4. **Quádrupla Restrição em Toda a Interface**:
   - Fixar em banners e avisos: `Sem Glúten`, `Sem Leite/Derivados`, `Sem Açúcar Refinado`, `Sem Álcool`.
   - Substituições nordestinas prioritárias: Cuscuz, macaxeira, batata-doce, ovos, feijão verde, lentilha, manteiga ghee.

---

## 6. CRITÉRIOS DE ACEITE DO CÓDIGO
- Código 100% em TypeScript sem uso de `any`.
- Design responsivo impecável focado em `viewport mobile (390px)` com touch targets mínimos de 48px.
- Tratamento de estados de Loading (Skeletons), Error e Empty State em todas as telas.
- Banco de dados Supabase totalmente integrado via `@supabase/supabase-js`.
```