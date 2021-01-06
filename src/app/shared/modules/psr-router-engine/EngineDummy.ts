import { Engine } from './Engine';
import { Range, Stages, BadgeBoosts } from "../psr-router-util";
import { Battler, Game, Move } from "../psr-router-model/ModelAbstract";

export class EngineDummy implements Engine {

  getDamageRange(game: Game, move: Move, attacker: Battler, defender: Battler, stagesA: Stages, stagesD: Stages, bbA: BadgeBoosts, bbD: BadgeBoosts): { range: Range, critRange: Range } {
    return { range: new Range(), critRange: new Range() };
  }

}