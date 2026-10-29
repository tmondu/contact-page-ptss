/**
 * Cấu hình thông tin trang Contact / Bio
 * Bạn có thể sửa trực tiếp các thông tin và đường dẫn link ở file này
 * hoặc thiết lập qua Biến môi trường (Environment Variables) trên Railway!
 */
window.APP_CONFIG = {
  brandName: "PTSS Community",
  badgeText: "Kênh Liên Hệ Chính Thức",
  bioDescription: "Chào mừng bạn! Kết nối với chúng mình qua Nhóm Zalo, Facebook và kênh TikTok bên dưới để nhận hỗ trợ nhanh nhất.",
  avatarUrl: "/assets/avatar.png",
  verified: true,
  
  links: {
    // 1. Nhóm Zalo (Kênh chính)
    zaloGroup: {
      title: "Tham Gia Nhóm Zalo",
      subtitle: "Cộng đồng thảo luận, giải đáp & nhận thông báo mới",
      url: "https://zalo.me/g/uqw94c3seuayvmlji6lp",
      badge: "Cộng đồng chính"
    },
    
    // 2. Kênh Facebook
    facebook: {
      title: "Kết Nối Facebook",
      subtitle: "Trang cá nhân / Fanpage chính thức",
      url: "https://facebook.com",
      badge: "Facebook"
    },
    
    // 3. Kênh TikTok
    tiktok: {
      title: "Theo Dõi Kênh TikTok",
      subtitle: "Video chia sẻ & cập nhật xu hướng hàng ngày",
      url: "https://tiktok.com",
      badge: "TikTok"
    }
  },

  noticeText: "Trang liên hệ được thiết kế riêng giúp bạn truy cập trực tiếp từ TikTok mà không bị chặn link. Nếu gặp sự cố, bạn chỉ cần bấm nút \"Sao chép link\" và dán vào Zalo là vào được ngay!"
};
