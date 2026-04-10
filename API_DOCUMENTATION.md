# Kisan Setu REST API Documentation

## Base URL
```
http://localhost:5000
OR
https://api.kisansetu.com (production)
```

## Authentication
Currently **no authentication required** for development.  
For production, implement API key validation.

## Response Format
All responses follow this structure:

```json
{
  "status": "success|error",
  "data": { /* response payload */ },
  "timestamp": "2024-01-15T10:30:00Z",
  "error": null
}
```

---

## Endpoints

### 1. Health Check
Check if API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**cURL:**
```bash
curl http://localhost:5000/health
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:5000/health');
const data = await response.json();
console.log(data.status); // "healthy"
```

---

### 2. Get Processed Data
Retrieve processed agricultural dataset with optional weather data.

**Endpoint:** `GET /api/data`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | int | 50 | Number of records to return |
| `fetch_weather` | bool | false | Include weather data |

**Response:**
```json
{
  "status": "success",
  "data": {
    "count": 50,
    "records": [
      {
        "latitude": 22.3193,
        "longitude": 73.1812,
        "soil_moisture": 0.45,
        "moisture_category": "Medium",
        "temperature": 28.5,
        "humidity": 65,
        "rainfall": 0,
        "wind_speed": 5.2
      },
      /* ... more records ... */
    ],
    "statistics": {
      "mean_moisture": 0.42,
      "min_moisture": 0.15,
      "max_moisture": 0.89,
      "std_moisture": 0.18
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**cURL:**
```bash
# Basic request
curl "http://localhost:5000/api/data"

