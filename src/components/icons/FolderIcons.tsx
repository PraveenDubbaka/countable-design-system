import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Solid "open" folder icons matching the Shutterstock-style reference:
 *  - Chunky back panel with a left tab on top
 *  - A trapezoidal front flap that tilts forward to the right
 *  - A small gap between the flap and the back panel (rendered as a
 *    transparent notch) for a 3D open-folder feel
 *
 * The plus / minus variants place the symbol on the front flap,
 * knocked out in white so they read cleanly on the dark navy folder.
 */
function BaseOpenFolder({
  className,
  style,
  symbol,
}: IconProps & { symbol: 'plus' | 'minus' | null }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Back panel with left tab — the "wall" behind the flap */}
      <path d="M2 6.4c0-1.05.85-1.9 1.9-1.9h4.35c.42 0 .83.14 1.16.4l1.63 1.27c.17.14.39.21.62.21H20.1c1.05 0 1.9.85 1.9 1.9v2.32H2V6.4Z" />

      {/* Front flap — tilted trapezoid. Wider at top, narrower at bottom,
          giving the signature "opening outward" look. */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.3 9.5h18.1c.8 0 1.38.76 1.17 1.53l-1.92 7.04A2.1 2.1 0 0 1 18.6 19.6H5.4a2.1 2.1 0 0 1-2.03-1.55L1.13 10.95A1.2 1.2 0 0 1 2.3 9.5h1Z"
      />

      {/* Symbol on the front flap, knocked out in white */}
      {symbol === 'plus' && (
        <g fill="#ffffff">
          <rect x="15.6" y="13.6" width="4.2" height="1.5" rx="0.5" />
          <rect x="17.05" y="12.15" width="1.5" height="4.2" rx="0.5" />
        </g>
      )}
      {symbol === 'minus' && (
        <rect
          x="15.6"
          y="13.6"
          width="4.2"
          height="1.5"
          rx="0.5"
          fill="#ffffff"
        />
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
