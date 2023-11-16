/* Declare variables and arrays */
let contacts = [];


/**
 * Open contacts overlay menu
 * 
 */
function openContactsOverlay() {
    document.getElementById('contacts').classList.add('d-none');
    document.getElementById('body-contacts').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.add("opacity", "z-ind--1");
    document.getElementById('overlay-contacts').classList.remove('d-none');
}

/**
 * Close contacts overlay menu
 * 
 */
function closeContactOverlay() {
    document.getElementById('contacts').classList.remove('d-none');
    document.getElementById('body-contacts').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.remove("opacity", "z-ind--1");
    document.getElementById('overlay-contacts').classList.add('d-none');
}

/**
 * Add new contacts
 * 
 */
function addContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('number');
    contacts.push({
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
    });
    safeToLocalStorage(contacts);
    resetAddContactsForm(name, email, phone);
}

/**
 * Safe contacts to locaol storage for testing purpose(later in backlog)
 * @param {*} c 
 */
function safeToLocalStorage(c) {
    let contactsAsString = JSON.stringify(c);
    localStorage.setItem('contacts', contactsAsString);
}

/**
 * Load contacts from local storage
 * 
 */
function loadContacts() {
    let contactsAsString = localStorage.getItem('contacts');
    if (contactsAsString) {
        contacts = JSON.parse(contactsAsString);
        getInitialLetterOfFirstname();
    } else {
        console.log('Could not load contacts.');
    }
}

/**
 * 
 */
function getInitialLetterOfFirstname() {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let str = contact['name'].match(/\b(\w)/g);
        let acronymUpperCase = str.join('').toUpperCase();
        let initialLetter = contact['name'].charAt(0)[0].toUpperCase();
        let name = contact['name'];
        let email = contact['email'];
        checkRegister(initialLetter, name, email, acronymUpperCase);
    }
}

/**
 * 
 * @param {*} letter 
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 */
function checkRegister(letter, n, e, auc) {
    let contactBook = document.getElementById('contact-book');
    let children = contactBook.children;
    for (let i = 0; i < children.length; i++) {
        let id = contactBook.getElementsByTagName('tr')[i].id;
        let dataCell = contactBook.getElementsByTagName('td');
        let child = children[i];

        // console.log(id);
        // console.log(child);
        if (id === letter) {
            child.innerHTML += renderContacts(id, n, e, auc, i);// i übergeben
            console.log(`${dataCell[i]}`);
            dataCell[i].classList.remove('d-none');
        }
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 * @returns 
 */
function renderContacts(id, n, e, auc) {
    return /*html*/`
        <div id="${id}" onclick="contactDetails(${n}, ${e}, ${auc})" class="contact mb-24px">
            <div class="flex y-center gap-35px">
                <div style="background-color: #${randomNumber()}" class="flex x-center y-center p-12px acronym">${auc}</div>
                <div>
                    <div class="ft-general fs-20px fw-400 mb-5px">${n}</div>
                    <div><a class="ft-general fw-400 fs-16px" href="mailto: ${e}">${e}</a></div>
                </div>
            </div>
        </div>`;
}

function contactDetails() {
    let divDetails = document.getElementById('contact-details');
    divDetails = renderDetailDiv();
}

function renderDetailDiv() {
    return /*html*/`
      ${n} ${e} ${auc}
    `;
}

/**
 * Function to generate ranndom number to set ranom background color
 * with 16 bit hex number
 * @returns Returns the random gneerated number to set it as background-color
 */
function randomNumber() {
    numberRandom = Math.floor((Math.random() * 16777216)).toString(16);
    let colWhite = 0xFFFFFFF;
    let colBlack = 0x0000000;
    console.log(numberRandom);
    if ((numberRandom != colBlack) || (numberRandom != colWhite)) {
        return numberRandom;
    } else { randomNumber(); }
}

/**
 * Clear add contacts form
 * @param {*} n 
 * @param {*} e 
 * @param {*} p 
 */
function resetAddContactsForm(n, e, p) {
    n.value = '';
    e.value = '';
    p.value = '';
}