import createCustomElement from '../utils/createCustomElement.js';
import { generateServerErrorPage } from '../utils/errorPages.js';
import { generateConcoctionsPage } from './concoctions.js';

const mainContainer = document.getElementById('main-container');
const titleElement = document.querySelector('title');
const baseTitle = 'Crazy Coffee Concoctions';
const apiBase = 'http://localhost:5000';

function generateLoginPage(
    { signupSuccessMessage = '', invalidSessionMessage = '', logoutMessage = '', username = '', password = '', errors = {} } = {}
) {
    titleElement.textContent = `${baseTitle} - Log In`;

    const loginDiv = createCustomElement('div', { id: 'login-div' });

    // TODO: Move this into a separate function
    // It may be better to have two variables: successMessage and errorMessage instead of signupSuccessMessage, logoutMessage, etc.
    if (signupSuccessMessage) {
        const signupSuccessHeading = createCustomElement('h3', {
            text: signupSuccessMessage,
            classes: 'success-text center-content'
        });
        loginDiv.appendChild(signupSuccessHeading);
    } else if (invalidSessionMessage) {
        const invalidSessionHeading = createCustomElement('h3', {
            text: invalidSessionMessage,
            classes: 'error-text center-content'
        });
        loginDiv.appendChild(invalidSessionHeading);
    } else if (logoutMessage) {
        const logoutSuccessHeading = createCustomElement('h3', {
            text: logoutMessage,
            classes: 'center-content'
        });
        loginDiv.appendChild(logoutSuccessHeading);
    }

    const loginHeading = createCustomElement('h2', {
        text: 'Log in to your account here!',
        classes: 'center-content coffee-text'
    });

    const usernameInputGroup = createInputGroup('username', username, errors.usernameErrors, 'login', { minLength: 2 });
    const passwordInputGroup = createInputGroup('password', password, errors.passwordErrors, 'login', { minLength: 2 });

    const loginForm = generateForm('Log In', usernameInputGroup, passwordInputGroup);
    loginForm.addEventListener('submit', e => login(e, loginForm));

    loginDiv.append(loginHeading, loginForm);
    mainContainer.replaceChildren(loginDiv);
}

