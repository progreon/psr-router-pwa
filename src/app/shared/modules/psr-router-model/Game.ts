import * as DummyModel from './ModelDummy';
import { GameInfo, Item, Type, Trainer } from './Model';
import { Move, Pokemon, Engine } from './ModelAbstract';

/**
 * Class representing a game.
 */
export class Game {

  public readonly model: any;
  public readonly engine: Engine;
  public readonly info: GameInfo;
  public readonly experienceGroups: any;
  private items: { [key: string]: Item; };
  private types: { [key: string]: Type; };
  private typeChart: any;
  private moves: { [key: string]: Move; };
  private pokemon: { [key: string]: Pokemon; };
  private trainers: { [key: string]: Trainer; };

  public readonly dummyModel: any;
  private aliasedTrainers: { [key: string]: Trainer; };
  /**
   *
   * @param builder   The builder instance to build this game with
   */
  constructor(builder: Game.Builder) {
    this.model = builder.model;
    this.engine = builder.engine;
    this.info = builder.info
    this.experienceGroups = builder.experienceGroups;
    this.items = builder.items;
    this.types = builder.types;
    this.typeChart = builder.typeChart;
    this.moves = builder.moves;
    this.pokemon = builder.pokemon;
    this.trainers = builder.trainers;

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
      return new DummyModel.PokemonDummy(this, name);
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

  getTypeMultiplier(typeAttacker: Type, typeDefender1: Type, typeDefender2: Type): number {
    let f = this.typeChart[typeAttacker.key] && this.typeChart[typeAttacker.key][typeDefender1.key];
    if (typeDefender2) {
      f * this.typeChart[typeAttacker.key] && this.typeChart[typeAttacker.key][typeDefender2.key];
    }
    return f;
  }
}

export namespace Game {
  export class Builder {

    private _model: any;
    public get model() { return this._model; }
    public setModel(model: any): Builder {
      this._model = model;
      return this;
    }

    private _engine: Engine;
    public get engine() { return this._engine; }
    public setEngine(engine: Engine): Builder {
      this._engine = engine;
      return this;
    }

    private _info: GameInfo;
    public get info() { return this._info; }
    public setInfo(info: GameInfo): Builder {
      this._info = info;
      return this;
    }

    private _experienceGroups: any;
    public get experienceGroups() { return this._experienceGroups; }
    public setExperienceGroups(experienceGroups: any): Builder {
      this._experienceGroups = experienceGroups;
      return this;
    }

    private _items: { [key: string]: Item; };
    public get items() { return this._items; }
    public setItems(items: { [key: string]: Item; }): Builder {
      this._items = items;
      return this;
    }

    private _types: { [key: string]: Type; };
    public get types() { return this._types; }
    public setTypes(types: { [key: string]: Type; }): Builder {
      this._types = types;
      return this;
    }

    private _typeChart: any;
    public get typeChart() { return this._typeChart; }
    public setTypeChart(typeChart: any): Builder {
      this._typeChart = typeChart;
      return this;
    }

    private _moves: { [key: string]: Move; };
    public get moves() { return this._moves; }
    public setMoves(moves: { [key: string]: Move; }): Builder {
      this._moves = moves;
      return this;
    }

    private _pokemon: { [key: string]: Pokemon; };
    public get pokemon() { return this._pokemon; }
    public setPokemon(pokemon: { [key: string]: Pokemon; }): Builder {
      this._pokemon = pokemon;
      return this;
    }

    private _trainers: { [key: string]: Trainer; };
    public get trainers() { return this._trainers; }
    public setTrainers(trainers: { [key: string]: Trainer; }): Builder {
      this._trainers = trainers;
      return this;
    }

    public build() {
      return new Game(this);
    }
  }
}