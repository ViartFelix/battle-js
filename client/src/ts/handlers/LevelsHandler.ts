import Level from "../models/Level";
import {displayService} from "../services/DisplayService";

class LevelsHandler
{
    /** Current level */
    private _currentLevel: Level;

    constructor() {
    }

    /**
     * Init the levels handler by binding events
     */
    public init(): void
    {
        this._currentLevel = new Level(1)
        this.bindEvents();
    }

    /**
     * Bind events of the DOM to the handler
     * @private
     */
    private bindEvents(): void
    {

    }

    /**
     * Triggers the level change
     * @param isAdded
     */
    public changeLevel(isAdded: boolean): void
    {
        //TODO
    }
}

export const levelsHandler: LevelsHandler = new LevelsHandler();
