// Assuming 'eName' is the ID of the input field for employee name
const userDiv = document.getElementById("eName");

// Get the stored username from sessionStorage
const storedUsername = sessionStorage.getItem("username");

// If there's a stored username, set the input field value to it
if (storedUsername) {
  userDiv.value = storedUsername;
}

// Add an 'input' event listener to the input field
userDiv.addEventListener("input", (ev) => {
  // Get the current input value
  let inputValue = ev.target.value.trim();

  // Update sessionStorage only if the input is not empty
  if (inputValue !== "") {
    sessionStorage.setItem("username", inputValue);
  } else {
    alert("Username cannot be empty");
  }
});

const servicesData = [
  { id: "nails", label: "Nails", value: "Nails" },
  { id: "lashes", label: "Lashes", value: "Lashes" },
  { id: "pedicure", label: "Pedicure", value: "Pedicure" },
  { id: "massage", label: "Massage", value: "Massage" },
  { id: "facial", label: "Facial", value: "Facial" },
  { id: "manicure", label: "Manicure", value: "Manicure" },
  { id: "bodyScrub", label: "Body Scrub", value: "BodyScrub" },
  { id: "piercing", label: "Piercing", value: "Piercing" },
];

// Get the container where services will be rendered
const servicesContainer = document.getElementById("servicesContainer");

// Iterate through the services data and create HTML elements
servicesData.forEach((service) => {
  // Create a div for each service
  const serviceDiv = document.createElement("div");
  serviceDiv.id = "input_group";

  // Create a label for the service
  const label = document.createElement("label");
  label.setAttribute("for", service.id);
  label.textContent = service.label;

  // Create an input checkbox for the service
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = service.id;
  checkbox.name = "services";
  checkbox.value = service.value;

  // Append label and checkbox to the service div
  serviceDiv.appendChild(label);
  serviceDiv.appendChild(checkbox);

  // Append the service div to the services container
  servicesContainer.appendChild(serviceDiv);
});
