import createCustomElement from '../utils/createCustomElement.js';

const mainContainer = document.getElementById('main-container');
const titleElement = document.querySelector('title');
const baseTitle = 'Crazy Coffee Concoctions';

export function generateSignupPage({ username = '', password = '', errors = {} } = {}) {
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

    const signupDiv = createCustomElement('div', { itemsToAppend: [signupHeading, signupForm] });
    mainContainer.replaceChildren(signupDiv);
};

function createInputGroup(inputName, inputValue, errors, isRequired = true, minLength = 8) {
    const capitalizedInputName = inputName.charAt(0).toUpperCase() + inputName.slice(1);
    
    const label = createCustomElement('label', {
        attributes: { for: inputName },
        text: `${capitalizedInputName}: `
    });

    const input = createCustomElement('input', { attributes: {
        type: inputName === 'username' ? 'text' : 'password',
        id: inputName,
        name: inputName,
        placeholder: `Enter ${inputName}`,
        autocomplete: `new-${inputName}`,
        minLength
    }});

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
        generateSignupPage({ username, password, errors: { usernameErrors, passwordErrors } });
    }
}