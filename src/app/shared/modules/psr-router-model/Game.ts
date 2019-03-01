import * as DummyModel from './ModelDummy';
import { GameInfo, Item, Type, Trainer } from './Model';
import { Move, Pokemon } from './ModelAbstract';

/**
 * Class representing a game.
 */
export class Game {
  public readonly dummyModel: any;
  private aliasedTrainers: { [key: string]: Trainer; };
  /**
   *
   * @param model           The "model" classes and methods this game uses
   * @param engine          The "engine" classes and methods this game uses
   * @param experienceGroup The experience groups
   * @param info            The info on this game
   * @param items           All the items in this game
   * @param types           All the types in this game
   * @param typeChart       The type chart this game uses
   * @param moves           All the moves in this game
   * @param pokemon         All the pokemon in this game
   * @param trainers        All the trainers in this game
   */
  constructor(
    public readonly model: any,
    public readonly engine: any,
    public readonly info: GameInfo,
    public readonly experienceGroup: any,
    private items: { [key: string]: Item; },
    private types: { [key: string]: Type; },
    private typeChart: any,
    private moves: { [key: string]: Move; },
    private pokemon: { [key: string]: Pokemon; },
    private trainers: { [key: string]: Trainer; }
  ) {
    this.dummyModel = DummyModel;
    this.aliasedTrainers = {};
    for (let key in this.trainers) {
      if (this.trainers[key].alias) {
        this.aliasedTrainers[this.trainers[key].alias.toUpperCase()] = this.trainers[key];
      }
    }
  }

  /**
   * Find an item by name.
   * @param name  The name of the item.
   * @returns The item.
   */
  findItemByName(name: string): Item {
    return name ? this.items[name.toUpperCase()] : undefined;
  }

  /**
   * Get a dummy item.
   * @param name  The name of the item.
   * @returns The item.
   */
  getDummyItem(name: string): Item {
    if (!name) {
      return undefined;
    } else {
      let item = new Item(name, name, "", 0, "Dummy", name, "Dummy Item");
      item.dummy = true;
      return item;
    }
  }

  /**
   * Find a move by name.
   * @param name  The name of the move.
   * @returns The move.
   */
  findMoveByName(name: string): Move {
    return name ? this.moves[name.toUpperCase()] : undefined;
  }

  /**
   * Get a dummy move.
   * @param name  The name of the move.
   * @returns The move.
   */
  getDummyMove(name: string): Move {
    if (!name) {
      return undefined;
    } else {
      return new DummyModel.MoveDummy(name);
    }
  }

  /**
   * Find a pokemon by name.
   * @param name  The name of the pokemon.
   * @returns The pokemon.
   */
  findPokemonByName(name: string): Pokemon {
    return name ? this.pokemon[name.toUpperCase()] : undefined;
  }

  /**
   * Get a dummy pokemon.
   * @param name  The name of the pokemon.
   * @returns The pokemon.
   */
  getDummyPokemon(name: string): Pokemon {
    if (!name) {
      return undefined;
    } else {
      return new DummyModel.PokemonDummy(name);
    }
  }

  /**
   * Find a trainer by its key or alias.
   * @param key  The key or alias of the trainer.
   * @returns The trainer.
   */
  findTrainerByKeyOrAlias(key: string): Trainer {
    return key ? (this.aliasedTrainers[key.toUpperCase()] || this.trainers[key.toUpperCase()]) : undefined;
  }

  /**
   * Get a dummy trainer.
   * @param name  The name of the trainer.
   * @returns The trainer.
   */
  getDummyTrainer(name: string): Trainer {
    if (!name) {
      return undefined;
    } else {
      let trainer = new Trainer(name, name, name, [], "");
      trainer.dummy = true;
      return trainer;
    }
  }

  /**
   * Find a type by name.
   * @param name  The name of the type.
   * @returns The type.
   */
  findTypeByName(name: string): Type {
    return name ? this.types[name.toUpperCase()] : undefined;
  }

  /**
   * Get a dummy type.
   * @param name  The name of the type.
   * @returns The type.
   */
  getDummyType(name: string): Type {
    if (!name) {
      return undefined;
    } else {
      let type = new Type(name, name);
      type.dummy = true;
      return type;
    }
  }
}
