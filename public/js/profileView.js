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
    document.getElementById('confirmSave').addEventListener('click', () => {
        updateUserProfile();
    });
    //////////////////////////////////////////
    //END ELEMENTS TO ATTACH EVENT LISTENERS
    //////////////////////////////////////////


    //////////////////////////////////////////
    //EVENT LISTENERS
    //////////////////////////////////////////

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
        loadUserProfile();
    }
    //////////////////////////////////////////
    //END CODE THAT NEEDS TO RUN IMMEDIATELY AFTER PAGE LOADS
    //////////////////////////////////////////
});
//END OF DOMCONTENTLOADED


//////////////////////////////////////////
//FUNCTIONS TO MANIPULATE THE DOM
//////////////////////////////////////////
async function loadUserProfile() {
    const profileData = await DataModel.getProfile();
    if (profileData.email) {
        document.getElementById('profile-email').textContent = profileData.email;
    }
    if (profileData.name) {
        document.getElementById('profile-name-display').textContent = profileData.name;
        // Also pre-fill the edit field so the user can see what’s stored
        document.getElementById('profile-name').value = profileData.name;
    }
    if (profileData.bio) {
        document.getElementById('profile-bio-display').textContent = profileData.bio;
        document.getElementById('profile-bio').value = profileData.bio;
    }
    if (profileData.position) {
        document.getElementById('profile-position-display').textContent = profileData.position;
        document.getElementById('profile-position').value = profileData.position;
    }
}


// Separate async function to update profile when the user confirms save
async function updateUserProfile() {
    // Retrieve form field values
    const name = document.getElementById('profile-name').value;
    const bio = document.getElementById('profile-bio').value;
    const position = document.getElementById('profile-position').value;

    // Send the update to the server
    const result = await DataModel.updateProfile({ name, bio, position });
    if (result && result.message) {
        console.log(result.message);
        // Reload the profile details so the updated values appear
        loadUserProfile();
    }
}

//////////////////////////////////////////
//END FUNCTIONS TO MANIPULATE THE DOM
//////////////////////////////////////////