#  Wonder - Property Rental Platform

A full-stack web application for listing and discovering short-term rentals. Built end-to-end with the Node.js ecosystem, featuring secure authentication, cloud-based image storage, interactive maps, and a complete review system.

** Live Demo:** [project-wonder-by-ansari.onrender.com](https://project-wonder-by-ansari.onrender.com/listings)

> _Note: The live demo is hosted on Render's free tier and may take 30–60 seconds to wake up on the first request after inactivity._

---

##  Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Data Models](#-data-models)
- [Key Technical Decisions](#-key-technical-decisions)
- [Author](#-author)

---

##  Features

### Authentication & Authorization
- User signup and login with hashed passwords (Passport.js + `passport-local-mongoose`)
- Session-based authentication with sessions persisted in MongoDB via `connect-mongo`
- Role-based access control: only listing owners can edit or delete their own listings; only review authors can delete their own reviews
- Post-login redirect to the originally requested page (e.g., if a logged-out user tries to create a listing, they're redirected back to the create form after signing in)

### Property Listings
- Full CRUD operations on property listings (create, read, update, delete)
- Multi-image upload per listing (up to 3 images), stored on Cloudinary with automatic optimization
- Server-side validation using Joi schemas before any DB write
- Automatic cascade deletion: when a listing is removed, all its reviews are deleted via a Mongoose post-hook

### Maps & Geocoding
- Mapbox Geocoding API converts user-entered addresses into geographic coordinates
- Interactive map display on each listing's detail page using Mapbox GL
- GeoJSON coordinates stored alongside each listing for spatial queries

### Reviews
- Logged-in users can leave ratings (1–5 stars) and written comments on listings
- Reviews are linked to their authors and displayed with author context on the listing page

### User Experience
- Flash messaging for success/error feedback (e.g., "New listing created", "You are not the owner")
- Custom 404 and 500 error pages with centralized error-handling middleware
- Responsive EJS templates with shared layouts via `ejs-mate`

---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 22.16 |
| **Web Framework** | Express 5 |
| **Database** | MongoDB (Atlas for production, local for dev) + Mongoose ODM |
| **Templating** | EJS with `ejs-mate` layout support |
| **Authentication** | Passport.js (`passport-local` strategy) + `passport-local-mongoose` |
| **Sessions** | `express-session` + `connect-mongo` (MongoDB-backed session store) |
| **Image Storage** | Cloudinary (via `multer` + `multer-storage-cloudinary`) |
| **Maps** | Mapbox SDK (`@mapbox/mapbox-sdk`) — forward geocoding |
| **Validation** | Joi (server-side schema validation) |
| **Flash Messages** | `connect-flash` |
| **Method Override** | `method-override` (to support PUT/DELETE via HTML forms) |
| **Config** | `dotenv` |
| **Deployment** | Render |

---

##  Architecture

```
┌──────────────┐      ┌─────────────────────┐      ┌──────────────────┐
│   Browser    │◄────►│   Express Server    │◄────►│  MongoDB Atlas   │
│  (EJS views) │      │   (routes + MW)     │      │  (listings,      │
└──────────────┘      └──────────┬──────────┘      │   users, reviews)│
                                 │                  └──────────────────┘
                                 │
                  ┌──────────────┼──────────────┐
                  ▼              ▼              ▼
           ┌─────────────┐ ┌──────────┐ ┌─────────────┐
           │ Cloudinary  │ │  Mapbox  │ │   Passport  │
           │ (images)    │ │ (geocode)│ │ (auth sess.)│
           └─────────────┘ └──────────┘ └─────────────┘
```

The application follows an **MVC-inspired structure**:

- **Models** (`/models`) define Mongoose schemas for Listings, Users, and Reviews with relationships (references + populate)
- **Views** (`/views`) are EJS templates organized by resource, with shared layouts and partials
- **Controllers** (`/controllers`) hold the business logic for each route, keeping route files slim
- **Routes** (`/routes`) define Express routers using `router.route().get().post()` chaining
- **Middleware** (`/middleware.js`) centralizes auth checks, ownership checks, and validation
- **Utilities** (`/utils`) provide `wrapAsync` (a clean async error handler) and a custom `ExpressError` class

---

##  Project Structure

```
Project-1/
├── app.js                    # Main server file — Express setup, middleware, DB connect
├── cloudConfig.js            # Cloudinary + multer-storage configuration
├── middleware.js             # Custom middleware (isLoggedIn, isOwner, validators)
├── schema.js                 # Joi validation schemas for listings & reviews
├── package.json
│
├── models/
│   ├── listing.js            # Listing schema (with GeoJSON, image array, refs)
│   ├── user.js               # User schema (auth plugin attached)
│   └── review.js             # Review schema (rating, comment, author)
│
├── controllers/
│   ├── listings.js           # CRUD logic + Mapbox geocoding
│   ├── reviews.js            # Create/delete review logic
│   └── user.js               # Signup / login / logout logic
│
├── routes/
│   ├── listing.js            # /listings routes
│   ├── review.js             # /listings/:id/reviews routes
│   └── user.js               # /signup, /login, /logout
│
├── views/
│   ├── layouts/boilerplate.ejs  # Base HTML layout
│   ├── includes/                # navbar, footer, flash messages
│   ├── listings/                # index, show, new, edit pages
│   ├── users/                   # login, signup pages
│   └── error.ejs                # Error page
│
├── public/
│   ├── css/                  # Stylesheets
│   └── js/                   # Client-side JS
│
├── utils/
│   ├── ExpressError.js       # Custom error class
│   └── wrapAsync.js          # Async error wrapper for controllers
│
└── init/
    ├── data.js               # Seed data (sample listings)
    └── index.js              # Seeding script
```

---

##  API Routes

### Listings
| Method | Route | Middleware | Description |
|---|---|---|---|
| `GET` | `/listings` | — | List all properties |
| `GET` | `/listings/new` | `isLoggedIn` | Render form to create a new listing |
| `POST` | `/listings` | `isLoggedIn`, `validateListing`, `upload.array` | Create a new listing (with images + geocoding) |
| `GET` | `/listings/:id` | — | Show a single listing with reviews |
| `GET` | `/listings/:id/edit` | `isLoggedIn`, `isOwner` | Render edit form |
| `PUT` | `/listings/:id` | `isLoggedIn`, `isOwner`, `validateListing` | Update a listing |
| `DELETE` | `/listings/:id` | `isLoggedIn`, `isOwner` | Delete a listing (cascades to reviews) |

### Reviews
| Method | Route | Middleware | Description |
|---|---|---|---|
| `POST` | `/listings/:id/reviews` | `isLoggedIn`, `validateReview` | Add a review to a listing |
| `DELETE` | `/listings/:id/reviews/:reviewId` | `isLoggedIn`, `isReviewAuthor` | Delete own review |

### Users
| Method | Route | Description |
|---|---|---|
| `GET` | `/signup` | Render signup form |
| `POST` | `/signup` | Create a new user |
| `GET` | `/login` | Render login form |
| `POST` | `/login` | Authenticate user (with redirect-back support) |
| `GET` | `/logout` | Log the user out |

---

##  Data Models

### Listing
```js
{
  title: String (required),
  description: String,
  image: [{ url: String, filename: String }],   // up to 3 images from Cloudinary
  price: Number,
  location: String,
  country: String,
  geometry: {                                    // GeoJSON Point for Mapbox
    type: "Point",
    coordinates: [Number, Number]                // [longitude, latitude]
  },
  owner: ObjectId (ref: "user"),
  reviews: [ObjectId] (ref: "Review")
}
```

### User
```js
{
  email: String (required),
  username: String,    // added by passport-local-mongoose
  hash: String,        // added by passport-local-mongoose
  salt: String         // added by passport-local-mongoose
}
```

### Review
```js
{
  comment: String,
  rating: Number (1–5),
  createdAt: Date (default: now),
  author: ObjectId (ref: "user")
}
```

---

##  Key Technical Decisions

- **Session-based auth with MongoDB-backed store.** For a server-rendered EJS app, sessions via `connect-mongo` fit more naturally than JWTs and persist across restarts.
- **Server-side validation with Joi.** Every listing and review payload is validated before hitting the database — never trust the client alone.
- **Cascade deletes via Mongoose hooks.** A `post("findOneAndDelete")` hook on the Listing model automatically cleans up associated reviews, avoiding orphaned data.
- **Centralized async error handling.** Every controller is wrapped in `wrapAsync` and errors funnel through a single Express error handler — no scattered try/catch blocks.

---

##  Author

**Abdullah Ansari**

 Full Stack Developer (MERN) · CS Graduate, Riga Technical University

-  [LinkedIn](https://www.linkedin.com/in/abdullah-ansari-0b9083267)
-  [GitHub](https://github.com/ansariTechRTU)
-  ansari.tech.rtu@gmail.com
