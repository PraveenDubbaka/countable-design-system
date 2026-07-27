import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LukaIcon } from '@/components/LukaIcon';

interface LukaStatusBarProps {
  message?: string;
  isActive?: boolean;
  className?: string;
}

export function LukaStatusBar({
  message = 'Luka is populating information from Xero and prior file…',
  isActive = true,
  className,
}: LukaStatusBarProps) {
  const [dismissed, setDismissed] = useState(false);
  if (!isActive || dismissed) return null;

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 bg-violet-50 border-b border-violet-200 text-violet-700 text-xs',
      className
    )}>
      <LukaIcon size={13} bare inverted className="shrink-0" />
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={() => setDismissed(true)}
        className="text-violet-400 hover:text-violet-700 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
