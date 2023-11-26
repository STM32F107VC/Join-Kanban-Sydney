/* Declare variables */
let getBackgroundColor;
let bgcState = false;
let oldNumericId;
let oldLetterId;
let oldId;

/* Declare arrays */
let contacts = [];

/**
 * Load contacts from backend
 * 
 */
async function loadContacts() {
    try {
        console.log('Kontakte erfolgreich geladen.');
        contacts = JSON.parse(await getItem('contacts'));
        getInitialLetterOfFirstname();
    } catch (error) {
        console.info('Kontakte konnten nicht geladen werden.');
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

/**
 * Open edit contacts overlay menu
 * 
 */
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

/**
 * Close edit contacts overlay menu
 * 
 */
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
    let backgroundColor = randomNumber();
    contacts.push({
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
        'background-color': backgroundColor
    });
    await setItem('contacts', JSON.stringify(contacts));
    getInitialLetterOfFirstname();
    resetAddContactsForm(name, email, phone);
    location.replace('contacts.html');
}

/**
 * Clear add contacts form
 * @param {*} n Name of contact
 * @param {*} e E-mail of contact
 * @param {*} p Phone number of contact
 */
function resetAddContactsForm(n, e, p) {
    n.value = '';
    e.value = '';
    p.value = '';
}

/**
 * Iterate each contact JSON out of contacts array
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
        let backgroundColor = contact['background-color'];
        checkRegister(j, initialLetter, name, email, acronymUpperCase, phone, backgroundColor);
    }
}

/**
 * 
 * @param {*} letter 
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 */
function checkRegister(j, letter, n, e, auc, p, bgc) {
    let contactBook = document.getElementById('contact-book');
    let children = contactBook.children;
    for (let i = 0; i < children.length; i++) {
        let id = contactBook.getElementsByTagName('tr')[i].id;
        let dataCell = contactBook.getElementsByTagName('td');
        let child = children[i];
        if (id === letter) {
            child.innerHTML += renderContacts(j, id, n, e, auc, p, bgc);
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
function renderContacts(j, id, n, e, auc, p, bgc) {
    return /*html*/`
        <div id="${id}${j}" onclick="contactDetails('${n}', '${e}', '${auc}', ${p}, '${id}', '${j}')" class="contact contactHover mb-24px">
            <div class="flex y-center gap-35px">
                <div style="background-color: #${bgc}" class="flex x-center y-center p-12px acronym">${auc}</div>
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
    let contact = document.getElementById(`${id}${j}`);
    let currentId = id + j;
    if (!contact.classList.contains('bg-dark-blue', 'col-white') && currentId) {
        addContactClasses(contact, divDetails, currentId);
    } else {
        contact.classList.remove('bg-dark-blue', 'col-white');
        divDetails.classList.add('d-none');
    }
    divDetails.innerHTML = renderContactDetails(n, e, auc, p, id, j);
    oldId = currentId;
}

/**
 * Add classes background-color and text color for contacts if its selected
 * @param {*} contact 
 * @param {*} divDetails 
 * @param {*} currentId 
 */
function addContactClasses(contact, divDetails, currentId) {
    contact.classList.add('bg-dark-blue', 'col-white');
    contact.classList.remove('contactHover');
    divDetails.classList.remove('d-none');
    if (currentId !== oldId) {
        if (oldId === undefined) {
            oldId = currentId;
        } else { document.getElementById(`${oldId}`).classList.remove('bg-dark-blue', 'col-white'); }
    }
}

/**
 * Render contact details, when a contact is selected
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 * @param {*} p 
 * @param {*} id 
 * @param {*} j 
 * @returns 
 */
function renderContactDetails(n, e, auc, p, id, j) {
    return /*html*/`
        <div id="modify-contact" class="edit-contact flex y-center mb-24px">
            <div class="ft-general fs-47px fw-500 col-white mr-54px" style='background-color: #${contacts[j]['background-color']}'><span>${auc}</span></div>
            <div>
                <div class="ft-general fs-47px fw-500 mb-12px">${n}</div>
                <div class="flex gap-16px">
                    <div onclick="editContact('${j}', '${auc}')" class="flex col-black y-center gap-8px">
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
        ${renderContactInformatons(e, p)}`;
}

/**
 * Renders the email adress and phone number
 * @param {*} e Variable with email adress
 * @param {*} p Variable with phone number
 * @returns 
 */
function renderContactInformatons(e, p) {
    return /*html*/`
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

/**
 * Get values out of contacts JSON array and show them in the input fields to check
 * @param {*} j Index for selected contact
 */
function getContactValues(j) {
    let name = contacts[j]['name'];
    let email = contacts[j]['email'];
    let phone = contacts[j]['phone'];
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-number').value = phone;
}

/**
 * 
 * @param {*} j 
 */
function editContact(j, auc) {
    getBackgroundColor = contacts[j]['background-color'];
    let editContactForm = document.getElementById('delete-part');
    let avatar = document.getElementById('edit-Overlay-Menu-Avatar');
    avatar.style = `background-color: ${getBackgroundColor}`;
    avatar.innerHTML = renderEditOverlayAvatar(auc);
    editContactForm.innerHTML = renderDeletePart(j);
    openEditContactForm();
    getContactValues(j);
}

/**
 * 
 * @param {*} auc 
 * @returns 
 */
function renderEditOverlayAvatar(auc) {
    return /*html*/`
    <div class="ft-general fs-47px fw-500 col-white" style="background-color: #${getBackgroundColor}">
        <span>${auc}</span></div>
    </div>`;
}

/**
 * Render form edit contact overlay menu the part to delete and safe contacts contacts
 * @param {*} j 
 * @returns 
 */
function renderDeletePart(j) {
    return /*html*/`
        <button onclick="deleteContact(${j})" class="btn-light ft-general fs-21px fw-700 flex y-center gap-4px">
            Delete <img src="assets/img/close.png" alt="cancel">
        </button>
        <button id="safe-btn" onclick="safeEditChanges(${j})" class="btn-dark ft-general fs-21px fw-700 flex y-center gap-4px">
            Safe <img src="assets/img/check.png" alt="add">
        </button>`;
}

/**
 * Safes changes which were made on a contact
 * @param {*} j 
 */
async function safeEditChanges(j) {
    document.getElementById('safe-btn').disabled = true;
    let name = document.getElementById('edit-name').value;
    let email = document.getElementById('edit-email').value;
    let phone = document.getElementById('edit-number').value;
    contacts.splice(j, 1);
    contacts.push({
        'name': name,
        'email': email,
        'phone': phone,
        'background-color': getBackgroundColor
    });
    await setItem('contacts', JSON.stringify(contacts));
    document.getElementById('safe-btn').disabled = false;
    location.replace('contacts.html');
}

/**
 * Deletes a complet contact
 * @param {*} j 
 */
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
    let numberRandom = Math.floor((Math.random() * 0xffffff)).toString(16);
    console.log(numberRandom);
    if (numberRandom <= 0xffff) {
        randomNumber();
    } else { return numberRandom; }
}