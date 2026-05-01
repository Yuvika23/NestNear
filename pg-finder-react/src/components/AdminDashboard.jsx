// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function adminRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...options
  });
  return res.json();
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-card-icon" style={{ color }}>{icon}</div>
      <div className="stat-card-val">{value ?? '...'}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

export default function AdminDashboard({ onClose }) {
  const { user } = useAuth();
  const [tab, setTab]           = useState('overview');
  const [listings, setListings] = useState([]);
  const [users, setUsers]       = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [lData, uData] = await Promise.all([
        adminRequest('/listings'),
        adminRequest('/admin/users'),
      ]);
      setListings(lData.listings || []);
      setUsers(uData.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await listingsAPI.delete(id);
      setListings(prev => prev.filter(l => l._id !== id));
      setMsg('✅ Listing deleted');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('❌ Could not delete'); }
  };

  const handleToggleAvailability = async (listing) => {
    try {
      await adminRequest(`/listings/${listing._id}`, {
        method: 'PUT',
        body: JSON.stringify({ availability: !listing.availability })
      });
      setListings(prev => prev.map(l =>
        l._id === listing._id ? { ...l, availability: !l.availability } : l
      ));
      setMsg(`✅ Marked as ${!listing.availability ? 'Available' : 'Unavailable'}`);
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('❌ Could not update'); }
  };

  const handleVerify = async (listing) => {
    try {
      await adminRequest(`/listings/${listing._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isVerified: !listing.isVerified })
      });
      setListings(prev => prev.map(l =>
        l._id === listing._id ? { ...l, isVerified: !l.isVerified } : l
      ));
      setMsg(`✅ Verification ${!listing.isVerified ? 'granted' : 'removed'}`);
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('❌ Could not update'); }
  };

  // Stats
  const totalListings  = listings.length;
  const verifiedCount  = listings.filter(l => l.isVerified).length;
  const availableCount = listings.filter(l => l.availability).length;
  const totalUsers     = users.length;
  const ownerCount     = users.filter(u => u.role === 'owner').length;
  const avgRent        = listings.length
    ? Math.round(listings.reduce((s, l) => s + (l.rent || 0), 0) / listings.length)
    : 0;

  const genderBreakdown = {
    Female: listings.filter(l => l.gender === 'Female').length,
    Male:   listings.filter(l => l.gender === 'Male').length,
    Any:    listings.filter(l => l.gender === 'Any').length,
  };

  const cityBreakdown = listings.reduce((acc, l) => {
    const city = l.address?.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="admin-overlay" onClick={e => e.target.classList.contains('admin-overlay') && onClose()}>
      <div className="admin-panel">
        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="admin-title">📊 Admin Dashboard</div>
            <div className="admin-sub">Welcome, {user?.name} · All data live from MongoDB</div>
          </div>
          <button className="modal-close" style={{ position:'static' }} onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['overview', 'listings', 'users'].map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}>
              {t === 'overview' ? '📊 Overview' : t === 'listings' ? '🏠 Listings' : '👥 Users'}
            </button>
          ))}
        </div>

        {msg && <div className="admin-msg">{msg}</div>}

        <div className="admin-body">
          {loading ? (
            <div className="empty"><div className="empty-icon">⏳</div><h3>Loading data...</h3></div>
          ) : tab === 'overview' ? (
            <>
              {/* Stat cards */}
              <div className="stat-cards-grid">
                <StatCard icon="🏠" label="Total PGs"       value={totalListings}  color="#C84B31" />
                <StatCard icon="✅" label="Verified"        value={verifiedCount}  color="#2D6A4F" />
                <StatCard icon="🟢" label="Available"       value={availableCount} color="#E8A020" />
                <StatCard icon="👥" label="Total Users"     value={totalUsers}     color="#1A64B4" />
                <StatCard icon="🏡" label="PG Owners"       value={ownerCount}     color="#6450A0" />
                <StatCard icon="₹"  label="Avg Rent"        value={`₹${avgRent.toLocaleString()}`} color="#C84B31" />
              </div>

              {/* Gender breakdown */}
              <div className="admin-section-title">Gender Breakdown</div>
              <div className="breakdown-bar-wrap">
                {Object.entries(genderBreakdown).map(([g, count]) => (
                  <div key={g} className="breakdown-item">
                    <div className="breakdown-label">
                      {g === 'Female' ? '👩 Girls' : g === 'Male' ? '👨 Boys' : '🤝 Any'}
                    </div>
                    <div className="breakdown-bar-bg">
                      <div className="breakdown-bar-fill" style={{
                        width: totalListings ? `${(count/totalListings)*100}%` : '0%',
                        background: g === 'Female' ? '#C84B31' : g === 'Male' ? '#1A64B4' : '#6450A0'
                      }} />
                    </div>
                    <div className="breakdown-count">{count}</div>
                  </div>
                ))}
              </div>

              {/* City breakdown */}
              <div className="admin-section-title">PGs by City</div>
              <div className="city-grid">
                {Object.entries(cityBreakdown).sort((a,b) => b[1]-a[1]).map(([city, count]) => (
                  <div key={city} className="city-card">
                    <div className="city-name">📍 {city}</div>
                    <div className="city-count">{count} PG{count !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>

              {/* Recent listings */}
              <div className="admin-section-title">Recently Added</div>
              <div className="recent-list">
                {[...listings].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0,5).map(l => (
                  <div key={l._id} className="recent-item">
                    <div>
                      <div className="recent-title">{l.title}</div>
                      <div className="recent-meta">{l.address?.area} · ₹{l.rent?.toLocaleString()} · {l.gender}</div>
                    </div>
                    <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                      {l.isVerified && <span className="badge verified" style={{ fontSize:'0.7rem' }}>✅</span>}
                      {!l.availability && <span style={{ fontSize:'0.75rem', color:'#C84B31', fontWeight:600 }}>Unavailable</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : tab === 'listings' ? (
            <>
              <div className="admin-section-title">{listings.length} Total Listings</div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>PG Name</th>
                      <th>Area</th>
                      <th>Rent</th>
                      <th>Gender</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map(l => (
                      <tr key={l._id}>
                        <td>
                          <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{l.title}</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--ink2)' }}>{l.type} · {l.sharingType}</div>
                        </td>
                        <td style={{ fontSize:'0.85rem' }}>{l.address?.area}</td>
                        <td style={{ fontWeight:700, color:'var(--accent)' }}>₹{l.rent?.toLocaleString()}</td>
                        <td style={{ fontSize:'0.82rem' }}>
                          {l.gender === 'Female' ? '👩' : l.gender === 'Male' ? '👨' : '🤝'} {l.gender}
                        </td>
                        <td style={{ fontSize:'0.85rem' }}>
                          {l.averageRating > 0 ? `⭐ ${l.averageRating}` : '—'}
                        </td>
                        <td>
                          <span className={`status-badge ${l.availability ? 'available' : 'unavailable'}`}>
                            {l.availability ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                            <button className="admin-action-btn verify"
                              onClick={() => handleVerify(l)}>
                              {l.isVerified ? '❌ Unverify' : '✅ Verify'}
                            </button>
                            <button className="admin-action-btn toggle"
                              onClick={() => handleToggleAvailability(l)}>
                              {l.availability ? '🔒 Hide' : '🔓 Show'}
                            </button>
                            <select className="semester-select"
                              value={l.semesterAvailability || 'yearround'}
                              onChange={async (e) => {
                                await adminRequest(`/listings/${l._id}`, {
                                  method: 'PUT',
                                  body: JSON.stringify({ semesterAvailability: e.target.value })
                                });
                                setListings(prev => prev.map(x =>
                                  x._id === l._id ? { ...x, semesterAvailability: e.target.value } : x
                                ));
                                setMsg('✅ Semester updated');
                                setTimeout(() => setMsg(''), 2000);
                              }}>
                              <option value="odd">Odd Sem</option>
                              <option value="even">Even Sem</option>
                              <option value="both">Both Sems</option>
                              <option value="yearround">Year Round</option>
                            </select>
                            <button className="admin-action-btn delete"
                              onClick={() => handleDelete(l._id)}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="admin-section-title">{users.length} Registered Users</div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>College</th>
                      <th>Year</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight:600, fontSize:'0.88rem' }}>
                          {u.name}
                          {u.role === 'admin' && <span style={{ marginLeft:'6px', fontSize:'0.7rem', background:'#C84B31', color:'#fff', padding:'1px 6px', borderRadius:'10px' }}>admin</span>}
                        </td>
                        <td style={{ fontSize:'0.82rem', color:'var(--ink2)' }}>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </td>
                        <td style={{ fontSize:'0.82rem' }}>{u.college || '—'}</td>
                        <td style={{ fontSize:'0.82rem' }}>{u.year ? `Year ${u.year}` : '—'}</td>
                        <td style={{ fontSize:'0.8rem', color:'var(--ink2)' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-IN', { month:'short', year:'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
