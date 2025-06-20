export function generateSignupPage(mainContainer) {
    mainContainer.innerHTML = `
        <div>
            <h2 class="center-content coffee-text">Sign up here!</h2>
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
