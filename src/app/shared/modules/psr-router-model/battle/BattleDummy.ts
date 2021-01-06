import { Battle } from "../ModelAbstract";
import { Player, Trainer } from "../Model";

/**
 * Class representing a dummy battle
 * @todo
 */
export class BattleDummy extends Battle {
  /**
   *
   * @param player   The player that's playing the game
   * @param opponent The opponent it's facing
   */
  constructor(player: Player, opponent: Trainer) {
    super(player, opponent);
  }

  toString() {
    return "Battle Dummy";
  }
}
