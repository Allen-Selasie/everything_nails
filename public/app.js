const salesEntries = [];

// Load previous entries from session storage
const storedEntries = sessionStorage.getItem("salesEntries");
if (storedEntries) {
  salesEntries.push(...JSON.parse(storedEntries));
  displayEntries();
}

function submitForm() {
  let receptionist = document.querySelector(
    'input[name="receptionist"]:checked'
  );
  let customerName = document.getElementById("customerName").value;
  let phoneNumber = document.getElementById("phoneNumber").value;
  let services = Array.from(
    document.querySelectorAll('input[name="services"]:checked')
  ).map((checkbox) => checkbox.value);
  const totalCost = document.getElementById("totalCost").value;
  const paymentMode = document.getElementById("paymentMode").value;

  if (receptionist) {
    // Add the entry to the array
    const entry = {
      receptionist: receptionist.value,
      customerName,
      phoneNumber,
      services,
      totalCost,
      paymentMode,
    };
    salesEntries.push(entry);

    // Display the entries
    displayEntries();

    // Save entries to session storage
    sessionStorage.setItem("salesEntries", JSON.stringify(salesEntries));

    // Clear the form fields
    document.getElementById("customerName").value = "";
    document.getElementById("phoneNumber").value = "";
    document
      .querySelectorAll('input[name="services"]:checked')
      .forEach((checkbox) => (checkbox.checked = false));
    document.getElementById("totalCost").value = "";
    document.getElementById("paymentMode").value = "Cash"; // Reset to default value
  } else {
    alert("Please select a receptionist.");
  }
}

function displayEntries() {
  const table = document.querySelector("table");

  // Clear existing rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Add new rows
  salesEntries.forEach((entry) => {
    const row = table.insertRow(-1);
    const keys = Object.keys(entry);

    keys.forEach((key, index) => {
      const cell = row.insertCell(index);
      if (key === "services") {
        cell.textContent = entry[key].join(", ");
      } else {
        cell.textContent = entry[key];
      }
    });
  });
}

function extractCSV() {
  let csvContent =
    "data:text/csv;charset=utf-8," +
    "Receptionist,Customer Name,Phone Number,Service Purchased,Total Cost (GHS),Payment Mode\n";

  salesEntries.forEach((entry) => {
    const services = entry.services.join(", ");
    const values = `${entry.receptionist},${entry.customerName},${entry.phoneNumber},${services},${entry.totalCost},${entry.paymentMode}`;
    csvContent += values + "\n";
  });
  console.log(csvContent);
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sales_entries.csv");

  // Select a specific element to append the link
  let downloadContainer = document.getElementById("download-container");
  downloadContainer.appendChild(link);

  // Trigger the click event programmatically
  link.click();

  // Remove the link after clicking
  downloadContainer.removeChild(link);
}

function adminLogin() {
  const username = prompt("Enter admin username:");
  const password = prompt("Enter admin password:");

  fetch("/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.message === "Admin login successful.") {
        alert("Admin login successful!");
        isAdminAuthenticated = true;
        window.location.href = "/admin.html"; // Redirect on the client side
      } else {
        alert("Invalid credentials. Admin login failed.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
