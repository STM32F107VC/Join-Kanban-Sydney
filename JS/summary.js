/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_summary() {
    await includeHTML();
    await loadContacts();
}