////////////////////////////////////////////////////////////////
//DASHBOARD.JS
//THIS IS YOUR "CONTROLLER", IT ACTS AS THE MIDDLEMAN
// BETWEEN THE MODEL (datamodel.js) AND THE VIEW (dashboard.html)
////////////////////////////////////////////////////////////////


//ADD ALL EVENT LISTENERS INSIDE DOMCONTENTLOADED
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
   // EVENT LISTENERS FOR LOGOUT & REFRESH BUTTONS
   //////////////////////////////////////////////////
   logoutButton.addEventListener('click', () => {
       localStorage.removeItem('token');
       window.location.href = '/';
   });

   refreshButton.addEventListener('click', async () => {
       renderUserList();
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

  // Refresh list when the button is clicked
  refreshButton.addEventListener('click', async () => {
    renderUserList();
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
    renderUserList();
  }
  //////////////////////////////////////////
  //END CODE THAT NEEDS TO RUN IMMEDIATELY AFTER PAGE LOADS
  //////////////////////////////////////////
});
//END OF DOMCONTENTLOADED


//////////////////////////////////////////
//FUNCTIONS TO MANIPULATE THE DOM
//////////////////////////////////////////
async function renderUserList() {
  const userListElement = document.getElementById('userList');
  userListElement.innerHTML = '<div class="loading-message">Loading user list...</div>';
  const users = await DataModel.getUsers();
  users.forEach(user => {
    const userItem = document.createElement('div');
    userItem.classList.add('user-item');
    userItem.textContent = user;
    userListElement.appendChild(userItem);
  });
}

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