import { socketService } from "../services/SocketService";
import Hero from "../models/Hero";

class ShopHandler {
    private container: HTMLElement;


    constructor() {
        this.container = document.querySelector("[data-el='shop'] div.shop-container")
    }

    /**
     * Init the shop
     */
    public init() {
        socketService.on('shop', (val: any) => {
            for(const hero of val) {
                const clean = new Hero(
                    hero.id,
                    hero.name,
                    hero.tier,
                    hero.price,
                    hero.dmg
                )

                clean
                    .cloneShopItem()
                    .putAttributes()
                    .bindEvents()
                    .appendToShop(this.container)
            }
        })
    }

}

export const shopHandler = new ShopHandler();
