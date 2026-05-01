// src/hooks/useListings.js
import { useState, useEffect, useCallback } from 'react';
import { listingsAPI } from '../services/api';

// Fallback data when backend is offline (for demo / development)
const FALLBACK_LISTINGS = [
  { _id:'1', title:"Sri Lakshmi PG for Girls", type:"PG", gender:"Female", rent:6500, deposit:13000, sharingType:"Double", distanceFromCollege:0.4, address:{area:"Guindy", city:"Chennai"}, averageRating:4.3, reviewCount:18, isVerified:true, verifiedCount:5, amenities:["WiFi","Meals","Geyser","CCTV","Power Backup"], description:"Well-maintained PG near Anna University. Home-cooked South Indian meals, strict security, peaceful study environment.", photos:["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop"] },
  { _id:'2', title:"Sai Krishna Boys Hostel", type:"PG", gender:"Male", rent:5000, deposit:10000, sharingType:"Triple", distanceFromCollege:0.5, address:{area:"Porur", city:"Chennai"}, averageRating:3.8, reviewCount:11, isVerified:true, verifiedCount:4, amenities:["WiFi","Geyser","Laundry","Power Backup"], description:"Budget-friendly boys PG with all basic amenities. 5 mins walk from college.", photos:["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop"] },
  { _id:'3', title:"Green Valley Residency", type:"PG", gender:"Any", rent:9500, deposit:19000, sharingType:"Single", distanceFromCollege:0.8, address:{area:"Velachery", city:"Chennai"}, averageRating:4.7, reviewCount:24, isVerified:true, verifiedCount:7, amenities:["WiFi","AC","Geyser","Laundry","CCTV","Power Backup","Parking"], description:"Premium AC single rooms. High-speed fiber WiFi, separate study hall, attached bathroom.", photos:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop"] },
  { _id:'4', title:"Friends Flat — 3 BHK Sharing", type:"Flat", gender:"Male", rent:7000, deposit:14000, sharingType:"Double", distanceFromCollege:1.2, address:{area:"Adyar", city:"Chennai"}, averageRating:4.1, reviewCount:7, isVerified:true, verifiedCount:3, amenities:["WiFi","AC","Geyser","Parking","Power Backup"], description:"3 BHK flat for sharing. Fully furnished, modular kitchen, great terrace view.", photos:["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop"] },
  { _id:'5', title:"Kavitha Aunty's PG", type:"PG", gender:"Female", rent:7500, deposit:15000, sharingType:"Double", distanceFromCollege:0.3, address:{area:"T. Nagar", city:"Chennai"}, averageRating:4.9, reviewCount:42, isVerified:true, verifiedCount:12, amenities:["WiFi","Meals","Geyser","CCTV"], description:"The most famous PG near campus. Home-cooked food is legendary. Feels exactly like home.", photos:["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop"] },
  { _id:'6', title:"Budget Room Near Back Gate", type:"Room", gender:"Male", rent:3500, deposit:7000, sharingType:"Triple", distanceFromCollege:0.2, address:{area:"Chromepet", city:"Chennai"}, averageRating:3.5, reviewCount:9, isVerified:true, verifiedCount:3, amenities:["WiFi","Power Backup"], description:"Cheapest option near college back gate. Clean room, chill landlord, no curfew.", photos:["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop"] },
  { _id:'7', title:"Nova Co-Living Space", type:"PG", gender:"Any", rent:11000, deposit:22000, sharingType:"Single", distanceFromCollege:1.5, address:{area:"Sholinganallur", city:"Chennai"}, averageRating:4.5, reviewCount:15, isVerified:true, verifiedCount:6, amenities:["WiFi","AC","Geyser","Laundry","Gym","CCTV","Power Backup","Parking"], description:"Modern co-living for students. Common lounge, bean bags, whiteboard walls, 200Mbps WiFi.", photos:["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop"] },
  { _id:'8', title:"Rajesh Uncle's Boys PG", type:"PG", gender:"Male", rent:5500, deposit:11000, sharingType:"Double", distanceFromCollege:0.6, address:{area:"Anna Nagar", city:"Chennai"}, averageRating:4.2, reviewCount:31, isVerified:true, verifiedCount:9, amenities:["WiFi","Meals","Geyser","Power Backup"], description:"Reliable PG running for 15 years. South Indian breakfast included. Very safe neighbourhood.", photos:["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop"] },
];

export function useListings(filters = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listingsAPI.getAll(filters);
      setListings(data.listings);
      setUsingFallback(false);
    } catch (err) {
      // If backend is down, use fallback data so UI still works
      console.warn('Backend offline, using fallback data');
      setListings(FALLBACK_LISTINGS);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  return { listings, loading, error, usingFallback, refetch: fetchListings };
}
