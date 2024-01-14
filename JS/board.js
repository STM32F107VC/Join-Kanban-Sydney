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
        backlog.innerHTML += taskTemplate(task);
    }
}

function taskTemplate(task) {
    return /*html*/`
    <div class="task flex flex-column ft-general" id="drag1" draggable='true'  ondragstart='drag(event)'>
        <div style="background-color:${task['Bgc-Code']}" class="task-category x-start col-white mb-24px">${task['Category']}</div>
        <div class="task-title fs-16px fw-700">${task['Title']}</div>
        <div class="flex x-start">${task['Description']}</div>
        <div class="flex x-space-betw">
            <div>bar</div> 
            <div>1/2</div>
        </div>
        <div class="flex x-space-betw">
            <div></div>
            <img src="assets/img/prio-indicator-${task['Prio']}.svg" alt="priority ${task['Prio']}">
        </div>
    </div>`;
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