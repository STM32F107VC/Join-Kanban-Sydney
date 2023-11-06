/* Declare variable */
let signUp = [];
let users = [];

async function init() {
    await includeHTML();
    await loadUsers();
}

/**
 * Load users from remote storage
 * 
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (error) {
        console.info('Could not load useres.');
    }
}

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    // document.getElementById('login-btn').disabled;
    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        window.location.href = "summary.html";
    }

    console.log('Gespeicherte Benutzerkonten', users);
}

/**
 * Login as a guest forwarding to summary.html
 * @param {attribute} location Has the old link from login.html in it which gets overwritte by summary.html
 */
function loginAsGuest() {
    location.href = "summary.html"
}

/**
 * Function to open sign up and remove login section
 * 
 */
function openSignUpSection() {
    document.getElementById('loggin').classList.add('d-none');
    document.getElementById('sign-up').classList.remove('d-none');
}

/**
 * Function to remove sign up and open login section
 * 
 */
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
async function addNewUser() {
    console.log('addNewUser function');
    let name = document.getElementById("new-name");
    let email = document.getElementById("new-email");
    let password = document.getElementById("new-password");
    let comparePassword = document.getElementById("compare-password");
    saveNewUser(name, email, password, comparePassword);
    await setItem('users', JSON.stringify(users));
}

/**
 * 
 * @param {string} name This is the name of the person registering
 * @param {string} email This is the email of the person registering 
 * @param {string} password This is the password of the person registering
 * @param {string} comparePassword This is the password to compare of the person registering
 */
function saveNewUser(name, email, password, comparePassword) {
    if (password.value == comparePassword.value) {
        console.log('Registration succesfull.');
        users.push({
            "Name": name.value,
            "Email": email.value,
            "Password": password.value,
        });
        resetRegisterForm(name, email, password, comparePassword);
    } else { console.log('Registration failed, check input!'); }
}

/**
 * Function to clear register form
 * @param {string} n Variable with name in it
 * @param {string} e Variable with email in it
 * @param {string} p Variable with password in it
 * @param {string} cp Variable with password in it
 */
function resetRegisterForm(n, e, p, cp) {
    n.value = "";
    e.value = "";
    p.value = "";
    cp.value = "";
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