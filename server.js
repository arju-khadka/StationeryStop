const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// MongoDB connection
mongoose.connect('mongodb+srv://stationerystop12:stationerystop@cluster1.pnwgdzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const JWT_SECRET = 'pagalho';
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
    console.log('Root route accessed - serving login page');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Alternative login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

// Serve main page (after successful login) - protected route
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passwords do not match' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ 
            success: true, 
            message: 'User created successfully' 
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true, 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
};

// Protected route example
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json({ 
            success: true, 
            user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/shop/sproduct1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop', 'sproduct1.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});