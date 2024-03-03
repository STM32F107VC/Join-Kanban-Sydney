/* Declare global variables and arrays */
let countUp = -1;
let getCategory;
let bgcCode;
let taskIndex;
let saveDate;
let summaryInformations;
let subtasksLength;
let percent;
let percentage;
let currentSubtask;

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_board(id) {
    await includeHTML();
    await loadContacts();
    await loadTasks(true);
    markActiveLink(id);
    greetUser();
    getAddTaskMenu('overlay');
    assignContact('overlay');
    howManyTasksPerColumn();
}

/**
 * Muss ich noch verkleinern
 */
async function howManyTasksPerColumn() {
    let prioHigh = 'high';
    let increment = 0;
    saveDate = [];
    let toDo = document.getElementById('backlog').children.length;
    let inProgress = document.getElementById('in-progress').children.length;
    let awaitFeedback = document.getElementById('await-feedback').children.length;
    let done = document.getElementById('done').children.length;
    let amountOfTasks = tasks.length;
    let dateObject;
    let month;
    let year;
    let formatDate;
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let prio = task['Prio'];
        if (prio == prioHigh) {
            increment++;
            let currentDate = task['Date'];
            saveDate.push({ date: new Date(currentDate) });
            saveDate.sort((objA, objB) => Number(objA.date) - Number(objB.date),).reverse();
            for (let j = 0; j < saveDate.length; j++) {
                let date = saveDate[j];
                dateObject = date.date;
            }
            day = ('0' + dateObject.getDate()).slice(-2);
            month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
            year = dateObject.getFullYear();
            formatDate = `${day}.${month}.${year}`;
        }
    }
    if (formatDate == undefined) {
        formatDate = 'No urgent task';
    }
    summaryInformations = {
        'To-Do': toDo,
        'In-Progress': inProgress,
        'Await-Feedback': awaitFeedback,
        'Done': done,
        'Amount-Of-Tasks': amountOfTasks,
        'Amount-Of-Urgent-Tasks': increment,
        'Date': formatDate
    };
    // setToLocalStorage(summaryInformations, 'summary-informations');
    await setItem('summary-informations', JSON.stringify(summaryInformations));
}

/**
 * Load tasks from local storage ---------------- change to remote storage later!!
 */
// async function loadTasks(locate) {
//     let tasksToString = localStorage.getItem('tasks');
//     if (tasksToString) {
//         let object = JSON.parse(tasksToString);
//         tasks = object;
//         if (locate) loadToColumn();
//     }
// }

/**
 * Load tasks from backend
 */
async function loadTasks(locate) {
    try {
        tasks = JSON.parse(await getItem('tasks'));
        if (locate) loadToColumn();
    } catch (error) { }
}




/**
 * Load tasks to matching column, which they were attached last
 */
function loadToColumn() {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let getTaskLocation = task['Column-location'];
        let column = document.getElementById(`${getTaskLocation}`);
        if (column.childNodes !== 0) { column.innerHTML += taskTemplate(task, i); }
        renderAssignedContacts(task, i, false);
    }
    noTaskToDo();
}

/**
 * Open add new task overlay menu
 * 
 */
async function openAddTaskOverlay() {
    document.getElementById('add-tasks-overlay-view').classList.remove('d-none');
    document.getElementById('main-div-board').classList.add('d-none');
    document.getElementById('body-board').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-board').classList.add("opacity", "z-ind--1");
}

/**
 * Close add new task overlay menu
 * 
 */
function closeAddTaskOverlay() {
    document.getElementById('add-tasks-overlay-view').classList.add('d-none');
    document.getElementById('main-div-board').classList.remove('d-none');
    document.getElementById('body-board').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-board').classList.remove("opacity", "z-ind--1");
    document.getElementById('displaySelectedContacts-overlay').innerHTML = '';
    assignedContacts = [];
    window.location = window.location;
}

/**
 * Close tasks overlay menu
 * 
 */
