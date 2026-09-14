"use client";

import { useMemo, useState } from "react";
import { Check, SendHorizontal, UserPlus } from "lucide-react";
import type { Activity, ActivityCategory, Participant } from "@/types";
import { money, plain } from "@/lib/ledgerSelectors";
import { cn } from "@/lib/utils";
import { btnPrimary, field } from "@/lib/styles";
import { iconOf, labelOf } from "@/components/CategoryMark";
import SheetShell from "@/components/SheetShell";
import BillBubble from "@/components/BillBubble";

type SplitMode = "equal" | "percentage" | "exact";

interface QuickSplitWidgetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
  existingParticipants: string[];
  /** Người ứng tiền — luôn được tick sẵn paid khi lưu */
  payerName: string;
}

const CATEGORIES: ActivityCategory[] = [
  "dining",
  "travel",
  "bills",
  "entertainment",
  "groceries",
  "other",
];

const QUICK_ADD = [50_000, 100_000, 500_000];

const MODES: [SplitMode, string][] = [
  ["equal", "Chia đều"],
  ["percentage", "Theo %"],
  ["exact", "Số tiền"],
];

/**
 * Soạn một tin hóa đơn. Thứ tự nhập theo cách người ta nói:
 * "một triệu hai bốn, lẩu, năm người". Cuối sheet là bản xem trước ĐÚNG
 * tin sẽ gửi vào nhóm; chỉ gửi được khi "còn lại chưa chia" về 0.
 */
