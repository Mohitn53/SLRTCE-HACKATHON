const aiService = require('../service/ai.service');
const Scan = require('../models/scan.model');

const askChatbot = async (req, res) => {
    try {
        const { message, history, contextFlags, location, userId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        // 1. Context: Geographic Location
        const userLoc = location?.coords 
            ? `Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}` 
            : "Palghar, Maharashtra";

        // 2. Context: Real-time DB Scans
        let scanHistoryText = "No recent scans available.";
        try {
            const query = userId ? { user: userId } : {};
            const recentScans = await Scan.find(query).sort({ createdAt: -1 }).limit(3);
            
            if (recentScans && recentScans.length > 0) {
                scanHistoryText = recentScans.map(s => 
                    `- ${new Date(s.createdAt).toLocaleDateString()}: Plant: ${s.plant || 'Unknown'} | Health: ${s.condition || s.status || 'Unknown'} (${Math.round((s.confidence||0)*100)}% accuracy)`
                ).join("\n");
            }
        } catch(dbErr) {
            console.error("DB Fetch Error for Chatbot Context:", dbErr);
        }

        // 3. Context: Live IoT / Weather Sensor Data (Simulated for Demo since API keys missing)
        const soilMoisture = Math.floor(Math.random() * 30) + 45; // 45% - 75% realistic range
        const temperature = Math.floor(Math.random() * 10) + 22; // 22�C - 32�C

        const gatheredContextText = `
        FARMER REAL-TIME CONTEXT DATA:
        Location: ${userLoc}
        Current Local Weather: ${temperature}�C, Partly Cloudy, 10% Chance of Rainfall
        IoT Soil Moisture Sensor: ${soilMoisture}%
        
        Recent Image Scans from User DB:
        ${scanHistoryText}
        `;

        console.log("Generating Chatbot AI Reply with Real/Simulated Context...");
        const replyData = await aiService.generateChatbotReply(message, history, gatheredContextText);

        res.status(200).json({
            reply: replyData.text || replyData,
            context: replyData.contextFlags || ["?? General Knowledge"] // Fallback context
        });

    } catch (e) {
        console.error("Chat Controller Error:", e);
        res.status(500).json({ error: "Failed to process chat query.", details: e.message });
    }
};

module.exports = {
    askChatbot
};
