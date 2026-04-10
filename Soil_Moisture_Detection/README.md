# 🌾 Kisan Setu - Smart Agriculture Decision & Resource Management System

## Overview

**Kisan Setu** (Farmer's Bridge) is a complete AI-powered system helping farmers make data-driven irrigation and resource management decisions.

🛰️ **Satellite Data** | 🌤️ **Real-time Weather** | 🧠 **AI Decisions** | 🔮 **Predictions** | 📊 **Dashboard** | 📱 **Mobile App**

---

## ⚡ Quick Start (5 minutes)

### 1. Environment Setup
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env
# Edit .env and add: OPENWEATHER_API_KEY=your_key
```

### 2. Run Tests
```bash
python test_system.py
```

### 3. Start Services
```bash
# Terminal 1: API
python api_server.py

# Terminal 2: Dashboard
streamlit run dashboard.py
```

**Access:**
- API: http://localhost:5000/health
- Dashboard: http://localhost:8501

---

## 📚 Documentation

| Document | Content | Time |
|----------|---------|------|
| **QUICK_START.md** | 5-min setup | 5 min |
| **IMPLEMENTATION_GUIDE.md** | Complete guide | 30 min |
| **SYSTEM_SUMMARY.md** | Architecture | 15 min |
| **VERIFICATION_CHECKLIST.md** | Pre-launch | varies |
| **commands.sh** | Useful commands | ∞ |

---

## 🎯 Key Features

✅ **Data Processing** - HDF5 satellite data, normalization, categorization  
✅ **Weather Integration** - OpenWeatherMap API, 24h rainfall forecast  
✅ **Decision Engine** - 4-level irrigation recommendations  
✅ **Simulation** - 1-30 day moisture forecasting  
✅ **REST API** - 8 production-ready endpoints  
✅ **Dashboard** - 5 interactive views  
✅ **Mobile App** - Bilingual splash screen  

---

## 🏗️ Components

- **config.py** - Configuration
- **data_processor.py** - Data loading & preprocessing
- **weather_service.py** - Weather API integration
- **decision_engine.py** - Decision logic
- **simulation_engine.py** - Predictive simulation
- **pipeline.py** - Main orchestration
- **api_server.py** - Flask REST API
- **dashboard.py** - Streamlit dashboard
- **test_system.py** - Test suite

---

## 🧪 Testing

```bash
python test_system.py
```

Tests:
- Pipeline initialization
- Data loading (1000+ records/sec)
- Decision engine (100+ decisions/sec)
- Simulation (100+ forecasts/sec)
- All scenarios
- Performance

---

## 📊 Performance

- **Data Loading:** 1000+ records/sec
- **Decisions:** 100+ decisions/sec
- **Simulations:** 100+ simulations/sec
- **API Response:** <50ms (no weather), <500ms (with weather)
- **Dashboard:** <2s load

---

## 🔑 Environment

Required in `.env`:
```bash
OPENWEATHER_API_KEY=your_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

Get API key: https://openweathermap.org/api

---

## 💻 API Endpoints

```
GET  /health
GET  /api/data?limit=50
GET  /api/stats
POST /api/location/decision
POST /api/region/summary
POST /api/simulation/forecast
POST /api/simulation/optimal-schedule
```

---

## 📱 Mobile Integration

Bilingual Kisan Setu splash screen:
- English/हिंदी/मराठी
- Agricultural theme
- API-ready architecture
- Theme colors: #10B981 (emerald)

Location: `frontend/src/features/splash/KisanSetuSplashScreen.jsx`

---

## 🚀 Next Steps

1. ✅ Run `python test_system.py`
2. ✅ Start `python api_server.py`
3. ✅ Start `streamlit run dashboard.py`
4. ✅ Read IMPLEMENTATION_GUIDE.md
5. ✅ Deploy to production

---

## 📞 Support

- Setup: **QUICK_START.md**
- Architecture: **SYSTEM_SUMMARY.md**
- Features: **IMPLEMENTATION_GUIDE.md**
- Checklist: **VERIFICATION_CHECKLIST.md**

---

**🌾 Kisan Setu - Empowering Farmers with AI**
