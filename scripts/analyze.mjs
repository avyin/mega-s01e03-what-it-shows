import fs from 'node:fs';
import assert from 'node:assert/strict';
import { groupByCause, uniqueById, readAs, sameCause } from '../src/lib/kb/causes.ts';
import { DEDUPE_CASES } from '../src/lib/kb/dedupe-cases.ts';

const data = new URL('../src/lib/data/', import.meta.url);
const read = (path) => JSON.parse(fs.readFileSync(new URL(path, data), 'utf8'));
const raw = read('reports-4471.json');
const notes = read('desk-notes.json');
const tenants = fs.readdirSync(new URL('tenants/', data)).map(name => read('tenants/' + name));
const tenantOf = r => tenants.find(t => t.handle === r.tenant);
const reports = uniqueById(raw).filter(r => r.mergedInto === 4471);
const groups = groupByCause(reports, tenantOf);
const start = Date.parse('2026-03-30');
const week = 7 * 86400000;
const weeks = Array.from({ length: 27 }, (_, i) => ({ week: new Date(start + i * week).toISOString().slice(0,10), received: 0, merged: 0 }));
for (const r of reports) for (const [field, key] of [['receivedAt','received'],['mergedAt','merged']]) {
  if (r[field]) { const bin = weeks[Math.floor((Date.parse(r[field].slice(0,10)) - start) / week)]; if (bin) bin[key]++; }
}
const result = {
  snapshot: '2026-10-04', rawRows: raw.length, duplicateRows: raw.length - uniqueById(raw).length,
  total: reports.length,
  groups: groups.map(g => ({ ...g, count: g.reports.length, oneDayMove: readAs(g, notes.oneDayMove), reportIds: g.reports.map(r => r.id), reports: undefined })),
  deskNotes: reports.filter(r => notes.oneDayMove.includes(r.id)),
  dedupeCases: DEDUPE_CASES.map(c => ({ ...c, sameCause: sameCause(c.a,tenantOf(c.a),c.b,tenantOf(c.b)) })), weeks
};
assert.equal(groups.reduce((sum,g) => sum + g.reports.length,0), reports.length);
assert.equal(new Set(result.groups.flatMap(g=>g.reportIds)).size, reports.length);
assert.equal(weeks.reduce((n,w)=>n+w.received,0),reports.length);
assert.equal(weeks.reduce((n,w)=>n+w.merged,0),reports.length);
fs.mkdirSync(new URL('../evidence/',import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../evidence/analysis.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({rawRows: result.rawRows,duplicateRows: result.duplicateRows,total:result.total,groups:result.groups.map(({cause,count,oneDayMove,taggedAs})=>({cause,count,oneDayMove,taggedAs})), busiestMergeWeek:weeks.reduce((a,b)=>a.merged>b.merged?a:b)},null,2));
