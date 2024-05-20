class LevelService
{
    constructor() {
    }

    /**
     * Add two numbers together
     * @param nOne
     * @param nTwo
     */
    public add(nOne: number[], nTwo: number[]): number[]
    {
        const maps = [nOne, nTwo]
            .sort((a: number[], b: number[]) => b.length - a.length);
        // @ts-ignore
        const max = maps.at(0).reverse(), min = maps.at(1).reverse();
        const result: number[] = new Array(max.length).fill(0);
        /** What will be transported to the next iteration */
        let carry: number = 0;

        for(let i = 0; i < max.length; i++) {
            const digitOne: number = nOne[i] ?? 0;
            const digitTwo: number = nTwo[i] ?? 0;

            const sum: number = digitOne + digitTwo + carry;
            result[i] = sum % 10;
            carry = Math.floor(sum / 10);
        }

        if(carry > 0) {
            result.push(carry)
        }

        return result.reverse();
    }

    /**
     * Substract two numbers from each other
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

    public multiply(number: number[], times: number): number[]
    {
        let now: number[] = number;
        for(let i = 0; i < times - 1; i++) {
            now = this.add(now, number);
            console.log("f:", now)
            console.log("-------------------------------")
        }

        return now;
    }

    private getNumberMap(number: number): number[]
    {
        const final: Array<number> = [];
        const strTarget: string = number.toString();

        for(let i = 0; i < strTarget.length; i++) {
            final.push(parseInt(strTarget.charAt(i)));
        }

        console.log(final)

        return final;
    }

}

export const levelService: LevelService = new LevelService();
