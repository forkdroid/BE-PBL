import React, { useState, useEffect } from 'react';
import { useAlerts, ALERT_SEVERITY } from '../context/AlertContext';

const AlertToast = () => {
  const { alerts } = useAlerts();
  const [visibleAlert, setVisibleAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Show the most recent alert as a toast
  useEffect(() => {
    // Only proceed if there are alerts and the latest is unread
    if (alerts.length > 0 && !alerts[0].read) {
      setVisibleAlert(alerts[0]);
      setIsVisible(true);

      // Hide the toast after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alerts]);

  // Handle toast dismissal
  const dismissToast = () => {
    setIsVisible(false);
  };

  // Get alert style based on severity
  const getAlertStyle = (severity) => {
    switch (severity) {
      case ALERT_SEVERITY.DANGER:
        return 'bg-red-100 border-red-600 text-red-700';
      case ALERT_SEVERITY.WARNING:
        return 'bg-yellow-100 border-yellow-600 text-yellow-700';
      case ALERT_SEVERITY.INFO:
      default:
        return 'bg-blue-100 border-blue-600 text-blue-700';
    }
  };

  // If no visible alert or not showing, don't render anything
  if (!visibleAlert || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideIn max-w-md">
      <div
        className={`${getAlertStyle(
          visibleAlert.severity
        )} border-l-4 p-4 rounded shadow-lg flex items-start`}
      >
        <div className="flex-1 mr-4">
          <p className="font-bold mb-1">
            {visibleAlert.severity === ALERT_SEVERITY.DANGER
              ? 'Alert!'
              : visibleAlert.severity === ALERT_SEVERITY.WARNING
              ? 'Warning'
              : 'Info'}
          </p>
          <p className="text-sm">{visibleAlert.message}</p>
        </div>
        <button
          onClick={dismissToast}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AlertToast; 