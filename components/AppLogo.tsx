/**
 * Logo Ting Ting — cùng hình với favicon (app/icon.svg): nền vàng tin ghim,
 * bong bóng chat mực, ✓ đã trả. Vẽ bằng token màu nên đi theo theme.
 */
export default function AppLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <rect width="64" height="64" rx="16" className="fill-pin" />
      <path
        d="M23 14h18a11 11 0 0 1 11 11v8a11 11 0 0 1-11 11H29l-9 7v-7.6A11 11 0 0 1 12 33v-8a11 11 0 0 1 11-11z"
        className="fill-on-pin"
      />
      <path
        d="M23.5 29.5l5.5 5.5 11.5-11.5"
        fill="none"
        className="stroke-pin"
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
