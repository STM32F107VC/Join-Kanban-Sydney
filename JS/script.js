async function init() {
    await includeHTML();
}

/* Declare variable */
let signUp = [];
let users = [];


function openSignUpSection() {
    document.getElementById('loggin').classList.add('d-none');
    document.getElementById('sign-up').classList.remove('d-none');
}

function closeSignUpSection() {
    document.getElementById('loggin').classList.remove('d-none');
    document.getElementById('sign-up').classList.add('d-none');
}

/**
 * This function is used to take information of the registration process
 * @param {string} name This is the name of the person registering
 * @param {string} email This is the email of the person registering 
 * @param {string} password This is the password of the person registering
 * @param {string} comparePassword This is the password to compare of the person registering
 */
function addNewUser() {
    console.log('addNewUser function');
    let name = document.getElementById("new-name");
    let email = document.getElementById("new-email");
    let password = document.getElementById("new-password");
    let comparePassword = document.getElementById("compare-password");
    saveNewUser(name, email, password, comparePassword);
}

function saveNewUser(name, email, password, comparePassword) {
    if (password.value == comparePassword.value) {
        console.log('Registration succesfull.');
        let addUser = {
            "Name": name,
            "Email": email,
            "Password": password,
        }
        users.push(addUser);
        name.value = "";
        email.value = "";
        password.value = "";
        comparePassword.value = "";
    } else { console.log('Registration failed, check input!'); }
}


function openContactsOverlay() {
    document.getElementById('contacts').classList.add('d-none');
    document.getElementById('body-contacts').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.add("opacity", "z-ind--1");
    document.getElementById('overlay-contacts').classList.remove('d-none');
}

function closeContactOverlay() {
    document.getElementById('contacts').classList.remove('d-none');
    document.getElementById('body-contacts').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.remove("opacity", "z-ind--1");
    document.getElementById('overlay-contacts').classList.add('d-none');
}