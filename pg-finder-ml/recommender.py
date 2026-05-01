# recommender.py
# Hybrid Recommendation Engine for PG Finder
# Combines Content-Based + Collaborative Filtering

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


class PGRecommender:
    def __init__(self):
        self.listings_df = None
        self.content_sim_matrix = None
        self.collab_sim_matrix = None
        self.user_item_matrix = None
        self.scaler = MinMaxScaler()

    # ─── DATA LOADING ──────────────────────────────────────────
    def load_listings(self, listings: list):
        """Load PG listings from MongoDB data (list of dicts)"""
        if not listings:
            return

        rows = []
        for l in listings:
            amenities = l.get('amenities', [])
            rows.append({
                'id':           str(l.get('_id', l.get('id', ''))),
                'title':        l.get('title', ''),
                'rent':         l.get('rent', 0),
                'deposit':      l.get('deposit', 0),
                'distance':     l.get('distanceFromCollege', 0),
                'rating':       l.get('averageRating', 0),
                'reviews':      l.get('reviewCount', 0),
                'verified':     int(l.get('isVerified', False)),
                'gender':       l.get('gender', 'Any'),
                'type':         l.get('type', 'PG'),
                'sharing':      l.get('sharingType', 'Double'),
                'area':         l.get('address', {}).get('area', ''),
                # Amenity flags
                'has_wifi':     int('WiFi' in amenities),
                'has_ac':       int('AC' in amenities),
                'has_meals':    int('Meals' in amenities),
                'has_gym':      int('Gym' in amenities),
                'has_laundry':  int('Laundry' in amenities),
                'has_cctv':     int('CCTV' in amenities),
                'has_parking':  int('Parking' in amenities),
                'has_geyser':   int('Geyser' in amenities),
                'has_power':    int('Power Backup' in amenities),
                # Text for TF-IDF
                'amenity_text': ' '.join(amenities).lower(),
            })

        self.listings_df = pd.DataFrame(rows)
        self._build_content_matrix()

    def load_interactions(self, interactions: list):
        """
        Load user interactions for collaborative filtering.
        interactions = [{ userId, listingId, score }]
        score: view=1, save=2, contact=3
        """
        if not interactions:
            return

        df = pd.DataFrame(interactions)
        if df.empty or 'userId' not in df.columns:
            return

        self.user_item_matrix = df.pivot_table(
            index='userId',
            columns='listingId',
            values='score',
            fill_value=0
        )
        self._build_collab_matrix()

    # ─── BUILD MATRICES ────────────────────────────────────────
    def _build_content_matrix(self):
        """Build content-based similarity matrix using PG features"""
        if self.listings_df is None or self.listings_df.empty:
            return

        df = self.listings_df

        # 1. Numerical features — normalize to 0-1
        num_features = ['rent', 'distance', 'rating', 'reviews', 'verified']
        num_data = df[num_features].fillna(0)
        num_scaled = self.scaler.fit_transform(num_data)

        # 2. Amenity binary flags
        amenity_features = [
            'has_wifi', 'has_ac', 'has_meals', 'has_gym',
            'has_laundry', 'has_cctv', 'has_parking', 'has_geyser', 'has_power'
        ]
        amenity_data = df[amenity_features].fillna(0).values

        # 3. TF-IDF on amenity text (captures combinations)
        tfidf = TfidfVectorizer(max_features=20)
        try:
            tfidf_matrix = tfidf.fit_transform(df['amenity_text'].fillna('')).toarray()
        except:
            tfidf_matrix = np.zeros((len(df), 1))

        # 4. Categorical encoding
        gender_enc = pd.get_dummies(df['gender'], prefix='gender').values
        type_enc   = pd.get_dummies(df['type'],   prefix='type').values
        sharing_enc= pd.get_dummies(df['sharing'],prefix='sharing').values

        # 5. Combine all features with weights
        # Higher weight = more important in recommendation
        feature_matrix = np.hstack([
            num_scaled    * 2.0,   # numerical features
            amenity_data  * 1.5,   # amenities
            tfidf_matrix  * 1.0,   # amenity text
            gender_enc    * 2.0,   # gender match is important
            type_enc      * 1.0,
            sharing_enc   * 1.0,
        ])

        self.content_sim_matrix = cosine_similarity(feature_matrix)

    def _build_collab_matrix(self):
        """Build user-user collaborative similarity matrix"""
        if self.user_item_matrix is None:
            return
        self.collab_sim_matrix = cosine_similarity(self.user_item_matrix)

    # ─── RECOMMENDATIONS ───────────────────────────────────────
    def get_similar_pgs(self, listing_id: str, top_n: int = 5) -> list:
        """Content-based: find PGs similar to a given listing"""
        if self.listings_df is None or self.content_sim_matrix is None:
            return []

        ids = self.listings_df['id'].tolist()
        if listing_id not in ids:
            return []

        idx = ids.index(listing_id)
        scores = list(enumerate(self.content_sim_matrix[idx]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)
        # Exclude the listing itself
        scores = [(i, s) for i, s in scores if i != idx][:top_n]

        return self._format_results(scores)

    def get_user_recommendations(self, user_id: str, viewed_ids: list,
                                  preferences: dict = None, top_n: int = 5) -> list:
        """
        Hybrid recommendation for a user.
        preferences = { gender, maxRent, amenities, maxDistance }
        """
        if self.listings_df is None:
            return []

        n = len(self.listings_df)
        content_scores = np.zeros(n)
        collab_scores  = np.zeros(n)

        # ── Content-based component ──────────────────────────
        if viewed_ids and self.content_sim_matrix is not None:
            ids = self.listings_df['id'].tolist()
            for vid in viewed_ids:
                if vid in ids:
                    idx = ids.index(vid)
                    content_scores += self.content_sim_matrix[idx]
            if len(viewed_ids) > 0:
                content_scores /= len(viewed_ids)

        # ── Collaborative component ──────────────────────────
        if (self.user_item_matrix is not None and
                self.collab_sim_matrix is not None and
                user_id in self.user_item_matrix.index):

            user_idx   = list(self.user_item_matrix.index).index(user_id)
            user_sims  = self.collab_sim_matrix[user_idx]
            weighted   = np.dot(user_sims, self.user_item_matrix.values)
            listing_ids_in_matrix = list(self.user_item_matrix.columns)
            ids = self.listings_df['id'].tolist()

            for j, lid in enumerate(listing_ids_in_matrix):
                if lid in ids:
                    idx = ids.index(lid)
                    collab_scores[idx] = weighted[j]

            # Normalize
            max_c = collab_scores.max()
            if max_c > 0:
                collab_scores /= max_c

        # ── Hybrid score (60% content, 40% collaborative) ────
        hybrid_scores = 0.6 * content_scores + 0.4 * collab_scores

        # ── Preference boosting ──────────────────────────────
        if preferences:
            hybrid_scores = self._apply_preference_boost(hybrid_scores, preferences)

        # ── Filter out already-viewed listings ───────────────
        ids = self.listings_df['id'].tolist()
        for vid in viewed_ids:
            if vid in ids:
                hybrid_scores[ids.index(vid)] = -1

        # ── Get top N ────────────────────────────────────────
        top_indices = np.argsort(hybrid_scores)[::-1][:top_n]
        scores = [(int(i), float(hybrid_scores[i])) for i in top_indices if hybrid_scores[i] > 0]

        return self._format_results(scores)

    def _apply_preference_boost(self, scores: np.ndarray, prefs: dict) -> np.ndarray:
        """Boost scores for listings that match user preferences"""
        df = self.listings_df
        boosted = scores.copy()

        for i, row in df.iterrows():
            boost = 1.0

            # Gender match
            if prefs.get('gender') and row['gender'] != 'Any':
                if row['gender'] == prefs['gender']:
                    boost *= 1.3

            # Budget match
            if prefs.get('maxRent') and row['rent'] <= prefs['maxRent']:
                boost *= 1.2

            # Distance preference
            if prefs.get('maxDistance') and row['distance'] <= prefs['maxDistance']:
                boost *= 1.2

            # Amenity match
            desired_amenities = prefs.get('amenities', [])
            if desired_amenities:
                amenity_map = {
                    'WiFi': 'has_wifi', 'AC': 'has_ac', 'Meals': 'has_meals',
                    'Gym': 'has_gym', 'Laundry': 'has_laundry', 'CCTV': 'has_cctv',
                    'Parking': 'has_parking', 'Geyser': 'has_geyser',
                    'Power Backup': 'has_power'
                }
                matches = sum(row.get(amenity_map.get(a, ''), 0) for a in desired_amenities)
                boost *= (1 + 0.1 * matches)

            boosted[i] = scores[i] * boost

        return boosted

    def get_price_fairness(self, listing_id: str) -> dict:
        """
        Compare a listing's rent to similar ones — is it fair?
        Returns: { score, verdict, avg_similar_rent, percentile }
        """
        if self.listings_df is None:
            return {}

        similar = self.get_similar_pgs(listing_id, top_n=4)
        if not similar:
            return {}

        ids = self.listings_df['id'].tolist()
        if listing_id not in ids:
            return {}

        idx = ids.index(listing_id)
        this_rent = self.listings_df.iloc[idx]['rent']
        similar_rents = [
            self.listings_df[self.listings_df['id'] == s['id']]['rent'].values[0]
            for s in similar
            if s['id'] in ids
        ]

        if not similar_rents:
            return {}

        avg_rent = np.mean(similar_rents)
        diff_pct = ((this_rent - avg_rent) / avg_rent) * 100
        all_rents = self.listings_df['rent'].values
        percentile = (np.sum(all_rents >= this_rent) / len(all_rents)) * 100

        if diff_pct <= -15:
            verdict = "Great Deal 🟢"
        elif diff_pct <= 5:
            verdict = "Fair Price 🟡"
        elif diff_pct <= 20:
            verdict = "Slightly High 🟠"
        else:
            verdict = "Overpriced 🔴"

        return {
            'verdict':          verdict,
            'this_rent':        int(this_rent),
            'avg_similar_rent': int(avg_rent),
            'diff_percent':     round(diff_pct, 1),
            'percentile':       round(percentile, 1),
            'price_score':      round(max(0, 100 - max(0, diff_pct)), 1)
        }

    def _format_results(self, scored_indices: list) -> list:
        """Convert (index, score) pairs to listing dicts"""
        results = []
        for idx, score in scored_indices:
            row = self.listings_df.iloc[idx]
            results.append({
                'id':       row['id'],
                'title':    row['title'],
                'rent':     int(row['rent']),
                'distance': float(row['distance']),
                'rating':   float(row['rating']),
                'area':     row['area'],
                'score':    round(float(score), 4)
            })
        return results


# Singleton instance
recommender = PGRecommender()
