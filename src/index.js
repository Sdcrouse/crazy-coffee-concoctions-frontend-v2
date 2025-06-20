import { generateSignupPage } from './components/authentication.js';

const titleElement = document.querySelector('title');
const homePageTitle = titleElement.textContent;

const mainContainer = document.getElementById('main-container');
const homePageContent = mainContainer.querySelector('div');

const homeBtn = document.getElementById('home-btn');
const coffeeTeapotBtn = document.getElementById('coffee-with-teapot-btn');
const signupButton = document.getElementById('signup');

initialPageSetup();

function initialPageSetup() {    
    homeBtn.addEventListener('click', generateHomePage);
    signupButton.addEventListener('click', generateSignupPage);
    coffeeTeapotBtn.addEventListener('click', () => displayErrorImage(418));
}

function generateHomePage() {
    titleElement.textContent = homePageTitle;
    mainContainer.replaceChildren(homePageContent);
}

function displayErrorImage(httpStatus) {
    titleElement.textContent = `${httpStatus} - I'm a Teapot!`;

    const teapotImage = document.createElement('img');
    teapotImage.setAttribute('id', 'im-a-teapot');
    teapotImage.setAttribute('src', `img/${httpStatus}-im-a-teapot.png`);
    teapotImage.setAttribute('alt', `${httpStatus} I'm a teapot`);

    const teapotHeading = document.createElement('h2');
    teapotHeading.setAttribute('id', 'teapot-image-heading');
    teapotHeading.className = 'extra-padding coffee-text';
    teapotHeading.textContent = `
        Sorry! The server is currently unable to brew coffee at the moment because it is now a teapot. 
        You can't brew coffee with a teapot!
    `;

    const mdnArticleLink = document.createElement('a');
    mdnArticleLink.setAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/418');
    mdnArticleLink.textContent = 'this handy MDN article';

    let instructions = document.createElement('p');
    instructions.className = 'extra-padding';
    instructions.append(
        'To change the teapot back into a server, please click the "Home" button on the left or refresh the page. Or you can visit ',
        mdnArticleLink,
        ' to learn more about this fun little HTTP status code.'
    );

    const errorImageSource = document.createElement('a');
    errorImageSource.setAttribute('href', 'https://www.drlinkcheck.com/blog/free-http-error-images');
    errorImageSource.textContent = 'Dr. Link Check';

    const errorImageLicense = document.createElement('a');
    errorImageLicense.setAttribute('href', 'https://creativecommons.org/licenses/by/4.0/legalcode');
    errorImageLicense.textContent = 'Creative Commons CC BY 4.0 license';

    const errorImageSmallText = document.createElement('small');
    errorImageSmallText.append(
        `\u00A9 2025 "${httpStatus}" image courtesy of `,
        errorImageSource,
        document.createElement('br'),
        'It is available for download free of charge under the ',
        errorImageLicense
    );

    const errorImageInfo = document.createElement('p');
    errorImageInfo.setAttribute('id', 'teapot-image-info');
    errorImageInfo.className = 'extra-padding';
    errorImageInfo.appendChild(errorImageSmallText);

    let errorFragment = new DocumentFragment();
    errorFragment.append(teapotImage, teapotHeading, instructions, document.createElement('hr'), errorImageInfo);
    mainContainer.replaceChildren(errorFragment);
}