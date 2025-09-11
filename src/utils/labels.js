import createCustomElement from "./createCustomElement.js";

export default function createLabel(labelFor, labelText, isRequired) {
    const label = createCustomElement('label', {
        attributes: { for: labelFor },
        text: `${labelText}:`
    });

    if (isRequired) label.className = 'required-field';
    return label;
};