import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Send, Loader2, CheckCircle2, Globe, Eye, Circle, ChevronDown } from "lucide-react";
import { PBC_TEMPLATES, type PBCTemplate } from "@/lib/pbcTemplates";
import { savePBCRequest, addPBCNotification } from "@/lib/pbcRequestStore";
import lukaResponding from "@/assets/luka-responding.gif";
import lukaIdle from "@/assets/luka-idle.gif";
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseMarkdown(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

const STEP_INTERVAL = 900; // matches EngagementAutomationView

// ── Sub-components ────────────────────────────────────────────────────────────

function LukaAvatar({ done }: { done?: boolean }) {
  return (
    <div className="shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center">
      <img
        src={done ? lukaIdle : lukaResponding}
        alt="Luka"
        className="w-11 h-11 object-contain -m-1.5 transition-transform duration-200 hover:scale-110"
      />
    </div>
  );
}

function LukaBubble({ children, done }: { children: React.ReactNode; done?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <LukaAvatar done={done} />
      <div className="min-w-0 flex-1">{children}</div>
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
    <p
      className="text-[15px] leading-relaxed whitespace-pre-wrap"
      style={{ color: "hsl(222 35% 16%)", fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {parseMarkdown(text)}
    </p>
  );
}

function ChipRow({ chips, onSelect }: { chips: string[]; onSelect: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chips.map(c => (
        <button key={c} onClick={() => onSelect(c)} className="luka-prompt-chip">
          {c}
        </button>
      ))}
    </div>
  );
}

function GeneratingSteps({ wpNumbers }: { wpNumbers: string[] }) {
  const [visible, setVisible] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const delays = [400, 400 + STEP_INTERVAL, 400 + STEP_INTERVAL * 2, 400 + STEP_INTERVAL * 3];
    const timers = delays.map((delay, i) => setTimeout(() => setVisible(i + 1), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  const steps = [
    `Reading working paper references${wpNumbers.length ? ` for form ${wpNumbers.join(", ")}` : ""}`,
    "Selecting appropriate template",
    "Generating document structure and content",
    "Finalising your PBC request",
  ];

  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center">
        <img src={lukaResponding} alt="Luka" className="w-11 h-11 object-contain -m-1.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[15px] leading-relaxed"
          style={{ color: "hsl(222 35% 16%)", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Generating your PBC request document
        </p>

        {/* italic status + pulsing dots — matches EngagementAutomationView */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[14px] font-semibold italic" style={{ color: "hsl(222 30% 22%)" }}>
            Preparing your document
          </span>
          <span className="flex items-center gap-1">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "hsl(265 75% 60%)" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
              />
            ))}
          </span>
        </div>

        {/* step rows with chevron + framer-motion reveal */}
        <div className="mt-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              style={{ borderTop: "1px solid hsl(220 20% 92%)" }}
              initial={{ opacity: 0, y: 6 }}
              animate={visible > i ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <button
                className="w-full flex items-center gap-3 py-3 text-left"
                onClick={() => visible > i && setExpanded(expanded === i ? null : i)}
                disabled={visible <= i}
                style={{ cursor: visible > i ? "pointer" : "default" }}
              >
                <span className="shrink-0 inline-flex" style={{ color: "hsl(222 15% 50%)" }}>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: expanded === i ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </span>
                <span
                  className="flex-1 text-[14px]"
                  style={{ color: "hsl(222 25% 30%)", fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  {s}
                </span>
                {visible > i + 1 ? (
                  <CheckCircle2 size={16} className="shrink-0" style={{ color: "hsl(145 63% 42%)" }} />
                ) : visible === i + 1 ? (
                  <Loader2 size={16} className="animate-spin text-primary shrink-0" />
                ) : (
                  <Circle size={16} className="shrink-0" style={{ color: "hsl(220 15% 75%)" }} />
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
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
  const preview = content.split("\n")
    .filter(Boolean)
    .filter(l => !/^---+$/.test(l) && !l.startsWith("|"))
    .map(l => l.replace(/^#+\s+/, "").replace(/\*\*/g, "").trim())
    .filter(Boolean)
    .slice(0, 3)
    .join("  ·  ");
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
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          {preview}
        </p>
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

// ── Main component ────────────────────────────────────────────────────────────

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
  }, [messages, phase]);

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

    // 400ms initial + 3 × 900ms steps = 3100ms total
    setTimeout(() => {
      const content = template.generate({ clientName, engagementId, yearEnd, wpNumbers });
      setDocContent(content);

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

      addMsg({ role: "luka", text: "Here's your PBC request document:" });
      addMsg({ role: "luka", text: "", isArtifact: true });
      setPhase("artifact");
    }, 3100);
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

  const isDone = phase === "artifact" || phase === "sent" || phase === "responding" || phase === "applied";

  const renderMessage = (msg: ChatMsg, i: number) => {
    if (msg.role === "user") return <UserBubble key={i} text={msg.text} />;

    if (msg.isArtifact && selectedTemplate) {
      return (
        <LukaBubble key={i} done={isDone}>
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
        <LukaBubble key={i} done={isDone}>
          {msg.text && <LukaText text={msg.text} />}
          <ResponsesCard onAccept={handleApply} />
        </LukaBubble>
      );
    }

    return (
      <LukaBubble key={i} done={isDone}>
        <LukaText text={msg.text} />
        {msg.chips && phase !== "artifact" && phase !== "sent" && phase !== "responding" && phase !== "applied" && (
          <ChipRow chips={msg.chips} onSelect={handleChipSelect} />
        )}
      </LukaBubble>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(renderMessage)}
        {phase === "generating" && (
          <GeneratingSteps wpNumbers={wpNumbers} />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area — only shown during type-selected phase */}
      {phase === "type-selected" && (
        <div className="px-4 pb-4 pt-2">
          <div className="luka-input-wrapper">
            <input
              autoFocus
              value={wpInput}
              onChange={e => setWpInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleWPSubmit()}
              placeholder="Type form number(s), e.g. 510, 540…"
              className="luka-input"
            />
            <div className="flex items-center justify-end mt-2">
              <button
                onClick={handleWPSubmit}
                disabled={!wpInput.trim()}
                className={cn("luka-send-btn", wpInput.trim() && "enabled")}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applied confirmation bar */}
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
