import {Server, Socket} from "socket.io";
import ClientHandler from "../managers/ClientHandler";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export default class SocketService {
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
        this.io.on("connection", (socket: Socket) => {
            this.addClient(socket)
        })
    }

    /**
     * Add a client
     * @param socket
     */
    public addClient(socket: Socket)
    {
        this.clients.push(new ClientHandler(socket))
    }

    /**
     * Delete the client in the manager, to free memory
     * @param socket The client to be remove
     */
    public removeClient(socket: ClientHandler)
    {
        this.clients = this.clients.filter((client)=> {
            return client.getId() != socket.id;
        })
    }
}

export const socketService: SocketService = new SocketService();
