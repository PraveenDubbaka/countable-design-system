import { useState } from "react";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Check, Loader2, Calendar, FileAudio, Mic, Upload, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImportResult {
 source: string;
 meetingDate?: string;
 attendees?: { name: string; role: string }[];
 agendaNotes?: Record<string, string>; // keyed by agenda item id (a1, a2,... b13)
 actionSteps?: { action: string; person: string; deadline: string }[];
 meetingExtracts?: { mt: string; date: string; extract: string }[];
}

interface SourceOption {
 id: string;
 label: string;
 description: string;
 icon: React.ComponentType<{ className?: string }>;
 badge?: string;
}

const SOURCES: SourceOption[] = [
 { id: "granola", label: "Granola", description: "Pull the latest planning meeting note with AI summary & action items.", icon: StickyNote, badge: "Connected" },
 { id: "fireflies", label: "Fireflies.ai", description: "Import transcript + AI summary from your most recent recorded call.", icon: Mic, badge: "Connected" },
 { id: "otter", label: "Otter.ai", description: "Pull conversation notes and decisions from Otter.", icon: FileAudio },
 { id: "gcal", label: "Google Calendar", description: "Use the meeting invite (date, attendees, agenda) as the seed.", icon: Calendar, badge: "Connected" },
 { id: "outlook", label: "Outlook Calendar", description: "Pull invite details and attached agenda from Outlook.", icon: Calendar },
 { id: "paste", label: "Paste transcript / notes", description: "Paste raw notes — Luka extracts attendees, decisions, and actions.", icon: Upload },
];

// Demo fixture — represents what AI extraction would return.
const DEMO_RESULT: Omit<ImportResult, "source"> = {
 meetingDate: new Date(Date.now() - 86_400_000).toISOString().slice(0, 16),
 attendees: [
 { name: "M. Thompson", role: "Partner" },
 { name: "L. Garcia", role: "Manager" },
 { name: "Senior 1", role: "Revenue / AR" },
 { name: "Senior 2", role: "Expenses / ASC 842" },
 { name: "J. Reyes", role: "CFO — Client" },
 ],
 agendaNotes: {
 a1: "Partner reminded the team of their responsibility for audit quality, professional skepticism, and prompt escalation of independence concerns. No issues raised.",
 a2: "Team introduced; roles confirmed. Reviewed entity profile, users of F/S (lender + shareholders), ASPE framework, and overall materiality of $145K. Watch areas: revenue cut-off, inventory count.",
 a3: "Prior year had two adjusting JEs (inventory obsolescence, accrued bonus). No fraud noted. Management responsive but year-end close was 2 weeks late.",
 a4: "New lender covenant (DSCR > 1.25). Implemented NetSuite mid-year — migration completed Q3. New CFO joined April. No M&A.",
 a5: "Preliminary AR shows revenue +12%, GM down 3pts vs prior year — to be investigated Inventory turnover lower than prior year.",
 a6: "Identified potential RMMs in revenue recognition (cut-off), inventory existence/valuation, ASC 842 lease completeness, and management estimates around obsolescence reserve.",
 a7: "RAPs: walkthroughs of revenue, purchasing, and payroll. SOC 1 report obtained for payroll service provider. IT GCs assessment planned for NetSuite.",
 b8: "All RMMs carried F/S level risk: management override (significant). Assertion-level: revenue cut-off (significant), inventory existence (significant).",
 b9: "Reviewed Discussed pressure from lender covenant as fraud risk factor. No known attitudes of override but planned JE testing expanded.",
 b10: "Substantive testing of revenue cut-off ± 5 days. Full physical inventory observation. Confirmations on 90% of AR balance. Unpredictable JE testing on last-week entries.",
 b11: "No interim work this year. Field work Jan 15–Feb 9. TCWG meeting scheduled Feb 22. Client to deliver PBC by Jan 8. Manager review by Feb 12, partner by Feb 16.",
 b12: "Reminded team on professional skepticism, ongoing communication, and updates if scope changes.",
 b13: "Discussed roll-forward of going-concern memo — no material doubt indicators.",
 },
 meetingExtracts: [
  { mt: 'Board of Directors', date: new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10), extract: 'Board approved Q3 financial results. Noted significant increase in accounts receivable. No related-party transactions flagged.' },
  { mt: 'Audit Committee', date: new Date(Date.now() - 14 * 86_400_000).toISOString().slice(0, 10), extract: 'Auditor independence confirmed. Discussed key audit matters: revenue recognition and inventory valuation. Management representation letter reviewed.' },
  { mt: 'Shareholders / AGM', date: new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10), extract: 'Annual results presented. Dividend declared. No significant concerns raised by shareholders regarding financial reporting.' },
 ],
 actionSteps: [
 { action: "Send PBC list to client and confirm delivery date", person: "L. Garcia — Manager", deadline: new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10) },
 { action: "Schedule physical inventory observation at main warehouse", person: "Senior 2 — Expenses / ASC 842", deadline: new Date(Date.now() + 10 * 86_400_000).toISOString().slice(0, 10) },
 { action: "Obtain SOC 1 report from payroll service provider", person: "Staff 1 — AP / Cash", deadline: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10) },
 { action: "Complete IT GCs walkthrough for NetSuite", person: "Senior 1 — Revenue / AR", deadline: new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10) },
 ],
};

