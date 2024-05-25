import {fsService} from "./FsService";
import Hero from "../models/Hero";

class ClassService
{
    /** Holds all raw data of classes */
    private raw: Array<any> | undefined;

    /** Holds all cleaned data */
    private data: Array<Hero> = Array();

    constructor() {
        this.init()
    }

    /**
     * Initialise the service by getting the necessary data
     */
    private init()
    {
        const buffer = fsService.getDataFile('heroes.json')
        //parsing the JSON data
        this.raw = JSON.parse(buffer.toString())
        //cleaning the json parsed data
        this.raw?.forEach((cls) => {
            //"clean" hero as class & adding the data
            this.data.push(cls as Hero)
        })
    }

    /**
     * Get all classes data
     */
    public getClasses(): Array<Hero>
    {
        return this.data
    }

    /**
     * Get raw parsed data from the data/heroes.json file
     */
    public getClassesRaw(): Array<any>
    {
        return this.raw ?? [];
    }
}


export const classService: ClassService = new ClassService();
