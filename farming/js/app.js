// SURYA FARMING - Farmer App Main Controller
class FarmerApp {
  constructor() {
    this.currentTab = 'nodes';
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupNotificationDrawer();
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.app-section').forEach(sec => {
      sec.classList.toggle('active-section', sec.id === `section-${tabId}`);
    });

    if (tabId === 'orders' && window.marketplaceManager) {
      window.marketplaceManager.updateFarmerOrdersUI();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setupNotificationDrawer() {
    const bellBtn = document.getElementById('btn-bell-toggle');
    const drawer = document.getElementById('notif-drawer');
    const closeBtn = document.getElementById('btn-close-notif-drawer');

    if (bellBtn && drawer) {
      bellBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new FarmerApp();
});

