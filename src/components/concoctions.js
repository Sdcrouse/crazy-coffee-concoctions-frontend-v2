import createCustomElement from '../utils/createCustomElement.js';

const mainContainer = document.getElementById('main-container');
const titleElement = document.querySelector('title');
const baseTitle = 'Crazy Coffee Concoctions';
const apiBase = 'http://localhost:5000';

export async function generateConcoctionsPage(loginSuccessMessage = '') {
    titleElement.textContent = `${baseTitle} - Your Concoctions`;

    const concoctionsDiv = createCustomElement('div', { id: 'concoctions-div' });

    if (loginSuccessMessage) {
        const loginSuccessHeading = createCustomElement('h3', {
            text: loginSuccessMessage,
            classes: 'success-text center-content'
        });
        concoctionsDiv.appendChild(loginSuccessHeading);
    }

    const concoctionsHeading = createCustomElement('h2', {
        text: 'Your Concoctions',
        classes: 'center-content coffee-text'
    });

    concoctionsDiv.appendChild(concoctionsHeading);

    // TODO: Add logic for the different responses returned by the get /concoctions request (currently 200, 401, and 500)
    // TODO: Move this logic into a separate getConcoctions function
    // (Or I may wind up renaming this function and moving the logic for creating the concoctions page into a separate function)
    // Just remember that I am ALSO sending this function a success message when the user logs in
    const newResponse = await fetch(`${apiBase}/concoctions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    const newData = await newResponse.json();

    concoctionsDiv.appendChild(
        createCustomElement('p', { text: newData.message, classes: 'center-content' })
    );
    mainContainer.replaceChildren(concoctionsDiv);
};