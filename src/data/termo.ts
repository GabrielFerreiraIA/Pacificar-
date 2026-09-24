/* ═══════════════════════════════════════════════════════════════
   Termo de consentimento (T-60).
   RASCUNHO redigido pelo agente: a validação jurídica é da T-61
   (Ana Carla ou advogado). Mudou o texto? Troque TERMO_VERSAO: todas as
   pacientes aceitam de novo no próximo acesso, e o aceite anterior
   continua registrado em public.consents.
   ═══════════════════════════════════════════════════════════════ */

export const TERMO_VERSAO = '2026-09-v1';

/** Pontos principais, mostrados antes do texto completo. */
export const TERMO_RESUMO = [
  'Suas respostas, check-ins e exames são dados de saúde. Usamos só para a Ana Carla acompanhar a sua jornada.',
  'Somente você e a Ana Carla Nesi têm acesso. Nada é vendido ou compartilhado com terceiros para outros fins.',
  'O Pacificar é um acompanhamento de saúde integrativa e não substitui consulta, diagnóstico ou tratamento médico.',
  'Você pode baixar uma cópia dos seus dados ou pedir a exclusão da conta a qualquer momento, pelo seu perfil.'
];

export const TERMO_TEXTO: { titulo: string; paragrafos: string[] }[] = [
  {
    titulo: '1. Quem cuida dos seus dados',
    paragrafos: [
      'A responsável pelo tratamento dos seus dados é Ana Carla Nesi, terapeuta (CRP 17/2833), que oferece a jornada Pacificar. Dúvidas sobre seus dados podem ser enviadas diretamente a ela pelos canais de contato informados na compra.'
    ]
  },
  {
    titulo: '2. Quais dados coletamos',
    paragrafos: [
      'Dados de cadastro: nome, e-mail e telefone informados na compra.',
      'Dados de saúde, considerados sensíveis pela Lei Geral de Proteção de Dados (Lei 13.709/2018): respostas da anamnese, registros diários de check-in (sono, energia, digestão, alimentação e bem-estar), peso, exames laboratoriais que você decidir enviar e as orientações registradas pela terapeuta.'
    ]
  },
  {
    titulo: '3. Para que usamos',
    paragrafos: [
      'Exclusivamente para a Ana Carla acompanhar a sua jornada, preparar suas orientações e ajustar os protocolos ao longo dos 21 dias e dos ciclos seguintes.',
      'Os dados de saúde são tratados com base no seu consentimento específico e destacado, que você dá ao aceitar este termo (art. 11, I, da LGPD).'
    ]
  },
  {
    titulo: '4. Com quem compartilhamos',
    paragrafos: [
      'Seus dados não são vendidos nem cedidos a terceiros. Eles ficam guardados em provedores de tecnologia contratados apenas para o funcionamento do app (hospedagem e banco de dados), que não podem usá-los para outras finalidades.',
      'Os dados de pagamento são tratados pela plataforma de vendas (Kiwify) e não ficam guardados no app.'
    ]
  },
  {
    titulo: '5. Como protegemos',
    paragrafos: [
      'O acesso é feito com e-mail e senha pessoal. Cada pessoa enxerga somente os próprios dados, e apenas a terapeuta responsável vê os registros das pacientes. Os exames ficam em armazenamento privado, abertos apenas por links temporários.',
      'Ao sair da conta, as informações guardadas no aparelho são apagadas.'
    ]
  },
  {
    titulo: '6. Por quanto tempo guardamos',
    paragrafos: [
      'Enquanto durar o acompanhamento e pelo tempo necessário para cumprir obrigações legais e profissionais de guarda de registros. Se o acesso for suspenso (por reembolso ou cancelamento), os registros são preservados para permitir a reativação, a menos que você peça a exclusão.'
    ]
  },
  {
    titulo: '7. Seus direitos',
    paragrafos: [
      'Você pode, a qualquer momento: confirmar quais dados temos, acessá-los e baixar uma cópia, corrigir o que estiver errado, pedir a exclusão e revogar este consentimento. A cópia e o pedido de exclusão ficam disponíveis no seu perfil, dentro do app.',
      'A revogação do consentimento impede a continuidade do acompanhamento pelo app, mas não afeta o que já foi feito antes dela.'
    ]
  },
  {
    titulo: '8. Aviso importante sobre saúde',
    paragrafos: [
      'O Pacificar é um programa de saúde integrativa e Ayurveda. As orientações não substituem consulta, diagnóstico ou tratamento médico. Não interrompa medicamentos nem tratamentos sem falar com o seu médico. Em caso de sintomas graves ou emergência, procure atendimento médico imediatamente.'
    ]
  }
];
