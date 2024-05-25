import Enemy from "../models/Enemy";
import { fsService } from "./FsService";

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
    public exponential(number: number[], power: number): Array<number>
    {
        //Initialize the result as 1 (since anything raised to the power of 0 is 1)
        let result: number[] = [1];
        for (let i = 0; i < power; i++) {
            result = this.multiplyNumbers(result, number);
        }
        return result;
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
     * Will multiply two number maps together.
     * Fixed because doesn't like to be used with exponential function
     * @param numberOne
     * @param numberTwo
     */
    public multiplyNumbers(numberOne: number[], numberTwo: number[]): Array<number> {
        //what will be returned
        let final: number[] = [0];
        //we iterate in the second number
        for (let i = numberTwo.length - 1; i >= 0; i--) {
            //temp array, serves as a buffer
            let temp: number[] = [];
            //we iterate in the second number again to fill the temp array
            for (let k = 0; k < numberTwo.length - 1 - i; k++) {
                temp.push(0);
            }
            //carry
            let carry = 0;
            //then we can iterate in the first number, but reversed
            for (let j = numberOne.length - 1; j >= 0; j--) {
                //we get the product of the two numbers, alongside the carry
                const product = numberTwo[i] * numberOne[j] + carry;
                //and we push the result to the temp array
                temp.unshift(product % 10);
                carry = Math.floor(product / 10);
            }
            //if any remaining carry exists, we push it to the temp array
            if (carry > 0) {
                temp.unshift(carry);
            }
            //and we add the temp array to the final array
            final = this.add(final, temp);
        }

        return final;
    }

    /**
     * Returns a number map from a number
     * @param number
     * @private
     */
    public getNumberMap(number: number): number[]
    {
        const final: Array<number> = [];
        const strTarget: string = number.toString();

        for(let i = 0; i < strTarget.length; i++) {
            final.push(parseInt(strTarget.charAt(i)));
        }

        return final;
    }

    /**
     * Gets a number from a number map.
     * May break on (very) large numbers
     * @param number
     */
    public getNumberFromMap(number: number[]): number
    {
        return parseInt(number.map(x => x.toString()).join(''));
    }

    /**
     * Gets an enemy from a zone
     * @param zone
     * @param lastMonsterHP
     */
    public getEnemy(zone: number, lastMonsterHP: number[]): Enemy
    {
        const isBoss: boolean = (zone % 10 === 0);
        const randomEnemy: Enemy = this.getRandomEnemyData(isBoss);
        randomEnemy.isBoss = isBoss
        //changing this for better compatibility in cases where player wants either specific level or goes to previous level
        //base HP as first value
        let finalHp: number[] = [1,0]

        for(let i = 1; i < zone - 1; i++) {
            finalHp = this.getMonsterHp(zone, finalHp, (i % 10 === 0))
        }

        if(isBoss) {
            finalHp = this.getMonsterHp(zone, finalHp, true)
        }

        if(zone===2) {
            finalHp = this.add(finalHp, [8])
        }


        randomEnemy.hp = finalHp;
        randomEnemy.money = this.getMonsterGold(zone, isBoss);

        return randomEnemy;
    }


    /**
     * Returns the hp of the monster based on the level asked. Applied formula: <br>
     * (HPzone-1)×(1+zone×0.1)² <br>
     * Where (HPzone-1) is the HP of the previous monster (not present here)
     * @return Array<number> The numbers map of the hp of the monster
     * @param zone
     * @param previousHP
     * @param isBoss
     */
    public getMonsterHp(zone: number, previousHP: number[], isBoss: boolean = false): Array<number>
    {
        if(zone > 1) {
            //zone map
            const zoneMap = this.getNumberMap(zone);
            //zone×0.1 (useless now)
            //(1+zone×0.1)²
            const onePlusPopedSquared = this.exponential(this.add([1], zoneMap), 2)
            //previousHP + currentHP
            const finalHealth = this.add(onePlusPopedSquared, previousHP)
            return this.multiply(finalHealth, (
                isBoss? 10 : 1
            ))
        } else {
            return [1,0];
        }

    }

    /**
     * Gets the gold of the monster based on the zone. This formula is the following: <br>
     * f(x) = (x^2)-x+1
     * @param zone
     * @param isBoss
     */
    public getMonsterGold(zone: number, isBoss: boolean = false): Array<number>
    {
        //zone number map
        const zoneMap = this.getNumberMap(zone);
        //target formula
        const expo: Array<number> = this.exponential(zoneMap, 2);
        const minusZone = this.subtract(expo, zoneMap);
        const final = this.add(minusZone, [1]);

        if(isBoss) {
            return this.multiply(final, 10);
        } else {
            return final;
        }
    }

    /**
     * Get a random boss
     */
    public getRandomEnemyData(isBoss: boolean = false): Enemy
    {
        const buffer = fsService.getDataFile(
            isBoss ? 'bosses.json' : 'monsters.json'
        );
        const data = JSON.parse(buffer.toString())

        const randomEnemy = data[Math.floor(Math.random() * (data.length))];
        return randomEnemy as Enemy;
    }

}

export const levelService: LevelService = new LevelService();
