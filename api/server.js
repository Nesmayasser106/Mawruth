// api/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// مسارات الملفات
const usersFile = path.join(__dirname, 'data', 'users.json');
const productsFile = path.join(__dirname, 'data', 'products.json');
const cartFile = path.join(__dirname, 'data', 'cart.json');

// تهيئة الملفات إذا مش موجودة
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}
if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, JSON.stringify([
        { id: 1, name: "Handwoven Moroccan Berber Rug", price: 249.99, image: "images/rug.jpg" },
        { id: 2, name: "Vintage Kilim Pillow", price: 89.00, image: "images/pillow.jpg" }
        // أضف باقي المنتجات
    ]));
}
if (!fs.existsSync(cartFile)) {
    fs.writeFileSync(cartFile, JSON.stringify([]));
}

// قراءة ملف
const readFile = (file) => JSON.parse(fs.readFileSync(file));

// كتابة ملف
const writeFile = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ================= APIs =================

// 1. جلب المنتجات
app.get('/api/products', (req, res) => {
    const products = readFile(productsFile);
    res.json(products);
});

// 2. التسجيل (Sign Up)
app.post('/api/signup', (req, res) => {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password || password.length < 8) {
        return res.status(400).json({ message: "Invalid data or password less than 8 characters" });
    }

    const users = readFile(usersFile);
    if (users.find(u => u.email === email || u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ fullName, username, email, password });
    writeFile(usersFile, users);

    res.json({ message: "Account created successfully!", success: true });
});

// 3. تسجيل الدخول (Sign In)
app.post('/api/signin', (req, res) => {
    const { username, password } = req.body;

    const users = readFile(usersFile);
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful!", user: { fullName: user.fullName, email: user.email } });
});

// 4. جلب السلة
app.get('/api/cart', (req, res) => {
    const cart = readFile(cartFile);
    res.json(cart);
});

// 5. إضافة إلى السلة
app.post('/api/cart', (req, res) => {
    const item = req.body;
    const cart = readFile(cartFile);

    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    writeFile(cartFile, cart);
    res.json({ message: "Added to cart", cart });
});

// 6. حذف من السلة
app.delete('/api/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let cart = readFile(cartFile);
    cart = cart.filter(item => item.id !== id);
    writeFile(cartFile, cart);
    res.json({ message: "Item removed", cart });
});

// 7. تحديث الكمية
app.put('/api/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    let cart = readFile(cartFile);
    const item = cart.find(i => i.id === id);
    if (item) item.quantity = quantity;
    writeFile(cartFile, cart);
    res.json(cart);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});