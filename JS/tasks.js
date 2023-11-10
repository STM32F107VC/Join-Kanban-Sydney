let tasks = [];
let prioImg;

/**
 * Function to add new tasks
 * 
 */
function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('textarea');
    // let assignedTo = document.getElementById('assigned-to');
    let date = document.getElementById('date');

    tasks.push({
        "Title": title.value,
        "Description": description.value,
        // "Assigned-to": ,
        "Date": date.value,
        "Prio": prioImg[0]
        // "Category": 
    });
    console.log('Add Task function.');
}

/**
 * bgc = background-color
 * Set bgc of high prio, remove medium and low bgc, add default bgc
 * 
 * @param {*} id 
 */
function savePrioStateHigh(id) {
    console.log('Funktion savePrioStateHigh');
    let prioDiv = document.getElementById("prio-" + id);
    prioDiv.classList.toggle("bgc-prio-" + id);
    document.getElementById("prio-medium").classList.remove('bgc-prio-medium');
    document.getElementById("prio-low").classList.remove('bgc-prio-low');
    document.querySelector("#prio-medium", "#prio-low").classList.add('bgc-prio-default');
    savePrioImg(id);
}

/**
 * bgc = background-color
 * Set bgc of medium prio, remove high and low bgc, add default bgc
 * @param {*} id 
 */
function savePrioStateMedium(id) {
    console.log('Funktion savePrioStateMedium');
    let prioDiv = document.getElementById("prio-" + id);
    prioDiv.classList.toggle("bgc-prio-" + id);
    document.getElementById("prio-high").classList.remove('bgc-prio-high');
    document.getElementById("prio-low").classList.remove('bgc-prio-low');
    document.querySelector("#prio-high", "#prio-low").classList.add('bgc-prio-default');
    savePrioImg(id);
}


/**
 * bgc = background-color
 * Set bgc of low prio, remove high and medium bgc, add default bgc
 * @param {*} id 
 */
function savePrioStateLow(id) {
    console.log('Funktion savePrioStateLow');
    let prioDiv = document.getElementById("prio-" + id);
    prioDiv.classList.toggle("bgc-prio-" + id);
    document.getElementById("prio-high").classList.remove('bgc-prio-high');
    document.getElementById("prio-medium").classList.remove('bgc-prio-medium');
    document.querySelector("#prio-high", "#prio-medium").classList.add('bgc-prio-default');
    savePrioImg(id);
}

function savePrioImg(id) {
    prioImg = document.getElementById("prio-" + id).getElementsByTagName('img');
}