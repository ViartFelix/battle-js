import {socketService} from "./services/SocketService";
import {shopHandler} from "./handlers/ShopHandler";

export default class main {
    /**
     * Main manager of the clicker game
     */
    constructor() {
        this.hydrate()
        socketService.init()
        shopHandler.init()
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
