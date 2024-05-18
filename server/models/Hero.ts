export default interface Class
{
    /**  Name of the class */
    name: string;
    /** The target tier of the class */
    tier: number;
    /** The ID of the class */
    id: number;
    /** The class' price */
    price: string | undefined;
    /** The class' base damage */
    dmg: string | undefined;

}
