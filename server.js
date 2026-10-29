const express = require('express');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Default configuration with fallback
const config = {
  brandName: process.env.BRAND_NAME || 'PTSS Community',
  badgeText: process.env.BADGE_TEXT || 'Kênh Liên Hệ & Hỗ Trợ Chính Thức',
  bioDescription: process.env.BIO_DESC || 'Chào mừng bạn! Kết nối với chúng mình qua Nhóm Zalo, Facebook và kênh TikTok bên dưới để nhận hỗ trợ nhanh nhất.',
  avatarUrl: process.env.AVATAR_URL || '/assets/avatar.png',
  verified: process.env.VERIFIED !== 'false',
  
  // Channels
  links: {
    zaloGroup: {
      title: 'Tham Gia Nhóm Zalo',
      subtitle: 'Cộng đồng thảo luận, giải đáp & nhận thông báo mới',
      url: process.env.ZALO_GROUP_URL || 'https://zalo.me/g/uqw94c3seuayvmlji6lp',
      badge: 'Cộng đồng chính',
      isPrimary: true,
      qrEnabled: true
    },
    facebook: {
      title: 'Kết Nối Facebook',
      subtitle: 'Trang cá nhân / Fanpage chính thức',
      url: process.env.FACEBOOK_URL || 'https://facebook.com',
      badge: 'Facebook',
      isPrimary: false
    },
    tiktok: {
      title: 'Theo Dõi Kênh TikTok',
      subtitle: 'Video chia sẻ & cập nhật xu hướng hàng ngày',
      url: process.env.TIKTOK_URL || 'https://tiktok.com',
      badge: 'TikTok',
      isPrimary: false
    }
  },
  
  hotline: process.env.HOTLINE || '',
  noticeText: process.env.NOTICE_TEXT || '⚡ Nhóm Zalo hỗ trợ 24/7. Nếu TikTok chặn mở app, bạn chỉ cần bấm "Sao chép link" hoặc "Quét mã QR" bên dưới!'
};

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Serve static assets
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true
}));

// API to serve live config (can be updated via Railway Environment Variables)
app.get('/api/config', (req, res) => {
  res.json({
    brandName: process.env.BRAND_NAME || config.brandName,
    badgeText: process.env.BADGE_TEXT || config.badgeText,
    bioDescription: process.env.BIO_DESC || config.bioDescription,
    avatarUrl: process.env.AVATAR_URL || config.avatarUrl,
    verified: process.env.VERIFIED ? process.env.VERIFIED === 'true' : config.verified,
    links: {
      zaloGroup: {
        ...config.links.zaloGroup,
        url: process.env.ZALO_GROUP_URL || config.links.zaloGroup.url,
        title: process.env.ZALO_TITLE || config.links.zaloGroup.title,
        subtitle: process.env.ZALO_SUBTITLE || config.links.zaloGroup.subtitle
      },
      facebook: {
        ...config.links.facebook,
        url: process.env.FACEBOOK_URL || config.links.facebook.url,
        title: process.env.FACEBOOK_TITLE || config.links.facebook.title,
        subtitle: process.env.FACEBOOK_SUBTITLE || config.links.facebook.subtitle
      },
      tiktok: {
        ...config.links.tiktok,
        url: process.env.TIKTOK_URL || config.links.tiktok.url,
        title: process.env.TIKTOK_TITLE || config.links.tiktok.title,
        subtitle: process.env.TIKTOK_SUBTITLE || config.links.tiktok.subtitle
      }
    },
    hotline: process.env.HOTLINE || config.hotline,
    noticeText: process.env.NOTICE_TEXT || config.noticeText
  });
});

// Dynamic QR generator for the Zalo group (no external API needed, ultra fast)
app.get('/api/qr', async (req, res) => {
  try {
    const targetUrl = req.query.text || process.env.ZALO_GROUP_URL || config.links.zaloGroup.url;
    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      margin: 2,
      width: 480,
      color: {
        dark: '#031738',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': imgBuffer.length,
      'Cache-Control': 'public, max-age=86400'
    });
    res.end(imgBuffer);
  } catch (err) {
    console.error('Error generating QR:', err);
    res.status(500).send('Error generating QR code');
  }
});

// Direct quick-redirect shortcuts if needed
app.get('/zalo', (req, res) => {
  const target = process.env.ZALO_GROUP_URL || config.links.zaloGroup.url;
  res.redirect(target);
});

app.get('/fb', (req, res) => {
  const target = process.env.FACEBOOK_URL || config.links.facebook.url;
  res.redirect(target);
});

app.get('/tiktok', (req, res) => {
  const target = process.env.TIKTOK_URL || config.links.tiktok.url;
  res.redirect(target);
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Fallback to index.html for SPA/root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Contact Bio Page is running on port ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
});
