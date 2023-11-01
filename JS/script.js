async function init() {
    await includeHTML();
}

function openContactsOverlay() {
    console.log('Contacts Overlay');
    document.getElementById('contacts').classList.add('d-none');
    document.getElementById('overlay-contacts').classList.remove('d-none');
    document.getElementById('body-contacts').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.add("opacity", "z-ind--1");
    // document.getElementById('side-and-topbar-contacts').classList.add("z-ind-0");
}