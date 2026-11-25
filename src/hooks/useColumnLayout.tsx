import React, { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

type Stored = { order?: string[]; hidden?: string[] };

const read = (key: string): Stored => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
};

// Saved order first (ignoring ids that no longer exist), then any new columns in their default position order.
const reconcile = (saved: string[] | undefined, ids: string[]) => {
  const known = (saved ?? []).filter((id, i, a) => ids.includes(id) && a.indexOf(id) === i);
  return [...known, ...ids.filter(id => !known.includes(id))];
};

/**
 * Column order + visibility for a list table, persisted to localStorage under `storageKey`
 * and reorderable by dragging headers (see DraggableTh).
 */
export function useColumnLayout(storageKey: string, ids: string[]) {
  const [columnOrder, setColumnOrder] = useState<string[]>(() => reconcile(read(storageKey).order, ids));
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
    () => new Set((read(storageKey).hidden ?? []).filter(id => ids.includes(id))),
  );
  const [dragId, setDragId] = useState<string | null>(null);
  const [drop, setDrop] = useState<{ id: string; side: "left" | "right" } | null>(null);
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ order: columnOrder, hidden: [...hiddenColumns] }));
    } catch { /* storage unavailable: layout just won't persist */ }
  }, [storageKey, columnOrder, hiddenColumns]);

  const toggleColumn = useCallback((id: string) => setHiddenColumns(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  }), []);

  const moveTo = useCallback((from: string, target: string, side: "left" | "right") => setColumnOrder(prev => {
    if (from === target) return prev;
    const without = prev.filter(id => id !== from);
    const at = without.indexOf(target);
    if (at < 0) return prev;
    without.splice(side === "left" ? at : at + 1, 0, from);
    return without;
  }), []);

  const endDrag = useCallback(() => { setDragId(null); setDrop(null); }, []);

  return { columnOrder, hiddenColumns, toggleColumn, dragId, drop, setDragId, setDrop, moveTo, endDrag };
}

export type ColumnLayout = ReturnType<typeof useColumnLayout>;

/** Table header cell that can be dragged left/right to reorder; shows a grip on hover and a drop line while dragging. */
export function DraggableTh({
  layout, id, className = "", children,
}: { layout: ColumnLayout; id: string; className?: string; children: React.ReactNode }) {
  const { dragId, drop, setDragId, setDrop, moveTo, endDrag } = layout;
  const showLeft = drop?.id === id && drop.side === "left" && dragId !== id;
  const showRight = drop?.id === id && drop.side === "right" && dragId !== id;
  return (
    <th
      draggable
      onDragStart={e => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", id); setDragId(id); }}
      onDragOver={e => {
        if (!dragId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const r = e.currentTarget.getBoundingClientRect();
        const side = e.clientX < r.left + r.width / 2 ? "left" : "right";
        if (drop?.id !== id || drop.side !== side) setDrop({ id, side });
      }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrop(null); }}
      onDrop={e => { e.preventDefault(); if (dragId && drop) moveTo(dragId, drop.id, drop.side); endDrag(); }}
      onDragEnd={endDrag}
      className={`group relative cursor-grab active:cursor-grabbing select-none ${dragId === id ? "opacity-50" : ""} ${className}`}
    >
      <GripVertical className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-70 transition-opacity" />
      {children}
      {showLeft && <span className="pointer-events-none absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />}
      {showRight && <span className="pointer-events-none absolute right-0 top-0 bottom-0 w-0.5 bg-primary" />}
    </th>
  );
}
