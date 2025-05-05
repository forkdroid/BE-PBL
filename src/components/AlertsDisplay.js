import React, { useState } from 'react';
import { useAlerts, ALERT_SEVERITY } from '../context/AlertContext';

const AlertsDisplay = () => {
  const { alerts, hasUnreadAlerts, markAsRead, markAllAsRead, clearAlerts } = useAlerts();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && hasUnreadAlerts) {
      markAllAsRead();
    }
  };

  // Get alert style based on severity
  const getAlertStyle = (severity) => {
    switch (severity) {
      case ALERT_SEVERITY.DANGER:
        return 'bg-red-100 border-red-500 text-red-700';
      case ALERT_SEVERITY.WARNING:
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case ALERT_SEVERITY.INFO:
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case ALERT_SEVERITY.DANGER:
        return '⚠️';
      case ALERT_SEVERITY.WARNING:
        return '⚡';
      case ALERT_SEVERITY.INFO:
      default:
        return 'ℹ️';
    }
  };

  // Format the timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative">
      {/* Bell icon with notification indicator */}
      <button
        className="p-2 rounded-full hover:bg-gray-200 transition-colors relative"
        onClick={toggleOpen}
        aria-label="Alerts"
      >
        <svg
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {hasUnreadAlerts && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500"></span>
        )}
      </button>

      {/* Alerts dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Alerts</h3>
              <div className="space-x-2">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
                <button
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={clearAlerts}
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          {alerts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No alerts</div>
          ) : (
            <div>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 ${getAlertStyle(
                    alert.severity
                  )} ${!alert.read ? 'font-semibold' : ''}`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start">
                    <div className="mr-2">{getSeverityIcon(alert.severity)}</div>
                    <div className="flex-1">
                      <div className="text-sm">{alert.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsDisplay; 