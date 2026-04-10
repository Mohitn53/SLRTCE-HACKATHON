# Kisan Setu - Smart Agriculture Decision & Resource Management System

## 🌾 Project Overview

**Kisan Setu** (Farmer's Bridge) is a comprehensive, data-driven AI system designed to help farmers make intelligent decisions about irrigation, resource management, and crop health monitoring.

The system predicts soil moisture, integrates weather data, provides irrigation recommendations, optimizes resource usage, and simulates future soil conditions.

---

## 🎯 Features

### 1. **Data Processing Pipeline**
- Load soil moisture data from HDF5 files (SMAP satellite data)
- Handle missing values through interpolation
- Normalize soil moisture (0-1 scale)
- Categorize soil conditions (Dry/Moderate/Wet)

### 2. **Weather Integration**
- Real-time weather forecasting via OpenWeatherMap API
- Extract rainfall predictions for next 24 hours
- Temperature, humidity, and wind speed analysis
- Caching mechanism to avoid rate limiting

### 3. **Intelligent Decision Engine**
Provides recommendations based on:
- **Irrigation Decisions**
  - 🚨 Urgent (moisture < 0.15)
  - ⚖️ Light (moisture 0.15-0.22)
  - ✅ No Irrigation (moisture > 0.22)
  - 🌧️ Skip (if rain > 5mm expected)

- **Resource Optimization**
  - Water usage levels (High/Medium/Low)
  - Fertilizer recommendations
  - Energy optimization tips

### 4. **Simulation Engine**
- Predicts future soil moisture for 1-30 days
- Simulation formula: M(t+1) = M(t) + irrigation - evaporation + rain
- Supports custom irrigation schedules
- Finds optimal irrigation schedules
- Calculates moisture trends

### 5. **Backend API (Flask)**
REST endpoints for:
- Data processing and retrieval
- Single location decisions
- Region summaries
- Moisture forecasts
- Optimal irrigation schedules

### 6. **Interactive Dashboard (Streamlit)**
- Real-time data visualization
- Soil moisture mapping
- Decision analytics
- Simulation tools
- Advisory recommendations

### 7. **Mobile Integration**
- React Native/Expo frontend
- Kisan Setu splash screen with multi-language support
- Integration-ready APIs

---

## 📁 Project Structure

```
Soil_Moisture_Detection/
├── config.py                  # Configuration and constants
├── data_processor.py          # Data loading and preprocessing
├── weather_service.py         # Weather API integration
├── decision_engine.py         # Decision logic
├── simulation_engine.py       # Moisture simulation
├── pipeline.py                # Main orchestration pipeline
├── api_server.py              # Flask REST API
├── dashboard.py               # Streamlit visualization
├── test_system.py             # Testing and benchmarking
├── requirements.txt           # Python dependencies
├── Reduced_SMAP_L4_SM_aup.h5 # HDF5 data file
└── README.md                  # Documentation
```

---

## 🚀 Quick Start

### Installation

1. **Clone and navigate to project:**
```bash
cd Soil_Moisture_Detection
```

2. **Create virtual environment:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file:**
```bash
# .env
OPENWEATHER_API_KEY=your_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

Get your API key from: https://openweathermap.org/api

---

## 💻 Running Components

### 1. **Test System**
```bash
python test_system.py
```
Runs comprehensive tests:
- Pipeline initialization
- Data loading
- Decision engine
- Simulation engine
- Performance benchmarking

### 2. **Flask API Server**
```bash
python api_server.py
```
Server runs on: `http://localhost:5000`

**Key Endpoints:**
- `GET /health` - Health check
- `GET /api/data` - Get processed data
- `GET /api/stats` - Get statistics
- `POST /api/location/decision` - Decision for a location
- `POST /api/region/summary` - Region summary
- `POST /api/simulation/forecast` - Forecast moisture
- `POST /api/simulation/optimal-schedule` - Optimal schedule

### 3. **Streamlit Dashboard**
```bash
streamlit run dashboard.py
```
Dashboard runs on: `http://localhost:8501`

**Available Views:**
- 📊 Dashboard - Overview and analytics
- 🔍 Data Explorer - Filter and search data
- 🔮 Simulation Tool - Predict future moisture
- 🌾 Advisory - Farming recommendations
- ⚙️ Settings - System configuration

---

## 📊 API Usage Examples

### Get Processed Data
```bash
curl "http://localhost:5000/api/data?limit=50&fetch_weather=false"
```

### Get Decision for Location
```bash
curl -X POST http://localhost:5000/api/location/decision \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 20.5937,
    "longitude": 75.7597,
    "soil_moisture": 0.18
  }'
```

### Forecast Soil Moisture
```bash
curl -X POST http://localhost:5000/api/simulation/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "soil_moisture": 0.18,
    "rainfall_forecast": 10.0,
    "days": 3,
    "irrigation": true
  }'
```

### Find Optimal Schedule
```bash
curl -X POST http://localhost:5000/api/simulation/optimal-schedule \
  -H "Content-Type: application/json" \
  -d '{
    "soil_moisture": 0.18,
    "rainfall_forecast": 5.0,
    "target_moisture": 0.18,
    "days": 5
  }'
```

---

## 🔑 Core Components

### DataProcessor
```python
from data_processor import DataProcessor

dp = DataProcessor('Reduced_SMAP_L4_SM_aup.h5')
df = dp.get_processed_data(limit=100)
stats = dp.get_statistics()
filtered = dp.get_filtered_data(20, 21, 75, 76)
```

### DecisionEngine
```python
from decision_engine import DecisionEngine

engine = DecisionEngine()
decision = engine.get_combined_recommendation(
    moisture=0.18,
    rain=0.0
)
# Returns: irrigation decision, resources, priority
```

### SimulationEngine
```python
from simulation_engine import SimulationEngine

sim = SimulationEngine()
predictions = sim.simulate_moisture(
    current_moisture=0.18,
    rain=0.0,
    days=3
)
# Returns: list of predicted moisture values
```

### AgriculturalPipeline
```python
from pipeline import AgriculturalPipeline

pipeline = AgriculturalPipeline()
df = pipeline.run_full_pipeline(
    limit=100,
    fetch_weather=True,
    include_simulation=True
)
report = pipeline.get_summary_report()
```

---

## 🌐 Integration with Frontend

### React Navigation Setup
Add to `frontend/src/app/AppNavigator.jsx`:

```javascript
import KisanSetuSplashScreen from '../features/splash/KisanSetuSplashScreen';

// In navigation stack:
<Stack.Screen 
  name="KisanSetuSplash" 
  component={KisanSetuSplashScreen}
  options={{ headerShown: false }}
/>
```

### API Service Integration
```javascript
// services/agricultureService.js
const API_BASE = 'http://your-backend:5000';

export const getLocationDecision = async (lat, lon, moisture) => {
  return fetch(`${API_BASE}/api/location/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude: lat, longitude: lon, soil_moisture: moisture })
  }).then(r => r.json());
};
```

---

## 🧪 Testing

### Unit Tests
```bash
python -m pytest test_system.py -v
```

### Performance Benchmarking
```bash
python test_system.py  # Includes performance metrics
```

### Manual Testing
```bash
python
>>> from pipeline import AgriculturalPipeline
>>> pipeline = AgriculturalPipeline()
>>> result = pipeline.process_single_location(20.5937, 75.7597, 0.18)
>>> print(result)
```

---

## 📈 Database Schema

### Expected Columns in Processed Data

| Column | Type | Range | Description |
|--------|------|-------|-------------|
| Latitude | Float | -90 to 90 | Location latitude |
| Longitude | Float | -180 to 180 | Location longitude |
| Soil_Moisture_Raw | Float | Variable | Raw soil moisture |
| Soil_Moisture | Float | 0-1 | Normalized moisture |
| Category | String | Dry/Moderate/Wet | Moisture category |
| Rain | Float | 0-100+ | Forecasted rainfall (mm) |
| Decision | String | See list | Irrigation recommendation |
| Confidence | Float | 0-1 | Decision confidence |
| Water_Usage | String | High/Medium/Low | Water requirement |
| Fertilizer | String | Various | Fertilizer advice |
| Energy | String | Various | Energy optimization |
| Priority | String | HIGH/NORMAL | Priority level |
| Future_Moisture | String | JSON array | 3-day forecast |

---

## ⚙️ Configuration

### System Parameters (config.py)
```python
SOIL_MOISTURE_THRESHOLDS = {
    'DRY': 0.15,
    'MODERATE': 0.22,
    'WET': 1.0
}

