import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Solid folder icons matching the reference silhouette:
 *  - Back panel: stepped top with a left "tab" that steps up, flat strip to the right
 *  - Front flap: bold trapezoid/parallelogram tilted to the right
 *    (bottom-right lower than bottom-left), offset right of the back panel
 *  - Clear diagonal negative space between the two pieces on the left
 *  - Plus / minus symbol centered on the front flap, knocked out in white
 */
function BaseFolder({
  className,
  style,
  symbol,
}: IconProps & { symbol: 'plus' | 'minus' | null }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Back panel with stepped top (left tab steps up above right strip) */}
      <path d="M4 18 L4 44 L22 44 L22 22 L58 22 L58 18 L28 18 L24 14 L10 14 L6 18 Z" />

      {/* Front flap: tilted trapezoid, bottom edge slopes down to the right */}
      <path d="M12 24 L60 24 L56 52 L8 52 Z" />

      {/* Plus / Minus centered on the front flap */}
      {symbol === 'plus' && (
        <g fill="#ffffff">
          <rect x="30" y="33" width="8" height="2.4" rx="0.6" />
          <rect x="32.8" y="30.2" width="2.4" height="8" rx="0.6" />
        </g>
      )}
      {symbol === 'minus' && (
        <rect x="30" y="33" width="8" height="2.4" rx="0.6" fill="#ffffff" />
      )}
    </svg>
  );
}

export function FolderSolidIcon(props: IconProps) {
  return <BaseFolder {...props} symbol={null} />;
}

export function FolderPlusIcon(props: IconProps) {
  return <BaseFolder {...props} symbol="plus" />;
}

export function FolderMinusIcon(props: IconProps) {
  return <BaseFolder {...props} symbol="minus" />;
}
