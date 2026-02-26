interface WordDocIconProps {
  className?: string;
}

export const WordDocIcon = ({ className }: WordDocIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 2C2 0.895 2.895 0 4 0H9L14 5V14C14 15.105 13.105 16 12 16H4C2.895 16 2 15.105 2 14V2Z" fill="#4285F4" />
    <path d="M9 0L14 5H11C9.895 5 9 4.105 9 3V0Z" fill="#A1C4FD" />
    <path d="M5.2 8H6.1L7 11.2L7.9 8H8.8L7.4 13H6.6L5.7 9.8L4.8 13H4L2.6 8H3.5L4.4 11.2L5.2 8Z" fill="white" />
  </svg>
);
