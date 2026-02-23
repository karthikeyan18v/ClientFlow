"use client";
export default function KSSLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="kss-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#kss-grad)" />
      {/* K */}
      <path d="M8 12h2.5v6l4-6h3l-4.5 6 5 8h-3l-3.5-6-1 1.5V26H8V12z" fill="white" />
      {/* S1 */}
      <path d="M22 18.5c0-1.1.9-2 2-2h2c.6 0 1-.4 1-1s-.4-1-1-1h-3v-2h3c1.7 0 3 1.3 3 3s-1.3 3-3 3h-2c-.6 0-1 .4-1 1s.4 1 1 1h3v2h-3c-1.7 0-3-1.3-3-3z" fill="white" />
    </svg>
  );
}
