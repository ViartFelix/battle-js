import {Socket} from "socket.io";
import { socketService } from "../services/SocketService"
import { classService } from "../services/ClassService";
import {levelService} from "../services/LevelService";
import Enemy from "../models/Enemy";
import {fsService} from "../services/FsService";

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

        this.socket.on('levelInfosRequest', (data: any)=> {
            this.levelInfosRequest(data)
        })

        this.socket.on("musicsRequest", (data: any)=> {
            this.handleMusicsRequest(data)
        })
    }

    private levelInfosRequest(data: any): void
    {
        //get the level
        const level: number = data.level;
        const previousMonster = data.hp

        //get next monster type (boss or monster)
        const nextMonster: Enemy = levelService.getEnemy(level, previousMonster);

        //return the monster HP as number map
        this.socket.emit('levelInfosResponse', {
            enemy: nextMonster,
        })
    }

    /**
     * Handles the request for music files
     * @param data
     * @private
     */
    private handleMusicsRequest(data: any): void
    {
        const file: Buffer = fsService.getDataFile('musics.json');
        const musics = JSON.parse(file.toString());

        this.socket.emit('musicsResponse', musics)
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
