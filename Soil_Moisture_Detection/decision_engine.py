"""
Decision Engine Module
Provides irrigation and farming decisions based on soil moisture and weather data
"""

from typing import Dict, Any
from enum import Enum

class IrrigationDecision(Enum):
    """Irrigation recommendation levels"""
    SKIP = "🌧️ Skip Irrigation"
    URGENT = "🚨 Irrigation Needed"
    LIGHT = "⚖️ Light Irrigation"
    NONE = "✅ No Irrigation"

class ResourceOptimization:
    """Resource optimization levels"""
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class DecisionEngine:
    """Main decision engine for agricultural recommendations"""
    
    @staticmethod
    def irrigation_decision(moisture: float, rain: float) -> Dict[str, Any]:
        """
        Determine irrigation decision based on moisture and rainfall
        
        Args:
            moisture: Normalized soil moisture (0-1)
            rain: Expected rainfall in next 24h (mm)
            
        Returns:
            Decision dictionary with recommendation and details
        """
        # If rain is expected, skip irrigation
        if rain > 5:
            return {
                'decision': IrrigationDecision.SKIP.value,
                'confidence': 0.95,
                'reason': f'Expected {rain:.1f}mm rainfall in next 24 hours',
                'water_savings': 'High'
            }
        
        # If soil is dry, irrigation needed urgently
        if moisture < 0.15:
            return {
                'decision': IrrigationDecision.URGENT.value,
                'confidence': 0.98,
                'reason': 'Soil moisture critically low - immediate irrigation required',
                'estimated_water_needed': '30-40 mm'
            }
        
        # If soil is moderately dry, light irrigation
        if moisture < 0.22:
            return {
                'decision': IrrigationDecision.LIGHT.value,
                'confidence': 0.90,
                'reason': 'Soil moisture moderate - light irrigation recommended',
                'estimated_water_needed': '10-15 mm'
            }
        
        # Soil has sufficient moisture
        return {
            'decision': IrrigationDecision.NONE.value,
            'confidence': 0.99,
            'reason': 'Soil moisture sufficient - no irrigation needed',
            'water_savings': 'Full'
        }
    
    @staticmethod
    def resource_optimization(moisture: float) -> Dict[str, Any]:
        """
        Optimize resource usage based on soil moisture
        
        Args:
            moisture: Normalized soil moisture (0-1)
            
        Returns:
            Optimization recommendations dictionary
        """
        if moisture < 0.15:
            # Dry soil - high water demand
            return {
                'water_usage': str(ResourceOptimization.HIGH),
                'water_recommendation': 'Increase irrigation frequency and quantity',
                'fertilizer': 'Normal (moisture affects nutrient uptake)',
                'fertilizer_advice': 'Consider water-soluble fertilizers for better absorption',
                'energy_optimization': 'Use premium (higher pressure) sprinklers',
                'energy_tip': 'Irrigate during cooler hours to reduce evaporation loss',
                'crop_stress_level': 'High - monitor closely'
            }
        
        elif moisture < 0.22:
            # Moderate moisture - optimal conditions
            return {
                'water_usage': str(ResourceOptimization.MEDIUM),
                'water_recommendation': 'Maintain current irrigation schedule',
                'fertilizer': 'Optimal (maximum nutrient uptake)',
                'fertilizer_advice': 'Apply balanced NPK fertilizer as per crop schedule',
                'energy_optimization': 'Standard irrigation pressure sufficient',
                'energy_tip': 'Use drip irrigation for maximum efficiency',
                'crop_stress_level': 'Low - ideal growing conditions'
            }
        
        else:
            # Wet soil - low water demand
            return {
                'water_usage': str(ResourceOptimization.LOW),
                'water_recommendation': 'Reduce irrigation - risk of waterlogging',
                'fertilizer': 'Reduced (risk of nutrient leaching)',
                'fertilizer_advice': 'Apply slow-release fertilizers - reduce frequency',
                'energy_optimization': 'Minimal - avoid unnecessary irrigation',
                'energy_tip': 'Focus on drainage and aeration',
                'crop_stress_level': 'Medium - monitor for diseases and root rot'
            }
    
    @staticmethod
    def get_combined_recommendation(moisture: float, rain: float) -> Dict[str, Any]:
        """
        Get combined irrigation and resource optimization recommendations
        
        Args:
            moisture: Normalized soil moisture (0-1)
            rain: Expected rainfall in next 24h (mm)
            
        Returns:
            Combined recommendation dictionary
        """
        irrigation = DecisionEngine.irrigation_decision(moisture, rain)
        resources = DecisionEngine.resource_optimization(moisture)
        
        return {
            'irrigation': irrigation,
            'resources': resources,
            'moisture_level': moisture,
            'rainfall_forecast': rain,
            'priority': 'HIGH' if 'Urgent' in irrigation['decision'] else 'NORMAL'
        }
