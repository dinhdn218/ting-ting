"use client";

import { EllipsisVertical, Moon, Search, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconBtn } from "@/lib/styles";
import Avatar from "@/components/Avatar";
import AppLogo from "@/components/AppLogo";

export type Tab = "chat" | "members";

interface ChatHeaderProps {
  /** Tên đã chọn trên máy này — hiện chữ tắt vàng chéo góc logo */
  me: string | null;
  memberCount: number;
  unsettled: number;
  isAdmin: boolean;
  online: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  searchActive: boolean;
  tab: Tab;
  onTab: (tab: Tab) => void;
}

/** Header nhóm chat: logo Ting Ting, tên, dòng phụ "ai còn nợ", và hai tab ở mobile. */
export default function ChatHeader({
  me,
  memberCount,
  unsettled,
  isAdmin,
  online,
  theme,
  onToggleTheme,
  onOpenMenu,
  onOpenSearch,
  searchActive,
  tab,
  onTab,
}: ChatHeaderProps) {
  const tabBtn = (key: Tab, label: string, badge?: number) => (
    <button
      type="button"
      onClick={() => onTab(key)}
      aria-current={tab === key ? "page" : undefined}
      className={cn(
        "relative min-h-11 text-body font-semibold transition-colors",
        tab === key ? "text-ink" : "text-ink-3 hover:text-ink-2",
      )}
    >
      {label}
      {badge ? <span className="ml-1.5 tnum font-medium text-ink-3">{badge}</span> : null}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-12 rounded-t-full transition-colors",
          tab === key ? "bg-ink" : "bg-transparent",
        )}
      />
    </button>
  );

  return (
    <header className="flex-none bg-panel border-b border-line pt-safe">
      <div className="flex items-center gap-3 px-3 sm:px-4 h-16">
        <button
          type="button"
          onClick={() => onTab("members")}
          className="flex items-center gap-3 min-w-0 flex-1 text-left rounded-ctl"
          aria-label={`Ting Ting, ${memberCount} người, ${unsettled} người còn nợ. Xem thành viên`}
        >
          {/* Logo giống favicon; đã chọn tên thì chữ tắt vàng của bạn nằm chéo góc */}
          <span aria-hidden className="relative block w-11 h-11 shrink-0">
            {me ? (
              <>
                <AppLogo className="absolute left-0 top-0 w-[34px] h-[34px]" />
                <Avatar
                  name={me}
                  size="xs"
                  tone="me"
                  className="absolute -right-0.5 -bottom-0.5 w-[22px] h-[22px] text-[9px] ring-2 ring-panel"
                />
              </>
            ) : (
              <AppLogo className="w-11 h-11" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-row font-semibold leading-tight truncate">
              Ting Ting
            </span>
            <span className="flex items-center gap-1.5 text-small text-ink-2 truncate mt-0.5">
              <span
                aria-hidden
                className={cn(
                  "w-2 h-2 shrink-0 rounded-full",
                  online ? "bg-paid" : "bg-owe",
                )}
              />
              <span className="truncate tnum">
                {online ? (
                  "Trực tiếp · "
                ) : (
                  <span className="text-owe font-medium">Mất kết nối · </span>
                )}
                {/* Mobile: nhường chỗ cho "ai còn nợ" — số người vẫn có ở màn Thành viên */}
                <span className="hidden sm:inline">{memberCount} người · </span>
                {unsettled > 0 ? `${unsettled} người còn nợ` : "không ai còn nợ"}
                {isAdmin ? " · quản trị" : ""}
              </span>
            </span>
          </span>
        </button>

        <div className="flex items-center -mr-1">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Tìm và lọc khoản chi"
            aria-pressed={searchActive}
            className={iconBtn}
          >
            <Search className="w-5 h-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Chuyển giao diện sáng" : "Chuyển giao diện tối"}
            className={iconBtn}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" aria-hidden />
            ) : (
              <Moon className="w-5 h-5" aria-hidden />
            )}
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Tùy chọn"
            className={iconBtn}
          >
            <EllipsisVertical className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* Hai tab — ẩn ở desktop, nơi hai cột hiện cùng lúc */}
      <nav aria-label="Màn hình" className="grid grid-cols-2 lg:hidden">
        {tabBtn("chat", "Trò chuyện")}
        {tabBtn("members", "Thành viên", unsettled)}
      </nav>
    </header>
  );
}
