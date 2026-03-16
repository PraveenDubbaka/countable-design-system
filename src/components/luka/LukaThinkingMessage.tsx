import { cn } from "@/lib/utils";

/* Luka bolt icon SVG */
function LukaBoltIcon({ size = 24 }: { size?: number }) {
  const h = Math.round(size * (26 / 23));
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={h} viewBox="0 0 23 26" fill="none">
      <path d="M14.7852 10.1758H20.5852C21.0627 10.2128 22.4952 10.3791 22.8679 11.1001C23.1474 11.6362 22.8446 12.3663 22.1342 12.9486C17.2775 16.9508 12.4325 20.9622 7.57591 24.9644C7.15663 25.0753 6.88876 25.0753 6.77229 24.9644C6.53936 24.7518 6.86546 24.1418 7.7739 23.1158C11.2679 19.7237 14.7619 16.3408 18.2559 12.9486L8.30964 10.1758H14.7735H14.7852Z" fill="url(#think_g1)" />
      <path d="M8.1918 14.8718H2.38763C1.90978 14.8348 0.476215 14.6684 0.103256 13.9475C-0.176463 13.4114 0.126566 12.6812 0.837519 12.0989C5.68599 8.08751 10.5461 4.08535 15.3946 0.0831858C15.8142 -0.0277286 16.0822 -0.0277286 16.1988 0.0831858C16.4319 0.295772 16.1055 0.905801 15.1964 1.93176C11.6999 5.32389 8.20346 8.70678 4.70697 12.0989L14.6603 14.8718H8.1918Z" fill="url(#think_g2)" />
      <defs>
        <linearGradient id="think_g1" x1="10.544" y1="12.8935" x2="13.5519" y2="22.6018" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9747FF" /><stop offset="1" stopColor="#1C63A6" />
        </linearGradient>
        <linearGradient id="think_g2" x1="15.4787" y1="0" x2="9.64532" y2="31.4017" gradientUnits="userSpaceOnUse">
          <stop offset="0.165" stopColor="#9747FF" /><stop offset="0.783" stopColor="#1C63A6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface LukaThinkingMessageProps {
  visible: boolean;
}

export function LukaThinkingMessage({ visible }: LukaThinkingMessageProps) {
  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 px-6 py-4 animate-fade-in">
      {/* Spinning Luka icon */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(265_80%_55%)] flex items-center justify-center shrink-0 luka-thinking-spin">
        <LukaBoltIcon size={16} />
      </div>

      {/* Thinking text with shimmer */}
      <div className="flex items-center gap-2 pt-2">
        <span className="text-sm font-medium text-muted-foreground luka-thinking-text">
          Thinking
        </span>
        <span className="flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-primary/60 luka-dot luka-dot-1" />
          <span className="w-1 h-1 rounded-full bg-primary/60 luka-dot luka-dot-2" />
          <span className="w-1 h-1 rounded-full bg-primary/60 luka-dot luka-dot-3" />
        </span>
      </div>
    </div>
  );
}
