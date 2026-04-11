const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');
const files = ['en.json', 'hi.json', 'mr.json'];

const updates = {
  en: {
    createPost: {
      header: "Create Post",
      titleLabel: "Problem Title",
      titlePlaceholder: "E.g., Yellow spots on wheat leaves...",
      descLabel: "Describe your problem",
      descPlaceholder: "Provide details about the issue, symptoms, duration, etc.",
      authorName: "Your Name",
      location: "Your Location (City/Village)",
      categoryLabel: "Select Category",
      tagsLabel: "Tags",
      suggestedTags: "Suggested Tags",
      photoLabel: "Add Photos",
      addPhotoBtn: "Add Photo",
      aiTaggingLabel: "AI is analyzing image and suggesting tags...",
      submitBtn: "Submit Post",
      posting: "Posting...",
      alertError: "Error",
      alertTitleReq: "Please enter a title, description, and selection a category.",
      alertPostSuccess: "Post published successfully!",
      changePhoto: "Change",
      optional: "(Optional)",
      titleLimit: "Must be at least 15 characters",
      descLimit: "Must be at least 30 characters"
    }
  },
  hi: {
    createPost: {
      header: "पोस्ट बनाएं",
      titleLabel: "समस्या का शीर्षक",
      titlePlaceholder: "जैसे, गेहूं के पत्तों पर पीले धब्बे...",
      descLabel: "अपनी समस्या का वर्णन करें",
      descPlaceholder: "समस्या, लक्षण, अवधि आदि के बारे में विवरण दें।",
      authorName: "आपका नाम",
      location: "आपका स्थान (शहर/गाँव)",
      categoryLabel: "श्रेणी चुनें",
      tagsLabel: "टैग",
      suggestedTags: "सुझाए गए टैग",
      photoLabel: "तस्वीरें जोड़ें",
      addPhotoBtn: "तस्वीर जोड़ें",
      aiTaggingLabel: "AI छवि का विश्लेषण कर रहा है और टैग सुझा रहा है...",
      submitBtn: "पोस्ट सबमिट करें",
      posting: "पोस्ट हो रहा है...",
      alertError: "त्रुटि",
      alertTitleReq: "कृपया शीर्षक, विवरण दर्ज करें, और एक श्रेणी चुनें।",
      alertPostSuccess: "पोस्ट सफलतापूर्वक प्रकाशित हुआ!",
      changePhoto: "बदलें",
      optional: "(वैकल्पिक)",
      titleLimit: "कम से कम 15 अक्षर होने चाहिए",
      descLimit: "कम से कम 30 अक्षर होने चाहिए"
    }
  },
  mr: {
    createPost: {
      header: "पोस्ट तयार करा",
      titleLabel: "समस्येचे शीर्षक",
      titlePlaceholder: "उदा., गव्हाच्या पानांवर पिवळे डाग...",
      descLabel: "तुमच्या समस्येचे वर्णन करा",
      descPlaceholder: "समस्या, लक्षणे, कालावधी इत्यादींची माहिती द्या.",
      authorName: "तुमचे नाव",
      location: "तुमचे ठिकाण (शहर/गाव)",
      categoryLabel: "श्रेणी निवडा",
      tagsLabel: "टॅग्स",
      suggestedTags: "सुचवलेले टॅग्स",
      photoLabel: "फोटो जोडा",
      addPhotoBtn: "फोटो जोडा",
      aiTaggingLabel: "AI प्रतिमेचे विश्लेषण करत आहे आणि टॅग सुचवत आहे...",
      submitBtn: "पोस्ट सबमिट करा",
      posting: "पोस्ट करत आहे...",
      alertError: "त्रुटी",
      alertTitleReq: "कृपया शीर्षक, वर्णन प्रविष्ट करा आणि एक श्रेणी निवडा.",
      alertPostSuccess: "पोस्ट यशस्वीरित्या प्रकाशित केली!",
      changePhoto: "बदला",
      optional: "(पर्यायी)",
      titleLimit: "किमान 15 अक्षरे असणे आवश्यक आहे",
      descLimit: "किमान 30 अक्षरे असणे आवश्यक आहे"
    }
  }
};

files.forEach(file => {
  const lang = path.basename(file, '.json');
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
