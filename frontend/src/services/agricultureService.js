/**
 * Agriculture Service
 * Handles all API calls to the Kisan Setu backend
 */

import { API_URL } from '../core/config';

// Deriving the Soil Moisture API URL from the main API_URL
// This ensures connectivity on physical devices/emulators
const API_BASE_URL = API_URL ? API_URL.replace(':3000', ':5001') : 'http://localhost:5001';

const agricultureService = {
  /**
   * Get health status of the API
   */
  health: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  },

  /**
   * Get processed agricultural data
   * @param {number} limit - Number of records to fetch (default: 50)
   * @param {boolean} fetchWeather - Whether to fetch real weather data (default: false)
   */
  getData: async (limit = 50, fetchWeather = false) => {
    try {
      const url = `${API_BASE_URL}/api/data?limit=${limit}&fetch_weather=${fetchWeather}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  /**
   * Get statistics for processed data
   */
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  /**
   * Get irrigation decision for a specific location
   * @param {number} latitude - Location latitude
   * @param {number} longitude - Location longitude
   * @param {number} soilMoisture - Soil moisture value (0-1)
   */
  getLocationDecision: async (latitude, longitude, soilMoisture) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          soil_moisture: soilMoisture,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting location decision:', error);
      throw error;
    }
  },

  /**
   * Get summary for a geographic region
   * @param {number} latMin - Minimum latitude
   * @param {number} latMax - Maximum latitude
   * @param {number} lonMin - Minimum longitude
   * @param {number} lonMax - Maximum longitude
   */
  getRegionSummary: async (latMin, latMax, lonMin, lonMax) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/region/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat_min: latMin,
          lat_max: latMax,
          lon_min: lonMin,
          lon_max: lonMax,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting region summary:', error);
      throw error;
    }
  },

  /**
   * Forecast future soil moisture
   * @param {number} soilMoisture - Current soil moisture (0-1)
   * @param {number} rainfallForecast - Expected rainfall in mm
   * @param {number} days - Number of days to forecast (default: 3)
   * @param {boolean} irrigation - Whether to apply irrigation (default: true)
   */
  forecastMoisture: async (soilMoisture, rainfallForecast, days = 3, irrigation = true) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/simulation/forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soil_moisture: soilMoisture,
          rainfall_forecast: rainfallForecast,
          days,
          irrigation,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error forecasting moisture:', error);
      throw error;
    }
  },

  /**
   * Find optimal irrigation schedule
   * @param {number} soilMoisture - Current soil moisture (0-1)
   * @param {number} rainfallForecast - Expected rainfall in mm
   * @param {number} targetMoisture - Target moisture level (default: 0.18)
   * @param {number} days - Number of days to plan (default: 5)
   */
  getOptimalSchedule: async (soilMoisture, rainfallForecast, targetMoisture = 0.18, days = 5) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/simulation/optimal-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soil_moisture: soilMoisture,
          rainfall_forecast: rainfallForecast,
          target_moisture: targetMoisture,
          days,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting optimal schedule:', error);
      throw error;
    }
  },
};

export default agricultureService;
