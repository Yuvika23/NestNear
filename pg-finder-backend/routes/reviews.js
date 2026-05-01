const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/Review');
const Listing = require('../models/Listing');
const { protect } = require('./auth');

// @route   GET /api/listings/:listingId/reviews
// @desc    Get all reviews for a listing
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('user', 'name year college')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/listings/:listingId/reviews
// @desc    Add a review to a listing
router.post('/', protect, async (req, res) => {
  try {
    req.body.listing = req.params.listingId;
    req.body.user    = req.user.id;

    const existing = await Review.findOne({ listing: req.params.listingId, user: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this listing' });
    }

    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/listings/:listingId/reviews/:id
// @desc    Delete a review (owner of review only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/listings/:listingId/reviews/:id/helpful
// @desc    Mark a review as helpful
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );
    res.json({ success: true, helpfulVotes: review.helpfulVotes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
