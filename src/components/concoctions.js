import createCustomElement from '../utils/createCustomElement.js';
import generatePageTitle from '../utils/pageTitle.js';
import generateForm from '../utils/generateForm.js';
import isEmpty, { allEmpty } from '../utils/isEmpty.js';
import Concoction from '../entities/Concoction.js';
import Coffee from '../entities/Coffee.js';
import Ingredient from '../entities/Ingredient.js';
import { appendErrorHeading, appendSuccessHeading, appendPageHeading } from '../utils/headings.js';
import { generateServerErrorPage } from '../utils/errorPages.js';
import { capitalizeWord, lowerCaseWord } from '../utils/wordFunctions.js';
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
        id: 'concoctionNameGroup',
        classes: 'indented-input',
        itemsToAppend: concNameLabelAndInput
    });
    const divider1 = document.createElement('hr');

    const coffeeHeading = createCustomElement('h3', { text: 'Coffee:', classes: 'coffee-text' });
    const coffeeAmountGroup = createCoffeeInputGroup('Amount', 'Enter amount (e.g. 2 tsp)', 50, true);
    const coffeeBrandGroup = createCoffeeInputGroup('Brand', 'Enter brand (e.g. Folgers)', 50, true);
    const coffeeBlendGroup = createCoffeeInputGroup('Blend', 'Enter blend (e.g. Instant)', 75, true);

    const coffeeRoastLabel = createLabel('roast', 'Roast', false);
    const coffeeRoastOptions = createCustomElement('select', { id: 'roast', attributes: { name: 'roast' } });
    coffeeRoastOptions.appendChild(createCustomElement(
        'option', { text: '--Please choose a roast--', attributes: { value: '' } }
    ));

    const roastOptionList = ['Blonde', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];
    for (let roastOption of roastOptionList) {
        coffeeRoastOptions.appendChild(createCustomElement(
            'option', { text: roastOption, attributes: { value: roastOption } }
        ));
    }

    const coffeeRoastGroup = document.createElement('p');
    coffeeRoastGroup.appendChild(createCustomElement('li', { itemsToAppend: [coffeeRoastLabel, coffeeRoastOptions] }));

    const coffeeBeanGroup = createCoffeeInputGroup('BeanType', 'Enter bean type (e.g. Kona)', 30, false, 'Bean Type');
    const coffeeList = createCustomElement('ul', {
        classes: 'indented-input no-list-marker',
        itemsToAppend: [coffeeHeading, coffeeAmountGroup, coffeeBrandGroup, coffeeBlendGroup, coffeeRoastGroup, coffeeBeanGroup]
    });
    const divider2 = document.createElement('hr');

    const ingredientsHeading = createCustomElement('h3', { text: 'Ingredients:', classes: 'coffee-text indented-input' });
    const liquidInputs = generateIngredientInputs('Liquid');
    const sweetenerInputs = generateIngredientInputs('Sweetener');
    const creamerInputs = generateIngredientInputs('Creamer');
    const additionalIngredientInputs = generateIngredientInputs('Additional Ingredient');
    const divider3 = document.createElement('hr');

    const instructionsGroup = createTextAreaGroup(
        'instructions', 'Enter the instructions for creating your crazy coffee concoction here.', true, 'instructionsGroup'
    );
    const notesGroup = createTextAreaGroup('notes', 'Enter any concoction notes here.', false);

    const newConcoctionForm = generateForm('Create Concoction',
        requiredFieldMessage, concNameGroup, divider1,
        coffeeList, divider2, ingredientsHeading,
        ...liquidInputs, ...sweetenerInputs, ...creamerInputs, ...additionalIngredientInputs,
        divider3, instructionsGroup, notesGroup
    );
    
    newConcoctionForm.addEventListener('submit', e => createConcoction(e, newConcoctionForm));

    newConcoctionDiv.appendChild(newConcoctionForm);
    mainContainer.replaceChildren(newConcoctionDiv);
}

