import { Player, Trainer } from "../ModelAbstract";

/**
 * @todo to type?
 */
export abstract class Battle {
  /**
   *
   * @param player    The player that's playing the game
   * @param opponent  The opponent it's facing
   */
  constructor(
    public readonly player: Player,
    public readonly opponent: Trainer) {
    // this.usedMoves = [];
    // this.usedItems = [];
  }
}
