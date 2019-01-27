/**
 * Class representing an abstract pokemon
 * TODO
 * TODO: jsdoc
 */
class APokemon {
  /**
   *
   * @param {string}    name
   * @param {number}    id
   * @param {Type}      type1
   * @param {Type}      type2
   * @param {number}    expGiven
   * @param {string}    expGroup
   * @param {number}    hp
   * @param {number}    atk
   * @param {number}    def
   * @param {number}    spcAtk
   * @param {number}    spcDef
   * @param {number}    spd
   */
  constructor(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spcAtk, spcDef, spd) {
    if (new.target === APokemon) {
      throw new TypeError("Cannot construct APokemon instances directly");
    }
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
    this.spcAtk = spcAtk; // compatibility with further gens
    this.spcDef = spcDef; // compatibility with further gens
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
   * @param {Pokemon1}         pokemon
   * @returns {undefined}
   */
  addEvolution(evolutionKey, pokemon) {
    this.evolutions[evolutionKey.toString()] = pokemon;
  }

  getDefaultMoveset(level) {
    var moveset = [];
    this.defaultMoves.forEach(m => moveset.push(m));
    for (var l = 1; l <= level; l++) {
      if (this.learnedMoves[l]) {
        moveset.push(this.learnedMoves[l]);
      }
    }
    return moveset.slice(-4);
  }

  setDefaultMoves(defaultMoves) {
    this.defaultMoves = defaultMoves;
  }

  setTmMoves(tmMoves) {
    this.tmMoves = tmMoves;
  }

  setLearnedMoves(learnedMoves) {
    this.learnedMoves = learnedMoves;
  }

  getAllMoves() {
    // TODO
  }

  getExp(level, participants, isTraded, isTrainer) {
    // TODO
  }

  getCritRatio() {
    // TODO
  }

  getHighCritRatio() {
    // TODO
  }

  toString() {
    return this.name;
  }

  compare(pokemon) {
    return this.name.localeCompare(pokemon.name);
  }
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
// NO, do the following and add all classes to the export:

/**
 * Class representing a gen 1 Pokemon
 * @augments APokemon
 */
class Pokemon1 extends APokemon {
  /**
   *
   * @param {string}    name
   * @param {number}    id
   * @param {Type}      type1
   * @param {Type}      type2
   * @param {number}    expGiven
   * @param {string}    expGroup
   * @param {number}    hp
   * @param {number}    atk
   * @param {number}    def
   * @param {number}    spd
   * @param {number}    spc
   */
  constructor(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spd, spc) {
    super(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spc, spc, spd);
  }
}

/**
 * A class representing a gen 2 pokemon
 * @augments APokemon
 */
class Pokemon2 extends APokemon {
  /**
   *
   * @param {string}    name
   * @param {number}    id
   * @param {Type}      type1
   * @param {Type}      type2
   * @param {number}    expGiven
   * @param {string}    expGroup
   * @param {number}    hp
   * @param {number}    atk
   * @param {number}    def
   * @param {number}    spcAtk
   * @param {number}    spcDef
   * @param {number}    spd
   */
  constructor(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spcAtk, spcDef, spd) {
    super(name, id, type1, type2, expGiven, expGroup, hp, atk, def, spcAtk, spcDef, spd);
  }
}

export { Pokemon1 };