function closeShowTaskOverlay() {
    document.getElementById('displaySubtasks-edit-overlay').innerHTML = '';
    document.getElementById('assigned-edit-overlay').innerHTML = '';
    document.getElementById('displaySelectedContacts-edit-overlay').innerHTML = '';
    document.getElementById('tasks-overlay-view').classList.add('d-none');
    document.getElementById('main-div-board').classList.remove('d-none');
    document.getElementById('body-board').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-board').classList.remove("opacity", "z-ind--1");
    document.getElementById('edit-task-overlay-view').classList.add('d-none');
    assignedContacts = [];
    subtasks = [];
    window.location = window.location;
}

/**
 * Render tasks to board
 * @param {JSON} task JSON with all informations of a task
 * @returns Returns the rendered task
 */
function taskTemplate(task, i) {
    return /*html*/`
                    <div id="task${i}" onclick="showTaskOverlay(${i})" class="task flex flex-column ft-general noDrop" id="drag1" draggable='true'  ondragstart='drag(event)'>
                        <div id="category${i}" style="background-color:${task['Bgc-Code']}" class="task-category x-start col-white fs-16px fw-400 mb-24px noDrop">${task['Category']}</div>
                        <div id="taskTitle${i}" class="task-title fs-16px fw-700 mb-8px noDrop">${task['Title']}</div>
                        <div id="taskDescription${i}" class="flex x-start mb-24px fs-16px col-grey noDrop">${task['Description']}</div>
                        <div id="progress${i}" class="flex x-space-betw y-center fs-12px mb-24px noDrop">
                            <progress id="progressBar${i}" class="noDrop" value="${getAmounTOfSubtasks(task)}" max="100"></progress> 
                            <span class="noDrop">${setCurrentSubtaskLength()}/${getSubtasks(task)}</span>
                        </div>
                        <div class="flex x-space-betw noDrop">
                            <div id="assignedContact${i}" class="flex pl-6px noDrop"></div>
                            ${renderPrioImg(task, i)}
                        </div>
                    </div>`;
}

/**
 * Check how many subtasks are clicked active over checkbox
 * @returns The a number for the amount of subtasks acitve in a task
 */
function setCurrentSubtaskLength() {
    if (percent == 0) return 0;
    else if (percent == 50) return 1;
    else if (percent == 100) return 2;
}

/**
 * Show big view of a task
 * @param {variable} i Is the task index
 */
function showTaskOverlay(i) {
    document.getElementById('main-div-board').classList.add('d-none');
    document.getElementById('body-board').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-board').classList.add("opacity", "z-ind--1");
    taskIndex = i;
    let task = tasks[i];
    let str = task['Prio'];
    let priority;
    if (str !== undefined) { priority = str.charAt(0).toUpperCase() + str.slice(1); }
    let div = document.getElementById('tasks-overlay-view');
    div.classList.remove('d-none');
    div.innerHTML = /*html*/`
        <div class="ft-general">
            <div class="flex x-space-betw y-center">
                <div id="category${i}" style="background-color:${task['Bgc-Code']}" class="task-category x-start col-white fs-23px fw-400">${task['Category']}</div>
                <div class="close-cross p-zero"><img onclick="closeShowTaskOverlay()" class="p-8px"
                        src="assets/img/close.png" alt="close"></div>
                </div>
            </div>
            <div class="fs-61px fw-700">${task['Title']}</div>
            <div class="fs-20px fw-400">${task['Description']}</div>
            <div><span class="col-grey-blue">Due date:</span>&nbsp;&nbsp;&nbsp;${task['Date']}</div>
            <div id='priority-state-overlay' class="flex y-center">
                <span class="col-grey-blue">Priority:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${priority}&nbsp;
                <img src="assets/img/prio-indicator-${priority}.svg" alt="prio-${priority}">
            </div>
            <div id="assignedContactPreView${i}">
                <div class="mb-8px col-grey-blue">Assigned To:</div>
            </div>
            <div>
                <div class="mb-8px col-grey-blue">Subtasks</div>
                <div id="renderSubtask${i}-overlay"></div>
            </div>

            <div class="flex x-end gap-16px remove-margin">
                    <img onclick="deleteTask(${i});" class="delete c-pointer" src="/assets/img/delete_default.png" alt="delete">
                    <img src="/assets/img/subtasks_vector.svg" alt="separator">
                    <img onclick="showEditTaskOverlay('${i}')" class="edit c-pointer" src="/assets/img/edit_default.png" alt="edit">
            </div>
        </div>`;
    if (str == undefined) { document.getElementById('priority-state-overlay').classList.add('d-none'); }
    renderAssignedContacts(task, i, true);
    renderSubtask(task, i, 'overlay');
}

