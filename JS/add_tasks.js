/* Declare global variables and arrays */
let prioImg;
let firstClickedImg;
let oldImg;

let tasks = [];

/**
 * 
 */
async function init_tasks() {
    await includeHTML();
    await loadContacts();
    assignContact();
}

/**
 * Load available contacts
 */
function assignContact() {
    let assignSection = document.getElementById('assigned-to');
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        assignSection.innerHTML += /*html*/`
            <option id="${contact['name']}" type="checkbox" value="${i}">${contact['name']}</option>`;
    }
}

/**
 * Show all available contacts to assign to a task
 * @param {variable} i This index (i) is the number for selecting
 * the current contact in the contacts = []; array.
 */
function showAssignedContact(i) {
    let selectedContacts = document.getElementById('displaySelectedContacts');
    let contact = contacts[i];
    let array = buildAcronym(contact);
    let acronymUpperCase = array[0];
    let bgc = array[1];

    if (selectedContacts.innerHTML.includes(acronymUpperCase)) {
        // alert('Person wurde dem Ticket bereits hinzugefügt!');
        document.getElementById(`${acronymUpperCase}${i}`).classList.add('alreadyAssigned');
        setTimeout(() => {
            document.getElementById(`${acronymUpperCase}${i}`).classList.remove('alreadyAssigned');
        }, 2000);
    } else {
        selectedContacts.innerHTML += /*html*/`
        <div id='${acronymUpperCase}${i}' class="acronym acronym-small flex x-center y-center mr-4px" style="background-color: #${bgc}">${acronymUpperCase}</div>`;
    }
}

/**
 * Generate acronym for example, Max Mustermann => MM
 * @param {JSON} contact JSON with all values a contact contains
 * @returns Returns the built acronym and background-color from
 */
function buildAcronym(contact) {
    let bgc = contact['background-color'];
    let str = contact['name'].match(/\b(\w)/g);
    let acronymUpperCase = str.join('').toUpperCase();
    return [acronymUpperCase, bgc];
}

/**
 * Function to add new tasks
 * 
 */
function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('textarea');
    let assignedTo = document.getElementById('assigned-to');
    let date = document.getElementById('date');
    let category = document.getElementById('category');
    document.getElementById('submitBtn').disabled = true;
    tasks.push({
        "Title": title.value,
        "Description": description.value,
        "Assigned-to": assignedTo.value,
        "Date": date.value,
        "Prio": oldImg,
        "Category": category.value
    });
    resetAddTaskForm();
    document.getElementById('submitBtn').disabled = false;
}

/**
 * Each priority image calls this function and depeneding
 * on which priority state (image) is clicked/selected, 
 * the id can take the value "high", "medium" and "low"
 * @param {string} id Dynamic id of priority images
 */
function savePriorityState(id) {
    let priorityImg = document.getElementById('prio-' + `${id}`);
    let priorityImgOld = document.getElementById('prio-' + `${oldImg}`);
    if (oldImg === undefined) {
        priorityImg.src = `assets/img/prio-${id}.svg`;
    } else {
        if (oldImg !== id) {
            priorityImg.src = `assets/img/prio-${id}.svg`;
            priorityImgOld.src = `assets/img/prio-default-${oldImg}.svg`;
        } else {
            if (priorityImg.src.includes(`assets/img/prio-default-${id}.svg`)) {
                priorityImg.src = `assets/img/prio-${id}.svg`;
            } else { priorityImg.src = `assets/img/prio-default-${id}.svg`; }
        }
    }
    oldImg = id;
}

/**
 * Clear add task form
 * Not: fucntion not complete so far
 */
function resetAddTaskForm() {
    document.getElementById('title').value = '';
    document.getElementById('textarea').value = '';
    document.getElementById('assigned-to').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
}