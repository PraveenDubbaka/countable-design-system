import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Copy, CalendarClock, Send } from 'lucide-react';
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

  const handleSendAll = () => {
    if (!validCount) {
      toast.error('Add at least one valid request');
      return;
    }
    toast.success(`${validCount} request${validCount > 1 ? 's' : ''} sent successfully`);
    setRows(Array.from({ length: 3 }, newRow));
  };

  const labelCls = 'text-xs font-medium text-foreground block mb-1';
  const required = <span className="text-destructive ml-0.5">*</span>;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            440 — Information / Analysis Requested from Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generate and send multiple PBC (Provided by Client) requests simultaneously.
            {isUS ? ' (US Audit)' : ''}
          </p>
        </div>

        {/* Shared settings */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>Engagement Folder{required}</label>
            <Select value={folder} onValueChange={setFolder}>
              <SelectTrigger className="h-9 text-sm w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ENGAGEMENT_FOLDERS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelCls}>Sub Folder{required}</label>
            <Select value={subFolder} onValueChange={setSubFolder}>
              <SelectTrigger className="h-9 text-sm w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUB_FOLDERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelCls}>Auto-Populate Due Date</label>
            <Input type="date" value={globalDueDate} onChange={e => setGlobalDueDate(e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="flex items-end">
            <Button variant="outline" size="sm" className="h-9 gap-2 text-[#0C2D55]" onClick={applyGlobalDueDate}>
              <CalendarClock className="h-3.5 w-3.5" /> Apply to All
            </Button>
          </div>
        </div>

        {/* Rows table */}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2 w-10">#</th>
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2 w-[130px]">Type{required}</th>
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2 w-[200px]">Recipient{required}</th>
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2 w-[120px]">Priority{required}</th>
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2">Document Name{required}</th>
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2">Description</th>
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2 w-[150px]">Due Date{required}</th>
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2 w-[140px]">W/P Ref / Attachment</th>
                <th className="text-left text-xs font-semibold text-foreground px-3 py-2 w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const invalid = !row.recipient || !row.docName.trim() || !row.dueDate;
                return (
                  <tr key={row.id} className={cn('border-b border-border hover:bg-muted/20', invalid && 'bg-destructive/[0.02]')}>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <Select value={row.type} onValueChange={v => update(row.id, { type: v as RequestRow['type'] })}>
                        <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Line Item">Line Item</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Select value={row.recipient} onValueChange={v => update(row.id, { recipient: v })}>
                        <SelectTrigger className={cn('h-8 text-xs w-full', !row.recipient && 'border-destructive')}>
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          {RECIPIENTS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Select value={row.priority} onValueChange={v => update(row.id, { priority: v as RequestRow['priority'] })}>
                        <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.docName}
                        onChange={e => update(row.id, { docName: e.target.value })}
                        placeholder="Document name"
                        className={cn('h-8 text-xs', !row.docName.trim() && 'border-destructive')}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.description}
                        onChange={e => update(row.id, { description: e.target.value })}
                        placeholder="Optional notes"
                        className="h-8 text-xs"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="date"
                        value={row.dueDate}
                        onChange={e => update(row.id, { dueDate: e.target.value })}
                        className={cn('h-8 text-xs', !row.dueDate && 'border-destructive')}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <RefButton
                        reference={row.wpRef}
                        onAttach={(doc) => update(row.id, { wpRef: [...row.wpRef, doc] })}
                        onRemove={(rIdx) => update(row.id, { wpRef: row.wpRef.filter((_, i) => i !== (rIdx ?? -1)) })}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
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

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between bg-muted/20">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[#0C2D55]" onClick={addRow}>
            <Plus className="h-3.5 w-3.5" /> Add Request
          </Button>
          <div className="flex items-center gap-3">
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
  );
}
