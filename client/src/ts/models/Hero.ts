import Model from "./Model";
import Exponent from "../handlers/Exponent";
import {assetService} from "../services/AssetService";
import {shopHandler} from "../handlers/ShopHandler";
import MoneyReceivedEvent from "../events/MoneyReceivedEvent";
import HeroBuyEvent from "../events/HeroBuyEvent";
import {gameTickHandler} from "../handlers/GameTickHandler";

export default class Hero extends Model {


    private readonly _name: string;
    private readonly _tier: number;
    /** Current price */
    private _price: Exponent;
    /** Current damage */
    private _damage: Exponent;
    /** The base damage */
    private readonly _baseDamage: Exponent;
    private readonly _id: number;

    /** The level of the hero */
    private _level: number;

    /** The current template */
    private _shopTemplate: HTMLElement;

    /** The current HTML shop element in the DOM */
    private _currentShopElement: HTMLElement;

    constructor(
        id: number,
        name: string,
        tier: number,
        price: Exponent|string|number,
        damage: Exponent|string|number,
    ) {
        super();
        this._level = 0;

        this._id = id;
        this._name = name;
        this._tier = tier;

        this._price = (
            typeof price === 'number' || typeof price === 'string'
                ? new Exponent(price)
                : price
        ).parse()

        this._baseDamage = (
            typeof damage === 'number' || typeof damage === 'string'
                ? new Exponent(damage)
                : damage
        ).parse()

        this._damage = new Exponent(0).parse()

        this.updateUI()
    }

    /**
     * Copies the shop item template of the shop
     */
    public cloneShopItem(): this
    {
        this._shopTemplate = super
            .cloneTemplate('shop-item')
            .querySelector('.shop-item') as HTMLElement;

        return this;
    }

    /**
     * Put all attributes in the template
     */
    public putAttributes(): this
    {
        this._shopTemplate.setAttribute('data-shop-id', this._id.toString())
        this._shopTemplate.querySelector("[data-display='class-img']")
            .setAttribute('src', assetService.hero(this._id))

        this._shopTemplate.querySelector("[data-display='class-name']")
            .textContent = this._name

        this._shopTemplate.querySelector("[data-display='class-level']")
            .textContent = "0"

        this._shopTemplate.querySelector("[data-display='class-gold']")
            .textContent = this._price.toString()

        this._shopTemplate.querySelector("[data-display='class-dps']")
            .textContent = this._damage.toString()

        //class to make hero invisible in the shop
        this.shopTemplate.classList.add("locked")

        return this;
    }

    /**
     * Bind events to the template
     */
    public bindEvents(): this
    {
        //when the button for the level Up button is clicked
        this._shopTemplate.querySelector("[data-button='lvl-up']")
           .addEventListener('click', (event: Event) => {
               this.handleHeroBuyAttempt(event)
           })

        window.addEventListener("moneyReceive", (event: MoneyReceivedEvent) => this.handleMoneyReceive(event));
        window.addEventListener('heroBuy', (event: HeroBuyEvent) => this.heroBuyLevel(event));

        gameTickHandler.onTick(()=>{
            this.updateUI()
        }, 20)


        return this;
    }

    /**
     * Checks if the hero can be bought.
     * If yes, emit an event named 'heroBuy'
     * @private
     */
    private handleHeroBuyAttempt(event: Event)
    {
        event.preventDefault()
        //current money
        const currentMoney: Exponent = shopHandler.money;
        //if can be bought
        if(currentMoney.canSubstract(this.price)) {
            //emit global event that a hero is bought
            const event = new HeroBuyEvent(this._id, this._price, this.getNextDmgLvl());
            window.dispatchEvent(event);
        } else {
            //TODO: Change this to custom snackBar
            alert("You don't have enough money to buy this hero!")
        }

        this.updateUI();
    }

    /**
     * Handles the purchase of a level of a hero
     * @private
     */
    private heroBuyLevel(event: HeroBuyEvent)
    {
        if(event.id === this._id) {
            //increase level
            this._level++
            //assign next level's damage and gold
            this._price = this.getNextGoldLvl();
            this._damage = this.getNextDmgLvl();
        }

        //update UI
        this.updateUI();
    }

    /**
     * Handles when money is received.
     * @param event
     * @private
     */
    private handleMoneyReceive(event: MoneyReceivedEvent)
    {
        this.updateUI();
    }

    /**
     * Append the element to the shop
     * @param container The shop container HTML Element
     */
    public appendToShop(container: HTMLElement): this
    {
        container.append(this._shopTemplate);
        this._currentShopElement = container.querySelector("[data-shop-id='" + this._id + "']") as HTMLElement;

        return this;
    }

    /**
     * Requests to update hero UI elements.
     */
    public updateUI(): this
    {
        //if the shop element is not appended to the DOM (prevents DOM Error)
        if(this._currentShopElement) {
            const currentMoney: Exponent = (shopHandler.money ?? new Exponent(0).parse());

            if(this._id === 2) {
                //canSubtrack est pété
                currentMoney.canSubstract(this._price, true)
            }

            //if the hero is purchasable, then we mark it as "seen": we can display the hero constantly
            if(currentMoney.canSubstract(this._price)) {
                this._currentShopElement.classList.remove("locked");
            }

            //if the hero is not bought, then we display the base damage. If the hero has a level, we display the current hero damage
            const toDisplay = (this._level > 0? this._damage : this._baseDamage)
            this._currentShopElement.querySelector('[data-display="class-dps"]')
                .textContent = toDisplay.toString()

            this._currentShopElement.querySelector('[data-display="class-gold"]')
                .textContent = this.price.toString()

            this._currentShopElement.querySelector('[data-display="class-level"]')
                .textContent = this._level.toString()
        }

        return this;
    }

    /**
     * Gets the next gold required level of the hero. Applied formula: <br>
     * price + (pricePrevious * 0.1)
     * @private
     */
    private getNextGoldLvl(): Exponent
    {
        //map to avoid passing by reference the price. Reminder, this method just returns the next level price
        // and don't apply the price
        const priceMap = this._price.getNumberMap()
        /** current price of the hero as detached instance */
        const currentPrice = new Exponent(priceMap).parse()
        //the 0.1 mentioned above
        const tenPercent = currentPrice.getTenPercent()
        //and we return the added price to the current price.
        return (currentPrice.add(tenPercent))
    }

    /**
     * Gets the damage for the next level of the hero. Applied formula: <br>
     * damage + (damagePrevious * 0.1)
     * @private
     */
    private getNextDmgLvl(): Exponent
    {
        //if the hero is at least bought once
        const origin: Exponent = (this._level > 1 ? this._damage : this._baseDamage)
        const damageMap = origin.getNumberMap()
        //current damage of the hero as detached instance of the damage
        const currentDamage = new Exponent(damageMap).parse()

        const tenPercent: Exponent = currentDamage.getTenPercent()
        return (currentDamage.add(tenPercent))
    }


    get name(): string { return this._name; }
    get tier(): number { return this._tier; }
    get price(): Exponent { return this._price; }
    get damage(): Exponent { return this._damage; }
    get id(): number {return this._id;}
    get baseDamage(): Exponent { return this._baseDamage; }
    get level(): number { return this._level; }


    get shopTemplate(): HTMLElement { return this._shopTemplate; }
    get currentShopElement(): HTMLElement { return this._currentShopElement; }
}
