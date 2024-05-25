import Model from "./Model";
import {displayService} from "../services/DisplayService";
import Exponent from "../handlers/Exponent";
import MonsterRes from "../reqRes/MonsterRes";
import MonsterDamageEvent from "../events/MonsterDamageEvent";
import MonsterKillEvent from "../events/MonsterKillEvent";
import LevelChangeEvent, {LevelChangeType} from "../events/LevelChangeEvent";
import OnTickEvent from "../events/OnTickEvent";

export default class Monster extends Model
{
    /** Original monster HP */
    private readonly _originalHp: Exponent;
    /** Current monster HP */
    private readonly _enemyHp: Exponent;
    /** Current dropped gold by zone */
    private readonly _enemyGold: Exponent;
    /** The monster displayed name */
    private readonly _monsterName: string;

    /** If the level indicated is a boss level */
    private readonly _isBoss: boolean = false;
    /** Id of the monster */
    private readonly _id: number;

    /** "Binder" of the monster damage handler to store events  */
    private readonly monsterDamageHandlerBound: (event: MonsterDamageEvent) => void;
    private readonly tickHandlerBound: (event: OnTickEvent) => void;

    /** Used to time if boss is dead or not */
    private _timeLimit: Date|undefined;

    /** Number of seconds for a boss to defeat him */
    private readonly _secondsForBoss: number = 30;


    constructor(monsterRep: MonsterRes)
    {
        super();

        //get monster hp and parse it
        const monsterHp = monsterRep.hp.map(String).join("");
        this._enemyHp = new Exponent(monsterHp).parse();
        //detached instance for current hp
        this._originalHp = new Exponent(monsterHp).parse();

        //same with the money drops
        const monsterGold = monsterRep.money.map(String).join("");
        this._enemyGold = new Exponent(monsterGold).parse();

        this._monsterName = monsterRep.name;
        this._isBoss = monsterRep.isBoss;
        this._id = monsterRep.id;

        //bind the binder to the handler
        this.monsterDamageHandlerBound = this.monsterDamageHandler.bind(this)
        this.tickHandlerBound = this.onGameTick.bind(this)

        this.init()
    }

    /**
     * Initializes the monster
     * @private
     */
    private init(): void
    {
        if(this._isBoss) {
            //set a time limit for the boss, not as a timeout
            this._timeLimit = new Date(Date.now() + (this._secondsForBoss * 1000));
        }

        this.bindEvents()
    }

    /**
     * Binds events of the DOM to handle
     * @private
     */
    private bindEvents(): void
    {
        window.addEventListener("monsterDamage", this.monsterDamageHandlerBound);
        //here a window listener or else you'll be thrown back at the first level if you don't defeat the boss on time
        window.addEventListener("tick", this.tickHandlerBound);
    }

    /**
     * Unbinds events of the DOM
     */
    public unbindEvents(): void
    {
        window.removeEventListener("monsterDamage",this.monsterDamageHandlerBound);
        window.removeEventListener("tick", this.tickHandlerBound);
    }

    public onGameTick(handler: Event): void
    {
        //if it's a boss, check if time remaining is 0 or less
        if(this._isBoss && this.getRemainingTime() <= 0) {
            //then we throw to the previous level the player
            const event = new LevelChangeEvent(LevelChangeType.LEVEL_DOWN)
            window.dispatchEvent(event)
        }
        //update the monster hp, and time
        this.updateMonster(false)
    }

    /**
     * Handles the monster damage event
     * @param event
     * @private
     */
    private monsterDamageHandler(event: MonsterDamageEvent): void
    {
        //get and apply the damage to the monster
        const damage: Exponent = event.damage
        //new instance of the monster hp, to run calculations after
        const hpMap = this.enemyHp.getNumberMap()
        const hpNew = new Exponent(hpMap).parse()
        //because of how subtraction is calculated, it will return 0 if the 2 numbers are can't be subtracted
        /** Next future damage */
        const futureHp: Exponent = hpNew.subtract(damage)
        /** if at next tick, the monster is dead */
        const isDead: boolean = futureHp.decimal === 0 && futureHp.exponent === 0

        if(isDead) {
            //tell the whole app that the monster is dead
            const changeMonster = new MonsterKillEvent()
            window.dispatchEvent(changeMonster)
        } else {
            this.enemyHp.subtract(damage)
        }
    }

    /**
     * Updates all displays related to the monster
     */
    public updateMonster(updateImage: boolean = false)
    {
        //update the hp display
        displayService.updateDisplay('current-hp', this._enemyHp)
        displayService.updateDisplay('monster-name', this._monsterName)
        //if it's a boss, then show the boss timer bar
        if(this.isBoss) {
            displayService.getDisplay('timer-bar').classList.remove("hidden")
            displayService.updateDisplay('current-time', this.getRemainingTime())
        } else {
            displayService.getDisplay('timer-bar').classList.add("hidden")
        }

        if(updateImage) {
            //update the monster image
            displayService.updateDisplayAttr('monster', "src", this.getMonsterImage(this._id))

            displayService.getDisplay('monster').classList.add(this._isBoss ? 'boss' : "monster")
            displayService.getDisplay('monster').classList.remove(!this._isBoss ? 'boss' : "monster")
        }

        //now, we'll update the hp & time bar
        const hpBar = this._enemyHp
    }

    /**
     * Gets the remaining time of the boss if it's one.
     */
    public getRemainingTime(): number
    {
        if(this.isBoss && this._timeLimit) {
            //raw number of milliseconds remaining
            const remainingTimeRaw: number = this._timeLimit!.getTime() - new Date().getTime()
            //cleaned time, displayed as XX.XX seconds
            const remainingTime = Math.floor(remainingTimeRaw / 10) / 100
            return remainingTime;
        } else {
            return 0
        }
    }

    /**
     * Returns the monster image url
     * @param id
     * @private
     */
    private getMonsterImage(id: number): string
    {
        return "enemies/" + id + ".png"
    }

    get enemyHp(): Exponent { return this._enemyHp; }
    get enemyGold(): Exponent { return this._enemyGold; }
    get isBoss(): boolean { return this._isBoss; }
    get id(): number { return this._id; }
    get monsterName(): string { return this._monsterName; }
    get timeLimit(): Date | undefined { return this._timeLimit; }

    get originalHp(): Exponent { return this._originalHp; }
    get secondsForBoss(): number { return this._secondsForBoss; }
}
