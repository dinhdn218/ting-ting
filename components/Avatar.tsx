"use client";

import { cn } from "@/lib/utils";
import { initials } from "@/lib/ledgerSelectors";

type Tone = "default" | "me" | "payer";
type Size = "xs" | "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-[11px]",
  md: "w-10 h-10 text-small",
  lg: "w-14 h-14 text-row",
};

const TONES: Record<Tone, string> = {
  default: "bg-wall-2 text-ink",
  me: "bg-pin text-on-pin",
  payer: "bg-mine text-on-mine",
};

/** Chữ tắt tròn — như ảnh đại diện trong nhóm chat. Bạn = vàng, Ting Ting = mực. */
export default function Avatar({
  name,
  tone = "default",
  size = "md",
  className,
}: {
  name: string;
  tone?: Tone;
  size?: Size;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid place-items-center shrink-0 rounded-full font-semibold select-none",
        SIZES[size],
        TONES[tone],
        className,
      )}
    >
      {initials(name || "?")}
    </span>
  );
}
