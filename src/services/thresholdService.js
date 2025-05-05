class ThresholdService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        this.adminUsername = process.env.REACT_APP_ADMIN_USERNAME || 'admin';
        this.adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';
    }

    getAuthHeader() {
        const credentials = btoa(`${this.adminUsername}:${this.adminPassword}`);
        return `Basic ${credentials}`;
    }

    async getThresholds() {
        try {
            const response = await fetch(`${this.apiUrl}/api/thresholds`);
            if (!response.ok) {
                throw new Error('Failed to fetch thresholds');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching thresholds:', error);
            throw error;
        }
    }

    async updateThresholds(thresholds) {
        try {
            const response = await fetch(`${this.apiUrl}/api/thresholds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                },
                body: JSON.stringify(thresholds),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Admin authentication failed');
                }
                throw new Error('Failed to update thresholds');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating thresholds:', error);
            throw error;
        }
    }
}

export default new ThresholdService(); 