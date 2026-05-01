// src/App.jsx
import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useListings } from './hooks/useListings';
import { listingsAPI } from './services/api';
import ListingCard from './components/ListingCard';
import ListingModal from './components/ListingModal';
import SearchFilters from './components/SearchFilters';
import AddListingForm from './components/AddListingForm';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import ProfileModal from './components/ProfileModal';

const MapView = lazy(() => import('./components/MapView'));

// ── COLLEGES DATABASE ─────────────────────────────────────────
const COLLEGES = [
  { label: 'SRM Kattankulathur', lat: 12.8231, lng: 80.0444, areas: ['Potheri','SRM Nagar','Thaiyur','Guduvancheri','Kalavakkam','Kelambakkam','Padur'] },
  { label: 'VIT Vellore',        lat: 12.9698, lng: 79.1325, areas: ['Katpadi','Vellore','Sathuvachari','Gandhinagar'] },
  { label: 'Anna University',    lat: 13.0067, lng: 80.2209, areas: ['Guindy','Adyar','Kotturpuram','Velachery'] },
  { label: 'PSG Tech',           lat: 11.0238, lng: 77.0266, areas: ['Peelamedu','Coimbatore','Saravanampatti','Ganapathy'] },
  { label: 'Manipal University', lat: 13.3523, lng: 74.7887, areas: ['Manipal','Udupi','Madhav Nagar'] },
  { label: 'BITS Pilani',        lat: 28.3674, lng: 75.6042, areas: ['Pilani','Vidya Vihar'] },
  { label: 'Other College',      lat: 12.8231, lng: 80.0444, areas: [] },
];

// Area coordinates per college
const AREA_COORDS = {
  'potheri':        [80.0412, 12.8256],
  'srm nagar':      [80.0431, 12.8210],
  'thaiyur':        [80.0521, 12.8189],
  'guduvancheri':   [80.0598, 12.8456],
  'kalavakkam':     [80.0678, 12.8312],
  'kelambakkam':    [80.0983, 12.7927],
  'padur':          [80.0589, 12.8312],
  'katpadi':        [79.1325, 12.9698],
  'vellore':        [79.1325, 12.9698],
  'sathuvachari':   [79.1089, 12.9543],
  'gandhinagar':    [79.1445, 12.9823],
  'guindy':         [80.2209, 13.0067],
  'adyar':          [80.2574, 13.0012],
  'kotturpuram':    [80.2423, 13.0145],
  'velachery':      [80.2205, 12.9816],
  'peelamedu':      [77.0266, 11.0238],
  'coimbatore':     [76.9558, 11.0168],
  'saravanampatti': [77.0695, 11.0697],
  'ganapathy':      [77.0023, 11.0238],
  'manipal':        [74.7887, 13.3523],
  'udupi':          [74.7421, 13.3409],
  'madhav nagar':   [74.7887, 13.3523],
  'pilani':         [75.6042, 28.3674],
  'vidya vihar':    [75.6042, 28.3674],
};

function getCoordsByArea(area) {
  const key = area?.toLowerCase().trim();
  return AREA_COORDS[key] || null;
}

