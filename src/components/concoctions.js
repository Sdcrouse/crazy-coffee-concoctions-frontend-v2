import createCustomElement from '../utils/createCustomElement.js';
import generatePageTitle from '../utils/pageTitle.js';
import Concoction from '../entities/Concoction.js';
import Coffee from '../entities/Coffee.js';
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
                        const concoctionItem = createCustomElement('li', { id: concoction.listItemId() });
                        const concoctionPar = createCustomElement('p', { text: concoction.description() });
                        
                        const concoctionButton = createCustomElement('button', { text: 'View Concoction' });
                        concoctionButton.addEventListener('click', async () => generateConcoctionPage(concoction));
                        
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

async function generateConcoctionPage(concoction) {
    try {
        let additionalData = await fetchConcoctionData(`${concoctionsUrl}/${concoction.id}`);

        if (additionalData.status === 400 || additionalData.status === 401) {
            additionalData = await refreshSession();

            if (additionalData.status !== 200) {
                console.error(additionalData);
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ messages: { errorMessage: additionalData.errorMessage } });
                return;
            }

            additionalData = await fetchConcoctionData(`${concoctionsUrl}/${concoction.id}`);
        }

        switch(additionalData.status) {
            case 200:
                concoction.addData(additionalData.concoction);

                const { name, instructions, notes } = concoction;
                generatePageTitle(name);

                const coffee = new Coffee(additionalData.coffee);
                concoction.coffee = coffee;

                const concoctionDiv = createCustomElement('div', { id: 'concoction-div' });
                appendPageHeading(concoctionDiv, name);

                const concoctionAttrsWrapper = createCustomElement('div', { classes: 'concoction-attribute' });
                createAndAppendAttribute("Coffee", coffee.description(), concoctionAttrsWrapper);
                createAndAppendAttribute("Instructions", instructions, concoctionAttrsWrapper);
                if (notes) createAndAppendAttribute("Notes", notes, concoctionAttrsWrapper);

                mainContainer.replaceChildren(concoctionDiv, concoctionAttrsWrapper);
                break;
            case 500:
                console.error(additionalData);
                generateServerErrorPage(additionalData.errorMessage);
                break;
            default:
                console.error(additionalData);
                appendErrorHeading(concoction.listItemId(), 'An unknown error has occurred on the server. Please try again later.');
                break;
        }
    } catch (error) {
        console.error(error.message);
        appendErrorHeading(concoction.listItemId(), 'An unexpected error occurred while fetching this concoction. Please try again later.');
    }
}

function createAndAppendAttribute(attributeName, attributeValue, attributeWrapper) {
    const attributeHeading = createCustomElement('h3', { text: `${attributeName}:`, classes: 'coffee-text' });
    const attributeText = createCustomElement('p', { text: attributeValue });
    attributeWrapper.append(attributeHeading, attributeText);
}