/**
 * Delete tasks from board
 * @param {variable} j Is the task index 
 */
async function deleteTask(j) {
    tasks.splice(j, 1);

    // localStorage.setItem('tasks', JSON.stringify(tasks));
    // tasks = localStorage.getItem('tasks');

    /************/
    await setItem('tasks', JSON.stringify(tasks));
    tasks = JSON.parse(await getItem('tasks'));
    /************/

    location.replace('board.html');
}

/**
 * Get div for rendering in information to edit a task and hide normal overlay view
 * @param {*} i Is the task index
 */
function showEditTaskOverlay(i) {
    let divBigViewTask = document.getElementById('tasks-overlay-view');
    let divEditTask = document.getElementById('edit-task-overlay-view');
    divBigViewTask.classList.add('d-none');
    divEditTask.classList.remove('d-none');
    renderOkBtn(i);
    assignContact('edit-overlay');
    getTaskValues(i);
}

/**
 * 
 * @param {variable} i Is the task index 
 */
function getTaskValues(i) {
    let task = tasks[i];
    let title = task['Title'];
    let description = task['Description'];
    let date = task['Date'];
    getCategory = task['Category'];
    bgcCode = task['Bgc-Code'];
    oldImg = task['Prio'];
    renderAssignedContacts(task, i, 'edit-overlay');
    let renderSubtasks = document.getElementById('displaySubtasks-edit-overlay');
    for (let k = 0; k < task['Subtasks'].length; k++) {
        let subtask = task['Subtasks'][k];
        countUp += 1;
        let location = 'edit-overlay';
        subtasks.push(subtask);
        renderSubtasks.innerHTML += subtaskTemplate(countUp, subtask, location);
    }
    document.getElementById('prio-low-edit-overlay').src = 'assets/img/prio-default-low.png';
    document.getElementById('prio-medium-edit-overlay').src = 'assets/img/prio-default-medium.png';
    document.getElementById('prio-high-edit-overlay').src = 'assets/img/prio-default-high.png';
    let prioState = document.getElementById(`prio-${task['Prio']}-edit-overlay`);
    prioState.src = `assets/img/prio-${task['Prio']}.svg`;
    oldImg = undefined;
    document.getElementById('title-editable').value = title;
    document.getElementById('textarea-editable').value = description;
    document.getElementById('date-editable').value = date;
}

/**
 * Safes changes which were made on a task
 * @param {variable} j J is the index number for accessing a task in the tasks array
 */
async function saveEditTaskChanges(taskIndex) {
    document.getElementById('edit-overlay-ok-btn').disabled = true;
    let title = document.getElementById('title-editable');
    let description = document.getElementById('textarea-editable');
    let date = document.getElementById('date-editable');
    let columnLocation = tasks[taskIndex]['Column-location'];
    tasks.splice(taskIndex, 1);
    tasks.push({
        "Title": title.value,
        "Description": description.value,
        "Assigned-to": assignedContacts,
        "Date": date.value,
        "Prio": oldImg,
        "Category": getCategory,
        "Bgc-Code": bgcCode,
        "Subtasks": subtasks,
        "Active-Subtasks": array = setHowManySubtasks(),
        "Progressbar-Value": percent,
        "Column-location": columnLocation
    });
    // setToLocalStorage(tasks, 'tasks');
    await setItem('tasks', JSON.stringify(tasks));
    document.getElementById('edit-overlay-ok-btn').disabled = false;
    location.reload();
}


/**
 * Get contacts to render in another step
 * @param {JSON} t Includes a complete task
 * @param {variable} i Is the contact index
 */
function renderAssignedContacts(t, i, flag) {
    let showContacts;
    if (!flag) showContacts = document.getElementById(`assignedContact${i}`);
    else if (flag == true) showContacts = document.getElementById(`assignedContactPreView${i}`);
    else if (flag == 'edit-overlay') showContacts = document.getElementById(`displaySelectedContacts-${flag}`);
    for (let j = 0; j < t['Assigned-to'].length; j++) {
        let contact = t['Assigned-to'][j];
        let array = buildAcronym(contact);
        let acronymUpperCase = array[0];
        let bgc = array[1];
        if (!flag) showContacts.innerHTML += assigneContactsTemplate(acronymUpperCase, i, bgc);
        else if (flag == true) showContacts.innerHTML += assigneContactsTemplatePreview(contact, acronymUpperCase, i, bgc);
        else if (flag == 'edit-overlay') {
            assignedContacts.push(contact);
            showContacts.innerHTML += renderSelectedContact(acronymUpperCase, i, bgc);
        }
    }
}

