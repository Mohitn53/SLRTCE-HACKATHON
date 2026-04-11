const fs = require('fs');

try {
const hiPath = 'src/locales/hi.json';
let hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
hi.home = {
    ...hi.home,
    "greeting": "नमस्ते",
    "morning": "सुप्रभात",
    "afternoon": "शुभ दोपहर",
    "evening": "शुभ संध्या",
    "farmer": "किसान",
    "feature1Title": "फसल स्वास्थ्य AI",
    "feature1Desc": "सैटेलाइट और कैमरा द्वारा तत्काल बीमारी का पता लगाना।",
    "feature2Title": "मृदा बुद्धिमत्ता",
    "feature2Desc": "नमी और पोषक तत्वों की निगरानी से सिंचाई अनुकूलित करें।",
    "feature3Title": "किसान AI विशेषज्ञ",
    "feature3Desc": "चैटबॉट द्वारा अपनी क्षेत्रीय भाषा में 24/7 मार्गदर्शन प्राप्त करें।",
    "feature4Title": "कृषि समुदाय",
    "feature4Desc": "सर्वोत्तम प्रथाओं और बाज़ार कीमतों के लिए जुड़ें।",
    "profitableCrops": "मौसमी अनुशंसाएं",
    "nearbyDepartments": "आस-पास सहायता",
    "openFullAnalysis": "पूर्ण विश्लेषण खोलें",
    "locatingSupport": "सहायता खोजी जा रही है...",
    "yield": "उपज",
    "scanCrop": "फसल स्कैन करें",
    "detectDiseases": "तुरंत बीमारियों का पता लगाएं",
    "history": "इतिहास",
    "pastScans": "पिछले स्कैन",
    "settings": "सेटिंग्स",
    "preferences": "प्राथमिकताएं"
};
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2));

const mrPath = 'src/locales/mr.json';
let mr = JSON.parse(fs.readFileSync(mrPath, 'utf8'));
mr.home = {
    ...mr.home,
    "greeting": "नमस्कार",
    "morning": "शुभ सकाळ",
    "afternoon": "शुभ दुपार",
    "evening": "शुभ संध्याकाळ",
    "farmer": "शेतकरी",
    "feature1Title": "पीक आरोग्य AI",
    "feature1Desc": "उपग्रह आणि कॅमेरा वापरून तात्काळ रोग ओळखणे.",
    "feature2Title": "माती बुद्धिमत्ता",
    "feature2Desc": "सिंचन अनुकूल करण्यासाठी मातीतील ओलावा आणि पोषक तत्वांवर लक्ष ठेवा.",
    "feature3Title": "किसान AI तज्ञ",
    "feature3Desc": "आमच्या चॅटबॉटवरून तुमच्या स्थानिक भाषेत २४/७ मार्गदर्शन मिळवा.",
    "feature4Title": "कृषी समुदाय",
    "feature4Desc": "उत्तम पद्धती आणि बाजार भावासाठी इतर शेतकऱ्यांशी संपर्क साधा.",
    "profitableCrops": "हंगामी शिफारसी",
    "nearbyDepartments": "जवळच्या समर्थन संस्था",
    "openFullAnalysis": "पूर्ण विश्लेषण उघडा",
    "locatingSupport": "समर्थन शोधत आहे...",
    "yield": "उत्पन्न",
    "scanCrop": "पीक स्कॅन करा",
    "detectDiseases": "तात्काळ रोग ओळखा",
    "history": "इतिहास",
    "pastScans": "मागील स्कॅन",
    "settings": "सेटिंग्ज",
    "preferences": "प्राधान्ये"
};
fs.writeFileSync(mrPath, JSON.stringify(mr, null, 2));

