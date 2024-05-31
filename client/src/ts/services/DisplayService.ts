import DisplayException from "../Exceptions/DisplayException";
import ServiceContact from "../contracts/ServiceContact";

class DisplayService implements ServiceContact
{
    constructor() {}

    init(): void {}

    /**
     * Updates an element with a 'data-display' tag
     * @param displayName
     * @param data
     */
    public updateDisplay(displayName: string, data: any)
    {
        const el = document.querySelector(`[data-display=${displayName}]`)

        if(el === null) {
            throw new DisplayException("Element '"+ displayName +"' not found.")
        }

        el.textContent = data.toString()

        return this;
    }

    public updateDisplayAttr(displayName: string, attr: string, value: string)
    {
        const el = document.querySelector(`[data-display=${displayName}]`)

        if(el === null) {
            throw new DisplayException("Element '"+ displayName +"' not found.")
        }

        el.setAttribute(attr, value)

        return this;
    }

    /**
     * Returns an element containing data-display attribute
     * @param displayName
     */
    public getDisplay(displayName: string): HTMLElement
    {
        const el = document.querySelector(`[data-display=${displayName}]`)

        if(el === null) {
            throw new DisplayException("Element '"+ displayName +"' not found.")
        }

        return el as HTMLElement;
    }

    /**
     * Returns an element containing data-el attribute
     * @param elementName
     */
    public getElement(elementName: string): HTMLElement
    {
        const el = document.querySelector(`[data-el=${elementName}]`)

        if(el === null) {
            throw new DisplayException("Element '"+ elementName +"' not found.")
        }

        return el as HTMLElement;
    }

    /**
     * Returns an element containing data-btn attribute
     * @param btnName
     */
    public getBth(btnName: string): HTMLElement
    {
        const el = document.querySelector(`[data-btn=${btnName}]`)

        if(el === null) {
            throw new DisplayException("Button '"+ btnName +"' not found.")
        }

        return el as HTMLElement;
    }
}

export const displayService: DisplayService = new DisplayService()
