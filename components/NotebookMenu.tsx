"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  LogOut,
  Moon,
  QrCode,
  ShieldCheck,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { Activity, PaymentQR } from "@/types";
import { exportToCSV, exportToExcel, exportToJSON } from "@/lib/exportUtils";
import SheetShell from "@/components/SheetShell";
import QRCodeManager from "@/components/QRCodeManager";
import { cn } from "@/lib/utils";

interface NotebookMenuProps {
  open: boolean;
  onClose: () => void;
  me: string | null;
  onClearMe: () => void;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  activities: Activity[];
  paymentQR: PaymentQR | null;
  onUpdateQR: (qr: PaymentQR) => void;
}

type Panel = null | "qr" | "export";

/** Tùy chọn nhóm: danh tính, quản trị, giao diện, QR, xuất dữ liệu. */
export default function NotebookMenu({
  open,
  onClose,
  me,
  onClearMe,
  isAdmin,
  onLogin,
  onLogout,
  theme,
  onToggleTheme,
  activities,
  paymentQR,
  onUpdateQR,
}: NotebookMenuProps) {
  const [panel, setPanel] = useState<Panel>(null);

  const close = () => {
    setPanel(null);
    onClose();
  };

  const doExport = (kind: "excel" | "csv" | "json") => {
    try {
      if (kind === "excel") exportToExcel(activities);
      else if (kind === "csv") exportToCSV(activities);
      else exportToJSON(activities);
      toast.success("Đã xuất dữ liệu");
    } catch {
      toast.error("Lỗi khi xuất dữ liệu — thử lại nhé");
    }
  };

  const row = (
    Icon: LucideIcon,
    label: string,
    hint: string,
    value: string,
    onClick: () => void,
    attention?: boolean,
  ) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className="w-full text-left grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3
                 min-h-16 py-2 border-b border-line"
    >
      <span className="w-10 h-10 grid place-items-center rounded-full bg-wall-2 text-ink-2">
        <Icon aria-hidden className="w-[18px] h-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-body font-medium truncate">{label}</span>
        <span className="block text-small text-ink-3 truncate">{hint}</span>
      </span>
      <span
        className={cn(
          "flex items-center gap-1 text-small font-medium shrink-0",
          attention ? "text-owe" : "text-ink-2",
        )}
      >
        {value}
        <ChevronRight aria-hidden className="w-4 h-4 text-ink-3" />
      </span>
    </button>
  );

  const back = (title: string) => (
    <div>
      <button
        type="button"
        onClick={() => setPanel(null)}
        className="inline-flex items-center gap-1.5 min-h-11 -ml-1 px-1 text-small font-medium text-ink-2 hover:text-ink"
      >
        <ArrowLeft aria-hidden className="w-4 h-4" />
        Tùy chọn
      </button>
      <h2 className="text-head font-semibold">{title}</h2>
    </div>
  );

  if (panel === "qr") {
    return (
      <SheetShell open={open} onClose={close} header={back("QR chuyển khoản")}>
        <div className="border-t border-line pt-4">
          <QRCodeManager paymentQR={paymentQR} onUpdate={onUpdateQR} isAdmin={isAdmin} />
        </div>
      </SheetShell>
    );
  }

  if (panel === "export") {
    return (
      <SheetShell open={open} onClose={close} header={back("Xuất công nợ")}>
        <div className="border-t border-line">
          <p className="text-small text-ink-2 py-3">
            Chỉ gồm các khoản còn người chưa trả, gom theo từng người.
          </p>
          {(
            [
              ["Excel", "Mở bằng Excel · .xls", "excel"],
              ["CSV", "Google Sheets · .csv", "csv"],
              ["JSON", "Sao lưu dữ liệu · .json", "json"],
            ] as const
          ).map(([label, hint, kind]) => row(Download, label, hint, "Tải", () => doExport(kind)))}
          {activities.length === 0 && (
            <p className="text-body text-ink-2 mt-4">Sổ đang trống — chưa có gì để xuất.</p>
          )}
        </div>
      </SheetShell>
    );
  }

  return (
    <SheetShell open={open} onClose={close} header={<h2 className="text-head font-semibold">Tùy chọn</h2>}>
      <div className="border-t border-line">
        {row(
          UserRound,
          "Bạn là ai",
          me ? "Chạm để chọn lại tên của bạn" : "Chọn tên để thấy số của mình",
          me ?? "Chưa chọn",
          () => {
            onClearMe();
            close();
          },
          !me,
        )}

        {isAdmin
          ? row(LogOut, "Thoát quản trị", "Về chế độ chỉ xem", "Thoát", () => {
              onLogout();
              close();
            })
          : row(ShieldCheck, "Đăng nhập quản trị", "Cần mã PIN để ghi hoặc sửa khoản", "PIN", () => {
              close();
              onLogin();
            })}

        {row(
          theme === "dark" ? Moon : Sun,
          "Giao diện",
          "Sáng hoặc tối, lưu trên máy này",
          theme === "dark" ? "Tối" : "Sáng",
          onToggleTheme,
        )}

        {row(
          QrCode,
          "QR chuyển khoản",
          isAdmin ? "Tải ảnh QR và thông tin ngân hàng" : "Xem thông tin chuyển khoản",
          "Mở",
          () => setPanel("qr"),
        )}

        {row(Download, "Xuất công nợ", "Excel · CSV · JSON", "Mở", () => setPanel("export"))}
      </div>
    </SheetShell>
  );
}
