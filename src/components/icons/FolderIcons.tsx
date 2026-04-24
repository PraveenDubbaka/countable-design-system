import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Solid navy "open" folder icon matching the reference style:
 *  - Back panel with a left tab.
 *  - Thin diagonal sheet of paper peeking out on the right.
 *  - Angled front flap tilted forward, with a small gap between flap
 *    and back panel for the 3D open effect.
 */
function BaseOpenFolder({
  className,
  style,
  symbol,
}: IconProps & { symbol?: 'plus' | 'minus' | null }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Back panel with left tab */}
      <path d="M2 6.25C2 5.284 2.784 4.5 3.75 4.5h4.19c.39 0 .766.13 1.07.369l1.62 1.273c.18.14.4.216.624.216H19.5c.966 0 1.75.784 1.75 1.75V10H2V6.25Z" />
      {/* Thin paper sheet peeking between back panel and front flap */}
      <path
        d="M4.5 9.25h14a.5.5 0 0 1 .5.5v1.5H4V9.75a.5.5 0 0 1 .5-.5Z"
        opacity="0.55"
      />
      {/* Front flap - angled trapezoid tilted forward */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.35 10.5h18.06c.6 0 1.03.58.87 1.16l-1.86 6.8A1.75 1.75 0 0 1 18.73 19.8H4.6a1.75 1.75 0 0 1-1.68-1.27L1.44 12.2a1.25 1.25 0 0 1 1.2-1.6h.71Z"
      />
      {/* Plus / Minus symbol cut out of front flap (in white) */}
      {symbol === 'plus' && (
        <g fill="#ffffff">
          <rect x="16.25" y="14" width="3.5" height="1.3" rx="0.4" />
          <rect x="17.35" y="12.9" width="1.3" height="3.5" rx="0.4" />
        </g>
      )}
      {symbol === 'minus' && (
        <rect x="16.25" y="14" width="3.5" height="1.3" rx="0.4" fill="#ffffff" />
      )}
    </svg>
  );
}

export function FolderSolidIcon(props: IconProps) {
  return <BaseOpenFolder {...props} symbol={null} />;
}

export function FolderPlusIcon(props: IconProps) {
  return <BaseOpenFolder {...props} symbol="plus" />;
}

export function FolderMinusIcon(props: IconProps) {
  return <BaseOpenFolder {...props} symbol="minus" />;
}
