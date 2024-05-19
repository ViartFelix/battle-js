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
    }


}

export const displayService: DisplayService = new DisplayService()
