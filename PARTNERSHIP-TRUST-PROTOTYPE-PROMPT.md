# Claude Code — Partnership & Trust entity prototype

Drop this file in the repo root and reference it with `@PARTNERSHIP-TRUST-PROTOTYPE-PROMPT.md`.
Work through the packages in order. Stop at the end of each and show me what changed.

---

## 0 · Ground rules

**Read these before writing any code.**

1. **Use the ingested design system.** Every component, token, colour, spacing value and type
   style comes from the repo. Do not introduce new primitives, do not hand-write hex colours, do
   not invent spacing. If a pattern you need does not exist, stop and tell me rather than
   inventing one.
2. **This is a prototype, not production.** Local data, seeded fixtures, no backend changes
   unless a package says otherwise. It must be clickable end to end.
3. **Corporation must not regress.** Every existing corporation client, engagement, template and
   statement keeps working exactly as today. Entity type defaults to Corporation everywhere.
   Treat any change in corporation behaviour as a bug.
4. **Scope: private entities only.** Canada under ASPE, United States under US GAAP. Compilation,
   Review and Tax engagements. No IFRS, no audit, no public entities, no cash or tax basis.
5. **Ask before guessing.** Where the spec is silent on a label, a validation threshold or a
   layout, ask. Do not fill the gap with a plausible invention.
6. **One package per commit**, with a short message naming the package number.

---

## 1 · The core idea, in one sentence

A corporation's equity is a fixed structure. **A partnership's equity is one capital account per
person, and net income must be allocated to those people before any statement can render.**
Everything in this document follows from that.

Two consequences shape the whole build:

- **Mapping gains a second dimension.** An account answers "which statement line?" *and* "which
  participant?"
- **Preparation gains a stage.** Trial balance → adjusting entries → net income → **allocation** →
  statements.

---

## 2 · Data model

Create one new first-class object and extend three existing ones.

### 2.1 New — `Participant`

A partner in a partnership, a beneficiary in a trust.

```
Participant {
  id
  engagementId
  name                  // becomes a column header and a mapping target
  participantType       // individual | corporate | partnership | trust
  participantClass      // partnership: general | limited
                        // trust: income | capital | discretionary
  ownershipMode         // percentage | units      (chosen per engagement)
  ownershipValue        // 40.00  or  400
  openingCapital        // first engagement only; carried forward thereafter
  admissionDate         // nullable — drives pro-rata
  retirementDate        // nullable — drives pro-rata and settlement
  taxIdentifier         // NEVER rendered on a financial statement. Slips only.
  displayOrder
}
```

### 2.2 Extend — `Client`

```
entityType            // corporation | partnership | trust
                      // default: corporation for every existing record
```

### 2.3 Extend — account mapping

```
participantId         // nullable; required for participant-scoped statement lines
```

### 2.4 New — `Allocation`

```
Allocation {
  engagementId
  method              // fixedPercentage | units | manual
  roundingRule        // largestAbsorbs | namedPartner | spreadByOrder
  roundingPartnerId   // when namedPartner
  isStale             // true when net income or participants changed since the last run
  lastRunAt
  rows: [{ participantId, opening, contributions, incomeShare,
           drawings, closing, isOverridden }]
}
```

### 2.5 Extend — engagement settings

```
capitalPresentation   // itemised | totalOnly      — balance sheet face
capitalVisibility     // open | restricted | partnerOnly
```

---

## 3 · Work packages

### P1 · Entity type on the client

**Add Client screen** gains an **Entity type** dropdown: Corporation, Partnership, Trust.

- Corporation is the default and pre-selected.
- Entity type is **mandatory**.
- Every existing client is set to Corporation by migration.
- Entity type may be changed **only while the client has no engagement**. Once an engagement
  exists, the field is read-only with the reason shown inline.
- **Client list** gains an Entity type column and a filter.
- The entity type appears in the **Client Info** strip on Create Engagement (it currently reads
  "Entity type · Corporation" — make that value real rather than hardcoded).

---

### P2 · Templates page and the template library

The Templates page keeps its current layout — left tree, right section table with
Section / Category / Mapped template columns. **Do not redesign it.**

**Current tree:**

```
Compilation
  └ Compilation CSRS 4200
Review
  └ Review Section 2400
Tax
  └ T2 (Corporations)
```

