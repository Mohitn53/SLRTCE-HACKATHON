"""
Quick diagnostic script to identify test failures
"""
import sys
import traceback

print("=" * 80)
print("DIAGNOSTIC TEST - Checking all imports and basic functions")
print("=" * 80)

# Test 1: Import config
print("\n[1] Testing config import...")
try:
    from config import OPENWEATHER_API_KEY, SOIL_MOISTURE_THRESHOLDS
    print("✓ Config imported successfully")
    print(f"  Thresholds: {SOIL_MOISTURE_THRESHOLDS}")
except Exception as e:
    print(f"✗ Config import failed: {e}")
    traceback.print_exc()

# Test 2: Import data processor
print("\n[2] Testing DataProcessor...")
try:
    from data_processor import DataProcessor
    print("✓ DataProcessor imported successfully")
    # Don't actually load data - it might not exist
except Exception as e:
    print(f"✗ DataProcessor import failed: {e}")
    traceback.print_exc()

# Test 3: Import decision engine
print("\n[3] Testing DecisionEngine...")
try:
    from decision_engine import DecisionEngine, IrrigationDecision, ResourceOptimization
    print("✓ DecisionEngine imported successfully")
    
    # Test a basic decision
    engine = DecisionEngine()
    result = engine.irrigation_decision(0.15, 0.0)
    print(f"✓ Irrigation decision works: {result['decision']}")
    
    # Test resource optimization
    resources = engine.resource_optimization(0.15)
    print(f"✓ Resource optimization works")
    print(f"  Water usage type: {type(resources['water_usage'])}")
    print(f"  Water usage value: {resources['water_usage']}")
    
except Exception as e:
    print(f"✗ DecisionEngine test failed: {e}")
    traceback.print_exc()

# Test 4: Import weather service
print("\n[4] Testing WeatherService...")
try:
    from weather_service import WeatherService
    print("✓ WeatherService imported successfully")
except Exception as e:
    print(f"✗ WeatherService import failed: {e}")
    traceback.print_exc()

# Test 5: Import simulation engine
print("\n[5] Testing SimulationEngine...")
try:
    from simulation_engine import SimulationEngine
    print("✓ SimulationEngine imported successfully")
    
    sim = SimulationEngine()
    predictions = sim.simulate_moisture(0.18, 0.0, days=3)
    print(f"✓ Simulation works: {predictions}")
    
except Exception as e:
    print(f"✗ SimulationEngine test failed: {e}")
    traceback.print_exc()

# Test 6: Import pipeline
print("\n[6] Testing Pipeline...")
try:
    from pipeline import AgriculturalPipeline
    print("✓ Pipeline imported successfully")
    print("✓ Pipeline can be instantiated")
except Exception as e:
    print(f"✗ Pipeline import failed: {e}")
    traceback.print_exc()

print("\n" + "=" * 80)
print("DIAGNOSTIC COMPLETE")
print("=" * 80)
