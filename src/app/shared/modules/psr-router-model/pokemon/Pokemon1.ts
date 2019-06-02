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
    // TODO exp. all?
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
    return Math.trunc(this.spd / 2) / 256;
  }
  getHighCritRatio(): number {
    return Math.min(Math.trunc(this.spd / 2) / 32, 1);
  }
}
