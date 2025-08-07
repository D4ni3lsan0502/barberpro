// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Storage for JWT token
let authToken = localStorage.getItem('authToken');

// API Helper Functions
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (authToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// Authentication API
const authAPI = {
    login: async (email, password, role) => {
        const data = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
        
        if (data.access_token) {
            authToken = data.access_token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    },
    
    logout: () => {
        authToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
    
    isAuthenticated: () => {
        return !!authToken;
    }
};

// Client API
const clientAPI = {
    register: async (clientData) => {
        return await apiRequest('/clients', {
            method: 'POST',
            body: JSON.stringify(clientData)
        });
    },
    
    get: async (clientId) => {
        return await apiRequest(`/clients/${clientId}`);
    },
    
    update: async (clientId, clientData) => {
        return await apiRequest(`/clients/${clientId}`, {
            method: 'PUT',
            body: JSON.stringify(clientData)
        });
    },
    
    delete: async (clientId) => {
        return await apiRequest(`/clients/${clientId}`, {
            method: 'DELETE'
        });
    }
};

// Barber API
const barberAPI = {
    register: async (barberData) => {
        return await apiRequest('/barbers', {
            method: 'POST',
            body: JSON.stringify(barberData)
        });
    },
    
    get: async (barberId) => {
        return await apiRequest(`/barbers/${barberId}`);
    },
    
    update: async (barberId, barberData) => {
        return await apiRequest(`/barbers/${barberId}`, {
            method: 'PUT',
            body: JSON.stringify(barberData)
        });
    },
    
    delete: async (barberId) => {
        return await apiRequest(`/barbers/${barberId}`, {
            method: 'DELETE'
        });
    }
};

// Service API
const serviceAPI = {
    getAll: async () => {
        return await apiRequest('/services');
    },
    
    get: async (serviceId) => {
        return await apiRequest(`/services/${serviceId}`);
    },
    
    create: async (serviceData) => {
        return await apiRequest('/services', {
            method: 'POST',
            body: JSON.stringify(serviceData)
        });
    },
    
    update: async (serviceId, serviceData) => {
        return await apiRequest(`/services/${serviceId}`, {
            method: 'PUT',
            body: JSON.stringify(serviceData)
        });
    },
    
    delete: async (serviceId) => {
        return await apiRequest(`/services/${serviceId}`, {
            method: 'DELETE'
        });
    }
};

// Appointment API
const appointmentAPI = {
    getAll: async () => {
        return await apiRequest('/appointments');
    },
    
    get: async (appointmentId) => {
        return await apiRequest(`/appointments/${appointmentId}`);
    },
    
    create: async (appointmentData) => {
        return await apiRequest('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData)
        });
    },
    
    update: async (appointmentId, appointmentData) => {
        return await apiRequest(`/appointments/${appointmentId}`, {
            method: 'PUT',
            body: JSON.stringify(appointmentData)
        });
    },
    
    delete: async (appointmentId) => {
        return await apiRequest(`/appointments/${appointmentId}`, {
            method: 'DELETE'
        });
    }
};

// Export APIs for use in other scripts
window.API = {
    auth: authAPI,
    client: clientAPI,
    barber: barberAPI,
    service: serviceAPI,
    appointment: appointmentAPI
};

