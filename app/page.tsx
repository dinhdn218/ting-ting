"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Activity, PaymentQR, AdminConfig } from "@/types";
import * as firebaseService from "@/lib/firebaseService";
import { hashPin, verifyPin } from "@/lib/securityUtils";
import { getMe, setMe as persistMe } from "@/lib/identity";
import {
  clearAdminSession,
  getAdminSession,
  saveAdminSession,
} from "@/lib/adminSession";
import {
  EMPTY_FILTER,
  buildLedger,
  filterActivities,
  frequentGroups,
  hasFilter,
  localMonthKey,
  rosterByRelevance,
  threadMonths,
  type ActivityFilter,
} from "@/lib/ledgerSelectors";
import { cn } from "@/lib/utils";

import ChatHeader, { type Tab } from "@/components/ChatHeader";
import PinnedBar from "@/components/PinnedBar";
import FilterBar from "@/components/FilterBar";
import Thread from "@/components/Thread";
import Composer, { type ComposerKind } from "@/components/Composer";
import MembersPanel from "@/components/MembersPanel";
import EmptyThread from "@/components/EmptyThread";
import ThreadSkeleton, { MembersSkeleton } from "@/components/ThreadSkeleton";
import ActivitySheet from "@/components/ActivitySheet";
import PaySheet from "@/components/PaySheet";
import PersonSheet from "@/components/PersonSheet";
import PinSheet from "@/components/PinSheet";
import WhoSheet from "@/components/WhoSheet";
import NotebookMenu from "@/components/NotebookMenu";
import QuickSplitWidget, { type PastTitle } from "@/components/QuickSplitWidget";

type Sheet =
  | null
  | { kind: "pay" }
  | { kind: "activity"; id: string }
  | { kind: "person"; name: string }
  | { kind: "split" }
  | { kind: "pin" }
  | { kind: "who" }
  | { kind: "menu" };

