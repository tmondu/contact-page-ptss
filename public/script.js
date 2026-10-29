/**
 * PTSS Bio Contact Page - Client Logic & Anti-Block Utilities
 */

(function () {
  'use strict';

  // State
  let appConfig = window.APP_CONFIG || {};
  let currentZaloUrl = appConfig.links?.zaloGroup?.url || 'https://zalo.me/g/uqw94c3seuayvmlji6lp';
  let currentFbUrl = appConfig.links?.facebook?.url || 'https://facebook.com';
  let currentTiktokUrl = appConfig.links?.tiktok?.url || 'https://tiktok.com';
  let currentModalType = 'zalo';
  let toastTimeout = null;

  // DOM Elements
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
  const btnCopyFb = document.getElementById('btn-copy-fb');
  const btnQrFb = document.getElementById('btn-qr-fb');
  const btnCopyTiktok = document.getElementById('btn-copy-tiktok');
  const btnQrTiktok = document.getElementById('btn-qr-tiktok');
  const modalCopyLink = document.getElementById('modal-copy-link');
  const modalOpenLink = document.getElementById('modal-open-link');
  const btnSharePage = document.getElementById('btn-share-page');
  const btnFbMain = document.getElementById('btn-fb-main');
  const btnTiktokMain = document.getElementById('btn-tiktok-main');
  const btnOpenBrowser = document.getElementById('btn-open-browser');
  const browserGuideOverlay = document.getElementById('browser-guide-overlay');
  const btnCloseGuide = document.getElementById('btn-close-guide');

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
      document.title = `${appConfig.brandName} - Kênh Liên Hệ Chính Thức | Nhóm ZL, Facebook, TikTok`;
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
      currentFbUrl = fb.url;
      if (btnFbMain) btnFbMain.href = fb.url;

      const fbTitle = document.getElementById('fb-title');
      const fbSubtitle = document.getElementById('fb-subtitle');

      if (fbTitle && fb.title) fbTitle.textContent = fb.title;
      if (fbSubtitle && fb.subtitle) fbSubtitle.textContent = fb.subtitle;
    }

    // Links: TikTok
    if (appConfig.links?.tiktok) {
      const tt = appConfig.links.tiktok;
      currentTiktokUrl = tt.url;
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
      showToast(customMessage || 'Đã sao chép liên kết vào bộ nhớ tạm!');
    } else {
      showToast('Không thể tự động sao chép. Hãy chọn link và copy thủ công.');
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
   * 6. QR Code Modal Management (ZL, Facebook, TikTok)
   */
  function openQrModal(type = 'zalo') {
    currentModalType = type;
    if (!qrModal) return;

    const modalTitle = document.getElementById('modal-qr-title');
    const modalSubtitle = document.getElementById('modal-qr-subtitle');
    const modalStep2 = document.getElementById('modal-step-2');

    let targetUrl = currentZaloUrl;
    let titleText = 'Mã QR Nhóm ZL';
    let subText = 'Chụp màn hình mã này để quét vào nhóm';
    let step2Text = 'Mở <b>ZL</b> ➔ Bấm <b>Quét mã QR</b> ➔ Chọn ảnh vừa chụp';
    let copyBtnText = 'Sao chép link ZL';
    let openBtnText = 'Mở qua ZL';

    if (type === 'facebook') {
      targetUrl = currentFbUrl;
      titleText = 'Mã QR Facebook';
      subText = 'Quét mã để kết nối trang Facebook';
      step2Text = 'Mở <b>Facebook</b> hoặc <b>Camera điện thoại</b> để quét';
      copyBtnText = 'Sao chép link FB';
      openBtnText = 'Mở Facebook';
    } else if (type === 'tiktok') {
      targetUrl = currentTiktokUrl;
      titleText = 'Mã QR TikTok';
      subText = 'Quét mã để theo dõi kênh TikTok';
      step2Text = 'Mở <b>TikTok</b> ➔ Hồ sơ ➔ Tìm bạn bè bằng mã QR';
      copyBtnText = 'Sao chép link TikTok';
      openBtnText = 'Mở TikTok';
    }

    if (modalTitle) modalTitle.textContent = titleText;
    if (modalSubtitle) modalSubtitle.textContent = subText;
    if (modalStep2) modalStep2.innerHTML = step2Text;
    if (modalCopyLink) modalCopyLink.textContent = copyBtnText;
    if (modalOpenLink) {
      modalOpenLink.textContent = openBtnText;
      modalOpenLink.href = targetUrl;
    }

    if (qrImage) {
      if (qrLoading) qrLoading.classList.remove('hidden');

      const qrApiUrl = `/api/qr?text=${encodeURIComponent(targetUrl)}`;
      qrImage.src = qrApiUrl;

      qrImage.onload = () => {
        if (qrLoading) qrLoading.classList.add('hidden');
      };

      qrImage.onerror = () => {
        // Fallback to QR server if node qr endpoint is unreachable
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(targetUrl)}`;
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
   * 7. Safari / External Browser Guide Management
   */
  function openBrowserGuide() {
    if (!browserGuideOverlay) return;
    browserGuideOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeBrowserGuide() {
    if (!browserGuideOverlay) return;
    browserGuideOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function handleOpenBrowserClick(e) {
    if (e) e.preventDefault();
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /Android/i.test(ua);

    if (isAndroid) {
      // Direct intent to Chrome browser on Android
      const currentHostAndPath = window.location.host + window.location.pathname + window.location.search;
      window.location.href = `intent://${currentHostAndPath}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }

    // On iOS (iPhone) and other webviews, guide user to TikTok's ••• menu
    openBrowserGuide();
  }

  /**
   * 8. Setup Event Listeners
   */
  function setupEventListeners() {
    // External browser button & guide
    if (btnOpenBrowser) {
      btnOpenBrowser.addEventListener('click', handleOpenBrowserClick);
    }

    if (btnCloseGuide) {
      btnCloseGuide.addEventListener('click', closeBrowserGuide);
    }

    if (browserGuideOverlay) {
      browserGuideOverlay.addEventListener('click', (e) => {
        if (e.target === browserGuideOverlay) {
          closeBrowserGuide();
        }
      });
    }

    // QR Modal triggers (ZL, FB, TikTok)
    if (btnQrModal) {
      btnQrModal.addEventListener('click', (e) => {
        e.preventDefault();
        openQrModal('zalo');
      });
    }

    if (btnQrFb) {
      btnQrFb.addEventListener('click', (e) => {
        e.preventDefault();
        openQrModal('facebook');
      });
    }

    if (btnQrTiktok) {
      btnQrTiktok.addEventListener('click', (e) => {
        e.preventDefault();
        openQrModal('tiktok');
      });
    }

    // Copy Link buttons (ZL, FB, TikTok)
    if (btnCopyZalo) {
      btnCopyZalo.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(
          currentZaloUrl,
          'Đã sao chép link nhóm ZL! Bạn mở app dán vào tin nhắn là vào được ngay nhé.'
        );
      });
    }

    if (btnCopyFb) {
      btnCopyFb.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(currentFbUrl, 'Đã sao chép link Facebook!');
      });
    }

    if (btnCopyTiktok) {
      btnCopyTiktok.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(currentTiktokUrl, 'Đã sao chép link TikTok!');
      });
    }

    if (modalCopyLink) {
      modalCopyLink.addEventListener('click', (e) => {
        e.preventDefault();
        let targetUrl = currentZaloUrl;
        let msg = 'Đã sao chép link nhóm ZL!';
        if (currentModalType === 'facebook') {
          targetUrl = currentFbUrl;
          msg = 'Đã sao chép link Facebook!';
        } else if (currentModalType === 'tiktok') {
          targetUrl = currentTiktokUrl;
          msg = 'Đã sao chép link TikTok!';
        }
        copyToClipboard(targetUrl, msg);
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

    // Keyboard support: Escape closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (qrModal && !qrModal.classList.contains('hidden')) {
          closeQrModal();
        }
        if (browserGuideOverlay && !browserGuideOverlay.classList.contains('hidden')) {
          closeBrowserGuide();
        }
      }
    });

    // Native Web Share API
    if (btnSharePage) {
      btnSharePage.addEventListener('click', async () => {
        const shareData = {
          title: appConfig.brandName || 'PThamSS',
          text: appConfig.bioDescription || 'Kênh liên hệ chính thức',
          url: window.location.href
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            if (err.name !== 'AbortError') {
              copyToClipboard(window.location.href, 'Đã sao chép liên kết trang!');
            }
          }
        } else {
          copyToClipboard(window.location.href, 'Đã sao chép liên kết trang vào bộ nhớ tạm!');
        }
      });
    }

    // Primary CTAs Click Handling (Protected from TikTok in-app block)
    if (btnZaloMain) {
      btnZaloMain.addEventListener('click', (e) => {
        handleInAppSafeClick(e, currentZaloUrl, 'ZL');
      });
    }

    if (btnFbMain) {
      btnFbMain.addEventListener('click', (e) => {
        handleInAppSafeClick(e, currentFbUrl, 'Facebook');
      });
    }

    if (btnTiktokMain) {
      btnTiktokMain.addEventListener('click', (e) => {
        handleInAppSafeClick(e, currentTiktokUrl, 'TikTok');
      });
    }

    if (modalOpenLink) {
      modalOpenLink.addEventListener('click', (e) => {
        let targetUrl = currentZaloUrl;
        let name = 'ZL';
        if (currentModalType === 'facebook') {
          targetUrl = currentFbUrl;
          name = 'Facebook';
        } else if (currentModalType === 'tiktok') {
          targetUrl = currentTiktokUrl;
          name = 'TikTok';
        }
        handleInAppSafeClick(e, targetUrl, name);
      });
    }
  }

  /**
   * Safe click handler for links inside TikTok in-app browser:
   * - In TikTok: Prevent white security block screen, copy link, and show breakout guide
   * - Elsewhere: Standard web navigation to target URL
   */
  function handleInAppSafeClick(e, targetUrl, platformName) {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isTikTok = /TikTok|musical_ly|BytedanceWebview|ByteLocale/i.test(ua);

    if (isTikTok) {
      if (e) e.preventDefault();
      copyToClipboard(targetUrl, `Đã sao chép link ${platformName}! Hãy mở bằng Safari theo hướng dẫn.`);
      openBrowserGuide();
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadConfig();
  });
})();
