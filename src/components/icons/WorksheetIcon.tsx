export const WorksheetIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    {/* File outline */}
    <path
      d="M4.95 4C4.95 2.205 6.405 0.75 8.2 0.75H16.19L22.65 7.211V20C22.65 21.795 21.195 23.25 19.4 23.25H8.2C6.405 23.25 4.95 21.795 4.95 20V4Z"
      fill="white"
      stroke="#D0D5DD"
      strokeWidth="1.5"
    />
    <path
      d="M16.2 0.3V3.2C16.2 5.41 17.99 7.2 20.2 7.2H23.1"
      stroke="#D0D5DD"
      strokeWidth="1.5"
    />
    {/* Green spreadsheet badge */}
    <rect x="0.3" y="10.6" width="18" height="10" rx="2" fill="#12B76A" />
    {/* Grid lines horizontal */}
    <line x1="0.3" y1="14.1" x2="18.3" y2="14.1" stroke="white" strokeWidth="0.8" strokeOpacity="0.5" />
    <line x1="0.3" y1="17.1" x2="18.3" y2="17.1" stroke="white" strokeWidth="0.8" strokeOpacity="0.5" />
    {/* Grid lines vertical */}
    <line x1="6.3" y1="10.6" x2="6.3" y2="20.6" stroke="white" strokeWidth="0.8" strokeOpacity="0.5" />
    <line x1="12.3" y1="10.6" x2="12.3" y2="20.6" stroke="white" strokeWidth="0.8" strokeOpacity="0.5" />
    {/* "XL" text */}
    <text x="1.8" y="19.2" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="5.5" fill="white">XL</text>
  </svg>
);