**New tree — entity type as the top level:**

```
Corporation
  ├ Canada · ASPE
  │   ├ Compilation CSRS 4200          (existing — move, do not rebuild)
  │   ├ Review Section 2400            (existing)
  │   └ Tax · T2 (Corporations)        (existing)
  └ United States · US GAAP
      ├ Compilation AR-C 80            (existing)
      ├ Review AR-C 90                 (existing)
      └ Tax · 1120 / 1120-S            (existing)
Partnership
  ├ Canada · ASPE
  │   ├ Compilation CSRS 4200
  │   ├ Review Section 2400
  │   └ Tax · T5013
  └ United States · US GAAP
      ├ Compilation AR-C 80
      ├ Review AR-C 90
      └ Tax · 1065
Trust
  ├ Canada · ASPE
  │   ├ Compilation CSRS 4200
  │   ├ Review Section 2400
  │   └ Tax · T3
  └ United States · US GAAP
      ├ Compilation AR-C 80
      ├ Review AR-C 90
      └ Tax · 1041
```

That is **18 templates: 6 existing, 12 new.**

**Build the shared layer.** Do not create 18 independent template records. A statement set is keyed
by **entity type + country + framework** (6 sets). Engagement type is a **report overlay** (3).
A caption change must propagate to all three engagement types for that entity and country.

Also: templates search and filter must work across the new tree; My Templates / Global Templates
tabs behave as today.

---

### P3 · Engagement templates — checklists and letters

Per S-10, engagement templates stay independent of entity type, but **content is reviewed and
changed only where a partnership or trust needs something different.**

| Template | Change |
| --- | --- |
| **Client acceptance & continuance** | Add partnership and trust to the entity questions |
| **Independence** | **Partners and trustees are related parties** — add the threat questions |
| **Knowledge of client business** | Q1 "Type of Entity" — **prefill from the client's entity type**. Add partnership agreement / trust deed questions under Corporate structure. Q3 "Corporate structure (ownership…)" → relabel for partnership and trust |
| **Planning** | Add an allocation-basis question |
| **Engagement Letter** | Signature block: "ON BEHALF OF **THE PARTNERS**" / "**THE TRUSTEE**" rather than the corporate wording. Management responsibility paragraphs reference partners or trustee |
| **Management responsibility** | Same wording change |
| **Final Completion** | Add the items in P11 |

Keep the existing checklist component, the Additional Explanation field and the Ref chips exactly
as they are.

---

### P4 · Financial statement templates

The FS section of each template currently maps:

```
Financial Statement Docs · Cover Page · Table of Contents · Compilation Report ·
Balance Sheet · Statement of Income (Loss) and Retained Earnings (Deficit) ·
Notes to Financial Information
```

**For partnership and trust, the statement list changes:**

| Page | Corporation | Partnership | Trust |
| --- | --- | --- | --- |
| Cover Page | ✓ | ✓ | ✓ |
| Table of Contents | ✓ | ✓ | ✓ |
| Compilation / Review Report | ✓ | ✓ wording | ✓ wording |
| Balance Sheet | ✓ | ✓ **equity section changes** | ✓ **equity section changes** |
| Income statement | Statement of Income and Retained Earnings | **Statement of Income** — no retained earnings | **Statement of Income** |
| **Statement of Retained Earnings** | ✓ | **REMOVED** | **REMOVED as a page** |
| **Statement of Partners' Capital** | — | **NEW · required** | **NEW · renamed** |
| Notes | ✓ | ✓ content changes | ✓ content changes |

**Trust naming — use `beneficiaries`, not "unit holders".** A family or testamentary trust has
beneficiaries and its equity is **Trust Capital / Net Assets**. The statement is
**Statement of Changes in Trust Net Assets**.

**Trust keeps an accumulated balance.** A trust accumulates undistributed income. The *page* goes;
the *balance* stays as an **Accumulated income** row inside the equity statement. Do not simply
hide retained earnings for trusts.

**Note library changes:**

| Note | Partnership | Trust |
| --- | --- | --- |
| Share capital | Remove | Remove |
| **Partnership agreement — allocation basis** | **Add, required** | — |
| **Trust deed — terms and beneficiary classes** | — | **Add, required** |
| Income taxes | **Flow-through statement** — required | Conditional |
| Dividends | Remove | Remove |
| Related party | Partners are related parties | Trustee and beneficiaries |

