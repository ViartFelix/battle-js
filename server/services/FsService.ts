import fs from "fs"
import * as path from "node:path";

class FsService {

    /** The base directory */
    public readonly base: string;

    constructor() {
        this.base = path.resolve(__dirname,"../");
    }

    /**
     * Get the contents of a file.
     * @param path The relative path from the server
     */
    public getFile(path: string): Buffer
    {
        return fs.readFileSync(path)
    }

    /**
     * Get a file in the 'data' folder
     * @param name
     */
    public getDataFile(name: string): Buffer
    {
        return fs.readFileSync(this.base+"/data/"+name)
    }

    /**
     * Override files
     * @param name
     * @param data
     */
    public overrideFile(name: string, data: any): void
    {
        const dt = JSON.stringify(data);
        fs.writeFileSync(this.base+"/data/"+name, dt)
    }
}

export const fsService: FsService = new FsService()
