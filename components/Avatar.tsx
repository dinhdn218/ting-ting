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

/** Chữ tắt tròn — như ảnh đại diện trong nhóm chat. Bạn = vàng, người ứng tiền = mực. */
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

/** Ảnh nhóm: hai chữ tắt xếp chéo, như ảnh đại diện nhóm chat chưa đặt ảnh. */
export function AvatarStack({ names }: { names: string[] }) {
  const shown = names.slice(0, 2);
  if (shown.length < 2) {
    return <Avatar name={shown[0] ?? "SC"} size="md" tone="payer" />;
  }
  // Hai chữ tắt 26px trong ô 44px: chồng nhau đúng 8px ở góc, không nhãn nào bị che
  return (
    <span aria-hidden className="relative block w-11 h-11 shrink-0">
      <Avatar
        name={shown[0]}
        size="xs"
        tone="payer"
        className="absolute left-0 top-0 w-[26px] h-[26px] ring-2 ring-panel"
      />
      <Avatar
        name={shown[1]}
        size="xs"
        tone="me"
        className="absolute right-0 bottom-0 w-[26px] h-[26px] ring-2 ring-panel"
      />
    </span>
  );
}
