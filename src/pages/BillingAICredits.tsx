import React, { useMemo, useState } from "react";
import { Search, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { StyledCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Placeholder tax rate (13% HST) until currency and tax policy are confirmed.
const TAX_RATE = 0.13;

// All money is handled in cents to avoid floating point drift.
const AUTOPILOT_PRICE = 6900;
const COUPON_CODE = "LUKA49";
const COUPON_DISCOUNT = 2000; // per autopilot ($49 instead of $69)

// Credit packages (price in cents). Saving text is informational only.
const PACKAGES = [
  { qty: 100, price: 12900, saving: "" },
  { qty: 250, price: 29900, saving: "Save 7%" },
  { qty: 500, price: 54900, saving: "Save 15%" },
  { qty: 1000, price: 99900, saving: "Save 23%" },
  { qty: 2500, price: 225000, saving: "Save 30%" },
] as const;

// PLACEHOLDER: per-credit price for a custom quantity (QA shows no custom pricing).
// $1.29/credit = the 100-credit package rate. To be confirmed with the team.
const CUSTOM_CREDIT_RATE = 129; // cents per credit

// Cost in cents of an arbitrary number of credits (exact package price when it matches one).
const creditsCost = (qty: number) => PACKAGES.find((p) => p.qty === qty)?.price ?? qty * CUSTOM_CREDIT_RATE;

const fmt = (cents: number) => {
  const s = `$${(Math.abs(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return cents < 0 ? `−${s}` : s;
};

const TABS = ["Plan Details", "AI Credits & Usage", "Receipts", "Payment Methods"];

type RefillKind = "credits" | "autopilots";
type RefillValues = { threshold: string; amount: string; cap: string };

const REFILL_CONFIG = {
  credits: {
    title: "Auto-refill thread credits",
    noun: "credits",
    defaults: { threshold: "20", amount: "250", cap: "500" },
    unitCost: (n: number) => creditsCost(n),
  },
  autopilots: {
    title: "Auto-refill workspace autopilots",
    noun: "autopilots",
    defaults: { threshold: "1", amount: "3", cap: "500" },
    unitCost: (n: number) => n * AUTOPILOT_PRICE,
  },
} as const;

const isWhole = (v: string) => /^\d+$/.test(v.trim()) && parseInt(v, 10) >= 1;

function AutoRefillDialog({
  kind,
  initial,
  onClose,
  onSave,
}: {
  kind: RefillKind | null;
  initial: Record<RefillKind, RefillValues>;
  onClose: () => void;
  onSave: (kind: RefillKind, values: RefillValues) => void;
}) {
  return (
    <Dialog open={kind !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        {kind && <AutoRefillForm key={kind} kind={kind} initial={initial[kind]} onClose={onClose} onSave={onSave} />}
      </DialogContent>
    </Dialog>
  );
}

function AutoRefillForm({
  kind,
  initial,
  onClose,
  onSave,
}: {
  kind: RefillKind;
  initial: RefillValues;
  onClose: () => void;
  onSave: (kind: RefillKind, values: RefillValues) => void;
}) {
  const cfg = REFILL_CONFIG[kind];
  const [threshold, setThreshold] = useState<string>(initial.threshold);
  const [amount, setAmount] = useState<string>(initial.amount);
  const [cap, setCap] = useState<string>(initial.cap);
  const [submitted, setSubmitted] = useState(false);

  const thresholdErr = !isWhole(threshold) ? "Enter a whole number of 1 or more." : null;
  const amountErr = !isWhole(amount) ? "Enter a whole number of 1 or more." : null;
  const refillCost = isWhole(amount) ? cfg.unitCost(parseInt(amount, 10)) : 0;
  const capNum = Number(cap);
  const capErr =
    cap.trim() === "" || !Number.isFinite(capNum) || capNum <= 0
      ? "Enter a cap greater than 0."
      : refillCost > 0 && capNum * 100 < refillCost
        ? `Cap must cover at least one refill (${fmt(refillCost)}).`
        : null;

  const handleSave = () => {
    setSubmitted(true);
    if (thresholdErr || amountErr || capErr) return;
    onSave(kind, { threshold, amount, cap });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-[18px] font-semibold">{cfg.title}</DialogTitle>
        <DialogDescription className="sr-only">Set when and how much to refill automatically.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${kind}-threshold`} className="text-sm">When balance is below</Label>
          <Input id={`${kind}-threshold`} inputMode="numeric" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
          {submitted && thresholdErr && <p className="text-[13px] text-destructive">{thresholdErr}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${kind}-amount`} className="text-sm">Add this many {cfg.noun}</Label>
          <Input id={`${kind}-amount`} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {submitted && amountErr && <p className="text-[13px] text-destructive">{amountErr}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${kind}-cap`} className="text-sm">Monthly auto-refill cap ($)</Label>
          <Input id={`${kind}-cap`} inputMode="decimal" value={cap} onChange={(e) => setCap(e.target.value)} />
          {submitted && capErr && <p className="text-[13px] text-destructive">{capErr}</p>}
        </div>
        <p className="text-[13px] text-muted-foreground">Charged to Visa •••• 4242</p>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Turn on auto-refill</Button>
      </DialogFooter>
    </>
  );
}

