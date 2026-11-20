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
 clientCountry?: string;
 entityType?: string;
}): { value: string; label: string }[] {
 const { isAudit, clientCountry, entityType } = params;
 const isPartnershipOrTrust = entityType === "Partnership" || entityType === "Trust";

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