/**
 * Render subtasks in big task view
 * @param {JSON} t Includes a complete task
 * @param {variable} i Is the contact index
 */
function renderSubtask(t, k, location) {
    let div = document.getElementById(`renderSubtask${k}-${location}`);
    let subtasks = t['Subtasks'];
    for (let i = 0; i < subtasks.length; i++) {
        percentage = subtasks.length;
        let subtask = subtasks[i];
        div.innerHTML += /*html*/`
            <div class="subtasks flex y-center gap-16px">
                <input class="flex x-center y-center checkbox" onclick="activeSubtasks('${k}', ${i})" type="checkbox" id="subtasks${k}${i}">
                <div>${subtask}</div>
            </div>`;
        loadActiveSubtasks(t, k, i);
    }
}

function loadActiveSubtasks(t, k, i) {
    let activeSubtask = t['Active-Subtasks'][i];
    let subtask = document.getElementById(`subtasks${k}${i}`);
    if (activeSubtask == 1) {
        subtask.classList.add('checkbox-checked');
    } else if (activeSubtask == 0) {
        subtask.classList.remove('checkbox-checked');
    }
}

/**
 * Checks the checkbox of the subtask 
 * @param {variable} k Is the contact index
 * @param {variable} i Is the index of the subtak
 */
async function activeSubtasks(k, i) {
    let task = tasks[k];
    let subtask = document.getElementById(`subtasks${k}${i}`);
    let completeSubtaskStatus = task['Active-Subtasks'];
    isSubtaskCheckboxChecked(subtask, completeSubtaskStatus, i);
    task['Active-Subtasks'] = completeSubtaskStatus;
    task['Progressbar-Value'] = getAmounTOfSubtasks(task);
    tasks.splice(k, 1);
    tasks.push(task);
    // setToLocalStorage(tasks, 'tasks');
    await setItem('tasks', JSON.stringify(tasks));
}

/**
 * If subtask is checked
 * @param {div} subtask Is the div of one of this two subtasks divs
 * @param {array} completeSubtaskStatus Shows if a subtask is active or not
 * @param {variable} i Is the index of the subtak
 * @returns 
 */
function isSubtaskCheckboxChecked(subtask, completeSubtaskStatus, i) {
    if (!subtask.classList.contains('checkbox-checked')) {
        subtask.classList.add('checkbox-checked');
        return completeSubtaskStatus[i] = 1;
    } else if (subtask.classList.contains('checkbox-checked')) {
        subtask.classList.remove('checkbox-checked');
        return completeSubtaskStatus[i] = 0;
    }
}

/**
 * Render contacts
 * @param {variable} aUC Includes the acronym of contact
 * @param {variable} i Is the contact index
 * @param {string} bgc Is the background-color code
 * @returns Rendered contact info sign includes acronym and
 *          a background color in a circle
 */
function assigneContactsTemplate(aUC, i, bgc) {
    return /*html*/`
                    <div id='${aUC}${i}' class="acronym acronym-dimensions-small flex x-center y-center fs-12px noDrop" style="background-color: #${bgc}">${aUC}
                    </div>`;
}

/**
* Render contacts
 * @param {variable} aUC Includes the acronym of contact
 * @param {variable} i Is the contact index
 * @param {string} bgc Is the background-color code
 * @returns Rendered contact info sign includes acronym and
 *          a background color in a circle
 */