function createConcoction(e, concoctionForm) {
    e.preventDefault();
    
    const formData = {
        concoction: {
            name: concoctionForm.querySelector('#concoctionName').value,
            instructions: concoctionForm.querySelector('#instructions').value,
            notes: concoctionForm.querySelector('#notes').value
        },
        coffee: {
            amount: concoctionForm.querySelector('#coffeeAmount').value,
            brand: concoctionForm.querySelector('#coffeeBrand').value,
            blend: concoctionForm.querySelector('#coffeeBlend').value,
            roast: concoctionForm.querySelector('#roast').value,
            beanType: concoctionForm.querySelector('#coffeeBeanType').value
        }
    };

    const inputNames = ['category', 'amount', 'name'];
    const ingredients = Array.from(concoctionForm.querySelectorAll('ol.ingredient-list'))
                             .filter(ingredientList => ingredientList.style.display !== 'none')
                             .map(ingredientList => Array.from(ingredientList.querySelectorAll('li')))
                             .flat()
                             .map(ingredientListItem => {
                                 const ingredientData = {};
                                 ingredientData.listItemId = ingredientListItem.id;
                                 
                                 for (const inputName of inputNames) {                                     
                                     const ingredientInput = ingredientListItem.querySelector(`input[name="${inputName}"]`);
                                     ingredientData[inputName] = ingredientInput.value;
                                 }

                                 return ingredientData;
                             });

    formData.ingredients = ingredients.map(ingredientData => {
        return {'category': ingredientData.category, 'amount': ingredientData.amount, 'name': ingredientData.name};
    });
    console.log(formData);

    const inputObjects = [];
    const concoctionErrors = Concoction.validateData(formData.concoction);
    const concoctionInputNames = ['concoctionName', 'instructions'];

    for (const inputName of concoctionInputNames) {
        const inputGroup = concoctionForm.querySelector(`#${inputName}Group`);
        const inputField = concoctionForm.querySelector(`#${inputName}`);
        inputObjects.push({ inputType: 'concoction', inputName, inputGroup, inputField });
    }

    const coffeeErrors = Coffee.validateData(formData.coffee);
    const coffeeInputNames = ['Amount', 'Brand', 'Blend'];

    for (const inputName of coffeeInputNames) {
        const inputGroup = concoctionForm.querySelector(`#coffee${inputName}ListItem`);
        const inputField = concoctionForm.querySelector(`#coffee${inputName}`);
        inputObjects.push({ inputType: 'coffee', inputName: lowerCaseWord(inputName), inputGroup, inputField });
    }

    const ingredientErrors = Ingredient.validateIngredients(formData.ingredients);
    const ingredientListItems = document.querySelectorAll('.ingredient-list li');
    
    if (allEmpty(concoctionErrors, coffeeErrors, ingredientErrors)) {
        for (const inputObject of inputObjects) {
            removeRequiredFieldError(inputObject.inputGroup, inputObject.inputField);
        }

        for (const ingredientListItem of ingredientListItems) {
            if (hasErrorHeading(ingredientListItem)) {
                const errorHeading = ingredientListItem.lastChild;
                const listItemId = ingredientListItem.id;
                const amountInput = document.getElementById(`${listItemId}Amount`);
                const nameInput = document.getElementById(`${listItemId}Name`);

                addOrRemoveIngrErrorClasses('remove', errorHeading.textContent, amountInput, nameInput);
                ingredientListItem.removeChild(errorHeading);
            }
        }

        if (hasErrorHeading(concoctionForm)) concoctionForm.removeChild(concoctionForm.lastChild);
        console.log('Concoction created!');
    } else {
        for (const inputObject of inputObjects) {
            const inputErrors = inputObject.inputType === 'concoction'
                ? concoctionErrors[inputObject.inputName]
                : coffeeErrors[inputObject.inputName];
            
            handleRequiredFieldError(inputErrors, inputObject.inputGroup, inputObject.inputField);
        }

        for (const ingredientListItem of ingredientListItems) {
            const listItemId = ingredientListItem.id;
            const errorMessage = ingredientErrors[listItemId];
            const amountInput = document.getElementById(`${listItemId}Amount`);
            const nameInput = document.getElementById(`${listItemId}Name`);

            if (hasErrorHeading(ingredientListItem)) {
                const errorHeading = ingredientListItem.lastChild;
                const errorHeadingText = errorHeading.textContent;

                if (errorMessage) {
                    if (errorMessage != errorHeadingText) {
                        addOrRemoveIngrErrorClass(amountInput, 'Amount', errorMessage, errorHeadingText);
                        addOrRemoveIngrErrorClass(nameInput, 'name', errorMessage, errorHeadingText);
                        errorHeading.textContent = errorMessage;
                    }
                } else {
                    addOrRemoveIngrErrorClasses('remove', errorHeadingText, amountInput, nameInput);
                    ingredientListItem.removeChild(errorHeading);
                }
            } else if (errorMessage) {
                addOrRemoveIngrErrorClasses('add', errorMessage, amountInput, nameInput);
                appendErrorHeading(ingredientListItem, errorMessage, 'h4', 'ingredient-error error-text');
            }
        }

        if (!hasErrorHeading(concoctionForm)) appendErrorHeading(concoctionForm, 'There are errors in the form. Please correct them and try again.');
    }
}

