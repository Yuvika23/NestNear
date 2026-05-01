# 🏠 PG Finder — Backend API

A community-sourced PG & room listing platform for college students.

## 📁 Project Structure

```
pg-finder-backend/
├── server.js           # Entry point
├── models/
│   ├── User.js         # User schema (student / owner / admin)
│   ├── Listing.js      # PG listing schema
│   └── Review.js       # Review + ratings schema
├── routes/
│   ├── auth.js         # Register, Login, Get Me
│   ├── listings.js     # CRUD + verify + save
│   └── reviews.js      # Reviews per listing
├── .env.example        # Copy to .env and fill values
└── package.json
```

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET

# 3. Start dev server
npm run dev
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user (protected) |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/listings | Get all listings (with filters) |
| GET    | /api/listings/:id | Get single listing |
| POST   | /api/listings | Create listing (protected) |
| PUT    | /api/listings/:id | Update listing (owner only) |
| DELETE | /api/listings/:id | Delete listing (owner only) |
| POST   | /api/listings/:id/verify | Verify a listing (student) |
| POST   | /api/listings/:id/save | Save/unsave listing (wishlist) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/listings/:id/reviews | Get reviews for a listing |
| POST   | /api/listings/:id/reviews | Add a review (protected) |
| DELETE | /api/listings/:id/reviews/:reviewId | Delete review (owner) |
| POST   | /api/listings/:id/reviews/:reviewId/helpful | Mark review helpful |

## 🔍 Filter Options (GET /api/listings)
```
?minRent=3000
?maxRent=8000
?gender=Female
?type=PG
?sharing=Double
?amenities=WiFi,AC
?verified=true
?sort=rent_asc | rent_desc | rating | distance
```

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Hosting**: Render (free tier)
