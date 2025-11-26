# ChefKit Server

Backend API for ChefKit meal kit marketplace

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

## API Endpoints

### Users
- `POST /users` - Create new user
- `GET /users/:email` - Get user by email

### Meal Kits
- `GET /meal-kits` - Get all meal kits (supports query params: cuisine, search, sort)
- `GET /meal-kits/:id` - Get meal kit by ID
- `POST /meal-kits` - Add new meal kit
- `PUT /meal-kits/:id` - Update meal kit
- `DELETE /meal-kits/:id` - Delete meal kit
- `GET /my-meal-kits/:email` - Get meal kits by user email