export default function Home() {
  /* ---- dữ liệu ---------------------------------------------------------- */
  const [activities, setActivities] = useState<Activity[]>([]);
  const [paymentQR, setPaymentQR] = useState<PaymentQR | null>(null);
  const [adminConfig, setAdminConfig] = useState<AdminConfig | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [online, setOnline] = useState(true);

  /* ---- vai trò & danh tính ---------------------------------------------- */
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [me, setMeState] = useState<string | null>(null);

  /* ---- điều hướng -------------------------------------------------------- */
  const [tab, setTab] = useState<Tab>("chat");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* ---- tìm & lọc trong luồng ---------------------------------------------- */
  const [filter, setFilter] = useState<ActivityFilter>(EMPTY_FILTER);
  const [searchOpen, setSearchOpen] = useState(false);

  const scroller = useRef<HTMLDivElement>(null);

  /* ---- khởi tạo ---------------------------------------------------------- */
  // localStorage và class .dark chỉ đọc được sau khi mount: đọc lúc render sẽ
  // lệch giữa server và client và gây hydration warning.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeState(getMe());
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");

    // Phiên quản trị còn hạn trên máy này → khỏi nhập PIN lại.
    // getAdminSession() tự dọn phiên hết hạn, ở đây chỉ cần hỏi còn hay không.
    const session = getAdminSession();
    if (session) {
      setIsAdmin(true);
      setAdminName(session.name);
    }
  }, []);

  // Trạng thái kết nối — hiện ở dòng phụ của header
  useEffect(() => {
    const apply = () => setOnline(navigator.onLine);
    apply();
    window.addEventListener("online", apply);
    window.addEventListener("offline", apply);
    return () => {
      window.removeEventListener("online", apply);
      window.removeEventListener("offline", apply);
    };
  }, []);

  useEffect(() => {
    firebaseService
      .getAdminConfig()
      .then(setAdminConfig)
      .catch((error) => console.error("Error loading admin config:", error));
  }, []);

  useEffect(() => {
    let unsubscribeActivities: (() => void) | undefined;
    let unsubscribeQR: (() => void) | undefined;
    try {
      unsubscribeActivities = firebaseService.subscribeToActivities((data) => {
        setActivities(data);
        setLoaded(true);
      });
      unsubscribeQR = firebaseService.subscribeToPaymentQR(setPaymentQR);
    } catch {
      // Không nối được Firestore → thoát skeleton để hiện sổ trống thay vì treo.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(true);
    }
    return () => {
      unsubscribeActivities?.();
      unsubscribeQR?.();
    };
  }, []);

  /* ---- giá trị dẫn xuất — useMemo, không lưu trùng vào state ------------- */
  // Tên trong cài đặt quản trị. Không hiển thị ở đâu nữa (app không còn
  // "người ứng tiền"); chỉ dùng nội bộ cho các phép tính của ledger.
  const payerName = adminConfig?.name ?? adminName ?? "";

  const ledger = useMemo(
    () => buildLedger(activities, payerName, me),
    [activities, payerName, me],
  );

  const filtered = useMemo(() => filterActivities(activities, filter), [activities, filter]);
  const months = useMemo(() => threadMonths(filtered), [filtered]);
  const filtering = hasFilter(filter);
  const shownSum = useMemo(() => filtered.reduce((s, a) => s + a.totalAmount, 0), [filtered]);
  const nowKey = useMemo(() => localMonthKey(new Date()), []);

  // Khi ghi khoản mới: người hay đi cùng lên trước, không theo bảng chữ cái —
  // một khoản chỉ 3–6 người trong sổ mấy chục người.
  const splitRoster = useMemo(() => rosterByRelevance(activities), [activities]);
  const splitGroups = useMemo(() => frequentGroups(activities), [activities]);

  // Gợi ý "Nội dung" khi ghi khoản: nội dung đã dùng, mới nhất trước
  const pastTitles = useMemo(() => {
    const seen = new Set<string>();
    const out: PastTitle[] = [];
    const recent = activities.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    for (const a of recent) {
      const title = a.title.trim();
      if (!title || seen.has(title)) continue;
      seen.add(title);
      out.push({ title, category: a.category });
      if (out.length >= 40) break;
    }
    return out;
  }, [activities]);

  // Luồng chat mở ở tin mới nhất (đáy); cuộn lại khi có khoản mới hoặc quay về tab
  useEffect(() => {
    if (!loaded) return;
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [loaded, filtered.length, tab]);

  /* ---- theme -------------------------------------------------------------- */
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  };

  /* ---- danh tính ---------------------------------------------------------- */
  const pickMe = (name: string) => {
    persistMe(name);
    setMeState(name);
    toast.success(`Xin chào ${name}`);
  };

  const clearMe = () => {
    persistMe(null);
    setMeState(null);
  };

  /* ---- ghi dữ liệu (giữ nguyên chữ ký & luồng) ---------------------------- */
  const addActivity = async (activity: Activity) => {
    try {
      await firebaseService.addActivity(activity);
      toast.success("Đã gửi vào nhóm");
    } catch {
      toast.error("Lỗi khi ghi khoản. Vui lòng thử lại!");
    }
  };

  const updateActivity = async (updated: Activity) => {
    try {
      await firebaseService.updateActivity(updated.id, updated);
    } catch {
      toast.error("Lỗi khi cập nhật. Vui lòng thử lại!");
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      await firebaseService.deleteActivity(id);
      toast.success("Đã xóa khoản");
    } catch {
      toast.error("Lỗi khi xóa. Vui lòng thử lại!");
    }
  };

  const togglePaid = (activity: Activity, name: string) =>
    updateActivity({
      ...activity,
      participants: activity.participants.map((p) =>
        p.name === name ? { ...p, paid: !p.paid } : p,
      ),
    });

  const markAllPaidForPerson = async (personName: string) => {
    try {
      const toUpdate = activities.filter((a) =>
        a.participants.some((p) => p.name === personName && !p.paid),
      );
      for (const activity of toUpdate) {
        await firebaseService.updateActivity(activity.id, {
          ...activity,
          participants: activity.participants.map((p) =>
            p.name === personName ? { ...p, paid: true } : p,
          ),
        });
      }
      toast.success(`Đã tick tất cả khoản của ${personName}`);
    } catch {
      toast.error("Lỗi khi cập nhật. Vui lòng thử lại!");
    }
  };

  const updatePaymentQR = async (qr: PaymentQR) => {
    try {
      await firebaseService.savePaymentQR(qr);
      toast.success("Đã lưu thông tin chuyển khoản");
    } catch {
      toast.error("Lỗi khi lưu QR. Vui lòng thử lại!");
    }
  };

  /* ---- PIN: hash + tự nâng cấp PIN plaintext cũ (giữ nguyên) -------------- */
  const handleAdminLogin = async (pin: string): Promise<boolean> => {
    if (!adminConfig) {
      try {
        const hashedPin = await hashPin(pin);
        const newConfig: AdminConfig = {
          pin: hashedPin,
          name: adminName.trim() || "Admin",
        };
        await firebaseService.saveAdminConfig(newConfig);
        setAdminConfig(newConfig);
        setIsAdmin(true);
        setAdminName(newConfig.name);
        saveAdminSession(newConfig.name);
        setSheet(null);
        toast.success("Sổ đã sẵn sàng — đã vào chế độ quản trị");
        return true;
      } catch {
        toast.error("Lỗi khi tạo tài khoản!");
        return false;
      }
    }

    let isValid = await verifyPin(pin, adminConfig.pin);
    if (!isValid && pin === adminConfig.pin) {
      isValid = true;
      const hashedPin = await hashPin(pin);
      const updatedConfig = { ...adminConfig, pin: hashedPin };
      await firebaseService.saveAdminConfig(updatedConfig);
      setAdminConfig(updatedConfig);
      toast.success("Đã vào chế độ quản trị (PIN đã được nâng cấp bảo mật)");
    } else if (isValid) {
      toast.success("Đã vào chế độ quản trị");
    }

    if (isValid) {
      setIsAdmin(true);
      setAdminName(adminConfig.name);
      // Chỉ lưu SAU khi PIN đã đúng — và chỉ lưu tên + hạn, không lưu PIN.
      saveAdminSession(adminConfig.name);
      setSheet(null);
    }
    return isValid;
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAdmin(false);
    toast.success("Đã thoát quản trị");
  };

  /* ---- ô soạn tin = một hành động, theo trạng thái ------------------------ */
  const composer: { kind: ComposerKind; label: string; onClick: () => void } = isAdmin
    ? { kind: "compose", label: "Ghi khoản mới…", onClick: () => setSheet({ kind: "split" }) }
    : !me
      ? {
          kind: "login",
          label: "Người giữ sổ? Đăng nhập để ghi khoản",
          onClick: () => setSheet({ kind: "pin" }),
        }
      : // Người còn nợ đã có nút Trả mạnh trong tin ghim → ô đáy chỉ là lối phụ
        { kind: "qr", label: "Xem QR chuyển khoản", onClick: () => setSheet({ kind: "pay" }) };

  const openActivity = (activity: Activity) => setSheet({ kind: "activity", id: activity.id });

  const sheetActivity =
    sheet?.kind === "activity" ? (activities.find((a) => a.id === sheet.id) ?? null) : null;

  const empty = loaded && activities.length === 0;

  const openSearch = () => {
    setTab("chat");
    setSearchOpen((o) => {
      if (o) setFilter(EMPTY_FILTER);
      return !o;
    });
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setFilter(EMPTY_FILTER);
  };

  return (
    <div className="relative h-dvh flex flex-col bg-wall">
      {/* Đáy màn, trên ô soạn tin — không che tên nhóm và trạng thái kết nối */}
      <Toaster
        position="bottom-center"
        containerStyle={{ bottom: 88 }}
        toastOptions={{
          duration: 2600,
          style: {
            background: "var(--mine)",
            color: "var(--on-mine)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "15px",
          },
        }}
      />

      <ChatHeader
        me={me}
        memberCount={ledger.roster.length}
        unsettled={ledger.peopleUnsettled}
        isAdmin={isAdmin}
        online={online}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenMenu={() => setSheet({ kind: "menu" })}
        onOpenSearch={openSearch}
        searchActive={searchOpen}
        tab={tab}
        onTab={setTab}
      />

      <div className="flex-1 min-h-0 lg:grid lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* Thành viên — tab ở mobile, cột trái ở desktop */}
        <aside
          aria-label="Thành viên"
          className={cn(
            "h-full min-h-0 overflow-y-auto bg-panel lg:block lg:border-r lg:border-line",
            tab === "members" ? "block" : "hidden",
          )}
        >
          {!loaded ? (
            <MembersSkeleton />
          ) : (
            <MembersPanel
              ledger={ledger}
              isAdmin={isAdmin}
              activitiesCount={activities.length}
              onOpenPerson={(name) => setSheet({ kind: "person", name })}
            />
          )}
        </aside>

        {/* Trò chuyện */}
        <section
          aria-label="Trò chuyện"
          className={cn("h-full min-h-0 flex-col lg:flex", tab === "chat" ? "flex" : "hidden")}
        >
          {loaded && !empty && (
            <PinnedBar
              ledger={ledger}
              me={me}
              onPickMe={pickMe}
              onOpenWho={() => setSheet({ kind: "who" })}
              onPay={() => setSheet({ kind: "pay" })}
              onOpenMe={() => me && setSheet({ kind: "person", name: me })}
              onOpenMembers={() => setTab("members")}
            />
          )}

          {searchOpen && (
            <FilterBar
              filter={filter}
              onChange={setFilter}
              onClose={closeSearch}
              all={activities}
              shownCount={filtered.length}
              shownSum={shownSum}
            />
          )}

          <div ref={scroller} className="flex-1 min-h-0 overflow-y-auto">
            {!loaded ? (
              <ThreadSkeleton />
            ) : empty ? (
              <EmptyThread isAdmin={isAdmin} onAdd={() => setSheet({ kind: "split" })} />
            ) : (
              <Thread
                months={months}
                me={me}
                payerName={payerName}
                onOpen={openActivity}
                filtered={filtering}
                onClearFilter={() => setFilter(EMPTY_FILTER)}
                nowKey={nowKey}
              />
            )}
          </div>

          {loaded && (
            <Composer kind={composer.kind} label={composer.label} onClick={composer.onClick} />
          )}
        </section>
      </div>

      {/* ---- Lớp phủ: Sheet cho mọi nội dung ---------------------------- */}
      <PaySheet
        open={sheet?.kind === "pay"}
        onClose={() => setSheet(null)}
        amount={ledger.payTarget}
        paymentQR={paymentQR}
      />

      <ActivitySheet
        activity={sheetActivity}
        payerName={payerName}
        onClose={() => setSheet(null)}
        onToggle={togglePaid}
        onDelete={deleteActivity}
        onOpenPay={() => setSheet({ kind: "pay" })}
        isAdmin={isAdmin}
        me={me}
      />

      <PersonSheet
        name={sheet?.kind === "person" ? sheet.name : null}
        activities={activities}
        onClose={() => setSheet(null)}
        onOpenActivity={openActivity}
        onOpenPay={() => setSheet({ kind: "pay" })}
        onToggle={togglePaid}
        onMarkAllPaid={markAllPaidForPerson}
        me={me}
        isAdmin={isAdmin}
        isPayer={sheet?.kind === "person" && sheet.name === payerName}
      />

      <WhoSheet
        key={sheet?.kind === "who" ? "who-open" : "who-closed"}
        open={sheet?.kind === "who"}
        onClose={() => setSheet(null)}
        roster={ledger.roster}
        me={me}
        onPick={pickMe}
        onClear={clearMe}
      />

      <QuickSplitWidget
        key={sheet?.kind === "split" ? "split-open" : "split-closed"}
        open={sheet?.kind === "split"}
        onClose={() => setSheet(null)}
        onAdd={addActivity}
        existingParticipants={splitRoster}
        frequentGroups={splitGroups}
        pastTitles={pastTitles}
        payerName={payerName}
      />

      <PinSheet
        key={sheet?.kind === "pin" ? "pin-open" : "pin-closed"}
        open={sheet?.kind === "pin"}
        onClose={() => setSheet(null)}
        onSubmit={handleAdminLogin}
        isFirstTime={!adminConfig}
        adminName={adminName}
        onAdminNameChange={setAdminName}
      />

      <NotebookMenu
        open={sheet?.kind === "menu"}
        onClose={() => setSheet(null)}
        me={me}
        onClearMe={clearMe}
        isAdmin={isAdmin}
        onLogin={() => setSheet({ kind: "pin" })}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        activities={activities}
        paymentQR={paymentQR}
        onUpdateQR={updatePaymentQR}
      />
    </div>
  );
}
