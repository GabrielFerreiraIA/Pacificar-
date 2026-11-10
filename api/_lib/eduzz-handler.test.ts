// Caminhos do handler que respondem antes do banco (T-34).
// Uso: node ./node_modules/tsx/dist/cli.mjs api/_lib/eduzz-handler.test.ts
import { createHmac } from 'node:crypto';
import { POST } from '../eduzz-webhook';

process.env.EDUZZ_WEBHOOK_SECRET = 'chave-de-teste';
let falhas = 0;
const ok = (c: boolean, m: string) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };
const req = (corpo: string, sig?: string) =>
  new Request('http://localhost/api/eduzz-webhook', { method: 'POST', body: corpo, headers: sig ? { 'x-signature': sig } : {} });
const assinar = (c: string) => createHmac('sha256', 'chave-de-teste').update(c).digest('hex');

const ping = JSON.stringify({ id: 'p1', event: 'ping', data: { message: 'ping' }, sentDate: '2026-11-09T12:00:00Z' });
let r = await POST(req(ping, assinar(ping)));
let j = await r.json();
ok(r.status === 200 && j.assinatura === 'hex', `Ping assinado → 200 ${JSON.stringify(j)}`);
r = await POST(req(ping));
j = await r.json();
ok(r.status === 200 && j.assinatura === 'invalida', 'Ping sem assinatura → 200 (para ativar), mas avisa "invalida"');

const pago = JSON.stringify({ id: 'e1', event: 'myeduzz.invoice_paid', data: { id: 1, buyer: { email: 'a@b.com' } } });
r = await POST(req(pago, 'errada'));
ok(r.status === 401, 'Fatura paga com assinatura errada → 401');
r = await POST(req('{quebrado', assinar('{quebrado')));
ok(r.status === 400, 'JSON quebrado → 400');

if (falhas) process.exit(1);
console.log('\nHandler Eduzz: caminhos sem banco OK');
