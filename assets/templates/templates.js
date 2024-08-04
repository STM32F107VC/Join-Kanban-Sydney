/*--------------------------- Templates for add_tasks.html ---------------------------*/

/**
 * Complete tasks overlay template
 * @returns The complete tasks form
 */
function getAddTaskOverlayMenuTemplate(location) {
    return /*html*/`
                    <div class="flex x-space-betw">
                        <span class="ft-general fs-61px fw-700">Add Task</span>
                        <div class="close-cross p-zero">
                            <img onclick="closeAddTaskOverlay()" class="p-8px"
                                        src="assets/img/close.png" alt="close"></div>
                        </div>
                    </div>
                        <form onsubmit="addTask('${location}'); return false;" class="flex flex-row mt-64px">
                            <div class="flex flex-column">
                                <div class="flex flex-column mb-32px">
                                    <span class="mb-8px">Title<span class="col-red">*</span></span>
                                    <input class="login-input fs-20px" placeholder="Enter a title" name="" id="title-${location}" required>
                                </div>
                                <div class="flex flex-column mb-32px ">
                                    <span class="mb-8px">Description</span>
                                    <textarea placeholder="Enter a description" class="login-input fs-20px" name="" id="textarea-${location}"
                                        cols="30" rows="10"></textarea>
                                </div>
                                <div class="flex flex-column">
                                    <span class="mb-8px">Assigned to</span>
                                    <select onchange="showAssignedContact(this.value, '${location}')" role="listbox"
                                        class="login-input fs-20px mb-24px" id="assigned-${location}">
                                        <option value="" disabled selected hidden>Select contacts to assign</option>
                                    </select>
                                </div>
                                <div id="displaySelectedContacts-${location}" class="mb-96px flex"></div>
                                <div id="required-span">
                                    <span class="col-red">*</span> This field is required
                                </div>
                            </div>

                            <div class="vertical-line"><img src="assets/img/vertical_line.png" alt="vertical grey line"></div>

                            <div id="form-low-part">
                                <div class="flex flex-column mb-24px">
                                    <span class="mb-8px">Due date<span class="col-red">*</span></span>
                                    <input class="login-input fs-20px" type="date" value="2024-01-01" name="" id="date-${location}" required>
                                </div>
                                <div class="priority flex flex-column mb-24px">
                                    <span class="mb-8px">Prio</span>
                                    <div id='priority-container-${location}' class="flex x-space-betw gap-16px">
                                        <img class="priorityImg prio-border" onclick="savePriorityState('low', '${location}')" id="prio-low-${location}"
                                            src="assets/img/prio-default-low.png" alt="priority low">
                                        <img class="priorityImg prio-border" onclick="savePriorityState('medium', '${location}')" id="prio-medium-${location}"
                                            src="assets/img/prio-default-medium.png" alt="priority medium">
                                        <img class="priorityImg prio-border" onclick="savePriorityState('high', '${location}')" id="prio-high-${location}"
                                            src="assets/img/prio-default-high.png" alt="priority high">
                                    </div>
                                </div>
                                <div id="category" class="flex flex-column mb-24px">
                                    <span class="mb-8px">Category<span class="col-red">*</span></span>
                                    <select aria-placeholder="Select Task Category" class="login-input fs-20px" name="" id="category-${location}"
                                        required>
                                        <option value="" disabled selected hidden>Select task category</option>
                                        <option value="Technical Task">Technical Task</option>
                                        <option value="User Story">User Story</option>
                                    </select>
                                </div>
                                
                                <div class="subtasks-main mb-8px">
                                    <span class="flex flex-column mb-8px">Subtasks</span>
                                    <div onclick="toggleIcons('${location}');" id="subtasks-content-${location}" class="login-input flex x-space-betw">
                                        <input id="subtasks-${location}" class="fs-20px" placeholder="Add subtasks" name="subtasks">
                                        <div id="subtask-icons-${location}" class="flex flex-row d-none">
                                            <img id="cancle" onclick="cancleSubtask('${location}');" src="assets/img/subtasks_cross.svg"
                                                alt="cancle">
                                            <img id="separator" class="p-4px" src="assets/img/subtasks_vector.svg" alt="separator line">
                                            <img id="accept" onclick="addSubtask('${location}');" src="assets/img/subtasks_tick.svg" alt="cancle">
                                        </div>
                                        <img id="plus-icon-${location}" src="assets/img/plus.svg" alt="plus">
                                    </div>
                                </div>
                                <div id="displaySubtasks-${location}" class="mb-64px"></div>

                                <div ondblclick class="submit-section flex x-end gap-16px ft-general">
                                    <button onclick="resetAddTaskForm('${location}')" class="flex y-center gap-4px btn-light fs-20px">Clear <img
                                            src="assets/img/close.png" alt="close"></button>
                                    <button id="submitBtn" type="submit" class="flex y-center gap-4px btn-dark fs-20px fw-700">Create
                                        Task <img src="assets/img/check.png" alt="create"></button>
                                </div>
                            </div>
                        </form>`;
}

/**
 * Render selected contacts
 * @param {variable} auC Acronym of contact 
 * @param {variable} i This index (i) is the number for selecting
 * @param {string} bgc Color code for background-color
 * @returns 
 */
function renderSelectedContact(auC, i, bgc) {
    return /*html*/`
                    <div id='${auC}${i}' class="acronym p-6px flex x-center y-center mr-4px" style="background-color: #${bgc}">
                        ${auC}
                    </div>`;
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
 * Render Ok btn for acceptig changes made on a task
 * @param {*} i Is the task index
 */
function renderOkBtn(i) {
    taskIndex = i;
    let div = document.getElementById('ok-section');
    div.innerHTML = /*html*/`
                                <button onclick="saveEditTaskChanges(${i})" id="edit-overlay-ok-btn"
                                                class="flex y-center gap-4px btn-dark fs-21px fw-700">Ok
                                                <img class="tick" src="assets/img/check_white.svg" alt="confirm">
                                </button>`;
}

/*---------------------------------------------------------------------------------------------------------------------------------------------*/


/*--------------------------- Templates for board.html ---------------------------*/

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
 * Render complete tasks overlay view. (Opens when clicking on task in small view)
 * @param {variable} i Task index 
 * @param {JSON} task A complete task
 * @param {string} priority Contains eiter low, medium or high depending on how urgent a task is 
 * @returns 
 */
function renderTasksOverlay(i, task, priority) {
    return /*html*/`
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
 * 
 * @param {number} k - The number of the current subtask 
 * @param {number} i - The number of the current task 
 * @param {JSON} subtask - The subtasks 
 * @returns 
 */
function renderActiveSubtask(k, i, subtask) {
    return /*html*/`
                    <div class="sub-pseudo subtasks flex y-center gap-16px">
                        <input class="flex x-center y-center checkbox" onclick="activeSubtasks('${k}', ${i})" type="checkbox" id="subtasks${k}${i}">
                        <div>${subtask}</div>
                    </div>`;
}
/*---------------------------------------------------------------------------------------------------------------------------------------------*/