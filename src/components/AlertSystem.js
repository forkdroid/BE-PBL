import React, { useEffect, useRef } from 'react';
import { useAlerts, ALERT_SEVERITY } from '../context/AlertContext';
import emailService from '../services/emailService';

// Component that monitors air quality data and triggers alerts
const AlertSystem = ({ airQualityData }) => {
  const { addAlert } = useAlerts();
  const prevDataRef = useRef(null);

  // Check thresholds and generate alerts
  useEffect(() => {
    if (!airQualityData || airQualityData.length === 0) return;

    // First time component loads, just store the data for next comparison
    if (!prevDataRef.current) {
      prevDataRef.current = airQualityData;
      
      // Request notification permission when component mounts
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
      
      return;
    }

    // For each pollutant, check if it crossed any thresholds
    airQualityData.forEach(pollutant => {
      const prevPollutant = prevDataRef.current.find(p => p.id === pollutant.id);
      
      // Unhealthy threshold crossed (going up)
      if (prevPollutant && 
          prevPollutant.value < prevPollutant.threshold.unhealthy && 
          pollutant.value >= pollutant.threshold.unhealthy) {
        
        const alertMessage = `${pollutant.fullName} (${pollutant.name}) levels have reached unhealthy levels: ${pollutant.value.toFixed(1)} ${pollutant.unit}`;
        
        // Add in-app alert
        addAlert(
          alertMessage,
          ALERT_SEVERITY.DANGER,
          pollutant
        );
        
        // Send email alert if user is subscribed
        if (emailService.isSubscribed) {
          emailService.sendAirQualityAlert(
            pollutant, 
            pollutant.value, 
            pollutant.threshold.unhealthy
          );
        }
      }
      // Moderate threshold crossed (going up)
      else if (prevPollutant && 
               prevPollutant.value < prevPollutant.threshold.moderate && 
               pollutant.value >= pollutant.threshold.moderate && 
               pollutant.value < pollutant.threshold.unhealthy) {
        addAlert(
          `${pollutant.fullName} (${pollutant.name}) levels have reached moderate levels: ${pollutant.value.toFixed(1)} ${pollutant.unit}`,
          ALERT_SEVERITY.WARNING,
          pollutant
        );
      }
      // Good threshold crossed (going down)
      else if (prevPollutant && 
               prevPollutant.value >= prevPollutant.threshold.moderate && 
               pollutant.value < pollutant.threshold.moderate) {
        addAlert(
          `${pollutant.fullName} (${pollutant.name}) levels have improved to good levels: ${pollutant.value.toFixed(1)} ${pollutant.unit}`,
          ALERT_SEVERITY.INFO,
          pollutant
        );
      }
      
      // Significant spike detection (20% increase in short time)
      const significantIncreaseThreshold = 0.2; // 20%
      if (prevPollutant && 
          (pollutant.value > prevPollutant.value) && 
          ((pollutant.value - prevPollutant.value) / prevPollutant.value > significantIncreaseThreshold)) {
        
        const alertMessage = `Significant increase in ${pollutant.fullName} (${pollutant.name}) detected: ${prevPollutant.value.toFixed(1)} → ${pollutant.value.toFixed(1)} ${pollutant.unit}`;
        
        // Add in-app alert
        addAlert(
          alertMessage,
          ALERT_SEVERITY.WARNING,
          pollutant
        );
        
        // If the spike reaches 90% of unhealthy threshold, send an email alert too
        const unhealthyPercentage = (pollutant.value / pollutant.threshold.unhealthy) * 100;
        if (unhealthyPercentage >= 90 && emailService.isSubscribed) {
          emailService.sendAirQualityAlert(
            pollutant, 
            pollutant.value, 
            pollutant.threshold.unhealthy * 0.9
          );
        }
      }
    });

    // Update the ref with current data for next comparison
    prevDataRef.current = airQualityData;
  }, [airQualityData, addAlert]);

  // This is a monitoring component, so it doesn't render anything
  return null;
};

export default AlertSystem; 