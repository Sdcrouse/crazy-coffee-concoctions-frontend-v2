import isEmpty from "../utils/isEmpty.js";

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

    static validateData(ingredientData) {
        const { amount, name } = ingredientData;
        let errorMessages = {};

        if (isEmpty(amount)) errorMessages.amount = 'Amount is required.';
        if (isEmpty(name)) errorMessages.name = 'Ingredient name is required.';
        if (!isEmpty(errorMessages)) errorMessages.position = ingredientData.position;

        return errorMessages;
    }

    static validateIngredients(ingredients) {
        let ingredientErrorsByCategory = {};

        for (const ingredient of ingredients) {
            const ingredientErrors = this.validateData(ingredient);

            if (ingredientErrors.position) {
                if (Array.isArray(ingredientErrorsByCategory[ingredient.category])) {
                    ingredientErrorsByCategory[ingredient.category].push(ingredientErrors);
                } else {
                    ingredientErrorsByCategory[ingredient.category] = [ingredientErrors];
                }
            }
        }

        return ingredientErrorsByCategory;
    }
}