import {io} from "socket.io-client"

export default class main {

    socket: any;

    /**
     * Main manager of the clicker game
     */
    constructor() {
        this.hydrate()
        this.bindSockets()
    }

    /**
     * Binds sockets
     * @private
     */
    private bindSockets(): void
    {
        this.socket = io("ws://localhost:9500");
    }

    /**
     * Hydrates the page
     * @private
     */
    private hydrate(): void
    {

    }
}
