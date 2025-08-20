function capitalizeWord(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function lowerCaseWord(word) {
    return word[0].toLowerCase() + word.slice(1);
}

export { capitalizeWord, lowerCaseWord };