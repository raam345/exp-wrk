// API Configuration for Frontend
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Error');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Users API
export const userAPI = {
  signup: (data) => apiCall('/users/signup', { method: 'POST', body: JSON.stringify(data) }),
  signin: (data) => apiCall('/users/signin', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: (userId) => apiCall(`/users/profile/${userId}`),
};

// Products API
export const productAPI = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`),
  create: (data) => apiCall('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/products/${id}`, { method: 'DELETE' }),
};

// Cart API
export const cartAPI = {
  getCart: (userId) => apiCall(`/cart/${userId}`),
  addItem: (userId, data) =>
    apiCall('/cart/add', { method: 'POST', body: JSON.stringify({ userId, ...data }) }),
  removeItem: (userId, productId) =>
    apiCall(`/cart/${userId}/${productId}`, { method: 'DELETE' }),
};

// Orders API
export const orderAPI = {
  create: (data) => apiCall('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (userId) => apiCall(`/orders/${userId}`),
  getById: (orderId) => apiCall(`/orders/detail/${orderId}`),
  updateStatus: (orderId, status) =>
    apiCall(`/orders/${orderId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
