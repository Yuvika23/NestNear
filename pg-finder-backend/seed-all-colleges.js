// seed-all-colleges.js
// Seeds PGs for SRM, VIT, Anna University, PSG Tech, Manipal, BITS Pilani
// Run: node seed-all-colleges.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const listings = [

  // ─── SRM KATTANKULATHUR ──────────────────────────────────────
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
    description: "Right near SRM back gate in Narasimman Nagar. Clean rooms, well-maintained. Go-to for SRM boys every year.",
    rent: 6500, deposit: 13000, type: "PG", gender: "Male", sharingType: "Double",
    distanceFromCollege: 0.4, availability: true, college: "SRM Kattankulathur",
    address: { street: "Plot 137, Narasimman Nagar, Opp TRS Hostel", area: "Potheri", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0412, 12.8238] } },
    amenities: ["WiFi", "Geyser", "CCTV", "Power Backup", "Laundry"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.2, reviewCount: 27, verifiedCount: 8, isVerified: true
  },
  {
    title: "Maayaas Ladies Hostel",
    description: "A-star luxury ladies hostel 0.5 km from Potheri Railway Station and SRM. Individual wardrobes, attached bathrooms, WiFi, dining included. 24/7 CCTV.",
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
    description: "Budget-friendly boys PG in SRM Nagar. Walking distance from main gate. Clean rooms, fast WiFi, chill landlord.",
    rent: 5000, deposit: 10000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.5, availability: true, college: "SRM Kattankulathur",
    address: { street: "SRM Nagar, Kattankulathur", area: "SRM Nagar", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0431, 12.8210] } },
    amenities: ["WiFi", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
    averageRating: 3.9, reviewCount: 19, verifiedCount: 5, isVerified: true
  },
  {
    title: "Myroomie PG Hostel (SRM)",
    description: "Premium co-living near SRM in Padur. Gym, chill zone, WiFi, nutritious meals, housekeeping, biometric security.",
    rent: 11000, deposit: 22000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 2.1, availability: true, college: "SRM Kattankulathur",
    address: { street: "Padur, Near SRM University", area: "Padur", city: "Kattankulathur", pincode: "603103", location: { type: "Point", coordinates: [80.0589, 12.8312] } },
    amenities: ["WiFi", "AC", "Meals", "Gym", "Laundry", "CCTV", "Power Backup", "Parking"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.6, reviewCount: 18, verifiedCount: 6, isVerified: true
  },
  {
    title: "Zolo Stays — Potheri",
    description: "Modern co-living by Zolo near SRM Potheri campus. Private/duo/triple options. WiFi, DTH, power backup, housekeeping.",
    rent: 8500, deposit: 17000, type: "PG", gender: "Any", sharingType: "Double",
    distanceFromCollege: 1.0, availability: true, college: "SRM Kattankulathur",
    address: { street: "Near SRM Institute of Science and Technology", area: "Potheri", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0421, 12.8271] } },
    amenities: ["WiFi", "AC", "Laundry", "CCTV", "Power Backup", "Meals"],
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
    averageRating: 4.3, reviewCount: 12, verifiedCount: 5, isVerified: true
  },
  {
    title: "KRS Hostel",
    description: "Long-standing hostel in SRM Nagar. Reasonable pricing, no-fuss stay close to campus.",
    rent: 4500, deposit: 9000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.7, availability: false, college: "SRM Kattankulathur",
    address: { street: "SRM Nagar, Potheri", area: "SRM Nagar", city: "Kattankulathur", pincode: "603203", location: { type: "Point", coordinates: [80.0438, 12.8220] } },
    amenities: ["WiFi", "Power Backup", "Geyser"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 3.7, reviewCount: 14, verifiedCount: 4, isVerified: true
  },

  // ─── VIT VELLORE ─────────────────────────────────────────────
  {
    title: "Sri Balaji Girls PG — Katpadi",
    description: "Most popular girls PG near VIT main gate. Home-cooked food, strict security, 10 mins walk to campus. Well-known among VIT CSE and ECE girls.",
    rent: 8000, deposit: 16000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 0.6, availability: true, college: "VIT Vellore",
    address: { street: "VIT Road, Katpadi", area: "Katpadi", city: "Vellore", pincode: "632014", location: { type: "Point", coordinates: [79.1325, 12.9698] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
    averageRating: 4.4, reviewCount: 29, verifiedCount: 8, isVerified: true
  },
  {
    title: "VIT Boys PG — Katpadi",
    description: "Affordable boys PG right outside VIT campus. Triple sharing, South Indian meals, study-friendly. Very well-known among VIT students.",
    rent: 6000, deposit: 12000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.8, availability: true, college: "VIT Vellore",
    address: { street: "Sathuvachari Main Road", area: "Sathuvachari", city: "Vellore", pincode: "632009", location: { type: "Point", coordinates: [79.1089, 12.9543] } },
    amenities: ["WiFi", "Meals", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.1, reviewCount: 22, verifiedCount: 7, isVerified: true
  },
  {
    title: "Zolo Student Stay — Vellore",
    description: "Professionally managed co-living near VIT. High-speed WiFi, meals, laundry, 24/7 security. Single and double rooms available.",
    rent: 9500, deposit: 19000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 1.2, availability: true, college: "VIT Vellore",
    address: { street: "Gandhinagar, Vellore", area: "Gandhinagar", city: "Vellore", pincode: "632006", location: { type: "Point", coordinates: [79.1445, 12.9823] } },
    amenities: ["WiFi", "AC", "Meals", "Laundry", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
    averageRating: 4.5, reviewCount: 15, verifiedCount: 5, isVerified: true
  },
  {
    title: "Budget Boys Room — Katpadi",
    description: "Cheapest option near VIT back gate. Clean room, basic amenities. Great for students on tight budget. No curfew, chill owner.",
    rent: 4000, deposit: 8000, type: "Room", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.3, availability: true, college: "VIT Vellore",
    address: { street: "Katpadi Railway Station Road", area: "Katpadi", city: "Vellore", pincode: "632007", location: { type: "Point", coordinates: [79.1298, 12.9712] } },
    amenities: ["WiFi", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 3.6, reviewCount: 11, verifiedCount: 3, isVerified: true
  },

  // ─── ANNA UNIVERSITY CHENNAI ──────────────────────────────────
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
  {
    title: "Guindy Student Boys PG",
    description: "Well-known boys PG near Anna University main gate. 5 mins walk to campus. Good WiFi, decent food, reasonable price.",
    rent: 7000, deposit: 14000, type: "PG", gender: "Male", sharingType: "Double",
    distanceFromCollege: 0.4, availability: true, college: "Anna University",
    address: { street: "Sardar Patel Road", area: "Guindy", city: "Chennai", pincode: "600025", location: { type: "Point", coordinates: [80.2209, 13.0067] } },
    amenities: ["WiFi", "Meals", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.2, reviewCount: 31, verifiedCount: 9, isVerified: true
  },
  {
    title: "Kotturpuram Premium PG",
    description: "Premium AC PG near Anna University in Kotturpuram. Single rooms, attached bathroom, study hall. Ideal for final year students.",
    rent: 11000, deposit: 22000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 1.1, availability: true, college: "Anna University",
    address: { street: "3rd Main Road, Kotturpuram", area: "Kotturpuram", city: "Chennai", pincode: "600085", location: { type: "Point", coordinates: [80.2423, 13.0145] } },
    amenities: ["WiFi", "AC", "Geyser", "Laundry", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
    averageRating: 4.5, reviewCount: 17, verifiedCount: 6, isVerified: true
  },
  {
    title: "Adyar Budget Flat Share",
    description: "3 BHK flat in Adyar for sharing near Anna University. Furnished, modular kitchen. Looking for serious students only.",
    rent: 7500, deposit: 15000, type: "Flat", gender: "Male", sharingType: "Double",
    distanceFromCollege: 1.5, availability: false, college: "Anna University",
    address: { street: "4th Avenue, Adyar", area: "Adyar", city: "Chennai", pincode: "600020", location: { type: "Point", coordinates: [80.2574, 13.0012] } },
    amenities: ["WiFi", "AC", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
    averageRating: 4.0, reviewCount: 8, verifiedCount: 3, isVerified: true
  },

  // ─── PSG TECH COIMBATORE ──────────────────────────────────────
  {
    title: "Sai Krishna Ladies Hostel — Peelamedu",
    description: "Comfortable ladies PG near PSG Tech. Home-cooked meals, attached bathrooms, strict security. Very popular with girls from other districts.",
    rent: 7000, deposit: 14000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 0.5, availability: true, college: "PSG Tech",
    address: { street: "Nanjundapuram Road, Peelamedu", area: "Peelamedu", city: "Coimbatore", pincode: "641004", location: { type: "Point", coordinates: [77.0289, 11.0256] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
    averageRating: 4.3, reviewCount: 20, verifiedCount: 6, isVerified: true
  },
  {
    title: "Peelamedu Boys PG",
    description: "Budget boys PG near PSG Tech. 10 mins walk from campus. Clean rooms, fast WiFi. Very popular for its affordable pricing.",
    rent: 5500, deposit: 11000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.7, availability: true, college: "PSG Tech",
    address: { street: "Avinashi Road, Peelamedu", area: "Peelamedu", city: "Coimbatore", pincode: "641004", location: { type: "Point", coordinates: [77.0266, 11.0238] } },
    amenities: ["WiFi", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
    averageRating: 3.8, reviewCount: 17, verifiedCount: 5, isVerified: true
  },
  {
    title: "Saravanampatti Co-Living",
    description: "Modern co-living space in Saravanampatti near PSG. High-speed WiFi, gym, common area. Perfect for tech students.",
    rent: 9000, deposit: 18000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 2.0, availability: true, college: "PSG Tech",
    address: { street: "Saravanampatti Main Road", area: "Saravanampatti", city: "Coimbatore", pincode: "641035", location: { type: "Point", coordinates: [77.0695, 11.0697] } },
    amenities: ["WiFi", "AC", "Gym", "Laundry", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.4, reviewCount: 12, verifiedCount: 4, isVerified: true
  },
  {
    title: "Ganapathy Budget Rooms",
    description: "Affordable rooms in Ganapathy area near PSG. No frills — clean bed, WiFi, fan. Great for students on tight budget.",
    rent: 4000, deposit: 8000, type: "Room", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 1.2, availability: true, college: "PSG Tech",
    address: { street: "Ganapathy Main Street", area: "Ganapathy", city: "Coimbatore", pincode: "641006", location: { type: "Point", coordinates: [77.0023, 11.0238] } },
    amenities: ["WiFi", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 3.5, reviewCount: 9, verifiedCount: 3, isVerified: true
  },

  // ─── MANIPAL UNIVERSITY ──────────────────────────────────────
  {
    title: "Manipal Student Co-Living",
    description: "Modern co-living space near Manipal University. Single and double rooms, common study lounge, rooftop. High-speed WiFi, meals optional.",
    rent: 9000, deposit: 18000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 1.0, availability: true, college: "Manipal University",
    address: { street: "Madhav Nagar, Manipal", area: "Madhav Nagar", city: "Manipal", pincode: "576104", location: { type: "Point", coordinates: [74.7887, 13.3523] } },
    amenities: ["WiFi", "AC", "Geyser", "Laundry", "Power Backup", "CCTV"],
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
    averageRating: 4.5, reviewCount: 14, verifiedCount: 5, isVerified: true
  },
  {
    title: "Manipal Boys Hostel Annex",
    description: "Popular boys PG near Manipal University campus. Basic amenities, good WiFi, South Indian meals. Trusted by students for years.",
    rent: 7000, deposit: 14000, type: "PG", gender: "Male", sharingType: "Double",
    distanceFromCollege: 0.6, availability: true, college: "Manipal University",
    address: { street: "Near MIT Campus, Manipal", area: "Madhav Nagar", city: "Manipal", pincode: "576104", location: { type: "Point", coordinates: [74.7923, 13.3498] } },
    amenities: ["WiFi", "Meals", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.1, reviewCount: 19, verifiedCount: 6, isVerified: true
  },
  {
    title: "Udupi Ladies PG",
    description: "Peaceful ladies PG in Udupi near Manipal. Home-cooked food, safe neighbourhood, good transport to campus.",
    rent: 7500, deposit: 15000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 2.5, availability: true, college: "Manipal University",
    address: { street: "Udupi Town, Near Bus Stand", area: "Udupi", city: "Udupi", pincode: "576101", location: { type: "Point", coordinates: [74.7421, 13.3409] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV"],
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
    averageRating: 4.2, reviewCount: 11, verifiedCount: 4, isVerified: true
  },

  // ─── BITS PILANI ─────────────────────────────────────────────
  {
    title: "Pilani Budget Boys PG",
    description: "Affordable boys PG near BITS Pilani campus. Clean rooms, basic amenities. Popular with BITS students who don't want to stay in hostel.",
    rent: 5000, deposit: 10000, type: "PG", gender: "Male", sharingType: "Double",
    distanceFromCollege: 0.8, availability: true, college: "BITS Pilani",
    address: { street: "Vidya Vihar Colony", area: "Vidya Vihar", city: "Pilani", pincode: "333031", location: { type: "Point", coordinates: [75.6042, 28.3674] } },
    amenities: ["WiFi", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 3.9, reviewCount: 11, verifiedCount: 4, isVerified: true
  },
  {
    title: "BITS Girls PG — Pilani",
    description: "Safe and comfortable girls PG near BITS Pilani. Home food, CCTV, strict security. Run by a local family for over 10 years.",
    rent: 6000, deposit: 12000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 0.5, availability: true, college: "BITS Pilani",
    address: { street: "Near BITS Main Gate, Pilani", area: "Pilani", city: "Pilani", pincode: "333031", location: { type: "Point", coordinates: [75.5989, 28.3712] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
    averageRating: 4.3, reviewCount: 16, verifiedCount: 6, isVerified: true
  },
  {
    title: "Pilani Co-Living Space",
    description: "Modern co-living for BITS students. Study rooms, fast WiFi, common kitchen. No curfew, professional management.",
    rent: 8000, deposit: 16000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 1.0, availability: true, college: "BITS Pilani",
    address: { street: "Pilani Town Center", area: "Pilani", city: "Pilani", pincode: "333031", location: { type: "Point", coordinates: [75.6089, 28.3645] } },
    amenities: ["WiFi", "AC", "Laundry", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
    averageRating: 4.4, reviewCount: 8, verifiedCount: 3, isVerified: true
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    // Only delete verified/seeded listings, keep user-added ones
    await mongoose.connection.collection('listings').deleteMany({ isVerified: true });
    console.log('🗑️  Cleared old seeded listings');
    await mongoose.connection.collection('listings').insertMany(listings);
    console.log(`✅ Inserted ${listings.length} PG listings across 6 colleges`);
    console.log('\nBreakdown:');
    console.log('  🏫 SRM Kattankulathur — 8 PGs');
    console.log('  🏫 VIT Vellore — 4 PGs');
    console.log('  🏫 Anna University — 4 PGs');
    console.log('  🏫 PSG Tech Coimbatore — 4 PGs');
    console.log('  🏫 Manipal University — 3 PGs');
    console.log('  🏫 BITS Pilani — 3 PGs');
    console.log('\n🎉 Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
