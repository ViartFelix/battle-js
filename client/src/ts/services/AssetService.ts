import ServiceContact from "../contracts/ServiceContact";

class AssetService implements ServiceContact {
    constructor() {
    }

    init(): void {}

    /**
     * Gets a url for a hero image
     * @param id
     */
    public hero(id: number): any {
        return "class/"+id+".png"
    }

    /**
     * Returns a url for a enemy image
     * @param id
     */
    public ennemy(id: number): any {
        return "enemies/"+id+".png"
    }


}

export const assetService = new AssetService();
