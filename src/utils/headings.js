import createCustomElement from "./createCustomElement.js";

function createErrorHeadingForWrapper(wrapper, errorMessage, headingType, classes) {
    const wrapperElement = typeof wrapper === 'string' ? document.getElementById(wrapper) : wrapper;
    
    const errorHeading = createCustomElement(
        headingType, { text: errorMessage, classes }
    );

    return [wrapperElement, errorHeading];
}

function prependErrorHeading(wrapper, errorMessage, headingType = 'h4', classes = 'center-content error-text prepended-error') {
    const [wrapperElement, errorHeading] = createErrorHeadingForWrapper(wrapper, errorMessage, headingType, classes);
    wrapperElement.prepend(errorHeading);
}

function appendErrorHeading(wrapper, errorMessage, headingType = 'h4', classes = 'center-content error-text') {
    const [wrapperElement, errorHeading] = createErrorHeadingForWrapper(wrapper, errorMessage, headingType, classes);
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

function displayDeletionError(errorMessage, errorWrapper, errorHeading) {
    if (errorHeading) {
        errorHeading.textContent = errorMessage;
    } else {
        appendErrorHeading(errorWrapper, errorMessage);
    }
}

export { prependErrorHeading, appendErrorHeading, appendSuccessHeading, appendPageHeading, displayDeletionError };