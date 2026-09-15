"use client";

import { useEffect, useRef, useState } from "react";
import { Delete } from "lucide-react";
import SheetShell from "@/components/SheetShell";
import { cn } from "@/lib/utils";
import { field } from "@/lib/styles";

interface PinSheetProps {
  open: boolean;
  onClose: () => void;
  /** Trả về true nếu PIN đúng — luồng hash/nâng cấp vẫn nằm ở page.tsx */
  onSubmit: (pin: string) => Promise<boolean>;
  /** Chưa có admin config → lần đầu, cần đặt tên người giữ sổ */
  isFirstTime: boolean;
  adminName: string;
  onAdminNameChange: (value: string) => void;
}

const LEN = 6;

/**
 * PIN là cửa vào chế độ ghi, không phải cổng chặn.
 * Nhập bằng bàn phím số trên màn hình hoặc gõ phím 0–9 / Backspace / Delete.
 */
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

  // Giá trị hiện tại nằm trong ref: nhiều phím gõ liên tiếp trước khi React
  // render lại vẫn nối đúng vào nhau (state trong closure sẽ bị cũ).
  const pinRef = useRef("");
  const busyRef = useRef(false);

  const setPinValue = (value: string) => {
    pinRef.current = value;
    setPin(value);
  };

  const submit = async (value: string) => {
    busyRef.current = true;
    setBusy(true);
    const ok = await onSubmit(value);
    busyRef.current = false;
    setBusy(false);
    setPinValue("");
    if (!ok) setError(true);
  };

  const press = (digit: string) => {
    if (busyRef.current || pinRef.current.length >= LEN) return;
    const next = pinRef.current + digit;
    setError(false);
    setPinValue(next);
    if (next.length === LEN) void submit(next);
  };

  const backspace = () => {
    if (busyRef.current) return;
    setPinValue(pinRef.current.slice(0, -1));
    setError(false);
  };

  const clear = () => {
    if (busyRef.current) return;
    setPinValue("");
    setError(false);
  };

  // Bàn phím vật lý: 0–9, Backspace, Delete. Bỏ qua khi đang gõ trong ô tên.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        press(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
      } else if (e.key === "Delete") {
        e.preventDefault();
        clear();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
            Tên người giữ sổ
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
            onClick={clear}
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
            onClick={backspace}
            aria-label="Xóa một số"
            className={cn(keyClass, "grid place-items-center")}
          >
            <Delete aria-hidden className="w-6 h-6" strokeWidth={1.75} />
          </button>
        </div>

        <p className="text-small text-ink-3 text-center mt-3">
          Có thể gõ số trực tiếp từ bàn phím.
        </p>
      </div>
    </SheetShell>
  );
}
