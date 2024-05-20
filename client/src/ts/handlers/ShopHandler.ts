import { socketService } from "../services/SocketService";
import Hero from "../models/Hero";
import Exponent from "./Exponent";
import MoneyReceivedEvent from "../events/MoneyReceivedEvent";
import {displayService} from "../services/DisplayService";


class ShopHandler {
    private container: HTMLElement;
    private money: Exponent;

    constructor() {
        this.container = document.querySelector("[data-el='shop'] div.shop-container")
        this.money = new Exponent("0").parse();
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

                //tl;dr: cloning template and adding it to the shop
                clean
                    .cloneShopItem()
                    .putAttributes()
                    .bindEvents()
                    .appendToShop(this.container)
            }
        })
    }

    /**
     * Bind DOM events to the shop
     * @private
     */
    private bindEvents(): void
    {
        //custom money receive event
        window.addEventListener('moneyReceive', (event: MoneyReceivedEvent) => {
            const amount = event.amount
            this.money.add(amount)
            displayService.updateDisplay('gold', this.money)
        })
    }


}

export const shopHandler = new ShopHandler();
