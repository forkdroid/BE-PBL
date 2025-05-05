import React, { useEffect, useState } from 'react';
import AirQualityCard from './AirQualityCard';
import TimeSeriesChart from './TimeSeriesChart';
import { historicalData } from '../mockData';
import websocketService from '../services/websocketService';

const Dashboard = () => {
  const [airQualityData, setAirQualityData] = useState([]);
  const [updateHistory, setUpdateHistory] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // 🔁 Auto-fetch data every 5 seconds
  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/api/aqi")
        .then(res => res.json())
        .then(data => {
          setAirQualityData(data);
          setLastUpdateTime(new Date());
        })
        .catch(err => console.error("Failed to fetch AQI data:", err));
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000); // repeat every 5 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  const airQualityIndex = Math.max(
    ...(airQualityData.map(item => (item.value / item.threshold.unhealthy) * 100) || [0])
  );

  let airQualityStatus = 'Good';
  let statusColor = 'bg-green-500';

  if (airQualityIndex > 100) {
    airQualityStatus = 'Unhealthy';
    statusColor = 'bg-red-500';
  } else if (airQualityIndex > 50) {
    airQualityStatus = 'Moderate';
    statusColor = 'bg-yellow-500';
  }

  useEffect(() => {
    const now = new Date();
    setUpdateHistory(prev => [
      ...prev,
      {
        time: now.toLocaleTimeString(),
        value: airQualityIndex,
        connected: websocketService.isConnected(),
      },
    ].slice(-20));
  }, [airQualityData, airQualityIndex]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Overall Air Quality</h2>
          <div className="text-sm text-gray-500">
            Last update: {lastUpdateTime.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`h-16 w-16 rounded-full ${statusColor} flex items-center justify-center text-white text-xl font-bold`}>
            {Math.round(airQualityIndex)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{airQualityStatus}</h3>
            <p className="text-gray-600">Air Quality Index</p>
          </div>
        </div>
        <TimeSeriesChart data={historicalData} updateHistory={updateHistory} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {airQualityData.map(pollutant => (
          <AirQualityCard key={pollutant.id} pollutant={pollutant} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
