// SURYA FARMING - B2B Mandi Marketplace & Order Execution Engine
class MarketplaceManager {
  constructor() {
    this.listings = JSON.parse(localStorage.getItem('surya_mandi_listings') || JSON.stringify(window.demoData.mandiListings));
    this.orders = JSON.parse(localStorage.getItem('surya_mandi_orders') || '[]');
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.gradeFilter = 'all';
    this.activeListingForOrder = null;
    this.init();
  }

  init() {
    this.renderListings();
    this.setupFiltersAndSearch();
    this.setupListingForm();
    this.setupOrderForm();
    this.updateFarmerOrdersUI();
  }

  getBuyerProfile() {
    const saved = localStorage.getItem('surya_buyer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      name: "Rajesh Agarwal",
      firm: "Agarwal Agro Trading Co.",
      phone: "+91 98111 22334",
      mandi: "APMC Grain Market (Indore / Sehore)",
      license: "APMC-IND-2024-8841",
      paymentMode: "Direct Bank Transfer (NEFT/RTGS) & Mandi Escrow"
    };
  }

  saveBuyerProfile(profile) {
    localStorage.setItem('surya_buyer_profile', JSON.stringify(profile));
  }

  setupFiltersAndSearch() {
    document.querySelectorAll('.mandi-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mandi-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.dataset.filter || 'all';
        this.renderListings();
      });
    });

    const searchInput = document.getElementById('mandi-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderListings();
      });
    }

    const gradeSelect = document.getElementById('mandi-grade-select');
    if (gradeSelect) {
      gradeSelect.addEventListener('change', (e) => {
        this.gradeFilter = e.target.value;
        this.renderListings();
      });
    }
  }

  renderListings() {
    const container = document.getElementById('mandi-listings-grid');
    if (!container) return;

    let filtered = this.listings;

    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(l => l.cropCategory === this.currentFilter);
    }

    if (this.gradeFilter !== 'all') {
      filtered = filtered.filter(l => l.grade === this.gradeFilter);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(this.searchQuery) ||
        l.mandiLocation.toLowerCase().includes(this.searchQuery) ||
        l.farmerName.toLowerCase().includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🌾</div>
          <h3>Is category me abhi koi fasal uplabdh nahi hai</h3>
          <p>Kripya dusri category ya sabhi fasal filter chunein.</p>
        </div>
      `;
      return;
    }

    const isTrader = document.body.classList.contains('role-trader');

    container.innerHTML = filtered.map(item => `
      <div class="mandi-card">
        <div class="mandi-card-img-wrap">
          <img src="${item.image}" alt="${item.title}" class="mandi-card-img">
          <div class="mandi-badge-grade">${item.grade}</div>
        </div>

        <div class="mandi-card-body">
          <div class="mandi-card-title">${item.title}</div>
          <div class="mandi-price-tag">₹${item.price.toLocaleString('en-IN')}<span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;"> / क्विंटल (Qtl)</span></div>

          <div class="mandi-card-specs">
            <div>📍 <strong>Mandi:</strong> ${item.mandiLocation}</div>
            <div>👨‍🌾 <strong>Kisan:</strong> ${item.farmerName} (📞 ${item.farmerPhone})</div>
            <div>📦 <strong>Stock:</strong> ${item.quantity} Quintals available</div>
            <div>💧 <strong>Moisture:</strong> ${item.moisture} &bull; 📅 <strong>Harvest:</strong> ${item.harvestDate}</div>
          </div>

          <div class="mandi-card-actions">
            ${isTrader ? `
              <button class="btn-primary-scan" style="flex: 1; background: var(--accent-gold); color: #000;" onclick="window.marketplaceManager.openOrderModal('${item.id}')">
                📝 Kharidein (Book Lot)
              </button>
              <button class="btn-cert-inspect" onclick="window.marketplaceManager.showCertificate('${item.id}')" title="AI Quality Certificate">
                🛡️ AI Certificate
              </button>
            ` : `
              <button class="btn-secondary-upload" style="flex: 1; font-size: 0.8rem;" onclick="window.marketplaceManager.showCertificate('${item.id}')">
                🛡️ AI Quality Certificate
              </button>
            `}
          </div>
        </div>
      </div>
    `).join('');
  }

  openAutoListingModalFromScan(cropType, grade, image) {
    const modal = document.getElementById('auto-listing-modal');
    if (!modal) return;

    document.getElementById('modal-crop-title').value = `${cropType} (${grade} Certified)`;
    document.getElementById('modal-crop-grade').value = grade;
    document.getElementById('modal-crop-category').value = cropType.toLowerCase().includes('gehu') || cropType.toLowerCase().includes('wheat') ? 'wheat' : cropType.toLowerCase().includes('tamatar') ? 'tomato' : 'mustard';
    document.getElementById('modal-crop-price').value = grade === 'Grade A+' ? 2950 : 2550;
    document.getElementById('modal-crop-qty').value = 85;
    document.getElementById('modal-crop-desc').value = `AI Vision द्वारा प्रमाणित 100% परिपक्व व स्वस्थ ${cropType}। नमी स्तर 10-12%। उच्च गुणवत्ता।`;

    modal.style.display = 'flex';
  }

  closeAutoListingModal() {
    const modal = document.getElementById('auto-listing-modal');
    if (modal) modal.style.display = 'none';
  }

  setupListingForm() {
    const form = document.getElementById('auto-listing-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('modal-crop-title').value.trim();
      const category = document.getElementById('modal-crop-category').value;
      const grade = document.getElementById('modal-crop-grade').value;
      const price = parseFloat(document.getElementById('modal-crop-price').value);
      const qty = parseFloat(document.getElementById('modal-crop-qty').value);
      const desc = document.getElementById('modal-crop-desc').value.trim();

      const newListing = {
        id: 'mandi-crop-' + Date.now(),
        title,
        cropCategory: category,
        grade,
        price,
        quantity: qty,
        farmerName: "Surya Pratap Raj",
        farmerPhone: "+91 94150 12345",
        mandiLocation: "Sehore / Bhopal APMC",
        moisture: "10.4%",
        harvestDate: "Today Fresh",
        image: category === 'wheat' 
          ? "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80" 
          : category === 'tomato' 
          ? "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80"
          : "https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&q=80",
        description: desc
      };

      this.listings.unshift(newListing);
      localStorage.setItem('surya_mandi_listings', JSON.stringify(this.listings));
      this.closeAutoListingModal();
      this.renderListings();

      if (window.app && window.app.switchTab) {
        window.app.switchTab('mandi');
      }

      if (window.notificationManager) {
        window.notificationManager.triggerAlert({
          type: 'success',
          title: '🛒 Fasal Mandi Me Live Ho Gayi!',
          message: `${title} थोक मंडी में ₹${price}/क्विंटल पर लिस्ट हो गई है। थोक व्यापारी अब ऑर्डर बुक कर सकते हैं।`,
          voiceText: 'Aapki fasal mandi me live ho gayi hai.'
        });
      }
    });
  }

  openOrderModal(listingId) {
    const item = this.listings.find(l => l.id === listingId);
    if (!item) return;

    this.activeListingForOrder = item;
    const modal = document.getElementById('order-booking-modal');
    if (!modal) return;

    document.getElementById('order-modal-crop-name').textContent = item.title;
    document.getElementById('order-modal-mandi-tag').textContent = `📍 ${item.mandiLocation} &bull; ${item.grade}`;
    document.getElementById('order-modal-farmer-name').textContent = item.farmerName;
    document.getElementById('order-modal-farmer-phone').textContent = `📞 ${item.farmerPhone}`;
    document.getElementById('order-rate-display').textContent = `₹${item.price.toLocaleString('en-IN')}`;

    const qtyInput = document.getElementById('order-qty-input');
    qtyInput.value = Math.min(item.quantity, 25);
    qtyInput.max = item.quantity;

    this.updateOrderModalCalculations();

    modal.style.display = 'flex';
  }

  closeOrderModal() {
    const modal = document.getElementById('order-booking-modal');
    if (modal) modal.style.display = 'none';
  }

  updateOrderModalCalculations() {
    if (!this.activeListingForOrder) return;
    const qty = parseFloat(document.getElementById('order-qty-input').value) || 0;
    const rate = this.activeListingForOrder.price;
    const total = qty * rate;

    const totalEl = document.getElementById('order-total-amount');
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  setupOrderForm() {
    const qtyInput = document.getElementById('order-qty-input');
    if (qtyInput) {
      qtyInput.addEventListener('input', () => this.updateOrderModalCalculations());
    }
  }

  submitWholesaleOrder(e) {
    e.preventDefault();
    if (!this.activeListingForOrder) return;

    const item = this.activeListingForOrder;
    const qty = parseFloat(document.getElementById('order-qty-input').value) || 1;
    const payment = document.getElementById('order-payment-method').value;
    const address = document.getElementById('order-delivery-address').value.trim();
    const profile = this.getBuyerProfile();

    const order = {
      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      cropTitle: item.title,
      grade: item.grade,
      pricePerQuintal: item.price,
      quantity: qty,
      totalAmount: qty * item.price,
      paymentMethod: payment,
      buyerFirm: profile.firm,
      buyerName: profile.name,
      buyerPhone: profile.phone,
      buyerAddress: address || profile.address,
      farmerName: item.farmerName,
      farmerPhone: item.farmerPhone,
      mandiLocation: item.mandiLocation,
      status: "Confirmed & Booked"
    };

    this.orders.unshift(order);
    localStorage.setItem('surya_mandi_orders', JSON.stringify(this.orders));

    this.closeOrderModal();
    this.updateFarmerOrdersUI();
    this.showOrderSlip(order);

    if (window.notificationManager) {
      window.notificationManager.triggerAlert({
        type: 'success',
        title: '🎉 Wholesale Order Book Ho Gaya!',
        message: `${order.quantity} Quintal ${order.cropTitle} ka order successfully book hua (Slip #${order.orderId}).`,
        voiceText: 'Order book ho gaya hai.'
      });
    }
  }

  showOrderSlip(order) {
    const modal = document.getElementById('order-slip-modal');
    const content = document.getElementById('order-slip-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="invoice-box">
        <div class="invoice-header">
          <div class="inv-logo">🌾 SURYA MANDI &bull; KHARID SLIP #${order.orderId}</div>
          <button class="btn-close-modal" onclick="document.getElementById('order-slip-modal').style.display='none'">✕</button>
        </div>

        <div style="font-size: 1.35rem; font-weight: 900; color: #ffffff; margin-bottom: 0.35rem;">
          ${order.cropTitle} (${order.grade})
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          📅 Booking Date: <strong>${order.date}</strong> &bull; Status: <span class="badge-status-ready">${order.status}</span>
        </div>

        <div class="inv-grid">
          <div style="background: var(--bg-surface-elevated); padding: 0.85rem; border-radius: var(--radius-md);">
            <strong>🏢 Vyapari / Buyer:</strong><br>
            ${order.buyerFirm}<br>
            👤 ${order.buyerName} &bull; 📞 ${order.buyerPhone}<br>
            📍 ${order.buyerAddress || 'Mandi Yard'}
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 0.85rem; border-radius: var(--radius-md);">
            <strong>👨‍🌾 Kisan / Seller:</strong><br>
            ${order.farmerName}<br>
            📞 ${order.farmerPhone}<br>
            📍 ${order.mandiLocation}
          </div>
        </div>

        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid var(--accent-gold); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.95rem; margin-bottom: 0.35rem;">
            <span>Quantity: <strong>${order.quantity} Quintals</strong> @ ₹${order.pricePerQuintal}/Qtl</span>
            <span style="font-weight: 900; font-size: 1.35rem; color: var(--accent-gold);">₹${order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">
            💳 Payment Mode: <strong>${order.paymentMethod}</strong>
          </div>
        </div>

        <div class="inv-actions">
          <a href="https://api.whatsapp.com/send?phone=${order.farmerPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Namaste ${order.farmerName} ji! Maine Surya Mandi se aapka ${order.quantity} Quintal ${order.cropTitle} ka order book kiya hai (Slip #${order.orderId}). Kripya delivery confirm karein.`)}" target="_blank" class="btn-whatsapp-invoice">
            📲 WhatsApp Kisan
          </a>
          <button class="btn-primary-scan" onclick="window.print()">
            🖨️ Print Slip
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  showCertificate(listingId) {
    const item = this.listings.find(l => l.id === listingId);
    if (!item) return;

    const modal = document.getElementById('cert-modal');
    const body = document.getElementById('cert-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="text-align: center; border-bottom: 2px dashed rgba(245, 158, 11, 0.4); padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛡️</div>
        <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--accent-gold);">SURYA AI QUALITY INSPECTION CERTIFICATE</h3>
        <p style="font-size: 0.8rem; color: var(--text-secondary);">Certified by ICAR Standard Machine Vision & IoT Field Telemetry</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.88rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">🌾 Fasal:</span>
          <strong>${item.title}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">🎖️ Certified Grade:</span>
          <span style="background: var(--accent-gold); color: #000; font-weight: 900; padding: 0.15rem 0.5rem; border-radius: 999px;">${item.grade}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">💧 Moisture Index:</span>
          <strong>${item.moisture} (Safe storage limit)</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">👨‍🌾 Farmer:</span>
          <strong>${item.farmerName} (${item.mandiLocation})</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">🔬 Disease / Pathology:</span>
          <strong style="color: #10b981;">0% Defects / Zero Chemical Toxicity</strong>
        </div>
      </div>

      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-emerald); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem; font-size: 0.8rem; color: #a7f3d0;">
        ✅ यह फसल खेत में लगे IoT नोड्स और AI विज़न कैमरा द्वारा सत्यापित की गई है। इसमें कोई मिलावट नहीं है।
      </div>

      <button class="btn-primary-scan" style="width: 100%;" onclick="document.getElementById('cert-modal').style.display='none'">
        Thik Hai (Close)
      </button>
    `;

    modal.style.display = 'flex';
  }

  deleteOrder(orderId) {
    if (!confirm('Kya aap is order slip ko record se hatana chahte hain?')) return;
    this.orders = this.orders.filter(o => o.orderId !== orderId);
    localStorage.setItem('surya_mandi_orders', JSON.stringify(this.orders));
    this.updateFarmerOrdersUI();
    if (window.buyerApp && window.buyerApp.renderBuyerOrders) {
      window.buyerApp.renderBuyerOrders();
    }
  }

  updateFarmerOrdersUI() {
    const countBadge = document.getElementById('farmer-orders-badge');
    const totalOrdersEl = document.getElementById('farmer-summary-orders');
    const totalQtyEl = document.getElementById('farmer-summary-qty');
    const totalValEl = document.getElementById('farmer-summary-val');
    const container = document.getElementById('farmer-orders-container');

    const totalQty = this.orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
    const totalVal = this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    if (countBadge) countBadge.textContent = this.orders.length;
    if (totalOrdersEl) totalOrdersEl.textContent = this.orders.length;
    if (totalQtyEl) totalQtyEl.textContent = `${totalQty} Qtl`;
    if (totalValEl) totalValEl.textContent = `₹${totalVal.toLocaleString('en-IN')}`;

    if (!container) return;

    if (this.orders.length === 0) {
      container.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 2rem; text-align: center; color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
          <h3>Abhi koi wholesale order prapt nahi hua hai</h3>
          <p>Jaise hi koi vyapari aapki fasal book karega, yahan unka phone number, delivery pata aur kharid raseed aa jayegi.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.orders.map(o => `
      <div class="invoice-box">
        <div class="invoice-header">
          <div class="inv-logo">📦 Slip #${o.orderId}</div>
          <span class="badge-status-ready">${o.status}</span>
        </div>
        <div style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">
          ${o.quantity} Quintal ${o.cropTitle}
        </div>
        <div class="inv-grid">
          <div>
            <strong>🏢 Khariddar (Buyer):</strong><br>
            ${o.buyerFirm} (${o.buyerName})<br>
            📞 <a href="tel:${o.buyerPhone}" style="color: #60a5fa;">${o.buyerPhone}</a><br>
            📍 ${o.buyerAddress || 'Mandi Yard'}
          </div>
          <div>
            <strong>💰 Mandi Raashi:</strong><br>
            <span style="font-size: 1.35rem; font-weight: 900; color: var(--accent-gold);">₹${o.totalAmount.toLocaleString('en-IN')}</span><br>
            💳 <strong>Bhugtan:</strong> ${o.paymentMethod}
          </div>
        </div>
        <div class="inv-actions">
          <a href="https://api.whatsapp.com/send?phone=${o.buyerPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Namaste ${o.buyerName} ji! Mujhe aapka ${o.quantity} Quintal ${o.cropTitle} ka order prapt hua hai (Slip #${o.orderId}). Dispatch taiyari shuru kar di gayi hai.`)}" target="_blank" class="btn-whatsapp-invoice">
            📲 WhatsApp Vyapari
          </a>
          <button class="btn-cert-inspect" onclick="window.marketplaceManager.showOrderSlip(window.marketplaceManager.orders.find(ord => ord.orderId === '${o.orderId}'))">
            📄 View Slip
          </button>
        </div>
      </div>
    `).join('');
  }
}

window.marketplaceManager = new MarketplaceManager();

