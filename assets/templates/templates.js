function getAddTaskOverlayMenuTemplate() {
    return /*html*/`
    <div class="flex x-space-betw">
        <span class="ft-general fs-61px fw-700">Add Task</span>
        <div class="close-cross p-zero">
            <img onclick="closeAddTaskOverlay()" class="p-8px"
                        src="assets/img/close.png" alt="close"></div>
        </div>
    </div>
        <form onsubmit="addTask(); return false;" class="flex flex-row mt-64px">
            <div class="flex flex-column">
                <div class="flex flex-column mb-32px">
                    <span class="mb-8px">Title<span class="col-red">*</span></span>
                    <input class="login-input fs-20px" placeholder="Enter a title" name="" id="title" required>
                </div>
                <div class="flex flex-column mb-32px ">
                    <span class="mb-8px">Description</span>
                    <textarea placeholder="Enter a description" class="login-input fs-20px" name="" id="textarea"
                        cols="30" rows="10"></textarea>
                </div>
                <div class="flex flex-column">
                    <span class="mb-8px">Assigned to</span>
                    <select onchange="showAssignedContact(this.value)" role="listbox"
                        class="login-input fs-20px mb-24px" id="assigned-to">
                        <option value="" disabled selected hidden>Select contacts to assign</option>
                    </select>
                </div>
                <div id="displaySelectedContacts" class="mb-96px flex"></div>
                <div>
                    <span class="col-red">*</span> This field is required
                </div>
            </div>

            <div class="vertical-line"><img src="assets/img/vertical_line.png" alt="vertical grey line"></div>

            <div>
                <div class="flex flex-column mb-24px">
                    <span class="mb-8px">Due date<span class="col-red">*</span></span>
                    <input class="login-input fs-20px" type="date" value="2024-01-01" name="" id="date" required>
                </div>
                <div class="priority flex flex-column mb-24px">
                    <span class="mb-8px">Prio</span>
                    <div class="flex x-space-betw gap-16px">
                        <img class="priorityImg prio-border" onclick="savePriorityState('low')" id="prio-low"
                            src="assets/img/prio-default-low.png" alt="priority low">
                        <img class="priorityImg prio-border" onclick="savePriorityState('medium')" id="prio-medium"
                            src="assets/img/prio-default-medium.png" alt="priority medium">
                        <img class="priorityImg prio-border" onclick="savePriorityState('high')" id="prio-high"
                            src="assets/img/prio-default-high.png" alt="priority high">
                    </div>
                </div>
                <div class="flex flex-column mb-24px">
                    <span class="mb-8px">Category<span class="col-red">*</span></span>
                    <select aria-placeholder="Select Task Category" class="login-input fs-20px" name="" id="category"
                        required>
                        <option value="" disabled selected hidden>Select task category</option>
                        <option value="Technical Task">Technical Task</option>
                        <option value="User Story">User Story</option>
                    </select>
                </div>
                <div class="subtasks-main mb-8px">
                    <span class="flex flex-column mb-8px">Subtasks</span>
                    <div onclick="toggleIcons();" id="subtasks-content" class="login-input flex x-space-betw">
                        <input id="subtasks" class="fs-20px" placeholder="Add subtasks" name="subtasks">
                        <div id="subtask-icons" class="flex flex-row d-none">
                            <img id="cancle" onclick="cancleSubtask();" src="assets/img/subtasks_cross.svg"
                                alt="cancle">
                            <img id="separator" class="p-4px" src="assets/img/subtasks_vector.svg" alt="separator line">
                            <img id="accept" onclick="addSubtask();" src="assets/img/subtasks_tick.svg" alt="cancle">
                        </div>
                        <img id="plus-icon" src="assets/img/plus.svg" alt="plus">
                    </div>
                </div>
                <div id="displaySubtasks" class="mb-64px"></div>

                <div ondblclick class="submit-section flex x-end gap-16px ft-general">
                    <button onclick="resetAddTaskForm()" class="flex y-center gap-4px btn-light fs-20px">Clear <img
                            src="assets/img/close.png" alt="close"></button>
                    <button id="submitBtn" type="submit" class="flex y-center gap-4px btn-dark fs-20px fw-700">Create
                        Task <img src="assets/img/check.png" alt="create"></button>
                </div>
            </div>
        </form>
`;
}