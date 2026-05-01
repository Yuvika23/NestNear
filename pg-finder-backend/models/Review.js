const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  // Detailed sub-ratings
  subRatings: {
    cleanliness: { type: Number, min: 1, max: 5 },
    wifi:        { type: Number, min: 1, max: 5 },
    food:        { type: Number, min: 1, max: 5 },
    safety:      { type: Number, min: 1, max: 5 },
    owner:       { type: Number, min: 1, max: 5 }
  },
  comment: {
    type: String,
    maxlength: 500
  },
  stayDuration: {
    type: String,
    enum: ['< 3 months', '3-6 months', '6-12 months', '1+ year']
  },
  isCurrentResident: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// One review per user per listing
reviewSchema.index({ listing: 1, user: 1 }, { unique: true });

// After saving review, update listing's average rating
reviewSchema.post('save', async function() {
  const Listing = mongoose.model('Listing');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { listing: this.listing } },
    { $group: { _id: '$listing', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (stats.length > 0) {
    await Listing.findByIdAndUpdate(this.listing, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
