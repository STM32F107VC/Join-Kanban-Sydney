/* Declare global variables and arrays */
let prioImg;
let firstClickedImg;
let oldImg;

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
        "Prio": oldImg,
        "Category": category.value
    });
    resetAddTaskForm();
    document.getElementById('submitBtn').disabled = false;
}

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