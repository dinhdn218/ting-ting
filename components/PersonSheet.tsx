"use client";

import { useState } from "react";
import { CheckCheck, QrCode } from "lucide-react";
import type { Activity } from "@/types";
import { shareOf, cn } from "@/lib/utils";
import { countsFor, money, owedBy, sharesFor } from "@/lib/ledgerSelectors";
import { btnOutline, btnPrimary } from "@/lib/styles";
import CategoryMark from "@/components/CategoryMark";
import SheetShell from "@/components/SheetShell";
import Money from "@/components/Money";
import Avatar from "@/components/Avatar";
import PaidMark from "@/components/PaidMark";
import ConfirmDialog from "@/components/ConfirmDialog";

interface PersonSheetProps {
  name: string | null;
  activities: Activity[];
  onClose: () => void;
  onOpenActivity: (activity: Activity) => void;
  onOpenPay: () => void;
  onToggle: (activity: Activity, name: string) => void;
  onMarkAllPaid: (name: string) => void;
  me: string | null;
  isAdmin: boolean;
  isPayer: boolean;
}

/** Hồ sơ một thành viên: tổng phải trả / đã trả / còn nợ, và tick từng khoản ngay tại đây. */
export default function PersonSheet({
  name,
  activities,
  onClose,
  onOpenActivity,
  onOpenPay,
  onToggle,
  onMarkAllPaid,
  me,
  isAdmin,
  isPayer,
}: PersonSheetProps) {
  const [confirmAll, setConfirmAll] = useState(false);
  const [ticked, setTicked] = useState<string | null>(null);

  if (!name) return null;

  const mine = activities
    .filter((a) => a.participants.some((p) => p.name === name))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const owed = owedBy(activities, name);
  const counts = countsFor(activities, name);
  const shares = sharesFor(activities, name);
  const pct = shares.total > 0 ? Math.round((shares.paid / shares.total) * 100) : 0;
  const isMe = name === me;

  return (
    <>
      <SheetShell
        open
        onClose={onClose}
        header={
          <div className="flex items-center gap-3">
            <Avatar name={name} size="lg" tone={isMe ? "me" : isPayer ? "payer" : "default"} />
            <div className="min-w-0">
              <h2 className="text-head font-semibold truncate">
                {name}
                {isMe && <span className="text-ink-3 font-normal"> · bạn</span>}
              </h2>
              <p className="text-small text-ink-2 mt-0.5 tnum">
                {isPayer ? "Người giữ sổ · " : ""}
                {counts.total} khoản tham gia
              </p>
            </div>
          </div>
        }
        footer={
          isMe && owed > 0 && !isPayer ? (
            <button type="button" onClick={onOpenPay} className={cn(btnPrimary, "w-full tnum")}>
              <QrCode aria-hidden className="w-[18px] h-[18px]" />
              Trả {money(owed)}
            </button>
          ) : isAdmin && owed > 0 ? (
            <button
              type="button"
              onClick={() => setConfirmAll(true)}
              className={cn(btnOutline, "w-full tnum")}
            >
              <CheckCheck aria-hidden className="w-[18px] h-[18px]" />
              Tick đã trả tất cả · {money(owed)}
            </button>
          ) : undefined
        }
      >
        <div className="border-t border-line pt-4">
          {owed > 0 ? (
            <>
              <p className="text-body text-ink-2">{isMe ? "Bạn còn nợ" : "Còn nợ"}</p>
              <Money value={owed} direction="out" className="block text-fig font-semibold text-owe mt-0.5" />
            </>
          ) : (
            <p className="inline-flex items-center gap-2 text-row font-semibold text-paid">
              <CheckCheck aria-hidden className="w-5 h-5" />
              Đã trả xong
            </p>
          )}

          <dl className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <dt className="text-small text-ink-3">Tổng phải trả</dt>
              <dd className="text-body font-semibold tnum mt-0.5">{money(shares.total)}</dd>
            </div>
            <div>
              <dt className="text-small text-ink-3">Đã trả {pct}%</dt>
              <dd className="text-body font-semibold tnum mt-0.5 text-paid">{money(shares.paid)}</dd>
            </div>
          </dl>
          <div aria-hidden className="mt-2.5 flex gap-[2px] h-1.5">
            {pct > 0 && (
              <span className="block h-full rounded-l-full bg-paid" style={{ width: `${pct}%` }} />
            )}
            {pct < 100 && <span className="block h-full flex-1 rounded-r-full bg-line-strong" />}
          </div>
        </div>

        <h3 className="text-row font-semibold mt-6">
          Từng khoản <span className="text-ink-3 font-normal tnum">· {mine.length}</span>
        </h3>
        {isAdmin && (
          <p className="text-small text-ink-3 mt-0.5">Chạm trạng thái để tick từng khoản.</p>
        )}
        <ul className="mt-1">
          {mine.map((a) => {
            const p = a.participants.find((x) => x.name === name)!;
            const d = new Date(a.date);
            const day = Number.isNaN(d.getTime())
              ? a.date.slice(0, 10)
              : d.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" });
            return (
              <li
                key={a.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2.5 min-h-16 border-b border-line"
              >
                <CategoryMark category={a.category} size={32} />
                <button
                  type="button"
                  onClick={() => onOpenActivity(a)}
                  className="min-w-0 text-left min-h-11"
                >
                  <span className="block text-body font-medium truncate">{a.title}</span>
                  <span className="block text-small text-ink-3 tnum">
                    {day} · {money(shareOf(a, p))}
                  </span>
                </button>
                <PaidMark
                  paid={p.paid}
                  onTick={
                    isAdmin
                      ? () => {
                          setTicked(a.id);
                          onToggle(a, name);
                        }
                      : undefined
                  }
                  justTicked={ticked === a.id}
                  ariaLabel={
                    p.paid ? `Bỏ tick đã trả khoản ${a.title}` : `Tick đã trả khoản ${a.title}`
                  }
                />
              </li>
            );
          })}
        </ul>
      </SheetShell>

      {confirmAll && (
        <ConfirmDialog
          title="Tick đã trả tất cả?"
          message={`Xác nhận ${name} đã trả đủ ${money(owed)} cho ${counts.unpaid} khoản chưa trả. Mọi khoản đó sẽ được đánh dấu đã trả.`}
          confirmText="Đúng, đã trả đủ"
          cancelText="Hủy"
          type="success"
          onConfirm={() => {
            setConfirmAll(false);
            onMarkAllPaid(name);
            onClose();
          }}
          onCancel={() => setConfirmAll(false)}
        />
      )}
    </>
  );
}
