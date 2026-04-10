/**
 * SoilAnalysisScreen Component
 * Real-time soil moisture analysis and irrigation recommendations
 * Integrated with Kisan Setu backend
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useAgriculture from './hooks/useAgriculture';

const { width } = Dimensions.get('window');

const SoilAnalysisScreen = () => {
  const {
    getDecision,
    forecastMoisture,
    getOptimalSchedule,
    loading,
    error,
    decision,
    forecast,
    schedule,
  } = useAgriculture();

  const [soilMoisture, setSoilMoisture] = useState(0.45);
  const [latitude, setLatitude] = useState(22.3193);
  const [longitude, setLongitude] = useState(73.1812);
  const [rainfallForecast, setRainfallForecast] = useState(0);
  const [activeTab, setActiveTab] = useState('decision');
  const [recommendation, setRecommendation] = useState(null);

  /**
   * Fetch decision based on current location and moisture
   */
  const handleGetDecision = async () => {
    try {
      const result = await getDecision(latitude, longitude, soilMoisture);
      if (result && result.data) {
        setRecommendation(result.data);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to get recommendation');
    }
  };

  /**
   * Forecast soil moisture for next days
   */
  const handleForecast = async () => {
    try {
      await forecastMoisture(soilMoisture, rainfallForecast, 7, true);
    } catch (err) {
      Alert.alert('Error', 'Failed to forecast');
    }
  };

  /**
   * Get optimal irrigation schedule
   */
  const handleOptimalSchedule = async () => {
    try {
      await getOptimalSchedule(soilMoisture, rainfallForecast, 0.18, 7);
    } catch (err) {
      Alert.alert('Error', 'Failed to get schedule');
    }
  };

  /**
   * Get moisture color based on value
   */
  const getMoistureColor = (moisture) => {
    if (moisture < 0.15) return '#EF4444'; // Red - Critical
    if (moisture < 0.22) return '#F59E0B'; // Orange - Low
    if (moisture < 0.35) return '#EAB308'; // Yellow - Medium
    return '#10B981'; // Green - Good
  };

  /**
   * Get irrigation recommendation text
   */
  const getIrrigationText = (decision) => {
    if (!decision) return 'N/A';
    
    const irrigationLevel = decision.irrigation_decision;
    const translations = {
      'Urgent': 'Urgent - Water immediately',
      'Light': 'Light - Water if needed',
      'Skip': 'Skip - Sufficient moisture',
      'None': 'No action needed',
    };
    
    return translations[irrigationLevel] || irrigationLevel;
  };

  /**
   * Tab component
   */
  const renderTab = (tabName, tabLabel) => (
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === tabName && styles.activeTab,
      ]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === tabName && styles.activeTabText,
        ]}
      >
        {tabLabel}
      </Text>
    </TouchableOpacity>
  );

  /**
   * Input card component
   */
  const renderInputCard = (label, value, onChange, unit = '') => (
    <View style={styles.inputCard}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(0, value - 0.05))}
          style={styles.decreaseBtn}
        >
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>
        
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>
            {value.toFixed(2)} {unit}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => onChange(Math.min(1, value + 0.05))}
          style={styles.increaseBtn}
        >
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Recommendation card
   */
  const renderRecommendationCard = () => {
    if (!recommendation) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No recommendation yet. Click "Get Decision" to start.
          </Text>
        </View>
      );
    }

    const color = getMoistureColor(recommendation.soil_moisture);

    return (
      <LinearGradient
        colors={['#F0FDFA', '#D1FAE5']}
        style={styles.recommendationCard}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            Current Recommendation
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: color }]}>
            <Text style={styles.statusText}>
              {(recommendation.soil_moisture * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        <View style={styles.recommendationContent}>
          <View style={styles.recommendationRow}>
            <Text style={styles.label}>💧 Soil Moisture</Text>
            <Text style={[styles.value, { color }]}>
              {(recommendation.soil_moisture * 100).toFixed(1)}%
            </Text>
          </View>

          <View style={styles.recommendationRow}>
            <Text style={styles.label}>💧 Irrigation Action</Text>
            <Text style={styles.value}>
              {getIrrigationText(recommendation)}
            </Text>
          </View>

          {recommendation.resource_optimization && (
            <View style={styles.recommendationRow}>
              <Text style={styles.label}>⚡ Resource Level</Text>
              <Text style={styles.value}>
                {recommendation.resource_optimization}
              </Text>
            </View>
          )}

          {recommendation.weather_summary && (
            <View style={styles.recommendationRow}>
              <Text style={styles.label}>🌤️ Weather</Text>
              <Text style={styles.value}>
                {recommendation.weather_summary}
              </Text>
            </View>
          )}
        </View>

        {recommendation.next_action && (
          <View style={styles.actionBox}>
            <Text style={styles.actionLabel}>Next Action:</Text>
            <Text style={styles.actionText}>{recommendation.next_action}</Text>
          </View>
        )}
      </LinearGradient>
    );
  };

  /**
   * Forecast results
   */
  const renderForecast = () => {
    if (!forecast || !forecast.data) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No forecast yet. Click "Forecast" to generate.
          </Text>
        </View>
      );
    }

    const forecastData = forecast.data;

    return (
      <ScrollView style={styles.forecastContainer}>
        {forecastData.moisture_forecast?.map((value, index) => (
          <View key={index} style={styles.forecastRow}>
            <Text style={styles.forecastDay}>
              Day {index + 1}
            </Text>
            <View
              style={[
                styles.forecastBar,
                {
                  width: `${value * 100}%`,
                  backgroundColor: getMoistureColor(value),
                },
              ]}
            />
            <Text style={styles.forecastValue}>
              {(value * 100).toFixed(1)}%
            </Text>
          </View>
        ))}

        {forecastData.trend && (
          <View style={styles.trendBox}>
            <Text style={styles.trendLabel}>Trend:</Text>
            <Text style={styles.trendValue}>{forecastData.trend}</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  /**
   * Schedule results
   */
  const renderSchedule = () => {
    if (!schedule || !schedule.data) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No schedule yet. Click "Optimal Schedule" to generate.
          </Text>
        </View>
      );
    }

    const scheduleData = schedule.data;

    return (
      <ScrollView style={styles.scheduleContainer}>
        {scheduleData.schedule?.map((day, index) => (
          <View
            key={index}
            style={[
              styles.scheduleDay,
              day.irrigate && styles.scheduleDayIrrigate,
            ]}
          >
            <Text style={styles.scheduleLabel}>
              Day {index + 1}
            </Text>
            <Text style={styles.scheduleAction}>
              {day.irrigate ? '💧 Irrigate' : '✓ Skip'}
            </Text>
            {day.expected_moisture && (
              <Text style={styles.scheduleMoisture}>
                {(day.expected_moisture * 100).toFixed(0)}%
              </Text>
            )}
          </View>
        ))}

        {scheduleData.optimization_result && (
          <View style={styles.optimizationBox}>
            <Text style={styles.optimizationLabel}>
              Optimization Result:
            </Text>
            <Text style={styles.optimizationText}>
              {scheduleData.optimization_result}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <ScrollView style={styles.container} refreshControl={null}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          🌾 Soil Analysis & Recommendations
        </Text>
        <Text style={styles.headerSubtitle}>
          Powered by Kisan Setu AI
        </Text>
      </LinearGradient>

      {/* Input Parameters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Input Parameters
        </Text>

        {renderInputCard(
          'Soil Moisture (0-1)',
          soilMoisture,
          setSoilMoisture
        )}

        {renderInputCard(
          'Rainfall Forecast (mm)',
          rainfallForecast,
          setRainfallForecast
        )}

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Latitude</Text>
          <TouchableOpacity
            onPress={() => setLatitude(22.3193 + Math.random() * 0.5 - 0.25)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Current: {latitude.toFixed(4)}°</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Longitude</Text>
          <TouchableOpacity
            onPress={() => setLongitude(73.1812 + Math.random() * 0.5 - 0.25)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Current: {longitude.toFixed(4)}°</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleGetDecision}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>
              🎯 Get Decision
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleForecast}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#10B981" />
          ) : (
            <Text style={[styles.actionButtonText, { color: '#10B981' }]}>
              📊 Forecast
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.tertiaryButton]}
          onPress={handleOptimalSchedule}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#10B981" />
          ) : (
            <Text style={[styles.actionButtonText, { color: '#10B981' }]}>
              📅 Optimal Schedule
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {renderTab('decision', 'Decision')}
        {renderTab('forecast', 'Forecast')}
        {renderTab('schedule', 'Schedule')}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.section}>
        {activeTab === 'decision' && renderRecommendationCard()}
        {activeTab === 'forecast' && renderForecast()}
        {activeTab === 'schedule' && renderSchedule()}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is an AI-powered recommendation system. Always consider local conditions and expert advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  decreaseBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  increaseBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 24,
    color: '#374151',
    fontWeight: 'bold',
  },
  valueDisplay: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 100,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  buttonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: '#E0F2FE',
  },
  tertiaryButton: {
    backgroundColor: '#FEF3C7',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#10B981',
  },
  errorBox: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: '#7F1D1D',
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  recommendationCard: {
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recommendationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  label: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  actionBox: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#1F2937',
  },
  forecastContainer: {
    paddingHorizontal: 8,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  forecastDay: {
    width: 50,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  forecastBar: {
    height: 24,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  forecastValue: {
    width: 50,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  trendBox: {
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: '#F0FBF9',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    borderRadius: 8,
    padding: 12,
  },
  trendLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  scheduleContainer: {
    paddingHorizontal: 8,
  },
  scheduleDay: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#CBD5E1',
  },
  scheduleDayIrrigate: {
    borderLeftColor: '#10B981',
    backgroundColor: '#F0FBF9',
  },
  scheduleLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  scheduleAction: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scheduleMoisture: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  optimizationBox: {
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: '#F0FBF9',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    borderRadius: 8,
    padding: 12,
  },
  optimizationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  optimizationText: {
    fontSize: 14,
    color: '#1F2937',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default SoilAnalysisScreen;
