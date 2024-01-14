/* Declare global variables and arrays */
let prioImg;
let firstClickedImg;
let oldImg;
let priorityStatus;

let state;

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
    let bgcCode = checkCategory(category);
    document.getElementById('submitBtn').disabled = true;
    tasks.push({
        "Title": title.value,
        "Description": description.value,
        "Assigned-to": assignedTo.value,
        "Date": date.value,
        "Prio": oldImg,
        "Category": category.value,
        "Bgc-Code": bgcCode,
        "Subtasks": subtasks
    });
    setToLocalStorage(tasks);
    resetAddTaskForm();
    document.getElementById('submitBtn').disabled = false;
}

/**
 * 
 * @param {*} c Includes the current category either 'User Story' or 'Technical Task'
 * @returns The hexadecimal background color code
 */
function checkCategory(c) {
    if (c.value == 'Technical Task') {
        let bgcCode = '#1FD7C1';
        return bgcCode;
    } else {
        let bgcCode = '#0038FF';
        return bgcCode;
    }
}

/**
 * Testwise local storage in workflow use backend
 * 
 */
function setToLocalStorage(t) {
    let tasksToString = JSON.stringify(t);
    localStorage.setItem('tasks', tasksToString);
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
    if (oldImg === undefined) setFirstTimePriorityState(priorityImg, id);
    else {
        if (oldImg !== id) setCurrentPriorityState(priorityImg, priorityImgOld, id);
        else {
            if (priorityImg.src.includes(`assets/img/prio-default-${id}.png`)) replaceDefaultPriorityImg(priorityImg, id);
            else setDefaultPriorityImg(priorityImg, id);
        }
    }
    oldImg = id;
}

/**
 * First time a priortiy state is clicke, this function will be executed
 * to set current selected priority state
 * @param {img} img Current img
 * @param {string} id Current id of img
 */
function setFirstTimePriorityState(img, id) {
    img.src = `assets/img/prio-${id}.svg`;
    img.classList.remove('priorityImg');
}

/**
 * Sets the current priority state and mark them and 
 * remove the old state and marked one
 * @param {img} img 
 * @param {string} imgOld 
 * @param {string} id 
 */
function setCurrentPriorityState(img, imgOld, id) {
    img.src = `assets/img/prio-${id}.svg`;
    img.classList.remove('priorityImg');
    imgOld.src = `assets/img/prio-default-${oldImg}.png`;
    imgOld.classList.add('priorityImg');
}

/**
 * Replace the default priority and set current
 * selected state
 * @param {img} img Current img
 * @param {string} id Current id of img
 */
function replaceDefaultPriorityImg(img, id) {
    img.src = `assets/img/prio-${id}.svg`;
    img.classList.remove('priorityImg');
}

/**
 * Set default img like no priority state is
 * selected
 * @param {img} img Current img
 * @param {string} id Current id of img
 */
function setDefaultPriorityImg(img, id) {
    img.src = `assets/img/prio-default-${id}.png`;
    img.classList.add('priorityImg');
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
        state = subtasks.length - 1;
        list.innerHTML += subtaskTemplate(state, inputValue);
        let editImg = document.getElementById(`edite${state}`);
        editImg.addEventListener('click', clickHandlerEdit);
    } else { console.log('Reached maximum of insertable subtasks.'); }
    clearSubtasks(inputValue);
}

function clickHandlerEdit() {
    editSubtask(state);
}

function clickHandlerSave(state) {
    saveSubtaskChanges(state);
}

/**
 * Template to render new subtask
 * @param {variable} state 
 * @param {string} inputValue 
 * @returns 
 */
function subtaskTemplate(state, inputValue) {
    return /*html*/ `<div ondblclick="editSubtask(${state});" id="subtask${state}" class="sub-pseudo c-pointer flex x-space-betw y-center mb-4px">
                        <ul class="w-100 outline-none"><li id="value${state}">${inputValue.value}</li></ul>
                        <div id="subtask-delete-accept" class="flex x-space-betw y-center opacity-zero">
                            <img id="delete${state}" onclick="deleteSubtask(${state});" src="/assets/img/subtasks_bin.svg" alt="delete">
                            <img class="p-lr" src="/assets/img/Vector 19.svg" alt="separator">
                            <img id="edite${state}" src="/assets/img/subtasks_pencil.svg" alt="edit">
                        </div>
                    </div>`;
}

/**
 * Make subtask editable to change
 * @param {variable} state Index of the subtask
 */
function editSubtask(state) {
    let subtask = document.getElementById(`subtask${state}`);
    let subtaskValue = document.getElementById(`value${state}`);
    let replaceImg = document.getElementById(`edite${state}`);
    let deleteImg = document.getElementById(`delete${state}`);


    // replaceImg.id = 'save' + state;
    replaceImg.removeEventListener('click', clickHandlerEdit);
    replaceImg.src = 'assets/img/subtasks_tick.svg';
    replaceImg.addEventListener('click', function () { clickHandlerSave(state) });



    replaceImg.classList.add('icon-hover');
    deleteImg.classList.add('icon-hover');
    subtaskValue.setAttribute('contenteditable', 'true');
    subtask.classList.add('bg-white');
    subtask.classList.remove('sub-pseudo');
}


function saveSubtaskChanges(state) {
    console.log('Entered saveSubtaskChanges function.', state);
    let subtask = document.getElementById(`subtask${state}`);
    let subtaskValue = document.getElementById(`value${state}`);
    let replaceImg = document.getElementById(`edite${state}`);
    let deleteImg = document.getElementById(`delete${state}`);

    // replaceImg.id = 'edite' + state;
    replaceImg.removeEventListener('click', clickHandlerSave);
    replaceImg.src = '/assets/img/subtasks_pencil.svg';
    replaceImg.addEventListener('click', clickHandlerEdit);

    replaceImg.classList.remove('icon-hover');
    deleteImg.classList.remove('icon-hover');
    subtaskValue.removeAttribute('contenteditable');
    subtask.classList.remove('bg-white');
    subtask.classList.add('sub-pseudo');

    console.log(subtaskValue.textContent);
    subtasks[state] = subtaskValue.textContent;
}

/**
 * Clear subtask input field
 * @param {string} inputValue
 */
function clearSubtasks(inputValue) {
    inputValue.value = '';
}

/**
 * Function to delete an added subtask
 * @param {variable} x Id number of the subtask
 */
function deleteSubtask(x) {
    let div = document.getElementById(`subtask${x}`);
    if (x == 1 && subtasks.length == 1) {
        subtasks.splice(0, 1);
    } else subtasks.splice(x, 1);
    div.remove();
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
    document.getElementById('prio-' + `${oldImg}`).src = `assets/img/prio-default-${oldImg}.png`;
    subtasks = [];
}