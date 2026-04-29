import { useEffect, useRef, useState } from "react";
import { Checklist } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Check, X } from "lucide-react";
import signatureImg from "@/assets/letter-signature.png";
import receivedStamp from "@/assets/letter-received-stamp.png";

interface LetterViewProps {
  checklist: Checklist;
  onUpdate: (updated: Checklist) => void;
}

/**
 * Renders an Engagement-style letter (e.g. Engagement Letter, Management
 * Responsibility & Acknowledgement) instead of a checklist.
 *
 * The letter HTML is stored on `checklist.sections[0].questions[0].text`
 * (existing schema, no migration needed).  Edit mode toggles a
 * contentEditable surface; Save persists the new HTML back to the checklist.
 */
export function LetterView({ checklist, onUpdate }: LetterViewProps) {
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
    <div className="px-6 py-6">
      {/* Mode toggle */}
      <div className="max-w-3xl mx-auto mb-3 flex items-center justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5"
              onClick={handleCancel}
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={handleSave}
            >
              <Check className="h-3.5 w-3.5" />
              Save changes
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="h-8 gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>
          </>
        )}
      </div>

      {/* Letter sheet */}
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden">
        {/* Header / firm logo */}
        <div className="pt-12 pb-6 flex flex-col items-center">
          <FirmLogoSVG />
        </div>

        {/* Letter body */}
        <div className="px-12 pb-16 letter-body">
          {isEditing ? (
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none focus:ring-2 focus:ring-primary/40 rounded-md p-2 min-h-[200px]"
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: letterHtml }}
            />
          )}

          {/* Signature block (rendered outside editable area) */}
          {!isEditing && (
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

        {/* Decorative received stamp */}
        {!isEditing && (
          <img
            src={receivedStamp}
            alt=""
            aria-hidden="true"
            width={160}
            height={80}
            loading="lazy"
            className="absolute bottom-6 right-6 h-16 w-auto opacity-90 pointer-events-none select-none"
          />
        )}
      </div>
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
      {/* Wildcat silhouette — leaping cougar */}
      <svg
        viewBox="0 0 240 110"
        className="h-16 w-auto"
        fill="#C2764B"
        aria-hidden="true"
      >
        {/* Body */}
        <path d="M20,80 C40,55 70,45 105,50 C130,53 150,65 175,60 C190,57 200,50 210,42 L218,32 L222,42 L232,38 L228,50 L236,54 L224,58 C220,68 210,76 195,80 L210,90 L195,88 L198,98 L188,90 L175,94 L168,86 L155,92 L148,84 L135,90 L128,82 L115,88 L110,80 L92,86 L88,78 L70,84 L66,76 L48,82 L44,74 L28,80 Z" />
        {/* Tail */}
        <path d="M16,82 C8,80 2,72 4,62 C8,72 14,76 22,80 Z" />
        {/* Ear hint */}
        <path d="M214,38 L220,30 L222,38 Z" fill="#C2764B" />
      </svg>
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
