// SURYA FARMING - IoT AI Hardware Architect & Circuit Wiring Engine
class IoTAiArchitect {
  constructor() {
    this.selectedSensor = 'moisture';
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById('ai-architect-container');
    if (!container) return;

    container.innerHTML = `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem;">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <button class="btn-secondary-upload ${this.selectedSensor === 'moisture' ? 'active-sensor-btn' : ''}" onclick="window.iotAiArchitect.selectSensor('moisture')">
            💧 Soil Moisture + Relay Pump
          </button>
          <button class="btn-secondary-upload ${this.selectedSensor === 'camera' ? 'active-sensor-btn' : ''}" onclick="window.iotAiArchitect.selectSensor('camera')">
            📷 ESP32-CAM (Telegram Auto-Photo)
          </button>
          <button class="btn-secondary-upload ${this.selectedSensor === 'dht22' ? 'active-sensor-btn' : ''}" onclick="window.iotAiArchitect.selectSensor('dht22')">
            🌡️ DHT22 (Temp & Humidity)
          </button>
          <button class="btn-secondary-upload ${this.selectedSensor === 'npk' ? 'active-sensor-btn' : ''}" onclick="window.iotAiArchitect.selectSensor('npk')">
            🧪 NPK 7-in-1 Soil Sensor
          </button>
        </div>

        <div id="architect-content-pane">
          ${this.getSensorContent(this.selectedSensor)}
        </div>
      </div>
    `;
  }

  selectSensor(key) {
    this.selectedSensor = key;
    this.render();
  }

  getSensorContent(key) {
    if (key === 'camera') {
      return `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem;">
            📷 ESP32-CAM (AI-Thinker) Pin Connections
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
              <strong>🔌 Power:</strong> 5V External Pin (Min 2A)<br>
              <strong>⚡ GND:</strong> Common Ground<br>
              <strong>📡 Wi-Fi Antenna:</strong> Internal IPEX
            </div>
            <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
              <strong>🚨 Flash LED:</strong> GPIO 4<br>
              <strong>⚡ Boot Pin (Flashing):</strong> GPIO 0 to GND<br>
              <strong>💾 MicroSD Card:</strong> SPI Bus
            </div>
          </div>
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 0.5rem;">💻 Arduino C++ Code:</div>
          <pre style="background: #020704; border: 1px solid var(--border-subtle); padding: 1rem; border-radius: var(--radius-md); color: #34d399; font-size: 0.8rem; overflow-x: auto; font-family: monospace;"><code>#include "esp_camera.h"
#include &lt;WiFi.h&gt;

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASS";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.println("Camera Ready!");
}

void loop() {
  // Capture photo every 10 minutes and upload to Surya Mandi
  delay(600000);
}</code></pre>
        </div>
      `;
    }

    return `
      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem;">
          💧 Capacitive Soil Moisture Sensor v1.2 & 5V Relay Pump
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
            <strong>🔌 Sensor VCC:</strong> 3.3V (ESP32)<br>
            <strong>⚡ Sensor GND:</strong> GND<br>
            <strong>📊 Sensor AOUT:</strong> Pin <code>GPIO 34</code> (ADC1)
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
            <strong>💧 Relay IN:</strong> Pin <code>GPIO 12</code><br>
            <strong>🔌 Relay VCC:</strong> 5V Vin<br>
            <strong>⚡ Relay GND:</strong> GND
          </div>
        </div>
        <div style="font-size: 0.85rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 0.5rem;">💻 Arduino C++ Code:</div>
        <pre style="background: #020704; border: 1px solid var(--border-subtle); padding: 1rem; border-radius: var(--radius-md); color: #34d399; font-size: 0.8rem; overflow-x: auto; font-family: monospace;"><code>#define MOISTURE_PIN 34
#define PUMP_RELAY_PIN 12

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(PUMP_RELAY_PIN, HIGH); // Relay OFF (Active LOW)
}

void loop() {
  int raw = analogRead(MOISTURE_PIN);
  int moisturePct = map(raw, 3200, 1400, 0, 100);
  moisturePct = constrain(moisturePct, 0, 100);

  Serial.printf("Soil Moisture: %d%%\n", moisturePct);

  // Auto pump trigger if moisture &lt; 25%
  if (moisturePct &lt; 25) {
    digitalWrite(PUMP_RELAY_PIN, LOW); // Pump ON
  } else if (moisturePct &gt; 45) {
    digitalWrite(PUMP_RELAY_PIN, HIGH); // Pump OFF
  }

  delay(5000);
}</code></pre>
      </div>
    `;
  }
}

window.iotAiArchitect = new IoTAiArchitect();

