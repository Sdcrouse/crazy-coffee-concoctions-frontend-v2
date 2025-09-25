import createCustomElement from '../utils/createCustomElement.js';
import generatePageTitle from '../utils/pageTitle.js';
import generateForm from '../utils/generateForm.js';
import isEmpty from '../utils/isEmpty.js';
import createLabel from '../utils/labels.js';
import handleDataOrRefreshSession from '../utils/sessions.js';
import User from '../entities/User.js';
import { appendErrorHeading, appendSuccessHeading, appendPageHeading, prependErrorHeading, displayDeletionError } from '../utils/headings.js';
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
        if (isEmpty(username)) generateErrorList(loginForm, 'username', 'Username is required');
        if (isEmpty(password)) generateErrorList(loginForm, 'password', 'Password is required');
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
                if (data.errors.username) generateErrorList(loginForm, 'username', data.errors.username);
                if (data.errors.password) generateErrorList(loginForm, 'password', data.errors.password);
                break;
            case 401:
                generateErrorList(loginForm, 'password', data.errors.password);
                break;
            case 404:
                generateErrorList(loginForm, 'username', data.errors.username);
                break;
            case 500:
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

async function signup(event, signupForm) {
    event.preventDefault();

    const signupFormInputs = new FormData(signupForm);
    const { username, password } = Object.fromEntries(signupFormInputs);
    const user = new User(username, password);
    
    if (!user.validateCredentials()) {
        removeErrorLists(signupForm, 'username', 'password');
        if (!isEmpty(user.usernameErrors)) generateErrorList(signupForm, 'username', ...user.usernameErrors);
        if (!isEmpty(user.passwordErrors)) generateErrorList(signupForm, 'password', ...user.passwordErrors);
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

                if (!isEmpty(usernameErrors)) generateErrorList(signupForm, 'username', ...usernameErrors);
                if (!isEmpty(passwordErrors)) generateErrorList(signupForm, 'password', ...passwordErrors);
                break;
            case 409:                
                generateErrorList(signupForm, 'username', data.errorMessage);
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
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ errorMessage: data.errorMessage });
                break;
            case 500:
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                prependErrorHeading('main-container', 'An unknown error has occurred. Please try again later.');
                break;
        }
    } catch (error) {
        console.error(error.message);
        prependErrorHeading('main-container', 'There was an error while logging you out. Please try again.');
    }
}

function createUserInputGroup(userInputName, formAction, options = { minLength: 8 }) {
    const capitalizedInputName = userInputName.charAt(0).toUpperCase() + userInputName.slice(1);
    const label = createLabel(userInputName, capitalizedInputName, false);

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

function generateErrorList(form, inputName, ...errors) {
    const inputLabel = form.querySelector(`label[for="${inputName}"]`);
    inputLabel.className = 'error-text';

    const inputField = form.querySelector(`#${inputName}`);
    inputField.className = 'input-validation-error';

    const errorList = createCustomElement('ul', { id: `${inputName}-error-list`, classes: 'error-message-list' });

    for (const error of errors) {
        const errorItem = createCustomElement('li', { text: error });
        errorList.append(errorItem);
    };

    inputField.parentNode.after(errorList);
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

function toggleButtonDisplay({ userIsLoggedIn = true } = {}) {
    const signupButton = document.getElementById('signup');
    const loginButton = document.getElementById('login');
    const newConcoctionButton = document.getElementById('new-concoction');
    const concoctionsButton = document.getElementById('display-concoctions');
    const logoutButton = document.getElementById('logout');
    const deleteProfileButton = document.getElementById('delete-profile');

    if (userIsLoggedIn) {
        signupButton.style.display = 'none';
        loginButton.style.display = 'none';
        newConcoctionButton.style.display = 'initial';
        concoctionsButton.style.display = 'initial';
        logoutButton.style.display = 'initial';
        deleteProfileButton.style.display = 'initial';
    } else {
        signupButton.style.display = 'initial';
        loginButton.style.display = 'initial';
        newConcoctionButton.style.display = 'none';
        concoctionsButton.style.display = 'none';
        logoutButton.style.display = 'none';
        deleteProfileButton.style.display = 'none';
    }
}

function confirmProfileDeletion() {
    generatePageTitle('Delete Profile');

    const deleteProfileDiv = createCustomElement('div', { id: 'delete-profile-div' });
    appendPageHeading(deleteProfileDiv, 'Delete Profile');

    const confirmDeletionMessage = createCustomElement('h3', {
        id: 'delete-profile-message',
        text: 'Are you sure you want to delete your profile? This action cannot be undone.',
        classes: 'center-content'
    });

    const confirmDeletionButton = createCustomElement('button', { id: 'confirm-delete-profile-btn', text: 'Confirm' });
    confirmDeletionButton.addEventListener('click', async () => await deleteProfile());
    
    const cancelDeletionButton = createCustomElement('button', { id: 'cancel-delete-profile-btn', text: 'Cancel' });
    cancelDeletionButton.addEventListener('click', async () => await generateConcoctionsPage());
    
    const profileDeletionButtons = createCustomElement(
        'div', { classes: 'center-content', itemsToAppend: [confirmDeletionButton, cancelDeletionButton] }
    );

    deleteProfileDiv.append(confirmDeletionMessage, profileDeletionButtons);
    mainContainer.replaceChildren(deleteProfileDiv);
}

async function deleteProfile() {
    const deleteProfileDiv = document.getElementById('delete-profile-div');
    const errorHeading = deleteProfileDiv.querySelector('h4');

    try {
        const response = await handleDataOrRefreshSession(deleteUserData, `${apiBase}/users/delete-profile`);
        if (response === null) return;
        const data = (response.status === 204) ? null : await response.json();

        switch (response.status) {
            case 204:
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ successMessage: 'Profile deleted! Please login with a different profile or sign up to create a new one.' });
                break;
            case 404: // Edge case
                toggleButtonDisplay({ userIsLoggedIn: false });
                generateLoginPage({ errorMessage: data.errorMessage });
                break;
            case 500:
                generateServerErrorPage(data.errorMessage);
                break;
            default:
                console.error(data);
                displayDeletionError('An unknown error has occurred. Please try again later.', deleteProfileDiv, errorHeading);
                break;
        }
    } catch (error) {
        console.error(error.message);
        displayDeletionError('There was an unexpected error while deleting your profile. Please try again.', deleteProfileDiv, errorHeading);
    }
}

async function deleteUserData(userUrl) {
    return await fetch(userUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
}

export { generateSignupPage, generateLoginPage, logout, toggleButtonDisplay, confirmProfileDeletion };