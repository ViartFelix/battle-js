import {Server, Socket} from "socket.io";
import ClientHandler from "../managers/ClientHandler";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import SocketException from "../exceptions/SocketException";

class SocketService {
    /** The io server */
    private readonly io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

    /** Contains all clients connected to the server. */
    private clients: Array<ClientHandler> = Array();


    constructor() {
        //new server
        this.io = new Server(9500, {
            cors: {
                origin: '*',
            }
        })
    }

    /**
     * Will initialise the socket server.
     * @private
     */
    public init(): void
    {
        //When a socket is connected
        this.on("connection", (socket: Socket) => {
            this.addClient(socket)
        })
    }

    /**
     * Attach an event to a handler
     * @param event
     * @param callback
     */
    public on(event: string, callback: Function)
    {
        this.io.on(event, (val)=> {
            try {
                callback(val)
            } catch(e: any) {
                throw new SocketException(e)
            }
        });
    }

    /**
     * Add a client to the list, for better management
     * @param socket
     */
    public addClient(socket: Socket)
    {
        this.clients.push(new ClientHandler(socket))
    }

    /**
     * Delete the client in the manager, to free memory
     * @param socket The client to be removed
     */
    public removeClient(socket: ClientHandler)
    {
        this.clients = this.clients.filter((client)=> {
            return client.getId() != socket.id;
        })
    }

    /**
     * Emits data to the client
     * @param client
     * @param key
     * @param value
     */
    public emitToClient(client: ClientHandler, key: string, value: any)
    {
        client.socket.emit(key, value)
    }
}

export const socketService: SocketService = new SocketService();
