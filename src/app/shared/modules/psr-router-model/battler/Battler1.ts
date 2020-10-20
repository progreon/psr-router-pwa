import { Game, Item } from "../Model";
import { Battler, Pokemon } from "../ModelAbstract";
import { DVRange, Range } from "SharedModules/psr-router-util";
import { Move1 } from "../move/Move1";
import { Pokemon1 } from "../pokemon/Pokemon1";
import { EvolutionKey } from "../EvolutionKey";
import { Engine1 } from "../../psr-router-engine/Engine1";

export class Battler1 extends Battler {
  private static readonly TRAINER_DVS = [8, 9, 8, 8, 8];
  private static readonly DELTA_STATEXP = 2560;
  private static readonly MAX_STATEXP = 25600;

  private _currentStats: Range[];
  private _possibleDVs: boolean[][];
  private _statExp: number[];
  // private _statExp: Range[];

  constructor(game: Game, pokemon: Pokemon, catchLocation: any, isTrainerMon: boolean, level: number, isClone?: boolean, dvRanges?: DVRange[]) {
    super(game, pokemon, catchLocation, isTrainerMon, level);
    this._currentStats = [new Range(), new Range(), new Range(), new Range(), new Range()];
    this._initPossibleDVs(dvRanges);
    this._statExp = [0, 0, 0, 0, 0];
    // this._statExp = [new Range(), new Range(), new Range(), new Range(), new Range()];
    if (!isClone) {
      this._updateCurrentStats();
    }
  }

