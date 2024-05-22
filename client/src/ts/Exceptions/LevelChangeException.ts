export default class LevelChangeException extends Error {
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, LevelChangeException.prototype);
    }
}
