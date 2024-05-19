import Exponent from "../handlers/Exponent";

export default class MoneyReceivedEvent extends Event {
    /** Amount of money received */
    private readonly _amount: Exponent;

    /**
     * Event called when money is received from any source
     * @param amount The amount to money received
     */
    constructor(amount: Exponent) {
        // Call the Event constructor with the event type
        super('moneyReceive');
        this._amount = amount
        //parse directly
        this._amount.parse()
    }

    get amount(): Exponent { return this._amount; }
}

