"use client";

import { createElement } from "react";
import {
  Gamepad2,
  Plane,
  Receipt,
  ShoppingCart,
  Tag,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { ActivityCategory, CATEGORY_LABELS } from "@/types";
import { cn } from "@/lib/utils";

/** Icon danh mục — một bộ lucide, một độ dày nét, thay emoji phụ thuộc hệ điều hành. */
export const CATEGORY_ICON: Record<ActivityCategory, LucideIcon> = {
  dining: Utensils,
  travel: Plane,
  bills: Receipt,
  entertainment: Gamepad2,
  groceries: ShoppingCart,
  other: Tag,
};

export function labelOf(category?: ActivityCategory): string {
  return CATEGORY_LABELS[(category ?? "other") as ActivityCategory];
}

export function iconOf(category?: ActivityCategory): LucideIcon {
  return CATEGORY_ICON[(category ?? "other") as ActivityCategory];
}

interface CategoryMarkProps {
  category?: ActivityCategory;
  size?: 28 | 32 | 36;
  /** "mine": nằm trong bong bóng mực của chính bạn */
  tone?: "default" | "mine";
  className?: string;
}

/** Icon trần của một danh mục — tra bảng ở cấp module, không tạo component lúc render. */
export function CategoryIcon({
  category,
  className,
}: {
  category?: ActivityCategory;
  className?: string;
}) {
  return createElement(iconOf(category), {
    "aria-hidden": true,
    strokeWidth: 1.75,
    className,
  });
}

export default function CategoryMark({
  category,
  size = 32,
  tone = "default",
  className,
}: CategoryMarkProps) {
  return (
    <span
      title={labelOf(category)}
      className={cn(
        "grid place-items-center shrink-0 rounded-[10px]",
        tone === "mine" ? "bg-on-mine/12 text-on-mine" : "bg-wall-2 text-ink-2",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <CategoryIcon
        category={category}
        className={size >= 36 ? "w-[18px] h-[18px]" : "w-4 h-4"}
      />
    </span>
  );
}
