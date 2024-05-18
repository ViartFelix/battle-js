import {socketService} from "./services/SocketService";

export default class main {
    /**
     * Main manager of the clicker game
     */
    constructor() {
        this.hydrate()
        socketService.bindSockets()
    }

    /**
     * Hydrates the page
     * @private
     */
    private hydrate(): void
    {

    }
}
