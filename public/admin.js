// public/admin.js
const adminTable = document.getElementById('admin-table');

document.addEventListener("DOMContentLoaded", () => {
    fetch("/admin")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const adminAuth = sessionStorage.getItem("adminAuth");
        if (!adminAuth) {
            alert("You are not authenticated. Redirecting to the index page.");
            window.location.href = "/index.html"; // Replace with the actual path
          }
        return response.json();
      })
      .then(data => {
        // Handle the received data as needed
        console.log(data.message);
        // Render the admin table or perform other actions
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle errors more gracefully, e.g., show a user-friendly message
       // alert("An error occurred while fetching data. Please try again later.");
      });
});

/*

// Function to display admin table
function displayAdminTable() {
    // Fetch sales entries from the server
    fetch('/api/sales-entries')
      .then(response => response.json())
      .then(data => {
        const entries = data.entries;
  
        // Clear existing table rows
        adminTable.innerHTML = '';
  
        // Create table header
        const headerRow = adminTable.insertRow(0);
        const headers = ['Receptionist', 'Customer Name', 'Phone Number', 'Service Purchased', 'Total Cost (GHS)', 'Payment Mode'];
  
        headers.forEach((header, index) => {
          const cell = headerRow.insertCell(index);
          cell.textContent = header;
        });
  
        // Populate the table with entries
        entries.forEach((entry, entryIndex) => {
          const row = adminTable.insertRow(entryIndex + 1); // Start from row 1 to leave space for the header
  
          Object.values(entry).forEach((value, index) => {
            const cell = row.insertCell(index);
            cell.textContent = Array.isArray(value) ? value.join(', ') : value;
          });
        });
      })
      .catch(error => {
        console.error('Error fetching sales entries:', error);
      });
  }
  */
