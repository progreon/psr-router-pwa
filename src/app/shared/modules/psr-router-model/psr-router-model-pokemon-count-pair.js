/**
 * Class representing pokemon-count pair.
 */
class PokemonCountPair {
  /**
   *
   * @param {Pokemon} pokemon
   * @param {number} level
   * @param {number} count
   */
  constructor(pokemon, level, count) {
    /** @type {PokemonLevelPair} */
    this.plp = new PokemonLevelPair(pokemon, level);
    /** @type {number} */
    this.count = parseInt(count);
    if (this.count < 0)
      this.count = 0;
  }

  /**
   * Incremets the count.
   */
  inc() {
    this.count++;
  }

  /**
   * Decrements the count.
   */
  dec() {
    if (this.count > 0)
      this.count--;
  }

  /**
   * @param {PokemonCountPair} pokemonCountPair
   * @returns {number}
   */
  compare(pokemonCountPair) {
    var result = this.plp.compare(pokemonCountPair.plp);

    if (result === 0)
      result = this.count - pokemonCountPair.count;

    return result;
  }

  /**
   * @param {PokemonCountPair} pokemonCountPair
   * @returns {boolean}
   */
  equals(pokemonCountPair) {
    return this.plp.equals(pokemonCountPair.plp) && this.count === pokemonCountPair.count;
  }

  /** @returns {string} */
  toString() {
    return this.plp.toString() + ': x' + this.count;
  }
}

export { PokemonCountPair };
