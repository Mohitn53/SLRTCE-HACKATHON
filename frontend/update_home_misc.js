const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');

// English updates
let en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));
en.home = {
    ...en.home,
    "actionDetection": "Detection",
    "actionAiHelper": "AI Helper",
    "actionSoilHub": "Soil Hub",
    "actionLogs": "Logs",
    
    "cropWheat": "Wheat",
    "cropMustard": "Mustard",
    "cropRice": "Rice (Basmati)",
    "cropMaize": "Maize",
    "cropPearlMillet": "Pearl Millet",
    
    "yieldHigh": "High",
    "yieldSteady": "Steady",
    "yieldPremium": "Premium",
    "yieldResilient": "Resilient",

    "deptKVK": "Krishi Vigyan Kendra",
    "typeResearchCenter": "Research Center",
    "deptHQ": "District Agri HQ",
    "typeGovtOffice": "Government Office",
    "deptSoil": "Soil Testing Lab",
    "typeSpecialized": "Specialized Lab",
    "deptSeed": "Seed Distribution Hub",
    "typeWarehouse": "Govt. Warehouse",
    "seasonalRecommendations": "Seasonal Recommendations",
    "nearbySupport": "Nearby Support"
};
fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(en, null, 2));

// Hindi updates
let hi = JSON.parse(fs.readFileSync(path.join(localesDir, 'hi.json'), 'utf8'));
hi.home = {
    ...hi.home,
    "actionDetection": "पहचान",
    "actionAiHelper": "AI सहायक",
    "actionSoilHub": "मृदा हब",
    "actionLogs": "लॉग्स",

    "cropWheat": "गेहूँ",
    "cropMustard": "सरसों",
    "cropRice": "चावल (बासमती)",
    "cropMaize": "मक्का",
    "cropPearlMillet": "बाजरा",

    "yieldHigh": "उच्च",
    "yieldSteady": "स्थिर",
    "yieldPremium": "प्रीमियम",
    "yieldResilient": "लचीला",

    "deptKVK": "कृषि विज्ञान केंद्र",
    "typeResearchCenter": "अनुसंधान केंद्र",
    "deptHQ": "जिला कृषि मुख्यालय",
    "typeGovtOffice": "सरकारी कार्यालय",
    "deptSoil": "मृदा परीक्षण प्रयोगशाला",
    "typeSpecialized": "विशिष्ट प्रयोगशाला",
    "deptSeed": "बीज वितरण केंद्र",
    "typeWarehouse": "सरकारी गोदाम",
    "seasonalRecommendations": "मौसमी सिफारिशें",
    "nearbySupport": "निकटवर्ती सहायता"
};
fs.writeFileSync(path.join(localesDir, 'hi.json'), JSON.stringify(hi, null, 2));

// Marathi updates
let mr = JSON.parse(fs.readFileSync(path.join(localesDir, 'mr.json'), 'utf8'));
mr.home = {
    ...mr.home,
    "actionDetection": "शोध",
    "actionAiHelper": "AI मदतनीस",
    "actionSoilHub": "माती हब",
    "actionLogs": "नोंदी (लिपी)",

    "cropWheat": "गहू",
    "cropMustard": "मोहरी",
    "cropRice": "तांदूळ (बासमती)",
    "cropMaize": "मका",
    "cropPearlMillet": "बाजरी",

    "yieldHigh": "उच्च",
    "yieldSteady": "स्थिर",
    "yieldPremium": "प्रीमियम",
    "yieldResilient": "लवचिक",

    "deptKVK": "कृषी विज्ञान केंद्र",
    "typeResearchCenter": "संशोधन केंद्र",
    "deptHQ": "जिल्हा कृषी मुख्यालय",
    "typeGovtOffice": "सरकारी कार्यालय",
    "deptSoil": "माती परीक्षण प्रयोगशाळा",
    "typeSpecialized": "विशेष प्रयोगशाळा",
    "deptSeed": "बियाणे वितरण केंद्र",
    "typeWarehouse": "सरकारी गोदाम",
    "seasonalRecommendations": "हंगामी शिफारसी",
    "nearbySupport": "जवळपासची मदत"
};
fs.writeFileSync(path.join(localesDir, 'mr.json'), JSON.stringify(mr, null, 2));

// Update HomeScreen.jsx
const screenPath = path.join(__dirname, 'src/features/home/HomeScreen.jsx');
let code = fs.readFileSync(screenPath, 'utf8');

const tHelper = `const getActionLabel = (t, label) => {
    switch(label) {
        case 'Detection': return t('home.actionDetection') === 'home.actionDetection' ? 'Detection' : t('home.actionDetection');
        case 'AI Helper': return t('home.actionAiHelper') === 'home.actionAiHelper' ? 'AI Helper' : t('home.actionAiHelper');
        case 'Soil Hub': return t('home.actionSoilHub') === 'home.actionSoilHub' ? 'Soil Hub' : t('home.actionSoilHub');
        case 'Logs': return t('home.actionLogs') === 'home.actionLogs' ? 'Logs' : t('home.actionLogs');
        default: return label;
    }
};

const getTargetDepString = (t, key, fallback) => {
    const val = t(\`home.\${key}\`);
    return val === \`home.\${key}\` ? fallback : val;
};
`;

