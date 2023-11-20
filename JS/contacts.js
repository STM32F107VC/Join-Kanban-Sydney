/* Declare variables and arrays */
let contacts = [];


/**
 * Load contacts from backend
 * 
 */
async function loadContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
        getInitialLetterOfFirstname();
    } catch (error) {
        console.info('Could not load contacts.');
    }
}

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

function openEditContactForm() {
    document.getElementById('contacts').classList.add('d-none');
    document.getElementById('body-contacts').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.add("opacity", "z-ind--1");
    document.getElementById('edit-contacts').classList.remove('d-none');
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

function closeEditContactForm() {
    document.getElementById('contacts').classList.remove('d-none');
    document.getElementById('body-contacts').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.remove("opacity", "z-ind--1");
    document.getElementById('edit-contacts').classList.add('d-none');
}

/**
 * Add new contacts
 * 
 */
async function addContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('number');
    contacts.push({
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
    });
    await setItem('contacts', JSON.stringify(contacts));
    resetAddContactsForm(name, email, phone);
    location.replace('contacts.html');
}

/**
 * 
 * 
 */
function getInitialLetterOfFirstname() {
    for (let j = 0; j < contacts.length; j++) {
        let contact = contacts[j];
        let str = contact['name'].match(/\b(\w)/g);
        let acronymUpperCase = str.join('').toUpperCase();
        let initialLetter = contact['name'].charAt(0)[0].toUpperCase();
        let name = contact['name'];
        let email = contact['email'];
        let phone = contact['phone'];
        checkRegister(j, initialLetter, name, email, acronymUpperCase, phone);
    }
}

/**
 * 
 * @param {*} letter 
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 */
function checkRegister(j, letter, n, e, auc, p) {
    let contactBook = document.getElementById('contact-book');
    let children = contactBook.children;
    for (let i = 0; i < children.length; i++) {
        let id = contactBook.getElementsByTagName('tr')[i].id;
        let dataCell = contactBook.getElementsByTagName('td');
        let child = children[i];
        if (id === letter) {
            child.innerHTML += renderContacts(j, id, n, e, auc, p);
            dataCell[i].classList.remove('d-none');
        }
    }
}

/**
 * ${n}, ${e}, ${auc}
 * @param {*} id 
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 * @returns 
 */
function renderContacts(j, id, n, e, auc, p) {
    return /*html*/`
        <div id="${id}${j}" onclick="contactDetails('${n}', '${e}', '${auc}', ${p}, '${id}', '${j}')" class="contact mb-24px">
            <div class="flex y-center gap-35px">
                <div style="background-color: #${randomNumber()}" class="flex x-center y-center p-12px acronym">${auc}</div>
                <div>
                    <div class="ft-general fs-20px fw-400 mb-5px">${n}</div>
                    <div><a class="ft-general fw-400 fs-16px" href="mailto: ${e}">${e}</a></div>
                </div>
            </div>
        </div>`;
}

/**
 * Function to show contact details
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 * @param {*} p 
 * @param {*} id 
 * @param {*} j 
 */
function contactDetails(n, e, auc, p, id, j) {
    let divDetails = document.getElementById('contact-details');
    divDetails.innerHTML = renderContactDetails(n, e, auc, p, id, j);
}

function renderContactDetails(n, e, auc, p, id, j) {
    return /*html*/`
        <div class="edit-contact flex y-center mb-24px">
            <div class="mr-54px">
                <span>${auc}</span>
            </div>
            <div>
                <div class="ft-general fs-47px fw-500 mb-12px">${n}</div>
                <div class="flex gap-16px">
                    <div onclick="editContact('${j}')" class="flex col-black y-center gap-8px">
                        <img src="/assets/img/edit.png" alt="Edit">
                        <span class="dark-blue">Edit</span>
                    </div>
                    <div onclick="deleteContact('${j}')" class="flex col-black y-center gap-8px">
                        <img src="/assets/img/delete.png" alt="Delete">
                        <span class="dark-blue">Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-column">
            <span class="ft-general fs-20px fw-400 mb-64px mt-24px">Contact Information</span>
            <div class="flex flex-column">
                <span class="ft-general fs-16px fw-700 mb-16px">Email</span>
                <a class="mb-24px" href="mailto:${e}">${e}</a>

                <span class="ft-general fs-16px fw-700 mb-16px">Phone</span>
                <a href="phone:${p}">${p}</a>
            </div>
        </div>`;
}

function getContactValues(j) {
    let name = contacts[j]['name'];
    let email = contacts[j]['email'];
    let phone = contacts[j]['phone'];
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-number').value = phone;
}

function editContact(j) {
    let editContactForm = document.getElementById('edit-contacts');
    editContactForm.innerHTML = renderEditContactForm(j);
    openEditContactForm();
    getContactValues(j);
}

function renderEditContactForm(j) {
    return /*html*/`
        <div class="bg-dark-blue flex flex-column x-center y-start">
            <img src="assets/img/Capa_2_light.png" alt="Join logo" class="join-logo-small mb-16px">
            <span class="ft-general fs-61px fw-700 mb-8px">Edit contact</span>
            <img src="assets/img/Vector 5.png" alt="blue horizontal line">
        </div>

        <div class="flex flex-row w-100 overlay-forms">
            <div class="flex y-center">
                <img src="assets/img/contact_person.png" alt="avatar">
            </div>

            <div class="flex flex-column x-center y-center w-100">
                <div class="flex w-100 x-end close-cross mb-48px"><img onclick="closeEditContactForm()" class="p-8px"
                        src="assets/img/close.png" alt="close"></div>

                <form onsubmit="return false;" class="flex flex-column">
                    <div class="login-input mb-32px flex x-space-betw y-center">
                        <input contenteditable="true" class="ft-general fs-20px fw-400 input-icon-pos icon-name w-100" id="edit-name"
                            placeholder="Name" name="name" required>
                    </div>
                    <div class="login-input mb-32px flex x-space-betw y-center">
                        <input contenteditable="true" class="ft-general fs-20px fw-400 input-icon-pos icon-email w-100" id="edit-email"
                            placeholder="Email" type="email" required>
                    </div>
                    <div class="login-input mb-32px flex x-space-betw y-center">
                        <input contenteditable="true" class="ft-general fs-20px fw-400 input-icon-pos icon-phone w-100" id="edit-number"
                            placeholder="Phone" type="tel" required>
                    </div>
                    <div class="flex x-start gap-35px">
                        <button onclick="deleteContact(${j})"
                            class="btn-light ft-general fs-21px fw-700 flex y-center gap-4px">Delete
                            <img src="assets/img/close.png" alt="cancel"></button>
                        <button class="btn-dark ft-general fs-21px fw-700 flex y-center gap-4px">Safe
                            <img src="assets/img/check.png" alt="add"></button>
                    </div>
                </form>
            </div>
        </div>`
}

// function safeEditChanges() {

// }

async function deleteContact(j) {
    contacts.splice(j, 1);
    await setItem('contacts', JSON.stringify(contacts));
    contacts = JSON.parse(await getItem('contacts'));
    checkRegister();
    location.replace('contacts.html');
}

/**
 * Function to generate ranndom number to set ranom background color
 * with 16 bit hex number
 * @returns Returns the random generated number to set it as background-color
 */
function randomNumber() {
    numberRandom = Math.floor((Math.random() * 16777216)).toString(16);
    let colWhite = 0xFFFFFFF;
    let colBlack = 0x0000000;
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