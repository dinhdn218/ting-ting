---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Surface brief — Ting Ting (toàn app)

Scope: toàn bộ app (app/page.tsx và mọi sheet). Mode: Operate. Redesign thay thế thế giới "sổ giấy + con dấu". Tên app đổi từ "Sổ Chung" sang "Ting Ting" ngày 15/9/2026.
Audience/job: thành viên xem số mình nợ và trả bằng QR; admin ghi khoản, tick đã trả; cả nhóm xem tổng kết.
Constraints: giữ đủ chức năng, dữ liệu Firestore và lib/ledgerSelectors; đưa vào các chức năng đang ẩn (thống kê danh mục, tiến độ từng người, tick từng khoản trong hồ sơ người + xác nhận tick tất cả, lọc trạng thái/ngày, tóm tắt ai còn nợ, trạng thái kết nối).

## Direction contract

THESIS: Ting Ting là cuộc trò chuyện của nhóm biết tính tiền. Mỗi khoản là một tin hóa đơn trong luồng của nhóm (không có "người ứng tiền" hay avatar người gửi), ai trả rồi hiện ✓ như dấu đã xem. Từ chối kiểu thẻ số dư fintech + danh sách của thể loại, và cả sổ giấy biên lai cũ.

OWN-WORLD: Nền màu giấy dán tường chat xám lạnh, bong bóng trắng (người khác gửi) và bong bóng mực đậm (tin của chính bạn), tin ghim vàng đặc #FFD84D. Đỏ = còn nợ, xanh lá = đã trả, luôn kèm ✓ và nhãn chữ. Một mặt chữ Be Vietnam Pro, số tabular. Icon lucide một nét. Mọi tin hóa đơn theo một lưới nhãn cố định: tên khoản · tổng · danh mục · cách chia · hàng chữ tắt ✓/chưa · phần của bạn.

STORY: Thành viên mở link, thấy ngay tin ghim "Oanh · còn nợ 6 khoản · 607.333đ", chạm Trả để mở QR đúng số tiền. Cuộn luồng để xem từng khoản, mở Thành viên để xem ai còn nợ và tiến độ. Admin gõ vào ô soạn tin để ghi khoản, xem trước đúng tin sắp gửi.

FIRST VIEWPORT: Mobile 390px: header nhóm (chữ tắt TT của app + bạn, "Ting Ting", "Trực tiếp · 9 người còn nợ"), tab Trò chuyện | Thành viên. Tin ghim vàng dính dưới header, một dòng số của bạn + nút Trả. Luồng tin hóa đơn mới nhất ở đáy, khoản chi bên trái, tổng kết tháng bên phải như tin trả lời của app. Ô soạn tin dính đáy là hành động chính. Desktop: app tràn hết bề ngang; cột Thành viên 380px trái; nội dung bên phải (tin ghim, luồng, ô soạn) tối đa 1280px, căn giữa; luồng chia hai cột — khoản chi trái, tổng kết tháng dính ở cột phải.

FORM: Luồng chat nhóm, vị trí 5 trong danh sách xếp hạng; seed key 78eb1c56. Raises: một mặt chữ và thứ bậc bằng cỡ chữ (lineup); lưới nhãn cố định (hộp giày); xem trước tin trước khi gửi (phòng tối); số tiền lăn từng nấc khi đổi realtime (bảng chỉ tuyến); các pha có tên CÒN NỢ → GẦN XONG → XONG HẾT (cyclorama). Signature interaction: số tiền lăn từng chữ số; tick đã trả làm ✓ bật lên trong hàng chữ tắt.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
