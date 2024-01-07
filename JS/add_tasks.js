/* Declare global variables and arrays */
let prioImg;
let firstClickedImg;
let oldImg;
let priorityStatus;

let tasks = [];
let subtasks = [];

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_tasks(id) {
    await includeHTML();
    await loadContacts();
    markActiveLink(id);
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
        "Category": category.value,
        "Subtasks": subtasks
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
        priorityImg.classList.remove('priorityImg');
    } else {
        if (oldImg !== id) {
            priorityImg.src = `assets/img/prio-${id}.svg`;
            priorityImg.classList.remove('priorityImg');
            priorityImgOld.src = `assets/img/prio-default-${oldImg}.png`;
            priorityImgOld.classList.add('priorityImg');
        } else {
            if (priorityImg.src.includes(`assets/img/prio-default-${id}.png`)) {
                priorityImg.src = `assets/img/prio-${id}.svg`;
                priorityImg.classList.remove('priorityImg');
            } else {
                priorityImg.src = `assets/img/prio-default-${id}.png`;
                priorityImg.classList.add('priorityImg');
            }
        }
    }
    oldImg = id;
}

/**
 * Remove plus icon then add cross and tick- icons for canceling and accept
 * subtask
 */
function toggleIcons() {
    let div = document.getElementById('subtasks-content');
    div.classList.add('blueBorderThin');
    let plusIcon = document.getElementById('plus-icon');
    let icons = document.getElementById('subtask-icons');
    plusIcon.classList.add('d-none');
    icons.classList.remove('d-none');
}

/**
 * Add a subtasks. Max. two subtasks possible.
 * Empty subtasks field is not allowed.
 */
function addSubtask() {
    let list = document.getElementById('displaySubtasks');
    let inputValue = document.getElementById('subtasks');
    if ((list.children.length < 2) && !(inputValue.value === "")) {
        subtasks.push(inputValue.value);
        let state = subtasks.length - 1;
        list.innerHTML += /*html*/ `<div id="${state}" class="flex x-space-betw y-center">
                                        <div class="ml-16px">&#x2022; ${inputValue.value}</div>
                                        <div id="subtask-delete-accept" class="flex x-space-betw y-center opacity-zero">
                                            <img onclick="deleteSubtask(${state});" src="/assets/img/subtasks_bin.svg" alt="delete">
                                            <img class="p-lr" src="/assets/img/Vector 19.svg" alt="separator">
                                            <img onclick="editSubtask(${state});" src="/assets/img/subtasks_pencil.svg" alt="edit">
                                        </div>
                                    </div>`;
    } else { console.log('Reached maximum of insertable subtasks.'); }
    clearSubtasks(inputValue);
}

/**
 * Clear subtask input field
 * @param {string} inputValue
 */
function clearSubtasks(inputValue) {
    inputValue.value = '';
}

function deleteSubtask(x) {
    let div = document.getElementById('displaySubtasks');
    // for (let i = 0; i < div.children.length; i++) {
    //     let child = div.children[i];
    //     child
    // }
    // div.removeChildren(div.getElementsByTagName('div')[x]);
    subtasks.splice(x, 1);
}

/**
 * Cancle subtask
 */
function cancleSubtask() {
    let subtask = document.getElementById('subtasks');
    subtask.value = '';
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
    document.getElementById('subtasks').value = '';
    document.getElementById('displaySubtasks').replaceChildren();
    document.getElementById('displaySelectedContacts').replaceChildren();
    document.getElementById('prio-' + `${oldImg}`).src = `assets/img/prio-default-${oldImg}.svg`;
    subtasks = [];
}