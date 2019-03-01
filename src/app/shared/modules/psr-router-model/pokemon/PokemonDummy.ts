import { Pokemon } from "./Pokemon";
/**
 * Class representing a dummy Pokemon
 */
export class PokemonDummy extends Pokemon {
  private static LastID = 10001;
  public readonly dummy = true;

  constructor(name: string) {
    super(name, PokemonDummy.LastID++, null, null, 0, "", 0, 0, 0, 0, 0, 0);
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
