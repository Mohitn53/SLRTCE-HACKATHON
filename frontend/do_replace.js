const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [oldVal, newVal] of Object.entries(replacements)) {
        content = content.split(oldVal).join(newVal);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

replaceInFile('src/features/auth/screens/RegisterScreen.jsx', {
    '>Create Account<': '>{t("auth.registerTitle")}<',
    'placeholder="Full Name"': 'placeholder={t("auth.fullName")}',
    '>Full Name<': '>{t("auth.fullName")}<',
    'placeholder="Username"': 'placeholder={t("auth.username")}',
    '>Username<': '>{t("auth.username")}<',
    'placeholder="Password"': 'placeholder={t("auth.password")}',
    '>Password<': '>{t("auth.password")}<',
    'placeholder="Confirm Password"': 'placeholder={t("auth.confirmPassword")}',
    '>Confirm Password<': '>{t("auth.confirmPassword")}<',
    'placeholder="Location (City/Village)"': 'placeholder={t("auth.location")}',
    '>Location (City/Village)<': '>{t("auth.location")}<',
    '>Join our farming community<': '>{t("auth.registerSubtitle")}<',
    '>Already have an account? Sign In<': '>{t("auth.alreadyHaveAccount")}<',
    'Alert.alert("Error", "Passwords do not match");': 'Alert.alert(t("auth.error"), t("auth.passwordsDoNotMatch"));',
    'Alert.alert("Error", "Please fill all fields");': 'Alert.alert(t("auth.error"), t("auth.fillAllFields"));',
    'Alert.alert("Success", "Registration successful");': 'Alert.alert(t("auth.success"), t("auth.registrationSuccess"));'
});

replaceInFile('src/features/camera/CameraScreen.jsx', {
    '>We need your permission to show the camera<': '>{t("camera.permissionText")}<',
    'title="grant permission"': 'title={t("camera.grantPermission")}',
    '>Flip Camera<': '>{t("camera.flipCamera")}<',
    '>Take Picture<': '>{t("camera.takePicture")}<',
    '>Gallery<': '>{t("camera.gallery")}<',
    '>Retake<': '>{t("camera.retake")}<',
    '>Use Photo<': '>{t("camera.usePhoto")}<'
});

replaceInFile('src/features/detection/DetectionScreen.jsx', {
    '>Analyzing image...<': '>{t("detection.analyzing")}<',
    '>Identifying crop and disease...<': '>{t("detection.identifying")}<',
    '>Detection Results<': '>{t("detection.results")}<',
    '>Disease<': '>{t("detection.disease")}<',
    '>Confidence<': '>{t("detection.confidence")}<',
    '>Healthy<': '>{t("detection.healthy")}<',
    '>Treatment Recommendations<': '>{t("detection.treatment")}<',
    '>Preventive Measures<': '>{t("detection.preventive")}<',
    '>Save Scan to History<': '>{t("detection.saveScan")}<',
    '>Scan saved successfully!<': '>{t("detection.scanSaved")}<',
    '>Failed to save scan.<': '>{t("detection.scanFailed")}<',
    '>Scan Another Crop<': '>{t("detection.scanAgain")}<',
    '>No Disease Detected<': '>{t("detection.noDisease")}<',
    '>Crop<': '>{t("detection.crop")}<'
});

replaceInFile('src/features/history/HistoryScreen.jsx', {
    '>Scan History<': '>{t("history.title")}<',
    '>No scans found<': '>{t("history.noScans")}<',
    '>Tap to view details<': '>{t("history.tapToView")}<',
    '>Are you sure you want to delete this scan?<': '>{t("history.deleteConfirm")}<',
    '>Delete<': '>{t("history.delete")}<',
    '>Cancel<': '>{t("history.cancel")}<',
    '>Date<': '>{t("history.date")}<',
    '>Loading history...<': '>{t("history.loading")}<'
});

replaceInFile('src/features/chatbot/screens/ChatbotScreen.jsx', {
    '>Kisan Mitra<': '>{t("chatbot.title")}<',
    '>Type your message...<': '>{t("chatbot.typeMessage")}<',
    '>Send<': '>{t("chatbot.send")}<',
    '>Listening...<': '>{t("chatbot.listening")}<',
    '>Tap to speak<': '>{t("chatbot.tapToSpeak")}<',
    '>Connecting to server...<': '>{t("chatbot.connecting")}<'
});

replaceInFile('src/features/soil/SoilMoistureScreen.jsx', {
    '>Soil Moisture<': '>{t("soil.title")}<',
    '>Predict Moisture Content<': '>{t("soil.predictBtn")}<',
    '>Moisture Prediction<': '>{t("soil.results")}<',
    '>Temperature<': '>{t("soil.temperature")}<',
    '>Humidity<': '>{t("soil.humidity")}<',
    '>Precipitation<': '>{t("soil.precipitation")}<',
    '>Soil Type<': '>{t("soil.soilType")}<',
    '>Crop Type<': '>{t("soil.cropType")}<'
});