function assigneContactsTemplatePreview(c, aUC, i, bgc) {
    return /*html*/`
                <div  class="flex y-center contacts-padding">
                    <div id='${aUC}${i}' class="acronym acronym-dimensions-medium flex x-center y-center fs-12px" style="background-color: #${bgc}">${aUC}
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>${c['name']}</span>
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
 * Check if a priority state is selected. When selected, insert priority img,
 * when no state selected, render image and hide to edit later and add a priotity state.
 * @param {JSON} t Is a JSON with all feature of one task in it 
 * @param {variable} i Index of current JSON-array place
 * @returns Returns the rendered img
 */
function renderPrioImg(t, i) {
    if (t['Prio'] !== undefined) {
        return /*html*/`<img class="noDrop" src="assets/img/prio-indicator-${t['Prio']}.svg" alt="prio-${t['Prio']}">`;
    } else {
        return /*html*/`<img class="d-none noDrop" src="assets/img/prio-indicator-${t['Prio']}.svg" alt="prio-${t['Prio']}">`;
    }
}

/**
 * Check if there are one or two subtasks to return
 * the number for progress bar. 1 Subtask: value = 50;
 * 2. Subtask: value = 100;
 * @param {JSON} t Is a JSON with all feature of one task in it 
 * @returns Returns the percent value
 */
function getAmounTOfSubtasks(t) {
    let length = t['Active-Subtasks'];
    let firstVar = [0, 0];
    let secondVar = [1, 0];
    let thirdVar = [0, 1];
    let fourthVar = [1, 1];
    if (length[0] == firstVar[0] && length[1] == firstVar[1]) {
        percent = 0;
        return 0;
    } else if ((length[0] == secondVar[0] && length[1] == secondVar[1]) ||
        (length[0] == thirdVar[0] && length[1] == thirdVar[1])) {
        percent = 50;
        return percent;
    } else if (length[0] == fourthVar[0] && length[1] == fourthVar[1]) {
        percent = 100;
        return percent;
    }
}

/**
 * Check length of subtask array and return it as a number
 * Possible numbers 0, 1 and 2. 
 * If it's 1 there is 1 additional subtask added to the task.
 * If it's 2 there are two additional subtasks added to the task.
 * If it's 0 there is no additional subtak added to the task.
 */
function getSubtasks(t) {
    subtasksLength = t['Subtasks'].length;
    return subtasksLength;
}

/**
 * Allow drop action
 * @param {} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

/**
 * 
 * @param {*} ev 
 */
function drop(ev) {
    let target = ev.target;
    let data = ev.dataTransfer.getData("text");
    if (target.classList && target.classList.contains('noDrop')) {
        ev.preventDefault();
    } else {
        ev.preventDefault();
        ev.target.appendChild(document.getElementById(data));
        changeTaskLocation(data, target);
    }
}

/**
 * After shifting a task into an other column (backlog, in-progress, await feedback and done)
 * save the location of the task. So it can be rendered in the correct column after body onload
 * @param {string} data Is the task name and number
 * @param {HTMLAllCollection} target Target is the collectio of the target row where the task should be dropped
 */
async function changeTaskLocation(data, target) {
    let columnId = target.id;
    let index = data.slice(-1);
    tasks[index]['Column-location'] = columnId;
    // setToLocalStorage(tasks, 'tasks');
    await setItem('tasks', JSON.stringify(tasks));
    checkParentDivsChildren(columnId);
    howManyTasksPerColumn();
}

/**
 * Check after body onload if column has taks inside when not
 * insert img no_task_in_column.svg
 *
 */
function noTaskToDo() {
    let locations = ['backlog', 'in-progress', 'await-feedback', 'done'];
    let getLocation;
    for (let t = 0; t < locations.length; t++) {
        let location = locations[t];
        getLocation = document.getElementById(location);
        if (getLocation.children.length === 0) {
            let nothingInside = document.createElement('img');
            nothingInside.src = './assets/img/no_task_in_column.svg';
            nothingInside.classList.add('noDrop', 'noTask');
            getLocation.appendChild(nothingInside);
        }
    }
}

/**
 * Check after drop event if target column has already children
 * when yes remove child element with class name no-task because task
 * was added to column then check again which column has no tasks to insert
 * img no_task_in_column.svg if necessary
 * @param {string} columnId Contains the id of the column where drop event occured
 */
function checkParentDivsChildren(columnId) {
    let targetColumn = document.getElementById(columnId);
    if (targetColumn.children.length > 0) {
        let child = targetColumn.getElementsByClassName('noTask');
        noTaskToDo();
        targetColumn.removeChild(child[0]);
    }
}