const hasErrorHeading = (element) => element.lastChild.classList.contains('error-text');
const addInputErrorClass = (input) => input.classList.add('input-validation-error');
const removeInputErrorClass = (input) => input.classList.remove('input-validation-error');

function removeRequiredFieldError(inputGroup, inputField) {
    if (hasErrorHeading(inputGroup)) {
        inputGroup.removeChild(inputGroup.lastChild);
        removeInputErrorClass(inputField);
    }
}

function handleRequiredFieldError(errorMessage, inputGroup, inputField) {
    if (errorMessage) {
        if (!hasErrorHeading(inputGroup)) {
            appendErrorHeading(inputGroup, errorMessage, 'h4', 'error-text input-error-heading');
            addInputErrorClass(inputField);
        }
    } else {
        removeRequiredFieldError(inputGroup, inputField);
    }
}

function addOrRemoveIngrErrorClass(ingredientInput, inputName, errorMessage, errorHeadingText) {
    if (errorMessage.includes(inputName) && !errorHeadingText.includes(inputName)) {
        addInputErrorClass(ingredientInput);
    } else if (!errorMessage.includes(inputName) && errorHeadingText.includes(inputName)) {
        removeInputErrorClass(ingredientInput);
    }
}

function addOrRemoveIngrErrorClasses(addOrRemove, errorMessage, amountInput, nameInput) {
    if (addOrRemove === 'add') {
        if (errorMessage.includes('Amount')) addInputErrorClass(amountInput);
        if (errorMessage.includes('name')) addInputErrorClass(nameInput);
    } else if (addOrRemove === 'remove') {
        if (errorMessage.includes('Amount')) removeInputErrorClass(amountInput);
        if (errorMessage.includes('name')) removeInputErrorClass(nameInput);
    } else {
        throw new Error("You can only 'add' or 'remove' an error class.");
    }
}

function createLabel(labelFor, labelText, isRequired) {
    const label = createCustomElement('label', {
        attributes: { for: labelFor },
        text: `${labelText}:`
    });

    if (isRequired) label.className = 'required-field';
    return label;
}

function createLabelAndTextInput(inputId, labelText, placeholder, maxLength, isRequired, inputName = inputId) {
    const label = createLabel(inputId, labelText, isRequired);

    const textInput = createCustomElement('input', {
        id: inputId,
        attributes: { type: 'text', name: inputName, maxLength, placeholder, autocomplete: 'on' }
    });
    if (isRequired) textInput.required = true;

    return [label, textInput];
}

function createTextAreaGroup(textAreaName, placeholder, required, groupId) {
    const nameCapitalized = capitalizeWord(textAreaName);

    const label = createLabel(textAreaName, nameCapitalized, required);
    if (textAreaName === 'notes') label.id = 'notes-label';
    
    const textArea = createCustomElement('textarea', {
        id: textAreaName,
        attributes: { name: textAreaName, placeholder, autocomplete: 'on'}
    });
    if (required) textArea.required = true;

    const textAreaGroup = createCustomElement('p', {
        classes: 'indented-input center-vertical',
        itemsToAppend: [label, textArea]
    });
    if (groupId) textAreaGroup.id = groupId;

    return textAreaGroup;
}

