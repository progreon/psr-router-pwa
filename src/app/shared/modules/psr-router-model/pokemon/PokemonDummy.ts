import { Pokemon } from "./Pokemon";
import { Game } from '../Model';
import * as DummyModel from '../ModelDummy';
/**
 * Class representing a dummy Pokemon
 */
export class PokemonDummy extends Pokemon {
  private static LastID = 10001;
  public readonly dummy = true;

  constructor(game: Game, name: string) {
    super(name, PokemonDummy.LastID++, game.getDummyType("Dummy"), null, 0, new DummyModel.ExperienceGroupDummy("Dummy"), 0, 0, 0, 0, 0, 0);
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