# With weather data
curl "http://localhost:5000/api/data?limit=100&fetch_weather=true"
```

**JavaScript:**
```javascript
const response = await fetch(
  'http://localhost:5000/api/data?limit=50&fetch_weather=true'
);
const result = await response.json();
console.log(result.data.records);
```

---

### 3. Get Statistics
Get summary statistics for the dataset.

**Endpoint:** `GET /api/stats`

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_records": 1256,
    "moisture": {
      "mean": 0.42,
      "median": 0.40,
      "std": 0.18,
      "min": 0.05,
      "max": 0.95,
      "q25": 0.28,
      "q75": 0.58
    },
    "categories": {
      "Critical": 45,
      "Low": 156,
      "Medium": 428,
      "Good": 627
    },
    "geographic": {
      "locations": 89,
      "avg_latitude": 22.45,
      "avg_longitude": 73.25,
      "coverage_area": "45 sq km"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**cURL:**
```bash
curl http://localhost:5000/api/stats
```

**JavaScript:**
```javascript
const stats = await (
  await fetch('http://localhost:5000/api/stats')
).json();
console.log(stats.data.moisture.mean); // 0.42
```

---

### 4. Get Location Decision (⭐ Most Important)
Get irrigation decision and recommendations for a specific location.

**Endpoint:** `POST /api/location/decision`

**Request Body:**
```json
{
  "latitude": 22.3193,
  "longitude": 73.1812,
  "soil_moisture": 0.45
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "latitude": 22.3193,
    "longitude": 73.1812,
    "soil_moisture": 0.45,
    "moisture_category": "Medium",
    "irrigation_decision": "Light",
    "recommendation_confidence": 0.92,
    "resource_optimization": "Medium",
    "weather_summary": "Partly cloudy, 28°C, 12% chance rain",
    "next_action": "Water in 2-3 days if moisture drops below 0.25",
    "reasoning": {
      "moisture_level": "At safe operating level",
      "weather": "No significant rain expected",
      "forecast": "Decreasing trend",
      "resources": "Medium resource utilization recommended"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Irrigation Decisions:**
- `Urgent` - Water immediately (moisture < 0.15)
- `Light` - Water if needed (moisture 0.15-0.22)
- `Skip` - Sufficient moisture (moisture > 0.22, rainfall > 5mm)
- `None` - No action needed (moisture > 0.22)

**cURL:**
```bash
curl -X POST http://localhost:5000/api/location/decision \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 22.3193,
    "longitude": 73.1812,
    "soil_moisture": 0.45
  }'
```

**JavaScript:**
```javascript
const decision = await fetch(
  'http://localhost:5000/api/location/decision',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude: 22.3193,
      longitude: 73.1812,
      soil_moisture: 0.45
    })
  }
).then(r => r.json());

console.log(decision.data.irrigation_decision); // "Light"
console.log(decision.data.next_action); // "Water in 2-3 days..."
```

---

### 5. Get Region Summary
Get recommendations for a geographic region.

**Endpoint:** `POST /api/region/summary`

**Request Body:**
```json
{
  "lat_min": 22.0,
  "lat_max": 22.5,
  "lon_min": 73.0,
  "lon_max": 73.5
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "region": {
      "lat_min": 22.0,
      "lat_max": 22.5,
      "lon_min": 73.0,
      "lon_max": 73.5
    },
    "locations_count": 42,
    "urgent_irrigation": 3,
    "light_irrigation": 12,
    "skip_irrigation": 15,
    "no_action": 12,
    "avg_moisture": 0.41,
    "critical_areas": [
      {
        "latitude": 22.15,
        "longitude": 73.22,
        "moisture": 0.08,
        "action": "Urgent"
      }
    ],
    "recommendations": [
      "Prioritize irrigation in 3 critical areas",
      "Average region moisture is stable",
      "Monitor 12 locations for upcoming irrigation"
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/region/summary \
  -H "Content-Type: application/json" \
  -d '{
    "lat_min": 22.0,
    "lat_max": 22.5,
    "lon_min": 73.0,
    "lon_max": 73.5
  }'
```

---

### 6. Forecast Soil Moisture
Predict soil moisture for next N days with optional irrigation.

**Endpoint:** `POST /api/simulation/forecast`

**Request Body:**
```json
{
  "soil_moisture": 0.45,
  "rainfall_forecast": 0,
  "days": 7,
  "irrigation": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_moisture": 0.45,
    "moisture_forecast": [
      0.43,
      0.38,
      0.32,
      0.28,
      0.25,
      0.23,
      0.22
    ],
    "forecast_days": 7,
    "critical_day": 5,
    "critical_moisture": 0.25,
    "trend": "Decreasing",
    "has_rainfall": false,
    "irrigation_scheduled": true,
    "daily_details": [
      {
        "day": 1,
        "moisture": 0.43,
        "evaporation": 0.02,
        "irrigation": 0,
        "status": "Good"
      },
      {
        "day": 2,
        "moisture": 0.38,
        "evaporation": 0.05,
        "irrigation": 0,
        "status": "Good"
      }
      /* ... more days ... */
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Parameters:**
| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `soil_moisture` | float | 0-1 | Current moisture level |
| `rainfall_forecast` | float | ≥0 | Expected rainfall in mm |
| `days` | int | 1-30 | Forecast duration |
| `irrigation` | bool | - | Apply irrigation daily |

**cURL:**
```bash
curl -X POST http://localhost:5000/api/simulation/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "soil_moisture": 0.45,
    "rainfall_forecast": 10,
    "days": 7,
    "irrigation": true
  }'
```

---

### 7. Get Optimal Irrigation Schedule (⭐)
Calculate the best irrigation days to maintain target moisture.

**Endpoint:** `POST /api/simulation/optimal-schedule`

**Request Body:**
```json
{
  "soil_moisture": 0.45,
  "rainfall_forecast": 0,
  "target_moisture": 0.18,
  "days": 7
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_moisture": 0.45,
    "target_moisture": 0.18,
    "schedule": [
      {
        "day": 1,
        "irrigate": false,
        "expected_moisture": 0.43,
        "reasoning": "Moisture above minimum"
      },
      {
        "day": 2,
        "irrigate": false,
        "expected_moisture": 0.38,
        "reasoning": "Moisture still adequate"
      },
      {
        "day": 3,
        "irrigate": true,
        "expected_moisture": 0.45,
        "reasoning": "Prevent moisture from dropping below target"
      },
      {
        "day": 4,
        "irrigate": false,
        "expected_moisture": 0.43,
        "reasoning": "Post-irrigation margin"
      },
      {
        "day": 5,
        "irrigate": false,
        "expected_moisture": 0.38,
        "reasoning": "Remaining safely above target"
      },
      {
        "day": 6,
        "irrigate": false,
        "expected_moisture": 0.33,
        "reasoning": "Still above minimum"
      },
      {
        "day": 7,
        "irrigate": true,
        "expected_moisture": 0.45,
        "reasoning": "Restore to safe level"
      }
    ],
    "total_irrigations": 2,
    "water_efficiency": 0.87,
    "optimization_result": "7-day optimal schedule with 2 irrigation days maintains target moisture while minimizing water usage"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/simulation/optimal-schedule \
  -H "Content-Type: application/json" \
  -d '{
    "soil_moisture": 0.45,
    "rainfall_forecast": 0,
    "target_moisture": 0.18,
    "days": 7
  }'
```

**JavaScript:**
```javascript
const schedule = await fetch(
  'http://localhost:5000/api/simulation/optimal-schedule',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      soil_moisture: 0.45,
      rainfall_forecast: 0,
      target_moisture: 0.18,
      days: 7
    })
  }
).then(r => r.json());

