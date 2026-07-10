import { useState, useEffect, useRef } from "react";
import { FileText, Send, Loader2, CheckCircle2, Globe, Eye, Pencil, ChevronRight } from "lucide-react";
import { PBC_TEMPLATES, type PBCTemplate } from "@/lib/pbcTemplates";
import { savePBCRequest, addPBCNotification } from "@/lib/pbcRequestStore";
import lukaLogo from "@/assets/luka-logo.png";
import { cn } from "@/lib/utils";

type Phase =
  | "greeting"
  | "type-selected"
  | "wp-selected"
  | "generating"
  | "artifact"
  | "sent"
  | "responding"
  | "applied";

interface ChatMsg {
  role: "luka" | "user";
  text: string;
  chips?: string[];
  isArtifact?: boolean;
  isResponses?: boolean;
}

interface PBCRequestFlowProps {
  engagementId: string;
  clientName: string;
  yearEnd: string;
  threadId: string;
  onViewDoc: (content: string, templateLabel: string) => void;
  onSentToPortal: (engagementId: string, threadId: string) => void;
  onApplyResponses: (responses: Array<{ questionId: string; answer: string }>) => void;
}

function LukaBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8649F1] to-[#2355A4] flex items-center justify-center shrink-0 mt-0.5">
        <img src={lukaLogo} alt="Luka" className="w-4 h-4 object-contain invert" />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm">
        {text}
      </div>
    </div>
  );
}

function LukaText({ text }: { text: string }) {
  return (
    <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
      {text}
    </div>
  );
}

