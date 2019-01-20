/**
 * Class representing a battle
 * TODO
 *
 * @class
 */
class Battle1 {
  /**
   *
   * @param {Player}   player   The player that's playing the game
   * @param {Trainer}  opponent The opponent it's facing
   * @returns {Battle1}
   */
  constructor(player, opponent) {
    this.player = player;
    this.opponent = opponent;
    // this.usedMoves = [];
    // this.usedItems = [];
  }

  toString() {
    return "Gen 1 Battle";
  }
}

export { Battle1 };
