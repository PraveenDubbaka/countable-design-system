// Shared Accounting Standards / Framework option list for the Create Engagement pages (P5).
// Extracted from the (previously duplicated, byte-identical) logic in CreateEngagement.tsx and
// CreateNewEngagement.tsx so both pages apply the same entity-type-aware filtering.

export const ACCOUNTING_FRAMEWORKS = [
 "ASPE — Canadian Accounting Standards for Private Enterprises",
 "IFRS — International Financial Reporting Standards",
 "US GAAP — Generally Accepted Accounting Principles (United States)",
 "Tax Basis",
 "Cash Basis",
 "Modified Cash Basis",
];

const ASPE = "ASPE — Canadian Accounting Standards for Private Enterprises";
const US_GAAP = "US GAAP — Generally Accepted Accounting Principles (United States)";

export function getAccountingStandardsOptions(params: {
 isAudit: boolean;
 isTax?: boolean;
 clientCountry?: string;
 entityType?: string;
}): { value: string; label: string }[] {
 const { isAudit, isTax, clientCountry, entityType } = params;
 const isPartnershipOrTrust = entityType === "Partnership" || entityType === "Trust";

 // Tax filings (T2/T5013/T3/1120/1065/1041) are prepared on a tax basis regardless of entity
 // type or country — not ASPE/IFRS/US GAAP, so this branch runs before the Partnership/Trust
 // one below, which would otherwise force ASPE/US GAAP onto a tax engagement too.
 if (isTax) {
 return [{ value: "Tax Basis", label: "Tax Basis" }];
 }

 // Partnership/Trust: Canada -> ASPE, US -> US GAAP only (no IFRS, no basis options).
 if (isPartnershipOrTrust && !isAudit) {
 const only = clientCountry === "us" ? US_GAAP : ASPE;
 return [{ value: only, label: only }];
 }

 const frameworks = isAudit ? ACCOUNTING_FRAMEWORKS : [
 ASPE,
 "IFRS — International Financial Reporting Standards",
 US_GAAP,
 "Tax Basis", "Cash Basis", "Modified Cash Basis",
 ];
 if (clientCountry === "us") {
 const usFirst = frameworks.filter(fw => fw.includes("US GAAP") || fw.includes("PCAOB"));
 const rest = frameworks.filter(fw => !fw.includes("US GAAP") && !fw.includes("PCAOB"));
 return [...usFirst, ...rest].map(fw => ({ value: fw, label: fw }));
 }
 return frameworks.map(fw => ({ value: fw, label: fw }));
}
