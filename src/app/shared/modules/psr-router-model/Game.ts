import * as DummyModel from './ModelDummy';
import { GameInfo, Item, Type, Trainer, Location } from './Model';
import { Move, Pokemon, Engine } from './ModelAbstract';
import { Battler } from './battler/Battler';
import { Battler1 } from './battler/Battler1';
import { BattlerDummy } from './battler/BattlerDummy';

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
  private _moves: { [key: string]: Move; };
  public get moves() { return this._moves; }
  private _pokemon: { [key: string]: Pokemon; };
  public get pokemon() { return this._pokemon; }
  private _trainers: { [key: string]: Trainer; };
  public get trainers() { return this._trainers; }
  private locations: { root: { [key: string]: Location; }, all: { [key: string]: Location; } };

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
    this._moves = builder.moves;
    this._pokemon = builder.pokemon;
    this._trainers = builder.trainers;
    this.locations = builder.locations;

    this.dummyModel = DummyModel;
    this.aliasedTrainers = {};
    for (let key in this._trainers) {
      if (this._trainers[key].alias) {
        this.aliasedTrainers[this._trainers[key].alias.toUpperCase()] = this._trainers[key];
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
    return name ? this._moves[name.toUpperCase()] : undefined;
  }

  /**
   * Find a move by tm.
   * @param tm  The tm.
   * @returns The move.
   */
  findMoveByTm(tm: Item): Move {
    return tm && tm.isTmOrHm() ? this.findMoveByName(tm.value) : undefined;
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
    return name ? this._pokemon[name.toUpperCase()] : undefined;
  }

  /**
   * Get a dummy pokemon.
   * @param name  The name of the pokemon.
   * @returns The pokemon.
   */
  getDummyPokemon(name: string): DummyModel.PokemonDummy {
    if (!name) {
      return undefined;
    } else {
      return new DummyModel.PokemonDummy(this, name);
    }
  }

  createBattler(pokemon: Pokemon, level: number, catchLocation: any = null, isTrainerMon: boolean = false): Battler {
    let b: Battler;
    switch (this.info.gen) {
      case 1:
        b = new Battler1(this, pokemon, catchLocation, isTrainerMon, level);
        break;
      default:
        let dummyP = this.getDummyPokemon(pokemon.name);
        b = new BattlerDummy(this, dummyP, catchLocation, isTrainerMon, level);
        break;
    }
    return b;
  }

  /**
   * Find a trainer by its key or alias.
   * @param key  The key or alias of the trainer.
   * @returns The trainer.
   */
  findTrainerByKeyOrAlias(key: string): Trainer {
    return key ? (this.aliasedTrainers[key.toUpperCase()] || this._trainers[key.toUpperCase()]) : undefined;
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
  findLocationByName(name: string): Location {
    return name ? this.locations.all[name.toUpperCase()] : undefined;
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
      f *= this.typeChart[typeAttacker.key] && this.typeChart[typeAttacker.key][typeDefender2.key];
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

    private _locations: { root: { [key: string]: Location; }, all: { [key: string]: Location; } };
    public get locations() { return this._locations; }
    public setLocations(locations: { root: { [key: string]: Location; }, all: { [key: string]: Location; } }): Builder {
      this._locations = locations;
      return this;
    }

    public build() {
      return new Game(this);
    }
  }
}