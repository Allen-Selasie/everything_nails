// public/admin.js
const adminTable = document.getElementById('admin-table');

// Function to display admin table
function displayAdminTable() {
    fetch('http://localhost:3000/api/sales-entries')
    .then(response => response.json())
    .then(data => {
        // Check if admin is authenticated
        if (data.authenticated) {
            const entries = data.entries;
            // Populate the admin table
            entries.forEach(entry => {
                const row = adminTable.insertRow(-1);
                const keys = Object.keys(entry);
                keys.forEach((key, index) => {
                    const cell = row.insertCell(index);
                    cell.textContent = entry[key];
                });
            });
        } else {
            alert('Admin not authenticated. Please log in.');
            // Redirect to the login page
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to extract CSV from admin table
function extractCSV() {
    const csvContent = "data:text/csv;charset=utf-8," +
        "Receptionist,Customer Name,Phone Number,Service Purchased,Total Cost (GHS),Payment Mode\n";

    const rows = adminTable.rows;
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].cells;
        const values = Array.from(cells).map(cell => cell.textContent).join(',');
        csvContent += values + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admin_sales_entries.csv");
    document.body.appendChild(link);

    link.click();
}

// Call the displayAdminTable function when the admin page loads
displayAdminTable();
