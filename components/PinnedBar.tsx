"use client";

import { CheckCheck, Pin, QrCode, Search, Users } from "lucide-react";
import type { Ledger } from "@/lib/ledgerSelectors";
import { PHASE_LABELS, money } from "@/lib/ledgerSelectors";
import Money from "@/components/Money";

interface PinnedBarProps {
  ledger: Ledger;
  me: string | null;
  onPickMe: (name: string) => void;
  /** Mở sheet chọn tên đầy đủ (tìm được, cuộn được hết) */
  onOpenWho: () => void;
  onPay: () => void;
  onOpenMe: () => void;
  onOpenMembers: () => void;
}

/**
 * Số tên hiện sẵn trong tin ghim; còn lại tìm trong sheet.
 * Desktop rộng gấp đôi nên bày được gấp đôi tên — cắt theo CSS chứ không
 * theo JS: đo bề ngang lúc render sẽ lệch server/client và gây hydration warning.
 */
const QUICK_NAMES = 4;
// 10 chứ không phải 12: phải chừa chỗ cho nút "Tìm tên" ở cuối cùng hàng,
// nếu không nó rớt xuống hàng riêng và thanh ghim cao gấp đôi.
const QUICK_NAMES_LG = 10;

const cta =
  "shrink-0 inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full " +
  "bg-on-pin text-pin text-body font-semibold transition-opacity hover:opacity-90";

// inline-flex + items-center: min-h-11 chỉ đặt chiều cao, KHÔNG tự căn giữa
// chữ theo chiều dọc — thiếu hai lớp này thì tên nằm sát mép trên chip.
const nameChip =
  "shrink-0 inline-flex items-center justify-center min-h-11 px-4 rounded-full " +
  "bg-on-pin text-pin text-small font-semibold transition-opacity hover:opacity-90";

/**
 * Tin ghim vàng — luôn nói "con số của tôi" trước mọi thống kê.
 * Chưa chọn tên thì tin ghim hỏi "Bạn là ai?"; đã chọn thì có nút "Đổi người".
 */
export default function PinnedBar({
  ledger,
  me,
  onPickMe,
  onOpenWho,
  onPay,
  onOpenMe,
  onOpenMembers,
}: PinnedBarProps) {
  if (ledger.roster.length === 0) return null;

  const iOwe = !!me && !ledger.iAmPayer && ledger.myOwed > 0;
  // Cắt theo mức rộng nhất rồi để CSS ẩn bớt ở màn hẹp
  const quick = ledger.roster.slice(0, QUICK_NAMES_LG);
  const more = ledger.roster.length > QUICK_NAMES;

  const progress = (
    <div className="mt-2.5 flex items-center gap-2.5 text-meta text-on-pin-2">
      <span className="shrink-0 font-semibold">Cả nhóm · {PHASE_LABELS[ledger.phase]}</span>
      <div
        role="progressbar"
        aria-label="Cả nhóm đã thu"
        aria-valuenow={ledger.pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="flex-1 h-1.5 rounded-full bg-pin-2 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-on-pin transition-[width] duration-500"
          style={{ width: `${ledger.pct}%` }}
        />
      </div>
      <span className="tnum shrink-0">đã thu {ledger.pct}%</span>
    </div>
  );

  return (
    <div className="flex-none bg-pin text-on-pin border-b border-pin-2">
      <div className="mx-auto w-full max-w-[720px] lg:max-w-[1280px] px-4 lg:px-6 pt-2.5 pb-3">
        {!me ? (
          <>
            {/* Màn hẹp: hai dòng cho khỏi bóp chữ. Từ sm trở lên đủ chỗ một hàng. */}
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <p className="flex items-center gap-1.5 text-body font-semibold">
                <Pin aria-hidden className="w-4 h-4 shrink-0 rotate-45" />
                Bạn là ai trong nhóm?
              </p>
              <p className="text-small text-on-pin-2 tnum pl-5.5 sm:pl-0">
                Nhóm còn nợ {money(ledger.outstanding)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {quick.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => onPickMe(name)}
                  // max-lg:hidden chứ KHÔNG phải "hidden lg:inline-flex":
                  // nameChip đã có sẵn inline-flex, mà .inline-flex đứng sau
                  // .hidden trong CSS nên nó thắng và chip không bao giờ ẩn.
                  className={i < QUICK_NAMES ? nameChip : `${nameChip} max-lg:hidden`}
                >
                  {name}
                </button>
              ))}
              {more && (
                <button
                  type="button"
                  onClick={onOpenWho}
                  className="shrink-0 inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full
                             border border-on-pin text-on-pin text-small font-semibold
                             transition-colors hover:bg-on-pin/10"
                >
                  <Search aria-hidden className="w-4 h-4" />
                  Tìm tên · {ledger.roster.length} người
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-small font-medium text-on-pin-2">
                <Pin aria-hidden className="w-3.5 h-3.5 shrink-0 rotate-45" />
                <span className="truncate">
                  {ledger.iAmPayer
                    ? `${me} · bạn còn phải thu`
                    : iOwe
                      ? `${me} · còn nợ ${ledger.myCounts.unpaid} khoản`
                      : `${me} · đã trả xong ${ledger.myCounts.total} khoản`}
                </span>
                <button
                  type="button"
                  onClick={onOpenWho}
                  className="shrink-0 min-h-11 -my-3 px-2 font-semibold text-on-pin
                             underline underline-offset-[3px] decoration-1 hover:decoration-2"
                >
                  Đổi người
                </button>
              </div>
              <button
                type="button"
                onClick={ledger.iAmPayer ? onOpenMembers : onOpenMe}
                className="block text-left min-h-11 text-[22px] leading-tight font-bold"
              >
                {ledger.iAmPayer ? (
                  <Money value={ledger.outstanding} animate />
                ) : iOwe ? (
                  <Money value={ledger.myOwed} animate />
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCheck aria-hidden className="w-6 h-6" />
                    Không còn nợ
                  </span>
                )}
              </button>
            </div>

            {iOwe ? (
              <button type="button" onClick={onPay} className={cta}>
                <QrCode aria-hidden className="w-[18px] h-[18px]" />
                Trả
              </button>
            ) : ledger.iAmPayer ? (
              <button type="button" onClick={onOpenMembers} className={cta}>
                <Users aria-hidden className="w-[18px] h-[18px]" />
                {ledger.peopleUnsettled} người
              </button>
            ) : null}
          </div>
        )}
        {progress}
      </div>
    </div>
  );
}
