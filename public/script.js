/**
 * PTSS Bio Contact Page - Client Logic & Anti-Block Utilities
 */

(function () {
  'use strict';

  // State
  let appConfig = window.APP_CONFIG || {};
  let currentZaloUrl = appConfig.links?.zaloGroup?.url || 'https://zalo.me/g/uqw94c3seuayvmlji6lp';
  let toastTimeout = null;

  // DOM Elements
  const tiktokBanner = document.getElementById('tiktok-banner');
  const closeBannerBtn = document.getElementById('close-banner');
  const qrModal = document.getElementById('qr-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const qrImage = document.getElementById('qr-image');
  const qrLoading = document.getElementById('qr-loading');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // Interactive buttons
  const btnZaloMain = document.getElementById('btn-zalo-main');
  const btnCopyZalo = document.getElementById('btn-copy-zalo');
  const btnQrModal = document.getElementById('btn-qr-modal');
  const modalCopyLink = document.getElementById('modal-copy-link');
  const modalOpenLink = document.getElementById('modal-open-link');
  const btnSharePage = document.getElementById('btn-share-page');
  const btnFbMain = document.getElementById('btn-fb-main');
  const btnTiktokMain = document.getElementById('btn-tiktok-main');

  /**
   * 1. Detect In-App Browsers (TikTok, Facebook, Instagram Webview)
   */
  function checkInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isTikTok = /TikTok|musical_ly|BytedanceWebview|ByteLocale/i.test(ua);
    const isDismissed = sessionStorage.getItem('ptss_tiktok_banner_dismissed') === 'true';

    if (isTikTok && !isDismissed && tiktokBanner) {
      tiktokBanner.classList.remove('hidden');
    }

    if (closeBannerBtn) {
      closeBannerBtn.addEventListener('click', () => {
        tiktokBanner.classList.add('hidden');
        sessionStorage.setItem('ptss_tiktok_banner_dismissed', 'true');
      });
    }
  }

  /**
   * 2. Fetch live configuration from server (Railway Environment Variables)
   */
  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const liveConfig = await res.json();
        appConfig = Object.assign({}, appConfig, liveConfig);
      }
    } catch (e) {
      console.log('Using local config fallback:', e.message);
    }

    applyConfigToDOM();
  }

  /**
   * 3. Update DOM with current configuration
   */
  function applyConfigToDOM() {
    if (!appConfig) return;

    // Brand info
    if (appConfig.brandName) {
      const nameEl = document.getElementById('profile-name');
      if (nameEl) nameEl.textContent = appConfig.brandName;
      document.title = `${appConfig.brandName} - Kênh Liên Hệ Chính Thức | Nhóm Zalo, Facebook, TikTok`;
    }

    if (appConfig.badgeText) {
      const badgeTextEl = document.getElementById('badge-text');
      if (badgeTextEl) badgeTextEl.textContent = appConfig.badgeText;
    }

    if (appConfig.bioDescription) {
      const bioEl = document.getElementById('profile-bio');
      if (bioEl) bioEl.textContent = appConfig.bioDescription;
    }

    if (appConfig.avatarUrl) {
      const avatarEl = document.getElementById('profile-avatar');
      if (avatarEl) avatarEl.src = appConfig.avatarUrl;
    }

    if (appConfig.noticeText) {
      const noticeEl = document.getElementById('notice-text');
      if (noticeEl) noticeEl.innerHTML = appConfig.noticeText;
    }

    // Links: Zalo Group
    if (appConfig.links?.zaloGroup) {
      const zg = appConfig.links.zaloGroup;
      currentZaloUrl = zg.url;

      if (btnZaloMain) btnZaloMain.href = zg.url;
      if (modalOpenLink) modalOpenLink.href = zg.url;

      const zaloTitle = document.getElementById('zalo-title');
      const zaloSubtitle = document.getElementById('zalo-subtitle');
      const zaloBadge = document.getElementById('zalo-badge');

      if (zaloTitle && zg.title) zaloTitle.textContent = zg.title;
      if (zaloSubtitle && zg.subtitle) zaloSubtitle.textContent = zg.subtitle;
      if (zaloBadge && zg.badge) zaloBadge.textContent = zg.badge;
    }

    // Links: Facebook
    if (appConfig.links?.facebook) {
      const fb = appConfig.links.facebook;
      if (btnFbMain) btnFbMain.href = fb.url;

      const fbTitle = document.getElementById('fb-title');
      const fbSubtitle = document.getElementById('fb-subtitle');

      if (fbTitle && fb.title) fbTitle.textContent = fb.title;
      if (fbSubtitle && fb.subtitle) fbSubtitle.textContent = fb.subtitle;
    }

    // Links: TikTok
    if (appConfig.links?.tiktok) {
      const tt = appConfig.links.tiktok;
      if (btnTiktokMain) btnTiktokMain.href = tt.url;

      const ttTitle = document.getElementById('tiktok-title');
      const ttSubtitle = document.getElementById('tiktok-subtitle');

      if (ttTitle && tt.title) ttTitle.textContent = tt.title;
      if (ttSubtitle && tt.subtitle) ttSubtitle.textContent = tt.subtitle;
    }
  }

  /**
   * 4. Clipboard Copy with Toast Feedback
   */
  async function copyToClipboard(text, customMessage) {
    let success = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.warn('Clipboard API failed, falling back:', err);
      }
    }

    if (!success) {
      // Fallback using textarea execCommand
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      textArea.remove();
    }

    if (success) {
      showToast(customMessage || '✅ Đã sao chép liên kết vào bộ nhớ tạm!');
    } else {
      showToast('⚠️ Không thể tự động sao chép. Hãy chọn link và copy thủ công.');
    }
  }

  /**
   * 5. Toast Notification System
   */
  function showToast(message) {
    if (!toast) return;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toast.classList.remove('hidden');

    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  /**
   * 6. QR Code Modal Management
   */
  function openQrModal() {
    if (!qrModal) return;

    if (qrImage) {
      if (qrLoading) qrLoading.classList.remove('hidden');
      
      const qrApiUrl = `/api/qr?text=${encodeURIComponent(currentZaloUrl)}`;
      qrImage.src = qrApiUrl;

      qrImage.onload = () => {
        if (qrLoading) qrLoading.classList.add('hidden');
      };

      qrImage.onerror = () => {
        // Fallback to QR server if node qr endpoint is unreachable
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(currentZaloUrl)}`;
        if (qrLoading) qrLoading.classList.add('hidden');
      };
    }

    qrModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeQrModal() {
    if (!qrModal) return;
    qrModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * 7. Setup Event Listeners
   */
  function setupEventListeners() {
    // Copy Zalo Link buttons
    if (btnCopyZalo) {
      btnCopyZalo.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(
          currentZaloUrl,
          '✅ Đã sao chép link nhóm Zalo! Bạn mở app Zalo dán vào tin nhắn là vào được ngay nhé.'
        );
      });
    }

    if (modalCopyLink) {
      modalCopyLink.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(
          currentZaloUrl,
          '✅ Đã sao chép link nhóm Zalo!'
        );
      });
    }

    // QR Modal triggers
    if (btnQrModal) {
      btnQrModal.addEventListener('click', (e) => {
        e.preventDefault();
        openQrModal();
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeQrModal);
    }

    if (qrModal) {
      qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
          closeQrModal();
        }
      });
    }

    // Keyboard support: Escape closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && qrModal && !qrModal.classList.contains('hidden')) {
        closeQrModal();
      }
    });

    // Native Web Share API
    if (btnSharePage) {
      btnSharePage.addEventListener('click', async () => {
        const shareData = {
          title: appConfig.brandName || 'PTSS Community',
          text: appConfig.bioDescription || 'Kênh liên hệ chính thức',
          url: window.location.href
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            if (err.name !== 'AbortError') {
              copyToClipboard(window.location.href, '✅ Đã sao chép liên kết trang!');
            }
          }
        } else {
          copyToClipboard(window.location.href, '✅ Đã sao chép liên kết trang vào bộ nhớ tạm!');
        }
      });
    }

    // Smart Click Assist on primary Zalo CTA
    if (btnZaloMain) {
      btnZaloMain.addEventListener('click', () => {
        // If in TikTok, remind user gently if redirect fails
        setTimeout(() => {
          showToast('💡 Nếu không tự mở Zalo, hãy bấm "Sao chép link" hoặc "Mã QR" nhé!');
        }, 1200);
      });
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    checkInAppBrowser();
    setupEventListeners();
    loadConfig();
  });
})();
