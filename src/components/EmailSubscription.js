import React, { useState, useEffect } from 'react';
import emailService from '../services/emailService';

const EmailSubscription = () => {
  const [emails, setEmails] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check subscription status on load
  useEffect(() => {
    setIsSubscribed(emailService.isSubscribed);
  }, []);

  const handleEmailsChange = (e) => {
    setEmails(e.target.value);
    setError('');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    // Split emails by comma or newline and clean them
    const emailList = emails
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emailList.length === 0) {
      setError('Please enter at least one valid email address');
      return;
    }

    try {
      const result = await emailService.subscribeMultiple(emailList);
      if (result.success) {
        setIsSubscribed(true);
        setSuccess(`Successfully subscribed ${result.addedEmails.length} emails!`);
        setError('');
        setEmails('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to subscribe emails');
      }
    } catch (err) {
      setError('An error occurred while subscribing emails');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await emailService.unsubscribe();
      setIsSubscribed(false);
      setEmails('');
      setSuccess('Unsubscribed from air quality alerts successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to unsubscribe');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setError('');
    setSuccess('');
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="text-blue-600 hover:text-blue-800 flex items-center"
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        {isSubscribed ? 'Manage Email Alerts' : 'Subscribe to Alerts'}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {isSubscribed ? 'Manage Email Alerts' : 'Subscribe to Air Quality Alerts'}
            </h2>
            
            {success && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="emails">
                    Email Addresses
                  </label>
                  <textarea
                    id="emails"
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    value={emails}
                    onChange={handleEmailsChange}
                    placeholder="Enter multiple emails separated by commas or new lines"
                    rows="4"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  You'll receive email alerts when air quality levels reach unhealthy thresholds.
                  Enter multiple email addresses separated by commas or new lines.
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="mb-4">
                  You are currently subscribed to air quality alerts.
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleUnsubscribe}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Unsubscribe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSubscription; 