sessionStorage.setItem("adminAuth", false); //set admin auth to false by default
// Define a schema for a sales entry
const salesEntrySchema = {
  receptionist: "", // String
  customerName: "", // String
  phoneNumber: "", // String
  services: [], // Array of Strings
  totalCost: 0, // Number
  paymentMode: "", // String
};
const salesEntries = [];
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

// Load previous entries from session storage
const storedEntries = sessionStorage.getItem("salesEntries");
if (storedEntries) {
  salesEntries.push(...JSON.parse(storedEntries));
  displayEntries();
}

document
  .getElementById("salesForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let receptionist = document.getElementById("eName").value;
    console.log(receptionist);
    let customerName = document.getElementById("customerName").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let services = Array.from(
      document.querySelectorAll('input[name="services"]:checked')
    ).map((checkbox) => checkbox.value);
    const totalCost = document.getElementById("totalCost").value;
    const paymentMode = document.getElementById("paymentMode").value;

    if (receptionist) {
      try {
        // Send data to the server
        const response = await fetch("/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receptionist,
            customerName,
            phoneNumber,
            services,
            totalCost,
            paymentMode,
          }),
        });

        // Check if the submission was successful
        if (response.ok) {
          // Add the entry to the session
          let salesEntries =
            JSON.parse(sessionStorage.getItem("salesEntries")) || [];
          const entry = createSalesEntry(
            receptionist,
            customerName,
            phoneNumber,
            services,
            totalCost,
            paymentMode
          );
          //console.log(entry);
          salesEntries.push(entry);
          sessionStorage.setItem("salesEntries", JSON.stringify(salesEntries));

          alert("Entry Successful");

          // Clear the form fields
          document.getElementById("customerName").value = "";
          document.getElementById("phoneNumber").value = "";
          document
            .querySelectorAll('input[name="services"]:checked')
            .forEach((checkbox) => (checkbox.checked = false));
          document.getElementById("totalCost").value = "";
          document.getElementById("paymentMode").value = "Cash"; // Reset to default value
        } else {
          alert("Form submission failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      alert("Please select a receptionist.");
    }
    displayEntries();
    location.reload();
  });

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

function openAdminModal() {
  document.getElementById("adminModal").style.display = "block";
}

function closeAdminModal() {
  document.getElementById("adminModal").style.display = "none";
}

document
  .getElementById("adminLoginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    adminLogin();
  });

function adminLogin() {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

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
      if (
        data.message ===
        "Authentication successful. You can now access the admin page."
      ) {
        sessionStorage.setItem("adminAuth", true);
        // alert("Admin login successful!");
        window.location.href = "/admin.html";
      } else {
        alert("Invalid credentials. Admin login failed.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    })
    .finally(() => {
      closeAdminModal();
    });
}
