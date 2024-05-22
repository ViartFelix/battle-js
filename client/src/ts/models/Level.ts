import Model from "./Model";
import {socketService} from "../services/SocketService";
import MonsterRes from "../reqRes/MonsterRes";
import {levelsHandler} from "../handlers/LevelsHandler";
import {displayService} from "../services/DisplayService";

export default class Level extends Model
{
    /** Current level as number */
    private readonly _level: number;
    /** Current monsters slain in this zone */
    private _progression: number = 0;
    /** Limit of monster to slain before next level */
    private readonly _limit: number = 10;

    /**
     * Generates a new level
     * @param level
     */
    constructor(level: number) {
        super();

        this._level = level;
        this.init()
    }

    /**
     * Initializes the level
     * @private
     */
    private init(): void
    {

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
     * @private
     */
    public isAbleToGoNextLevel(pb: Level): boolean
    {
        return this.level <= pb.level && this.progression >= this.limit
    }

    /**
     * Updates the UI elements of the level
     */
    public updateLevelUI(next: boolean, previous: boolean): void
    {
        displayService.updateDisplay('level', this._level)
        displayService.updateDisplay('remain-current', this._progression)
        displayService.updateDisplay('remain-total', this._limit)

        if(next) {
            displayService.getDisplay('next').classList.remove('disabled')
        } else {
            displayService.getDisplay('next').classList.add('disabled')
        }

        if(previous) {
            displayService.getDisplay('previous').classList.remove('disabled')
        } else {
            displayService.getDisplay('previous').classList.add('disabled')
        }
    }

    get level(): number { return this._level; }
    get limit(): number { return this._limit; }
    get progression(): number { return this._progression; }
}
