import { cn } from "@/lib/utils";

/**
 * Bộ từ vựng control dùng chung — một hình dạng nút cho cả app.
 * Nút chính: nền mực (bg-mine) như bong bóng tin của chính bạn.
 */
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-ctl " +
  "bg-mine text-on-mine text-body font-semibold transition-opacity " +
  "hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed";

export const btnOutline =
  "inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-ctl " +
  "border border-line-strong bg-transparent text-ink text-body font-medium " +
  "transition-colors hover:bg-wall-2 disabled:opacity-40 disabled:cursor-not-allowed";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-ctl " +
  "border border-owe text-owe text-body font-medium transition-colors hover:bg-owe-wash";

export const iconBtn =
  "inline-grid place-items-center w-11 h-11 shrink-0 rounded-full text-ink-2 " +
  "transition-colors hover:bg-wall-2 hover:text-ink aria-pressed:bg-wall-2 aria-pressed:text-ink";

/** Chip lọc / chọn — viên thuốc nhỏ, đang chọn thì đổ mực. */
export function chip(active: boolean) {
  return cn(
    "inline-flex items-center gap-1.5 shrink-0 min-h-11 px-3.5 rounded-full",
    "text-small font-medium border transition-colors whitespace-nowrap",
    active
      ? "bg-mine text-on-mine border-mine"
      : "bg-bubble text-ink-2 border-line hover:border-line-strong hover:text-ink",
  );
}

/** Ô nhập trong sheet */
export const field =
  "w-full rounded-ctl border border-line bg-bubble px-4 py-3 transition-colors " +
  "focus-within:border-ink";
