import {levelsHandler} from "../handlers/LevelsHandler";
import LevelChangeException from "../Exceptions/LevelChangeException";

export default class LevelChangeEvent extends Event {

    /** Where to go to next */
    private readonly _nextLevel: number;
    /** Type of "movement" in the levels */
    private readonly _typeMvt: LevelChangeType;
    /** If the movement is valid */
    private readonly _isValidMovement: boolean = false;

    /**
     * Event called when an attempt to change the level is made
     * @param type
     */
    constructor(type: LevelChangeType) {
        // Call the Event constructor with the event type
        super('levelChangeAttempt');


        if(type.valueOf() === LevelChangeType.LEVEL_UP) {
            this._isValidMovement = levelsHandler.currentLevel.canGoNextLevel();
            this._nextLevel = levelsHandler.currentLevel.level + 1;
            this._typeMvt = type;
        }
        else if(type.valueOf() === LevelChangeType.LEVEL_DOWN) {
            this._isValidMovement = levelsHandler.currentLevel.canGoPreviousLevel();
            this._nextLevel = levelsHandler.currentLevel.level - 1;
            this._typeMvt = type;
        }
        else {
            throw new LevelChangeException("Invalid level change type");
        }
    }

    get nextLevel(): number { return this._nextLevel; }
    get typeMvt(): LevelChangeType { return this._typeMvt; }
    get isValidMovement(): boolean { return this._isValidMovement; }

}

export enum LevelChangeType {
    LEVEL_UP = 1,
    LEVEL_DOWN = 0
}
