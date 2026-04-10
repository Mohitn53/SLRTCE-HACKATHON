# 🌾 Crop Guard - AI-Powered Crop Disease Detection

<div align="center">

![Crop Guard Logo](https://img.shields.io/badge/Crop-Guard-green?style=for-the-badge&logo=leaf)

**Empowering Farmers with Offline AI Technology**

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=flat&logo=expo)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat&logo=python)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)

**Developed by Team Code Breakers** 🚀

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Team](#-team)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Crop Guard** is a mobile-first AI system designed to help farmers detect crop diseases instantly using their smartphones. The application works offline or with limited connectivity, making it accessible to farmers in remote areas. It provides localized treatment recommendations in multiple languages (English, Hindi, and Marathi).

### 🎯 Problem Statement

Farmers often struggle to identify crop diseases early, leading to significant crop losses. Traditional methods require expert consultation, which may not be readily available in rural areas.

### 💡 Solution

Crop Guard uses AI-powered image recognition to detect crop diseases from photos taken on basic smartphones, providing instant diagnosis and treatment recommendations even without internet connectivity.

---

## ✨ Features

### 🔍 Core Features

- **📸 Instant Disease Detection**: Capture or upload crop images for real-time analysis
- **🤖 AI-Powered Diagnosis**: Advanced machine learning model for accurate disease identification
- **📱 Offline Functionality**: Works without internet connection for remote areas
- **🌐 Multi-Language Support**: Available in English, Hindi, and Marathi
- **🔊 Voice Assistance**: Text-to-speech for treatment recommendations
- **📊 Detailed Treatment Plans**: 
  - Organic treatment options
  - Chemical treatment recommendations
  - Maintenance tips
  - Prevention measures
  - Severity assessment

### 🎨 User Experience

- **🎨 Modern UI/UX**: Clean, intuitive interface designed for farmers
- **📜 Scan History**: Track all previous scans and diagnoses
- **💬 Feedback System**: Rate and comment on diagnosis accuracy
- **📍 Location Services**: Find nearby agricultural departments
- **🌤️ Weather Alerts**: Get weather-based crop recommendations
- **🌱 Seasonal Crop Suggestions**: Recommendations based on location and season

### 🔐 Security & Privacy

- **🔒 Secure Authentication**: JWT-based user authentication
- **💾 Local Data Storage**: Offline scan history and user preferences
- **🔐 Encrypted Storage**: Secure storage using Expo SecureStore

---

## 🛠️ Tech Stack

### 📱 Frontend (Mobile App)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.81.5 | Mobile app framework |
| **Expo** | ~54.0 | Development platform |
| **React Navigation** | ^7.1.28 | Navigation system |
| **Axios** | ^1.13.4 | HTTP client |
| **AsyncStorage** | 2.2.0 | Local data persistence |
| **Expo Camera** | ~17.0.10 | Camera functionality |
| **Expo Speech** | ~14.0.8 | Text-to-speech |
| **Expo Location** | ~19.0.8 | GPS services |

### 🖥️ Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Runtime environment |
| **Express.js** | ^5.2.1 | Web framework |
| **MongoDB** | - | Database |
| **Mongoose** | ^9.0.2 | ODM for MongoDB |
| **JWT** | ^9.0.3 | Authentication |
| **Bcrypt** | ^6.0.0 | Password hashing |
| **Multer** | ^2.0.2 | File upload handling |
| **ImageKit** | ^6.0.0 | Image storage & CDN |

### 🤖 AI/ML

| Technology | Purpose |
|------------|---------|
| **Python** | AI model runtime |
| **Google Gemini AI** | Disease detection model |
| **Flask** | AI API server |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Camera  │  │ Detection│  │  History │             │
│  │  Screen  │→ │  Screen  │→ │  Screen  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                        ↓ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│              Backend Server (Node.js/Express)           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   Auth   │  │   Scan   │  │   User   │             │
│  │   API    │  │   API    │  │   API    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
         ↓                              ↓
┌──────────────────┐          ┌──────────────────┐
│  MongoDB Atlas   │          │  AI Server       │
│  (Database)      │          │  (Python/Flask)  │
└──────────────────┘          └──────────────────┘
                                      ↓
                              ┌──────────────────┐
                              │  Google Gemini   │
                              │  AI Model        │
                              └──────────────────┘
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or Atlas)
- **Expo CLI** (`npm install -g expo-cli`)
- **Git**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/crop-detection-project.git
cd crop-detection-project
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your MongoDB URI, JWT secret, etc.

