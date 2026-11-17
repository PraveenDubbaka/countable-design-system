import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, Blocks, ListChecks, Plus, Rows2, Settings, Trash2, X } from "lucide-react";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { letterPanelSectionName, letterPanelSections } from "@/lib/letterPanelCatalog";
import { cn } from "@/lib/utils";
import { LETTER_MARGIN_LABELS } from "@/lib/letterMargins";
import { LETTER_FIELDS, type LetterTemplateSection, type TemplateMargin } from "@/lib/letterTemplate";

// Option B: copied from the PDF editor edit panel (PdfWorkspace.tsx in the "PDF design" project).
// Rail: w-12, border-r, icon buttons size="icon" (36px), gap-1, py-2, active = default variant.
// Panel: 520px (408px below 1280px), min 360px, border-l, bg-card, content p-3, space-y-3.

export type LetterEditorTool = "elements" | "sections" | "layout";

const TOOLS = [
  { id: "elements", label: "Elements", icon: Blocks },
  { id: "sections", label: "Sections", icon: ListChecks },
  { id: "layout", label: "Layout", icon: Settings },
] as const;

const ROW =
  "flex w-full items-center gap-2 rounded-[8px] border border-[hsl(var(--border))] bg-background p-2 text-left text-[13px] leading-[1.3] text-foreground";

function PanelHeading({ children }: { children: string }) {
  return (
    <div className="flex min-h-8 items-center">
      <p className="text-xs font-semibold text-foreground">{children}</p>
    </div>
  );
}

interface LetterEditorPanelProps {
  active: LetterEditorTool;
  onActiveChange: (tool: LetterEditorTool) => void;
  sections: LetterTemplateSection[];
  selectedSection: string;
  margin: TemplateMargin;
  onInsertField: (field: string) => void;
  onAddSection: (name: string) => void;
  onSelectSection: (id: string) => void;
  onToggleSection: (section: LetterTemplateSection, enabled: boolean) => void;
  onMarginChange: (margin: TemplateMargin) => void;
  elementsHint?: string;
}

