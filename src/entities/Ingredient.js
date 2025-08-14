export default class Ingredient {
    #amount;
    #name;
    #category;

    constructor(ingredientData) {
        this.#amount = ingredientData.amount;
        this.#name = ingredientData.name;
        this.#category = ingredientData.category;
    }

    get category() {
        return this.#category;
    }

    description() {
        return `${this.#amount} ${this.#name}`;
    }
}