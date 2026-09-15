"use client";

import { CheckCheck, CircleDashed } from "lucide-react";
import type { Ledger, PersonRow, GroupPhase } from "@/lib/ledgerSelectors";
import { PHASE_LABELS, money } from "@/lib/ledgerSelectors";
import { cn } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import Money from "@/components/Money";
import CategoryBars from "@/components/CategoryBars";

interface MembersPanelProps {
  ledger: Ledger;
  isAdmin: boolean;
  activitiesCount: number;
  onOpenPerson: (name: string) => void;
}

const PHASE_STYLE: Record<GroupPhase, string> = {
  owing: "bg-owe-wash text-owe",
  almost: "bg-pin text-on-pin",
  done: "bg-paid-wash text-paid",
};

/**
 * "Thông tin nhóm": tình hình cả nhóm, ai còn nợ, ai đã xong, chi theo danh mục.
 * "Còn nợ" xếp người nợ nhiều lên trước để thấy việc cần thu; không huy chương.
 */
export default function MembersPanel({
  ledger,
  isAdmin,
  activitiesCount,
  onOpenPerson,
}: MembersPanelProps) {
  if (ledger.rows.length === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <h2 className="text-row font-semibold">Chưa có thành viên</h2>
        <p className="text-body text-ink-2 mt-1.5">
          Thành viên xuất hiện khi khoản đầu tiên được ghi.
        </p>
      </div>
    );
  }

  const debtors = ledger.rows.filter((r) => !r.isPayer && !r.settled);
  const settled = ledger.rows.filter((r) => !r.isPayer && r.settled);
  const payer = ledger.rows.find((r) => r.isPayer);
  const members = debtors.length + settled.length;

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 sm:px-5 pt-5 pb-10 space-y-8">
      {/* Cả nhóm — thanh tiến độ + bảng kê kiểu sổ, số tiền căn phải thẳng cột */}
      <section aria-labelledby="group-h">
        <div className="flex items-center justify-between gap-3">
          <h2 id="group-h" className="text-head font-semibold">
            Cả nhóm
          </h2>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 min-h-8 px-3 rounded-full text-small font-semibold",
              PHASE_STYLE[ledger.phase],
            )}
          >
            {ledger.phase === "done" ? (
              <CheckCheck aria-hidden className="w-4 h-4" />
            ) : (
              <CircleDashed aria-hidden className="w-4 h-4" />
            )}
            {PHASE_LABELS[ledger.phase]}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label={`Đã thu ${ledger.pct}%`}
          aria-valuenow={ledger.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-4 flex gap-[2px] h-2.5"
        >
          {ledger.pct > 0 && (
            <span
              className="block h-full rounded-l-full bg-paid transition-[width] duration-500"
              style={{ width: `${ledger.pct}%` }}
            />
          )}
          {ledger.pct < 100 && (
            <span className="block h-full flex-1 rounded-r-full bg-owe/35" />
          )}
        </div>

        <dl className="mt-3">
          <div className="flex items-baseline justify-between gap-3 py-1.5">
            <dt className="flex items-center gap-2 text-body text-ink-2">
              <span aria-hidden className="w-2.5 h-2.5 rounded-[3px] bg-paid" />
              Đã thu
              <span className="text-small text-ink-3 tnum">{ledger.pct}%</span>
            </dt>
            <dd className="text-row font-semibold text-paid">
              <Money value={ledger.collected} animate />
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 py-1.5">
            <dt className="flex items-center gap-2 text-body text-ink-2">
              <span aria-hidden className="w-2.5 h-2.5 rounded-[3px] bg-owe/35" />
              Còn nợ
            </dt>
            <dd className="text-row font-semibold text-owe">
              <Money value={ledger.outstanding} animate />
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 mt-1 pt-2.5 border-t border-line">
            <dt className="text-body text-ink-2 pl-[18px]">Tổng chi</dt>
            <dd className="text-row font-semibold">
              <Money value={ledger.total} />
            </dd>
          </div>
        </dl>

        <p className="text-small text-ink-3 mt-3 tnum">
          {members} người · {settled.length} đã trả xong · {debtors.length} còn nợ ·{" "}
          {activitiesCount} khoản
        </p>
      </section>

      {/* Còn nợ */}
      <section aria-labelledby="debt-h">
        <h3 id="debt-h" className="text-row font-semibold">
          Còn nợ <span className="text-ink-3 font-normal tnum">· {debtors.length}</span>
        </h3>
        {isAdmin && debtors.length > 0 && (
          <p className="text-small text-ink-3 mt-0.5">Chạm vào tên để tick từng khoản.</p>
        )}
        {debtors.length === 0 ? (
          <p className="text-body text-ink-2 mt-2">Không ai còn nợ — sổ đã sạch.</p>
        ) : (
          <ul className="mt-1">
            {debtors.map((r) => (
              <MemberRow key={r.name} row={r} onOpen={onOpenPerson} />
            ))}
          </ul>
        )}
      </section>

      {settled.length > 0 && (
        <section aria-labelledby="settled-h">
          <h3 id="settled-h" className="text-row font-semibold">
            Đã trả xong <span className="text-ink-3 font-normal tnum">· {settled.length}</span>
          </h3>
          <ul className="mt-1">
            {settled.map((r) => (
              <MemberRow key={r.name} row={r} onOpen={onOpenPerson} />
            ))}
          </ul>
        </section>
      )}

      {payer && (
        <section aria-labelledby="payer-h">
          <h3 id="payer-h" className="text-row font-semibold">
            Người giữ sổ
          </h3>
          <ul className="mt-1">
            <MemberRow row={payer} onOpen={onOpenPerson} />
          </ul>
        </section>
      )}

      <section aria-labelledby="cat-h">
        <h3 id="cat-h" className="text-row font-semibold">
          Chi theo danh mục
        </h3>
        <CategoryBars items={ledger.categories} className="mt-3" />
      </section>
    </div>
  );
}