function generateIngredientInputs(category) {
    const ingredientsHeading = createCustomElement('h4', { text: `${category}s:`, classes: 'indented-input' });
    const ingredientsList = createCustomElement('ol', { classes: 'ingredient-list' });
    const categoryLowerCase = (category === 'Additional Ingredient') ? 'ingredient' : lowerCaseWord(category);
    let minIngredientCount;

    if (category === 'Liquid') {
        minIngredientCount = 1;
        addIngredient(categoryLowerCase, ingredientsList, minIngredientCount);
    } else {
        minIngredientCount = 0;
        ingredientsList.style.display = 'none';
    }
    
    const addIngredientButton = createCustomElement('button', { text: `Add ${category}`, classes: 'add-ingredient' });
    addIngredientButton.addEventListener('click', e => addIngredient(categoryLowerCase, ingredientsList, minIngredientCount, e));
    
    const removeIngredientButton = createCustomElement('button', { id: `remove-${categoryLowerCase}-btn`, text: `Remove ${category}`, classes: 'remove-ingredient' });
    removeIngredientButton.style.display = 'none';
    removeIngredientButton.addEventListener('click',
        e => removeIngredient(e, categoryLowerCase, ingredientsList, minIngredientCount)
    );

    const ingredientButtons = createCustomElement('p', {
        classes: 'center-content',
        itemsToAppend: [addIngredientButton, removeIngredientButton]
    });

    let ingredientInputs = [ingredientsHeading, ingredientsList, ingredientButtons];
    if (category !== 'Additional Ingredient') ingredientInputs.push(createCustomElement('hr', { classes: 'ingredients-divider' }));
    return ingredientInputs;
}

function addIngredient(category, ingredientsList, minimumIngredientCount, e) {
    if (e) e.preventDefault();

    let amountPlaceholder, namePlaceholder;
    switch (category) {
        case 'liquid':
            amountPlaceholder = 'Enter amount (e.g. 2 cups)';
            namePlaceholder = 'Enter name (e.g. hot water)';
            break;
        case 'sweetener':
            amountPlaceholder = 'Enter amount (e.g. 1 tsp)';
            namePlaceholder = 'Enter name (e.g. sugar)';
            break;
        case 'creamer':
            amountPlaceholder = 'Enter amount (e.g. 1 1/2 tsp)';
            namePlaceholder = 'Enter a brand and/or flavor';
            break;
        default:
            amountPlaceholder = 'Enter amount (e.g. a pinch)';
            namePlaceholder = 'Enter name (e.g. cinnamon)';
            break;
    }
    
    const categoryCapitalized = (category === 'ingredient') ? 'Additional Ingredient' : capitalizeWord(category);
    
    const categoryInput = createCustomElement('input', {
        attributes: { type: 'hidden', name: 'category', value: categoryCapitalized }
    });

    const ingredientCount = ingredientsList.childElementCount + 1;
    const amountInput = createLabelAndTextInput(`${category}${ingredientCount}Amount`, 'Amount', amountPlaceholder, 50, true, 'amount');
    const nameInput = createLabelAndTextInput(`${category}${ingredientCount}Name`, 'Name', namePlaceholder, 50, true, 'name');
    
    if (ingredientCount === minimumIngredientCount + 1){
        document.getElementById(`remove-${category}-btn`).style.display = 'initial';
        if (category !== 'liquid') ingredientsList.style.display = 'block';
    }

    const ingredientInputGroup = document.createElement('p');
    ingredientInputGroup.appendChild(createCustomElement('li', {
        id: `${category}${ingredientCount}`,
        itemsToAppend: [categoryInput, ...amountInput, ...nameInput]
    }));

    ingredientsList.appendChild(ingredientInputGroup);
}

function removeIngredient(e, ingredientCategory, ingredientsList, minIngredientCount) {
    e.preventDefault();

    let ingredientCount = ingredientsList.childElementCount;

    if (ingredientCount === minIngredientCount) { // Edge case
        const minIngredientMessage = (ingredientCategory === 'liquid')
            ? 'Cannot remove this liquid. A concoction needs to have at least one liquid.'
            : `There are no ${ingredientCategory}s to remove.`;
        
            appendErrorHeading(ingredientsList, minIngredientMessage);
        return;
    }

    ingredientsList.removeChild(ingredientsList.lastChild);
    ingredientCount--;

    if (ingredientCount === minIngredientCount) {
        document.getElementById(`remove-${ingredientCategory}-btn`).style.display = 'none';
        if (ingredientCategory !== 'liquid') ingredientsList.style.display = 'none';
    }
}

function createCoffeeInputGroup(inputName, placeholder, maxLength, isRequired, labelText = inputName) {
    const coffeeLabelAndInput = createLabelAndTextInput(`coffee${inputName}`, labelText, placeholder, maxLength, isRequired);
    const coffeeInputGroup = document.createElement('p');
    const coffeeItem = createCustomElement('li', { itemsToAppend: coffeeLabelAndInput });
    if (isRequired) coffeeItem.id = `coffee${inputName}ListItem`;

    coffeeInputGroup.appendChild(coffeeItem);
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