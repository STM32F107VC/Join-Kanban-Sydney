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
let toDo;
let inProgress;
let awaitFeedback;
let done;


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
    noTaskToDo();
}

/**
 * Muss ich noch verkleinern
 */
function howManyTasksPerColumn() {
    let increment = 0;
    saveDate = [];
    let colArray = valueOfTasks();
    let dateObject;
    let formatDate;
    let array;
    array = getUrgentDate(formatDate, increment, dateObject);
    formatDate = array[0];
    increment = array[1];
    if (formatDate == undefined) formatDate = 'No urgent task';
    saveSummaryInformations(colArray[0], colArray[1], colArray[2], colArray[3], colArray[4], increment, formatDate);
}

/**
 * Get total amount of tasks in board and per column
 * @returns Amount of tasks in board total and per column
 */
function valueOfTasks() {
    toDo = document.getElementById('backlog').children.length;
    inProgress = document.getElementById('in-progress').children.length;
    awaitFeedback = document.getElementById('await-feedback').children.length;
    done = document.getElementById('done').children.length;
    let amountOfTasks = tasks.length;
    return [toDo, inProgress, awaitFeedback, done, amountOfTasks];
}

/**
 * Get from all urgent task the most urgent date
 * @param {string} formatDate Includes the most urgent date
 * @param {variable} increment Total amount of urgent tasks 
 * @param {*} dateObject 
 * @returns 
 */
function getUrgentDate(formatDate, increment, dateObject) {
    let prioHigh = 'high';
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
            let day = ('0' + dateObject.getDate()).slice(-2);
            let month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
            let year = dateObject.getFullYear();
            formatDate = `${day}.${month}.${year}`;
        }
    }
    return [formatDate, increment];
}

/**
 * Save all summary informations to display on summary.html
 * 
 */
async function saveSummaryInformations(tD, iP, aF, d, aOF, i, fD) {
    summaryInformations = {
        'To-Do': tD,
        'In-Progress': iP,
        'Await-Feedback': aF,
        'Done': d,
        'Amount-Of-Tasks': aOF,
        'Amount-Of-Urgent-Tasks': i,
        'Date': fD
    };
    await setItem('summary-informations', JSON.stringify(summaryInformations));
}

/**
 * Load tasks from backend
 */
async function loadTasks(locate) {
    let tasksToString = await getItem('tasks');
    if (tasksToString) {
        tasks = JSON.parse(tasksToString);
        if (locate) loadToColumn();
    }
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
    oldImg = undefined;
    window.location = window.location;
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
    div.innerHTML = renderTasksOverlay(i, task, priority);
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
    await setItem('tasks', JSON.stringify(tasks));
    tasks = JSON.parse(await getItem('tasks'));
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
 * Get all task values form JSON
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
    let prioState = document.getElementById('prio-' + oldImg + '-edit-overlay');
    if (prioState !== null) prioState.src = `assets/img/prio-${task['Prio']}.svg`;
    setEditableTaskValues(title, description, date);
}

/**
 * Sets the default priority img as like no priority is selected
 */
function setDefaultPrioImg() {
    document.getElementById('prio-low-edit-overlay').src = 'assets/img/prio-default-low.png';
    document.getElementById('prio-medium-edit-overlay').src = 'assets/img/prio-default-medium.png';
    document.getElementById('prio-high-edit-overlay').src = 'assets/img/prio-default-high.png';
}

/**
 * Insert current title, description and date into editable task overlay menu
 * @param {string} title Includes current task title 
 * @param {string} description Includes current task description
 * @param {string} date Includes current task deadline date
 */
function setEditableTaskValues(title, description, date) {
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
 * @param {variable} k Is the index of the subtask
 * @param {variable} i Is the contact index
 */
function renderSubtask(t, k, location) {
    let div = document.getElementById(`renderSubtask${k}-${location}`);
    let subtasks = t['Subtasks'];
    for (let i = 0; i < subtasks.length; i++) {
        percentage = subtasks.length;
        let subtask = subtasks[i];
        div.innerHTML += renderActiveSubtask(k, i, subtask);
        loadActiveSubtasks(t, k, i);
    }
}

/**
 * 
 * @param {*} k 
 * @param {*} i 
 * @param {*} subtask 
 * @returns 
 */
function renderActiveSubtask(k, i, subtask) {
    return /*html*/`
        <div class="sub-pseudo subtasks flex y-center gap-16px">
            <input class="flex x-center y-center checkbox" onclick="activeSubtasks('${k}', ${i})" type="checkbox" id="subtasks${k}${i}">
            <div>${subtask}</div>
        </div>`;
}

/**
 * Check or uncheck subtask depending on if its activ or not
 * @param {JSON} t Includes a complete task
 * @param {variable} k Is the index of the subtask
 * @param {variable} i Is the contact index
 */
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
 * @param {tokenlist} ev Tokenlist from element to trop
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Gets several values from draged element
 * @param {tokenlist} ev Tokenlist from dragged element
 */
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

/**
 * 
 * @param {tokenlist} ev Tokenlist from element to drop
 */
function drop(ev) {
    let target = ev.target;
    let id = target.id;
    let data = ev.dataTransfer.getData("text");
    if (target.classList && target.classList.contains('noDrop')) {
        ev.preventDefault();
    } else {
        ev.preventDefault();
        ev.target.appendChild(document.getElementById(data));
        changeTaskLocation(data, target);
        checkParentDivsChildren(id);
        removeColumnPlaceholder();
        howManyTasksPerColumn();
        noTaskToDo();
    }
}

/**
 * Remove img "No Task To Do" before getting amount of tasks per column
 * After rendering "No Task To Do" img, so that this img isn't countet as a task
 */
function removeColumnPlaceholder() {
    let locations = ['backlog', 'in-progress', 'await-feedback', 'done'];
    for (let i = 0; i < locations.length; i++) {
        let location = locations[i];
        checkParentDivsChildren(location);
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
    await setItem('tasks', JSON.stringify(tasks));
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
        let childrenWithClass = targetColumn.getElementsByClassName('noTask');
        if (childrenWithClass.length > 0) {
            let child = childrenWithClass[0];
            targetColumn.removeChild(child);
        }
    }
}

/**
 * Search tasks depending on title or description and display them below search bar
 */
function searchTask() {
    let search = document.getElementById('search').value;
    let boardContainer = document.querySelector('.drag-drop');
    let displayResult = document.getElementById('display-searched-tasks');
    boardContainer.classList.add('d-none');
    displayResult.textContent = '';
    getTaskToBeSearched(search, boardContainer, displayResult);

}

/**
 * Iterate through tasks array and find matching task(s)
 */
function getTaskToBeSearched(search, boardContainer, displayResult) {
    for (let k = 0; k < tasks.length; k++) {
        let task = tasks[k];
        let title = task['Title'];
        let description = task['Description'];
        if (title.includes(search) || description.includes(search)) {
            boardContainer.classList.add('d-none');
            displayResult.classList.remove('d-none');
            displayResult.innerHTML += taskTemplate(task, k);
        }
        if (search === '') {
            boardContainer.classList.remove('d-none');
            displayResult.classList.add('d-none');
        }
    }
}