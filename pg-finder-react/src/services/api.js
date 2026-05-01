// src/services/api.js
// Central API service — all backend calls go through here

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper: attach JWT token to every request
const authHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // add this temporarily
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic fetch wrapper with error handling
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: authHeaders(),
      ...options
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  } catch (err) {
    throw err;
  }
}

// ─── AUTH ───────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  getMe:    ()     => request('/auth/me'),
};

// ─── LISTINGS ───────────────────────────────────────────
export const listingsAPI = {
getNearby: (lat, lng, radius = 5) =>
  request(`/listings/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  // Get all with optional filters
  // filters: { gender, type, maxRent, minRent, sort, verified, amenities }
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    const qs = params.toString();
    return request(`/listings${qs ? '?' + qs : ''}`);

  },

  getOne:  (id)   => request(`/listings/${id}`),
  create:  (body) => request('/listings',     { method: 'POST',   body: JSON.stringify(body) }),
  update:  (id, body) => request(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:  (id)   => request(`/listings/${id}`,  { method: 'DELETE' }),
  verify:  (id)   => request(`/listings/${id}/verify`, { method: 'POST' }),
  save:    (id)   => request(`/listings/${id}/save`,   { method: 'POST' }),
};

// ─── REVIEWS ────────────────────────────────────────────
export const reviewsAPI = {
  getAll:  (listingId) => request(`/listings/${listingId}/reviews`),
  create:  (listingId, body) => request(`/listings/${listingId}/reviews`, { method:'POST', body: JSON.stringify(body) }),
  delete:  (listingId, reviewId) => request(`/listings/${listingId}/reviews/${reviewId}`, { method:'DELETE' }),
  helpful: (listingId, reviewId) => request(`/listings/${listingId}/reviews/${reviewId}/helpful`, { method:'POST' }),
};
