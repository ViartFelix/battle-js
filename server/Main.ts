import { socketService } from "./services/SocketService"

export default class Main {

    /** the main sockets manager */
    private socketsManager: typeof socketService;

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
        this.socketsManager.on("levelChange", (val: any) => {
            console.log(val)
        })
    }
}
