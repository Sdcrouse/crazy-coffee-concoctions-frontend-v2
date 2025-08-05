export default class User {
    #username;
    #password;
    #errors = { usernameErrors: [] };

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
    }

    validateUsername() {
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

        return usernameErrors;
    }
}