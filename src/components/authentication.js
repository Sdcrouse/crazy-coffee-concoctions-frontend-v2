import createCustomElement from '../utils/createCustomElement.js';
import User from '../entities/User.js';
import { appendErrorHeading, appendSuccessHeading, appendPageHeading } from '../utils/headings.js';
import { generateServerErrorPage } from '../utils/errorPages.js';
import { generateConcoctionsPage } from './concoctions.js';

const mainContainer = document.getElementById('main-container');
const titleElement = document.querySelector('title');
const baseTitle = 'Crazy Coffee Concoctions';
const apiBase = 'http://localhost:5000';

function generateLoginPage({
    username = '', password = '', messages = {}, errors = {}
} = {}) {
    
    titleElement.textContent = `${baseTitle} - Log In`;

    const loginDiv = createCustomElement('div', { id: 'login-div' });
    const { successMessage, errorMessage } = messages;

    if (successMessage) {
        appendSuccessHeading(loginDiv, successMessage);
    } else if (errorMessage) {
        appendErrorHeading(loginDiv, errorMessage, 'h3');
    }

    appendPageHeading(loginDiv, 'Log in to your account here!');

    const usernameInputGroup = createInputGroup('username', username, errors.usernameErrors, 'login', { minLength: 2 });
    const passwordInputGroup = createInputGroup('password', password, errors.passwordErrors, 'login', { minLength: 2 });

    const loginForm = generateForm('Log In', usernameInputGroup, passwordInputGroup);
    loginForm.addEventListener('submit', e => login(e, loginForm));
    loginDiv.appendChild(loginForm);

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
                toggleButtonDisplay();
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

function generateSignupPage({
    username = '', password = '', errors = {}
} = {}) {
    
    titleElement.textContent = `${baseTitle} - Sign Up`;

    const signupDiv = createCustomElement('div', { id: 'signup-div' });
    appendPageHeading(signupDiv, 'Sign up here!');

    const usernameFields = createInputGroup('username', username, errors.usernameErrors, 'register');
    const passwordFields = createInputGroup('password', password, errors.passwordErrors, 'register');

    const signupForm = generateForm('Sign Up', usernameFields, passwordFields);
    signupForm.addEventListener('submit', e => signup(e, signupForm));
    signupDiv.appendChild(signupForm);

    mainContainer.replaceChildren(signupDiv);
};

async function signup(event, signupForm) {
    event.preventDefault();

    const signupFormInputs = new FormData(signupForm);
    const { username, password } = Object.fromEntries(signupFormInputs);
    
    const user = new User(username, password);
    
    if (!user.validateCredentials()) {
        generateSignupPage({ username, password, errors: user.errors });
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
                generateLoginPage({ messages: { successMessage: data.successMessage } });
                break;
            case 400:
                console.error(data);
                
                const {username: usernameErrors, password: passwordErrors } = data.errors;
                if (usernameErrors) user.addUsernameErrors(usernameErrors);
                if (passwordErrors) user.addPasswordErrors(passwordErrors);

                generateSignupPage({ username, password, errors: user.errors });
                break;
            case 409:
                // If there are other error messages with an HTTP 409 status, update this and the backend
                // For now, the only expected HTTP 409 error is a user who already exists
                console.error(data);
                user.addUsernameErrors([data.errorMessage]);
                generateSignupPage({ username, password, errors: { usernameErrors: user.errors.usernameErrors }});
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
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ messages: { successMessage: data.logoutSuccessMessage } });
                break;
            case 400:
            case 401:
                console.error(data);
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ messages: { errorMessage: data.errorMessage } });
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

function toggleButtonDisplay({ userIsLoggedIn = true } = {}) {
    const signupButton = document.getElementById('signup');
    const loginButton = document.getElementById('login');
    const concoctionsButton = document.getElementById('display-concoctions');
    const logoutButton = document.getElementById('logout');

    if (userIsLoggedIn) {
        signupButton.style.display = 'none';
        loginButton.style.display = 'none';
        concoctionsButton.style.display = 'initial';
        logoutButton.style.display = 'initial';
    } else {
        signupButton.style.display = 'initial';
        loginButton.style.display = 'initial';
        concoctionsButton.style.display = 'none';
        logoutButton.style.display = 'none';
    }
}

export { generateSignupPage, generateLoginPage, logout, toggleButtonDisplay };