// src/components/MapView.jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Color-coded icons by gender
const createIcon = (color) => L.divIcon({
  className: '',
  html: `
    <div style="
      background:${color};
      width:32px; height:32px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize:   [32, 32],
  iconAnchor: [16, 32],
  popupAnchor:[0, -36],
});

const ICONS = {
  Female: createIcon('#C84B31'),  // red
  Male:   createIcon('#1A64B4'),  // blue
  Any:    createIcon('#6450A0'),  // purple
};

// Auto-fit map to show all markers
function FitBounds({ listings }) {
  const map = useMap();
  useEffect(() => {
    const valid = listings.filter(l => {
      const c = l.address?.location?.coordinates;
      return c && c[0] !== 0 && c[1] !== 0;
    });
    if (valid.length > 0) {
      const bounds = valid.map(l => [
        l.address.location.coordinates[1],
        l.address.location.coordinates[0]
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [listings, map]);
  return null;
}

export default function MapView({ listings, onOpen }) {
  // SRM as default center
  const SRM = [12.8231, 80.0444];

  const validListings = listings.filter(l => {
    const c = l.address?.location?.coordinates;
    return c && c[0] !== 0 && c[1] !== 0;
  });

  return (
    <div className="map-wrap">
      <MapContainer
        center={SRM}
        zoom={14}
        style={{ height: '500px', width: '100%', borderRadius: '16px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds listings={validListings} />

        {/* SRM College marker */}
        <Marker
          position={SRM}
          icon={L.divIcon({
            className: '',
            html: `<div style="background:#2D6A4F;color:#fff;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);font-family:'DM Sans',sans-serif;">🏫 SRM</div>`,
            iconAnchor: [30, 10],
          })}
        >
          <Popup>SRM Institute of Science and Technology</Popup>
        </Marker>

        {/* PG markers */}
        {validListings.map(listing => {
          const [lng, lat] = listing.address.location.coordinates;
          const icon = ICONS[listing.gender] || ICONS['Any'];
          return (
            <Marker key={listing._id} position={[lat, lng]} icon={icon}>
              <Popup minWidth={220}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", padding:'4px' }}>
                  {/* Verified badge */}
                  {listing.isVerified && (
                    <div style={{ fontSize:'11px', color:'#2D6A4F', fontWeight:700, marginBottom:'4px' }}>
                      ✅ Verified
                    </div>
                  )}
                  {/* Title */}
                  <div style={{ fontWeight:700, fontSize:'14px', marginBottom:'4px', lineHeight:1.3 }}>
                    {listing.title}
                  </div>
                  {/* Area */}
                  <div style={{ fontSize:'12px', color:'#5A5248', marginBottom:'8px' }}>
                    📍 {listing.address?.area}, {listing.address?.city}
                  </div>
                  {/* Stats row */}
                  <div style={{ display:'flex', gap:'10px', marginBottom:'8px' }}>
                    <span style={{ fontSize:'13px', fontWeight:700, color:'#C84B31' }}>
                      ₹{listing.rent?.toLocaleString()}/mo
                    </span>
                    {listing.averageRating > 0 && (
                      <span style={{ fontSize:'12px', color:'#B8700A' }}>
                        ⭐ {listing.averageRating}
                      </span>
                    )}
                    <span style={{ fontSize:'12px', color:'#5A5248' }}>
                      🚶 {listing.distanceFromCollege}km
                    </span>
                  </div>
                  {/* Gender + type */}
                  <div style={{ fontSize:'11px', color:'#5A5248', marginBottom:'10px' }}>
                    {listing.gender === 'Female' ? '👩 Girls' : listing.gender === 'Male' ? '👨 Boys' : '🤝 Any'}
                    {' · '}{listing.type}{' · '}{listing.sharingType} sharing
                  </div>
                  {/* Amenities */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'10px' }}>
                    {listing.amenities?.slice(0,4).map(a => (
                      <span key={a} style={{ background:'#F5F0E8', padding:'2px 8px', borderRadius:'20px', fontSize:'10px', color:'#5A5248' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                  {/* View button */}
                  <button
                    onClick={() => onOpen(listing)}
                    style={{
                      width:'100%', padding:'8px', background:'#C84B31', color:'#fff',
                      border:'none', borderRadius:'8px', fontWeight:700, fontSize:'12px',
                      cursor:'pointer', fontFamily:"'DM Sans',sans-serif"
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-item"><span style={{ background:'#C84B31' }} className="legend-dot"></span> Girls</div>
        <div className="legend-item"><span style={{ background:'#1A64B4' }} className="legend-dot"></span> Boys</div>
        <div className="legend-item"><span style={{ background:'#6450A0' }} className="legend-dot"></span> Any</div>
        <div className="legend-item"><span style={{ background:'#2D6A4F' }} className="legend-dot"></span> College</div>
      </div>
    </div>
  );
}
