import Exponent from "../handlers/Exponent";

export default class MonsterDamageEvent extends Event {
    /** Damage to apply to the monster */
    private readonly _damage: Exponent;

    constructor(damage: Exponent) {
        super('monsterDamage');
        damage.parse();
        this._damage = damage;
    }

    get damage(): Exponent { return this._damage; }
}
