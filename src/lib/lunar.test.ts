// Valida src/lib/lunar.ts contra a tabela oficial do U.S. Naval Observatory
// (https://aa.usno.navy.mil/api/moon/phases/year, horários em UTC).
// Uso: node ./node_modules/tsx/dist/cli.mjs src/lib/lunar.test.ts
import { buildParasiteCycles, dataSaoPaulo, fullMoonsFrom } from './lunar';

const USNO = (
  '2026-01-03T10:03Z 2026-02-01T22:09Z 2026-03-03T11:38Z 2026-04-02T02:12Z 2026-05-01T17:23Z 2026-05-31T08:45Z ' +
  '2026-06-29T23:56Z 2026-07-29T14:36Z 2026-08-28T04:18Z 2026-09-26T16:49Z 2026-10-26T04:12Z 2026-11-24T14:53Z ' +
  '2026-12-24T01:28Z 2027-01-22T12:17Z 2027-02-20T23:23Z 2027-03-22T10:44Z 2027-04-20T22:27Z 2027-05-20T10:59Z ' +
  '2027-06-19T00:44Z 2027-07-18T15:45Z 2027-08-17T07:29Z 2027-09-15T23:03Z 2027-10-15T13:47Z 2027-11-14T03:26Z ' +
  '2027-12-13T16:09Z 2030-01-19T15:54Z 2030-02-18T06:20Z 2030-03-19T17:56Z 2030-04-18T03:20Z 2030-05-17T11:19Z ' +
  '2030-06-15T18:41Z 2030-07-15T02:12Z 2030-08-13T10:44Z 2030-09-11T21:18Z 2030-10-11T10:47Z 2030-11-10T03:30Z ' +
  '2030-12-09T22:40Z'
).split(' ').map(s => new Date(s.replace('Z', ':00Z')));

let falhas = 0;
const ok = (c: boolean, m: string) => { if (!c) { console.log('✘', m); falhas++; } };

let pior = 0;
for (const ref of USNO) {
  const [calc] = fullMoonsFrom(dataSaoPaulo(new Date(ref.getTime() - 2 * 86_400_000)), 1);
  const difMin = Math.abs(calc.at.getTime() - ref.getTime()) / 60_000;
  pior = Math.max(pior, difMin);
  ok(difMin < 5, `${ref.toISOString()}: diferença de ${difMin.toFixed(1)} min`);
  ok(calc.date === dataSaoPaulo(ref), `${ref.toISOString()}: data SP ${calc.date} ≠ ${dataSaoPaulo(ref)}`);
}
console.log(`✔ ${USNO.length} luas cheias conferidas com o USNO · maior diferença: ${pior.toFixed(1)} min`);

// Obs.: a lua de 24/12/2026 01:28 UTC cai em 23/12 no horário de São Paulo.
// Regra do protocolo: dá para começar até o 3º dia da lua cheia (26/09/2026 → 26, 27 e 28)
ok(buildParasiteCycles('2026-09-28', 'u')[0].moon_date === '2026-09-26', 'no 3º dia da lua ainda vale o ciclo dela');
ok(buildParasiteCycles('2026-09-29', 'u')[0].moon_date === '2026-10-26', 'depois do 3º dia passa para a lua seguinte');
const c = buildParasiteCycles('2026-09-24', 'u');
ok(c.length === 5 && c.map(x => x.moon_date).join() === '2026-09-26,2026-10-26,2026-11-24,2026-12-23,2027-01-22',
  `5 ciclos consecutivos: ${c.map(x => x.moon_date).join()}`);
ok(c[0].moon_name === 'Ciclo 01: Lua Cheia de Setembro' && c[4].moon_name === 'Ciclo 05: Lua Cheia de Janeiro', 'nomes dos ciclos');
// Dois ciclos no mesmo mês (lua azul: 01/05 e 31/05/2026)
ok(buildParasiteCycles('2026-04-30', 'u').slice(0, 2).map(x => x.moon_date).join() === '2026-05-01,2026-05-31', 'lua azul');

if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('✔ regras do protocolo\n\nLunar OK');
