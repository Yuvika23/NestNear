// add-coordinates.js
// Run this once: node add-coordinates.js
// Adds GPS coordinates to all existing listings so geo-search works

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Coordinates for each listing by title
// [longitude, latitude] — MongoDB uses this order
const COORDINATES = {
  "Sri Lakshmi PG for Girls":    [80.2209, 13.0067],
  "Sai Krishna Boys Hostel":     [80.1567, 13.0389],
  "Green Valley Residency":      [80.2205, 12.9816],
  "Friends Flat — 3 BHK Sharing": [80.2574, 13.0012],
  "Kavitha Aunty's PG":          [80.2341, 13.0418],
  "Budget Room Near Back Gate":  [80.1429, 12.9516],
  "Nova Co-Living Space":        [80.2273, 12.9010],
  "Rajesh Uncle's Boys PG":      [80.2096, 13.0850],
};

async function addCoordinates() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.collection('listings');
    const listings = await collection.find({}).toArray();
    console.log(`Found ${listings.length} listings`);

    let updated = 0;
    for (const listing of listings) {
      const coords = COORDINATES[listing.title];
      if (!coords) {
        console.log(`⚠️  No coords for: ${listing.title} — skipping`);
        continue;
      }

      await collection.updateOne(
        { _id: listing._id },
        {
          $set: {
            'address.location': {
              type: 'Point',
              coordinates: coords
            }
          }
        }
      );
      console.log(`✅ Updated: ${listing.title}`);
      updated++;
    }

    console.log(`\n🎉 Done! Updated ${updated}/${listings.length} listings with coordinates`);
    console.log('Now create the 2dsphere index in Atlas (instructions below)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addCoordinates();
