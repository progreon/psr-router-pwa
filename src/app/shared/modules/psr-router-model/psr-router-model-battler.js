/**
 * Class representing a battler
 * TODO: Change useCandy, useHPUP, ... to useItem?
 *
 * @class
 */
class ABattler {
  /**
   *
   * @param {Game}          game          The game
   * @param {Pokemon}       pokemon       The pokemon
   * @param {EncounterArea} catchLocation The catch location of this battler (used for calculating possible DVs)
   * @param {boolean}       isTrainerMon  If it's a trainer's pokemon (TODO: do this more properly?)
   * @param {number}        level         The current level
   * @returns {ABattler}
   */
  constructor(game, pokemon, catchLocation, isTrainerMon, level) {
    if (new.target === ABattler) {
      throw new TypeError("Cannot construct ABattler instances directly");
    }
    this.game = game;
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
   * @param {ABattler}  battler       The battler to defeat
   * @param {number}    participants  The number of participants in the battle (defaults to 1)
   * @returns {ABattler} Returns the modified/evolved battler (not a deep copy)
   */
  defeatBattler(battler, participants = 1) {
    throw new TypeError("defeatBattler not callable from super class");
  }

  /**
   * Tries to evolve the battler with the specified item.
   *
   * @param {Item}  item  The item which triggers the evolution
   * @returns {ABattler}   Returns the evolved battler or null if it couldn't evolve
   */
  evolve(item) {
    throw new TypeError("evolve not callable from super class");
  }

  /**
   * Add experience, this battler is modified but not evolved.
   *
   * @param {number}    exp
   * @returns {ABattler} Returns the modified/evolved ABattler (not a deep copy)
   */
  addXP(exp) {
    throw new TypeError("addXP not callable from super class");
  }

  /**
   * Try to learn a TM or HM move.
   * TODO: Move or string?
   * TODO: (get via game): var canLearn = pokemon.getTMMoves().contains(newMove)
   *
   * @param {Move}  newMove   The TM or HM move
   * @param {Move}  [oldMove]
   * @returns {boolean} True if success
   */
  learnTmMove(newMove, oldMove) {
    var success = false;
    var moves = this.moveset;
    var canLearn = false; // TODO
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
   * @param {number}    [count=1]
   * @returns {ABattler} Returns the modified/evolved ABattler (not a deep copy)
   */
  useCandy(count = 1) {
    if (!count)
      count = 1;

    var newBattler = this;
    for (var i = 0; i < count; i++)
      if (level < 100)
        newBattler = newBattler.addXP(game.experienceGroup[pokemon.expGroup].getDeltaExp(level, level + 1, levelExp));

    return newBattler;
  }

  /**
   * Use HP Up
   *
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful
   */
  useHPUp(count = 1) {
    throw new TypeError("useHPUp not callable from super class");
  }

  /**
   * Use Protein
   *
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful
   */
  useProtein(count = 1) {
    throw new TypeError("useProtein not callable from super class");
  }

  /**
   * Use Iron
   *
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful
   */
  useIron(count = 1) {
    throw new TypeError("useIron not callable from super class");
  }

  /**
   * Use Carbos
   *
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful
   */
  useCarbos(count = 1) {
    throw new TypeError("useCarbos not callable from super class");
  }

  /**
   * Use Calcium
   *
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful
   */
  useCalcium(count = 1) {
    throw new TypeError("useCalcium not callable from super class");
  }

  /**
   * Get the DV range for a stat
   *
   * @param {number}    stat    The stat index
   * @returns {DVRange} Returns the current possible DVs for the stat
   */
  getDVRange(stat) {
    throw new TypeError("getDVRange not callable from super class");
  }

  /**
   * Get the DV range for a stat
   *
   * @returns {DVRange[]} Returns the current possible DVs for the stat
   */
  getDVRanges() {
    throw new TypeError("getDVRanges not callable from super class");
  }

  // TODO
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
    var clone = new ABattler(this.game, this.pokemon, this.catchLocation, this.isTrainerMon, this.level);
    // TODO: clone.moveset = ...;
    clone.levelExp = this.levelExp;
  }

  toString() {
    return "ABattler";
  }
}
