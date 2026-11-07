// SURYA FARMING - Notification & Audio/Speech Engine
class NotificationManager {
  constructor() {
    this.notifications = JSON.parse(localStorage.getItem('surya_notifications') || '[]');
    this.audioContext = null;
    this.init();
  }

  init() {
    this.updateBadges();
    this.renderDrawer();
  }

  ensureAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioContext = new AudioCtx();
    }
  }

  playChime(type = 'info') {
    try {
      this.ensureAudioContext();
      if (!this.audioContext) return;
      const ctx = this.audioContext;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'warning') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        osc.frequency.setValueAtTime(587.33, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch(e) {
      console.warn('Audio chime notice:', e);
    }
  }

  speak(text) {
    if ('speechSynthesis' in window && text) {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'hi-IN';
        u.rate = 1.0;
        window.speechSynthesis.speak(u);
      } catch(e) {}
    }
  }

  triggerAlert({ type = 'info', title, message, voiceText }) {
    this.playChime(type);
    if (voiceText) this.speak(voiceText);

    const notif = {
      id: 'notif-' + Date.now(),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    this.notifications.unshift(notif);
    if (this.notifications.length > 30) this.notifications.pop();
    localStorage.setItem('surya_notifications', JSON.stringify(this.notifications));

    this.showToast(notif);
    this.updateBadges();
    this.renderDrawer();
  }

  showToast(notif) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div style="font-size: 1.4rem;">${notif.type === 'warning' ? '⚠️' : notif.type === 'success' ? '✅' : '📢'}</div>
      <div>
        <div style="font-weight: 800; font-size: 0.9rem; color: #ffffff;">${notif.title}</div>
        <div style="font-size: 0.8rem; color: #e2e8f0;">${notif.message}</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  updateBadges() {
    const unread = this.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notif-badge');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'inline-block' : 'none';
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    localStorage.setItem('surya_notifications', JSON.stringify(this.notifications));
    this.updateBadges();
    this.renderDrawer();
  }

  renderDrawer() {
    const drawerList = document.getElementById('drawer-notif-list');
    const feedList = document.getElementById('notif-list-items');
    
    const html = this.notifications.length === 0 
      ? '<div style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1.5rem;">Koi naya alert nahi hai.</div>'
      : this.notifications.map(n => `
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem; border-left: 3px solid ${n.type === 'warning' ? '#f59e0b' : '#10b981'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="font-size: 0.85rem; color: #ffffff;">${n.title}</strong>
              <span style="font-size: 0.7rem; color: var(--text-muted);">${n.time}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${n.message}</div>
          </div>
        `).join('');

    if (drawerList) drawerList.innerHTML = html;
    if (feedList) feedList.innerHTML = html;
  }
}

window.notificationManager = new NotificationManager();

