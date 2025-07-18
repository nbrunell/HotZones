////////////////////////////////////////////////////////////////
//DASHBOARD.JS
//THIS IS YOUR "CONTROLLER", IT ACTS AS THE MIDDLEMAN
// BETWEEN THE MODEL (datamodel.js) AND THE VIEW (dashboard.html)
////////////////////////////////////////////////////////////////


//ADD ALL EVENT LISTENERS INSIDE DOMCONTENTLOADED


// function to place user's name on dashboard
async function renderUserName() {
  const profileData = await DataModel.getProfile();

  const userName = profileData.name || "User";

  const introName = document.getElementById("introduction");

  const text = document.createElement("h1");
  text.textContent = `Hi ${userName}!`;

  introName.appendChild(text);
}

// Function to calculate zone percentage and display it on zonemap
async function renderZonePercentages() {
  const zoneStats = await DataModel.getZoneLogs();
  const svg = document.querySelector('svg');

  // Clear old labels
  const labelGroup = document.getElementById("labels");
  labelGroup.innerHTML = "";

  // Map display names to your path IDs
  const coords = {
    "Top of the Key": { x: 635, y: 880 },
    "Free Throw": { x: 635, y: 615 },
    "Left Wing": { x: 75, y: 510 },
    "Right Wing": { x: 1192, y: 510 },
    "Left Mid": { x: 280, y: 380 },
    "Right Mid": { x: 970, y: 380 },
    "Left Corner": { x: 40, y: 200 },
    "Right Corner": { x: 1220, y: 200 },
    "Left Baseline": { x: 272, y: 115 },
    "Right Baseline": { x: 980, y: 115 },
    "Paint": { x: 635, y: 280 }
  };

  zoneStats.forEach(stat => {
    const { zone, total_made, total_taken } = stat;
    const percentage = total_taken > 0 ? (total_made / total_taken * 100).toFixed(1) : "0.0";

    if (!coords[zone]) return;


    if (percentage >= 75) fillColor = "green";
    else if (percentage >= 55) fillColor = "#fcca20";
    else if (percentage >= 35) fillColor = "#fd6214";
    else if (percentage >= 20) fillColor = "#ee1b0b";
    else fillColor = "darkred";

    const zonePath = document.getElementById(zone);
    if (zonePath) {
      zonePath.setAttribute("fill", fillColor);
    }

    const { x, y } = coords[zone];
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white")
    text.setAttribute("font-size", "24");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("class", "zone-percent-label");
    text.textContent = `${percentage}%`;

    const labelGroup = document.getElementById("labels");
    labelGroup.appendChild(text);
  });
}


