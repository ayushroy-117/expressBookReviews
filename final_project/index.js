const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication Middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Retrieve token from session
    const token = req.session.token;
    
    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, "fingerprint_customer");
        req.user = decoded; // store decoded user information in request
        next(); // proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