const enPath = 'src/locales/en.json';
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
en.home = {
    ...en.home,
    "farmer": "Farmer",
    "feature1Title": "AI Crop Health",
    "feature1Desc": "Instant disease detection using high-precision satellite & camera neural networks.",
    "feature2Title": "Soil Intelligence",
    "feature2Desc": "Monitor soil moisture & nutrient levels to optimize your irrigation cycles.",
    "feature3Title": "Kisan AI Expert",
    "feature3Desc": "Get 24/7 agricultural guidance in your local language from our expert chatbot.",
    "feature4Title": "Agri Community",
    "feature4Desc": "Connect with regional farmers to share best practices and market prices.",
    "profitableCrops": "Seasonal Recommendations",
    "nearbyDepartments": "Nearby Support",
    "openFullAnalysis": "OPEN FULL ANALYSIS",
    "locatingSupport": "Locating support...",
    "yield": "Yield"
};
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));

let code = fs.readFileSync('src/features/home/HomeScreen.jsx', 'utf8');

// Replace APP_FEATURES with a function that accesses translation
const getAppFeaturesStr = `
const getAppFeatures = (t) => [
    {
        title: t('home.feature1Title') === 'home.feature1Title' ? "AI Crop Health" : t('home.feature1Title'),
        desc: t('home.feature1Desc') === 'home.feature1Desc' ? "Instant disease detection using high-precision satellite & camera neural networks." : t('home.feature1Desc'),
        icon: "shield-bug",
        color: colors.primary
    },
    {
        title: t('home.feature2Title') === 'home.feature2Title' ? "Soil Intelligence" : t('home.feature2Title'),
        desc: t('home.feature2Desc') === 'home.feature2Desc' ? "Monitor soil moisture & nutrient levels to optimize your irrigation cycles." : t('home.feature2Desc'),
        icon: "sprout",
        color: "#0288D1"
    },
    {
        title: t('home.feature3Title') === 'home.feature3Title' ? "Kisan AI Expert" : t('home.feature3Title'),
        desc: t('home.feature3Desc') === 'home.feature3Desc' ? "Get 24/7 agricultural guidance in your local language from our expert chatbot." : t('home.feature3Desc'),
        icon: "robot-confused",
        color: colors.secondary
    },
    {
        title: t('home.feature4Title') === 'home.feature4Title' ? "Agri Community" : t('home.feature4Title'),
        desc: t('home.feature4Desc') === 'home.feature4Desc' ? "Connect with regional farmers to share best practices and market prices." : t('home.feature4Desc'),
        icon: "account-group",
        color: "#6D4C41"
    }
];
`;

const regexFeatures = /const APP_FEATURES = \[[^]*?\}\n\];/m;
code = code.replace(regexFeatures, getAppFeaturesStr);

code = code.replace(/const nextIndex = \(prevIndex \+ 1\) % APP_FEATURES\.length;/g, "const nextIndex = (prevIndex + 1) % getAppFeatures(t).length;");
code = code.replace(/APP_FEATURES\.map/g, "getAppFeatures(t).map");

// Update 'Farmer' fallback
code = code.replace(/\|\| 'Farmer'/g, '|| (t("home.farmer") === "home.farmer" ? "Farmer" : t("home.farmer"))');

// Replace greeting strings using safe check
code = code.replace(/return t\('home\.morning'\) \|\| 'Good Morning';/g, "return t('home.morning') === 'home.morning' ? 'Good Morning' : t('home.morning');");
code = code.replace(/return t\('home\.afternoon'\) \|\| 'Good Afternoon';/g, "return t('home.afternoon') === 'home.afternoon' ? 'Good Afternoon' : t('home.afternoon');");
code = code.replace(/return t\('home\.evening'\) \|\| 'Good Evening';/g, "return t('home.evening') === 'home.evening' ? 'Good Evening' : t('home.evening');");

code = code.replace(/\{item\.yield\} Yield/g, "{item.yield} {t('home.yield') === 'home.yield' ? 'Yield' : t('home.yield')}");

code = code.replace(/>OPEN FULL ANALYSIS</g, ">{t('home.openFullAnalysis') === 'home.openFullAnalysis' ? 'OPEN FULL ANALYSIS' : t('home.openFullAnalysis')}<");
code = code.replace(/>Locating support\.\.\.</g, ">{t('home.locatingSupport') === 'home.locatingSupport' ? 'Locating support...' : t('home.locatingSupport')}<");

fs.writeFileSync('src/features/home/HomeScreen.jsx', code);
console.log('Fixed HomeScreen');
} catch (e) { console.error(e); }