  private _initPossibleDVs(dvRanges?: DVRange[]) {
    // TODO: with encounter rate
    // Clear DVs
    this._possibleDVs = [[], [], [], [], []];
    if (dvRanges) {
      // TODO: handle hp dv's as well?
      this._initDVs(dvRanges[1].values, dvRanges[2].values, dvRanges[3].values, dvRanges[4].values);
    } else if (this.isTrainerMon) {
      this._initDVs([9], [8], [8], [8]);
    } else {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 16; j++) {
          this._possibleDVs[i].push(true);
        }
      }
    }
  }

  private _initDVs(atkDV: number[], defDV: number[], spdDV: number[], spcDV: number[]) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 16; j++) {
        this._possibleDVs[i].push(false);
      }
    }
    atkDV.forEach(atk => {
      defDV.forEach(def => {
        spdDV.forEach(spd => {
          spcDV.forEach(spc => {
            let hp = (atk % 2) * 8 + (def % 2) * 4 + (spd % 2) * 2 + (spc % 2);
            this._possibleDVs[0][hp] = true;
            this._possibleDVs[1][atk] = true;
            this._possibleDVs[2][def] = true;
            this._possibleDVs[3][spd] = true;
            this._possibleDVs[4][spc] = true;
          });
        });
      });
    });
  }

  defeatBattler(battler: Battler1, participants = 1): Battler {
    this.addStatXP(battler.pokemon.hp, battler.pokemon.atk, battler.pokemon.def, battler.pokemon.spd, (<Pokemon1>battler.pokemon).spc, participants);
    return this.addXP(battler.getExp(participants));
  }

  private addStatXP(hp: number, atk: number, def: number, spd: number, spc: number, nrOfPkmn: number) {
    this._statExp[0] += hp / nrOfPkmn;
    this._statExp[1] += atk / nrOfPkmn;
    this._statExp[2] += def / nrOfPkmn;
    this._statExp[3] += spd / nrOfPkmn;
    this._statExp[4] += spc / nrOfPkmn;
  }

  evolve(key: EvolutionKey): Battler {
    let p = this.pokemon.getEvolution(key);
    if (p) {
      let evo = new Battler1(this.game, p, this.catchLocation, this.isTrainerMon, this.level);
      // TODO: evolution moves?
      evo._moveset = this._moveset;
      evo._statExp = this._statExp;
      evo._levelExp = this._levelExp;
      evo._possibleDVs = this._possibleDVs;
      evo._updateCurrentStats();
      return evo;
    } else {
      return this;
    }
  }

  resetStatXP() {
    this._statExp = [0, 0, 0, 0, 0];
  }

  addXP(exp: number): Battler {
    this._levelExp += exp;
    let totExp = this.pokemon.expGroup.getTotalExp(this.level, this._levelExp);
    let oldLevel = this.level;
    let newLevel = this.pokemon.expGroup.getLevel(totExp);
    if (this.level != newLevel) {
      this._levelExp -= this.pokemon.expGroup.getDeltaExp(this.level, newLevel);
      this._level = newLevel;
      this._updateCurrentStats(); // Handle it the RBY way
      // List<Move> newMoves = pokemon.getLearnedMoves(level); // Handle it the RBY way
      let newMoves = this.pokemon.getLearnedMoves(this.level); // Handle it the RBY way
      newMoves.forEach(nm => {
        // TODO: check what move to override -> make Battler settings?
        if (this._moveset.length < 4) {
          this._moveset.push(nm);
        } else {
          let i = this._moveset.indexOf(this.settings.levelUpMoves[nm]?.key);
          if (i > 0) {
            this._moveset[i] = nm;
          }
        }
        // if (this._moveset.length > 4) {
        //   this._moveset = this._moveset.slice(-4);
        // }
      });
    }

    let evo: Battler = this;
    for (let l = 1; l <= newLevel; l++) {
      evo = evo.evolve(new EvolutionKey(EvolutionKey.Type.Level, `${l}`));
    }
    return evo;
  }

  useHPUp(count = 1): boolean {
    let success = true;
    for (let i = 0; i < count; i++) {
      if (this._statExp[0] < Battler1.MAX_STATEXP) {
        this._statExp[0] = Math.min(this._statExp[0] + Battler1.DELTA_STATEXP, Battler1.MAX_STATEXP);
      } else {
        success = false;
      }
    }
    return success;
  }

  useProtein(count = 1): boolean {
    let success = true;
    for (let i = 0; i < count; i++) {
      if (this._statExp[1] < Battler1.MAX_STATEXP) {
        this._statExp[1] = Math.min(this._statExp[1] + Battler1.DELTA_STATEXP, Battler1.MAX_STATEXP);
      } else {
        success = false;
      }
    }
    return success;
  }

  useIron(count = 1): boolean {
    let success = true;
    for (let i = 0; i < count; i++) {
      if (this._statExp[2] < Battler1.MAX_STATEXP) {
        this._statExp[2] = Math.min(this._statExp[2] + Battler1.DELTA_STATEXP, Battler1.MAX_STATEXP);
      } else {
        success = false;
      }
    }
    return success;
  }

  useCarbos(count = 1): boolean {
    let success = true;
    for (let i = 0; i < count; i++) {
      if (this._statExp[3] < Battler1.MAX_STATEXP) {
        this._statExp[3] = Math.min(this._statExp[3] + Battler1.DELTA_STATEXP, Battler1.MAX_STATEXP);
      } else {
        success = false;
      }
    }
    return success;
  }

  useCalcium(count = 1): boolean {
    let success = true;
    for (let i = 0; i < count; i++) {
      if (this._statExp[4] < Battler1.MAX_STATEXP) {
        this._statExp[4] = Math.min(this._statExp[4] + Battler1.DELTA_STATEXP, Battler1.MAX_STATEXP);
      } else {
        success = false;
      }
    }
    return success;
  }

  getDVRange(stat: number): DVRange {
    let range = new DVRange();
    for (let dv = 0; dv < 16; dv++) {
      if (this._possibleDVs[stat][dv]) {
        range.addDV(dv);
      }
    }
    return range;
  }

  getDVRanges(): DVRange[] {
    let ranges: DVRange[] = [];
    for (let s = 0; s < 5; s++) {
      ranges.push(this.getDVRange(s));
    }
    return ranges;
  }

  get hp(): Range { return this._currentStats[0]; }
  get atk(): Range { return this._currentStats[1]; }
  get def(): Range { return this._currentStats[2]; }
  get spcAtk(): Range { throw new Error("Method not implemented."); }
  get spcDef(): Range { throw new Error("Method not implemented."); }
  get spd(): Range { return this._currentStats[3]; }
  get spc(): Range { return this._currentStats[4]; }

  get hpXP(): number { return this._statExp[0]; }
  get atkXP(): number { return this._statExp[1]; }
  get defXP(): number { return this._statExp[2]; }
  get spcAtkXP(): number { throw new Error("Method not implemented."); }
  get spcDefXP(): number { throw new Error("Method not implemented."); }
  get spdXP(): number { return this._statExp[3]; }
  get spcXP(): number { return this._statExp[4]; }

  private _updateCurrentStats() {
    this._currentStats[0] = this._calculateHP();
    this._currentStats[1] = this._calculateAtk();
    this._currentStats[2] = this._calculateDef();
    this._currentStats[3] = this._calculateSpd();
    this._currentStats[4] = this._calculateSpc();
  }

  private _calculateHP(): Range {
    let dvR = this.getDVRange(0);
    let extraStats = 0;
    if (this.hpXP - 1 >= 0) {
      extraStats = Math.floor(Math.floor((Math.sqrt(this.hpXP - 1) + 1)) / 4);
    }
    let r = new Range();
    dvR.values.forEach(dv => {
      r.addValue(Math.floor((((this.pokemon.hp + dv + 50) * 2 + extraStats) * this.level / 100) + 10));
    });
    return r;
  }

  private _calculateAtk() {
    let dvR = this.getDVRange(1);
    let r = new Range();
    dvR.values.forEach(dv => {
      r.addValue(this._calculateStat(this.level, this.pokemon.atk, dv, this.atkXP));
    });
    return r;
  }

  private _calculateDef() {
    let dvR = this.getDVRange(2);
    let r = new Range();
    dvR.values.forEach(dv => {
      r.addValue(this._calculateStat(this.level, this.pokemon.def, dv, this.defXP));
    });
    return r;
  }

  private _calculateSpd() {
    let dvR = this.getDVRange(3);
    let r = new Range();
    dvR.values.forEach(dv => {
      r.addValue(this._calculateStat(this.level, this.pokemon.spd, dv, this.spdXP));
    });
    return r;
  }

  private _calculateSpc() {
    let dvR = this.getDVRange(4);
    let r = new Range();
    dvR.values.forEach(dv => {
      r.addValue(this._calculateStat(this.level, (<Pokemon1>this.pokemon).spc, dv, this.spcXP));
    });
    return r;
  }

  private _calculateStat(level: number, base: number, DV: number, XP: number) {
    let extraStats = 0;
    if (XP - 1 >= 0) {
      extraStats = Math.floor(Math.floor(Math.sqrt(XP - 1) + 1) / 4);
    }
    let statValue = Math.floor((((base + DV) * 2 + extraStats) * level / 100) + 5);
    return statValue;
  }

  protected getBoostedStat(statRange: Range, badgeBoostCount: number, xItemCount: number): Range {
    let boostedRange = statRange.clone();
    boostedRange = boostedRange.multiplyBy(Engine1.getStageMultiplier(xItemCount)).divideBy(Engine1.getStageDivider(xItemCount));
    for (let bb = 0; bb < badgeBoostCount; bb++) {
      boostedRange = boostedRange.multiplyBy(9).divideBy(8).floor();
    }
    return boostedRange;
  }

  //     public int getHPStatIfDV(int DV) {
  //         double extraStats = 0;
  //         if (hpXP - 1 >= 0) {
  //             extraStats = Math.floor(Math.floor((Math.sqrt(hpXP - 1) + 1)) / 4);
  //         }
  //         double statValue = Math.floor((((pokemon.hp + DV + 50) * 2 + extraStats) * level / 100) + 10);
  //         return (int) statValue;
  //     }
  //
  //     public int getAtkStatIfDV(int DV) {
  //         int stat = calculateStat(level, pokemon.atk, DV, atkXP);
  //         return stat;
  //     }
  //
  //     public int getDefStatIfDV(int DV) {
  //         int stat = calculateStat(level, pokemon.def, DV, defXP);
  //         return stat;
  //     }
  //
  //     public int getSpdStatIfDV(int DV) {
  //         int stat = calculateStat(level, pokemon.spd, DV, spdXP);
  //         return stat;
  //     }
  //
  //     public int getSpcStatIfDV(int DV) {
  //         int stat = calculateStat(level, pokemon.spc, DV, spcXP);
  //         return stat;
  //     }

  equals(battler: Battler): boolean {
    if (battler instanceof Battler1) {
      let b = <Battler1>battler;
      return this.game == b.game
        && this.pokemon == b.pokemon
        && this.moveset == b.moveset // TODO: check if this works!
        && this.catchLocation == b.catchLocation
        && this.level == b.level
        && this.levelExp == b.levelExp
        && this._statExp == b._statExp // TODO: check if this works!
        && this._possibleDVs == b._possibleDVs; // TODO: check if this works!
    } else {
      return false;
    }
  }

  clone(): Battler {
    let newB = new Battler1(this.game, this.pokemon, this.catchLocation, this.isTrainerMon, this.level, true);

    newB._moveset = this._moveset.slice(0);
    newB._levelExp = this._levelExp;
    newB._statExp = this._statExp.slice(0); // TODO: deep copy if using ranges!

    newB._possibleDVs = [];
    this._possibleDVs.forEach(pdvs => newB._possibleDVs.push(pdvs.slice(0)));
    newB._currentStats = [];
    this._currentStats.forEach(cs => newB._currentStats.push(cs.clone()));

    newB._settings = this._settings;

    return newB;
  }

}

