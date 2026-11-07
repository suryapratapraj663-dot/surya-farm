# 🛠️ SURYA FARMING - Hardware Circuit, Wiring & Pinout Guide
### Smart IoT Field Node, Sensor Connections & Solar Power Setup

यह डॉक्यूमेंटेशन खेत में **SURYA FARMING** का IoT फील्ड नोड स्थापित करने के लिए आवश्यक हार्डवेयर सर्किट, वायरिंग और फ्लैशिंग निर्देशों का विवरण प्रदान करता है।

---

## 📦 आवश्यक कॉम्पोनेंट्स (Bill of Materials - BOM)

| क्र.सं. | कॉम्पोनेंट का नाम | विवरण | कार्य |
|---|---|---|---|
| 1 | **ESP32 DevKit v1 / ESP32-CAM** | Dual-core Wi-Fi & Bluetooth MCU | मुख्य माइक्रोकंट्रोलर व कैमरा |
| 2 | **Capacitive Soil Moisture Sensor v1.2** | 3.3V एनालॉग कैपेसिटिव सेंसर | मिट्टी की नमी मापना (जंग-रोधी) |
| 3 | **DHT22 (AM2302) Sensor** | डिजिटल तापमान व आर्द्रता सेंसर | खेत का मौसम व हवा की नमी |
| 4 | **5V Relay Module (1-Channel)** | Optocoupler Isolated Relay | सबमर्सिबल / मोटर पंप चालू/बंद |
| 5 | **LDR Module / Photodiode** | लाइट डिपेंडेंट रेसिस्टर | धूप व दिन-रात की तीव्रता |
| 6 | **Solar Panel (6V 5W - 10W)** | मोनोक्रिस्टलाइन सोलर पैनल | सौर ऊर्जा से बैटरी चार्जिंग |
| 7 | **TP4056 + 18650 Battery** | Li-ion Charger with Protection | 24/7 बिना तार के निरंतर बिजली |
| 8 | **IP65 Waterproof Enclosure** | वाटरप्रूफ जंक्शन बॉक्स | बारिश और धूप से सर्किट सुरक्षा |

---

## ⚡ पिनआउट और वायरिंग कनेक्शन (Pinout Table)

### 1. Capacitive Soil Moisture Sensor v1.2 -> ESP32
* **VCC:** ESP32 `3.3V` पिन से जोड़ें।
* **GND:** ESP32 `GND` पिन से जोड़ें।
* **AOUT (Analog Out):** ESP32 पिन `GPIO 34` (ADC1 Channel 6) से जोड़ें।

> [!NOTE] 
> ESP32 पर Wi-Fi चालू रहने पर ADC2 पिन्स (GPIO 0, 2, 4, 12-15) काम नहीं करते हैं, इसलिए नमी सेंसर के लिए हमेशा **ADC1 पिन्स (GPIO 32 - 39)** का उपयोग करें।

### 2. 5V Relay Module (मोटर पंप नियंत्रण) -> ESP32
* **VCC:** ESP32 `VIN (5V)` पिन से जोड़ें।
* **GND:** ESP32 `GND` से जोड़ें।
* **IN (Signal):** ESP32 पिन `GPIO 12` से जोड़ें।
* **Relay Output (COM & NO):** मोटर पंप के 220V AC / 12V DC पावर वायर की सीरीज में जोड़ें।

### 3. DHT22 Temperature & Humidity Sensor -> ESP32
* **VCC:** `3.3V` या `5V`
* **GND:** `GND`
* **DATA:** ESP32 पिन `GPIO 13` (10k Pull-up Resistor VCC के साथ अनुशंसित)

### 4. LDR Sunlight Sensor -> ESP32
* **VCC:** `3.3V`
* **GND:** `GND`
* **AO (Analog Out):** ESP32 पिन `GPIO 35`

---

## 💻 Arduino IDE से कोड फ्लैश करने के चरण:

1. **Arduino IDE** खोलें और ESP32 बोर्ड पैकेज इंस्टॉल करें:
   - File > Preferences > Additional Board Manager URLs में जोड़ें:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
2. **Boards Manager** में जाकर `esp32 by Espressif Systems` इंस्टॉल करें।
3. आवश्यक लाइब्रेरीज़ इंस्टॉल करें:
   - `DHT sensor library by Adafruit`
   - `Adafruit Unified Sensor`
4. [**`firmware/surya_node_firmware.ino`**](file:///c:/Users/SURYA%20PRATAP%20RAJ/OneDrive/Desktop/farming/firmware/surya_node_firmware.ino) फाइल को Arduino IDE में खोलें।
5. अपना Wi-Fi नाम (`WIFI_SSID`), पासवर्ड (`WIFI_PASSWORD`), और कंप्यूटर का लोकल IP डालें।
6. **Upload** बटन दबाएं। फ्लैश होने के बाद सीरियल मॉनिटर (115200 Baud) पर लाइव डेटा दिखाई देगा।

