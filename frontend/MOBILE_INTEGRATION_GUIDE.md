# Mobile App Integration Guide - Kisan Setu

## Overview
This guide explains how to integrate the Kisan Setu backend agricultural system with the mobile app.

## Created Components

### 1. `agricultureService.js`
**Location:** `frontend/src/services/agricultureService.js`

REST API service layer for backend communication.

**Methods:**
```javascript
// Health check
const health = await agricultureService.health();

// Get processed data
const data = await agricultureService.getData(limit=50, fetchWeather=false);

// Get statistics  
const stats = await agricultureService.getStats();

// Get location-specific decision
const decision = await agricultureService.getLocationDecision(
  latitude,    // 22.3193
  longitude,   // 73.1812
  soilMoisture // 0-1
);

// Get region summary
const regionData = await agricultureService.getRegionSummary(
  latMin,      // 22.0
  latMax,      // 22.5
  lonMin,      // 73.0
  lonMax       // 73.5
);

// Forecast soil moisture
const forecast = await agricultureService.forecastMoisture(
  soilMoisture,    // 0-1
  rainfallForecast,// mm
  days=3,          // default 3
  irrigation=true  // default true
);

// Get optimal irrigation schedule
const schedule = await agricultureService.getOptimalSchedule(
  soilMoisture,      // 0-1
  rainfallForecast,  // mm
  targetMoisture=0.18, // default
  days=5             // default 5
);
```

**Configuration:**
- Edit `API_BASE_URL` in the file to point to your backend:
  ```javascript
  const API_BASE_URL = 'http://your-server:5000';
  ```
- Or set environment variable: `REACT_APP_API_URL`

### 2. `useAgriculture.js`
**Location:** `frontend/src/features/detection/hooks/useAgriculture.js`

Custom React hook for managing agriculture data and API calls.

**Usage:**
```javascript
import useAgriculture from './hooks/useAgriculture';

function MyComponent() {
  const {
    // State
    data,
    stats,
    decision,
    forecast,
    schedule,
    loading,
    error,

    // Methods
    fetchData,
    fetchStats,
    getDecision,
    getRegionSummary,
    forecastMoisture,
    getOptimalSchedule,
    checkHealth,
    clearData,
  } = useAgriculture();

  // Get decision
  const handleGetRecommendation = async () => {
    try {
      const result = await getDecision(22.3193, 73.1812, 0.45);
      console.log(result.data);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <View>
      {loading && <ActivityIndicator />}
      {error && <Text>{error}</Text>}
      {decision && <Text>Decision: {decision.data.irrigation_decision}</Text>}
    </View>
  );
}
```

### 3. `SoilAnalysisScreen.jsx`
**Location:** `frontend/src/features/detection/SoilAnalysisScreen.jsx`

Complete UI for soil moisture analysis with:
- Parameter input (soil moisture, rainfall forecast, location)
- Real-time recommendations
- 7-day moisture forecasting
- Optimal irrigation scheduling
- Three tabbed views (Decision, Forecast, Schedule)

**Features:**
- Interactive sliders for soil moisture and rainfall
- Color-coded moisture levels (Red/Orange/Yellow/Green)
- Detailed irrigation recommendations
- Forecast charts with trend analysis
- Day-by-day irrigation schedule

## Integration Steps

### Step 1: Update Backend API URL
Edit `frontend/src/services/agricultureService.js`:
```javascript
const API_BASE_URL = 'http://192.168.1.100:5000'; // Your backend IP
// OR for production:
const API_BASE_URL = 'https://your-domain.com';
```

### Step 2: Add Route to Navigation
Update `frontend/src/app/AppNavigator.jsx`:

```javascript
import SoilAnalysisScreen from '../features/detection/SoilAnalysisScreen';

// In your stack navigator:
<Stack.Screen
  name="SoilAnalysis"
  component={SoilAnalysisScreen}
  options={{ title: 'Soil Analysis' }}
/>
```

### Step 3: Add Button to HomeScreen
Edit `frontend/src/features/home/HomeScreen.jsx`:

```javascript
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate('SoilAnalysis')}
        style={styles.soilAnalysisButton}
      >
        <Text>🌾 Soil Analysis</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Step 4: Test Connection
Create a test file: `frontend/src/features/detection/hooks/__tests__/useAgriculture.test.js`:

```javascript
import { renderHook, waitFor } from '@testing-library/react-native';
import useAgriculture from '../useAgriculture';

