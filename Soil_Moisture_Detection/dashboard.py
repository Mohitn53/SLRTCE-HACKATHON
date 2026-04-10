"""
Streamlit Dashboard for Smart Agriculture System
Interactive visualization and monitoring interface
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import logging
from pipeline import AgriculturalPipeline
from decision_engine import DecisionEngine
from simulation_engine import SimulationEngine

st.set_page_config(
    page_title="Kisan Setu - Agricultural Dashboard",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for theme
st.markdown("""
<style>
:root {
    --primary: #10B981;
    --secondary: #34D399;
    --accent: #F59E0B;
    --background: #F8FAFC;
    --text: #0F172A;
}

.main {
    max-width: 1400px;
}

.stMetric {
    background-color: #f0fdf4;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #10B981;
}

.header {
    color: #10B981;
    font-weight: 700;
}
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'pipeline' not in st.session_state:
    st.session_state.pipeline = AgriculturalPipeline()
    st.session_state.processed_data = None
    st.session_state.last_update = None

# ============================================================================
# HEADER
# ============================================================================

col1, col2 = st.columns([1, 3])
with col1:
    st.image(None)  # Placeholder for logo
    st.markdown("## 🌾")

with col2:
    st.markdown("# <span style='color: #10B981'>Kisan Setu</span>", unsafe_allow_html=True)
    st.markdown("### 🚜 Smart Agriculture Decision & Resource Management System")
    st.markdown("*Empowering Farmers with Data-Driven Decisions*")

st.divider()

# ============================================================================
# SIDEBAR - NAVIGATION
# ============================================================================

with st.sidebar:
    st.markdown("## 📊 Navigation")
    page = st.radio(
        "Select View:",
        ["Dashboard", "Data Explorer", "Simulation Tool", "Advisory", "Settings"]
    )
    
    st.markdown("---")
    st.markdown("### ⚙️ System Settings")
    
    fetch_weather = st.checkbox("Fetch Real Weather Data", value=False)
    data_limit = st.slider("Data Records (for performance):", 10, 500, 100)
    
    if st.button("🔄 Refresh Data", use_container_width=True):
        st.session_state.processed_data = None
        st.rerun()

# ============================================================================
# LOAD DATA
# ============================================================================

@st.cache_data(ttl=300)
def load_pipeline_data(limit, fetch_weather):
    """Load data with caching"""
    pipeline = st.session_state.pipeline
    df = pipeline.run_full_pipeline(
        limit=limit,
        fetch_weather=fetch_weather,
        include_simulation=True
    )
    return df

if st.session_state.processed_data is None:
    with st.spinner("Loading and processing agricultural data..."):
        st.session_state.processed_data = load_pipeline_data(data_limit, fetch_weather)
        st.session_state.last_update = datetime.now()

df = st.session_state.processed_data

# ============================================================================
# PAGE: DASHBOARD
# ============================================================================