async function login(event, loginForm) {
    event.preventDefault();

    const loginFormInputs = new FormData(loginForm);
    const { username, password } = Object.fromEntries(loginFormInputs);
    let usernameErrors = [], passwordErrors = [];

    if (!username) usernameErrors.push('Username is required');
    if (!password) passwordErrors.push('Password is required');

    if (usernameErrors.length > 0 || passwordErrors.length > 0) {
        generateLoginPage({
            username, password, errors: { usernameErrors, passwordErrors }
        });
        return;
    }

    try {
        const response = await fetch(`${apiBase}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        switch (data.status) {
            case 200:
                document.getElementById('signup').style.display = 'none';
                document.getElementById('login').style.display = 'none';
                document.getElementById('display-concoctions').style.display = 'initial';
                document.getElementById('logout').style.display = 'initial';
                await generateConcoctionsPage(data.successMessage);
                break;
            case 400:
            case 401:
                // Currently, cases 400 and 401 are expecting at most one username error and/or one password error
                // If multiple errors are later returned for usernames and passwords, this should be updated
                console.error(data);

                const {username: unameError, password: passError } = data.errors;
                if (unameError) { usernameErrors.push(unameError); }
                if (passError) { passwordErrors.push(passError); }

                generateLoginPage({ username, password, errors: { usernameErrors, passwordErrors } });
                break;
            case 404:
                // Currently, this only expects a "User not found" error; this can be updated with other error messages later.
                console.error(data);
                usernameErrors.push(data.errors.username);
                generateLoginPage({
                    username, password, errors: { usernameErrors }
                });
                break;
            case 500:
                console.error(data);
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                appendErrorHeading('login-div', 'An unknown error has occurred. Please try again later.');
                break;
        }
    } catch (error) {
        console.error(error.message);
        appendErrorHeading('login-div', 'There was an error while submitting the login form. Please try again.');
    }
}

function generateSignupPage({ username = '', password = '', errors = {} } = {}) {
    titleElement.textContent = `${baseTitle} - Sign Up`;

    const signupHeading = createCustomElement('h2', {
        text: 'Sign up here!',
        classes: 'center-content coffee-text'
    });

    const usernameFields = createInputGroup('username', username, errors.usernameErrors, 'register');
    const passwordFields = createInputGroup('password', password, errors.passwordErrors, 'register');

    const signupForm = generateForm('Sign Up', usernameFields, passwordFields);
    signupForm.addEventListener('submit', e => signup(e, signupForm));

    const signupDiv = createCustomElement('div', {
        id: 'signup-div',
        itemsToAppend: [signupHeading, signupForm]
    });

    mainContainer.replaceChildren(signupDiv);
};

async function signup(event, signupForm) {
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
        generateSignupPage({
            username, password, errors: { usernameErrors, passwordErrors }
        });
        return;
    }

    try {
        const response = await fetch(`${apiBase}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        switch (data.status) {
            case 201:
                generateLoginPage({ signupSuccessMessage: data.successMessage });
                break;
            case 400:
                console.error(data);
                
                const {username: unameErrors, password: passErrors } = data.errors;
                if (unameErrors) { usernameErrors.push(...unameErrors); }
                if (passErrors) { passwordErrors.push(...passErrors); }

                generateSignupPage({ username, password, errors: { usernameErrors, passwordErrors } });
                break;
            case 409:
                // If there are other error messages with an HTTP 409 status, update this and the backend
                // For now, the only expected HTTP 409 error is a user who already exists
                console.error(data);
                usernameErrors.push(data.errorMessage);
                generateSignupPage({ username, password, errors: { usernameErrors }});
                break;
            case 500:
                console.error(data);
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                appendErrorHeading('signup-div', 'An unknown error has occurred. Please try again later.');
                break;
        }
    } catch (error) {
        console.error(error.message);
        appendErrorHeading('signup-div', 'There was an error while submitting the signup form. Please try again.');
    }
}

async function logout() {
    try {
        const response = await fetch(`${apiBase}/users/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
    
        const data = await response.json();

        switch (data.status) {
            case 200:
                document.getElementById('signup').style.display = 'initial';
                document.getElementById('login').style.display = 'initial';
                document.getElementById('display-concoctions').style.display = 'none';
                document.getElementById('logout').style.display = 'none';
                generateLoginPage({ logoutMessage: data.logoutSuccessMessage });
                break;
            case 400:
            case 401:
                console.error(data);
                generateLoginPage({ logoutMessage: data.errorMessage });
                break;
            case 500:
                console.error(data);
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                appendErrorHeading('main-container', 'An unknown error has occurred. Please try again later.');
                break;
        }
    } catch (error) {
        console.error(error.message);
        appendErrorHeading('main-container', 'There was an error while logging you out. Please try again.');
    }
}

function createInputGroup(inputName, inputValue, inputErrors, formAction, options = { minLength: 8 }) {
    const capitalizedInputName = inputName.charAt(0).toUpperCase() + inputName.slice(1);
    
    const label = createCustomElement('label', {
        attributes: { for: inputName },
        text: `${capitalizedInputName}: `
    });

    const input = createCustomElement('input', { 
        id: inputName,
        attributes: {
            type: inputName === 'password' ? 'password' : 'text',
            name: inputName,
            placeholder: `Enter ${inputName}`,
            minLength: options.minLength
        }
    });

    if (formAction === 'register') {
        input.setAttribute('autocomplete', `new-${inputName}`);
    } else if (formAction === 'login') {
        if (inputName === 'password') {
            input.setAttribute('autocomplete', 'current-password');
        } else {
            input.setAttribute('autocomplete', inputName);
        }
    }

    if (inputValue) input.setAttribute('value', inputValue);
    input.required = true;
    
    const inputGroup = createCustomElement('p', {
        classes: 'center-content',
        itemsToAppend: [label, input]
    });

    if (Array.isArray(inputErrors) && inputErrors.length > 0) {
        label.className = 'error-text';
        input.className = 'input-validation-error';

        const inputErrorList = generateErrorList(inputErrors);
        const inputFragment = new DocumentFragment();
        inputFragment.append(inputGroup, inputErrorList);

        return inputFragment;
    }

    return inputGroup;
}

function generateErrorList(errors) {
    const errorList = createCustomElement('ul', { classes: 'error-message-list' });

    errors.forEach(error => {
        const errorItem = createCustomElement('li', { text: error });
        errorList.append(errorItem);
    });

    return errorList;
}

function generateForm(submitButtonText, ...formElements) {
    const submitButton = createCustomElement('button', {
        attributes: { type: 'submit' },
        text: submitButtonText
    });

    const buttonPar = createCustomElement('p', {
        classes: 'center-content', itemsToAppend: [submitButton]
    });
    
    const form = createCustomElement('form', {
        itemsToAppend: [...formElements, buttonPar]
    });

    return form;
}

function appendErrorHeading(elementId, errorMessage) {
    const errorHeading = createCustomElement('h4', { text: errorMessage, classes: 'center-content error-text' });
    document.getElementById(elementId).appendChild(errorHeading);
}

export { generateSignupPage, generateLoginPage, logout };