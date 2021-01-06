import { Battle } from "../ModelAbstract";
import { Player, Trainer } from "../Model";

/**
 * Class representing a gen 1 battle
 * @todo
 */
export class Battle1 extends Battle {
  /**
   *
   * @param player   The player that's playing the game
   * @param opponent The opponent it's facing
   */
  constructor(player: Player, opponent: Trainer) {
    super(player, opponent);
  }

  toString() {
    return "Gen 1 Battle";
  }
}
