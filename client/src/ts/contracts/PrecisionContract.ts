export default abstract class PrecisionContract
{
    /** The number of decimals to precision */
    private readonly precision: number = 3;
    /** The precision number as a number */
    private readonly number: number = Math.pow(10, this.precision);
    /** Number of decimals in which the number is displayed as a raw number */
    private readonly displayThreshold: number = 5;

    protected constructor() {}

    /**
     * Rounds the number to the number of decimals in PrecisionContract
     * @param number
     * @protected
     */
    protected round(number: number|string): number
    {
        //Converting the number or string to string
        const toRound = number.toString()
        return Math.round(parseFloat(toRound) * this.getNumber()) / this.getNumber()
    }

    /**
     * Parse a number to the number of decimals
     * @protected
     */
    protected parseDecimals(number: string|number|Array<string>): any
    {
        //futur parsed string
        let futurParsed: string;
        //switched on the fed type to normalise the parsing accordingly
        switch (typeof number) {
            case "number": futurParsed = number.toString(); break;
            case "object": futurParsed = number.join(''); break;
            default: futurParsed = number; break;
        }

        /** the exponent of the number to parse. Because it originates from the biggest number, we can use this info wisely (?) */
        const exponent: number = futurParsed.length;
        /** leading zeroes that are useless */
        const leadingZeroes: number = (futurParsed.match(/^0*/)[0].length)

        /** What final string will be parsed: stripped from leading zeroes */
        const finalParse = futurParsed.slice(leadingZeroes);

        //if the finalParsed is empty, then that means we got a 0 on our hands
        if(finalParse.length === 0) {
            //and we return a 0
            return {
                decimal: 0,
                exponent: 0
            } as PrecisionContractRound
        }
        //else that means the number can be parsed
        else {
            //and we return a filtered array of it's useless decimals behind the precision
            const freshParse = finalParse.split('').map((el: any, i: number, array: string[]) => {
                //what will be returned
                let final: string | undefined;

                //if the index is bellow the threshold of the precision
                if (i < this.getPrecision() + 1 && el !== undefined) {
                    if(!isNaN(+el.toString())) {
                        //putting the number as str
                        final = el.toString()
                        //putting a dot if this is the first number and if it's not a single number (just in case, ts moment)
                        if (i === 0 && array.length > 1) {
                            final += "."
                        }
                    }
                }
                //return the final number
                return final;
            }).filter((val) => val !== undefined);
            return {
                decimal: parseFloat(freshParse.join("")),
                //idk why -1 but that works as intended with that lmao
                exponent: finalParse.length - 1
            } as PrecisionContractRound
        }


    }

    /**
     * Returns the number of exponents in the number
     * @param num
     */
    public getExponent(num: number|string): number
    {
        //split the num as string, and we return its length
        return num.toString().split("").length - 1;
    }

    /**
     * Returns the precision: amount of decimals to round to. <br>
     * Default is 3.
     * @protected
     */
    protected getPrecision(): number
    {
        return this.precision
    }

    /**
     * Returns the precision as a 10^X format. <br>
     * Default is 10^3 = 1000
     * @protected
     */
    protected getNumber(): number
    {
        return this.number;
    }

    /**
     *
     * Gets the display threshold
     * @protected
     */
    protected getDisplayThreshold(): number
    {
        return this.displayThreshold;
    }

}

export interface PrecisionContractRound
{
    decimal: number;
    exponent: number;
}
