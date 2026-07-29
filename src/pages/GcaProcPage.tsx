import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuditCashWorksheet, AuditCashBankRecWorksheet, AuditCashCountWorksheet } from "@/components/AuditCashWorksheet";
import { AuditARWorksheet, AuditARConfirmationWorksheet } from "@/components/AuditARWorksheet";

const WORKSHEET_TITLES: Record<string, string> = {
  "gca-ws-proc-cash":       "A Cash > Audit Procedures",
  "gca-ws-proc-cash-bank":  "A Cash > Bank Reconciliation",
  "gca-ws-proc-cash-count": "A Cash > Cash Count",
  "gca-ws-proc-ar":         "B Accounts Receivable > Audit Procedures",
  "gca-ws-proc-ar-conf":    "B Accounts Receivable > Confirmation Procedures",
};

function getWorksheetComponent(id: string): React.ReactNode | null {
  switch (id) {
    case "gca-ws-proc-cash":       return <AuditCashWorksheet />;
    case "gca-ws-proc-cash-bank":  return <AuditCashBankRecWorksheet />;
    case "gca-ws-proc-cash-count": return <AuditCashCountWorksheet />;
    case "gca-ws-proc-ar":         return <AuditARWorksheet />;
    case "gca-ws-proc-ar-conf":    return <AuditARConfirmationWorksheet />;
    default:                        return null;
  }
}

export function GcaProcPage() {
  const { worksheetId } = useParams<{ worksheetId: string }>();
  const component = worksheetId ? getWorksheetComponent(worksheetId) : null;
  const title = worksheetId ? WORKSHEET_TITLES[worksheetId] : undefined;

  return (
    <Layout title="Engagements">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {title && (
          <div className="sticky top-0 z-10 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
            <div className="flex items-center px-4 py-1.5">
              <h1 className="font-semibold text-foreground truncate text-lg">{title}</h1>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto bg-card">
          {component ?? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Worksheet not yet available.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
