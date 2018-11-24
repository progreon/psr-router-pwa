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
   * @param {Game}            game              The Game object this route entry uses.
   * @param {string}          entryString       TEMP
   * @param {RouteEntryInfo}  [info]            The info for this entry.
   * @param {Battler[]}       [choices=[]]      The different battlers to choose from.
   * @param {number}          [preference=0]    The preferred choise.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   * @todo choices, preference, ...
   */
  constructor(game, entryString, info=undefined, choices=[], preference=0, location=undefined) {
    super(game, info, location);
    this.entryString = entryString;
    this._choices = choices;
    this._preference = preference;
  }

  static getEntryType() {
    return "GetP";
  }

  getJSONObject() {
    var obj = super.getJSONObject();
    obj.entryString = this.entryString;
    obj.choices = []; // TODO, parse from this._choices;
    obj.preference = this._preference;
    return obj;
  }

  static newFromJSONObject(game, obj) {
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    var choices = []; // TODO, parse from obj.choices
    var location = undefined; // TODO, parse from obj.location
    return new RouteGetPokemon(game, obj.entryString, info, choices, obj.preference, location);
  }
}

export { RouteGetPokemon };
