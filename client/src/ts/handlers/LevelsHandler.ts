import Level from "../models/Level";

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
        const level = new Level(500);
        this._currentLevel = level;

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
     * Triggers
     * @param isAdded
     */
    public changeLevel(isAdded: boolean): void
    {

    }




}

export const levelsHandler: LevelsHandler = new LevelsHandler();
