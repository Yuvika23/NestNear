// seed-expanded.js — 20+ PGs across multiple cities
// Works for ANY college — just change the coordinates
// Run: node seed-expanded.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const listings = [
  // ─── SRM KATTANKULATHUR (Potheri / SRM Nagar) ───────────────
  {
    title: "The Royal Inn Ladies PG",
    description: "One of the most popular girls PGs near SRM back gate in Potheri. Home-cooked meals, strict security, CCTV. Located in Narasimhan Nagar near TRS hostel. Always in high demand — book early.",
    rent: 7500, deposit: 15000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 0.3, availability: true, college: "SRM Kattankulathur",
    address: { street: "Plot 111, Anushya Street, Narasimhan Nagar", area: "Potheri", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0402, 12.8245] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.5, reviewCount: 38, verifiedCount: 10, isVerified: true
  },
  {
    title: "The Royal Inn Gents PG",
    description: "Right near SRM back gate in Narasimman Nagar. Clean rooms, well-maintained. Go-to for SRM boys every year. Fills fast.",
    rent: 6500, deposit: 13000, type: "PG", gender: "Male", sharingType: "Double",
    distanceFromCollege: 0.4, availability: true, college: "SRM Kattankulathur",
    address: { street: "Plot 137, Narasimman Nagar, Opp TRS Hostel", area: "Potheri", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0412, 12.8238] } },
    amenities: ["WiFi", "Geyser", "CCTV", "Power Backup", "Laundry"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.2, reviewCount: 27, verifiedCount: 8, isVerified: true
  },
  {
    title: "Maayaas Ladies Hostel",
    description: "A-star luxury ladies hostel, 0.5 km from Potheri Railway Station and SRM. Individual wardrobes, attached bathrooms, WiFi, dining included. 24/7 CCTV.",
    rent: 10000, deposit: 20000, type: "PG", gender: "Female", sharingType: "Single",
    distanceFromCollege: 0.5, availability: true, college: "SRM Kattankulathur",
    address: { street: "Near Potheri Railway Station", area: "Potheri", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0389, 12.8261] } },
    amenities: ["WiFi", "Meals", "AC", "Geyser", "CCTV", "Power Backup", "Laundry"],
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
    averageRating: 4.7, reviewCount: 21, verifiedCount: 7, isVerified: true
  },
  {
    title: "Sree Krishna Hostel (Potheri SK)",
    description: "Well-known boys hostel in Potheri. Affordable, South Indian meals, study-friendly. Known simply as 'Potheri SK'. Fills up every academic year.",
    rent: 5500, deposit: 11000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.6, availability: true, college: "SRM Kattankulathur",
    address: { street: "Annai Therasa Street", area: "Potheri", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0418, 12.8256] } },
    amenities: ["WiFi", "Meals", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.0, reviewCount: 34, verifiedCount: 9, isVerified: true
  },
  {
    title: "Sai Balaji Men's PG",
    description: "Budget-friendly boys PG in SRM Nagar. Walking distance from main gate. Clean rooms, fast WiFi, chill landlord. Popular with 1st and 2nd year SRM students.",
    rent: 5000, deposit: 10000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.5, availability: true, college: "SRM Kattankulathur",
    address: { street: "SRM Nagar, Kattankulathur", area: "SRM Nagar", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0431, 12.8210] } },
    amenities: ["WiFi", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
    averageRating: 3.9, reviewCount: 19, verifiedCount: 5, isVerified: true
  },
  {
    title: "KRS Hostel",
    description: "Long-standing hostel in SRM Nagar. Reasonable pricing, no-fuss stay close to campus. Good for budget-conscious students.",
    rent: 4500, deposit: 9000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.7, availability: true, college: "SRM Kattankulathur",
    address: { street: "SRM Nagar, Potheri", area: "SRM Nagar", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0438, 12.8220] } },
    amenities: ["WiFi", "Power Backup", "Geyser"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 3.7, reviewCount: 14, verifiedCount: 4, isVerified: true
  },
  {
    title: "Myroomie PG Hostel (SRM)",
    description: "Premium co-living near SRM in Padur. Gym, chill zone, WiFi, nutritious meals, housekeeping, biometric security. Best for students who want comfort + community.",
    rent: 11000, deposit: 22000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 2.1, availability: true, college: "SRM Kattankulathur",
    address: { street: "Padur, Near SRM University", area: "Padur", city: "Kattankulathur", pincode: "603103", location: { type: "Point", coordinates: [80.0589, 12.8312] } },
    amenities: ["WiFi", "AC", "Meals", "Gym", "Laundry", "CCTV", "Power Backup", "Parking"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.6, reviewCount: 18, verifiedCount: 6, isVerified: true
  },
  {
    title: "Zolo Stays — Potheri",
    description: "Modern co-living by Zolo near SRM Potheri campus. Private/duo/triple options. WiFi, DTH, power backup, housekeeping. Professionally managed.",
    rent: 8500, deposit: 17000, type: "PG", gender: "Any", sharingType: "Double",
    distanceFromCollege: 1.0, availability: true, college: "SRM Kattankulathur",
    address: { street: "Near SRM Institute of Science and Technology", area: "Potheri", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0421, 12.8271] } },
    amenities: ["WiFi", "AC", "Laundry", "CCTV", "Power Backup", "Meals"],
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
    averageRating: 4.3, reviewCount: 12, verifiedCount: 5, isVerified: true
  },
  {
    title: "Sri Murugan Ladies PG",
    description: "Homely ladies PG in Thaiyur, 1km from SRM. Run by a retired teacher — very safe, strict timing, excellent food. Preferred by girls from outside Tamil Nadu.",
    rent: 7000, deposit: 14000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 1.1, availability: true, college: "SRM Kattankulathur",
    address: { street: "Thaiyur Village Main Road", area: "Thaiyur", city: "Kattankulathur", pincode: "603209", location: { type: "Point", coordinates: [80.0521, 12.8189] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.4, reviewCount: 16, verifiedCount: 6, isVerified: true
  },
  {
    title: "Nandivaram Boys Flat Share",
    description: "3BHK flat in Guduvancheri for sharing. 3 rooms available. Fully furnished, near GST Road. No curfew, very chill environment. 15 mins from SRM by auto.",
    rent: 6000, deposit: 12000, type: "Flat", gender: "Male", sharingType: "Double",
    distanceFromCollege: 3.5, availability: true, college: "SRM Kattankulathur",
    address: { street: "Ganapathypuram, GST Road", area: "Guduvancheri", city: "Kattankulathur", pincode: "603202", location: { type: "Point", coordinates: [80.0598, 12.8456] } },
    amenities: ["WiFi", "AC", "Geyser", "Parking", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
    averageRating: 4.0, reviewCount: 8, verifiedCount: 3, isVerified: true
  },
  {
    title: "Budget Single Room — Potheri",
    description: "Cheapest single room option near SRM back gate. No frills — clean bed, fan, lock. Great for students on tight budget. Owner is super chill.",
    rent: 3500, deposit: 7000, type: "Room", gender: "Male", sharingType: "Single",
    distanceFromCollege: 0.2, availability: true, college: "SRM Kattankulathur",
    address: { street: "Potheri Bus Stop Road", area: "Potheri", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0402, 12.8240] } },
    amenities: ["WiFi", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 3.5, reviewCount: 9, verifiedCount: 3, isVerified: true
  },

  // ─── VIT VELLORE ─────────────────────────────────────────────
  {
    title: "Sri Balaji Girls PG",
    description: "Popular girls PG near VIT main gate in Katpadi. Home-cooked food, strict security, 10 mins walk to campus. Very popular with VIT CSE and ECE girls.",
    rent: 8000, deposit: 16000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 0.6, availability: true, college: "VIT Vellore",
    address: { street: "Katpadi Main Road", area: "Katpadi", city: "Vellore", pincode: "632014", location: { type: "Point", coordinates: [79.1325, 12.9698] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
    averageRating: 4.4, reviewCount: 29, verifiedCount: 8, isVerified: true
  },
  {
    title: "VIT Boys Hostel Annex — Katpadi",
    description: "Affordable boys PG right outside VIT campus. Triple sharing, South Indian meals, study-friendly. Very well-known among VIT students.",
    rent: 6000, deposit: 12000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.8, availability: true, college: "VIT Vellore",
    address: { street: "VIT Road, Katpadi", area: "Katpadi", city: "Vellore", pincode: "632014", location: { type: "Point", coordinates: [79.1298, 12.9712] } },
    amenities: ["WiFi", "Meals", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.1, reviewCount: 22, verifiedCount: 7, isVerified: true
  },

  // ─── ANNA UNIVERSITY CHENNAI ──────────────────────────────────
  {
    title: "Guindy Student PG — Boys",
    description: "Well-known boys PG near Anna University main gate. 5 mins walk to campus. Good WiFi, decent food, reasonable price. Seniors from Anna Univ have stayed here for years.",
    rent: 7000, deposit: 14000, type: "PG", gender: "Male", sharingType: "Double",
    distanceFromCollege: 0.4, availability: true, college: "Anna University",
    address: { street: "Sardar Patel Road", area: "Guindy", city: "Chennai", pincode: "600025", location: { type: "Point", coordinates: [80.2209, 13.0067] } },
    amenities: ["WiFi", "Meals", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.2, reviewCount: 31, verifiedCount: 9, isVerified: true
  },
  {
    title: "Kasturibai Ladies PG — Guindy",
    description: "Safe and quiet ladies PG near Anna University. Run by a retired professor — excellent food, strict but caring environment. Preferred by outstation girls.",
    rent: 8500, deposit: 17000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 0.5, availability: true, college: "Anna University",
    address: { street: "Kasturibai Nagar, Guindy", area: "Guindy", city: "Chennai", pincode: "600032", location: { type: "Point", coordinates: [80.2189, 13.0089] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.6, reviewCount: 24, verifiedCount: 8, isVerified: true
  },

  // ─── PSG COIMBATORE ──────────────────────────────────────────
  {
    title: "Peelamedu Boys PG",
    description: "Budget boys PG near PSG Tech in Peelamedu. 10 mins walk from campus. Clean rooms, fast WiFi. Very popular among PSG students for its affordable pricing.",
    rent: 5500, deposit: 11000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.7, availability: true, college: "PSG Tech",
    address: { street: "Avinashi Road", area: "Peelamedu", city: "Coimbatore", pincode: "641004", location: { type: "Point", coordinates: [77.0266, 11.0238] } },
    amenities: ["WiFi", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
    averageRating: 3.8, reviewCount: 17, verifiedCount: 5, isVerified: true
  },
  {
    title: "Sai Krishna Ladies Hostel — Coimbatore",
    description: "Comfortable ladies PG near PSG Tech. Home-cooked meals, attached bathrooms, strict security. Very popular with girls from other districts.",
    rent: 7000, deposit: 14000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 0.5, availability: true, college: "PSG Tech",
    address: { street: "Nanjundapuram Road, Peelamedu", area: "Peelamedu", city: "Coimbatore", pincode: "641004", location: { type: "Point", coordinates: [77.0289, 11.0256] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
    averageRating: 4.3, reviewCount: 20, verifiedCount: 6, isVerified: true
  },

  // ─── MANIPAL UNIVERSITY ──────────────────────────────────────
  {
    title: "Manipal Student Co-Living",
    description: "Modern co-living space near Manipal University. Single and double rooms, common study lounge, rooftop. High-speed WiFi, meals optional. Ideal for tech and medical students.",
    rent: 9000, deposit: 18000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 1.0, availability: true, college: "Manipal University",
    address: { street: "Madhav Nagar, Manipal", area: "Madhav Nagar", city: "Manipal", pincode: "576104", location: { type: "Point", coordinates: [74.7887, 13.3523] } },
    amenities: ["WiFi", "AC", "Geyser", "Laundry", "Power Backup", "CCTV"],
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
    averageRating: 4.5, reviewCount: 14, verifiedCount: 5, isVerified: true
  },

  // ─── BITS PILANI ─────────────────────────────────────────────
  {
    title: "Pilani Budget Boys PG",
    description: "Affordable boys PG near BITS Pilani campus. Clean rooms, basic amenities. Popular with BITS students who don't want to stay in hostel. Chill environment.",
    rent: 5000, deposit: 10000, type: "PG", gender: "Male", sharingType: "Double",
    distanceFromCollege: 0.8, availability: true, college: "BITS Pilani",
    address: { street: "Vidya Vihar Colony", area: "Pilani", city: "Pilani", pincode: "333031", location: { type: "Point", coordinates: [75.6042, 28.3674] } },
    amenities: ["WiFi", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 3.9, reviewCount: 11, verifiedCount: 4, isVerified: true
  },

  // ─── GENERIC — works for any city ───────────────────────────
  {
    title: "Student Haven PG",
    description: "Modern student PG near college. Well-furnished rooms, high-speed WiFi, common study room, and a rooftop chill zone. Both single and double sharing available.",
    rent: 8000, deposit: 16000, type: "PG", gender: "Any", sharingType: "Double",
    distanceFromCollege: 1.0, availability: true, college: "General",
    address: { street: "College Road", area: "University Area", city: "Your City", pincode: "000000", location: { type: "Point", coordinates: [80.0421, 12.8271] } },
    amenities: ["WiFi", "AC", "Geyser", "Laundry", "Power Backup", "CCTV"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.2, reviewCount: 0, verifiedCount: 0, isVerified: false
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    // Only delete seeded listings, not user-added ones
    await mongoose.connection.collection('listings').deleteMany({ isVerified: true });
    console.log('🗑️  Cleared old listings');
    await mongoose.connection.collection('listings').insertMany(listings);
    console.log(`✅ Inserted ${listings.length} PG listings across multiple cities`);
    console.log('\nCities covered:');
    console.log('  📍 Kattankulathur (SRM) — 11 PGs');
    console.log('  📍 Vellore (VIT) — 2 PGs');
    console.log('  📍 Chennai (Anna University) — 2 PGs');
    console.log('  📍 Coimbatore (PSG Tech) — 2 PGs');
    console.log('  📍 Manipal — 1 PG');
    console.log('  📍 Pilani (BITS) — 1 PG');
    console.log('\n🎉 Done! App now works for any college city.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