---

### P5 · Create Engagement

The existing screen has Client Info, Engagement Details, Engagement Period and Assigned team.

**Changes:**

1. **Client Info strip** shows the real entity type.
2. **Engagement Template** picker filters to the client's entity type. A partnership client cannot
   select a corporation template.
3. **Accounting Standards** list filters by country and entity: Canada → ASPE; US → US GAAP.
   Remove IFRS and the basis options from the partnership and trust lists.
4. **New section — Participants**, shown only for partnership and trust, between Engagement Period
   and Assigned team. Per participant: Name, Type, Class, Ownership (% or units — the mode is
   chosen once per engagement), Opening capital (first engagement only), Admission date,
   Retirement date.
5. **Bulk entry:** Carry from prior engagement (default when one exists), paste from spreadsheet
   (name, type, class, ownership), manual entry.
6. **Validation at create:**

| Rule | Severity |
| --- | --- |
| At least one participant | **Blocking** |
| Ownership percentages total exactly 100% | **Blocking** — 99.99% is an error |
| Units entered where mode is units | **Blocking** |
| Admission date within the fiscal year | **Blocking** |
| Retirement date after admission date | **Blocking** |
| Opening capital sums to prior-year closing | Warning |
| Duplicate participant names | Warning |
| Negative opening capital on a limited partner | Warning |

7. **Capital presentation** and **capital visibility** are asked here, not discovered at export.

---

### P6 · Engagement LHS menu and centre preview

The left tree currently runs:

```
CO Client Onboarding → DO Documents → TB Trial Balance & Adj. Entries →
PR Procedures → FS Financial Statements → SO Completion & Signoffs
```

**Changes for partnership and trust:**

| Node | Change |
| --- | --- |
| `CO` children | Unchanged in structure; content per P3 |
| `DO Documents` | **Shareholders Agreements → Partnership Agreement / Trust Deed** |
| `TB Trial Balance & Adj. Entries` | Participant column — see P7 |
| **`PC Partners' Capital`** | **NEW node, between TB and PR** — the worksheet, P8 |
| `PR Procedures` | Equity leadsheets change — see P10 |
| `FS Financial Statements` | Statement list per P4 |
| `SO Completion & Signoffs` | New rows per P11 |

Every node must render its centre preview. The LHS node codes follow the existing two-letter
convention (`CO`, `DO`, `TB`, `PR`, `FS`, `SO`) — use **`PC`** for Partners' Capital.

---

### P7 · Trial balance, mapping and adjusting entries

The TB grid currently has: Acc No., Description, Original, Adj, Final, PY1, Change (%), PY2,
Map No., LS, Grouping, Sub Grouping, Tax Code, FX Rate.

**Add a `Participant` column**, populated only for participant-scoped groupings.

**Grouping and Sub Grouping changes:**

| Grouping | Sub grouping | Corporation | Partnership | Trust |
| --- | --- | --- | --- | --- |
| Equity | Share capital | ✓ | **Remove** | **Remove** |
| Equity | Retained earnings | ✓ | **Remove** | **Accumulated income** |
| Equity | **Partners' capital** | — | **New · participant-scoped** | **New · participant-scoped** |
| Equity | **Drawings / Distributions** | — | **New · participant-scoped** | **New · participant-scoped** |
| Equity | **Contributions** | — | **New · participant-scoped** | **New · participant-scoped** |
| Liabilities | Income taxes payable | ✓ | **Remove** | Conditional |

**Two ways a client file arrives — both must work:**

| Case | Behaviour |
| --- | --- |
| **Per-partner accounts already in the TB** (`3100 Capital — J Smith`, `3110 Capital — M Patel`) | The worksheet **reconciles**: computed share compared to posted balance, differences blocked |
| **A single capital account** | The worksheet **produces** the split from ownership |

**Auto-mapping — suggest, never assign:**

- Account name contains a participant name → suggest, flagged for confirmation.
- Account number follows a sequence (3100, 3110, 3120) → suggest.
- Prior-year mapping exists → carry it forward including the participant.
- No signal → leave Unassigned and flag.

**Two partners named Smith must never auto-assign.** That is the failure that silently moves one
partner's capital into another's column.

