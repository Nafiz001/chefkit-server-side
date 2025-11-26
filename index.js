const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://chefkit-client-side.vercel.app",
    ],
    credentials: true,
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sqaw1iw.mongodb.net/chefkitDB?retryWrites=true&w=majority`;

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

let mealKitsCollection, usersCollection;

async function getCollections() {
    if (!mealKitsCollection || !usersCollection) {
        const database = client.db("chefkitDB");
        mealKitsCollection = database.collection("mealKits");
        usersCollection = database.collection("users");
    }
    return { mealKitsCollection, usersCollection };
}

app.get('/', (req, res) => {
    res.json({ 
        message: 'ChefKit server is running',
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

// User endpoints
app.get('/users', async (req, res) => {
    try {
        const { usersCollection } = await getCollections();
        
        if (!usersCollection) {
            return res.json([]);
        }
        
        const result = await usersCollection.find({}).toArray();
        res.json(result);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.json([]);
    }
});

app.post('/users', async (req, res) => {
    try {
        const { usersCollection } = await getCollections();
        
        if (!usersCollection) {
            return res.status(503).json({ message: 'Database not ready' });
        }
        
        const newUser = req.body;
        const email = req.body.email;
        const query = { email: email };
        const existingUser = await usersCollection.findOne(query);

        if (existingUser) {
            res.send({ message: 'User already exists' });
        } else {
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        }
    } catch (error) {
        console.error('Error in users endpoint:', error);
        res.status(500).json({ message: 'Error processing user request' });
    }
});

app.get('/users/:email', async (req, res) => {
    try {
        const { usersCollection } = await getCollections();
        
        if (!usersCollection) {
            return res.status(503).json({ message: 'Database not ready' });
        }
        
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// Meal Kit endpoints
app.get('/meal-kits', async (req, res) => {
    try {
        const { mealKitsCollection } = await getCollections();
        
        if (!mealKitsCollection) {
            return res.json([]);
        }
        
        const { cuisine, search, sort } = req.query;
        let query = {};
        
        if (cuisine && cuisine !== 'All') {
            query.cuisine = cuisine;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { chef: { $regex: search, $options: 'i' } },
                { cuisine: { $regex: search, $options: 'i' } }
            ];
        }
        
        let sortOptions = {};
        if (sort === 'price-asc') {
            sortOptions.price = 1;
        } else if (sort === 'price-desc') {
            sortOptions.price = -1;
        } else if (sort === 'newest') {
            sortOptions.createdAt = -1;
        }
        
        const result = await mealKitsCollection.find(query).sort(sortOptions).toArray();
        res.json(result);
    } catch (error) {
        console.error('Error fetching meal kits:', error);
        res.json([]);  // Return empty array on error
    }
});

app.get('/meal-kits/:id', async (req, res) => {
    try {
        const { mealKitsCollection } = await getCollections();
        
        if (!mealKitsCollection) {
            return res.status(503).json({ message: 'Database not ready' });
        }
        
        const id = req.params.id;
        const query = { id: id };
        const result = await mealKitsCollection.findOne(query);
        
        if (!result) {
            return res.status(404).json({ message: 'Meal kit not found' });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching meal kit:', error);
        res.status(500).json({ message: 'Error fetching meal kit' });
    }
});

app.post('/meal-kits', async (req, res) => {
    try {
        console.log('POST /meal-kits request received');
        console.log('body:', req.body);
        
        const { mealKitsCollection } = await getCollections();
        
        if (!mealKitsCollection) {
            return res.status(503).json({ message: 'Database not ready' });
        }
        
        const newMealKit = {
            ...req.body,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        
        const result = await mealKitsCollection.insertOne(newMealKit);
        console.log('Meal kit inserted successfully:', result.insertedId);
        res.json({ success: true, insertedId: result.insertedId });
    } catch (error) {
        console.error('Error adding meal kit:', error);
        res.status(500).json({ success: false, message: 'Error adding meal kit', error: error.message });
    }
});

app.put('/meal-kits/:id', async (req, res) => {
    try {
        const { mealKitsCollection } = await getCollections();
        
        if (!mealKitsCollection) {
            return res.status(503).json({ message: 'Database not ready' });
        }
        
        const id = req.params.id;
        const filter = { id: id };
        const updateDoc = {
            $set: req.body
        };
        
        const result = await mealKitsCollection.updateOne(filter, updateDoc);
        res.send(result);
    } catch (error) {
        console.error('Error updating meal kit:', error);
        res.status(500).json({ message: 'Error updating meal kit' });
    }
});

app.delete('/meal-kits/:id', async (req, res) => {
    try {
        const { mealKitsCollection } = await getCollections();
        
        if (!mealKitsCollection) {
            return res.status(503).json({ message: 'Database not ready' });
        }
        
        const id = req.params.id;
        const query = { id: id };
        const result = await mealKitsCollection.deleteOne(query);
        res.send(result);
    } catch (error) {
        console.error('Error deleting meal kit:', error);
        res.status(500).json({ message: 'Error deleting meal kit' });
    }
});

// Get meal kits by user email
app.get('/my-meal-kits/:email', async (req, res) => {
    try {
        const { mealKitsCollection } = await getCollections();
        
        if (!mealKitsCollection) {
            return res.json([]);
        }
        
        const email = req.params.email;
        const query = { userEmail: email };
        const result = await mealKitsCollection.find(query).toArray();
        res.json(result);
    } catch (error) {
        console.error('Error fetching user meal kits:', error);
        res.json([]);
    }
});

app.listen(port, () => {
    console.log(`ChefKit server is running on port ${port}`);
});
