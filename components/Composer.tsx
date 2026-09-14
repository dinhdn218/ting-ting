"use client";

import { Plus, QrCode, SendHorizontal, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { btnOutline, btnPrimary } from "@/lib/styles";

export type ComposerKind = "compose" | "pay" | "qr" | "login";

interface ComposerProps {
  kind: ComposerKind;
  label: string;
  onClick: () => void;
}

/**
 * Đáy màn trò chuyện = HÀNH ĐỘNG. Admin thấy ô soạn tin "Ghi khoản mới…",
 * người còn nợ thấy nút Trả kèm đúng số tiền.
 */
export default function Composer({ kind, label, onClick }: ComposerProps) {
  return (
    <div className="flex-none border-t border-line bg-panel px-3 sm:px-4 pt-2.5 pb-safe no-print">
      <div className="mx-auto w-full max-w-[720px] lg:max-w-[1280px]">
        {kind === "compose" ? (
          <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center gap-2.5 min-h-12 pl-4 pr-1.5 rounded-full
                       border border-line-strong bg-bubble text-left transition-colors
                       hover:border-ink-3"
          >
            <Plus aria-hidden className="w-5 h-5 text-ink-2" />
            <span className="flex-1 text-body text-ink-3">{label}</span>
            <span
              aria-hidden
              className="grid place-items-center w-9 h-9 rounded-full bg-mine text-on-mine"
            >
              <SendHorizontal className="w-4 h-4" />
            </span>
          </button>
        ) : kind === "login" ? (
          <button type="button" onClick={onClick} className={cn(btnOutline, "w-full")}>
            <ShieldCheck aria-hidden className="w-[18px] h-[18px]" />
            {label}
          </button>
        ) : (
          // "qr" là lối phụ khi tin ghim đã có nút Trả — một hành động mạnh duy nhất
          <button
            type="button"
            onClick={onClick}
            className={cn(kind === "pay" ? btnPrimary : btnOutline, "w-full tnum")}
          >
            <QrCode aria-hidden className="w-[18px] h-[18px]" />
            {label}
          </button>
        )}
      </div>
    </div>
  );
}
