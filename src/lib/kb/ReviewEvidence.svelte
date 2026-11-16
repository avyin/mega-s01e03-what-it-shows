<script lang="ts">
  import raw from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const unique = uniqueById(raw as Report[]);
  const reports = unique.filter(r => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const discrepancies = groups.reduce((n,g)=> n + g.reports.filter(r => r.meta.intakeTag !== g.cause).length,0);
  const exceptions = groups.flatMap(g => g.reports.filter(r=>notes.oneDayMove.includes(r.id)).map(r=>({ ...r, cause:g.cause })));
  const months = [...new Set(reports.map(r=>r.receivedAt.slice(0,7)))].sort().map(month=>({
    month, received:reports.filter(r=>r.receivedAt.startsWith(month)).length,
    merged:reports.filter(r=>r.mergedAt?.startsWith(month)).length
  }));
</script>

<h2>Counting method and intake errors</h2>
<p>The export contains <strong>{raw.length}</strong> rows but <strong>{unique.length}</strong> unique report IDs: <strong>{raw.length - unique.length}</strong> overlapping export rows are removed. Of those unique reports, <strong>{reports.length}</strong> belong to #4471. Each report is classified once using its tenant's configured locale, form version, and channel.</p>
<p><strong>{discrepancies}</strong> intake tags disagree with the computed cause. Browser locale and intake tags are observations, not the classification rule. Counts below describe the supplied export, not the current live queue.</p>

<h2>Report arrival versus desk processing</h2>
<table><thead><tr><th>Month</th><th>Received</th><th>Merged</th></tr></thead><tbody>{#each months as m}<tr><th>{m.month}</th><td>{m.received}</td><td>{m.merged}</td></tr>{/each}</tbody></table>
<p>Reports arrived before the desk's large merge batch. A spike in merges is a processing event, not evidence that the bug began that week. Use <code>receivedAt</code> for onset and <code>mergedAt</code> for desk activity.</p>

<h2>Unusual reports retained for investigation</h2>
<p>{exceptions.length} reports are listed in <code>desk-notes.json</code> as one-day moves. They remain counted under their tenant-derived causes; they are not a separately established timezone bug.</p>
<table><thead><tr><th>Report</th><th>Filed cause</th><th>Reporter's words</th></tr></thead><tbody>{#each exceptions as r}<tr><td>{r.id}</td><td>{r.cause}</td><td>{r.body}</td></tr>{/each}</tbody></table>
<p>Preserve these descriptions and request original input, saved date, timezone and invite output to reproduce them. The classifier establishes how this export is filed; it does not independently prove the mechanism behind every description.</p>

<h2>Representative records</h2>
{#each groups as g}
  <h3>{g.cause}</h3>
  <p>{g.reports.length} reports; {readAs(g, notes.oneDayMove)} desk-note exceptions included.</p>
  <ul>{#each g.reports.filter(r=>!notes.oneDayMove.includes(r.id)).slice(0,3) as r}<li><code>{r.id}</code> — {r.tenant}, {r.channel}: {r.body}</li>{/each}</ul>
{/each}

<style>table { overflow-wrap: anywhere; } td { vertical-align: top; }</style>
