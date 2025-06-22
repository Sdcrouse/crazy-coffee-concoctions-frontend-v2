import { generateSignupPage } from './components/authentication.js';
import createCustomElement from './utils/createCustomElement.js';

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
    coffeeTeapotBtn.addEventListener('click', generateTeapotPage);
}

function generateHomePage() {
    titleElement.textContent = homePageTitle;
    mainContainer.replaceChildren(homePageContent);
}

function generateTeapotPage() {
    const httpStatus = 418;
    titleElement.textContent = `${httpStatus} - I'm a Teapot!`;

    const teapotImage = createCustomElement('img', {
        attributes: {
            id: 'im-a-teapot',
            src: `img/${httpStatus}-im-a-teapot.png`,
            alt: `${httpStatus} I'm a teapot`
        }
    });

    const teapotHeading = createCustomElement('h2', {
        attributes: { id: 'teapot-image-heading' },
        classes: 'extra-padding coffee-text',
        text: `
            Sorry! The server is currently unable to brew coffee at the moment because it is now a teapot. 
            You can't brew coffee with a teapot!
        `
    });

    const mdnArticleLink = createCustomElement('a', {
        attributes: { 'href': 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/418' },
        text: 'the official MDN web documentation'
    });

    const instructions = createCustomElement('p', {
        classes: 'extra-padding',
        itemsToAppend: [
            'To change the teapot back into a server, please click one of the other buttons on the left or refresh the page. You can also visit ',
            mdnArticleLink,
            ' to learn more about this fun little HTTP status code.'
        ]
    });

    const errorImageSource = createCustomElement('a', {
        attributes: { href: 'https://www.drlinkcheck.com/blog/free-http-error-images' },
        text: 'Dr. Link Check'
    });

    const errorImageLicense = createCustomElement('a', {
        attributes: { href: 'https://creativecommons.org/licenses/by/4.0/legalcode' },
        text: 'Creative Commons CC BY 4.0 license'
    });

    const errorImageSmallText = createCustomElement('small', { itemsToAppend: [
        `\u00A9 2025 "${httpStatus}" image courtesy of `,
        errorImageSource,
        document.createElement('br'),
        'It is available for download free of charge under the ',
        errorImageLicense
    ]});

    const errorImageInfo = createCustomElement('p', {
        attributes: { id: 'teapot-image-info' },
        classes: 'extra-padding',
        itemsToAppend: [errorImageSmallText]
    });

    let errorFragment = new DocumentFragment();
    errorFragment.append(teapotImage, teapotHeading, instructions, document.createElement('hr'), errorImageInfo);
    mainContainer.replaceChildren(errorFragment);
}