"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { iconBtn } from "@/lib/styles";

interface SheetShellProps {
  open: boolean;
  onClose: () => void;
  /** Tiêu đề trái — chuỗi hoặc JSX */
  header: React.ReactNode;
  children: React.ReactNode;
  /** Chân sheet dính đáy (các nút hành động) */
  footer?: React.ReactNode;
}

/**
 * Quy tắc lớp phủ duy nhất của app:
 * mobile = bottom sheet, desktop ≥1024px = side sheet phải rộng 440px.
 * AlertDialog chỉ dành cho xác nhận.
 */
export default function SheetShell({
  open,
  onClose,
  header,
  children,
  footer,
}: SheetShellProps) {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side={desktop ? "right" : "bottom"}
        showCloseButton={false}
        className={cn(
          "bg-panel text-ink p-0 gap-0 border-line shadow-sheet",
          desktop ? "w-full sm:max-w-[440px] h-full" : "max-h-[92dvh] rounded-t-sheet",
        )}
      >
        {!desktop && (
          <span
            aria-hidden
            className="mx-auto mt-2 mb-1 block w-10 h-1 rounded-full bg-line-strong"
          />
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-5 pb-6">
            <div className="flex items-start justify-between gap-3 pt-3 pb-4">
              <div className="min-w-0 flex-1">{header}</div>
              <SheetClose
                render={
                  <button type="button" aria-label="Đóng" className={cn(iconBtn, "-mr-2")}>
                    <X className="w-5 h-5" aria-hidden />
                  </button>
                }
              />
            </div>
            {children}
          </div>
        </div>

        {footer && (
          <div className="flex-none border-t border-line bg-panel px-5 pt-3 pb-safe">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
