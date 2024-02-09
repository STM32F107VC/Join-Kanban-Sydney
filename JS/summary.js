/* Declare global variables and arrays */

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_summary(id) {
    await includeHTML();
    await loadContacts();
    getFromLocalStorage();
    // loadAmountOfTasks();
    markActiveLink(id);
    greetUser();
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

function loadSummaryInformations(informations) {

    let totalAmount = document.getElementById('total-tasks');
    let totalUrgent = document.getElementById('urgent');
    let awaitFeedback = document.getElementById('feedback');
    let date = document.getElementById('upcoming-deadline');
    let done = document.getElementById('done');
    let inProgress = document.getElementById('progress');
    let toDo = document.getElementById('to-do');

    totalAmount.innerHTML = informations['Amount-Of-Tasks'];
    done.innerHTML = informations['Done'];
    toDo.innerHTML = informations['To-Do'];
    totalUrgent.innerHTML = informations['Amount-Of-Urgent-Tasks'];
    date.innerHTML = informations['Date'];
    inProgress.innerHTML = informations['In-Progress'];
    awaitFeedback.innerHTML = informations['Await-Feedback'];

    console.log(informations['Amount-Of-Tasks']);
    /**
     * informations['Amount-Of-Tasks'];
     * informations['Amount-Of-Urgent-Tasks'];
     * informations['Await-Feedback'];
     * informations['Date'];
     * informations['Done'];
     * informations['In-Progress'];
     * informations['To-Do'];
     */
}

/**
 * Check if its a user account or a guest login. Then greet the user
 */
async function greetUser() {
    let greetingText = document.getElementById('greet-user');
    let acronym = document.getElementById('acronym');
    let user = JSON.parse(await getItem('guestOrAccount'));
    let name = user['log']['Name'];
    // console.log(user['log']['Name']);
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

/**
 * Forwarding to board.html
 */
function forwardingToBoard() {
    window.location.href = 'board.html';
}

// function loadAmountOfTasks() {
//     let toDos = document.getElementById('in-progress').innerHTML;
//     console.log(toDos);

// }