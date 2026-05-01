// src/components/AddListingForm.jsx
// Lets any student/owner add a PG listing directly from the app

import { useState } from 'react';
import { listingsAPI } from '../services/api';

const AMENITY_OPTIONS = [
  'WiFi', 'AC', 'Meals', 'Geyser', 'Laundry',
  'CCTV', 'Parking', 'Gym', 'Power Backup'
];

const AREA_COORDS = {
  'potheri':      [80.0412, 12.8256],
  'srm nagar':    [80.0431, 12.8210],
  'thaiyur':      [80.0521, 12.8189],
  'guduvancheri': [80.0598, 12.8456],
  'kalavakkam':   [80.0678, 12.8312],
  'kelambakkam':  [80.0983, 12.7927],
  'padur':        [80.0589, 12.8312],
  'katpadi':      [79.1325, 12.9698],
  'guindy':       [80.2209, 13.0067],
  'peelamedu':    [77.0266, 11.0238],
  'kattankulathur': [80.0444, 12.8231],
};

function getCoordinates(area, city) {
  const key = area?.toLowerCase().trim();
  const cityKey = city?.toLowerCase().trim();
  return AREA_COORDS[key] || AREA_COORDS[cityKey] || [80.0421, 12.8256]; // default: Potheri
}

const INITIAL = {
  title: '', description: '', rent: '', deposit: '',
  type: 'PG', gender: 'Any', sharingType: 'Double',
  distanceFromCollege: '', college: '',
  street: '', area: '', city: '', pincode: '',
  amenities: [], photos: ''
};

export default function AddListingForm({ onClose, onSuccess }) {
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleAmenity = (a) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a]
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.title || !form.rent || !form.city || !form.area) {
      setError('Please fill in Title, Rent, City and Area at minimum.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        title:               form.title,
        description:         form.description,
        rent:                Number(form.rent),
        deposit:             Number(form.deposit) || 0,
        type:                form.type,
        gender:              form.gender,
        sharingType:         form.sharingType,
        distanceFromCollege: Number(form.distanceFromCollege) || 0,
        college:             form.college,
        amenities:           form.amenities,
        photos:              form.photos ? [form.photos] : [],
        availability:        true,
        address: {
          street:  form.street,
          area:    form.area,
          city:    form.city,
          pincode: form.pincode,
          location: { type: 'Point', coordinates: getCoordinates(form.area, form.city) }
        }
      };
      await listingsAPI.create(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add listing. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay open" onClick={e => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1.5px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.4rem', fontWeight:800 }}>🏠 Add your PG</div>
          <button className="modal-close" style={{ position:'static' }} onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight:'75vh', overflowY:'auto' }}>
          {error && (
            <div style={{ background:'#FFEBEE', border:'1px solid #EF9A9A', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px', fontSize:'0.85rem', color:'#C62828' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="form-section-title">Basic Info</div>
          <div className="form-group">
            <label>PG Name *</label>
            <input className="form-input" placeholder="e.g. Sri Lakshmi PG for Girls" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input" rows={3} placeholder="Describe the PG — location, vibe, what makes it special..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Monthly Rent (₹) *</label>
              <input className="form-input" type="number" placeholder="6000" value={form.rent} onChange={e => set('rent', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Deposit (₹)</label>
              <input className="form-input" type="number" placeholder="12000" value={form.deposit} onChange={e => set('deposit', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
                <option>PG</option><option>Flat</option><option>Room</option><option>Hostel</option>
              </select>
            </div>
            <div className="form-group">
              <label>For</label>
              <select className="form-input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option>Any</option><option>Male</option><option>Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sharing</label>
              <select className="form-input" value={form.sharingType} onChange={e => set('sharingType', e.target.value)}>
                <option>Single</option><option>Double</option><option>Triple</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-section-title">Location</div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input className="form-input" placeholder="e.g. Kattankulathur" value={form.city} onChange={e => set('city', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Area *</label>
              <input className="form-input" placeholder="e.g. Potheri" value={form.area} onChange={e => set('area', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Street / Address</label>
              <input className="form-input" placeholder="Street name or landmark" value={form.street} onChange={e => set('street', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input className="form-input" placeholder="603203" value={form.pincode} onChange={e => set('pincode', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Distance from College (km)</label>
              <input className="form-input" type="number" step="0.1" placeholder="0.5" value={form.distanceFromCollege} onChange={e => set('distanceFromCollege', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Nearest College</label>
              <input className="form-input" placeholder="e.g. SRM Kattankulathur" value={form.college} onChange={e => set('college', e.target.value)} />
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section-title">Amenities</div>
          <div className="amenity-picker">
            {AMENITY_OPTIONS.map(a => (
              <button
                key={a}
                className={`amenity-pick-btn ${form.amenities.includes(a) ? 'selected' : ''}`}
                onClick={() => toggleAmenity(a)}
                type="button"
              >
                {a}
              </button>
            ))}
          </div>

          {/* Photo */}
          <div className="form-section-title">Photo</div>
          <div className="form-group">
            <label>Photo URL (paste an image link)</label>
            <input className="form-input" placeholder="https://..." value={form.photos} onChange={e => set('photos', e.target.value)} />
            <div style={{ fontSize:'0.78rem', color:'var(--ink2)', marginTop:'4px' }}>
              Tip: Upload to <a href="https://imgbb.com" target="_blank" rel="noreferrer" style={{ color:'var(--accent)' }}>imgbb.com</a> for free and paste the link here
            </div>
          </div>

          {/* Submit */}
          <button
            className="modal-cta primary"
            style={{ width:'100%', marginTop:'8px' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '⏳ Adding...' : '✅ Add PG Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}
