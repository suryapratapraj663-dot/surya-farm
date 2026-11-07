# 📱 SURYA FARMING - ANDROID APK & INSTALLATION GUIDE
### किसान ऐप (Surya Kisan) और व्यापारी ऐप (Surya Vyapari) को Android मोबाइल में चलाने की संपूर्ण गाइड

हमने आपके दोनों ऐप्स को Android के लिए पूरी तरह तैयार कर दिया है। आप इसे 3 आसान तरीकों से अपने फोन में चला व APK बना सकते हैं:

---

## ⚡ तरीका 1: फ़ोन में तुरंत 1-टैप डायरेक्ट ऐप इंस्टॉल करें (सबसे आसान व तेज़)
आपको कोई सॉफ्टवेयर इंस्टॉल करने की ज़रूरत नहीं है। Android Chrome अपने-आप इसका **WebAPK** बना देता है:

1. अपने Android फोन को कंप्यूटर वाले उसी **Wi-Fi या Mobile Hotspot** से कनेक्ट करें।
2. फोन के Chrome ब्राउज़र में लिंक खोलें:
   - **किसान ऐप:** `http://10.152.33.126:8080/farmer.html`
   - **व्यापारी ऐप:** `http://10.152.33.126:8080/buyer.html`
3. स्क्रीन के नीचे अपने-आप **"📲 Install"** का बैनर दिखेगा।
4. **"Install"** दबाते ही ऐप सीधे आपके फोन के होम-स्क्रीन और ऍप ड्रावर (App Drawer) में इंस्टॉल हो जाएगा।
5. अब आप इसे बिना किसी ब्राउज़र URL बार के फुल-स्क्रीन एक असली Android App की तरह चला सकते हैं!

> **यदि नीचे बैनर न दिखे:** Chrome में ऊपर दाईं ओर **3 बिंदुओं (⋮)** पर क्लिक करें और **"Install app"** या **"Add to Home screen (होम स्क्रीन पर जोड़ें)"** पर क्लिक करें।

---

## 📦 तरीका 2: ऑनलाइन 1-क्लिक में डायरेक्ट `.APK` फाइल डाउनलोड करें
यदि आप किसी दोस्त या किसान भाई को WhatsApp या ब्लूटूथ से डायरेक्ट `.apk` फाइल भेजना चाहते हैं:

1. **PWABuilder (Microsoft Official):**
   - वेबसाइट खोलें: [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
   - अपना ऐप लिंक पेस्ट करें और **"Start"** दबाएं।
   - **"Build My Android App"** पर क्लिक करें।
   - 30 सेकंड में तैयार Signed APK डाउनलोड हो जाएगी!

2. **AppsGeyser (Free Web-to-APK Creator):**
   - वेबसाइट खोलें: [https://www.appsgeyser.com/](https://www.appsgeyser.com/)
   - **"Create App" > "Website"** चुनें।
   - वेबसाइट का लिंक पेस्ट करें, नाम लिखें ("Surya Kisan" या "Surya Vyapari"), और आइकन अपलोड करें।
   - **"Generate APK"** पर क्लिक करें और सीधे `.apk` फाइल फोन में डाउनलोड करें।

---

## 🛠️ तरीका 3: Android Studio में 1-क्लिक से ऑफलाइन APK बनाएं
आपके कंप्यूटर में पहले से **Android Studio** उपलब्ध है। हमने दोनों ऐप्स के पूर्ण Native Android Projects बना दिए हैं:

- **किसान ऐप प्रोजेक्ट:** `android/SuryaKisanApp/`
  - पैकेज: `com.surya.kisan`
  - फीचर्स: कैमरा एक्सेस (AI फसल स्कैनर हेतु), माइक्रोफोन, स्टोरेज, हार्डवेयर एक्सेलेरेशन, व्हाट्सएप डायरेक्ट लिंक।
- **व्यापारी ऐप प्रोजेक्ट:** `android/SuryaVyapariApp/`
  - पैकेज: `com.surya.vyapari`
  - फीचर्स: B2B थोक मंडी, डिजिटल खरीद पर्चियां, किसान से सीधा WhatsApp कॉल।

### APK बिल्ड करने के स्टेप्स:
1. कंप्यूटर पर **Android Studio** खोलें।
2. **Open** पर क्लिक करें और `c:\Users\Akash\Desktop\SURYA FARMING\android\SuryaKisanApp` (या `SuryaVyapariApp`) फोल्डर चुनें।
3. ऊपर मेन्यू बार में जाएं: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. कुछ ही सेकंड में Android Studio आपकी `.apk` फाइल बना देगा:
   `android/SuryaKisanApp/app/build/outputs/apk/debug/app-debug.apk`
5. इस `.apk` को फोन में ट्रांसफर करके इंस्टॉल करें और चलाएं!

