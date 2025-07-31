import createCustomElement from '../utils/createCustomElement.js';
import { generateServerErrorPage } from '../utils/errorPages.js';
import { generateLoginPage, toggleButtonDisplay } from './authentication.js';

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

    // TODO?: Move this logic into a separate getConcoctions function
    // (Or I may wind up renaming this function and moving the logic for creating the concoctions page into a separate function.
    // I could name that function "createConcoctionsList" or something similar.)
    // Just remember that I am ALSO sending this function a success message when the user logs in
    try {
        let data = await fetchConcoctions();

        if (data.status === 400 || data.status === 401) {
            data = await refreshSession();

            if (data.status !== 200) {
                console.error(data);
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ messages: { errorMessage: data.errorMessage } });
                return;
            }

            data = await fetchConcoctions();
        }

        switch (data.status) {
            case 200:
                // TODO: Make the list of concoctions look better - maybe replace the list with <div>s?
                const { concoctions, noConcoctionsMessage } = data;

                if (concoctions) {
                    const concoctionsList = document.createElement('ul');

                    for (const concoction of concoctions) {
                        const { id, name, created } = concoction;

                        const concoctionItem = createCustomElement(
                            'li', { id: `concoction-${id}`, text: `${name}, created on ${created}` }
                        );

                        const concoctionButton = createCustomElement('button', { text: 'View Concoction' });
                        concoctionButton.addEventListener('click', async () => generateConcoctionPage(id));

                        concoctionsList.append(concoctionItem, concoctionButton);
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

                const errorHeading = createCustomElement('h4', {
                    text: 'An unknown error has occurred on the server. Please try again later.',
                    classes: 'center-content error-text'
                });
                
                concoctionsDiv.appendChild(errorHeading);
                mainContainer.replaceChildren(concoctionsDiv);
                break;
        }
    } catch (error) {
        console.error(error.message);

        const errorHeading = createCustomElement('h4', {
            text: 'An unknown error occurred while getting your concoctions. Please try again later.',
            classes: 'center-content error-text'
        });
        
        concoctionsDiv.appendChild(errorHeading);
        mainContainer.replaceChildren(concoctionsDiv);
    }
};

async function fetchConcoctions() {
    const response = await fetch(`${apiBase}/concoctions`, {
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
        // TODO: Combine this function and fetchConcoctions into one function, fetchConcoctionData
        // I may be able to add the following if statement to it!
        let data = await fetchConcoction(concoctionId);

        if (data.status === 400 || data.status === 401) {
            data = await refreshSession();

            if (data.status !== 200) {
                console.error(data);
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ messages: { errorMessage: data.errorMessage } });
                return;
            }

            data = await fetchConcoction(concoctionId);
        }

        switch(data.status) {
            case 200:
                const { name } = data.concoction;    
                titleElement.textContent = `${baseTitle} - ${name}`;

                const concoctionName = createCustomElement('h2', { text: name, classes: 'center-content coffee-text' });
                const concoctionDiv = createCustomElement('div', { id: 'concoction-div' });
                concoctionDiv.appendChild(concoctionName);
                mainContainer.replaceChildren(concoctionDiv);

                break;
            case 500:
                console.error(data);
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);

                const errorHeading = createCustomElement('h4', {
                    text: 'An unknown error has occurred on the server. Please try again later.',
                    classes: 'center-content error-text'
                });
                
                document.getElementById(`concoction-${concoctionId}`).appendChild(errorHeading);
                break;
        }
    } catch (error) {
        console.error(error.message);

        const errorHeading = createCustomElement('h4', {
            text: 'An unexpected error occurred while fetching this concoction. Please try again later.',
            classes: 'center-content error-text'
        });
        
        document.getElementById(`concoction-${concoctionId}`).appendChild(errorHeading);
    }
}

async function fetchConcoction(concoctionId) {
    const response = await fetch(`${apiBase}/concoctions/${concoctionId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    return await response.json();
}