/**
 * Class representing a game
 *
 * @class
 */
export default class Game {
  /**
   *
   * @param {GameInfo} info      The info on this game
   * @param {Object}   items     All the items in this game
   * @param {Object}   types     All the types in this game
   * @param {Object}   typeChart The type chart this game uses
   * @param {Object}   moves     All the moves in this game
   * @param {Object}   pokemon   All the pokemon in this game
   * @returns {Game}
   */
  constructor(info, items, types, typeChart, moves, pokemon) {
    this.info = info;
    this.items = items;
    this.types = types;
    this.typeChart = typeChart;
    this.moves = moves;
    this.pokemon = pokemon;
  }

  findPokemonByName(name) {
    return this.pokemon[name.toUpperCase()];
  }
}
