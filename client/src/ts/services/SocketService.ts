import {io} from "socket.io-client"

class SocketService {
    socket = io("ws://localhost:9500");

    constructor() {
    }

    public init()
    {

    }

    public bindSockets()
    {
        this.socket.on('shop', (val) => {
            console.log(val)
        })
    }
}

export const socketService = new SocketService();
