import createCustomElement from '../utils/createCustomElement.js';
import generatePageTitle from '../utils/pageTitle.js';
import generateForm from '../utils/generateForm.js';
import isEmpty from '../utils/isEmpty.js';
import User from '../entities/User.js';
import { appendErrorHeading, appendSuccessHeading, appendPageHeading } from '../utils/headings.js';
import { generateServerErrorPage } from '../utils/errorPages.js';
import { generateConcoctionsPage } from './concoctions.js';

const mainContainer = document.getElementById('main-container');
const apiBase = 'http://localhost:5000';

function generateLoginPage(messages = {}) {
    generatePageTitle('Log In');

    const loginDiv = createCustomElement('div', { id: 'login-div' });
    const { successMessage, errorMessage } = messages;

    if (successMessage) {
        appendSuccessHeading(loginDiv, successMessage);
    } else if (errorMessage) {
        appendErrorHeading(loginDiv, errorMessage, 'h3');
    }

    appendPageHeading(loginDiv, 'Log in to your account here!');

    const usernameInputGroup = createUserInputGroup('username', 'login', { minLength: 2 });
    const passwordInputGroup = createUserInputGroup('password', 'login', { minLength: 2 });

    const loginForm = generateForm('Log In', usernameInputGroup, passwordInputGroup);
    loginForm.addEventListener('submit', e => login(e, loginForm));
    loginDiv.appendChild(loginForm);

    mainContainer.replaceChildren(loginDiv);
}

async function login(event, loginForm) {
    event.preventDefault();
    
    const loginFormInputs = new FormData(loginForm);
    const { username, password } = Object.fromEntries(loginFormInputs);

    if (isEmpty(username) || isEmpty(password)) {
        removeErrorLists(loginForm, 'username', 'password');
        if (isEmpty(username)) displayUserError(loginForm, 'username', 'Username is required');
        if (isEmpty(password)) displayUserError(loginForm, 'password', 'Password is required');
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
        if (data.status !== 200 && data.status !== 500) removeErrorLists(loginForm, 'username', 'password');
        
        switch (data.status) {
            case 200:
                toggleButtonDisplay();
                await generateConcoctionsPage(data.successMessage);
                break;
            case 400:
                // Currently, this expects at most one username error and/or one password error
                // If multiple errors are later returned for usernames and passwords, this should be updated

                if (data.errors.username) displayUserError(loginForm, 'username', data.errors.username);
                if (data.errors.password) displayUserError(loginForm, 'password', data.errors.password);
                break;
            case 401:
                // Currently, this only expects one password error; this can be updated later if other errors are returned.
                displayUserError(loginForm, 'password', data.errors.password);
                break;
            case 404:
                // Currently, this only expects a "User not found" error; this can be updated with other error messages later.
                displayUserError(loginForm, 'username', data.errors.username);
                break;
            case 500:
                console.error(data); // TODO: I may be able to remove this error log
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                appendErrorHeading('login-div', 'An unknown error has occurred. Please try again later.');
                break;
        }
    } catch (error) {
        console.error(error.message);
        removeErrorLists(loginForm, 'username', 'password');
        appendErrorHeading('login-div', 'There was an error while submitting the login form. Please try again.');
    }
}

function generateSignupPage() {
    generatePageTitle('Sign Up');

    const signupDiv = createCustomElement('div', { id: 'signup-div' });
    appendPageHeading(signupDiv, 'Sign up here!');
    
    const usernameFields = createUserInputGroup('username', 'register');
    const passwordFields = createUserInputGroup('password', 'register');

    const signupForm = generateForm('Sign Up', usernameFields, passwordFields);
    signupForm.addEventListener('submit', e => signup(e, signupForm));
    signupDiv.appendChild(signupForm);

    mainContainer.replaceChildren(signupDiv);
};

