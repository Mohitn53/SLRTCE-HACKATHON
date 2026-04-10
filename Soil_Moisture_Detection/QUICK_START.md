# 🌾 Kisan Setu - Quick Start Guide

## 5-Minute Setup

### Step 1: Get OpenWeatherMap API Key (1 min)
1. Visit: https://openweathermap.org/api
2. Sign up (free tier available)
3. Generate API key in account settings

### Step 2: Setup Environment (1 min)
```bash
# Navigate to project
cd Soil_Moisture_Detection

# Copy template
cp .env.template .env

# Edit .env and add your API key
# OPENWEATHER_API_KEY=your_key_here
```

### Step 3: Install Dependencies (2 min)
```bash
# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### Step 4: Test System (1 min)
```bash
python test_system.py
```

Success! ✅ You should see test results confirming the system works.

---

## Run Individual Components

### Option A: Backend API Only
```bash
python api_server.py
# Visit: http://localhost:5000/health
```

### Option B: Dashboard Only
```bash
streamlit run dashboard.py
# Visit: http://localhost:8501
```

### Option C: Full Stack
Terminal 1:
```bash
python api_server.py
```

Terminal 2:
```bash
streamlit run dashboard.py
```

---

## Using the API

### Get Data
```bash
curl "http://localhost:5000/api/data?limit=50"
```

### Get Decision
```bash
curl -X POST http://localhost:5000/api/location/decision \
  -H "Content-Type: application/json" \
  -d '{"latitude": 20.5, "longitude": 75.5, "soil_moisture": 0.18}'
```

### Forecast Moisture
```bash
curl -X POST http://localhost:5000/api/simulation/forecast \
  -H "Content-Type: application/json" \
  -d '{"soil_moisture": 0.18, "rainfall_forecast": 0, "days": 3}'
```

---

## Dashboard Features

### 📊 Dashboard Tab
- View overall statistics
- Soil moisture distribution
- Geographic heatmap
- Irrigation decision breakdown

### 🔍 Data Explorer Tab
- Filter by coordinates
- View detailed records
- Export data

### 🔮 Simulation Tab
- Predict future moisture
- Find optimal irrigation schedule
- View trends

### 🌾 Advisory Tab
- Get location-specific recommendations
- View urgent irrigation areas
- Priority-based alerts

### ⚙️ Settings Tab
- System information
- Configuration parameters
- Export data to CSV

---

## Integration with Mobile App

### Step 1: Update Navigation
Add to `frontend/src/app/AppNavigator.jsx`:
```javascript
import KisanSetuSplashScreen from '../features/splash/KisanSetuSplashScreen';

// In stack navigator:
<Stack.Screen 
  name="KisanSetuSplash" 
  component={KisanSetuSplashScreen}
/>
```

### Step 2: Create API Service
Create `frontend/src/services/agricultureService.js`:
```javascript
const API_BASE = 'http://your-server:5000';

export const getLocationDecision = (lat, lon, moisture) =>
  fetch(`${API_BASE}/api/location/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude: lat, longitude: lon, soil_moisture: moisture })
  }).then(r => r.json());

export const getProcessedData = (limit = 50) =>
  fetch(`${API_BASE}/api/data?limit=${limit}`).then(r => r.json());

export const forecastMoisture = (moisture, rain, days = 3) =>
  fetch(`${API_BASE}/api/simulation/forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ soil_moisture: moisture, rainfall_forecast: rain, days })
  }).then(r => r.json());
```

### Step 3: Use in Components
```javascript
import { getLocationDecision } from '../services/agricultureService';

// In your screen component:
const decision = await getLocationDecision(20.5, 75.5, 0.18);
console.log(decision.result.decision);
```

---

## Common Issues & Solutions

### ❌ "Model file not found"
**Solution:** Ensure `Reduced_SMAP_L4_SM_aup.h5` exists in `Soil_Moisture_Detection/`

### ❌ "API key not working"
**Solution:** 
1. Check key is in `.env` file (not `.env.template`)
2. Verify key from https://openweathermap.org/api/
3. Wait 5-10 minutes after creating key
4. Check API quota hasn't been exceeded

### ❌ "Port 5000 already in use"
**Solution:**
```bash
# Find process:
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # macOS/Linux

# Kill it or use different port
# Edit api_server.py line: app.run(port=5001)
```

### ❌ "ModuleNotFoundError"
**Solution:** Make sure virtual environment is activated and dependencies installed:
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### ❌ Streamlit "Permission denied"
**Solution:**
```bash
streamlit run dashboard.py --server.port 8502
```

---

## Performance Tips

### For Large Datasets
```python
# Limit records to process
df = pipeline.run_full_pipeline(limit=100)

# Use faster mode without weather
df = pipeline.run_full_pipeline(fetch_weather=False)
```

### For Faster API Responses
```bash
# Use without weather fetching
curl "http://localhost:5000/api/data?fetch_weather=false"
```

### Caching
- Weather service caches results
- Streamlit has built-in data caching
- Consider Redis for production

---

## Next Steps

1. ✅ **Run test_system.py** - Verify everything works
2. ✅ **Explore dashboard** - Understand data and features
3. ✅ **Test API endpoints** - Try different requests
4. ✅ **Integrate with mobile** - Connect React Native app
5. ✅ **Deploy to production** - Follow deployment guide

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│        React Native Mobile          │
│     (Kisan Setu - iOS/Android)      │
└────────┬────────────────────────────┘
         │ HTTP/JSON
         ▼
┌─────────────────────────────────────┐
│     Flask Backend API                │
│     (api_server.py)                  │
└────────┬────────────────────────────┘
         │
    ┌────┴───────────────┐
    ▼                    ▼
┌──────────────┐  ┌──────────────────┐
│ Data         │  │ Weather Service  │
│ Processor    │  │ (OpenWeatherMap) │
└──────────────┘  └──────────────────┘
    │
    ▼
┌──────────────┐
│ Decision     │
│ Engine       │
└──────────────┘
    │
    ▼
┌──────────────┐
│ Simulation   │
│ Engine       │
└──────────────┘

Optional:
┌─────────────────────────────────────┐
│  Streamlit Dashboard                 │
│  (dashboard.py)                      │
└─────────────────────────────────────┘
```

---

## Database Schema Reference

| Field | Type | Purpose |
|-------|------|---------|
| Latitude | Float | Location identifier |
| Longitude | Float | Location identifier |
| Soil_Moisture | Float (0-1) | Current moisture level |
| Category | String | Dry/Moderate/Wet |
| Rain | Float | 24h rainfall forecast |
| Decision | String | Irrigation recommendation |
| Confidence | Float (0-1) | Decision confidence |
| Water_Usage | String | High/Medium/Low |
| Fertilizer | String | Fertilizer advice |
| Energy | String | Energy optimization |
| Future_Moisture | List | 3-day forecast |

---

## Support

- 📖 Read: IMPLEMENTATION_GUIDE.md
- 🧪 Run: python test_system.py
- 📊 Visit: http://localhost:8501 (dashboard)
- 🔌 API: http://localhost:5000/health

---

## Key Features at a Glance

| Feature | Status | Location |
|---------|--------|----------|
| Data Processing | ✅ | data_processor.py |
| Weather Integration | ✅ | weather_service.py |
| Decision Engine | ✅ | decision_engine.py |
| Simulation | ✅ | simulation_engine.py |
| REST API | ✅ | api_server.py |
| Dashboard | ✅ | dashboard.py |
| Mobile App | ✅ | frontend/ |
| Tests | ✅ | test_system.py |

---

🌾 **Ready to empower farmers with AI!**

Next: `python test_system.py` 🚀
