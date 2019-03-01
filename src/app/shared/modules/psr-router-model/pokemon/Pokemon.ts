import { EvolutionKey, Type } from "../Model";
import { Move } from "../move/Move";
import { Game } from "../Game";
/**
 * Class representing an abstract pokemon
 * @todo
 * @todo jsdoc
 */
export abstract class Pokemon {
  public readonly key: string;
  private evolutions: { [key: string]: Pokemon; };
  private defaultMoves: string[];
  private learnedMoves: { [key: number]: string; };
  private tmMoves: string[];
  constructor(
    public readonly name: string,
    public readonly id: number,
    public readonly type1: Type,
    public readonly type2: Type,
    public readonly expGiven: number,
    public readonly expGroup: string, // TODO: to ExperienceGroup
    public readonly hp: number,
    public readonly atk: number,
    public readonly def: number,
    public readonly spcAtk: number,
    public readonly spcDef: number,
    public readonly spd: number) {
    this.key = name.toUpperCase();
    this.evolutions = {};
    this.defaultMoves = [];
    this.learnedMoves = {};
    this.tmMoves = [];
  }
  /**
   * @param evolutionKey
   * @param pokemon
   * @todo
   */
  addEvolution(evolutionKey: EvolutionKey, pokemon: Pokemon) {
    this.evolutions[evolutionKey.toString()] = pokemon;
  }
  getDefaultMoveset(level: number): string[] {
    let moveset = [];
    this.defaultMoves.forEach(m => {
      if (!moveset.includes(m))
        moveset.push(m);
    });
    for (let l = 1; l <= level; l++) {
      let m = this.learnedMoves[l];
      if (m && !moveset.includes(m)) {
        moveset.push(m);
      }
    }
    return moveset.slice(-4);
  }
  setDefaultMoves(defaultMoves: string[]) {
    this.defaultMoves = defaultMoves;
  }
  setTmMoves(tmMoves: string[]) {
    this.tmMoves = tmMoves;
  }
  setLearnedMoves(learnedMoves: { [key: number]: string; }) {
    this.learnedMoves = learnedMoves;
  }
  getMoves(game: Game): { level: string, move: string }[] {
    let moves: { level: string, move: string }[] = [];
    this.defaultMoves.forEach(m => moves.push({level: "0", move: m}));
    Object.keys(this.learnedMoves).forEach(l => moves.push({level: l, move: this.learnedMoves[l]}));
    this.tmMoves.forEach(m => moves.push({level: m, move: game.findItemByName(m).value}));
    return moves;
  }
  abstract getExp(level: number, participants: number, isTraded: boolean, isTrainer: boolean): number;
  abstract getCritRatio(): number;
  abstract getHighCritRatio(): number;
  compare(pokemon: Pokemon): number {
    return this.name.localeCompare(pokemon.name);
  }
  toString(): string {
    return this.name;
  }
}
