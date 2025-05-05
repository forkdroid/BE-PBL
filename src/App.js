import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { mockAirQualityData } from './mockData';
import websocketService from './services/websocketService';
import { AlertProvider } from './context/AlertContext';
import AlertSystem from './components/AlertSystem';
import AlertsDisplay from './components/AlertsDisplay';
import AlertToast from './components/AlertToast';
import EmailSubscription from './components/EmailSubscription';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [airQualityData, setAirQualityData] = useState(mockAirQualityData);
  const [isConnected, setIsConnected] = useState(false);
  const simulationInterval = React.useRef(null);
  
  useEffect(() => {
    // Initialize WebSocket connection
    websocketService.connect();
    
    // Handle air quality updates
    const handleAirQualityUpdate = (data) => {
      setAirQualityData(data);
    };
    
    // Handle connection status updates
    const handleConnectionStatus = (status) => {
      setIsConnected(status.connected);
      
      // If we're not connected, fall back to simulated data
      if (!status.connected) {
        console.log("Connection failed, falling back to simulated data");
        startSimulation();
      } else {
        // If we're connected and simulation is running, stop it
        if (simulationInterval.current) {
          clearInterval(simulationInterval.current);
          simulationInterval.current = null;
        }
      }
    };
    
    // Add event listeners
    websocketService.addListener('air-quality-update', handleAirQualityUpdate);
    websocketService.addListener('connection-status', handleConnectionStatus);
    
    // Cleanup on component unmount
    return () => {
      websocketService.removeListener('air-quality-update', handleAirQualityUpdate);
      websocketService.removeListener('connection-status', handleConnectionStatus);
      websocketService.disconnect();
      
      // Clear any simulation interval
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
      }
    };
  }, []);

  // Function to start simulation if WebSocket fails
  const startSimulation = () => {
    // Clear any existing interval
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }
    
    // Start a new interval for simulated data
    const interval = setInterval(() => {
      setAirQualityData(prevData => 
        prevData.map(item => ({
          ...item,
          value: Math.max(0, item.value + (Math.random() - 0.5) * 10)
        }))
      );
    }, 15 * 60 * 1000); // Update every 15 minutes
    
    simulationInterval.current = interval;
  };

  const handleRefresh = () => {
    if (isConnected) {
      // If connected to WebSocket, request fresh data
      websocketService.requestDataUpdate();
    } else {
      // Otherwise manually update with simulated data
      const updatedData = airQualityData.map(item => ({
        ...item,
        value: Math.max(0, item.value + (Math.random() - 0.5) * 15)
      }));
      setAirQualityData(updatedData);
    }
  };

  // Handle threshold updates from the settings panel
  const handleUpdateThresholds = (newThresholds) => {
    // Update each pollutant with its new thresholds
    const updatedData = airQualityData.map(pollutant => ({
      ...pollutant,
      threshold: {
        ...newThresholds[pollutant.id]
      }
    }));
    
    setAirQualityData(updatedData);
  };

  return (
    <AlertProvider>
      {/* Alert monitoring system - doesn't render anything */}
      <AlertSystem airQualityData={airQualityData} />
      
      {/* Toast notifications */}
      <AlertToast />
    
      <div className="min-h-screen bg-gray-100">
        <Header 
          onRefresh={handleRefresh} 
          isConnected={isConnected}
        >
          <div className="flex items-center space-x-4">
            <SettingsPanel 
              airQualityData={airQualityData}
              onUpdateThresholds={handleUpdateThresholds}
            />
            <AlertsDisplay />
            <EmailSubscription />
          </div>
        </Header>
        
        <main className="container mx-auto py-6 px-4">
          <Dashboard airQualityData={airQualityData} />
        </main>
      </div>
    </AlertProvider>
  );
}

export default App; 
