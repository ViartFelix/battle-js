import Model from "./Model";
import {socketService} from "../services/SocketService";
import Exponent from "../handlers/Exponent";
import {displayService} from "../services/DisplayService";
import Monster from "./Monster";

export default class Level extends Model
{

    private readonly _level: number;
    /** The current monster */
    private _monster: Monster;

    /**
     * Generates a new level
     * @param level
     */
    constructor(level: number) {
        super();

        this._level = level;
        this.fetchInfos()
    }

    /**
     * Initializes the level
     * @private
     */
    private init(): void
    {

    }

    /**
     * Fetches details of the level to the socket
     * @private
     */
    private fetchInfos(): void
    {
        socketService.on("levelInfosResponse", (data: any) => {
            this._monster = new Monster(
                data.enemy.hp,
                data.enemy.money,
                data.enemy.isBoss
            );

            this.updateDisplays();
            this._monster.updateMonster();
        })

        //monster HP
        let hp;
        if(this._monster != undefined) {
            if(this._monster.isBoss) {
                this._monster.enemyHp.getNumberMap().pop();
            }

            hp = this._monster.enemyHp.getNumberMap()
        } else {
            hp = [1,0]
        }

        //first emit for the first level
        socketService.emit("levelInfosRequest", {
            level: this._level,
            hp: hp,
        })
    }

    /**
     * Updates the different displays related to the level
     * @private
     */
    private updateDisplays(): void
    {

    }

    get level(): number { return this._level; }
}