export function LetterEditorPanel({
  active,
  onActiveChange,
  sections,
  selectedSection,
  margin,
  onInsertField,
  onAddSection,
  onSelectSection,
  onToggleSection,
  onMarginChange,
  elementsHint = "Click an element to add it to the selected section.",
}: LetterEditorPanelProps) {
  const [width] = useState(() => (window.innerWidth >= 1280 ? 520 : 408));
  const [addSectionOpen, setAddSectionOpen] = useState(false);

  let content: ReactNode;
  if (active === "elements") {
    content = (
      <div className="space-y-3">
        <PanelHeading>ELEMENTS</PanelHeading>
        <p className="text-xs text-foreground">{elementsHint}</p>
        <div className="space-y-2" aria-label="Letter elements">
          {LETTER_FIELDS.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => onInsertField(field)}
              aria-label={`Add ${field}`}
              className={cn(ROW, "group transition-colors hover:bg-muted")}
            >
              <span className="min-w-0 flex-1 truncate">{field}</span>
              <Plus
                className="h-4 w-4 shrink-0 text-foreground/50 transition-colors group-hover:text-foreground"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>
    );
  } else if (active === "sections") {
    content = (
      <div className="space-y-3">
        <PanelHeading>SECTIONS</PanelHeading>
        <Button size="sm" className="w-full" onClick={() => setAddSectionOpen(true)}>
          <Plus />
          Add New Section
        </Button>
        <AddSectionDialog
          open={addSectionOpen}
          onOpenChange={setAddSectionOpen}
          onAdd={(name) => {
            onAddSection(name);
            toast.success("New section added successfully", { position: "top-right" });
          }}
        />
        <div className="space-y-2" aria-label="Letter sections">
          {letterPanelSections(sections).map((section) => {
            const name = letterPanelSectionName(section.name);
            const selected = selectedSection === section.id;
            return (
              <div
                key={section.id}
                className={cn(ROW, "transition-colors hover:bg-muted", selected && "bg-primary/10 ring-1 ring-primary")}
              >
                <Checkbox
                  aria-label={`Include ${section.name}`}
                  checked={section.enabled !== false}
                  onCheckedChange={(checked) => onToggleSection(section, checked === true)}
                />
                <button
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  onClick={() => onSelectSection(section.id)}
                  className="min-w-0 flex-1 truncate text-left"
                  title={name}
                >
                  {name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    content = (
      <div className="space-y-3">
        <PanelHeading>PAGE SETUP</PanelHeading>
        <p className="text-xs text-foreground">Set the page margins for this letter.</p>
        <div className="space-y-1.5">
          <Label htmlFor="letter-page-margin" className="text-[12.5px] font-medium text-foreground">
            Page margin
          </Label>
          <Select value={margin} onValueChange={(value) => onMarginChange(value as TemplateMargin)}>
            <SelectTrigger
              id="letter-page-margin"
              className="h-9 w-full rounded-[10px] border-[hsl(var(--border))] bg-background px-3 text-[13px] text-foreground"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{LETTER_MARGIN_LABELS.default}</SelectItem>
              <SelectItem value="narrow">{LETTER_MARGIN_LABELS.narrow}</SelectItem>
              <SelectItem value="wide">{LETTER_MARGIN_LABELS.wide}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-foreground">
          Sets the left and right margin. Applies to this letter on screen, in exports and in the copy shared with the
          client.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        style={{ width }}
        aria-label="Letter editor"
        className="relative flex min-h-0 min-w-[360px] shrink-0 border-l border-[hsl(var(--border))] bg-card"
      >
        <div className="flex w-12 shrink-0 flex-col border-r border-[hsl(var(--border))]">
          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col items-center gap-1 py-2">
              {TOOLS.map(({ id, label, icon: Icon }) => (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={active === id ? "default" : "ghost"}
                      size="icon"
                      className={active === id ? undefined : "hover:bg-muted"}
                      onClick={() => onActiveChange(id)}
                      aria-label={label}
                      aria-pressed={active === id}
                    >
                      <Icon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
        </div>
        <ScrollArea className="h-full min-w-0 flex-1">
          <div className="min-w-0 p-3">{content}</div>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}

// ---------- Modals (Option B) ----------
// Every modal in the letter flow uses this shell: the app's Dialog component, max-w-sm,
// centred icon and title, and a black backdrop at 32% (measured from production modals).
const MODAL_CONTENT =
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border border-[hsl(var(--border))] bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg";
const MODAL_ICON = {
  success: { wrap: "bg-green-100 text-green-700", Icon: Rows2 },
  warning: { wrap: "bg-amber-100 text-amber-600", Icon: AlertTriangle },
  danger: { wrap: "bg-red-100 text-red-700", Icon: Trash2 },
} as const;

function LetterModal({
  open,
  onOpenChange,
  tone,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tone: keyof typeof MODAL_ICON;
  title: string;
  children: ReactNode;
}) {
  const { wrap, Icon } = MODAL_ICON[tone];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/[0.32]" />
        <DialogPrimitive.Content aria-describedby={undefined} className={MODAL_CONTENT}>
          <div className="flex flex-col items-center gap-3">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", wrap)}>
              <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
            </div>
            <DialogPrimitive.Title className="text-center text-lg font-semibold leading-none text-foreground">
              {title}
            </DialogPrimitive.Title>
          </div>
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  tone,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tone: "warning" | "danger";
  title: string;
  description: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <LetterModal open={open} onOpenChange={onOpenChange} tone={tone} title={title}>
      <p className="text-center text-[13px] leading-[1.5] text-foreground">{description}</p>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={tone === "danger" ? "destructive" : "default"}
          className="flex-1"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </LetterModal>
  );
}

export function UnsavedChangesDialog({
  open,
  onStay,
  onDontSave,
  onStayAndSave,
}: {
  open: boolean;
  onStay: () => void;
  onDontSave: () => void;
  onStayAndSave: () => void;
}) {
  return (
    <LetterModal
      open={open}
      onOpenChange={(next) => {
        if (!next) onStay();
      }}
      tone="warning"
      title="Unsaved Changes Alert"
    >
      <div className="space-y-2 text-center text-[13px] leading-[1.5] text-foreground">
        <p>You have unsaved changes.</p>
        <p>Would you like to stay and save the changes, or discard the changes without saving?</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onDontSave}>
          Don't Save
        </Button>
        <Button type="button" className="flex-1" onClick={onStayAndSave}>
          Stay and Save
        </Button>
      </div>
    </LetterModal>
  );
}

// Unsaved changes guard: while editing with changes, a click on anything clickable outside the
// editor card (left navigation, template tree, engagement tree, tabs) is held and the Unsaved Changes
// Alert opens. "Don't Save" discards and then repeats the original click. Header controls, dialogs,
// menus and toasts are ignored.
export function useUnsavedNavigationGuard(
  enabled: boolean,
  isDirty: () => boolean,
  allowedRef: RefObject<HTMLElement>,
) {
  const [pendingTarget, setPendingTarget] = useState<HTMLElement | null>(null);
  const bypassRef = useRef(false);
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;
  useEffect(() => {
    if (!enabled) return;
    const findClickable = (start: HTMLElement | null) => {
      for (let el = start; el && el !== document.body; el = el.parentElement) {
        if (
          el.matches(
            'a[href], button, [role="button"], [role="tab"], [role="treeitem"], [role="menuitem"], [role="option"], [role="link"]',
          )
        )
          return el;
        if (window.getComputedStyle(el).cursor === "pointer") return el;
      }
      return null;
    };
    const onClick = (event: MouseEvent) => {
      if (bypassRef.current) return;
      const target = event.target as HTMLElement | null;
      if (!target || allowedRef.current?.contains(target)) return;
      if (
        target.closest(
          'header, [role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper], [data-sonner-toaster]',
        )
      )
        return;
      const clickable = findClickable(target);
      if (!clickable || !isDirtyRef.current()) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setPendingTarget(clickable);
    };
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current()) return;
      event.preventDefault();
      event.returnValue = "";
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [enabled, allowedRef]);
  const clear = useCallback(() => setPendingTarget(null), []);
  const proceed = useCallback(() => {
    const target = pendingTarget;
    setPendingTarget(null);
    if (!target) return;
    setTimeout(() => {
      bypassRef.current = true;
      try {
        target.click();
      } finally {
        bypassRef.current = false;
      }
    }, 0);
  }, [pendingTarget]);
  return { pending: pendingTarget !== null, clear, proceed };
}

// Add New Section: same flow as production (icon, title, Section name, Cancel / Add, close X).
// Uses the app's Dialog component; backdrop is black at 32%, the same as the production modal backdrop.
function AddSectionDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string) => void;
}) {
  const [name, setName] = useState("");
  useEffect(() => {
    if (open) setName("");
  }, [open]);
  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    onOpenChange(false);
  };
  return (
    <LetterModal open={open} onOpenChange={onOpenChange} tone="success" title="Add New Section">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="new-letter-section-name" className="text-[12.5px] font-medium text-foreground">
            Section name
          </Label>
          <Input
            id="new-letter-section-name"
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="For e.g. Firm Details"
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={!name.trim()}>
            Add
          </Button>
        </div>
      </form>
    </LetterModal>
  );
}
