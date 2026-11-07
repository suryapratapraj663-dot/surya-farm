// SURYA FARMING - Demo Data & Model State
window.demoData = {
  farm: {
    id: "farm-1",
    name: "Mera Khet (गेहूँ)",
    location: "Sehore, Madhya Pradesh",
    area: "8.5 Acres",
    crop: "Sharbati Wheat (शरबती गेहूँ)"
  },
  nodes: [
    {
      id: "node-1",
      name: "Node 1: ESP32-CAM (10-Min Live Scan)",
      type: "camera-telegram",
      board: "ESP32-CAM (AI-Thinker)",
      metricLabel: "Canopy Camera Status",
      metricVal: "10-Min Auto Scan Active",
      battery: "94% (Solar)",
      signal: "-58 dBm (Strong)",
      status: "online",
      icon: "📷",
      lastCapture: "5 mins ago",
      imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80"
    },
    {
      id: "node-2",
      name: "Node 2: Root-zone Moisture & Pump",
      type: "moisture-pump",
      board: "ESP32 WROOM / DevKit v1",
      metricLabel: "Mitti Ki Nami (Soil Moisture)",
      metricVal: "22% (Low / Dry)",
      rawVal: 22,
      pumpState: false,
      battery: "88% (Solar)",
      signal: "-62 dBm",
      status: "online",
      icon: "💧"
    },
    {
      id: "node-3",
      name: "Node 3: Field Ambient Temperature",
      type: "temperature",
      board: "ESP32 WROOM / DevKit v1",
      metricLabel: "Khet Ka Tapman (Temperature)",
      metricVal: "28.4°C",
      rawVal: 28.4,
      battery: "91%",
      signal: "-65 dBm",
      status: "online",
      icon: "🌡️"
    },
    {
      id: "node-4",
      name: "Node 4: Air Quality (AQI) & Humidity",
      type: "air-temp",
      board: "ESP32 WROOM / DevKit v1",
      metricLabel: "Air Quality AQI / Humidity",
      metricVal: "AQI 46 (Good) / 58%",
      battery: "96%",
      signal: "-54 dBm",
      status: "online",
      icon: "💨"
    }
  ],
  scanPresets: [
    {
      id: "preset-wheat-mature",
      title: "🌾 Gehu - Paki Fasal (Mature)",
      cropType: "Wheat (गेहूँ)",
      maturity: 98,
      isMature: true,
      grade: "Grade A+",
      health: "100% Swasth (No Disease)",
      diseaseFound: false,
      medicine: "Koi dawa ki zaroorat nahi hai. Fasal kataai ke liye poori tarah tayar hai!",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80"
    },
    {
      id: "preset-wheat-rust",
      title: "🌾 Gehu - Peeli Ratuwa (Rust)",
      cropType: "Wheat (गेहूँ)",
      maturity: 65,
      isMature: false,
      grade: "Grade B",
      health: "Yellow Rust (पीला रतुआ / फफूंद)",
      diseaseFound: true,
      symptoms: "पत्तियों पर पीले रंग की धारियां व फफूंद के लक्षण।",
      medicine: "Propiconazole 25% EC @ 1ml प्रति लीटर पानी में मिलाकर 10 दिन के अंतराल पर छिड़कें।",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80"
    },
    {
      id: "preset-tomato-ripe",
      title: "🍅 Tamatar - Lal Gol (Grade A+)",
      cropType: "Tomato (टमाटर)",
      maturity: 95,
      isMature: true,
      grade: "Grade A+",
      health: "100% Swasth (Export Quality)",
      diseaseFound: false,
      medicine: "उत्कृष्ट गुणवत्ता! थोक मंडी में ऊंचे दामों पर बेचने हेतु तुरंत लिस्ट करें।",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80"
    },
    {
      id: "preset-tomato-blight",
      title: "🍅 Tamatar - Early Blight (झुलसा)",
      cropType: "Tomato (टमाटर)",
      maturity: 50,
      isMature: false,
      grade: "Grade C",
      health: "Early Blight (अगेती झुलसा रोग)",
      diseaseFound: true,
      symptoms: "पत्तियों पर गोल काले-भूरे छल्ले जैसे धब्बे और पत्तियों का सूखना।",
      medicine: "Mancozeb 75% WP @ 2.5 ग्राम या Copper Oxychloride 50% WP का छिड़काव करें।",
      image: "https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&q=80"
    }
  ],
  mandiListings: [
    {
      id: "mandi-crop-1",
      title: "🌾 Sharbati Gehu (Grade A+ Export)",
      cropCategory: "wheat",
      grade: "Grade A+",
      price: 2850,
      quantity: 120,
      farmerName: "Surya Pratap Raj",
      farmerPhone: "+91 94150 12345",
      mandiLocation: "Sehore / Bhopal APMC",
      moisture: "10.2%",
      harvestDate: "Nov 2026",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80",
      description: "AI सत्यापित 100% परिपक्व शरबती गेहूं। कोई रोग या कीट नहीं। फील्ड नोड द्वारा प्रमाणित।"
    },
    {
      id: "mandi-crop-2",
      title: "🍅 Desi Hybrid Tamatar (Lal Gol)",
      cropCategory: "tomato",
      grade: "Grade A+",
      price: 1850,
      quantity: 65,
      farmerName: "Rameshwar Patel",
      farmerPhone: "+91 98260 54321",
      mandiLocation: "Indore Fruit & Veg Mandi",
      moisture: "85%",
      harvestDate: "Daily Fresh",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80",
      description: "पेड़ पर पूरी तरह पके रसीले लाल टमाटर। सख्त त्वचा, लंबी शेल्फ-लाइफ के लिए उपयुक्त।"
    },
    {
      id: "mandi-crop-3",
      title: "🌼 Peeli Sarson (High Oil 42%)",
      cropCategory: "mustard",
      grade: "Grade A",
      price: 5400,
      quantity: 80,
      farmerName: "Kishore Dhakad",
      farmerPhone: "+91 97550 99887",
      mandiLocation: "Ujjain Grain Mandi",
      moisture: "7.8%",
      harvestDate: "Nov 2026",
      image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&q=80",
      description: "42% उच्च तेल सामग्री वाली पीली सरसों। ड्रायर से छनी हुई बिना धूल मिट्टी।"
    },
    {
      id: "mandi-crop-4",
      title: "🍚 1121 Basmati Dhaan (Paddy)",
      cropCategory: "rice",
      grade: "Grade A+",
      price: 3950,
      quantity: 200,
      farmerName: "Surya Pratap Raj",
      farmerPhone: "+91 94150 12345",
      mandiLocation: "Sehore Mandi Yard",
      moisture: "12.0%",
      harvestDate: "Nov 2026",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
      description: "लंबा दाना सुगंधित 1121 बासमती धान। फील्ड नोड रिकॉर्ड अनुसार शून्य रासायनिक अवशेष।"
    }
  ]
};

