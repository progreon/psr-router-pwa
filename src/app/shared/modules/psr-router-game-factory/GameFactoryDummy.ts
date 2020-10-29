import { GameFactory } from './GameFactory';
import { Engine } from 'SharedModules/psr-router-engine/Engine';
import { EngineDummy } from 'SharedModules/psr-router-engine/EngineDummy';

import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
import * as ModelDummy from 'SharedModules/psr-router-model/ModelDummy';

export class GameFactoryDummy extends GameFactory {
  private static readonly ENGINE = new EngineDummy();

  protected getEngine(gameInfo: Model.GameInfo): Engine {
    return GameFactoryDummy.ENGINE;
  }

  protected getModel(gameInfo: Model.GameInfo) {
    return ModelDummy;
  }

  protected getExperienceGroups(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.ExperienceGroup; } {
    return {};
  }

  protected getItems(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Item; } {
    return {};
  }

  protected getTypes(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Type; } {
    return {};
  }

  protected getTypeChart(gameInfo: Model.GameInfo) {
    return {};
  }

  protected getMoves(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Move; } {
    return {};
  }

  protected getPokemon(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Pokemon; } {
    return {};
  }

  protected getTrainers(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Trainer; } {
    return {};
  }

  protected getLocations(gameInfo: Model.GameInfo): { root: { [key: string]: Model.Location; }, all: { [key: string]: Model.Location; } } {
    return { root: {}, all: {} };
  }
}