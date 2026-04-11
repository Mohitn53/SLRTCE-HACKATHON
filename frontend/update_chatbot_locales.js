const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');
const langs = ['en.json', 'hi.json', 'mr.json'];

for (const f of langs) {
    const file = path.join(localesDir, f);
    if (fs.existsSync(file)) {
        let json = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (!json.chatbot) json.chatbot = {};
        
        if (f.startsWith('en')) {
            json.chatbot.q4 = "How to treat pests?";
            json.chatbot.q5 = "Current soil health?";
            json.chatbot.mockWater = "Your sensors show **Soil Moisture is at 62%** and the optimal range for Wheat is 60-70%.\n\nHowever, since my forecast indicates a **40% chance of light rain** tomorrow morning, I recommend pausing irrigation for now to prevent waterlogging and reduce costs.";
            json.chatbot.mockYellow = "Yellowing leaves (chlorosis) usually point to a **Nitrogen deficiency** or poor drainage.\n\nChecking your recent logs, your soil drains well. Try applying a balanced NPK fertilizer (like 20-20-20) this week. If spots appear, please use the Detection scan to ensure it isn't rust.";
            json.chatbot.mockFertilizer = "Since it's the vegetative stage for your current crop, a nitrogen-rich fertilizer is best.\n\nRecommendation: Use **Urea (46-0-0)** at about 50kg per acre. Always water the field lightly after application so it seeps effectively into the root zone.";
            json.chatbot.mockPest = "Pests like Aphids are common right now.\n\n**Organic fix:** Spray Neem oil mixed with a mild soap.\n**Chemical fix:** Imidacloprid (consult local guidelines first).\n\nPlease run an image scan so our AI can identify the exact insect type for a precise treatment plan!";
            json.chatbot.mockHello = "Hello! I'm Kisan AI. I can review your soil data, weather forecasts, and crop disease scans to give you tailored farming advice. What's on your mind today?";
            json.chatbot.mockDefault = "I see. To give you the most accurate agricultural advice, could you describe the specific symptoms or tell me exactly which crop we are discussing today?";
        } else if (f.startsWith('hi')) {
            json.chatbot.q4 = "कीटों का इलाज कैसे करें?";
            json.chatbot.q5 = "मिट्टी का वर्तमान स्वास्थ्य?";
            json.chatbot.mockWater = "आपके सेंसर दिखाते हैं कि **मिट्टी की नमी 62%** है, और गेहूं के लिए यह सीमा 60-70% है।\n\nकल सुबह हल्की बारिश की 40% संभावना है, मैं सिंचाई रोकने की सलाह दूंगा।";
            json.chatbot.mockYellow = "पीले पत्ते (क्लोरोसिस) मुख्य रूप से **नाइट्रोजन की कमी** या खराब जल निकासी के कारण होते हैं। एक संतुलित NPK (20-20-20) इस सप्ताह आज़माएं।";
            json.chatbot.mockFertilizer = "वर्तमान वनस्पति चरण के लिए, नाइट्रोजन युक्त उर्वरक सबसे अच्छा है। 50 किलो प्रति एकड़ के हिसाब से **यूरिया (46-0-0)** का उपयोग करें।";
            json.chatbot.mockPest = "एफिड्स जैसे कीट अभी आम हैं।\n**जैविक उपाय:** नीम के तेल का छिड़काव करें।\n**रासायनिक:** इमिडाक्लोप्रिड।\nछवि स्कैन करें ताकि AI सटीक इलाज बता सके!";
            json.chatbot.mockHello = "नमस्ते! मैं किसान एआई हूँ। मैं आपके मिट्टी के डेटा, मौसम के पूर्वानुमान और फसल रोगों की समीक्षा कर सकता हूँ। आज आप क्या पूछना चाहते हैं?";
            json.chatbot.mockDefault = "मैं समझ गया। कृपया मुझे अपनी विशिष्ट फसल और समस्याओं के बारे में अधिक विवरण दें ताकि मैं उत्तम सलाह दे सकूं।";
        } else if (f.startsWith('mr')) {
            json.chatbot.q4 = "किडींवर उपाय कसा करावा?";
            json.chatbot.q5 = "मातीचे सद्य आरोग्य?";
            json.chatbot.mockWater = "तुमचे सेन्सर दाखवतात की **मातीतील ओलावा 62%** आहे, गव्हासाठी योग्य प्रमाण 60-70% आहे.\n\nयेणाऱ्या पावसामुळे, पाणी साचू नये म्हणून सिंचन थांबवण्याचा सल्ला देतो.";
            json.chatbot.mockYellow = "पिवळी पाने **नायट्रोजनची कमतरता** दर्शवतात. या आठवड्यात संतुलित NPK (20-20-20) खत वापरून पहा.";
            json.chatbot.mockFertilizer = "वनस्पतींच्या वाढीच्या टप्प्यात नायट्रोजनयुक्त खत उत्तम आहे. 50 किलो प्रति एकर **युरिया (46-0-0)** वापरा.";
            json.chatbot.mockPest = "सध्या मावा (Aphids) सारख्या किडी सामान्य आहेत.\n**सेंद्रिय उपाय:** कडूनिंबाच्या तेलाची फवारणी.\nकृपया फोटो काढून स्कॅन करा जेणेकरून AI अचूक उपाय सुचवेल!";
            json.chatbot.mockHello = "नमस्कार! मी किसान AI आहे. मी तुमची माती, हवामान आणि पिकांची माहिती तपासून उत्तम सल्ला देऊ शकतो. आज तुमचा काय प्रश्न आहे?";
            json.chatbot.mockDefault = "मला समजले. अधिक अचूक सल्ल्यासाठी कृपया पिकाचे नाव आणि लक्षणे सविस्तर सांगा.";
        }
        
        fs.writeFileSync(file, JSON.stringify(json, null, 2));
    }
}
console.log('Language files updated with dynamic mocks');
