/**
 * Class representing pokemon-count pair
 *
 * @class
 */
export default class PokemonCountPair {
  /**
   *
   * @param {Pokemon} pokemon
   * @param {number} level
   * @param {number} count
   * @returns {PokemonCountPair}
   */
  constructor(pokemon, level, count) {
    this.plp = new PokemonLevelPair(pokemon, level);
    this.count = parseInt(count);
    if (this.count < 0)
      this.count = 0;
  }

  /**
   * Incremets the count.
   *
   * @returns {undefined}
   */
  inc() {
    this.count++;
  };

  /**
   * Decrements the count.
   *
   * @returns {undefined}
   */
  dec() {
    if (this.count > 0)
      this.count--;
  };

  /**
   *
   * @returns {String}
   */
  toString() {
    return this.plp.toString() + ': x' + this.count;
  };

  /**
   *
   * @param {PokemonCountPair} pokemonCountPair
   * @returns {Boolean}
   */
  equals(pokemonCountPair) {
    return this.plp.equals(pokemonCountPair.plp) && this.count === pokemonCountPair.count;
  };

  /**
   *
   * @param {PokemonCountPair} pokemonCountPair
   * @returns {number}
   */
  compare(pokemonCountPair) {
    var result = this.plp.compare(pokemonCountPair.plp);

    if (result === 0)
      result = this.count - pokemonCountPair.count;

    return result;
  };
}
