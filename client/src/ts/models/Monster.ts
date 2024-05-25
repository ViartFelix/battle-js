import Model from "./Model";
import {displayService} from "../services/DisplayService";
import Exponent from "../handlers/Exponent";
import MonsterRes from "../reqRes/MonsterRes";
import MonsterDamageEvent from "../events/MonsterDamageEvent";
import MonsterKillEvent from "../events/MonsterKillEvent";

export default class Monster extends Model
{
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


    constructor(monsterRep: MonsterRes)
    {
        super();

        //get monster hp and parse it
        const monsterHp = monsterRep.hp.map(String).join("");
        this._enemyHp = new Exponent(monsterHp).parse();

        //same with the money drops
        const monsterGold = monsterRep.money.map(String).join("");
        this._enemyGold = new Exponent(monsterGold).parse();

        this._monsterName = monsterRep.name;
        this._isBoss = monsterRep.isBoss;
        this._id = monsterRep.id;

        //bind the binder to the handler
        this.monsterDamageHandlerBound = this.monsterDamageHandler.bind(this)

        this.bindEvents()
    }

    /**
     * Binds events of the DOM to handle
     * @private
     */
    private bindEvents(): void
    {
        window.addEventListener("monsterDamage", this.monsterDamageHandlerBound);
    }

    /**
     * Unbinds events of the DOM
     */
    public unbindEvents(): void
    {
        window.removeEventListener("monsterDamage",this.monsterDamageHandlerBound);
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

        //if the monster will be dead
        if(futureHp.decimal === 0 && futureHp.exponent === 0) {
            //tell the whole app that the monster is dead
            const changeMonster = new MonsterKillEvent()
            window.dispatchEvent(changeMonster)
        } else {
            this.enemyHp.subtract(damage)
        }

        //in any case, updates the monster display
        this.updateMonster(false)
    }

    /**
     * Updates all displays related to the monster
     */
    public updateMonster(updateImage: boolean = false)
    {
        //update the hp display
        displayService.updateDisplay('current-hp', this._enemyHp)
        displayService.updateDisplay('monster-name', this._monsterName)

        if(updateImage) {
            //update the monster image
            displayService.updateDisplayAttr('monster', "src", this.getMonsterImage(this._id))

            displayService.getDisplay('monster').classList.add(
                this._isBoss ? 'boss' : "monster"
            )
        }
    }

    /**
     * Requests damaging to the monster
     * @private
     */
    public damage(damage: Exponent): void
    {
        this.enemyHp.subtract(damage);

        this.updateMonster(false)
        //TODO: faire soustraction du damage dans levelHandler (méthode)
        //updater the monstre
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
}