function ChipRow({ chips, onSelect }: { chips: string[]; onSelect: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 pl-9">
      {chips.map(c => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
        >
          {c} <ChevronRight className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}

function ArtifactCard({
  template,
  content,
  onView,
  onSend,
  sent,
}: {
  template: PBCTemplate;
  content: string;
  onView: () => void;
  onSend: () => void;
  sent: boolean;
}) {
  const preview = content.split("\n").filter(Boolean).slice(0, 4).join("\n");
  return (
    <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden mt-1">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
        <FileText className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-semibold flex-1 min-w-0 truncate">{template.label}</span>
        <span className="shrink-0 rounded-full bg-primary/10 text-primary text-[10px] px-2 py-0.5 font-medium">
          WP {template.wpRef}
        </span>
      </div>
      <div className="px-4 py-3">
        <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap line-clamp-4 leading-relaxed">
          {preview}
        </pre>
      </div>
      <div className="flex gap-2 px-4 py-3 border-t border-border bg-muted/20">
        <button
          onClick={onView}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" /> View Document
        </button>
        {sent ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Sent to Portal
          </span>
        ) : (
          <button
            onClick={onSend}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold hover:bg-muted transition-colors"
          >
            <Globe className="h-3.5 w-3.5" /> Send to Client Portal
          </button>
        )}
      </div>
    </div>
  );
}

function ResponsesCard({ onAccept }: { onAccept: () => void }) {
  const mockResponses = [
    { q: "Organization chart", a: "Uploaded — Org Chart v3 April 2024.pdf" },
    { q: "Policies & procedures", a: "Uploaded — Financial Policies Manual 2024.pdf" },
    { q: "Management review evidence", a: "Uploaded — Q4 Review Sign-offs.xlsx" },
    { q: "IT access control listing", a: "Uploaded — System Users March 2024.csv" },
  ];
  return (
    <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden mt-1">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-green-50 dark:bg-green-900/20">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
          Client has responded — {mockResponses.length} documents received
        </span>
      </div>
      <div className="divide-y divide-border">
        {mockResponses.map((r, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">{r.q}</p>
              <p className="text-xs text-muted-foreground truncate">{r.a}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border bg-muted/20">
        <button
          onClick={onAccept}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Accept & Fill Worksheets
        </button>
      </div>
    </div>
  );
}

export function PBCRequestFlow({
  engagementId,
  clientName,
  yearEnd,
  threadId,
  onViewDoc,
  onSentToPortal,
  onApplyResponses,
}: PBCRequestFlowProps) {
  const [phase, setPhase] = useState<Phase>("greeting");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [requestType, setRequestType] = useState<"single" | "multi" | null>(null);
  const [wpInput, setWpInput] = useState("");
  const [wpNumbers, setWpNumbers] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PBCTemplate | null>(null);
  const [docContent, setDocContent] = useState("");
  const [sent, setSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const addMsg = (msg: ChatMsg) => setMessages(prev => [...prev, msg]);

  // Greeting on mount
  useEffect(() => {
    const engLabel = clientName && engagementId ? `**${clientName} · ${engagementId}**` : "this engagement";
    const t = setTimeout(() => {
      addMsg({
        role: "luka",
        text: `I'll help you create a PBC request for ${engLabel}.\n\nWould you like a single document request or multiple?`,
        chips: ["Single", "Multiple"],
      });
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChipSelect = (chip: string) => {
    if (phase === "greeting") {
      const type = chip === "Single" ? "single" : "multi";
      setRequestType(type);
      addMsg({ role: "user", text: chip });
      setPhase("type-selected");
      setTimeout(() => {
        addMsg({
          role: "luka",
          text: type === "single"
            ? "Which working paper is this for? Type the form number (e.g. **510**, **540**) or describe it briefly."
            : "Which working papers should this cover? Type the form numbers separated by commas (e.g. **510, 540, 515**).",
        });
      }, 400);
      return;
    }

    if (phase === "wp-selected") {
      // Template selection via chip number
      const idx = parseInt(chip) - 1;
      const template = PBC_TEMPLATES[idx] ?? PBC_TEMPLATES.find(t => chip.includes(t.wpRef));
      if (template) handleTemplateSelect(template, chip);
      return;
    }

    if (phase === "artifact" && chip === "Send to Client Portal") {
      handleSend();
      return;
    }

    if (phase === "responding" && chip === "Accept & Fill Worksheets") {
      handleApply();
      return;
    }
  };

  const handleWPSubmit = () => {
    const raw = wpInput.trim();
    if (!raw) return;
    const wps = raw.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
    setWpNumbers(wps);
    setWpInput("");
    addMsg({ role: "user", text: raw });
    setPhase("wp-selected");

    const templateList = PBC_TEMPLATES.map((t, i) =>
      `**${i + 1}.** ${t.label} (WP ${t.wpRef})`
    ).join("\n");

    setTimeout(() => {
      addMsg({
        role: "luka",
        text: `Here are the available templates${wps.length ? ` for Form **${wps.join(", ")}**` : ""}:\n\n${templateList}\n\nWhich template would you like to use?`,
        chips: PBC_TEMPLATES.map((_, i) => `${i + 1}`),
      });
    }, 400);
  };

  const handleTemplateSelect = (template: PBCTemplate, userLabel: string) => {
    setSelectedTemplate(template);
    addMsg({ role: "user", text: userLabel });
    setPhase("generating");
    addMsg({ role: "luka", text: "Generating your PBC request document…" });

    setTimeout(() => {
      const content = template.generate({
        clientName,
        engagementId,
        yearEnd,
        wpNumbers,
      });
      setDocContent(content);

      // Save draft
      savePBCRequest({
        threadId,
        engagementId,
        createdAt: new Date().toISOString(),
        requestType: requestType ?? "single",
        wpNumbers,
        templateId: template.id,
        documentContent: content,
        status: "draft",
      });

      setMessages(prev => {
        const next = [...prev];
        const lastLuka = [...next].reverse().find(m => m.role === "luka");
        if (lastLuka) lastLuka.text = "Here's your PBC request document:";
        return next;
      });

      addMsg({
        role: "luka",
        text: "",
        isArtifact: true,
      });

      setPhase("artifact");
    }, 1800);
  };

  const handleSend = () => {
    setSent(true);
    savePBCRequest({
      threadId,
      engagementId,
      createdAt: new Date().toISOString(),
      requestType: requestType ?? "single",
      wpNumbers,
      templateId: selectedTemplate?.id ?? "",
      documentContent: docContent,
      sentAt: new Date().toISOString(),
      status: "sent",
    });
    addMsg({ role: "user", text: "Send to Client Portal" });
    setTimeout(() => {
      addMsg({
        role: "luka",
        text: `Sent to the client portal. I'll notify you here when **${clientName || "the client"}** responds.`,
      });
      setPhase("sent");
      onSentToPortal(engagementId, threadId);

      // Simulate client response after 5s
      setTimeout(() => {
        savePBCRequest({
          threadId,
          engagementId,
          createdAt: new Date().toISOString(),
          requestType: requestType ?? "single",
          wpNumbers,
          templateId: selectedTemplate?.id ?? "",
          documentContent: docContent,
          sentAt: new Date().toISOString(),
          status: "responded",
        });
        addMsg({
          role: "luka",
          text: `**${clientName || "The client"}** has submitted responses to your PBC request:`,
          isResponses: true,
        });
        setPhase("responding");
        addPBCNotification(engagementId, threadId);
      }, 5000);
    }, 600);
  };

  const handleApply = () => {
    addMsg({ role: "user", text: "Accept & Fill Worksheets" });
    setPhase("applied");
    setTimeout(() => {
      onApplyResponses([]);
      addMsg({
        role: "luka",
        text: "Done — the client's uploaded documents have been linked to the working papers and responses applied to the relevant worksheets.",
      });
    }, 500);
  };

  const renderMessage = (msg: ChatMsg, i: number) => {
    if (msg.role === "user") return <UserBubble key={i} text={msg.text} />;

    if (msg.isArtifact && selectedTemplate) {
      return (
        <LukaBubble key={i}>
          <ArtifactCard
            template={selectedTemplate}
            content={docContent}
            onView={() => onViewDoc(docContent, selectedTemplate.label)}
            onSend={handleSend}
            sent={sent}
          />
        </LukaBubble>
      );
    }

    if (msg.isResponses) {
      return (
        <LukaBubble key={i}>
          {msg.text && <LukaText text={msg.text} />}
          <ResponsesCard onAccept={handleApply} />
        </LukaBubble>
      );
    }

    const isGenerating = phase === "generating" && msg.text === "Generating your PBC request document…";

    return (
      <LukaBubble key={i}>
        {isGenerating ? (
          <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2 flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Generating your PBC request document…</span>
          </div>
        ) : (
          <LukaText text={msg.text} />
        )}
        {msg.chips && phase !== "artifact" && phase !== "sent" && phase !== "responding" && phase !== "applied" && (
          <ChipRow chips={msg.chips} onSelect={handleChipSelect} />
        )}
      </LukaBubble>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(renderMessage)}
        <div ref={bottomRef} />
      </div>

      {/* Input area — only shown during wp-selected phase */}
      {phase === "type-selected" && (
        <div className="border-t border-border px-4 py-3 flex gap-2">
          <input
            autoFocus
            value={wpInput}
            onChange={e => setWpInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleWPSubmit()}
            placeholder="Type form number(s), e.g. 510, 540…"
            className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleWPSubmit}
            disabled={!wpInput.trim()}
            className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sent confirmation bar */}
      {phase === "applied" && (
        <div className="border-t border-border px-4 py-3 flex items-center gap-2 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
          <span className="text-sm text-green-700 dark:text-green-400 font-medium">
            Responses applied to worksheets
          </span>
        </div>
      )}
    </div>
  );
}
