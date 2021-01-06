import { Engine } from 'SharedModules/psr-router-engine/Engine';

import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';

import * as _games from 'SharedData/games.json';

export abstract class GameFactory {
  protected abstract getEngine(gameInfo: Model.GameInfo): Engine;
  protected abstract getModel(gameInfo: Model.GameInfo): any;
  protected abstract getExperienceGroups(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.ExperienceGroup; };
  protected abstract getItems(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Item; };
  protected abstract getTypes(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Type; };
  protected abstract getTypeChart(gameInfo: Model.GameInfo): any;
  protected abstract getMoves(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Move; };
  protected abstract getPokemon(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Pokemon; };
  protected abstract getTrainers(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Trainer; };
  protected abstract getLocations(gameInfo: Model.GameInfo): { root: { [key: string]: Model.Location; }, all: { [key: string]: Model.Location; } };
  /**
   * Get a game instance.
   * @param {string}  gameKey   The key string of a game.
   * @returns {Game}  The game instance.
   */
  public GetGame(gameInfo: Model.GameInfo): Model.Game {
    // let gb = new Model.Game.Builder();
    return new Model.Game.Builder()
      .setInfo(gameInfo)
      .setEngine(this.getEngine(gameInfo))
      .setModel(this.getModel(gameInfo))
      .setItems(this.getItems(gameInfo))
      .setTypes(this.getTypes(gameInfo))
      .setTypeChart(this.getTypeChart(gameInfo))
      .setMoves(this.getMoves(gameInfo))
      .setPokemon(this.getPokemon(gameInfo))
      .setExperienceGroups(this.getExperienceGroups(gameInfo)) // TODO: gen dependent OR static in Game-class OR only use it in Pokemon-class
      .setTrainers(this.getTrainers(gameInfo))
      .setLocations(this.getLocations(gameInfo))
      .build();
    // return new Model.Game(model, engine, gameInfo, experienceGroups, items, types, typeChart, moves, pokemon, trainers);
  };
}