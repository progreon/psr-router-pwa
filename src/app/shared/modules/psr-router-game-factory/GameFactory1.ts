import { GameFactory } from "./GameFactory";
import { Engine } from 'SharedModules/psr-router-engine/Engine';
import { Engine1 } from 'SharedModules/psr-router-engine/Engine1';

import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
import * as Model1 from 'SharedModules/psr-router-model/Model1';
import * as Util from 'SharedModules/psr-router-util';

import * as _types from 'SharedData/types.json';
import * as _items from 'SharedData/items-1.json';
import * as _moves from 'SharedData/moves-1.json';
import * as _movesLearnedRB from 'SharedData/moves-learned-rb.json';
import * as _movesLearnedY from 'SharedData/moves-learned-y.json';
import * as _pokemon from 'SharedData/pokemon-1.json';
import * as _evolutions from 'SharedData/evolutions-1.json';
import * as _trainersRB from 'SharedData/trainers/trainers-rb.json';
import * as _trainersY from 'SharedData/trainers/trainers-y.json';
import * as _trainerClasses1 from 'SharedData/trainers/classes-1.json';
import * as _locations from 'SharedData/locations/locations-1.json';
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
  private static _locationsPerGame: { [key: string]: { root: { [key: string]: Model.Location; }, all: { [key: string]: Model.Location; } } };

  constructor() {
    super();
  }

  private toKey(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
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
          key = this.toKey(key);
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
          key = this.toKey(key);
          let type = types[move[3]];
          let physical = type.isPhysical;
          GameFactory1._moves[key] = new Model1.Move1(key, move[0], move[1], move[2], type, move[4], move[5], physical, !!move[6], move[7]);
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
    let moves = this.getMoves(gameInfo);
    let items = this.getItems(gameInfo);
    switch (gameInfo.key) {
      case "r":
      case "b":
        if (!GameFactory1._pokemonPerGame["rb"]) {
          let pokemonMap: { [key: string]: Model1.Pokemon1 } = {};
          for (let id = 1; id < _pokemon.length; id++) {
            let p = _pokemon[id];
            let pokemon = new Model1.Pokemon1(<string>p[0], id, types[this.toKey(<string>p[1])], types[this.toKey(<string>p[2])], <number>p[3], Model1.ExperienceGroups1[<string>p[4]], <number>p[5], <number>p[6], <number>p[7], <number>p[8], <number>p[9]);
            pokemonMap[this.toKey(pokemon.key)] = pokemon;
          }
          for (let p in _movesLearnedRB) {
            let pokemon = pokemonMap[this.toKey(p)];
            if (pokemon) {
              _movesLearnedRB[p].default.forEach((m: string) => {
                let move = moves[this.toKey(m)];
                if (!move) {
                  console.error(`Error while parsing pokemon: could not find learned move ${m}`);
                } else {
                  pokemon.addLevelupMove(0, move);
                }
              });
              _movesLearnedRB[p].level.forEach((lm: string) => {
                let [l, m] = lm.split("#");
                let move = moves[this.toKey(m)];
                if (!move) {
                  console.error(`Error while parsing pokemon: could not find learned move ${m}`);
                } else {
                  pokemon.addLevelupMove(parseInt(l), move);
                }
              });
              _movesLearnedRB[p].tm.forEach((m: string) => pokemon.addTm(items[this.toKey(m)]));
            }
          }
          for (let p in _evolutions) {
            let pokemon = pokemonMap[this.toKey(p)];
            for (let e in _evolutions[p]) {
              let evolution = pokemonMap[this.toKey(e)];
              let keyType = Model.EvolutionKey.Type[<string>_evolutions[p][e].type];
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
            let pokemon = new Model1.Pokemon1(<string>p[0], id, types[this.toKey(<string>p[1])], types[this.toKey(<string>p[2])], <number>p[3], Model1.ExperienceGroups1[<string>p[4]], <number>p[5], <number>p[6], <number>p[7], <number>p[8], <number>p[9]);
            pokemonMap[this.toKey(pokemon.key)] = pokemon;
          }
          for (let p in _movesLearnedY) {
            let pokemon = pokemonMap[this.toKey(p)];
            if (pokemon) {
              _movesLearnedY[p].default.forEach((m: string) => {
                let move = moves[this.toKey(m)];
                if (!move) {
                  console.error(`Error while parsing pokemon: could not find learned move ${m}`);
                } else {
                  pokemon.addLevelupMove(0, move);
                }
              });
              _movesLearnedY[p].level.forEach((lm: string) => {
                let [l, m] = lm.split("#");
                let move = moves[this.toKey(m)];
                if (!move) {
                  console.error(`Error while parsing pokemon: could not find learned move ${m}`);
                } else {
                  pokemon.addLevelupMove(parseInt(l), move);
                }
              });
              _movesLearnedY[p].tm.forEach((m: string) => pokemon.addTm(items[this.toKey(m)]));
            }
          }
          for (let p in _evolutions) {
            let pokemon = pokemonMap[this.toKey(p)];
            for (let e in _evolutions[p]) {
              let evolution = pokemonMap[this.toKey(e)];
              let keyType = Model.EvolutionKey.Type[<string>_evolutions[p][e].type];
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
    let moves = this.getMoves(gameInfo);
    let pokemon = this.getPokemon(gameInfo);
    let items = this.getItems(gameInfo);
    let trainerFile;
    let key;
    switch (gameInfo.key) {
      case "r":
      case "b":
        trainerFile = _trainersRB;
        key = "rb";
        break;
      case "y":
        trainerFile = _trainersY;
        key = "y";
        break;
    }
    if (trainerFile && key) {
      if (!GameFactory1._trainersPerGame[key]) {
        let trainers = {};
        for (let loc in trainerFile) {
          for (let tClass in trainerFile[loc]) {
            trainerFile[loc][tClass].forEach(t => {
              let party: Model1.Battler1[] = [];
              t.party.forEach((pl: string) => {
                let [p, l] = pl.split("#");
                let poke = pokemon[this.toKey(p)];
                if (!poke) {
                  console.error(`pokemon ${p} not found`);
                } else {
                  party.push(new Model1.Battler1(null, poke, null, true, parseInt(l)));
                }
              });
              if (t.moves) {
                t.moves.forEach((pimim: string) => {
                  let [pi, mi, m] = pimim.split("#");
                  party[pi].moveset[mi] = new ModelAbstract.Battler.MoveSlot(moves[this.toKey(m)]);
                });
              }
              let tItems: ModelAbstract.Item[] = [];
              if (t.items && t.items.length > 0) {
                t.items.forEach(i => {
                  let item = items[this.toKey(i)];
                  if (!item) {
                    console.error(`item ${i} not found`);
                  } else {
                    tItems.push(item);
                  }
                });
              }
              let c = _trainerClasses1[tClass];
              let money = 0;
              if (!c) {
                console.error(`trainer class ${tClass} not found`);
              } else {
                money = c.money * party[party.length - 1].level;
              }
              let trainer = new Model.Trainer(t.key, t.name, tClass, money, party, loc, t.alias, tItems, t.badgeboost);
              trainers[this.toKey(trainer.key)] = trainer;
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

  protected getLocations(gameInfo: Model.GameInfo): { root: { [key: string]: Model.Location; }, all: { [key: string]: Model.Location; } } {
    // TODO: move this implementation to super class, only to inherit getEncounterAreaFile() or getEncounterAreas()?
    if (!GameFactory1._locationsPerGame) {
      GameFactory1._locationsPerGame = {};
    }
    let encounterFile: { location: string, type?: string, method?: string, rate: number, slots: string[] }[];
    switch (gameInfo.key) {
      case "r":
        encounterFile = _encountersR;
        break;
      case "b":
        encounterFile = _encountersB;
        break;
      case "y":
        encounterFile = _encountersY;
        break;
    }
    if (encounterFile) {
      if (!GameFactory1._locationsPerGame[gameInfo.key]) {
        // Parse the locations
        GameFactory1._locationsPerGame[gameInfo.key] = { root: {}, all: {} };
        let allLocations: { [key: string]: Model.Location } = {};
        _locations.forEach(loc => {
          let location = this.getLocationFromJSON(allLocations, loc);
          GameFactory1._locationsPerGame[gameInfo.key].root[this.toKey(location.name)] = location;
        });
        GameFactory1._locationsPerGame[gameInfo.key].all = allLocations;
        // Parse the encounter areas
        let pokemon = this.getPokemon(gameInfo);
        encounterFile.forEach(ea => {
          let slots: Model.EncounterArea.Slot[] = [];
          ea.slots.forEach(slot => {
            let [p, l] = slot.split("#").map(s => s.trim());
            let poke = pokemon[this.toKey(p)];
            if (!poke) {
              console.error(`Error while parsing encounter slots: pokemon "${p}" was not found`);
            } else {
              let levelRange = Util.Range.parse(l);
              if (levelRange.count == 0) {
                console.error(`Error while parsing encounter slots: range "${l}" could not be parsed`);
              } else {
                slots.push(new Model.EncounterArea.Slot(poke, levelRange));
              }
            }
          });
          let encounterArea = new Model.EncounterArea(ea.location, ea.rate, slots, ea.type, ea.method);
          let location = allLocations[this.toKey(encounterArea.location)];
          if (!location) {
            console.error(`Error while parsing encounter slots: location "${encounterArea.location}" could not be found`);
          } else {
            location.addEncounterArea(encounterArea);
          }
        });
      }
      return GameFactory1._locationsPerGame[gameInfo.key];
    } else {
      return { root: {}, all: {} };
    }
  }

  private getLocationFromJSON(allLocations: { [key: string]: Model.Location }, locationJSON: { location: string, subLocations?: any[] }): Model.Location {
    let subLocations: Model.Location[];
    if (locationJSON.subLocations) {
      subLocations = [];
      locationJSON.subLocations.forEach(subLoc => subLocations.push(this.getLocationFromJSON(allLocations, subLoc)));
    }
    let location = new Model.Location(locationJSON.location, subLocations);
    if (allLocations[this.toKey(location.name)]) {
      console.warn(`Location "${location.name}" was already added, skipping...`);
    } else {
      allLocations[this.toKey(location.name)] = location;
    }
    return location;
  }
}