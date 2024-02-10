/* Declare global variables and arrays */

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_summary(id) {
    await includeHTML();
    await loadContacts();
    getFromLocalStorage();
    markActiveLink(id);
    greetUser('summary');
}

/**
 * Load tasks from local storage ---------------- change to remote storage later!!
 */
async function getFromLocalStorage() {
    let tasksToString = localStorage.getItem('tasks');
    let summaryInformationsToString = localStorage.getItem('summary-informations');
    if (tasksToString) {
        let object = JSON.parse(tasksToString);
        tasks = object;
    }
    if (summaryInformationsToString) {
        // console.log(JSON.parse(summaryInformationsToString));
        let informationObj = JSON.parse(summaryInformationsToString);
        loadSummaryInformations(informationObj);
    }
}

/**
 * Get elements for setting: How many tasks in each column, urgent tasks, most urgent deadline
 * 
 * @param {JSON} informations 
 */
function loadSummaryInformations(informations) {
    let totalAmount = document.getElementById('total-tasks');
    let totalUrgent = document.getElementById('urgent');
    let awaitFeedback = document.getElementById('feedback');
    let date = document.getElementById('upcoming-deadline');
    let done = document.getElementById('done');
    let inProgress = document.getElementById('progress');
    let toDo = document.getElementById('to-do');
    setSummaryInformations(informations, totalAmount, totalUrgent, awaitFeedback, date, done, inProgress, toDo);
}

/**
 * Set informaitons for summary: How many tasks in each column, total tasks,
 * urgent tasks, most urgent deadline
 * @param {variable} tA Total amount of tasks
 * @param {variable} tU Total amount of urgent tasks
 * @param {variable} aF Tasks in await feedback column
 * @param {variable} date Most urgent date of urgent tasks
 * @param {variable} done Task in done column
 * @param {variable} iP Tasks in in porgress column
 * @param {variable} toDo Task in to do column
 */
function setSummaryInformations(inf, tA, tU, aF, date, done, iP, toDo) {
    tA.innerHTML = inf['Amount-Of-Tasks'];
    done.innerHTML = inf['Done'];
    toDo.innerHTML = inf['To-Do'];
    tU.innerHTML = inf['Amount-Of-Urgent-Tasks'];
    date.innerHTML = inf['Date'];
    iP.innerHTML = inf['In-Progress'];
    aF.innerHTML = inf['Await-Feedback'];
}

/**
 * Check if its a user account or a guest login. Then greet the user
 */
async function greetUser(location) {
    let greetingText = document.getElementById('greet-user');
    let acronym = document.getElementById('acronym');
    let user = JSON.parse(await getItem('guestOrAccount'));
    let name = user['log']['Name'];
    user = user['log'];
    if (user === 'guest') {
        acronym.textContent = 'G';
        if (location === 'summary') greetingText.textContent = 'Guest';
    } else {
        let acronymUpperCase = buildAcronymContact(name, true);
        acronym.textContent = acronymUpperCase;
        if (location === 'summary') greetingText.textContent = name;
    }
}

/**
 * Forwarding to board.html
 */
function forwardingToBoard() {
    window.location.href = 'board.html';
}