"""
Test and Debug Module
Utilities for testing the pipeline and API
"""

import sys
import logging
from pipeline import AgriculturalPipeline
from decision_engine import DecisionEngine
from simulation_engine import SimulationEngine
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_pipeline():
    """Test complete pipeline"""
    logger.info("=" * 80)
    logger.info("Testing Agricultural Pipeline")
    logger.info("=" * 80)
    
    try:
        # Initialize
        pipeline = AgriculturalPipeline()
        logger.info("✓ Pipeline initialized")
        
        # Test data loading
        logger.info("\n[1/4] Testing data loading...")
        df = pipeline.data_processor.get_processed_data(limit=50)
        logger.info(f"✓ Loaded {len(df)} records")
        logger.info(f"  Columns: {list(df.columns)}")
        
        # Test decision engine
        logger.info("\n[2/4] Testing decision engine...")
        test_moisture = 0.15
        test_rain = 0.0
        decision = pipeline.decision_engine.get_combined_recommendation(test_moisture, test_rain)
        logger.info(f"✓ Decision for moisture={test_moisture}, rain={test_rain}:")
        logger.info(f"  → {decision['irrigation']['decision']}")
        logger.info(f"  Reason: {decision['irrigation']['reason']}")
        
        # Test simulation
        logger.info("\n[3/4] Testing simulation engine...")
        predictions = pipeline.simulation_engine.simulate_moisture(test_moisture, test_rain, days=3)
        trend = pipeline.simulation_engine.get_trend(predictions)
        logger.info(f"✓ Simulated 3 days of moisture:")
        for i, pred in enumerate(predictions):
            logger.info(f"  Day {i}: {pred:.3f}")
        logger.info(f"  Trend: {trend}")
        
        # Test resource optimization
        logger.info("\n[4/4] Testing resource optimization...")
        resources = pipeline.decision_engine.resource_optimization(test_moisture)
        logger.info(f"✓ Resource optimization for moisture={test_moisture}:")
        logger.info(f"  Water Usage: {resources['water_usage']}")
        logger.info(f"  Fertilizer: {resources['fertilizer']}")
        logger.info(f"  Energy: {resources['energy_optimization']}")
        
        logger.info("\n" + "=" * 80)
        logger.info("✓ All tests passed!")
        logger.info("=" * 80)
        return True
        
    except Exception as e:
        logger.error(f"✗ Error during testing: {e}")
        logger.error("", exc_info=True)
        return False

def test_single_location():
    """Test single location processing"""
    logger.info("\n" + "=" * 80)
    logger.info("Testing Single Location Processing")
    logger.info("=" * 80)
    
    try:
        pipeline = AgriculturalPipeline()
        
        # Test location
        lat, lon, moisture = 20.0, 75.0, 0.18
        logger.info(f"\nProcessing location: ({lat}, {lon}) with moisture {moisture}")
        
        result = pipeline.process_single_location(lat, lon, moisture)
        
        logger.info(f"\nLocation: {result['location']}")
        logger.info(f"Soil Moisture: {result['soil_moisture']}")
        logger.info(f"\nWeather Data:")
        for key, value in result['weather'].items():
            logger.info(f"  {key}: {value}")
        logger.info(f"\nDecision: {result['decision']['irrigation']['decision']}")
        logger.info(f"Priority: {result['decision']['priority']}")
        logger.info(f"\nSimulation Predictions: {result['simulation']['predictions']}")
        logger.info(f"Trend: {result['simulation']['trend']}")
        
        logger.info("\n✓ Single location test passed!")
        return True
        
    except Exception as e:
        logger.error(f"✗ Error: {e}")
        logger.error("", exc_info=True)
        return False

def test_decision_scenarios():
    """Test various decision scenarios"""
    logger.info("\n" + "=" * 80)
    logger.info("Testing Decision Scenarios")
    logger.info("=" * 80)
    
    scenarios = [
        {"moisture": 0.10, "rain": 0.0, "desc": "Dry soil, no rain"},
        {"moisture": 0.18, "rain": 0.0, "desc": "Moderate soil, no rain"},
        {"moisture": 0.25, "rain": 0.0, "desc": "Wet soil, no rain"},
        {"moisture": 0.12, "rain": 10.0, "desc": "Dry soil, rain expected"},
        {"moisture": 0.20, "rain": 20.0, "desc": "Moderate soil, heavy rain"},
    ]
    
    engine = DecisionEngine()
    
    for scenario in scenarios:
        logger.info(f"\nScenario: {scenario['desc']}")
        logger.info(f"  Moisture: {scenario['moisture']}, Rain: {scenario['rain']}mm")
        
        decision = engine.get_combined_recommendation(scenario['moisture'], scenario['rain'])
        logger.info(f"  Decision: {decision['irrigation']['decision']}")
        logger.info(f"  Water Usage: {decision['resources']['water_usage']}")
        logger.info(f"  Priority: {decision['priority']}")
    
    logger.info("\n✓ Decision scenario tests passed!")
    return True

def benchmark_performance():
    """Benchmark system performance"""
    logger.info("\n" + "=" * 80)
    logger.info("Benchmarking Performance")
    logger.info("=" * 80)
    
    try:
        import time
        
        pipeline = AgriculturalPipeline()
        
        # Benchmark data loading
        logger.info("\nBenchmarking data loading...")
        start = time.time()
        df = pipeline.data_processor.get_processed_data(limit=1000)
        elapsed = time.time() - start
        logger.info(f"✓ Loaded 1000 records in {elapsed:.2f}s ({1000/elapsed:.0f} records/sec)")
        
        # Benchmark decision engine (batch)
        logger.info("\nBenchmarking decision engine...")
        start = time.time()
        decisions = []
        for _, row in df.head(100).iterrows():
            d = pipeline.decision_engine.get_combined_recommendation(
                row['Soil_Moisture'], 0.0
            )
            decisions.append(d)
        elapsed = time.time() - start
        logger.info(f"✓ 100 decisions in {elapsed:.2f}s ({100/elapsed:.0f} decisions/sec)")
        
        # Benchmark simulation
        logger.info("\nBenchmarking simulation...")
        start = time.time()
        for i in range(100):
            pipeline.simulation_engine.simulate_moisture(0.18, 0.0, days=3)
        elapsed = time.time() - start
        logger.info(f"✓ 100 simulations in {elapsed:.2f}s ({100/elapsed:.0f} simulations/sec)")
        
        logger.info("\n" + "=" * 80)
        logger.info("✓ Benchmark completed!")
        logger.info("=" * 80)
        return True
        
    except Exception as e:
        logger.error(f"✗ Benchmark failed: {e}")
        return False

def main():
    """Run all tests"""
    logger.info(f"\n\n{'='*80}")
    logger.info("SMART AGRICULTURE SYSTEM - TEST SUITE")
    logger.info(f"Timestamp: {datetime.now().isoformat()}")
    logger.info('='*80)
    
    results = {
        'Pipeline': test_pipeline(),
        'Single Location': test_single_location(),
        'Decision Scenarios': test_decision_scenarios(),
        'Performance': benchmark_performance(),
    }
    
    logger.info(f"\n\n{'='*80}")
    logger.info("TEST SUMMARY")
    logger.info('='*80)
    
    for test_name, passed in results.items():
        status = "✓ PASSED" if passed else "✗ FAILED"
        logger.info(f"{test_name:.<30} {status}")
    
    all_passed = all(results.values())
    logger.info(f"\nOverall: {'✓ ALL TESTS PASSED' if all_passed else '✗ SOME TESTS FAILED'}")
    logger.info('='*80 + '\n')
    
    return all_passed

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
