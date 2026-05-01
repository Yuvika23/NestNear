# app.py — Flask API for PG Recommendation Engine
# Run: python app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from recommender import recommender

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", os.getenv("FRONTEND_URL", "*")])

# ── MongoDB connection ────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME   = os.getenv("DB_NAME", "test")

def get_db():
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]

def serialize(doc):
    """Convert MongoDB ObjectId to string for JSON"""
    doc['_id'] = str(doc['_id'])
    return doc

def load_recommender():
    """Load all listings + interactions from MongoDB into recommender"""
    try:
        db = get_db()
        listings     = [serialize(l) for l in db.listings.find({})]
        interactions = list(db.interactions.find({}))
        recommender.load_listings(listings)
        recommender.load_interactions(interactions)
        print(f"✅ Recommender loaded: {len(listings)} listings")
    except Exception as e:
        print(f"⚠️  Could not load recommender data: {e}")

# ── Health check ──────────────────────────────────────────────
@app.route('/')
def index():
    return jsonify({ 'status': 'PG Recommender API running 🤖', 'version': '1.0' })

# ── Reload recommender data ───────────────────────────────────
@app.route('/reload', methods=['POST'])
def reload():
    load_recommender()
    return jsonify({ 'success': True, 'message': 'Recommender reloaded' })

# ── Similar PGs (content-based) ───────────────────────────────
# GET /recommend/similar/<listing_id>?n=5
@app.route('/recommend/similar/<listing_id>', methods=['GET'])
def similar(listing_id):
    top_n = int(request.args.get('n', 5))
    results = recommender.get_similar_pgs(listing_id, top_n=top_n)

    if not results:
        # Reload and retry once
        load_recommender()
        results = recommender.get_similar_pgs(listing_id, top_n=top_n)

    return jsonify({ 'success': True, 'listing_id': listing_id, 'recommendations': results })

# ── Personalised recommendations (hybrid) ─────────────────────
# POST /recommend/user
# Body: { userId, viewedIds, preferences: { gender, maxRent, maxDistance, amenities } }
@app.route('/recommend/user', methods=['POST'])
def user_recommendations():
    body         = request.json or {}
    user_id      = body.get('userId', 'anonymous')
    viewed_ids   = body.get('viewedIds', [])
    preferences  = body.get('preferences', {})
    top_n        = int(body.get('n', 5))

    results = recommender.get_user_recommendations(
        user_id, viewed_ids, preferences, top_n=top_n
    )

    if not results:
        load_recommender()
        results = recommender.get_user_recommendations(
            user_id, viewed_ids, preferences, top_n=top_n
        )

    return jsonify({ 'success': True, 'userId': user_id, 'recommendations': results })

# ── Price fairness score ───────────────────────────────────────
# GET /recommend/price-check/<listing_id>
@app.route('/recommend/price-check/<listing_id>', methods=['GET'])
def price_check(listing_id):
    result = recommender.get_price_fairness(listing_id)

    if not result:
        load_recommender()
        result = recommender.get_price_fairness(listing_id)

    return jsonify({ 'success': True, 'listing_id': listing_id, 'price_analysis': result })

# ── Track interaction (view/save/contact) ─────────────────────
# POST /interact
# Body: { userId, listingId, action: "view"|"save"|"contact" }
@app.route('/interact', methods=['POST'])
def track_interaction():
    body       = request.json or {}
    user_id    = body.get('userId')
    listing_id = body.get('listingId')
    action     = body.get('action', 'view')

    if not user_id or not listing_id:
        return jsonify({ 'success': False, 'message': 'userId and listingId required' }), 400

    score_map = { 'view': 1, 'save': 2, 'contact': 3 }
    score = score_map.get(action, 1)

    try:
        db = get_db()
        db.interactions.update_one(
            { 'userId': user_id, 'listingId': listing_id },
            { '$set': { 'userId': user_id, 'listingId': listing_id, 'score': score, 'action': action } },
            upsert=True
        )
        # Refresh collab data
        interactions = list(db.interactions.find({}))
        recommender.load_interactions(interactions)
    except Exception as e:
        return jsonify({ 'success': False, 'message': str(e) }), 500

    return jsonify({ 'success': True, 'message': f'Interaction tracked: {action}' })

# ── Start server ──────────────────────────────────────────────
if __name__ == '__main__':
    load_recommender()
    port = int(os.getenv('PORT', 8000))
    print(f'🤖 ML API running on http://localhost:{port}')
    app.run(host='0.0.0.0', port=port, debug=True)
