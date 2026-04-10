#!/bin/bash
# Quick Commands - Shell Script for Easy System Management
# Usage: Run individual commands or source this file

echo "🌾 Kisan Setu - Command Reference"
echo "=================================="

# ============================================================================
# ENVIRONMENT SETUP
# ============================================================================

setup_environment() {
    echo "Setting up environment..."
    
    # Create virtual environment
    python -m venv venv
    
    # Activate (for Linux/macOS)
    # On Windows use: venv\Scripts\activate
    source venv/bin/activate
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Create .env from template
    cp .env.template .env
    echo "✅ Environment setup complete!"
    echo "📝 Edit .env file and add your OpenWeatherMap API key"
}

# ============================================================================
# TESTING & DIAGNOSTICS
# ============================================================================

run_tests() {
    echo "Running system tests..."
    python test_system.py
}

test_data_loading() {
    echo "Testing data loading..."
    python -c "
from data_processor import DataProcessor
dp = DataProcessor()
df = dp.get_processed_data(limit=10)
print(f'✅ Loaded {len(df)} records')
print(df.head())
"
}

test_api() {
    echo "Testing API..."
    curl -s http://localhost:5000/health | python -m json.tool
}

test_weather() {
    echo "Testing weather service..."
    python -c "
from weather_service import WeatherService
ws = WeatherService()
result = ws.get_weather_summary(20.5937, 75.7597)
print('✅ Weather data retrieved')
print(result)
"
}

# ============================================================================
# RUN COMPONENTS
# ============================================================================

start_api() {
    echo "Starting Flask API on port 5000..."
    python api_server.py
}

start_dashboard() {
    echo "Starting Streamlit Dashboard on port 8501..."
    streamlit run dashboard.py
}

start_all() {
    echo "Starting all services..."
    echo "API will run on: http://localhost:5000"
    echo "Dashboard will run on: http://localhost:8501"
    
    # Start API in background
    python api_server.py &
    API_PID=$!
    
    # Start dashboard
    streamlit run dashboard.py
    
    # Cleanup on exit
    trap "kill $API_PID" EXIT
}

# ============================================================================
# API CALLS
# ============================================================================

api_health() {
    echo "Checking API health..."
    curl -s http://localhost:5000/health | python -m json.tool
}

api_get_data() {
    local limit=${1:-50}
    echo "Fetching $limit records..."
    curl -s "http://localhost:5000/api/data?limit=$limit" | python -m json.tool | head -50
}

api_location_decision() {
    local lat=${1:-20.5937}
    local lon=${2:-75.7597}
    local moisture=${3:-0.18}
    
    echo "Getting decision for ($lat, $lon) with moisture $moisture..."
    curl -s -X POST http://localhost:5000/api/location/decision \
        -H "Content-Type: application/json" \
        -d "{\"latitude\": $lat, \"longitude\": $lon, \"soil_moisture\": $moisture}" | \
        python -m json.tool
}

api_forecast() {
    local moisture=${1:-0.18}
    local rain=${2:-0}
    local days=${3:-3}
    
    echo "Forecasting moisture for $days days..."
    curl -s -X POST http://localhost:5000/api/simulation/forecast \
        -H "Content-Type: application/json" \
        -d "{\"soil_moisture\": $moisture, \"rainfall_forecast\": $rain, \"days\": $days}" | \
        python -m json.tool
}

api_optimal_schedule() {
    local moisture=${1:-0.18}
    local rain=${2:-0}
    
    echo "Finding optimal irrigation schedule..."
    curl -s -X POST http://localhost:5000/api/simulation/optimal-schedule \
        -H "Content-Type: application/json" \
        -d "{\"soil_moisture\": $moisture, \"rainfall_forecast\": $rain, \"days\": 5}" | \
        python -m json.tool | head -100
}

# ============================================================================
# DATA OPERATIONS
# ============================================================================

process_data() {
    echo "Processing data..."
    python -c "
from pipeline import AgriculturalPipeline
pipeline = AgriculturalPipeline()
df = pipeline.run_full_pipeline(limit=100, fetch_weather=False)
pipeline.export_results('output_data.csv')
print('✅ Data processed and exported to output_data.csv')
"
}

export_data() {
    local output=${1:-processed_data.csv}
    echo "Exporting data to $output..."
    python -c "
from pipeline import AgriculturalPipeline
pipeline = AgriculturalPipeline()
df = pipeline.run_full_pipeline(limit=500, fetch_weather=False)
pipeline.export_results('$output')
print(f'✅ Exported to $output')
"
}

get_stats() {
    echo "Getting system statistics..."
    python -c "
from pipeline import AgriculturalPipeline
pipeline = AgriculturalPipeline()
pipeline.run_full_pipeline(limit=100, fetch_weather=False)
stats = pipeline.get_summary_report()
import json
print(json.dumps(stats, indent=2))
"
}

# ============================================================================
# UTILITIES
# ============================================================================

check_dependencies() {
    echo "Checking dependencies..."
    python -c "
import sys
deps = ['pandas', 'numpy', 'h5py', 'flask', 'requests', 'streamlit', 'plotly']
missing = []
for dep in deps:
    try:
        __import__(dep)
        print(f'✅ {dep}')
    except ImportError:
        print(f'❌ {dep}')
        missing.append(dep)

if missing:
    print(f'\nMissing: {missing}')
    print('Run: pip install -r requirements.txt')
else:
    print('\n✅ All dependencies installed!')
"
}

backup_data() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="backup_$timestamp.csv"
    echo "Creating backup: $backup_file"
    python -c "
from pipeline import AgriculturalPipeline
pipeline = AgriculturalPipeline()
df = pipeline.run_full_pipeline(limit=1000)
df.to_csv('$backup_file', index=False)
print(f'✅ Backup created: $backup_file')
"
}

show_help() {
    cat << EOF
🌾 Kisan Setu - Command Reference

SETUP:
  setup_environment        - Install dependencies and create virtual env
  check_dependencies       - Check if all packages are installed

TESTING:
  run_tests               - Run comprehensive test suite
  test_data_loading       - Test data loading
  test_api                - Test API health
  test_weather            - Test weather service

SERVICES:
  start_api               - Start Flask API server (port 5000)
  start_dashboard         - Start Streamlit dashboard (port 8501)
  start_all               - Start both services

API CALLS:
  api_health              - Check API status
  api_get_data [limit]    - Get processed data
  api_location_decision [lat] [lon] [moisture] - Get decision
  api_forecast [moisture] [rain] [days]        - Forecast moisture
  api_optimal_schedule [moisture] [rain]       - Get optimal schedule

DATA:
  process_data            - Process all data
  export_data [filename]  - Export to CSV
  get_stats               - Get system statistics
  backup_data             - Create timestamped backup

UTILITIES:
  check_dependencies      - Verify all packages installed
  show_help              - Show this help message

EXAMPLES:
  api_location_decision 20.5 75.5 0.18
  api_forecast 0.18 5 3
  export_data my_data.csv

EOF
}

# ============================================================================
# MAIN
# ============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script is being executed
    if [[ $# -eq 0 ]]; then
        show_help
    else
        "$@"
    fi
else
    # Script is being sourced
    echo "Commands loaded! Use 'show_help' to see available commands"
fi
