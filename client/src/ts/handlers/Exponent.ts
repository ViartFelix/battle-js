import PrecisionContract, {PrecisionContractRound} from "../contracts/PrecisionContract";
import ExponentException from "../Exceptions/ExponentException";

export default class Exponent extends PrecisionContract
{
    private readonly _original: string;

    /** The first part of the decimal number */
    private _decimal: number;
    /** The exponent */
    private _exponent: number;

    constructor(number?: number|string|Array<number>|Array<string>|undefined) {
        super();
        //if the number is and array of some sort
        if(typeof number === "object") {
            this._original = number.map((val) => {
                //we'll try to parse the values inside as string numbers
                return val.toString().toLowerCase();
            })
            //and we convert it as a string
            .join("");
        } else {
            this._original = number.toString().toLowerCase();
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
        if(typeof number === "undefined" && typeof this._original === "undefined") {
            throw new ExponentException("The provided number and the number fed to the constructor is undefined.")
        }

        /** The variable to parse */
        const toParse = (
            number !== undefined
                ? number.toLowerCase()
                : this._original
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

            //setting the exponent (right-side of the number)
            this._exponent = rawExponent;
            //setting the decimals by rounding it
            this._decimal = super.round(rawDecimal);
        } else {
            const fresh: PrecisionContractRound = super.parseDecimals(toParse.split(''));

            //putting the data into the object
            this._exponent = super.getExponent(toParse)
            this._decimal = parseFloat(fresh.decimal.toString())
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

            //if length of max is 1
            if(max.length === 1) {
                //we just have to add the numbers as classic numbers
                const numOne = this.getRawNumber()
                const numTwo = numberTwo.getRawNumber()
                const numFinal = numOne + numTwo;
                //parse decimals
                const fresh: PrecisionContractRound = super.parseDecimals(numFinal.toString())
                this._exponent = fresh.exponent
                this._decimal = super.round(parseFloat(fresh.decimal.toString()))
            } else {
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
                const fresh: PrecisionContractRound = super.parseDecimals(final.reverse().map(String))
                this._exponent = fresh.exponent
                this._decimal = super.round(parseFloat(fresh.decimal.toString()))
            }
        } else {
            //if the exponent of number 2 is superior to the current exponent
            if(numberTwo._exponent > this._exponent) {
                //then we replace data in current number for number 2
                this._exponent = numberTwo._exponent
                this._decimal = numberTwo._decimal
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
        for(let i = 0; i < this._exponent + 1; i++) {
            final.push(0);
        }

        //split the decimals at the dot if there is some
        const splitDecimal = this._decimal.toString().split(".")

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
     * Determines if the given number can be subtracted from the current number
     * @param numberTwo
     * @private
     */
    public canSubstract(numberTwo: Exponent): boolean
    {
        //if the length of the second number is superior to the current number
        if(numberTwo._exponent > this._exponent) {
            //then that means we'll have a negative number, which is to avoid in this context
            return false;
        }
        else if(this._exponent > numberTwo._exponent) {
            //else if the current number have a bigger exponent than the second number
            //then that means we can subtract the current number from the second number
            return true;
        }
        else {
            let result: boolean = false;

            /** the upper number in the subtraction */
            const upper: number[] = this.getNumberMap().reverse();
            /** the lower number in the subtraction */
            const lower: number[] = numberTwo.getNumberMap().reverse();
            //max length
            const max: number = Math.max(upper.length, lower.length);

            //basically what we're going to do is loop in all numbers
            for(let i: number = max - 1; i >= 0; i--) {
                //the digit on top
                const upperDigit: number = upper.at(i) ?? 0;
                //same, but the bottom digit
                const lowerDigit: number = lower.at(i) ?? 0;
                /** if it's the last turn */
                const lastLoop = i === 0;
                //then check if the current upper number is bigger than the current lower number
                if(upperDigit > lowerDigit) {
                    //if true, then we can stop and return true.
                    result = true
                }
                //else if it's the last loop and the upper number is equals to the lower number
                else if(lastLoop && upperDigit === lowerDigit && result === false) {
                    //then that means the 2 numbers are equal, and thus can be subtracted
                    result = true;
                }
                //else we continue in the loop, because tha means
            }
            //and we return the result, because only when the upper number is bigger or equals than the lower number is true
            return result;
        }
    }

    /**
     * Will subtract the current number stored to another number
     * @param numberTwo
     */
    public subtract(numberTwo: Exponent): this
    {
        if(this.canSubstract(numberTwo)) {
            const final: number[] = [];

            const nOne = this.getNumberMap().reverse();
            const nTwo = numberTwo.getNumberMap().reverse();

            const max = Math.max(nOne.length, nTwo.length);
            let carry: number = 0;

            for(let i: number = 0; i <= max; i++) {
                //the digit on top of the operator
                const upperDigit: number = nOne.at(i) ?? 0;
                //same, but the bottom digit
                const lowerDigit: number = nTwo.at(i) ?? 0;

                const total = upperDigit - (lowerDigit + carry);

                //if the upper number is smaller than the lower number
                if(total < 0) {
                    //then we'll have to "burry" a one to the next digit
                    carry = 1;
                    //and we push what remains after burring the one, as a positive number
                    final.push(
                        10 - Math.sqrt(Math.pow(total,2))
                    );
                } else {
                    //if the upper number is bigger or equal to the lower number then no carry is needed
                    carry = 0;
                    final.push(total);
                }
            }
            //if a useless 0 is here, then we delete it
            if(final.at(final.length - 1) === 0) {
                final.pop()
            }
            //We put the result to the current number, and that's it, we've subtracted the two numbers !
            const fresh: PrecisionContractRound = super.parseDecimals(final.reverse().map(String))
            this._exponent = fresh.exponent
            this._decimal = super.round(parseFloat(fresh.decimal.toString()))
        } else {
            this._decimal = 0;
            this._exponent = 0;
        }

        return this;
    }

    /**
     * Multiply two numbers map together
     * @param times
     */
    public multiply(times: number): this
    {
        //multiplication by 0
        if(times === 0) {
            this._decimal = 0;
            this._exponent = 0;
        }
        //multiplication by 1 or more
        else {
            //we iterate in the number of times to multiply the number
            for(let i = 0; i < times - 1; i++) {
                //and we add the number to the result
                this.add(this);
            }
        }

        return this;
    }

    /**
     * Gets the 10% of the current number
     */
    public getTenPercent(): Exponent
    {
        const numberMap = this.getNumberMap();
        //if there is 2 or more digits
        if(numberMap.length > 1) {
            numberMap.pop()
        }

        return new Exponent(numberMap.join("")).parse();
    }

    /**
     * Determines if two numbers are addable by comparing exponents
     * @param numberTwo The number to be compared
     */
    public isAddable(numberTwo: Exponent): boolean
    {
        const max = Math.max(this._exponent, numberTwo._exponent)
        const min = Math.min(this._exponent, numberTwo._exponent)

        const difference = max - min
        return difference <= super.getPrecision();
    }

    /**
     * Gets the raw number of the calculated decimals and exponent
     * WARNING: Can break if number is too high
     */
    public getRawNumber(): number
    {
        return Math.floor(this._decimal * Math.pow(10, this._exponent))
    }

    /**
     * Returns the class as string (mainly for display)
     */
    public toString(): string
    {
        //the number of digits is less than the raw display threshold
        if(this._exponent < super.getDisplayThreshold()) {
            //then return a parsed number (already string)
            return this.getRawNumber().toString()
        } else {
            //else we return the decimals version
            return `${this._decimal}e${this._exponent}`
        }
    }

    get original(): string { return this._original; }
    get decimal(): number { return this._decimal; }
    get exponent(): number { return this._exponent; }
}
