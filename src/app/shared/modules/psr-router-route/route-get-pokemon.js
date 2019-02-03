'use strict';

// imports
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';

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
    obj.choices = []; // TODO, parse from this._choices (array of PokemonLevelPair -> array of {pokemon, level})
    this._choices.forEach(pl => obj.choices.push({pokemon: pl.pokemon.name, level: pl.level}));
    obj.preference = this._preference;
    return obj;
  }

  static newFromJSONObject(game, obj) {
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let choices = []; // TODO, parse from obj.choices (array of {pokemon, level} -> array of PokemonLevelPair)
    obj.choices.forEach(pl => choices.push(new game.model.PokemonLevelPair(game.findPokemonByName(pl.pokemon), pl.level)));
    let location = undefined; // TODO, parse from obj.location
    return new RouteGetPokemon(game, choices, obj.preference, info, location);
  }
}

export { RouteGetPokemon };
