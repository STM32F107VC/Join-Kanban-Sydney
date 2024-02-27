/* Declare global variables and arrays */
let prioImg;
let firstClickedImg;
let oldImg;
let priorityStatus;
let k = false;
let state;

let tasks = [];
let subtasks = [];
let assignedContacts = [];

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_tasks(id) {
    await includeHTML();
    await loadContacts();
    markActiveLink(id);
    greetUser();
    getAddTaskMenu('basic');
    assignContact('basic');
}

/**
 * Check if add task menu is called from basic menu 
 * add_task.html or from board.html as overlay menu
 * @param {string} location Includes either 'basic' or 'overlay'
 */
function getAddTaskMenu(location) {
    let AddTaskDiv = document.getElementById('add-tasks-' + `${location}` + '-view');
    AddTaskDiv.innerHTML = getAddTaskOverlayMenuTemplate(location);
    if (AddTaskDiv.id == 'add-tasks-basic-view') {
        document.querySelector('div.close-cross').remove();
    }
}

/**
 * Load available contacts
 */
function assignContact(location) {
    let assignSection = document.getElementById('assigned-' + `${location}`);
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
function showAssignedContact(i, location) {
    let selectedContacts = document.getElementById('displaySelectedContacts-' + `${location}`);
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
        assignedContacts.push(contact);
        selectedContacts.innerHTML += renderSelectedContact(acronymUpperCase, i, bgc);
    }
}

function renderSelectedContact(auC, i, bgc) {
    return /*html*/`
    <div id='${auC}${i}' class="acronym p-6px flex x-center y-center mr-4px" style="background-color: #${bgc}">
        ${auC}
    </div>`;
}

/**
 * Generate acronym for example, Max Mustermann => MM
 * @param {JSON} contact JSON with all values a contact contains
 * @returns Returns the built acronym and background-color
 */
function buildAcronym(contact) {
    let bgc = contact['background-color'];
    let str = contact['name'].match(/\b(\w)/g);
    let acronymUpperCase = str.join('').toUpperCase();
    return [acronymUpperCase, bgc];
}

/**
 * Function to add new tasks and save into tasks JSON-array
 *
 */
async function addTask(location) {
    let title = document.getElementById(`title-${location}`);
    let description = document.getElementById(`textarea-${location}`);
    let assignedTo = document.getElementById(`assigned-${location}`);
    let date = document.getElementById(`date-${location}`);
    let category = document.getElementById(`category-${location}`);
    let bgcCode = checkCategory(category);
    document.getElementById('submitBtn').disabled = true;
    tasks.push({
        "Title": title.value,
        "Description": description.value,
        "Assigned-to": assignedContacts,
        "Date": date.value,
        "Prio": oldImg,
        "Category": category.value,
        "Bgc-Code": bgcCode,
        "Subtasks": subtasks,
        "Active-Subtasks": array = setHowManySubtasks(),
        "Progressbar-Value": percent,
        "Column-location": 'backlog'
    });
    setToLocalStorage(tasks, 'tasks');
    // await setItem('tasks', JSON.stringify(tasks));
    resetAddTaskForm(location);
    document.getElementById('submitBtn').disabled = false;
}

/**
 * Check how many subtasks added to a task
 * The array exists out of two place. If there is a 0
 * there is no subtask if there is a 1 there is a subtask added
 */
