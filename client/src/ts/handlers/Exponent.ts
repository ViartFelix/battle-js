import PrecisionContract from "../contracts/PrecisionContract";
import ExponentException from "../Exceptions/ExponentException";

export default class Exponent extends PrecisionContract
{
    private readonly original: string;

    /** The first part of the decimal number */
    private decimal: number;
    /** The exponent */
    private exponent: number;

    /** Number of exponent without any decimals */
    private exponentWithoutDecimal: number;

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
     * @param show
     */
    public parse(number?: string|undefined, show?: boolean): this
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
            //splitting the string with the 'e'
            const split = toParse.split('e')
            //raw decimal
            const rawDecimal = split.at(0)
            //raw exponent
            const rawExponent = parseInt(split.at(1));

            //and we get how much we have to deduct from the exponent via the number of digits after the dot
            const splitDecimals = rawDecimal.toString().split('.');
            //how many decimals to deduct from the exponent if they are some
            const toDeduct = (
                splitDecimals[1] ?? ""
            ).length;

            this.exponentWithoutDecimal = rawExponent - toDeduct
            //setting the exponent (right-side of the number)
            this.exponent = rawExponent;
            //setting the decimals by rounding it
            this.decimal = super.round(rawDecimal);
        } else {
            const fresh = super.parseDecimals(toParse.split(''));
            //putting the data into the object
            this.exponent = fresh.length
            this.decimal = parseFloat(fresh.join(""))
        }

        return this;
    }

    /**
     * Adds two numbers together
     * @param numberTwo
     */
    public add(numberTwo: Exponent)
    {
        //if the 2 numbers are addable
        if(this.isAddable(numberTwo)) {
            //we get the 2 maps, and sort them from biggest to smallest
            const maps = [
                this.getNumberMap(),
                numberTwo.getNumberMap(),
            ].sort((a: number[], b: number[]) => b.length - a.length);
            //we fetch the biggest and smallest array. Note: the reverse is intentional
            const max = maps.at(0).reverse(), min = maps.at(1).reverse();

            /** The final array, to parse after the addition. Array of string for super.parseDecimals */
            const final: Array<number> = new Array<number>(max.length).fill(0);
            /** The rest to transport to the array at the next iteration. */
            let carry = 0;

            //we iterate in the max array
            for(let i = 0; i < max.length; i++) {
                //max and min digits
                const digitMax = max[i] ?? 0;
                const digitMin = min[i] ?? 0;

                //the sum
                const sum = (digitMax + digitMin + carry);
                //we push the sum into the final array
                final[i] = sum % 10;
                //we add the carry for next loop
                carry = Math.floor(sum / 10);
            }
            //if they are any carry after the loop
            if(carry > 0) {
                //we push the carry into the final array
                final.push(carry)
            }

            //We put the result to the current number, and that's it, we've added the two numbers !
            const fresh: Array<string> = super.parseDecimals(final.reverse().map(String))
            this.exponent = max.length - 1
            this.decimal = super.round(parseFloat(fresh.join("")))
        } else {
            //if the exponent of number 2 is superior to the current exponent
            if(numberTwo.exponent > this.exponent) {
                //then we replace data in current number for number 2
                this.exponent = numberTwo.exponent
                this.decimal = numberTwo.decimal
            }
        }
        return this;
    }

    /**
     * Returns an array representing the digits of the number. <br>
     * Example: 1.2e5 = ``[1,2,0,0,0,0]``
     */
    public getNumberMap(): Array<number>
    {
        //final array
        const final: Array<number> = Array();
        //we fill the array with zeros
        for(let i = 0; i < this.exponent + 1; i++) {
            final.push(0);
        }

        //split the decimals at the dot if there is some
        const splitDecimal = this.decimal.toString().split(".")

        //if they are any decimals
        if(splitDecimal.length > 1) {
            //then we convert all decimals as numbers
            const decimalsSplit = splitDecimal.at(1).split("").map(Number)
            //and we put the corresponding numbers into the array after the first element
            //as they are the numbers after the dot in the number
            final.splice(1, decimalsSplit.length, ...decimalsSplit);

            //for bug: 1.25e7 = array 7 length && 1e7 = array 8 length.
            for(let i = 0; i < decimalsSplit.length - super.getPrecision(); i++) {
                final.push(0)
            }
        }

        //then we replace the first element with the first number, before the dot
        final.splice(0, 1, parseInt(splitDecimal.at(0)))
        //and we have the digit map !
        return final
    }


    /**
     * Determines if two numbers are addable by comparing exponents
     * @param numberTwo The number to be compared
     */
    public isAddable(numberTwo: Exponent): boolean
    {
        const max = Math.max(this.exponent, numberTwo.exponent)
        const min = Math.min(this.exponent, numberTwo.exponent)

        const difference = max - min
        return difference <= super.getPrecision();
    }

    /**
     * Gets the raw number of the calculated decimals and exponent
     * WARNING: Can break if number is too high
     */
    public getRawNumber(): number
    {
        return Math.floor(this.decimal * Math.pow(10, this.exponent))
    }

    /**
     * Returns the class as string (mainly for display)
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
