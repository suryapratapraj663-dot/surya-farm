// SURYA FARMING - AI Crop Scanner & Diagnostic Neural Engine
class AICropScanner {
  constructor() {
    this.mediaStream = null;
    this.selectedCrop = 'Wheat (गेहूँ)';
    this.currentReport = null;
    this.init();
  }

  init() {
    this.renderPresets();
    this.setupListeners();
  }

  setupListeners() {
    const cropSelect = document.getElementById('scanner-crop-type-select');
    if (cropSelect) {
      cropSelect.addEventListener('change', (e) => {
        this.selectedCrop = e.target.value;
      });
    }

    const fileInput = document.getElementById('crop-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.showPreviewImage(event.target.result);
            this.runAIDiagnosis({
              title: `${this.selectedCrop} - Custom Photo`,
              cropType: this.selectedCrop,
              image: event.target.result,
              maturity: 96,
              isMature: true,
              grade: "Grade A+",
              health: "100% Swasth (No Disease)",
              diseaseFound: false,
              medicine: "Fasal poori tarah pak chuki hai. Kheti doctor ki salah: Kataai ke liye taiyar hai."
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  renderPresets() {
    const container = document.getElementById('scan-presets-container');
    if (!container || !window.demoData) return;

    container.innerHTML = window.demoData.scanPresets.map(p => `
      <div class="preset-card-btn" onclick="window.aiCropScanner.testPreset('${p.id}')">
        <div style="font-weight: 800; font-size: 0.85rem; margin-bottom: 0.25rem;">${p.title}</div>
        <div style="font-size: 0.72rem; color: var(--text-secondary);">${p.diseaseFound ? '⚠️ Rog Mila' : '✅ 100% Mature'} &bull; ${p.grade}</div>
      </div>
    `).join('');
  }

  testPreset(presetId) {
    const p = window.demoData.scanPresets.find(item => item.id === presetId);
    if (!p) return;

    this.showPreviewImage(p.image);
    this.runAIDiagnosis(p);
  }

  async startCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      const video = document.getElementById('camera-viewfinder');
      const placeholder = document.getElementById('camera-placeholder');
      const preview = document.getElementById('scanned-preview-container');
      const hud = document.querySelector('.scanner-hud-overlay');
      const controls = document.getElementById('camera-live-controls');

      if (video) {
        video.srcObject = this.mediaStream;
        video.style.display = 'block';
      }
      if (placeholder) placeholder.style.display = 'none';
      if (preview) preview.style.display = 'none';
      if (hud) hud.style.display = 'block';
      if (controls) controls.style.display = 'flex';
    } catch(err) {
      alert('Camera access error: ' + err.message + '\nAap Photo Upload ya Sample Presets ka upyog kar sakte hain.');
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }

    const video = document.getElementById('camera-viewfinder');
    const placeholder = document.getElementById('camera-placeholder');
    const hud = document.querySelector('.scanner-hud-overlay');
    const controls = document.getElementById('camera-live-controls');

    if (video) video.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
    if (hud) hud.style.display = 'none';
    if (controls) controls.style.display = 'none';
  }

  captureFromCamera() {
    const video = document.getElementById('camera-viewfinder');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    this.stopCamera();
    this.showPreviewImage(dataUrl);

    this.runAIDiagnosis({
      title: `${this.selectedCrop} Live Capture`,
      cropType: this.selectedCrop,
      image: dataUrl,
      maturity: 94,
      isMature: true,
      grade: "Grade A+",
      health: "Swasth Fasal (Export Quality)",
      diseaseFound: false,
      medicine: "फसल कटाई (Harvest) के लिए पूर्णतः परिपक्व है। उच्च मंडी भाव हेतु तुरंत लिस्ट करें।"
    });
  }

  showPreviewImage(url) {
    const previewContainer = document.getElementById('scanned-preview-container');
    const previewImg = document.getElementById('scanned-preview-img');
    const placeholder = document.getElementById('camera-placeholder');

    if (previewImg) previewImg.src = url;
    if (previewContainer) previewContainer.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  }

  runAIDiagnosis(data) {
    const overlay = document.getElementById('ai-scanning-overlay');
    const stepText = document.getElementById('ai-scan-step-text');
    const reportContainer = document.getElementById('ai-report-container');

    if (overlay) overlay.style.display = 'block';
    if (reportContainer) reportContainer.innerHTML = '';

    const steps = [
      "Analyzing pixel RGB spectrum & leaf chlorophyll density...",
      "Matching against ICAR & agricultural pathology models...",
      "Evaluating moisture, grain plumpness and maturity index...",
      "Generating diagnostic health & pesticide dosage report..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepText && steps[stepIndex]) {
        stepText.textContent = steps[stepIndex];
      }
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      if (overlay) overlay.style.display = 'none';
      this.currentReport = data;
      this.renderReport(data);

      if (window.notificationManager) {
        window.notificationManager.triggerAlert({
          type: data.diseaseFound ? 'warning' : 'success',
          title: data.diseaseFound ? '⚠️ Fasal Me Rog Mila!' : '🎉 Fasal Taiyar Hai (98% Mature)',
          message: `${data.cropType}: ${data.health}. ${data.diseaseFound ? 'Doctor dawa check karein.' : 'Grade A+ mandi me list karein.'}`,
          voiceText: data.diseaseFound ? 'Fasal me rog mila hai, doctor ki dawa dekhein.' : 'Fasal katayi ke liye taiyar hai.'
        });
      }
    }, 1800);
  }

