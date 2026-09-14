/**
 * lib/ledgerSelectors.ts — mọi giá trị dẫn xuất của Sổ Chung.
 *
 * Lý do tách ra một file: mọi con số tiền trong app phải đi qua ĐÚNG MỘT
 * đường — shareOf() — nên đặt hết công thức ở đây, component chỉ đọc kết quả.
 *
 * KHÔNG BAO GIỜ tính lại bằng totalAmount / participants.length:
 * sẽ sai với bill chia theo % hoặc chia chính xác.
 */

import type { Activity, ActivityCategory } from '@/types';
import { shareOf } from '@/lib/utils';

/* ---------- Tổng của nhóm ---------------------------------------------- */

export interface GroupTotals {
  total: number;        // tổng chi
  collected: number;    // đã thu (tổng phần của những người đã tick paid)
  outstanding: number;  // còn nợ
  pct: number;          // % đã thu, 0–100, đã làm tròn
}

export function groupTotals(activities: Activity[]): GroupTotals {
  let total = 0;
  let collected = 0;

  for (const a of activities) {
    total += a.totalAmount;
    for (const p of a.participants) {
      if (p.paid) collected += shareOf(a, p);
    }
  }

  const outstanding = Math.max(0, total - collected);
  return {
    total,
    collected,
    outstanding,
    pct: total ? Math.round((collected / total) * 100) : 0,
  };
}

/** Pha của nhóm — luôn hiển thị bằng chữ, không chỉ bằng màu. */
export type GroupPhase = 'owing' | 'almost' | 'done';

export const PHASE_LABELS: Record<GroupPhase, string> = {
  owing: 'Còn nợ',
  almost: 'Gần xong',
  done: 'Xong hết',
};

export function groupPhase(t: GroupTotals): GroupPhase {
  if (t.total > 0 && t.outstanding === 0) return 'done';
  if (t.pct >= 80) return 'almost';
  return 'owing';
}

/* ---------- Theo từng người -------------------------------------------- */

/** Số tiền một người còn nợ = tổng phần chưa tick paid của người đó. */
export function owedBy(activities: Activity[], name: string): number {
  let sum = 0;
  for (const a of activities) {
    for (const p of a.participants) {
      if (p.name === name && !p.paid) sum += shareOf(a, p);
    }
  }
  return sum;
}

export interface PersonCounts {
  unpaid: number;
  total: number;
}

export function countsFor(activities: Activity[], name: string): PersonCounts {
  let unpaid = 0;
  let total = 0;
  for (const a of activities) {
    for (const p of a.participants) {
      if (p.name !== name) continue;
      total++;
      if (!p.paid) unpaid++;
    }
  }
  return { unpaid, total };
}

/** Tổng phần phải trả và phần đã trả của một người. */
export function sharesFor(
  activities: Activity[],
  name: string,
): { total: number; paid: number } {
  let total = 0;
  let paid = 0;
  for (const a of activities) {
    for (const p of a.participants) {
      if (p.name !== name) continue;
      const s = shareOf(a, p);
      total += s;
      if (p.paid) paid += s;
    }
  }
  return { total, paid };
}

/** Danh sách tên xuất hiện trong dữ liệu (nguồn cho "Bạn là ai?"). */
export function roster(activities: Activity[]): string[] {
  const seen = new Set<string>();
  for (const a of activities) {
    for (const p of a.participants) seen.add(p.name);
  }
  return Array.from(seen);
}

/* ---------- Dòng thành viên -------------------------------------------- */

