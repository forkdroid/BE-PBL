// Email service for handling subscriptions and alerts
class EmailService {
  constructor() {
    this.isSubscribed = false;
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }

  async subscribeMultiple(emails) {
    try {
      const response = await fetch(`${this.apiUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      const data = await response.json();
      this.isSubscribed = true;
      return {
        success: true,
        addedEmails: data.added_emails
      };
    } catch (error) {
      console.error('Error subscribing to email alerts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async unsubscribe() {
    try {
      const response = await fetch(`${this.apiUrl}/api/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: '' }), // Backend will handle this
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }

      this.isSubscribed = false;
      return true;
    } catch (error) {
      console.error('Error unsubscribing from email alerts:', error);
      return false;
    }
  }

  async sendAirQualityAlert(pollutant, currentValue, threshold) {
    try {
      const subject = `Air Quality Alert: ${pollutant.fullName} Levels`;
      const message = `
        Air Quality Alert
        
        ${pollutant.fullName} (${pollutant.name}) levels have reached ${currentValue} ${pollutant.unit}.
        This is above the threshold of ${threshold} ${pollutant.unit}.
        
        Description: ${pollutant.description}
        
        Please take necessary precautions.
      `;

      const response = await fetch(`${this.apiUrl}/api/send-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send alert');
      }

      return true;
    } catch (error) {
      console.error('Error sending air quality alert:', error);
      return false;
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService; 