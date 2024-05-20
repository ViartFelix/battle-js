export default class DisplayException extends Error {
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DisplayException.prototype);
    }
}