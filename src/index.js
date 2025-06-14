import generateHomePage from './components/home.js';

document.addEventListener("DOMContentLoaded", () => {
    generateHomePage();
    
    const coffeeTeapotBtn = document.getElementById('coffee-with-teapot-btn');
    coffeeTeapotBtn.addEventListener('click', () => displayErrorImage(418));
});

function displayErrorImage(httpStatus) {
    const mainContainer = document.getElementById('main-container');
    
    mainContainer.innerHTML = `
        <img id="im-a-teapot" src="img/${httpStatus}-im-a-teapot.png" alt="${httpStatus} I'm a teapot" />
        <h2>Sorry! The server is currently unable to brew coffee at the moment because it is now a teapot. You can't brew coffee with a teapot!</h2>
        <p>
            To change the teapot back into a server, please refresh the page.
            Or you can visit <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/418">this handy MDN article</a>
            to learn more about this fun little HTTP status code.
        </p>
        <hr />
        <p>
            <small>
                &copy; 2025 "${httpStatus}" image courtesy of <a href="https://www.drlinkcheck.com/blog/free-http-error-images">Dr. Link Check</a><br>
                It is available for download free of charge under the <a href="https://creativecommons.org/licenses/by/4.0/legalcode">Creative Commons CC BY 4.0 license</a>
            </small>
        </p>
    `;
}