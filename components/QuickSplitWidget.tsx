"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Clock, Search, SendHorizontal, UserPlus, Users, X } from "lucide-react";
import type { Activity, ActivityCategory, Participant } from "@/types";
import type { FrequentGroup } from "@/lib/ledgerSelectors";
import { money, plain } from "@/lib/ledgerSelectors";
import { cn, foldVi } from "@/lib/utils";
import { btnPrimary, field } from "@/lib/styles";
import { CategoryIcon, labelOf } from "@/components/CategoryMark";
import SheetShell from "@/components/SheetShell";
import BillBubble from "@/components/BillBubble";

type SplitMode = "equal" | "percentage" | "exact";

export interface PastTitle {
  title: string;
  category?: ActivityCategory;
}

interface QuickSplitWidgetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
  /** Người trong sổ, ĐÃ xếp theo mức liên quan (hay đi cùng lên trước) */
  existingParticipants: string[];
  /** Các nhóm người đi cùng nhau lặp lại — chip chọn cả nhóm một chạm */
  frequentGroups?: FrequentGroup[];
  /** Nội dung các khoản đã ghi — gợi ý khi gõ, chọn thì điền sẵn danh mục */
  pastTitles: PastTitle[];
  /** Người gửi tin trong bản xem trước. Không tự thêm vào danh sách chia. */
  payerName: string;
}

/**
 * Người ghi sổ. Khi Định có trong danh sách chia, phần của Định được tick
 * "đã trả" sẵn lúc lưu; người khác thì không (người dùng chọn, 15/9/2026).
 */
const OWNER_NAME = "Định";
// Chuẩn hóa NFC: "Định" gõ từ bàn phím khác nhau có thể là dựng sẵn hoặc tổ hợp
const isOwner = (name: string) => name.trim().normalize("NFC") === OWNER_NAME.normalize("NFC");

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

