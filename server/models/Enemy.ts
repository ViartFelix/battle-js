export default interface Enemy
{
    /** Name of the enemy */
    name: string;
    /** Tier of the enemy */
    tier: number;
    /** ID of the enemy */
    id: number;
    /** HP of the enemy */
    hp: Array<number>;
    /** Money dropped */
    money: Array<number>;
    /** If the enemy is a boss */
    isBoss: boolean;
}
