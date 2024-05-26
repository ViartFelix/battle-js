import {socketService} from "./services/SocketService";
import {shopHandler} from "./handlers/ShopHandler";
import {levelsHandler} from "./handlers/LevelsHandler";
import {gameTickHandler} from "./handlers/GameTickHandler";
import {damageHandler} from "./handlers/DamageHandler";

export default class main {
    /**
     * Main manager of the clicker game
     */
    constructor() {
        this.hydrate()

        socketService.init()
        shopHandler.init()
        levelsHandler.init()
        gameTickHandler.init()
        damageHandler.init()
    }

    /**
     * Bind the necessary sockets
     * @private
     */
    private bindSockets()
    {

    }

    /**
     * Hydrates the page
     * @private
     */
    private hydrate(): void
    {

    }
}
