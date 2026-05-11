import { useEffect, useRef, useState } from "react";
import { Checklist } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Check, X, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import signatureImg from "@/assets/letter-signature.png";
import receivedStamp from "@/assets/letter-received-stamp.png";

interface LetterViewProps {
  checklist: Checklist;
  onUpdate: (updated: Checklist) => void;
  /** "letter" (default) shows firm letterhead + signature block.
   *  "report" shows a clean document with no header/footer/stamp. */
  variant?: "letter" | "report";
}

/**
 * Renders an Engagement-style letter (e.g. Engagement Letter, Management
 * Responsibility & Acknowledgement) instead of a checklist.
 *
 * The letter HTML is stored on `checklist.sections[0].questions[0].text`
 * (existing schema, no migration needed).  Edit mode toggles a
 * contentEditable surface; Save persists the new HTML back to the checklist.
 */
export function LetterView({ checklist, onUpdate, variant = "letter" }: LetterViewProps) {
  const isReport = variant === "report";
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const letterHtml =
    checklist.sections?.[0]?.questions?.[0]?.text ?? "";

  // When entering edit mode, seed the editor with the current HTML.
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.innerHTML = letterHtml;
    }
  }, [isEditing, letterHtml]);

  const handleSave = () => {
    if (!editorRef.current) return;
    const newHtml = editorRef.current.innerHTML;
    const sections = checklist.sections.map((s, sIdx) =>
      sIdx === 0
        ? {
            ...s,
            questions: s.questions.map((q, qIdx) =>
              qIdx === 0 ? { ...q, text: newHtml } : q
            ),
          }
        : s
    );
    onUpdate({ ...checklist, sections, updatedAt: new Date() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top toolbar — matches ChecklistBuilder */}
      <div className="border-b bg-card px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold px-2 py-1">{checklist.title}</h1>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" className="h-9 gap-1.5" onClick={handleCancel}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button size="sm" className="h-9 gap-1.5" onClick={handleSave}>
                <Check className="h-4 w-4" />
                Save changes
              </Button>
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 hover:bg-[#1C63A6] hover:text-white hover:border-[#1C63A6] transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add to My Templates</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-white border-t border-border">

      {/* Letter / Report sheet */}
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden">
        {/* Header — firm logo for letters, placeholder for reports */}
        {isReport ? (
          <div className="px-12 py-10 flex items-center justify-center border-b border-border/60 min-h-[100px]">
            <span className="text-sm text-muted-foreground/50 select-none">Header goes here</span>
          </div>
        ) : (
          <div className="pt-12 pb-6 flex flex-col items-center">
            <FirmLogoSVG />
          </div>
        )}

        {/* Body */}
        <div className="px-12 pb-16 letter-body pt-10">
          {isEditing ? (
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none focus:ring-2 focus:ring-primary/40 rounded-md p-2 min-h-[200px]"
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: letterHtml }} />
          )}

          {/* Signature block — letters only */}
          {!isReport && !isEditing && (
            <div className="mt-6">
              <img
                src={signatureImg}
                alt="Authorized signature"
                width={140}
                height={56}
                loading="lazy"
                className="h-14 w-auto -ml-1"
              />
              <button
                type="button"
                className="mt-1 inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
              >
                Change signature
              </button>
              <p className="mt-1 text-sm text-foreground">(Signature)</p>

              <p className="mt-6 text-sm text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })}
                <br />
                <span>(Date)</span>
              </p>

              <p className="mt-6 text-sm text-foreground uppercase tracking-wide">
                Acknowledged and agreed on behalf of the management of{" "}
                <FieldChip>Entity Name</FieldChip>
              </p>

              <div className="mt-3 flex flex-col gap-2">
                <FieldChip variant="client">Client Signature</FieldChip>
                <p className="text-sm text-foreground">(Signature)</p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <FieldChip variant="client">Client Signed Date</FieldChip>
                <p className="text-sm text-foreground">(Date)</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer — placeholder for reports, stamp for letters */}
        {isReport ? (
          <div className="px-12 py-6 flex items-center justify-center border-t border-border/60 min-h-[60px]">
            <span className="text-sm text-muted-foreground/50 select-none">Footer goes here</span>
          </div>
        ) : (
          !isEditing && (
            <img
              src={receivedStamp}
              alt=""
              aria-hidden="true"
              width={160}
              height={80}
              loading="lazy"
              className="absolute bottom-6 right-6 h-16 w-auto opacity-90 pointer-events-none select-none"
            />
          )
        )}
      </div>
      </div>

      {/* Add to My Templates dialog */}
      <AddToMyTemplatesDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        checklist={checklist}
        checklistName={checklist.title}
      />
    </div>
  );
}

/* ---------- helpers ---------- */

function FieldChip({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "client";
}) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium w-fit";
  const styles =
    variant === "client"
      ? "border-emerald-500/60 text-emerald-700 bg-emerald-50/40"
      : "border-primary/40 text-primary bg-primary/5";
  return <span className={`${base} ${styles}`}>{children}</span>;
}

function FirmLogoSVG() {
  return (
    <div className="flex flex-col items-center">
      {/* Decorative crest mark */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="block h-px w-10 bg-[#C2764B]" />
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#C2764B" aria-hidden="true">
          <path d="M12 2 L14 9 L21 9 L15.5 13.5 L17.5 21 L12 16.5 L6.5 21 L8.5 13.5 L3 9 L10 9 Z" />
        </svg>
        <span className="block h-px w-10 bg-[#C2764B]" />
      </div>
      <h2
        className="mt-3 text-2xl font-extrabold tracking-wide"
        style={{ color: "#1B3A6B", letterSpacing: "0.02em" }}
      >
        WILDCAT ACCOUNTING
      </h2>
      <div className="mt-1 text-[11px] tracking-[0.18em] text-muted-foreground font-semibold">
        PROFESSIONAL CORPORATION
      </div>
      <div className="text-[11px] tracking-[0.18em] text-muted-foreground font-semibold">
        CHARTERED PROFESSIONAL ACCOUNTANT
      </div>
    </div>
  );
}
