const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  rent: {
    type: Number,
    required: [true, 'Rent is required']
  },
  deposit: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ["PG", "Flat", "Hostel", "Room"],
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Any"],
    required: true
  },
  address: {
    street: String,
    area: String,
    city: { type: String, required: true },
    pincode: String,
    // GeoJSON for map integration
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    }
  },
  distanceFromCollege: {
    type: Number, // in km
    required: true
  },
  amenities: [{
    type: String,
    enum: ["WiFi", "AC", "Geyser", "Laundry", "Meals", "Parking", "CCTV", "Gym", "Power Backup"]
  }],
  photos: [{ type: String }], // URLs to images
  availability: {
    type: Boolean,
    default: true
  },
  sharingType: {
    type: String,
    enum: ["Single", "Double", "Triple"],
    required: true
  },
  verifiedCount: {
    type: Number,
    default: 0
  },
  verifiedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false // becomes true when verifiedCount >= 3
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  semesterAvailability: {
    type: String,
    default: 'yearround'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add geo index for map-based queries
listingSchema.index({ 'address.location': '2dsphere' });

// Auto-verify when 3+ students confirm
listingSchema.methods.checkVerification = function() {
  if (this.verifiedCount >= 3) {
    this.isVerified = true;
  }
};

module.exports = mongoose.model('Listing', listingSchema);
