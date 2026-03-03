# FoodieHub — Online Food Delivery System

A full-stack MERN food delivery web application with role-based dashboards for **customers**, **restaurant owners**, and **admins**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose 9) |
| Auth | JWT (JSON Web Tokens) |
| Image Upload | Cloudinary + Multer |
| Payments | Razorpay |
| Styling | Tailwind CSS v4, React Icons |

---

## Project Structure

```
Food-Delivery-System/
├── backend/                  # Express API server
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── cloudinary.js     # Cloudinary config
│   ├── controller/           # Route handlers
│   ├── middleware/           # Auth, upload, error handlers
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── Payment.js
│   │   └── Review.js
│   ├── routes/               # API routes
│   ├── seed-admin.js         # Creates the first admin user
│   ├── seed-restaurants.js   # Database seeder (27 restaurants + 163 menu items)
│   ├── server.js
│   └── .env                  # Environment variables (not committed)
│
└── FoodieHub/                # React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── auth/         # Login, Register
    │   │   ├── customer/     # RestaurantsList, Cart, Orders
    │   │   ├── restaurant/   # Dashboard, MenuManager, Orders
    │   │   ├── admin/        # Dashboard, Users, Restaurants, Orders, Reviews
    │   │   ├── Home.jsx
    │   │   ├── Profile.jsx
    │   │   └── Notifications.jsx
    │   ├── context/          # Auth context
    │   ├── services/         # Axios API calls
    │   └── common/           # Shared components
    └── index.html
```

---

## Features

### Customer
- Browse 27+ restaurants with cover images, ratings and cuisine filters
- Debounced search by name, cuisine or city
- Add items to cart with quantity control and special instructions
- Saved delivery addresses
- Razorpay payment integration
- Track active and past orders with item images

### Restaurant Owner
- Dashboard to manage restaurant profile and cover image (Cloudinary upload)
- Menu Manager — add/edit/delete menu items with images
- View and update incoming orders

### Admin
- User management — view, promote, ban users
- Restaurant oversight — approve / manage all restaurants
- Order and review management

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/restaurants` | List restaurants (search, filter, paginate) |
| GET | `/api/restaurants/:id` | Restaurant details |
| GET | `/api/menu/:restaurantId` | Menu items for a restaurant |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/my` | Customer order history |
| GET | `/api/orders/restaurant` | Restaurant's incoming orders |
| PATCH | `/api/orders/:id/status` | Update order status |
| POST | `/api/upload` | Upload image to Cloudinary |
| POST | `/api/payments/create-order` | Initiate Razorpay payment |
| POST | `/api/payments/verify` | Verify payment signature |
| GET | `/api/admin/users` | Admin — all users |
| GET | `/api/admin/orders` | Admin — all orders |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account (test keys work)

### 1. Clone the repository

```bash
git clone <repo-url>
cd Food-Delivery-System
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
```

### 3. Frontend setup

```bash
cd FoodieHub
npm install
```

Create `FoodieHub/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 4. Seed the database

**Restaurants & menu items:**
```bash
cd backend
node seed-restaurants.js
```

This seeds **27 restaurants** across 15+ Indian and international cuisines with **163 menu items**, all with Unsplash food images.

**Admin user:**
```bash
node seed-admin.js
```

Creates the first admin account (email: `admin@foodiehub.com`, password: `Admin@123`). Admin accounts cannot be created through the registration page.

### 5. Run the application

**Backend:**
```bash
cd backend
node server.js
# or: npm run server   (uses nodemon)
```

**Frontend:**
```bash
cd FoodieHub
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Demo Accounts

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@foodiehub.com` | `Admin@123` |
| Restaurant | `spicegarden@demo.com` | `Rest@123` |
| Restaurant | `biryaniking@demo.com` | `Rest@123` |
| Restaurant | `pizzapiazza@demo.com` | `Rest@123` |

To create a **customer** or **restaurant** account, register at `/register`.
To create an **admin** account, run `node seed-admin.js` in the backend directory.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FRONTEND_URL` | Allowed CORS origin |

### Frontend (`FoodieHub/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key for frontend checkout |

---

## Author

**BALASEENIVASAN S**
