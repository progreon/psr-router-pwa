/**
 * Class representing a battle
 * TODO
 *
 * @class
 */
class Battle {
  /**
   *
   * @param {Player}   player   The player that's playing the game
   * @param {Trainer}  opponent The opponent it's facing
   * @returns {Battle}
   */
  constructor(player, opponent) {
    this.player = player;
    this.opponent = opponent;
    // this.usedMoves = [];
    // this.usedItems = [];
  }

  toString() {
    return "Battle";
  }
}

export { Battle };
