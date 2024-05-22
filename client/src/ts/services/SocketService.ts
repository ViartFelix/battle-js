import {io} from "socket.io-client"
import SocketException from "../Exceptions/SocketException";
import ServiceContact from "../contracts/ServiceContact";

class SocketService implements ServiceContact  {
    socket = io("ws://localhost:9500");

    constructor() {
    }

    public init()
    {}

    /**
     * Binds a socket to a callback
     * @param event
     * @param callback
     */
    public on(event: string, callback: Function)
    {
        this.socket.on(event, (val)=> {
            callback(val)
        });
    }

    /**
     * Emits a message to the server
     * @param event
     * @param val
     */
    public emit(event: string, val: any)
    {
        this.socket.emit(event, val)
    }
}

export const socketService = new SocketService();
