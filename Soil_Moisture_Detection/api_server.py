"""
Flask Backend API for Smart Agriculture System
Provides RESTful endpoints for the frontend and external systems
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import os
from datetime import datetime
from pipeline import AgriculturalPipeline

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize pipeline
try:
    api_key = os.getenv('OPENWEATHER_API_KEY', None)
    pipeline = AgriculturalPipeline(api_key=api_key)
    logger.info("Pipeline initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize pipeline: {e}")
    pipeline = None

# ============================================================================
# HEALTH CHECK ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Smart Agriculture Decision System'
    }), 200

# ============================================================================
# DATA ENDPOINTS
# ============================================================================

@app.route('/api/data', methods=['GET'])
def get_data():
    """
    Get processed agricultural data
    Optional query parameters:
    - limit: Maximum number of records (default: 100)
    - fetch_weather: Whether to fetch real weather (default: false)
    """
    try:
        if pipeline is None:
            return jsonify({'error': 'Pipeline not initialized'}), 500
        
        limit = request.args.get('limit', 100, type=int)
        fetch_weather = request.args.get('fetch_weather', 'false').lower() == 'true'
        
        logger.info(f"Processing data request: limit={limit}, fetch_weather={fetch_weather}")
        
        # Run pipeline
        df = pipeline.run_full_pipeline(
            limit=limit,
            fetch_weather=fetch_weather,
            include_simulation=True
        )
        
        # Convert to JSON-serializable format
        data = df.to_dict(orient='records')
        
        return jsonify({
            'status': 'success',
            'count': len(data),
            'data': data,
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error processing data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get summary statistics of processed data"""
    try:
        if pipeline is None:
            return jsonify({'error': 'Pipeline not initialized'}), 500
        
        # Process minimal data for stats
        pipeline.run_full_pipeline(limit=100, fetch_weather=False)
        stats = pipeline.get_summary_report()
        
        return jsonify({
            'status': 'success',
            'stats': stats,
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# SINGLE LOCATION ENDPOINTS
# ============================================================================

@app.route('/api/location/decision', methods=['POST'])
def location_decision():
    """
    Get decision for a specific location
    Request body:
    {
        "latitude": float,
        "longitude": float,
        "soil_moisture": float (0-1)
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'latitude' not in data or 'longitude' not in data or 'soil_moisture' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        lat = float(data['latitude'])
        lon = float(data['longitude'])
        moisture = float(data['soil_moisture'])
        
        # Validate ranges
        if not (-90 <= lat <= 90):
            return jsonify({'error': 'Invalid latitude'}), 400
        if not (-180 <= lon <= 180):
            return jsonify({'error': 'Invalid longitude'}), 400
        if not (0 <= moisture <= 1):
            return jsonify({'error': 'Soil moisture must be between 0 and 1'}), 400
        
        logger.info(f"Processing decision for location: {lat}, {lon}")
        
        result = pipeline.process_single_location(lat, lon, moisture)
        
        return jsonify({
            'status': 'success',
            'result': result,
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Error processing location decision: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# AREA/REGION ENDPOINTS
# ============================================================================

@app.route('/api/region/summary', methods=['POST'])
def region_summary():
    """
    Get summary for a geographic region
    Request body:
    {
        "lat_min": float,
        "lat_max": float,
        "lon_min": float,
        "lon_max": float
    }
    """
    try:
        data = request.get_json()
        
        required = ['lat_min', 'lat_max', 'lon_min', 'lon_max']
        if not data or not all(k in data for k in required):
            return jsonify({'error': 'Missing required fields'}), 400
        
        lat_min = float(data['lat_min'])
        lat_max = float(data['lat_max'])
        lon_min = float(data['lon_min'])
        lon_max = float(data['lon_max'])
        
        logger.info(f"Processing region: ({lat_min},{lon_min}) to ({lat_max},{lon_max})")
        
        # Get filtered data
        df = pipeline.data_processor.get_filtered_data(lat_min, lat_max, lon_min, lon_max)
        
        if df.empty:
            return jsonify({'error': 'No data in specified region'}), 404
        
        # Summary statistics
        summary = {
            'count': len(df),
            'mean_moisture': float(df['Soil_Moisture'].mean()),
            'std_moisture': float(df['Soil_Moisture'].std()),
            'dry_areas': int((df['Category'] == 'Dry').sum()),
            'moderate_areas': int((df['Category'] == 'Moderate').sum()),
            'wet_areas': int((df['Category'] == 'Wet').sum()),
            'bounds': {
                'latitude': [float(lat_min), float(lat_max)],
                'longitude': [float(lon_min), float(lon_max)]
            }
        }
        
        return jsonify({
            'status': 'success',
            'summary': summary,
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Error processing region: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# SIMULATION ENDPOINTS
# ============================================================================

@app.route('/api/simulation/forecast', methods=['POST'])
def forecast_moisture():
    """
    Forecast future soil moisture
    Request body:
    {
        "soil_moisture": float (0-1),
        "rainfall_forecast": float (mm),
        "days": int (optional, default: 3),
        "irrigation": boolean (optional, default: true)
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'soil_moisture' not in data:
            return jsonify({'error': 'Missing soil_moisture'}), 400
        
        moisture = float(data['soil_moisture'])
        rain = float(data.get('rainfall_forecast', 0))
        days = int(data.get('days', 3))
        irrigation = data.get('irrigation', True)
        
        # Validate
        if not (0 <= moisture <= 1):
            return jsonify({'error': 'Soil moisture must be between 0 and 1'}), 400
        if days < 1 or days > 30:
            return jsonify({'error': 'Days must be between 1 and 30'}), 400
        
        predictions = pipeline.simulation_engine.simulate_moisture(
            moisture, rain, days, irrigation
        )
        
        trend = pipeline.simulation_engine.get_trend(predictions)
        
        return jsonify({
            'status': 'success',
            'forecast': {
                'initial_moisture': moisture,
                'rainfall_forecast': rain,
                'days': days,
                'irrigation_applied': irrigation,
                'predictions': predictions,
                'trend': trend
            },
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Error in forecast: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/simulation/optimal-schedule', methods=['POST'])
def optimal_schedule():
    """
    Find optimal irrigation schedule
    Request body:
    {
        "soil_moisture": float (0-1),
        "rainfall_forecast": float (mm),
        "target_moisture": float (optional, default: 0.18),
        "days": int (optional, default: 5)
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'soil_moisture' not in data:
            return jsonify({'error': 'Missing soil_moisture'}), 400
        
        moisture = float(data['soil_moisture'])
        rain = float(data.get('rainfall_forecast', 0))
        target = float(data.get('target_moisture', 0.18))
        days = int(data.get('days', 5))
        
        # Validate
        if not (0 <= moisture <= 1):
            return jsonify({'error': 'Soil moisture must be between 0 and 1'}), 400
        if not (0 <= target <= 1):
            return jsonify({'error': 'Target moisture must be between 0 and 1'}), 400
        
        result = pipeline.simulation_engine.find_optimal_irrigation_schedule(
            moisture, rain, target, days
        )
        
        return jsonify({
            'status': 'success',
            'optimal_schedule': result['best_schedule'],
            'alternatives': result['all_options'],
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Error in optimal schedule: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True
    )
