import { Type } from "../Model";
import { Pokemon } from "./Pokemon";
/**
 * Class representing a gen 2 Pokemon
 */
export class Pokemon2 extends Pokemon {
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
    spcAtk: number,
    spcDef: number,
    spd: number) {
    super(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spcAtk, spcDef, spd);
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
