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
   * @param {Trainer[]}         trainers        All the trainers in this game
   */
  constructor(model, engine, experienceGroup, info, items, types, typeChart, moves, pokemon, trainers) {
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
    /** @type {Trainer[]} */
    this.trainers = trainers;
    this.aliasedTrainers = {};
    for (var key in this.trainers) {
      if (this.trainers[key].alias) {
        this.aliasedTrainers[this.trainers[key].alias.toUpperCase()] = this.trainers[key];
      }
    }
  }

  /**
   * Find an item by name.
   * @param {string}  name  The name of the item.
   * @returns {Move}   The item.
   */
  findItemByName(name) {
    return name ? this.items[name.toUpperCase()] : undefined;
  }

  /**
   * Find a move by name.
   * @param {string}  name  The name of the move.
   * @returns {Move}   The move.
   */
  findMoveByName(name) {
    return name ? this.moves[name.toUpperCase()] : undefined;
  }

  /**
   * Find a pokemon by name.
   * @param {string}  name  The name of the pokemon.
   * @returns {Pokemon}   The pokemon.
   */
  findPokemonByName(name) {
    return name ? this.pokemon[name.toUpperCase()] : undefined;
  }

  /**
   * Find a trainer by its key or alias.
   * @param {string}  key  The key or alias of the trainer.
   * @returns {Trainer}   The trainer.
   */
  findTrainerByKeyOrAlias(key) {
    return key ? (this.aliasedTrainers[key.toUpperCase()] || this.trainers[key.toUpperCase()]) : undefined;
  }

  /**
   * Find a type by name.
   * @param {string}  name  The name of the type.
   * @returns {Pokemon}   The type.
   */
  findTypeByName(name) {
    return name ? this.types[name.toUpperCase()] : undefined;
  }
}

export { Game };
