// SURYA FARMING - Telegram Bot & Field Alert Automation
class TelegramBotManager {
  constructor() {
    this.token = localStorage.getItem('surya_tg_token') || '7891234567:AAFbcdefg1234567890';
    this.chatId = localStorage.getItem('surya_tg_chat_id') || '987654321';
    this.init();
  }

  init() {
    this.updateStatusDisplay();
  }

  openSetupModal() {
    const modal = document.getElementById('telegram-setup-modal');
    if (!modal) return;

    document.getElementById('tg-bot-token-input').value = this.token;
    document.getElementById('tg-chat-id-input').value = this.chatId;
    modal.style.display = 'flex';
  }

  closeSetupModal() {
    const modal = document.getElementById('telegram-setup-modal');
    if (modal) modal.style.display = 'none';
  }

  saveFromForm(e) {
    e.preventDefault();
    this.token = document.getElementById('tg-bot-token-input').value.trim();
    this.chatId = document.getElementById('tg-chat-id-input').value.trim();

    localStorage.setItem('surya_tg_token', this.token);
    localStorage.setItem('surya_tg_chat_id', this.chatId);

    this.closeSetupModal();
    this.updateStatusDisplay();

    if (window.notificationManager) {
      window.notificationManager.triggerAlert({
        type: 'success',
        title: '✈️ Telegram Bot Settings Saved!',
        message: 'Aapke Telegram Chat ID par alerts bheje jayenge.',
        voiceText: 'Telegram bot settings save ho gayi.'
      });
    }
  }

  updateStatusDisplay() {
    const indicator = document.getElementById('tg-status-indicator');
    if (indicator) {
      indicator.innerHTML = this.token ? '🟢 Telegram Bot: Connected' : '⚪ Telegram Bot: Not Configured';
      indicator.style.color = this.token ? '#34d399' : '#94a3b8';
    }
  }
}

window.telegramBotManager = new TelegramBotManager();

