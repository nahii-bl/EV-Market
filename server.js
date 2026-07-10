const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// MUST ADD THIS: Allows your server to read incoming JSON form data
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// MUST ADD THIS: Handles the contact form submission from script.js
app.post("/api/requests", (req, res) => {
    console.log("Received data:", req.body);
    // For now, just send back a success message so the app doesn't crash
    res.status(200).json({ message: "Request received successfully!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
