/* Declare variables and arrays */
let prioImg;
let tasks = [];

async function init_tasks() {
    await includeHTML();
    await loadContacts();
    assignContact();
}

function assignContact() {
    let assignSection = document.getElementById('assigned-to');
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        console.log(`${contact}`);
        assignSection.innerHTML += /*html*/`
            <option value="${contact[0]['name']}">${contact[0]['name']}</option>
        `;
    }
}

/**
 * Function to add new tasks
 * 
 */
function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('textarea');
    // let assignedTo = document.getElementById('assigned-to');
    let date = document.getElementById('date');
    document.getElementById('submitBtn').disabled = true;

    tasks.push({
        "Title": title.value,
        "Description": description.value,
        // "Assigned-to": ,
        "Date": date.value
        // "Prio": prioImg[0]
        // "Category": 
    });
    resetAddTaskForm();
    document.getElementById('submitBtn').disabled = false;
}

/**
 * bgc = background-color
 * Set bgc of high prio, remove medium and low bgc, add default bgc
 * 
 * @param {*} id 
 */
function savePrioStateHigh(id) {
    let prioDiv = document.getElementById("prio-" + id);
    setPrioMediumDefault();
    setPrioLowDefault();
    if (prioDiv.querySelector('span').classList.contains('col-white', 'fw-700')) {
        prioDiv.querySelector('span').classList.remove('col-white', 'fw-700');
        prioDiv.querySelector('img').src = 'assets/img/Prio_alta.png';
        prioDiv.classList.toggle("bgc-prio-" + id);
    } else {
        prioDiv.querySelector('span').classList.remove('col-black');
        prioDiv.querySelector('span').classList.add('col-white', 'fw-700');
        prioDiv.querySelector('img').src = 'assets/img/Prio_alta_white.png';
        prioDiv.classList.add("bgc-prio-" + id);
    }
    // savePrioImg(id);
}

/**
 * bgc = background-color
 * Set bgc of medium prio, remove high and low bgc, add default bgc
 * @param {*} id 
 */
function savePrioStateMedium(id) {
    let prioDiv = document.getElementById("prio-" + id);
    setPrioHighDefault();
    setPrioLowDefault();
    if (prioDiv.querySelector('span').classList.contains('col-white', 'fw-700')) {
        prioDiv.querySelector('span').classList.remove('col-white', 'fw-700');
        prioDiv.querySelector('img').src = 'assets/img/Prio_media.png';
        prioDiv.classList.toggle("bgc-prio-" + id);
    } else {
        prioDiv.querySelector('span').classList.remove('col-black');
        prioDiv.querySelector('span').classList.add('col-white', 'fw-700');
        prioDiv.querySelector('img').src = 'assets/img/Prio_media_white.png';
        prioDiv.classList.add("bgc-prio-" + id);
    }
    // savePrioImg(id);
}

/**
 * bgc = background-color
 * Set bgc of low prio, remove high and medium bgc, add default bgc
 * @param {*} id 
 */
function savePrioStateLow(id) {
    let prioDiv = document.getElementById("prio-" + id);
    setPrioHighDefault();
    setPrioMediumDefault();
    if (prioDiv.querySelector('span').classList.contains('col-white', 'fw-700')) {
        prioDiv.querySelector('span').classList.remove('col-white', 'fw-700');
        prioDiv.querySelector('img').src = 'assets/img/Prio_baja.png';
        prioDiv.classList.toggle("bgc-prio-" + id);
    } else {
        prioDiv.querySelector('span').classList.remove('col-black');
        prioDiv.querySelector('span').classList.add('col-white', 'fw-700');
        prioDiv.querySelector('img').src = 'assets/img/Prio_baja_white.png';
        prioDiv.classList.add("bgc-prio-" + id);
    }
    // savePrioImg(id);
}

function setPrioHighDefault() {
    let prioHigh = document.getElementById('prio-high');
    prioHigh.classList.remove('bgc-prio-high');
    prioHigh.classList.add('bgc-prio-default');
    prioHigh.querySelector('span').classList.add('col-black');
    prioHigh.querySelector('span').classList.remove('fw-700', 'col-white');
    prioHigh.querySelector('img').src = 'assets/img/Prio_alta.png';
}

function setPrioMediumDefault() {
    let prioMedium = document.getElementById('prio-medium');
    prioMedium.classList.remove('bgc-prio-medium');
    prioMedium.classList.add('bgc-prio-default');
    prioMedium.querySelector('span').classList.add('col-black');
    prioMedium.querySelector('span').classList.remove('fw-700', 'col-white');
    prioMedium.querySelector('img').src = 'assets/img/Prio_media.png';
}

function setPrioLowDefault() {
    let prioLow = document.getElementById('prio-low');
    prioLow.classList.remove('bgc-prio-low');
    prioLow.classList.add('bgc-prio-default');
    prioLow.querySelector('span').classList.add('col-black');
    prioLow.querySelector('span').classList.remove('fw-700', 'col-white');
    prioLow.querySelector('img').src = 'assets/img/Prio_baja.png';
}

// function savePrioImg(id) {
//     prioImg = document.getElementById("prio-" + id).getElementsByTagName('img');
// }

/**
 * Clear add task form
 * Not: fucntion not complete so far
 */
function resetAddTaskForm() {
    document.getElementById('title').value = '';
    document.getElementById('textarea').value = '';
    document.getElementById('assigned-to').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
}