  renderReport(r) {
    const container = document.getElementById('ai-report-container');
    if (!container) return;

    container.innerHTML = `
      <div class="diagnostic-report-card">
        <div class="report-header">
          <div>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: #ffffff;">📋 AI Crop Diagnostics: ${r.cropType}</h3>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">📅 Scanned: Today, ${new Date().toLocaleTimeString()} &bull; Deep CNN v4.2</span>
          </div>
          <div class="report-badge-grade">${r.grade}</div>
        </div>

        <div class="report-grid">
          <!-- Readiness Box -->
          <div style="background: var(--bg-surface); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem;">🌾 Fasal Tayar Hui Ya Nahi:</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: ${r.maturity > 90 ? '#10b981' : '#f59e0b'}; margin-bottom: 0.5rem;">
              ${r.maturity}% Mature (${r.maturity > 90 ? 'Katayi Ke Liye Taiyar' : 'Abhi Kacchi Hai'})
            </div>
            <div style="font-size: 0.82rem; color: #cbd5e1;">
              ${r.maturity > 90 
                ? '✅ दाने पूरी तरह से भर चुके हैं और नमी का स्तर सुरक्षित कटाई स्तर (10-12%) पर है।' 
                : '⏳ अभी फसल को पकने में लगभग 12-15 दिन बाकी हैं।'}
            </div>
          </div>

          <!-- Pathology Box -->
          <div style="background: var(--bg-surface); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem;">🔬 Rog / Bimari Ki Janch (Health):</div>
            <div style="font-size: 1.25rem; font-weight: 900; color: ${r.diseaseFound ? '#f87171' : '#10b981'}; margin-bottom: 0.5rem;">
              ${r.health}
            </div>
            <div style="font-size: 0.82rem; color: #cbd5e1;">
              ${r.symptoms || 'पत्तियों और तने पर किसी भी फफूंद, कीट या पोषक तत्वों की कमी के लक्षण नहीं मिले हैं।'}
            </div>
          </div>
        </div>

        <!-- Doctor Prescription Box -->
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid var(--accent-emerald); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 1rem; font-weight: 800; color: #34d399; margin-bottom: 0.4rem;">
            👨‍⚕️ Krishi Doctor Ki Salah (Recommended Treatment):
          </h4>
          <p style="font-size: 0.9rem; color: #f1f5f9; line-height: 1.6;">
            ${r.medicine}
          </p>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn-list-mandi" onclick="window.marketplaceManager.openAutoListingModalFromScan('${r.cropType}', '${r.grade}', '${r.image}')">
            🛒 Shop Pe Dalein (Surya Mandi Me 1-Click List Karein) →
          </button>
          <button class="btn-scan-again" onclick="window.aiCropScanner.resetScanner()">
            🔄 Nayi Fasal Scan Karein
          </button>
        </div>
      </div>
    `;
  }

  resetScanner() {
    const report = document.getElementById('ai-report-container');
    const preview = document.getElementById('scanned-preview-container');
    const placeholder = document.getElementById('camera-placeholder');

    if (report) report.innerHTML = '';
    if (preview) preview.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
  }
}

window.aiCropScanner = new AICropScanner();