const waterDays = schedule.data.schedule.filter(d => d.irrigate);
console.log(`Irrigation needed on days: ${waterDays.map(d => d.day).join(', ')}`);
```

---

## Error Responses

### 400 Bad Request
**When:** Invalid input parameters

```json
{
  "status": "error",
  "error": "Invalid soil_moisture: must be between 0 and 1",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 404 Not Found
**When:** Endpoint doesn't exist

```json
{
  "status": "error",
  "error": "Endpoint not found",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 500 Internal Server Error
**When:** Server error (check logs)

```json
{
  "status": "error",
  "error": "Internal server error: Check server logs",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## SDK/Client Libraries

### JavaScript (Fetch API)
See `frontend/src/services/agricultureService.js`

### React Hook
See `frontend/src/features/detection/hooks/useAgriculture.js`

### Python
```python
import requests

BASE_URL = 'http://localhost:5000'

# Get decision
response = requests.post(
    f'{BASE_URL}/api/location/decision',
    json={
        'latitude': 22.3193,
        'longitude': 73.1812,
        'soil_moisture': 0.45
    }
)
decision = response.json()
print(decision['data']['irrigation_decision'])
```

---

## Rate Limiting
Currently **disabled** for development.  
Production should implement:
- 100 requests/minute per IP
- 1000 requests/hour per API key

---

## CORS
Cross-Origin Resource Sharing is **enabled** for:
- `http://localhost:*`
- `http://192.168.*`
- `http://127.0.0.1:*`

For production, update `api_server.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"]
    }
})
```

---

## Pagination
Not currently implemented (use `limit` parameter).

For future pagination:
```bash
GET /api/data?limit=50&offset=100
```

---

## Versioning
Current API Version: **v1.0**

Future versions will use:
```
/api/v2/location/decision
/api/v2/simulation/forecast
```

---

## Webhooks
Future feature for push notifications.

---

## Examples

### Example 1: Mobile App Integration
```javascript
// Get recommendation for current farm
const decision = await fetch('/api/location/decision', {
  method: 'POST',
  body: JSON.stringify({
    latitude: 22.3193,
    longitude: 73.1812,
    soil_moisture: 0.45
  })
}).then(r => r.json());

if (decision.data.irrigation_decision === 'Urgent') {
  // Show alert to farmer
  alert('Irrigate immediately!');
} else {
  // Show next action
  console.log(decision.data.next_action);
}
```

### Example 2: Weekly Schedule
```javascript
// Get optimal schedule for the week
const schedule = await fetch('/api/simulation/optimal-schedule', {
  method: 'POST',
  body: JSON.stringify({
    soil_moisture: 0.45,
    rainfall_forecast: 0,
    target_moisture: 0.18,
    days: 7
  })
}).then(r => r.json());

// Display to farmer
schedule.data.schedule.forEach(day => {
  console.log(
    `Day ${day.day}: ${day.irrigate ? '💧 Water' : '✓ Skip'}`
  );
});
```

### Example 3: Region Monitoring
```javascript
// Check all fields in a region
const regionData = await fetch('/api/region/summary', {
  method: 'POST',
  body: JSON.stringify({
    lat_min: 22.0,
    lat_max: 22.5,
    lon_min: 73.0,
    lon_max: 73.5
  })
}).then(r => r.json());

console.log(
  `${regionData.data.urgent_irrigation} fields need urgent watering`
);
```

---

## Debugging

### Enable API Logging
```python
# In api_server.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Test with Postman
1. Import `api_schema.json` (if available) or create manually
2. Set Base URL: `http://localhost:5000`
3. Create request in each endpoint
4. Send and view response

### Test with cURL
All examples in this documentation use cURL.

---

**API Version:** 1.0  
**Last Updated:** January 2024  
**Status:** Production Ready  

For issues, check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#-common-issues--solutions)
