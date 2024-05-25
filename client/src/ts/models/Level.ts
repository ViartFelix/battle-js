import Model from "./Model";
import {levelsHandler} from "../handlers/LevelsHandler";
import {displayService} from "../services/DisplayService";

export default class Level extends Model
{
    /** Current level as number */
    private readonly _level: number;
    /** Current monsters slain in this zone */
    private _progression: number = 0;
    /** Limit of monster to slain before next level */
    private _limit: number = 1;

    /**
     * Generates a new level
     * @param level
     */
    constructor(level: number) {
        super();

        this._level = level;
    }

    /**
     * Initializes the level
     * @private
     */
    public init(isBossLevel: boolean): void
    {
        if(isBossLevel) {
            this._limit = 1;
        }
    }

    public addToProgression(): void
    {
        if(this._progression >= this._limit) {
            this._progression = this._limit;
        } else {
            this._progression += 1;
        }
    }

    /**
     * Determines of the player can access the next level
     */
    public canGoNextLevel(): boolean
    {
        //if the player has already visited this zone
        //if level bellow pb and level is not 1
        if(this.level < levelsHandler.pb.level) {
            return true;
        } else {
            if(this.level === levelsHandler.pb.level) {
                return this.progression >= this.limit;
            } else {
                return this.progression >= this.limit;
            }
        }
    }

    /**
     * Determines if the player can access the previous level
     */
    public canGoPreviousLevel(): boolean
    {
        return this.level > 1
    }

    /**
     * Updates the UI elements of the level
     */
    public updateLevelUI(): void
    {
        displayService.updateDisplay('level', this._level)
        displayService.updateDisplay('remain-current', this._progression)
        displayService.updateDisplay('remain-total', this._limit)

        if(this.canGoNextLevel()) {
            displayService.getDisplay('next').classList.remove('disabled')
        } else {
            displayService.getDisplay('next').classList.add('disabled')
        }

        if(this.canGoPreviousLevel()) {
            displayService.getDisplay('previous').classList.remove('disabled')
        } else {
            displayService.getDisplay('previous').classList.add('disabled')
        }
    }

    get level(): number { return this._level; }
    get limit(): number { return this._limit; }
    get progression(): number { return this._progression; }
}
