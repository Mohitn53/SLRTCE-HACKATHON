# 🚀 Quick Setup Guide

This guide will help you get Crop Guard up and running on your local machine in under 10 minutes.

## Prerequisites Checklist

Before you begin, make sure you have the following installed:

- [ ] **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- [ ] **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- [ ] **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] **Git** - [Download](https://git-scm.com/)
- [ ] **Expo Go App** on your phone - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/crop-detection-project.git
cd crop-detection-project
```

### 2. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your credentials
# You'll need:
# - MongoDB connection string
# - JWT secret (any random string)
# - ImageKit credentials (sign up at https://imagekit.io/)
# - Gemini API key (get from https://makersuite.google.com/app/apikey)

# Start the backend server
npx nodemon server.js
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

### 3. AI Server Setup (2 minutes)

```bash
# Open a new terminal
# Navigate to project root
cd crop-detection-project

# Install Python dependencies
pip install -r requirements_api.txt

# Start the AI server
python api_server.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5001
```

### 4. Frontend Setup (3 minutes)

```bash
# Open a new terminal
# Navigate to frontend
cd crop-detection-project/frontend

# Install dependencies
npm install

# Start Expo
npx expo start
```

**Expected Output:**
```
Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### 5. Run on Your Phone

1. Open **Expo Go** app on your phone
2. Scan the QR code from the terminal
3. Wait for the app to load (first time may take 1-2 minutes)
4. You're ready to go! 🎉

## Troubleshooting

### Backend Issues

**Problem:** MongoDB connection failed
```bash
# Solution: Make sure MongoDB is running
# For local MongoDB:
mongod

# Or use MongoDB Atlas cloud database
```

**Problem:** Port 5000 already in use
```bash
# Solution: Change PORT in backend/.env file
PORT=5001
```

### Frontend Issues

**Problem:** Metro bundler error
```bash
# Solution: Clear cache and restart
npx expo start -c
```

**Problem:** Can't scan QR code
```bash
# Solution: Make sure phone and computer are on same WiFi
# Or use tunnel mode:
npx expo start --tunnel
```

### AI Server Issues

**Problem:** Module not found
```bash
# Solution: Reinstall Python dependencies
pip install -r requirements_api.txt --force-reinstall
```

**Problem:** Port 5001 already in use
```bash
# Solution: Edit api_server.py and change the port
app.run(port=5002)  # Change to any available port
```

## Quick Test

Once everything is running, test the app:

1. **Register** a new account
2. **Login** with your credentials
3. **Tap "Scan Crop"** button
4. **Take a photo** or select from gallery
5. **Wait for analysis** (2-5 seconds)
6. **View results** with treatment recommendations

## Default Test Credentials

For testing, you can use:
- **Email:** test@cropguard.com
- **Password:** test123

(Create this account first by registering)

## Environment Variables Quick Reference

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crop-detection
JWT_SECRET=your_secret_key_here
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
GEMINI_API_KEY=your_key
```

### Frontend (if needed)
The frontend automatically connects to `http://localhost:5000` for development.

## Next Steps

- Read the [full README](README.md) for detailed documentation
- Check out [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Join our community discussions

## Need Help?

- 📧 Email: support@cropguard.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/crop-detection-project/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/crop-detection-project/discussions)

---

**Happy Coding! 🌾**

*Team Code Breakers*
