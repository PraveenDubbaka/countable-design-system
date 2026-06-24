import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Plus, Trash2, Copy, CalendarClock, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { RefButton, RefDoc } from '@/components/RefButton';

interface BulkRequestsWorksheetProps {
  isUS?: boolean;
}

interface RequestRow {
  id: string;
  type: 'General' | 'Line Item';
  recipient: string;
  priority: 'High' | 'Medium' | 'Low';
  docName: string;
  description: string;
  dueDate: string;
  wpRef: RefDoc[];
}

const ENGAGEMENT_FOLDERS = ['Client Onboarding', 'Planning', 'Risk Assessment', 'Procedures', 'Financial Statements', 'Completion & Signoffs'];
const SUB_FOLDERS = ['Team Planning Discussions', 'Risk Assessment', 'Internal Controls', 'Substantive Testing', 'Wrap-up'];
const RECIPIENTS = ['one@gmail.com', 'cfo@client.com', 'controller@client.com', 'accounting@client.com'];

const defaultDueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
};

const newRow = (): RequestRow => ({
  id: crypto.randomUUID(),
  type: 'General',
  recipient: '',
  priority: 'Medium',
  docName: '',
  description: '',
  dueDate: defaultDueDate(),
  wpRef: [],
});

export function BulkRequestsWorksheet({ isUS = false }: BulkRequestsWorksheetProps) {
  const [folder, setFolder] = useState('Client Onboarding');
  const [subFolder, setSubFolder] = useState('Team Planning Discussions');
  const [globalDueDate, setGlobalDueDate] = useState(defaultDueDate());
  const [rows, setRows] = useState<RequestRow[]>(() => Array.from({ length: 3 }, newRow));

  const update = (id: string, patch: Partial<RequestRow>) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => setRows(prev => [...prev, { ...newRow(), dueDate: globalDueDate }]);
  const duplicateRow = (id: string) => {
    const src = rows.find(r => r.id === id);
    if (!src) return;
    setRows(prev => [...prev, { ...src, id: crypto.randomUUID() }]);
  };
  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  const applyGlobalDueDate = () => {
    setRows(prev => prev.map(r => ({ ...r, dueDate: globalDueDate })));
    toast.success(`Due date applied to ${rows.length} requests`);
  };

  const validCount = rows.filter(r => r.recipient && r.docName.trim() && r.dueDate).length;
  const allRowsValid = rows.length > 0 && validCount === rows.length;

  const handleSendAll = () => {
    if (!allRowsValid) {
      toast.error('All mandatory fields must be filled before sending');
      return;
    }
    toast.success(`${validCount} request${validCount > 1 ? 's' : ''} sent successfully`);
    setRows(Array.from({ length: 3 }, newRow));
  };

  const cardCls = 'bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden';
  const cardHeaderCls = 'px-6 py-3.5 bg-card border-b border-border flex items-center gap-3';
  const thCls = 'px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap';
  const required = <span className="text-destructive ml-0.5">*</span>;

  return (
    <div className="flex flex-col h-full">
      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Generate and send multiple Provided-by-Client (PBC) requests for information or analysis required from
          management in a single batch, ensuring complete documentation under {isUS ? 'AU-C 580' : 'CAS 580'}.
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Section A: Batch Settings ── */}
          <div className={cardCls}>
            <div className={cardHeaderCls}>
              <span className="text-sm font-semibold text-foreground">Batch Settings</span>
              <span title="Apply common folder and due-date settings to all rows below.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Engagement Folder{required}
                </label>
                <Select value={folder} onValueChange={setFolder}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ENGAGEMENT_FOLDERS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Sub Folder{required}
                </label>
                <Select value={subFolder} onValueChange={setSubFolder}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SUB_FOLDERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Auto-Populate Due Date
                </label>
                <Input
                  type="date"
                  value={globalDueDate}
                  onChange={e => setGlobalDueDate(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={applyGlobalDueDate}>
                  <CalendarClock className="h-3.5 w-3.5" /> Apply to All
                </Button>
              </div>
            </div>
          </div>

          {/* ── Section B: Requests Table ── */}
          <div className={cardCls}>
            <div className={cardHeaderCls}>
              <span className="text-sm font-semibold text-foreground">Document Requests</span>
              <span title="Add one row per request. All required fields must be filled before sending.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
              <div className="flex-1" />
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={addRow}>
                <Plus className="h-3.5 w-3.5" /> Add Request
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className={cn(thCls, 'w-10')}>#</th>
                    <th className={cn(thCls, 'w-[130px]')}>Type{required}</th>
                    <th className={cn(thCls, 'w-[200px]')}>Recipient{required}</th>
                    <th className={cn(thCls, 'w-[120px]')}>Priority{required}</th>
                    <th className={thCls}>Document Name{required}</th>
                    <th className={thCls}>Description</th>
                    <th className={cn(thCls, 'w-[160px]')}>Due Date{required}</th>
                    <th className={cn(thCls, 'w-[140px]')}>W/P Ref</th>
                    <th className={cn(thCls, 'w-[90px] text-center')}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row, idx) => {
                    const invalid = !row.recipient || !row.docName.trim() || !row.dueDate;
                    return (
                      <tr key={row.id} className={cn('hover:bg-muted/50 transition-colors', invalid && 'bg-destructive/[0.02]')}>
                        <td className="px-4 py-2.5 align-top text-xs text-muted-foreground">{idx + 1}</td>
                        <td className="px-4 py-2.5 align-top">
                          <Select value={row.type} onValueChange={v => update(row.id, { type: v as RequestRow['type'] })}>
                            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="General">General</SelectItem>
                              <SelectItem value="Line Item">Line Item</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <Select value={row.recipient} onValueChange={v => update(row.id, { recipient: v })}>
                            <SelectTrigger className={cn('h-8 text-sm', !row.recipient && 'border-destructive')}>
                              <SelectValue placeholder="Select recipient" />
                            </SelectTrigger>
                            <SelectContent>
                              {RECIPIENTS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <Select value={row.priority} onValueChange={v => update(row.id, { priority: v as RequestRow['priority'] })}>
                            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2.5 align-top min-w-[180px]">
                          <Input
                            value={row.docName}
                            onChange={e => update(row.id, { docName: e.target.value })}
                            placeholder="Document name"
                            className={cn('h-8 text-sm', !row.docName.trim() && 'border-destructive')}
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top min-w-[200px]">
                          <Input
                            value={row.description}
                            onChange={e => update(row.id, { description: e.target.value })}
                            placeholder="Optional notes"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <Input
                            type="date"
                            value={row.dueDate}
                            onChange={e => update(row.id, { dueDate: e.target.value })}
                            className={cn('h-8 text-sm', !row.dueDate && 'border-destructive')}
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <RefButton
                            reference={row.wpRef}
                            onAttach={(doc) => update(row.id, { wpRef: [...row.wpRef, doc] })}
                            onRemove={(rIdx) => update(row.id, { wpRef: row.wpRef.filter((_, i) => i !== (rIdx ?? -1)) })}
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-link hover:bg-link/10" onClick={() => duplicateRow(row.id)} title="Duplicate">
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeRow(row.id)} disabled={rows.length === 1} title="Remove">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-border flex items-center justify-between bg-muted/20">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{validCount}</span> of {rows.length} ready to send
              </p>
              <Button onClick={handleSendAll} disabled={!validCount} size="sm" className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Send {validCount > 0 ? `${validCount} ` : ''}Request{validCount === 1 ? '' : 's'}
              </Button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
