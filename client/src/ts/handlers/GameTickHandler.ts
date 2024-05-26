import OnTickEvent from "../events/OnTickEvent";
import HandlersContract from "../contracts/HandlersContract";

class GameTickHandler implements HandlersContract {

    private readonly _interval: number = 10;

    constructor() {
    }

    /**
     * Initiates the game tick handler
     */
    public init(): void
    {
        setInterval(() => {
            const event = new OnTickEvent()
            window.dispatchEvent(event)
        }, this._interval)
    }

    /**
     * Binds an event on game tick (every 10 ms)
     * @param handler Handler of the function
     * @param every How much every tick the event should be called. Default is 1.
     */
    public onTick(handler: Function, every: number|undefined = 1)
    {
        let called: number = 0;
        window.addEventListener('tick', (event: Event) => {
            if(called % every === 0) {
                handler(event)
            }

            called++;
        })
    }

    get interval(): number { return this._interval; }
}

export const gameTickHandler: GameTickHandler = new GameTickHandler();
