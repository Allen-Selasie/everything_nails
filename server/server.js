// server/server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const app = express();
const ngrok = require("@ngrok/ngrok");
const readline = require("readline-sync");
const { exec } = require("child_process");
const axios = require('axios');


const PORT = 3000;
const ngrok_api = "2ZwcRoIcS8b7Y7xhrUyjl1acLE1_25YBwCAszjYPqTyYqugor";
const apiKey = "VGdFUUF1Z3dDWkN5TFVrSWhkbXo";
const JSON_FILE_PATH = "./server/salesEntries.json";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// Parse JSON bodies
app.use(bodyParser.json());

// Function to load sales entries from the JSON file
async function loadData() {
  try {
    const data = await fs.readFile(JSON_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data from file:", error);
    return { entries: [] };
  }
}

// Function to save data to the JSON file
async function saveData(data) {
  try {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(JSON_FILE_PATH, json, "utf8");
    console.log("Data saved successfully.");
  } catch (error) {
    console.error("Error saving data to file:", error);
  }
}

// Define a schema for a sales entry
const salesEntrySchema = {
  receptionist: "", // String
  customerName: "", // String
  phoneNumber: "", // String
  services: [], // Array of Strings
  totalCost: 0, // Number
  paymentMode: "", // String
};
// Function to create a new sales entry based on the schema
function createSalesEntry(
  receptionist,
  customerName,
  phoneNumber,
  services,
  totalCost,
  paymentMode
) {
  // Use Object.assign to create a new object based on the schema
  return Object.assign({}, salesEntrySchema, {
    receptionist,
    customerName,
    phoneNumber,
    services,
    totalCost,
    paymentMode,
  });
}

//handle form input
app.post("/submit", async (req, res) => {
  const {
    receptionist,
    customerName,
    phoneNumber,
    services,
    totalCost,
    paymentMode,
  } = req.body;

  // Add the entry to the array
  const entry = createSalesEntry(
    receptionist,
    customerName,
    phoneNumber,
    services,
    totalCost,
    paymentMode
  );

  const data = await loadData();
  data.entries.push(entry);
  await saveData(data);

  // Save entries to the JSON file
  // console.log(`server entry:${salesEntries}`);
  // Respond with a success message or any relevant information
  res.json({ message: "Form submission successful" });
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  // console.log("Received credentials:", { username, password });
  // Check if the provided credentials are correct
  if (username === "admin" && password === "password") {
    res.status(200).json({
      message: "Authentication successful. You can now access the admin page.",
    });
  } else {
    res.status(401).json({
      message:
        "Authentication failed. Please check your username and password.",
    });
    sessionStorage.setItem("adminAuth", false);
  }
});
app.get("/admin", (req, res) => {
  res.status(200).json({
    message: "Here's today's sales",
  });
});

// Endpoint to get all sales entries
app.get("/api/sales-entries", async (req, res) => {
  try {
    const entries = await loadData();
    res.json({ entries });
    //console.log(entries)
  } catch (error) {
    console.error("Error loading sales entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Get your endpoint online
try {
  async function ngrokConnect() {
    await ngrok
      .connect({ addr: 3000, authtoken: ngrok_api })
      .then((listener) => {
        console.log(`Ingress established at: ${listener.url()}`);
        // Ask the user if they want to send the link via SMS
        const userInput = readline.question(
          "Do you want to send the external link out?:  \nType yes or no "
        );

        if (userInput == "yes") {
          // SEND SMS
          const recipients = [
            "233207959898",
            "233245185065",
            "233269801816",
            "233556830507",
            "233272089304",
          ];

          const smsData = {
            sender: "EvNails&Spa",
            message: `Hello, the new link for accessing the Everything Nails sales input system is:\n http://localhost:${PORT}\n`,
            recipients: recipients,
          };

          const smsConfig = {
            method: "post",
            url: "https://sms.arkesel.com/api/v2/sms/send",
            headers: {
              "api-key": apiKey,
            },
            data: smsData,
          };

          axios(smsConfig)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
  }
  ngrokConnect();
} catch (error) {
  console.log(error);
}
