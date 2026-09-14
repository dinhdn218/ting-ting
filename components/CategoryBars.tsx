"use client";

import type { CategoryShare } from "@/lib/ledgerSelectors";
import { money } from "@/lib/ledgerSelectors";
import { cn } from "@/lib/utils";
import { iconOf, labelOf } from "@/components/CategoryMark";

/**
 * Chi theo danh mục: một chuỗi số → thanh ngang xếp giảm dần, MỘT màu,
 * nhãn trực tiếp (tên · số tiền · %). Chữ luôn là màu chữ, không phải màu thanh.
 * Bản thân danh sách là "bảng dữ liệu" nên không cần bảng riêng.
 */
export default function CategoryBars({
  items,
  className,
}: {
  items: CategoryShare[];
  className?: string;
}) {
  if (items.length === 0) return null;
  const max = Math.max(...items.map((i) => i.amount), 1);

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((i) => {
        const Icon = iconOf(i.category);
        return (
          <li
            key={i.category}
            title={`${labelOf(i.category)} · ${money(i.amount)} · ${i.pct}%`}
            className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1.5"
          >
            <Icon aria-hidden strokeWidth={1.75} className="w-[18px] h-[18px] text-ink-3" />
            <span className="text-small text-ink truncate">
              {labelOf(i.category)}
              <span className="text-ink-3"> · {i.count} khoản</span>
            </span>
            <span className="text-small tnum text-ink whitespace-nowrap">
              {money(i.amount)}
              <span className="text-ink-3 inline-block w-11 text-right">{i.pct}%</span>
            </span>
            <span aria-hidden className="col-start-2 col-span-2 block h-1.5">
              <span
                className="block h-full rounded-l-[2px] rounded-r-[4px] bg-ink-2"
                style={{ width: `${Math.max(1.5, (i.amount / max) * 100)}%` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
