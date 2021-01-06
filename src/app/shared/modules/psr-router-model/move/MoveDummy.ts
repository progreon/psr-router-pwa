import { Game } from "../Model";
import { Move } from "./Move";
/**
 * Class representing a Pokemon move.
 */
export class MoveDummy extends Move {
  public readonly dummy = true;
  /**
   *
   * @param name     Name of the dummy move
   */
  constructor(name: string) {
    super(name.toUpperCase(), name, "", 0, null, 0, 0, false, `Dummy move ${name}`);
  }
}
