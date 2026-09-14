"use client";

import { useState } from "react";
import { Delete } from "lucide-react";
import SheetShell from "@/components/SheetShell";
import { cn } from "@/lib/utils";
import { field } from "@/lib/styles";

interface PinSheetProps {
  open: boolean;
  onClose: () => void;
  /** Trả về true nếu PIN đúng — luồng hash/nâng cấp vẫn nằm ở page.tsx */
  onSubmit: (pin: string) => Promise<boolean>;
  /** Chưa có admin config → lần đầu, cần đặt tên người ứng tiền */
  isFirstTime: boolean;
  adminName: string;
  onAdminNameChange: (value: string) => void;
}

const LEN = 6;

/** PIN là cửa vào chế độ ghi, không phải cổng chặn. */
export default function PinSheet({
  open,
  onClose,
  onSubmit,
  isFirstTime,
  adminName,
  onAdminNameChange,
}: PinSheetProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const press = async (digit: string) => {
    if (busy || pin.length >= LEN) return;
    const next = pin + digit;
    setError(false);
    setPin(next);

    if (next.length === LEN) {
      setBusy(true);
      const ok = await onSubmit(next);
      setBusy(false);
      setPin("");
      if (!ok) setError(true);
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const keyClass =
    "min-h-14 rounded-ctl bg-bubble border border-line text-[22px] font-medium tnum " +
    "text-ink transition-colors hover:bg-wall-2 active:bg-wall-2 disabled:opacity-40";

  return (
    <SheetShell
      open={open}
      onClose={onClose}
      header={
        <div>
          <h2 className="text-head font-semibold">
            {isFirstTime ? "Tạo mã quản trị" : "Đăng nhập quản trị"}
          </h2>
          <p className="text-body text-ink-2 mt-1 max-w-[38ch]">
            {isFirstTime
              ? "Đặt mã 6 số cho người giữ sổ. Người xem không cần mã này."
              : "Chỉ cần khi bạn muốn ghi hoặc sửa khoản chi. Xem thì không cần."}
          </p>
        </div>
      }
    >
      {isFirstTime && (
        <div className="border-t border-line pt-4 mb-5">
          <label htmlFor="admin-name" className="block text-small font-medium text-ink-2 mb-1.5">
            Tên người ứng tiền
          </label>
          <div className={field}>
            <input
              id="admin-name"
              type="text"
              value={adminName}
              onChange={(e) => onAdminNameChange(e.target.value)}
              placeholder="Minh"
              className="w-full bg-transparent text-row outline-none"
            />
          </div>
        </div>
      )}

      <div className="border-t border-line pt-5">
        <div className="flex gap-2" aria-label={`Đã nhập ${pin.length} trên ${LEN} số`}>
          {Array.from({ length: LEN }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              className={cn(
                "flex-1 h-14 grid place-items-center rounded-ctl border-2 bg-bubble transition-colors",
                error ? "border-owe" : i === pin.length ? "border-ink" : "border-line",
              )}
            >
              {i < pin.length && <span className="w-3 h-3 rounded-full bg-ink" />}
            </div>
          ))}
        </div>

        <div aria-live="polite" className="text-small font-medium text-owe mt-3 min-h-5">
          {error ? "Mã PIN chưa đúng — thử lại nhé." : ""}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {keys.map((k) => (
            <button key={k} type="button" onClick={() => press(k)} disabled={busy} className={keyClass}>
              {k}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setPin("");
              setError(false);
            }}
            aria-label="Xóa hết"
            className={cn(keyClass, "text-body font-semibold text-ink-2")}
          >
            Xóa
          </button>
          <button type="button" onClick={() => press("0")} disabled={busy} className={keyClass}>
            0
          </button>
          <button
            type="button"
            onClick={() => {
              setPin((p) => p.slice(0, -1));
              setError(false);
            }}
            aria-label="Xóa một số"
            className={cn(keyClass, "grid place-items-center")}
          >
            <Delete aria-hidden className="w-6 h-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </SheetShell>
  );
}