function MemberRow({ row, onOpen }: { row: PersonRow; onOpen: (name: string) => void }) {
  const pct = row.shareTotal > 0 ? Math.round((row.sharePaid / row.shareTotal) * 100) : 0;
  const showProgress = !row.isPayer && !row.settled && row.shareTotal > 0;

  const sub = row.isPayer
    ? "Giữ sổ · còn phải thu"
    : row.settled
      ? `${row.totalCount}/${row.totalCount} khoản · ${money(row.shareTotal)}`
      : `${row.unpaidCount} khoản chưa trả`;

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(row.name)}
        className="w-full text-left grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3
                   py-3 min-h-16 border-b border-line transition-colors hover:bg-wall-2/60
                   -mx-2 px-2 rounded-ctl"
      >
        <Avatar name={row.name} tone={row.isMe ? "me" : row.isPayer ? "payer" : "default"} />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-row font-medium">
            <span className="truncate">{row.name}</span>
            {row.isMe && (
              <span className="shrink-0 px-1.5 rounded-full bg-pin text-on-pin text-meta font-semibold">
                bạn
              </span>
            )}
          </span>
          <span className="block text-small text-ink-3 tnum mt-0.5">{sub}</span>
          {showProgress && (
            <span className="mt-1.5 flex items-center gap-2 max-w-[240px]">
              <span aria-hidden className="flex-1 flex gap-[2px] h-1">
                {pct > 0 && (
                  <span className="block h-full rounded-l-full bg-paid" style={{ width: `${pct}%` }} />
                )}
                <span className="block h-full flex-1 rounded-r-full bg-wall-2" />
              </span>
              <span className="shrink-0 text-meta text-ink-3 tnum">đã trả {pct}%</span>
            </span>
          )}
        </span>
        <span className="text-right min-w-[7.5rem]">
          {row.isPayer ? (
            <Money value={row.owed} direction="in" className="text-row font-semibold text-paid" />
          ) : row.settled ? (
            <span className="inline-flex items-center gap-1 text-small font-semibold text-paid">
              <CheckCheck aria-hidden className="w-4 h-4" />
              Xong
            </span>
          ) : (
            <Money value={row.owed} direction="out" className="text-row font-semibold text-owe" />
          )}
        </span>
      </button>
    </li>
  );
}
