import { generateSignupPage } from './components/authentication.js';

const titleElement = document.querySelector('title');
const homePageTitle = titleElement.textContent;

const mainContainer = document.getElementById('main-container');
const homePageContent = mainContainer.innerHTML;

const homeBtn = document.getElementById('home-btn');
const coffeeTeapotBtn = document.getElementById('coffee-with-teapot-btn');
const signupButton = document.getElementById('signup');

initialPageSetup();

function initialPageSetup() {
    generateHomePage();
    
    homeBtn.addEventListener('click', generateHomePage);
    signupButton.addEventListener('click', () => generateSignupPage(mainContainer));
    coffeeTeapotBtn.addEventListener('click', () => displayErrorImage(418));
}

function generateHomePage() {
    titleElement.textContent = homePageTitle;
    mainContainer.innerHTML = homePageContent;
}

function displayErrorImage(httpStatus) {
    const mainContainer = document.getElementById('main-container');
    
    mainContainer.innerHTML = `
        <img id="im-a-teapot" src="img/${httpStatus}-im-a-teapot.png" alt="${httpStatus} I'm a teapot" />
        <h2 id="teapot-image-heading" class="extra-padding coffee-text">Sorry! The server is currently unable to brew coffee at the moment because it is now a teapot. You can't brew coffee with a teapot!</h2>
        <p class="extra-padding">
            To change the teapot back into a server, please click the "Home" button on the left or refresh the page.
            Or you can visit <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/418">this handy MDN article</a>
            to learn more about this fun little HTTP status code.
        </p>
        <hr />
        <p id="teapot-image-info" class="extra-padding">
            <small>
                &copy; 2025 "${httpStatus}" image courtesy of <a href="https://www.drlinkcheck.com/blog/free-http-error-images">Dr. Link Check</a><br>
                It is available for download free of charge under the <a href="https://creativecommons.org/licenses/by/4.0/legalcode">Creative Commons CC BY 4.0 license</a>
            </small>
        </p>
    `;

    titleElement.innerText = `${httpStatus} - I'm a Teapot!`;
}