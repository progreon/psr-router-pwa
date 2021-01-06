import { Range, Stages, BadgeBoosts } from "../psr-router-util";
import { Battler, Game, Move } from "../psr-router-model/ModelAbstract";

export interface Engine {

  getDamageRange(game: Game, move: Move, attacker: Battler, defender: Battler, stagesA: Stages, stagesD: Stages, bbA: BadgeBoosts, bbD: BadgeBoosts): { range: Range, critRange: Range };

}