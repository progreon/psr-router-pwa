import { Game, Type } from "../Model";
/**
 * Class representing a Pokemon move.
 */
export abstract class Move {
  /**
   *
   * @param key           The key to use in maps
   * @param name          A more user friendly name
   * @param effect        The name of the effect this move has
   * @param power         The power of the move
   * @param type          The type of this move
   * @param accuracy      The accuracy of this move
   * @param pp            The initial PP of this move
   * @param highCritMove  If the move is a high critical move or not
   * @param description   A description
   */
  constructor(
    public readonly key: string,
    public readonly name: string,
    public readonly effect: string,
    public readonly power: number,
    public readonly type: Type,
    public readonly accuracy: number,
    public readonly pp: number,
    public readonly highCritMove: boolean,
    public readonly description: string,
    public readonly category?: string,
  ) {
    this.category = (category ? category : "other");
  }

  toString(): string {
    return this.name;
  }
}
