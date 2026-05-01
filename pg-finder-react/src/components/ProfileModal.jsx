// src/components/ProfileModal.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, listingsAPI } from '../services/api';

const TABS = ['profile', 'saved', 'my-pgs', 'reviews'];

export default function ProfileModal({ onClose }) {
  const { user, logout } = useAuth();
  const [tab, setTab]           = useState('profile');
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState('');
  const [savedPGs, setSavedPGs] = useState([]);
  const [myPGs, setMyPGs]       = useState([]);

  const [form, setForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    college: user?.college || '',
    year:    user?.year    || '',
  });

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });

  const set    = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setPw  = (k, v) => setPwForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (tab === 'saved') fetchSaved();
    if (tab === 'my-pgs') fetchMyPGs();
  }, [tab]);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const data = await authAPI.getMe();
      setSavedPGs(data.user?.savedListings || []);
    } catch { setSavedPGs([]); }
    finally { setLoading(false); }
  };

  const fetchMyPGs = async () => {
    setLoading(true);
    try {
      const data = await listingsAPI.getAll();
      const mine = (data.listings || []).filter(l => l.owner?._id === user?._id || l.owner === user?._id);
      setMyPGs(mine);
    } catch { setMyPGs([]); }
    finally { setLoading(false); }
  };

  const handleUpdateProfile = async () => {
    setLoading(true); setMsg('');
    try {
      const token = localStorage.getItem('token');
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${BASE_URL}/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg('✅ Profile updated successfully!');
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (pwForm.newPw !== pwForm.confirm) { setMsg('❌ New passwords do not match.'); return; }
    if (pwForm.newPw.length < 6) { setMsg('❌ Password must be at least 6 characters.'); return; }
    setLoading(true); setMsg('');
    try {
      const token = localStorage.getItem('token');
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg('✅ Password changed! Please login again.');
      setPwForm({ current: '', newPw: '', confirm: '' });
      setTimeout(() => { logout(); onClose(); }, 2000);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally { setLoading(false); }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await listingsAPI.delete(id);
      setMyPGs(prev => prev.filter(l => l._id !== id));
      setMsg('✅ Listing deleted.');
    } catch { setMsg('❌ Could not delete.'); }
  };

  const avatar = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <div className="modal-overlay open" onClick={e => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal" style={{ maxWidth:'560px' }}>

        {/* Header */}
        <div className="auth-header">
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div className="profile-avatar-large">{avatar}</div>
            <div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.2rem', fontWeight:800 }}>{user?.name}</div>
              <div style={{ fontSize:'0.8rem', color:'var(--ink2)' }}>{user?.email} · {user?.role}</div>
            </div>
          </div>
          <button className="modal-close" style={{ position:'static' }} onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="auth-tabs" style={{ overflowX:'auto' }}>
          {[
            { key:'profile',  label:'👤 Profile' },
            { key:'saved',    label:'🔖 Saved PGs' },
            { key:'my-pgs',   label:'🏠 My Listings' },
          ].map(t => (
            <button key={t.key} className={`auth-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => { setTab(t.key); setMsg(''); }}
              style={{ whiteSpace:'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="modal-body" style={{ maxHeight:'65vh', overflowY:'auto' }}>
          {msg && (
            <div style={{
              background: msg.startsWith('✅') ? '#E8F5E9' : '#FFEBEE',
              border: `1px solid ${msg.startsWith('✅') ? '#2D6A4F' : '#EF9A9A'}`,
              color: msg.startsWith('✅') ? '#2D6A4F' : '#C62828',
              borderRadius:'10px', padding:'10px 14px', marginBottom:'16px', fontSize:'0.85rem', fontWeight:600
            }}>{msg}</div>
          )}

          {/* ── PROFILE TAB ── */}
          {tab === 'profile' && (
            <>
              <div className="form-section-title">Personal Info</div>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" placeholder="10-digit number" value={form.phone}
                  onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>College</label>
                  <input className="form-input" placeholder="Your college" value={form.college}
                    onChange={e => set('college', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <select className="form-input" value={form.year} onChange={e => set('year', e.target.value)}>
                    <option value="">Select</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
              <button className="auth-submit-btn" onClick={handleUpdateProfile} disabled={loading}>
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </button>

              <div className="form-section-title">Change Password</div>
              <div className="form-group">
                <label>Current Password</label>
                <input className="form-input" type="password" value={pwForm.current}
                  onChange={e => setPw('current', e.target.value)} />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input className="form-input" type="password" value={pwForm.newPw}
                  onChange={e => setPw('newPw', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input className="form-input" type="password" value={pwForm.confirm}
                  onChange={e => setPw('confirm', e.target.value)} />
              </div>
              <button className="modal-cta secondary" style={{ width:'100%' }}
                onClick={handleChangePassword} disabled={loading}>
                🔑 Change Password
              </button>

              <div style={{ marginTop:'24px', paddingTop:'16px', borderTop:'1px solid var(--border)' }}>
                <button onClick={() => { logout(); onClose(); }}
                  style={{ background:'none', border:'none', color:'var(--accent)', fontWeight:600, cursor:'pointer', fontSize:'0.88rem', fontFamily:"'DM Sans',sans-serif" }}>
                  🚪 Logout
                </button>
              </div>
            </>
          )}

          {/* ── SAVED PGs TAB ── */}
          {tab === 'saved' && (
            loading ? <div className="empty"><div className="empty-icon">⏳</div><h3>Loading...</h3></div>
            : savedPGs.length === 0 ? (
              <div className="no-reviews">
                <div style={{ fontSize:'2rem', marginBottom:'8px' }}>🔖</div>
                <div style={{ fontWeight:600, marginBottom:'4px' }}>No saved PGs yet</div>
                <div style={{ fontSize:'0.82rem' }}>Click the 🤍 button on any listing to save it</div>
              </div>
            ) : (
              <div className="profile-pg-list">
                {savedPGs.map(pg => (
                  <div key={pg._id || pg} className="profile-pg-card">
                    <div className="profile-pg-title">{pg.title || 'Saved PG'}</div>
                    {pg.rent && <div className="profile-pg-meta">₹{pg.rent?.toLocaleString()}/mo · {pg.address?.area}</div>}
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── MY LISTINGS TAB ── */}
          {tab === 'my-pgs' && (
            loading ? <div className="empty"><div className="empty-icon">⏳</div><h3>Loading...</h3></div>
            : myPGs.length === 0 ? (
              <div className="no-reviews">
                <div style={{ fontSize:'2rem', marginBottom:'8px' }}>🏠</div>
                <div style={{ fontWeight:600, marginBottom:'4px' }}>No listings yet</div>
                <div style={{ fontSize:'0.82rem' }}>Click "+ Add your PG" to list a PG</div>
              </div>
            ) : (
              <div className="profile-pg-list">
                {myPGs.map(pg => (
                  <div key={pg._id} className="profile-pg-card">
                    <div>
                      <div className="profile-pg-title">{pg.title}</div>
                      <div className="profile-pg-meta">
                        ₹{pg.rent?.toLocaleString()}/mo · {pg.address?.area} ·{' '}
                        <span style={{ color: pg.availability ? '#2D6A4F' : '#C84B31', fontWeight:600 }}>
                          {pg.availability ? '🟢 Available' : '🔴 Full'}
                        </span>
                      </div>
                    </div>
                    <button className="admin-action-btn delete" onClick={() => handleDeleteListing(pg._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
