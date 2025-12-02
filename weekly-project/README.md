## Weekly Project – Node.js / Express API

This folder contains the main **weekly project**, an Express-based API with authentication, user roles, products, orders, and payments.

### Structure

- `controllers/` – Route handler logic (auth, products, orders, payments)
- `middleware/` – Authentication, role checking, file upload, email helpers
- `models/` – Mongoose (or similar) models for users, products, and orders
- `routes/` – Route definitions for the different resources
- `server.js` – App entry point

### Getting Started

- **Install dependencies**:  
  `npm install`
- **Environment variables**:  
  Create a `.env` file in this folder and add your keys (DB URL, JWT secret, email config, etc.).
- **Run the server**:  
  `node server.js`  
  or  
  `npm start` (if defined in `package.json`)