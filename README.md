# PhimHayVietSub — Clean UI + Community Dubbing

## Điểm chính
- Giao diện mobile/iPhone gọn, Bottom Navigation cố định.
- Khu Tài khoản và Cài đặt được gom rõ ràng.
- OWNER tự động có tích xanh; OWNER có thể cấp/gỡ tích xanh cho thành viên.
- Thành viên thường được gửi video lồng tiếng.
- Mọi video gửi mới đều ở trạng thái `pending` và không công khai trước khi duyệt.
- OWNER duyệt/từ chối video trong Admin Panel.
- Video được lưu bằng IndexedDB; metadata/trạng thái dùng LocalStorage.
- Video đã duyệt xuất hiện trong tab Lồng tiếng của hồ sơ người gửi.

## Lưu ý
Đây là frontend static. Dữ liệu tài khoản và duyệt nội dung chỉ có hiệu lực trong trình duyệt/thiết bị hiện tại. Muốn dùng nhiều thiết bị/người dùng thật cần backend + database + object storage.
