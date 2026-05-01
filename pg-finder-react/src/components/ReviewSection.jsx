// src/components/ReviewSection.jsx
import { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SUB_RATINGS = ['Cleanliness', 'WiFi', 'Food', 'Safety', 'Owner'];

function StarPicker({ value, onChange, size = 20 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: size, cursor: 'pointer',
            color: star <= (hovered || value) ? '#E8A020' : '#D0C8BE',
            transition: 'color 0.1s'
          }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    month: 'short', year: 'numeric'
  });
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar">
          {review.user?.name?.[0]?.toUpperCase() || 'S'}
        </div>
        <div>
          <div className="review-name">{review.user?.name || 'Student'}</div>
          <div className="review-meta">
            {review.user?.college && <span>{review.user.college} · </span>}
            {review.stayDuration && <span>{review.stayDuration} · </span>}
            <span>{date}</span>
          </div>
        </div>
        <div className="review-stars">
          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
        </div>
      </div>
      {review.comment && (
        <div className="review-comment">"{review.comment}"</div>
      )}
      {review.subRatings && Object.keys(review.subRatings).length > 0 && (
        <div className="review-sub-ratings">
          {Object.entries(review.subRatings).map(([key, val]) => val > 0 && (
            <div key={key} className="review-sub-item">
              <span>{key}</span>
              <span style={{ color: '#E8A020' }}>{'★'.repeat(val)}</span>
            </div>
          ))}
        </div>
      )}
      {review.isCurrentResident && (
        <div className="review-resident-badge">🏠 Current Resident</div>
      )}
    </div>
  );
}

export default function ReviewSection({ listingId }) {
  const { user } = useAuth();
  const [reviews, setReviews]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState(false);

  const [form, setForm] = useState({
    rating: 0,
    comment: '',
    stayDuration: '',
    isCurrentResident: false,
    subRatings: { Cleanliness: 0, WiFi: 0, Food: 0, Safety: 0, Owner: 0 }
  });

  useEffect(() => {
    if (!listingId) return;
    setLoading(true);
    reviewsAPI.getAll(listingId)
      .then(data => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [listingId]);

  const setSubRating = (key, val) => {
    setForm(prev => ({
      ...prev,
      subRatings: { ...prev.subRatings, [key]: val }
    }));
  };

  const handleSubmit = async () => {
    if (form.rating === 0) { setError('Please select an overall rating.'); return; }
    setError(''); setSubmitting(true);
    try {
      const payload = {
        rating:            form.rating,
        comment:           form.comment,
        stayDuration:      form.stayDuration,
        isCurrentResident: form.isCurrentResident,
        subRatings: {
          cleanliness: form.subRatings.Cleanliness,
          wifi:        form.subRatings.WiFi,
          food:        form.subRatings.Food,
          safety:      form.subRatings.Safety,
          owner:       form.subRatings.Owner,
        }
      };
      const data = await reviewsAPI.create(listingId, payload);
      setReviews(prev => [data.review, ...prev]);
      setSuccess(true);
      setShowForm(false);
      setForm({ rating:0, comment:'', stayDuration:'', isCurrentResident:false,
        subRatings:{ Cleanliness:0, WiFi:0, Food:0, Safety:0, Owner:0 } });
    } catch (err) {
      setError(err.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="review-section">
      {/* Header */}
      <div className="review-section-header">
        <div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1rem', fontWeight:700 }}>
            ⭐ Student Reviews
          </div>
          {avgRating && (
            <div style={{ fontSize:'0.82rem', color:'var(--ink2)', marginTop:'2px' }}>
              {avgRating} avg · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        {user && !showForm && !success && (
          <button className="write-review-btn" onClick={() => setShowForm(true)}>
            ✍️ Write a review
          </button>
        )}
        {!user && (
          <div style={{ fontSize:'0.8rem', color:'var(--ink2)' }}>Login to write a review</div>
        )}
      </div>

      {success && (
        <div className="review-success">✅ Review submitted! Thank you.</div>
      )}

      {/* Write review form */}
      {showForm && (
        <div className="review-form">
          <div style={{ fontWeight:700, marginBottom:'12px', fontSize:'0.95rem' }}>Your Review</div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          {/* Overall rating */}
          <div className="form-group">
            <label>Overall Rating *</label>
            <StarPicker value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} size={28} />
          </div>

          {/* Sub ratings */}
          <div style={{ fontWeight:600, fontSize:'0.8rem', color:'var(--ink2)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.4px' }}>
            Detailed Ratings (optional)
          </div>
          <div className="sub-rating-picker">
            {SUB_RATINGS.map(key => (
              <div key={key} className="sub-rating-row">
                <span>{key}</span>
                <StarPicker value={form.subRatings[key]} onChange={v => setSubRating(key, v)} size={16} />
              </div>
            ))}
          </div>

          {/* Comment */}
          <div className="form-group">
            <label>Your Experience</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="How was the food, cleanliness, owner behaviour, WiFi speed...?"
              value={form.comment}
              onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
            />
          </div>

          {/* Stay duration */}
          <div className="form-row">
            <div className="form-group">
              <label>How long did you stay?</label>
              <select className="form-input" value={form.stayDuration}
                onChange={e => setForm(p => ({ ...p, stayDuration: e.target.value }))}>
                <option value="">Select</option>
                <option value="< 3 months">Less than 3 months</option>
                <option value="3-6 months">3–6 months</option>
                <option value="6-12 months">6–12 months</option>
                <option value="1+ year">1+ year</option>
              </select>
            </div>
            <div className="form-group" style={{ justifyContent:'flex-end' }}>
              <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', marginTop:'auto' }}>
                <input type="checkbox" checked={form.isCurrentResident}
                  onChange={e => setForm(p => ({ ...p, isCurrentResident: e.target.checked }))} />
                I currently live here
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
            <button className="modal-cta primary" onClick={handleSubmit} disabled={submitting}
              style={{ flex:1 }}>
              {submitting ? '⏳ Submitting...' : '✅ Submit Review'}
            </button>
            <button className="modal-cta secondary" onClick={() => { setShowForm(false); setError(''); }}
              style={{ flex:1 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div style={{ color:'var(--ink2)', fontSize:'0.85rem', padding:'12px 0' }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">
          <div style={{ fontSize:'1.5rem', marginBottom:'6px' }}>💬</div>
          <div>No reviews yet. Be the first to review!</div>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
        </div>
      )}
    </div>
  );
}
