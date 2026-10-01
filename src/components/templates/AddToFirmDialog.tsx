import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderSolidIcon, FolderPlusIcon } from "@/components/icons/FolderIcons";
import { cn } from "@/lib/utils";
import {
  type Library,
  type Folder,
  getOffices,
  getActiveOfficeId,
  load,
  createFolder,
  addFromGlobal,
} from "@/lib/firmTemplateLibrary";
import type { GlobalItem } from "@/lib/globalTemplateCatalog";

interface Props {
  items: GlobalItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
}

function FolderTree({
  lib,
  type,
  selectedId,
  onSelect,
}: {
  lib: Library;
  type: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function renderFolders(parentId: string | null, depth = 0): React.ReactNode {
    const children = lib.folders.filter(
      f => f.type === type && f.parentId === parentId
    );
    return children.map(f => {
      const hasChildren = lib.folders.some(c => c.parentId === f.id && c.type === type);
      const isExpanded = expanded.has(f.id);
      return (
        <div key={f.id}>
          <div
            className={cn(
              "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm transition-colors",
              selectedId === f.id ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
            )}
            style={{ paddingLeft: depth * 16 + 8 }}
            onClick={() => onSelect(f.id)}
          >
            {hasChildren ? (
              <button
                className="p-0.5 -ml-1"
                onClick={e => { e.stopPropagation(); toggle(f.id); }}
              >
                <span className="text-xs">{isExpanded ? "▾" : "▸"}</span>
              </button>
            ) : (
              <span className="w-4" />
            )}
            <FolderSolidIcon className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{f.name}</span>
          </div>
          {isExpanded && hasChildren && (
            <div>{renderFolders(f.id, depth + 1)}</div>
          )}
        </div>
      );
    });
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm transition-colors",
          selectedId === null ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
        )}
        onClick={() => onSelect(null)}
      >
        <span className="w-4" />
        <FolderPlusIcon className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="truncate font-medium">Root</span>
      </div>
      {renderFolders(null)}
    </div>
  );
}

export function AddToFirmDialog({ items, open, onOpenChange, onAdded }: Props) {
  const [lib, setLib] = useState<Library>(() => load());
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [saving, setSaving] = useState(false);

  const offices = getOffices();
  const activeOfficeId = getActiveOfficeId();
  const activeOffice = offices.find(o => o.id === activeOfficeId);

  const defaultSelectedOffices = (): Set<string> => {
    if (!items.length) return new Set(offices.map(o => o.id));
    const region = items[0].region;
    if (region === "CA") return new Set(offices.filter(o => o.region === "ca").map(o => o.id));
    if (region === "US") return new Set(offices.filter(o => o.region === "us").map(o => o.id));
    return new Set(offices.map(o => o.id));
  };

  const [selectedOffices, setSelectedOffices] = useState<Set<string>>(defaultSelectedOffices);

  const type = items[0]?.type ?? "engagements";

  function toggleOffice(id: string) {
    setSelectedOffices(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    const newLib = createFolder(type, newFolderName.trim(), selectedFolderId ?? null);
    const created = newLib.folders.find(
      f => f.name === newFolderName.trim() && f.type === type && f.parentId === (selectedFolderId ?? null)
    );
    setLib(newLib);
    setNewFolderName("");
    setShowNewFolder(false);
    if (created) setSelectedFolderId(created.id);
  }

  function getFolderName(id: string | null): string {
    if (!id) return "Root";
    return lib.folders.find(f => f.id === id)?.name ?? "Root";
  }

  async function handleAdd() {
    if (items.length === 0) return;
    setSaving(true);
    const officeIds = [...selectedOffices];
    const result = addFromGlobal(items, selectedFolderId, officeIds);
    setSaving(false);
    if (!result.ok) {
      const dupes = "duplicates" in result ? result.duplicates.join(", ") : "";
      toast.error(`A template with the same name already exists in this folder: ${dupes}`);
      return;
    }
    const folderName = getFolderName(selectedFolderId);
    toast.success(`${result.added} template${result.added === 1 ? "" : "s"} added to ${folderName}`);
    onOpenChange(false);
    onAdded();
  }

  if (!items.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to firm templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Folder picker */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Destination folder</Label>
            <ScrollArea className="h-40 rounded-md border border-border p-1">
              <FolderTree
                lib={lib}
                type={type}
                selectedId={selectedFolderId}
                onSelect={setSelectedFolderId}
              />
            </ScrollArea>
            {showNewFolder ? (
              <div className="flex gap-2 mt-2">
                <Input
                  autoFocus
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleCreateFolder(); if (e.key === "Escape") setShowNewFolder(false); }}
                  className="h-8 text-sm flex-1"
                />
                <Button size="sm" onClick={handleCreateFolder} className="h-8">Create</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNewFolder(false)} className="h-8">Cancel</Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-7 text-xs text-muted-foreground"
                onClick={() => setShowNewFolder(true)}
              >
                + New folder
              </Button>
            )}
          </div>

          {/* Office checkboxes */}
          {offices.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Make available to</Label>
              <div className="space-y-2">
                {offices.map(o => (
                  <label key={o.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedOffices.has(o.id)}
                      onCheckedChange={() => toggleOffice(o.id)}
                    />
                    <span className="text-sm">
                      {o.region === "ca" ? "🇨🇦" : "🇺🇸"} {o.name} — {o.city}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Added templates will have Draft status. Publish them when ready to use in engagements.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={saving || selectedOffices.size === 0}>
            {saving ? "Adding…" : `Add ${items.length === 1 ? "template" : `${items.length} templates`}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
