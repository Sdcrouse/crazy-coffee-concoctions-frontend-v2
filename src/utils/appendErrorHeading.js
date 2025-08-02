import createCustomElement from "./createCustomElement.js";

function appendErrorHeading(wrapper, errorMessage, headingType = 'h4') {
    const wrapperElement = typeof wrapper === 'string' ? document.getElementById(wrapper) : wrapper;
    
    const errorHeading = createCustomElement(
        headingType, { text: errorMessage, classes: 'center-content error-text' }
    );

    wrapperElement.appendChild(errorHeading);
}

export default appendErrorHeading;