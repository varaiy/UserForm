const API_BASE_URL = 'http://localhost:8000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const api = {
    /**
     * Login to the application
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{token: string}>}
     */
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Create a new staff entry
     * @param {Object} staffData 
     * @returns {Promise<Object>}
     */
    createStaff: async (staffData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/staff`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(staffData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create staff');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Create a new guest entry
     * @param {Object} guestData 
     * @returns {Promise<Object>}
     */
    createGuest: async (guestData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/guests`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(guestData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create guest');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
};
