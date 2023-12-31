/* Declare global variables and arrays */
let prioImg;
let tasks = [];

async function init_tasks() {
    await includeHTML();
    await loadContacts();
    assignContact();
}


function assignContact() {
    let assignSection = document.getElementById('assigned-to');
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        // console.log(`${contact['name']}`);
        assignSection.innerHTML += /*html*/`
            <option value="${contact['name']}">${contact['name']}</option>`;
    }
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
        // "Prio": prioImg[0]
        "Category": category.value
    });
    resetAddTaskForm();
    document.getElementById('submitBtn').disabled = false;
}

function savePriorityState(id) {
    let priorityImg = document.getElementById('prio-' + `${id}`);
    priorityImg.src = `assets/img/prio-${id}.svg`;
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