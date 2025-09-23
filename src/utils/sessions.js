import { generateLoginPage, toggleButtonDisplay } from '../components/authentication.js';

async function refreshSession() {
    const response = await fetch('http://localhost:5000/users/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    const newSession = await response.json();

    if (newSession.status != 200) {
        toggleButtonDisplay({ userIsLoggedIn: false });
        generateLoginPage({ errorMessage: newSession.errorMessage });
        return null;
    }

    return true;
}

async function handleDataOrRefreshSession(dataHandler, handlerArgument) {
    let response = await dataHandler(handlerArgument);

    if ((response.status === 400 && !response.errors) || response.status === 401) {
        const refreshedSession = await refreshSession();
        if (refreshedSession === null) return null;
        response = await dataHandler(handlerArgument);
    }

    return response;
}

export default handleDataOrRefreshSession;