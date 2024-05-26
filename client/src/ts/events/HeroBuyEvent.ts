import Exponent from "../handlers/Exponent";

export default class HeroBuyEvent extends Event {


    /** Hero bought level ID */
    private readonly _id: number;
    /** The price at which the hero was bought */
    private readonly _price: Exponent;

    /** The new damage of the hero */
    private readonly _newDamage: Exponent;

    constructor(
        id: number,
        price: Exponent,
        newDamage: Exponent,
    ) {
        super('heroBuy');

        this._id = id;
        this._price = price;
        this._newDamage = newDamage;
    }

    get id(): number { return this._id; }
    get price(): Exponent { return this._price; }
    get newDamage(): Exponent { return this._newDamage; }
}

