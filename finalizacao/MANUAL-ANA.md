# Manual da Ana · Painel do Pacificar

Este guia mostra como acompanhar suas pacientes pelo app: ver a anamnese, os check-ins e os exames, registrar a prescrição e cuidar do acesso de cada pessoa.

---

## 1. Entrar no app

1. Na primeira vez, você recebe um e-mail **"Sua jornada no Pacificar começa aqui"**. Toque em **Criar minha senha** e escolha uma senha de pelo menos 8 caracteres.
2. Depois é só abrir o app e entrar com seu e-mail e essa senha.
3. Como sua conta é de terapeuta, o app abre direto no **Painel clínico**.

> Esqueceu a senha? Na tela de entrada, toque em **Esqueci minha senha**. O link chega por e-mail e vale por 24 horas.

Dica: no celular, use **Instalar** (no topo do app) para ele virar um ícone na tela inicial, como um aplicativo.

---

## 2. O painel em um olhar

No topo aparecem três números:

| Número | O que significa |
|---|---|
| **Ativos** | Pacientes com acesso liberado |
| **Em risco** | Pacientes com 2 ou mais dias liberados sem check-in. Vale uma mensagem de incentivo. |
| **A revisar** | Exames enviados que você ainda não marcou como revisados |

Abaixo fica a lista **Jornadas em curso**. Em cada paciente você vê:

- o dia da jornada (ex.: *Dia 5 de 21*) e o peso;
- **Anamnese ok** ou **Anamnese pendente**;
- quantos exames enviou e quantos faltam revisar;
- um triângulo laranja ⚠ quando a pessoa está em risco;
- **Acesso suspenso** ou **Pediu exclusão**, quando for o caso.

Use a busca para achar alguém pelo nome ou e-mail. O botão **Atualizar** traz as novidades sem precisar fechar o app.

---

## 3. O prontuário de cada paciente

Toque no nome da paciente. O prontuário abre logo abaixo, com quatro abas.

### Anamnese
Mostra, por bloco, tudo o que a paciente respondeu. O selo diz se ela já **concluiu** ou ainda está **em preenchimento**. Ela pode ir respondendo aos poucos, e você vê as respostas conforme chegam.

### Check-ins
Um cartão por dia, do mais recente para o mais antigo: energia, sono, inchaço, vontade de doce, tipo de Bristol, adesão à dieta, rituais feitos (zeólita, raspador de língua, água morna, autocuidado) e o diário escrito por ela.

### Exames
1. Toque em **Abrir laudo**. O arquivo abre numa nova aba, por um link seguro que vale por 1 hora.
2. Depois de ler, toque em **Marcar como revisado**. A paciente vê o selo *Revisado* no app dela.

### Prescrição
Aqui você registra:

- **Peso da paciente (kg).** É importante: o app usa o peso para mostrar a dose da ivermectina na tela de Protocolos. Sem peso, a paciente vê *"Dose definida pela Ana conforme o seu peso"*.
- **Dosha predominante** e **massala indicada.**
- **Óleo carreador.**
- **Recado para a paciente**, que aparece no perfil dela, com sua assinatura e CRP.

Toque em **Salvar prescrição**. Aparece a confirmação *"Prescrição salva e visível para o paciente"*.

---

## 4. Suspender ou reativar o acesso

Use quando houver reembolso, cancelamento combinado ou outro motivo para pausar.

1. Abra o prontuário → aba **Prescrição**.
2. No cartão **Acesso ao app**, toque em **Suspender acesso** e confirme.

A paciente passa a ver uma tela acolhedora de **acesso pausado**, com um botão para falar com você no WhatsApp. **Nada é apagado**: para devolver o acesso, toque em **Reativar acesso**.

> Quando a integração com a Kiwify estiver ativa, reembolsos e chargebacks suspendem o acesso sozinhos, e uma nova compra reativa.

---

## 5. Pedido de exclusão de conta

A paciente pode pedir, pelo perfil dela, que a conta seja apagada (é um direito garantido pela LGPD). O app **não apaga nada sozinho**: o pedido chega para você.

**Como você fica sabendo:** a paciente aparece com o selo **Pediu exclusão**, e o prontuário mostra a data e o motivo, se ela escreveu.

**O que fazer:**

1. Fale com a paciente e confirme o pedido.
2. **Antes de apagar, veja se precisa guardar o prontuário.** As normas do Conselho Federal de Psicologia pedem a guarda do registro documental do atendimento por um prazo mínimo (Resolução CFP nº 1/2009 fala em 5 anos). Na dúvida, confirme com sua assessoria. Se precisar guardar, faça antes o backup (seção 8) e guarde o arquivo.
3. Para concluir, peça ao Gabriel. Ele apaga a conta no painel do Supabase: em *Authentication → Users*, localiza o e-mail e apaga. Isso remove junto a anamnese, os check-ins, a prescrição e o pedido. Os arquivos de exame ficam em *Storage → exames*, numa pasta com o código da paciente, e também devem ser apagados.

---

## 6. O que a paciente vê

Para você orientar melhor:

- **Primeiro acesso:** um termo de consentimento sobre os dados de saúde. Sem aceitar, o app não abre.
- **Hoje:** o dia da jornada, o áudio, as refeições e o check-in noturno de 60 segundos.
- **Preparo, Nutrição e Protocolos:** a lista do que providenciar, os guias alimentares e os protocolos de zeólita e desparasitação, com as datas de lua cheia calculadas automaticamente.
- **Anamnese:** o questionário completo, salvo a cada resposta.
- **Perfil:** a sua prescrição e o seu recado, os exames enviados, e os botões **Baixar meus dados** e **Pedir exclusão da conta**.
- **Sem internet:** o check-in e as marcações ficam guardados no celular e são enviados sozinhos quando a conexão volta.

---

## 7. Dúvidas frequentes

**A paciente disse que não recebeu o e-mail de acesso.**
Peça para olhar a caixa de spam e a aba *Promoções*. Se não achar, ela pode abrir o app e tocar em **Esqueci minha senha** com o e-mail da compra: chega um link novo.

**O link do e-mail "expirou".**
Cada link vale por 24 horas e funciona uma vez só. O caminho é o mesmo: **Esqueci minha senha**.

**A paciente quer trocar o e-mail.**
Peça ao Gabriel. A troca é feita no painel do Supabase.

**A dose da ivermectina aparece como "definida pela Ana".**
Falta o peso. Registre-o na aba **Prescrição**.

**Uma paciente aparece "em risco", mas está bem.**
O alerta só compara o dia da jornada com a quantidade de check-ins. Se ela preferiu não registrar alguns dias, está tudo certo. É só um lembrete para você.

---

## 8. Segurança e cópia de segurança

- Cada paciente vê **somente os próprios dados**. Só a sua conta de terapeuta vê todas.
- Os exames ficam em armazenamento privado e abrem apenas por links temporários.
- **Backup mensal:** o Gabriel gera todo mês uma cópia criptografada de tudo (dados e exames) e guarda fora do computador. Sem a senha do backup ela não abre, então mantenha essa senha num lugar seguro.
- Nunca compartilhe sua senha. Se desconfiar que alguém a conhece, use **Esqueci minha senha** para trocar.

---

*Dúvidas técnicas: fale com o Gabriel.*
