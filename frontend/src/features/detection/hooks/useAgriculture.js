/**
 * useAgriculture Hook
 * Custom React hook for managing agriculture data and decisions
 */

import { useState, useCallback, useEffect } from 'react';
import agricultureService from '../services/agricultureService';

export const useAgriculture = () => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [decision, setDecision] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch processed agricultural data
   */
  const fetchData = useCallback(async (limit = 50, fetchWeather = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agricultureService.getData(limit, fetchWeather);
      setData(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch data';
      setError(errorMsg);
      console.error('Fetch data error:', errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch statistics
   */
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agricultureService.getStats();
      setStats(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch statistics';
      setError(errorMsg);
      console.error('Fetch stats error:', errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get decision for a location
   */
  const getDecision = useCallback(async (latitude, longitude, soilMoisture) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agricultureService.getLocationDecision(
        latitude,
        longitude,
        soilMoisture
      );
      setDecision(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to get decision';
      setError(errorMsg);
      console.error('Get decision error:', errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get region summary
   */
  const getRegionSummary = useCallback(async (latMin, latMax, lonMin, lonMax) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agricultureService.getRegionSummary(
        latMin,
        latMax,
        lonMin,
        lonMax
      );
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to get region summary';
      setError(errorMsg);
      console.error('Get region summary error:', errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Forecast soil moisture
   */
  const forecastMoisture = useCallback(async (soilMoisture, rainfallForecast, days = 3, irrigation = true) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agricultureService.forecastMoisture(
        soilMoisture,
        rainfallForecast,
        days,
        irrigation
      );
      setForecast(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to forecast moisture';
      setError(errorMsg);
      console.error('Forecast moisture error:', errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get optimal irrigation schedule
   */
  const getOptimalSchedule = useCallback(async (soilMoisture, rainfallForecast, targetMoisture = 0.18, days = 5) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agricultureService.getOptimalSchedule(
        soilMoisture,
        rainfallForecast,
        targetMoisture,
        days
      );
      setSchedule(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to get optimal schedule';
      setError(errorMsg);
      console.error('Get optimal schedule error:', errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear all data
   */
  const clearData = useCallback(() => {
    setData(null);
    setStats(null);
    setDecision(null);
    setForecast(null);
    setSchedule(null);
    setError(null);
  }, []);

  /**
   * Check API health
   */
  const checkHealth = useCallback(async () => {
    try {
      const result = await agricultureService.health();
      return result?.status === 'healthy';
    } catch (err) {
      console.error('Health check failed:', err);
      return false;
    }
  }, []);

  return {
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
  };
};

export default useAgriculture;
