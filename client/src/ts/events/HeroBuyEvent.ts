import Exponent from "../handlers/Exponent";

export default class HeroBuyEvent extends Event {


    /** Hero bought level ID */
    private readonly _id: number;
    /** The price at which the hero was bought */
    private readonly _price: Exponent;

    /** The DPS do add to the total damage */
    private readonly _addDPS: Exponent;

    constructor(
        id: number,
        price: Exponent,
        addDPS: Exponent,
    ) {
        super('heroBuy');

        this._id = id;
        this._price = price;
        this._addDPS = addDPS;
    }

    get id(): number { return this._id; }
    get price(): Exponent { return this._price; }
    get addDPS(): Exponent { return this._addDPS; }
}