function HomePage() {
  const { user, logout } = useAuth();

  // ── UI state ────────────────────────────────────────────────
  const [filters, setFilters]              = useState({ gender: '' });
  const [selectedListing, setSelected]    = useState(null);
  const [saved, setSaved]                 = useState(new Set());
  const [showAddForm, setShowAddForm]     = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [viewMode, setViewMode]           = useState('grid');
  const [showAdmin, setShowAdmin]         = useState(false);
  const [showProfile, setShowProfile]     = useState(false);

  // ── College + location state ─────────────────────────────────
  const [selectedCollege, setSelectedCollege] = useState(COLLEGES[0]);
  const [showCollegePicker, setShowCollegePicker] = useState(false);
  const [activeLocation, setActiveLocation]   = useState({ lat: COLLEGES[0].lat, lng: COLLEGES[0].lng, label: COLLEGES[0].label });
  const [radius, setRadius]                   = useState(5);
  const [areaInput, setAreaInput]             = useState('');
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);

  // ── Listings state ───────────────────────────────────────────
  const [nearbyListings, setNearbyListings] = useState([]);
  const [locationStatus, setLocationStatus] = useState('idle');

  const { listings: allListings, usingFallback, refetch } = useListings(
    useMemo(() => { const { search, ...rest } = filters; return rest; }, [filters])
  );

  // ── Core fetch function ──────────────────────────────────────
  const fetchNearby = useCallback(async (lat, lng, r) => {
    setLocationStatus('loading');
    try {
      const data = await listingsAPI.getNearby(lat, lng, r);
      setNearbyListings(data.listings || []);
      setLocationStatus('success');
    } catch (err) {
      console.warn('Nearby failed, using fallback:', err.message);
      setNearbyListings(allListings);
      setLocationStatus('fallback');
    }
  }, [allListings]);

  // ── Auto-fetch on mount ──────────────────────────────────────
  useEffect(() => {
    fetchNearby(COLLEGES[0].lat, COLLEGES[0].lng, 5);
  }, []);

  // ── College change ───────────────────────────────────────────
  const handleCollegeChange = (college) => {
    setSelectedCollege(college);
    setShowCollegePicker(false);
    setAreaInput('');
    const loc = { lat: college.lat, lng: college.lng, label: college.label };
    setActiveLocation(loc);
    fetchNearby(college.lat, college.lng, radius);
  };

  // ── Radius change ────────────────────────────────────────────
  const handleRadiusChange = (r) => {
    setRadius(r);
    fetchNearby(activeLocation.lat, activeLocation.lng, r);
  };

  // ── Area search ──────────────────────────────────────────────
  const handleAreaSelect = (area) => {
    const coords = getCoordsByArea(area);
    if (coords) {
      const loc = { lat: coords[1], lng: coords[0], label: area };
      setActiveLocation(loc);
      setAreaInput(area);
      setShowAreaSuggestions(false);
      fetchNearby(coords[1], coords[0], radius);
    }
  };

  const handleAreaInputChange = (val) => {
    setAreaInput(val);
    setShowAreaSuggestions(val.length > 0);
  };

  const handleAreaClear = () => {
    setAreaInput('');
    setShowAreaSuggestions(false);
    const loc = { lat: selectedCollege.lat, lng: selectedCollege.lng, label: selectedCollege.label };
    setActiveLocation(loc);
    fetchNearby(selectedCollege.lat, selectedCollege.lng, radius);
  };

  // ── GPS location ─────────────────────────────────────────────
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'Your Location' };
        setActiveLocation(loc);
        setAreaInput('');
        fetchNearby(pos.coords.latitude, pos.coords.longitude, radius);
      },
      () => { setLocationStatus('error'); alert('Could not get location. Please allow access.'); },
      { timeout: 10000 }
    );
  };

  // ── Area suggestions filtered by college ─────────────────────
  const areaSuggestions = useMemo(() => {
    const areas = selectedCollege.areas.length > 0 ? selectedCollege.areas : Object.keys(AREA_COORDS).map(k => k.charAt(0).toUpperCase() + k.slice(1));
    if (!areaInput) return areas;
    return areas.filter(a => a.toLowerCase().includes(areaInput.toLowerCase()));
  }, [areaInput, selectedCollege]);

  // ── Client-side text search ──────────────────────────────────
  const displayed = useMemo(() => {
    let base = nearbyListings;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      base = base.filter(l =>
        l.title?.toLowerCase().includes(q) ||
        l.address?.area?.toLowerCase().includes(q) ||
        l.address?.city?.toLowerCase().includes(q) ||
        l.amenities?.some(a => a.toLowerCase().includes(q))
      );
    }
    return base;
  }, [nearbyListings, filters.search]);

  const toggleSave = (id) => setSaved(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const handleAddPGClick = () => {
    if (!user) { setPendingAction('addPG'); setShowAuthModal(true); }
    else setShowAddForm(true);
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'addPG') { setShowAddForm(true); setPendingAction(null); }
  };

  const handleListingAdded = () => {
    refetch();
    fetchNearby(activeLocation.lat, activeLocation.lng, radius);
  };

  const handleOpenById = (id) => {
    const found = [...nearbyListings, ...allListings].find(l => l._id === id);
    if (found) setSelected(found);
  };

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="logo">Nest<span>Near</span></div>
        <div className="nav-links">
          <button className="add-pg-btn" onClick={handleAddPGClick}>+ Add your PG</button>
          {user ? (
            <div className="user-pill">
              {user?.role === 'admin' && (
                <button className="nav-btn filled" style={{ fontSize:'0.8rem', padding:'6px 12px' }}
                  onClick={() => setShowAdmin(true)}>📊 Admin</button>
              )}
              <span style={{ cursor:'pointer' }} onClick={() => setShowProfile(true)}>
                👤 {user.name?.split(' ')[0]}
              </span>
              <button className="nav-btn outline" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="nav-btn outline" onClick={() => setShowAuthModal(true)}>Login</button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div>
          <div className="hero-tag">🎓 For students · Any college · Any city</div>
          <h1>Find your <em>perfect</em> PG near campus</h1>
          <p>Verified by real students. No brokers. No scams. Works for any college in India.</p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">{locationStatus === 'loading' ? '...' : displayed.length}</div>
              <div className="stat-label">PGs Found</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">{radius} km</div>
              <div className="stat-label">Search Radius</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">₹0</div>
              <div className="stat-label">Broker Fees</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mini-card">
            <div className="mini-icon orange">🏠</div>
            <div className="mini-info">
              <div className="mini-title">The Royal Inn Ladies PG</div>
              <div className="mini-sub">Potheri · 0.3 km · ⭐ 4.5</div>
            </div>
            <div className="mini-price">₹7,500</div>
          </div>
          <div className="mini-card">
            <div className="mini-icon green">✅</div>
            <div className="mini-info">
              <div className="mini-title">Verified by 10 SRM students</div>
              <div className="mini-sub">Meals · WiFi · CCTV</div>
            </div>
            <div className="mini-price">Girls</div>
          </div>
          <div className="mini-card">
            <div className="mini-icon red">📍</div>
            <div className="mini-info">
              <div className="mini-title">Budget Room, Potheri</div>
              <div className="mini-sub">Back Gate · 0.2 km · ⭐ 3.5</div>
            </div>
            <div className="mini-price">₹3,500</div>
          </div>
        </div>
      </div>

      <div className="main">

        {/* COLLEGE PICKER */}
        <div className="college-picker-wrap">
          <div style={{ fontSize:'0.78rem', color:'var(--ink2)', fontWeight:600, marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.4px' }}>
            Your College
          </div>
          <div style={{ position:'relative', display:'inline-block' }}>
            <button className="college-picker-btn" onClick={() => setShowCollegePicker(p => !p)}>
              🎓 {selectedCollege.label} ▾
            </button>
            {showCollegePicker && (
              <div className="college-dropdown">
                {COLLEGES.map(c => (
                  <div key={c.label}
                    className={`college-option ${c.label === selectedCollege.label ? 'active' : ''}`}
                    onClick={() => handleCollegeChange(c)}>
                    {c.label === selectedCollege.label ? '✓ ' : ''}{c.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LOCATION BAR */}
        <div className="location-bar">
          {/* Area search */}
          <div className="area-search-wrap">
            <div className="area-input-row">
              <span className="area-pin">📍</span>
              <input
                className="area-input" type="text"
                placeholder={`Search area near ${selectedCollege.label.split(' ')[0]}...`}
                value={areaInput}
                onChange={e => handleAreaInputChange(e.target.value)}
                onFocus={() => setShowAreaSuggestions(true)}
                onBlur={() => setTimeout(() => setShowAreaSuggestions(false), 200)}
              />
              {areaInput && <button className="area-clear" onClick={handleAreaClear}>✕</button>}
            </div>
            {showAreaSuggestions && areaSuggestions.length > 0 && (
              <div className="area-suggestions">
                {areaSuggestions.map(area => (
                  <div key={area} className="area-suggestion-item"
                    onMouseDown={() => handleAreaSelect(area)}>
                    📍 {area}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Radius */}
          <div className="radius-wrap">
            <span className="radius-label">within</span>
            <select className="radius-select-main" value={radius}
              onChange={e => handleRadiusChange(Number(e.target.value))}>
              <option value={1}>1 km</option>
              <option value={2}>2 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
              <option value={8}>8 km</option>
              <option value={10}>10 km</option>
            </select>
          </div>

          <button className="location-btn" onClick={handleUseMyLocation}>🎯 Use my location</button>
        </div>

        <div className="active-location-pill">
          Showing PGs within <strong>{radius} km</strong> of <strong>{activeLocation.label}</strong>
          {locationStatus === 'loading' && <span className="loc-loading"> · searching...</span>}
          {locationStatus === 'error' && <span style={{ color:'var(--accent)' }}> · location error</span>}
        </div>

        {usingFallback && (
          <div style={{ background:'#FFF3E0', border:'1px solid #FFB74D', borderRadius:'10px', padding:'10px 16px', marginBottom:'16px', fontSize:'0.85rem', color:'#E65100' }}>
            ⚠️ Backend offline — showing demo data.
          </div>
        )}

        <SearchFilters filters={filters} onChange={setFilters} />

        {/* SECTION HEADER */}
        <div className="section-header">
          <div className="section-title">PGs near {activeLocation.label}</div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div className="count-badge">{displayed.length} result{displayed.length !== 1 ? 's' : ''}</div>
            <div className="view-toggle">
              <button className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>⊞ Grid</button>
              <button className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>🗺 Map</button>
            </div>
            <button className="add-pg-btn" style={{ fontSize:'0.8rem', padding:'6px 14px' }} onClick={handleAddPGClick}>+ Add PG</button>
          </div>
        </div>

        {/* CONTENT */}
        {locationStatus === 'loading' ? (
          <div className="empty"><div className="empty-icon">📍</div><h3>Finding PGs nearby...</h3></div>
        ) : displayed.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <h3>No PGs found within {radius} km</h3>
            <p>Try a bigger radius, different area, or{' '}
              <span style={{ color:'var(--accent)', cursor:'pointer', fontWeight:600 }} onClick={handleAddPGClick}>
                add the first PG here!
              </span>
            </p>
          </div>
        ) : viewMode === 'map' ? (
          <Suspense fallback={<div className="empty"><div className="empty-icon">🗺️</div><h3>Loading map...</h3></div>}>
            <MapView listings={displayed} onOpen={setSelected} />
          </Suspense>
        ) : (
          <div className="listings-grid">
            {displayed.map(l => (
              <ListingCard key={l._id} listing={l} onOpen={setSelected}
                onSaveToggle={toggleSave} isSaved={saved.has(l._id)} />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      <ListingModal listing={selectedListing} onClose={() => setSelected(null)} onOpenListing={handleOpenById} />
      {showAddForm && <AddListingForm onClose={() => setShowAddForm(false)} onSuccess={handleListingAdded} />}
      {showAuthModal && <AuthModal onClose={() => { setShowAuthModal(false); setPendingAction(null); }} onSuccess={handleAuthSuccess} />}
      {showAdmin && user?.role === 'admin' && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      {showProfile && user && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}

export default function App() {
  return <AuthProvider><HomePage /></AuthProvider>;
}
