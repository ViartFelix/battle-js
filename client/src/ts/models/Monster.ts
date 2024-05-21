import Model from "./Model";
import {displayService} from "../services/DisplayService";
import Exponent from "../handlers/Exponent";

export default class Monster extends Model
{

    /** Current monster HP */
    private readonly _enemyHp: Exponent;
    /** Current dropped gold by zone */
    private readonly _enemyGold: Exponent;

    /** If the level indicated is a boss level */
    private readonly _isBoss: boolean = false;


    constructor(hp: Array<number>, gold: Array<number>, isBoss: boolean)
    {
        super();

        //get monster hp and parse it
        const monsterHp = hp.map(String).join("");
        this._enemyHp = new Exponent(monsterHp).parse();

        //same with the money drops
        const monsterGold = gold.map(String).join("");
        this._enemyGold = new Exponent(monsterGold).parse();

        this._isBoss = isBoss;
    }

    /**
     * Updates all displays related to the monster
     */
    public updateMonster()
    {
        //update the display
        displayService.updateDisplay('current-hp', this._enemyHp)
    }

    get enemyHp(): Exponent { return this._enemyHp; }
    get enemyGold(): Exponent { return this._enemyGold; }
    get isBoss(): boolean { return this._isBoss; }
}