# Start the backend server
npm start
# or with nodemon
npx nodemon server.js
```

**Environment Variables (.env):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
GEMINI_API_KEY=your_gemini_api_key
```

### 3️⃣ AI Server Setup

```bash
# Navigate to project root
cd ..

# Install Python dependencies
pip install -r requirements_api.txt

# Start the AI server
python api_server.py
```

### 4️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# or press 'a' for Android emulator, 'i' for iOS simulator
```

---

## 📱 Usage

### For Farmers

1. **Register/Login**: Create an account or log in
2. **Scan Crop**: Tap "Scan Crop" button on home screen
3. **Capture Image**: Take a photo or select from gallery
4. **Get Diagnosis**: Wait for AI analysis (2-5 seconds)
5. **View Treatment**: Read detailed treatment recommendations
6. **Listen**: Use voice feature to hear recommendations
7. **Provide Feedback**: Rate the diagnosis accuracy
8. **View History**: Access past scans anytime

### Language Selection

- Tap the language icon in settings
- Choose from English, Hindi, or Marathi
- UI and voice output will update automatically

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "farmer123",
  "email": "farmer@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "securepassword"
}
```

### Scan Endpoints

#### Upload & Analyze Image
```http
POST /api/scan/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "image": <file>
}
```

**Response:**
```json
{
  "scan": {
    "plant": "Tomato",
    "condition": "Early Blight",
    "status": "DISEASED",
    "confidence": 0.95,
    "fullReport": {
      "message": "Early detection of early blight disease",
      "severity": "Medium",
      "organic": ["Neem oil spray", "Copper fungicide"],
      "chemical": ["Chlorothalonil", "Mancozeb"],
      "maintenance": ["Remove infected leaves", "Improve air circulation"],
      "prevention": ["Crop rotation", "Mulching"],
      "recommendation": "Apply treatment within 24 hours"
    }
  }
}
```

---

## 📸 Screenshots

### Home Screen
- Dashboard with scan button
- Nearby agricultural departments
- Weather alerts
- Seasonal crop recommendations

### Camera Screen
- Real-time camera view
- Gallery selection option
- Camera flip functionality

### Detection Screen
- Disease identification
- Confidence score
- Detailed treatment plans
- Voice assistance
- Feedback form

### History Screen
- Past scan records
- Disease timeline
- Quick re-access to treatments

---

## 👥 Team

**Team Code Breakers** 🚀

| Role | Responsibilities |
|------|------------------|
| **Frontend Developer** | React Native app development, UI/UX design |
| **Backend Developer** | Node.js API, MongoDB integration |
| **AI/ML Engineer** | Disease detection model, Python integration |
| **Full Stack Developer** | Integration, testing, deployment |

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- Limited to specific crop types
- Requires good image quality for accurate detection
- AI model needs periodic updates

### Future Enhancements
- [ ] Expand disease database
- [ ] Add more crop varieties
- [ ] Implement community forum
- [ ] Add expert consultation feature
- [ ] Integrate marketplace for treatments
- [ ] Add crop yield prediction
- [ ] Support for more languages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the AI model
- **Expo** for the amazing development platform
- **MongoDB** for database services
- **ImageKit** for image storage and CDN
- All farmers who provided feedback during testing

---

## 📞 Contact & Support

- **Email**: support@cropguard.com
- **GitHub Issues**: [Report a bug](https://github.com/your-username/crop-detection-project/issues)
- **Documentation**: [Full Docs](https://github.com/your-username/crop-detection-project/wiki)

---

<div align="center">

**Made with ❤️ by Team Code Breakers**

⭐ Star this repository if you find it helpful!

</div>
