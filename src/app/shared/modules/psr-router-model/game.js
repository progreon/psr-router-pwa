import * as DummyModel from './model-dummy';

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
  constructor(model, engine, info, experienceGroup, items, types, typeChart, moves, pokemon, trainers) {
    this.model = model;
    this.dummyModel = DummyModel;
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
   * @returns {Item}   The item.
   */
  findItemByName(name) {
    return name ? this.items[name.toUpperCase()] : undefined;
  }

  /**
   * Get a dummy item.
   * @param {string}  name  The name of the item.
   * @returns {Item}   The item.
   */
  getDummyItem(name) {
    if (!name) {
      return undefined;
    } else {
      let item = new this.dummyModel.Item(name, name, "", 0, "Dummy", name, "Dummy Item");
      item.dummy = true;
      return item;
    }
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
   * Get a dummy move.
   * @param {string}  name  The name of the move.
   * @returns {Move}   The move.
   */
  getDummyMove(name) {
    if (!name) {
      return undefined;
    } else {
      let move = new this.dummyModel.Move(name, name, "", 0, this.getDummyType("N/A"), 0, 0, "Dummy Moves", "Dummy move");
      move.dummy = true;
      return move;
    }
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
   * Get a dummy pokemon.
   * @param {string}  name  The name of the pokemon.
   * @returns {Pokemon}   The pokemon.
   */
  getDummyPokemon(name) {
    if (!name) {
      return undefined;
    } else {
      let pokemon = new this.dummyModel.Pokemon(name);
      pokemon.dummy = true;
      return pokemon;
    }
    return name ? new this.dummyModel.Pokemon(name) : undefined;
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
   * Get a dummy trainer.
   * @param {string}  name  The name of the trainer.
   * @returns {Trainer}   The trainer.
   */
  getDummyTrainer(name) {
    if (!name) {
      return undefined;
    } else {
      let trainer = new this.dummyModel.Trainer(name, name, name, []);
      trainer.dummy = true;
      return trainer;
    }
  }

  /**
   * Find a type by name.
   * @param {string}  name  The name of the type.
   * @returns {Type}   The type.
   */
  findTypeByName(name) {
    return name ? this.types[name.toUpperCase()] : undefined;
  }

  /**
   * Get a dummy type.
   * @param {string}  name  The name of the type.
   * @returns {Type}   The type.
   */
  getDummyType(name) {
    if (!name) {
      return undefined;
    } else {
      let type = new this.dummyModel.Type(name, name);
      type.dummy = true;
      return type;
    }
  }
}

export { Game };
