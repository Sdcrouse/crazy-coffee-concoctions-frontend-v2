import createCustomElement from '../utils/createCustomElement.js';
import generatePageTitle from '../utils/pageTitle.js';
import generateForm from '../utils/generateForm.js';
import isEmpty from '../utils/isEmpty.js';
import Concoction from '../entities/Concoction.js';
import Coffee from '../entities/Coffee.js';
import Ingredient from '../entities/Ingredient.js';
import { appendErrorHeading, appendSuccessHeading, appendPageHeading } from '../utils/headings.js';
import { generateServerErrorPage } from '../utils/errorPages.js';
import { generateLoginPage, toggleButtonDisplay } from './authentication.js';

const mainContainer = document.getElementById('main-container');
const apiBase = 'http://localhost:5000';
const concoctionsUrl = `${apiBase}/concoctions`;

async function generateNewConcoctionPage() {
    generatePageTitle('New Concoction');

    const newConcoctionDiv = createCustomElement('div', { id: 'new-concoction-div' });
    appendPageHeading(newConcoctionDiv, 'New Concoction');

    const requiredFieldMessage = createCustomElement('p', {
        classes: 'required-field center-content',
        text: 'Red text indicates a required field.'
    });

    const concNameLabelAndInput = createLabelAndTextInput('concoctionName', 'Name', 'Enter concoction name', 50, true);
    const concNameGroup = createCustomElement('p', {
        classes: 'indented-input',
        itemsToAppend: concNameLabelAndInput
    });
    
    const divider = document.createElement('hr');

    const coffeeHeading = createCustomElement('h3', { text: 'Coffee:', classes: 'coffee-text' });
    const coffeeAmountGroup = createCoffeeInputGroup('Amount', 'Enter amount (e.g. 2 tsp)', 50, true);
    const coffeeBrandGroup = createCoffeeInputGroup('Brand', 'Enter brand (e.g. Folgers)', 50, true);
    const coffeeBlendGroup = createCoffeeInputGroup('Blend', 'Enter blend (e.g. Instant)', 75, true);

    const coffeeRoastLabel = createLabel('roast', 'Roast', false);
    const coffeeRoastOptions = createCustomElement('select', { id: 'roast', attributes: { name: 'roast' } });
    coffeeRoastOptions.append(
        createCustomElement('option', { text: '--Please choose a roast--', attributes: { value: '' } }),
        createCustomElement('option', { text: 'Blonde', attributes: { value: 'Blonde' } }),
        createCustomElement('option', { text: 'Light', attributes: { value: 'Light' } }),
        createCustomElement('option', { text: 'Medium-Light', attributes: { value: 'Medium-Light' } }),
        createCustomElement('option', { text: 'Medium', attributes: { value: 'Medium' } }),
        createCustomElement('option', { text: 'Medium-Dark', attributes: { value: 'Medium-Dark' } }),
        createCustomElement('option', { text: 'Dark', attributes: { value: 'Dark' } }),
    );

    const coffeeRoastGroup = document.createElement('p');
    coffeeRoastGroup.appendChild(createCustomElement('li', { itemsToAppend: [coffeeRoastLabel, coffeeRoastOptions] }));

    const coffeeBeanGroup = createCoffeeInputGroup('BeanType', 'Enter bean type (e.g. Kona)', 30, false, 'Bean Type');

    const coffeeList = createCustomElement('ul', {
        classes: 'indented-input no-list-marker',
        itemsToAppend: [coffeeHeading, coffeeAmountGroup, coffeeBrandGroup, coffeeBlendGroup, coffeeRoastGroup, coffeeBeanGroup]
    });
    
    const divider2 = document.createElement('hr');

    const newConcoctionForm = generateForm('Create Concoction',
        requiredFieldMessage, concNameGroup, divider,
        coffeeList, divider2
    );
    newConcoctionForm.addEventListener('submit', e => {
        e.preventDefault();
        console.log('Concoction created!');
    });

    newConcoctionDiv.appendChild(newConcoctionForm);
    mainContainer.replaceChildren(newConcoctionDiv);
}

function createLabel(labelFor, labelText, isRequired) {
    const label = createCustomElement('label', {
        attributes: { for: labelFor },
        text: `${labelText}:`
    });

    if (isRequired) label.className = 'required-field';
    return label;
}

function createLabelAndTextInput(inputName, labelText, placeholder, maxLength, isRequired) {
    const label = createLabel(inputName, labelText, isRequired);

    const textInput = createCustomElement('input', {
        id: inputName,
        attributes: { type: 'text', name: inputName, maxLength, placeholder, autocomplete: 'on' }
    });
    if (isRequired) textInput.required = true;

    return [label, textInput];
}

function createCoffeeInputGroup(inputName, placeholder, maxLength, isRequired, labelText = inputName) {
    const coffeeLabelAndInput = createLabelAndTextInput(`coffee${inputName}`, labelText, placeholder, maxLength, isRequired);
    const coffeeInputGroup = document.createElement('p');
    
    coffeeInputGroup.appendChild(createCustomElement('li', { itemsToAppend: coffeeLabelAndInput }));
    return coffeeInputGroup;
}

async function generateConcoctionsPage(loginSuccessMessage = '') {
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
}

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

                for (let ingredientData of additionalData.ingredients) {
                    const ingredient = new Ingredient(ingredientData);
                    concoction.addIngredient(ingredient);
                }

                const concoctionDiv = createCustomElement('div', { id: 'concoction-div' });
                appendPageHeading(concoctionDiv, name);

                const concoctionAttrsWrapper = createCustomElement('div', { classes: 'concoction-attribute' });
                createAndAppendAttribute("Coffee", coffee.description(), concoctionAttrsWrapper);
                createAndAppendIngredientList(concoction.ingredients, concoction.ingredientCategories, concoctionAttrsWrapper);
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

function createAndAppendIngredientList(ingredients, ingredientCategories, wrapper) {
    for (let category of ingredientCategories) {
        const ingredientsByCategory = ingredients[category];
        if (isEmpty(ingredientsByCategory)) continue;
    
        const categoryName = ingredientsByCategory.length === 1 ? category : `${category}s`;
        const ingredientHeading = createCustomElement('h3', { text: `${categoryName}:`, classes: 'coffee-text' });
        const ingredientList = createCustomElement('ul', { classes: 'no-list-marker' });
        
        for (let ingredient of ingredients[category]) {
            const description = createCustomElement('li', { text: ingredient.description() });
            ingredientList.appendChild(description);
        }

        wrapper.append(ingredientHeading, ingredientList);
    }
}

export { generateNewConcoctionPage, generateConcoctionsPage };