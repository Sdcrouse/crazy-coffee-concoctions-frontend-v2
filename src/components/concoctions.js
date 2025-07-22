import createCustomElement from '../utils/createCustomElement.js';
import { generateServerErrorPage } from '../utils/errorPages.js';
import { generateLoginPage } from './authentication.js';

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

    // TODO: Move this logic into a separate getConcoctions function
    // (Or I may wind up renaming this function and moving the logic for creating the concoctions page into a separate function)
    // Just remember that I am ALSO sending this function a success message when the user logs in
    try {
        const response = await fetch(`${apiBase}/concoctions`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();

        switch (data.status) {
            case 200:
                concoctionsDiv.appendChild(
                    createCustomElement('p', { text: data.message, classes: 'center-content' })
                );
                mainContainer.replaceChildren(concoctionsDiv);
                break;
            case 400:
            case 401:
                console.error(data);
                document.getElementById('signup').style.display = 'initial';
                document.getElementById('login').style.display = 'initial';
                document.getElementById('display-concoctions').style.display = 'none';
                generateLoginPage({ invalidSessionMessage: data.message });
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