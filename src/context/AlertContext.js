import React, { createContext, useContext, useState, useEffect } from 'react';

// Alert severity levels
export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
};

// Create context
const AlertContext = createContext(null);

// Alert provider component
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);

  // Add a new alert
  const addAlert = (message, severity = ALERT_SEVERITY.INFO, pollutant = null) => {
    const newAlert = {
      id: Date.now(),
      message,
      severity,
      pollutant,
      timestamp: new Date(),
      read: false,
    };
    
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    setHasUnreadAlerts(true);
    
    // Also show browser notification if permission granted
    showBrowserNotification(message, severity);
  };

  // Mark an alert as read
  const markAsRead = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
    
    // Check if any unread alerts remain
    const hasUnread = alerts.some(alert => !alert.read && alert.id !== alertId);
    setHasUnreadAlerts(hasUnread);
  };

  // Mark all alerts as read
  const markAllAsRead = () => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert => ({ ...alert, read: true }))
    );
    setHasUnreadAlerts(false);
  };

  // Clear all alerts
  const clearAlerts = () => {
    setAlerts([]);
    setHasUnreadAlerts(false);
  };

  // Show browser notification
  const showBrowserNotification = (message, severity) => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      const title = severity === ALERT_SEVERITY.DANGER 
        ? '⚠️ Air Quality Alert!' 
        : '🌬️ Air Quality Update';
      
      const options = {
        body: message,
        icon: '/favicon.ico'
      };
      
      new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        hasUnreadAlerts,
        addAlert,
        markAsRead,
        markAllAsRead,
        clearAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook to use the alert context
export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export default AlertContext; 