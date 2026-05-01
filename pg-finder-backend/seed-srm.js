// seed-srm.js — Real PGs near SRM Kattankulathur
// Run: node seed-srm.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const listings = [
  {
    title: "The Royal Inn Ladies PG",
    description: "One of the most popular girls PGs near SRM back gate in Potheri. Well-secured premises with CCTV, home-cooked meals, and a warm community feel. Located in Narasimhan Nagar near TRS hostel. Always in high demand — book early.",
    rent: 7500, deposit: 15000, type: "PG", gender: "Female", sharingType: "Double",
    distanceFromCollege: 0.3, availability: true,
    address: { street: "Plot 111, Anushya Street, Narasimhan Nagar, Near SRM TRS Back Gate", area: "Potheri", city: "Kattankulathur", pincode: "603203",
      location: { type: "Point", coordinates: [80.0402, 12.8245] } },
    amenities: ["WiFi", "Meals", "Geyser", "CCTV", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.5, reviewCount: 38, verifiedCount: 10, isVerified: true
  },
  {
    title: "The Royal Inn Gents PG",
    description: "Sister property of the famous Royal Inn, this gents PG is right near SRM back gate in Narasimman Nagar, Potheri. Convenient access to college, clean rooms, and a well-maintained facility. A go-to for SRM boys every year.",
    rent: 6500, deposit: 13000, type: "PG", gender: "Male", sharingType: "Double",
    distanceFromCollege: 0.4, availability: true,
    address: { street: "Plot 137, Narasimman Nagar, Opp TRS Hostel, Thailavaram", area: "Potheri", city: "Kattankulathur", pincode: "603203",
      location: { type: "Point", coordinates: [80.0412, 12.8238] } },
    amenities: ["WiFi", "Geyser", "CCTV", "Power Backup", "Laundry"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.2, reviewCount: 27, verifiedCount: 8, isVerified: true
  },
  {
    title: "Maayaas Ladies Hostel",
    description: "A-star category luxury ladies hostel in Potheri, just 0.5 km from Potheri Railway Station and SRM. Premium amenities — individual wardrobes, study tables, shower rooms, attached bathrooms, free high-speed WiFi. Dining included. Highly secure with 24/7 CCTV.",
    rent: 10000, deposit: 20000, type: "PG", gender: "Female", sharingType: "Single",
    distanceFromCollege: 0.5, availability: true,
    address: { street: "Near Potheri Railway Station", area: "Potheri", city: "Kattankulathur", pincode: "603203",
      location: { type: "Point", coordinates: [80.0389, 12.8261] } },
    amenities: ["WiFi", "Meals", "AC", "Geyser", "CCTV", "Power Backup", "Laundry"],
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"],
    averageRating: 4.7, reviewCount: 21, verifiedCount: 7, isVerified: true
  },
  {
    title: "Sree Krishna Hostel (Potheri SK)",
    description: "Well-known boys hostel in Potheri, popular among SRM students for years. Affordable pricing, South Indian meals, and a study-friendly atmosphere. Known in the area simply as 'Potheri SK'. Fills up fast every academic year.",
    rent: 5500, deposit: 11000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.6, availability: true,
    address: { street: "Annai Therasa Street", area: "Potheri", city: "Kattankulathur", pincode: "603203",
      location: { type: "Point", coordinates: [80.0418, 12.8256] } },
    amenities: ["WiFi", "Meals", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 4.0, reviewCount: 34, verifiedCount: 9, isVerified: true
  },
  {
    title: "Sai Balaji Men's PG",
    description: "Reliable and budget-friendly boys PG in SRM Nagar, Potheri. Walking distance from college main gate. Clean rooms, fast WiFi, and a chill landlord. Very popular with first and second year SRM students.",
    rent: 5000, deposit: 10000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.5, availability: true,
    address: { street: "SRM Nagar, Kattankulathur", area: "SRM Nagar", city: "Kattankulathur", pincode: "603203",
      location: { type: "Point", coordinates: [80.0431, 12.8210] } },
    amenities: ["WiFi", "Geyser", "Power Backup"],
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
    averageRating: 3.9, reviewCount: 19, verifiedCount: 5, isVerified: true
  },
  {
    title: "KRS Hostel",
    description: "Long-standing hostel in SRM Nagar near Potheri. Decent rooms with basic amenities, known for its reasonable pricing and proximity to SRM. Good for students who want a no-fuss, affordable stay close to campus.",
    rent: 4500, deposit: 9000, type: "PG", gender: "Male", sharingType: "Triple",
    distanceFromCollege: 0.7, availability: true,
    address: { street: "SRM Nagar, Potheri, Kattankulathur", area: "SRM Nagar", city: "Kattankulathur", pincode: "603203",
      location: { type: "Point", coordinates: [80.0438, 12.8220] } },
    amenities: ["WiFi", "Power Backup", "Geyser"],
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    averageRating: 3.7, reviewCount: 14, verifiedCount: 4, isVerified: true
  },
  {
    title: "Myroomie PG Hostel (SRM)",
    description: "Premium co-living PG near SRM University in Padur. Loaded with amenities — gym, chill zone, high-speed WiFi, nutritious meals, professional housekeeping, 24/7 CCTV and biometric security. Ideal for students who want hostel-like community with premium comfort.",
    rent: 11000, deposit: 22000, type: "PG", gender: "Any", sharingType: "Single",
    distanceFromCollege: 2.1, availability: true,
    address: { street: "Padur, Near SRM University", area: "Padur", city: "Kattankulathur", pincode: "603103",
      location: { type: "Point", coordinates: [80.0589, 12.8312] } },
    amenities: ["WiFi", "AC", "Meals", "Gym", "Laundry", "CCTV", "Power Backup", "Parking"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"],
    averageRating: 4.6, reviewCount: 18, verifiedCount: 6, isVerified: true
  },
  {
    title: "Zolo Stays — Potheri",
    description: "Modern co-living PG by Zolo near SRM Potheri campus. Private, duo, and triple occupancy options available. Includes high-speed WiFi, DTH, power backup, and housekeeping. Great for students who want a structured, professionally managed PG experience.",
    rent: 8500, deposit: 17000, type: "PG", gender: "Any", sharingType: "Double",
    distanceFromCollege: 1.0, availability: true,
    address: { street: "Near SRM Institute of Science and Technology", area: "Potheri", city: "Kattankulathur", pincode: "603203",
      location: { type: "Point", coordinates: [80.0421, 12.8271] } },
    amenities: ["WiFi", "AC", "Laundry", "CCTV", "Power Backup", "Meals"],
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"],
    averageRating: 4.3, reviewCount: 12, verifiedCount: 5, isVerified: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await mongoose.connection.collection('listings').deleteMany({});
    console.log('🗑️  Cleared old listings');
    await mongoose.connection.collection('listings').insertMany(listings);
    console.log(`✅ Inserted ${listings.length} real SRM-area PG listings`);
    console.log('\n🎉 Done! Real PGs from Potheri, SRM Nagar, Padur area added.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
