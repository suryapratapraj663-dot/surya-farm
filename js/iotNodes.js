// SURYA FARMING - IoT Node & Smart Pump Controller
class IoTNodeManager {
  constructor() {
    this.nodes = JSON.parse(localStorage.getItem('surya_nodes') || JSON.stringify(window.demoData.nodes));
    this.isConnected = true;
    this.simInterval = null;
    this.init();
  }

  init() {
    this.renderNodes();
    this.setupAddNodeForm();
    this.startSimulation();
    this.updateConnectionStatusUI();
  }

  toggleFarmConnection() {
    this.isConnected = !this.isConnected;
    this.updateConnectionStatusUI();

    if (window.notificationManager) {
      window.notificationManager.triggerAlert({
        type: this.isConnected ? 'success' : 'warning',
        title: this.isConnected ? '📡 Farm Nodes Connected' : '🔴 Nodes Disconnected',
        message: this.isConnected ? 'Sabhi 4 IoT Field Nodes online hain aur data bhej rahe hain.' : 'Khet ke sabhi nodes se sampark toot gaya hai.',
        voiceText: this.isConnected ? 'Nodes connect ho gaye.' : 'Nodes band ho gaye.'
      });
    }
  }

  updateConnectionStatusUI() {
    const statusText = document.getElementById('farm-connection-status-text');
    const toggleBtn = document.getElementById('btn-toggle-farm-connection');
    if (statusText) {
      if (this.isConnected) {
        statusText.innerHTML = '🟢 All 4 Nodes Online (Live 24/7 Monitoring)';
        statusText.style.color = '#10b981';
      } else {
        statusText.innerHTML = '🔴 All Nodes Disconnected (नोड्स अभी बंद हैं)';
        statusText.style.color = '#f87171';
      }
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = this.isConnected ? '🔌 Disconnect Nodes' : '🔌 Connect Farm Nodes';
    }
    this.renderNodes();
  }

  togglePump(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    node.pumpState = !node.pumpState;
    if (node.pumpState) {
      node.metricVal = '38% (Irrigation Active)';
      node.rawVal = 38;
    } else {
      node.metricVal = '24% (Pump Stopped)';
      node.rawVal = 24;
    }

    this.saveNodes();
    this.renderNodes();

    if (window.notificationManager) {
      window.notificationManager.triggerAlert({
        type: node.pumpState ? 'success' : 'warning',
        title: node.pumpState ? '💧 Motor Pump Shuru Ho Gaya!' : '🛑 Motor Pump Band Kiya Gaya',
        message: node.pumpState 
          ? `Khet me sinchai chaalu hai (Soil Moisture: ${node.metricVal}). Telegram command: /pump_off`
          : 'Khet ka motor pump band kar diya gaya hai.',
        voiceText: node.pumpState ? 'Motor pump shuru ho gaya.' : 'Motor pump band ho gaya.'
      });
    }
  }

  renderNodes() {
    const container = document.getElementById('nodes-grid-container');
    if (!container) return;

    container.innerHTML = this.nodes.map(node => {
      const isMoisture = node.type === 'moisture-pump';
      const isCamera = node.type === 'camera-telegram';
      const isLive = this.isConnected;

      return `
        <div class="node-card">
          <div class="node-card-header">
            <div class="node-title-group">
              <span class="node-icon">${node.icon || '📡'}</span>
              <div>
                <div class="node-name">${node.name}</div>
                <span class="node-board-pill">${node.board}</span>
              </div>
            </div>
            <span class="badge-status-ready" style="background: ${isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${isLive ? '#34d399' : '#f87171'}; border-color: ${isLive ? '#10b981' : '#ef4444'};">
              ${isLive ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          ${isCamera && node.imageUrl ? `
            <div style="width: 100%; height: 140px; border-radius: var(--radius-md); overflow: hidden; margin: 0.5rem 0; border: 1px solid rgba(255,255,255,0.08);">
              <img src="${node.imageUrl}" alt="Canopy View" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          ` : ''}

          <div class="node-metric-box">
            <div class="node-metric-label">${node.metricLabel}</div>
            <div class="node-metric-val" style="color: ${isMoisture && node.rawVal < 25 ? '#f59e0b' : '#ffffff'};">
              ${isLive ? node.metricVal : '-- (Offline)'}
            </div>
          </div>

          ${isMoisture ? `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <span style="font-size: 0.8rem; color: var(--text-secondary);">Motor Relay:</span>
              <button class="btn-pump ${node.pumpState ? 'btn-pump-on' : 'btn-pump-off'}" onclick="window.iotNodeManager.togglePump('${node.id}')">
                ${node.pumpState ? '💧 Pump: ON (Running)' : '🛑 Pump: OFF (Chalu Karein)'}
              </button>
            </div>
          ` : ''}

          <div class="node-meta-row">
            <span>🔋 Solar: ${node.battery}</span>
            <span>📶 Signal: ${node.signal}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  saveNodes() {
    localStorage.setItem('surya_nodes', JSON.stringify(this.nodes));
  }

  startSimulation() {
    this.simInterval = setInterval(() => {
      if (!this.isConnected) return;

      const moistureNode = this.nodes.find(n => n.type === 'moisture-pump');
      if (moistureNode && !moistureNode.pumpState) {
        if (moistureNode.rawVal > 15) {
          moistureNode.rawVal = Math.max(15, moistureNode.rawVal - 0.2);
          moistureNode.metricVal = `${Math.round(moistureNode.rawVal)}% (Low / Dry)`;
        }
      }

      const tempNode = this.nodes.find(n => n.type === 'temperature');
      if (tempNode) {
        const delta = (Math.random() - 0.5) * 0.4;
        tempNode.rawVal = +(tempNode.rawVal + delta).toFixed(1);
        tempNode.metricVal = `${tempNode.rawVal}°C`;
      }

      this.renderNodes();
    }, 12000);
  }

  setupAddNodeForm() {
    const form = document.getElementById('add-node-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-node-name').value.trim();
      const type = document.getElementById('new-node-type').value;
      const board = document.getElementById('new-node-board').value;
      const label = document.getElementById('new-node-metric-label').value.trim();
      const val = document.getElementById('new-node-metric-val').value.trim();

      const newNode = {
        id: 'node-' + Date.now(),
        name,
        type,
        board,
        metricLabel: label || 'Sensor Value',
        metricVal: val || 'Active',
        battery: '100% (New)',
        signal: '-50 dBm',
        status: 'online',
        icon: type.includes('cam') ? '📷' : type.includes('pump') ? '💧' : '⚡'
      };

      this.nodes.push(newNode);
      this.saveNodes();
      this.renderNodes();
      form.reset();
      document.getElementById('add-node-modal').style.display = 'none';

      if (window.notificationManager) {
        window.notificationManager.triggerAlert({
          type: 'success',
          title: '➕ Naya Node Joda Gaya!',
          message: `${name} safaltapoorvak aapke khet me joda gaya hai.`,
          voiceText: 'Naya node joda gaya.'
        });
      }
    });
  }
}

window.iotNodeManager = new IoTNodeManager();

