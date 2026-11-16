# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review

The original export is retained, with warning links added to the old incident and triage
pages. Decision 0001 and the supplied classification/data files are unchanged.

- Signed review: `src/routes/kb/incidents/4471-review/+page.svx`
- Self-contained rendered reading copy: `evidence/4471-review.html`
- Complete interactive static site: `build/` (serve this directory as the site root)
- Computed counts, report IDs and timeline: `evidence/analysis.json`
- GitHub issue drafts: `issue-drafts/01-parser.md`, `issue-drafts/02-hint.md`
- Proposed successor decision: `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx`

Use Node 22.18+ (TypeScript type stripping) and npm:

```sh
npm ci
npm run build
npm run check
```

The build runs the export's actual classifier, compiles the `.svx` pages and Svelte
components, prerenders the site, verifies the derived desk reference against the source
signature, and produces the self-contained reading copy. Its dedupe controls are a static
snapshot; the complete site retains the interactive controls.

The report counts describe the supplied snapshot, not the live desk. No product fix has
been implemented or deployed. Acceptance criteria in the issue drafts are work to be done
against the product, which is not included in the export.
