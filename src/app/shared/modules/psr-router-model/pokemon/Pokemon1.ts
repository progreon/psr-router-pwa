import { Type } from "../Model";
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
    expGroup: string, // TODO ...
    hp: number,
    atk: number,
    def: number,
    spd: number,
    public readonly spc: number) {
    super(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spc, spc, spd);
  }
  getExp(level: number, participants: number, isTraded: boolean, isTrainer: boolean): number {
    let a = Math.trunc((this.expGiven / participants) * level / 7);
    if (isTraded) {
        a = a + Math.trunc(a / 2);
    }
    if (isTrainer) {
        a = a + Math.trunc(a / 2);
    }
    return a;
  }
  getCritRatio(): number {
    throw new Error("Method not implemented.");
  }
  getHighCritRatio(): number {
    throw new Error("Method not implemented.");
  }
}
