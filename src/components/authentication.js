import createCustomElement from '../utils/createCustomElement.js';
import { generateServerErrorPage } from '../utils/errorPages.js';

const mainContainer = document.getElementById('main-container');
const titleElement = document.querySelector('title');
const baseTitle = 'Crazy Coffee Concoctions';

function generateSignupPage({ username = '', password = '', errors = {} } = {}) {
    titleElement.textContent = `${baseTitle} - Sign Up`;

    const signupHeading = createCustomElement('h2', {
        text: 'Sign up here!',
        classes: 'center-content coffee-text'
    });

    const usernameFields = createInputGroup('username', username, errors.usernameErrors);
    const passwordFields = createInputGroup('password', password, errors.passwordErrors);

    const signupButton = createCustomElement('button', {
        attributes: { type: 'submit' },
        text: 'Sign Up'
    });

    const signupBtnPar = createCustomElement('p', { itemsToAppend: [signupButton] });

    const signupForm = createCustomElement('form', {
        itemsToAppend: [usernameFields, passwordFields, signupBtnPar]
    });
    signupForm.addEventListener('submit', e => signup(e, signupForm));

    const signupDiv = createCustomElement('div', {
        id: 'signupDiv',
        itemsToAppend: [signupHeading, signupForm]
    });

    mainContainer.replaceChildren(signupDiv);
};

function createInputGroup(inputName, inputValue, errors, isRequired = true, minLength = 8) {
    const capitalizedInputName = inputName.charAt(0).toUpperCase() + inputName.slice(1);
    
    const label = createCustomElement('label', {
        attributes: { for: inputName },
        text: `${capitalizedInputName}: `
    });

    const input = createCustomElement('input', { 
        id: inputName,
        attributes: {
            type: inputName === 'username' ? 'text' : 'password',
            name: inputName,
            placeholder: `Enter ${inputName}`,
            autocomplete: `new-${inputName}`,
            minLength
        }
    });

    if (inputValue) { input.setAttribute('value', inputValue); }
    input.required = isRequired;

    const errorList = generateErrorList(errors);
    
    const inputGroup = createCustomElement('p', {
        itemsToAppend: [label, input, errorList]
    });

    return inputGroup;
}

function generateErrorList(errors) {
    const errorList = document.createElement('ul');

    if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach(error => {
            const errorItem = createCustomElement('li', { text: error });
            errorList.append(errorItem);
        });
    } else {
        errorList.style.display = 'none';
    }

    return errorList;
}

async function signup(event, signupForm) {    
    // TODO: Save the user to the backend database
    // TODO: Render the login page with a success message when the user signs up

    event.preventDefault();

    const signupFormInputs = new FormData(signupForm);
    const { username, password } = Object.fromEntries(signupFormInputs);
    let usernameErrors = [], passwordErrors = [];

    if (username) {
        let usernameRegex = /^[\w\.]+$/;
        if (!usernameRegex.test(username)) {
            usernameErrors.push('Username must only contain letters, numbers, periods, and underscores');
        }

        usernameRegex = /^[a-zA-Z].*[a-zA-Z\d]$/;
        if (!usernameRegex.test(username)) {
            usernameErrors.push('Username must start with a letter and end with a letter or number');
        }

        if (username.length < 8) { usernameErrors.push('Username must be at least eight characters long'); }
    } else {
        usernameErrors.push('Username is required');
    }

    if (password) {
        const containsOneOfEach = 
            /[a-zA-Z]+/.test(password) // letters
            && /\d+/.test(password) // numbers
            && /[!@#$%^&*_+=?<>,.]+/.test(password); // special characters

        if (!containsOneOfEach) {
            passwordErrors.push(`Password must contain one of each of the following types of characters: 
                lower and/or uppercase letters (a-z, A-Z), numbers (0-9), and special characters (!@#$%^&*_+=?<>,.)`);
        }

        if (password.length < 8) { passwordErrors.push('Password must be at least eight characters long'); }

        if (password.includes(username) || password.toLowerCase().includes('password')) {
            passwordErrors.push("Password must not contain the username or the word 'password' (either upper or lowercase)");
        }
    } else {
        passwordErrors.push('Password is required');
    }

    if (usernameErrors.length > 0 || passwordErrors.length > 0) {
        generateSignupPage({ username, password, errors: { usernameErrors, passwordErrors } });
        return;
    }

    const usersURL = 'http://localhost:5000/users';
    let errorMessage;

    try {
        const response = await fetch(usersURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        switch (data.status) {
            case 201:
                // TODO: Display this message on the login page after redirecting to it
                console.log(data.successMessage);
                break;
            case 400:
                console.error(data.errors);
                
                const {username: unameErrors, password: passErrors } = data.errors;
                if (unameErrors) { usernameErrors.push(...unameErrors); }
                if (passErrors) { passwordErrors.push(...passErrors); }

                generateSignupPage({ username, password, errors: { usernameErrors, passwordErrors } });
                break;
            case 409:
                appendErrorHeading(data.errorMessage);
                console.error(data);
                break;
            case 500:
                console.error(data);
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                errorMessage = 'An unknown error has occurred. Please try again later.';
                console.error(data);
                appendErrorHeading(errorMessage);
                break;
        }
    } catch (error) {
        console.error(error.message);
        appendErrorHeading('There was an error while submitting the signup form. Please try again.');
    }
}

function appendErrorHeading(errorMessage) {
    const errorHeading = createCustomElement('h4', { text: errorMessage });
    document.getElementById('signupDiv').appendChild(errorHeading);
}

export { generateSignupPage };