if page == "Dashboard":
    # Key Metrics
    col1, col2, col3, col4 = st.columns(4)
    
    stats = st.session_state.pipeline.get_summary_report()
    
    with col1:
        st.metric(
            "📍 Total Locations",
            f"{stats['total_records']:,}",
            "Records analyzed"
        )
    
    with col2:
        urgent = stats['urgent_count']
        st.metric(
            "🚨 Urgent Irrigation",
            urgent,
            f"{urgent/stats['total_records']*100:.1f}% of area"
        )
    
    with col3:
        avg_conf = stats['average_confidence']
        st.metric(
            "✅ Avg Confidence",
            f"{avg_conf*100:.1f}%",
            "Decision reliability"
        )
    
    with col4:
        st.metric(
            "💧 Avg Moisture",
            f"{stats['statistics']['mean_moisture']:.3f}",
            f"Range: {stats['statistics']['min_moisture']:.3f} - {stats['statistics']['max_moisture']:.3f}"
        )
    
    st.divider()
    
    # Soil Moisture Distribution
    st.markdown("### 📊 Soil Moisture Analysis")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Histogram
        fig_hist = px.histogram(
            df,
            x="Soil_Moisture",
            nbins=30,
            title="Soil Moisture Distribution",
            labels={"Soil_Moisture": "Soil Moisture (0-1)"},
            color_discrete_sequence=["#10B981"]
        )
        fig_hist.update_layout(height=400)
        st.plotly_chart(fig_hist, use_container_width=True)
    
    with col2:
        # Category pie chart
        category_counts = df['Category'].value_counts()
        fig_pie = px.pie(
            values=category_counts.values,
            names=category_counts.index,
            title="Soil Moisture Categories",
            color_discrete_map={
                'Dry': '#FCA5A5',
                'Moderate': '#FBBF24',
                'Wet': '#60A5FA'
            }
        )
        fig_pie.update_layout(height=400)
        st.plotly_chart(fig_pie, use_container_width=True)
    
    st.divider()
    
    # Geographic Distribution
    st.markdown("### 🗺️ Geographic Distribution")
    
    # Filter data for map (limit for performance)
    map_data = df.sample(min(500, len(df)))
    
    fig_map = px.scatter_mapbox(
        map_data,
        lat="Latitude",
        lon="Longitude",
        color="Soil_Moisture",
        size="Soil_Moisture",
        hover_data=["Category", "Decision"],
        color_continuous_scale="RdYlGn",
        size_max=10,
        zoom=3,
        title="Soil Moisture Map",
        mapbox_style="open-street-map"
    )
    fig_map.update_layout(height=500, margin={"r":0,"t":30,"l":0,"b":0})
    st.plotly_chart(fig_map, use_container_width=True)
    
    st.divider()
    
    # Irrigation Decisions Overview
    st.markdown("### 🚜 Irrigation Decisions")
    
    col1, col2 = st.columns(2)
    
    with col1:
        decision_counts = df['Decision'].value_counts()
        fig_decisions = px.bar(
            x=decision_counts.index,
            y=decision_counts.values,
            title="Decision Distribution",
            labels={"x": "Decision Type", "y": "Count"},
            color_discrete_sequence=["#10B981"]
        )
        fig_decisions.update_layout(height=400, xaxis_tickangle=-45)
        st.plotly_chart(fig_decisions, use_container_width=True)
    
    with col2:
        water_usage_counts = df['Water_Usage'].value_counts()
        fig_water = px.pie(
            values=water_usage_counts.values,
            names=water_usage_counts.index,
            title="Water Usage Distribution",
            color_discrete_map={
                'High': '#EF4444',
                'Medium': '#F59E0B',
                'Low': '#10B981'
            }
        )
        fig_water.update_layout(height=400)
        st.plotly_chart(fig_water, use_container_width=True)
    
    # Data Table
    st.markdown("### 📋 Detailed Records")
    
    display_cols = ['Latitude', 'Longitude', 'Soil_Moisture', 'Category', 
                    'Decision', 'Water_Usage', 'Confidence']
    st.dataframe(
        df[display_cols].head(50),
        use_container_width=True,
        height=400
    )

# ============================================================================
# PAGE: DATA EXPLORER
# ============================================================================

elif page == "Data Explorer":
    st.markdown("## 🔍 Data Explorer")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        lat_min = st.number_input("Latitude Min", value=df['Latitude'].min())
    with col2:
        lat_max = st.number_input("Latitude Max", value=df['Latitude'].max())
    with col3:
        lon_min = st.number_input("Longitude Min", value=df['Longitude'].min())
    with col4:
        lon_max = st.number_input("Longitude Max", value=df['Longitude'].max())
    
    filtered = st.session_state.pipeline.data_processor.get_filtered_data(
        lat_min, lat_max, lon_min, lon_max
    )
    
    if filtered.empty:
        st.warning("No data in selected region")
    else:
        st.success(f"Found {len(filtered)} records")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("Mean Moisture", f"{filtered['Soil_Moisture'].mean():.3f}")
            st.metric("Std Dev", f"{filtered['Soil_Moisture'].std():.3f}")
        
        with col2:
            st.metric("Min Moisture", f"{filtered['Soil_Moisture'].min():.3f}")
            st.metric("Max Moisture", f"{filtered['Soil_Moisture'].max():.3f}")
        
        st.dataframe(filtered, use_container_width=True)

# ============================================================================
# PAGE: SIMULATION TOOL
# ============================================================================

elif page == "Simulation Tool":
    st.markdown("## 🔮 Future Moisture Simulation")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        current_moisture = st.slider("Current Soil Moisture", 0.0, 1.0, 0.18)
    
    with col2:
        rainfall = st.number_input("Expected Rainfall (mm)", 0.0, 100.0, 0.0)
    
    with col3:
        days = st.slider("Forecast Days", 1, 30, 3)
    
    with col4:
        apply_irrigation = st.checkbox("Apply Irrigation", value=True)
    
    # Run simulation
    simulation = st.session_state.pipeline.simulation_engine.simulate_moisture(
        current_moisture, rainfall, days, apply_irrigation
    )
    
    trend = st.session_state.pipeline.simulation_engine.get_trend(simulation)
    
    st.markdown(f"### {trend}")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Line chart
        fig_line = go.Figure()
        fig_line.add_trace(go.Scatter(
            y=simulation,
            mode='lines+markers',
            name='Predicted Moisture',
            line=dict(color='#10B981', width=3),
            marker=dict(size=10)
        ))
        fig_line.update_layout(
            title="Soil Moisture Forecast",
            xaxis_title="Days",
            yaxis_title="Moisture (0-1)",
            height=400,
            hovermode='x unified'
        )
        st.plotly_chart(fig_line, use_container_width=True)
    
    with col2:
        # Predictions table
        pred_df = pd.DataFrame({
            'Day': range(len(simulation)),
            'Predicted Moisture': [f"{m:.3f}" for m in simulation],
            'Category': ['Dry' if m < 0.15 else 'Moderate' if m < 0.22 else 'Wet' for m in simulation]
        })
        st.dataframe(pred_df, use_container_width=True)
    
    # Optimal schedule
    st.markdown("---")
    st.markdown("### 🎯 Optimal Irrigation Schedule")
    
    target = st.slider("Target Moisture Level", 0.0, 1.0, 0.18)
    
    result = st.session_state.pipeline.simulation_engine.find_optimal_irrigation_schedule(
        current_moisture, rainfall, target, days
    )
    
    best = result['best_schedule']
    st.info(f"""
    **Best Schedule Found:**
    - Days to irrigate: {best['days_irrigated']} / {days}
    - Water savings: {best['water_savings']:.1f}%
    - Average moisture: {best['avg_moisture']:.3f}
    - Variance from target: {best['variance_from_target']:.6f}
    """)

