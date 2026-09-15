"use client";

import { useState } from "react";
import { CheckCheck, QrCode, Trash2 } from "lucide-react";
import type { Activity } from "@/types";
import { shareOf, cn } from "@/lib/utils";
import { activityDue, money, splitLabel } from "@/lib/ledgerSelectors";
import { btnDanger, btnPrimary } from "@/lib/styles";
import CategoryMark, { labelOf } from "@/components/CategoryMark";
import SheetShell from "@/components/SheetShell";
import Money from "@/components/Money";
import Avatar from "@/components/Avatar";
import PaidMark from "@/components/PaidMark";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ActivitySheetProps {
  activity: Activity | null;
  payerName: string;
  onClose: () => void;
  onToggle: (activity: Activity, name: string) => void;
  onDelete: (id: string) => void;
  onOpenPay: () => void;
  isAdmin: boolean;
  me: string | null;
}

function stampOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const date = d.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

/** Mở một tin hóa đơn: phần từng người, tick đã trả (admin), trả phần của mình. */
export default function ActivitySheet({
  activity,
  payerName,
  onClose,
  onToggle,
  onDelete,
  onOpenPay,
  isAdmin,
  me,
}: ActivitySheetProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [ticked, setTicked] = useState<string | null>(null);

  if (!activity) return null;

  const due = activityDue(activity);
  const myPart = activity.participants.find((p) => p.name === me);
  const showPay = !!myPart && !myPart.paid && me !== payerName;

  const tick = (name: string) => {
    setTicked(name);
    onToggle(activity, name);
  };

  return (
    <>
      <SheetShell
        open
        onClose={onClose}
        header={
          <div className="flex items-start gap-3">
            <CategoryMark category={activity.category} size={36} />
            <div className="min-w-0">
              <h2 className="text-head font-semibold truncate">{activity.title}</h2>
              <p className="text-small text-ink-2 mt-0.5 tnum">
                {stampOf(activity.date)} · {labelOf(activity.category)} · {splitLabel(activity)}
              </p>
            </div>
          </div>
        }
        footer={
          showPay || isAdmin ? (
            <div className="space-y-2">
              {showPay && myPart && (
                <button type="button" onClick={onOpenPay} className={cn(btnPrimary, "w-full tnum")}>
                  <QrCode aria-hidden className="w-[18px] h-[18px]" />
                  Trả phần của bạn · {money(shareOf(activity, myPart))}
                </button>
              )}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={cn(btnDanger, "w-full")}
                >
                  <Trash2 aria-hidden className="w-4 h-4" />
                  Xóa khoản này
                </button>
              )}
            </div>
          ) : undefined
        }
      >
        <div className="border-t border-line pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-body text-ink-2">Tổng</span>
            <Money value={activity.totalAmount} className="text-fig font-semibold" />
          </div>
          <p className="text-small text-ink-3 mt-1">
            Chia cho{" "}
            {activity.participants.length} người
          </p>
        </div>

        <h3 className="text-row font-semibold mt-6">Phần từng người</h3>
        {isAdmin && (
          <p className="text-small text-ink-3 mt-0.5">Chạm trạng thái để tick hoặc bỏ tick.</p>
        )}
        <ul className="mt-1">
          {activity.participants.map((p) => {
            const isMe = p.name === me;
            return (
              <li
                key={p.name}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2.5 min-h-16 border-b border-line"
              >
                <Avatar
                  name={p.name}
                  size="sm"
                  tone={isMe ? "me" : p.name === payerName ? "payer" : "default"}
                />
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-body font-medium">
                    <span className="truncate">{p.name}</span>
                    {isMe && (
                      <span className="shrink-0 px-1.5 rounded-full bg-pin text-on-pin text-meta font-semibold">
                        bạn
                      </span>
                    )}
                  </span>
                  <Money value={shareOf(activity, p)} className="block text-small text-ink-2" />
                </span>
                <PaidMark
                  paid={p.paid}
                  onTick={isAdmin ? () => tick(p.name) : undefined}
                  justTicked={ticked === p.name}
                  ariaLabel={p.paid ? `Bỏ tick đã trả cho ${p.name}` : `Tick đã trả cho ${p.name}`}
                />
              </li>
            );
          })}
        </ul>

        <div className="mt-4 pt-3.5 border-t-2 border-line-strong flex items-baseline justify-between gap-3">
          <span className="text-body font-semibold">Còn phải thu</span>
          {due === 0 ? (
            <span className="inline-flex items-center gap-1.5 text-row font-semibold text-paid">
              <CheckCheck aria-hidden className="w-5 h-5" />
              Đã thu đủ
            </span>
          ) : (
            <Money value={due} direction="out" className="text-row font-semibold text-owe" />
          )}
        </div>
      </SheetShell>

      {confirmDelete && (
        <ConfirmDialog
          title="Xóa khoản này?"
          message={`Xóa “${activity.title}” (${money(activity.totalAmount)}) khỏi sổ của cả nhóm. Không hoàn tác được.`}
          confirmText="Xóa khoản"
          cancelText="Giữ lại"
          type="danger"
          onConfirm={() => {
            setConfirmDelete(false);
            onDelete(activity.id);
            onClose();
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
