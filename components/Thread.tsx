"use client";

import { Fragment } from "react";
import { BookOpen, SearchX } from "lucide-react";
import type { Activity } from "@/types";
import type { ThreadMonth } from "@/lib/ledgerSelectors";
import { money } from "@/lib/ledgerSelectors";
import { cn } from "@/lib/utils";
import { btnOutline } from "@/lib/styles";
import BillBubble from "@/components/BillBubble";
import CategoryBars from "@/components/CategoryBars";

interface ThreadProps {
  months: ThreadMonth[];
  me: string | null;
  payerName: string;
  onOpen: (activity: Activity) => void;
  /** Đang lọc → ẩn tin tổng kết tháng (nó chỉ đúng với toàn bộ dữ liệu) */
  filtered: boolean;
  onClearFilter: () => void;
  /** "2026-09" — tháng hiện tại, tin tổng kết ghi "đến hôm nay" */
  nowKey: string;
}

/**
 * Luồng trò chuyện: cũ ở trên, mới ở dưới. Khoản chi luôn ở bên trái,
 * tổng kết tháng ở bên phải như tin trả lời của app.
 * Desktop: hai cột — khoản chi trái, tổng kết dính ở cột phải khi cuộn qua tháng đó.
 */
export default function Thread({
  months,
  me,
  payerName,
  onOpen,
  filtered,
  onClearFilter,
  nowKey,
}: ThreadProps) {
  if (months.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-4 py-12 text-center">
        <SearchX aria-hidden className="w-7 h-7 text-ink-3 mx-auto" />
        <h2 className="text-row font-semibold mt-3">Không có khoản nào khớp</h2>
        <p className="text-body text-ink-2 mt-1.5">
          Thử bỏ bớt điều kiện lọc hoặc tìm bằng tên người.
        </p>
        {filtered && (
          <button
            type="button"
            onClick={onClearFilter}
            className={cn(btnOutline, "mt-5 rounded-full")}
          >
            Bỏ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[720px] lg:max-w-[1280px] px-3 sm:px-4 lg:px-6 pt-4 pb-6 space-y-6">
      {months.map((m) => (
        <section
          key={m.key}
          aria-label={m.label}
          className={cn(
            !filtered &&
              "lg:grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 lg:items-start",
          )}
        >
          <div className="min-w-0 space-y-3">
            {m.days.map((d) => (
              <Fragment key={d.key}>
                <div className="flex justify-center pt-2">
                  <span className="px-3 py-1 rounded-full bg-wall-2 text-meta font-medium text-ink-2">
                    {d.label}
                  </span>
                </div>
                {d.rows.map((r) => (
                  <BillBubble
                    key={r.activity.id}
                    activity={r.activity}
                    me={me}
                    payerName={payerName}
                    onOpen={() => onOpen(r.activity)}
                  />
                ))}
              </Fragment>
            ))}
          </div>

          {!filtered && (
            <div className="mt-3 flex justify-end lg:mt-2 lg:block lg:sticky lg:top-4">
              <MonthSummary month={m} current={m.key === nowKey} />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

/** Tin hệ thống của "Ting Ting": tổng kết tháng theo danh mục — nằm bên phải. */
function MonthSummary({
  month,
  current,
}: {
  month: ThreadMonth;
  current: boolean;
}) {
  return (
    <section
      aria-label={`Tổng kết tháng ${month.month}`}
      className="w-full max-w-[88%] lg:max-w-none bubble-out bg-panel shadow-bubble px-4 pt-3.5 pb-4"
    >
      <h3 className="flex items-center gap-1.5 text-body font-semibold">
        <BookOpen aria-hidden className="w-4 h-4 text-ink-3 shrink-0" />
        {current
          ? `Ting Ting · tháng ${month.month} đến hôm nay`
          : `Ting Ting · tổng kết tháng ${month.month}/${month.year}`}
      </h3>
      <p className="text-small text-ink-2 tnum mt-0.5">
        {month.count} khoản · {money(month.sum)}
      </p>
      <CategoryBars items={month.categories} className="mt-3.5" />
    </section>
  );
}
