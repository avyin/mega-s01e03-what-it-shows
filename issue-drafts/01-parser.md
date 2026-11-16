# Shared parser swaps day and month for day-first tenants — 379 reports

## Problem and impact

**379 unique reports** in #4471 belong to the shared parser cause across 11 tenants, received from 2026-04-01 through 2026-10-04. The parser reads dates month first even when the tenant writes day first. Invites and reminders therefore show the wrong calendar date.

This group covers app/email reports for day-first tenants and form reports outside the booking-v3 month-first-hint path. Booking-v3 tenants' app/email reports still belong here.

## Evidence and reproduction target

- R-41200, Harbour Dental (`en-GB`, `booking-v2`, app): 7 April became 4 July.
- R-41201, same tenant/path: 4 July became 7 April.
- R-41203, Lantern Row (`cs-CZ`, `booking-v2`, app): 2 December became 12 February.

Reproduce with ambiguous day-first input through the shared parser, then inspect the saved booking and invite/reminder date. This is a reproduction target derived from reports and the supplied cause logic; the product runtime is not included in this export.

## Required outcome

Honor the tenant's date interpretation rather than assuming month-first input. Retain correct behavior for month-first tenants. This fix does not resolve the separate booking-v3 hint defect.

## Acceptance evidence

- Day-first ambiguous dates preserve the intended date in both swap directions.
- Dates with days greater than 12 and invalid dates are handled explicitly.
- Month-first locale behavior remains correct.
- Exercise app, email and relevant booking-v2 form paths, plus app/email for booking-v3 tenants.
- Trace input, stored date and invite/reminder output; include before/after evidence.

## Exceptions that must remain visible

R-41202, R-41209, R-41236, R-41344 and R-41620 are the five `desk-notes.json` entries read as one-day moves. They are **included in the 379**, not a third cause and not extra reports. Their wording is unresolved evidence: collect original input, saved date, timezone and rendered output before claiming a timezone diagnosis.

Intake tagged 356 of these reports as parser and 23 as hint. The tenant-derived classification corrects that split.

## Evidence and counting

Counts use unique report IDs merged into #4471 in the 2026-10-04 export. The 427 raw rows contain 15 overlapping duplicates, leaving 412 reports. Classification runs `src/lib/kb/causes.ts` against tenant locale, form version and channel, using `Intl.DateTimeFormat.formatToParts` for date order. Browser locale and intake tags do not determine cause.

Full membership and computed evidence: `evidence/analysis.json`. Signed review source: `src/routes/kb/incidents/4471-review/+page.svx`. Rendered page: `build/kb/incidents/4471-review/index.html`.

These are snapshot counts. No live queue changes or deployed fixes are claimed.
