import OnTickEvent from "../events/OnTickEvent";

class GameTickHandler {
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
        }, 10)
    }

    /**
     * Binds an event on game tick (every 10 ms)
     * @param handler Handler of the function
     */
    public onTick(handler: Function)
    {
        window.addEventListener('tick', (event: Event) => {
            handler(event)
        })
    }
}

export const gameTickHandler: GameTickHandler = new GameTickHandler();
