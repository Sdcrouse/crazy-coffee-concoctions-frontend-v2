import createCustomElement from "./createCustomElement.js";

export default function generateForm(submitButtonText, ...formElements) {
    const submitButton = createCustomElement('button', {
        attributes: { type: 'submit' },
        text: submitButtonText
    });

    const buttonPar = createCustomElement('p', {
        classes: 'center-content', itemsToAppend: [submitButton]
    });
    
    const form = createCustomElement('form', {
        itemsToAppend: [...formElements, buttonPar]
    });

    return form;
};