"""
Data Processing Module
Handles loading, preprocessing, and normalization of soil moisture data
"""

import pandas as pd
import numpy as np
import h5py
import os
from typing import Tuple, Optional

class DataProcessor:
    """Main data processor for agricultural data"""
    
    def __init__(self, model_file: str = 'Reduced_SMAP_L4_SM_aup.h5'):
        self.model_file = model_file
        self.df = None
        
    def load_h5_data(self) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Load soil moisture data from HDF5 file
        
        Returns:
            Tuple of (latitude, longitude, soil_moisture)
        """
        if not os.path.isfile(self.model_file):
            raise FileNotFoundError(f"Model file not found: {self.model_file}")
        
        try:
            with h5py.File(self.model_file, 'r') as h5:
                soil_moisture = h5['Analysis_Data/sm_surface_analysis'][:]
                lat = h5['cell_lat'][:]
                lon = h5['cell_lon'][:]
                return lat, lon, soil_moisture
        except KeyError as e:
            raise KeyError(f"Required dataset not found in HDF5 file: {e}")
    
    def create_dataframe(self) -> pd.DataFrame:
        """Load and create initial dataframe"""
        lat, lon, sm = self.load_h5_data()
        
        self.df = pd.DataFrame({
            'Latitude': lat.flatten(),
            'Longitude': lon.flatten(),
            'Soil_Moisture_Raw': sm.flatten()
        })
        
        return self.df
    
    def handle_missing_values(self) -> pd.DataFrame:
        """
        Handle missing values using interpolation
        
        Returns:
            DataFrame with missing values handled
        """
        if self.df is None:
            self.create_dataframe()
        
        # Remove NaN and infinity values
        self.df = self.df.replace([np.inf, -np.inf], np.nan)
        self.df = self.df.dropna(subset=['Soil_Moisture_Raw'])
        
        # Interpolate remaining NaNs
        self.df['Soil_Moisture_Raw'] = self.df['Soil_Moisture_Raw'].interpolate(method='linear')
        
        return self.df
    
    def normalize_moisture(self) -> pd.DataFrame:
        """
        Normalize soil moisture between 0 and 1
        
        Returns:
            DataFrame with normalized values
        """
        if self.df is None:
            self.handle_missing_values()
        
        # Get min and max values
        min_val = self.df['Soil_Moisture_Raw'].min()
        max_val = self.df['Soil_Moisture_Raw'].max()
        
        # Normalize
        self.df['Soil_Moisture'] = (self.df['Soil_Moisture_Raw'] - min_val) / (max_val - min_val + 1e-8)
        self.df['Soil_Moisture'] = self.df['Soil_Moisture'].clip(0, 1)
        
        return self.df
    
    def create_moisture_category(self) -> pd.DataFrame:
        """
        Create categorical column for moisture levels
        
        Categories:
        - Dry: < 0.15
        - Moderate: 0.15 - 0.22
        - Wet: > 0.22
        
        Returns:
            DataFrame with Category column
        """
        if 'Soil_Moisture' not in self.df.columns:
            self.normalize_moisture()
        
        def categorize(moisture):
            if moisture < 0.15:
                return 'Dry'
            elif moisture < 0.22:
                return 'Moderate'
            else:
                return 'Wet'
        
        self.df['Category'] = self.df['Soil_Moisture'].apply(categorize)
        
        return self.df
    
    def get_processed_data(self, limit: Optional[int] = None) -> pd.DataFrame:
        """
        Get fully processed data
        
        Args:
            limit: Limit number of rows (for performance)
            
        Returns:
            Processed DataFrame
        """
        self.handle_missing_values()
        self.normalize_moisture()
        self.create_moisture_category()
        
        if limit:
            return self.df.head(limit)
        
        return self.df
    
    def get_filtered_data(self, lat_min: float, lat_max: float, 
                         lon_min: float, lon_max: float) -> pd.DataFrame:
        """
        Get filtered data within latitude and longitude bounds
        
        Args:
            lat_min, lat_max: Latitude bounds
            lon_min, lon_max: Longitude bounds
            
        Returns:
            Filtered DataFrame
        """
        if self.df is None:
            self.get_processed_data()
        
        return self.df[
            (self.df['Latitude'] >= lat_min) & 
            (self.df['Latitude'] <= lat_max) &
            (self.df['Longitude'] >= lon_min) & 
            (self.df['Longitude'] <= lon_max)
        ]
    
    def get_statistics(self) -> dict:
        """Get summary statistics"""
        if self.df is None:
            self.get_processed_data()
        
        return {
            'mean_moisture': float(self.df['Soil_Moisture'].mean()),
            'std_moisture': float(self.df['Soil_Moisture'].std()),
            'min_moisture': float(self.df['Soil_Moisture'].min()),
            'max_moisture': float(self.df['Soil_Moisture'].max()),
            'dry_count': int((self.df['Category'] == 'Dry').sum()),
            'moderate_count': int((self.df['Category'] == 'Moderate').sum()),
            'wet_count': int((self.df['Category'] == 'Wet').sum()),
            'total_records': len(self.df)
        }
