"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { QrCode, Trash2, Upload } from "lucide-react";
import type { PaymentQR } from "@/types";
import { cn } from "@/lib/utils";
import { btnPrimary, field } from "@/lib/styles";

interface QRCodeManagerProps {
  paymentQR: PaymentQR | null;
  onUpdate: (qr: PaymentQR) => void;
  isAdmin: boolean;
}

/**
 * Sống trong Tùy chọn. Admin tải ảnh + nhập thông tin ngân hàng;
 * người xem chỉ đọc — cùng một component, hai trạng thái.
 */
export default function QRCodeManager({ paymentQR, onUpdate, isAdmin }: QRCodeManagerProps) {
  const [imageUrl, setImageUrl] = useState(paymentQR?.imageUrl ?? "");
  const [bankName, setBankName] = useState(paymentQR?.bankName ?? "");
  const [accountNumber, setAccountNumber] = useState(paymentQR?.accountNumber ?? "");
  const [accountName, setAccountName] = useState(paymentQR?.accountName ?? "");

  // Firestore đẩy bản mới về → đồng bộ form ngay trong lúc render (không dùng
  // effect: tránh một lượt render thừa hiển thị dữ liệu cũ).
  const stamp = JSON.stringify(paymentQR ?? null);
  const [synced, setSynced] = useState(stamp);
  if (synced !== stamp) {
    setSynced(stamp);
    setImageUrl(paymentQR?.imageUrl ?? "");
    setBankName(paymentQR?.bankName ?? "");
    setAccountNumber(paymentQR?.accountNumber ?? "");
    setAccountName(paymentQR?.accountName ?? "");
  }

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!imageUrl) {
      toast.error("Cần tải lên ảnh QR trước đã");
      return;
    }
    onUpdate({
      imageUrl,
      bankName: bankName.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
      accountName: accountName.trim() || undefined,
    });
  };

  const preview = (
    <div className="flex justify-center">
      {imageUrl ? (
        <div className="p-3 rounded-[16px] bg-qr border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Mã QR chuyển khoản" className="w-[200px] h-[200px] object-contain" />
        </div>
      ) : (
        <div className="w-[224px] h-[224px] rounded-[16px] border border-dashed border-line-strong grid place-items-center text-center px-6">
          <div>
            <QrCode aria-hidden className="w-8 h-8 text-ink-3 mx-auto" />
            <p className="text-small text-ink-2 mt-2">
              {isAdmin ? "Chưa có ảnh QR" : "Người ứng tiền chưa tải ảnh QR"}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  /* ---- Người xem: chỉ đọc --------------------------------------------- */
  if (!isAdmin) {
    const rows = [
      { label: "Ngân hàng", value: paymentQR?.bankName, mono: false },
      { label: "Số tài khoản", value: paymentQR?.accountNumber, mono: true },
      { label: "Chủ tài khoản", value: paymentQR?.accountName, mono: false },
    ].filter((r) => r.value);

    return (
      <div>
        {preview}
        {rows.length > 0 ? (
          <dl className="mt-5">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 py-3 border-t border-line">
                <dt className="text-small text-ink-2">{r.label}</dt>
                <dd className={cn("text-body font-semibold text-right break-all", r.mono && "tnum")}>
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-body text-ink-2 text-center mt-5">
            Người ứng tiền chưa thiết lập thông tin chuyển khoản.
          </p>
        )}
      </div>
    );
  }

  /* ---- Admin: sửa được ------------------------------------------------ */
  const input = (
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    placeholder: string,
    mono = false,
  ) => (
    <div>
      <label htmlFor={id} className="block text-small font-medium text-ink-2 mb-1.5">
        {label}
      </label>
      <div className={field}>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          className={cn("w-full bg-transparent text-body outline-none", mono && "tnum")}
        />
      </div>
    </div>
  );

  return (
    <div>
      {preview}

      <div className="flex gap-2 mt-4">
        <label
          className="flex-1 inline-flex items-center justify-center gap-2 min-h-11 rounded-ctl border
                     border-line-strong text-body font-medium text-ink cursor-pointer
                     hover:bg-wall-2 transition-colors focus-within:ring-2 focus-within:ring-ink"
        >
          <Upload aria-hidden className="w-4 h-4" />
          {imageUrl ? "Đổi ảnh QR" : "Tải ảnh QR"}
          <input type="file" accept="image/*" onChange={upload} className="sr-only" />
        </label>
        {imageUrl && (
          <button
            type="button"
            onClick={() => setImageUrl("")}
            className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-ctl border border-owe
                       text-owe text-body font-medium hover:bg-owe-wash transition-colors"
          >
            <Trash2 aria-hidden className="w-4 h-4" />
            Xóa ảnh
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {input("qr-bank", "Ngân hàng", bankName, setBankName, "Vietcombank")}
        {input("qr-number", "Số tài khoản", accountNumber, setAccountNumber, "0011001234567", true)}
        {input("qr-owner", "Chủ tài khoản", accountName, setAccountName, "NGUYEN VAN MINH")}
      </div>

      <button type="button" onClick={save} className={cn(btnPrimary, "w-full mt-6")}>
        Lưu thông tin
      </button>
    </div>
  );
}
