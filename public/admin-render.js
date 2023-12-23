// admin-render.js

function clearScreen() {
  document.getElementById("renderedContent").innerHTML = "";
}

// Assume you have a function named clearScreen() that clears the screen
function clearScreen() {
  document.getElementById("renderedContent").innerHTML = "";
}

// Function to render sales entries in the admin table
async function renderSalesEntries() {
  clearScreen();

  // Fetch sales entries from the server
  const response = await fetch("/api/sales-entries");
  const data = await response.json();
  const salesEntries = data.entries;

  // Render the table for sales entries
  const table = document.createElement("table");
  table.border = "1";

  // Create table header
  const headerRow = table.insertRow(0);
  const headers = [
    "Receptionist",
    "Customer Name",
    "Phone Number",
    "Service Purchased",
    "Total Cost (GHS)",
    "Payment Mode",
  ];

  headers.forEach((header, index) => {
    const cell = headerRow.insertCell(index);
    cell.textContent = header;
  });

  // Add new rows
  salesEntries.entries.forEach((entry) => {
    // console.log(entry);
    const row = table.insertRow(-1);
    const keys = Object.keys(entry);

    keys.forEach((key, index) => {
      const cell = row.insertCell(index);
      if (key === "services" && Array.isArray(entry[key])) {
        cell.textContent = entry[key].join(", ");
      } else {
        cell.textContent = entry[key];
      }
    });
  });

  // Append the table to the renderedContent div
  document.getElementById("renderedContent").appendChild(table);
}

// Call renderSalesEntries() when needed
renderSalesEntries();

function renderAdminTools() {
  clearScreen();
  // Call a function or load content specific to admin tools
  document.getElementById("renderedContent").innerHTML =
    "<h2>Admin Tools Content</h2>";
}