/** "2026-09-15T21:30" theo giờ máy — giá trị của <input type="datetime-local"> */
function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

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
  frequentGroups = [],
  pastTitles,
  payerName,
}: QuickSplitWidgetProps) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("dining");
  const [when, setWhen] = useState(() => toLocalInput(new Date()));
  const [mode, setMode] = useState<SplitMode>("equal");
  const [picked, setPicked] = useState<string[]>([]);
  const [shares, setShares] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [extra, setExtra] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const roster = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const n of [...existingParticipants, ...extra]) {
      const name = n.trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      out.push(name);
    }
    return out;
  }, [existingParticipants, extra]);

  const total = parseInt(amount || "0", 10) || 0;
  const count = picked.length;

  const whenDate = new Date(when);
  const whenValid = !Number.isNaN(whenDate.getTime());
  const whenIso = whenValid ? whenDate.toISOString() : new Date().toISOString();

  /* ---- tìm người tham gia (không dấu) ------------------------------------ */
  const q = foldVi(query.trim());
  const shown = q ? roster.filter((n) => foldVi(n).includes(q)) : roster;
  const exact = !!q && roster.some((n) => foldVi(n) === q);

  /**
   * Sổ 37 người mà một khoản chỉ 3–6 người: bày hết là bắt cuộn vô ích.
   * Cắt còn 8 người liên quan nhất; đang tìm hoặc đã bấm "xem tất cả" thì
   * hiện đủ. Người đã tick luôn thấy ở hàng chip phía trên nên không lạc.
   */
  const CUT = 8;
  const collapsed = !q && !showAll && shown.length > CUT;
  const visible = collapsed ? shown.slice(0, CUT) : shown;
  const hiddenCount = shown.length - visible.length;

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
        : !whenValid
          ? "Chọn thời gian diễn ra"
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

  const pick = (name: string) =>
    setPicked((prev) => (prev.includes(name) ? prev : [...prev, name]));

  const addPerson = (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    const existing = roster.find((n) => foldVi(n) === foldVi(name));
    if (existing) {
      pick(existing);
    } else {
      setExtra((prev) => [...prev, name]);
      pick(name);
    }
    setQuery("");
  };

  const onQueryEnter = () => {
    if (!q) return;
    if (shown.length === 1) {
      pick(shown[0]);
      setQuery("");
    } else if (!exact) {
      addPerson(query);
    }
  };

  const onTitleChange = (value: string) => {
    setTitle(value);
    const hit = pastTitles.find((t) => t.title === value);
    if (hit?.category) setCategory(hit.category);
  };

  const buildParticipants = (): Participant[] =>
    picked.map((name) => {
      const base: Participant = { name, paid: isOwner(name) };
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
    date: whenIso,
    category,
    participants: buildParticipants(),
  };

  const save = () => {
    if (!canSave) return;
    onAdd({ ...preview, id: Date.now().toString(), title: title.trim() });
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

        {/* 2. Nội dung — gợi ý từ các khoản đã ghi */}
        <div>
          <label htmlFor="split-title" className={label}>
            Nội dung
          </label>
          <div className={field}>
            <input
              id="split-title"
              type="text"
              list="split-title-suggest"
              autoComplete="off"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Lẩu Kỳ Đồng"
              className="w-full bg-transparent text-row outline-none"
            />
            <datalist id="split-title-suggest">
              {pastTitles.map((t) => (
                <option key={t.title} value={t.title} />
              ))}
            </datalist>
          </div>
        </div>

        {/* 3. Thời gian diễn ra — mặc định lúc mở form; lịch có sẵn "Hôm nay" */}
        <div>
          <label htmlFor="split-when" className={label}>
            Thời gian diễn ra
          </label>
          <div className={cn(field, "flex items-center gap-2 py-2.5")}>
            <Clock aria-hidden className="w-4 h-4 text-ink-3 shrink-0" />
            <input
              id="split-when"
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-body tnum outline-none"
            />
          </div>
        </div>

        {/* 4. Danh mục — 2 hàng × 3 */}
        <fieldset>
          <legend className={label}>Danh mục</legend>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => {
              const on = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={on}
                  className={cn(
                    "flex items-center justify-center gap-2 min-h-12 px-2 rounded-ctl border",
                    "text-small font-medium whitespace-nowrap transition-colors",
                    on
                      ? "bg-mine text-on-mine border-mine"
                      : "bg-bubble text-ink-2 border-line hover:border-line-strong hover:text-ink",
                  )}
                >
                  <CategoryIcon category={c} className="w-[18px] h-[18px] shrink-0" />
                  {labelOf(c)}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 5. Chia cho */}
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

          {/* Đã chọn — luôn thấy, kể cả khi danh sách đang lọc */}
          {picked.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3" aria-label="Người đã chọn">
              {picked.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggle(name)}
                  aria-label={`Bỏ ${name}`}
                  className="inline-flex items-center gap-1 min-h-9 pl-3 pr-2 rounded-full bg-mine
                             text-on-mine text-small font-medium hover:opacity-90"
                >
                  {name}
                  <X aria-hidden className="w-3.5 h-3.5 text-on-mine-2" />
                </button>
              ))}
            </div>
          )}

          {/* Nhóm hay đi cùng — một chạm chọn cả nhóm, đỡ tick từng người */}
          {frequentGroups.length > 0 && picked.length === 0 && (
            <div className="mt-3">
              <p className="text-small text-ink-3 mb-1.5">Nhóm hay đi cùng</p>
              <div className="flex flex-wrap gap-1.5">
                {frequentGroups.map((g) => (
                  <button
                    key={g.names.join(" ")}
                    type="button"
                    onClick={() => setPicked(g.names)}
                    className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-full
                               border border-line bg-bubble text-small text-ink-2
                               hover:border-line-strong hover:text-ink transition-colors"
                  >
                    <Users aria-hidden className="w-3.5 h-3.5 shrink-0 text-ink-3" />
                    <span className="truncate max-w-45">
                      {g.names.slice(0, 2).join(", ")}
                      {g.names.length > 2 && ` +${g.names.length - 2}`}
                    </span>
                    <span className="tnum text-meta text-ink-3">· {g.names.length}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tìm hoặc thêm người */}
          <div className={cn(field, "mt-3 py-2 flex items-center gap-2")}>
            <Search aria-hidden className="w-4 h-4 text-ink-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onQueryEnter();
                }
              }}
              placeholder={`Tìm hoặc thêm người · ${roster.length} trong sổ`}
              aria-label="Tìm hoặc thêm người tham gia"
              className="flex-1 min-w-0 bg-transparent text-body outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Xóa chữ tìm"
                className="min-h-0 w-8 h-8 grid place-items-center rounded-full text-ink-3 hover:text-ink"
              >
                <X aria-hidden className="w-4 h-4" />
              </button>
            )}
          </div>

          <ul className="mt-1">
            {q && !exact && (
              <li className="border-b border-line">
                <button
                  type="button"
                  onClick={() => addPerson(query)}
                  className="w-full flex items-center gap-3 min-h-12 text-left text-body font-medium"
                >
                  <UserPlus aria-hidden className="w-5 h-5 text-ink-2" />
                  Thêm “{query.trim()}” vào khoản này
                </button>
              </li>
            )}
            {visible.map((name) => {
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
                      {isOwner(name) && (
                        <span className="text-small text-paid"> · tự tick đã trả</span>
                      )}
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
          {collapsed && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-full min-h-11 flex items-center justify-center gap-1.5
                         text-small font-semibold text-ink-2 hover:text-ink transition-colors"
            >
              <ChevronDown aria-hidden className="w-4 h-4" />
              Xem tất cả {shown.length} người
              <span className="tnum font-normal text-ink-3">· còn {hiddenCount}</span>
            </button>
          )}
          {q && shown.length === 0 && exact === false && (
            <p className="text-small text-ink-3 mt-2">Chưa có ai tên này trong sổ — Enter để thêm.</p>
          )}

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

        {/* 6. Xem trước đúng tin sẽ gửi */}
        <div>
          <p className={label}>Xem trước tin sẽ gửi</p>
          <div className="rounded-[16px] bg-wall p-3">
            <BillBubble activity={preview} me={null} payerName={payerName} />
          </div>
        </div>
      </div>
    </SheetShell>
  );
}
