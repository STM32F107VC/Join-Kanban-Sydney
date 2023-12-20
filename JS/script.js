/* Declare variables and arrays */
let signUp = [];
let users = [];
let numberRandom;

async function init() {
    await includeHTML();
    await loadUsers();
    await loadContacts();
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
    for (let u = 0; u < users.length; u++) {
        let user = users[u];
        if (user.Email == email.value && user.Password == password.value) {
            window.location.href = "summary.html";
            console.log('Gespeicherte Benutzerkonten', users);
        }
    }
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
    document.getElementById('login').classList.add('d-none');
    document.getElementById('sign-up').classList.remove('d-none');
}

/**
 * Function to remove sign up and open login section
 * 
 */
function closeSignUpSection() {
    document.getElementById('login').classList.remove('d-none');
    document.getElementById('sign-up').classList.add('d-none');
}

/**
 * Removes or adds the d-none class depending on if menu is open or not. open --> add / close --> remove
 * 
 */
function openLogoutMenu() {
    let addClassList = document.getElementById('log-out');
    if (addClassList.classList.contains('d-none'))
        document.getElementById('log-out').classList.remove('d-none');
    else {
        document.getElementById('log-out').classList.add('d-none');
    }
}

/**
 * Go back to summary.html page
 * 
 */
function goBack() {
    location.replace('summary.html');
    // location.href = 'summary.html';
}

/**
 * Go to help.html page
 */
function goToHelp() {
    location.replace('help.html');
}

/**
 * This function is used to take information of the registration process
 * @param {string} name This is the name of the person registering
 * @param {string} email This is the email of the person registering 
 * @param {string} password This is the password of the person registering
 * @param {string} comparePassword This is the password to compare of the person registering
 */
async function addNewUser() {
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