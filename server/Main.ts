import SocketService, { socketService } from "./services/SocketService"

export default class Main {

    /** the main sockets manager */
    private socketsManager: SocketService;

    constructor() {
        this.socketsManager = socketService
    }

    public initServer(): void
    {

    }

    /**
     * Bind necessary sockets to the server
     */
    public bindSockets(): void
    {
        this.socketsManager.init()
    }


}
