import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { fmtElapsed, useTimeEntries } from '@/lib/useTimeEntries';
import { TimeTrackerWindow } from '@/components/TimeTrackerWindow';

export interface TimeTrackerDrawerProps {
  open: boolean;
  onClose: () => void;
  engagementId: string;
  clientName: string;
  activeSec: number;
  idleSec: number;
  onLogTime: () => void;
}

export function TimeTrackerDrawer({
  open, onClose, engagementId, clientName,
  activeSec, idleSec, onLogTime,
}: TimeTrackerDrawerProps) {
  const [windowOpen, setWindowOpen] = useState(false);
  const { entries } = useTimeEntries(engagementId);

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[520px] p-0 flex flex-col gap-0">

          {/* Top note — matches XD */}
          <div className="px-5 py-3 border-b border-border bg-red-50">
            <p className="text-xs text-red-700 text-center">
              No time has been recorded yet. Accessing time tracker from 'Time Tracker' icon
            </p>
          </div>

          {/* View Time Tracker button row */}
          <div className="px-5 py-3 border-b border-border flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() => setWindowOpen(true)}
            >
              <Eye className="h-3.5 w-3.5" />
              View Time Tracker ({entries.length})
            </Button>
          </div>

          {/* Table header — CLIENT NAME | ACTIVE TIME | IDLE TIME | (button) */}
          <div className="grid grid-cols-[1fr_130px_130px_100px] px-5 py-2 border-b border-border bg-muted/40">
            {['CLIENT NAME', 'ACTIVE TIME', 'IDLE TIME', ''].map(h => (
              <span key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {h}
              </span>
            ))}
          </div>

          {/* Active engagement row */}
          <div className="grid grid-cols-[1fr_130px_130px_100px] items-center px-5 py-4 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">{clientName}</p>
              <p className="text-[11px] text-muted-foreground">{engagementId}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="font-mono font-semibold text-red-600 text-sm">{fmtElapsed(activeSec)}</span>
            </div>
            <span className="font-mono text-sm text-muted-foreground">{fmtElapsed(idleSec)}</span>
            <Button
              size="sm"
              onClick={onLogTime}
              className="h-7 text-xs bg-[#1C63A6] hover:bg-[#1a5a9e] text-white"
            >
              Log Time
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-auto px-5 pb-5 pt-4 border-t border-border flex flex-col gap-3">
            <p className="text-[10px] text-muted-foreground text-center">
              Note*: All outstanding accumulated time will be automatically logged into the time-tracker at 11:59 PM
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={onLogTime}>
              Log All
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <TimeTrackerWindow
        open={windowOpen}
        onClose={() => setWindowOpen(false)}
        engagementId={engagementId}
        clientName={clientName}
        activeSec={activeSec}
        idleSec={idleSec}
        onLogTime={onLogTime}
      />
    </>
  );
}
