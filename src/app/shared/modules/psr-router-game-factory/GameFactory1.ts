import { GameFactory } from "./GameFactory";
import { Engine } from 'SharedModules/psr-router-engine/Engine';
import { Engine1 } from 'SharedModules/psr-router-engine/Engine1';

import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
import * as Model1 from 'SharedModules/psr-router-model/Model1';

import * as _types from 'SharedData/types.json';
import * as _items from 'SharedData/items-1.json';
import * as _moves from 'SharedData/moves-1.json';
import * as _movesLearnedRB from 'SharedData/moves-learned-rb.json';
import * as _movesLearnedY from 'SharedData/moves-learned-y.json';
import * as _pokemon from 'SharedData/pokemon-1.json';
import * as _evolutions from 'SharedData/evolutions-1.json';
import * as _trainersRB from 'SharedData/trainers-rb.json';
import * as _trainersY from 'SharedData/trainers-y.json';
import * as _encountersR from 'SharedData/encounters/encounters-r.json';
import * as _encountersB from 'SharedData/encounters/encounters-b.json';
import * as _encountersY from 'SharedData/encounters/encounters-y.json';

export class GameFactory1 extends GameFactory {
  private static readonly ENGINE = new Engine1();
  private static _items: { [key: string]: ModelAbstract.Item; };
  private static _types: { [key: string]: ModelAbstract.Type; };
  private static _typeChart: any;
  private static _moves: { [key: string]: ModelAbstract.Move; };
  private static _pokemonPerGame: { [key: string]: { [key: string]: ModelAbstract.Pokemon; } };
  private static _trainersPerGame: { [key: string]: { [key: string]: ModelAbstract.Trainer; } };

  constructor() {
    super();
  }

  protected getEngine(gameInfo: Model.GameInfo): Engine {
    return GameFactory1.ENGINE;
  }

  protected getModel(gameInfo: Model.GameInfo): any {
    return Model1;
  }

  protected getExperienceGroups(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.ExperienceGroup; } {
    return Model1.ExperienceGroups1;
  }

  protected getItems(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Item; } {
    if (!GameFactory1._items) {
      GameFactory1._items = {};
      for (let key in _items) {
        if (key !== "info") {
          let item = _items[key];
          GameFactory1._items[key] = new Model.Item(key, item[0], item[1], item[2], item[3], item[4], item[5]);
        }
      }
    }
    return GameFactory1._items;
  }

  protected getTypes(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Type; } {
    if (!GameFactory1._types) {
      GameFactory1._types = {};
      for (let i = 0; i < _types["types"].length; i++) {
        let key = _types["types"][i];
        GameFactory1._types[key] = new Model.Type(key, _types["names"][i], _types["isPhysical"][i]);
      }
    }
    return GameFactory1._types;
  }

  protected getTypeChart(gameInfo: Model.GameInfo) {
    if (!GameFactory1._typeChart) {
      GameFactory1._typeChart = {};
      _types["charts"].forEach(el => {
        if (el["gens"].indexOf(gameInfo.gen) >= 0) {
          for (let tKey in el["chart"]) {
            GameFactory1._typeChart[tKey] = {};
            for (let j = 0; j < el["chart"][tKey].length; j++) {
              GameFactory1._typeChart[tKey][Object.keys(el["chart"])[j]] = el["chart"][tKey][j];
            }
          }
        }
      });
    }
    return GameFactory1._typeChart;
  }

  protected getMoves(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Move; } {
    let types = this.getTypes(gameInfo);
    if (!GameFactory1._moves) {
      GameFactory1._moves = {};
      for (let key in _moves) {
        if (key !== "info") {
          let move = _moves[key];
          let type = types[move[3]];
          let physical = type.isPhysical;
          GameFactory1._moves[key] = new Model1.Move1(key, move[0], move[1], move[2], type, move[4], move[5], physical, move[6]);
        }
      }
    }
    return GameFactory1._moves;
  }

