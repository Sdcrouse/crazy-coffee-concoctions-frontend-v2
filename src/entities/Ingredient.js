import isEmpty from "../utils/isEmpty.js";
import { lowerCaseWord } from "../utils/wordFunctions.js";

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

    static validateIngredients(ingredients) {
        let ingredientErrors = {};

        for (const ingredientData of ingredients) {
            const { listItemId, amount, name } = ingredientData;

            if (isEmpty(amount) && isEmpty(name)) {
                ingredientErrors[listItemId] = 'Amount is required. Ingredient name is required.';
            } else if (isEmpty(amount)) {
                ingredientErrors[listItemId] = 'Amount is required.';
            } else if (isEmpty(name)) {
                ingredientErrors[listItemId] = 'Ingredient name is required.';
            }
        }

        return ingredientErrors;
    }
}