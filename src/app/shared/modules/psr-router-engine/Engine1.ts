import { Engine } from './Engine';
import { Range, Stages, BadgeBoosts } from "../psr-router-util";
import { Battler, Game } from "../psr-router-model/ModelAbstract";
import { Battler1, Move1 } from '../psr-router-model/Model1';

export class Engine1 implements Engine {

  public static getStageMultiplier(stage: number): number {
    if (stage < -6) stage = -6;
    if (stage > 6) stage = 6;
    return [25, 28, 33, 40, 50, 66, 1, 15, 2, 25, 3, 35, 4][stage + 6];
  }

  public static getStageDivider(stage: number): number {
    if (stage < -6) stage = -6;
    if (stage > 6) stage = 6;
    return [100, 100, 100, 100, 100, 100, 1, 10, 1, 10, 1, 10, 1][stage + 6];
  }

  public getDamageRange(game: Game, move: string, attacker: Battler, defender: Battler, stagesA: Stages, stagesD: Stages, bbA: BadgeBoosts, bbD: BadgeBoosts): { range: Range, critRange: Range } {
    let range: Range = this._getDamageRange(game, move, attacker, defender, stagesA, stagesD, bbA, bbD, false);
    let critRange: Range = this._getDamageRange(game, move, attacker, defender, stagesA, stagesD, bbA, bbD, true);
    return {range, critRange};
  }

  /**
   *
   * @param attacker
   * @param defender
   * @param stagesA
   * @param stagesD
   * @param bbA
   * @param bbD
   * @param isCrit
   * @todo confusion & night shade damage
   * @todo check with https://github.com/pokemon-speedrunning/RouteOne/blob/master/src/DamageCalculator.java
   * @see https://web.archive.org/web/20171112181444/http://upcarchive.playker.info/0/upokecenter/content/pokemon-red-version-blue-version-and-yellow-version-damage-calculation-process.html
   */
  private _getDamageRange(game: Game, move: string, attacker: Battler, defender: Battler, stagesA: Stages, stagesD: Stages, bbA: BadgeBoosts, bbD: BadgeBoosts, isCrit: Boolean): Range {
    let m: Move1 = <Move1> game.findMoveByName(move);
    let isPhysical = m.type.isPhysical;
    let a: Battler1 = <Battler1> attacker;
    let d: Battler1 = <Battler1> defender;

    let range: Range = new Range();
    if (m.power == 0) {
      // TODO: special cases?
      return range;
    }

    // (1), (2), (4)
    let atkRange = isPhysical ? a.getBoostedAtk(isCrit ? 0 : bbA.atk, isCrit ? 0 : stagesA.atk) : a.getBoostedSpc(isCrit ? 0 : bbA.spc, isCrit ? 0 : stagesA.spc);
    let defRange = isPhysical ? d.getBoostedDef(isCrit ? 0 : bbD.def, isCrit ? 0 : stagesD.def) : d.getBoostedSpc(isCrit ? 0 : bbD.spc, isCrit ? 0 : stagesD.spc);
    atkRange.getValuesArray().forEach(atk => {
      // TODO: (3) attacker is burned
      defRange.getValuesArray().forEach(def => {
        let attack = atk;
        let defense = def;
        // (5) Selfdestruct & Explosion
        if (m.effect == "EXPLODE_EFFECT") {
          defense = Math.floor(defense / 2);
        }
        // (6) If the Attack or Defense stat exceeds 255, both stats are equal to ((((X/2)%255)/2)%255)
        if (attack > 255 || defense > 255) {
          attack = (Math.floor((Math.floor(attack / 2) % 255) / 2) % 255);
          defense = (Math.floor((Math.floor(defense / 2) % 255) / 2) % 255);
        }
        // TODO: (7) Reflect in effect
        // TODO: (8) Light Screen in effect
        // (9)
        attack = Math.max(1, attack);
        defense = Math.max(1, defense);
        // (10)
        let damage = (attacker.level * (isCrit ? 2 : 1)) % 256;
        damage = Math.floor(damage * 2 / 5 + 2);
        damage = Math.floor(damage * attack * m.power / defense);
        damage /= 50;
        // (11), (12)
        damage = Math.min(Math.floor(damage), 997) + 2;
        // (13)
        damage = Math.floor(attacker.isType(m.type) ? damage * 3 / 2 : damage); // STAB
        // (14)
        damage *= game.getTypeMultiplier(m.type, defender.pokemon.type1, defender.pokemon.type2);
        damage = Math.floor(damage);
        // (15)
        if (damage != 0) {
            for (let i = 217; i < 256; i++) { // Add all possible damages
              range.addValue(Math.max(Math.floor(damage * i / 255), 1));
            }
        }
      });
    });

    return range;
  }
}
