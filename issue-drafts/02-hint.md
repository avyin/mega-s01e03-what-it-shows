# booking-v3 date hint contradicts day-first tenant interpretation — 33 reports

## Problem and impact

**33 unique reports** in #4471 belong to the form-hint cause, received from 2026-04-17 through 2026-09-22. They affect the form channel for three day-first booking-v3 tenants: Alder Physio (`de-DE`), Copper Studio (`es-ES`) and Pale Harbour (`pt-PT`).

The form prints `MM/DD/YYYY`, so a person following it types month first. The form reads the value in the tenant's day-first format. This is a separate UI-contract bug from the shared parser; a parser-only fix leaves the misleading instruction in place.

## Evidence and reproduction target

- R-41230, Copper Studio, form: 6 January became 1 June, despite an intake tag of parser.
- R-41241, Alder Physio, form: 6 August became 8 June. Its browser locale is `en-US`, but tenant locale is `de-DE`.
- R-41251, Pale Harbour, form: 7 January became 1 July, despite an intake tag of parser.

Open booking-v3 for a day-first tenant, follow the displayed month-first hint with an ambiguous date, submit, and inspect the saved booking and invite output. This is a reproduction target; the product runtime is absent from the export.

## Required outcome

Make the displayed date hint agree with the format actually accepted for the tenant. Do not derive it from browser locale alone.

## Acceptance evidence

- Following the displayed hint preserves the intended date for all three affected tenants.
- Verify ambiguous dates in both directions and a day greater than 12.
- Keep booking-v2 and month-first tenant behavior correct.
- A booking-v3 tenant's app/email reports remain with the parser issue, not this form-only issue.
- Capture the hint, entered value, saved booking and invite/reminder output as evidence.

Intake tagged 18 of these reports as hint and 15 as parser. None of the five desk-note exceptions belongs to this cause.

## Evidence and counting

Counts use unique report IDs merged into #4471 in the 2026-10-04 export. The 427 raw rows contain 15 overlapping duplicates, leaving 412 reports. Classification runs `src/lib/kb/causes.ts` against tenant locale, form version and channel, using `Intl.DateTimeFormat.formatToParts` for date order. Browser locale and intake tags do not determine cause.

Full membership and computed evidence: `evidence/analysis.json`. Signed review source: `src/routes/kb/incidents/4471-review/+page.svx`. Rendered page: `build/kb/incidents/4471-review/index.html`.

These are snapshot counts. No live queue changes or deployed fixes are claimed.
