// src/components/SearchFilters.jsx
import { getCurrentSemesterLabel, getCurrentSemester } from '../utils/semester';

export default function SearchFilters({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });
  const currentSem = getCurrentSemester();
  const currentSemLabel = getCurrentSemesterLabel();

  return (
    <div className="search-section">
      <div className="search-row">
        <input
          className="search-input"
          type="text"
          placeholder="🔍  Search by name, area or amenity..."
          value={filters.search || ''}
          onChange={e => set('search', e.target.value)}
        />
        <button className="search-btn">Search</button>
      </div>
      <div className="filter-row">
        {['', 'Male', 'Female', 'Any'].map(g => (
          <button
            key={g || 'all'}
            className={`filter-chip ${filters.gender === g ? 'active' : ''}`}
            onClick={() => set('gender', g)}
          >
            {g === '' ? 'All' : g === 'Male' ? '👨 Boys' : g === 'Female' ? '👩 Girls' : '🤝 Any'}
          </button>
        ))}

        <select className="filter-chip" value={filters.type || ''} onChange={e => set('type', e.target.value)}>
          <option value="">All Types</option>
          <option value="PG">PG</option>
          <option value="Flat">Flat</option>
          <option value="Room">Room</option>
          <option value="Hostel">Hostel</option>
        </select>

        <select className="filter-chip" value={filters.maxRent || ''} onChange={e => set('maxRent', e.target.value)}>
          <option value="">Any Budget</option>
          <option value="5000">Under ₹5,000</option>
          <option value="7000">Under ₹7,000</option>
          <option value="10000">Under ₹10,000</option>
        </select>

        <select className="filter-chip" value={filters.sort || ''} onChange={e => set('sort', e.target.value)}>
          <option value="">Sort: Newest</option>
          <option value="rent_asc">Price: Low → High</option>
          <option value="rent_desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
          <option value="distance">Nearest First</option>
        </select>

        <button
          className={`filter-chip ${filters.verified ? 'active' : ''}`}
          onClick={() => set('verified', filters.verified ? '' : 'true')}
        >
          ✅ Verified Only
        </button>

        <button
          className={`filter-chip ${filters.availability === 'true' ? 'active' : ''}`}
          onClick={() => set('availability', filters.availability === 'true' ? '' : 'true')}
        >
          🟢 Vacancies Only
        </button>

        {/* Semester filter */}
        <button
          className={`filter-chip semester-chip ${filters.semester === currentSem ? 'active' : ''}`}
          onClick={() => set('semester', filters.semester === currentSem ? '' : currentSem)}
          title={`Show only PGs available this semester`}
        >
          📅 {currentSemLabel} Only
        </button>
      </div>
    </div>
  );
}
