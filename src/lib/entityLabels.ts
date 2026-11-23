// Entity-aware terminology for the Partnership/Trust worksheet and statements (P9+). One
// label-lookup function, no hardcoded "Partner"/"Unitholder"/"Beneficiary" strings anywhere
// else — exactly the pattern the spec asked for, so P12's Trust rollout is a data change, not
// a rewrite. Unit-trust vs. other-trust distinction isn't captured anywhere in the data model
// yet (no "trust kind" field), so Trust defaults to the "Other trusts" column of the spec's
// table; wiring a real unit-trust toggle is P12 scope.
export type EntityKind = "Partnership" | "Trust";

export interface EntityLabels {
 holder: string; // "Partner" | "Unitholder" | "Beneficiary"
 holders: string; // plural
 classGeneral: string; // "General partner" | "Unitholders" | "Beneficiaries" (trusts have no GP/LP split)
 classLimited: string; // "Limited partners" | "" | ""
 hasClassSplit: boolean;
 worksheetName: string; // "Partnership Agreement & Capital" | "Trust Declaration & Unitholders' Capital" | "Trust Deed & Trust Capital"
 worksheetCode: string; // "PW" | "TW"
 statementTitle: string; // "Statement of Partners' Capital" | ...
 contributions: string; // "Contributions" | "Units issued" | "Contributions"
 drawings: string; // "Drawings" | "Distributions" | "Distributions"
 governingDocument: string; // "Partnership agreement" | "Declaration of trust" | "Trust deed"
 whoSigns: string; // "General partner" | "Trustees" | "Trustees"
 allocationHeader: string; // "Profit / loss %" | "Units %" | "Allocation %"
 capitalLabel: string; // "Partners' capital" | "Unitholders' capital" | "Trust capital"
}

export function getEntityLabels(entityType: EntityKind, trustVariant: "unit" | "other" = "other"): EntityLabels {
 if (entityType === "Trust") {
 if (trustVariant === "unit") {
 return {
 holder: "Unitholder", holders: "Unitholders",
 classGeneral: "Unitholders", classLimited: "", hasClassSplit: false,
 worksheetName: "Trust Declaration & Unitholders' Capital", worksheetCode: "TW",
 statementTitle: "Statement of Unitholders' Capital",
 contributions: "Units issued", drawings: "Distributions",
 governingDocument: "Declaration of trust", whoSigns: "Trustees",
 allocationHeader: "Units %", capitalLabel: "Unitholders' capital",
 };
 }
 return {
 holder: "Beneficiary", holders: "Beneficiaries",
 classGeneral: "Beneficiaries", classLimited: "", hasClassSplit: false,
 worksheetName: "Trust Deed & Trust Capital", worksheetCode: "TW",
 statementTitle: "Statement of Changes in Trust Capital",
 contributions: "Contributions", drawings: "Distributions",
 governingDocument: "Trust deed", whoSigns: "Trustees",
 allocationHeader: "Allocation %", capitalLabel: "Trust capital",
 };
 }
 return {
 holder: "Partner", holders: "Partners",
 classGeneral: "General partner", classLimited: "Limited partners", hasClassSplit: true,
 worksheetName: "Partnership Agreement & Capital", worksheetCode: "PW",
 statementTitle: "Statement of Partners' Capital",
 contributions: "Contributions", drawings: "Drawings",
 governingDocument: "Partnership agreement", whoSigns: "General partner",
 allocationHeader: "Profit / loss %", capitalLabel: "Partners' capital",
 };
}
