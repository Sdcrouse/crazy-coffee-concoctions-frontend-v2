import createCustomElement from '../utils/createCustomElement.js';
import generatePageTitle from '../utils/pageTitle.js';
import Concoction from '../entities/Concoction.js';
import { appendErrorHeading, appendSuccessHeading, appendPageHeading } from '../utils/headings.js';
import { generateServerErrorPage } from '../utils/errorPages.js';
import { generateLoginPage, toggleButtonDisplay } from './authentication.js';

const mainContainer = document.getElementById('main-container');
const apiBase = 'http://localhost:5000';
const concoctionsUrl = `${apiBase}/concoctions`;

export async function generateConcoctionsPage(loginSuccessMessage = '') {
    generatePageTitle('Your Concoctions');

    const concoctionsDiv = createCustomElement('div', { id: 'concoctions-div' });
    if (loginSuccessMessage) appendSuccessHeading(concoctionsDiv, loginSuccessMessage);
    appendPageHeading(concoctionsDiv, 'Your Concoctions');

    // TODO?: Move this logic into a separate getConcoctions function
    // (Or I may wind up renaming this function and moving the logic for creating the concoctions page into a separate function.
    // I could name that function "createConcoctionsList" or something similar.)
    // Just remember that I am ALSO sending this function a success message when the user logs in
    try {
        let data = await fetchConcoctionData(concoctionsUrl);

        if (data.status === 400 || data.status === 401) {
            data = await refreshSession();

            if (data.status !== 200) {
                console.error(data);
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ messages: { errorMessage: data.errorMessage } });
                return;
            }

            data = await fetchConcoctionData(concoctionsUrl);
        }

        switch (data.status) {
            case 200:
                // TODO: Make the list of concoctions look better - maybe replace the list with <div>s?
                const { concoctions, noConcoctionsMessage } = data;

                if (concoctions) {
                    const concoctionsList = document.createElement('ul');

                    for (const concoctionData of concoctions) {
                        const concoction = new Concoction(concoctionData);
                        const concoctionItem = createCustomElement('li', { id: `concoction-${concoction.id}` });
                        const concoctionPar = createCustomElement('p', { text: `${concoction.name}, created on ${concoction.created}` });
                        
                        const concoctionButton = createCustomElement('button', { text: 'View Concoction' });
                        concoctionButton.addEventListener('click', async () => generateConcoctionPage(concoction.id));
                        
                        concoctionPar.appendChild(concoctionButton);
                        concoctionItem.appendChild(concoctionPar);
                        concoctionsList.appendChild(concoctionItem);
                    }

                    concoctionsDiv.appendChild(concoctionsList);
                } else {
                    concoctionsDiv.appendChild(
                        createCustomElement('p', { text: noConcoctionsMessage, classes: 'center-content' })
                    );
                }

                mainContainer.replaceChildren(concoctionsDiv);
                break;
            case 500:
                console.error(data);
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                appendErrorHeading(concoctionsDiv, 'An unknown error has occurred on the server. Please try again later.');
                mainContainer.replaceChildren(concoctionsDiv);
                break;
        }
    } catch (error) {
        console.error(error.message);
        appendErrorHeading(concoctionsDiv, 'An unknown error occurred while getting your concoctions. Please try again later.');
        mainContainer.replaceChildren(concoctionsDiv);
    }
};

async function fetchConcoctionData(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    return await response.json();
}

async function refreshSession() {
    const response = await fetch(`${apiBase}/users/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    return await response.json();
}

async function generateConcoctionPage(concoctionId) {
    try {
        let data = await fetchConcoctionData(`${concoctionsUrl}/${concoctionId}`);

        if (data.status === 400 || data.status === 401) {
            data = await refreshSession();

            if (data.status !== 200) {
                console.error(data);
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ messages: { errorMessage: data.errorMessage } });
                return;
            }

            data = await fetchConcoctionData(`${concoctionsUrl}/${concoctionId}`);
        }

        switch(data.status) {
            case 200:
                const { name, instructions, notes } = data.concoction;

                generatePageTitle(name);

                const concoctionDiv = createCustomElement('div', { id: 'concoction-div' });
                appendPageHeading(concoctionDiv, name);

                const concoctionAttrsWrapper = createCustomElement('div', { classes: 'concoction-attribute' });
                createAndAppendAttribute("Instructions", instructions, concoctionAttrsWrapper);
                if (notes) createAndAppendAttribute("Notes", notes, concoctionAttrsWrapper);

                mainContainer.replaceChildren(concoctionDiv, concoctionAttrsWrapper);
                break;
            case 500:
                console.error(data);
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                appendErrorHeading(`concoction-${concoctionId}`, 'An unknown error has occurred on the server. Please try again later.');
                break;
        }
    } catch (error) {
        console.error(error.message);
        appendErrorHeading(`concoction-${concoctionId}`, 'An unexpected error occurred while fetching this concoction. Please try again later.');
    }
}

function createAndAppendAttribute(attributeName, attributeValue, attributeWrapper) {
    const attributeHeading = createCustomElement('h3', { text: `${attributeName}:`, classes: 'coffee-text' });
    const attributeText = createCustomElement('p', { text: attributeValue });
    attributeWrapper.append(attributeHeading, attributeText);
}