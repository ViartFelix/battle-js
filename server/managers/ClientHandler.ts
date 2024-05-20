import {Socket} from "socket.io";
import { socketService } from "../services/SocketService"
import { classService } from "../services/ClassService";
import {levelService} from "../services/LevelService";

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

        levelService.exponential([6], 4)

        this.socket.on('levelInfosRequest', (data: any)=> {
            const level: number = data.level;
            const monsterHp: number = this.getMonsterHp(level);

            this.socket.emit('levelInfosResponse', {
                hp: Math.floor(monsterHp)
            })
        })
    }

    public getMonsterHp(level: number)
    {
        if(level < 140) {
            return ( 10 * (level - 1 + Math.pow(1.55, level - 1)) )
        } else if( level < 500 ) {
            return ( 10 * (139 + Math.pow(1.55, 139) * Math.pow(1.145, level - 140)) )
        } else if (level < 200000) {
            let total: number = 0;

            for(let i: number = 501; i <= level; i++) {
                const base = 10 * (139 + Math.pow(1.55, i) * Math.pow(1.145, i - 500))
                const now = Math.floor(base + 0.001)

                total += now
            }

            return Math.floor(total)
        } else {
            return (Math.pow(1.545, level - 200000) * 1.24 * Math.pow(10, 25409) + (level - 1) * 10)
        }
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
