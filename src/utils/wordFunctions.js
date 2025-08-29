function capitalizeWord(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function lowerCaseWord(word) {
    return word[0].toLowerCase() + word.slice(1);
}

function toTitleCase(wordString) {
    return wordString.split(' ').map(word => capitalizeWord(word)).join(' ');
}

export { capitalizeWord, lowerCaseWord, toTitleCase };