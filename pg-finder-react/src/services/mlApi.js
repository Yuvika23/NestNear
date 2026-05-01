// src/services/mlApi.js
// Calls the Python ML recommendation engine

const ML_URL = import.meta.env.VITE_ML_URL || 'http://localhost:8000';

async function mlRequest(endpoint, options = {}) {
  try {
    const res = await fetch(`${ML_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    return await res.json();
  } catch (err) {
    console.warn('ML API unavailable:', err.message);
    return null;
  }
}

export const mlAPI = {
  // Get PGs similar to a listing (content-based)
  getSimilar: (listingId, n = 4) =>
    mlRequest(`/recommend/similar/${listingId}?n=${n}`),

  // Get personalised recommendations for a user (hybrid)
  getUserRecs: (userId, viewedIds, preferences = {}, n = 4) =>
    mlRequest('/recommend/user', {
      method: 'POST',
      body: JSON.stringify({ userId, viewedIds, preferences, n })
    }),

  // Get price fairness analysis for a listing
  getPriceCheck: (listingId) =>
    mlRequest(`/recommend/price-check/${listingId}`),

  // Track user interaction (view / save / contact)
  trackInteraction: (userId, listingId, action = 'view') =>
    mlRequest('/interact', {
      method: 'POST',
      body: JSON.stringify({ userId, listingId, action })
    }),
};