# ============================================================================
# PAGE: ADVISORY
# ============================================================================

elif page == "Advisory":
    st.markdown("## 🌾 Farming Advisory")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 📍 Single Location Advisory")
        
        lat = st.number_input("Latitude", value=0.0)
        lon = st.number_input("Longitude", value=0.0)
        moisture = st.slider("Soil Moisture", 0.0, 1.0, 0.18)
        
        if st.button("Get Advisory", use_container_width=True):
            result = st.session_state.pipeline.process_single_location(lat, lon, moisture)
            
            decision = result['decision']
            
            st.markdown(f"### {decision['irrigation']['decision']}")
            
            col_a, col_b = st.columns(2)
            
            with col_a:
                st.markdown("**Irrigation Decision:**")
                st.write(decision['irrigation']['reason'])
                st.write(f"Confidence: {decision['irrigation']['confidence']*100:.0f}%")
            
            with col_b:
                st.markdown("**Resources:**")
                res = decision['resources']
                st.write(f"💧 Water Usage: {res['water_usage']}")
                st.write(f"🌱 Fertilizer: {res['fertilizer']}")
                st.write(f"⚡ Energy: {res['energy_optimization']}")
    
    with col2:
        st.markdown("### 📊 Top Recommendations")
        
        # Sort by priority
        urgent = df[df['Decision'].str.contains('Urgent')]
        
        if not urgent.empty:
            st.markdown("🚨 **Urgent Irrigation Areas**")
            st.dataframe(
                urgent[['Latitude', 'Longitude', 'Soil_Moisture', 'Priority']].head(10),
                use_container_width=True
            )
        
        st.divider()
        
        light = df[df['Decision'].str.contains('Light')]
        if not light.empty:
            st.markdown("⚖️ **Light Irrigation Areas**")
            st.dataframe(
                light[['Latitude', 'Longitude', 'Soil_Moisture']].head(5),
                use_container_width=True
            )

# ============================================================================
# PAGE: SETTINGS
# ============================================================================

elif page == "Settings":
    st.markdown("## ⚙️ System Settings")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### System Information")
        st.info(f"""
        **Last Update:** {st.session_state.last_update}
        
        **Records Processed:** {len(df):,}
        
        **Data Source:** HDF5 Model File
        """)
    
    with col2:
        st.markdown("### Configuration")
        
        st.markdown("**Simulation Parameters:**")
        col_x, col_y, col_z = st.columns(3)
        
        with col_x:
            st.metric("Irrigation Rate", "0.05")
        with col_y:
            st.metric("Evaporation Rate", "0.01")
        with col_z:
            st.metric("Default Days", "3")
    
    st.divider()
    
    st.markdown("### Data Export")
    
    if st.button("📥 Export Data to CSV", use_container_width=True):
        csv = df.to_csv(index=False)
        st.download_button(
            label="Download CSV",
            data=csv,
            file_name=f"agricultural_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            mime="text/csv"
        )
    
    st.divider()
    
    st.markdown("### About")
    st.markdown("""
    **Kisan Setu** - Smart Agriculture Decision & Resource Management System
    
    An intelligent farming system that:
    - 🔍 Analyzes soil moisture data
    - 🌤️ Integrates weather forecasts
    - 💧 Provides irrigation recommendations
    - 🌱 Optimizes resource usage
    - 🔮 Predicts future soil conditions
    
    **Developed for:** Farmers and Agricultural Planners
    """)

# ============================================================================
# FOOTER
# ============================================================================

st.divider()
st.markdown("""
<div style='text-align: center; color: #64748B; font-size: 12px;'>
🌾 Kisan Setu - Empowering Farmers with AI | Last Updated: """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """
</div>
""", unsafe_allow_html=True)
