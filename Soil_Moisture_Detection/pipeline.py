"""
Main Pipeline Module
Orchestrates the complete data processing workflow
"""

import pandas as pd
import logging
from typing import Optional, List
from data_processor import DataProcessor
from weather_service import WeatherService
from decision_engine import DecisionEngine
from simulation_engine import SimulationEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgriculturalPipeline:
    """Main pipeline for complete agricultural decision system"""
    
    def __init__(self, model_file: str = 'Reduced_SMAP_L4_SM_aup.h5',
                 api_key: Optional[str] = None):
        """
        Initialize the pipeline
        
        Args:
            model_file: Path to the HDF5 model file
            api_key: OpenWeatherMap API key
        """
        self.data_processor = DataProcessor(model_file)
        self.weather_service = WeatherService(api_key) if api_key else WeatherService()
        self.decision_engine = DecisionEngine()
        self.simulation_engine = SimulationEngine()
        self.processed_df = None
    
    def run_full_pipeline(self, limit: Optional[int] = None, 
                         fetch_weather: bool = False,
                         include_simulation: bool = True) -> pd.DataFrame:
        """
        Run complete pipeline
        
        Args:
            limit: Limit number of rows
            fetch_weather: Whether to fetch real weather data (requires API key)
            include_simulation: Whether to include moisture simulations
            
        Returns:
            Processed DataFrame with all columns
        """
        logger.info("Starting agricultural pipeline...")
        
        # Step 1: Load and preprocess data
        logger.info("Step 1: Loading and preprocessing data...")
        self.processed_df = self.data_processor.get_processed_data(limit=limit)
        logger.info(f"Loaded {len(self.processed_df)} records")
        
        # Step 2: Fetch weather data (if enabled)
        if fetch_weather:
            logger.info("Step 2: Fetching weather data...")
            try:
                self.processed_df = self.weather_service.fetch_for_dataframe(
                    self.processed_df.head(100)  # Limit to avoid rate limits
                )
                logger.info("Weather data fetched successfully")
            except Exception as e:
                logger.warning(f"Weather fetch failed, using defaults: {e}")
                self.processed_df['Rain'] = 0.0
        else:
            # Use default rain value
            self.processed_df['Rain'] = 0.0
        
        # Step 3: Apply decision engine
        logger.info("Step 3: Applying decision engine...")
        decisions = []
        for idx, row in self.processed_df.iterrows():
            decision = self.decision_engine.get_combined_recommendation(
                row['Soil_Moisture'],
                row['Rain']
            )
            decisions.append(decision)
        
        # Extract decision components
        self.processed_df['Decision'] = [d['irrigation']['decision'] for d in decisions]
        self.processed_df['Confidence'] = [d['irrigation']['confidence'] for d in decisions]
        self.processed_df['Water_Usage'] = [d['resources']['water_usage'] for d in decisions]
        self.processed_df['Fertilizer'] = [d['resources']['fertilizer'] for d in decisions]
        self.processed_df['Energy'] = [d['resources']['energy_optimization'] for d in decisions]
        self.processed_df['Priority'] = [d['priority'] for d in decisions]
        
        # Step 4: Simulate future moisture (if enabled)
        if include_simulation:
            logger.info("Step 4: Simulating future soil moisture...")
            future_moistures = []
            
            for idx, row in self.processed_df.iterrows():
                simulation = self.simulation_engine.simulate_moisture(
                    row['Soil_Moisture'],
                    row['Rain'],
                    days=3
                )
                # Store as string representation for DataFrame
                future_moistures.append(
                    f"[{', '.join([f'{m:.3f}' for m in simulation])}]"
                )
            
            self.processed_df['Future_Moisture'] = future_moistures
        
        # Step 5: Add statistics columns
        logger.info("Step 5: Computing statistics...")
        stats = self.data_processor.get_statistics()
        self.processed_df['Stats'] = str(stats)
        
        logger.info("Pipeline completed successfully!")
        return self.processed_df
    
    def process_single_location(self, latitude: float, longitude: float,
                               soil_moisture: float) -> dict:
        """
        Process a single location for decision making
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            soil_moisture: Soil moisture value (0-1)
            
        Returns:
            Decision and recommendations dictionary
        """
        # Fetch weather
        weather = self.weather_service.get_weather_summary(latitude, longitude)
        rain = weather.get('rainfall_24h', 0)
        
        # Get irrigation decision
        decision = self.decision_engine.get_combined_recommendation(soil_moisture, rain)
        
        # Simulate future
        simulation = self.simulation_engine.simulate_moisture(soil_moisture, rain, days=3)
        trend = self.simulation_engine.get_trend(simulation)
        
        return {
            'location': {'latitude': latitude, 'longitude': longitude},
            'soil_moisture': soil_moisture,
            'weather': weather,
            'decision': decision,
            'simulation': {
                'predictions': simulation,
                'trend': trend
            }
        }
    
    def get_summary_report(self) -> dict:
        """Get summary report of processed data"""
        if self.processed_df is None:
            raise ValueError("Run pipeline first")
        
        return {
            'total_records': len(self.processed_df),
            'statistics': self.data_processor.get_statistics(),
            'urgent_count': (self.processed_df['Decision'].str.contains('Urgent')).sum(),
            'light_count': (self.processed_df['Decision'].str.contains('Light')).sum(),
            'skip_count': (self.processed_df['Decision'].str.contains('Skip')).sum(),
            'none_count': (self.processed_df['Decision'].str.contains('No Irrigation')).sum(),
            'average_confidence': self.processed_df['Confidence'].mean()
        }
    
    def export_results(self, filepath: str = 'processed_agricultural_data.csv'):
        """Export processed results to CSV"""
        if self.processed_df is None:
            raise ValueError("Run pipeline first")
        
        self.processed_df.to_csv(filepath, index=False)
        logger.info(f"Results exported to {filepath}")