// Replacements
code = code.replace(
    /\/\/ Quick Hub Grid/g,
    `${tHelper}\n                    // Quick Hub Grid`
);

code = code.replace(
    /<Text style={styles.actionLabel}>{item.label}<\/Text>/g,
    `<Text style={styles.actionLabel}>{getActionLabel(t, item.label)}</Text>`
);

// Dynamic departments handling
const targetDepFunc = `const getDynamicDepartments = (coords, t) => {
    if (!coords) return [];
    return [
        { id: '1', name: t('home.deptKVK') === 'home.deptKVK' ? 'Krishi Vigyan Kendra' : t('home.deptKVK'), type: t('home.typeResearchCenter') === 'home.typeResearchCenter' ? 'Research Center' : t('home.typeResearchCenter'), distance: '4.2 km', lat: coords.latitude + 0.012, lon: coords.longitude + 0.015 },
        { id: '2', name: t('home.deptHQ') === 'home.deptHQ' ? 'District Agri HQ' : t('home.deptHQ'), type: t('home.typeGovtOffice') === 'home.typeGovtOffice' ? 'Government Office' : t('home.typeGovtOffice'), distance: '8.5 km', lat: coords.latitude - 0.021, lon: coords.longitude + 0.011 },
        { id: '3', name: t('home.deptSoil') === 'home.deptSoil' ? 'Soil Testing Lab' : t('home.deptSoil'), type: t('home.typeSpecialized') === 'home.typeSpecialized' ? 'Specialized Lab' : t('home.typeSpecialized'), distance: '12.1 km', lat: coords.latitude + 0.035, lon: coords.longitude - 0.012 },
        { id: '4', name: t('home.deptSeed') === 'home.deptSeed' ? 'Seed Distribution Hub' : t('home.deptSeed'), type: t('home.typeWarehouse') === 'home.typeWarehouse' ? 'Govt. Warehouse' : t('home.typeWarehouse'), distance: '15.4 km', lat: coords.latitude - 0.005, lon: coords.longitude + 0.042 },
    ];
};`;

code = code.replace(/const getDynamicDepartments[\s\S]*?\];\n\};/m, targetDepFunc);

// Update caller for departments
code = code.replace(/setDepartments\(getDynamicDepartments\(loc\.coords\)\);/g, 'setDepartments(getDynamicDepartments(loc.coords, t));');

// Recommendations handling
const targetRecFunc = `const getMockRecommendations = (t) => [
    { id: '1', crop: t('home.cropWheat') === 'home.cropWheat' ? 'Wheat' : t('home.cropWheat'), yield: t('home.yieldHigh') === 'home.yieldHigh' ? 'High' : t('home.yieldHigh'), icon: 'barley' },
    { id: '2', crop: t('home.cropMustard') === 'home.cropMustard' ? 'Mustard' : t('home.cropMustard'), yield: t('home.yieldSteady') === 'home.yieldSteady' ? 'Steady' : t('home.yieldSteady'), icon: 'flower-tulip' },
    { id: '3', crop: t('home.cropRice') === 'home.cropRice' ? 'Rice (Basmati)' : t('home.cropRice'), yield: t('home.yieldPremium') === 'home.yieldPremium' ? 'Premium' : t('home.yieldPremium'), icon: 'clover' },
    { id: '4', crop: t('home.cropMaize') === 'home.cropMaize' ? 'Maize' : t('home.cropMaize'), yield: t('home.yieldResilient') === 'home.yieldResilient' ? 'Resilient' : t('home.yieldResilient'), icon: 'corn' },
    { id: '5', crop: t('home.cropPearlMillet') === 'home.cropPearlMillet' ? 'Pearl Millet' : t('home.cropPearlMillet'), yield: t('home.yieldHigh') === 'home.yieldHigh' ? 'High' : t('home.yieldHigh'), icon: 'sprout-outline' },
];`;

code = code.replace(/const MOCK_RECOMMENDATIONS[\s\S]*?\];/m, targetRecFunc);

// Update caller for MOCK_RECOMMENDATIONS
code = code.replace(/MOCK_RECOMMENDATIONS\.map/g, 'getMockRecommendations(t).map');

// Final fixes to standard titles
code = code.replace(
    /\|\| 'Seasonal Recommendations'/g,
    `|| (t('home.seasonalRecommendations') === 'home.seasonalRecommendations' ? 'Seasonal Recommendations' : t('home.seasonalRecommendations'))`
);
code = code.replace(
    /\|\| 'Nearby Support'/g,
    `|| (t('home.nearbySupport') === 'home.nearbySupport' ? 'Nearby Support' : t('home.nearbySupport'))`
);

fs.writeFileSync(screenPath, code);
console.log('Fixed HomeScreen detailed translations');
