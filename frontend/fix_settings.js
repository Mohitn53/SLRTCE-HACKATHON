const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');

// English updates
let en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));
en.settings = {
    ...en.settings,
    "accountCenter": "Account Center",
    "fallbackName": "Aggie Farmer",
    "fallbackEmail": "Active Member",
    "totalScans": "Total Scans",
    "verified": "Verified",
    "preferences": "Preferences",
    "displayLanguage": "Display Language",
    "aiNotifications": "AI Notifications",
    "instantAlerts": "Instant alerts active",
    "system": "System",
    "appDetails": "App Details",
    "signOut": "Sign Out",
    "localization": "Localization"
};
fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(en, null, 2));

// Hindi updates
let hi = JSON.parse(fs.readFileSync(path.join(localesDir, 'hi.json'), 'utf8'));
hi.settings = {
    ...hi.settings,
    "accountCenter": "खाता केंद्र",
    "fallbackName": "किसान",
    "fallbackEmail": "सक्रिय सदस्य",
    "totalScans": "कुल स्कैन",
    "verified": "सत्यापित",
    "preferences": "प्राथमिकताएं",
    "displayLanguage": "प्रदर्शन भाषा",
    "aiNotifications": "AI सूचनाएं",
    "instantAlerts": "तत्काल अलर्ट सक्रिय",
    "system": "सिस्टम",
    "appDetails": "ऐप विवरण",
    "signOut": "साइन आउट",
    "localization": "स्थानीयकरण"
};
fs.writeFileSync(path.join(localesDir, 'hi.json'), JSON.stringify(hi, null, 2));

// Marathi updates
let mr = JSON.parse(fs.readFileSync(path.join(localesDir, 'mr.json'), 'utf8'));
mr.settings = {
    ...mr.settings,
    "accountCenter": "खाते केंद्र",
    "fallbackName": "शेतकरी",
    "fallbackEmail": "सक्रिय सदस्य",
    "totalScans": "एकूण स्कॅन",
    "verified": "सत्यापित",
    "preferences": "प्राधान्ये",
    "displayLanguage": "प्रदर्शन भाषा",
    "aiNotifications": "AI सूचना",
    "instantAlerts": "त्वरित सूचना सक्रिय",
    "system": "प्रणाली",
    "appDetails": "ॲप तपशील",
    "signOut": "साइन आउट",
    "localization": "स्थानिकीकरण"
};
fs.writeFileSync(path.join(localesDir, 'mr.json'), JSON.stringify(mr, null, 2));

// Update SettingsScreen.jsx
const screenPath = path.join(__dirname, 'src/features/settings/SettingsScreen.jsx');
let code = fs.readFileSync(screenPath, 'utf8');

// Replacements
const replacements = {
    ">Account Center<": ">{t('settings.accountCenter') === 'settings.accountCenter' ? 'Account Center' : t('settings.accountCenter')}<",
    "|| 'Aggie Farmer'": "|| (t('settings.fallbackName') === 'settings.fallbackName' ? 'Aggie Farmer' : t('settings.fallbackName'))",
    "|| 'Active Member'": "|| (t('settings.fallbackEmail') === 'settings.fallbackEmail' ? 'Active Member' : t('settings.fallbackEmail'))",
    ">Total Scans<": ">{t('settings.totalScans') === 'settings.totalScans' ? 'Total Scans' : t('settings.totalScans')}<",
    ">Verified<": ">{t('settings.verified') === 'settings.verified' ? 'Verified' : t('settings.verified')}<",
    ">Preferences<": ">{t('settings.preferences') === 'settings.preferences' ? 'Preferences' : t('settings.preferences')}<",
    ">Display Language<": ">{t('settings.displayLanguage') === 'settings.displayLanguage' ? 'Display Language' : t('settings.displayLanguage')}<",
    ">AI Notifications<": ">{t('settings.aiNotifications') === 'settings.aiNotifications' ? 'AI Notifications' : t('settings.aiNotifications')}<",
    ">Instant alerts active<": ">{t('settings.instantAlerts') === 'settings.instantAlerts' ? 'Instant alerts active' : t('settings.instantAlerts')}<",
    ">System<": ">{t('settings.system') === 'settings.system' ? 'System' : t('settings.system')}<",
    ">App Details<": ">{t('settings.appDetails') === 'settings.appDetails' ? 'App Details' : t('settings.appDetails')}<",
    ">Sign Out<": ">{t('settings.signOut') === 'settings.signOut' ? 'Sign Out' : t('settings.signOut')}<",
    ">Localization<": ">{t('settings.localization') === 'settings.localization' ? 'Localization' : t('settings.localization')}<"
};

for (const [oldStr, newStr] of Object.entries(replacements)) {
    code = code.split(oldStr).join(newStr);
}

fs.writeFileSync(screenPath, code);
console.log('Fixed SettingsScreen translations');
