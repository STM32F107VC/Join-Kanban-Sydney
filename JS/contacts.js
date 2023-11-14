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

function getInitialLetterOfFirstname() {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let initialLetter = contact['name'].charAt(0)[0].toUpperCase();
        let name = contact['name'];
        let email = contact['email'];
        checkRegister(initialLetter, name, email);
    }
}

function checkRegister(letter, n, e) {
    let contactBook = document.getElementById('contact-book');
    let children = contactBook.children;
    for (let i = 0; i < children.length; i++) {
        let id = contactBook.getElementsByTagName('tr')[i].id;
        let child = children[i];
        console.log(id);
        console.log(child);
        if (id == letter) { child.innerHTML += renderContacts(id, n, e); }
    }
}

function renderContacts(id, n, e) {
    return /*html*/`
        <div class="contact">
            <div>

            </div>
            <div>
                <div>${n}</div>
                <div>${e}</div>
            </div>
        </div>
    `;

    // return /*html*/`
    // <div class="contact">
    //     <span class="ft-general fs-20px fw-700">${id}</span>
    //     <hr class="">
    //     <div class="flex gap-35px y-center ft-general fs-20px fw-400">
    //         <div>Initialen</div>
    //         <div class="ft-general fs-20px">
    //             <span><b>${n}</b></span>
    //             <div><a href="mailto: ${e}">${e}</a></div>
    //         </div>
    //     </div>
    // </div>`;
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