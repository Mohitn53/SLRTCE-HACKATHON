"""
Simulation Engine Module
Predicts future soil moisture conditions based on current state and weather
"""

import numpy as np
from typing import List, Tuple, Dict, Any
from config import SIMULATION_PARAMS

class SimulationEngine:
    """Simulates future soil moisture changes"""
    
    def __init__(self, irrigation_rate: float = SIMULATION_PARAMS['irrigation_rate'],
                 evaporation_rate: float = SIMULATION_PARAMS['evaporation_rate']):
        """
        Initialize simulation engine
        
        Args:
            irrigation_rate: Daily irrigation amount (normalized 0-1)
            evaporation_rate: Daily evaporation amount (normalized 0-1)
        """
        self.irrigation_rate = irrigation_rate
        self.evaporation_rate = evaporation_rate
    
    def simulate_moisture(self, current_moisture: float, rain: float, 
                         days: int = 3, irrigation: bool = True) -> List[float]:
        """
        Simulate soil moisture for future days
        
        Formula:
        M(t+1) = M(t) + irrigation - evaporation + rain_normalized
        
        Args:
            current_moisture: Current soil moisture (0-1)
            rain: Total rainfall expected (mm, normalized to 0-1 scale)
            days: Number of days to simulate
            irrigation: Whether to apply irrigation (assumed irrigation_rate)
            
        Returns:
            List of predicted moisture values for each day
        """
        predictions = [current_moisture]
        moisture = current_moisture
        
        # Normalize rainfall (assuming average rain of 100mm = 1.0)
        rain_normalized = min(rain / 100.0, 1.0)
        
        for day in range(days):
            # Calculate change
            irrigation_factor = self.irrigation_rate if irrigation else 0
            change = irrigation_factor - self.evaporation_rate + rain_normalized
            
            # Update moisture
            moisture = moisture + change
            
            # Clamp between 0 and 1
            moisture = np.clip(moisture, 0, 1)
            
            predictions.append(moisture)
        
        return predictions
    
    def simulate_with_intervention(self, current_moisture: float, rain: float,
                                   days: int = 3, 
                                   irrigation_schedule: List[bool] = None) -> Dict[str, Any]:
        """
        Simulate with custom irrigation schedule
        
        Args:
            current_moisture: Current soil moisture (0-1)
            rain: Expected rainfall (mm)
            days: Number of days to simulate
            irrigation_schedule: List of bool for irrigation on each day
            
        Returns:
            Detailed simulation results
        """
        if irrigation_schedule is None:
            irrigation_schedule = [True] * days
        
        results = {
            'initial_moisture': current_moisture,
            'rainfall_forecast': rain,
            'days': days,
            'predictions': [],
            'irrigation_schedule': irrigation_schedule,
            'daily_changes': []
        }
        
        moisture = current_moisture
        rain_normalized = min(rain / 100.0, 1.0)
        
        for day in range(days):
            irrigation_factor = self.irrigation_rate if irrigation_schedule[day] else 0
            change = irrigation_factor - self.evaporation_rate + rain_normalized
            
            moisture_new = np.clip(moisture + change, 0, 1)
            
            results['predictions'].append(moisture_new)
            results['daily_changes'].append({
                'day': day + 1,
                'irrigation': irrigation_schedule[day],
                'moisture_start': moisture,
                'moisture_end': moisture_new,
                'change': moisture_new - moisture
            })
            
            moisture = moisture_new
        
        return results
    
    def find_optimal_irrigation_schedule(self, current_moisture: float, rain: float,
                                        target_moisture: float = 0.18,
                                        days: int = 5) -> Dict[str, Any]:
        """
        Find optimal irrigation schedule to reach target moisture
        
        Args:
            current_moisture: Current soil moisture (0-1)
            rain: Expected rainfall (mm)
            target_moisture: Target moisture level to maintain
            days: Number of days to plan
            
        Returns:
            Optimal irrigation schedule and results
        """
        rain_normalized = min(rain / 100.0, 1.0)
        
        # Try different schedules and find best one
        best_schedule = None
        best_variance = float('inf')
        all_results = []
        
        # Generate all possible schedules (2^days combinations)
        for schedule_num in range(2 ** days):
            schedule = []
            for day in range(days):
                schedule.append(bool((schedule_num >> day) & 1))
            
            # Simulate with this schedule
            result = self.simulate_with_intervention(current_moisture, rain, days, schedule)
            
            # Calculate variance from target
            moisture_values = result['predictions']
            variance = sum((m - target_moisture) ** 2 for m in moisture_values)
            
            result['variance_from_target'] = variance
            result['avg_moisture'] = np.mean(moisture_values)
            result['days_irrigated'] = sum(schedule)
            result['water_savings'] = (days - sum(schedule)) / days * 100
            
            all_results.append(result)
            
            # Update best if this is better
            if variance < best_variance:
                best_variance = variance
                best_schedule = result
        
        return {
            'best_schedule': best_schedule,
            'all_options': sorted(all_results, key=lambda x: x['variance_from_target'])[:5]
        }
    
    def batch_simulate(self, moisture_list: List[float], rain: float, 
                      days: int = 3) -> List[List[float]]:
        """
        Simulate for multiple moisture values
        
        Args:
            moisture_list: List of soil moisture values
            rain: Expected rainfall (mm)
            days: Days to simulate
            
        Returns:
            List of prediction lists
        """
        return [self.simulate_moisture(m, rain, days) for m in moisture_list]
    
    def get_trend(self, predictions: List[float]) -> str:
        """
        Determine moisture trend
        
        Args:
            predictions: List of predicted moisture values
            
        Returns:
            Trend description
        """
        if len(predictions) < 2:
            return "Insufficient data"
        
        start = predictions[0]
        end = predictions[-1]
        change = end - start
        
        if change > 0.05:
            return "📈 Increasing (Moisture building up)"
        elif change < -0.05:
            return "📉 Decreasing (Moisture depleting)"
        else:
            return "➡️ Stable (Moisture maintaining)"
