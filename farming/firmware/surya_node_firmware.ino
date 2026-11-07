/*
 * ==============================================================================
 * 🌾 SURYA FARMING (सूर्य फार्मिंग) - IoT Field Node Firmware
 * Microcontroller: ESP32 / ESP32-CAM (AI-Thinker)
 * Sensors: Capacitive Moisture v1.2, DHT22, 5V Relay Pump, LDR Sunlight
 * Telemetry: HTTP POST to Surya Farming Web Dashboard & Telegram Bot Alerts
 * ==============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// --- Wi-Fi Credentials ---
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// --- Surya Server & Telegram Bot Config ---
const char* SERVER_URL    = "http://192.168.1.100:8080/api/telemetry"; // Local server IP
const char* TELEGRAM_BOT_TOKEN = "7891234567:AAFbcdefg1234567890";
const char* TELEGRAM_CHAT_ID   = "987654321";

// --- Hardware Pin Definitions ---
#define PIN_SOIL_MOISTURE  34   // ADC1 Channel 6 (Capacitive Moisture Sensor)
#define PIN_PUMP_RELAY     12   // 5V Relay Control (Active LOW)
#define PIN_DHT22          13   // DHT22 Data Pin
#define PIN_LDR            35   // Light Dependent Resistor (Sunlight)

#define DHTTYPE DHT22
DHT dht(PIN_DHT22, DHTTYPE);

// --- Calibration Values for Soil Moisture ---
const int AIR_VALUE   = 3200; // Sensor in dry air (0% moisture)
const int WATER_VALUE = 1450; // Sensor submerged in water (100% moisture)
const int DRY_THRESHOLD = 25; // Trigger irrigation when moisture < 25%
const int WET_THRESHOLD = 45; // Stop irrigation when moisture > 45%

bool pumpIsActive = false;
unsigned long lastTelemetryMillis = 0;
const unsigned long TELEMETRY_INTERVAL = 15000; // 15 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n[SURYA FARMING] Initializing Field IoT Node...");

  // Configure Pins
  pinMode(PIN_SOIL_MOISTURE, INPUT);
  pinMode(PIN_LDR, INPUT);
  pinMode(PIN_PUMP_RELAY, OUTPUT);
  digitalWrite(PIN_PUMP_RELAY, HIGH); // Relay OFF initially (Active LOW)

  // Initialize DHT22
  dht.begin();

  // Connect to Wi-Fi
  connectWiFi();
}

void loop() {
  unsigned long currentMillis = millis();

  // Periodic Telemetry Read & Action
  if (currentMillis - lastTelemetryMillis >= TELEMETRY_INTERVAL) {
    lastTelemetryMillis = currentMillis;

    // 1. Read Soil Moisture Percentage
    int rawMoisture = analogRead(PIN_SOIL_MOISTURE);
    int moisturePercent = map(rawMoisture, AIR_VALUE, WATER_VALUE, 0, 100);
    moisturePercent = constrain(moisturePercent, 0, 100);

    // 2. Read Ambient Temperature & Humidity
    float tempC = dht.readTemperature();
    float humidity = dht.readHumidity();
    if (isnan(tempC)) tempC = 28.0;
    if (isnan(humidity)) humidity = 55.0;

    // 3. Read Sunlight Intensity
    int rawLDR = analogRead(PIN_LDR);
    int sunlightPercent = map(rawLDR, 0, 4095, 0, 100);

    Serial.printf("[SENSOR] Moisture: %d%% | Temp: %.1fC | Humid: %.1f%% | Sun: %d%%\n", 
                  moisturePercent, tempC, humidity, sunlightPercent);

    // 4. Automatic Smart Irrigation Logic
    if (moisturePercent < DRY_THRESHOLD && !pumpIsActive) {
      startPump();
      sendTelegramAlert("⚠️ *SURYA ALERT: कम नमी चेतावनी!*\n\nखेत में मिट्टी की नमी " + 
                        String(moisturePercent) + "% हो गई है।\nसिंचाई पंप स्वतः चालू कर दिया गया है।");
    } else if (moisturePercent >= WET_THRESHOLD && pumpIsActive) {
      stopPump();
      sendTelegramAlert("✅ *SURYA ALERT: सिंचाई पूर्ण!*\n\nमिट्टी की नमी " + 
                        String(moisturePercent) + "% पहुंच चुकी है।\nपंप बंद कर दिया गया है।");
    }

    // 5. Transmit Telemetry JSON
    sendTelemetry(moisturePercent, tempC, humidity, pumpIsActive);
  }

  delay(50);
}

void connectWiFi() {
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected! IP Address: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[WiFi] Connection timeout. Operating in offline automated mode.");
  }
}

void startPump() {
  pumpIsActive = true;
  digitalWrite(PIN_PUMP_RELAY, LOW); // Active LOW relay ON
  Serial.println("[PUMP] Motor Pump TURNED ON (Irrigation Started)");
}

void stopPump() {
  pumpIsActive = false;
  digitalWrite(PIN_PUMP_RELAY, HIGH); // Active LOW relay OFF
  Serial.println("[PUMP] Motor Pump TURNED OFF");
}

void sendTelemetry(int moisture, float temp, float hum, bool pumpState) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"nodeId\":\"node-2\",\"moisture\":" + String(moisture) + 
                   ",\"temp\":" + String(temp, 1) + 
                   ",\"humidity\":" + String(hum, 1) + 
                   ",\"pumpState\":" + (pumpState ? "true" : "false") + "}";

  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    Serial.printf("[HTTP] Telemetry POST response code: %d\n", httpCode);
  }
  http.end();
}

void sendTelegramAlert(String messageText) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = "https://api.telegram.org/bot" + String(TELEGRAM_BOT_TOKEN) + 
               "/sendMessage?chat_id=" + String(TELEGRAM_CHAT_ID) + 
               "&parse_mode=Markdown&text=" + messageText;

  http.begin(url);
  int httpCode = http.GET();
  if (httpCode > 0) {
    Serial.println("[TELEGRAM] Alert dispatched successfully.");
  }
  http.end();
}

