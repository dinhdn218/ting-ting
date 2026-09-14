"use client";

import { Check, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Trạng thái đã trả / chưa trả. Phân biệt bằng 3 tầng, không chỉ màu:
 * chữ · icon (✓ vs vòng gạch) · nền đặc vs viền gạch.
 */
interface PaidMarkProps {
  paid: boolean;
  /** Admin tick được → <button>; người xem → <span> */
  onTick?: () => void;
  ariaLabel?: string;
  /** Vừa đổi trạng thái → ✓ bật lên */
  justTicked?: boolean;
  className?: string;
}

export default function PaidMark({
  paid,
  onTick,
  ariaLabel,
  justTicked,
  className,
}: PaidMarkProps) {
  const inner = (
    <>
      {paid ? (
        <Check
          aria-hidden
          strokeWidth={2.5}
          className={cn("w-3.5 h-3.5", justTicked && "anim-tick")}
        />
      ) : (
        <CircleDashed aria-hidden className="w-3.5 h-3.5" />
      )}
      <span>{paid ? "Đã trả" : "Chưa trả"}</span>
    </>
  );

  const shape = cn(
    "inline-flex items-center justify-center gap-1.5 rounded-full px-3",
    "text-small font-semibold whitespace-nowrap",
    paid
      ? "bg-paid-wash text-paid border border-transparent"
      : "text-owe border border-dashed border-owe/70",
    className,
  );

  if (onTick) {
    return (
      <button
        type="button"
        onClick={onTick}
        aria-pressed={paid}
        aria-label={ariaLabel}
        className={cn(shape, "min-h-11 min-w-[108px] transition-colors hover:border-solid")}
      >
        {inner}
      </button>
    );
  }

  return <span className={cn(shape, "min-h-8")}>{inner}</span>;
}
