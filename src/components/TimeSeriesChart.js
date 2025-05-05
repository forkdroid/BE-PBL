import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
  Scatter
} from 'recharts';

const TimeSeriesChart = ({ data, updateHistory }) => {
  const [visibleLines, setVisibleLines] = useState({
    'CO2': true,
    'NH3': true,
    'Alcohol': true,
    'Smoke': true,
    'Benzene': true,
    'PM2.5': true
  });
  const [showUpdateHistory, setShowUpdateHistory] = useState(false);

  const pollutantColors = {
    'CO2': '#ef4444',
    'NH3': '#f59e0b',
    'Alcohol': '#9333ea',
    'Smoke': '#10b981',
    'Benzene': '#3b82f6',
    'PM2.5': '#6366f1'
  };

  const toggleLine = (dataKey) => {
    setVisibleLines({
      ...visibleLines,
      [dataKey]: !visibleLines[dataKey]
    });
  };

  // Format update history for the chart
  const formattedUpdateHistory = updateHistory?.map((update, index) => ({
    ...update,
    index,
    connectionStatus: update.connected ? 100 : 0 // Plot connection status at bottom of chart
  }));

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.keys(visibleLines).map(key => (
            <button
              key={key}
              className={`px-3 py-1 text-sm rounded-full ${
                visibleLines[key] 
                  ? 'text-white' 
                  : 'text-gray-700 bg-gray-200'
              }`}
              style={{ backgroundColor: visibleLines[key] ? pollutantColors[key] : '' }}
              onClick={() => toggleLine(key)}
            >
              {key}
            </button>
          ))}
        </div>
        
        {updateHistory && updateHistory.length > 0 && (
          <button
            className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
            onClick={() => setShowUpdateHistory(!showUpdateHistory)}
          >
            {showUpdateHistory ? 'Show Historical Data' : 'Show Live Updates'}
          </button>
        )}
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {!showUpdateHistory ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(visibleLines).map(key => (
                visibleLines[key] && (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={pollutantColors[key]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )
              ))}
            </LineChart>
          ) : (
            <ComposedChart
              data={formattedUpdateHistory}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'connectionStatus') {
                    return [value === 100 ? 'Connected' : 'Disconnected', 'WebSocket Status'];
                  }
                  return [value.toFixed(2), name];
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="AQI Value" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <ReferenceLine y={50} stroke="#fbbf24" strokeDasharray="3 3" label="Moderate" />
              <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" label="Unhealthy" />
              <Area 
                type="step" 
                dataKey="connectionStatus" 
                name="WebSocket Status" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                stroke="#3b82f6"
              />
              <Scatter 
                dataKey="connectionStatus"
                fill="#3b82f6"
                shape="circle" 
                r={4}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesChart; 