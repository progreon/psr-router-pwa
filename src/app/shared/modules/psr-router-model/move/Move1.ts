import { Game, Type } from "../Model";
import { Move } from "./Move";
/**
 * Class representing a Pokemon move.
 */
export class Move1 extends Move {
  public readonly physical: boolean;
  /**
   *
   * @param key         The key to use in maps
   * @param name        A more user friendly name
   * @param effect      The name of the effect this move has
   * @param power       The power of the move
   * @param type        The type of this move
   * @param accuracy    The accuracy of this move
   * @param pp          The initial PP of this move
   * @param physical    If the move is physical or not
   * @param description A description
   */
  constructor(key: string, name: string, effect: string, power: number, type: Type, accuracy: number, pp: number, physical: boolean, description: string) {
    super(key, name, effect, power, type, accuracy, pp, description, physical ? "physical" : "special");
    this.physical = physical;
  }
}
