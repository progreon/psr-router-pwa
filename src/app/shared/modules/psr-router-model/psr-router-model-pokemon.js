/**
 * Class representing a Pokemon.
 * TODO
 * TODO: jsdoc
 * TODO: cross-gen!
 */
class Pokemon {
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
   * @returns {Pokemon}
   */
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
  }

  getDefaultMoveset(level) {
    // TODO
  }

  addLearnedMove(level, move) {
    // TODO
  }

  getLearnedMoves(level) {
    // TODO
  }

  addTmMove(move) {
    // TODO
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

export default Pokemon;
