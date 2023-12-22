// server/server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// Parse JSON bodies
app.use(bodyParser.json());

// Array to store sales entries (in-memory database for simplicity)
let salesEntries = [];

// API endpoint to receive sales entries
app.post("/api/sales-entries", (req, res) => {
  const newEntry = req.body;
  salesEntries.push(newEntry);
  res.status(200).json({ message: "Sales entry received successfully." });
});

// API endpoint to retrieve all sales entries
app.get("/api/sales-entries", (req, res) => {
  res.status(200).json(salesEntries);
});

const adminUsername = "admin";
const adminPassword = "password";
// Admin route to handle authentication
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  // Simple authentication logic
  if (username === adminUsername && password === adminPassword) {
    res.status(200).json({ message: "Admin login successful." });
  } else {
    res.status(401).json({ message: "Invalid credentials." });
  }
});

// Admin route to edit sales entries
app.put("/admin/sales-entries/:entryId", (req, res) => {
  const entryId = req.params.entryId;
  const updatedEntry = req.body;
  // Add your logic to update the sales entry
  // (e.g., find the entry in the array and update its properties)
  const index = salesEntries.findIndex((entry) => entry.id === entryId);
  if (index !== -1) {
    salesEntries[index] = updatedEntry;
    res.status(200).json({ message: "Sales entry updated successfully." });
  } else {
    res.status(404).json({ message: "Sales entry not found." });
  }
});

app.post("/api/sales-entries", (req, res) => {
  const newEntry = req.body;
  // Generate a unique ID for the entry
  newEntry.id = generateUniqueId();
  salesEntries.push(newEntry);
  res
    .status(200)
    .json({ message: "Sales entry received successfully.", entry: newEntry });
});

// API endpoint to retrieve all sales entries
app.get("/api/sales-entries", (req, res) => {
  res.status(200).json({ entries: salesEntries, authenticated: false });
});

// Function to generate a unique ID (you can use a more robust solution in a production environment)
function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
