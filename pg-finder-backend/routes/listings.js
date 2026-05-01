const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect } = require('./auth');

// @route   GET /api/listings
// @desc    Get all listings with filters
router.get('/', async (req, res) => {
  try {
    const { minRent, maxRent, gender, type, sharing, amenities, verified, sort } = req.query;

    let query = {};

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }
    if (gender)   query.gender   = { $in: [gender, 'Any'] };
    if (type)     query.type     = type;
    if (sharing)  query.sharingType = sharing;
    if (verified) query.isVerified  = true;
    if (amenities) {
      query.amenities = { $all: amenities.split(',') };
    }
    if (req.query.semester) {
      query.semesterAvailability = { $in: [req.query.semester, 'both', 'yearround'] };
    }

    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'rent_asc')    sortOption = { rent: 1 };
    if (sort === 'rent_desc')   sortOption = { rent: -1 };
    if (sort === 'rating')      sortOption = { averageRating: -1 };
    if (sort === 'distance')    sortOption = { distanceFromCollege: 1 };

    const listings = await Listing.find(query)
      .populate('owner', 'name email')
      .sort(sortOption);

    res.json({ success: true, count: listings.length, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/listings/nearby
// @desc    Get listings within X km of coordinates
// @example /api/listings/nearby?lat=13.04&lng=80.23&radius=5
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat and lng are required' });
    }

    const listings = await Listing.find({
      'address.location': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)] // MongoDB: lng first
          },
          $maxDistance: parseFloat(radius) * 1000 // convert km to meters
        }
      }
    }).populate('owner', 'name email');

    res.json({ success: true, count: listings.length, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/listings/:id
// @desc    Get a single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('verifiedBy', 'name');
      if (req.query.availability) query.availability = req.query.availability === 'true';
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/listings
// @desc    Create a new listing (owner/admin only)
router.post('/', protect, async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const listing = await Listing.create(req.body);
    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update a listing (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }
    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await listing.deleteOne();
    res.json({ success: true, message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/listings/:id/verify
// @desc    Student verifies a listing (confirms it's legit)
router.post('/:id/verify', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (listing.verifiedBy.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'You have already verified this listing' });
    }

    listing.verifiedBy.push(req.user.id);
    listing.verifiedCount += 1;
    listing.checkVerification();
    await listing.save();

    res.json({ success: true, message: 'Listing verified!', isVerified: listing.isVerified, verifiedCount: listing.verifiedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/listings/:id/save
// @desc    Save/unsave a listing (wishlist)
router.post('/:id/save', protect, async (req, res) => {
  try {
    const user = req.user;
    const listingId = req.params.id;
    const isSaved = user.savedListings.includes(listingId);

    if (isSaved) {
      user.savedListings = user.savedListings.filter(id => id.toString() !== listingId);
    } else {
      user.savedListings.push(listingId);
    }

    await user.save();
    res.json({ success: true, saved: !isSaved, message: isSaved ? 'Removed from saved' : 'Added to saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