function setHowManySubtasks() {
    if (subtasks.length == 0) {
        percent = 0;
        return [0, 0];
    } else if (subtasks.length == 1) {
        percent = 50;
        return [1, 0];
    } else if (subtasks.length == 2) {
        percent = 100;
        return [1, 1];
    }
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
function setToLocalStorage(t, n) {
    let tasksToString = JSON.stringify(t);
    localStorage.setItem(`${n}`, tasksToString);
}

/**
 * Each priority image calls this function and depeneding
 * on which priority state (image) is clicked/selected,
 * the id can take the value "high", "medium" and "low"
 * @param {string} id Dynamic id of priority images
 */
function savePriorityState(id, location) {
    let div = document.getElementById(`priority-container-${location}`);
    let priorityImg = div.querySelector('#prio-' + `${id}-` + `${location}`);
    let priorityImgOld = div.querySelector('#prio-' + `${oldImg}-` + `${location}`);
    // let priorityImgId = priorityImg.id;

    if (location == 'edit-overlay') prioEditDefault(location);

    if (oldImg === undefined) setFirstTimePriorityState(priorityImg, id, location);
    else {
        if (oldImg !== id) setCurrentPriorityState(priorityImg, priorityImgOld, id);
        else {
            if (priorityImg.src.includes(`assets/img/prio-default-${id}.png`)) replaceDefaultPriorityImg(priorityImg, id);
            else {
                setDefaultPriorityImg(priorityImg, id);
                id = undefined;
            }
        }
    }
    oldImg = id;
}

/**
 * If edit task is called, after selecting a new priority state, set all to default and
 * then set new state.
 */
function prioEditDefault(location) {
    document.getElementById(`prio-low-${location}`).src = `assets/img/prio-default-low.png`;
    document.getElementById(`prio-medium-${location}`).src = `assets/img/prio-default-medium.png`;
    document.getElementById(`prio-high-${location}`).src = `assets/img/prio-default-high.png`;
}

/**
 * First time a priortiy state is clicke, this function will be executed
 * to set current selected priority state
 * @param {img} img Current img
 * @param {string} id Current id of img
 */
function setFirstTimePriorityState(img, id, location) {
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
    img.classList.add('priorityImg');
    img.src = `assets/img/prio-default-${id}.png`;
}

/**
 * Remove plus icon then add cross and tick- icons for canceling and accept
 * subtask
 */
function toggleIcons(location) {
    let div = document.getElementById('subtasks-content-' + `${location}`);
    div.classList.add('blueBorderThin');
    let plusIcon = document.getElementById('plus-icon-' + `${location}`);
    let icons = document.getElementById('subtask-icons-' + `${location}`);
    plusIcon.classList.add('d-none');
    icons.classList.remove('d-none');
}

/**
 * Add a subtasks. Max. two subtasks possible.
 * Empty subtasks field is not allowed.
 */
function addSubtask(location) {
    let list = document.getElementById('displaySubtasks-' + `${location}`);

    let input = document.getElementById('subtasks-' + `${location}`);
    let inputValue = input.value;

    if ((list.children.length < 2) && !(inputValue === "")) {
        subtasks.push(inputValue);
        state = subtasks.length - 1;
        list.innerHTML += subtaskTemplate(state, inputValue, location);
        let editImg = document.getElementById(`edite${state}-${location}`);
        editImg.addEventListener('click', clickHandlerEdit);
    } else { console.log('Reached maximum of insertable subtasks.'); }
    clearSubtasks(input);
}

/**
 * Set the "click" eventlistener for edit subtasks
 */
function clickHandlerEdit() {
    editSubtask(state);
}

/**
 * Set the "click" eventlistener for saving tasks
 */
function clickHandlerSave(state, location) {
    saveSubtaskChanges(state, location);
}

/**
 * Template to render new subtask
 * @param {variable} state Index of the subtask
 * @param {string} inputValue
 * @returns
 */
function subtaskTemplate(state, inputValue, location) {
    return /*html*/ `
                    <div ondblclick="editSubtask('${state}', '${location}');" id="subtask${state}-${location}" class="sub-pseudo c-pointer flex x-space-betw y-center mb-4px">
                        <ul class="w-100 outline-none"><li id="value${state}-${location}">${inputValue}</li></ul>
                        <div id="subtask-delete-accept-${state}-${location}" class="flex x-space-betw y-center opacity-zero">
                            <img id="delete${state}-${location}" onclick="deleteSubtask('${state}', '${location}');" src="/assets/img/subtasks_bin.svg" alt="delete">
                            <img class="p-lr" src="/assets/img/Vector 19.svg" alt="separator">
                            <img id="edite${state}-${location}" onclick="editSubtask('${state}', '${location}');" src="/assets/img/subtasks_pencil.svg" alt="edit">
                        </div>
                    </div>`;
}

/**
 * Make subtask editable to change
 * @param {variable} state Index of the subtask
 */
function editSubtask(state, location) {
    document.getElementById(`subtask-delete-accept-${state}-${location}`).classList.remove('opacity-zero');
    let subtask = document.getElementById(`subtask${state}-${location}`);
    let subtaskValue = document.getElementById(`value${state}-${location}`);
    let replaceImg = document.getElementById(`edite${state}-${location}`);
    let deleteImg = document.getElementById(`delete${state}-${location}`);
    replaceImg.removeEventListener('click', clickHandlerEdit);
    replaceImg.src = 'assets/img/subtasks_tick.svg';
    replaceImg.addEventListener('click', function () { clickHandlerSave(state, location) });
    replaceImg.classList.add('icon-hover');
    deleteImg.classList.add('icon-hover');
    subtaskValue.setAttribute('contenteditable', 'true');
    subtask.classList.add('bg-white');
    subtask.classList.remove('sub-pseudo');
}

/**
 * Save changes made on a subtask
 * @param {variable} state Index of the subtask
 */
function saveSubtaskChanges(state, location) {
    document.getElementById(`subtask-delete-accept-${state}-${location}`).classList.add('opacity-zero');
    let subtask = document.getElementById(`subtask${state}-${location}`);
    let subtaskValue = document.getElementById(`value${state}-${location}`);
    let replaceImg = document.getElementById(`edite${state}-${location}`);
    let deleteImg = document.getElementById(`delete${state}-${location}`);
    replaceImg.removeEventListener('click', clickHandlerSave);
    replaceImg.src = '/assets/img/subtasks_pencil.svg';
    replaceImg.addEventListener('click', clickHandlerEdit);
    replaceImg.classList.remove('icon-hover');
    deleteImg.classList.remove('icon-hover');
    subtaskValue.removeAttribute('contenteditable');
    subtask.classList.remove('bg-white');
    subtask.classList.add('sub-pseudo');
    subtasks[state] = subtaskValue.textContent;
}

/**
 * Clear subtasks input field
 * @param {string} inputValue
 */
function clearSubtasks(input) {
    input.value = '';
}

/**
 * Function to delete an added subtask
 * @param {variable} x Id number of the subtask
 */
function deleteSubtask(x, location) {
    let div = document.getElementById(`subtask${x}-${location}`);
    if (x == 1 && subtasks.length == 1) {
        subtasks.splice(0, 1);
    } else subtasks.splice(x, 1);
    div.remove();
}

/**
 * Cancle subtask and clear input field
 */
function cancleSubtask(location) {
    let subtask = document.getElementById('subtasks-' + `${location}`);
    subtask.value = '';
}

/**
 * Clear add task form
 */
function resetAddTaskForm(location) {
    document.getElementById(`title-${location}`).value = '';
    document.getElementById(`textarea-${location}`).value = '';
    document.getElementById(`assigned-${location}`).value = '';
    document.getElementById(`date-${location}`).value = '';
    document.getElementById(`category-${location}`).value = '';
    document.getElementById(`subtasks-${location}`).value = '';
    document.getElementById(`displaySubtasks-${location}`).replaceChildren();
    document.getElementById(`displaySelectedContacts-${location}`).replaceChildren();
    let img = document.getElementById('prio-' + `${oldImg}-` + `${location}`).src = `assets/img/prio-default-${oldImg}.png`;

    console.log(img);

    subtasks = [];
}