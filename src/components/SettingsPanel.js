import React, { useState, useEffect } from 'react';
import thresholdService from '../services/thresholdService';

const SettingsPanel = ({ airQualityData, onUpdateThresholds }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thresholds, setThresholds] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Try to update a test threshold to verify admin access
        await thresholdService.updateThresholds({ test: 0 });
        setIsAdmin(true);
      } catch (err) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  // Load thresholds from backend when component mounts
  useEffect(() => {
    const loadThresholds = async () => {
      try {
        const backendThresholds = await thresholdService.getThresholds();
        setThresholds(backendThresholds);
      } catch (err) {
        console.error('Failed to load thresholds:', err);
        // Fallback to frontend thresholds if backend fails
        setThresholds(
          airQualityData.reduce((acc, pollutant) => {
            acc[pollutant.id] = { ...pollutant.threshold };
            return acc;
          }, {})
        );
      }
    };
    loadThresholds();
  }, [airQualityData]);

  const toggleOpen = () => {
    if (!isAdmin) {
      setError('Only administrators can modify thresholds');
      return;
    }
    setIsOpen(!isOpen);
    setError('');
    setSuccess('');
    
    // Reset thresholds to current values when opening
    if (!isOpen) {
      setThresholds(
        airQualityData.reduce((acc, pollutant) => {
          acc[pollutant.id] = { ...pollutant.threshold };
          return acc;
        }, {})
      );
    }
  };

  const handleThresholdChange = (pollutantId, level, value) => {
    if (!isAdmin) return;
    setThresholds(prev => ({
      ...prev,
      [pollutantId]: {
        ...prev[pollutantId],
        [level]: parseFloat(value)
      }
    }));
  };

  const handleSave = async () => {
    if (!isAdmin) {
      setError('Only administrators can modify thresholds');
      return;
    }

    // Validate thresholds (good < moderate < unhealthy)
    let isValid = true;
    Object.keys(thresholds).forEach(id => {
      const { good, moderate, unhealthy } = thresholds[id];
      if (good >= moderate || moderate >= unhealthy) {
        isValid = false;
      }
    });

    if (!isValid) {
      setError('Invalid thresholds: Good < Moderate < Unhealthy must be maintained');
      return;
    }

    try {
      // Convert thresholds to backend format
      const backendThresholds = Object.entries(thresholds).reduce((acc, [id, levels]) => {
        acc[id] = levels.unhealthy; // Use unhealthy threshold as the main threshold
        return acc;
      }, {});

      // Update thresholds in backend
      await thresholdService.updateThresholds(backendThresholds);
      
      // Update frontend state
      onUpdateThresholds(thresholds);
      setSuccess('Thresholds updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setIsOpen(false);
    } catch (err) {
      if (err.message === 'Admin authentication failed') {
        setError('Admin authentication failed. Please check your credentials.');
      } else {
        setError('Failed to update thresholds. Please try again.');
      }
      console.error('Error updating thresholds:', err);
    }
  };

  if (!isAdmin) {
    return null; // Don't render the settings panel for non-admin users
  }

  return (
    <div>
      <button
        onClick={toggleOpen}
        className="text-gray-100 hover:text-white flex items-center"
      >
        <svg 
          className="h-5 w-5 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        Admin Settings
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Admin: Alert Threshold Settings</h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <p className="mb-4 text-gray-600">
              Adjust the thresholds at which alerts will be triggered for each pollutant.
              These settings will apply to all users.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {airQualityData.map(pollutant => (
                <div key={pollutant.id} className="border rounded p-4">
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: pollutant.color }}></span>
                    {pollutant.fullName} ({pollutant.name})
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">Unit: {pollutant.unit}</p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Good threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={thresholds[pollutant.id]?.good || 0}
                      onChange={(e) => handleThresholdChange(pollutant.id, 'good', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moderate threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={thresholds[pollutant.id]?.moderate || 0}
                      onChange={(e) => handleThresholdChange(pollutant.id, 'moderate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unhealthy threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={thresholds[pollutant.id]?.unhealthy || 0}
                      onChange={(e) => handleThresholdChange(pollutant.id, 'unhealthy', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel; 