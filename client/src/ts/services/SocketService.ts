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
            try {
                callback(val)
            } catch(e) {
                throw new SocketException(e)
            }
        });
    }
}

export const socketService = new SocketService();