**Partner loan guard.** An account whose description contains "loan" being mapped to the Equity
grouping raises a warning: a partner loan is a **liability**.

**Adjusting entries:** an AJE touching a participant-scoped account must carry the participant. An
AJE that changes net income marks the allocation **stale**.

**Tax codes:** T2/GIFI applies to corporations. Partnership and trust need their own code sets
(T5013, T3, 1065, 1041) — scaffold the column behaviour even if the code lists are stubbed.

---

### P8 · Partners' Capital worksheet — `PC`

A new page inside the engagement, introduced the way Schedules was. **This is the centrepiece.**

**Layout:** one row per participant, columns:

| Column | Source | Editable |
| --- | --- | --- |
| Participant | Participant list | No |
| Class | Participant list | Yes |
| Basis | % or units | Yes |
| Opening capital | Prior-year close, or entered | No after year one |
| Contributions | Workbook or entered | Yes |
| **Share of net income** | **Calculated** | Override permitted, flagged |
| Drawings / Distributions | Workbook or entered | Yes |
| Closing capital | Calculated | No |

Footer row: totals. The Share column **must sum exactly to net income**.

**Allocation methods — build these three:**

| Method | Calculation |
| --- | --- |
| Fixed percentage | Net income × each participant's % |
| Units | Net income × (units ÷ total units) |
| Manual | Preparer types each share |

**Do not build "per agreement"** (salary → interest on capital → residual). It is a sequenced
calculation and is deferred. Leave the enum value and disable the option with a reason.

**Rounding.** Three partners at 33.33% of 100,000 gives 99,990. Default rule:
**largest share absorbs**. Show the rounding adjustment as **its own line**, never buried in a
participant's share.

**Mid-year changes:** admission and retirement pro-rate by days with a manual override. A retiring
partner gets a settlement row.

**Stale state.** If net income changes or a participant is added after the allocation ran, mark it
stale with a banner and prompt a re-run. **Blocking before export.**

**Validation:**

| Rule | Severity |
| --- | --- |
| Allocated income equals net income | **Blocking** |
| Closing capital equals balance sheet partners' capital | **Blocking** |
| Percentages total 100% | **Blocking** |
| Every participant has a share, even nil | **Blocking** — blank is ambiguous, nil is a statement |
| Posted capital equals computed closing (where accounts exist) | **Blocking** |
| Allocation stale | **Blocking** before export |
| A participant's capital goes negative | Warning |
| Drawings exceed income share | Warning |
| Allocation basis differs from prior year | Warning |

**Must work for a large number of participants.** The worksheet scrolls; the *statement* is the
constrained surface, not this.

**Drill-down:** from any capital figure, open the accounts and entries behind it, filtered to that
participant.

---

### P9 · Financial statements — centre preview

**Balance sheet equity section:**

| Corporation | Partnership | Trust |
| --- | --- | --- |
| Share capital | Partner capital — per partner | Capital contributed |
| Contributed surplus | | **Accumulated income** |
| Retained earnings | | |
| Accumulated OCI | Accumulated OCI | Accumulated OCI |
| **Total Shareholders' Equity** | **Total Partners' Capital** | **Total Trust Capital** |

**Default the face to Total only**, with the per-partner detail on the Statement of Partners'
Capital. Itemising discloses to every reader what each partner is worth. Make it a setting;
default to Total only.

**Expand and collapse.** Today Share capital expands into share classes — a fixed set. For a
partnership it expands into **partners — a variable, named set, known only at engagement time**.
Same component, data-driven children. **Do not build it against a fixed list.**

**Statement of Partners' Capital** — a matrix like the Statement of Stockholders' Equity:

- Columns: Description, Notes, **one per participant**, Total (always rightmost, calculated).
- At template level the columns are placeholders (Partner 1, Partner 2, Partner 3). The template
  sets a **default count for preview, not a constraint**.
- Rows: Balance beginning of year · Prior period adjustment · Contributions · **Allocation of net
  income** · OCI · **Drawings / Distributions** · Partner admitted · Partner retired · Balance end
  of year. Trust swaps in **Income allocated**, **Accumulated income**, **Distributions to
  beneficiaries**.

**Width behaviour:**

