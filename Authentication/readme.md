# User Authentication with JWT (Bearer Token)

This project implements user authentication and authorization using JWT Bearer tokens with Node.js, Express.js, and MongoDB.

## Features
- MVC architecture
- Secure password hashing (bcrypt)
- JWT-based authentication
- Protected routes using middleware
- MongoDB with Mongoose
- Postman-ready API

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- Postman

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   npm install
3. Create a `.env` file
4. Start MongoDB
5. Run the server:
   npm run dev

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile (Protected)

## Authentication
Use `Authorization: Bearer <token>` in headers for protected routes.

## Author
BALASEENIVASAN S