  protected getPokemon(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Pokemon; } {
    if (!GameFactory1._pokemonPerGame) {
      GameFactory1._pokemonPerGame = {};
    }
    let types = this.getTypes(gameInfo);
    switch (gameInfo.key) {
      case "r":
      case "b":
        if (!GameFactory1._pokemonPerGame["rb"]) {
          let pokemonMap: { [key: string]: Model1.Pokemon1 } = {};
          for (let id = 1; id < _pokemon.length; id++) {
            let p = _pokemon[id];
            let pokemon = new Model1.Pokemon1(<string>p[0], id, types[(<string>p[1]).toUpperCase()], types[(<string>p[2]).toUpperCase()], <number>p[3], Model1.ExperienceGroups1[<string>p[4]], <number>p[5], <number>p[6], <number>p[7], <number>p[8], <number>p[9]);
            pokemonMap[pokemon.key] = pokemon;
          }
          for (let p in _movesLearnedRB) {
            let pokemon = pokemonMap[p.toUpperCase()];
            if (pokemon) {
              _movesLearnedRB[p].default.forEach((m: string) => pokemon.addLevelupMove(0, m));
              _movesLearnedRB[p].level.forEach((lm: string) => {
                let [l, m] = lm.split("#");
                pokemon.addLevelupMove(parseInt(l), m);
              });
              _movesLearnedRB[p].tm.forEach((m: string) => pokemon.addTmMove(m));
            }
          }
          for (let p in _evolutions) {
            let pokemon = pokemonMap[p.toUpperCase()];
            for (let e in _evolutions[p]) {
              let evolution = pokemonMap[e.toUpperCase()];
              let keyType = Model.EvolutionKey.Type[<string> _evolutions[p][e].type];
              pokemon.addEvolution(new Model.EvolutionKey(keyType, _evolutions[p][e].value), evolution);
            }
          }
          GameFactory1._pokemonPerGame["rb"] = pokemonMap;
        }
        return GameFactory1._pokemonPerGame["rb"];
      case "y":
        if (!GameFactory1._pokemonPerGame["y"]) {
          let pokemonMap: { [key: string]: Model1.Pokemon1 } = {};
          for (let id = 1; id < _pokemon.length; id++) {
            let p = _pokemon[id];
            let pokemon = new Model1.Pokemon1(<string>p[0], id, types[(<string>p[1]).toUpperCase()], types[(<string>p[2]).toUpperCase()], <number>p[3], Model1.ExperienceGroups1[<string>p[4]], <number>p[5], <number>p[6], <number>p[7], <number>p[8], <number>p[9]);
            pokemonMap[pokemon.key] = pokemon;
          }
          for (let p in _movesLearnedY) {
            let pokemon = pokemonMap[p.toUpperCase()];
            if (pokemon) {
              _movesLearnedY[p].default.forEach((m: string) => pokemon.addLevelupMove(0, m));
              _movesLearnedY[p].level.forEach((lm: string) => {
                let [l, m] = lm.split("#");
                pokemon.addLevelupMove(parseInt(l), m);
              });
              _movesLearnedY[p].tm.forEach((m: string) => pokemon.addTmMove(m));
            }
          }
          for (let p in _evolutions) {
            let pokemon = pokemonMap[p.toUpperCase()];
            for (let e in _evolutions[p]) {
              let evolution = pokemonMap[e.toUpperCase()];
              let keyType = Model.EvolutionKey.Type[<string> _evolutions[p][e].type];
              pokemon.addEvolution(new Model.EvolutionKey(keyType, _evolutions[p][e].value), evolution);
            }
          }
          GameFactory1._pokemonPerGame["y"] = pokemonMap;
        }
        return GameFactory1._pokemonPerGame["y"];
      default:
        return {};
    }
  }

  protected getTrainers(gameInfo: Model.GameInfo): { [key: string]: ModelAbstract.Trainer; } {
    if (!GameFactory1._trainersPerGame) {
      GameFactory1._trainersPerGame = {};
    }
    let pokemon = this.getPokemon(gameInfo);
    let trainerFile;
    let key;
    switch (gameInfo.key) {
      case "r":
      case "b":
        trainerFile = _trainersRB;
        key = "rb";
        break;
        // return GameFactory1._trainersPerGame["rb"];
      case "y":
        trainerFile = _trainersY;
        key = "y";
        break;;
    }
    if (trainerFile && key) {
      if (!GameFactory1._trainersPerGame[key]) {
        let trainers = {};
        for (let loc in trainerFile) {
          for (let tClass in trainerFile[loc]) {
            trainerFile[loc][tClass].forEach(t => {
              let party = [];
              t.party.forEach((pl: string) => {
                let [p, l] = pl.split("#");
                let poke = pokemon[p.toUpperCase()];
                if (!poke) {
                  console.log(p + " not found");
                }
                party.push(new Model1.Battler1(null, poke, null, true, parseInt(l)));
              });
              if (t.moves) {
                t.moves.forEach((pimim: string) => {
                  let [pi, mi, m] = pimim.split("#");
                  party[pi].moveset[mi] = m;
                });
              }
              let trainer = new Model.Trainer(t.key, t.name, tClass, party, loc, t.alias, t.boost);
              trainers[trainer.key.toUpperCase()] = trainer;
            });
          }
        }
        GameFactory1._trainersPerGame[key] = trainers;
      }
      return GameFactory1._trainersPerGame[key];
    } else {
      return {};
    }
  }
}