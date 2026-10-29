# 🚀 Trang Bio / Contact Chuyên Nghiệp - Tối Ưu Cho TikTok & Chống Chặn Link Zalo

Dự án trang liên hệ (Bio Link) độc lập được thiết kế dành riêng cho bạn để gắn vào Bio TikTok, Facebook, Instagram.

---

## 💡 Vì sao bạn dùng biolink miễn phí bị TikTok chặn?
1. **Tên miền dùng chung bị đánh cờ:** Các dịch vụ như `biolink.com.vn`, `joylink.io`, `linktree clone` bị hàng triệu người dùng spam link cờ bạc, lừa đảo... dẫn đến việc toàn bộ domain đó bị thuật toán quét bảo mật của TikTok đưa vào danh sách hạn chế.
2. **Chặn tự động mở app ngoài:** Khi người dùng bấm vào link trên TikTok, TikTok mở bằng trình duyệt nội bộ (**In-App WebView**). Nếu link cố tình tự động redirect thẳng sang `zalo.me`, WebView sẽ ngay lập tức chặn lại và hiện cảnh báo: *"Mở liên kết này trong trình duyệt của bạn - TikTok không thể trực tiếp mở trang này..."*.
3. **Giải pháp tối ưu:** Dùng **tên miền riêng của chính bạn** (VD: `link.domaincuaban.com` hoặc `domaincuaban.com`). TikTok coi đây là website hợp pháp, mở mượt mà 100% không bị cảnh báo bảo mật.

---

## ✨ Tính năng nổi bật của dự án này
- 🛡️ **Anti-Block TikTok In-App Browser:** Tự động phát hiện khi người dùng mở từ TikTok và hiển thị thanh hướng dẫn bấm `•••` -> `Mở trong trình duyệt` để vào Zalo không gián đoạn.
- 🚀 **Nút VIP Nhóm Zalo Đa Năng:**
  - 1 chạm mở link Zalo.
  - Nút **Sao chép link** có thông báo tức thì (Toast notification) để dán vào Zalo là vào được ngay.
  - Nút **Mã QR Nhóm** tạo tự động chất lượng cao, người dùng chỉ cần chụp màn hình rồi quét trong Zalo là xong.
- 📱 **Facebook & TikTok Direct CTA:** Nút liên kết đẹp mắt tới Facebook và TikTok của bạn.
- 💎 **Giao diện Glassmorphism đỉnh cao:** Thiết kế Dark Mode hiện đại, hiệu ứng neon phát sáng, tối ưu 100% cho điện thoại iPhone & Android.
- ⚡ **Siêu nhẹ & Tốc độ tải cực nhanh:** Không phụ thuộc framework nặng, tải dưới 0.2s.
- ⚙️ **Dễ dàng cấu hình:**
  - Cách 1: Chỉnh sửa trực tiếp file `public/config.js`.
  - Cách 2: Cấu hình qua mục **Variables** trên Railway mà không cần sửa code!

---

## 🛠️ Hướng dẫn chạy thử nghiệm trên máy (Local)

1. Cài đặt thư viện:
```bash
npm install
```

2. Khởi chạy server:
```bash
npm start
```
Truy cập: `http://localhost:3000`

---

## 🌐 Hướng dẫn Đưa Lên Railway & Gắn Domain Riêng

### Bước 1: Khởi tạo Git và đẩy code lên GitHub
1. Mở terminal tại thư mục này và khởi tạo git:
```bash
git init
git add .
git commit -m "feat: initial contact bio page"
```
2. Tạo 1 repository mới trên GitHub (ví dụ: `contact-page-ptss`), sau đó đẩy code lên:
```bash
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
git push -u origin main
```

### Bước 2: Triển khai trên Railway (Miễn phí & Cực nhanh)
1. Đăng nhập [Railway.app](https://railway.app) bằng tài khoản GitHub.
2. Bấm **New Project** ➔ Chọn **Deploy from GitHub repo**.
3. Chọn repo `contact-page-ptss` vừa tạo.
4. Railway sẽ tự động phát hiện `server.js` qua `railway.json` và build trang web trong vòng ~1 phút.

### Bước 3: Cấu hình Biến Môi Trường (Variables) trên Railway (Tùy chọn)
Vào tab **Variables** trong service của bạn trên Railway và thêm các biến bạn muốn:
- `ZALO_GROUP_URL`: Link nhóm Zalo của bạn (mặc định: `https://zalo.me/g/uqw94c3seuayvmlji6lp`)
- `FACEBOOK_URL`: Link Facebook cá nhân hoặc Fanpage
- `TIKTOK_URL`: Link kênh TikTok của bạn
- `BRAND_NAME`: Tên thương hiệu hiển thị (VD: `PTSS Community`)

### Bước 4: Gắn Tên Miền Riêng Của Bạn (Custom Domain)
1. Trong dashboard của service trên Railway, vào tab **Settings** ➔ kéo xuống mục **Custom Domains**.
2. Nhập tên miền hoặc subdomain của bạn (Ví dụ: `bio.domaincuaban.com` hoặc `domaincuaban.com`) rồi bấm **Add**.
3. Railway sẽ cung cấp bản ghi DNS cần cấu hình:
   - Với Subdomain (như `bio` hoặc `link`): Tạo bản ghi **CNAME** trỏ tới địa chỉ Railway cung cấp (VD: `xxxx.up.railway.app`).
   - Với Domain gốc (`@`): Tạo bản ghi **ALIAS** hoặc **ANAME** hoặc **A** theo hướng dẫn của Railway.
4. Chờ 2 - 5 phút để DNS cập nhật và Railway tự động cấp chứng chỉ bảo mật **SSL (HTTPS)** miễn phí.
5. Copy đường link mới gắn vào Bio TikTok! Bây giờ khách bấm vào sẽ load trang mượt mà, không bao giờ bị TikTok chặn cảnh báo nữa!
