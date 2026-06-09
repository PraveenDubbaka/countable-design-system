import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AuditMgmtRequestsWorksheetProps {
  isUS?: boolean;
}

interface RequestRow {
  id: string;
  description: string;
  com: 'V' | 'L' | 'Em' | '';
  personResponsible: string;
  requestDate: string;
  followUpDate: string;
  dateReceived: string;
  wpRef: string;
}

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const makeRow = (id: string, overrides: Partial<RequestRow> = {}): RequestRow => ({
  id, description: '', com: '', personResponsible: '', requestDate: todayStr(),
  followUpDate: '', dateReceived: '', wpRef: '', ...overrides
});

const MOCK_CA: RequestRow[] = [
  makeRow('r1', { description: 'Trial balance as at March 31, 2024 (with comparative)', com: 'Em', personResponsible: 'M. Singh (Controller)', requestDate: '2024-04-08', followUpDate: '2024-04-12', dateReceived: '2024-04-11', wpRef: 'TB-01' }),
  makeRow('r2', { description: 'Aged accounts receivable listing as at March 31, 2024', com: 'Em', personResponsible: 'M. Singh (Controller)', requestDate: '2024-04-08', followUpDate: '2024-04-12', dateReceived: '2024-04-15', wpRef: 'AR-01' }),
  makeRow('r3', { description: 'Share register and minute book — updated to March 31, 2024', com: 'L', personResponsible: 'R. Patel (CFO)', requestDate: '2024-04-08', followUpDate: '2024-04-22', dateReceived: '', wpRef: 'EQ-01' }),
];

const MOCK_US: RequestRow[] = [
  makeRow('r1', { description: 'Trial balance as at December 31, 2024 (with comparative)', com: 'Em', personResponsible: 'K. Park (Controller)', requestDate: '2025-01-06', followUpDate: '2025-01-10', dateReceived: '2025-01-09', wpRef: 'TB-01' }),
  makeRow('r2', { description: 'Aged accounts receivable listing as at December 31, 2024', com: 'Em', personResponsible: 'K. Park (Controller)', requestDate: '2025-01-06', followUpDate: '2025-01-10', dateReceived: '2025-01-13', wpRef: 'AR-01' }),
  makeRow('r3', { description: 'Operating lease agreements and amortization schedules (ASC 842)', com: 'L', personResponsible: 'J. Reyes (CFO)', requestDate: '2025-01-06', followUpDate: '2025-01-20', dateReceived: '', wpRef: 'LEASE-01' }),
];

export function AuditMgmtRequestsWorksheet({ isUS = false }: AuditMgmtRequestsWorksheetProps) {
  const [rows, setRows] = useState<RequestRow[]>(isUS ? MOCK_US : MOCK_CA);
  const [preparedBy, setPreparedBy] = useState(isUS ? 'Senior 1' : 'A. Kumar');
  const [preparedDate, setPreparedDate] = useState(isUS ? '2025-01-06' : '2024-04-08');

  const update = (id: string, field: keyof RequestRow, value: string) =>
    setRows(prev => prev.map(r => r.id !== id ? r : { ...r, [field]: value }));

  const addRow = () => setRows(prev => [...prev, makeRow(`r-${Date.now()}`)]);
  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  const StatusBadge = ({ row }: { row: RequestRow }) => {
    if (!row.description) return null;
    if (row.dateReceived)
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 whitespace-nowrap">Received</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 whitespace-nowrap">Outstanding</span>;
  };

  const thCls = "px-2 py-2 text-xs font-semibold text-muted-foreground text-left border-b border-border whitespace-nowrap";
  const tdCls = "px-2 py-1 border-b border-border/50 align-top";
  const inp = "w-full bg-transparent text-xs px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary/30 rounded min-w-0";

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h2 className="text-base font-semibold">Worksheet — Information / Analysis Requested from Management (Form 440)</h2>
        <p className="text-xs text-muted-foreground mt-1">Objective: To document requests made to management for preparing analysis or obtaining documents that will assist in the audit.</p>
        <p className="text-xs text-muted-foreground mt-0.5"><strong>Com:</strong> V = Verbal &nbsp;|&nbsp; L = Letter &nbsp;|&nbsp; Em = Email</p>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/20">
              <tr>
                <th className={thCls} style={{ minWidth: 220 }}>Description of assistance requested</th>
                <th className={thCls} style={{ width: 60 }}>Com</th>
                <th className={thCls} style={{ minWidth: 140 }}>Person responsible</th>
                <th className={thCls} style={{ width: 110 }}>Request date</th>
                <th className={thCls} style={{ width: 110 }}>Follow-up date</th>
                <th className={thCls} style={{ width: 110 }}>Date received</th>
                <th className={thCls} style={{ width: 80 }}>W/P ref.</th>
                <th className={thCls} style={{ width: 100 }}>Status</th>
                <th className="px-2 py-2 border-b border-border" style={{ width: 32 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/10">
                  <td className={tdCls}>
                    <textarea className={inp + " resize-none"} rows={2} value={row.description} onChange={e => update(row.id, 'description', e.target.value)} placeholder="Describe request..." />
                  </td>
                  <td className={tdCls}>
                    <select className={inp} value={row.com} onChange={e => update(row.id, 'com', e.target.value)}>
                      <option value="">—</option>
                      <option value="V">V</option>
                      <option value="L">L</option>
                      <option value="Em">Em</option>
                    </select>
                  </td>
                  <td className={tdCls}>
                    <input className={inp} value={row.personResponsible} onChange={e => update(row.id, 'personResponsible', e.target.value)} />
                  </td>
                  <td className={tdCls}>
                    <input type="date" className={inp} value={row.requestDate} onChange={e => update(row.id, 'requestDate', e.target.value)} />
                  </td>
                  <td className={tdCls}>
                    <input type="date" className={inp} value={row.followUpDate} onChange={e => update(row.id, 'followUpDate', e.target.value)} />
                  </td>
                  <td className={tdCls}>
                    <input type="date" className={inp} value={row.dateReceived} onChange={e => update(row.id, 'dateReceived', e.target.value)} />
                  </td>
                  <td className={tdCls}>
                    <input className={inp} value={row.wpRef} onChange={e => update(row.id, 'wpRef', e.target.value)} placeholder="—" />
                  </td>
                  <td className={tdCls + " pt-2"}>
                    <StatusBadge row={row} />
                  </td>
                  <td className={tdCls + " text-center"}>
                    <button onClick={() => removeRow(row.id)} className="text-muted-foreground hover:text-destructive p-1">
                      <X className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border/50">
          <button onClick={addRow} className="flex items-center gap-1.5 text-xs text-primary hover:bg-primary/5 px-3 py-1.5 rounded">
            <Plus className="h-3.5 w-3.5" /> Add request
          </button>
        </div>
      </div>

      {/* Sign-off */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Prepared by</label>
            <input className="border border-border rounded px-2 py-1 text-sm" value={preparedBy} onChange={e => setPreparedBy(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Date</label>
            <input type="date" className="border border-border rounded px-2 py-1 text-sm" value={preparedDate} onChange={e => setPreparedDate(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
