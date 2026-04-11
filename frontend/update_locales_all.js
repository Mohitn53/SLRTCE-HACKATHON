const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');
const files = ['en.json', 'hi.json', 'mr.json'];

const updates = {
  en: {
    auth: {
      registerTitle: "Create Account",
      registerSubtitle: "Join our farming community",
      fullName: "Full Name",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      location: "Location (City/Village)",
      registerButton: "Create Account",
      alreadyHaveAccount: "Already have an account? Sign In",
      loginHere: "Sign In",
      passwordsDoNotMatch: "Passwords do not match",
      fillAllFields: "Please fill all fields",
      registrationSuccess: "Registration successful"
    },
    camera: {
      permissionText: "We need your permission to show the camera",
      grantPermission: "Grant Permission",
      flipCamera: "Flip Camera",
      takePicture: "Take Picture",
      gallery: "Gallery",
      retake: "Retake",
      usePhoto: "Use Photo"
    },
    detection: {
      analyzing: "Analyzing image...",
      identifying: "Identifying crop and disease...",
      results: "Detection Results",
      disease: "Disease",
      confidence: "Confidence",
      healthy: "Healthy",
      treatment: "Treatment Recommendations",
      preventive: "Preventive Measures",
      saveScan: "Save Scan to History",
      scanSaved: "Scan saved successfully",
      scanFailed: "Failed to save scan",
      scanAgain: "Scan Another Crop",
      noDisease: "No Disease Detected",
      crop: "Crop"
    },
    history: {
      title: "Scan History",
      noScans: "No scans found",
      tapToView: "Tap to view details",
      deleteConfirm: "Are you sure you want to delete this scan?",
      delete: "Delete",
      cancel: "Cancel",
      date: "Date",
      loading: "Loading history..."
    },
    chatbot: {
      title: "Kisan Mitra",
      typeMessage: "Type your message...",
      send: "Send",
      listening: "Listening...",
      tapToSpeak: "Tap to speak",
      greeting: "Hello! I am Kisan Mitra. How can I help you today?",
      connecting: "Connecting to server..."
    },
    soil: {
      title: "Soil Moisture",
      predictBtn: "Predict Moisture Content",
      results: "Moisture Prediction",
      temperature: "Temperature",
      humidity: "Humidity",
      precipitation: "Precipitation",
      soilType: "Soil Type",
      cropType: "Crop Type",
      date: "Date"
    }
  },
  hi: {
    auth: {
      registerTitle: "खाता बनाएं",
      registerSubtitle: "हमारे कृषक समुदाय से जुड़ें",
      fullName: "पूरा नाम",
      username: "उपयोगकर्ता नाम",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      location: "स्थान (शहर/गाँव)",
      registerButton: "खाता बनाएं",
      alreadyHaveAccount: "क्या आपके पास पहले से खाता है? साइन इन करें",
      loginHere: "साइन इन करें",
      passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते",
      fillAllFields: "कृपया सभी फ़ील्ड भरें",
      registrationSuccess: "पंजीकरण सफल रहा"
    },
    camera: {
      permissionText: "हमें कैमरा दिखाने के लिए आपकी अनुमति चाहिए",
      grantPermission: "अनुमति दें",
      flipCamera: "कैमरा पलटें",
      takePicture: "तस्वीर लें",
      gallery: "गैलरी",
      retake: "फिर से लें",
      usePhoto: "तस्वीर का उपयोग करें"
    },
    detection: {
      analyzing: "छवि का विश्लेषण हो रहा है...",
      identifying: "फसल और बीमारी की पहचान हो रही है...",
      results: "पहचान परिणाम",
      disease: "बीमारी",
      confidence: "विश्वास",
      healthy: "स्वस्थ",
      treatment: "उपचार अनुशंसाएँ",
      preventive: "निवारक उपाय",
      saveScan: "इतिहास में स्कैन सहेजें",
      scanSaved: "स्कैन सफलतापूर्वक सहेजा गया",
      scanFailed: "स्कैन सहेजने में विफल",
      scanAgain: "दूसरी फसल स्कैन करें",
      noDisease: "कोई बीमारी नहीं पाई गई",
      crop: "फसल"
    },
    history: {
      title: "स्कैन इतिहास",
      noScans: "कोई स्कैन नहीं मिला",
      tapToView: "विवरण देखने के लिए टैप करें",
      deleteConfirm: "क्या आप वाकई इस स्कैन को हटाना चाहते हैं?",
      delete: "हटाएं",
      cancel: "रद्द करें",
      date: "तारीख",
      loading: "इतिहास लोड हो रहा है..."
    },
    chatbot: {
      title: "किसान मित्र",
      typeMessage: "अपना संदेश लिखें...",
      send: "भेजें",
      listening: "सुन रहा हूँ...",
      tapToSpeak: "बोलने के लिए टैप करें",
      greeting: "नमस्ते! मैं किसान मित्र हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      connecting: "सर्वर से कनेक्ट हो रहा है..."
    },
    soil: {
      title: "मिट्टी की नमी",
      predictBtn: "नमी सामग्री की भविष्यवाणी करें",
      results: "नमी भविष्यवाणी",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      precipitation: "वर्षा",
      soilType: "मिट्टी का प्रकार",
      cropType: "फसल का प्रकार",
      date: "तारीख"
    }
  },
  mr: {
    auth: {
      registerTitle: "खाते तयार करा",
      registerSubtitle: "आमच्या शेतकरी समुदायात सामील व्हा",
      fullName: "पूर्ण नाव",
      username: "वापरकर्तानाव",
      password: "पासवर्ड",
      confirmPassword: "पासवर्डची पुष्टी करा",
      location: "ठिकाण (शहर/गाव)",
      registerButton: "खाते तयार करा",
      alreadyHaveAccount: "आधीपासूनच खाते आहे? साइन इन करा",
      loginHere: "साइन इन करा",
      passwordsDoNotMatch: "पासवर्ड जुळत नाहीत",
      fillAllFields: "कृपया सर्व फील्ड भरा",
      registrationSuccess: "नोंदणी यशस्वी झाली"
    },
    camera: {
      permissionText: "आम्हाला कॅमेरा दाखवण्यासाठी तुमची परवानगी हवी आहे",
      grantPermission: "परवानगी द्या",
      flipCamera: "कॅमेरा उलटा",
      takePicture: "छायाचित्र घ्या",
      gallery: "गॅलरी",
      retake: "पुन्हा घ्या",
      usePhoto: "फोटो वापरा"
    },
    detection: {
      analyzing: "प्रतिमेचे विश्लेषण करत आहे...",
      identifying: "पीक आणि रोगाची ओळख करत आहे...",
      results: "शोध परिणाम",
      disease: "रोग",
      confidence: "विश्वास",
      healthy: "निरोगी",
      treatment: "उपचार शिफारसी",
      preventive: "प्रतिबंधात्मक उपाय",
      saveScan: "इतिहासात स्कॅन जतन करा",
      scanSaved: "स्कॅन यशस्वीरित्या जतन केले",
      scanFailed: "स्कॅन जतन करण्यात अयशस्वी",
      scanAgain: "दुसरे पीक स्कॅन करा",
      noDisease: "कोणताही रोग आढळला नाही",
      crop: "पीक"
    },
    history: {
      title: "स्कॅन इतिहास",
      noScans: "कोणतेही स्कॅन आढळले नाही",
      tapToView: "तपशील पाहण्यासाठी टॅप करा",
      deleteConfirm: "तुम्हाला खात्री आहे की तुम्हाला हे स्कॅन हटवायचे आहे?",
      delete: "हटवा",
      cancel: "रद्द करा",
      date: "तारीख",
      loading: "इतिहास लोड होत आहे..."
    },
    chatbot: {
      title: "किसान मित्र",
      typeMessage: "तुमचा संदेश लिहा...",
      send: "पाठवा",
      listening: "ऐकत आहे...",
      tapToSpeak: "बोलण्यासाठी टॅप करा",
      greeting: "नमस्कार! मी किसान मित्र आहे. आज मी तुमची कशी मदत करू शकतो?",
      connecting: "सर्व्हरशी कनेक्ट करत आहे..."
    },
    soil: {
      title: "मातीचा ओलावा",
      predictBtn: "ओलाव्याचे प्रमाण वर्तवा",
      results: "ओलावा भविष्यवाणी",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      precipitation: "पर्जन्य",
      soilType: "मातीचा प्रकार",
      cropType: "पिकाचा प्रकार",
      date: "तारीख"
    }
  }
};

files.forEach(file => {
  const lang = path.basename(file, '.json');
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      // Merge updates without losing existing categories
      Object.keys(updates[lang]).forEach(category => {
        data[category] = { ...data[category], ...updates[lang][category] };
      });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated ${file}`);
    } catch (e) {
      console.error(`Error updating ${file}:`, e);
    }
  }
});
