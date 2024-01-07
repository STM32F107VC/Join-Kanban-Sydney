/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_summary(id) {
    await includeHTML();
    await loadContacts();
    markActiveLink(id);
    greetUser();
}

async function greetUser() {
    let greetingText = document.getElementById('greet-user');
    let user = JSON.parse(await getItem('guestOrAccount'));
    console.log('Entered greetUser() function.');
    if (user == 'guest') {
        greetingText.textContent = '';
        greetingText.textContent = 'Guest';
        console.log('Guest has logged in. and' + greetingText);
    } else if (user == 'account') {
        greetingText.textContent = '';
        greetingText.textContent = 'Account';
        console.log('User has logged in.');
    }
}