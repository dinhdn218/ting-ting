"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { money, signed } from "@/lib/ledgerSelectors";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface MoneyProps {
  value: number;
  /** 'out' thêm dấu −, 'in' thêm dấu +, bỏ trống thì không dấu */
  direction?: "out" | "in";
  /** Lăn từng chữ số khi giá trị realtime đổi — chỉ cho con số chủ đạo */
  animate?: boolean;
  className?: string;
}

/**
 * Mọi con số tiền đi qua đây (tabular-nums) nên các cột tiền luôn thẳng hàng.
 * animate: mỗi chữ số là một dải 0–9 dịch đúng từng nấc dòng, vượt nhẹ rồi dừng
 * — số đổi thì lăn, không mờ dần.
 */
export default function Money({
  value,
  direction,
  animate = false,
  className,
}: MoneyProps) {
  const reduced = useReducedMotion();
  const text = direction ? signed(value, direction) : money(value);

  if (!animate || reduced) {
    return <span className={cn("tnum", className)}>{text}</span>;
  }

  const chars = text.split("");
  return (
    <span className={cn("tnum inline-flex items-baseline", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex items-baseline">
        {chars.map((c, i) => {
          // Khóa theo vị trí tính từ phải: hàng đơn vị luôn là cùng một cột
          const key = chars.length - i;
          if (!/\d/.test(c)) return <span key={key}>{c}</span>;
          return (
            <span key={key} className="roll-digit">
              <span
                className="roll-strip"
                style={{ transform: `translateY(-${Number(c)}em)` }}
              >
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
