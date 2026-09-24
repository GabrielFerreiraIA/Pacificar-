// Teste local do keep-alive contra o banco real.
// Uso: node --env-file=.env.local ./node_modules/tsx/dist/cli.mjs api/_lib/keepalive.test.ts
import { GET } from '../keepalive';

const base = 'http://localhost/api/keepalive';
let falhas = 0;
const ok = (c: boolean, m: string) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };

let r = await GET(new Request(`${base}?src=manual`));
ok(r.status === 401, 'Sem Authorization → 401');

r = await GET(new Request(`${base}?src=manual`, { headers: { authorization: 'Bearer errado' } }));
ok(r.status === 401, 'Segredo errado → 401');

r = await GET(new Request(`${base}?src=manual`, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } }));
const j = await r.json();
ok(r.status === 200 && j.ok === true && j.source === 'manual' && typeof j.total === 'number', `Segredo certo → 200 ${JSON.stringify(j)}`);

r = await GET(new Request(`${base}?src=qualquer`, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } }));
ok((await r.json()).source === 'manual', 'Fonte desconhecida vira "manual"');

if (falhas) process.exit(1);
console.log('\nKeep-alive OK');
