function createCustomElement(tagName, { id ='', text = '', classes = '', attributes = {}, itemsToAppend = [] } = {}) {
    const customElement = document.createElement(tagName);
    
    if (id) { customElement.id = id; }
    if (text) { customElement.textContent = text; }
    if (classes) { customElement.className = classes; }

    for (let attrName in attributes) {
        customElement.setAttribute(attrName, attributes[attrName]);
    }

    customElement.append(...itemsToAppend);

    return customElement;
}

export default createCustomElement;