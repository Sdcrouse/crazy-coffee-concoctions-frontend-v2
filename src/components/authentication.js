const mainContainer = document.getElementById('main-container');
const titleElement = document.querySelector('title');
const baseTitle = 'Crazy Coffee Concoctions';

export function generateSignupPage(errors = {}, username = '', password = '') {
    titleElement.textContent = `${baseTitle} - Sign Up`;

    const signupHeading = document.createElement('h2');
    signupHeading.textContent = 'Sign up here!';
    signupHeading.classList.add('center-content', 'coffee-text');

    const usernameLabel = document.createElement('label');
    usernameLabel.setAttribute('for', 'username');
    usernameLabel.textContent = 'Username: ';

    const usernameInput = document.createElement('input');
    usernameInput.setAttribute('type', 'text');
    usernameInput.setAttribute('id', 'username');
    usernameInput.setAttribute('name', 'username');
    usernameInput.setAttribute('placeholder', 'Enter username');
    usernameInput.setAttribute('autocomplete', 'new-username');
    usernameInput.setAttribute('value', username);
    usernameInput.required = true;

    const usernameErrorList = generateErrorList(errors.usernameErrors);

    const usernamePar = document.createElement('p');
    usernamePar.append(usernameLabel, usernameInput, usernameErrorList);

    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.textContent = 'Password: ';

    const passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('id', 'password');
    passwordInput.setAttribute('name', 'password');
    passwordInput.setAttribute('placeholder', 'Enter password');
    passwordInput.setAttribute('autocomplete', 'new-password');
    passwordInput.setAttribute('value', password);
    passwordInput.required = true;

    const passwordErrorList = generateErrorList(errors.passwordErrors);

    const passwordPar = document.createElement('p');
    passwordPar.append(passwordLabel, passwordInput, passwordErrorList);

    const signupButton = document.createElement('button');
    signupButton.setAttribute('type', 'submit');
    signupButton.textContent = 'Sign Up';

    const signupBtnPar = document.createElement('p');
    signupBtnPar.appendChild(signupButton);

    const signupForm = document.createElement('form');
    signupForm.append(usernamePar, passwordPar, signupBtnPar);
    signupForm.addEventListener('submit', e => signup(e, signupForm));

    const signupDiv = document.createElement('div');
    signupDiv.append(signupHeading, signupForm);

    mainContainer.replaceChildren(signupDiv);
};

function generateErrorList(errors) {
    const errorList = document.createElement('ul');

    if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach(error => {
            const errorItem = document.createElement('li');
            errorItem.textContent = error;
            errorList.append(errorItem);
        });
    } else {
        errorList.style.display = 'none';
    }

    return errorList;
}

function signup(event, signupForm) {
    event.preventDefault();

    const signupFormInputs = new FormData(signupForm);
    const { username, password } = Object.fromEntries(signupFormInputs);
    let usernameErrors = [], passwordErrors = [];

    if (username) {
        if (username.length < 8) { usernameErrors.push('Username must be at least eight characters long'); }
    } else {
        usernameErrors.push('Username is required');
    }

    if (password) {
        if (password.length < 8) { passwordErrors.push('Password must be at least eight characters long'); }
    } else {
        passwordErrors.push('Password is required');
    }

    if (usernameErrors.length === 0 && passwordErrors.length === 0) {
        console.log('Signup successful!');
    } else {
        generateSignupPage({ usernameErrors, passwordErrors }, username, password);
    }
}