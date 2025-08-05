export default class User {
    #username;
    #password;
    #errors = { usernameErrors: [], passwordErrors: [] };

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
    }

    get errors() {
        return this.#errors;
    }

    #validateUsername() {
        const username = this.#username;
        const usernameErrors = this.#errors.usernameErrors;

        if (username) {
            let usernameRegex = /^[\w\.]+$/;
            if (!usernameRegex.test(username)) {
                usernameErrors.push('Username must only contain letters, numbers, periods, and underscores');
            }

            usernameRegex = /^[a-zA-Z].*[a-zA-Z\d]$/;
            if (!usernameRegex.test(username)) {
                usernameErrors.push('Username must start with a letter and end with a letter or number');
            }

            if (username.length < 8) usernameErrors.push('Username must be at least eight characters long');
        } else {
            usernameErrors.push('Username is required');
        }
    }

    #validatePassword() {
        const password = this.#password;
        const passwordErrors = this.#errors.passwordErrors;

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

            if (password.includes(this.#username) || password.toLowerCase().includes('password')) {
                passwordErrors.push("Password must not contain the username or the word 'password' (either upper or lowercase)");
            }
        } else {
            passwordErrors.push('Password is required');
        }
    }

    validateCredentials() {
        this.#validateUsername();
        this.#validatePassword();
        return (this.#errors.usernameErrors.length === 0) && (this.#errors.passwordErrors.length === 0);
    }

    addUsernameErrors(errors) {
        this.#errors.usernameErrors.push(...errors);
    }

    addPasswordErrors(errors) {
        this.#errors.passwordErrors.push(...errors);
    }
}