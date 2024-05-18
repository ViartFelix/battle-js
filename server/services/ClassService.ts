import {fsService} from "./FsService";
import Class from "../models/Hero";

class ClassService
{
    /** Holds all raw data of classes */
    private raw: Array<any> | undefined;

    /** Holds all cleaned data */
    private data: Array<Class> = Array();

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
            this.data.push(cls as Class)
        })
    }

    /**
     * Get all classes data
     */
    public getClasses(): Array<Class>
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
