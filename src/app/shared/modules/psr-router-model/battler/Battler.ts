import { Game } from "../Game";
import { Item } from "../ModelAbstract";
import { Move } from "../ModelAbstract";
import { Pokemon } from "../ModelAbstract";
import { Type } from "../ModelAbstract";

import { DVRange } from "SharedModules/psr-router-util";
import { Range } from 'SharedModules/psr-router-util';
import { EvolutionKey } from "../EvolutionKey";

/**
 * Class representing a battler
 * TODO: Change useCandy, useHPUP, ... to useItem?
 */
export abstract class Battler {
  protected _level: number;
  protected _moveset: string[];
  protected _levelExp: number;
  public get level(): number { return this._level; }
  public get moveset(): string[] { return this._moveset; }
  public get levelExp(): number { return this._levelExp; }

  /**
   *
   * @param game          The game
   * @param pokemon       The pokemon
   * @param catchLocation The catch location of this battler (used for calculating possible DVs)
   * @param isTrainerMon  If it's a trainer's pokemon (TODO: do this more properly?)
   * @param level         The current level
   */
  constructor(
    public readonly game: Game,
    public readonly pokemon: Pokemon,
    public readonly catchLocation: any, // string/EncounterArea?
    public readonly isTrainerMon: boolean,
    level: number) {
    this._level = level;
    this._moveset = pokemon.getDefaultMoveset(level); // TODO: hold Move's or strings of keys for Move?
    this._levelExp = 0;
  }

  /**
   * Defeat given battler, this battler is modified but not evolved.
   * @param battler       The battler to defeat
   * @param participants  The number of participants in the battle (defaults to 1)
   * @returns Returns the modified/evolved battler (not a deep copy)
   */
  abstract defeatBattler(battler: Battler, participants: number): Battler;

  /**
   * Tries to evolve the battler with the specified item.
   * @param key The level/item/.. which triggers the evolution
   * @returns Returns the evolved battler or null if it couldn't evolve
   */
  abstract evolve(key: EvolutionKey): Battler;

  /**
   * Add experience, this battler is modified but not evolved.
   * @param exp The experience to add
   * @returns Returns the modified/evolved Battler (not a deep copy)
   */
  abstract addXP(exp: number): Battler;

  /**
   * Try to learn a TM or HM move.
   * TODO: Move or string?
   * TODO: (get via game): let canLearn = pokemon.getTMMoves().contains(newMove)
   * @param newMove The TM or HM move
   * @param oldMove
   * @returns Returns true if success.
   */
  learnTmMove(newMove: string, oldMove?: string): boolean {
    let success = false;
    let moves = this._moveset;
    let canLearn = false; // TODO
    if (canLearn && !moves.includes(newMove)) {
      if (!oldMove || moves.includes(oldMove)) {
        let i = 0;
        while ( i < 4 && oldMove != this._moveset[i] && this._moveset[i] != null)
          i++;
        // only remove the move if no more room!
        if (i < 4) {
          this._moveset[i] = newMove;
          success = true;
        }
      }
    }
    return success;
  }

  /**
   * Use some Rare Candies.
   * @param count
   * @returns Returns the modified/evolved Battler (not a deep copy).
   */
  useCandy(count = 1): Battler {
    let newBattler: Battler = this;

    for (let i = 0; i < count; i++)
      if (this.level < 100)
        newBattler = newBattler.addXP(this.pokemon.expGroup.getDeltaExp(this.level, this.level + 1, this._levelExp));

    return newBattler;
  }

  /**
   * Use some HP Up.
   * @param count
   * @returns Returns true if successful.
   */
  abstract useHPUp(count: number): boolean;

  /**
   * Use some Protein.
   * @param count
   * @returns Returns true if successful.
   */
  abstract useProtein(count: number): boolean;

  /**
   * Use some Iron.
   * @param count
   * @returns Returns true if successful.
   */
  abstract useIron(count: number): boolean;

