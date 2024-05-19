export default class ExponentException extends Error {
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ExponentException.prototype);
    }
}
