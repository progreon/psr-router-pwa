/**
 * Class representing a pokemon-level pair
 * TODO: comparable? (hash?)
 */
class PokemonLevelPair {
  /**
   *
   * @param {Pokemon} pokemon
   * @param {number} level
   */
  constructor(pokemon, level) {
    /** @type {Pokemon} */
    this.pokemon = pokemon;
    /** @type {number} */
    this.level = parseInt(level);
  }

  /** @returns {string} */
  toString() {
    // TODO: this.pokemon.getString()?
    return this.pokemon.toString() + ' (L' + this.level + ')';
  }

  /**
   * @param {PokemonLevelPair} pokemonLevelPair
   * @returns {boolean}
   */
  equals(pokemonLevelPair) {
    return this.toString() === pokemonLevelPair.toString();
  }

  /**
   * @param {PokemonLevelPair} pokemonCountPair
   * @returns {number}
   */
  compare(pokemonLevelPair) {
//   var result = this.pokemon.localeCompare(pokemonLevelPair.pokemon);
    var result = this.pokemon.compare(pokemonLevelPair.pokemon);
    if (result === 0) {
        result = this.level - pokemonLevelPair.level;
    }
    return result;
  }
}

export default PokemonLevelPair;