| Participants | Behaviour |
| --- | --- |
| 2–4 | Columnar, portrait |
| 5–6 | Columnar, suggest landscape |
| 7+ | Offer Total only + a supporting schedule — offered, never forced |

**Income statement:** remove the income tax provision for partnerships; conditional for trusts.
Bottom line reads **"Net income (loss) before allocation to partners"**.

**Four tie-outs, all blocking:** balance sheet capital ↔ statement closing total; statement closing
↔ sum of participant columns; income allocated ↔ net income; per-participant closing ↔ posted
accounts where they exist.

**FS Settings, Layout and Export controls** in the toolbar keep working for the new statements.

---

### P10 · Procedures and leadsheets

The Procedures tree mirrors the TB grouping. Under **Equity**:

| Corporation | Partnership | Trust |
| --- | --- | --- |
| Share capital → `TT Equity` | **Partners' capital → per-participant leadsheet** | **Trust capital** |

The leadsheet for partners' capital should break down by participant, matching the worksheet.
Keep the existing leadsheet component, reference chips and signoff checkbox behaviour.

---

### P11 · Completion, Signoffs and Final Review

**Signoffs master sheet** gains rows for the new sections:

- **Partners' Capital** worksheet row, under its own section heading between Trial Balance and
  Procedures.
- **Statement of Partners' Capital** row under Financial Statements.
- The Share capital / Retained earnings procedure rows disappear for partnership and trust;
  Partners' capital appears in their place.

**Completion checklist** adds:

| Item | Partnership | Trust |
| --- | --- | --- |
| Allocation run and agrees to net income | ✓ | ✓ |
| Partners' capital ties across all three statements | ✓ | ✓ |
| Partnership agreement on file and reflected in the basis | ✓ | — |
| Trust deed on file; beneficiary classes confirmed | — | ✓ |
| Admissions and retirements documented | ✓ | — |
| Flow-through tax note present | ✓ | ✓ |
| Capital visibility setting confirmed before issue | ✓ | ✓ |

**Final Review** surfaces the blocking validations from P8 and P9 as a checklist the reviewer
clears.

**Sign-off wording:** "Approved on behalf of the **Partners**" / "Approved by the **Trustee**".
Signature block defaults to one signatory for a trust, two for a partnership, both editable.

**On completion, freeze:** participant list, allocation percentages and results, statement figures,
capital visibility setting. Reopening must **re-run the allocation**, not retain the frozen result.

---

### P12 · Roll forward

| Item | Carries | Resets |
| --- | --- | --- |
| Participant list | ✓ (editable during roll forward) | |
| Allocation method and percentages | ✓ | |
| **Opening capital — per participant** | ✓ **prior-year closing becomes opening, per person, never as a single total** | |
| Tax identifiers | ✓ | |
| Statement structure, formatting, added rows | ✓ | |
| Contributions, income allocation, drawings | | ✓ |
| Admission and retirement dates | | ✓ |

**Participant changes during roll forward:**

- Partner admitted → add, set date and ownership.
- Partner retired → mark retired, settlement row, column persists until the balance is nil.
- **Partner replaced → retire one, admit the other. Never rename.** Warn on a material name change:
  renaming silently transfers capital between people with no record.

**Comparative columns after a change:** show **all partners across both years**, blank where a
partner was absent. A prior-year total that no longer agrees to last year's issued statement is
not acceptable.

**Roll-forward summary** must state participant changes explicitly before confirming.

---

### P13 · Platform export

- The export schema must carry the **participant dimension**, or a round-trip loses it.
- Export the Partners' Capital worksheet as a working schedule with formulas intact.
- Check the existing export schema early — this is a small change made now or a painful one later.

---

### P14 · FS package and client package

**The confidentiality problem.** A corporate statement goes to one recipient. A partnership
statement goes to every partner — and a columnar capital statement shows every partner what every
other partner earned and withdrew.

| Variant | Contains | Goes to |
| --- | --- | --- |
| **Full package** | All statements, columnar equity | The partnership |
| **Partner package** | All statements with Total-only equity, plus that partner's own capital account | An individual partner |
| Firm copy | Everything plus working papers | The firm |
| Lender package | Statements and notes, no per-partner detail | Third parties |

**Build the Partner package** — it does not exist today. Batch generation: one action, one file per
partner, named `<Client> — <Year> — <Partner>.pdf`, delivered as a zip, with a record of which
package went to whom and when.

