import createCustomElement from '../utils/createCustomElement.js';

const mainContainer = document.getElementById('main-container');
const titleElement = document.querySelector('title');
const baseTitle = 'Crazy Coffee Concoctions';

export function generateSignupPage(errors = {}, username = '', password = '') {
    titleElement.textContent = `${baseTitle} - Sign Up`;

    const signupHeading = createCustomElement('h2', {
        text: 'Sign up here!',
        classes: 'center-content coffee-text'
    });

    const usernameLabel = createCustomElement('label', {
        attributes: { for: 'username' },
        text: 'Username: '
    });

    const usernameInput = createCustomElement('input', { attributes: {
        type: 'text',
        id: 'username',
        name: 'username',
        placeholder: 'Enter username',
        autocomplete: 'new-username',
        minLength: 8
    }});
    
    if (username) { usernameInput.setAttribute('value', username); }
    usernameInput.required = true;

    const usernameErrorList = generateErrorList(errors.usernameErrors);
    const usernamePar = createCustomElement('p', {
        itemsToAppend: [usernameLabel, usernameInput, usernameErrorList]
    });

    const passwordLabel = createCustomElement('label', {
        attributes: { for: 'password' },
        text: 'Password: '
    });

    const passwordInput = createCustomElement('input', { attributes: {
        type: 'password',
        id: 'password',
        name: 'password',
        placeholder: 'Enter password',
        autocomplete: 'new-password',
        minLength: 8
    }});
    
    if (password) { passwordInput.setAttribute('value', password); }
    passwordInput.required = true;

    const passwordErrorList = generateErrorList(errors.passwordErrors);

    const passwordPar = createCustomElement('p', {
        itemsToAppend: [passwordLabel, passwordInput, passwordErrorList]
    });

    const signupButton = createCustomElement('button', {
        attributes: { type: 'submit' },
        text: 'Sign Up'
    });

    const signupBtnPar = createCustomElement('p', { itemsToAppend: [signupButton] });

    const signupForm = createCustomElement('form', {
        itemsToAppend: [usernamePar, passwordPar, signupBtnPar]
    });
    signupForm.addEventListener('submit', e => signup(e, signupForm));

    const signupDiv = createCustomElement('div', { itemsToAppend: [signupHeading, signupForm] });
    mainContainer.replaceChildren(signupDiv);
};

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

function signup(event, signupForm) {
    // TODO: Make sure the username doesn't already exist
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

    if (usernameErrors.length === 0 && passwordErrors.length === 0) {
        console.log('Signup successful!');
    } else {
        generateSignupPage({ usernameErrors, passwordErrors }, username, password);
    }
}