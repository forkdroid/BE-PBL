import React from 'react';

const AirQualityCard = ({ pollutant }) => {
  // Calculate the percentage of the current value relative to the unhealthy threshold
  const percentage = (pollutant.value / pollutant.threshold.unhealthy) * 100;
  
  // Determine the status color
  let statusColor = 'bg-green-500';
  let statusText = 'Good';
  
  if (percentage >= 100) {
    statusColor = 'bg-red-500';
    statusText = 'Unhealthy';
  } else if (percentage >= 50) {
    statusColor = 'bg-yellow-500';
    statusText = 'Moderate';
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          {pollutant.name}
          <span className="ml-2 text-sm text-gray-500">{pollutant.fullName}</span>
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs text-white ${statusColor}`}>
          {statusText}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-3xl font-bold" style={{ color: pollutant.color }}>
            {pollutant.value.toFixed(1)}
            <span className="text-sm text-gray-500 ml-1">{pollutant.unit}</span>
          </div>
          <div className="text-sm text-gray-500">
            Limit: {pollutant.threshold.unhealthy} {pollutant.unit}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full mt-2 mb-4">
          <div 
            className={`h-full rounded-full ${statusColor}`} 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600">{pollutant.description}</p>
      </div>
    </div>
  );
};

export default AirQualityCard; 