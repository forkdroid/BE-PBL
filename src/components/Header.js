import React, { useState, useEffect } from 'react';

const Header = ({ onRefresh, isConnected, children }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg 
            className="h-8 w-8 mr-2" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M11 4.05V2a9 9 0 0 0-9 9h2c0-3.87 3.13-7 7-7zm0 16a7 7 0 0 1-7-7H2a9 9 0 0 0 9 9V20zm0-5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
          <h1 className="text-2xl font-bold">Air Quality Dashboard</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-500'} mr-2`}></span>
            <span className="text-sm font-medium">
              {isConnected ? 'Live Data' : 'Offline Mode'}
            </span>
          </div>
          
          {children}
          
          <span className="mx-4">
            Last Updated: {currentTime}
          </span>
          <button 
            className="bg-white text-primary hover:bg-gray-100 font-semibold py-2 px-4 rounded-md transition-colors"
            onClick={onRefresh}
          >
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 