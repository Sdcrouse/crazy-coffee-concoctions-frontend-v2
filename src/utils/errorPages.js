import createCustomElement from "./createCustomElement.js";

const titleElement = document.querySelector('title');
const mainContainer = document.getElementById('main-container');

export function generateServerErrorPage(errorMessage) {
    const httpStatus = 500;
    titleElement.textContent = `${httpStatus} - Internal Server Error`;

    const serverErrorImage = createCustomElement('img', {
        id: 'internal-server-error',
        attributes: {
            src: `img/${httpStatus}-internal-server-error.png`,
            alt: `${httpStatus} internal server error`
        }
    });

    const serverErrorHeading = createCustomElement('h2', {
        id: 'internal-server-error-image-heading',
        classes: 'extra-padding coffee-text',
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
        id: 'internal-server-error-image-info',
        classes: 'extra-padding',
        itemsToAppend: [errorImageSmallText]
    });

    let errorFragment = new DocumentFragment();
    errorFragment.append(serverErrorImage, serverErrorHeading, document.createElement('hr'), errorImageInfo);
    mainContainer.replaceChildren(errorFragment);
}