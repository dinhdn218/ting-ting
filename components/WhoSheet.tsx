"use client";

import { useMemo, useState } from "react";
import { Check, Search, UserX, X } from "lucide-react";
import { cn, foldVi } from "@/lib/utils";
import { btnOutline } from "@/lib/styles";
import SheetShell from "@/components/SheetShell";
import Avatar from "@/components/Avatar";

interface WhoSheetProps {
  open: boolean;
  onClose: () => void;
  roster: string[];
  me: string | null;
  onPick: (name: string) => void;
  /** Về trạng thái chưa chọn ai (xem chung cả nhóm) */
  onClear: () => void;
}

/** Chọn "Bạn là ai" từ cả nhóm: tìm không dấu, danh sách cuộn được hết, bỏ chọn được. */
export default function WhoSheet({ open, onClose, roster, me, onPick, onClear }: WhoSheetProps) {
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = foldVi(query.trim());
    return roster
      .slice()
      .sort((a, b) => a.localeCompare(b, "vi"))
      .filter((n) => !q || foldVi(n).includes(q));
  }, [roster, query]);

  const pick = (name: string) => {
    onPick(name);
    onClose();
  };

  return (
    <SheetShell
      open={open}
      onClose={onClose}
      header={
        <div>
          <h2 className="text-head font-semibold">Bạn là ai trong nhóm?</h2>
          <p className="text-small text-ink-2 mt-0.5">
            Chọn tên để thấy số của bạn. Lưu trên máy này, đổi lúc nào cũng được.
          </p>
        </div>
      }
      footer={
        me ? (
          <button
            type="button"
            onClick={() => {
              onClear();
              onClose();
            }}
            className={cn(btnOutline, "w-full")}
          >
            <UserX aria-hidden className="w-[18px] h-[18px]" />
            Bỏ chọn — xem chung cả nhóm
          </button>
        ) : undefined
      }
    >
      <label
        className="flex items-center gap-2 min-h-11 pl-3.5 pr-1 rounded-full bg-wall-2
                   focus-within:ring-2 focus-within:ring-ink"
      >
        <Search aria-hidden className="w-4 h-4 shrink-0 text-ink-3" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && list.length === 1) pick(list[0]);
          }}
          placeholder={`Tìm trong ${roster.length} người…`}
          aria-label="Tìm tên của bạn"
          className="flex-1 min-w-0 bg-transparent outline-none text-body
                     [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Xóa chữ tìm"
            className="min-h-0 w-9 h-9 grid place-items-center rounded-full text-ink-3 hover:text-ink"
          >
            <X aria-hidden className="w-4 h-4" />
          </button>
        )}
      </label>

      <ul className="mt-2">
        {list.map((name) => {
          const current = name === me;
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => pick(name)}
                aria-current={current || undefined}
                className={cn(
                  "w-full flex items-center gap-3 min-h-14 py-2 border-b border-line text-left",
                  "transition-colors hover:bg-wall-2/60 -mx-2 px-2 rounded-ctl",
                )}
              >
                <Avatar name={name} size="sm" tone={current ? "me" : "default"} />
                <span className="flex-1 min-w-0 truncate text-body font-medium">{name}</span>
                {current && (
                  <span className="inline-flex items-center gap-1 text-small font-semibold text-ink-2">
                    <Check aria-hidden className="w-4 h-4" />
                    Đang chọn
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {list.length === 0 && (
        <p className="text-body text-ink-2 text-center mt-6">
          Không có ai tên “{query.trim()}” trong sổ.
        </p>
      )}
    </SheetShell>
  );
}
