"""
Configuration file for Smart Agriculture System
Contains API keys, constants, and system settings
"""

import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv is optional, but recommended
    pass

# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'your_api_key_here')
OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast'

# Model Configuration
MODEL_FILE = 'Reduced_SMAP_L4_SM_aup.h5'

# System Constants
SOIL_MOISTURE_THRESHOLDS = {
    'DRY': 0.15,
    'MODERATE': 0.22,
    'WET': 1.0
}

SIMULATION_PARAMS = {
    'irrigation_rate': 0.05,
    'evaporation_rate': 0.01,
    'default_days': 3
}

# API Configuration
FLASK_PORT = 5000
FLASK_DEBUG = True

# Feature Flags
ENABLE_API = True
ENABLE_DASHBOARD = True
ENABLE_PREDICTIONS = True
