import { GameFactory } from './GameFactory';
import { GameFactory1 } from './GameFactory1';
import { GameFactoryDummy } from './GameFactoryDummy';

import * as Model from '../psr-router-model/Model';

import * as _games from 'SharedData/games.json';

let factories: { [key: number]: GameFactory; } = {
  0: new GameFactoryDummy(),
  1: new GameFactory1()
};

export function GetGameInfos(): Model.GameInfo[] {
  return Object.keys(_games).filter(k => k != "platforms").map(gameKey => {
    let info = _games[gameKey];
    return new Model.GameInfo(gameKey, info.name, info.gen, info.year, _games.platforms[info.platform], !!info.unsupported);
  });
}

/**
 * Get a game instance
 * @param gameKey The key string of a game
 * @returns The game instance
 */
export function GetGame(gameKey: string): Model.Game {
  gameKey = gameKey || "?";
  let info = _games[gameKey];
  let gameInfo: Model.GameInfo;
  if (info) {
    gameInfo = new Model.GameInfo(gameKey, info.name, info.gen, info.year, _games.platforms[info.platform], !!info.unsupported);
  } else {
    gameInfo = new Model.GameInfo(gameKey);
  }
  return factories[gameInfo.gen].GetGame(gameInfo);
};