**Never on a financial statement:** SIN, BN, EIN, SSN, participant addresses, dates of birth. Slips
only. Enforce in the data model, not by convention.

---

## 4 · Things not in my original list — add these

| # | Item | Why |
| --- | --- | --- |
| 1 | **Capital visibility permissions** | Should a staff preparer see every partner's drawings on screen? Open / Restricted / Partner-only. Mask validation messages too — "J Smith's capital is negative" in a banner defeats the setting |
| 2 | **Terminal period** | Partnerships dissolve; trusts vest; estates terminate. Stub period, final distribution, **closing balances nil for everyone**, roll forward removed rather than greyed |
| 3 | **Trust income type** | Interest, dividend and capital gain are taxed differently in a beneficiary's hands. A partnership allocation carries one number per partner; **a trust allocation carries a number per income type per beneficiary.** Design the dimension in now even if it ships for trusts only |
| 4 | **Prior-year FS import** | A firm onboarding an existing partnership has last year's statements but no mapped TB history. Seed participants and opening balances from it |
| 5 | **Prior period adjustment and OCI rows** | Both appear on real equity statements; neither is in the row set |
| 6 | **Luka** | The AI preparer sits in the top bar on every screen. It must understand entity type, the allocation stage and the new validations, or it will give corporation-shaped answers on a partnership file |
| 7 | **Dark mode** | The platform has a theme toggle. Every new surface must work in both |
| 8 | **Empty and error states** | No participants yet; allocation not run; no prior year; unassigned accounts |
| 9 | **Seed data** | Two partnership fixtures (3 partners fixed %, 6 partners with a mid-year admission), one trust fixture, for Canada and the US. Include one TB with per-partner accounts and one with a single capital account |
| 10 | **Migration** | Move the six existing corporation templates into the Corporation folder without breaking any engagement that references them |
| 11 | **Audit trail** | Who changed an allocation, who viewed per-participant figures, who generated each partner package |
| 12 | **Print and PDF** | Participant columns must render correctly at every count tested, portrait and landscape |
| 13 | **Accessibility** | The statement matrix needs proper table semantics — a variable column set is easy to get wrong for screen readers |

---

## 5 · Test matrix

Run these as you build, not after.

**Scale:** 1 participant · 2 · 6 · 12
**Allocation:** 99.99% (blocked) · 100.01% (blocked) · three at 33.33% (rounding line) ·
one at 100% · one at 0% (nil, not blank) · net income nil · net loss
**Lifecycle:** admitted mid-year · retired mid-year · retired with unsettled capital ·
admitted and retired same year · renamed (warns) · replaced
**Mapping:** per-partner accounts in TB · single capital account · two partners named Smith ·
partner loan in the 3000 range · unassigned account
**States:** allocation not run · net income changed after allocation · participant added after
allocation · no prior year
**Terminal:** wind-up with residual (blocked) · fully distributed (nil) · negative at wind-up
**Visibility:** restricted + staff role · restricted + validation error on a named partner
**Regression:** corporation templates unchanged · existing column engine unchanged ·
roll forward maps opening capital per participant, never as a total

---

## 6 · Build order

1. **P1** Entity type — nothing else works without it
2. **P2** Template tree and the shared statement-set layer
3. **P7** Mapping with the participant dimension — the largest piece
4. **P8** Partners' Capital worksheet
5. **P9** Statements and the equity section
6. **P5** Create Engagement with participants
7. **P4** FS templates and notes
8. **P3** Checklists and letters
9. **P6** LHS menu wiring
10. **P10** Procedures and leadsheets
11. **P11** Completion, signoffs, final review
12. **P12** Roll forward
13. **P13 / P14** Export and packages
14. Then trust-specific: income type, accumulated income, terminal period

Partnership first, Canada and US together — the second country is a cheap build once the first
exists. Trust after, because it needs income typing that partnerships do not.

---

## 7 · Where to stop and ask me

- Any new component or token that does not exist in the design system
- Any label, caption or statement title not given in this document
- The exact wording of the compilation and review reports for partnership and trust
- Whether a validation should block or warn, where this document is silent
- Tax code and GIFI-equivalent lists for T5013, T3, 1065, 1041
- Anything that would change corporation behaviour
