# 🤖 PG Finder — ML Recommendation Engine

Hybrid recommendation system combining Content-Based + Collaborative Filtering.

## Setup

```bash
cd pg-finder-ml

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your MONGO_URI and DB_NAME

# Run the ML API
python app.py
# Runs on http://localhost:8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | /recommend/similar/:id | Similar PGs (content-based) |
| POST | /recommend/user | Personalised recs (hybrid) |
| GET  | /recommend/price-check/:id | Price fairness analysis |
| POST | /interact | Track user interaction |
| POST | /reload | Reload recommender data |

## How the Hybrid Engine Works

### Content-Based Filtering
Builds a feature matrix from each PG's:
- Rent, distance, rating (normalized)
- Amenity flags (WiFi, AC, Meals etc.)
- TF-IDF on amenity combinations
- Categorical encoding (gender, type, sharing)

Uses cosine similarity to find structurally similar PGs.

### Collaborative Filtering
Builds a user-item interaction matrix from:
- Views (score: 1)
- Saves (score: 2)  
- Contact clicks (score: 3)

Uses user-user cosine similarity to recommend
what similar users engaged with.

### Hybrid Score
```
final_score = 0.6 × content_score + 0.4 × collab_score
```
Plus preference boosting for gender, budget, distance, amenities.

## Resume Description

> Built a hybrid ML recommendation engine in Python (Flask) that combines
> content-based filtering (cosine similarity on PG features) and collaborative
> filtering (user interaction matrix) to personalise PG recommendations.
> Includes a price fairness scoring system that benchmarks listings against
> similar PGs using percentile ranking.
> Stack: Python, Flask, scikit-learn, NumPy, pandas, MongoDB.
