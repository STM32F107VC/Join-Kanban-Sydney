let tasksInBoard = [];

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
        tasksInBoard = object;
        loadToBacklog();
        console.log(object);
    }
}

function loadToBacklog() {
    let backlog = document.getElementById('backlog');
    for (let i = 0; i < tasksInBoard.length; i++) {
        let subtask = tasksInBoard[i];
        backlog.innerHTML += /*html*/`
            <div id="drag1" draggable='true' ondragstart='drag(event)'>${subtask['Title']}</div>`;
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}