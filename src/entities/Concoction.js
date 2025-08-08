export default class Concoction {
    #id;
    #name;
    #created;

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

    get created() {
        return this.#created;
    }
};