export interface PersonRow {
  name: string;
  initials: string;
  /** Còn nợ; với người ứng tiền là CÒN PHẢI THU của cả nhóm */
  owed: number;
  unpaidCount: number;
  totalCount: number;
  /** Tổng phần của người này và phần đã trả — cho thanh tiến độ */
  shareTotal: number;
  sharePaid: number;
  settled: boolean;
  isPayer: boolean;
  isMe: boolean;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Sắp theo số tiền nợ giảm dần. KHÔNG có hạng, KHÔNG huy chương —
 * ghi chép, không phán xét. Người ứng tiền tách riêng và luôn xếp cuối.
 */
export function personRows(
  activities: Activity[],
  payerName: string,
  me: string | null,
): PersonRow[] {
  const names = roster(activities);

  const rows: PersonRow[] = names
    .filter((n) => n !== payerName)
    .map((name) => {
      const counts = countsFor(activities, name);
      const owed = owedBy(activities, name);
      const shares = sharesFor(activities, name);
      return {
        name,
        initials: initials(name),
        owed,
        unpaidCount: counts.unpaid,
        totalCount: counts.total,
        shareTotal: shares.total,
        sharePaid: shares.paid,
        settled: owed === 0,
        isPayer: false,
        isMe: name === me,
      };
    })
    // Không xếp theo số nợ (thành bảng xếp hạng): "bạn" lên đầu, rồi theo tên
    .sort((a, b) => Number(b.isMe) - Number(a.isMe) || a.name.localeCompare(b.name, 'vi'));

  if (names.includes(payerName)) {
    const counts = countsFor(activities, payerName);
    const shares = sharesFor(activities, payerName);
    rows.push({
      name: payerName,
      initials: initials(payerName),
      owed: groupTotals(activities).outstanding,
      unpaidCount: counts.unpaid,
      totalCount: counts.total,
      shareTotal: shares.total,
      sharePaid: shares.paid,
      settled: false,
      isPayer: true,
      isMe: payerName === me,
    });
  }

  return rows;
}

/* ---------- Danh mục ---------------------------------------------------- */

export interface CategoryShare {
  category: ActivityCategory;
  amount: number;
  count: number;
  /** 0–100, làm tròn */
  pct: number;
}

export function categoryBreakdown(activities: Activity[]): CategoryShare[] {
  const map = new Map<ActivityCategory, { amount: number; count: number }>();
  let total = 0;
  for (const a of activities) {
    const c = (a.category ?? 'other') as ActivityCategory;
    const cur = map.get(c) ?? { amount: 0, count: 0 };
    map.set(c, { amount: cur.amount + a.totalAmount, count: cur.count + 1 });
    total += a.totalAmount;
  }
  return Array.from(map.entries())
    .map(([category, v]) => ({
      category,
      amount: v.amount,
      count: v.count,
      pct: total ? Math.round((v.amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/* ---------- Một khoản --------------------------------------------------- */

export interface ActivityRow {
  activity: Activity;
  paidCount: number;
  done: boolean;
  /** "01.09" */
  dayLabel: string;
  /** "1/4 đã trả" hoặc "Xong" */
  progressLabel: string;
}

/**
 * Nhãn cách chia. Suy ra từ dữ liệu vì Activity không có field splitMode:
 * không ai có shareAmount → chia đều; có → chia riêng (% hoặc chính xác).
 */
export function splitLabel(a: Activity): string {
  const custom = a.participants.some((p) => p.shareAmount != null);
  return custom ? 'chia riêng' : 'chia đều';
}

export function activityRow(a: Activity): ActivityRow {
  const paidCount = a.participants.filter((p) => p.paid).length;
  const done = paidCount === a.participants.length && a.participants.length > 0;
  const dd = a.date.slice(8, 10);
  const mm = a.date.slice(5, 7);

  return {
    activity: a,
    paidCount,
    done,
    dayLabel: `${dd}.${mm}`,
    progressLabel: done ? 'Xong' : `${paidCount}/${a.participants.length} đã trả`,
  };
}

/** Số tiền còn phải thu của một khoản. */
export function activityDue(a: Activity): number {
  let due = 0;
  for (const p of a.participants) {
    if (!p.paid) due += shareOf(a, p);
  }
  return due;
}

/* ---------- Lọc ---------------------------------------------------------- */

export type StatusFilter = 'all' | 'paid' | 'unpaid';

export interface ActivityFilter {
  query: string;
  category: string; // 'all' | ActivityCategory
  status: StatusFilter;
  /** '' hoặc 'YYYY-MM-DD' */
  date: string;
}

export const EMPTY_FILTER: ActivityFilter = {
  query: '',
  category: 'all',
  status: 'all',
  date: '',
};

export function hasFilter(f: ActivityFilter): boolean {
  return (
    f.query.trim() !== '' || f.category !== 'all' || f.status !== 'all' || f.date !== ''
  );
}

export function filterActivities(activities: Activity[], f: ActivityFilter): Activity[] {
  const q = f.query.trim().toLowerCase();

  return activities.filter((a) => {
    if (f.category !== 'all' && a.category !== f.category) return false;
    if (f.status === 'paid' && !a.participants.every((p) => p.paid)) return false;
    if (f.status === 'unpaid' && !a.participants.some((p) => !p.paid)) return false;
    if (f.date && localDayKey(a.date) !== f.date) return false;
    if (!q) return true;
    if (a.title.toLowerCase().includes(q)) return true;
    // Tìm cả theo tên người — chủ ý, không phải phụ phẩm
    return a.participants.some((p) => p.name.toLowerCase().includes(q));
  });
}

/* ---------- Luồng trò chuyện: tháng → ngày, cũ ở trên, mới ở dưới ------- */

const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export interface ThreadDay {
  key: string;
  /** "Thứ Bảy, 13/9" */
  label: string;
  rows: ActivityRow[];
}

export interface ThreadMonth {
  key: string;
  /** "Tháng 9 · 2026" */
  label: string;
  month: number;
  year: number;
  sum: number;
  count: number;
  categories: CategoryShare[];
  days: ThreadDay[];
}

/**
 * Ngày theo giờ máy người xem (VN là UTC+7): khoản lúc 01:00 sáng ngày 14
 * phải nằm dưới nhãn ngày 14, không phải ngày 13 như khi cắt chuỗi UTC.
 */
function localParts(iso: string): { y: number; m: number; d: number; wd: number } {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) {
    const y = parseInt(iso.slice(0, 4), 10);
    const m = parseInt(iso.slice(5, 7), 10);
    const d = parseInt(iso.slice(8, 10), 10);
    return { y, m, d, wd: new Date(y, m - 1, d).getDay() };
  }
  return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate(), wd: t.getDay() };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-09-14" theo giờ địa phương — khóa ngày cho luồng và bộ lọc ngày. */
export function localDayKey(iso: string): string {
  const { y, m, d } = localParts(iso);
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** "2026-09" theo giờ địa phương. */
export function localMonthKey(date: Date | string): string {
  const { y, m } = localParts(typeof date === 'string' ? date : date.toISOString());
  return `${y}-${pad(m)}`;
}

function dayLabelOf(iso: string): string {
  const { m, d, wd } = localParts(iso);
  return `${WEEKDAYS[wd]}, ${d}/${m}`;
}

export function threadMonths(activities: Activity[]): ThreadMonth[] {
  const sorted = activities
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const months: ThreadMonth[] = [];
  const buckets = new Map<string, Activity[]>();

  for (const a of sorted) {
    const mKey = localMonthKey(a.date);
    let m = months.find((x) => x.key === mKey);
    if (!m) {
      const { m: month, y: year } = localParts(a.date);
      m = {
        key: mKey,
        label: `Tháng ${month} · ${year}`,
        month,
        year,
        sum: 0,
        count: 0,
        categories: [],
        days: [],
      };
      months.push(m);
      buckets.set(mKey, []);
    }
    m.sum += a.totalAmount;
    m.count += 1;
    buckets.get(mKey)!.push(a);

    const dKey = a.date.slice(0, 10);
    let d = m.days.find((x) => x.key === dKey);
    if (!d) {
      d = { key: dKey, label: dayLabelOf(a.date), rows: [] };
      m.days.push(d);
    }
    d.rows.push(activityRow(a));
  }

  for (const m of months) m.categories = categoryBreakdown(buckets.get(m.key) ?? []);
  return months;
}

/* ---------- Định dạng tiền --------------------------------------------- */

/** "1.373.000đ" */
export function money(n: number): string {
  return Math.round(n).toLocaleString('vi-VN') + 'đ';
}

/** "1.373.000" — cho nút copy và dòng phụ */
export function plain(n: number): string {
  return Math.round(n).toLocaleString('vi-VN');
}

/**
 * Tiền có dấu. Dấu −/+ là MỘT trong ba tầng phân biệt vào/ra
 * (dấu · nhãn chữ · biểu tượng ✓) nên không được bỏ.
 */
export function signed(n: number, direction: 'out' | 'in'): string {
  if (n === 0) return '0đ';
  return (direction === 'out' ? '−' : '+') + money(n);
}

/* ---------- Gói chung cho page.tsx ------------------------------------- */

export function buildLedger(
  activities: Activity[],
  payerName: string,
  me: string | null,
) {
  const totals = groupTotals(activities);
  const rows = personRows(activities, payerName, me);
  const myOwed = me ? owedBy(activities, me) : 0;
  const iAmPayer = !!me && me === payerName;
  const members = rows.filter((r) => !r.isPayer);

  return {
    ...totals,
    phase: groupPhase(totals),
    rows,
    roster: roster(activities),
    myOwed,
    iAmPayer,
    myCounts: me ? countsFor(activities, me) : { unpaid: 0, total: 0 },
    /** Số tiền nút Trả sẽ mời trả */
    payTarget: me && !iAmPayer ? myOwed : totals.outstanding,
    peopleUnsettled: members.filter((r) => !r.settled).length,
    peopleSettled: members.filter((r) => r.settled).length,
    categories: categoryBreakdown(activities),
  };
}

export type Ledger = ReturnType<typeof buildLedger>;
