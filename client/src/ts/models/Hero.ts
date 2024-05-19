import Model from "./Model";
import Exponent from "../handlers/Exponent";
import {assetService} from "../services/AssetService";

export default class Hero extends Model {
    private readonly _name: string;
    private readonly _tier: number;
    private readonly _price: Exponent;
    private readonly _damage: Exponent;

    private readonly _id: number;

    /** The current template */
    private shopTemplate: HTMLElement;

    constructor(
        id: number,
        name: string,
        tier: number,
        price: Exponent|string|number,
        damage: Exponent|string|number,
    ) {
        super();

        this._id = id;
        this._name = name;
        this._tier = tier;

        this._price = (
            typeof price === 'number' || typeof price === 'string'
                ? new Exponent(price)
                : price
        ).parse()

        this._damage = (
            typeof damage === 'number' || typeof damage === 'string'
                ? new Exponent(damage)
                : damage
        ).parse()
    }

    /**
     * Copies the shop item template of the shop
     */
    public cloneShopItem(): this
    {
        this.shopTemplate = super
            .cloneTemplate('shop-item')
            .querySelector('.shop-item') as HTMLElement;

        return this;
    }

    /**
     * Put all attributes in the template
     */
    public putAttributes(): this
    {
        this.shopTemplate.setAttribute('data-shop-id', this._id.toString())
        this.shopTemplate.querySelector("[data-display='class-img']")
            .setAttribute('src', assetService.hero(this._id))

        this.shopTemplate.querySelector("[data-display='class-name']")
            .textContent = this._name

        this.shopTemplate.querySelector("[data-display='class-level']")
            .textContent = "0"

        this.shopTemplate.querySelector("[data-display='class-gold']")
            .textContent = this._price.toString()

        this.shopTemplate.querySelector("[data-display='class-dps']")
            .textContent = this._damage.toString()

        //TODO: Remove
        //this.shopTemplate.classList.add("locked")

        return this;
    }

    /**
     * Bind events to the template
     */
    public bindEvents(): this
    {
        return this;
    }

    /**
     * Append the element to the shop
     * @param container The shop container HTML Element
     */
    public appendToShop(container: HTMLElement): this
    {
        container.append(this.shopTemplate);
        return this;
    }




    get name(): string { return this._name; }
    get tier(): number { return this._tier; }
    get price(): Exponent { return this._price; }
    get damage(): Exponent { return this._damage; }
    get id(): number {return this._id;}

}
