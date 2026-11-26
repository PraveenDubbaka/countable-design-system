// Guided clickthrough tours for the Dashboard's "Use Cases" shortcut (see
// src/components/GuidedTour/UseCasesPanel.tsx). Each tour drives the REAL screens — nothing here
// is a separate mockup — by highlighting one real control per step and advancing either when the
// user clicks it (the actual clickthrough) or, for the rare step with nothing to click, via a
// Next button. See src/store/tourStore.tsx for the step/engine contract.
import type { UseCaseTour } from "@/store/tourStore";

const WCP = "COM-WCP-Dec312024"; // Willow Creek Partners LLP — carried-forward + mid-year-new partner mix
const WCP_REV = "REV-WCP-Dec312024"; // same partners, separate engagement — used as the "sacrificial" copy for retire/remove
const BFT = "COM-BFT-Dec312024"; // Birchwood Family Trust — two continuing beneficiaries, none new yet

const pwRoute = (id: string) => `/engagements/${id}/checklist/pw-worksheet`;
const tbRoute = (id: string) => `/engagements/${id}/trial-balance`;
const wbRoute = (id: string) => `/engagements/${id}/workbook`;

export const USE_CASE_TOURS: UseCaseTour[] = [
 {
 id: "capital-carry-forward-vs-new",
 title: "Partner Capital: Carry Forward vs. New Partner",
 summary: "The flagship scenario — how an existing partner's capital account rolls forward year to year, versus a partner admitted mid-year starting from zero, all the way through to the financials.",
 category: "flagship",
 steps: [
 {
 route: pwRoute(WCP), enterRoute: pwRoute(WCP),
 selector: `[data-tour="pw-history-WCP-ALEX"]`,
 title: "Alex Rivera — carried forward",
 body: "Alex has no admission date on file, so the register treats him as continuing from last year. Click his row to see what that drives.",
 placement: "right",
 },
 {
 route: pwRoute(WCP), selector: `[data-tour="pw-history-WCP-PRIYA"]`,
 title: "Priya Nandan — a brand-new partner",
 body: "Priya was admitted Jul 1, 2024 — the register flags her as new this year instead of carried forward. Click her row to continue.",
 placement: "right",
 },
 {
 route: pwRoute(WCP), selector: `[data-tour="pw-opening-WCP-ALEX"]`,
 title: "Carried-forward opening balance",
 body: "Scroll to the capital roll-forward table: Alex's Opening is last year's $200,000 closing capital, rolled forward automatically — labeled right under the figure.",
 placement: "top",
 },
 {
 route: pwRoute(WCP), selector: `[data-tour="pw-opening-WCP-PRIYA"]`,
 title: "A new partner starts at zero",
 body: "Priya's Opening is $0.00 — no prior-year balance exists yet, so her capital account starts from scratch on the day she's admitted.",
 placement: "top",
 },
 {
 route: pwRoute(WCP), selector: `[data-tour="pw-ni-WCP-PRIYA"]`,
 title: "Still allocated correctly, mid-year",
 body: "Her Net income allocated is time-weighted behind the scenes by her admission date — so she isn't allocated income for the months before she joined, even though her register % looks like a full-year figure.",
 placement: "top",
 },
 {
 route: pwRoute(WCP), selector: `[data-tour="checklist-node-tb"]`,
 title: "Now see it in the Trial Balance",
 body: "Every partner's contributions, drawings and closing capital post through the Trial Balance as individually mapped accounts. Click Trial Balance to find Priya's.",
 placement: "right",
 },
 {
 route: tbRoute(WCP), selector: `[data-tour="tb-participant-pc-WCP-PRIYA"]`,
 title: "Mapped to Priya, by name",
 body: "This row's Participant dropdown is set to Priya Nandan — that link is what ties this specific Trial Balance account to her individual capital account.",
 placement: "left",
 },
 {
 route: tbRoute(WCP), selector: `[data-tour="tb-mapno-pc-WCP-PRIYA"]`,
 title: "A map number drives the statement line",
 body: "The Map No. here tells the Workbook which statement line and GIFI code this account rolls into. Click it, then let's see where it lands.",
 placement: "left",
 },
 {
 route: wbRoute(WCP), enterRoute: wbRoute(WCP),
 selector: `[data-tour="wb-nav-capital-statement"]`,
 title: "Everything rolls up here",
 body: "Click 'Statement of Partners' Capital' to see Alex's carried-forward balance and Priya's from-scratch balance sitting side by side in the same statement.",
 placement: "right",
 },
 {
 route: wbRoute(WCP), selector: `[data-tour="wb-allocation-by-holder"]`,
 title: "Allocation by partner, in the financials",
 body: "Alex and Morgan's Opening columns carry real prior-year dollars; Priya's Opening reads $0 — exactly what we just saw in the worksheet, now flowing straight into the financials.",
 placement: "top",
 advance: "next",
 },
 ],
 },
 {
 id: "new-beneficiary-from-scratch",
 title: "Add a New Partner or Beneficiary From Scratch",
 summary: "Start a brand-new capital account with no prior history — using Birchwood Family Trust, which today only has two continuing beneficiaries.",
 category: "new",
 steps: [
 {
 route: pwRoute(BFT), enterRoute: pwRoute(BFT),
 selector: `[data-tour="pw-add-partner"]`,
 title: "Starting a capital account from scratch",
 body: "Taylor and Jordan are continuing beneficiaries. Click '+ Add beneficiary' to register a brand-new one with no prior-year history.",
 placement: "bottom",
 },
 {
 // Birchwood's register has no class split, so the new row sits directly above the Total row:
 // nth-last-child(2), not last-child (which is Total). The new participant's generated id is
 // unpredictable, so this is a structural selector rather than a data-tour id.
 route: pwRoute(BFT), selector: `[data-tour="pw-register-table"] tbody tr:nth-last-child(2) input`,
 title: "Name the new beneficiary",
 body: "Type a name — e.g. “Sam Ortiz”. Their admission date already defaults to today, which is what marks them as new rather than carried forward. Click Next when you're ready.",
 placement: "right",
 advance: "next",
 },
 {
 route: pwRoute(BFT), selector: `[data-tour="pw-register-table"] tbody tr:nth-last-child(2) [data-tour^="pw-history-"]`,
 title: "Marked as new, automatically",
 body: "Because an admission date is set, this beneficiary shows “New — admitted {date}” instead of “Carried forward” — the same signal we saw for Priya Nandan on the Partnership engagement.",
 placement: "right",
 },
 {
 route: pwRoute(BFT), selector: `[data-tour="pw-rollforward-table"] tbody tr:nth-last-child(2) td:nth-child(2)`,
 title: "Zero opening balance",
 body: "Scroll down to the capital roll-forward table — the new beneficiary's Opening is $0.00, with no prior year to carry forward.",
 placement: "top",
 },
 {
 route: pwRoute(BFT), selector: `[data-tour="pw-reconciliation"]`,
 title: "Not yet mapped to the Trial Balance",
 body: "Until this beneficiary's contributions and drawings accounts are mapped in the Trial Balance, the checks below will flag a real difference here — expected for a brand-new entry, and exactly what you'd clear up before concluding this worksheet.",
 placement: "top",
 advance: "next",
 },
 ],
 },
 {
 id: "map-partner-transactions-tb",
 title: "Map Partner Transactions in the Trial Balance",
 summary: "A closer look at how individual contributions, drawings and closing-capital accounts are mapped to each partner via map numbers.",
 category: "mapping",
 steps: [
 {
 route: tbRoute(WCP), enterRoute: tbRoute(WCP),
 selector: `[data-tour="tb-row-pc-WCP-ALEX"]`,
 title: "Alex Rivera's capital account row",
 body: "Each partner gets their own synthetic Trial Balance row for capital (and drawings, where applicable). This one is Alex's capital account — click it to look closer.",
 placement: "top",
 },
 {
 route: tbRoute(WCP), selector: `[data-tour="tb-participant-pc-WCP-ALEX"]`,
 title: "The Participant mapping",
 body: "This dropdown ties the row to Alex specifically. If you ever see “Select…” here instead, that row's dollars are in the Trial Balance but not yet tied to anyone's individual capital account.",
 placement: "left",
 },
 {
 route: tbRoute(WCP), selector: `[data-tour="tb-mapno-pc-WCP-ALEX"]`,
 title: "Map number drives the statement line",
 body: "The Map No. (GIFI code) decides which line of the Balance Sheet and Capital Statement this account feeds — assigned per partner class, not per individual.",
 placement: "left",
 },
 {
 route: tbRoute(WCP), selector: `[data-tour="tb-row-pd-WCP-ALEX"]`,
 title: "Drawings get their own row too",
 body: "Alex's $120,000 in drawings posts as a separate, separately-mapped row. Contributions, drawings and closing capital are each tracked and mapped independently per partner, then summed back up in the worksheet and the Workbook.",
 placement: "top",
 advance: "next",
 },
 ],
 },
 {
 id: "partner-retires-remove",
 title: "A Partner Retires — Remove & Reconcile",
 summary: "Flag a partner as retiring, then remove them from the register entirely, and see exactly which reconciliation checks still catch the leftover balance — and which ones don't.",
 category: "lifecycle",
 steps: [
 {
 route: pwRoute(WCP_REV), enterRoute: pwRoute(WCP_REV),
 selector: `[data-tour="pw-retirement-WCP-PRIYA"]`,
 title: "Set a retirement date first",
 body: "Before removing a partner entirely, mark them as retiring — pick a date here to flag Priya as retiring without deleting her record yet. Click Next when you're ready.",
 placement: "right",
 advance: "next",
 },
 {
 route: pwRoute(WCP_REV), selector: `[data-tour="pw-history-WCP-PRIYA"]`,
 title: "The badge updates immediately",
 body: "Her Capital history badge now reads “Retiring {date}” instead of her prior status — a clear signal for whoever reviews this worksheet next.",
 placement: "right",
 },
 {
 route: pwRoute(WCP_REV), selector: `[data-tour="pw-remove-WCP-PRIYA"]`,
 title: "Remove her once the buyout is final",
 body: "When the buyout is complete, use this to remove her from the register entirely. Her Trial Balance rows stay untouched until they're remapped to someone else.",
 placement: "left",
 },
 {
 route: pwRoute(WCP_REV), selector: `[data-tour="pw-reconciliation"]`,
 title: "Read the reconciliation carefully here",
 body: "With Priya gone, most reconciliation rows will trivially show “Agrees” — there's simply no one left to compare against. “Net income allocated vs. Statement of Income (Loss)” is the exception: it's computed independently of the partner list, so it still correctly flags the real unallocated amount. That's your honest signal, not the other rows' false all-clear.",
 placement: "top",
 advance: "next",
 },
 ],
 },
 {
 id: "review-capital-statement-workbook",
 title: "Review the Statement of Partners' Capital in the Workbook",
 summary: "Jump straight to the Workbook's reporting view — the roll-forward, the per-partner breakdown, and the printable statement itself.",
 category: "reporting",
 steps: [
 {
 route: wbRoute(WCP), enterRoute: wbRoute(WCP),
 selector: `[data-tour="wb-nav-capital-statement"]`,
 title: "Open the Statement of Partners' Capital",
 body: "Click here to switch the Workbook's centre view to the Statement of Partners' Capital.",
 placement: "right",
 },
 {
 route: wbRoute(WCP), selector: `[data-tour="wb-capital-centre"]`,
 title: "The full roll-forward",
 body: "Opening, contributions, net income allocated, drawings and closing — pulled straight from the worksheet and Trial Balance, recomputed live.",
 placement: "bottom",
 },
 {
 route: wbRoute(WCP), selector: `[data-tour="wb-allocation-by-holder"]`,
 title: "Broken out by partner",
 body: "Each partner gets their own column — this is what ties the worksheet's per-partner figures to the financials.",
 placement: "top",
 },
 {
 route: wbRoute(WCP), selector: `[data-tour="wb-toggle-preview"]`,
 title: "Open the preview panel",
 body: "Click here to show the printed-statement preview alongside the centre view.",
 placement: "left",
 },
 {
 route: wbRoute(WCP), selector: `[data-tour="wb-capital-preview"]`,
 title: "The printable statement",
 body: "This is the actual Statement of Partners' Capital as it appears in the financial statements — ready to export once the worksheet is concluded.",
 placement: "left",
 advance: "next",
 },
 ],
 },
];
