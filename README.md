# 🚀 ChefKit Server

Backend REST API for ChefKit meal kit marketplace. Built with Express.js and MongoDB Atlas for serverless deployment on Vercel.

## 📋 Description

A RESTful API server that powers the ChefKit application, providing endpoints for user management and meal kit CRUD operations. Features MongoDB integration with serverless-optimized connection handling.

## 🛠️ Technologies

- **Express.js 4.18.2** - Web framework
- **MongoDB Driver 6.3.0** - Database client with ServerApi v1
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Vercel** - Serverless deployment platform

## 📦 Setup & Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account with cluster configured
- Network Access in MongoDB Atlas set to allow 0.0.0.0/0 (all IPs) for Vercel

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/Nafiz001/chefkit-server-side.git
cd chefkit-server-side
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in root directory:
```env
PORT=5000
DB_USER=your-mongodb-username
DB_PASS=your-mongodb-password
```

4. (Optional) Seed the database with initial meal kits:
```bash
node seed.js
```

5. Start development server:
```bash
npm run dev
```

Server will run on http://localhost:5000

## 🗺️ API Endpoints

### Root
- **GET** `/` - Server health check
  - Returns: `{ message, timestamp, status }`

### User Endpoints
- **GET** `/users` - Get all users
  - Returns: Array of user objects
  
- **POST** `/users` - Create new user or check if exists
  - Body: `{ name, email, image }`
  - Returns: `{ acknowledged, insertedId }` or `{ message: 'User already exists' }`
  
- **GET** `/users/:email` - Get user by email
  - Returns: User object or null

### Meal Kit Endpoints
- **GET** `/meal-kits` - Get all meal kits with optional filters
  - Query params: 
    - `cuisine` - Filter by cuisine type
    - `search` - Search in title, chef, cuisine
    - `sort` - Sort by `price-asc`, `price-desc`, or `newest`
  - Returns: Array of meal kit objects
  
- **GET** `/meal-kits/:id` - Get specific meal kit
  - Returns: Meal kit object or 404
  
- **POST** `/meal-kits` - Create new meal kit
  - Body: `{ title, shortDescription, fullDescription, price, prepTime, servings, difficulty, cuisine, dietaryTags, chef, image, ingredients, userEmail }`
  - Returns: `{ success: true, insertedId }`
  
- **PUT** `/meal-kits/:id` - Update meal kit
  - Body: Fields to update
  - Returns: `{ acknowledged, modifiedCount }`
  
- **DELETE** `/meal-kits/:id` - Delete meal kit
  - Returns: `{ acknowledged, deletedCount }`
  
- **GET** `/my-meal-kits/:email` - Get meal kits by user email
  - Returns: Array of user's meal kits

## 🗄️ Database Structure

### Collections

#### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String
}
```

#### mealKits
```javascript
{
  _id: ObjectId,
  id: String,
  title: String,
  shortDescription: String,
  fullDescription: String,
  price: Number,
  prepTime: String,
  servings: Number,
  difficulty: String,
  cuisine: String,
  dietaryTags: Array<String>,
  chef: String,
  image: String,
  ingredients: Array<String>,
  userEmail: String,
  createdAt: String (ISO 8601)
}
```

## 🔧 Configuration

### MongoDB Connection
```javascript
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.sqaw1iw.mongodb.net/chefkitDB?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
});
```

### CORS Configuration
Allowed origins:
- http://localhost:3000
- http://localhost:5000
- https://chefkit-client-side.vercel.app

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub

2. Import to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Configure project

3. Add environment variables in Vercel dashboard:
   ```
   DB_USER=your-mongodb-username
   DB_PASS=your-mongodb-password
   ```

4. Configure MongoDB Atlas:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - Ensure database user has readWrite permissions

5. Deploy!

**Live Server:** [https://chefkit-server-side.vercel.app](https://chefkit-server-side.vercel.app)

### vercel.json Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}
```

## 🏗️ Project Structure

```
chefkit-server-side/
├── index.js          # Main Express server
├── seed.js           # Database seeding script
├── vercel.json       # Vercel deployment config
├── package.json      # Dependencies and scripts
├── .env              # Environment variables (local)
├── .gitignore        # Git ignore rules
└── README.md         # Documentation
```

## 📝 Seeding Database

The `seed.js` script populates the database with 6 initial meal kits:

```bash
node seed.js
```

Initial meal kits:
1. **Italian Carbonara Kit** - $28.99
2. **Thai Green Curry Kit** - $32.99
3. **Mexican Tacos Kit** - $26.99
4. **Mediterranean Buddha Bowl Kit** - $24.99
5. **Japanese Ramen Kit** - $34.99
6. **French Coq au Vin Kit** - $38.99

## 🔐 Error Handling

- Returns empty arrays `[]` for GET endpoints when database not ready
- Returns `503 Service Unavailable` for POST/PUT/DELETE when database not ready
- Returns `404 Not Found` when meal kit doesn't exist
- Returns `500 Internal Server Error` with error details for server errors

## 🧪 Testing Endpoints

### Using PowerShell

**Test POST /meal-kits:**
```powershell
$body = @{
    title = "Test Kit"
    shortDescription = "Test description"
    fullDescription = "Full test description"
    price = 25.99
    prepTime = "30 mins"
    servings = 2
    difficulty = "Easy"
    cuisine = "Italian"
    dietaryTags = @("Vegetarian")
    chef = "Test Chef"
    image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
    ingredients = @("pasta", "cheese", "bacon")
    userEmail = "test@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://chefkit-server-side.vercel.app/meal-kits" -Method POST -Body $body -ContentType "application/json"
```

**Test GET /meal-kits:**
```powershell
Invoke-RestMethod -Uri "https://chefkit-server-side.vercel.app/meal-kits" -Method GET
```

## 👨‍💻 Author

**Nafiz**
- GitHub: [@Nafiz001](https://github.com/Nafiz001)

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ for ChefKit Backend API
