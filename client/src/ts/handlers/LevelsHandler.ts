import Level from "../models/Level";
import { displayService } from "../services/DisplayService";
import Monster from "../models/Monster";
import Exponent from "./Exponent";
import MonsterRes from "../reqRes/MonsterRes";
import {socketService} from "../services/SocketService";
import LevelChangeEvent from "../events/LevelChangeEvent";

class LevelsHandler
{

    /*
    init: init le level handler
    bindEvents: binds les events au DOM (
        click monster = dans monstre,
        click previous = ici
        click next = ici
        levelChangeAttempt = ici

    monsterRequest: fait une req au back sur le monstre et handle le monstre
    change Level: check si on peut aller en arrière ou en avant selon l'action
    updateDisplays: met à jour l'affichage des monstres et des niveaux
    )
     */

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
        this._currentLevel = new Level(1)
        this._pb = this._currentLevel
        this.bindEvents();
        this.monsterRequest();
        //this.requestNewMonster()
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

        socketService.emit('levelInfosRequest', {
            level: this._currentLevel,
            hp: hp,
        })
    }

    /**
     * Handles the response of a new monster
     * @param data
     * @private
     */
    private handleMonsterRequest(data: MonsterRes)
    {
        this._monster = new Monster(data)
        this.updateDisplays()
    }

    /**
     * Bind events of the DOM to the handler
     * @private
     */
    private bindEvents(): void
    {
        window.addEventListener('levelChange', (event: LevelChangeEvent) => {

        });

        socketService.on("levelInfosResponse", (data: any) => {
            const final = data.enemy as MonsterRes;
            this.handleMonsterRequest(final)
        })

        /*
        //binds click on the monster image
        displayService.getDisplay('monster')
            .addEventListener('click', (event: Event) => this.monsterClickHandler(event))

        displayService.getDisplay('previous')
            .addEventListener('click', (event: Event) => this.handleLevelProgression(true, event))

        displayService.getDisplay('next')
            .addEventListener('click', (event: Event) => this.handleLevelProgression(false, event))

        socketService.on("levelInfosResponse", (data: any) => {
            const enemyData = data.enemy as MonsterRes;
            this.assignMonsterData(enemyData)
        })
         */
    }



    //TODO: tout refacto en event listener

    /**
     * Handles the progression of the levels
     * @param event
     * @param previous If should advance to previous level
     * @private
     */
    /*
    private handleLevelProgression(previous: boolean, event?: Event): void
    {
        if(event) {
            event.preventDefault();
        }

        if(this._currentLevel.isAbleToGoNextLevel(this._pb)) {
            if(previous) {
                this.changeLevel(this._currentLevel.level - 1)
            } else {
                this.changeLevel(this._currentLevel.level + 1)
            }
        } else {
            this._currentLevel.addToProgression();
        }

        this.updateDisplays()
    }

     */

    /**
     *
     * @private
     */
    /*
    private requestNewMonster(): void
    {
    }

     */

    /**
     * Handles the click on the monster
     * @private
     */
    /*
    private monsterClickHandler(event: Event): void
    {
        event.preventDefault()
        const dmgClick = new Exponent(1).parse()
        //reducing the monster HP by 1
        this._monster.damage(dmgClick)

        if(this._monster.enemyHp.getRawNumber() <= 0) {
            this.handleLevelProgression(false)
            this.requestNewMonster()
        }
    }

     */

    /**
     * Assign the monster data from the socket response
     * @param data
     */
    /*
    public assignMonsterData(data: MonsterRes): void
    {
        this._monster = new Monster(data);
        this.updateDisplays();
    }

     */

    /**
     * Triggers the level change and updates the pb
     * @param nextLevel The level to go
     */
    /*
    private changeLevel(nextLevel: number): void
    {
        this._currentLevel = new Level(nextLevel);
        //if the level is the personal best, update it
        if(this._currentLevel.level > this._pb.level) {
            this._pb = this._currentLevel;
        }

        this.updateDisplays();
    }

     */

    /**
     * Updates the different displays related to the level
     * @private
     */
    private updateDisplays(): void
    {
        this._monster.updateMonster(true);

        /*
        const canGoNext = this._currentLevel.isAbleToGoNextLevel(this._pb);
        const canGoPrev = this._currentLevel.level > 1;


        this._currentLevel.updateLevelUI(
            canGoNext, canGoPrev
        );

         */
    }

    get monster(): Monster { return this._monster; }
}

export const levelsHandler: LevelsHandler = new LevelsHandler();
