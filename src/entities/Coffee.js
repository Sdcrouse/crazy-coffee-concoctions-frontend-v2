import isEmpty from "../utils/isEmpty.js";
import { capitalizeWord, toTitleCase } from "../utils/wordFunctions.js";

export default class Coffee {
    #amount;
    #brand;
    #blend;
    #beanType;
    #roast;

    constructor(coffeeData) {
        this.#amount = coffeeData.amount;
        this.#brand = coffeeData.brand;
        this.#blend = coffeeData.blend;
        this.#beanType = coffeeData.beanType;
        this.#roast = coffeeData.roast;
    }

    description() {
        let descriptionParts = [this.#amount, this.#brand, this.#blend];

        if (this.#roast){
            if (this.#beanType) {
                descriptionParts.push(`(${this.#roast} Roast`);
            } else {
                descriptionParts.push(`(${this.#roast} Roast)`);
            }
        }

        if (this.#beanType) {
            if (this.#roast) {
                descriptionParts.push(`with ${this.#beanType} beans)`);
            } else {
                descriptionParts.push(`(with ${this.#beanType} beans)`);
            }
        }

        return descriptionParts.join(' ');
    }

    static validateData(coffeeData) {
        const { amount, brand, blend } = coffeeData;
        let errorMessages = {};
        
        if (isEmpty(amount)) errorMessages.amount = 'Amount is required.';
        if (isEmpty(brand)) errorMessages.brand = 'Brand is required.';
        if (isEmpty(blend)) errorMessages.blend = 'Blend is required.';

        return errorMessages;
    }

    static formatData(coffeeData) {
        let formattedCoffee = {
            amount: coffeeData.amount.trim(),
            brand: toTitleCase(coffeeData.brand.trim()),
            blend: toTitleCase(coffeeData.blend.trim())
        };

        if (!isEmpty(coffeeData.roast)) formattedCoffee.roast = coffeeData.roast;
        if (!isEmpty(coffeeData.beanType)) formattedCoffee.beanType = capitalizeWord(coffeeData.beanType.trim());
        
        return formattedCoffee;
    }
};