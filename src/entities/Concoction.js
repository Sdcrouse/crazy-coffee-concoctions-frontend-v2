export default class Concoction {
    #id;
    #name;
    #created;
    #coffee;
    #ingredients;
    #ingredientCategories;
    #instructions;
    #notes;

    constructor(concoctionData) {
        this.#id = concoctionData.id;
        this.#name = concoctionData.name;
        this.#created = concoctionData.created;
        this.#ingredients = {
            'Liquid': [],
            'Sweetener': [],
            'Creamer': [],
            'Additional Ingredient': []
        };
        this.#ingredientCategories = ['Liquid', 'Sweetener', 'Creamer', 'Additional Ingredient'];
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get ingredients() {
        return this.#ingredients;
    }

    get ingredientCategories() {
        return this.#ingredientCategories;
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

    addIngredient(ingredient) {
        this.#ingredients[ingredient.category].push(ingredient);
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