import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuditCashWorksheet, AuditCashBankRecWorksheet, AuditCashCountWorksheet } from "@/components/AuditCashWorksheet";
import { AuditARWorksheet, AuditARConfirmationWorksheet } from "@/components/AuditARWorksheet";

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

  return (
    <Layout title="Engagements">
      <div className="flex-1 overflow-auto bg-card">
        {component ?? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Worksheet not yet available.
          </div>
        )}
      </div>
    </Layout>
  );
}
