import {gameTickHandler} from "./GameTickHandler";
import HandlersContract from "../contracts/HandlersContract";
import Exponent from "./Exponent";
import OnTickEvent from "../events/OnTickEvent";
import {displayService} from "../services/DisplayService";
import HeroBuyEvent from "../events/HeroBuyEvent";
import {levelsHandler} from "./LevelsHandler";
import MonsterDamageEvent from "../events/MonsterDamageEvent";

class DamageHandler implements  HandlersContract
{
    /** Current damage */
    private _currentDamage: Exponent;
    /** Array of heroes different DPSes */
    private readonly _heroesDPS: Map<number, Exponent>;

    private _nbrTick: number = 0;

    constructor() {
        this._heroesDPS = new Map<number, Exponent>();
        this._currentDamage = new Exponent(0).parse();
    }

    /**
     * Initialises the damage handler.
     */
    public init()
    {
        this._currentDamage = new Exponent(0).parse()

        //every second
        gameTickHandler.onTick((event: OnTickEvent)=>{
            this.handleTick(event)
            this._nbrTick++
        }, 1)

        window.addEventListener('heroBuy', (event: HeroBuyEvent)=>{
            this.handleHeroBuy(event)
        })
    }

    /**
     * Handles the tick (updates the DPS and damages the monster)
     * @param event
     * @private
     */
    private handleTick(event: OnTickEvent)
    {
        const damage = this._currentDamage.getNumberMap()

        if(damage.length > 2) {
            const targetEvent = new MonsterDamageEvent(new Exponent(damage).parse())
            window.dispatchEvent(targetEvent)

        } else if(this._nbrTick % 100 === 0) {
            const targetEvent = new MonsterDamageEvent(new Exponent(damage).parse())
            window.dispatchEvent(targetEvent)
        }

       this.updateUI()
    }

    /**
     * Handles the total damage application to heroes
     * @param event
     * @private
     */
    private handleHeroBuy(event: HeroBuyEvent)
    {
        //if the hero is not in the map, we add it
        if(!this._heroesDPS.has(event.id)) {
            this._heroesDPS.set(event.id, event.addDPS)
        } else {
            //get hero DPS
            const currentDPS = this._heroesDPS.get(event.id)
            //add the new DPS to the current one
            const final = currentDPS.add(event.addDPS)
            this._heroesDPS.set(event.id, final)
        }

        //and in any case, we add all numbers together to have a final DPS
        for(const [key, value] of this._heroesDPS) {
            this._currentDamage = this._currentDamage.add(value)
        }
    }

    /**
     * Updates the UI
     * @private
     */
    private updateUI()
    {
        if(levelsHandler.monster !== undefined) {
            //current HP
            const hpMap = levelsHandler.monster.enemyHp.getNumberMap()
            const hp = new Exponent(hpMap).parse()
            //original HP
            const ogHpMap = levelsHandler.monster.originalHp.getNumberMap()
            const ogHp = new Exponent(ogHpMap).parse()
            //percentage of remaining HP
            const percent: number = hp.multiply(100).divide(ogHp)
            displayService.getDisplay('hp-bar-graph').style.width = `${percent}%`

            if(levelsHandler.monster.isBoss) {
                //date time limit
                const limit: Date = levelsHandler.monster.timeLimit
                //divided by 1000 because limit - now returns milliseconds
                const remainingTime: number = (limit.getTime() - new Date().getTime()) / 1000
                /** Percentage of time remaining */
                const percentTime: number = (remainingTime / levelsHandler.monster.secondsForBoss) * 100

                displayService.getDisplay('hp-timer-graph').style.width = `${percentTime}%`
            }
        }


        displayService.updateDisplay('dps', this._currentDamage.toString())
    }


}

export const damageHandler = new DamageHandler()
