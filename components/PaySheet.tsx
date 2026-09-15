"use client";

import toast from "react-hot-toast";
import { Copy, QrCode } from "lucide-react";
import type { PaymentQR } from "@/types";
import { money, plain } from "@/lib/ledgerSelectors";
import { cn } from "@/lib/utils";
import { btnPrimary } from "@/lib/styles";
import SheetShell from "@/components/SheetShell";

interface PaySheetProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  paymentQR: PaymentQR | null;
}

/**
 * Sheet trả tiền mang theo ĐÚNG số tiền và thông tin chuyển khoản,
 * nên không ai phải nhớ con số khi mở app ngân hàng.
 * Người nhận là chủ tài khoản trong QR — không còn "người ứng tiền" riêng.
 */
export default function PaySheet({ open, onClose, amount, paymentQR }: PaySheetProps) {
  const copy = (text: string, done: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(done))
      .catch(() => toast.error("Không copy được — nhập tay giúp mình nhé"));
  };

  const receiver = paymentQR?.accountName?.trim();

  const rows = [
    { label: "Ngân hàng", value: paymentQR?.bankName, copyable: false },
    { label: "Số tài khoản", value: paymentQR?.accountNumber, copyable: true },
    { label: "Chủ tài khoản", value: paymentQR?.accountName, copyable: false },
  ].filter((r) => r.value);

  return (
    <SheetShell
      open={open}
      onClose={onClose}
      header={
        <div>
          <h2 className="text-head font-semibold">Chuyển khoản</h2>
          <p className="text-small text-ink-2 mt-0.5">
            {receiver ? `Cho ${receiver} · ` : ""}quét mã trong app ngân hàng, hoặc chuyển theo số
            tài khoản.
          </p>
        </div>
      }
      footer={
        <button
          type="button"
          onClick={() => copy(String(Math.round(amount)), `Đã copy ${money(amount)}`)}
          className={cn(btnPrimary, "w-full tnum")}
        >
          <Copy aria-hidden className="w-[18px] h-[18px]" />
          Copy số tiền {plain(amount)}
        </button>
      }
    >
      <div className="border-t border-line pt-4">
        <p className="text-body text-ink-2">Số tiền</p>
        <p className="text-hero font-bold tnum mt-0.5">{money(amount)}</p>
      </div>

      <div className="mt-5 flex justify-center">
        {paymentQR?.imageUrl ? (
          <div className="p-3 rounded-[16px] bg-qr border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={paymentQR.imageUrl}
              alt={receiver ? `Mã QR chuyển khoản cho ${receiver}` : "Mã QR chuyển khoản"}
              className="w-[220px] h-[220px] object-contain"
            />
          </div>
        ) : (
          <div className="w-[244px] min-h-[180px] rounded-[16px] border border-dashed border-line-strong grid place-items-center text-center px-6 py-6">
            <div>
              <QrCode aria-hidden className="w-8 h-8 text-ink-3 mx-auto" />
              <p className="text-small text-ink-2 mt-2">
                Chưa có ảnh QR. Dùng số tài khoản bên dưới nhé.
              </p>
            </div>
          </div>
        )}
      </div>

      {rows.length > 0 ? (
        <dl className="mt-5">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-3 min-h-14 py-2 border-t border-line"
            >
              <dt className="text-small text-ink-2">{r.label}</dt>
              <dd className="flex items-center gap-1 min-w-0">
                <span className={cn("text-body font-semibold text-right break-all", r.copyable && "tnum")}>
                  {r.value}
                </span>
                {r.copyable && (
                  <button
                    type="button"
                    onClick={() => copy(r.value!, "Đã copy số tài khoản")}
                    aria-label="Copy số tài khoản"
                    className="w-11 h-11 shrink-0 grid place-items-center rounded-full text-ink-2 hover:bg-wall-2 hover:text-ink"
                  >
                    <Copy aria-hidden className="w-4 h-4" />
                  </button>
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        !paymentQR?.imageUrl && (
          <p className="text-body text-ink-2 text-center mt-5">
            Chưa có thông tin chuyển khoản.
          </p>
        )
      )}

      <p className="text-small text-ink-2 text-center mt-5">
        Chuyển xong nhắn vào nhóm một tiếng để được tick “đã trả”.
      </p>
    </SheetShell>
  );
}
