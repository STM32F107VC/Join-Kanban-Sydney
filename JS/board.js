async function init_board(id) {
    await includeHTML();
    await loadContacts();
    markActiveLink(id);
}

// function markActiveLink() {
//     let link = document.getElementById('board-link');
//     link.classList.add('bgc-darkblue');
//     link.classList.remove('menu-choose');
// }

// function loadBoard() {
//     let toDo = document.getElementById('TODO');
//     let inProgress = document.getElementById('INPROGRESS');
//     let awaitFeedback = document.getElementById('AWAITFEEDBACK');
//     let done = document.getElementById('DONE');
//     for (let i = 0; i < tasks.length; i++) {
//         let task = tasks[i];
//         if (task['progress'].includes('TODO')) {
//             toDo.innerHTML += displayTask(task);
//         }
//         if (task['progress'].includes('INPROGRESS')) {
//             inProgress.innerHTML += displayTask(task);
//         }
//         if (task['progress'].includes('AWAITFEEDBACK')) {
//             awaitFeedback.innerHTML += displayTask(task);
//         }
//         if (task['progress'].includes('DONE')) {
//             done.innerHTML += displayTask(task);
//         }
//         loadSubtasksProgressbar(task);
//         showAmountOfSubtasks(task);
//         displayContactIcons(task);
//         displayPriorityImg(task);
//     }
// }
// function displayTask(eachTask) {
//     return `
//     <div draggable="true" ondragstart="startDragging(${eachTask['id']})" onclick="showTask(${eachTask['id']})" class="taskCSS">
//         <div class="taskBox">
//             <h1 class="taskCategory">${eachTask['category']}</h1>
//             <string class="taskTitle">${eachTask['title']}</string>
//             <string class="taskDescription">${eachTask['description']}</string>
//             <div class="taskSubtasks">
//                 <div class="taskSubtasksProgressbar">
//                     <div id="subtasksProgressbar${eachTask['id']}" style="width: 0%;"></div>
//                 </div>
//                 <string id="subtasksAmount${eachTask['id']}" class="taskSubtasksAmount"></string>
//             </div>
//             <div class="taskEnd">
//             <div id="taskContacts${eachTask['id']}"></div>
//                 <img src id="taskPriorityIMG${eachTask['id']}">
//             </div>
//         </div>
//     </div>`;
// }
/*--------------------------Tasks Draggen und Droppen--------------------------*/
// function startDragging(id) {
//     currentDraggedElement = id;
// }
// function allowDrop(ev) {
//     ev.preventDefault();
// }
// function moveTo(progress) {
//     tasks[currentDraggedElement]['progress'] = progress;
//     cleanBoard();
//     loadBoard();
// }
// /*----------------------Subtasks Länge & Bilder anzeigen----------------------*/
// function loadSubtasksProgressbar(eachTask) {
//     let subtasksProgressbar = document.getElementById(`subtasksProgressbar${eachTask['id']}`);
//     eachTask['subtasks-true'] = [];
//     for (t = 0; t < eachTask['subtasks-done'].length; t++) {
//         let singleCheck = eachTask['subtasks-done'][t];
//         if (singleCheck == true) {
//             eachTask['subtasks-true'].push('->');
//         }
//         if (eachTask['subtasks-true'].length == 1) {
//             subtasksProgressbar.style = "background-color: #4589FF; border-radius: 5px; width: 50%; height: 100%;";
//         }
//         if (eachTask['subtasks-true'].length == 2) {
//             subtasksProgressbar.style = "background-color: #4589FF; border-radius: 5px; width: 100%; height: 100%;";
//         }
//     }
// }
// function showAmountOfSubtasks(eachTask) {
//     let subtasksAmount = document.getElementById(`subtasksAmount${eachTask['id']}`);
//     if (eachTask['subtasks']) {
//         if (eachTask['subtasks'][1]) {
//             subtasksAmount.innerHTML = `${eachTask['subtasks-true'].length}/${eachTask['subtasks'].length} Subtasks`;
//         } else {
//             if (eachTask['subtasks'][0]) {
//                 subtasksAmount.innerHTML = `${eachTask['subtasks-true'].length}/${eachTask['subtasks'].length} Subtasks`;
//             }
//         }
//     }
// }
// function displayContactIcons(eachTask) {
//     let taskContacts = document.getElementById(`taskContacts${eachTask['id']}`);
//     for (y = 0; y < eachTask['contacts'].length; y++) {
//         let firstName = eachTask['contacts'][y]['first-name'].charAt(0).toUpperCase();
//         let lastName = eachTask['contacts'][y]['last-name'].charAt(0).toUpperCase();
//         taskContacts.style = "";
//         taskContacts.innerHTML += `
//             <div style="display: flex; justify-content: center; background-color: green; border-radius: 100%; padding: 7px; max-width: 25px;">
//             ${firstName}${lastName}</div>`;
//     }
// }
// function displayPriorityImg(eachTask) {
//     let taskPriority = document.getElementById(`taskPriorityIMG${eachTask['id']}`);
//     if (eachTask['priority'] == 'Urgent') {
//         taskPriority.src = 'add-task-img/prio-urgent.png';
//     }
//     if (eachTask['priority'] == 'Medium') {
//         taskPriority.src = 'add-task-img/prio-medium.png';
//     }
//     if (eachTask['priority'] == 'Low') {
//         taskPriority.src = 'add-task-img/prio-low.png';
//     }
// }