/* Declare global variables and arrays */

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_summary(id) {
    await includeHTML();
    await loadContacts();
    getFromLocalStorage();
    loadAmountOfTasks();
    markActiveLink(id);
    greetUser();
}

/**
 * Load tasks from local storage ---------------- change to remote storage later!!
 */
async function getFromLocalStorage() {
    let tasksToString = localStorage.getItem('tasks');
    if (tasksToString) {
        let object = JSON.parse(tasksToString);
        tasks = object;
    }
}

/**
 * Check if its a user account or a guest login. Then greet the user
 */
async function greetUser() {
    let greetingText = document.getElementById('greet-user');
    let acronym = document.getElementById('acronym');
    let user = JSON.parse(await getItem('guestOrAccount'));
    let name = user['log']['Name'];
    console.log(user['log']['Name']);
    user = user['log'];
    if (user === 'guest') {
        acronym.textContent = 'G';
        // greetingText.textContent = 'Guest';
    } else {
        let acronymUpperCase = buildAcronymContact(name, true);
        acronym.textContent = acronymUpperCase;
        // greetingText.textContent = name;
    }
}

function forwardingToBoard() {
    window.location.href = 'board.html';
}

function loadAmountOfTasks() {

}