const titleElement = document.querySelector('title');

export default function generatePageTitle(title, useBaseTitle = true) {
    if (useBaseTitle) {
        titleElement.textContent = `Crazy Coffee Concoctions - ${title}`;
    } else {
        titleElement.textContent = title;
    }
};