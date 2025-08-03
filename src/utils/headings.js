import createCustomElement from "./createCustomElement.js";

function appendErrorHeading(wrapper, errorMessage, headingType = 'h4') {
    const wrapperElement = typeof wrapper === 'string' ? document.getElementById(wrapper) : wrapper;
    
    const errorHeading = createCustomElement(
        headingType, { text: errorMessage, classes: 'center-content error-text' }
    );

    wrapperElement.appendChild(errorHeading);
}

function appendSuccessHeading(wrapper, successMessage) {
    const successHeading = createCustomElement('h3', {
        text: successMessage,
        classes: 'success-text center-content'
    });

    wrapper.appendChild(successHeading);
}

function appendPageHeading(wrapper, pageTitle) {
    const pageHeading = createCustomElement('h2', {
        text: pageTitle,
        classes: 'center-content coffee-text'
    });

    wrapper.appendChild(pageHeading);
}

export { appendErrorHeading, appendSuccessHeading, appendPageHeading };