//AT THE BOTTOM OF DOMCONTENTLOADED, ADD ANY CODE THAT NEEDS TO RUN IMMEDIATELY
document.addEventListener('DOMContentLoaded', () => {

  //////////////////////////////////////////
  //ELEMENTS TO ATTACH EVENT LISTENERS
  //////////////////////////////////////////
  const logoutButton = document.getElementById('logoutButton');
  const refreshButton = document.getElementById('refreshButton');

  // Add modal elements
  const modal = document.getElementById('customModal');
  const modalTitle = document.getElementById('modalZoneTitle');
  const closeModal = document.querySelector('.close-modal');

  //////////////////////////////////////////////////
  // ATTACH CLICK EVENTS FOR ZONES
  //////////////////////////////////////////////////
  document.querySelectorAll('.s0').forEach(zone => {
    zone.addEventListener('click', function () {
      modalTitle.innerText = "Zone: " + this.id; // Update modal title
      modal.style.display = 'flex'; // Show modal
    });
  });

  //////////////////////////////////////////////////
  // CLOSE MODAL WHEN CLICKING CLOSE BUTTON
  //////////////////////////////////////////////////
  closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  //////////////////////////////////////////////////
  // CLOSE MODAL WHEN CLICKING OUTSIDE OF IT
  //////////////////////////////////////////////////
  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  //////////////////////////////////////////////////
  // EVENT LISTENERS FOR LOGOUT 
  //////////////////////////////////////////////////
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  });


  // NEW: Attach event listener for the shooting data form (modal)
  document.getElementById('shooting-data-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get the zone name from the modal title (assumes "Zone: [ZoneName]" format)
    const modalTitleText = document.getElementById('modalZoneTitle').innerText;
    const zoneName = modalTitleText.replace('Zone: ', '');

    const shotsMade = parseInt(document.getElementById('input-shots-made').value, 10);
    const shotsTaken = parseInt(document.getElementById('input-total-shots').value, 10);

    // Validation: prevent more shots made than taken
    if (shotsMade > shotsTaken) {
      alert("Shots made cannot be more than shots taken.");
      return;
    }

    // Debug: Log the captured data
    console.log('Zone Data:', { zone: zoneName, shots_made: shotsMade, shots_taken: shotsTaken });

    const zoneData = {
      zone: zoneName,
      shots_made: parseInt(shotsMade, 10),
      shots_taken: parseInt(shotsTaken, 10)
    };

    // Call DataModel to insert a new zone log record
    const result = await DataModel.updateZoneLogs(zoneData);
    if (result && result.message) {
      console.log(result.message);
      // Clear the form and hide the modal
      document.getElementById('shooting-data-form').reset();
      document.getElementById('customModal').style.display = 'none';
      // Optionally, refresh the displayed zone logs
      renderZonePercentages();
    }
  });



  //////////////////////////////////////////
  //END ELEMENTS TO ATTACH EVENT LISTENERS
  //////////////////////////////////////////


  //////////////////////////////////////////
  //EVENT LISTENERS
  //////////////////////////////////////////
  // Log out and redirect to login
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  });


  //////////////////////////////////////////
  //END EVENT LISTENERS
  //////////////////////////////////////////


  //////////////////////////////////////////////////////
  //CODE THAT NEEDS TO RUN IMMEDIATELY AFTER PAGE LOADS
  //////////////////////////////////////////////////////
  // Initial check for the token
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    window.location.href = '/';
  } else {
    DataModel.setToken(token);
    renderZonePercentages();
    renderUserName();
  }
  //////////////////////////////////////////
  //END CODE THAT NEEDS TO RUN IMMEDIATELY AFTER PAGE LOADS
  //////////////////////////////////////////
});
//END OF DOMCONTENTLOADED


//////////////////////////////////////////
//FUNCTIONS TO MANIPULATE THE DOM
//////////////////////////////////////////
// async function renderUserList() {
//   const userListElement = document.getElementById('userList');
//   userListElement.innerHTML = '<div class="loading-message">Loading user list...</div>';
//   const users = await DataModel.getUsers();
//   users.forEach(user => {
//     const userItem = document.createElement('div');
//     userItem.classList.add('user-item');
//     userItem.textContent = user;
//     userListElement.appendChild(userItem);
//   });
// }

async function loadUserProfile() {
  const profileData = await DataModel.getProfile();
  if (profileData.email) {
    document.getElementById('profile-email').textContent = profileData.email;
  }
}
//////////////////////////////////////////
//END FUNCTIONS TO MANIPULATE THE DOM
//////////////////////////////////////////

// Below is js for hamburger menu//
const hamburger = document.getElementById('hamburger')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')

let menuOpen = false

function openMenu() {
  menuOpen = true
  overlay.style.display = 'block'
  sidebar.style.width = '250px'
}

function closeMenu() {
  menuOpen = false
  overlay.style.display = 'none'
  sidebar.style.width = '0px'
}

hamburger.addEventListener('click', function () {
  if (!menuOpen) {
    openMenu()
  }
})

overlay.addEventListener('click', function () {
  if (menuOpen) {
    closeMenu()
  }
})
// END OF MENU//