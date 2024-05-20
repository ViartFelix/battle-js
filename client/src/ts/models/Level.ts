import Model from "./Model";
import {socketService} from "../services/SocketService";

export default class Level extends Model
{
    private readonly _level: number;
    /** If the level indicated is a boss level */
    private readonly _isBoss: boolean = false;
    /** The multiplicative of boss HP */
    private bossMultiplicative: number = 10;

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
            console.log(data)
        })

        socketService.emit("levelInfosRequest", {level: this._level})
    }


    get level(): number { return this._level; }
}
