const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from public directory

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/stationery_shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    brand: String,
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

// Routes

// Get all cart items
app.get('/api/cart', async (req, res) => {
    try {
        const cartItems = await CartItem.find();
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add item to cart
app.post('/api/cart', async (req, res) => {
    try {
        const { productId, name, price, quantity, image, brand } = req.body;
        
        // Check if item already exists in cart
        const existingItem = await CartItem.findOne({ productId });
        
        if (existingItem) {
            // Update quantity if item exists
            existingItem.quantity += quantity;
            await existingItem.save();
            res.json(existingItem);
        } else {
            // Create new cart item
            const newItem = new CartItem({
                productId,
                name,
                price,
                quantity,
                image,
                brand
            });
            await newItem.save();
            res.json(newItem);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update cart item quantity
app.put('/api/cart/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        const updatedItem = await CartItem.findByIdAndUpdate(
            req.params.id,
            { quantity },
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from cart
app.delete('/api/cart/:id', async (req, res) => {
    try {
        await CartItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear entire cart
app.delete('/api/cart', async (req, res) => {
    try {
        await CartItem.deleteMany({});
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/shop/sproduct1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop', 'sproduct1.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure MongoDB is running on localhost:27017');
});