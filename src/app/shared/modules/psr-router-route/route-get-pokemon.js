'use strict';

// imports
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import * as Model from 'SharedModules/psr-router-model/Model';

/**
 * A class representing a route-entry that gets you a pokemon out of a list of possible pokemon.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteEntry
 */
class RouteGetPokemon extends RouteEntry {
  /**
   *
   * @param {Game}                game              The Game object this route entry uses.
   * @param {PokemonLevelPair[]}  choices           The different battlers to choose from.
   * @param {number}              [preference=0]    The preferred choise.
   * @param {RouteEntryInfo}      [info]            The info for this entry.
   * @param {Location}            [location]        The location in the game where this entry occurs.
   */
  constructor(game, choices, preference=0, info=undefined, location=undefined) {
    super(game, info, location);
    this._choices = choices;
    this._preference = preference;
  }

  static getEntryType() {
    return "GetP";
  }

  getJSONObject() {
    let obj = super.getJSONObject();
    obj.choices = [];
    this._choices.forEach(pl => obj.choices.push({pokemon: pl.pokemon.name, level: pl.level}));
    obj.preference = this._preference;
    return obj;
  }

  static newFromJSONObject(game, obj) {
    let messages = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let choices = [];
    obj.choices.forEach(pl => {
      let pokemon = game.findPokemonByName(pl.pokemon);
      if (!pokemon) {
        pokemon = game.getDummyPokemon(pl.pokemon);
        if (!game.info.unsupported) {
          messages.push(new RouterMessage(`Pokemon "${pl.pokemon}" not found!`, RouterMessageType.ERROR));
        }
      }
      choices.push(new Model.PokemonLevelPair(pokemon, pl.level))
    });
    let location = undefined; // TODO, parse from obj.location
    let entry = new RouteGetPokemon(game, choices, obj.preference, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}

export { RouteGetPokemon };
