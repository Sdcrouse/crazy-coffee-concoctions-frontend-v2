export default class User {
    #username;
    #password;
    #usernameErrors = [];
    #passwordErrors = [];

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
    }

    get username() {
        return this.#username;
    }

    get usernameErrors() {
        return this.#usernameErrors;
    }

    get passwordErrors() {
        return this.#passwordErrors;
    }

    #validateUsername() {
        const username = this.#username;

        if (username && username.trim().length > 0) {
            let usernameRegex = /^[\w\.]+$/;
            if (!usernameRegex.test(username)) {
                this.addUsernameError('Username must only contain letters, numbers, periods, and underscores');
            }

            usernameRegex = /^[a-zA-Z].*[a-zA-Z\d]$/;
            if (!usernameRegex.test(username)) {
                this.addUsernameError('Username must start with a letter and end with a letter or number');
            }

            if (username.length < 8) this.addUsernameError('Username must be at least eight characters long');
        } else {
            this.addUsernameError('Username is required');
        }
    }

    #validatePassword() {
        const password = this.#password;

        if (password && password.trim().length > 0) {
            const containsOneOfEach = 
                /(?=.*[a-z])(?=.*[A-Z])/.test(password) // at least one uppercase and lowercase letter
                && /\d+/.test(password) // numbers
                && /[!@#$%^&*_+=?<>,.]+/.test(password); // special characters

            if (!containsOneOfEach) {
                this.addPasswordError(`Password must contain one of each of the following types of characters: 
                    lower and/or uppercase letters (a-z, A-Z), numbers (0-9), and special characters (!@#$%^&*_+=?<>,.)`);
            }

            if (password.length < 8) { this.addPasswordError('Password must be at least eight characters long'); }

            if (
                (this.#username && password.includes(this.#username))
                || password.toLowerCase().includes('password')
            ) {
                this.addPasswordError("Password must not contain the username or the word 'password' (either upper or lowercase)");
            }
        } else {
            this.addPasswordError('Password is required');
        }
    }

    validateCredentials() {
        this.#validateUsername();
        this.#validatePassword();
        return (this.#usernameErrors.length === 0) && (this.#passwordErrors.length === 0);
    }

    addUsernameError(error) {
        this.#usernameErrors.push(error);
    }

    addUsernameErrors(errors) {
        this.#usernameErrors.push(...errors);
    }

    addPasswordError(error) {
        this.#passwordErrors.push(error);
    }

    addPasswordErrors(errors) {
        this.#passwordErrors.push(...errors);
    }
}