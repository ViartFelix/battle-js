import Level from "../models/Level";
import {displayService} from "../services/DisplayService";
import Monster from "../models/Monster";
import Exponent from "./Exponent";
import MonsterRes from "../reqRes/MonsterRes";
import {socketService} from "../services/SocketService";
import LevelChangeEvent, {LevelChangeType} from "../events/LevelChangeEvent";
import MonsterDamageEvent from "../events/MonsterDamageEvent";
import MonsterKillEvent from "../events/MonsterKillEvent";
import MoneyReceivedEvent from "../events/MoneyReceivedEvent";
import LevelReq from "../reqRes/LevelReq";
import {gameTickHandler} from "./GameTickHandler";
import HandlersContract from "../contracts/HandlersContract";

class LevelsHandler implements HandlersContract
{
    /** Current level */
    private _currentLevel: Level;
    /** Current monster on the field */
    private _monster: Monster;
    /** Personal best of the current highest level */
    private _pb: Level;

    constructor() {
    }

    /**
     * Init the levels handler by binding events
     */
    public init(): void
    {
        this._currentLevel = new Level(100)
        this._pb = this._currentLevel
        this.bindEvents();
        this.monsterRequest();
    }

    /**
     * Request a new monster from the server
     */
    public monsterRequest(): void
    {
        //get current monster hp as numbers map
        let hp;
        if(this.monster != undefined) {
            if(this.monster.isBoss) {
                this.monster.enemyHp.getNumberMap().pop();
            }
            hp = this.monster.enemyHp.getNumberMap()
        } else {
            hp = [1,0]
        }

        const req = {
            level: this._currentLevel.level,
            hp: hp,
        } as LevelReq

        socketService.emit('levelInfosRequest', req)
    }

    /**
     * Handles the response of a new monster
     * @param data
     * @private
     */
    private handleMonsterRequest(data: MonsterRes)
    {
        if(this._monster != undefined)
        {
            this._monster.unbindEvents();
        }

        this._monster = new Monster(data)

        //level init after new monster to apply the limit
        this._currentLevel.init(
            this._monster.isBoss
        )

        this.updateDisplays()
    }

    /**
     * Bind events of the DOM to the handler
     * @private
     */
    private bindEvents(): void
    {
        window.addEventListener('levelChangeAttempt', (event: LevelChangeEvent) => {
            if(event.isValidMovement) {
                this.handleLevelChangeEvent(event)
            }
        });

        window.addEventListener('monsterKill', (event: MonsterKillEvent) => {
            this.handleMonsterKillEvent(event)
        })

        gameTickHandler.onTick(() => {
            this.updateDisplays()
        })

        //handles the response of the server for a level information request
        socketService.on("levelInfosResponse", (data: any) => {
            const final = data.enemy as MonsterRes;
            this.handleMonsterRequest(final)
        })

        displayService.getDisplay('monster')
            .addEventListener('click', (event: Event) => {
                event.preventDefault();
                const clickDamage = new Exponent(1)
                const targetEvent = new MonsterDamageEvent(clickDamage)
                window.dispatchEvent(targetEvent)
            })

        displayService.getDisplay('previous')
            .addEventListener("click", (event: Event) => {
                event.preventDefault();
                const targetEvent = new LevelChangeEvent(
                    LevelChangeType.LEVEL_DOWN
                )

                window.dispatchEvent(targetEvent);
            })

        displayService.getDisplay('next')
            .addEventListener("click", (event: Event) => {
                event.preventDefault();

                const targetEvent = new LevelChangeEvent(
                    LevelChangeType.LEVEL_UP
                )

                window.dispatchEvent(targetEvent);
            })
    }


    /**
     * Handles the killing of a monster
     * @param event
     * @private
     */
    private handleMonsterKillEvent(event: MonsterKillEvent): void
    {
        //getting gold (already parsed)
        const gold: Exponent = this._monster.enemyGold
        //apply gold adding
        const goldEvent = new MoneyReceivedEvent(gold)
        window.dispatchEvent(goldEvent)

        //add progress to current level
        this._currentLevel.addToProgression()

        //new monster request to the server
        this.monsterRequest()
    }

    /**
     * Handles the level change event
     * @param event
     * @private
     */
    private handleLevelChangeEvent(event: LevelChangeEvent): void
    {
        if(event.isValidMovement) {
            this._currentLevel = new Level(event.nextLevel);

            if(event.nextLevel > this._pb.level) {
                this._pb = this._currentLevel;
            }

            this.monsterRequest();
        }
    }

    /**
     * Updates the different displays related to the level
     * @private
     */
    private updateDisplays(): void
    {
        //updates & level the monster display
        if(this._monster!= undefined) {
            this._monster.updateMonster(true);
        }

        if(this._currentLevel!= undefined) {
            this._currentLevel.updateLevelUI();
        }
    }

    get monster(): Monster { return this._monster; }
    get currentLevel(): Level { return this._currentLevel; }
    get pb(): Level { return this._pb; }

}

export const levelsHandler: LevelsHandler = new LevelsHandler();
