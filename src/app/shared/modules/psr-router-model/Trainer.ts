import { Battler } from "./battler/Battler";
import { Item } from "./Item";

/**
 * Class representing a trainer
 */
export class Trainer {
  public dummy = false; // TODO: TEMP
  /**
   *
   * @param key           The key to use in maps
   * @param name          The (generated) name
   * @param trainerClass  The trainer class
   * @param party         The party
   * @param location      The name of the location the trainer is at // TODO: Location instead of string?
   * @param alias         An alias given to the trainer
   */
  constructor(
    public readonly key: string,
    public readonly name: string,
    public readonly trainerClass: string,
    public readonly money: number,
    public readonly party: Battler[],
    public readonly location: string,
    public readonly alias?: string,
    public readonly items?: Item[],
    public readonly badgeboost?: string
  ) { }

  getTotalExp(): number {
    return this.party.map(b => b.getExp()).reduce((prev, curr) => prev + curr);
  }

  toString(): string {
    return (this.alias ? this.alias : this.key);
  }
}
