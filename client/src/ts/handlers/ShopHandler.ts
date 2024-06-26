import { socketService } from "../services/SocketService";
import Hero from "../models/Hero";
import Exponent from "./Exponent";
import MoneyReceivedEvent from "../events/MoneyReceivedEvent";
import {displayService} from "../services/DisplayService";
import HeroBuyEvent from "../events/HeroBuyEvent";
import HandlersContract from "../contracts/HandlersContract";
import {gameTickHandler} from "./GameTickHandler";


class ShopHandler implements HandlersContract
{

    private readonly _container: HTMLElement;
    private readonly _money: Exponent;

    private readonly _heroes: Array<Hero> = [];

    constructor() {
        //binds container
        this._container = document.querySelector("[data-el='shop'] div.shop-container")
        this._money = new Exponent("0").parse();
    }

    /**
     * Init the shop
     */
    public init()
    {
        this.bindSockets()
        this.bindEvents()
    }

    /**
     * Bind sockets' events
     * @private
     */
    private bindSockets(): void
    {
        //bind shop receiving data
        socketService.on('shop', (val: any) => {
            for(const hero of val) {
                //new hero
                const clean = new Hero(hero.id, hero.name, hero.tier, hero.price, hero.dmg)

                this._heroes.push(clean);

                //tl;dr: cloning template and adding it to the shop
                clean
                    .cloneShopItem()
                    .putAttributes()
                    .bindEvents()
                    .appendToShop(this._container)
            }
        })
    }

    /**
     * Bind DOM events to the shop
     * @private
     */
    private bindEvents(): void
    {
        gameTickHandler.onTick(()=>{
            this.updateDisplays()
        })

        //custom money receive event
        window.addEventListener('moneyReceive', (event: MoneyReceivedEvent) => {
            const amount = event.amount
            this._money.add(amount)
        })

        window.addEventListener('heroBuy', (event: HeroBuyEvent) => {
            this._money.subtract(event.price)
        })
    }

    /**
     * Updates the different displays related to the shop (especially money)
     * @private
     */
    private updateDisplays(): void
    {
        displayService.updateDisplay('gold', this._money)
    }


    get container(): HTMLElement { return this._container; }
    get money(): Exponent { return this._money; }
    get heroes(): Array<Hero> { return this._heroes; }
}

export const shopHandler = new ShopHandler();
