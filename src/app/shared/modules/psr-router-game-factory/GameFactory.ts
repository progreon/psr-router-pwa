import { Engine } from 'SharedModules/psr-router-engine/Engine';

import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';

import * as _games from 'SharedData/games.json';

export abstract class GameFactory {
  protected abstract getEngine(gameInfo: Model.GameInfo): Engine ;
  protected abstract getModel(gameInfo: Model.GameInfo): any ;
  protected abstract getExperienceGroups(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.ExperienceGroup; } ;
  protected abstract getItems(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Item; } ;
  protected abstract getTypes(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Type; } ;
  protected abstract getTypeChart(gameInfo: Model.GameInfo): any ;
  protected abstract getMoves(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Move; } ;
  protected abstract getPokemon(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Pokemon; } ;
  protected abstract getTrainers(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Trainer; } ;
  /**
   * Get a game instance.
   * @param {string}  gameKey   The key string of a game.
   * @returns {Game}  The game instance.
   */
  public GetGame(gameInfo: Model.GameInfo): Model.Game {
    let engine = this.getEngine(gameInfo);
    let model = this.getModel(gameInfo);
    let items = this.getItems(gameInfo);
    let types = this.getTypes(gameInfo);
    let typeChart = this.getTypeChart(gameInfo);
    let moves = this.getMoves(gameInfo);
    let pokemon = this.getPokemon(gameInfo);
    let experienceGroups = this.getExperienceGroups(gameInfo); // TODO: gen dependent OR static in Game-class OR only use it in Pokemon-class
    let trainers = this.getTrainers(gameInfo);
    return new Model.Game(model, engine, gameInfo, experienceGroups, items, types, typeChart, moves, pokemon, trainers);
  };
}