// TODO: Remove old error headings at the bottom of the login function
async function signup(event, signupForm) {
    event.preventDefault();

    const signupFormInputs = new FormData(signupForm);
    const { username, password } = Object.fromEntries(signupFormInputs);
    const user = new User(username, password);
    
    if (!user.validateCredentials()) {
        removeErrorLists(signupForm, 'username', 'password');
        if (!isEmpty(user.usernameErrors)) displayUserErrors(signupForm, 'username', user.usernameErrors);
        if (!isEmpty(user.passwordErrors)) displayUserErrors(signupForm, 'password', user.passwordErrors);
        return;
    }

    try {
        const response = await fetch(`${apiBase}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (data.status !== 201 && data.status !== 500) removeErrorLists(signupForm, 'username', 'password');
        
        switch (data.status) {
            case 201:
                generateLoginPage({ successMessage: data.successMessage });
                break;
            case 400:
                const { username: usernameErrors, password: passwordErrors } = data.errors;

                if (!isEmpty(usernameErrors)) displayUserErrors(signupForm, 'username', usernameErrors);
                if (!isEmpty(passwordErrors)) displayUserErrors(signupForm, 'password', passwordErrors);
                break;
            case 409:
                // If there are other error messages with an HTTP 409 status, update this and the backend
                // For now, the only expected HTTP 409 error is a user who already exists
                
                displayUserError(signupForm, 'username', data.errorMessage);
                break;
            case 500:
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                appendErrorHeading('signup-div', 'An unknown error has occurred. Please try again later.');
                break;
        }
    } catch (error) {
        console.error(error.message);
        removeErrorLists(signupForm, 'username', 'password');
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
                generateLoginPage({ successMessage: data.logoutSuccessMessage });
                break;
            case 400:
            case 401:
                console.error(data);
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ errorMessage: data.errorMessage });
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

function createUserInputGroup(userInputName, formAction, options = { minLength: 8 }) {
    const capitalizedInputName = userInputName.charAt(0).toUpperCase() + userInputName.slice(1);
    
    const label = createCustomElement('label', {
        attributes: { for: userInputName },
        text: `${capitalizedInputName}: `
    });

    const input = createCustomElement('input', { 
        id: userInputName,
        attributes: {
            type: userInputName === 'password' ? 'password' : 'text',
            name: userInputName,
            placeholder: `Enter ${userInputName}`,
            minLength: options.minLength
        }
    });

    if (formAction === 'register') {
        input.setAttribute('autocomplete', `new-${userInputName}`);
    } else if (formAction === 'login') {
        if (userInputName === 'password') {
            input.setAttribute('autocomplete', 'current-password');
        } else {
            input.setAttribute('autocomplete', userInputName);
        }
    }

    input.required = true;
    
    const inputGroup = createCustomElement('p', {
        classes: 'center-content',
        itemsToAppend: [label, input]
    });
    return inputGroup;
}

function generateErrorList(errors, inputName) {
    const errorList = createCustomElement('ul', { classes: 'error-message-list' });
    if (inputName) errorList.id = `${inputName}-error-list`;

    for (const error of errors) {
        const errorItem = createCustomElement('li', { text: error });
        errorList.append(errorItem);
    };

    return errorList;
}

function removeErrorLists(form, ...inputNames) {
    for (const inputName of inputNames) {
        const inputLabel = form.querySelector(`label[for="${inputName}"]`);
        const inputField = form.querySelector(`#${inputName}`);
        const errorList = form.querySelector(`#${inputName}-error-list`);
    
        if (inputName === 'password') inputField.value = '';
        
        if (errorList) {
            form.removeChild(errorList);
            inputLabel.classList.remove('error-text');
            inputField.classList.remove('input-validation-error');
        }
    }
}
// TODO: Combine the following two functions
function displayUserErrors(form, inputName, userErrors) {
    const inputLabel = form.querySelector(`label[for="${inputName}"]`);
    inputLabel.className = 'error-text';

    const inputField = form.querySelector(`#${inputName}`);
    inputField.className = 'input-validation-error';

    const errorList = generateErrorList(userErrors, inputName);
    inputField.parentNode.after(errorList);
}

function displayUserError(form, inputName, userError) {
    const inputLabel = form.querySelector(`label[for="${inputName}"]`);
    inputLabel.className = 'error-text';

    const inputField = form.querySelector(`#${inputName}`);
    inputField.className = 'input-validation-error';

    const errorList = generateErrorList([userError], inputName);
    inputField.parentNode.after(errorList);
}

function toggleButtonDisplay({ userIsLoggedIn = true } = {}) {
    const signupButton = document.getElementById('signup');
    const loginButton = document.getElementById('login');
    const newConcoctionButton = document.getElementById('new-concoction');
    const concoctionsButton = document.getElementById('display-concoctions');
    const logoutButton = document.getElementById('logout');

    if (userIsLoggedIn) {
        signupButton.style.display = 'none';
        loginButton.style.display = 'none';
        newConcoctionButton.style.display = 'initial';
        concoctionsButton.style.display = 'initial';
        logoutButton.style.display = 'initial';
    } else {
        signupButton.style.display = 'initial';
        loginButton.style.display = 'initial';
        newConcoctionButton.style.display = 'none';
        concoctionsButton.style.display = 'none';
        logoutButton.style.display = 'none';
    }
}

export { generateSignupPage, generateLoginPage, logout, toggleButtonDisplay };