SIMULATION_PARAMS = {
    'irrigation_rate': 0.05,        # Daily irrigation amount
    'evaporation_rate': 0.01,       # Daily evaporation
    'default_days': 3               # Default forecast days
}
```

### Environment Variables
```
OPENWEATHER_API_KEY=your_key
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=5000
```

---

## 🐛 Troubleshooting

### Issue: "Model file not found"
```
Solution: Ensure Reduced_SMAP_L4_SM_aup.h5 exists in Soil_Moisture_Detection/
```

### Issue: Weather API errors
```
Solution: Check OPENWEATHER_API_KEY in .env and API quota
```

### Issue: Flask port already in use
```
Solution: Change port in api_server.py or kill existing process:
# Windows: netstat -ano | findstr :5000
# Linux: lsof -i :5000
```

### Issue: Streamlit permissions error
```
Solution: streamlit run dashboard.py --logger.level=debug
```

---

## 🚀 Deployment

### Docker Deployment (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "api_server.py"]
```

### Production Checklist
- [ ] API key configured in environment
- [ ] CORS properly configured
- [ ] Error logging enabled
- [ ] Rate limiting implemented
- [ ] API documentation
- [ ] Database backups
- [ ] Monitoring and alerts

---

## 📞 Support & Contributions

For issues, questions, or contributions:
- Create an issue on GitHub
- Check documentation
- Run test_system.py for diagnostics

---

## 📄 License

Project License (See LICENSE file)

---

## 👥 Team

Developed by Team Code Breakers
**Kisan Setu - Empowering Farmers with AI** 🌾