export default function QuickSplitWidget({
  open,
  onClose,
  onAdd,
  existingParticipants,
  payerName,
}: QuickSplitWidgetProps) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("dining");
  const [mode, setMode] = useState<SplitMode>("equal");
  const [picked, setPicked] = useState<string[]>([]);
  const [shares, setShares] = useState<Record<string, string>>({});
  const [newName, setNewName] = useState("");
  const [extra, setExtra] = useState<string[]>([]);
  const [draftDate] = useState(() => new Date().toISOString());

  const roster = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const n of [payerName, ...existingParticipants, ...extra]) {
      const name = n.trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      out.push(name);
    }
    return out;
  }, [payerName, existingParticipants, extra]);

  const total = parseInt(amount || "0", 10) || 0;
  const count = picked.length;

  /** Phần tiền của từng người theo chế độ đang chọn. */
  const shareFor = (name: string): number => {
    if (!picked.includes(name)) return 0;
    if (mode === "equal") return count ? total / count : 0;
    const raw = parseFloat(shares[name] ?? "") || 0;
    if (mode === "percentage") return (raw / 100) * total;
    return raw;
  };

  const allocated = picked.reduce((s, n) => s + shareFor(n), 0);
  const remainder = total - allocated;
  const balanced = Math.abs(remainder) < 1;

  const blocker =
    total <= 0
      ? "Nhập số tiền"
      : title.trim() === ""
        ? "Nhập nội dung khoản chi"
        : count < 1
          ? "Chọn ít nhất một người"
          : mode !== "equal" && !balanced
            ? remainder > 0
              ? `Còn ${money(remainder)} chưa chia`
              : `Đang chia dư ${money(-remainder)}`
            : null;
  const canSave = blocker === null;

  const toggle = (name: string) =>
    setPicked((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );

  const addPerson = () => {
    const name = newName.trim();
    if (!name || roster.includes(name)) {
      setNewName("");
      return;
    }
    setExtra((prev) => [...prev, name]);
    setPicked((prev) => [...prev, name]);
    setNewName("");
  };

  const buildParticipants = (): Participant[] =>
    picked.map((name) => {
      const base: Participant = { name, paid: name === payerName };
      // Chỉ ghi shareAmount cho chế độ chia riêng — chia đều dùng amountPerPerson,
      // nhờ đó splitLabel() phân biệt được "chia đều" và "chia riêng".
      if (mode !== "equal") base.shareAmount = Math.round(shareFor(name));
      return base;
    });

  const preview: Activity = {
    id: "preview",
    title: title.trim() || "Nội dung khoản chi",
    totalAmount: total,
    amountPerPerson: count ? Math.round(total / count) : 0,
    date: draftDate,
    category,
    participants: buildParticipants(),
  };

  const save = () => {
    if (!canSave) return;
    onAdd({
      ...preview,
      id: Date.now().toString(),
      title: title.trim(),
      date: new Date().toISOString(),
    });
    onClose();
  };

  const label = "block text-small font-medium text-ink-2 mb-1.5";

  return (
    <SheetShell
      open={open}
      onClose={onClose}
      header={
        <div>
          <h2 className="text-head font-semibold">Ghi khoản mới</h2>
          <p className="text-small text-ink-2 mt-0.5">Gửi vào nhóm như một tin hóa đơn.</p>
        </div>
      }
      footer={
        <div>
          {blocker && (
            <p aria-live="polite" className="text-small text-ink-2 text-center mb-2 tnum">
              {blocker}
            </p>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className={cn(btnPrimary, "w-full rounded-full")}
          >
            <SendHorizontal aria-hidden className="w-[18px] h-[18px]" />
            Gửi vào nhóm
          </button>
        </div>
      }
    >
      <div className="border-t border-line pt-4 space-y-5">
        {/* 1. Số tiền */}
        <div>
          <label htmlFor="split-amount" className={label}>
            Số tiền
          </label>
          <div className={cn(field, "flex items-baseline gap-2 py-2")}>
            <input
              id="split-amount"
              type="text"
              inputMode="numeric"
              value={total ? plain(total) : ""}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="tnum flex-1 min-w-0 bg-transparent text-fig font-semibold outline-none"
            />
            <span className="text-head text-ink-3">đ</span>
          </div>
          <div className="flex gap-2 mt-2">
            {QUICK_ADD.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(String((parseInt(amount || "0", 10) || 0) + n))}
                className="min-h-11 px-3.5 rounded-full border border-line bg-bubble text-small
                           font-medium text-ink-2 tnum hover:border-line-strong hover:text-ink transition-colors"
              >
                +{n / 1000}K
              </button>
            ))}
          </div>
        </div>

        {/* 2. Nội dung */}
        <div>
          <label htmlFor="split-title" className={label}>
            Nội dung
          </label>
          <div className={field}>
            <input
              id="split-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lẩu Kỳ Đồng"
              className="w-full bg-transparent text-row outline-none"
            />
          </div>
        </div>

        {/* 3. Danh mục */}
        <fieldset>
          <legend className={label}>Danh mục</legend>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CATEGORIES.map((c) => {
              const Icon = iconOf(c);
              const on = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={on}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 min-h-16 rounded-ctl border text-meta font-medium transition-colors",
                    on
                      ? "bg-mine text-on-mine border-mine"
                      : "bg-bubble text-ink-2 border-line hover:border-line-strong hover:text-ink",
                  )}
                >
                  <Icon aria-hidden className="w-5 h-5" strokeWidth={1.75} />
                  {labelOf(c)}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 4. Chia cho */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-small font-medium text-ink-2 tnum">Chia cho {count} người</span>
            <button
              type="button"
              onClick={() => setPicked(picked.length === roster.length ? [] : [...roster])}
              className="min-h-11 px-2 -mr-2 text-small font-semibold text-ink underline underline-offset-[3px]"
            >
              {picked.length === roster.length ? "Bỏ chọn hết" : "Chọn cả nhóm"}
            </button>
          </div>

          <div role="radiogroup" aria-label="Cách chia" className="grid grid-cols-3 gap-1 p-1 rounded-full bg-wall-2">
            {MODES.map(([key, text]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={mode === key}
                onClick={() => setMode(key)}
                className={cn(
                  "min-h-10 rounded-full text-small font-semibold transition-colors",
                  mode === key ? "bg-bubble text-ink shadow-bubble" : "text-ink-2 hover:text-ink",
                )}
              >
                {text}
              </button>
            ))}
          </div>

          <ul className="mt-2">
            {roster.map((name) => {
              const on = picked.includes(name);
              return (
                <li
                  key={name}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 min-h-14 border-b border-line"
                >
                  <button
                    type="button"
                    onClick={() => toggle(name)}
                    role="checkbox"
                    aria-checked={on}
                    className="flex items-center gap-3 min-w-0 min-h-12 text-left"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "w-6 h-6 shrink-0 grid place-items-center rounded-[7px] border transition-colors",
                        on ? "bg-mine border-mine text-on-mine" : "border-line-strong text-transparent",
                      )}
                    >
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    <span className={cn("truncate text-body", !on && "text-ink-2")}>
                      {name}
                      {name === payerName && <span className="text-ink-3"> · ứng tiền</span>}
                    </span>
                  </button>

                  {!on ? (
                    <span className="tnum text-body text-ink-3">—</span>
                  ) : mode === "equal" ? (
                    <span className="tnum text-body">{money(shareFor(name))}</span>
                  ) : (
                    <span className="flex items-baseline gap-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={shares[name] ?? ""}
                        onChange={(e) =>
                          setShares((prev) => ({
                            ...prev,
                            [name]: e.target.value.replace(/[^\d.]/g, ""),
                          }))
                        }
                        placeholder="0"
                        aria-label={`Phần của ${name}`}
                        className="tnum w-[104px] text-right bg-bubble text-body outline-none
                                   rounded-[10px] border border-line px-2.5 py-1.5 focus:border-ink"
                      />
                      <span className="text-ink-3 text-body w-3">{mode === "percentage" ? "%" : "đ"}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 pt-3">
            <div className={cn(field, "flex-1 py-2 flex items-center gap-2")}>
              <UserPlus aria-hidden className="w-4 h-4 text-ink-3 shrink-0" />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPerson();
                  }
                }}
                placeholder="Thêm người khác…"
                aria-label="Thêm người vào khoản này"
                className="flex-1 min-w-0 bg-transparent text-body outline-none"
              />
            </div>
            <button
              type="button"
              onClick={addPerson}
              className="min-h-12 px-4 rounded-ctl border border-line-strong text-body font-medium
                         text-ink hover:bg-wall-2 transition-colors"
            >
              Thêm
            </button>
          </div>

          {mode !== "equal" && (
            <div className="mt-4 pt-3.5 border-t-2 border-line-strong flex items-baseline justify-between">
              <span className="text-body font-semibold">Còn lại chưa chia</span>
              {balanced ? (
                <span className="tnum text-row font-semibold text-paid inline-flex items-center gap-1">
                  <Check aria-hidden className="w-4 h-4" strokeWidth={2.5} />
                  0đ
                </span>
              ) : (
                <span className="tnum text-row font-semibold text-owe">
                  {remainder > 0 ? "−" : "+"}
                  {money(Math.abs(remainder))}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 5. Xem trước đúng tin sẽ gửi */}
        <div>
          <p className={label}>Xem trước tin sẽ gửi</p>
          <div className="rounded-[16px] bg-wall p-3">
            <BillBubble activity={preview} me={payerName} payerName={payerName} />
          </div>
        </div>
      </div>
    </SheetShell>
  );
}
