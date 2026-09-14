"use client";

import { Calendar, Search, X } from "lucide-react";
import type { Activity, ActivityCategory } from "@/types";
import type { ActivityFilter, StatusFilter } from "@/lib/ledgerSelectors";
import { EMPTY_FILTER, hasFilter, money } from "@/lib/ledgerSelectors";
import { cn } from "@/lib/utils";
import { chip } from "@/lib/styles";
import { iconOf, labelOf } from "@/components/CategoryMark";

const CATEGORIES: ActivityCategory[] = [
  "dining",
  "travel",
  "bills",
  "entertainment",
  "groceries",
  "other",
];

const STATUSES: [StatusFilter, string][] = [
  ["all", "Tất cả"],
  ["unpaid", "Còn người chưa trả"],
  ["paid", "Đã thu đủ"],
];

interface FilterBarProps {
  filter: ActivityFilter;
  onChange: (f: ActivityFilter) => void;
  onClose: () => void;
  all: Activity[];
  shownCount: number;
  shownSum: number;
}

/** Tìm trong đoạn chat: chữ, trạng thái, danh mục, ngày. */
export default function FilterBar({
  filter,
  onChange,
  onClose,
  all,
  shownCount,
  shownSum,
}: FilterBarProps) {
  const set = (patch: Partial<ActivityFilter>) => onChange({ ...filter, ...patch });

  const counts = new Map<ActivityCategory, number>();
  for (const a of all) {
    const c = (a.category ?? "other") as ActivityCategory;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }

  return (
    <div className="flex-none border-b border-line bg-panel">
      <div className="mx-auto w-full max-w-[720px] px-3 sm:px-4 py-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center gap-2 min-h-11 pl-3.5 pr-1 rounded-full bg-wall-2
                            focus-within:ring-2 focus-within:ring-ink">
            <Search aria-hidden className="w-4 h-4 shrink-0 text-ink-3" />
            <input
              autoFocus
              type="search"
              value={filter.query}
              onChange={(e) => set({ query: e.target.value })}
              placeholder="Tìm khoản chi, tên người…"
              aria-label="Tìm khoản chi hoặc tên người"
              className="flex-1 min-w-0 bg-transparent outline-none text-body
                         [&::-webkit-search-cancel-button]:hidden"
            />
            {filter.query && (
              <button
                type="button"
                onClick={() => set({ query: "" })}
                aria-label="Xóa chữ tìm"
                className="min-h-0 w-9 h-9 grid place-items-center rounded-full text-ink-3 hover:text-ink"
              >
                <X aria-hidden className="w-4 h-4" />
              </button>
            )}
          </label>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-3 rounded-full text-body font-medium text-ink-2 hover:text-ink hover:bg-wall-2"
          >
            Đóng
          </button>
        </div>

        <div
          role="group"
          aria-label="Lọc theo trạng thái và danh mục"
          className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 sm:-mx-4 sm:px-4"
        >
          {STATUSES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter.status === key}
              onClick={() => set({ status: key })}
              className={chip(filter.status === key)}
            >
              {label}
            </button>
          ))}
          <span aria-hidden className="w-px my-2 shrink-0 bg-line-strong" />
          {CATEGORIES.filter((c) => counts.get(c)).map((c) => {
            const Icon = iconOf(c);
            const on = filter.category === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => set({ category: on ? "all" : c })}
                className={chip(on)}
              >
                <Icon aria-hidden className="w-4 h-4" strokeWidth={1.75} />
                {labelOf(c)}
                <span className={cn("tnum", on ? "text-on-mine-2" : "text-ink-3")}>
                  {counts.get(c)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className={cn(chip(!!filter.date), "cursor-pointer")}>
            <Calendar aria-hidden className="w-4 h-4" />
            <span className="sr-only">Lọc theo ngày</span>
            <input
              type="date"
              value={filter.date}
              onChange={(e) => set({ date: e.target.value })}
              className="bg-transparent outline-none text-small tnum"
            />
          </label>
          {filter.date && (
            <button
              type="button"
              onClick={() => set({ date: "" })}
              className="min-h-11 px-2 text-small font-medium text-ink-2 underline underline-offset-[3px]"
            >
              Bỏ ngày
            </button>
          )}
          {hasFilter(filter) && (
            <p className="ml-auto flex items-center gap-1 text-small text-ink-2 tnum">
              {shownCount} khoản · {money(shownSum)}
              <button
                type="button"
                onClick={() => onChange({ ...EMPTY_FILTER })}
                className="min-h-11 px-2 font-semibold text-ink underline underline-offset-[3px]"
              >
                Bỏ lọc
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
