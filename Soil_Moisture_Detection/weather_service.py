"""
Weather Service Module
Integrates with OpenWeatherMap API to fetch weather data
"""

import requests
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from config import OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WeatherService:
    """Service for fetching and processing weather data"""
    
    def __init__(self, api_key: str = OPENWEATHER_API_KEY):
        self.api_key = api_key or 'demo_key_no_api'
        self.base_url = OPENWEATHER_BASE_URL
        self.cache = {}
    
    def get_forecast(self, latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
        """
        Fetch weather forecast from OpenWeatherMap
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            Weather data dictionary or None if request fails
        """
        # Check cache
        cache_key = f"{latitude}_{longitude}"
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # If using demo key, return None to use default values
        if 'demo_key' in self.api_key or not self.api_key or self.api_key == 'your_api_key_here':
            logger.warning(f"No valid API key configured, using default rainfall value")
            return None
        
        try:
            params = {
                'lat': latitude,
                'lon': longitude,
                'appid': self.api_key,
                'units': 'metric'
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            self.cache[cache_key] = data
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching weather data: {e}")
            return None
    
    def extract_rainfall_24h(self, forecast_data: Optional[Dict]) -> float:
        """
        Extract total rainfall (mm) for next 24 hours
        
        Args:
            forecast_data: Weather forecast data from API
            
        Returns:
            Total rainfall in mm
        """
        if not forecast_data or 'list' not in forecast_data:
            logger.warning("Invalid forecast data structure")
            return 0.0
        
        total_rain = 0.0
        
        try:
            # Get next 8 forecast points (3-hour intervals = 24 hours)
            for forecast in forecast_data['list'][:8]:
                if 'rain' in forecast:
                    # Rain data in '1h' is in mm
                    total_rain += forecast['rain'].get('1h', 0)
        except (KeyError, TypeError) as e:
            logger.error(f"Error extracting rainfall data: {e}")
        
        return total_rain
    
    def get_weather_summary(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Get comprehensive weather summary
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            Weather summary dictionary
        """
        forecast_data = self.get_forecast(latitude, longitude)
        
        summary = {
            'latitude': latitude,
            'longitude': longitude,
            'rainfall_24h': 0.0,
            'temperature_avg': 0.0,
            'humidity_avg': 0.0,
            'wind_speed_avg': 0.0,
            'timestamp': datetime.now().isoformat()
        }
        
        if not forecast_data:
            logger.warning(f"No forecast data for {latitude}, {longitude}")
            return summary
        
        try:
            # Extract rainfall
            summary['rainfall_24h'] = self.extract_rainfall_24h(forecast_data)
            
            # Extract other metrics
            temps = []
            humidities = []
            wind_speeds = []
            
            for forecast in forecast_data['list'][:8]:
                if 'main' in forecast:
                    temps.append(forecast['main'].get('temp', 0))
                    humidities.append(forecast['main'].get('humidity', 0))
                
                if 'wind' in forecast:
                    wind_speeds.append(forecast['wind'].get('speed', 0))
            
            if temps:
                summary['temperature_avg'] = sum(temps) / len(temps)
            if humidities:
                summary['humidity_avg'] = sum(humidities) / len(humidities)
            if wind_speeds:
                summary['wind_speed_avg'] = sum(wind_speeds) / len(wind_speeds)
                
        except (KeyError, TypeError) as e:
            logger.error(f"Error processing weather summary: {e}")
        
        return summary
    
    def fetch_for_dataframe(self, df: 'pd.DataFrame', batch_size: int = 10) -> 'pd.DataFrame':
        """
        Fetch weather data for multiple locations in a dataframe
        
        Args:
            df: DataFrame with Latitude and Longitude columns
            batch_size: Number of requests per batch (to avoid rate limiting)
            
        Returns:
            DataFrame with added Rain column
        """
        rain_data = []
        
        for idx, row in df.iterrows():
            if idx % batch_size == 0 and idx > 0:
                logger.info(f"Processed {idx} locations, pausing to avoid rate limit...")
            
            forecast = self.get_forecast(row['Latitude'], row['Longitude'])
            rainfall = self.extract_rainfall_24h(forecast)
            rain_data.append(rainfall)
        
        df['Rain'] = rain_data
        return df
