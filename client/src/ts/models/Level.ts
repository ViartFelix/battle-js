import Model from "./Model";
import {socketService} from "../services/SocketService";
import Exponent from "../handlers/Exponent";
import {displayService} from "../services/DisplayService";

export default class Level extends Model
{

    private readonly _level: number;
    /** If the level indicated is a boss level */
    private readonly _isBoss: boolean = false;
    /** The multiplicative of boss HP */
    private bossMultiplicative: number = 10;
    /** Current monster HP */
    private _monsterHp: Exponent;

    /**
     * Generates a new level
     * @param level
     */
    constructor(level: number) {
        super();

        this._level = level;
        this._isBoss = (level % 10 === 0);
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
            //get monster hp
            const monsterHp = data.hp.map(String).join("");
            //parse the number
            this._monsterHp = new Exponent(monsterHp).parse();
            //update the display
            displayService.updateDisplay('current-hp', this._monsterHp)
        })
        //first emit for the first level
        socketService.emit("levelInfosRequest", {level: this._level})
    }


    get level(): number { return this._level; }
    get monsterHp(): Exponent { return this._monsterHp; }
}
