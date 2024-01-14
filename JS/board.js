let tasks = [];

async function init_board(id) {
    await includeHTML();
    await loadContacts();
    markActiveLink(id);
    loadTasks();
}

function loadTasks() {
    let tasksToString = localStorage.getItem('tasks');
    if (tasksToString) {
        let object = JSON.parse(tasksToString);
        tasks = object;
        loadToBacklog();
        console.log(object);
    }
}

function loadToBacklog() {
    let backlog = document.getElementById('backlog');
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        backlog.innerHTML += taskTemplate(task, i);
    }
}

/**
 * Render tasks to board
 * @param {JSON} task JSON with all informations of a task
 * @returns Returns the rendered task
 */
function taskTemplate(task, i) {
    return /*html*/`
                    <div id="task${i}" class="task flex flex-column ft-general" id="drag1" draggable='true'  ondragstart='drag(event)'>
                        <div style="background-color:${task['Bgc-Code']}" class="task-category x-start col-white mb-24px">${task['Category']}</div>
                        <div class="task-title fs-16px fw-700 mb-8px">${task['Title']}</div>
                        <div class="flex x-start mb-24px">${task['Description']}</div>
                        <div id="progress${i}" class="subtasks flex x-space-betw y-center fs-12px mb-24px">
                            <progress id="progressBar${i}" value="${getAmounTOfSubtasks(task, i)}" max="100"></progress> 
                            <span>${getSubtasks(task)}/2 Subtasks</span>
                        </div>
                        <div class="flex x-space-betw">
                            <div></div>
                            ${renderPrioImg(task, i)}
                        </div>
                    </div>`;
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
        return /*html*/`<img src="assets/img/prio-indicator-${t['Prio']}.svg" alt="prio-${t['Prio']}">`;
    } else {
        return /*html*/`<img class="d-none" src="assets/img/prio-indicator-${t['Prio']}.svg" alt="prio-${t['Prio']}">`;
    }
}

/**
 * Check if there are one or two subtasks to return
 * the number for progress bar. 1 Subtask: value = 50;
 * 2. Subtask: value = 100;
 * @param {*} t Is a JSON with all feature of one task in it 
 * @returns Returns the percent value
 */
function getAmounTOfSubtasks(t, i) {
    let length = t['Subtasks'].length;
    if (length == 1) {
        let percent = 50;
        return percent;
    } else if (length == 2) {
        let percent = 100;
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
    return t['Subtasks'].length;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    if (ev.target.hasChildNodes()) {
        let data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    }
}