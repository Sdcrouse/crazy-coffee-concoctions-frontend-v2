export function generateSignupPage() {
    const mainContainer = document.getElementById('main-container');

    mainContainer.innerHTML = `
        <div>
            <h2>Sign up here!</h2>
            <form>
                <p>
                    <label for="username">Username: </label>
                    <input type="text" id="username" name="username" required />
                </p>
                <p>
                    <label for="password">Password: </label>
                    <input type="password" name="password" required />
                </p>
                <p>
                    <button type="submit">Sign Up</button>
                </p>
            </form>
        </div>
    `;
};
