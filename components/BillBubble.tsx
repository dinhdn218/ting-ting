"use client";

import { useState } from "react";
import { Check, CheckCheck } from "lucide-react";
import type { Activity } from "@/types";
import { shareOf, cn } from "@/lib/utils";
import { activityDue, activityRow, initials, money, splitLabel } from "@/lib/ledgerSelectors";
import Avatar from "@/components/Avatar";
import CategoryMark, { labelOf } from "@/components/CategoryMark";
import Money from "@/components/Money";

interface BillBubbleProps {
  activity: Activity;
  me: string | null;
  payerName: string;
  onOpen?: () => void;
  /** Hiện "Minh đã ứng" ở tin đầu tiên của ngày */
  showSender?: boolean;
}

const MAX_CHIPS = 7;

function timeOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Một khoản chi = một tin hóa đơn do người ứng tiền gửi.
 * Lưới nhãn cố định: danh mục · tên · tổng / loại · cách chia /
 * hàng chữ tắt có ✓ như dấu đã xem · tiến độ · giờ / phần của bạn.
 * Nếu bạn chính là người ứng tiền, tin nằm bên phải, nền mực.
 */
export default function BillBubble({
  activity,
  me,
  payerName,
  onOpen,
  showSender,
}: BillBubbleProps) {
  const mine = !!me && me === payerName;
  const row = activityRow(activity);
  const n = activity.participants.length;
  const myPart = me ? activity.participants.find((p) => p.name === me) : undefined;
  const due = activityDue(activity);
  const extra = n - MAX_CHIPS;

  // Ai vừa chuyển sang "đã trả" từ lần render trước → ✓ bật lên đúng chữ tắt đó.
  // Điều chỉnh state ngay trong render (không effect): lần mount đầu không bật gì.
  const paidKey = activity.participants
    .filter((p) => p.paid)
    .map((p) => p.name)
    .join("|");
  const [seenKey, setSeenKey] = useState(paidKey);
  const [popped, setPopped] = useState<string[]>([]);
  if (seenKey !== paidKey) {
    const before = new Set(seenKey.split("|"));
    setPopped(paidKey.split("|").filter((name) => name && !before.has(name)));
    setSeenKey(paidKey);
  }

  const body = (
    <>
      {!mine && showSender && (
        <span className="block text-meta font-semibold text-ink-2 mb-1.5">
          {payerName || "Người ứng tiền"} đã ứng
        </span>
      )}

      <span className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 items-start">
        <CategoryMark category={activity.category} size={36} tone={mine ? "mine" : "default"} />
        <span className="min-w-0">
          <span className="block text-row font-semibold truncate">{activity.title}</span>
          <span className={cn("block text-small mt-0.5", mine ? "text-on-mine-2" : "text-ink-3")}>
            {labelOf(activity.category)} · {splitLabel(activity)}
          </span>
        </span>
        <Money value={activity.totalAmount} className="text-row font-semibold pt-px" />
      </span>

      <span
        className={cn(
          "mt-3 pt-2.5 border-t flex items-center gap-2",
          mine ? "border-on-mine/15" : "border-line",
        )}
      >
        <span aria-hidden className="flex -space-x-1 min-w-0">
          {activity.participants.slice(0, MAX_CHIPS).map((p, i) => (
            <span
              key={p.name}
              // Chip trước nằm trên chip sau: chữ thứ hai và huy hiệu ✓ không bị che
              style={{ zIndex: MAX_CHIPS - i }}
              className={cn(
                "relative w-7 h-7 grid place-items-center rounded-full text-[10px] font-semibold ring-2",
                mine ? "ring-mine" : "ring-bubble",
                p.paid
                  ? mine
                    ? "bg-paid text-on-mine"
                    : "bg-paid-wash text-paid"
                  : mine
                    ? "bg-mine text-on-mine-2 border border-dashed border-on-mine-2"
                    : "bg-bubble text-ink-3 border border-dashed border-line-strong",
              )}
            >
              {initials(p.name)}
              {p.paid && (
                <span
                  className={cn(
                    "absolute -bottom-1 -right-1 w-3.5 h-3.5 grid place-items-center rounded-full",
                    "bg-paid text-on-mine ring-2",
                    mine ? "ring-mine" : "ring-bubble",
                    popped.includes(p.name) && "anim-tick",
                  )}
                >
                  <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                </span>
              )}
            </span>
          ))}
          {extra > 0 && (
            <span
              className={cn(
                "relative w-7 h-7 grid place-items-center rounded-full text-[10px] font-semibold ring-2",
                mine ? "ring-mine bg-on-mine/12 text-on-mine" : "ring-bubble bg-wall-2 text-ink-2",
              )}
            >
              +{extra}
            </span>
          )}
        </span>

        <span
          className={cn(
            "ml-auto flex items-center gap-1 text-small font-medium tnum whitespace-nowrap",
            row.done
              ? mine
                ? "text-on-mine"
                : "text-paid"
              : mine
                ? "text-on-mine-2"
                : "text-ink-3",
          )}
        >
          {row.done ? (
            <CheckCheck aria-hidden className="w-4 h-4" />
          ) : (
            <Check aria-hidden className="w-4 h-4" />
          )}
          {row.done ? "Đã thu đủ" : row.progressLabel}
        </span>
        <span className={cn("text-meta tnum", mine ? "text-on-mine-2" : "text-ink-3")}>
          {timeOf(activity.date)}
        </span>
      </span>

      {myPart && !mine && (
        <span
          className={cn(
            "mt-2.5 -mx-1.5 px-2.5 py-2 rounded-[12px] flex items-center justify-between gap-2 text-small",
            myPart.paid ? "bg-paid-wash text-paid" : "bg-owe-wash text-owe",
          )}
        >
          <span className="font-semibold">Phần của bạn</span>
          <span className="tnum font-semibold">
            {money(shareOf(activity, myPart))} · {myPart.paid ? "đã trả" : "chưa trả"}
          </span>
        </span>
      )}

      {mine && due > 0 && (
        <span className="mt-2 block text-small text-on-mine-2">
          Còn phải thu{" "}
          <span className="tnum font-semibold text-on-mine">{money(due)}</span>
        </span>
      )}
    </>
  );

  const shell = cn(
    "block text-left w-full max-w-[min(88%,520px)] lg:max-w-[min(88%,640px)] px-3.5 pt-3 pb-2.5 shadow-bubble",
    mine ? "bubble-out bg-mine text-on-mine" : "bubble-in bg-bubble text-ink",
    onOpen && "cursor-pointer transition-[filter] hover:brightness-[0.97]",
  );

  return (
    <div className={cn("flex items-end gap-2", mine ? "justify-end" : "justify-start")}>
      {!mine && (
        <Avatar
          name={payerName || "?"}
          tone="payer"
          size="sm"
          className={cn("mb-0.5", !showSender && "invisible")}
        />
      )}
      {onOpen ? (
        <button type="button" onClick={onOpen} className={shell}>
          {body}
        </button>
      ) : (
        <div className={shell}>{body}</div>
      )}
    </div>
  );
}
