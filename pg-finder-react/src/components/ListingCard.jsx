// src/components/ListingCard.jsx
import { useState } from 'react';
import { listingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SemesterBadge from './SemesterBadge';
import { isAvailableNow } from '../utils/semester';

const GENDER_CONFIG = {
  Female: { label: '👩 Girls', cls: 'gender-f' },
  Male:   { label: '👨 Boys',  cls: 'gender-m' },
  Any:    { label: '🤝 Any',   cls: 'gender-a' },
};

export default function ListingCard({ listing, onOpen, onSaveToggle, isSaved }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const g = GENDER_CONFIG[listing.gender] || GENDER_CONFIG['Any'];
  const area = `${listing.address?.area || ''}, ${listing.address?.city || ''}`;
  const availableNow = isAvailableNow(listing.semesterAvailability);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) { alert('Please login to save listings'); return; }
    setSaving(true);
    try {
      await listingsAPI.save(listing._id);
      onSaveToggle(listing._id);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`pg-card ${!availableNow ? 'card-dim' : ''}`} onClick={() => onOpen(listing)}>
      <div className="card-img-wrap">
        <img
          className="card-img"
          src={listing.photos?.[0]?.startsWith('http')
            ? listing.photos[0]
            : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'}
          alt={listing.title}
          loading="lazy"
          onError={e => e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'}
        />
        <div className="card-badges">
          {listing.isVerified && <span className="badge verified">✅ Verified</span>}
          <span className="badge type">{listing.type}</span>
          <span className={`badge ${g.cls}`}>{g.label}</span>
        </div>
        <button
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card-body">
        <div className="card-title">{listing.title}</div>
        <div className="card-area">📍 {area}</div>
        <div className="card-meta">
          <div className="card-rent">
            ₹{listing.rent?.toLocaleString()} <span>/month</span>
          </div>
          {listing.averageRating > 0 && (
            <div className="card-rating">
              <span className="stars">⭐</span>
              <span className="score">{listing.averageRating}</span>
              <span className="count">({listing.reviewCount})</span>
            </div>
          )}
        </div>
        <div className="amenities">
          {listing.amenities?.slice(0, 4).map(a => (
            <span key={a} className="amenity-tag">{a}</span>
          ))}
          {listing.amenities?.length > 4 && (
            <span className="amenity-tag">+{listing.amenities.length - 4}</span>
          )}
        </div>

        {/* Vacancy badge */}
        <div style={{ marginBottom: '10px' }}>
          {listing.availability ? (
            <span className="vacancy-badge available">🟢 Vacancies Available</span>
          ) : (
            <span className="vacancy-badge full">🔴 Full — No Vacancies</span>
          )}
        </div>

        {/* Semester badge */}
        <div style={{ marginBottom: '10px' }}>
          <SemesterBadge value={listing.semesterAvailability} showAvailability size="small" />
        </div>

        <div className="card-footer">
          <div>
            <div className="distance">🚶 {listing.distanceFromCollege} km from college</div>
            <div className="sharing">{listing.sharingType} sharing · ₹{listing.deposit?.toLocaleString()} deposit</div>
          </div>
          <button className="view-btn">View →</button>
        </div>
      </div>
    </div>
  );
}
