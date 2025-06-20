const mainContainer = document.getElementById('main-container');

export function generateSignupPage() {
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
    usernameInput.required = true;

    const usernamePar = document.createElement('p');
    usernamePar.append(usernameLabel, usernameInput);

    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.textContent = 'Password: ';

    const passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('id', 'password');
    passwordInput.setAttribute('name', 'password');
    passwordInput.setAttribute('placeholder', 'Enter password');
    passwordInput.setAttribute('autocomplete', 'new-password');
    passwordInput.required = true;

    const passwordPar = document.createElement('p');
    passwordPar.append(passwordLabel, passwordInput);

    const signupButton = document.createElement('button');
    signupButton.setAttribute('type', 'submit');
    signupButton.textContent = 'Sign Up';

    const signupBtnPar = document.createElement('p');
    signupBtnPar.appendChild(signupButton);

    const signupForm = document.createElement('form');
    signupForm.append(usernamePar, passwordPar, signupBtnPar);

    const signupDiv = document.createElement('div');
    signupDiv.append(signupHeading, signupForm);

    mainContainer.replaceChildren(signupDiv);
};