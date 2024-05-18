import {Socket} from "socket.io";
import { socketService } from "../services/SocketService"
import { classService } from "../services/ClassService";

export default class ClientHandler {
    readonly socket: Socket;
    readonly id: string;


    constructor(client: Socket) {
        this.socket = client;
        this.id = this.socket.id

        this.bindEvents()
        this.returnClasses();
    }

    /**
     * Returns classes for the shop
     * @private
     */
    private returnClasses()
    {
        const data = classService.getClasses()
        socketService.emitToClient(this, 'shop', data);
    }

    /**
     * Bind all necessary events to the sockets
     * @private
     */
    private bindEvents(): void
    {
        //on disconnect, attempt to remove the client from the manager
        this.socket.on('disconnect', ()=> {
            socketService.removeClient(this);
        });
    }

    public getId(): string
    {
        return this.id;
    }

    public getSocket(): Socket
    {
        return this.socket;
    }
}
