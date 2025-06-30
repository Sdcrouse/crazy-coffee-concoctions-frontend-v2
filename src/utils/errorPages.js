import createCustomElement from "./createCustomElement.js";

const titleElement = document.querySelector('title');
const mainContainer = document.getElementById('main-container');

function generateTeapotPage() {
    const httpStatus = 418;
    titleElement.textContent = `${httpStatus} - I'm a Teapot!`;

    const teapotImage = createCustomElement('img', {
        classes: 'error-image',
        attributes: {
            src: `img/${httpStatus}-im-a-teapot.png`,
            alt: `${httpStatus} I'm a teapot`
        }
    });

    const teapotHeading = createCustomElement('h2', {
        classes: 'extra-padding coffee-text error-image-heading',
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
        `\u00A9 2025 "HTTP ${httpStatus}" image courtesy of `,
        errorImageSource,
        document.createElement('br'),
        'It is available for download free of charge under the ',
        errorImageLicense
    ]});

    const errorImageInfo = createCustomElement('p', {
        classes: 'extra-padding error-image-info',
        itemsToAppend: [errorImageSmallText]
    });

    let errorFragment = new DocumentFragment();
    errorFragment.append(teapotImage, teapotHeading, instructions, document.createElement('hr'), errorImageInfo);
    mainContainer.replaceChildren(errorFragment);
}

function generateServerErrorPage(errorMessage) {
    const httpStatus = 500;
    titleElement.textContent = `${httpStatus} - Internal Server Error`;

    const serverErrorImage = createCustomElement('img', {
        classes: 'error-image',
        attributes: {
            src: `img/${httpStatus}-internal-server-error.png`,
            alt: `${httpStatus} internal server error`
        }
    });

    const serverErrorHeading = createCustomElement('h2', {
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
        `\u00A9 2025 "HTTP ${httpStatus}" image courtesy of `,
        errorImageSource,
        document.createElement('br'),
        'It is available for download free of charge under the ',
        errorImageLicense
    ]});

    const errorImageInfo = createCustomElement('p', {
        classes: 'extra-padding error-image-info',
        itemsToAppend: [errorImageSmallText]
    });

    let errorFragment = new DocumentFragment();
    errorFragment.append(serverErrorImage, serverErrorHeading, document.createElement('hr'), errorImageInfo);
    mainContainer.replaceChildren(errorFragment);
}

export { generateTeapotPage, generateServerErrorPage };