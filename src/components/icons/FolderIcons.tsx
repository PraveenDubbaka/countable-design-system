import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Solid navy folder icon (closed/normal state).
 * Matches the reference: chunky, filled, slightly tilted front flap.
 */
export function FolderSolidIcon({ className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Back tab */}
      <path d="M2.5 6.25A1.75 1.75 0 0 1 4.25 4.5h4.4c.46 0 .9.18 1.23.51l1.4 1.4c.14.14.33.21.53.21H19.5A1.75 1.75 0 0 1 21.25 8.37v1.13H2.5V6.25Z" />
      {/* Main body */}
      <path d="M2.5 10.5h18.75v7.75A1.75 1.75 0 0 1 19.5 20H4.25a1.75 1.75 0 0 1-1.75-1.75V10.5Z" />
    </svg>
  );
}

/**
 * Solid navy folder with a plus symbol cut out (expandable/add state).
 */
export function FolderPlusIcon({ className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 4.5A1.75 1.75 0 0 0 2.5 6.25v12A1.75 1.75 0 0 0 4.25 20H19.5a1.75 1.75 0 0 0 1.75-1.75V8.37A1.75 1.75 0 0 0 19.5 6.62h-7.69a.75.75 0 0 1-.53-.22l-1.4-1.39a1.75 1.75 0 0 0-1.23-.51h-4.4Zm12.5 9.25a.75.75 0 0 0-.75-.75h-2.25V10.75a.75.75 0 0 0-1.5 0V13h-2.25a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0V14.5H16a.75.75 0 0 0 .75-.75Z"
      />
    </svg>
  );
}

/**
 * Solid navy folder with a minus symbol cut out (collapsible state).
 */
export function FolderMinusIcon({ className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 4.5A1.75 1.75 0 0 0 2.5 6.25v12A1.75 1.75 0 0 0 4.25 20H19.5a1.75 1.75 0 0 0 1.75-1.75V8.37A1.75 1.75 0 0 0 19.5 6.62h-7.69a.75.75 0 0 1-.53-.22l-1.4-1.39a1.75 1.75 0 0 0-1.23-.51h-4.4Zm12.5 9.25a.75.75 0 0 0-.75-.75h-6a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75Z"
      />
    </svg>
  );
}
