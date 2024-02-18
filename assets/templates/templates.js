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

            <div>
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
                <div class="flex flex-column mb-24px">
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
                    <button onclick="resetAddTaskForm(${location})" class="flex y-center gap-4px btn-light fs-20px">Clear <img
                            src="assets/img/close.png" alt="close"></button>
                    <button id="submitBtn" type="submit" class="flex y-center gap-4px btn-dark fs-20px fw-700">Create
                        Task <img src="assets/img/check.png" alt="create"></button>
                </div>
            </div>
        </form>`;
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