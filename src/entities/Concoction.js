export default class Concoction {
    #id;
    #name;
    #created;
    #instructions;
    #notes;
    #coffee;

    constructor(concoctionData) {
        this.#id = concoctionData.id;
        this.#name = concoctionData.name;
        this.#created = concoctionData.created;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get instructions() {
        return this.#instructions;
    }

    get notes() {
        return this.#notes;
    }

    set coffee(coffeeData) {
        this.#coffee = coffeeData;
    }

    listItemId() {
        return `concoction-${this.#id}`;
    }

    description() {
        const dateCreated = new Date(this.#created);
        const createdDate = dateCreated.toLocaleDateString('en-US');
        const createdTime = dateCreated.toLocaleTimeString('en-US');

        return `${this.#name}, created on ${createdDate} at ${createdTime}`;
    }

    addData(additionalData) {
        this.#instructions = additionalData.instructions;
        this.#notes = additionalData.notes;
    }
};