/**
 * Class representing a battler
 * TODO: Change useCandy, useHPUP, ... to useItem?
 *
 * @class
 */
export default class Battler {
  /**
   *
   * @param {RouterData}    routerData    The router data
   * @param {Pokemon}       pokemon       The pokemon
   * @param {EncounterArea} catchLocation The catch location of this battler (used for calculating possible DVs)
   * @param {boolean}       isTrainerMon  If it's a trainer's pokemon (TODO: do this more properly?)
   * @param {number}        level         The current level
   * @returns {Battler}
   */
  constructor(routerData, pokemon, catchLocation, isTrainerMon, level) {
    this.object = routerData;
    this.pokemon = pokemon;
    this.catchLocation = catchLocation;
    this.isTrainerMon = isTrainerMon;
    this.level = level;
    this.moveset = []; // TODO: hold Move's or strings of keys for Move?
    this.levelExp = 0;
  }

  /**
   * Defeat given battler, this battler is modified but not evolved.
   *
   * @param {Battler} battler      The battler to defeat
   * @param {number}  participants The number of participants in the battle (defaults to 1)
   * @returns {Battler} Returns the modified/evolved battler (not a deep copy)
   */
  defeatBattler(battler, participants) {
    if (!participants)
      participants = 1;

    // TODO
  }

  /**
   * Tries to evolve the battler with the specified item.
   *
   * @param {Item}  item  The item which triggers the evolution
   * @returns {Battler}   Returns the evolved battler or null if it couldn't evolve
   */
  evolve(item) {
    // TODO
  }

  /**
   * Add experience, this battler is modified but not evolved.
   *
   * @param {number}    exp
   * @returns {Battler} Returns the modified/evolved Battler (not a deep copy)
   */
  addXP(exp) {
    // TODO
  }

  /**
   * Try to learn a TM or HM move.
   * TODO: Move or string?
   *
   * @param {Move}  newMove The TM or HM move
   * @param {Move}  oldMove Optional
   * @returns {boolean} True if success
   */
  learnTmMove(newMove, oldMove) {
    // TODO
    var success = false;
    var moves = this.moveset;
    var canLearn = false;
    // TODO (get via routerData): var canLearn = pokemon.getTMMoves().contains(newMove)
    if (canLearn && !moves.includes(newMove)) {
      if (!oldMove || moves.includes(oldMove)) {
        var i = 0;
        while ( i < 4 && oldMove != this.moveset[i] && this.moveset[i] != null)
          i++;
        // only remove the move if no more room!
        if (i < 4) {
          moveset[i] = newMove;
          success = true;
        }
      }
    }
    return success;
  }

  /**
   * Use some Rare Candies
   *
   * @param {number}    count
   * @returns {Battler} Returns the modified/evolved Battler (not a deep copy)
   */
  addXP(count) {
    if (!count)
      count = 1;

    var newBattler = this;
    for (var i = 0; i < count; i++)
      if (level < 100)
      // TODO: newBattler = newBattler.addXP(...);

    return newBattler;
  }

  // TODO
//     public abstract boolean useHPUp(int count);
//
//     public abstract boolean useProtein(int count);
//
//     public abstract boolean useIron(int count);
//
//     public abstract boolean useCarbos(int count);
//
//     public abstract boolean useCalcium(int count);
//
//     public abstract DVRange getDVRange(int stat);
//
//     public abstract DVRange[] getDVRanges();
//
//     public List<Move> getMoveset() {
//         List<Move> moves = new ArrayList<>();
//         for (Move m : moveset) {
//             if (m != null) {
//                 moves.add(m);
//             }
//         }
//         return moves;
//     }
//
//     public int getLevel() {
//         return this.level;
//     }
//
//     /**
//      * Gets the current HP stat value
//      *
//      * @return
//      */
//     public abstract Range getHP();
//
//     /**
//      * Gets the current Attack stat value
//      *
//      * @return
//      */
//     public abstract Range getAtk();
//
//     /**
//      * Gets the current Defense stat value
//      *
//      * @return
//      */
//     public abstract Range getDef();
//
//     /**
//      * Gets the current Speed stat value
//      *
//      * @return
//      */
//     public abstract Range getSpd();
//
//     /**
//      * Gets the current Special stat value
//      *
//      * @return
//      */
//     public abstract Range getSpc();
//
//     /**
//      * Gets the current Attack stat value with boosts
//      *
//      * @param badgeBoosts
//      * @param stage
//      * @return
//      */
//     public Range getAtk(int badgeBoosts, int stage) {
//         return getBoostedStat(getAtk(), badgeBoosts, stage);
//     }
//
//     /**
//      * Gets the current Defense stat value with boosts
//      *
//      * @param badgeBoosts
//      * @param stage
//      * @return
//      */
//     public Range getDef(int badgeBoosts, int stage) {
//         return getBoostedStat(getDef(), badgeBoosts, stage);
//     }
//
//     /**
//      * Gets the current Speed stat value with boosts
//      *
//      * @param badgeBoosts
//      * @param stage
//      * @return
//      */
//     public Range getSpd(int badgeBoosts, int stage) {
//         return getBoostedStat(getSpd(), badgeBoosts, stage);
//     }
//
//     /**
//      * Gets the current Special stat value with boosts
//      *
//      * @param badgeBoosts
//      * @param stage
//      * @return
//      */
//     public Range getSpc(int badgeBoosts, int stage) {
//         return getBoostedStat(getSpc(), badgeBoosts, stage);
//     }
//
//     protected abstract Range getBoostedStat(Range statRange, int badgeBoostCount, int xItemCount);
//
// //    public Pokemon getPokemon() {
// //        return this.pokemon;
// //    }
//
//     public boolean isType(Types.Type type) {
//         return type == pokemon.type1 || (pokemon.type2 != null && type == pokemon.type2);
//     }
//
//     public int getExp(int participants) {
//         return pokemon.getExp(level, participants, false, isTrainerMon);
//     }
//
//     public int getLevelExp() {
//         return levelExp;
//     }
//
//     @Override
//     // TODO: NOT with hash codes!!
//     public abstract boolean equals(Object obj);
//
//     @Override
//     public int hashCode() {
//         int hash = 7;
//         hash = 97 * hash + Objects.hashCode(this.pokemon);
//         hash = 97 * hash + Objects.hashCode(this.catchLocation);
//         return hash;
//     }
//
//     @Override
//     public String toString() {
//         String battler = pokemon.name + " Lv." + getLevel();
//
//         return battler;
//     }

  clone() {
    var clone = new Battler(this.routerData, this.pokemon, this.catchLocation, this.isTrainerMon, this.level);
    // TODO: clone.moveset = ...;
    clone.levelExp = this.levelExp;
  }

  toString() {
    return "Battler";
  };
}
