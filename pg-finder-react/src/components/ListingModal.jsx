// src/components/ListingModal.jsx
import { useEffect, useState } from 'react';
import { mlAPI } from '../services/mlApi';
import { listingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewSection from './ReviewSection';
import SemesterBadge from './SemesterBadge';

const GENDER_CONFIG = {
  Female: { label: '👩 Girls', cls: 'gender-f' },
  Male:   { label: '👨 Boys',  cls: 'gender-m' },
  Any:    { label: '🤝 Any',   cls: 'gender-a' },
};

const VERDICT_COLORS = {
  'Great Deal 🟢':    { bg: '#E8F5E9', color: '#2D6A4F', border: '#2D6A4F' },
  'Fair Price 🟡':    { bg: '#FFF8EC', color: '#B8700A', border: '#E8A020' },
  'Slightly High 🟠': { bg: '#FFF3E0', color: '#E65100', border: '#FFB74D' },
  'Overpriced 🔴':    { bg: '#FFEBEE', color: '#C62828', border: '#EF9A9A' },
};

export default function ListingModal({ listing, onClose, onOpenListing }) {
  const { user } = useAuth();
  const isOpen = !!listing;
  const [similarPGs, setSimilarPGs]   = useState([]);
  const [priceInfo, setPriceInfo]     = useState(null);
  const [mlLoading, setMlLoading]     = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');

  useEffect(() => {
    if (!listing) { setSimilarPGs([]); setPriceInfo(null); setSaveMsg(''); return; }
    const id = listing._id;
    setMlLoading(true);
    mlAPI.trackInteraction('guest-user', id, 'view').catch(() => {});
    Promise.all([
      mlAPI.getSimilar(id, 4),
      mlAPI.getPriceCheck(id)
    ]).then(([simData, priceData]) => {
      if (simData?.recommendations) setSimilarPGs(simData.recommendations);
      if (priceData?.price_analysis) setPriceInfo(priceData.price_analysis);
    }).catch(() => {}).finally(() => setMlLoading(false));
  }, [listing?._id]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!listing) return null;

  const g = GENDER_CONFIG[listing.gender] || GENDER_CONFIG['Any'];
  const area = `${listing.address?.area || ''}, ${listing.address?.city || ''}`;
  const verdictStyle = priceInfo ? (VERDICT_COLORS[priceInfo.verdict] || {}) : {};

  const handleSave = async () => {
    if (!user) { setSaveMsg('Please login to save.'); return; }
    try {
      await listingsAPI.save(listing._id);
      mlAPI.trackInteraction('guest-user', listing._id, 'save').catch(() => {});
      setSaveMsg('🔖 Saved!');
    } catch { setSaveMsg('Could not save. Try again.'); }
  };

  const handleContact = () => {
    mlAPI.trackInteraction('guest-user', listing._id, 'contact').catch(() => {});
    const owner = listing.owner;
    if (owner?.phone) {
      alert(`📞 Contact Owner\n\nName: ${owner.name}\nPhone: ${owner.phone}\nEmail: ${owner.email}`);
    } else {
      alert(`📞 Contact Owner\n\nName: ${owner?.name || 'Owner'}\nEmail: ${owner?.email || 'Not provided'}\n\n(Owner hasn't added a phone number yet)`);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={e => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <div className="modal-img-wrap">
          <img className="modal-img"
            src={listing.photos?.[0]?.startsWith('http')
              ? listing.photos[0]
              : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'}
            alt={listing.title}
            onError={e => e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'}
          />
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Badges */}
          import SemesterBadge from './SemesterBadge';
          <div style={{ marginBottom:'20px' }}>
            <SemesterBadge value={listing.semesterAvailability} showAvailability />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', flexWrap:'wrap' }}>
            {listing.isVerified && <span className="badge verified">✅ Verified by {listing.verifiedCount} students</span>}
            <span className={`badge ${g.cls}`}>{g.label}</span>
            <span className="badge type">{listing.type}</span>
            <span style={{
              padding:'4px 10px', borderRadius:'40px', fontSize:'0.7rem', fontWeight:700,
              background: listing.availability ? '#E8F5E9' : '#FFEBEE',
              color: listing.availability ? '#2D6A4F' : '#C62828',
              border: `1px solid ${listing.availability ? '#2D6A4F' : '#EF9A9A'}`
            }}>
              {listing.availability ? '🟢 Vacancies Available' : '🔴 Full'}
            </span>
          </div>

          <div className="modal-title">{listing.title}</div>
          <div className="modal-location">📍 {area}</div>

          {/* Stats */}
          <div className="modal-grid">
            <div className="modal-stat"><div className="modal-stat-label">Monthly Rent</div><div className="modal-stat-val">₹{listing.rent?.toLocaleString()}</div></div>
            <div className="modal-stat"><div className="modal-stat-label">Deposit</div><div className="modal-stat-val">₹{listing.deposit?.toLocaleString()}</div></div>
            <div className="modal-stat"><div className="modal-stat-label">From College</div><div className="modal-stat-val">{listing.distanceFromCollege} km</div></div>
            <div className="modal-stat"><div className="modal-stat-label">Sharing</div><div className="modal-stat-val">{listing.sharingType}</div></div>
          </div>

          {/* Price fairness */}
          {priceInfo && (
            <div style={{ background: verdictStyle.bg || '#F5F0E8', border:`1.5px solid ${verdictStyle.border || '#E2DDD4'}`, borderRadius:'12px', padding:'14px 16px', marginBottom:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                <div style={{ fontWeight:700, fontSize:'0.88rem', color: verdictStyle.color }}>🤖 AI Price Analysis</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontWeight:800, fontSize:'1.1rem', color: verdictStyle.color }}>{priceInfo.verdict}</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
                <div style={{ textAlign:'center' }}><div style={{ fontSize:'0.7rem', color:'#5A5248', marginBottom:'2px' }}>THIS PG</div><div style={{ fontWeight:700 }}>₹{priceInfo.this_rent?.toLocaleString()}</div></div>
                <div style={{ textAlign:'center' }}><div style={{ fontSize:'0.7rem', color:'#5A5248', marginBottom:'2px' }}>AVG SIMILAR</div><div style={{ fontWeight:700 }}>₹{priceInfo.avg_similar_rent?.toLocaleString()}</div></div>
                <div style={{ textAlign:'center' }}><div style={{ fontSize:'0.7rem', color:'#5A5248', marginBottom:'2px' }}>BEATS ON PRICE</div><div style={{ fontWeight:700 }}>{priceInfo.percentile}%</div></div>
              </div>
            </div>
          )}

          <div className="modal-desc">{listing.description}</div>

          {/* Amenities */}
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1rem', fontWeight:700, marginBottom:'10px' }}>Amenities</div>
          <div className="modal-amenities">
            {listing.amenities?.map(a => <span key={a} className="modal-amenity">{a}</span>)}
          </div>

          {/* Similar PGs */}
          {(mlLoading || similarPGs.length > 0) && (
            <div className="similar-section">
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1rem', fontWeight:700, marginBottom:'10px' }}>🤖 Similar PGs you might like</div>
              {mlLoading ? (
                <div style={{ color:'#5A5248', fontSize:'0.85rem' }}>Finding similar PGs...</div>
              ) : (
                <div className="similar-grid">
                  {similarPGs.map(pg => (
                    <div key={pg.id} className="similar-card" onClick={() => onOpenListing?.(pg.id)}>
                      <div className="similar-title">{pg.title}</div>
                      <div className="similar-meta">
                        <span>📍 {pg.area}</span>
                        <span style={{ color:'#C84B31', fontWeight:700 }}>₹{pg.rent?.toLocaleString()}</span>
                      </div>
                      {pg.rating > 0 && <div style={{ fontSize:'0.75rem', color:'#5A5248' }}>⭐ {pg.rating}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── REVIEWS ── */}
          <ReviewSection listingId={listing._id} />

          {/* Actions */}
          {saveMsg && (
            <div style={{ textAlign:'center', fontSize:'0.85rem', marginBottom:'8px',
              color: saveMsg.includes('🔖') ? '#2D6A4F' : '#C84B31' }}>
              {saveMsg}
            </div>
          )}
          <div className="modal-actions">
            <button className="modal-cta primary" onClick={handleContact}>📞 Contact Owner</button>
            <button className="modal-cta secondary" onClick={handleSave}>🔖 Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
