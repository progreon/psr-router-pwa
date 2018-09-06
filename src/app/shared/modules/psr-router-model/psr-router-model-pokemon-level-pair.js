/**
 * Class representing a pokemon-level pair
 * TODO: comparable? (hash?)
 *
 * @class
 */
export default class PokemonLevelPair {
  /**
   *
   * @param {Pokemon} pokemon
   * @param {number} level
   * @returns {PokemonLevelPair}
   */
  constructor(pokemon, level) {
    this.pokemon = pokemon;
    this.level = parseInt(level);
  }

  toString() {
    // TODO: this.pokemon.getString()?
    return this.pokemon.toString() + ' (L' + this.level + ')';
  };

  /**
   *
   * @param {PokemonLevelPair} pokemonLevelPair
   * @returns {Boolean}
   */
  equals(pokemonLevelPair) {
    return this.toString() === pokemonLevelPair.toString();
  };

  compare(pokemonLevelPair) {
//   var result = this.pokemon.localeCompare(pokemonLevelPair.pokemon);
    var result = this.pokemon.compare(pokemonLevelPair.pokemon);
    if (result === 0) {
        result = this.level - pokemonLevelPair.level;
    }
    return result;
  };
}
