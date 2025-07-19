import createCustomElement from '../utils/createCustomElement.js';

const mainContainer = document.getElementById('main-container');
const titleElement = document.querySelector('title');
const baseTitle = 'Crazy Coffee Concoctions';
const apiBase = 'http://localhost:5000';

export async function generateConcoctionsPage(successMessage) {
    titleElement.textContent = `${baseTitle} - Your Concoctions`;

    // TODO: Add logic for the different responses returned by the get /concoctions request (currently 200, 401, and 500)
    const newResponse = await fetch(`${apiBase}/concoctions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    const newData = await newResponse.json();

    mainContainer.replaceChildren();

    if (successMessage) {
        mainContainer.appendChild(
            createCustomElement('h2', { text: successMessage, classes: 'success-text center-content' })
        );
    }

    mainContainer.appendChild(
        createCustomElement('p', { text: newData.message, classes: 'center-content' })
    );
};