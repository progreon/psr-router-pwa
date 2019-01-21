/**
 * Class representing a game.
 */
class Game {
  /**
   *
   * @param {Object}            model           The "model" classes and methods this game uses
   * @param {Object}            engine          The "engine" classes and methods this game uses
   * @param {AExperienceGroup}  experienceGroup The experience groups
   * @param {GameInfo}          info            The info on this game
   * @param {Item[]}            items           All the items in this game
   * @param {Type[]}            types           All the types in this game
   * @param {TypeChart}         typeChart       The type chart this game uses
   * @param {Move[]}            moves           All the moves in this game
   * @param {Pokemon[]}         pokemon         All the pokemon in this game
   */
  constructor(model, engine, experienceGroup, info, items, types, typeChart, moves, pokemon) {
    this.model = model;
    this.engine = engine;
    /** @type {AExperienceGroup} */
    this.experienceGroup = experienceGroup;
    /** @type {GameInfo} */
    this.info = info;
    /** @type {Item[]} */
    this.items = items;
    /** @type {Type[]} */
    this.types = types;
    /** @type {TypeChart} */
    this.typeChart = typeChart;
    /** @type {Move[]} */
    this.moves = moves;
    /** @type {Pokemon[]} */
    this.pokemon = pokemon;
  }

  /**
   * Find a pokemon by name.
   * @param {string}  name  The name of the pokemon.
   * @returns {Pokemon}   The pokemon.
   */
  findPokemonByName(name) {
    return name ? this.pokemon[name.toUpperCase()] : undefined;
  }
}

export { Game };
