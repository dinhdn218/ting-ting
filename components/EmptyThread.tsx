"use client";

import { BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { btnPrimary } from "@/lib/styles";

interface EmptyThreadProps {
  isAdmin: boolean;
  onAdd: () => void;
}

/** Nhóm chưa có khoản nào — một tin hệ thống dạy cách đọc màn này. */
export default function EmptyThread({ isAdmin, onAdd }: EmptyThreadProps) {
  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-10">
      <div className="mx-auto max-w-[440px] rounded-bubble border border-line bg-panel px-5 py-6 text-center">
        <BookOpen aria-hidden className="w-6 h-6 text-ink-3 mx-auto" />
        <h2 className="text-row font-semibold mt-2">Nhóm chưa có khoản nào</h2>
        <p className="text-body text-ink-2 mt-1.5">
          Mỗi khoản người ứng tiền ghi sẽ hiện ở đây như một tin nhắn. Cả nhóm mở link là thấy,
          không cần đăng nhập.
        </p>
        {isAdmin && (
          <button type="button" onClick={onAdd} className={cn(btnPrimary, "mt-5 rounded-full")}>
            <Plus aria-hidden className="w-[18px] h-[18px]" />
            Ghi khoản đầu tiên
          </button>
        )}
      </div>
    </div>
  );
}