describe('useAgriculture', () => {
  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useAgriculture());

    const { checkHealth } = result.current;
    const health = await checkHealth();

    expect(health).toBe(true);
  });
});
```

## Backend API Response Format

### Decision Response
```json
{
  "status": "success",
  "data": {
    "latitude": 22.3193,
    "longitude": 73.1812,
    "soil_moisture": 0.45,
    "irrigation_decision": "Light",
    "resource_optimization": "Medium",
    "weather_summary": "Partly cloudy, 28°C",
    "next_action": "Water in 2-3 days if dry"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Forecast Response
```json
{
  "status": "success",
  "data": {
    "moisture_forecast": [0.43, 0.38, 0.35, 0.32, 0.30, 0.28, 0.35],
    "trend": "Decreasing",
    "critical_day": 5
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Schedule Response
```json
{
  "status": "success",
  "data": {
    "schedule": [
      { "day": 1, "irrigate": false, "expected_moisture": 0.43 },
      { "day": 2, "irrigate": false, "expected_moisture": 0.38 },
      { "day": 3, "irrigate": true, "expected_moisture": 0.45 },
      { "day": 4, "irrigate": false, "expected_moisture": 0.40 },
      { "day": 5, "irrigate": false, "expected_moisture": 0.35 }
    ],
    "optimization_result": "5 days optimal schedule calculated"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Testing the Integration

### 1. Start Backend Server
```bash
cd backend
python api_server.py
# Server runs on http://localhost:5000
```

### 2. Test API Endpoints
```bash
# Health check
curl http://localhost:5000/health

# Get decision
curl -X POST http://localhost:5000/api/location/decision \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 22.3193,
    "longitude": 73.1812,
    "soil_moisture": 0.45
  }'
```

### 3. Run Mobile App
```bash
cd frontend
npm start
# Or with Expo:
expo start
```

### 4. Test in Simulator/Device
1. Navigate to "Soil Analysis" screen
2. Adjust input parameters
3. Click "Get Decision"
4. Verify recommendation displays
5. Test "Forecast" and "Optimal Schedule" buttons

## Troubleshooting

### Connection Issues
- **Problem:** "Network request failed"
  - Solution: Check backend is running on correct IP/port
  - Solution: Ensure firewall allows connections
  - Solution: Check `API_BASE_URL` configuration

### Empty Results
- **Problem:** API returns empty data
  - Solution: Check H5 data file exists: `Reduced_SMAP_L4_SM_aup.h5`
  - Solution: Verify environment variables in `.env`
  - Solution: Check backend logs for errors

### CORS Errors
- **Problem:** "CORS policy: No 'Access-Control-Allow-Origin' header"
  - Solution: Backend is already configured with CORS
  - Solution: Restart backend server if added new routes

### Loading Never Completes
- **Problem:** Loading indicator spinning indefinitely
  - Solution: Check network connection
  - Solution: Verify API endpoint is responding
  - Solution: Check browser console for errors (if web version)

## Performance Optimization

### 1. Caching Recommendations
```javascript
// Cache decision results for 1 hour
const cache = new Map();
const CACHE_DURATION = 3600000;

async function getCachedDecision(lat, lon, moisture) {
  const key = `${lat},${lon},${moisture}`;
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.time < CACHE_DURATION) {
    return cached.data;
  }
  
  const result = await getDecision(lat, lon, moisture);
  cache.set(key, { data: result, time: Date.now() });
  return result;
}
```

### 2. Batch Requests
```javascript
// Get multiple locations at once
async function getBatchDecisions(locations) {
  const promises = locations.map(loc =>
    getDecision(loc.latitude, loc.longitude, loc.moisture)
  );
  return Promise.all(promises);
}
```

### 3. Offline Support
```javascript
// Store decisions offline with AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveDecisionOffline(key, decision) {
  await AsyncStorage.setItem(`decision_${key}`, JSON.stringify(decision));
}

async function getOfflineDecision(key) {
  const stored = await AsyncStorage.getItem(`decision_${key}`);
  return stored ? JSON.parse(stored) : null;
}
```

## Security Considerations

1. **Never hardcode API keys** - use environment variables
2. **Validate user inputs** - check moisture values 0-1
3. **Handle errors gracefully** - don't expose stack traces
4. **Implement rate limiting** - prevent API abuse
5. **Use HTTPS in production** - encrypt data in transit

## Next Steps

1. ✅ Backend API setup and running
2. ✅ Mobile components created
3. 🔄 Test in development environment
4. 🔄 Build APK/IPA for devices
5. 🔄 Gather user feedback
6. 🔄 Deploy to production
7. 🔄 Monitor performance and errors

## Support

For issues or questions:
1. Check backend logs: `python run_tests.py`
2. Check mobile app console: `expo logs`
3. Review error messages in response
4. Test API directly with curl/Postman

---

**Last Updated:** January 2024
**Version:** 1.0
**Maintained By:** Kisan Setu Team
