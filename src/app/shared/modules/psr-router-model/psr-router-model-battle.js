/**
 * Class representing a battle
 * TODO
 *
 * @class
 */
export default class Battle {
  /**
   *
   * @param {Player}   player   The player that's playing the game
   * @param {Trainer}  opponent The opponent it's facing
   * @returns {Battle}
   */
  constructor(player, opponent) {
    this.player = player;
    this.opponent = opponent;
  }

  toString() {
    return "Battle";
  };
}
