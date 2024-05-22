import Exponent from "../handlers/Exponent";

export default class LevelChangeEvent extends Event {


    private readonly _level: number;

    /**
     * Event called when an attempt to change the level is made
     * @param level The level to go to
     */
    constructor(level: number) {
        // Call the Event constructor with the event type
        super('levelChane');
        this._level = level;
    }

    get level(): number { return this._level; }
}

