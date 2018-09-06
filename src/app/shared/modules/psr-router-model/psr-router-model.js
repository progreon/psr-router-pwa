// TODO: split in multiple files?

// TODO:
// Pokemon
// Player
// Battle
// - Battler
//

/**
 * Class representing game information
 *
 * @param {string}   key      The key to use in maps
 * @param {string}   name     A more user friendly name
 * @param {number}   gen      The generation this game is made for
 * @param {number}   year     The year this game was released in
 * @param {string}   platform The platform for which this game is made
 * @class
 */
class GameInfo {
  constructor(key, name, gen, year, platform) {
    this.key = key;
    this.name = name;
    this.gen = gen;
    this.year = year;
    this.platform = platform;
  }
}

/**
 * Class representing a game
 *
 * @param {GameInfo} info      The info on this game
 * @param {string}   items     All the items in this game
 * @param {string}   types     All the types in this game
 * @param {string}   typeChart The type chart this game uses
 * @param {string}   moves     All the moves in this game
 * @param {string}   pokemon   All the pokemon in this game
 * @class
 */
class Game {
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

/**
 * Class representing an evolutionary stone
 *
 * @param {string}   key     The key to use in maps
 * @param {string}   name    A more user friendly name
 * @param {string}   usage   Defines how this item can be used ([TOI]*)
 * @param {number}   price   The price of this item
 * @param {string}   type    What type of item is this, optional
 * @param {string}   value   The "value" of this type of item (e.g. stone -> waterstone or tm -> toxic)
 * @class
 */
class Item {
  constructor(key, name, usage, price, type, value, description) {
    this.key = key;
    this.name = name;
    this.tossableOutsideBattle = usage.indexOf("T") !== -1;
    this.usableOutsideBattle = usage.indexOf("O") !== -1;
    this.usableInsideBattle = usage.indexOf("I") !== -1;
    this.price = price;
    this.type = type;
    this.value = value;
    this.description = description;
  }

  usage() {
    return (this.tossableOutsideBattle ? "T" : "") + (this.usableOutsideBattle ? "O" : "") + (this.usableInsideBattle ? "I" : "");
  };

  toString() {
    return this.name;
  };
}

/**
 * Class representing a Pokemon type
 *
 * @param {string}   key         The key to use in maps
 * @param {string}   name        A more user friendly name
 * @param {boolean}  isPhysical  If moves of this type are physical in gen 1-3
 * @class
 */
class Type {
  constructor(key, name, isPhysical) {
    this.key = key;
    this.name = name;
    this.isPhysical = isPhysical;
  }

  toString() {
    return name;
  };
}

/**
 * Class representing a Pokemon move
 *
 * @param {string}  key      The key to use in maps
 * @param {string}  name     A more user friendly name
 * @param {string}  effect   The name of the effect this move has
 * @param {number}  power    The power of the move
 * @param {Type}    type     The type of this move
 * @param {number}  accuracy The accuracy of this move
 * @param {number}  pp       The initial PP of this move
 * @param {string}  category The move category in gen 4+
 * @class
 */
class Move {
  constructor(key, name, effect, power, type, accuracy, pp, category, description) {
    this.key = key;
    this.name = name;
    this.effect = effect;
    this.power = power;
    this.type = type;
    this.accuracy = accuracy;
    this.pp = pp;
    this.category = (category ? category : "other");
    this.description = description;
  }

  toString() {
    return name;
  };
}

/**
 * Class representing an evolutionary stone
 *
 * @param {number}   id      The unique ID of this stone
 * @param {string}   key     The key to use in maps
 * @param {string}   name    A more user friendly name
 * @param {number}   gen     The generation it was introduced in
 * @class
 */
class Stone {
  constructor(id, key, name, gen) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.gen = gen;
  }
}

/**
 * Class representing an evolution-key
 *
 * @param {string}  type    One of [level, stone, trade-item]
 * @param {string}  value   The level, stone type, name of the item
 * @class
 */
class EvolutionKey {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return this.type + "(" + this.value + ")";
  };

  static get Type() {
    return {
      LEVEL: "level",
      STONE: "stone",
      TRADE_ITEM: "trade-item"
    };
  }
}

// TODO: ExperienceGroup

// TODO: Move

/**
 * Class representing a Pokemon
 * TODO: Pokemon (TODO: cross-gen!)
 *
 * @param {string}          name
 * @param {number}          id
 * @param {Type}            type1
 * @param {Type}            type2
 * @param {number}          expGiven
 * @param {number}          hp
 * @param {number}          atk
 * @param {number}          def
 * @param {number}          spd
 * @param {number}          spc
 * @param {ExperienceGroup} expGroup
 * @class
 */
class Pokemon {
  constructor(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spcAtk, spcDef, spd) {
    this.name = name;
    this.id = id;
    this.key = name.toUpperCase();
    this.evolutions = {};
    this.type1 = type1;
    this.type2 = type2;
    this.expGiven = expGiven;
    this.expGroup = expGroup;
    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.spcAtk = spcAtk;
    this.spcDef = spcDef;
    this.spd = spd;
    this.spc = spcAtk; // compatibility with gen 1
    this.defaultMoves = [];
    this.learnedMoves = {};
    this.tmMoves = [];
  }

  /**
   * TODO
   *
   * @param {EvolutionKey}    evolutionKey
   * @param {Pokemon}         pokemon
   * @returns {undefined}
   */
  addEvolution(evolutionKey, pokemon) {
    this.evolutions[evolutionKey.toString()] = pokemon;
  };

  getDefaultMoveset(level) {
    // TODO
  };

  addLearnedMove(level, move) {
    // TODO
  };

  getLearnedMoves(level) {
    // TODO
  };

  addTmMove(move) {
    // TODO
  };

  getAllMoves() {
    // TODO
  };

  getExp(level, participants, isTraded, isTrainer) {
    // TODO
  };

  getCritRatio() {
    // TODO
  };

  getHighCritRatio() {
    // TODO
  };

  toString() {
    return this.name;
  };

  compare(pokemon) {
    return this.name.localeCompare(pokemon.name);
  };
}

// TODO: do it like this?
// Pokemon.new = function(gen, ...) {
//     switch (gen) {
//         case 1:
//             // TODO
//             var pokemon = new Pokemon(...);
//             pokemon.getExp = function(level, participants, isTraded, isTrainer) {
//                 // TODO
//             };
//             break;
//         case 2-5:
//             // TODO
//             break;
//         default:
//             // TODO
//             break;
//     }
// }

/**
 * Class representing a pokemon-level pair
 * TODO: comparable? (hash?)
 *
 * @param {Pokemon} pokemon
 * @param {number} level
 * @class
 */
class PokemonLevelPair {
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

/**
 * Class representing pokemon-count pair
 *
 * @param {Pokemon} pokemon
 * @param {number} level
 * @param {number} count
 * @class
 */
class PokemonCountPair {
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

export const Model = {
  GameInfo,
  Game,
  Item,
  Type,
  Move,
  Stone,
  EvolutionKey,
  Pokemon,
  PokemonLevelPair,
  PokemonCountPair
};
