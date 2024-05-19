import PrecisionContract from "../contracts/PrecisionContract";
import ExponentException from "../Exceptions/ExponentException";

export default class Exponent extends PrecisionContract
{
    private readonly original: string;

    /** The first part of the decimal number */
    private decimal: number;
    /** The exponent */
    private exponent: number;

    constructor(number?: number|string|undefined) {
        super();

        if(typeof number !== "undefined") {
            this.original = number.toString().toLowerCase();
        }
    }

    /**
     * Parses the number if one provided <br>
     * If no number is provided, will parse the number contained in the constructor <br>
     * If either are undefined, then an exception will be thrown.
     * @exception ExponentException
     * @param number
     */
    public parse(number?: string|undefined): this
    {
        if(typeof number === "undefined" && typeof this.original === "undefined") {
            throw new ExponentException("The provided number and the number fed to the constructor is undefined.")
        }

        /** The variable to parse */
        const toParse = (
            number !== undefined
                ? number.toLowerCase()
                : this.original
        );

        //if includes an exponent
        if(toParse.includes("e")) {
            //splitting the string without the 'e'
            const split = toParse.split('e')
            //setting the exponent (right-side of the number)
            this.exponent = parseInt(split.at(1));
            //setting the decimals by rounding it
            this.decimal = super.round(split.at(0));
        } else {
            const fresh = super.parseDecimals(toParse.split(''));

            //putting the data into the object
            this.exponent = fresh.length - 1
            this.decimal = parseFloat(fresh.join(""))
        }

        return this;
    }

    /**
     * Gets the raw number of
     */
    public getRawNumber(): number
    {
        return Math.floor(this.decimal * Math.pow(10, this.exponent))
    }

    /**
     * Returns the class as string
     */
    public toString(): string
    {
        //the number of digits is less than the raw display threshold
        if(this.exponent < super.getDisplayThreshold()) {
            //then return a parsed number (already string)
            return this.getRawNumber().toString()
        } else {
            //else we return the decimals version
            return `${this.decimal}e${this.exponent}`
        }
    }
}
