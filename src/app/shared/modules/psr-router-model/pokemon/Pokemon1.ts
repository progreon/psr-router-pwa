import { Type } from "../Model";
import { ExperienceGroup } from "../ModelAbstract";
import { Pokemon } from "./Pokemon";
/**
 * A class representing a gen 1 pokemon
 */
export class Pokemon1 extends Pokemon {
  constructor(
    name: string,
    id: number,
    type1: Type,
    type2: Type,
    expGiven: number,
    expGroup: ExperienceGroup,
    hp: number,
    atk: number,
    def: number,
    spd: number,
    public readonly spc: number) {
    super(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spc, spc, spd);
  }
  getExp(level: number, participants: number, isTraded: boolean, isTrainer: boolean): number {
    throw new Error("Method not implemented.");
  }
  getCritRatio(): number {
    throw new Error("Method not implemented.");
  }
  getHighCritRatio(): number {
    throw new Error("Method not implemented.");
  }
}

// /**
//  *
//  * @author Marco Willems
//  */
// public class Pokemon {

//     public String getIndexString() {
//         return getIndexString(name);
//     }

//     // TODO exp. all?
//     public int getExp(int level, int participants, boolean isTraded, boolean isTrainer) {
//         int a = ((expGiven / participants) * level / 7);
//         if (isTraded) {
//             a = a + (a / 2);
//         }
//         if (isTrainer) {
//             a = a + (a / 2);
//         }
//         return a;
//     }

//     public double getCritRatio() {
//         return (spd / 2) / 256.0;
//     }

//     public double getHighCritRatio() {
//         return Math.min((spd / 2) / 32.0, 1.0);
//     }

//     public static String getIndexString(String name) {
//         return name.toUpperCase(Locale.ROOT);
//     }

//     @Override
//     public String toString() {
//         return name;
//     }

// }