interface Props {
 open: boolean;
 onOpenChange: (o: boolean) => void;
 onImport: (result: ImportResult) => void;
}

export function ImportNotesDialog({ open, onOpenChange, onImport }: Props) {
 const [selected, setSelected] = useState<string>("granola");
 const [pasted, setPasted] = useState("");
 const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

 const reset = () => { setStatus("idle"); setPasted(""); setSelected("granola"); };

 const handleImport = () => {
 setStatus("loading");
 // Simulated AI extraction
 setTimeout(() => {
 setStatus("done");
 setTimeout(() => {
 onImport({ source: selected,...DEMO_RESULT });
 onOpenChange(false);
 setTimeout(reset, 200);
 }, 700);
 }, 1400);
 };

 return (
 <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
 <DialogContent className="max-w-2xl">
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2">
 <Sparkles className="h-4 w-4 text-primary" />
 AI-assisted import
 </DialogTitle>
 <DialogDescription>
 Pull meeting context from a connected source. Luka extracts attendees, decisions per agenda item, and action steps — then drops them into the worksheet for your review.
 </DialogDescription>
 </DialogHeader>

 <div className="space-y-4">
 <div>
 <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Source</Label>
 <div className="mt-2 grid grid-cols-2 gap-2">
 {SOURCES.map((src) => {
 const Icon = src.icon;
 const active = selected === src.id;
 return (
 <button
 type="button"
 key={src.id}
 onClick={() => setSelected(src.id)}
 className={cn(
 "text-left rounded-md border p-3 transition-colors",
 active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
 )}
 >
 <div className="flex items-start gap-2.5">
 <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", active ? "text-primary" : "text-link")} />
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-1.5">
 <span className="text-sm font-semibold text-foreground">{src.label}</span>
 {src.badge && (
 <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
 {src.badge}
 </span>
 )}
 </div>
 <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{src.description}</p>
 </div>
 </div>
 </button>
 );
 })}
 </div>
 </div>

 {selected === "paste" && (
 <div>
 <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Paste notes / transcript</Label>
 <Textarea
 value={pasted}
 onChange={(e) => setPasted(e.target.value)}
 placeholder="Paste raw notes, transcript, or meeting summary here…"
 className="mt-1.5 min-h-[120px] text-sm"
 />
 </div>
 )}

 {status !== "idle" && (
 <div className="rounded-md border border-border bg-muted/40 p-3 text-sm flex items-center gap-2">
 {status === "loading" ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin text-primary" />
 <span className="text-foreground">Luka is extracting attendees, decisions, and action items…</span>
 </>
 ) : (
 <>
 <Check className="h-4 w-4 text-emerald-600" />
 <span className="text-foreground">Extracted 5 attendees, 13 agenda decisions, and 4 action items. Populating worksheet…</span>
 </>
 )}
 </div>
 )}
 </div>

 <DialogFooter>
 <Button variant="outline" onClick={() => onOpenChange(false)} disabled={status === "loading"}>
 Cancel
 </Button>
 <Button
 onClick={handleImport}
 disabled={status !== "idle" || (selected === "paste" && pasted.trim().length === 0)}
 >
 <Sparkles className="h-3.5 w-3.5 mr-1.5" />
 {status === "loading" ? "Importing…" : "Import & populate"}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 );
}