// Dialog fields are a placeholder until the QA popup states are shared.
function EditLimitsDialog({
  member,
  onClose,
  onSave,
}: {
  member: (typeof TEAM)[number] | null;
  onClose: () => void;
  onSave: (id: string, creditsLimit: number | null, runsLimit: number | null) => void;
}) {
  return (
    <Dialog open={member !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        {member && <EditLimitsForm key={member.id} member={member} onClose={onClose} onSave={onSave} />}
      </DialogContent>
    </Dialog>
  );
}

const limitErr = (v: string) => (v.trim() === "" || /^\d+$/.test(v.trim()) ? null : "Enter a whole number of 0 or more, or leave empty for no limit.");

function EditLimitsForm({
  member,
  onClose,
  onSave,
}: {
  member: (typeof TEAM)[number];
  onClose: () => void;
  onSave: (id: string, creditsLimit: number | null, runsLimit: number | null) => void;
}) {
  const [credits, setCredits] = useState(member.creditsLimit === null ? "" : String(member.creditsLimit));
  const [runs, setRuns] = useState(member.runsLimit === null ? "" : String(member.runsLimit));
  const [submitted, setSubmitted] = useState(false);
  const cErr = limitErr(credits);
  const rErr = limitErr(runs);
  const save = () => {
    setSubmitted(true);
    if (cErr || rErr) return;
    onSave(member.id, credits.trim() === "" ? null : parseInt(credits, 10), runs.trim() === "" ? null : parseInt(runs, 10));
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-[18px] font-semibold">Edit member limits</DialogTitle>
        <DialogDescription className="sr-only">Set monthly limits for this team member.</DialogDescription>
      </DialogHeader>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs font-semibold">{member.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[16px] font-semibold">{member.name}</p>
          <p className="text-[13px] text-muted-foreground">{member.sub}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="limit-credits" className="text-[14px]">Thread credits per month</Label>
          <Input id="limit-credits" inputMode="numeric" placeholder="No limit" value={credits} onChange={(e) => setCredits(e.target.value)} />
          {submitted && cErr && <p className="text-[13px] text-destructive">{cErr}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="limit-runs" className="text-[14px]">Workspace autopilots per month</Label>
          <Input id="limit-runs" inputMode="numeric" placeholder="No limit" value={runs} onChange={(e) => setRuns(e.target.value)} />
          {submitted && rErr && <p className="text-[13px] text-destructive">{rErr}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={save}>Save changes</Button>
      </DialogFooter>
    </>
  );
}

function CardFooter({ checked, onChange, onManage }: { checked: boolean; onChange: (v: boolean) => void; onManage: () => void }) {
  return (
    <div className="flex min-h-[52px] items-center justify-between border-t border-border bg-muted px-5 py-2.5">
      <span className="text-sm">Auto-refill</span>
      <div className="flex items-center gap-3">
        {checked && <Button variant="link" size="sm" className="text-[14px]" onClick={onManage}>Manage</Button>}
        <Switch checked={checked} onCheckedChange={onChange} aria-label="Auto-refill" />
      </div>
    </div>
  );
}

// Usage values come from QA2. 'No limit' wording under review (Atin: "I don't think we want to call it no limit or something").
const TEAM = [
  { id: "as", name: "Anushka Sharma", sub: "ms", initials: "AS", threads: false, workspaces: false, locked: false, creditsUsed: 0, runsUsed: 0, creditsLimit: null, runsLimit: null },
  { id: "kk", name: "Kkr Kolkata", sub: "kkr", initials: "KK", threads: true, workspaces: true, locked: true, creditsUsed: 2, runsUsed: 1, creditsLimit: null, runsLimit: null },
];

export default function BillingAICredits() {
  // Balances
  const [credits, setCredits] = useState(746);
  const [autopilots, setAutopilots] = useState(3);
  const creditsUsed = 2;
  const autopilotsUsed = 1;

  // Auto-refill
  const [creditRefill, setCreditRefill] = useState(true);
  const [autopilotRefill, setAutopilotRefill] = useState(false);
  const [refillDialog, setRefillDialog] = useState<RefillKind | null>(null);

  // Cart
  const [pack, setPack] = useState<number | "custom" | null>(null);
  const [customQty, setCustomQty] = useState(0);
  const [refillValues, setRefillValues] = useState<Record<RefillKind, RefillValues>>({
    credits: REFILL_CONFIG.credits.defaults,
    autopilots: REFILL_CONFIG.autopilots.defaults,
  });
  const [qty, setQty] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paidMessage, setPaidMessage] = useState<string | null>(null);

  // Team
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState(TEAM);
  const [editing, setEditing] = useState<(typeof TEAM)[number] | null>(null);

  const changeCart = () => setPaidMessage(null);

  const selectPack = (p: number | "custom") => {
    changeCart();
    if (p === "custom" && pack !== "custom" && customQty === 0) setCustomQty(100); // QA shows 100 pre-filled
    setPack((cur) => (cur === p ? null : p));
  };
  const changeCustomQty = (n: number) => {
    changeCart();
    setCustomQty(Math.max(0, n));
  };
  const changeQty = (n: number) => {
    changeCart();
    setQty(Math.max(0, n));
  };
  const applyCoupon = () => {
    changeCart();
    if (couponInput.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true);
      setCouponError(null);
    } else {
      setCouponError("This coupon is not valid.");
    }
  };
  const removeCoupon = () => {
    changeCart();
    setCouponApplied(false);
    setCouponError(null);
    setCouponInput("");
  };

  const creditQty = pack === "custom" ? customQty : (pack ?? 0);
  const totals = useMemo(() => {
    const creditsTotal = creditsCost(creditQty);
    const creditRateCents = creditQty > 0 ? creditsTotal / creditQty : 0;
    const apTotal = qty * AUTOPILOT_PRICE;
    const discount = couponApplied && qty > 0 ? qty * COUPON_DISCOUNT : 0;
    const subtotal = creditsTotal + apTotal - discount;
    const tax = Math.round(subtotal * TAX_RATE);
    return { creditsTotal, creditRateCents, apTotal, discount, subtotal, tax, total: subtotal + tax };
  }, [creditQty, qty, couponApplied]);

  const cartEmpty = creditQty === 0 && qty === 0;

  const handlePay = () => {
    const parts: string[] = [];
    if (creditQty > 0) parts.push(`${creditQty.toLocaleString("en-US")} thread credits`);
    if (qty > 0) parts.push(`${qty} workspace autopilot${qty === 1 ? "" : "s"}`);
    if (creditQty > 0) setCredits((c) => c + creditQty);
    if (qty > 0) setAutopilots((a) => a + qty);
    setPack(null);
    setCustomQty(0);
    setQty(0);
    setCouponApplied(false);
    setCouponError(null);
    setCouponInput("");
    setPaidMessage(`Payment complete. ${parts.join(" + ")} added to your firm.`);
    toast.success("Payment complete");
  };

  const handleRefillToggle = (kind: RefillKind, on: boolean) => {
    if (on) {
      setRefillDialog(kind);
      return;
    }
    if (kind === "credits") setCreditRefill(false);
    else setAutopilotRefill(false);
    toast.success("Auto-refill turned off");
  };

  const handleRefillSave = (kind: RefillKind, values: RefillValues) => {
    setRefillValues((v) => ({ ...v, [kind]: values }));
    if (kind === "credits") setCreditRefill(true);
    else setAutopilotRefill(true);
    setRefillDialog(null);
    toast.success("Auto-refill turned on");
  };

  const couponMessage = couponError
    ? { text: couponError, destructive: true }
    : couponApplied
      ? { text: qty === 0 ? `${COUPON_CODE} applies to workspace autopilots only.` : `${COUPON_CODE} applied`, destructive: false }
      : null;

  const filteredTeam = team.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <Layout title="Billing">
      <div className="flex flex-col gap-5 p-6 text-[14px]">
        {/* Tab pills (static) */}
        <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1 self-start">
          {TABS.map((t) => {
            const active = t === "AI Credits & Usage";
            return (
              <button
                key={t}
                type="button"
                className={`flex items-center gap-1.5 px-4 py-1.5 text-[14px] font-semibold transition-colors rounded-sm ${
                  active ? "bg-[#1C63A6] text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {active && <Sparkles className="h-4 w-4" />}
                {t}
              </button>
            );
          })}
        </div>

        {/* Heading row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-semibold">Luka credits &amp; usage</h1>
            <p className="text-[16px] text-muted-foreground mt-1">One firm. Two ways to work. You're in control.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">View activity</Button>
            <Button variant="secondary" className="text-destructive">Deactivate</Button>
          </div>
        </div>

        {/* Welcome banner */}
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted px-4 py-3">
          <Sparkles className="h-5 w-5 text-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-[14px] font-semibold">Your firm starts with 100 thread credits and 3 workspace autopilots, on us.</p>
            <p className="text-[14px] text-muted-foreground">A one-time welcome allowance, shared by your team.</p>
          </div>
          <Badge variant="success" className="border-transparent">Welcome allowance added</Badge>
        </div>

        {/* Buy additional usage */}
        <div>
          <h2 className="text-[16px] font-semibold">Buy additional usage</h2>
          <p className="text-[14px] text-muted-foreground">One-time purchase · Auto-refill is managed separately</p>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 -mt-2">
          <StyledCard className="overflow-hidden flex flex-col">
            <div className="px-5 pt-4 pb-5 flex-1 flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-semibold">Thread credits</h3>
                  <Badge variant="secondary" className="border-foreground/70 text-foreground">Pay as you go</Badge>
                </div>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-[40px] font-bold leading-none tracking-[-1px]">{credits.toLocaleString("en-US")}</span>
                  <span className="text-[16px] text-muted-foreground">credits available</span>
                </p>
                <p className="text-[13px] text-muted-foreground mt-2">Shared firm balance · {creditsUsed} credits used this month</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-semibold">Add thread credits</p>
                <div className="flex flex-wrap gap-2">
                  {PACKAGES.map((pkg) => {
                    const selected = pack === pkg.qty;
                    return (
                      <button
                        key={pkg.qty}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => selectPack(pkg.qty)}
                        className={cn(
                          "inline-flex h-9 items-center gap-2 rounded-full border pl-3 transition-colors",
                          pkg.saving ? "pr-1.5" : "pr-3",
                          selected ? "border-[#1C63A6] bg-[#e1eefa]" : "border-border bg-background hover:bg-muted"
                        )}
                      >
                        {selected && <Check className="h-3.5 w-3.5 text-[#1C63A6]" />}
                        <span className={cn("text-[14px] font-bold", selected ? "text-[#074075]" : "text-foreground")}>
                          {pkg.qty.toLocaleString()}
                        </span>
                        <span className="text-[13px] font-medium text-muted-foreground">{fmt(pkg.price)}</span>
                        {pkg.saving && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-bold",
                              selected ? "bg-white text-[#074075]" : "bg-muted text-foreground/70"
                            )}
                          >
                            {pkg.saving}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-pressed={pack === "custom"}
                    onClick={() => selectPack("custom")}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-full border pl-3 pr-3 transition-colors",
                      pack === "custom" ? "border-[#1C63A6] bg-[#e1eefa]" : "border-border bg-background hover:bg-muted"
                    )}
                  >
                    {pack === "custom" && <Check className="h-3.5 w-3.5 text-[#1C63A6]" />}
                    <span className={cn("text-[14px] font-bold", pack === "custom" ? "text-[#074075]" : "text-foreground")}>
                      Custom
                    </span>
                  </button>
                </div>
                {pack === "custom" && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="custom-credits" className="text-[14px] font-semibold">Number of credits</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="custom-credits"
                        type="number"
                        min={1}
                        className="w-40"
                        value={customQty === 0 ? "" : customQty}
                        onChange={(e) => changeCustomQty(Math.floor(Number(e.target.value)) || 0)}
                      />
                      <span className="text-[14px] text-muted-foreground">credits</span>
                    </div>
                  </div>
                )}
                <p className="text-[13px] text-muted-foreground">Larger packages cost less per credit.</p>
              </div>
            </div>
            <CardFooter
              checked={creditRefill}
              onChange={(v) => handleRefillToggle("credits", v)}
              onManage={() => setRefillDialog("credits")}
            />
          </StyledCard>

          <StyledCard className="overflow-hidden flex flex-col">
            <div className="px-5 pt-4 pb-5 flex-1 flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-semibold">Workspace autopilots</h3>
                  <Badge variant="review" className="border-violet-500 text-violet-700">Autopilot · Beta</Badge>
                </div>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-[40px] font-bold leading-none tracking-[-1px]">{autopilots.toLocaleString("en-US")}</span>
                  <span className="text-[16px] text-muted-foreground">autopilots available</span>
                </p>
                <p className="text-[13px] text-muted-foreground mt-2">{autopilotsUsed} used this month</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-semibold">Add workspace autopilots</p>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="icon" aria-label="Decrease autopilots" disabled={qty === 0} onClick={() => changeQty(qty - 1)}>
                    <span aria-hidden className="text-base leading-none">−</span>
                  </Button>
                  <Input
                    aria-label="Autopilot quantity"
                    inputMode="numeric"
                    className="w-20 text-center"
                    value={qty}
                    onChange={(e) => changeQty(parseInt(e.target.value.replace(/\D/g, "") || "0", 10))}
                  />
                  <Button variant="secondary" size="icon" aria-label="Increase autopilots" onClick={() => changeQty(qty + 1)}>
                    <span aria-hidden className="text-base leading-none">+</span>
                  </Button>
                </div>
                <p className="text-[13px] text-muted-foreground">
                  {fmt(AUTOPILOT_PRICE)} / workspace autopilot · Apply your coupon below for {fmt(AUTOPILOT_PRICE - COUPON_DISCOUNT).replace(".00", "")} / autopilot.
                </p>
              </div>
            </div>
            <CardFooter
              checked={autopilotRefill}
              onChange={(v) => handleRefillToggle("autopilots", v)}
              onManage={() => setRefillDialog("autopilots")}
            />
          </StyledCard>
        </div>

        {/* On-page checkout */}
        <StyledCard className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Payment */}
            <div className="px-5 pt-4 pb-5 flex flex-col gap-5">
              <h3 className="text-[18px] font-semibold">Complete your purchase</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-12 items-center justify-center rounded border border-border bg-background">
                  <span className="text-[11px] font-bold italic text-[#1A1F71]">VISA</span>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium">Visa •••• 4242</p>
                  <p className="text-[13px] text-muted-foreground">kkr · Billing profile prefilled</p>
                </div>
                <Button variant="link" size="sm">View</Button>
              </div>
              <form
                className="flex flex-col gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (couponInput.trim()) applyCoupon();
                }}
              >
                <Label htmlFor="coupon" className="text-[14px] font-semibold">Coupon code</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="coupon"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError(null);
                    }}
                  />
                  <Button type="submit" variant="secondary" disabled={!couponInput.trim()}>Apply code</Button>
                  {couponApplied && (
                    <Button type="button" variant="link" size="sm" onClick={removeCoupon}>Remove</Button>
                  )}
                </div>
                {couponMessage && (
                  <p className={`text-[13px] ${couponMessage.destructive ? "text-destructive" : "text-muted-foreground"}`}>
                    {couponMessage.text}
                  </p>
                )}
              </form>
            </div>

            {/* Order summary */}
            <div className="px-5 pt-4 pb-5 flex flex-col gap-3 bg-muted border-t lg:border-t-0 lg:border-l border-border">
              <h3 className="text-[15px] font-semibold">Order summary</h3>
              <SummaryLine
                label="Thread credits"
                sub={creditQty > 0 ? `${creditQty.toLocaleString("en-US")} × ${fmt(totals.creditRateCents)}` : undefined}
                amount={fmt(totals.creditsTotal)}
              />
              <SummaryLine
                label="Workspace autopilots"
                sub={qty > 0 ? `${qty} × ${fmt(AUTOPILOT_PRICE)}` : undefined}
                amount={fmt(totals.apTotal)}
              />
              {couponApplied && qty > 0 && (
                <SummaryLine label={`Coupon ${COUPON_CODE}`} sub={`${qty} × ${fmt(-COUPON_DISCOUNT)}`} amount={fmt(-totals.discount)} />
              )}
              <div className="border-t border-border" />
              <SummaryLine label="Subtotal" amount={fmt(totals.subtotal)} />
              <SummaryLine label="Tax (13% HST)" amount={fmt(totals.tax)} />
              <div className="border-t border-border" />
              <div className="flex items-center justify-between text-[18px] font-bold">
                <span>Total</span>
                <span>{fmt(totals.total)}</span>
              </div>
              <Button className="w-full" disabled={cartEmpty} onClick={handlePay}>
                {cartEmpty ? "Select usage to pay" : `Pay ${fmt(totals.total)}`}
              </Button>
            </div>
          </div>
          {paidMessage && (
            <div className="flex items-center gap-2 border-t border-border bg-muted px-5 py-3 text-[14px]">
              <Check className="h-4 w-4 shrink-0" />
              <span>{paidMessage}</span>
            </div>
          )}
        </StyledCard>

        {/* Team access */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-semibold">Team access</h3>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search team members"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <StyledCard className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left px-6 py-4 text-[15px] font-semibold text-foreground">Team member</th>
                  <th className="text-left px-6 py-4 text-[15px] font-semibold text-foreground">Threads</th>
                  <th className="text-left px-6 py-4 text-[15px] font-semibold text-foreground">Credits used / limit</th>
                  <th className="text-left px-6 py-4 text-[15px] font-semibold text-foreground">Workspaces</th>
                  <th className="text-left px-6 py-4 text-[15px] font-semibold text-foreground">Runs used / limit</th>
                  <th className="px-6 py-4"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredTeam.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[14px] text-muted-foreground">No team members found.</td>
                  </tr>
                ) : (
                  filteredTeam.map((m) => (
                    <tr key={m.id} className="border-b border-border last:border-b-0">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs font-semibold">{m.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[16px] font-semibold">{m.name}</p>
                            <p className="text-[13px] text-muted-foreground">{m.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <Switch
                          className="disabled:data-[state=checked]:bg-primary/30"
                          checked={m.threads}
                          disabled={m.locked}
                          aria-label={`Threads access for ${m.name}`}
                          onCheckedChange={(v) => setTeam((t) => t.map((x) => (x.id === m.id ? { ...x, threads: v } : x)))}
                        />
                      </td>
                      <td className="px-6 py-3 text-[14px]">
                        {m.creditsUsed} <span className="text-muted-foreground">/ {m.creditsLimit ?? "No limit"}</span>
                      </td>
                      <td className="px-6 py-3">
                        <Switch
                          className="disabled:data-[state=checked]:bg-primary/30"
                          checked={m.workspaces}
                          disabled={m.locked}
                          aria-label={`Workspaces access for ${m.name}`}
                          onCheckedChange={(v) => setTeam((t) => t.map((x) => (x.id === m.id ? { ...x, workspaces: v } : x)))}
                        />
                      </td>
                      <td className="px-6 py-3 text-[14px]">
                        {m.runsUsed} <span className="text-muted-foreground">/ {m.runsLimit ?? "No limit"}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button variant="link" size="sm" className="text-[14px]" disabled={m.locked} onClick={() => setEditing(m)}>
                          Edit limits
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </StyledCard>
        </div>
      </div>

      <EditLimitsDialog
        member={editing}
        onClose={() => setEditing(null)}
        onSave={(id, creditsLimit, runsLimit) => {
          setTeam((t) => t.map((x) => (x.id === id ? { ...x, creditsLimit, runsLimit } : x)));
          setEditing(null);
          toast.success("Member limits updated");
        }}
      />
      <AutoRefillDialog kind={refillDialog} initial={refillValues} onClose={() => setRefillDialog(null)} onSave={handleRefillSave} />
    </Layout>
  );
}

function SummaryLine({ label, sub, amount }: { label: string; sub?: string; amount: string }) {
  return (
    <div className="flex items-start justify-between text-[14px]">
      <div>
        <p>{label}</p>
        {sub && <p className="text-[13px] text-muted-foreground">{sub}</p>}
      </div>
      <span>{amount}</span>
    </div>
  );
}
