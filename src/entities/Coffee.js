import isEmpty from "../utils/isEmpty.js";

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
        const amount = coffeeData.amount;
        let errorMessages = {};
        
        if (isEmpty(amount)) errorMessages.amount = 'Amount is required.';
        return errorMessages;
    }
};