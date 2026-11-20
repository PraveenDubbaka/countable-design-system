import EditableTitleBlock from "./EditableTitleBlock";
import EditableTableControls from "./EditableTableControls";
import { useStatementOverlays } from "./StatementImageOverlays";
import { useLayoutSettings, getFontFamily, getBodyPadding, getCompressionScale } from "./LayoutSettingsContext";

interface NotesPreviewProps {
 isEditMode?: boolean;
 onContentChanged?: (hasChanges: boolean) => void;
 entityType?: string;
}

const NotesPreview = ({ isEditMode = false, onContentChanged, entityType = "Corporation" }: NotesPreviewProps) => {
 const isPartnership = entityType === "Partnership";
 const isTrust = entityType === "Trust";
 const { settings } = useLayoutSettings();
 const { pageRef, renderOverlays } = useStatementOverlays(isEditMode);
 const fontFamily = getFontFamily(settings);
 const bodyPadding = getBodyPadding(settings);
 const scale = getCompressionScale(settings);
 const baseFontSize = 15 * scale;

 const showHeader = settings.headerFooterEnabled && settings.headerScope !== "none";
 const showFooter = settings.headerFooterEnabled && settings.footerScope !== "none";

 const pageStyle: React.CSSProperties = {
 width: "842px",
 minHeight: "1191px",
 boxShadow: "0 4px 24px hsl(220 20% 10% / 0.08), 0 1px 4px hsl(220 20% 10% / 0.04)",
 position: "relative",
 overflow: "hidden",
 display: "flex",
 flexDirection: "column",
 fontFamily,
 background: "#fff",
 borderRadius: 2,
 border: "1px solid hsl(var(--border))",
 };

 const headerStyle: React.CSSProperties = {
 background: "hsl(220 15% 96%)",
 padding: bodyPadding,
 textAlign: "center",
 fontSize: 14 * scale,
 color: "#5a5a6e",
 };

 const footerStyle: React.CSSProperties = {
 background: "hsl(220 15% 96%)",
 padding: bodyPadding,
 textAlign: "center",
 fontSize: 14 * scale,
 color: "#5a5a6e",
 };

 const bodyStyle: React.CSSProperties = { flex: 1, padding: bodyPadding, fontSize: baseFontSize, color: "#1a1a1a", position: "relative", lineHeight: 1.6 };

 const titleBlock = (
 <EditableTitleBlock
 isEditMode={isEditMode}
 onContentChanged={onContentChanged}
 entityName="Northline Precision Manufacturing Inc."
 pageName="Notes to Financial Information"
 dateLabel="For the year ended December 31, 2025"
 />
 );

 const sectionTitle = (num: string, title: string) => (
 <div style={{ fontWeight: 700, fontSize: baseFontSize, marginTop: 16, marginBottom: 6 }}>{num}. {title}</div>
 );

 const cellStyle = "px-2 py-[2px] text-right whitespace-nowrap text-sm";
 const labelStyle = "px-2 py-[2px] text-left text-sm";
 const thickBorderTop = "border-t-2 border-black";
 const thickBorderBottom = "border-b-2 border-black";

 return (
 <div className="flex-1 flex flex-col items-center gap-8 p-6 bg-muted/30 overflow-y-auto">
 {/* Page 1 */}
 <div ref={pageRef} data-fs-page style={pageStyle}>
 {renderOverlays("background")}
 {showHeader && <div style={headerStyle}>Header will come here</div>}
 <div style={bodyStyle}>
 {titleBlock}

 {isPartnership || isTrust ? (
 <>
 {/* Partnership/Trust notes (P4) — ported verbatim from the existing Templates gallery
 reference (TemplatePartnershipNotesPreview.tsx / TemplateTrustNotesPreview.tsx), the
 closest real written content for these entity types in this codebase. */}
 {isPartnership ? (
 <>
 {sectionTitle("1", "Nature of the Partnership")}
 <p style={{ fontSize: baseFontSize, marginBottom: 8, textAlign: "justify" }}>
 ABC Partnership is a general partnership formed under the laws of the Province of [Province] and is engaged in [description of business activities]. The partnership agreement provides for the allocation of net income and losses between partners based on agreed profit-sharing ratios.
 </p>
 {sectionTitle("2", "Related Party Transactions")}
 <p style={{ fontSize: baseFontSize, marginBottom: 8, textAlign: "justify" }}>
 During the year, guaranteed payments to partners totalling $10,000 (20XX — $8,000) were made to Partners A and B for management services. These transactions were measured at the exchange amount, which is the amount of consideration established and agreed to by the related parties.
 </p>
 {sectionTitle("3", "Partnership Agreement")}
 <p style={{ fontSize: baseFontSize, marginBottom: 8, textAlign: "justify" }}>
 The partnership agreement provides for a 60/40 profit and loss sharing ratio between Partner A and Partner B respectively. Partners are entitled to draw against their capital accounts in accordance with the terms of the agreement.
 </p>
 </>
 ) : (
 <>
 {sectionTitle("1", "Nature of the Trust")}
 <p style={{ fontSize: baseFontSize, marginBottom: 8, textAlign: "justify" }}>
 [Trust Name] was established pursuant to a trust indenture dated [Date] under the laws of [Province/Territory], Canada. The trust was created for the purpose of [holding and managing assets / providing for beneficiaries]. The trustee(s) of the trust is/are [Name(s)].
 </p>
 {sectionTitle("2", "Distributions to Beneficiaries")}
 <p style={{ fontSize: baseFontSize, marginBottom: 8, textAlign: "justify" }}>
 In accordance with the trust indenture, the trustee has discretion to allocate and distribute trust income to the beneficiaries. Income is allocated based on the percentages determined by the trustee each year: Beneficiary A (40%), Beneficiary B (30%), and Beneficiary C (30%). T3 slips are issued reflecting the character of income (eligible dividends, interest, taxable capital gains, rental income).
 </p>
 {sectionTitle("3", "Income Taxes")}
 <p style={{ fontSize: baseFontSize, marginBottom: 8, textAlign: "justify" }}>
 The trust is subject to income tax under Part I of the Income Tax Act (Canada) on income that is not distributed or allocated to beneficiaries. Inter vivos trusts are taxed at the highest marginal rate. Income designated and paid or payable to beneficiaries is deductible by the trust and taxable in the hands of the beneficiaries. The provision for income taxes of $5,000 (prior year — $3,500) relates to income retained in the trust.
 </p>
 </>
 )}
 </>
 ) : (
 <>
 {/* Top-level column headers */}
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: baseFontSize, marginBottom: 8 }}>
 <thead>
 <tr>
 <th className={`${thickBorderTop} ${thickBorderBottom}`} style={{ width: "55%", textAlign: "left", padding: "4px 2px" }}></th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "22.5%", fontWeight: 700 }}>
 Month Date<br />20XX
 </th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "22.5%", fontWeight: 700 }}>
 Month Date<br />20XX
 </th>
 </tr>
 </thead>
 </table>

 {/* Section 1 - Single manual column */}
 {sectionTitle("1", "Note Category 1 Name")}
 <EditableTableControls isEditMode={isEditMode}>
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: baseFontSize }}>
 <thead>
 <tr>
 <th style={{ width: "55%", textAlign: "left", padding: "4px 2px" }}></th>
 <th className={`${cellStyle}`} style={{ width: "22.5%", fontWeight: 400 }}></th>
 <th className={`${cellStyle}`} style={{ width: "22.5%", fontWeight: 400 }}>
 Manual<br />Column
 </th>
 </tr>
 </thead>
 <tbody>
 <tr className={thickBorderTop}>
 <td className={labelStyle}>Category Line Item 1</td>
 <td className={cellStyle}></td>
 <td className={cellStyle}>100</td>
 </tr>
 <tr>
 <td className={labelStyle}>Category Line Item 2</td>
 <td className={cellStyle}></td>
 <td className={cellStyle}>100</td>
 </tr>
 <tr>
 <td className={labelStyle}>Category Line Item 3</td>
 <td className={cellStyle}></td>
 <td className={cellStyle}>100</td>
 </tr>
 <tr data-editable-total="Total">
 <td className={`${labelStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>Total</td>
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`}></td>
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`}>300</td>
 </tr>
 </tbody>
 </table>
 </EditableTableControls>

 <div style={{ height: 16 }} />

 {/* Section 2 - Two columns */}
 {sectionTitle("2", "Note Category 2 Name")}
 <EditableTableControls isEditMode={isEditMode}>
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: baseFontSize }}>
 <thead>
 <tr>
 <th style={{ width: "55%", textAlign: "left", padding: "4px 2px" }}></th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "22.5%", fontWeight: 700 }}>
 December 31<br />2025
 </th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "22.5%", fontWeight: 700 }}>
 December 31<br />2024
 </th>
 </tr>
 </thead>
 <tbody>
 <tr className={thickBorderTop}>
 <td className={labelStyle}>Category Line Item 1</td>
 <td className={cellStyle}>200</td>
 <td className={cellStyle}>100</td>
 </tr>
 <tr>
 <td className={labelStyle}>Category Line Item 2</td>
 <td className={cellStyle}>200</td>
 <td className={cellStyle}>100</td>
 </tr>
 <tr>
 <td className={labelStyle}>Category Line Item 3</td>
 <td className={cellStyle}>200</td>
 <td className={cellStyle}>100</td>
 </tr>
 <tr data-editable-total="Total">
 <td className={`${labelStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>Total</td>
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`}>600</td>
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`}>300</td>
 </tr>
 </tbody>
 </table>
 </EditableTableControls>

 <div style={{ height: 16 }} />

 {/* Section 3 - Text paragraph */}
 {sectionTitle("3", "Note Category 3 Name")}
 <p style={{ fontSize: baseFontSize, marginBottom: 8, textAlign: "justify" }}>
 This is sample placeholder text. This area will contain your note reference paragraph, where you can outline key explanations, add supporting details, and provide the necessary information required for your document.
 </p>
 </>
 )}
 </div>
 {renderOverlays("foreground")}
 {showFooter && <div style={footerStyle}>Footer will come here</div>}
 </div>
 </div>
 );
};

export default NotesPreview;
