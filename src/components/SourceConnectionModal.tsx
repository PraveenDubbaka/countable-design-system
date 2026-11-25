import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import karbonLogo from "@/assets/karbon-logo.png";
import { accountingProviders } from "@/lib/accountingProviders";
import { connectClientSource, disconnectClientSource, type AccountingProvider } from "@/lib/clientSource";

// Local widening only: Karbon is offered in the Add Client flows, not part of the shared AccountingProvider type.
export type ModalProvider = "karbon" | AccountingProvider;
const KARBON = { name: "Karbon", buttonName: "Karbon", logo: karbonLogo };
const providerInfo = (id: ModalProvider): { name: string; buttonName: string; logo: string } => id === "karbon" ? KARBON : accountingProviders[id];
const DEFAULT_PROVIDERS = Object.keys(accountingProviders) as AccountingProvider[];
interface SourceConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  connectionName?: string;
  engagementId?: string;
  onComplete?: () => void;
  initialStep?: "select" | "connected";
  initialProvider?: AccountingProvider | null;
  /** Called when the connected step is finished (modal closed from it), with the chosen provider. */
  onConnected?: (provider: ModalProvider) => void;
  /** Providers to offer, in order. Omit for the default list (QuickBooks, Xero, Sage). */
  providers?: ModalProvider[];
  /** Default true. When false, skip the connect/disconnect writes (the client doesn't exist yet). */
  persist?: boolean;
}

export function SourceConnectionModal({ open, onOpenChange, clientName, connectionName = clientName, engagementId, onComplete, initialStep, initialProvider, onConnected, persist = true, providers }: SourceConnectionModalProps) {
  const [step, setStep] = useState<"select" | "loading" | "connected">("select");
  const [provider, setProvider] = useState<ModalProvider>("quickbooks");
  const [justDisconnected, setJustDisconnected] = useState(false);
  useEffect(() => {
    if (!open) return;
    setStep(initialStep ?? "select");
    setJustDisconnected(false);
    if (initialProvider) setProvider(initialProvider);
  }, [open, initialStep, initialProvider]);
  useEffect(() => {
    if (!open || step !== "loading") return;
    const timer = window.setTimeout(() => setStep("connected"), 1000);
    return () => window.clearTimeout(timer);
  }, [open, step]);

  const close = (nextOpen: boolean) => {
    if (!nextOpen && step === "connected") {
      if (persist && provider !== "karbon") {
        connectClientSource(connectionName, provider, engagementId);
        // Keep the client-level status consistent when entering from either page.
        connectClientSource(clientName, provider);
        if (connectionName !== clientName) connectClientSource(connectionName, provider);
      }
      onComplete?.();
      onConnected?.(provider);
    }
    onOpenChange(nextOpen);
  };
  const platform = providerInfo(provider);
  const list: ModalProvider[] = providers ?? DEFAULT_PROVIDERS;
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent aria-describedby={undefined} className="max-w-4xl w-[calc(100%-2rem)] min-h-80 p-0 gap-0 rounded-[10px] bg-background">
        <DialogHeader className="px-6 pt-6 pb-5">
          <DialogTitle className="text-xl font-semibold leading-normal tracking-normal">Entity Name: {clientName}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          {step === "select" && <>
            <h3 className="text-sm font-semibold mb-4">Accounting Software:</h3>
            <div className={`grid grid-cols-1 gap-5 ${list.length > 3 ? "sm:grid-cols-4" : "sm:grid-cols-3"} border border-border rounded-[8px] px-5 py-8`}>
              {list.map(id => (
                <Button key={id} variant={id === "quickbooks" ? "accounting" : "outline"} className="h-10 w-full" onClick={() => { setProvider(id); setJustDisconnected(false); setStep("loading"); }}>
                  <img src={providerInfo(id).logo} alt="" className="h-6 w-7 object-contain shrink-0" />
                  Connect to {providerInfo(id).buttonName}
                </Button>
              ))}
            </div>
            {persist && justDisconnected && <div className="mt-5 flex items-start gap-2 rounded-[10px] border border-connection-warning/30 bg-connection-warning-surface p-3 text-connection-warning">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">Please go to Edit Engagement and change the data source for your engagements.</p>
            </div>}
          </>}
          {step === "loading" && <div role="status" className="flex min-h-40 flex-col items-center justify-center gap-4">
            <img src={platform.logo} alt={platform.name} className="h-12 w-20 object-contain" />
            <span className="flex items-center gap-2 text-sm"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" />Connecting to {platform.name}…</span>
          </div>}
          {step === "connected" && <>
            <h3 className="text-sm font-semibold mb-4">Connected to:</h3>
            <div className="flex flex-wrap items-center gap-4 border border-border rounded-[8px] px-5 py-5">
              <img src={platform.logo} alt={platform.name} className="h-8 w-12 object-contain shrink-0" />
              <span className="font-medium text-sm">{platform.name}</span>
              <span className="text-sm break-words">{clientName}</span>
              <Button variant="link" className="ml-auto px-0 h-auto whitespace-normal text-left" onClick={() => {
                if (persist && provider !== "karbon") {
                  disconnectClientSource(connectionName, engagementId);
                  disconnectClientSource(clientName);
                }
                setStep("select");
                setJustDisconnected(true);
                onComplete?.();
              }}>Disconnect from {platform.name}</Button>
            </div>
            {persist && <div className="mt-5 flex items-start gap-2 rounded-[10px] border border-connection-warning/30 bg-connection-warning-surface p-3 text-connection-warning">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">Please go to Edit Engagement and change the data source for your engagements.</p>
            </div>}
          </>}
        </div>
        <DialogFooter className="px-6 pb-6">
          <Button onClick={() => close(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
