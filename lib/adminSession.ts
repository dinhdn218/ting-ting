/**
 * lib/adminSession.ts — nhớ "đã mở khóa quản trị" trên MÁY NÀY, có hạn.
 *
 * KHÔNG BAO GIỜ lưu PIN, cũng không lưu hash của PIN: chỉ lưu một dấu
 * "đã xác thực lúc nào, đến khi nào thì hết". Người nhặt được máy cùng lắm
 * dùng được tới lúc hết hạn, chứ không lấy được PIN để dùng ở máy khác.
 *
 * Đây chỉ là tiện lợi ở giao diện. Thứ thực sự bảo vệ sổ là Firestore
 * Security Rules — client không tự bảo vệ được chính nó.
 */

const KEY = 'so-chung:admin';

/** 7 ngày — đủ để không phải nhập lại mỗi ngày, máy thất lạc thì tự hết. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

interface AdminSession {
  /** Tên người quản trị lúc mở khóa, để hiện lại đúng tên */
  name: string;
  /** Mốc hết hạn, milliseconds kể từ epoch */
  until: number;
}

function isSession(v: unknown): v is AdminSession {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.name === 'string' && typeof o.until === 'number';
}

/**
 * Phiên còn hạn, hoặc null. Hết hạn/hỏng thì dọn luôn cho sạch —
 * đọc là lúc duy nhất chắc chắn có người đang dùng app.
 */
export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isSession(parsed) || parsed.until <= Date.now()) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    // JSON hỏng hoặc private mode: coi như chưa đăng nhập
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
    return null;
  }
}

/** Gọi SAU KHI verifyPin trả true, không bao giờ trước. */
export function saveAdminSession(name: string): void {
  if (typeof window === 'undefined') return;
  try {
    const session: AdminSession = { name, until: Date.now() + MAX_AGE_MS };
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* private mode: bỏ qua, chỉ mất tiện lợi chứ không mất chức năng */
  }
}

/** Thoát quản trị — xóa ngay, không đợi hết hạn. */
export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}
