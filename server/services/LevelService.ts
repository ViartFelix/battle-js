class LevelService
{
    constructor() {
    }

    /**
     * Add two numbers together
     * @param numberOne
     * @param numberTwo
     */
    public add(numberOne: number[], numberTwo: number[]): Array<number>
    {
        const result: Array<number> = [];
        /** What will be transported to the next iteration */
        let carry = 0;
        //we get max length of the two arrays
        const maxLength = Math.max(numberOne.length, numberTwo.length);

        for (let i = 0; i < maxLength; i++) {
            //iterate in the two arrays. If no element exists, set it to 0 as a safety measure
            const digitOne = numberOne[numberOne.length - 1 - i] || 0;
            const digitTwo = numberTwo[numberTwo.length - 1 - i] || 0;
            //calculate the sum with what remains of the last sum (carry)
            const sum = digitOne + digitTwo + carry;
            //putting the result in the result array
            result.unshift(sum % 10);
            //setting the carry as a multiple of 10
            carry = Math.floor(sum / 10);
        }

        //if any carry is remained after the last operation, we push it to the result array
        if (carry) {
            result.unshift(carry);
        }

        return result;
    }

    /**
     * Subtract two numbers from each other
     * @param nOne
     * @param nTwo
     */
    public subtract(nOne: number[], nTwo: number[]): number[]
    {
        const result: number[] = [];
        //we get the two number maps, and sort them from biggest to smallest
        const maps = [
            nOne,
            nTwo
        ].sort((a: number[], b: number[]) => b.length - a.length);
        //we fetch the biggest and smallest array
        const max = (maps.at(0)??[]).reverse(), min = (maps.at(1)??[]).reverse();
        //what will be transported to the next iteration
        let carry: number = 0;
        for(let i: number = 0; i < max.length; i++) {
            //the digit on top of the operator
            const upperDigit: number = max.at(i) ?? 0;
            //same, but the bottom digit
            const lowerDigit: number = min.at(i) ?? 0;
            //the total of the substation (increased lower digit by carry because if result is < 0
            // then that means we have to increase the upper number by 10)
            const total = upperDigit - (lowerDigit + carry);
            //if the upper number is smaller than the lower number
            if(total < 0) {
                //then we'll have to "burry" a one to the next digit
                carry = 1;
                //and we push what remains after burring the one, as a positive number
                result.push(
                    10 - Math.sqrt(Math.pow(total,2))
                );
            } else {
                //if the upper number is bigger or equal to the lower number then no carry is needed
                carry = 0;
                result.push(total);
            }
        }

        return result.reverse();
    }

    /**
     * Exponentiation of a number map
     * @param number
     * @param power
     */
    public exponentiate(number: number[], power: number): Array<number>
    {
        const final: Array<number> = [];
        let now: number[] = number;
        for(let i = 0; i < power - 1; i++) {
        }

        return final;
    }

    /**
     * Multiply two numbers map together
     * @param number
     * @param times
     */
    public multiply(number: number[], times: number): Array<number>
    {
        //what will be returned
        let now: number[] = number;
        //we iterate in the number of times to multiply the number
        for(let i = 0; i < times - 1; i++) {
            //and we add the number to the result
            now = this.add(now, number);
        }

        return now;
    }

    /**
     * Will multiply two number maps together
     * @param numberOne
     * @param numberTwo
     */
    public multiplyNumbers(numberOne: number[], numberTwo: number[]): Array<number>
    {
        //what will be returned
        let final: number[] = [];

        //max and min numbers
        let max;
        let min;
        //we attribute the max and min numbers
        if(numberOne.length >= numberTwo.length) {
            max = numberOne;
            min = numberTwo;
        } else {
            max = numberTwo;
            min = numberOne;
        }
        /** Difference of digits between the 2 numbers */
        const diff: number = Math.abs(max.length - min.length) + min.length;
        //we iterate in the max number
        for(let i: number = max.length - (diff); i >= 0; i--) {
            //we get (as a raw number) the multiplier for the multiplication
            const digits = Math.pow(10, max.length - 1 - i);
            const multiplier = max[i] * digits;
            //we get the result multiplied
            const resultMultiply = this.multiply(min, multiplier);
            //and we add to the current result
            final = this.add(resultMultiply, final);
        }

        return final;
    }

    /**
     * Returns a number map from a number
     * @param number
     * @private
     */
    private getNumberMap(number: number): number[]
    {
        const final: Array<number> = [];
        const strTarget: string = number.toString();

        for(let i = 0; i < strTarget.length; i++) {
            final.push(parseInt(strTarget.charAt(i)));
        }

        return final;
    }
}

export const levelService: LevelService = new LevelService();