  /**
   * Use some Carbos.
   * @param count
   * @returns Returns true if successful.
   */
  abstract useCarbos(count: number): boolean;

  /**
   * Use some Calcium.
   * @param count
   * @returns Returns true if successful.
   */
  abstract useCalcium(count: number): boolean;

  /**
   * Get the DV range for a stat.
   * @param stat  The stat index
   * @returns The current possible DVs for the stat.
   */
  abstract getDVRange(stat: number): DVRange;

  /**
   * Get the DV range for a stat.
   * @returns The current possible DVs for the stat.
   */
  abstract getDVRanges(): DVRange[];

  abstract get hp(): Range;
  abstract get atk(): Range;
  abstract get def(): Range;
  abstract get spcAtk(): Range;
  abstract get spcDef(): Range;
  abstract get spd(): Range;
  // TODO: only define this in battler-1
  abstract get spc(): Range;

  abstract get hpXP(): number;
  abstract get atkXP(): number;
  abstract get defXP(): number;
  abstract get spcAtkXP(): number;
  abstract get spcDefXP(): number;
  abstract get spdXP(): number;
  // TODO: only define this in battler-1
  abstract get spcXP(): number;

  /**
   * Get the current attack stat value with boosts.
   * @param badgeBoosts
   * @param stage
   * @returns The boosted attack stat value.
   */
  getBoostedAtk(badgeBoosts: number, stage: number): Range {
    return this.getBoostedStat(this.atk, badgeBoosts, stage);
  }

  /**
   * Get the current defense stat value with boosts.
   * @param badgeBoosts
   * @param stage
   * @returns The boosted defense stat value.
   */
  getBoostedDef(badgeBoosts: number, stage: number): Range {
    return this.getBoostedStat(this.def, badgeBoosts, stage);
  }

  /**
   * Get the current special attack stat value with boosts.
   * @param badgeBoosts
   * @param stage
   * @returns The boosted attack stat value.
   */
  getBoostedSpcAtk(badgeBoosts: number, stage: number): Range {
    return this.getBoostedStat(this.spcAtk, badgeBoosts, stage);
  }

  /**
   * Get the current special defense stat value with boosts.
   * @param badgeBoosts
   * @param stage
   * @return The boosted attack stat value.
   */
  getBoostedSpcDef(badgeBoosts: number, stage: number): Range {
    return this.getBoostedStat(this.spcDef, badgeBoosts, stage);
  }

  /**
   * Get the current speed stat value with boosts.
   * @param badgeBoosts
   * @param stage
   * @returns The boosted speed stat value.
   */
  getBoostedSpd(badgeBoosts: number, stage: number): Range {
    return this.getBoostedStat(this.spd, badgeBoosts, stage);
  }

  /**
   * Get the current special stat value with boosts.
   * @param badgeBoosts
   * @param stage
   * @returns The boosted special stat value.
   */
  getBoostedSpc(badgeBoosts: number, stage: number): Range {
    return this.getBoostedStat(this.spc, badgeBoosts, stage);
  }

  /**
   * Get the current stat value with boosts.
   * @param statRange
   * @param badgeBoostCount
   * @param xItemCount
   * @returns The current stat value with boosts.
   */
  protected abstract getBoostedStat(statRange: Range, badgeBoostCount: number, xItemCount: number): Range;

  /**
   * Check if the battler has the given type.
   * @param type
   * @returns Returns true if the battler has the given type.
   */
  isType(type: Type): boolean {
    return type == this.pokemon.type1 || (this.pokemon.type2 != null && type == this.pokemon.type2);
  }

  /**
   * Get the experience a battler gets for battling this pokemon.
   * @param participants  The number of participants in the battle.
   * @returns The experience.
   */
  getExp(participants: number = 1): number {
    return this.pokemon.getExp(this.level, participants, false, this.isTrainerMon);
  }

  abstract equals(battler: Battler): boolean;

  abstract clone(): Battler;

  toString(): string {
    return `${this.pokemon.name} Lv.${this.level}`;
  }
}
