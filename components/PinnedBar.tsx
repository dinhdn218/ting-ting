"use client";

import { CheckCheck, Pin, QrCode, Users } from "lucide-react";
import type { Ledger } from "@/lib/ledgerSelectors";
import { PHASE_LABELS, money } from "@/lib/ledgerSelectors";
import Money from "@/components/Money";

interface PinnedBarProps {
  ledger: Ledger;
  me: string | null;
  payerName: string;
  onPickMe: (name: string) => void;
  onPay: () => void;
  onOpenMe: () => void;
  onOpenMembers: () => void;
}

const cta =
  "shrink-0 inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full " +
  "bg-on-pin text-pin text-body font-semibold transition-opacity hover:opacity-90";

/**
 * Tin ghim vàng — luôn nói "con số của tôi" trước mọi thống kê.
 * Chưa chọn tên thì tin ghim hỏi "Bạn là ai?".
 */
export default function PinnedBar({
  ledger,
  me,
  payerName,
  onPickMe,
  onPay,
  onOpenMe,
  onOpenMembers,
}: PinnedBarProps) {
  if (ledger.roster.length === 0) return null;

  const iOwe = !!me && !ledger.iAmPayer && ledger.myOwed > 0;

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
      <div className="mx-auto w-full max-w-[720px] px-4 pt-2.5 pb-3">
        {!me ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-body font-semibold">
                <Pin aria-hidden className="w-4 h-4 rotate-45" />
                Bạn là ai trong nhóm?
              </p>
              <p className="text-small text-on-pin-2 tnum">
                Nhóm còn nợ {money(ledger.outstanding)}
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar mt-2 -mx-4 px-4">
              {ledger.roster.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => onPickMe(name)}
                  className="shrink-0 min-h-11 px-4 rounded-full bg-on-pin text-pin
                             text-small font-semibold transition-opacity hover:opacity-90"
                >
                  {name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={ledger.iAmPayer ? onOpenMembers : onOpenMe}
              className="min-w-0 flex-1 text-left min-h-11"
            >
              <span className="flex items-center gap-1.5 text-small font-medium text-on-pin-2">
                <Pin aria-hidden className="w-3.5 h-3.5 rotate-45" />
                {ledger.iAmPayer
                  ? "Bạn còn phải thu"
                  : iOwe
                    ? `Bạn còn nợ ${payerName} · ${ledger.myCounts.unpaid} khoản`
                    : `${me} · đã trả xong ${ledger.myCounts.total} khoản`}
              </span>
              <span className="block text-[22px] leading-tight font-bold mt-0.5">
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
              </span>
            </button>

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
