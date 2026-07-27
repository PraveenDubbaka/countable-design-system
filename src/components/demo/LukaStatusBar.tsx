import { useState } from 'react';
import { Zap, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LukaStatusBarProps {
  message?: string;
  isActive?: boolean;
  className?: string;
}

export function LukaStatusBar({
  message = 'Luka is populating information from QBO and prior file…',
  isActive = true,
  className,
}: LukaStatusBarProps) {
  const [dismissed, setDismissed] = useState(false);
  if (!isActive || dismissed) return null;

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 bg-[#EEF4FB] border-b border-[#1C63A6]/20 text-[#1C63A6] text-xs',
      className
    )}>
      <Zap className="h-3 w-3 fill-[#1C63A6] shrink-0" strokeWidth={0} />
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={() => setDismissed(true)}
        className="text-[#1C63A6]/60 hover:text-[#1C63A6] transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
