import createCustomElement from "./createCustomElement.js";
import generatePageTitle from "./pageTitle.js";

const mainContainer = document.getElementById('main-container');

function generateErrorPage(httpStatusNo, httpStatusText, errorImage, errorMessage, ...otherElements) {
    generatePageTitle(`${httpStatusNo} - ${httpStatusText}`, false);

    const errorImageHeading = createCustomElement('h2', {
        classes: 'extra-padding coffee-text error-image-heading',
        text: errorMessage
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
        `\u00A9 2025 "HTTP ${httpStatusNo}" image courtesy of `,
        errorImageSource,
        document.createElement('br'),
        'It is available for download free of charge under the ',
        errorImageLicense
    ]});

    const errorImageInfo = createCustomElement('p', {
        classes: 'extra-padding error-image-info',
        itemsToAppend: [errorImageSmallText]
    });

    let errorImageFragment = new DocumentFragment();
    errorImageFragment.append(errorImage, errorImageHeading, ...otherElements, document.createElement('hr'), errorImageInfo);
    mainContainer.replaceChildren(errorImageFragment);
}

function generateTeapotPage() {
    const httpStatus = 418;

    const teapotImage = createCustomElement('img', {
        classes: 'error-image',
        attributes: {
            src: `img/${httpStatus}-im-a-teapot.png`,
            alt: `Cartoon robot stares into a mirror and sees a teapot instead of its own reflection. Text to the right reads "418 I'm a Teapot. No coffee available!"`
        }
    });

    const teapotMessage = `
        Sorry! The server is currently unable to brew coffee at the moment because it is now a teapot. 
        You can't brew coffee with a teapot!
    `;

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

    generateErrorPage(httpStatus, "I'm a Teapot!", teapotImage, teapotMessage, instructions);
}

function generateServerErrorPage(errorMessage) {
    const httpStatus = 500;

    const serverErrorImage = createCustomElement('img', {
        classes: 'error-image',
        attributes: {
            src: `img/${httpStatus}-internal-server-error.png`,
            alt: `Broken cartoon robot with smoke rising from a crack in its head. Text to the right reads "500 Internal Server Error. Oh my, something must be broken somewhere..."`
        }
    });

    generateErrorPage(httpStatus, 'Internal Server Error', serverErrorImage, errorMessage);
}

export { generateTeapotPage, generateServerErrorPage };