// public class BattlerImpl extends Battler {
//     /**
//      * Use this constructor if it's a trainer pokemon.
//      *
//      * @param rd
//      * @param pokemon
//      * @param level
//      * @param moveset
//      */
//     public BattlerImpl(RouterData rd, Pokemon pokemon, int level, Move[] moveset) {
//         super(rd, pokemon, null, true, level);
//         this.moveset = moveset;
//         if (this.moveset == null) {
//             initDefaultMoveSet(pokemon, level);
//         }
//         initPossibleDVs();
//         updateCurrentStats();
//     }
//
//     /**
//      * Use this constructor if it's a caught pokemon, or a given one.
//      *
//      * @param rd
//      * @param pokemon
//      * @param catchLocation null if pokemon was a given one
//      * @param level
//      */
//     public BattlerImpl(RouterData rd, Pokemon pokemon, EncounterArea catchLocation, int level) {
//         super(rd, pokemon, catchLocation, false, level);
//         initDefaultMoveSet(pokemon, level);
//         initPossibleDVs();
//         updateCurrentStats();
//     }
//
//     /**
//      * Use this constructor if it's a caught pokemon.
//      *
//      * @param rd
//      * @param catchLocation
//      * @param slot
//      */
//     public BattlerImpl(RouterData rd, EncounterArea catchLocation, int slot) {
//         super(rd, catchLocation.slots[slot].pkmn, catchLocation, false, catchLocation.slots[slot].level);
//         initDefaultMoveSet(pokemon, level);
//         initPossibleDVs();
//         updateCurrentStats();
//     }
//
//     /**
//      * Use this constructor if it's a RNG manip'd pokemon
//      *
//      * @param rd
//      * @param catchLocation
//      * @param pokemon
//      * @param level
//      * @param atkDV
//      * @param defDV
//      * @param spdDV
//      * @param spcDV
//      */
//     public BattlerImpl(RouterData rd, EncounterArea catchLocation, Pokemon pokemon, int level, int atkDV, int defDV, int spdDV, int spcDV) {
//         super(rd, pokemon, catchLocation, false, level);
//         initDefaultMoveSet(pokemon, level);
//         initPossibleDVs(atkDV, defDV, spdDV, spcDV);
//         updateCurrentStats();
//     }
//
//     @Override
//     public int hashCode() {
//         int hash = 7;
//         hash = 89 * hash + Objects.hashCode(this.pokemon);
//         hash = 89 * hash + Arrays.deepHashCode(this.moveset);
//         hash = 89 * hash + Objects.hashCode(this.catchLocation);
//         hash = 89 * hash + this.level;
//         hash = 89 * hash + this.levelExp;
//         hash = 89 * hash + this.hpXP;
//         hash = 89 * hash + this.atkXP;
//         hash = 89 * hash + this.defXP;
//         hash = 89 * hash + this.spdXP;
//         hash = 89 * hash + this.spcXP;
//         hash = 89 * hash + Arrays.deepHashCode(this.possibleDVs);
//         return hash;
//     }
//
// }
