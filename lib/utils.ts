import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"
import type { Activity, Participant } from "@/types"

/**
 * tailwind-merge phải biết các token riêng trong globals.css (@theme inline).
 * Nếu không, nó coi text-body là MÀU chữ và xóa mất text-on-mine khi gộp class
 * (hoặc ngược lại xóa mất cỡ chữ) — nút chữ tối trên nền tối.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["meta", "small", "body", "row", "head", "fig", "hero"],
      radius: ["ctl", "bubble", "sheet"],
      shadow: ["bubble", "sheet"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Bỏ dấu tiếng Việt + chữ thường — để "huyen" tìm ra "Chị Huyền". */
export function foldVi(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
}

/**
 * The amount a single participant owes for an activity.
 * Honours per-person `shareAmount` (set by percentage/exact splits) and
 * falls back to the equal-split `amountPerPerson` for older/equal records.
 */
export function shareOf(activity: Activity, participant: Participant): number {
  return participant.shareAmount ?? activity.amountPerPerson
}
