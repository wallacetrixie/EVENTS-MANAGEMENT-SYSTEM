// Function to open the event creation form popup
function openEventForm() {
  document.getElementById("event-form-popup").style.display = "flex";
}
function closeEventForm() {
  document.getElementById("event-form-popup").style.display = "none";
}
function nextFormSection() {
  document.getElementById("form-section-1").classList.remove("active");
  document.getElementById("form-section-2").classList.add("active");
}
function prevFormSection() {
  document.getElementById("form-section-2").classList.remove("active");
  document.getElementById("form-section-1").classList.add("active");
}

//Getting users name
fetch('get-username')
  .then(response => response.json())
  .then(data => {
    if (data.name) {
      document.getElementById('user-name').textContent = data.name;
    }
    else {
      console.log("Failed to get username");
    }
  
  });
  
document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/events")
    .then((response) => response.json())
    .then((events) => displayEvents(events))
    .catch((error) => console.error("Error fetching events:", error));
});

function displayEvents(events) {
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = ""; // Clear any existing content

  let tableHTML = `
        <table class="events-table">
            <thead>
                <tr>
                    <th class="numbering">#</th>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Guests</th>
                    <th>Budget</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="events-container">
    `;

  events.forEach((event, index) => {
    tableHTML += `
            <tr>
                <td class="numbering">${index + 1}</td>
                <td>${event.EventName}</td>
                <td>${new Date(event.Date).toLocaleDateString()}</td>
                <td>${event.Time}</td>
                <td>${event.Location}</td>
                <td>${event.Number}</td>
                <td>Ksh ${event.Budget}</td>
                <td class="event-actions">
                   
                    <button onclick="openReminderPopup()" class="btn reschedule-btn">
                        <i class="fas fa-bell"></i>set reminder
                    </button>
                     <button  class="btn reschedule-btn">
                        <i class="fas fa-message" ></i>Send invitations
                    </button>
                     <button onclick="openReschedulePopup(${
                       event.eventId
                     })" class="btn reschedule-btn">
                        <i class="fas fa-calendar-alt" ></i>Modify event
                    </button>
                    <button onclick="deleteEvent(${
                      event.eventId
                    })" class="btn delete-btn">
                        <i class="fas fa-trash"></i>Cancel Event
                    </button>
                </td>
            </tr>
        `;
  });

  tableHTML += `
            </tbody>
        </table>
    `;

  eventsContainer.innerHTML = tableHTML;
}


// Toggle Dropdown
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
function openReschedulePopup(eventId) {
    document.getElementById('modify-event-popup').style.display = 'block'; // Show reschedule form
}

function modifyEvent(eventId) {
    // Fetch the existing event details by eventId
    fetch(`/api/events/${eventId}`)
        .then(response => response.json())
        .then(event => {
            // Prefill the form with the event details
            document.getElementById('modify-event-name').value = event.EventName;
            document.getElementById('modify-date').value = event.Date.split('T')[0]; // Ensure proper date format
            document.getElementById('modify-time').value = event.Time;
            document.getElementById('modify-location').value = event.Location;
            document.getElementById('modify-guests').value = event.Number;
            document.getElementById('modify-budget').value = event.Budget;

            // Store eventId in hidden input
            document.getElementById('event-id').value = eventId;

            // Show the modify event popup
            document.getElementById('modify-event-popup').style.display = 'block';
        })
        .catch(err => console.error('Error fetching event details:', err));
}

function saveChanges() {
  const eventId = document.getElementById("event-id").value;
  const updatedEvent = {
    id: eventId,
    name: document.getElementById("modify-name").value,
    date: document.getElementById("modify-date").value,
    time: document.getElementById("modify-time").value,
    location: document.getElementById("modify-location").value,
    number: document.getElementById("modify-number").value,
    budget: document.getElementById("modify-budget").value,
  };

  fetch("http://localhost:5011/update-events", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEvent),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Event updated:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}



// Function to close the popup
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none'; // Hide the popup
    }
}


async function deleteEvent(eventId) {
  const response = await fetch(`http://localhost:5011/delete-event/${eventId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    alert("event deleted");
  } else {
    alert("Error deleting user");
  }
}

  
// Show popup when "Set Reminder" button is clicked
function openReminderPopup() {
    document.getElementById('reminder-popup').style.display = 'flex';
}

// Close popup
function closePopup() {
    document.getElementById('reminder-popup').style.display = 'none';
}


