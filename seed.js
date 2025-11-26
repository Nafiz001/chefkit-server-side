const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sqaw1iw.mongodb.net/?appName=Cluster0`;

const mealKits = [
  {
    id: "1",
    title: "Italian Pasta Carbonara",
    shortDescription: "Authentic creamy carbonara with pancetta and egg sauce",
    fullDescription: "Experience the true taste of Rome with our classic Carbonara recipe. Made with crispy pancetta, farm-fresh eggs, aged Parmigiano-Reggiano, and al dente spaghetti.",
    price: 28.99,
    prepTime: "30 min",
    servings: 2,
    difficulty: "Medium",
    cuisine: "Italian",
    dietaryTags: ["High Protein"],
    chef: "Chef Marco Rossi",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
    ingredients: ["400g Spaghetti", "200g Pancetta", "4 Fresh Eggs", "100g Parmigiano-Reggiano", "Black Pepper", "Sea Salt"],
    userEmail: "demo@chefkit.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Thai Green Curry Bowl",
    shortDescription: "Aromatic coconut curry with fresh vegetables",
    fullDescription: "Discover the vibrant flavors of Thailand with this aromatic green curry. Our kit includes authentic Thai curry paste, creamy coconut milk, fresh vegetables, and fragrant jasmine rice.",
    price: 32.99,
    prepTime: "40 min",
    servings: 2,
    difficulty: "Easy",
    cuisine: "Thai",
    dietaryTags: ["Vegan", "Gluten-Free"],
    chef: "Chef Somying Lee",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
    ingredients: ["Thai Green Curry Paste", "Coconut Milk", "Mixed Vegetables", "Jasmine Rice", "Thai Basil", "Lime"],
    userEmail: "demo@chefkit.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Mexican Street Tacos Kit",
    shortDescription: "Authentic street-style tacos with fresh toppings",
    fullDescription: "Bring the flavors of Mexico City to your table! Our taco kit features hand-pressed corn tortillas, perfectly seasoned carne asada, fresh pico de gallo, and all the authentic toppings.",
    price: 26.99,
    prepTime: "25 min",
    servings: 4,
    difficulty: "Easy",
    cuisine: "Mexican",
    dietaryTags: ["High Protein"],
    chef: "Chef Carlos Rodriguez",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    ingredients: ["Corn Tortillas", "Marinated Beef", "Fresh Cilantro", "White Onion", "Lime Wedges", "Salsa Verde"],
    userEmail: "demo@chefkit.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Mediterranean Buddha Bowl",
    shortDescription: "Wholesome bowl with falafel and tahini",
    fullDescription: "A nutritious and colorful Mediterranean feast in a bowl. Features crispy homemade falafel, fresh vegetables, creamy hummus, and our signature tahini dressing.",
    price: 24.99,
    prepTime: "35 min",
    servings: 2,
    difficulty: "Medium",
    cuisine: "Mediterranean",
    dietaryTags: ["Vegetarian", "High Fiber"],
    chef: "Chef Yuki Tanaka",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    ingredients: ["Chickpeas", "Mixed Greens", "Cherry Tomatoes", "Cucumber", "Tahini Sauce", "Pita Bread"],
    userEmail: "demo@chefkit.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Japanese Ramen Bowl",
    shortDescription: "Rich tonkotsu broth with fresh noodles",
    fullDescription: "Master the art of Japanese ramen at home! Our kit includes a rich, 12-hour simmered tonkotsu broth, fresh alkaline noodles, perfectly seasoned chashu pork, and traditional toppings.",
    price: 34.99,
    prepTime: "20 min",
    servings: 2,
    difficulty: "Easy",
    cuisine: "Japanese",
    dietaryTags: ["High Protein"],
    chef: "Chef Yuki Tanaka",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    ingredients: ["Fresh Ramen Noodles", "Tonkotsu Broth", "Chashu Pork", "Soft-Boiled Egg", "Nori Seaweed", "Green Onions"],
    userEmail: "demo@chefkit.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "French Coq au Vin",
    shortDescription: "Classic French chicken braised in red wine",
    fullDescription: "Experience French countryside cooking with this timeless classic. Tender chicken slowly braised in rich red wine with pearl onions, mushrooms, and aromatic herbs.",
    price: 38.99,
    prepTime: "90 min",
    servings: 4,
    difficulty: "Hard",
    cuisine: "French",
    dietaryTags: ["High Protein"],
    chef: "Chef Marco Rossi",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    ingredients: ["Chicken Pieces", "Red Wine", "Pearl Onions", "Mushrooms", "Bacon Lardons", "Fresh Herbs"],
    userEmail: "demo@chefkit.com",
    createdAt: new Date().toISOString()
  }
];

async function seedData() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const database = client.db("chefkitDB");
        const mealKitsCollection = database.collection("mealKits");

        // Clear existing data
        await mealKitsCollection.deleteMany({});
        console.log("Cleared existing meal kits");

        // Insert seed data
        const result = await mealKitsCollection.insertMany(mealKits);
        console.log(`${result.insertedCount} meal kits inserted successfully!`);

        // Verify insertion
        const count = await mealKitsCollection.countDocuments();
        console.log(`Total meal kits in database: ${count}`);

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

seedData();
