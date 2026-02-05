import React from 'react';

interface IconProps {
  className?: string;
}

export function AddItemAboveIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Up arrow */}
      <path d="M12 3 L6 9 L9 9 L9 12 L15 12 L15 9 L18 9 Z" fill="currentColor" stroke="none" />
      {/* Document/item below */}
      <rect x="4" y="14" width="16" height="7" rx="1" />
    </svg>
  );
}

export function AddItemBelowIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Document/item on top */}
      <rect x="4" y="3" width="16" height="7" rx="1" />
      {/* Down arrow */}
      <path d="M12 21 L6 15 L9 15 L9 12 L15 12 L15 15 L18 15 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
