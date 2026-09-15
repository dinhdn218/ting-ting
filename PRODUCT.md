# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Thành viên nhóm** (đa số): nhóm bạn hoặc đồng nghiệp nhỏ, khoảng 5–20 người. Họ mở link từ Zalo/Messenger trên điện thoại, không đăng nhập, chọn "Bạn là ai" rồi xem mình còn nợ bao nhiêu và quét QR để chuyển khoản. Mỗi lần mở chỉ vài chục giây.
- **Người giữ sổ — Định** (một người): ghi các khoản chi, tick ai đã trả, quản lý ảnh QR và thông tin ngân hàng; vào chế độ quản trị bằng mã PIN. Định cũng là một thành viên trong danh sách chia như mọi người. App không hiển thị "người ứng tiền" hay "Admin" ở đâu cả (người dùng chọn, 15/9/2026).

## Product Purpose

Ting Ting là sổ chi tiêu chung của một nhóm. Nó trả lời ngay: **ai còn nợ bao nhiêu, trả cho ai, trả bằng cách nào**. Sản phẩm thành công khi thành viên trả nợ mà không phải hỏi lại con số, và admin không phải đi nhắc từng người.

## Positioning

Chỉ có một người nhận tiền và các thành viên không cần tài khoản. Mỗi thành viên mở link là thấy đúng con số của mình, bấm một nút là có QR kèm số tiền đúng. Sản phẩm không phải app kế toán nhiều ví hay app gamification nợ nần.

## Operating Context

- Link chia sẻ trong nhóm chat, mở chủ yếu trên điện thoại (PWA, hướng dọc); admin đôi khi dùng laptop.
- Luồng thành viên: mở link → chọn tên (lưu trên máy) → thấy số mình nợ → mở QR / copy số tiền → chuyển khoản trong app ngân hàng → nhắn admin.
- Luồng admin: nhập PIN → ghi khoản mới (số tiền, nội dung, danh mục, chia đều / % / chính xác, chọn người) → tick đã trả theo từng khoản hoặc cho cả một người → xuất báo cáo công nợ.
- Dữ liệu cập nhật realtime qua Firestore cho mọi người đang mở.

## Capabilities and Constraints

Chức năng đã có (redesign phải giữ đủ, không thêm hay bớt tính năng):

- Sổ: số tiền của "tôi" (nợ / phải thu / đã xong), tổng nhóm (tổng chi, đã thu, còn nợ, % đã thu), danh sách "ai nợ ai" (người nợ nhiều lên trước), ghi chép gần đây.
- Hoạt động: danh sách nhóm theo tháng kèm tổng tháng, tìm theo tên khoản hoặc tên người, lọc theo danh mục.
- Chi tiết khoản: phần của từng người, tick đã trả (admin), xóa khoản có xác nhận (admin), trả phần của mình.
- Chi tiết người: tổng còn nợ, từng khoản kèm trạng thái, tick đã trả tất cả (admin), trả ngay (chính mình).
- Trả tiền: ảnh QR, ngân hàng, số tài khoản, chủ tài khoản, copy số tiền.
- Ghi khoản mới: số tiền (nút +50K/+100K/+500K), nội dung (gợi ý từ khoản cũ), thời gian diễn ra, 6 danh mục, 3 cách chia, tìm/thêm người, dòng "còn lại chưa chia". Không ai tự nằm sẵn trong danh sách chia. Khi Định (người ghi sổ) có trong danh sách chia, phần của Định được tick "đã trả" sẵn lúc lưu; người khác thì không (người dùng chọn, 15/9/2026).
- Quản trị: PIN được hash, tự nâng cấp PIN plaintext cũ, lần đầu tạo admin; quản lý QR; xuất Excel / CSV / JSON (chỉ khoản chưa trả).
- Sáng / tối, lưu trên máy.

**Chức năng có trong code nhưng giao diện hiện tại chưa hiển thị. Redesign phải đưa các chức năng này vào:**

- Thống kê chi tiêu theo danh mục (tỉ lệ và số tiền) và thống kê số người đã trả đủ / còn nợ (`components/Overview.tsx`, `components/DebtSummary.tsx`).
- Tổng phải trả / đã trả / còn nợ và tiến độ của từng người (`DebtSummary`).
- Tick đã trả từng khoản ngay trong chi tiết một người, và xác nhận trước khi "tick tất cả" (`DebtSummary`).
- Lọc hoạt động theo trạng thái đã trả / chưa trả và theo ngày, hiện các bộ lọc đang bật (`components/SearchFilter.tsx`).
- Tóm tắt nhanh ai đang còn nợ (chuông đếm số người, `components/TopBar.tsx`) và trạng thái kết nối.

Ràng buộc kỹ thuật: Next.js 16 App Router, React 19, Tailwind v4 (CSS-first, không có tailwind.config), shadcn/base-ui trong `components/ui/`, GSAP, Firebase Firestore. Mọi số tiền phải đi qua `shareOf()` / `lib/ledgerSelectors.ts`; không bao giờ tính bằng `totalAmount / participants.length`. Mô hình dữ liệu Firestore giữ nguyên. Chỉ có một người giữ sổ (chế độ quản trị) và một tài khoản nhận tiền (thông tin trong QR). Chưa có chức năng sửa khoản đã ghi.

## Brand Commitments

- Tên sản phẩm: **Ting Ting** — tiếng báo tiền về trong app ngân hàng (đổi từ "Sổ Chung" ngày 15/9/2026). Khóa localStorage `so-chung:me` giữ nguyên để không mất tên đã chọn trên máy người dùng.
- Toàn bộ giao diện bằng tiếng Việt, tiền VND định dạng `vi-VN`.
- Giọng văn thân mật, ngắn, như bạn bè nhắn nhau ("Chuyển xong nhắn … một tiếng").

## Evidence on Hand

- Dữ liệu thật nằm trên Firestore; trong repo không có dữ liệu mẫu, ảnh chụp màn hình hay testimonial. Không được bịa số liệu người dùng hay lời chứng thực.
- Icon hiện có: `app/icon.svg`.

## Product Principles

1. **Con số của tôi đi trước.** Mở ra là thấy mình nợ bao nhiêu và trả cho ai, trước mọi thống kê.
2. **Trả được trong một chạm.** Từ con số đến QR và số tiền đúng, không phải nhớ hay gõ lại.
3. **Không phán xét, nhưng rõ việc cần thu.** Không huy chương, không bảng thành tích, không lời chê trách. Danh sách người còn nợ xếp theo số tiền giảm dần để thấy ngay khoản lớn cần thu (người dùng chọn ngày 15/9/2026).
4. **Không cần tài khoản.** Thành viên chỉ chọn tên; quyền sửa chỉ nằm ở admin.
5. **Mọi con số khớp nhau.** Một nguồn tính duy nhất; tổng, phần từng người và báo cáo xuất ra phải trùng khớp.

## Accessibility & Inclusion

Vùng chạm ≥ 44px. Trạng thái đã trả / chưa trả không được chỉ dựa vào màu (dùng thêm dấu, nhãn chữ, kiểu viền). Tương phản đạt WCAG AA ở cả sáng và tối. Tôn trọng `prefers-reduced-motion`.
