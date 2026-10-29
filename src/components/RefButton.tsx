import { useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Paperclip, File, Upload, Check, Search, Trash2, ChevronDown, Plus } from 'lucide-react';

// Mock document library — ref codes added for prototype only (no model change)
const EXISTING_DOCUMENTS = [
  { id: 'doc1', name: 'Company Policy.pdf',         type: 'pdf',  ref: 'CP-1' },
  { id: 'doc2', name: 'Guidelines 2024.docx',        type: 'docx', ref: 'GL-1' },
  { id: 'doc3', name: 'Compliance Checklist.xlsx',   type: 'xlsx', ref: 'CC-1' },
  { id: 'doc4', name: 'Reference Manual.pdf',        type: 'pdf',  ref: 'RM-1' },
];

export interface RefDoc { name: string; id?: string; ref?: string; }

export interface RefButtonProps {
  reference?: RefDoc | RefDoc[] | null;
  onAttach: (doc: RefDoc) => void;
  onRemove: (index?: number) => void;
  onOpen?: (doc: RefDoc) => void;
  isCompactMode?: boolean;
  disabled?: boolean;
  /** Show every attached mnemonic in one box (one per line; one clamped line when compact) instead of the two-item summary. */
  showAllRefs?: boolean;
}

export function RefButton({ reference, onAttach, onRemove, onOpen, isCompactMode = false, disabled, showAllRefs = false }: RefButtonProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen]     = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize: legacy data stores reference as a plain string (e.g. "AC-01")
  const normalizeRef = (r: unknown): RefDoc => {
    if (typeof r === 'string') return { name: r, ref: r };
    return r as RefDoc;
  };
  const refs: RefDoc[] = reference
    ? (Array.isArray(reference) ? reference.map(normalizeRef) : [normalizeRef(reference)])
    : [];

  // Close doc-list dropdown when the last attachment is removed
  useEffect(() => {
    if (refs.length === 0) setIsDocsOpen(false);
  }, [refs.length]);

  const getMnemonic = (doc: RefDoc, idx: number) => doc.ref ?? doc.name ?? `D-${idx + 1}`;
  const mnemonics       = refs.map(getMnemonic);
  const first2          = refs.slice(0, 2);
  const hasMore         = refs.length > 2;
  const mnemonicDisplay = first2.map(getMnemonic).join(', ') + (hasMore ? ' …' : '');

  const filteredDocs   = EXISTING_DOCUMENTS.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const isDocSelected  = (docId: string) => refs.some(r => r.id === docId);

  const handleToggleDoc = (doc: typeof EXISTING_DOCUMENTS[number]) => {
    if (isDocSelected(doc.id)) {
      const idx = refs.findIndex(r => r.id === doc.id);
      if (idx >= 0) onRemove(idx);
    } else {
      onAttach({ name: doc.name, id: doc.id, ref: doc.ref });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file, i) => {
        const initials = file.name
          .replace(/\.[^.]+$/, '')
          .split(/[\s_-]+/)
          .map(w => w[0]?.toUpperCase() ?? '')
          .join('')
          .slice(0, 3);
        onAttach({ name: file.name, ref: initials ? `${initials}-${refs.length + i + 1}` : undefined });
      });
    }
    e.target.value = '';
  };

  // ── Disabled (preview/read-only) mode ─────────────────────────────────────
  if (disabled) {
    if (refs.length === 0) return null;
    return (
      <span className="text-xs text-blue-600 truncate">
        {mnemonicDisplay}
      </span>
    );
  }

  // Shared picker PopoverContent — reused in both expanded and compact mode
  const pickerContent = (
    <PopoverContent
      align="start"
      className="w-72 p-0 bg-popover border-border shadow-xl z-50"
      sideOffset={5}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="pl-9 bg-muted border-border text-foreground placeholder:text-muted-foreground h-9 text-sm"
          />
        </div>
      </div>

      {/* Upload */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-muted transition-colors border-b border-border"
      >
        <Upload className="h-4 w-4" />
        <span>Upload documents</span>
      </button>

      {/* Document list */}
      <div className="max-h-48 overflow-y-auto">
        {filteredDocs.map((doc) => (
          <button
            key={doc.id}
            onClick={(e) => { e.stopPropagation(); handleToggleDoc(doc); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-popover-foreground"
          >
            <Checkbox checked={isDocSelected(doc.id)} className="h-4 w-4 pointer-events-none" />
            <File className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{doc.name}</span>
          </button>
        ))}
      </div>

      {/* Done button — only when at least one doc is selected */}
      {refs.length > 0 && (
        <div className="p-2 border-t border-border">
          <button
            onClick={() => { setIsPickerOpen(false); setSearchTerm(''); }}
            className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-foreground bg-[#1C63A6] hover:bg-[#1a5a9e] rounded-md transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Done</span>
          </button>
        </div>
      )}
    </PopoverContent>
  );

  // Mnemonic trigger button — shared between expanded and compact layouts
  const mnemonicTrigger = (
    <button
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-0.5 text-xs text-blue-600 underline underline-offset-2 hover:text-blue-700 transition-colors min-w-0"
    >
      <span className="whitespace-nowrap">{mnemonicDisplay}</span>
      <ChevronDown className="h-3 w-3 shrink-0" />
    </button>
  );

  // Mnemonic box trigger (showAllRefs) — one box holding every attached mnemonic.
  // Expanded: one mnemonic per line, chevron top-right. Compact: first mnemonic (+ "…") on one clamped line.
  const mnemonicBoxTrigger = (
    <button
      onClick={(e) => e.stopPropagation()}
      aria-label={`Attached references: ${mnemonics.join(', ')}`}
      className={`flex min-w-0 gap-1 px-2 text-left text-xs text-blue-600 hover:text-blue-700 border border-border transition-colors ${
        isCompactMode ? 'items-center py-0.5 rounded max-w-full' : 'w-full items-start justify-between py-1 rounded-md'
      }`}
    >
      {isCompactMode ? (
        <span className="truncate underline underline-offset-2">{mnemonics[0]}{refs.length > 1 ? ' …' : ''}</span>
      ) : (
        <span className="flex min-w-0 flex-col">
          {mnemonics.map((m, i) => (
            <span key={i} title={m} className="truncate underline underline-offset-2">{m}</span>
          ))}
        </span>
      )}
      <ChevronDown className={`h-3 w-3 shrink-0 ${isCompactMode ? '' : 'mt-0.5'}`} />
    </button>
  );
  const refTrigger = showAllRefs ? mnemonicBoxTrigger : mnemonicTrigger;

  // ── Edit mode ──────────────────────────────────────────────────────────────

  if (isCompactMode) {
    // ── Compact / collapsed-row mode ────────────────────────────────────────
    // • No docs: show [+ Ref] picker button only
    // • Has docs: show mnemonic link; picker opened via "Add reference" in dropdown
    return (
      <div className="flex items-center min-w-0">
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />

        {refs.length === 0 ? (
          // No attachments — show picker button so user can add one
          <Popover
            open={isPickerOpen}
            onOpenChange={(open) => { setIsPickerOpen(open); if (!open) setSearchTerm(''); }}
          >
            <PopoverTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded border border-dashed border-blue-300 dark:border-blue-700/60 transition-colors whitespace-nowrap"
              >
                <Paperclip className="h-3 w-3" />
                <span>+ Ref</span>
              </button>
            </PopoverTrigger>
            {pickerContent}
          </Popover>
        ) : (
          <>
            {/* Hidden picker popover — opened programmatically from dropdown */}
            <Popover
              open={isPickerOpen}
              onOpenChange={(open) => { setIsPickerOpen(open); if (!open) setSearchTerm(''); }}
            >
              <PopoverTrigger asChild>
                <span className="sr-only" />
              </PopoverTrigger>
              {pickerContent}
            </Popover>

            {/* Mnemonic + doc-list dropdown (with Add reference at bottom) */}
            <Popover open={isDocsOpen} onOpenChange={setIsDocsOpen}>
              <PopoverTrigger asChild>{refTrigger}</PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-64 p-0 bg-popover border-border shadow-xl z-50"
                sideOffset={4}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="py-1">
                  {refs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors text-sm">
                      <button
                        className="flex-1 text-left text-foreground truncate"
                        title={doc.name}
                        onClick={(e) => { e.stopPropagation(); onOpen?.(doc); }}
                      >
                        {doc.name}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                        className="shrink-0 p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                        title="Detach document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                {/* Add reference item — opens picker without expanding the row */}
                <div className="border-t border-border">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsDocsOpen(false); setIsPickerOpen(true); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add reference</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    );
  }

  // ── Expanded mode: stacked two-line layout ─────────────────────────────────
  // Line 1: [+ Ref] picker button
  // Line 2: mnemonic link, or the all-mnemonics box with showAllRefs (only when docs are attached)
  return (
    <div className="flex flex-col items-start gap-0.5 min-w-0">
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />

      {/* ── Line 1: Picker button ── */}
      <Popover
        open={isPickerOpen}
        onOpenChange={(open) => { setIsPickerOpen(open); if (!open) setSearchTerm(''); }}
      >
        <PopoverTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-md border border-dashed border-blue-300 dark:border-blue-700/60 transition-colors shrink-0 whitespace-nowrap"
          >
            <Paperclip className="h-3.5 w-3.5" />
            <span>+ Ref</span>
          </button>
        </PopoverTrigger>
        {pickerContent}
      </Popover>

      {/* ── Line 2: Mnemonic + attached-docs dropdown ── */}
      {refs.length > 0 && (
        <Popover open={isDocsOpen} onOpenChange={setIsDocsOpen}>
          <PopoverTrigger asChild>{refTrigger}</PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-64 p-0 bg-popover border-border shadow-xl z-50"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="py-1">
              {refs.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors text-sm">
                  <button
                    className="flex-1 text-left text-foreground truncate"
                    title={doc.name}
                    onClick={(e) => { e.stopPropagation(); onOpen?.(doc); }}
                  >
                    {doc.name}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                    className="shrink-0 p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                    title="Detach document"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
